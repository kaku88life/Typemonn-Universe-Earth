# 🌙 Notion 自動同步指南

Type-Moon Holograph 項目進度自動同步到 Notion Database

---

## 📋 目錄
1. [前置準備](#前置準備)
2. [安裝步驟](#安裝步驟)
3. [配置](#配置)
4. [使用方式](#使用方式)
5. [Cron 表達式](#cron-表達式)
6. [常見問題](#常見問題)

---

## 前置準備

### ✅ 需要的東西

1. **Notion 帳戶**（免費版本可用）
2. **Notion Integration Token**
3. **Notion Database ID**

### 🔧 取得 Notion API Key

#### 步驟 1：建立 Notion Integration

1. 訪問 https://www.notion.so/my-integrations
2. 點擊 **+ New integration**
3. 填入：
   - **Name**: `Type-Moon Holograph Sync`
   - **Associated workspace**: 選擇你的工作區
4. 點擊 **Submit** 建立
5. 複製 **Internal Integration Token**（這就是你的 API Key）

#### 步驟 2：為 Database 授予權限

1. 在 Notion 中開啟你想用的 Database（或建立新的）
2. 點擊右上角 **⋯** → **Connections**
3. 搜尋 `Type-Moon Holograph Sync`（你剛建立的 Integration）
4. 點擊 **Connect**

### 📍 取得 Database ID

#### 方法 1：從 URL 複製（最簡單）

1. 在 Notion 中打開你的 Database
2. 查看瀏覽器 URL：
   ```
   https://www.notion.so/abc123def456abc?v=xyz789
   ```
3. Database ID 是 `/` 和 `?` 之間的部分：
   ```
   abc123def456abc
   ```

#### 方法 2：使用 Notion 提供的工具

- 訪問 https://developers.notion.com/reference
- 登入並導航到你的 Database
- ID 會顯示在頁面上

---

## 安裝步驟

### 1️⃣ 安裝依賴

```bash
npm install
```

這會自動安裝以下新包：
- `@notionhq/client`: Notion 官方 SDK
- `node-cron`: 定時任務
- `dotenv`: 環境變量管理

### 2️⃣ 配置環境變量

打開 `.env.notion` 檔案（已為你建立），填入：

```env
NOTION_API_KEY=secret_abc123...
NOTION_DATABASE_ID=abc123def456abc
PROJECT_LOG_FILE=./PROJECT_PROGRESS_LOG.md
SYNC_SCHEDULE=0 9 * * 1
```

**⚠️ 重要安全提示：**
- 不要將 `.env.notion` 提交到 Git
- 已在 `.gitignore` 中添加（請確認）

### 3️⃣ 驗證設定

```bash
npm run notion:sync
```

如果配置正確，你會看到：
```
🚀 Type-Moon Holograph - Notion 同步啟動

📂 讀取文件: ./PROJECT_PROGRESS_LOG.md
📋 項目標題: 🌙 Type-Moon Holograph 項目進展日誌
📅 日期: 2026年2月1日
📊 章節數: 5

🔄 正在同步到 Notion...
✅ 同步成功！共添加 45 個內容塊
```

---

## 配置

### `.env.notion` 選項詳解

| 變量 | 說明 | 範例 |
|------|------|------|
| `NOTION_API_KEY` | Notion Integration Token（必需） | `secret_abc...` |
| `NOTION_DATABASE_ID` | 你的 Database ID（必需） | `abc123def456` |
| `PROJECT_LOG_FILE` | 日誌文件路徑 | `./PROJECT_PROGRESS_LOG.md` |
| `SYNC_SCHEDULE` | Cron 表達式（見下文） | `0 9 * * 1` |

### Notion Database 結構

推薦在 Notion 中建立以下 Database 屬性：

| 屬性名 | 類型 | 說明 |
|--------|------|------|
| **Title** | Text | 日誌標題 |
| **Date** | Date | 日期 |
| **Status** | Select | 項目狀態（進行中、已完成、暫停） |
| **Tags** | Multi-select | 標籤（可選） |

### 完整 Database 設定步驟

1. 在 Notion 建立新 Database（表格視圖）
2. 修改第一列名稱為 `Title` （若還未命名）
3. 添加以下列：
   - **Date** (Date type)
   - **Status** (Select type) → 選項：進行中、已完成、暫停
   - **Tags** (Multi-select type) → 選項：功能、修復、文檔、設計等

---

## 使用方式

### 🚀 手動同步一次

```bash
npm run notion:sync
```

**用途：**
- 立即上傳最新日誌
- 測試配置是否正確
- 臨時更新（無需等待定時任務）

**輸出示例：**
```
📂 讀取文件: ./PROJECT_PROGRESS_LOG.md
🔄 正在同步到 Notion...
✅ 同步成功！共添加 42 個內容塊
```

### ⏰ 啟動定時任務

```bash
npm run notion:schedule
```

**用途：**
- 根據設定的時間表自動同步
- 保持 Notion 與本地日誌同步
- 後台持續執行

**輸出示例：**
```
⏰ Notion 同步定時任務已啟動

📅 同步時間表: 0 9 * * 1
   (輸入 Ctrl+C 停止)

首次立即執行同步...
[2026/2/1 9:00:00] 執行定時同步...
```

**停止任務：** 按 `Ctrl+C`

### 🔄 在 Git Hook 中自動同步（可選進階用法）

在 `.git/hooks/post-commit` 中添加：

```bash
#!/bin/bash
npm run notion:sync > /dev/null 2>&1 &
```

這樣每次 commit 後會自動同步（後台執行，不阻塞 commit）。

---

## Cron 表達式

Cron 格式：`秒 分 時 日 月 周`

### 常用範例

```cron
# 每天早上 9 點
0 9 * * *

# 每週一早上 9 點 ⭐ 推薦用於週報
0 9 * * 1

# 每月 1 號早上 9 點（月報）
0 9 1 * *

# 每天早上 9 點和下午 3 點
0 9,15 * * *

# 工作日每天 9 點
0 9 * * 1-5

# 每 6 小時
0 */6 * * *

# 每小時
0 * * * *
```

### Cron 表達式生成工具
- https://crontab.guru/
- https://crontab.guru/examples.html

---

## 常見問題

### ❌ 錯誤：`NOTION_API_KEY 或 NOTION_DATABASE_ID 未定義`

**原因：** `.env.notion` 文件缺少必要的值

**解決：**
```bash
# 確認文件存在
cat .env.notion

# 確認有這兩行（不能是空的）
NOTION_API_KEY=your_api_key_here
NOTION_DATABASE_ID=your_database_id_here
```

### ❌ 錯誤：`unauthorized`

**原因：** API Key 過期或不正確

**解決：**
1. 訪問 https://www.notion.so/my-integrations
2. 刪除舊的 Integration，建立新的
3. 複製新的 Token 更新 `.env.notion`

### ❌ 錯誤：`invalid_request_url`

**原因：** Database ID 不正確

**解決：**
1. 在 Notion 中打開 Database
2. 檢查 URL：`https://www.notion.so/[DATABASE_ID]?v=...`
3. 確認 ID 沒有多餘字符或空格

### ❌ 錯誤：`PROJECT_PROGRESS_LOG.md 不存在`

**原因：** 檔案路徑錯誤或檔案被刪除

**解決：**
```bash
# 檢查檔案是否存在
ls -la PROJECT_PROGRESS_LOG.md

# 或更新 .env.notion 中的路徑
PROJECT_LOG_FILE=./your/actual/path.md
```

### ❓ 定時任務沒有執行

**原因：**
- 進程被中斷
- 時間表設定錯誤
- 終端窗口關閉

**解決：**
```bash
# 重新啟動
npm run notion:schedule

# 驗證時間表格式
# 訪問 https://crontab.guru 確認

# 增加日誌以調試
NODE_DEBUG=cron npm run notion:schedule
```

### ❓ 如何修改同步時間？

編輯 `.env.notion`：

```env
# 改為每週一上午 10 點
SYNC_SCHEDULE=0 10 * * 1

# 改為每天晚上 6 點
SYNC_SCHEDULE=0 18 * * *
```

然後重新啟動定時任務：
```bash
# 先停止 (Ctrl+C)
# 再啟動
npm run notion:schedule
```

### ❓ 如何修改同步的日誌檔案？

編輯 `.env.notion`：

```env
# 同步另一個文件
PROJECT_LOG_FILE=./docs/weekly-report.md
```

然後重新執行：
```bash
npm run notion:sync
```

---

## 🎯 最佳實踐

### ✅ 推薦配置

```env
# 每週一早上 9 點（週報）
SYNC_SCHEDULE=0 9 * * 1

# 或如果你每日更新：
# 每天早上 9 點
SYNC_SCHEDULE=0 9 * * *
```

### ✅ 日誌編寫建議

- **定期更新** `PROJECT_PROGRESS_LOG.md`（至少每週一次）
- **保持結構清晰**（用 Markdown 標題和列表）
- **添加日期和狀態**（便於追蹤進度）

### ✅ Notion Database 管理

1. 定期檢查 Notion 中同步的內容
2. 可以手動編輯 Notion 中的頁面（與本地日誌獨立）
3. 建立「進度概覽」視圖（按日期或狀態篩選）

### ✅ 安全性

- 將 `.env.notion` 添加到 `.gitignore`（已預設）
- 定期更換 API Key
- 僅在信任的機器上運行同步腳本
- 不要在公開倉庫中洩露 API Key

---

## 📞 支援

如有問題：

1. 檢查上方 [常見問題](#常見問題) 部分
2. 查看 Notion API 文檔：https://developers.notion.com/
3. 驗證 `.env.notion` 配置
4. 確認 Notion Database 有正確的權限

---

## 🔗 相關資源

- [Notion API 文檔](https://developers.notion.com/)
- [Notion Integration Setup](https://www.notion.so/my-integrations)
- [Node-cron 文檔](https://www.npmjs.com/package/node-cron)
- [Crontab 表達式參考](https://crontab.guru/)

---

**最後更新：** 2026年2月1日
**狀態：** 🟢 可用
