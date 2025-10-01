#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

// 環境變數
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ISSUE_NUMBER = process.env.ISSUE_NUMBER;
const COMMENT_BODY = process.env.COMMENT_BODY;
const REPO_FULL_NAME = process.env.REPO_FULL_NAME;

// 解析 @claude 指令
function parseClaudeCommand(text) {
  // 提取 @claude 後面的內容
  const match = text.match(/@claude\s+(.+)/is);
  if (!match) {
    return null;
  }
  return match[1].trim();
}

// 調用 Claude API
async function callClaude(prompt, systemContext) {
  const data = JSON.stringify({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 4096,
    system: systemContext,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.content && response.content[0]) {
            resolve(response.content[0].text);
          } else {
            reject(new Error('Unexpected API response format'));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// 獲取專案上下文（README 等）
async function getProjectContext() {
  try {
    const readme = fs.readFileSync('README.md', 'utf8');
    return `專案資訊：\n${readme}\n\n`;
  } catch (err) {
    return '';
  }
}

// 主程式
async function main() {
  try {
    // 解析指令
    const command = parseClaudeCommand(COMMENT_BODY);
    if (!command) {
      console.log('No valid @claude command found');
      return;
    }

    console.log(`Processing command: ${command}`);

    // 準備上下文
    const projectContext = await getProjectContext();
    const systemContext = `你是一個 GitHub Issues 助手，正在協助處理 ${REPO_FULL_NAME} 專案的 Issue #${ISSUE_NUMBER}。

${projectContext}

請根據用戶的需求提供幫助。如果需要：
- 分析程式碼：搜尋相關檔案並分析
- 提供建議：給出具體可行的解決方案
- 回答問題：清晰簡潔地回答
- 生成程式碼：提供完整可用的程式碼範例

請用繁體中文回應，並使用 Markdown 格式。`;

    // 調用 Claude
    console.log('Calling Claude API...');
    const response = await callClaude(command, systemContext);

    // 格式化回應
    const formattedResponse = `🤖 **Claude Assistant**

${response}

---
*回應 Issue #${ISSUE_NUMBER} | 由 Claude API 自動生成*`;

    // 儲存回應
    fs.writeFileSync('/tmp/claude-response.txt', formattedResponse);
    console.log('Response saved to /tmp/claude-response.txt');

  } catch (error) {
    console.error('Error:', error);
    const errorResponse = `🤖 **Claude Assistant**

❌ 處理請求時發生錯誤：${error.message}

請確認：
1. ANTHROPIC_API_KEY 已正確設定
2. API 配額充足
3. 指令格式正確

---
*Issue #${ISSUE_NUMBER} | Error*`;

    fs.writeFileSync('/tmp/claude-response.txt', errorResponse);
    process.exit(1);
  }
}

main();