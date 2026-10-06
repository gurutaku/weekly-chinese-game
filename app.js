const HANZI_POOL = [
  { char:'手', bopomofo:'ㄕㄡˇ', pinyin:'shǒu', meaning:'手；手部。', sentence:'請舉起你的手。', en:'Please raise your hand.', tip:'手是我們每天最常用的部位之一。' },
  { char:'眼', bopomofo:'ㄧㄢˇ', pinyin:'yǎn', meaning:'眼睛；視力。', sentence:'我的眼睛很酸。', en:'My eyes feel tired.', tip:'「眼」和眼睛有關，左邊是「目」。' },
  { char:'耳', bopomofo:'ㄦˇ', pinyin:'ěr', meaning:'耳朵。', sentence:'我的耳朵聽到了聲音。', en:'My ears heard a sound.', tip:'「耳」的字形像耳朵。' },
  { char:'足', bopomofo:'ㄗㄨˊ', pinyin:'zú', meaning:'腳；足夠；足部。', sentence:'我的雙足很累。', en:'My feet are very tired.', tip:'「足」和腳、走路有關。' },
  { char:'學', bopomofo:'ㄒㄩㄝˊ', pinyin:'xué', meaning:'學習；學問。', sentence:'我每天學中文。', en:'I learn Chinese every day.', tip:'「學」是學習，常見詞有「學校、學生」。' },
  { char:'校', bopomofo:'ㄒㄧㄠˋ', pinyin:'xiào', meaning:'學校；校園。', sentence:'我早上八點到學校。', en:'I arrive at school at 8 a.m.', tip:'「學校」的「校」讀第四聲。' },
  { char:'生', bopomofo:'ㄕㄥ', pinyin:'shēng', meaning:'出生；生活；學生。', sentence:'學生正在讀書。', en:'The students are studying.', tip:'「生」可以表示生命、生長，也能組成「學生」。' },
  { char:'書', bopomofo:'ㄕㄨ', pinyin:'shū', meaning:'書；書本。', sentence:'這本書很好看。', en:'This book is very interesting.', tip:'「書」和閱讀、寫字常常一起出現。' },
  { char:'字', bopomofo:'ㄗˋ', pinyin:'zì', meaning:'文字；字。', sentence:'這個字怎麼念？', en:'How do you pronounce this character?', tip:'「漢字」就是 Chinese characters。' },
  { char:'文', bopomofo:'ㄨㄣˊ', pinyin:'wén', meaning:'文字；文章；文化。', sentence:'我在寫一篇作文。', en:'I am writing a composition.', tip:'「中文」的「文」就是文字、語文。' }
];

// Remove duplicate characters while keeping the first definition.
const DATA = Array.from(new Map(HANZI_POOL.map(item => [item.char, item])).values());
const STORAGE_KEY = 'chinese-weekly-progress-v1';

let state = loadState();
let weekly = getWeeklySet();
let selectedIndex = 0;
let writer = null;
let practice = { order: [], current: 0, score: 0 };
let toastTimer = null;

const $ = (id) => document.getElementById(id);

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { completed: {}, streakDates: [] }; }
  catch (_) { return { completed: {}, streakDates: [] }; }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function isoDate(d) { return d.toISOString().slice(0, 10); }
function startOfWeek(date) {
  const d = new Date(date); const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setHours(0,0,0,0); d.setDate(d.getDate() + diff); return d;
}
function endOfWeek(date) { const d = startOfWeek(date); d.setDate(d.getDate()+6); return d; }
function weekKey(date = new Date()) {
  // Monday-start week; using the exact Monday date makes the key stable
  // across year boundaries without relying on ISO-week edge cases.
  return isoDate(startOfWeek(date));
}
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function getWeeklySet() {
  const seed = hashString(weekKey());
  const rand = mulberry32(seed);
  const pool = [...DATA];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(10, pool.length));
}
function formatMD(d) { return `${d.getMonth()+1}/${d.getDate()}`; }
function completed(char) { return Boolean(state.completed[weekKey()]?.includes(char)); }
function markCompleted(char) {
  const key = weekKey();
  state.completed[key] = state.completed[key] || [];
  if (!state.completed[key].includes(char)) state.completed[key].push(char);
  const today = isoDate(new Date());
  state.streakDates = Array.from(new Set([...(state.streakDates || []), today])).sort();
  saveState();
}
function getStreak() {
  const dates = new Set(state.streakDates || []);
  let d = new Date();
  d.setHours(0,0,0,0);
  let streak = 0;
  while (dates.has(isoDate(d))) { streak++; d.setDate(d.getDate()-1); }
  return streak;
}

function renderWeekMeta() {
  const start = startOfWeek(new Date()); const end = endOfWeek(new Date());
  $('weekRange').textContent = `${start.getFullYear()} / ${formatMD(start)} – ${formatMD(end)}`;
  $('streakValue').textContent = `${getStreak()} 天`;
  const count = weekly.filter(item => completed(item.char)).length;
  $('progressText').textContent = `${count} / ${weekly.length} 已完成`;
  $('progressBar').style.width = `${count / weekly.length * 100}%`;
}

function renderGrid() {
  $('characterGrid').innerHTML = weekly.map((item, index) => `
    <button class="char-card ${index === selectedIndex ? 'selected' : ''} ${completed(item.char) ? 'completed' : ''}" data-index="${index}" type="button">
      <span class="done-dot">✓</span>
      <div class="char-number">${index + 1}</div>
      <div class="char-glyph">${item.char}</div>
      <div class="char-bpmf">${item.bopomofo}</div>
    </button>
  `).join('');
  document.querySelectorAll('.char-card').forEach(btn => btn.addEventListener('click', () => selectCharacter(Number(btn.dataset.index))));
}

function getWriterSize() {
  const el = $('writer');
  const size = Math.floor(Math.min(el.clientWidth || 320, el.clientHeight || el.clientWidth || 320));
  return Math.max(180, size);
}

function initWriter(char) {
  if (!window.HanziWriter) {
    $('writer').textContent = char;
    $('writerStatus').textContent = '筆順工具尚未載入；請確認網路連線後重新整理。';
    return;
  }

  if (writer && typeof writer.cancelQuiz === 'function') {
    try { writer.cancelQuiz(); } catch (_) {}
  }
  writer = null;
  $('writer').innerHTML = '';

  try {
    const size = getWriterSize();
    writer = HanziWriter.create('writer', char, {
      width: size,
      height: size,
      padding: Math.round(size * 0.08),
      showOutline: true,
      showCharacter: false,
      strokeAnimationSpeed: 1,
      strokeColor: '#d84b45',
      radicalColor: '#d84b45',
      outlineColor: '#ddd3cb',
      highlightColor: '#e49f36',
      drawingColor: '#2f2730',
      strokeFadeDuration: 300,
      strokeHighlightDuration: 180,
      delayBetweenStrokes: 180,
      onLoadCharDataSuccess: () => {
        $('writerStatus').textContent = '筆順已載入。先看一次，再自己寫。';
      },
      onLoadCharDataError: () => {
        $('writerStatus').textContent = '找不到這個字的筆順資料。';
      }
    });
    $('writerStatus').textContent = '筆順載入中…';
  } catch (e) {
    console.error('Hanzi Writer initialization failed:', e);
    $('writerStatus').textContent = '筆順工具發生問題，請重新整理頁面。';
  }
}

let writerResizeTimer = null;
window.addEventListener('resize', () => {
  if (!writer) return;
  clearTimeout(writerResizeTimer);
  writerResizeTimer = setTimeout(() => {
    try { writer.updateDimensions({ width: getWriterSize(), height: getWriterSize() }); } catch (_) {}
  }, 120);
});

function renderCharacter() {
  const item = weekly[selectedIndex];
  if (!item) return;
  $('selectedTitle').textContent = `${item.char}　${item.pinyin}`;
  $('bopomofo').textContent = item.bopomofo;
  $('pinyin').textContent = item.pinyin;
  $('meaning').textContent = item.meaning;
  $('sentence').textContent = item.sentence;
  $('sentenceEnglish').textContent = item.en;
  $('tipText').textContent = item.tip;
  $('markBtn').textContent = completed(item.char) ? '已完成 ✓' : '標記完成';
  $('markBtn').disabled = completed(item.char);
  $('markBtn').style.opacity = completed(item.char) ? '.65' : '1';
  renderGrid();
  initWriter(item.char);
}

function selectCharacter(index) {
  selectedIndex = index;
  $('practiceSection').classList.add('hidden');
  $('learn-panel')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  renderCharacter();
}

function getChineseVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => /^zh-TW$/i.test(v.lang))
    || voices.find(v => /^zh[-_]TW/i.test(v.lang))
    || voices.find(v => /^zh/i.test(v.lang))
    || null;
}

function speak(text, options = {}) {
  if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance === 'undefined') {
    showToast('這個瀏覽器不支援語音播放');
    return;
  }
  const value = String(text || '').trim();
  if (!value) return;

  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(value);
  u.lang = options.lang || 'zh-TW';
  u.rate = options.rate ?? .8;
  u.pitch = options.pitch ?? 1;
  const voice = getChineseVoice();
  if (voice && (!options.lang || /^zh/i.test(options.lang))) u.voice = voice;
  u.onerror = () => showToast('語音播放失敗，請確認裝置的中文語音已啟用。');
  window.speechSynthesis.speak(u);
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.addEventListener?.('voiceschanged', () => getChineseVoice());
}

function showToast(msg) {
  const toast = $('toast'); toast.textContent = msg; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function startPractice() {
  practice = { order: shuffle([...Array(weekly.length).keys()]).slice(0, weekly.length), current: 0, score: 0 };
  $('practiceSection').classList.remove('hidden');
  $('practiceSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  renderPracticeQuestion();
}
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
}
function renderPracticeQuestion() {
  const idx = practice.order[practice.current];
  const target = weekly[idx];
  $('practicePrompt').textContent = `這個注音是哪一個字？  ${target.bopomofo}（${target.meaning.replace(/；.*/, '')}）`;
  const others = shuffle(weekly.filter((_, i) => i !== idx).map(x => x.char)).slice(0, 5);
  const choices = shuffle([target.char, ...others]);
  $('practiceChoices').innerHTML = choices.map(char => `<button class="choice-btn" type="button" data-char="${char}">${char}</button>`).join('');
  $('practiceFeedback').textContent = `第 ${practice.current + 1} / ${practice.order.length} 題`;
  $('nextQuestion').classList.add('hidden');
  document.querySelectorAll('.choice-btn').forEach(btn => btn.addEventListener('click', () => answerPractice(btn, target.char)));
}
function answerPractice(btn, answer) {
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
  const correct = btn.dataset.char === answer;
  btn.classList.add(correct ? 'correct' : 'wrong');
  if (correct) {
    practice.score++;
    $('practiceFeedback').textContent = '答對了！🎉';
    markCompleted(answer);
    renderWeekMeta(); renderGrid(); renderCharacter();
  } else {
    const right = [...document.querySelectorAll('.choice-btn')].find(b => b.dataset.char === answer);
    if (right) right.classList.add('correct');
    $('practiceFeedback').textContent = `答案是「${answer}」，再看一次筆順吧！`;
  }
  $('nextQuestion').classList.remove('hidden');
}
function nextPractice() {
  practice.current++;
  if (practice.current >= practice.order.length) {
    $('practicePrompt').textContent = `完成！你答對 ${practice.score} / ${practice.order.length} 題。`;
    $('practiceChoices').innerHTML = '';
    $('practiceFeedback').textContent = practice.score === practice.order.length ? '本週 10 字大成功！✨' : '再練一次，會越來越熟。';
    $('nextQuestion').classList.add('hidden');
    return;
  }
  renderPracticeQuestion();
}

$('animateBtn').addEventListener('click', () => {
  if (!writer || typeof writer.animateCharacter !== 'function') {
    showToast('筆順工具尚未準備好');
    return;
  }
  try {
    $('writerStatus').textContent = '正在播放筆順…';
    writer.animateCharacter({ onComplete: () => { $('writerStatus').textContent = '筆順播放完成。現在試著自己寫。'; } });
  } catch (e) {
    console.error('Hanzi Writer animation failed:', e);
    showToast('筆順動畫啟動失敗，請重新整理。');
  }
});
$('quizBtn').addEventListener('click', () => {
  if (!writer || typeof writer.quiz !== 'function') {
    showToast('筆順工具尚未準備好');
    return;
  }
  try {
    writer.quiz({
      showHintAfterMisses: 2,
      onComplete: () => {
        $('writerStatus').textContent = '太棒了！你完成了這個字的筆順練習。';
        markCompleted(weekly[selectedIndex].char);
        renderWeekMeta();
        renderGrid();
        renderCharacter();
        showToast(`「${weekly[selectedIndex].char}」筆順完成 ✓`);
      },
      onMistake: () => { $('writerStatus').textContent = '再試一次，慢慢寫，注意筆畫方向。'; },
      onCorrectStroke: () => { $('writerStatus').textContent = '寫對了！繼續下一筆。'; }
    });
    $('writerStatus').textContent = '請照著筆順，在上方寫出這個字。';
  } catch (e) {
    console.error('Hanzi Writer quiz failed:', e);
    showToast('筆順練習啟動失敗，請重新整理。');
  }
});
$('speakBtn').addEventListener('click', () => speak(weekly[selectedIndex].char, { rate: .72 }));
$('meaningSpeakBtn').addEventListener('click', () => speak(weekly[selectedIndex].meaning));
$('sentenceSpeakBtn').addEventListener('click', () => speak(weekly[selectedIndex].sentence, { rate: .78 }));
$('markBtn').addEventListener('click', () => {
  const item = weekly[selectedIndex];
  markCompleted(item.char); renderWeekMeta(); renderGrid(); renderCharacter(); showToast(`「${item.char}」已完成 ✓`);
});
$('startPractice').addEventListener('click', startPractice);
$('nextQuestion').addEventListener('click', nextPractice);
$('closePractice').addEventListener('click', () => $('practiceSection').classList.add('hidden'));
$('resetProgress').addEventListener('click', () => {
  if (!confirm('確定要清除這台裝置上的學習紀錄嗎？')) return;
  state = { completed: {}, streakDates: [] }; saveState(); renderWeekMeta(); renderGrid(); renderCharacter(); showToast('學習紀錄已重設');
});

renderWeekMeta();
renderCharacter();
