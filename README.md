# Chinese Character Adventure

A kid-friendly, static Chinese character learning game for elementary-school students. The interface, instructions, learning tips, and English narration are designed for children who may not know Chinese yet.

## What students can do

- Learn 10 Chinese characters each week.
- See the Chinese character, Zhuyin (Bopomofo), and Pinyin.
- Read an English meaning for each character.
- See a Chinese example sentence with an English translation.
- Tap the speaker button to hear the Chinese pronunciation.
- Tap **Hear English** to hear the English meaning or example.
- Watch the stroke-order animation.
- Use **Write It!** to practice writing the character.
- Complete a short English-narrated matching quiz.
- Track weekly progress and a day streak on the current device.

## Files

```text
index.html
style.css
app.js
words.json
README.md
```

`words.json` is loaded by `app.js` before the weekly character set is created. This prevents the app from trying to use an empty character list while the JSON file is still loading.

## Local preview

Use a small HTTP server rather than opening `index.html` directly. For example:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

This matches the way the app is served on GitHub Pages and allows `fetch('./words.json')` to work normally.

## GitHub Pages

1. Create a repository such as `chinese-character-weekly`.
2. Upload all five files to the repository root.
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`.
6. Save and open the GitHub Pages URL.

## Speech

The app uses the browser Web Speech API. Character pronunciation uses `zh-TW`, while English explanations and learning instructions use `en-US`. Browser support and the available voices depend on the device.

## Character data

Edit `words.json` to change or add learning content. Each item can contain:

```json
{
  "char": "學",
  "bopomofo": "ㄒㄩㄝˊ",
  "pinyin": "xué",
  "meaning": "學習；學問。",
  "meaningEn": "learn; study; learning.",
  "sentence": "我每天學中文。",
  "en": "I learn Chinese every day.",
  "tip": "…"
}
```

The existing Chinese fields are the learning material; the English fields make the activity understandable to beginners.

## Notes

The app is intentionally a static site with no backend and no build step. The stroke-order library is loaded from jsDelivr, so stroke animations require an internet connection unless you later self-host that library.
