# ⚡ Notion 同步 - 快速開始指南

只需 5 分鐘，設定你的 Notion 自動同步！

---

## 🎯 5 分鐘快速設定

### 步驟 1️⃣：取得 Notion API Key（2 分鐘）

```
1. 訪問 https://www.notion.so/my-integrations
2. 點擊 "+ New integration"
3. 名稱填 "Type-Moon Holograph Sync"
4. 點擊 Submit
5. 複製 "Internal Integration Token" → 保存到記事本
```

### 步驟 2️⃣：授予 Database 權限（1 分鐘）

```
1. 在 Notion 打開你的 Database（或新建一個）
2. 右上角 ⋯ → Connections
3. 搜尋 "Type-Moon Holograph Sync"
4. 點擊 Connect
```

### 步驟 3️⃣：取得 Database ID（1 分鐘）

```
在 Notion 中打開 Database 的 URL：
https://www.notion.so/abc123def456abc?v=xyz

複製這部分（32 字符，無連字符）：
abc123def456abc
```

### 步驟 4️⃣：填入配置（1 分鐘）

編輯 `.env.notion` 檔案：

```bash
# 打開文件
code .env.notion

# 填入你的 API Key（從步驟 1 複製）
NOTION_API_KEY=secret_your_token_here

# 填入你的 Database ID（從步驟 3 複製）
NOTION_DATABASE_ID=abc123def456abc

# 保存並關閉
```

### 步驟 5️⃣：驗證配置（30秒）

```bash
npm run notion:verify
```

看到這樣的輸出就成功了：
```
✅ .env.notion 文件存在
✅ NOTION_API_KEY 已配置
✅ NOTION_DATABASE_ID 已配置
✅ 日誌文件存在
✅ SYNC_SCHEDULE 格式正確
✅ 必要的 npm 依賴已安裝
✅ npm 腳本已配置

🎉 所有配置檢查通過！
```

---

## 🚀 立即開始同步

### 手動同步一次

```bash
npm run notion:sync
```

檢查 Notion Database，你應該會看到一個新頁面！

### 啟動自動同步（推薦）

```bash
npm run notion:schedule
```

現在每週一早上 9 點會自動同步。

---

## 📝 日常使用

### 更新進度日誌

編輯 `PROJECT_PROGRESS_LOG.md`（你的進度記錄）

```bash
code PROJECT_PROGRESS_LOG.md
```

### 手動同步更新

```bash
npm run notion:sync
```

### 修改自動同步時間

編輯 `.env.notion`：

```env
# 改為每週一下午 3 點
SYNC_SCHEDULE=0 15 * * 1

# 或每天早上 9 點
SYNC_SCHEDULE=0 9 * * *
```

重新啟動定時任務：
```bash
# 按 Ctrl+C 停止舊進程
# 再執行
npm run notion:schedule
```

---

## ⚙️ 進階配置

### Cron 時間表常見例子

| 用途 | Cron 表達式 |
|------|-----------|
| 每天早上 9 點 | `0 9 * * *` |
| 每週一早上 9 點 | `0 9 * * 1` |
| 每月 1 號 | `0 9 1 * *` |
| 每 6 小時 | `0 */6 * * *` |
| 工作日每天 9 點 | `0 9 * * 1-5` |

更多例子：https://crontab.guru/

### 在 Git commit 時自動同步（可選）

編輯 `.git/hooks/post-commit`：

```bash
#!/bin/bash
npm run notion:sync > /dev/null 2>&1 &
```

---

## ❓ 遇到問題？

### 驗證失敗

```bash
npm run notion:verify
```

按照提示修正。

### 常見錯誤

| 錯誤 | 原因 | 解決 |
|------|------|------|
| `unauthorized` | API Key 不對 | 重新複製 token |
| `invalid_request_url` | Database ID 不對 | 檢查 URL 中的 ID |
| 找不到 `.env.notion` | 配置文件缺失 | 已為你創建，編輯它 |

### 詳細故障排除

查看完整指南：

```bash
cat NOTION_SYNC_GUIDE.md
```

---

## 💡 提示

✅ **將 `.env.notion` 保密**
- 不要提交到 Git
- 不要分享你的 API Key

✅ **定期更新日誌**
- 至少每週更新一次
- 在 Notion 中保持紀錄

✅ **Notion 中的更改不會同步回本地**
- 本地日誌是單向同步源
- 手動編輯 Notion 內容是獨立的

---

## 🎉 完成！

現在你的項目進度會自動同步到 Notion！

接下來：
1. 檢查 Notion Database 中的新頁面
2. 定期編輯 `PROJECT_PROGRESS_LOG.md` 更新進度
3. 享受自動化的便利

---

**需要幫助？** 查看 `NOTION_SYNC_GUIDE.md` 獲取完整文檔
