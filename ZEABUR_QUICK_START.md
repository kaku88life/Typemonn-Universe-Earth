# ⚡ Zeabur 部署 - 5 分鐘快速開始

Type-Moon Holograph 項目部署到 Zeabur 只需 5 分鐘！

---

## 🎯 3 步完成部署

### 步驟 1️⃣：建立 Zeabur 帳戶（1 分鐘）

```
1. 訪問 https://zeabur.com
2. 點擊 "Sign Up"
3. 選擇 "GitHub" 登入
4. 授權訪問
5. 驗證郵箱（檢查郵件）
```

### 步驟 2️⃣：連接 GitHub 倉庫（2 分鐘）

```
1. 登入 Zeabur 控制面板
2. 點擊 "+ New Project"
3. 選擇 "GitHub"
4. 搜尋 "Typemonn-Universe-Earth"
5. 點擊選擇倉庫
6. 等待初始化（1-2 分鐘）
```

### 步驟 3️⃣：配置環境變量（2 分鐘）

```
1. 進入服務設置
2. 點擊 "Variables"
3. 添加以下變量：

NOTION_API_KEY=your_notion_api_key        # 從 .env.notion 複製
NOTION_DATABASE_ID=6e7cdcd1cdf14e8bb198d8b324fb2e34
SYNC_SCHEDULE=0 23 * * *

4. 點擊 "Save"
5. 等待重新部署
```

---

## ✅ 完成！

應用現在已部署並運行！

### 訪問你的應用

```
https://typemonn-universe-earth.zeabur.app
```

（實際 URL 根據項目名稱生成）

---

## 🔄 自動更新

現在每當你：

```bash
git push origin main
```

Zeabur 會自動：
1. 檢測到新代碼
2. 構建應用
3. 部署更新
4. 無需任何手動步驟！

---

## 📊 監控應用

在 Zeabur 控制面板查看：

- **Logs**：實時日誌
- **Metrics**：性能監控
- **Domains**：域名配置
- **Environment**：環境變量

---

## 🆘 遇到問題？

### 構建失敗

查看 "Logs" 標籤，找出錯誤原因

```bash
# 本地測試構建
npm run build
```

### 應用無法訪問

1. 檢查日誌（"Logs" 標籤）
2. 驗證環境變量已正確設置
3. 確認 GitHub 代碼無誤

### 環境變量未生效

重新啟動服務：
1. 進入服務設置
2. 點擊 "Restart"
3. 等待重啟完成

---

## 📋 必要檢查清單

部署前：
- [ ] GitHub 代碼已推送 ✓
- [ ] Zeabur 帳戶已建立
- [ ] 倉庫可訪問

部署後：
- [ ] 應用可訪問
- [ ] 無錯誤日誌
- [ ] Notion API Key 已配置
- [ ] 自動部署已啟用

---

## 🎉 完成！

你現在有一個完整的生產環境運行你的 Type-Moon Holograph 項目！

**每次代碼更新都會自動部署。**

---

需要詳細信息？查看完整指南：`ZEABUR_DEPLOYMENT.md`
