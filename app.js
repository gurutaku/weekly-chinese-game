let HANZI_POOL = [];
let DATA = [];

async function loadWords() {
  const response = await fetch('./words.json', { cache: 'no-cache' });

  if (!response.ok) {
    throw new Error(`Failed to load words.json: ${response.status}`);
  }

  const words = await response.json();

  if (!Array.isArray(words)) {
    throw new Error('words.json must contain an array of character objects.');
  }

  HANZI_POOL = words;

  // Remove duplicate characters while keeping the first definition.
  DATA = Array.from(
    new Map(
      HANZI_POOL
        .filter(item => item && typeof item.char === 'string' && item.char.trim())
        .map(item => [item.char, item])
    ).values()
  );

  if (DATA.length === 0) {
    throw new Error('words.json does not contain any valid characters.');
  }

  console.log(`Loaded ${HANZI_POOL.length} characters`);
  console.log(`Using ${DATA.length} unique characters`);
}

const STORAGE_KEY = 'chinese-weekly-progress-v1';

let state = { completed: {}, streakDates: [] };
let weekly = [];
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

function initWriter(char) {
  if (!window.HanziWriter) {
    $('writer').textContent = char;
    $('writerStatus').textContent = '筆順工具尚未載入；請確認網路連線後重新整理。';
    return;
  }
  $('writer').innerHTML = '';
  try {
    writer = HanziWriter.create('writer', char, {
      width: '100%', height: '100%', padding: 12,
      showOutline: true, showCharacter: false,
      strokeAnimationSpeed: 1,
      strokeColor: '#d84b45',
      radicalColor: '#d84b45',
      outlineColor: '#ddd3cb',
      highlightColor: '#e49f36',
      drawingColor: '#2f2730',
      strokeFadeDuration: 300,
      strokeHighlightDuration: 180,
      delayBetweenStrokes: 180,
      onLoadCharDataSuccess: () => { $('writerStatus').textContent = '筆順已載入。先看一次，再自己寫。'; },
      onLoadCharDataError: () => { $('writerStatus').textContent = '找不到這個字的筆順資料。'; }
    });
    $('writerStatus').textContent = '筆順載入中…';
  } catch (e) {
    $('writerStatus').textContent = '筆順工具發生問題，請重新整理頁面。';
  }
}

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

function speak(text) {
  if (!('speechSynthesis' in window)) { showToast('這個瀏覽器不支援語音播放'); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-TW';
  u.rate = .8;
  u.pitch = 1;
  window.speechSynthesis.speak(u);
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

function setupEventListeners() {
  $('animateBtn').addEventListener('click', () => writer?.animateCharacter?.() || showToast('筆順工具尚未準備好'));
  $('quizBtn').addEventListener('click', () => writer?.quiz?.({ showHintAfterMisses: 2 }) || showToast('筆順工具尚未準備好'));
  $('speakBtn').addEventListener('click', () => {
    const item = weekly[selectedIndex];
    if (item) speak(item.char);
  });
  $('markBtn').addEventListener('click', () => {
    const item = weekly[selectedIndex];
    if (!item) return;
    markCompleted(item.char); renderWeekMeta(); renderGrid(); renderCharacter(); showToast(`「${item.char}」已完成 ✓`);
  });
  $('startPractice').addEventListener('click', startPractice);
  $('nextQuestion').addEventListener('click', nextPractice);
  $('closePractice').addEventListener('click', () => $('practiceSection').classList.add('hidden'));
  $('resetProgress').addEventListener('click', () => {
    if (!confirm('確定要清除這台裝置上的學習紀錄嗎？')) return;
    state = { completed: {}, streakDates: [] }; saveState(); renderWeekMeta(); renderGrid(); renderCharacter(); showToast('學習紀錄已重設');
  });
}

async function init() {
  try {
    await loadWords();
    state = loadState();
    weekly = getWeeklySet();
    setupEventListeners();
    renderWeekMeta();
    renderCharacter();
  } catch (error) {
    console.error('Failed to initialize Chinese Weekly:', error);
    document.body.innerHTML = `
      <main style="max-width:680px;margin:0 auto;padding:48px 24px;text-align:center;font-family:system-ui,sans-serif">
        <h1>Unable to load the weekly character list</h1>
        <p>Please refresh the page and try again.</p>
        <p style="color:#666;font-size:14px">${error.message.replace(/[<>]/g, '')}</p>
      </main>
    `;
  }
}

init();
