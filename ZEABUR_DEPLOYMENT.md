# 🚀 Zeabur 部署指南

Type-Moon Holograph 項目部署到 Zeabur 的完整步驟

---

## 📋 目錄

1. [前置條件](#前置條件)
2. [Zeabur 帳戶設定](#zeabur-帳戶設定)
3. [GitHub 連接](#github-連接)
4. [項目部署](#項目部署)
5. [環境變量配置](#環境變量配置)
6. [PostgreSQL 設定](#postgresql-設定)
7. [自動部署](#自動部署)
8. [驗證和監控](#驗證和監控)
9. [常見問題](#常見問題)

---

## 前置條件

✅ **必要條件**
- GitHub 帳戶（已有：kaku88life）
- 代碼已推送到 GitHub（已完成 ✓）
- Zeabur 帳戶（需建立）

✅ **項目狀態**
- ✓ Next.js 16.1 配置完整
- ✓ package.json 腳本齊全
- ✓ .env* 文件已隱藏
- ✓ node_modules 已忽略
- ✓ 所有依賴已明確列出

---

## Zeabur 帳戶設定

### 步驟 1️⃣：建立 Zeabur 帳戶

1. 訪問 https://zeabur.com
2. 點擊 **Sign Up**
3. 選擇 **GitHub** 登入（推薦）
4. 授權 Zeabur 訪問你的 GitHub 帳戶
5. 完成註冊

### 步驟 2️⃣：驗證電子郵件

- 檢查郵箱，點擊驗證鏈接
- 帳戶啟用完成 ✓

---

## GitHub 連接

### 步驟 3️⃣：在 Zeabur 中連接 GitHub

1. 登入 Zeabur 控制面板
2. 點擊 **+ New Project**
3. 選擇 **GitHub**
4. 搜尋倉庫：`Typemonn-Universe-Earth`
5. 點擊選擇
6. 確認連接

---

## 項目部署

### 步驟 4️⃣：新增服務

1. 點擊 **+ Add Service**
2. 選擇 **GitHub**
3. 選擇你的倉庫：`kaku88life/Typemonn-Universe-Earth`
4. 選擇分支：`main`
5. 選擇根目錄：`./` （或留空）
6. 點擊 **Deploy**

### 步驟 5️⃣：等待初始化

- Zeabur 會自動檢測 Next.js 項目
- 顯示 "Configuring..." 信息
- 自動設置構建命令：`npm run build`
- 自動設置啟動命令：`npm start`

---

## 環境變量配置

### 步驟 6️⃣：添加環境變量

#### **必要環境變量**

1. 進入服務設置 → **Variables**
2. 添加以下變量：

```env
# Notion 配置
NOTION_API_KEY=your_notion_api_key_here    # 從 .env.notion 複製
NOTION_DATABASE_ID=6e7cdcd1cdf14e8bb198d8b324fb2e34

# 項目配置
PROJECT_LOG_FILE=./PROJECT_PROGRESS_LOG.md
SYNC_SCHEDULE=0 23 * * *

# Node.js 環境
NODE_ENV=production
```

#### **可選環境變量**

```env
# 數據庫（Zeabur PostgreSQL）
DATABASE_URL=postgresql://...  # 稍後添加

# 日誌級別
LOG_LEVEL=info
```

### 步驟 7️⃣：保存變量

- 點擊 **Save**
- 自動重新部署（如果已部署）

---

## PostgreSQL 設定

### 步驟 8️⃣：添加 PostgreSQL 服務

如果使用 Prisma ORM：

1. 回到項目主頁
2. 點擊 **+ Add Service**
3. 選擇 **Marketplace**
4. 搜尋 **PostgreSQL**
5. 點擊 **Add**

### 步驟 9️⃣：配置 PostgreSQL

1. 選擇 **版本**：14 或更新
2. 選擇 **儲存空間**：5GB（免費）
3. 點擊 **Deploy**

### 步驟 🔟：連接 PostgreSQL

1. PostgreSQL 部署完成後
2. 複製 **Connection String**
3. 添加到環境變量：`DATABASE_URL`
4. Zeabur 會自動將其注入到 Next.js 服務

---

## 自動部署

### 自動部署設定

#### **GitHub 自動觸發**

Zeabur 會自動監聽 GitHub：

```
每當你執行：
  git push origin main
  ↓
Zeabur 會自動：
  1. 檢測到新 commit
  2. 拉取最新代碼
  3. 執行 npm run build
  4. 部署新版本
  5. 更新應用（0 宕機部署）
```

#### **部署時間**

- 首次部署：5-10 分鐘
- 後續更新：2-3 分鐘

#### **部署狀態**

在 Zeabur 控制面板查看：
- 構建日誌
- 部署進度
- 錯誤提示

---

## 驗證和監控

### 步驟 1️⃣1️⃣：訪問應用

1. 部署完成後，Zeabur 會分配域名
2. 格式：`https://your-app-name.zeabur.app`
3. 點擊域名訪問應用
4. 應該看到 Type-Moon Holograph 界面

### 步驟 1️⃣2️⃣：檢查應用日誌

1. 進入服務 → **Logs**
2. 查看實時日誌
3. 確認沒有錯誤

### 步驟 1️⃣3️⃣：測試 Notion 同步

1. 訪問應用
2. 檢查 `/api` 端點（如果有）
3. 驗證 Notion 連接

---

## 常見問題

### ❓ 構建失敗

**錯誤信息**：`npm run build` 失敗

**原因**：
- 依賴缺失
- TypeScript 錯誤
- 環境變量缺失

**解決**：
1. 檢查構建日誌
2. 本地運行 `npm run build`
3. 修複錯誤後 git push

### ❓ 應用無法啟動

**錯誤信息**：應用崩潰或無法訪問

**原因**：
- PORT 環境變量未設置
- 依賴加載失敗

**解決**：
1. 檢查日誌
2. 驗證環境變量
3. 重新部署

### ❓ 環境變量未生效

**問題**：代碼中無法讀取環境變量

**解決**：
```javascript
// ✅ 正確（服務器端）
const apiKey = process.env.NOTION_API_KEY

// ❌ 錯誤（需要 NEXT_PUBLIC_ 前綴才能用於客戶端）
const apiKey = process.env.NEXT_PUBLIC_API_KEY
```

### ❓ PostgreSQL 連接失敗

**問題**：`DATABASE_URL` 無效

**解決**：
1. 在 Zeabur 查看 PostgreSQL 日誌
2. 確認 DATABASE_URL 完整複製
3. 重新啟動服務

### ❓ 域名配置

**設置自定義域名**：
1. 進入服務 → **Domains**
2. 點擊 **+ Add Custom Domain**
3. 輸入你的域名（例：app.example.com）
4. 按照指示更新 DNS 記錄

---

## 🎯 部署檢查清單

### 部署前

- [ ] GitHub 代碼已推送
- [ ] Zeabur 帳戶已建立
- [ ] 沒有未提交的更改

### 部署中

- [ ] 服務已添加
- [ ] 構建成功
- [ ] 環境變量已配置
- [ ] PostgreSQL 已連接（如需要）

### 部署後

- [ ] 應用可訪問
- [ ] 沒有日誌錯誤
- [ ] 功能正常
- [ ] Notion 同步工作
- [ ] 自動部署已啟用

---

## 📱 應用 URL

部署完成後，你的應用 URL 會是：

```
https://typemonn-universe.zeabur.app
```

（實際域名根據你的項目名稱自動生成）

---

## 🔄 持續更新流程

### 開發流程

```
本地開發
  ↓
git add & commit
  ↓
git push origin main
  ↓
Zeabur 自動檢測
  ↓
自動構建和部署
  ↓
應用自動更新 ✓
```

### 無需任何額外步驟！

每次 push 代碼，Zeabur 都會自動：
1. 拉取新代碼
2. 安裝依賴
3. 構建應用
4. 部署更新
5. 零宕機切換

---

## 📞 需要幫助？

### Zeabur 文檔
- 官方文檔：https://zeabur.com/docs
- 常見問題：https://zeabur.com/docs/faq
- 社群論壇：https://zeabur.com/community

### Next.js 部署
- Next.js 部署指南：https://nextjs.org/docs/deployment
- Zeabur Next.js 指南：https://zeabur.com/docs/guides/nodejs

---

## ✨ 完成！

你現在擁有一個完整的生產環境！

**應用已實時運行，自動更新所有最新代碼。** 🚀

---

**最後更新**：2026-02-01
**狀態**：部署就緒 ✓
