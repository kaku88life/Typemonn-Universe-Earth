# Type-Moon Holograph - 元件規格說明書 (Component Specifications)

## 🧩 UI 元件 (UI Components)

### `GlobeWrapper`
核心 3D 視覺化元件。
- **Props**: 無 (獨立運作，連接至 `useLayerStore`)
- **Key State (關鍵狀態)**:
  - `mounted`: 確保僅在客戶端渲染 (Client-side rendering)。
  - `hoveredContinent/Country`: 追蹤滑鼠游標目前的懸停區域。
- **Data Source (資料來源)**: `useLayerStore.locations`

### `LocationDetailPanel`
顯示所選地點的詳細資訊面板 (或是未來顯示洲/國家的資訊)。
- **Props**: 無 (連接至 `useLayerStore`)
- **Key State (關鍵狀態)**:
  - `servants`: 抓取該地點相關的 FGO 從者列表。
  - `loadingServants`: 載入中狀態。
- **Managed Data (管理資料)**: 地點名稱、經緯度座標、描述、相關角色列表。

### `SettingsMenu`
語言和系統偏好的設定下拉選單。
- **Props**: 無
- **Key State (關鍵狀態)**:
  - `isOpen`: 切換下拉選單的顯示/隱藏。
- **Actions**: 切換 `useLanguageStore.language` (語言設定)。

### `TimelineSlider`
不同時代的導航控制器 (神代 Genesis, 歷史 History, 現代 Modern, 未來 Future)。
- **Props**: 無
- **Key State (關鍵狀態)**: `currentYear` (來自 store)。
- **Features**: 會自動吸附至預定義的時代節點。

### `HolographicPanel`
具有全像投影/毛玻璃視覺風格的可重複使用容器。
- **Props**:
  - `title?` (字串): 標題文字。
  - `className?` (字串): 用於覆蓋樣式的 Tailwind CSS 類別。
  - `children` (ReactNode): 內容元素。

### `ServantCard`
顯示單一從者基本資訊的卡片。
- **Props**:
  - `servant`: `BasicServant` 物件資料。
  - `onClick`: 點擊處理函式。
  - `selected`: 布林值 (是否被選取高亮)。

---

## 🏗️ 狀態管理 (Zustand Stores)

### `useLayerStore`
管理地理空間和時間軸的狀態。
- `locations`: 所有可用的地點資料陣列。
- `selectedLocation`: 目前選取的活躍地點。
- `currentLayer`: 'SURFACE' (表側) | 'REVERSE_SIDE' (裏側)。
- `currentYear`: 目前的全域時間軸年份。
- **導航狀態**:
  - `viewLevel`: 'GLOBAL' (全球) | 'CONTINENT' (洲) | 'COUNTRY' (國家)。
  - `focusedRegion`: 目前聚焦的區域物件。

### `useLanguageStore`
管理國際化 (i18n)。
- `language`: 'EN' (英) | 'ZH' (繁中) | 'JP' (日)。
- `t(key)`: 翻譯函式。
