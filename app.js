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
let weeklySets = [];
let selectedIndex = 0;
let selectedWeekIndex = 0;
let writer = null;
let practice = { order: [], current: 0, score: 0 };
let toastTimer = null;

const $ = (id) => document.getElementById(id);

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      completed: {},
      streakDates: []
    };
  }
  catch (_) {
    return {
      completed: {},
      streakDates: []
    };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + diff);
  return d;
}

function endOfWeek(date) {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 6);
  return d;
}

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
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/*
 * Sort all characters by frequencyRank, lowest first,
 * then divide them into groups of 10.
 *
 * Example:
 *   ranks 1-10   -> Week 1
 *   ranks 11-20  -> Week 2
 *   ranks 21-30  -> Week 3
 *   etc.
 */
function buildWeeklySets() {
  const sorted = DATA
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const rankA = Number(a.item.frequencyRank);
      const rankB = Number(b.item.frequencyRank);

      const validA = Number.isFinite(rankA);
      const validB = Number.isFinite(rankB);

      // Valid frequencyRank values always come before missing/invalid ones.
      if (validA && validB && rankA !== rankB) {
        return rankA - rankB;
      }

      if (validA !== validB) {
        return validA ? -1 : 1;
      }

      // Preserve original order when frequencyRank values are equal
      // or both are missing.
      return a.index - b.index;
    })
    .map(({ item }) => item);

  const sets = [];

  for (let i = 0; i < sorted.length; i += 10) {
    sets.push(sorted.slice(i, i + 10));
  }

  return sets;
}

/*
 * Progress is stored independently for each curriculum week.
 * Examples: week1, week2, week3...
 */
function getCompletionKey() {
  return `week${selectedWeekIndex + 1}`;
}

/*
 * Creates the dropdown if it does not already exist in the HTML.
 * This means you do not need to modify index.html.
 */
function ensureWeekSelector() {
  let select = $('weekSelect');

  if (select) {
    return select;
  }

  const anchor = $('weekRange');

  if (!anchor || !anchor.parentElement) {
    return null;
  }

  select = document.createElement('select');
  select.id = 'weekSelect';
  select.setAttribute('aria-label', 'Select learning week');

  select.style.marginLeft = '10px';
  select.style.padding = '6px 10px';
  select.style.borderRadius = '8px';
  select.style.border = '1px solid #d8cec5';
  select.style.background = '#fff';
  select.style.font = 'inherit';

  anchor.parentElement.insertBefore(select, anchor);

  return select;
}

function renderWeekSelector() {
  const select = ensureWeekSelector();

  if (!select) {
    return;
  }

  select.innerHTML = weeklySets.map((items, index) => {
    const firstRank = items.length
      ? Number(items[0].frequencyRank)
      : null;

    const lastRank = items.length
      ? Number(items[items.length - 1].frequencyRank)
      : null;

    const rankLabel =
      Number.isFinite(firstRank) && Number.isFinite(lastRank)
        ? ` (${firstRank}–${lastRank})`
        : '';

    return `<option value="${index}">Week ${index + 1}${rankLabel}</option>`;
  }).join('');

  select.value = String(selectedWeekIndex);

  select.onchange = () => {
    const nextIndex = Number(select.value);

    if (!Number.isInteger(nextIndex) || !weeklySets[nextIndex]) {
      return;
    }

    selectedWeekIndex = nextIndex;
    weekly = weeklySets[selectedWeekIndex];
    selectedIndex = 0;

    $('practiceSection').classList.add('hidden');

    renderWeekMeta();
    renderCharacter();
  };
}

function formatMD(d) {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function completed(char) {
  return Boolean(
    state.completed[getCompletionKey()]?.includes(char)
  );
}

function markCompleted(char) {
  const key = getCompletionKey();

  state.completed[key] = state.completed[key] || [];

  if (!state.completed[key].includes(char)) {
    state.completed[key].push(char);
  }

  const today = isoDate(new Date());

  state.streakDates = Array.from(
    new Set([
      ...(state.streakDates || []),
      today
    ])
  ).sort();

  saveState();
}

function getStreak() {
  const dates = new Set(state.streakDates || []);

  let d = new Date();
  d.setHours(0, 0, 0, 0);

  let streak = 0;

  while (dates.has(isoDate(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  return streak;
}

function renderWeekMeta() {
  const currentWeek = weeklySets[selectedWeekIndex] || [];

  const firstRank = currentWeek.length
    ? Number(currentWeek[0].frequencyRank)
    : null;

  const lastRank = currentWeek.length
    ? Number(currentWeek[currentWeek.length - 1].frequencyRank)
    : null;

  $('weekRange').textContent =
    Number.isFinite(firstRank) && Number.isFinite(lastRank)
      ? `Popular Characters ${firstRank}–${lastRank}`
      : `Week ${selectedWeekIndex + 1}`;

  $('streakValue').textContent =
    `${getStreak()} ${getStreak() === 1 ? 'day' : 'days'}`;

  const count = weekly.filter(
    item => completed(item.char)
  ).length;

  $('progressText').textContent =
    `${count} / ${weekly.length} completed`;

  $('progressBar').style.width =
    `${weekly.length ? count / weekly.length * 100 : 0}%`;

  renderWeekSelector();
}

function renderGrid() {
  $('characterGrid').innerHTML = weekly.map((item, index) => `
    <button
      class="char-card ${index === selectedIndex ? 'selected' : ''} ${completed(item.char) ? 'completed' : ''}"
      data-index="${index}"
      type="button"
    >
      <span class="done-dot">✓</span>
      <div class="char-number">${index + 1}</div>
      <div class="char-glyph">${item.char}</div>
      <div class="char-bpmf">${item.bopomofo}</div>
    </button>
  `).join('');

  document
    .querySelectorAll('.char-card')
    .forEach(btn =>
      btn.addEventListener(
        'click',
        () => selectCharacter(Number(btn.dataset.index))
      )
    );
}

function initWriter(char) {
  const writerEl = $('writer');

  if (!window.HanziWriter) {
    writerEl.textContent = char;
    $('writerStatus').textContent =
      'The stroke-order tool is not loaded. Please check your connection and refresh.';
    return;
  }

  writerEl.innerHTML = '';

  try {
    // Hanzi Writer works best with explicit pixel dimensions.
    // Using the container's smaller dimension keeps the whole
    // character inside the stroke-order window on phones,
    // tablets, and desktops.
    const rect = writerEl.getBoundingClientRect();

    const size = Math.max(
      180,
      Math.floor(Math.min(rect.width, rect.height))
    );

    writer = HanziWriter.create('writer', char, {
      width: size,
      height: size,
      padding: Math.round(size * 0.12),

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
        $('writerStatus').textContent =
          'Stroke order loaded. Watch it once, then try it yourself.';
      },

      onLoadCharDataError: () => {
        $('writerStatus').textContent =
          'Stroke-order data for this character could not be found.';
      }
    });

    $('writerStatus').textContent =
      'Loading stroke order...';

  } catch (e) {
    console.error('Hanzi Writer error:', e);

    $('writerStatus').textContent =
      'The stroke-order tool had a problem. Please refresh the page.';
  }
}

function renderCharacter() {
  const item = weekly[selectedIndex];

  if (!item) {
    return;
  }

  $('selectedTitle').textContent =
    `${item.char}　${item.pinyin}`;

  $('bopomofo').textContent =
    item.bopomofo;

  $('pinyin').textContent =
    item.pinyin;

  $('meaning').textContent =
    item.meaningEn || item.meaning;

  $('sentence').innerHTML =
    `<span class="language-label">Chinese:</span> ${item.sentence}`;

  $('sentenceEnglish').innerHTML =
    `<span class="language-label">English:</span> ${item.en}`;

  $('tipText').textContent =
    'Tip: Watch the stroke order first, then try writing the character yourself.';

  $('markBtn').textContent =
    completed(item.char)
      ? 'Completed ✓'
      : 'Mark Complete';

  $('markBtn').disabled =
    completed(item.char);

  $('markBtn').style.opacity =
    completed(item.char)
      ? '.65'
      : '1';

  renderGrid();
  initWriter(item.char);
}

function selectCharacter(index) {
  selectedIndex = index;

  $('practiceSection').classList.add('hidden');

  $('learn-panel')
    ?.scrollIntoView?.({
      behavior: 'smooth',
      block: 'start'
    });

  renderCharacter();
}

function speak(text, lang = 'zh-TW', rate = .8) {
  if (!('speechSynthesis' in window)) {
    showToast('This browser does not support audio.');
    return;
  }

  window.speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);

  u.lang = lang;
  u.rate = rate;
  u.pitch = 1;

  // Let the browser choose the best available voice
  // for the requested language.
  const voices =
    window.speechSynthesis.getVoices?.() || [];

  const preferred = voices.find(
    v =>
      v.lang
        ?.toLowerCase()
        .startsWith(lang.slice(0, 2).toLowerCase())
  );

  if (preferred) {
    u.voice = preferred;
  }

  window.speechSynthesis.speak(u);
}

function speakChinese(text) {
  speak(text, 'zh-TW', .78);
}

function speakEnglish(text) {
  speak(text, 'en-US', .95);
}

function showToast(msg) {
  const toast = $('toast');

  toast.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(
    () => toast.classList.remove('show'),
    1800
  );
}

function startPractice() {
  practice = {
    order: shuffle(
      [...Array(weekly.length).keys()]
    ).slice(0, weekly.length),

    current: 0,
    score: 0
  };

  $('practiceSection').classList.remove('hidden');

  $('practiceSection').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  speakEnglish(
    'Let’s practice! Which character matches the sound?'
  );

  renderPracticeQuestion();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] =
      [arr[j], arr[i]];
  }

  return arr;
}

function renderPracticeQuestion() {
  const idx =
    practice.order[practice.current];

  const target =
    weekly[idx];

  $('practicePrompt').textContent =
    `Bopomofo sound:  ${target.bopomofo}`;

  const others =
    shuffle(
      weekly
        .filter((_, i) => i !== idx)
        .map(x => x.char)
    ).slice(0, 5);

  const choices =
    shuffle([
      target.char,
      ...others
    ]);

  $('practiceChoices').innerHTML =
    choices.map(char => `
      <button
        class="choice-btn"
        type="button"
        data-char="${char}"
      >
        ${char}
      </button>
    `).join('');

  $('practiceFeedback').textContent =
    `Question ${practice.current + 1} of ${practice.order.length}`;

  $('nextQuestion').classList.add('hidden');

  document
    .querySelectorAll('.choice-btn')
    .forEach(btn =>
      btn.addEventListener(
        'click',
        () => answerPractice(btn, target.char)
      )
    );
}

function answerPractice(btn, answer) {
  document
    .querySelectorAll('.choice-btn')
    .forEach(
      b => b.disabled = true
    );

  const correct =
    btn.dataset.char === answer;

  btn.classList.add(
    correct
      ? 'correct'
      : 'wrong'
  );

  if (correct) {
    practice.score++;

    $('practiceFeedback').textContent =
      'Correct! 🎉';

    markCompleted(answer);

    renderWeekMeta();
    renderGrid();
    renderCharacter();

  } else {
    const right =
      [...document.querySelectorAll('.choice-btn')]
        .find(
          b => b.dataset.char === answer
        );

    if (right) {
      right.classList.add('correct');
    }

    $('practiceFeedback').textContent =
      `The answer is ${answer}. Let’s watch the stroke order again!`;
  }

  $('nextQuestion').classList.remove('hidden');
}

function nextPractice() {
  practice.current++;

  if (practice.current >= practice.order.length) {
    $('practicePrompt').textContent =
      `Finished! You got ${practice.score} out of ${practice.order.length} correct.`;

    $('practiceChoices').innerHTML = '';

    $('practiceFeedback').textContent =
      practice.score === practice.order.length
        ? 'Amazing! You mastered all characters in this week! ✨'
        : 'Nice work! Practice again and you’ll get even better.';

    $('nextQuestion').classList.add('hidden');

    speakEnglish(
      practice.score === practice.order.length
        ? 'Amazing! You mastered all the characters this week!'
        : 'Nice work! Keep practicing and you will get even better.'
    );

    return;
  }

  renderPracticeQuestion();
}

function setupEventListeners() {
  $('animateBtn').addEventListener(
    'click',
    () =>
      writer?.animateCharacter?.() ||
      showToast(
        'The stroke-order tool is not ready yet.'
      )
  );

  $('quizBtn').addEventListener(
    'click',
    () => {
      if (!writer?.quiz) {
        showToast(
          'The writing tool is not ready yet.'
        );
        return;
      }

      speakEnglish(
        'Watch the stroke order, then write the character yourself.'
      );

      writer.quiz({
        showHintAfterMisses: 2
      });
    }
  );

  $('speakBtn').addEventListener(
    'click',
    () => {
      const item =
        weekly[selectedIndex];

      if (item) {
        speakChinese(item.char);
      }
    }
  );

  $('markBtn').addEventListener(
    'click',
    () => {
      const item =
        weekly[selectedIndex];

      if (!item) {
        return;
      }

      markCompleted(item.char);

      renderWeekMeta();
      renderGrid();
      renderCharacter();

      showToast(
        `${item.char} marked complete ✓`
      );
    }
  );

  $('startPractice').addEventListener(
    'click',
    startPractice
  );

  $('nextQuestion').addEventListener(
    'click',
    nextPractice
  );

  $('closePractice').addEventListener(
    'click',
    () =>
      $('practiceSection')
        .classList.add('hidden')
  );

  $('meaningSpeakBtn').addEventListener(
    'click',
    () => {
      const item =
        weekly[selectedIndex];

      if (item) {
        speakEnglish(
          `This character means: ${item.meaningEn || item.meaning}.`
        );
      }
    }
  );

  $('sentenceSpeakBtn').addEventListener(
    'click',
    () => {
      const item =
        weekly[selectedIndex];

      if (item) {
        speakChinese(item.sentence);
      }
    }
  );

  $('resetProgress').addEventListener(
    'click',
    () => {
      if (
        !confirm(
          'Clear all learning progress saved on this device?'
        )
      ) {
        return;
      }

      state = {
        completed: {},
        streakDates: []
      };

      saveState();

      renderWeekMeta();
      renderGrid();
      renderCharacter();

      showToast(
        'Progress reset. Ready for a fresh start!'
      );
    }
  );
}

async function init() {
  try {
    await loadWords();

    state = loadState();

    weeklySets =
      buildWeeklySets();

    if (weeklySets.length === 0) {
      throw new Error(
        'No weekly character sets could be created.'
      );
    }

    weekly =
      weeklySets[0];

    selectedWeekIndex = 0;

    setupEventListeners();

    renderWeekMeta();
    renderCharacter();

  } catch (error) {
    console.error(
      'Failed to initialize Chinese Weekly:',
      error
    );

    document.body.innerHTML = `
      <main style="max-width:680px;margin:0 auto;padding:48px 24px;text-align:center;font-family:system-ui,sans-serif">
        <h1>Unable to load the weekly character list</h1>
        <p>Please refresh the page and try again.</p>
        <p style="color:#666;font-size:14px">
          ${error.message.replace(/[<>]/g, '')}
        </p>
      </main>
    `;
  }
}

init();
