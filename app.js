/* ═══════════ Project Selene · app.js ═══════════
   Moonlight / Growth / Grace / Softness / Consistency */

const STORAGE_KEY = 'dailyRecords';
const SETTINGS_KEY = '_settings';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const SUPABASE_URL = 'https://jmfuujyeodhjhgxezqpv.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_zDXnDnWE665dD9kMmSqxOQ_U0Y_V5ib';
const SUPABASE_TABLE = 'shared_daily_data';
const SUPABASE_RECORD_ID = 'daily-negentropy';
const MAKEUP_BUCKET = 'makeup-photos';
const MAKEUP_NS = 'daily-negentropy';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

/* ── Selene daily tasks ── */
const SELENE_TASKS = [
  { key: 'skincare', title: '早晚护肤', desc: '温和对待今天的皮肤', cat: '护肤', icon: '🧴' },
  { key: 'sunscreen', title: '白天防晒', desc: '出门前完成面部与颈部防晒', cat: '护肤', icon: '☀️' },
  { key: 'walk', title: '步行或运动 30 分钟', desc: '轻盈、干净、稳定地动起来', cat: '身材', icon: '🚶‍♀️' },
  { key: 'protein', title: '蛋白质摄入达标', desc: '保持肌肉，改善比例', cat: '身材', icon: '🥚' },
  { key: 'makeup', title: '化妆练习 10 分钟', desc: '只练本周重点就好', cat: '化妆', icon: '💄' },
  { key: 'posture', title: '仪态练习 10 分钟', desc: '靠墙站立、肩颈放松', cat: '仪态', icon: '🌿' },
  { key: 'photo', title: '拍一张今日照片', desc: '记录今天的自己', cat: '拍照', icon: '📷' },
  { key: 'xpost', title: 'X 发帖 1 条', desc: '今天的进展、思考或作品都可以', cat: '事业', icon: '📮' },
  { key: 'website', title: '网站建设推进', desc: '一个小改动也算数', cat: '事业', icon: '🌐' },
  { key: 'review', title: '睡前复盘', desc: '三行也很好', cat: '复盘', icon: '🌙' }
];
const LOW_ENERGY_KEYS = ['skincare', 'walk', 'review'];
const SUCCESS_TARGET = 5;
const LOW_TARGET = 3;

const CAT_META = {
  '护肤': '#86987f', '身材': '#d99a93', '化妆': '#c07b73',
  '仪态': '#7e96ac', '拍照': '#c9a86b', '事业': '#b08f77', '复盘': '#9d8fb3'
};

const MOODS = [
  { v: 'Calm', face: '😌', zh: '平静' },
  { v: 'Happy', face: '😊', zh: '开心' },
  { v: 'Tired', face: '😮‍💨', zh: '疲惫' },
  { v: 'Anxious', face: '😥', zh: '焦虑' },
  { v: 'Confident', face: '😎', zh: '自信' },
  { v: 'Low Energy', face: '🥱', zh: '低能量' }
];

const MAKEUP_STEPS = [
  { key: 'base', name: '底妆', icon: '🧴' },
  { key: 'conceal', name: '遮瑕', icon: '🖌' },
  { key: 'brow', name: '眉毛', icon: '🖊' },
  { key: 'shadow', name: '眼影', icon: '🎨' },
  { key: 'liner', name: '眼线', icon: '✒️' },
  { key: 'lash', name: '睫毛', icon: '👁' },
  { key: 'blush', name: '腮红', icon: '🌸' },
  { key: 'lip', name: '唇妆', icon: '💋' }
];

const POSTURE_EX = [
  { key: 'wall', name: '靠墙站立 3 分钟', secs: 180, info: '后脑勺、肩胛骨、臀部、小腿、脚跟贴墙，下巴轻收，自然呼吸。' },
  { key: 'shoulder', name: '放松肩膀', secs: 60, info: '耸肩后彻底放下，重复 10 次；感受肩膀离开耳朵的距离。' },
  { key: 'chin', name: '下巴轻收', secs: 60, info: '想象头顶有一根线轻轻向上提，下巴微收，颈后拉长。' },
  { key: 'neck', name: '肩颈拉伸', secs: 90, info: '头部缓慢向左右两侧倾斜，每侧保持 15 秒，不要耸肩。' },
  { key: 'hipfold', name: '髋部拉伸', secs: 90, info: '弓步压髋或蝴蝶式，打开髋部，保持骨盆稳定。' },
  { key: 'slowwalk', name: '慢步行走练习', secs: 120, info: '想象头顶延伸，肩膀放松，脚跟到脚尖平稳落地，步幅轻小。' },
  { key: 'sit', name: '坐姿练习', secs: 120, info: '坐骨坐稳，背部自然直立不僵硬，双肩下沉，双脚踩实地面。' }
];

const SKINCARE_AM = [
  { key: 'cleanse', name: '洁面' },
  { key: 'moist', name: '保湿' },
  { key: 'spf', name: '防晒' }
];
const SKINCARE_PM = [
  { key: 'cleanse', name: '洁面' },
  { key: 'serum', name: '精华' },
  { key: 'cream', name: '面霜' }
];

const HAIR_CHECKS = [
  { key: 'wash', name: '洗发' },
  { key: 'mask', name: '护发 / 发膜' },
  { key: 'ends', name: '发尾护理' },
  { key: 'blow', name: '认真吹发' }
];
const HAIR_TPLS = ['直发', '自然卷', '空气刘海', '八字刘海', '半扎发', '低马尾'];

const WARDROBE_CATS = ['连衣裙', '上衣', '半身裙', '外套', '鞋', '包', '饰品'];

const PAY_CATS = [
  { id: '餐饮', icon: '🍜' }, { id: '购物', icon: '🛍' }, { id: '交通', icon: '🚌' },
  { id: '娱乐', icon: '🎬' }, { id: '生活', icon: '🏠' }, { id: '学习', icon: '📚' },
  { id: '健康', icon: '💊' }, { id: '其他', icon: '💸' }
];

const WEEK_QUESTIONS = [
  ['q1', '我这周最满意的变化是什么？'],
  ['q2', '哪个习惯最容易坚持？'],
  ['q3', '哪个任务设计得太难？'],
  ['q4', '下周应该减少什么？'],
  ['q5', '下周最重要的一件事是什么？'],
  ['q6', '我是不是越来越接近自己喜欢的样子？']
];

const DEFAULT_SETTINGS = () => ({
  onboarded: false,
  identity: '我是一个热爱美、持续成长、拥有独立审美的人。\n我不追求完美，我追求今天比昨天更好一点。',
  goal: '打造自然、精致、轻盈、有个人风格的女性形象。',
  minActions: ['护肤完成', '步行 10 分钟', '化妆练习 5 分钟', '拍一张照片', '写一句复盘'],
  styleKeywords: ['Natural', 'Clean', 'Soft', 'Refined', 'Feminine', 'Japanese-inspired'],
  styleColors: [
    { name: 'Black', hex: '#2e2b29' }, { name: 'White', hex: '#fdfcfa' },
    { name: 'Cream', hex: '#f2e7d3' }, { name: 'Light Gray', hex: '#d8d6d2' },
    { name: 'Denim Blue', hex: '#7d95af' }
  ],
  skincareProducts: { am: {}, pm: {} },
  makeupTemplate: {},
  makeupFocus: {},
  bodyGoals: {},
  weekReviews: {},
  weekPlans: {},
  siteMilestones: [],
  projects: [],
  ideas: [],
  wardrobe: [],
  outfitTemplates: [
    { id: 'ot1', text: '黑色吊带连衣裙' }, { id: 'ot2', text: '白色吊带长裙' },
    { id: 'ot3', text: '米色长裙' }, { id: 'ot4', text: '牛仔外套 + 白色内搭' },
    { id: 'ot5', text: '日系休闲裙装' }
  ]
});

/* ── State ── */
let records = {};
let selectedDate = localDateKey();
let toastTimer;
let cloudClient;
let cloudSyncTimer;
let cloudPullTimer;
let selectedPayCat = '餐饮';
let currentPage = 'today';
let heatRange = '30';
let photoFilterVal = '全部';
let wardrobeFilterVal = '全部';
let weekOffset = 0;
let finYear = new Date().getFullYear();
let finMonth = new Date().getMonth();
let photoUploadType = '全身';
let makeupKind = 'after';
let posTimer = null;
const urlCache = {};

/* ── Helpers ── */
function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function nowTime() {
  return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
}
function uid() { return `${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function money(v) { return `¥${Number(v || 0).toFixed(2)}`; }
function escapeHTML(v = '') {
  return String(v).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c]);
}
function toast(msg) {
  clearTimeout(toastTimer);
  $('#toast').textContent = msg;
  $('#toast').classList.add('show');
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 2000);
}
function displayDate(dateKey, withYear = true) {
  const date = new Date(`${dateKey}T00:00:00`);
  return new Intl.DateTimeFormat('zh-CN', {
    ...(withYear ? { year: 'numeric' } : {}), month: 'long', day: 'numeric', weekday: 'short'
  }).format(date);
}
function shiftDate(dateKey, days) {
  const d = new Date(`${dateKey}T00:00:00`);
  d.setDate(d.getDate() + days);
  return localDateKey(d);
}
function dateKeys() { return Object.keys(records).filter((k) => DATE_RE.test(k)).sort(); }
function mondayOf(dateKey) {
  const d = new Date(`${dateKey}T00:00:00`);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return localDateKey(d);
}
function weekDays(mondayKey) {
  return Array.from({ length: 7 }, (_, i) => shiftDate(mondayKey, i));
}

/* ── Records / settings ── */
function blankRecord() {
  return {
    tasks: SELENE_TASKS.map((t) => ({ ...t, id: t.key, completed: false, completedAt: null, note: '', skipped: false })),
    review: {}, payments: [], makeup: {}, photos: [],
    body: {}, posture: {}, makeupSteps: {}, skincare: { am: {}, pm: {} },
    hair: { checks: {}, style: '', score: 0 }, outfit: {}, mood: {}, lowEnergy: false
  };
}

function loadRecords() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && typeof parsed === 'object') return parsed;
    return {};
  } catch { return {}; }
}

function getRecord(date = selectedDate) {
  if (!records[date]) records[date] = blankRecord();
  const r = records[date];
  r.tasks = Array.isArray(r.tasks) ? r.tasks : [];
  // newly added template tasks appear on today & future days (past days stay as recorded)
  if (date >= localDateKey() && r.tasks.some((t) => SELENE_TASKS.some((st) => st.key === (t.key || t.id)))) {
    SELENE_TASKS.forEach((st, idx) => {
      if (!r.tasks.some((t) => (t.key || t.id) === st.key)) {
        r.tasks.splice(Math.min(idx, r.tasks.length), 0, { ...st, id: st.key, completed: false, completedAt: null, note: '', skipped: false });
      }
    });
  }
  r.review = r.review || {};
  r.payments = Array.isArray(r.payments) ? r.payments : [];
  r.makeup = r.makeup || {};
  r.photos = Array.isArray(r.photos) ? r.photos : [];
  r.body = r.body || {};
  r.posture = r.posture || {};
  r.makeupSteps = r.makeupSteps || {};
  r.skincare = r.skincare || { am: {}, pm: {} };
  r.skincare.am = r.skincare.am || {};
  r.skincare.pm = r.skincare.pm || {};
  r.hair = r.hair || { checks: {}, style: '', score: 0 };
  r.hair.checks = r.hair.checks || {};
  r.outfit = r.outfit || {};
  r.mood = r.mood || {};
  r.creation = r.creation || {};
  return r;
}

function getSettings() {
  if (!records[SETTINGS_KEY] || typeof records[SETTINGS_KEY] !== 'object') {
    records[SETTINGS_KEY] = DEFAULT_SETTINGS();
  }
  const s = records[SETTINGS_KEY];
  const def = DEFAULT_SETTINGS();
  Object.keys(def).forEach((k) => { if (s[k] === undefined) s[k] = def[k]; });
  return s;
}

function saveRecords({ touch = true } = {}) {
  if (touch && records[selectedDate]) records[selectedDate].updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.warn('storage quota:', e);
    toast('本地存储空间不足，请导出备份后清理旧照片');
  }
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(syncCloud, 500);
}

function saveSettings() {
  getSettings().updatedAt = new Date().toISOString();
  saveRecords({ touch: false });
}

/* ── Cloud sync ── */
function setCloudStatus(message, state = '') {
  $('#cloudStatus').textContent = message;
  $('#cloudStatus').dataset.state = state;
}

function mergeRecords(localRecords, cloudRecords) {
  const merged = { ...localRecords };
  Object.entries(cloudRecords || {}).forEach(([key, cloudDay]) => {
    const localDay = localRecords[key];
    if (!localDay) { merged[key] = cloudDay; return; }
    const localTime = Date.parse(localDay.updatedAt || 0);
    const cloudTime = Date.parse(cloudDay.updatedAt || 0);
    merged[key] = cloudTime > localTime ? cloudDay : localDay;
  });
  return merged;
}

async function syncCloud() {
  if (!cloudClient) return;
  setCloudStatus('正在同步…', 'syncing');
  try {
    const { error } = await cloudClient
      .from(SUPABASE_TABLE)
      .upsert({ id: SUPABASE_RECORD_ID, records, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    if (error) throw error;
    setCloudStatus('已同步到云端 ☁', 'ok');
  } catch (error) {
    console.warn('Supabase sync unavailable:', error);
    setCloudStatus('已保存本地 · 云端稍后重试', 'error');
  }
}

async function pullCloud() {
  if (!cloudClient) return;
  const { data, error } = await cloudClient
    .from(SUPABASE_TABLE)
    .select('records')
    .eq('id', SUPABASE_RECORD_ID)
    .maybeSingle();
  if (error) throw error;
  const cloudRecords = data?.records || {};
  if (!cloudRecords || typeof cloudRecords !== 'object') return;
  const before = JSON.stringify(records);
  records = mergeRecords(records, cloudRecords);
  if (before === JSON.stringify(records)) return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch {}
  if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) renderPage();
}

async function initCloud() {
  if (!window.supabase?.createClient) { setCloudStatus('已保存在本地', 'error'); return; }
  try {
    cloudClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    await pullCloud();
    renderPage();
    await syncCloud();
    clearInterval(cloudPullTimer);
    cloudPullTimer = setInterval(() => {
      if (document.visibilityState === 'visible') pullCloud().catch((e) => console.warn('Supabase pull unavailable:', e));
    }, 15000);
  } catch (error) {
    console.warn('Supabase sync unavailable:', error);
    setCloudStatus('已保存在本地 · 云端稍后重试', 'error');
  }
}

/* ── Photo storage ── */
function compressImage(file, maxSize = 1080, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();
    reader.onload = () => { img.src = reader.result; };
    reader.onerror = reject;
    img.onload = () => {
      let { width, height } = img;
      if (width >= height && width > maxSize) { height = Math.round(height * maxSize / width); width = maxSize; }
      else if (height > width && height > maxSize) { width = Math.round(width * maxSize / height); height = maxSize; }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('compress failed'))), 'image/jpeg', quality);
    };
    img.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function storePhoto(file, tag) {
  const blob = await compressImage(file, cloudClient ? 1080 : 640, cloudClient ? 0.82 : 0.7);
  if (cloudClient) {
    const path = `${MAKEUP_NS}/${selectedDate}-${tag}-${Date.now()}.jpg`;
    const { error } = await cloudClient.storage.from(MAKEUP_BUCKET).upload(path, blob, { contentType: 'image/jpeg', upsert: false });
    if (!error) return path;
    console.warn('cloud upload failed, fallback to local:', error);
  }
  return blobToDataURL(blob);
}

async function resolvePhoto(src) {
  if (!src) return null;
  if (src.startsWith('data:')) return src;
  if (urlCache[src]) return urlCache[src];
  if (!cloudClient) return null;
  const { data, error } = await cloudClient.storage.from(MAKEUP_BUCKET).createSignedUrl(src, 3600);
  if (error) { console.warn('signed url:', error); return null; }
  urlCache[src] = data.signedUrl;
  return data.signedUrl;
}

/* ── Day metrics ── */
function activeTasks(day, dateKey) {
  const tasks = Array.isArray(day?.tasks) ? day.tasks : [];
  if (day?.lowEnergy) return tasks.filter((t) => LOW_ENERGY_KEYS.includes(t.key || t.id));
  return tasks;
}
function doneCountOf(day) {
  const tasks = Array.isArray(day?.tasks) ? day.tasks : [];
  return tasks.filter((t) => t.completed).length;
}
function targetOf(day) {
  if (day?.lowEnergy) return LOW_TARGET;
  return SUCCESS_TARGET;
}
function isSuccess(day) {
  if (!day) return false;
  return doneCountOf(day) >= targetOf(day);
}
function heatLevel(count) {
  if (count >= 7) return 3;
  if (count >= 5) return 2;
  if (count >= 3) return 1;
  return 0;
}
function calcStreak() {
  let streak = 0;
  let cursor = localDateKey();
  if (!isSuccess(records[cursor])) cursor = shiftDate(cursor, -1);
  while (isSuccess(records[cursor])) { streak += 1; cursor = shiftDate(cursor, -1); }
  return streak;
}
function longestStreak() {
  const keys = dateKeys();
  let best = 0, cur = 0, prev = null;
  keys.forEach((k) => {
    if (isSuccess(records[k])) {
      cur = (prev && shiftDate(prev, 1) === k) ? cur + 1 : 1;
      best = Math.max(best, cur);
      prev = k;
    }
  });
  return best;
}
function dayNumber() {
  const keys = dateKeys();
  const first = keys[0] || localDateKey();
  const diff = Math.round((new Date(`${localDateKey()}T00:00:00`) - new Date(`${first}T00:00:00`)) / 86400000);
  return Math.max(1, diff + 1);
}

/* ── Navigation ── */
function switchPage(page) {
  currentPage = page;
  $$('.page').forEach((s) => s.classList.toggle('active', s.id === `${page}Page`));
  $$('.nav-item').forEach((b) => b.classList.toggle('active', b.dataset.page === page));
  const activeNav = document.querySelector(`.nav-item[data-page="${page}"]`);
  activeNav?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  renderPage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPage() {
  if (getSettings().onboarded) $('#onboarding').style.display = 'none';
  if (currentPage === 'today') renderToday();
  if (currentPage === 'progress') renderProgress();
  if (currentPage === 'body') renderBody();
  if (currentPage === 'beauty') renderBeauty();
  if (currentPage === 'style') renderStyle();
  if (currentPage === 'review') renderReviewPage();
  if (currentPage === 'career') renderCareer();
  if (currentPage === 'finance') renderFinancePage();
  if (currentPage === 'profile') renderProfile();
}

/* ═══════════ 1. TODAY ═══════════ */
function greetingParts() {
  const h = new Date().getHours();
  const en = h < 12 ? 'Good morning, Selene.' : h < 18 ? 'Good afternoon, Selene.' : 'Good evening, Selene.';
  const keys = dateKeys().filter((k) => k < localDateKey());
  const broke = keys.length > 0 && !isSuccess(records[shiftDate(localDateKey(), -1)]) && calcStreak() === 0;
  const zh = broke ? '今天可以重新开始，不需要补回昨天。' : '今天不需要完美，只需要完成最小行动。';
  return { en, zh };
}

function statusText(done, target, total) {
  if (done === 0) return { text: '今天还没有开始。先完成一个最小行动。', neutral: true };
  if (done < target) return { text: '你已经开始了。不需要一次做完。', neutral: true };
  if (done < total) return { text: 'Today counts. 今天已经算成功 ✧', neutral: false };
  return { text: 'A gentle, complete day. 今天完成得很好 ❀', neutral: false };
}

function weekRateInfo() {
  const monday = mondayOf(localDateKey());
  const today = localDateKey();
  const days = weekDays(monday).filter((k) => k <= today);
  const ok = days.filter((k) => isSuccess(records[k])).length;
  return { ok, total: days.length, rate: days.length ? Math.round(ok / days.length * 100) : 0 };
}

function renderToday() {
  const day = getRecord();
  const isToday = selectedDate === localDateKey();

  $('#todayLabel').textContent = displayDate(selectedDate);
  $('#dayNumber').textContent = `PROJECT SELENE · DAY ${dayNumber()}`;
  $('#recordDate').value = selectedDate;

  $('#streakDays').textContent = calcStreak();
  const wr = weekRateInfo();
  $('#weekRate').textContent = `${wr.rate}%`;
  $('#weekRateSub').textContent = `${wr.ok} / ${wr.total} 天`;
  $('#totalDays').textContent = dateKeys().length;

  const g = greetingParts();
  $('#greetingEn').textContent = g.en;
  $('#greetingZh').textContent = g.zh;

  // yesterday's tomorrow-action
  const y = records[shiftDate(selectedDate, -1)];
  const act = (y?.review?.tomorrow || y?.review?.improve || '').trim();
  $('#tomorrowBanner').style.display = act && isToday ? '' : 'none';
  $('#tomorrowBannerText').textContent = act;

  // progress
  const tasks = activeTasks(day);
  const visible = tasks.filter((t) => !t.skipped);
  const done = tasks.filter((t) => t.completed).length;
  const target = targetOf(day);
  $('#doneCount').textContent = done;
  $('#targetCount').textContent = visible.length;
  $('#taskCount').textContent = `${done} / ${visible.length}`;
  $('#thresholdHint').textContent = target;
  $('#progressFill').style.width = `${visible.length ? Math.min(100, Math.round(done / visible.length * 100)) : 0}%`;
  const st = statusText(done, target, visible.length);
  $('#progressStatus').textContent = st.text;
  $('#progressStatus').classList.toggle('neutral', st.neutral);
  $('#lowEnergyBtn').classList.toggle('on', !!day.lowEnergy);
  $('#lowEnergyBtn').textContent = day.lowEnergy ? '☾ 低能量模式 · 开' : '☾ 低能量模式';

  // task list
  $('#taskList').innerHTML = tasks.map((t) => `
    <div class="task-item ${t.completed ? 'done' : ''} ${t.skipped ? 'skipped' : ''}" data-id="${escapeHTML(t.id)}">
      <input class="task-check" type="checkbox" ${t.completed ? 'checked' : ''} ${t.skipped ? 'disabled' : ''} aria-label="完成">
      <div class="task-main">
        <span class="task-title">${t.icon ? `<span class="task-icon">${t.icon}</span>` : ''}${escapeHTML(t.title)}</span>
        ${t.desc ? `<span class="task-desc">${escapeHTML(t.desc)}</span>` : ''}
        ${t.completedAt ? `<span class="task-time">完成于 ${escapeHTML(t.completedAt)}</span>` : ''}
        ${t.note ? `<span class="task-note-text">✎ ${escapeHTML(t.note)}</span>` : ''}
        ${t.skipped ? `<span class="task-note-text">今日跳过</span>` : ''}
      </div>
      <div class="task-actions">
        <button class="task-act" data-act="note" type="button" aria-label="备注">✎</button>
        <button class="task-act" data-act="skip" type="button" aria-label="跳过">⊘</button>
        ${t.cat === '自定义' || t.category === '自定义' ? `<button class="task-act" data-act="del" type="button" aria-label="删除">×</button>` : ''}
      </div>
    </div>`).join('') || '<div class="empty-state">今天还没有任务。</div>';

  // mood
  $('#moodChips').innerHTML = MOODS.map((m) => `
    <button class="mood-chip ${day.mood.v === m.v ? 'active' : ''}" data-mood="${m.v}" type="button">
      <span class="mc-face">${m.face}</span><span class="mc-name">${m.v}</span>
    </button>`).join('');
  if (document.activeElement !== $('#moodNote')) $('#moodNote').value = day.mood.note || '';

  renderTodayPhotos();

  // mini review
  if (document.activeElement?.form !== $('#miniReviewForm')) {
    $('#rvBest').value = day.review.best || day.review.done || '';
    $('#rvImproveToday').value = day.review.improveToday || '';
    $('#rvTomorrow').value = day.review.tomorrow || day.review.improve || '';
  }
}

async function renderTodayPhotos() {
  const day = getRecord();
  const grid = $('#todayPhotoGrid');
  if (!day.photos.length) { grid.innerHTML = ''; return; }
  const items = await Promise.all(day.photos.map(async (p) => {
    const url = await resolvePhoto(p.src);
    if (!url) return '';
    return `
      <div class="photo-item" data-id="${escapeHTML(p.id)}">
        <img src="${url}" alt="" data-view="1">
        <span class="photo-type-tag">${escapeHTML(p.type)}</span>
        <button class="photo-del" data-pact="del" type="button">×</button>
        <button class="photo-del" data-pact="note" type="button" style="top:30px">✎</button>
        ${p.note ? `<span class="photo-note-tag">${escapeHTML(p.note)}</span>` : ''}
      </div>`;
  }));
  grid.innerHTML = items.join('');
}

function renderPayments() {
  const payments = getRecord().payments;
  const total = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
  $('#paymentMiniTotal').textContent = money(total);
  $('#paymentEmpty').hidden = payments.length > 0;
  $('#payCatChips').innerHTML = PAY_CATS.map((c) => `
    <div class="payment-cat-chip ${selectedPayCat === c.id ? 'active' : ''}" data-cat="${c.id}">${c.icon} ${c.id}</div>`).join('');
  $('#paymentList').innerHTML = payments.map((p) => `
    <div class="payment-row" data-id="${p.id}">
      <div class="pay-cat-icon">${catIcon(p.category)}</div>
      <div style="flex:1;min-width:0">
        <span class="payment-name">${escapeHTML(p.item)}</span>
        <span class="payment-meta">${escapeHTML(p.time)} · ${escapeHTML(p.method)}${p.note ? ` · ${escapeHTML(p.note)}` : ''}</span>
      </div>
      <span class="payment-amount">${money(p.amount)}</span>
      <button class="delete-button" type="button" aria-label="删除">×</button>
    </div>`).join('');
}

function catIcon(cat) { return PAY_CATS.find((c) => c.id === cat)?.icon || '💸'; }

/* ═══════════ 2. PROGRESS ═══════════ */
function renderProgress() {
  renderHeatmap();
  renderProgressStats();
  renderCatChart();
  renderCompareControls();
  renderPhotoTimeline();
}

function renderHeatmap() {
  const today = localDateKey();
  let start;
  if (heatRange === 'all') {
    const first = dateKeys()[0] || today;
    start = first;
    const span = Math.round((new Date(today) - new Date(first)) / 86400000);
    if (span > 180) start = shiftDate(today, -180);
  } else {
    start = shiftDate(today, -(Number(heatRange) - 1));
  }
  start = mondayOf(start);

  let html = '<div class="heat-week-head"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></div>';
  let cursor = start;
  let lastMonth = '';
  while (cursor <= today) {
    const wk = weekDays(cursor);
    const monthLabel = `${Number(cursor.slice(5, 7))}月`;
    if (monthLabel !== lastMonth) {
      html += `<p class="heat-month-label">${cursor.slice(0, 4)}年${monthLabel}</p>`;
      lastMonth = monthLabel;
    }
    html += '<div class="heat-row">' + wk.map((k) => {
      if (k > today) return '<span class="heat-cell blank"></span>';
      const c = doneCountOf(records[k]);
      const lv = heatLevel(c);
      return `<span class="heat-cell ${lv ? `l${lv}` : ''} ${k === today ? 'today-cell' : ''}" title="${k} · ${c} 项">${Number(k.slice(8, 10))}</span>`;
    }).join('') + '</div>';
    cursor = shiftDate(cursor, 7);
  }
  $('#heatmap').innerHTML = html;
}

function renderProgressStats() {
  const keys = dateKeys();
  const successDays = keys.filter((k) => isSuccess(records[k])).length;
  const avg = keys.length ? (keys.reduce((s, k) => s + doneCountOf(records[k]), 0) / keys.length).toFixed(1) : '0';
  const now = new Date();
  const monthKeys = keys.filter((k) => k.startsWith(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`));
  const monthRate = monthKeys.length ? Math.round(monthKeys.filter((k) => isSuccess(records[k])).length / monthKeys.length * 100) : 0;
  const stats = [
    [keys.length, '总记录天数'],
    [successDays, '成功天数 ≥5项'],
    [calcStreak(), '当前连续天数'],
    [longestStreak(), '最长连续天数'],
    [avg, '平均每日完成数'],
    [`${monthRate}%`, '本月完成率']
  ];
  $('#progressStats').innerHTML = stats.map(([v, l]) => `<div class="stat-box"><strong>${v}</strong><span>${l}</span></div>`).join('');
}

function renderCatChart() {
  const cats = Object.keys(CAT_META);
  const days = Array.from({ length: 30 }, (_, i) => shiftDate(localDateKey(), i - 29));
  const W = 340, H = 150, P = 8;

  $('#catLegend').innerHTML = cats.map((c) => `<span><i style="background:${CAT_META[c]}"></i>${c}</span>`).join('');

  const series = cats.map((cat) => days.map((k) => {
    const tasks = (records[k]?.tasks || []).filter((t) => t.cat === cat);
    if (!tasks.length) return null;
    return tasks.filter((t) => t.completed).length / tasks.length;
  }));

  // smooth with trailing window of 5
  const smooth = series.map((vals) => vals.map((v, i) => {
    const win = vals.slice(Math.max(0, i - 4), i + 1).filter((x) => x !== null);
    if (v === null && !win.length) return null;
    return win.length ? win.reduce((a, b) => a + b, 0) / win.length : null;
  }));

  let paths = '';
  smooth.forEach((vals, si) => {
    let d = '';
    vals.forEach((v, i) => {
      if (v === null) { return; }
      const x = P + (i / (days.length - 1)) * (W - P * 2);
      const yy = H - P - v * (H - P * 2);
      d += d ? ` L ${x.toFixed(1)} ${yy.toFixed(1)}` : `M ${x.toFixed(1)} ${yy.toFixed(1)}`;
    });
    if (d) paths += `<path d="${d}" fill="none" stroke="${CAT_META[cats[si]]}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>`;
  });

  const grid = [0.25, 0.5, 0.75].map((f) => {
    const yy = H - P - f * (H - P * 2);
    return `<line x1="${P}" y1="${yy}" x2="${W - P}" y2="${yy}" stroke="#f0e8df" stroke-width="0.7"/>`;
  }).join('');

  $('#catChart').innerHTML = grid + (paths || `<text x="${W / 2}" y="${H / 2}" text-anchor="middle" fill="#b3aaa0" font-size="11">开始使用新任务后，这里会画出你的趋势</text>`);
}

function dayPhotoEntries(k) {
  const day = records[k];
  if (!day) return [];
  const out = [];
  (day.photos || []).forEach((p) => out.push({ src: p.src, type: p.type, note: p.note, date: k }));
  if (day.makeup?.before) out.push({ src: day.makeup.before, type: '妆容', note: '素颜 before', date: k });
  if (day.makeup?.after) out.push({ src: day.makeup.after, type: '妆容', note: '妆后 after', date: k });
  if (day.outfit?.photo) out.push({ src: day.outfit.photo, type: '穿搭', note: '', date: k });
  return out;
}

function photoDays() {
  return dateKeys().filter((k) => dayPhotoEntries(k).length > 0);
}

function renderCompareControls() {
  const days = photoDays();
  const selA = $('#compareA'), selB = $('#compareB');
  const opts = days.map((d) => `<option value="${d}">${d}</option>`).join('');
  const prevA = selA.value, prevB = selB.value;
  selA.innerHTML = opts; selB.innerHTML = opts;
  if (days.length) {
    selA.value = days.includes(prevA) ? prevA : days[0];
    selB.value = days.includes(prevB) ? prevB : days[days.length - 1];
  }
  renderCompareView();
}

async function renderCompareView() {
  const a = $('#compareA').value, b = $('#compareB').value;
  const view = $('#compareView');
  if (!a || !b) { view.innerHTML = '<p class="empty-state" style="padding:0 0 12px">上传照片后，可以在这里对比 Day 1 与现在。</p>'; return; }
  const pa = dayPhotoEntries(a)[0], pb = dayPhotoEntries(b)[0];
  const [ua, ub] = await Promise.all([resolvePhoto(pa?.src), resolvePhoto(pb?.src)]);
  view.innerHTML = `<div class="makeup-compare">
    <figure><img src="${ua || ''}" alt=""><figcaption>${a}</figcaption></figure>
    <figure><img src="${ub || ''}" alt=""><figcaption>${b}</figcaption></figure>
  </div>`;
}

async function renderPhotoTimeline() {
  const days = photoDays().slice().reverse();
  const tl = $('#photoTimeline');
  const entries = [];
  days.forEach((k) => {
    dayPhotoEntries(k).forEach((e) => {
      if (photoFilterVal === '全部' || e.type === photoFilterVal) entries.push(e);
    });
  });
  if (!entries.length) {
    tl.innerHTML = '<p class="empty-state" style="grid-column:1/-1;padding:0 0 8px">还没有这类照片，慢慢记录就好 ✿</p>';
    return;
  }
  const items = await Promise.all(entries.slice(0, 60).map(async (e) => {
    const url = await resolvePhoto(e.src);
    if (!url) return '';
    return `<button class="makeup-tl-item" type="button" data-url="${url}" data-date="${e.date}"><img src="${url}" alt="" loading="lazy"><span>${e.date.slice(5)} · ${e.type}</span></button>`;
  }));
  tl.innerHTML = items.join('');
}

/* ═══════════ 3. BODY ═══════════ */
const BODY_FIELDS = [
  ['weight', 'bWeight'], ['waist', 'bWaist'], ['hip', 'bHip'], ['thigh', 'bThigh'],
  ['arm', 'bArm'], ['steps', 'bSteps'], ['sleep', 'bSleep'], ['exercise', 'bExercise']
];

function renderBody() {
  const day = getRecord();
  BODY_FIELDS.forEach(([k, id]) => {
    const el = $(`#${id}`);
    if (document.activeElement !== el) el.value = day.body[k] ?? '';
  });
  renderBodyTrends();
  renderPosture();
  renderBodyGoals();
}

function bodySeries(metric) {
  return dateKeys().map((k) => {
    const b = records[k]?.body || {};
    let v = null;
    if (metric === 'whr') {
      if (b.waist && b.hip) v = Number((b.waist / b.hip).toFixed(3));
    } else if (b[metric] !== undefined && b[metric] !== null && b[metric] !== '') {
      v = Number(b[metric]);
    }
    return v === null || Number.isNaN(v) ? null : { date: k, v };
  }).filter(Boolean);
}

function sparkSVG(points, color = '#d99a93') {
  if (points.length < 2) return '<p class="trend-empty">记录 2 次以上后出现趋势线</p>';
  const vals = points.map((p) => p.v);
  const min = Math.min(...vals), max = Math.max(...vals);
  const span = max - min || 1;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * 100;
    const yy = 30 - ((v - min) / span) * 24 + 2;
    return `${x.toFixed(1)},${yy.toFixed(1)}`;
  }).join(' ');
  return `<svg viewBox="0 0 100 34" preserveAspectRatio="none">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function renderBodyTrends() {
  const metrics = [
    ['weight', '体重趋势', 'kg', '#d99a93'],
    ['waist', '腰围趋势', 'cm', '#c9a86b'],
    ['whr', '腰臀比趋势', '', '#7e96ac'],
    ['steps', '步数趋势', '步', '#86987f']
  ];
  $('#bodyTrends').innerHTML = metrics.map(([m, name, unit, color]) => {
    const pts = bodySeries(m).slice(-45);
    const last = pts[pts.length - 1];
    return `<div class="trend-item">
      <div class="trend-top">
        <span class="trend-name">${name}</span>
        <span class="trend-val">${last ? `${last.v}` : '—'} <small>${unit}${last ? ` · ${last.date.slice(5)}` : ''}</small></span>
      </div>
      ${sparkSVG(pts, color)}
    </div>`;
  }).join('');
}

function renderPosture() {
  const day = getRecord();
  $('#postureList').innerHTML = POSTURE_EX.map((ex) => {
    const done = !!day.posture[ex.key];
    return `<div class="pos-item" data-key="${ex.key}">
      <div class="pos-row">
        <div class="pos-name" data-pos="info">${escapeHTML(ex.name)}<small>点击查看动作说明</small></div>
        <button class="pos-timer-btn" data-pos="timer" data-secs="${ex.secs}" type="button">⏱ ${Math.round(ex.secs / 60) || 1} 分</button>
        <button class="pos-done-btn ${done ? 'done' : ''}" data-pos="done" type="button">${done ? '✓ 已完成' : '打卡'}</button>
      </div>
      <p class="pos-info">${escapeHTML(ex.info)}</p>
    </div>`;
  }).join('');
}

function renderBodyGoals() {
  const s = getSettings();
  const wk = mondayOf(localDateKey());
  const goals = s.bodyGoals[wk] || [];
  $('#bodyGoalList').innerHTML = goals.length ? goals.map((g) => `
    <div class="goal-item ${g.done ? 'done' : ''}" data-id="${g.id}">
      <input class="task-check" type="checkbox" ${g.done ? 'checked' : ''}>
      <span class="goal-text-span">${escapeHTML(g.text)}</span>
      <button class="delete-button" type="button">×</button>
    </div>`).join('') : '<div class="empty-state">本周还没有目标 · 设 1–3 个就好</div>';
}

/* ═══════════ 4. BEAUTY ═══════════ */
function renderBeauty() {
  renderMakeupFocus();
  renderMakeupSteps();
  renderMakeupAlbum();
  renderMakeupTpl();
  renderSkincare();
  renderHair();
}

function renderMakeupFocus() {
  const s = getSettings();
  const wk = mondayOf(localDateKey());
  const focus = s.makeupFocus[wk] || '';
  $('#focusChips').innerHTML = MAKEUP_STEPS.map((st) => `
    <button class="focus-chip ${focus === st.key ? 'active' : ''}" data-focus="${st.key}" type="button">${st.name}</button>`).join('');
}

function renderMakeupSteps() {
  const day = getRecord();
  const s = getSettings();
  const focus = s.makeupFocus[mondayOf(localDateKey())] || '';
  const practiced = MAKEUP_STEPS.filter((st) => day.makeupSteps[st.key]?.done).length;
  $('#makeupPracticeBadge').textContent = `今日 ${practiced} / ${MAKEUP_STEPS.length}`;
  $('#makeupSteps').innerHTML = MAKEUP_STEPS.map((st) => {
    const d = day.makeupSteps[st.key] || {};
    const skill = d.skill || 0;
    return `<div class="mk-step ${d.done ? 'done' : ''} ${d.open ? 'open' : ''}" data-step="${st.key}">
      <div class="mk-step-row" data-mk="toggle">
        <span class="mk-step-icon">${st.icon}</span>
        <span class="mk-step-name">${st.name}${focus === st.key ? '<span class="mk-focus-tag">本周重点</span>' : ''}</span>
        <span class="star-row sm">${[1, 2, 3, 4, 5].map((n) => `<button class="star ${n <= skill ? 'on' : ''}" data-mk="star" data-n="${n}" type="button">★</button>`).join('')}</span>
        <span class="mk-step-check" data-mk="check">✓</span>
      </div>
      <div class="mk-step-detail">
        <input data-mk="products" placeholder="使用产品" value="${escapeHTML(d.products || '')}" maxlength="80">
        <input data-mk="problems" placeholder="遇到的问题" value="${escapeHTML(d.problems || '')}" maxlength="120">
        <input data-mk="next" placeholder="下次改进点" value="${escapeHTML(d.next || '')}" maxlength="120">
      </div>
    </div>`;
  }).join('');
}

async function setMakeupSlot(sel, emoji, label, path) {
  const slot = $(sel);
  const url = await resolvePhoto(path);
  slot.innerHTML = url
    ? `<img class="ms-photo" src="${url}" alt=""><span class="ms-retake">换一张</span>`
    : `<span class="ms-emoji">${emoji}</span><span class="ms-label">${label}</span>`;
}

function makeupAlbumDays() {
  return dateKeys().filter((d) => records[d]?.makeup && (records[d].makeup.before || records[d].makeup.after));
}

async function renderMakeupAlbum() {
  $('#makeupDateLabel').textContent = displayDate(selectedDate, false);
  const makeup = getRecord().makeup;
  await setMakeupSlot('#slotBefore', '📷', '素颜 before', makeup.before);
  await setMakeupSlot('#slotAfter', '💄', '妆后 after', makeup.after);

  const days = makeupAlbumDays();
  const card = $('#makeupCompareCard');
  if (days.length >= 2) {
    const first = days[0], last = days[days.length - 1];
    const fu = await resolvePhoto(records[first].makeup.after || records[first].makeup.before);
    const lu = await resolvePhoto(records[last].makeup.after || records[last].makeup.before);
    $('#makeupCompare').innerHTML = `<div class="makeup-compare">
      <figure><img src="${fu || ''}" alt=""><figcaption>最早 · ${first}</figcaption></figure>
      <figure><img src="${lu || ''}" alt=""><figcaption>最近 · ${last}</figcaption></figure>
    </div>`;
    card.style.display = '';
  } else {
    card.style.display = 'none';
  }
}

function renderMakeupTpl() {
  const t = getSettings().makeupTemplate || {};
  const map = { mtBase: 'base', mtBrow: 'brow', mtShadow: 'shadow', mtLiner: 'liner', mtBlush: 'blush', mtLip: 'lip', mtTime: 'time' };
  Object.entries(map).forEach(([id, k]) => {
    const el = $(`#${id}`);
    if (document.activeElement !== el) el.value = t[k] ?? '';
  });
  renderStars($('#mtStars'), t.score || 0);
}

function renderStars(container, value) {
  container.innerHTML = [1, 2, 3, 4, 5].map((n) => `<button class="star ${n <= value ? 'on' : ''}" data-n="${n}" type="button">★</button>`).join('');
}

function renderSkincare() {
  const day = getRecord();
  const s = getSettings();
  const build = (items, part) => items.map((it) => `
    <div class="sk-item" data-part="${part}" data-key="${it.key}">
      <input class="task-check" type="checkbox" ${day.skincare[part][it.key] ? 'checked' : ''}>
      <span class="sk-name">${it.name}</span>
      <input class="sk-product" placeholder="使用产品（可选）" maxlength="40" value="${escapeHTML(s.skincareProducts[part]?.[it.key] || '')}">
    </div>`).join('');
  $('#skincareAM').innerHTML = build(SKINCARE_AM, 'am');
  $('#skincarePM').innerHTML = build(SKINCARE_PM, 'pm');
}

function renderHair() {
  const day = getRecord();
  $('#hairChecks').innerHTML = HAIR_CHECKS.map((h) => `
    <div class="sk-item" data-hair="${h.key}">
      <input class="task-check" type="checkbox" ${day.hair.checks[h.key] ? 'checked' : ''}>
      <span class="sk-name">${h.name}</span>
    </div>`).join('');
  $('#hairTplChips').innerHTML = HAIR_TPLS.map((t) => `
    <button class="focus-chip ${day.hair.style === t ? 'active' : ''}" data-hairtpl="${t}" type="button">${t}</button>`).join('');
  if (document.activeElement !== $('#hairStyle')) $('#hairStyle').value = day.hair.style || '';
  renderStars($('#hairStars'), day.hair.score || 0);
}

/* ═══════════ 5. STYLE ═══════════ */
function renderStyle() {
  const s = getSettings();
  $('#styleKeywords').innerHTML = s.styleKeywords.map((k) => `<span class="kw-chip">${escapeHTML(k)}</span>`).join('');
  $('#styleColors').innerHTML = s.styleColors.map((c) => `
    <div class="color-card"><div class="color-swatch" style="background:${escapeHTML(c.hex)}"></div><span>${escapeHTML(c.name)}</span></div>`).join('');

  const of = getRecord().outfit;
  const map = { ofTop: 'top', ofBottom: 'bottom', ofShoes: 'shoes', ofBag: 'bag', ofAcc: 'acc', ofHair: 'hair', ofWhy: 'why' };
  Object.entries(map).forEach(([id, k]) => {
    const el = $(`#${id}`);
    if (document.activeElement !== el) el.value = of[k] || '';
  });
  renderStars($('#ofStars'), of.score || 0);
  renderOutfitPhoto();

  $('#outfitTplList').innerHTML = s.outfitTemplates.length ? s.outfitTemplates.map((t) => `
    <div class="tpl-row" data-id="${t.id}">
      <span class="tpl-name">${escapeHTML(t.text)}</span>
      <button class="tpl-use" type="button">→ 今日穿搭</button>
      <button class="delete-button" type="button">×</button>
    </div>`).join('') : '<div class="empty-state">收藏几套固定搭配，选择困难时直接用。</div>';

  renderWardrobe();
}

async function renderOutfitPhoto() {
  const of = getRecord().outfit;
  const box = $('#ofPhotoPreview');
  if (!of.photo) { box.innerHTML = ''; return; }
  const url = await resolvePhoto(of.photo);
  box.innerHTML = url ? `<img src="${url}" alt="">` : '';
}

function renderWardrobe() {
  const s = getSettings();
  const cats = ['全部', ...WARDROBE_CATS];
  $('#wardrobeFilter').innerHTML = cats.map((c) => `
    <button class="${wardrobeFilterVal === c ? 'active' : ''}" data-wf="${c}" type="button">${c}</button>`).join('');
  const items = s.wardrobe.filter((w) => wardrobeFilterVal === '全部' || w.cat === wardrobeFilterVal);
  $('#wardrobeBadge').textContent = `${s.wardrobe.length} 件`;
  $('#wardrobeGrid').innerHTML = items.map((w) => `
    <div class="wardrobe-card" data-id="${w.id}">
      <b>${escapeHTML(w.name)}</b>
      <p>${escapeHTML(w.cat)}${w.color ? ` · ${escapeHTML(w.color)}` : ''}${w.season ? ` · ${escapeHTML(w.season)}` : ''}</p>
      <button class="delete-button" type="button">×</button>
    </div>`).join('');
}

/* ═══════════ 6. REVIEW ═══════════ */
function taskTitleByKey(key) {
  return SELENE_TASKS.find((t) => t.key === key)?.title || key;
}

function renderReviewPage() {
  const monday = shiftDate(mondayOf(localDateKey()), weekOffset * 7);
  const days = weekDays(monday);
  const fmt = (k) => `${Number(k.slice(5, 7))}月${Number(k.slice(8, 10))}日`;
  $('#weekLabel').textContent = `${fmt(days[0])} – ${fmt(days[6])}`;
  $('#weekNext').disabled = weekOffset >= 0;
  $('#weekNext').style.opacity = weekOffset >= 0 ? 0.35 : 1;

  // week stats
  const today = localDateKey();
  const activeDays = days.filter((k) => k <= today);
  const successDays = activeDays.filter((k) => isSuccess(records[k])).length;
  const avgDone = activeDays.length
    ? (activeDays.reduce((s, k) => s + doneCountOf(records[k]), 0) / activeDays.length).toFixed(1) : '0';

  const keyCount = {};
  activeDays.forEach((k) => (records[k]?.tasks || []).forEach((t) => {
    const kk = t.key || t.id;
    keyCount[kk] = keyCount[kk] || { done: 0, total: 0, title: t.title };
    keyCount[kk].total += 1;
    if (t.completed) keyCount[kk].done += 1;
  }));
  const ranked = Object.values(keyCount).filter((x) => x.total >= 2);
  ranked.sort((a, b) => b.done / b.total - a.done / a.total || b.done - a.done);
  const stable = ranked[0]?.done ? ranked[0] : null;
  const weakest = ranked.length ? ranked[ranked.length - 1] : null;

  const count = (key) => activeDays.filter((k) => (records[k]?.tasks || []).some((t) => (t.key || t.id) === key && t.completed)).length;
  const makeupN = count('makeup');
  const postureN = count('posture');
  const walkN = count('walk');
  const photoN = activeDays.reduce((s, k) => s + dayPhotoEntries(k).length, 0);

  const short = (t) => (t || '—').replace(/ .*/, '').slice(0, 6);
  $('#weekStats').innerHTML = [
    [`${successDays}/${activeDays.length}`, '完成天数'],
    [avgDone, '平均完成任务'],
    [stable ? short(stable.title) : '—', '最稳定习惯'],
    [weakest && weakest.done / weakest.total < 0.5 ? short(weakest.title) : '—', '最易跳过'],
    [makeupN, '化妆练习'],
    [postureN, '仪态练习'],
    [walkN, '运动次数'],
    [photoN, '上传照片'],
    [calcStreak(), '当前连续']
  ].map(([v, l]) => `<div class="stat-box"><strong>${v}</strong><span>${l}</span></div>`).join('');

  // system summary
  const lines = [];
  if (stable) lines.push(`你本周最稳定的习惯是「${stable.title}」，完成了 ${stable.done} 天。`);
  if (weakest && weakest.done / weakest.total < 0.5) {
    lines.push(`「${weakest.title}」只完成了 ${weakest.done} 次，建议下周把它缩小成 5 分钟的最小版本。`);
  }
  if (successDays >= Math.ceil(activeDays.length / 2)) {
    lines.push(`你有 ${successDays} 天完成了至少 5 项，说明当前任务强度基本合适。`);
  } else if (activeDays.length >= 3) {
    lines.push('本周完成天数偏少，可以先只保证 3 个最小行动，不需要追求全部。');
  }
  if (!lines.length) lines.push('本周刚刚开始，先完成一个最小行动就很好。');
  $('#weekSummary').innerHTML = lines.map((l) => `<li>${l}</li>`).join('');

  // questions
  const s = getSettings();
  const ans = s.weekReviews[monday] || {};
  $('#weekQForm').innerHTML = WEEK_QUESTIONS.map(([k, q]) => `
    <div class="field full"><label for="wq-${k}">${q}</label><textarea id="wq-${k}" data-wq="${k}" rows="2">${escapeHTML(ans[k] || '')}</textarea></div>
  `).join('') + '<button class="primary-button full" type="submit">保存本周复盘</button>';

  // next week plan
  const nextMonday = shiftDate(monday, 7);
  const plan = s.weekPlans[nextMonday] || {};
  if (document.activeElement?.form !== $('#weekPlanForm')) {
    $('#wpBody').value = plan.body || '';
    $('#wpMakeup').value = plan.makeup || '';
    $('#wpLife').value = plan.life || '';
  }

  renderReviewSummary();
}

/* ── 30-day history summary (ported) ── */
const RV_WINDOW = 30;
const RV_MOOD_LABEL = {
  '很棒': '🥰 很棒', '开心': '😊 开心', '平静': '😌 平静', '疲惫': '😮‍💨 疲惫', '低落': '🥺 低落',
  'Calm': '😌 平静', 'Happy': '😊 开心', 'Tired': '😮‍💨 疲惫',
  'Anxious': '😥 焦虑', 'Confident': '😎 自信', 'Low Energy': '🥱 低能量'
};
const RV_KEYWORDS = [
  ['拖延 / 启动困难', /拖延|磨蹭|不想动|不想做|启动|开始不了|一直没开始/, 'neg'],
  ['刷手机 / 分心', /手机|短视频|分心|走神|刷/, 'neg'],
  ['能量不足 / 疲惫', /疲惫|疲倦|好累|很累|太累|没精神|没力气|乏/, 'neg'],
  ['睡眠不足', /失眠|晚睡|熬夜|睡不着|睡太晚|没睡好/, 'neg'],
  ['任务安排过多', /太多|做不完|排太满|贪多/, 'neg'],
  ['情绪内耗', /焦虑|烦躁|内耗|emo|自责|难过/, 'neg'],
  ['英语学习', /英语/, 'pos'],
  ['化妆 / 护肤', /化妆|护肤|妆容|画眉/, 'pos'],
  ['记账', /记账|记了账/, 'pos'],
  ['早起', /早起|起床后/, 'pos'],
  ['运动 / 走路', /运动|走路|锻炼|拉伸|散步/, 'pos'],
  ['阅读', /阅读|看书|读书/, 'pos']
];
const RV_TIME_BUCKETS = [
  ['上午', /上午|早上|一睁眼|醒来|起床后/, '容易分心 / 启动难'],
  ['下午', /下午|午后/, '容易能量下降'],
  ['晚上', /晚上|夜里|睡前|入睡前/, '动力和效率偏低']
];

function rvDayKeys(count, endOffset = 0) {
  const keys = [];
  const end = new Date();
  end.setDate(end.getDate() - endOffset);
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    keys.push(localDateKey(d));
  }
  return keys;
}

function rvMood(k) {
  return records[k]?.mood?.v || records[k]?.review?.mood || '';
}

function rvHasReview(k) {
  const r = records[k]?.review;
  const hasText = r && ['best', 'improveToday', 'tomorrow', 'done', 'undone', 'problems', 'improve', 'note'].some((f) => String(r[f] || '').trim());
  return hasText || Boolean(rvMood(k)) || Boolean(String(records[k]?.mood?.note || '').trim());
}

function rvCompletion(k) {
  const day = records[k];
  const tasks = day?.tasks;
  if (!Array.isArray(tasks) || !tasks.length) return 0;
  return Math.round(tasks.filter((t) => t.completed).length / tasks.length * 100);
}

function rvAvgCompletion(keys) {
  const active = keys.filter((k) => records[k]?.tasks?.some((t) => t.completed) || rvHasReview(k));
  if (!active.length) return null;
  return Math.round(active.reduce((s, k) => s + rvCompletion(k), 0) / active.length);
}

function rvReviewText(k, fields = ['best', 'improveToday', 'tomorrow', 'done', 'undone', 'problems', 'improve', 'note']) {
  const r = records[k]?.review || {};
  const moodNote = fields.includes('note') ? String(records[k]?.mood?.note || '') : '';
  return fields.map((f) => String(r[f] || '')).join(' ') + ' ' + moodNote;
}

function rvReviewStreak() {
  let streak = 0;
  const cursor = new Date();
  while (rvHasReview(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function rvSparkline(keys) {
  const svg = $('#rvSpark');
  const pts = keys.map((k, i) => {
    const x = keys.length > 1 ? (i / (keys.length - 1)) * 100 : 0;
    const yy = 33 - (rvCompletion(k) / 100) * 28;
    return [x.toFixed(1), yy.toFixed(1)];
  });
  const line = pts.map((p) => p.join(',')).join(' ');
  svg.innerHTML = `
    <polygon points="0,33 ${line} 100,33" fill="rgba(238,195,189,.3)"></polygon>
    <polyline points="${line}" fill="none" stroke="#c07b73" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"></polyline>`;
}

function renderReviewSummary() {
  const keys = rvDayKeys(RV_WINDOW);
  const reviewDays = keys.filter(rvHasReview);

  const fmt = (k) => `${Number(k.slice(5, 7))}月${Number(k.slice(8, 10))}日`;
  $('#rvRangeLabel').textContent = `基于最近 ${RV_WINDOW} 天（${fmt(keys[0])} – ${fmt(keys[keys.length - 1])}）的复盘记录`;

  const empty = reviewDays.length < 3;
  $('#rvEmpty').style.display = empty ? '' : 'none';
  $('#rvBody').style.display = empty ? 'none' : '';
  if (empty) return;

  rvSparkline(keys);
  const avg = rvAvgCompletion(keys) ?? 0;
  const prevAvg = rvAvgCompletion(rvDayKeys(RV_WINDOW, RV_WINDOW));
  $('#rvAvg').textContent = `${avg}%`;
  $('#rvDelta').textContent = prevAvg === null ? '' :
    avg > prevAvg ? `较上周期 ↑ ${avg - prevAvg}%` :
    avg < prevAvg ? `较上周期 ↓ ${prevAvg - avg}%` : '与上周期持平';

  $('#rvDays').textContent = `${reviewDays.length} 天`;
  const streak = rvReviewStreak();
  $('#rvStreak').textContent = streak ? `连续复盘 ${streak} 天` : '';

  const moodCount = {};
  reviewDays.forEach((k) => {
    const m = rvMood(k);
    if (m) moodCount[m] = (moodCount[m] || 0) + 1;
  });
  const topMoods = Object.entries(moodCount).sort((a, b) => b[1] - a[1]).slice(0, 3);
  $('#rvMoods').innerHTML = topMoods.length
    ? topMoods.map(([m, n]) => `<div class="rv-mood-row"><span>${RV_MOOD_LABEL[m] || m}</span><b>${n} 次</b></div>`).join('')
    : '<div class="rv-mood-row"><span>还没有心情记录</span></div>';

  const kwCount = RV_KEYWORDS.map(([label, re, tone]) => ({
    label, tone,
    n: reviewDays.filter((k) => re.test(rvReviewText(k))).length
  })).filter((k) => k.n > 0).sort((a, b) => b.n - a.n).slice(0, 10);
  $('#rvKeywords').innerHTML = kwCount.length
    ? kwCount.map((k) => `<span class="rv-kw ${k.tone}">${k.label}<b>${k.n}次</b></span>`).join('')
    : '<p class="empty-state" style="padding:0">复盘写得多一些，关键词会自己浮现出来。</p>';

  const timeCount = RV_TIME_BUCKETS.map(([label, re, desc]) => ({
    label, desc,
    n: reviewDays.filter((k) => re.test(rvReviewText(k, ['undone', 'problems', 'improveToday']))).length
  })).filter((t) => t.n > 0).sort((a, b) => b.n - a.n);
  $('#rvTimeCard').style.display = timeCount.length ? '' : 'none';
  $('#rvTimes').innerHTML = timeCount.map((t) =>
    `<div class="rv-time-row"><span class="rv-time-tag">◷ ${t.label}</span><span class="rv-time-desc">${t.desc}</span><b>${t.n} 次提到</b></div>`).join('');

  const progress = [];
  if (streak >= 3) progress.push(`已连续复盘 ${streak} 天，复盘越来越稳定了 ✨`);
  if (prevAvg !== null && avg > prevAvg) progress.push(`平均完成率比上个周期提升了 ${avg - prevAvg}%`);
  if (kwCount.some((k) => k.tone === 'neg')) progress.push('开始能识别自己的卡点了');
  const posKw = kwCount.filter((k) => k.tone === 'pos').slice(0, 2);
  if (posKw.length) progress.push(`「${posKw.map((k) => k.label).join('」「')}」在慢慢累积中 💛`);
  if (!progress.length) progress.push('已经开始记录自己，这就是最重要的一步 💛');
  $('#rvProgress').innerHTML = progress.slice(0, 4).map((p) => `<li>${p}</li>`).join('');

  const advice = [];
  const kwTop = kwCount.map((k) => k.label);
  if (kwTop[0] && kwCount[0].tone === 'neg') advice.push(`「${kwTop[0]}」出现频率较高，建议把最重要的一件事放在起床后先做。`);
  if ((moodCount['疲惫'] || 0) + (moodCount['低落'] || 0) + (moodCount['Tired'] || 0) + (moodCount['Low Energy'] || 0) >= reviewDays.length / 3) {
    advice.push('「疲惫 / 低能量」占比不小，晚间安排以恢复和整理为主，别排硬任务。');
  }
  if (kwTop.includes('刷手机 / 分心')) advice.push('分心多和手机有关，做核心事时试着把手机放到视线之外。');
  advice.push('同时推进的事越少越容易坚持，选 1–2 个核心任务深耕就好。');
  $('#rvAdvice').innerHTML = advice.slice(0, 3).map((a) => `<li>${a}</li>`).join('');
}

async function rvCopyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy'); ta.remove(); return ok;
  }
}

/* ═══════════ 7. PROFILE ═══════════ */
function renderProfile() {
  const s = getSettings();
  $('#identityText').textContent = s.identity;
  $('#goalText').textContent = s.goal;
  $('#minActionList').innerHTML = s.minActions.map((a) => `<li>${escapeHTML(a)}</li>`).join('');
}

/* ═══════════ CAREER ═══════════ */
function hasPost(k) {
  const day = records[k];
  if (!day) return false;
  if (String(day.creation?.text || '').trim()) return true;
  return (day.tasks || []).some((t) => (t.key || t.id) === 'xpost' && t.completed);
}

function postStreak() {
  let streak = 0;
  let cursor = localDateKey();
  if (!hasPost(cursor)) cursor = shiftDate(cursor, -1);
  while (hasPost(cursor)) { streak += 1; cursor = shiftDate(cursor, -1); }
  return streak;
}

function migrateSiteMilestones() {
  const s = getSettings();
  if (Array.isArray(s.siteMilestones) && s.siteMilestones.length && !s.projects.length) {
    s.projects.push({
      id: uid(), name: 'Daily Negentropy 网站', type: '网站', goal: '',
      status: 'active', createdAt: new Date().toISOString(),
      tasks: s.siteMilestones.map((m) => ({ id: m.id, text: m.text, done: !!m.done })),
      logs: []
    });
    s.siteMilestones = [];
    saveSettings();
  }
}

function projectLastPush(p) {
  return p.logs?.[0]?.date || null;
}

function daysSince(dateKey) {
  if (!dateKey) return null;
  return Math.round((new Date(`${localDateKey()}T00:00:00`) - new Date(`${dateKey}T00:00:00`)) / 86400000);
}

function nudgeText(p) {
  if (p.status === 'done') return '已完成 ❀';
  if (p.status === 'paused') return '暂停中 · 想回来时它一直都在';
  const d = daysSince(projectLastPush(p));
  if (d === null) return '还没有推进记录 · 写下第一条吧';
  if (d === 0) return '今天已推进 ✓';
  if (d === 1) return '昨天推进过 · 今天继续一小步';
  if (d <= 3) return `${d} 天没推进了 · 一个小改动就好`;
  return `已经 ${d} 天没推进了 · 今天挪一小步就算赢`;
}

const PROJ_STATUS = [['active', '进行中'], ['paused', '暂停'], ['done', '完成']];

function renderProjects() {
  const s = getSettings();
  const order = { active: 0, paused: 1, done: 2 };
  const projects = s.projects.slice().sort((a, b) => (order[a.status] ?? 0) - (order[b.status] ?? 0));
  $('#projectBadge').textContent = `${s.projects.filter((p) => p.status === 'active').length} 个进行中`;
  const openIds = new Set([...document.querySelectorAll('#projectList details[open]')].map((d) => d.dataset.id));

  $('#projectList').innerHTML = projects.length ? projects.map((p) => {
    const total = p.tasks.length;
    const done = p.tasks.filter((t) => t.done).length;
    const pct = total ? Math.round(done / total * 100) : 0;
    const stale = p.status === 'active' && (daysSince(projectLastPush(p)) ?? 99) > 3;
    return `<details class="proj-card ${p.status}" data-id="${p.id}" ${openIds.has(p.id) ? 'open' : ''}>
      <summary class="proj-head">
        <div class="proj-title">
          <b>${escapeHTML(p.name)}</b><span class="proj-type">${escapeHTML(p.type)}</span>
          <small class="proj-nudge ${stale ? 'stale' : ''}">${nudgeText(p)}</small>
        </div>
        <span class="proj-pct">${pct}<small>%</small></span>
      </summary>
      <div class="proj-body">
        ${p.goal ? `<p class="proj-goal">◎ ${escapeHTML(p.goal)}</p>` : ''}
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <p class="proj-meta">${done} / ${total} 个子任务完成</p>
        <div class="proj-status-row">
          ${PROJ_STATUS.map(([v, l]) => `<button class="focus-chip ${p.status === v ? 'active' : ''}" data-pstatus="${v}" type="button">${l}</button>`).join('')}
          <button class="task-act proj-del" data-pdel="1" type="button" aria-label="删除项目">×</button>
        </div>
        <p class="proj-sub">子任务</p>
        ${p.tasks.map((t) => `
          <div class="goal-item proj-task" data-tid="${t.id}">
            <input class="task-check" type="checkbox" ${t.done ? 'checked' : ''}>
            <span class="goal-text-span ${t.done ? 'ptask-done' : ''}">${escapeHTML(t.text)}</span>
            <button class="delete-button" type="button">×</button>
          </div>`).join('')}
        <form class="inline-form proj-task-form">
          <input type="text" maxlength="60" placeholder="添加一个子任务…" required>
          <button type="submit">添加</button>
        </form>
        <p class="proj-sub">推进日志</p>
        ${(p.logs || []).slice(0, 5).map((lg) => `
          <div class="post-row"><span class="post-date">${lg.date.slice(5)}</span><span class="post-text">${escapeHTML(lg.text)}</span></div>`).join('') || '<p class="proj-empty">每天记一句「今天推进了什么」，就是最好的监督。</p>'}
        <form class="inline-form proj-log-form">
          <input type="text" maxlength="100" placeholder="今天推进了什么…" required>
          <button type="submit">记下</button>
        </form>
      </div>
    </details>`;
  }).join('') : '<div class="empty-state">还没有项目 · 在下面创建第一个，让它每天被看见。</div>';
}

function renderCareer() {
  migrateSiteMilestones();
  const s = getSettings();
  const day = getRecord();
  const keys = dateKeys();
  const postKeys = keys.filter(hasPost);
  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthPosts = postKeys.filter((k) => k.startsWith(monthPrefix)).length;

  // days this week with any push (project log or website task)
  const monday = mondayOf(localDateKey());
  const logDates = new Set();
  s.projects.forEach((p) => (p.logs || []).forEach((lg) => logDates.add(lg.date)));
  const weekPush = weekDays(monday).filter((k) => k <= localDateKey() &&
    (logDates.has(k) || (records[k]?.tasks || []).some((t) => (t.key || t.id) === 'website' && t.completed))).length;

  $('#careerStats').innerHTML = [
    [s.projects.filter((p) => p.status === 'active').length, '进行中项目', '个'],
    [weekPush, '本周推进', '天'],
    [postStreak(), '连续发帖', '天'],
  ].map(([v, l, u]) => `<article class="stat-pill"><span>${l}</span><strong>${v}</strong><em>${u}</em></article>`).join('');

  renderProjects();

  $('#postStreakBadge').textContent = `连续 ${postStreak()} 天 · 本月 ${monthPosts}`;
  if (document.activeElement?.form !== $('#postForm')) {
    $('#postText').value = day.creation.text || '';
    $('#postLink').value = day.creation.link || '';
  }

  $('#ideaList').innerHTML = s.ideas.length ? s.ideas.map((i) => `
    <div class="goal-item idea-item" data-id="${i.id}">
      <span class="idea-dot">✧</span>
      <span class="goal-text-span">${escapeHTML(i.text)}</span>
      <button class="delete-button" type="button">×</button>
    </div>`).join('') : '<div class="empty-state">灵感随时会来，先备好一个抽屉。</div>';

  const posts = postKeys.slice().reverse().slice(0, 30).map((k) => {
    const c = records[k].creation || {};
    return `<div class="post-row">
      <span class="post-date">${k.slice(5)}</span>
      <span class="post-text">${escapeHTML(c.text || '已发帖 ✓')}</span>
      ${c.link ? `<a class="post-link" href="${escapeHTML(c.link)}" target="_blank" rel="noopener">↗</a>` : ''}
    </div>`;
  });
  $('#postTimeline').innerHTML = posts.length ? posts.join('') : '<div class="empty-state">还没有发帖记录，从今天的第一条开始 ✧</div>';
}

/* ═══════════ FINANCE ═══════════ */
function renderFinancePage() {
  renderPayments();
  renderFinance();
}

function renderFinance() {
  const ml = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  $('#finMonthLabel').textContent = `${finYear}年${ml[finMonth]}`;

  const todayKey = localDateKey();
  let monthTotal = 0, todayTotal = 0, count = 0;
  const catMap = {};
  const monthRecords = [];

  dateKeys().forEach((date) => {
    const day = records[date];
    const d = new Date(`${date}T00:00:00`);
    if (!Array.isArray(day.payments)) return;
    day.payments.forEach((p) => {
      const amt = Number(p.amount || 0);
      if (date === todayKey) todayTotal += amt;
      if (d.getFullYear() === finYear && d.getMonth() === finMonth) {
        monthTotal += amt;
        count++;
        const cat = p.category || '其他';
        catMap[cat] = (catMap[cat] || 0) + amt;
        monthRecords.push({ ...p, date });
      }
    });
  });

  const daysInMonth = new Date(finYear, finMonth + 1, 0).getDate();
  const now = new Date();
  const daysPassed = finYear === now.getFullYear() && finMonth === now.getMonth() ? now.getDate() : daysInMonth;
  const avg = daysPassed > 0 ? monthTotal / daysPassed : 0;

  $('#finRecordBadge').textContent = `${count} 笔`;
  $('#finStats').innerHTML = [
    [money(monthTotal), '本月支出'], [money(todayTotal), '今日支出'],
    [`${count} 笔`, '记录笔数'], [money(avg), '日均支出']
  ].map(([v, l]) => `<article class="stat-pill"><span>${l}</span><strong>${v}</strong></article>`).join('');

  const catSorted = PAY_CATS.map((c) => ({ ...c, amt: catMap[c.id] || 0 })).filter((c) => c.amt > 0).sort((a, b) => b.amt - a.amt);
  const maxAmt = catSorted[0]?.amt || 1;
  $('#finMethodBreakdown').innerHTML = catSorted.length
    ? catSorted.map(({ id, icon, amt }) => {
        const pct = monthTotal > 0 ? Math.round(amt / monthTotal * 100) : 0;
        const w = Math.round(amt / maxAmt * 100);
        return `<div class="fin-method-item"><div class="fin-method-top"><span class="fin-method-name">${icon} ${escapeHTML(id)}</span><span><span class="fin-method-amt">${money(amt)}</span><span class="fin-method-pct">${pct}%</span></span></div><div class="fin-bar-track"><div class="fin-bar-fill" style="width:${w}%"></div></div></div>`;
      }).join('')
    : '';

  monthRecords.sort((a, b) => b.date.localeCompare(a.date) || (b.time || '').localeCompare(a.time || ''));
  $('#finEmpty').hidden = monthRecords.length > 0;
  $('#finRecordList').innerHTML = monthRecords.map((p) => `
    <div class="fin-record-row">
      <div class="fin-cat-icon">${catIcon(p.category)}</div>
      <div class="fin-record-info">
        <div class="fin-record-name">${escapeHTML(p.item)}</div>
        <div class="fin-record-meta">${p.category ? escapeHTML(p.category) + ' · ' : ''}${escapeHTML(p.method || '')}${p.note ? ` · ${escapeHTML(p.note)}` : ''}</div>
      </div>
      <div style="text-align:right">
        <div class="fin-record-amt">${money(p.amount)}</div>
        <div class="fin-record-date">${p.date} ${p.time || ''}</div>
      </div>
    </div>`).join('');
}

/* ═══════════ Data export / import / clear ═══════════ */
function exportJSON() {
  const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `selene-backup-${localDateKey()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('已导出备份 ✓');
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || typeof data !== 'object') throw new Error('bad');
      if (!confirm('导入会与现有数据合并（同一天以较新的为准），继续吗？')) return;
      records = mergeRecords(records, data);
      saveRecords({ touch: false });
      renderPage();
      toast('数据已导入 ✓');
    } catch {
      toast('文件格式不对，导入失败');
    }
  };
  reader.readAsText(file);
}

function clearAll() {
  if (!confirm('确定要清空全部数据吗？此操作无法撤销。')) return;
  if (!confirm('再次确认：真的要删除所有记录、照片索引与设置吗？建议先导出备份。')) return;
  records = {};
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
  saveRecords({ touch: false });
  renderPage();
  toast('已清空全部数据');
}

/* ═══════════ Lightbox ═══════════ */
function openLightbox(url, caption) {
  $('#mlImg').src = url;
  $('#mlDate').textContent = caption || '';
  $('#makeupLightbox').classList.add('show');
}

/* ═══════════ Events ═══════════ */
function bindEvents() {
  // nav
  $$('.nav-item').forEach((b) => b.addEventListener('click', () => switchPage(b.dataset.page)));
  $('#jumpToday').addEventListener('click', () => { selectedDate = localDateKey(); switchPage('today'); });
  $('#recordDate').addEventListener('change', () => { selectedDate = $('#recordDate').value || localDateKey(); renderPage(); });

  /* ── Today ── */
  $('#lowEnergyBtn').addEventListener('click', () => {
    const day = getRecord();
    day.lowEnergy = !day.lowEnergy;
    saveRecords();
    renderToday();
    toast(day.lowEnergy ? '低能量模式已开启 · 完成 3 个最小任务就算成功' : '已回到完整任务');
  });

  $('#taskList').addEventListener('change', (e) => {
    if (!e.target.matches('.task-check')) return;
    const id = e.target.closest('.task-item').dataset.id;
    const task = getRecord().tasks.find((t) => t.id === id);
    if (!task) return;
    task.completed = e.target.checked;
    task.completedAt = task.completed ? nowTime() : null;
    saveRecords();
    renderToday();
  });

  $('#taskList').addEventListener('click', (e) => {
    const btn = e.target.closest('.task-act');
    if (!btn) return;
    const id = btn.closest('.task-item').dataset.id;
    const day = getRecord();
    const task = day.tasks.find((t) => t.id === id);
    if (!task) return;
    if (btn.dataset.act === 'note') {
      const note = prompt('给这个任务写一句备注：', task.note || '');
      if (note !== null) { task.note = note.trim(); saveRecords(); renderToday(); }
    } else if (btn.dataset.act === 'skip') {
      task.skipped = !task.skipped;
      if (task.skipped) { task.completed = false; task.completedAt = null; }
      saveRecords(); renderToday();
    } else if (btn.dataset.act === 'del') {
      day.tasks = day.tasks.filter((t) => t.id !== id);
      saveRecords(); renderToday();
    }
  });

  $('#taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = $('#taskInput').value.trim();
    if (!title) return;
    getRecord().tasks.push({ id: uid(), title, desc: '', cat: '自定义', icon: '✦', completed: false, completedAt: null, note: '', skipped: false });
    $('#taskInput').value = '';
    saveRecords();
    renderToday();
  });

  $('#moodChips').addEventListener('click', (e) => {
    const chip = e.target.closest('.mood-chip');
    if (!chip) return;
    const day = getRecord();
    day.mood.v = day.mood.v === chip.dataset.mood ? '' : chip.dataset.mood;
    saveRecords();
    renderToday();
  });
  $('#moodNote').addEventListener('change', () => {
    getRecord().mood.note = $('#moodNote').value.trim();
    saveRecords();
  });

  // photos
  $$('.photo-upload-btn[data-ptype]').forEach((b) => b.addEventListener('click', () => {
    photoUploadType = b.dataset.ptype;
    $('#photoFile').click();
  }));
  $('#photoFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    toast('正在保存照片…');
    try {
      const src = await storePhoto(file, `p-${photoUploadType}`);
      getRecord().photos.push({ id: uid(), src, type: photoUploadType, note: '', at: nowTime() });
      // auto-complete the photo task
      const pt = getRecord().tasks.find((t) => (t.key || t.id) === 'photo');
      if (pt && !pt.completed) { pt.completed = true; pt.completedAt = nowTime(); }
      saveRecords();
      renderToday();
      toast('照片已保存 ✓');
    } catch (err) {
      console.warn(err);
      toast('保存失败，请重试');
    }
  });

  $('#todayPhotoGrid').addEventListener('click', async (e) => {
    const item = e.target.closest('.photo-item');
    if (!item) return;
    const day = getRecord();
    const photo = day.photos.find((p) => p.id === item.dataset.id);
    if (!photo) return;
    const act = e.target.closest('[data-pact]')?.dataset.pact;
    if (act === 'del') {
      if (!confirm('删除这张照片吗？')) return;
      day.photos = day.photos.filter((p) => p.id !== photo.id);
      saveRecords(); renderToday();
    } else if (act === 'note') {
      const note = prompt('照片备注：', photo.note || '');
      if (note !== null) { photo.note = note.trim(); saveRecords(); renderToday(); }
    } else if (e.target.dataset.view) {
      openLightbox(e.target.src, `${selectedDate} · ${photo.type}${photo.note ? ` · ${photo.note}` : ''}`);
    }
  });

  $('#miniReviewForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const day = getRecord();
    day.review = {
      ...day.review,
      best: $('#rvBest').value.trim(),
      improveToday: $('#rvImproveToday').value.trim(),
      tomorrow: $('#rvTomorrow').value.trim(),
      updatedAt: new Date().toISOString()
    };
    const rt = day.tasks.find((t) => (t.key || t.id) === 'review');
    if (rt && !rt.completed && (day.review.best || day.review.improveToday || day.review.tomorrow)) {
      rt.completed = true; rt.completedAt = nowTime();
    }
    saveRecords();
    $('#miniReviewHint').textContent = `已保存 · ${nowTime()}`;
    renderToday();
    toast('复盘已保存 ✓');
  });

  // payments
  $('#payCatChips').addEventListener('click', (e) => {
    const chip = e.target.closest('.payment-cat-chip');
    if (!chip) return;
    selectedPayCat = chip.dataset.cat;
    $$('.payment-cat-chip').forEach((c) => c.classList.toggle('active', c.dataset.cat === selectedPayCat));
  });
  $('#paymentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    getRecord().payments.push({
      id: uid(), time: $('#paymentTime').value, item: $('#paymentItem').value.trim(),
      amount: Number($('#paymentAmount').value), method: $('#paymentMethod').value,
      category: selectedPayCat, note: $('#paymentNote').value.trim(), createdAt: new Date().toISOString()
    });
    $('#paymentForm').reset();
    $('#paymentTime').value = nowTime();
    selectedPayCat = '餐饮';
    saveRecords();
    renderFinancePage();
    toast('付款记录已保存 ✓');
  });
  $('#paymentList').addEventListener('click', (e) => {
    if (!e.target.matches('.delete-button')) return;
    const id = e.target.closest('.payment-row').dataset.id;
    getRecord().payments = getRecord().payments.filter((p) => p.id !== id);
    saveRecords();
    renderFinancePage();
  });

  /* ── Progress ── */
  $('#heatRangeToggle').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    heatRange = b.dataset.range;
    $$('#heatRangeToggle button').forEach((x) => x.classList.toggle('active', x === b));
    renderHeatmap();
  });
  $('#photoFilter').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    photoFilterVal = b.dataset.pf;
    $$('#photoFilter button').forEach((x) => x.classList.toggle('active', x === b));
    renderPhotoTimeline();
  });
  $('#compareA').addEventListener('change', renderCompareView);
  $('#compareB').addEventListener('change', renderCompareView);
  $('#photoTimeline').addEventListener('click', (e) => {
    const item = e.target.closest('.makeup-tl-item');
    if (item) openLightbox(item.dataset.url, item.dataset.date);
  });

  /* ── Body ── */
  $('#bodyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const day = getRecord();
    BODY_FIELDS.forEach(([k, id]) => {
      const v = $(`#${id}`).value;
      if (v === '') delete day.body[k];
      else day.body[k] = Number(v);
    });
    saveRecords();
    renderBody();
    toast('身体数据已保存 ✓');
  });

  $('#postureList').addEventListener('click', (e) => {
    const item = e.target.closest('.pos-item');
    if (!item) return;
    const key = item.dataset.key;
    const act = e.target.closest('[data-pos]')?.dataset.pos;
    if (act === 'info') {
      item.classList.toggle('open');
    } else if (act === 'done') {
      const day = getRecord();
      day.posture[key] = !day.posture[key];
      saveRecords();
      renderPosture();
    } else if (act === 'timer') {
      const btn = e.target.closest('.pos-timer-btn');
      if (posTimer) { clearInterval(posTimer.iv); posTimer.btn.textContent = posTimer.orig; posTimer.btn.classList.remove('running'); }
      if (posTimer?.btn === btn) { posTimer = null; return; }
      let left = Number(btn.dataset.secs);
      const orig = btn.textContent;
      btn.classList.add('running');
      const tick = () => {
        btn.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
        if (left <= 0) {
          clearInterval(iv);
          btn.classList.remove('running');
          btn.textContent = orig;
          posTimer = null;
          const day = getRecord();
          day.posture[key] = true;
          saveRecords();
          renderPosture();
          toast('完成一组仪态练习 ❀');
        }
        left -= 1;
      };
      tick();
      const iv = setInterval(tick, 1000);
      posTimer = { iv, btn, orig };
    }
  });

  $('#bodyGoalForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const s = getSettings();
    const wk = mondayOf(localDateKey());
    s.bodyGoals[wk] = s.bodyGoals[wk] || [];
    if (s.bodyGoals[wk].length >= 3) { toast('每周最多 3 个目标 · 少一点更容易完成'); return; }
    s.bodyGoals[wk].push({ id: uid(), text: $('#bodyGoalInput').value.trim(), done: false });
    $('#bodyGoalInput').value = '';
    saveSettings();
    renderBodyGoals();
  });
  $('#bodyGoalList').addEventListener('change', (e) => {
    if (!e.target.matches('.task-check')) return;
    const id = e.target.closest('.goal-item').dataset.id;
    const s = getSettings();
    const wk = mondayOf(localDateKey());
    const g = (s.bodyGoals[wk] || []).find((x) => x.id === id);
    if (g) { g.done = e.target.checked; saveSettings(); renderBodyGoals(); }
  });
  $('#bodyGoalList').addEventListener('click', (e) => {
    if (!e.target.matches('.delete-button')) return;
    const id = e.target.closest('.goal-item').dataset.id;
    const s = getSettings();
    const wk = mondayOf(localDateKey());
    s.bodyGoals[wk] = (s.bodyGoals[wk] || []).filter((x) => x.id !== id);
    saveSettings();
    renderBodyGoals();
  });

  /* ── Beauty ── */
  $('#beautyTabs').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    $$('#beautyTabs button').forEach((x) => x.classList.toggle('active', x === b));
    $$('.btab').forEach((t) => t.classList.toggle('active', t.id === `btab-${b.dataset.btab}`));
  });

  $('#focusChips').addEventListener('click', (e) => {
    const chip = e.target.closest('.focus-chip');
    if (!chip) return;
    const s = getSettings();
    const wk = mondayOf(localDateKey());
    s.makeupFocus[wk] = s.makeupFocus[wk] === chip.dataset.focus ? '' : chip.dataset.focus;
    saveSettings();
    renderMakeupFocus();
    renderMakeupSteps();
  });

  $('#makeupSteps').addEventListener('click', (e) => {
    const stepEl = e.target.closest('.mk-step');
    if (!stepEl) return;
    const key = stepEl.dataset.step;
    const day = getRecord();
    day.makeupSteps[key] = day.makeupSteps[key] || {};
    const d = day.makeupSteps[key];
    const mk = e.target.closest('[data-mk]')?.dataset.mk;
    if (mk === 'check') {
      d.done = !d.done;
      if (d.done) {
        const mt = day.tasks.find((t) => (t.key || t.id) === 'makeup');
        if (mt && !mt.completed) { mt.completed = true; mt.completedAt = nowTime(); }
      }
      saveRecords();
      renderMakeupSteps();
    } else if (mk === 'star') {
      d.skill = Number(e.target.dataset.n);
      saveRecords();
      renderMakeupSteps();
    } else if (mk === 'toggle') {
      d.open = !d.open;
      renderMakeupSteps();
    }
  });
  $('#makeupSteps').addEventListener('change', (e) => {
    const mk = e.target.dataset.mk;
    if (!['products', 'problems', 'next'].includes(mk)) return;
    const key = e.target.closest('.mk-step').dataset.step;
    const day = getRecord();
    day.makeupSteps[key] = day.makeupSteps[key] || {};
    day.makeupSteps[key][mk] = e.target.value.trim();
    day.makeupSteps[key].open = true;
    saveRecords();
  });

  $('#slotBefore').addEventListener('click', () => { makeupKind = 'before'; $('#makeupFile').click(); });
  $('#slotAfter').addEventListener('click', () => { makeupKind = 'after'; $('#makeupFile').click(); });
  $('#makeupFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    toast('正在上传…');
    try {
      const src = await storePhoto(file, makeupKind);
      getRecord().makeup[makeupKind] = src;
      saveRecords();
      renderMakeupAlbum();
      toast('照片已保存 ✓');
    } catch (err) {
      console.warn(err);
      toast('上传失败，请重试');
    }
  });

  $('#makeupTplForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const s = getSettings();
    s.makeupTemplate = {
      ...s.makeupTemplate,
      base: $('#mtBase').value.trim(), brow: $('#mtBrow').value.trim(),
      shadow: $('#mtShadow').value.trim(), liner: $('#mtLiner').value.trim(),
      blush: $('#mtBlush').value.trim(), lip: $('#mtLip').value.trim(),
      time: $('#mtTime').value
    };
    saveSettings();
    toast('标准妆容卡已保存 ✓');
  });
  $('#mtStars').addEventListener('click', (e) => {
    const star = e.target.closest('.star');
    if (!star) return;
    const s = getSettings();
    s.makeupTemplate = s.makeupTemplate || {};
    s.makeupTemplate.score = Number(star.dataset.n);
    saveSettings();
    renderStars($('#mtStars'), s.makeupTemplate.score);
  });

  ['#skincareAM', '#skincarePM'].forEach((sel) => {
    $(sel).addEventListener('change', (e) => {
      const row = e.target.closest('.sk-item');
      if (!row) return;
      const { part, key } = row.dataset;
      if (e.target.matches('.task-check')) {
        const day = getRecord();
        day.skincare[part][key] = e.target.checked;
        // auto-complete skincare task when a full routine is done
        const items = part === 'am' ? SKINCARE_AM : SKINCARE_PM;
        if (items.every((it) => day.skincare[part][it.key])) {
          const t = day.tasks.find((x) => (x.key || x.id) === 'skincare');
          if (t && !t.completed) { t.completed = true; t.completedAt = nowTime(); }
          if (part === 'am' && day.skincare.am.spf) {
            const sp = day.tasks.find((x) => (x.key || x.id) === 'sunscreen');
            if (sp && !sp.completed) { sp.completed = true; sp.completedAt = nowTime(); }
          }
        }
        saveRecords();
      } else if (e.target.matches('.sk-product')) {
        const s = getSettings();
        s.skincareProducts[part] = s.skincareProducts[part] || {};
        s.skincareProducts[part][key] = e.target.value.trim();
        saveSettings();
      }
    });
  });

  $('#hairChecks').addEventListener('change', (e) => {
    const row = e.target.closest('.sk-item');
    if (!row || !e.target.matches('.task-check')) return;
    getRecord().hair.checks[row.dataset.hair] = e.target.checked;
    saveRecords();
  });
  $('#hairTplChips').addEventListener('click', (e) => {
    const chip = e.target.closest('.focus-chip');
    if (!chip) return;
    const day = getRecord();
    day.hair.style = day.hair.style === chip.dataset.hairtpl ? '' : chip.dataset.hairtpl;
    saveRecords();
    renderHair();
  });
  $('#hairStyle').addEventListener('change', () => {
    getRecord().hair.style = $('#hairStyle').value.trim();
    saveRecords();
    renderHair();
  });
  $('#hairStars').addEventListener('click', (e) => {
    const star = e.target.closest('.star');
    if (!star) return;
    getRecord().hair.score = Number(star.dataset.n);
    saveRecords();
    renderStars($('#hairStars'), getRecord().hair.score);
  });

  /* ── Style ── */
  $('#editKeywords').addEventListener('click', () => {
    const s = getSettings();
    const v = prompt('风格关键词（用逗号分隔）：', s.styleKeywords.join(', '));
    if (v === null) return;
    s.styleKeywords = v.split(/[,，]/).map((x) => x.trim()).filter(Boolean);
    saveSettings();
    renderStyle();
  });
  $('#editColors').addEventListener('click', () => {
    const s = getSettings();
    const v = prompt('颜色（格式：名称:#hex，用逗号分隔）：', s.styleColors.map((c) => `${c.name}:${c.hex}`).join(', '));
    if (v === null) return;
    const colors = v.split(/[,，]/).map((x) => {
      const [name, hex] = x.split(/[:：]/).map((y) => y.trim());
      return name && hex ? { name, hex } : null;
    }).filter(Boolean);
    if (colors.length) { s.styleColors = colors; saveSettings(); renderStyle(); }
  });

  $('#outfitForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const day = getRecord();
    day.outfit = {
      ...day.outfit,
      top: $('#ofTop').value.trim(), bottom: $('#ofBottom').value.trim(),
      shoes: $('#ofShoes').value.trim(), bag: $('#ofBag').value.trim(),
      acc: $('#ofAcc').value.trim(), hair: $('#ofHair').value.trim(),
      why: $('#ofWhy').value.trim()
    };
    saveRecords();
    toast('今日穿搭已保存 ✓');
  });
  $('#ofStars').addEventListener('click', (e) => {
    const star = e.target.closest('.star');
    if (!star) return;
    getRecord().outfit.score = Number(star.dataset.n);
    saveRecords();
    renderStars($('#ofStars'), getRecord().outfit.score);
  });
  $('#ofPhotoBtn').addEventListener('click', () => $('#outfitFile').click());
  $('#outfitFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    toast('正在保存照片…');
    try {
      const src = await storePhoto(file, 'outfit');
      getRecord().outfit.photo = src;
      saveRecords();
      renderOutfitPhoto();
      toast('穿搭照已保存 ✓');
    } catch (err) { console.warn(err); toast('保存失败，请重试'); }
  });

  $('#outfitTplForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const s = getSettings();
    s.outfitTemplates.push({ id: uid(), text: $('#outfitTplInput').value.trim() });
    $('#outfitTplInput').value = '';
    saveSettings();
    renderStyle();
  });
  $('#outfitTplList').addEventListener('click', (e) => {
    const row = e.target.closest('.tpl-row');
    if (!row) return;
    const s = getSettings();
    if (e.target.matches('.delete-button')) {
      s.outfitTemplates = s.outfitTemplates.filter((t) => t.id !== row.dataset.id);
      saveSettings();
      renderStyle();
    } else if (e.target.matches('.tpl-use')) {
      const t = s.outfitTemplates.find((x) => x.id === row.dataset.id);
      if (!t) return;
      const day = getRecord();
      day.outfit.top = t.text;
      saveRecords();
      renderStyle();
      toast('已复制到今日穿搭 ✓');
    }
  });

  $('#wardrobeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const s = getSettings();
    s.wardrobe.push({
      id: uid(), name: $('#wName').value.trim(), cat: $('#wCat').value,
      color: $('#wColor').value.trim(), season: $('#wSeason').value
    });
    $('#wName').value = ''; $('#wColor').value = '';
    saveSettings();
    renderWardrobe();
    toast('已加入衣橱 ✓');
  });
  $('#wardrobeFilter').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    wardrobeFilterVal = b.dataset.wf;
    renderWardrobe();
  });
  $('#wardrobeGrid').addEventListener('click', (e) => {
    if (!e.target.matches('.delete-button')) return;
    const id = e.target.closest('.wardrobe-card').dataset.id;
    const s = getSettings();
    s.wardrobe = s.wardrobe.filter((w) => w.id !== id);
    saveSettings();
    renderWardrobe();
  });

  /* ── Review ── */
  $('#weekPrev').addEventListener('click', () => { weekOffset -= 1; renderReviewPage(); });
  $('#weekNext').addEventListener('click', () => { if (weekOffset < 0) { weekOffset += 1; renderReviewPage(); } });

  $('#weekQForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const s = getSettings();
    const monday = shiftDate(mondayOf(localDateKey()), weekOffset * 7);
    const ans = {};
    $$('#weekQForm [data-wq]').forEach((t) => { ans[t.dataset.wq] = t.value.trim(); });
    s.weekReviews[monday] = ans;
    saveSettings();
    toast('本周复盘已保存 ✓');
  });

  $('#weekPlanForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const s = getSettings();
    const monday = shiftDate(mondayOf(localDateKey()), weekOffset * 7);
    s.weekPlans[shiftDate(monday, 7)] = {
      body: $('#wpBody').value.trim(),
      makeup: $('#wpMakeup').value.trim(),
      life: $('#wpLife').value.trim()
    };
    saveSettings();
    toast('下周计划已保存 · 少一点目标，更多完成');
  });

  $('#rvAiBtn').addEventListener('click', async () => {
    const keys = rvDayKeys(RV_WINDOW).filter(rvHasReview);
    if (!keys.length) { toast('还没有复盘记录可以分析'); return; }
    const lines = keys.map((k) => {
      const r = records[k].review || {};
      const parts = [`【${k}】完成率${rvCompletion(k)}%`];
      const mood = rvMood(k);
      if (mood) parts.push(`心情:${mood}`);
      if (records[k].mood?.note) parts.push(`感受:${records[k].mood.note}`);
      if (r.best || r.done) parts.push(`做得好:${r.best || r.done}`);
      if (r.undone) parts.push(`没完成:${r.undone}`);
      if (r.problems || r.improveToday) parts.push(`问题:${r.problems || r.improveToday}`);
      if (r.tomorrow || r.improve) parts.push(`明天最小行动:${r.tomorrow || r.improve}`);
      if (r.note) parts.push(`备注:${r.note}`);
      return parts.join(' | ');
    });
    const promptText = `以下是我最近 ${keys.length} 天的每日复盘记录。请帮我做深度分析：1) 我最常卡住的重复模式是什么；2) 什么事情我经常能做成、可以依靠；3) 情绪和效率的规律；4) 最值得优先调整的一个点（只要一个）。请温和、具体，不要说教。\n\n${lines.join('\n')}`;
    const ok = await rvCopyText(promptText);
    toast(ok ? '已复制 30 天记录 ✓ 粘贴给 AI 即可深度分析' : '复制失败，请重试');
  });

  /* ── Profile ── */
  $('#editIdentity').addEventListener('click', () => {
    const s = getSettings();
    const v = prompt('你的身份宣言：', s.identity);
    if (v !== null && v.trim()) { s.identity = v.trim(); saveSettings(); renderProfile(); }
  });
  $('#editGoal').addEventListener('click', () => {
    const s = getSettings();
    const v = prompt('你的最终目标：', s.goal);
    if (v !== null && v.trim()) { s.goal = v.trim(); saveSettings(); renderProfile(); }
  });
  $('#editMinActions').addEventListener('click', () => {
    const s = getSettings();
    const v = prompt('最小行动清单（用逗号分隔）：', s.minActions.join(', '));
    if (v === null) return;
    const list = v.split(/[,，]/).map((x) => x.trim()).filter(Boolean);
    if (list.length) { s.minActions = list; saveSettings(); renderProfile(); }
  });

  /* ── Career ── */
  $('#postForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const day = getRecord();
    day.creation = {
      ...day.creation,
      text: $('#postText').value.trim(),
      link: $('#postLink').value.trim(),
      at: nowTime()
    };
    if (day.creation.text) {
      const xt = day.tasks.find((t) => (t.key || t.id) === 'xpost');
      if (xt && !xt.completed) { xt.completed = true; xt.completedAt = nowTime(); }
    }
    saveRecords();
    renderCareer();
    toast('今日发帖已记录 ✓');
  });

  $('#projectForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const s = getSettings();
    s.projects.unshift({
      id: uid(), name: $('#pName').value.trim(), type: $('#pType').value,
      goal: $('#pGoal').value.trim(), status: 'active',
      tasks: [], logs: [], createdAt: new Date().toISOString()
    });
    $('#pName').value = ''; $('#pGoal').value = '';
    saveSettings();
    renderCareer();
    toast('项目已创建 ⚑ 给它添加几个子任务吧');
  });

  $('#projectList').addEventListener('submit', (e) => {
    e.preventDefault();
    const card = e.target.closest('.proj-card');
    if (!card) return;
    const s = getSettings();
    const p = s.projects.find((x) => x.id === card.dataset.id);
    const input = e.target.querySelector('input');
    const text = input.value.trim();
    if (!p || !text) return;
    if (e.target.matches('.proj-task-form')) {
      p.tasks.push({ id: uid(), text, done: false });
    } else if (e.target.matches('.proj-log-form')) {
      p.logs = p.logs || [];
      p.logs.unshift({ date: localDateKey(), time: nowTime(), text });
      const wt = getRecord().tasks.find((t) => (t.key || t.id) === 'website');
      if (wt && !wt.completed) { wt.completed = true; wt.completedAt = nowTime(); }
      saveRecords();
      toast('推进已记录 · 今日任务同步打勾 ✓');
    }
    input.value = '';
    saveSettings();
    renderCareer();
  });

  $('#projectList').addEventListener('change', (e) => {
    if (!e.target.matches('.task-check')) return;
    const card = e.target.closest('.proj-card');
    const row = e.target.closest('.proj-task');
    if (!card || !row) return;
    const s = getSettings();
    const p = s.projects.find((x) => x.id === card.dataset.id);
    const t = p?.tasks.find((x) => x.id === row.dataset.tid);
    if (!t) return;
    t.done = e.target.checked;
    if (p.tasks.length && p.tasks.every((x) => x.done)) toast('这个项目的子任务全部完成了 ❀');
    saveSettings();
    renderCareer();
  });

  $('#projectList').addEventListener('click', (e) => {
    const card = e.target.closest('.proj-card');
    if (!card) return;
    const s = getSettings();
    const p = s.projects.find((x) => x.id === card.dataset.id);
    if (!p) return;
    const statusBtn = e.target.closest('[data-pstatus]');
    if (statusBtn) {
      p.status = statusBtn.dataset.pstatus;
      saveSettings();
      renderCareer();
      return;
    }
    if (e.target.closest('[data-pdel]')) {
      if (!confirm(`删除项目「${p.name}」吗？子任务和推进日志会一起删除。`)) return;
      s.projects = s.projects.filter((x) => x.id !== p.id);
      saveSettings();
      renderCareer();
      return;
    }
    const taskRow = e.target.closest('.proj-task');
    if (taskRow && e.target.matches('.delete-button')) {
      p.tasks = p.tasks.filter((x) => x.id !== taskRow.dataset.tid);
      saveSettings();
      renderCareer();
    }
  });

  $('#ideaForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const s = getSettings();
    s.ideas.unshift({ id: uid(), text: $('#ideaInput').value.trim() });
    $('#ideaInput').value = '';
    saveSettings();
    renderCareer();
  });
  $('#ideaList').addEventListener('click', (e) => {
    if (!e.target.matches('.delete-button')) return;
    const s = getSettings();
    s.ideas = s.ideas.filter((x) => x.id !== e.target.closest('.goal-item').dataset.id);
    saveSettings();
    renderCareer();
  });

  $('#finPrev').addEventListener('click', () => {
    finMonth--; if (finMonth < 0) { finMonth = 11; finYear--; }
    renderFinance();
  });
  $('#finNext').addEventListener('click', () => {
    const now = new Date();
    if (finYear > now.getFullYear() || (finYear === now.getFullYear() && finMonth >= now.getMonth())) return;
    finMonth++; if (finMonth > 11) { finMonth = 0; finYear++; }
    renderFinance();
  });

  $('#exportData').addEventListener('click', exportJSON);
  $('#importData').addEventListener('click', () => $('#importFile').click());
  $('#importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (file) importJSON(file);
  });
  $('#clearData').addEventListener('click', clearAll);

  /* ── Lightbox / onboarding ── */
  $('#mlClose').addEventListener('click', () => $('#makeupLightbox').classList.remove('show'));
  $('#makeupLightbox').addEventListener('click', (e) => {
    if (e.target.id === 'makeupLightbox') $('#makeupLightbox').classList.remove('show');
  });

  $('#obStart').addEventListener('click', () => {
    const s = getSettings();
    s.onboarded = true;
    // gentle sample weekly goals for the first week
    const wk = mondayOf(localDateKey());
    if (!s.bodyGoals[wk] || !s.bodyGoals[wk].length) {
      s.bodyGoals[wk] = [
        { id: uid(), text: '本周步行 5 天', done: false },
        { id: uid(), text: '练习眉毛 3 次', done: false },
        { id: uid(), text: '上传 1 张全身照', done: false }
      ];
    }
    saveSettings();
    $('#onboarding').style.display = 'none';
    toast('Day 1 · 从一个最小行动开始 ☾');
  });
}

/* ═══════════ Init ═══════════ */
function init() {
  records = loadRecords();
  const s = getSettings();
  $('#paymentTime').value = nowTime();
  bindEvents();
  renderPage();
  if (!s.onboarded) $('#onboarding').style.display = '';
  initCloud();
}

init();
