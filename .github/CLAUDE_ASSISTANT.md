# 🤖 Claude Assistant 整合說明

在 GitHub Issues 中 @claude 即可呼叫 AI 助手協助處理問題！

## ✨ 功能特色

- **自動回應**：在 Issue 中提到 `@claude` 就會自動觸發
- **智能分析**：自動讀取專案 README 了解專案背景
- **即時回覆**：直接在 Issue 中回覆分析結果
- **Slack 通知**：可選整合 Slack 推送通知

## 🚀 使用方式

### 基本用法

在任何 Issue 或 Issue Comment 中使用 `@claude` 開頭：

```
@claude 請幫我分析這個問題
```

```
@claude 這個功能要怎麼實作？請給我建議
```

```
@claude 幫我找出可能的 bug 原因
```

### 使用範例

#### 1️⃣ 詢問實作建議
```
@claude 我想要新增一個匯率計算器，應該如何設計？需要注意什麼？
```

#### 2️⃣ 程式碼分析
```
@claude 目前的 price-calculator.html 有什麼可以優化的地方？
```

#### 3️⃣ Bug 診斷
```
@claude 手機版的排版在 iPhone SE 上會跑版，可能是什麼原因？
```

#### 4️⃣ 功能建議
```
@claude 基於目前的工具集，你認為還可以加入什麼實用的計算器？
```

## ⚙️ 設定步驟

### 1. 設定 API Key

在 GitHub Repository Settings → Secrets and variables → Actions 中新增：

- **`ANTHROPIC_API_KEY`** (必須)
  - 取得方式：https://console.anthropic.com/
  - 需要有 Claude API 使用權限

- **`SLACK_WEBHOOK_URL`** (選用)
  - 如果想要推送通知到 Slack
  - 建立方式：https://api.slack.com/messaging/webhooks

### 2. 權限設定

確認 GitHub Actions 有以下權限（已在 workflow 中設定）：
- `issues: write` - 回覆 Issue
- `contents: read` - 讀取專案檔案
- `pull-requests: write` - 如果未來要擴充 PR 功能

### 3. 啟用 Workflow

Workflow 會在以下情況自動觸發：
- ✅ Issue 被創建且內容包含 `@claude`
- ✅ Issue 被編輯且內容包含 `@claude`
- ✅ Issue Comment 被創建且包含 `@claude`

## 📋 工作流程

```
用戶在 Issue 中寫 @claude 指令
         ↓
GitHub Actions 自動觸發
         ↓
讀取專案 README 作為上下文
         ↓
將指令發送給 Claude API
         ↓
Claude 分析並生成回應
         ↓
自動回覆到 Issue 中
         ↓
(可選) 推送通知到 Slack
```

## 🎯 適用場景

### ✅ 適合的使用情境
- 尋求實作建議和最佳實踐
- 分析程式碼品質和優化方向
- 詢問功能設計和架構建議
- Bug 診斷和問題排查
- 產品功能討論和規劃

### ⚠️ 限制說明
- Claude 只能讀取 README.md 和你在指令中提供的資訊
- 無法直接修改程式碼（會提供建議和範例）
- 無法執行程式或測試
- 回應長度受 API token 限制（約 4000 tokens）

## 🔧 進階設定

### 自訂系統提示詞

編輯 `.github/scripts/claude-processor.js` 中的 `systemContext` 變數，可以調整 Claude 的回應風格和行為。

### 擴充功能

可以修改 `claude-processor.js` 來新增功能：
- 讀取更多專案檔案作為上下文
- 整合其他工具（如程式碼檢查工具）
- 自動生成 PR（需要額外邏輯）
- 連接資料庫或外部服務

### Slack 通知格式

Workflow 中的 Slack 通知會顯示：
- Issue 編號
- Claude 的完整回應
- 可以在 workflow 中自訂格式

## 💡 使用技巧

### 1. 提供清晰的上下文
```
@claude 我在實作時間計算器時遇到問題，時區轉換的結果不正確。
目前的邏輯是...（說明目前做法）
期望結果是...（說明預期行為）
```

### 2. 分段詢問複雜問題
不要一次問太多，可以分成多個回合：
```
@claude 請先幫我分析目前調酒計算器的架構
```
（收到回應後）
```
@claude 基於剛才的分析，我想加入酒精濃度記憶功能，你建議怎麼實作？
```

### 3. 要求具體的輸出格式
```
@claude 請列出 3 個優化 price-calculator.html 效能的具體方法，
每個方法請包含：問題描述、解決方案、程式碼範例
```

## 🐛 疑難排解

### Claude 沒有回應？

檢查：
1. Actions 頁面是否有執行記錄
2. `ANTHROPIC_API_KEY` 是否正確設定
3. API 配額是否用完
4. 指令是否包含 `@claude`（區分大小寫）

### 回應時間較長？

- Claude API 回應通常需要 5-30 秒
- GitHub Actions 啟動需要額外時間
- 複雜查詢可能需要更久

### Slack 沒收到通知？

確認：
1. `SLACK_WEBHOOK_URL` 是否設定
2. Webhook URL 是否有效
3. 檢查 Actions log 是否有錯誤訊息

## 📞 需要協助？

- 查看 [GitHub Actions 執行記錄](../../actions)
- 提出新的 Issue 詢問問題
- 或是... `@claude 我遇到問題了！` 😄

---

**Powered by Claude API & GitHub Actions** 🚀