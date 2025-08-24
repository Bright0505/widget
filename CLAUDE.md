# Claude Code 專案配置

## 自動化設定

本專案已設定 Claude Code hooks 實現以下自動化功能：

### SessionStart Hook
- **觸發時機**：每次開啟 Claude Code 會話時
- **功能**：自動讀取並載入 README.md 內容到對話上下文
- **好處**：Claude 會自動了解專案現狀，無需手動說明

### UserPromptSubmit Hook  
- **觸發時機**：當提示詞包含 "commit"、"提交"、"git commit" 關鍵字時
- **功能**：提醒更新 README.md 中的專案進度
- **好處**：確保專案文檔與實際功能保持同步

## 配置檔案說明

### `.claude/settings.json`
專案的 Claude Code 設定檔，包含 hooks 配置。

## 使用方式

1. **自動讀取專案資訊**：開啟 Claude Code 時會自動載入 README.md
2. **提交提醒**：當你說要 commit 或提交時，會提醒你更新文檔
3. **手動載入**：如果需要重新載入，可以說「請讀取 README.md」

這樣就不需要每次都手動說明專案內容了！