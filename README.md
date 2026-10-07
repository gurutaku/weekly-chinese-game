# 每週 10 個中文字｜GitHub Pages 單頁學習遊戲

這是一個可以直接放到 GitHub Pages 的單頁應用程式（SPA）。前端會從公開的 Taiwan Mandarin 字典 API 載入全年 520 個常用繁體中文字，並把資料快取在瀏覽器中。

## 功能

- 全年 520 個字、52 週，每週固定 10 個字；同一個學習年度內不重複抽到同一個字。
- 顯示注音（Bopomofo）、Pinyin、意思與例句；內建字庫中的手寫內容會優先保留。
- 使用 Hanzi Writer 顯示筆順動畫，也提供「我來寫」筆順練習。
- 使用瀏覽器 `SpeechSynthesis` 播放中文發音，語系設定為 `zh-TW`。
- 點選「標記完成」或答對小測驗後累積本週進度。
- 使用瀏覽器 `localStorage` 記錄完成紀錄、連續學習天數，以及已下載的 520 字字庫。
- 響應式設計，適合 iPhone、iPad、桌面瀏覽器。

## 本機預覽

最簡單的方法是把這個資料夾放到任何靜態網站伺服器。例如：

```bash
python3 -m http.server 8000
```

然後在瀏覽器開啟：

```text
http://localhost:8000
```

直接雙擊 `index.html` 大部分功能也能看到，但使用 HTTP 伺服器測試最接近 GitHub Pages。

## 放到 GitHub

1. 在 GitHub 新建一個 repository，例如 `chinese-character-weekly`。
2. 把本資料夾內的 `index.html`、`style.css`、`app.js`、`README.md` 上傳到 repository 根目錄。
3. 到 repository 的 **Settings → Pages**。
4. 在 **Build and deployment** 中選擇 **Deploy from a branch**。
5. Branch 選 `main`，Folder 選 `/ (root)`，按 **Save**。
6. 幾分鐘後 GitHub Pages 會提供網站網址。

這個專案不需要 Node.js、React、npm 或 build step。首次載入 520 字資料時需要網路連線；之後會優先使用瀏覽器快取。

## 筆順資料

筆順顯示由 Hanzi Writer 提供。前端透過 jsDelivr 載入 `hanzi-writer@3.7.3`，因此網站發布後第一次載入某個中文字時可能需要網路連線。

## 字庫與全年 520 字

全年字庫使用 Taiwan Mandarin 公開字典 API 的台灣繁體中文常用字資料。API 提供繁體字、Pinyin、注音、英文學習義與常用詞；網站可跨來源存取，無需 API key。

原本提供的手寫字庫仍保留在 `SEED_POOL` 中，因此你原先寫好的意思、例句與學習提示會優先使用。其餘字會由 API 自動補齊。

程式會把 520 個字先建立成年度字卡，再以固定的年度種子打亂，分成 52 週，每週 10 個字，因此同一個年度內不會重複。

資料來源：`https://api.taiwanmandarin.com`

## 原本字庫格式

若要修改你自己的手寫內容，開啟 `app.js` 的 `SEED_POOL`。每個字的格式如下：

```js
{
  char: '學',
  bopomofo: 'ㄒㄩㄝˊ',
  pinyin: 'xué',
  meaning: '學習；學問。',
  sentence: '我每天學中文。',
  en: 'I learn Chinese every day.',
  tip: '「學」是學習，常見詞有「學校、學生」。'
}
```

手寫資料會覆蓋遠端字典的同名欄位，方便你自行調整成孩子使用的教材內容。

## 之後可以擴充

可以加入：姓名／班級、單字而不只是單字元、聽音選字、注音配對、每日任務、獎章、排行榜、教師後台，以及 PWA 離線安裝。
