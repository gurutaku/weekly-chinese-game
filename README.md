# 每週 10 個中文字｜GitHub Pages 單頁學習遊戲

這是一個不需要伺服器、不需要資料庫、可以直接放到 GitHub Pages 的單頁應用程式（SPA）。

## 功能

- 每週自動從字庫中穩定地抽出 10 個中文字；同一週的學生會看到相同的 10 個字。
- 顯示注音（Bopomofo）、Pinyin、英文意思與例句。
- 使用 Hanzi Writer 顯示筆順動畫，也提供「我來寫」筆順練習。
- 使用瀏覽器 `SpeechSynthesis` 播放中文發音，語系設定為 `zh-TW`。
- 點選「標記完成」或答對小測驗後累積本週進度。
- 使用瀏覽器 `localStorage` 記錄完成紀錄與連續學習天數。
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

這個專案不需要 Node.js、React、npm 或 build step。

## 筆順資料

筆順顯示由 Hanzi Writer 提供。前端透過 jsDelivr 載入 `hanzi-writer@3.7.3`，因此網站發布後第一次載入某個中文字時可能需要網路連線。

## 自訂字庫

開啟 `app.js`，找到 `HANZI_POOL`。每個字的格式如下：

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

增加的字會自動加入每週抽選池。

## 之後可以擴充

可以加入：姓名／班級、單字而不只是單字元、聽音選字、注音配對、每日任務、獎章、排行榜、教師後台，以及 PWA 離線安裝。
