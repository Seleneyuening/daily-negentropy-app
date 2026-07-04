const STORAGE_KEY = 'dailyRecords';

const PAY_CATS = [
  { id: '餐饮', icon: '🍜' }, { id: '购物', icon: '🛍' }, { id: '交通', icon: '🚌' },
  { id: '娱乐', icon: '🎬' }, { id: '生活', icon: '🏠' }, { id: '学习', icon: '📚' },
  { id: '健康', icon: '💊' }, { id: '其他', icon: '💸' }
];
let selectedPayCat = '餐饮';

function catIcon(cat) {
  return PAY_CATS.find((c) => c.id === cat)?.icon || '💸';
}

function selectPayCat(el) {
  document.querySelectorAll('.payment-cat-chip').forEach((c) => c.classList.remove('active'));
  el.classList.add('active');
  selectedPayCat = el.dataset.cat;
}
const SUPABASE_URL = 'https://jmfuujyeodhjhgxezqpv.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_zDXnDnWE665dD9kMmSqxOQ_U0Y_V5ib';
const SUPABASE_TABLE = 'shared_daily_data';
const SUPABASE_RECORD_ID = 'daily-negentropy';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const elements = {
  recordDate: $('#recordDate'), historyDate: $('#historyDate'), todayLabel: $('#todayLabel'),
  completionRate: $('#completionRate'), paymentTotal: $('#paymentTotal'), paymentMiniTotal: $('#paymentMiniTotal'), streakDays: $('#streakDays'),
  taskCount: $('#taskCount'), taskList: $('#taskList'), taskEmpty: $('#taskEmpty'), taskForm: $('#taskForm'), taskInput: $('#taskInput'),
  paymentForm: $('#paymentForm'), paymentList: $('#paymentList'), paymentEmpty: $('#paymentEmpty'),
  reviewForm: $('#reviewForm'), reviewDateLabel: $('#reviewDateLabel'), reviewSaveHint: $('#reviewSaveHint'),
  historyContent: $('#historyContent'), toast: $('#toast'), cloudStatus: $('#cloudStatus')
};

let selectedDate = localDateKey();
let records;
let toastTimer;
let cloudClient;
let cloudSyncTimer;
let cloudPullTimer;

const DAILY_TASK_TEMPLATE = [
  { key: 'm1', title: '身体激活', desc: '拉伸或散步 10 分钟，冷启动神经系统', category: '认知修炼' },
  { key: 'm2', title: '晨写', desc: '写下脑中所有浮现，只清空，不评判', category: '认知修炼' },
  { key: 'm3', title: '设定今日核心意图', desc: '今天只选一件真正要推进的事', category: '认知修炼' },
  { key: 'm4', title: '手机离开视线', desc: '关闭通知，为深度工作留出空间', category: '认知修炼' },
  { key: 'm5', title: '完成核心认知做功', desc: '深度写作、复杂问题或现实成果', category: '认知修炼' },
  { key: 'm6', title: '深度阅读', desc: '纸质书优先，标记真正触动的地方', category: '认知修炼' },
  { key: 'm7', title: '每天一个小产出', desc: '内容、笔记、工具测试或页面成果', category: '认知修炼' },
  { key: 'm8', title: '睡前复盘', desc: '完成、混乱、修正，留下三行也很好', category: '认知修炼' },
  { key: 'b1', title: '温和洁面', desc: '温水与温和洁面产品，不用力拉扯', category: '女性修炼' },
  { key: 'b2', title: '爽肤补水', desc: '轻拍或按压，照顾好今天的皮肤状态', category: '女性修炼' },
  { key: 'b3', title: '精华与面霜', desc: '由内向外轻拍，脖颈一并护理', category: '女性修炼' },
  { key: 'b4', title: '认真防晒', desc: '出门前完成面部与颈部防晒', category: '女性修炼' },
  { key: 'b5', title: '头发与衣着清爽', desc: '干净、舒展，更像理想中的自己', category: '女性修炼' },
  { key: 'b6', title: '晚间卸妆洁面', desc: '温柔清洁今天落在皮肤上的疲惫', category: '女性修炼' },
  { key: 'b7', title: '晚间补水', desc: '根据皮肤状态做简单、稳定的护理', category: '女性修炼' },
  { key: 'b8', title: '身体乳', desc: '洗澡后及时保湿，把它变成固定仪式', category: '女性修炼' },
  { key: 'b9', title: '整理明日形象', desc: '提前准备衣服与随身物品', category: '女性修炼' },
  { key: 'e1', title: '走路 20–40 分钟', desc: '规律步行，保持轻盈、干净、稳定', category: '女性修炼' },
  { key: 'e2', title: '臀桥 20 次', desc: '激活臀部和身体后侧线条', category: '女性修炼' },
  { key: 'e3', title: '深蹲 15 次', desc: '腿臀塑形，动作稳定优先', category: '女性修炼' },
  { key: 'e4', title: '平板支撑 30 秒', desc: '收紧核心，保持自然呼吸', category: '女性修炼' },
  { key: 'e5', title: '蝴蝶伸展 60 秒', desc: '打开髋部，增加身体柔韧感', category: '女性修炼' },
  { key: 'e6', title: '整理房间 10 分钟', desc: '空间清爽，人也更容易清醒', category: '女性修炼' }
];

records = loadRecords();

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function nowTime() {
  return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function blankRecord() {
  return {
    tasks: DAILY_TASK_TEMPLATE.map((task) => ({ ...task, id: task.key, completed: false, completedAt: null })),
    review: {}, payments: [], makeup: {}
  };
}

function loadRecords() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && typeof parsed === 'object') return parsed;

    const legacy = JSON.parse(localStorage.getItem('negentropy_v3'));
    if (!legacy || typeof legacy !== 'object') return {};
    const migrated = {};
    Object.entries(legacy).forEach(([date, day]) => {
      migrated[date] = blankRecord();
      migrated[date].tasks.forEach((task) => {
        const source = task.category === '女性修炼' ? day.body : day.mind;
        task.completed = Boolean(source && source[task.key]);
        task.completedAt = task.completed ? '原打卡记录' : null;
      });
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    return {};
  }
}

function getRecord(date = selectedDate) {
  if (!records[date]) records[date] = blankRecord();
  records[date].tasks = Array.isArray(records[date].tasks) ? records[date].tasks : [];
  records[date].review = records[date].review || {};
  records[date].payments = Array.isArray(records[date].payments) ? records[date].payments : [];
  records[date].makeup = records[date].makeup || {};
  return records[date];
}

function saveRecords({ touch = true } = {}) {
  if (touch && records[selectedDate]) records[selectedDate].updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(syncCloud, 500);
}

function setCloudStatus(message, state = '') {
  elements.cloudStatus.textContent = message;
  elements.cloudStatus.dataset.state = state;
}

function mergeRecords(localRecords, cloudRecords) {
  const merged = { ...localRecords };
  Object.entries(cloudRecords || {}).forEach(([date, cloudDay]) => {
    const localDay = localRecords[date];
    if (!localDay) {
      merged[date] = cloudDay;
      return;
    }
    const localTime = Date.parse(localDay.updatedAt || 0);
    const cloudTime = Date.parse(cloudDay.updatedAt || 0);
    merged[date] = cloudTime > localTime ? cloudDay : localDay;
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
    setCloudStatus('已同步到 Supabase', 'ok');
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) renderAll();
}

async function initCloud() {
  if (!window.supabase?.createClient) {
    setCloudStatus('已保存在本地', 'error');
    return;
  }

  try {
    cloudClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    await pullCloud();
    renderAll();
    await syncCloud();
    clearInterval(cloudPullTimer);
    cloudPullTimer = setInterval(() => {
      if (document.visibilityState === 'visible') pullCloud().catch((error) => console.warn('Supabase pull unavailable:', error));
    }, 15000);
  } catch (error) {
    console.warn('Supabase sync unavailable:', error);
    setCloudStatus('已保存在本地 · 云端稍后重试', 'error');
  }
}

function displayDate(dateKey, withYear = true) {
  const date = new Date(`${dateKey}T00:00:00`);
  return new Intl.DateTimeFormat('zh-CN', {
    ...(withYear ? { year: 'numeric' } : {}), month: 'long', day: 'numeric', weekday: 'short'
  }).format(date);
}

function money(value) {
  return `¥${Number(value || 0).toFixed(2)}`;
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

function toast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  toastTimer = setTimeout(() => elements.toast.classList.remove('show'), 1800);
}

function setSelectedDate(date) {
  selectedDate = date || localDateKey();
  elements.recordDate.value = selectedDate;
  elements.historyDate.value = selectedDate;
  renderAll();
}

function renderAll() {
  elements.todayLabel.textContent = displayDate(selectedDate);
  elements.reviewDateLabel.textContent = displayDate(selectedDate).toUpperCase();
  renderTasks();
  renderPayments();
  fillReview();
  renderHistory();
}

const TASK_GROUP_META = {
  '认知修炼': { icon: '🧠', color: 'group-mind' },
  '女性修炼': { icon: '🌸', color: 'group-body' },
  '自定义':   { icon: '✦',  color: 'group-custom' },
};

function taskItemHTML(task) {
  return `
    <li class="task-item ${task.completed ? 'done' : ''}" data-id="${task.id}">
      <input class="task-check" type="checkbox" ${task.completed ? 'checked' : ''} aria-label="标记任务完成">
      <div style="flex:1;min-width:0">
        <span class="task-title">${escapeHTML(task.title)}</span>
        ${task.desc ? `<span class="task-desc">${escapeHTML(task.desc)}</span>` : ''}
        ${task.completedAt ? `<span class="task-time">完成于 ${escapeHTML(task.completedAt)}</span>` : ''}
      </div>
      <button class="delete-button" type="button" aria-label="删除任务">×</button>
    </li>`;
}

function renderTasks() {
  const tasks = getRecord().tasks;
  const completed = tasks.filter((t) => t.completed).length;
  const rate = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  elements.completionRate.textContent = `${rate}%`;
  elements.streakDays.textContent = `${calculateStreak()} 天`;
  elements.taskCount.textContent = `${completed} / ${tasks.length}`;

  // group by category
  const groups = {};
  tasks.forEach((t) => {
    const cat = t.category || '自定义';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(t);
  });

  const ORDER = ['认知修炼', '女性修炼', '自定义'];
  const cats = [...ORDER.filter((c) => groups[c]), ...Object.keys(groups).filter((c) => !ORDER.includes(c))];

  let html = '';
  cats.forEach((cat) => {
    const meta = TASK_GROUP_META[cat] || { icon: '●', color: 'group-custom' };
    const list = groups[cat];
    const done = list.filter((t) => t.completed).length;
    html += `
      <div class="task-group">
        <div class="task-group-header ${meta.color}">
          <span class="task-group-icon">${meta.icon}</span>
          <span class="task-group-name">${escapeHTML(cat)}</span>
          <span class="task-group-count">${done}/${list.length}</span>
        </div>
        <ul class="task-list">${list.map(taskItemHTML).join('')}</ul>
      </div>`;
  });

  $('#taskList').innerHTML = html || '<div class="empty-state">今天还没有任务，慢慢开始也很好。</div>';

  // show yesterday's improve note
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yKey = localDateKey(yesterday);
  const improve = records[yKey]?.review?.improve?.trim();
  const banner = $('#yesterdayImprove');
  if (improve) {
    $('#yesterdayImproveText').textContent = improve;
    banner.style.display = 'block';
  } else {
    banner.style.display = 'none';
  }
}

function calculateStreak() {
  let streak = 0;
  const cursor = new Date(`${localDateKey()}T00:00:00`);
  while (true) {
    const key = localDateKey(cursor);
    const day = records[key];
    if (!day || !Array.isArray(day.tasks) || !day.tasks.some((task) => task.completed)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function renderPayments() {
  const payments = getRecord().payments;
  const total = payments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  elements.paymentTotal.textContent = money(total);
  elements.paymentMiniTotal.textContent = money(total);
  elements.paymentEmpty.hidden = payments.length > 0;
  elements.paymentList.innerHTML = payments.map((payment) => `
    <div class="payment-row" data-id="${payment.id}">
      <div class="pay-cat-icon">${catIcon(payment.category)}</div>
      <div style="flex:1;min-width:0">
        <span class="payment-name">${escapeHTML(payment.item)}</span>
        <span class="payment-meta">${escapeHTML(payment.time)} · ${escapeHTML(payment.method)}${payment.note ? ` · ${escapeHTML(payment.note)}` : ''}</span>
      </div>
      <span class="payment-amount">${money(payment.amount)}</span>
      <button class="delete-button" type="button" aria-label="删除付款记录">×</button>
    </div>
  `).join('');
}

function fillReview() {
  const review = getRecord().review;
  $('#reviewDone').value = review.done || '';
  $('#reviewUndone').value = review.undone || '';
  $('#reviewProblems').value = review.problems || '';
  $('#reviewImprove').value = review.improve || '';
  $('#reviewNote').value = review.note || '';
  $$('input[name="mood"]').forEach((input) => { input.checked = input.value === review.mood; });
}

function reviewDataFromForm() {
  return {
    done: $('#reviewDone').value.trim(),
    undone: $('#reviewUndone').value.trim(),
    problems: $('#reviewProblems').value.trim(),
    improve: $('#reviewImprove').value.trim(),
    mood: $('input[name="mood"]:checked')?.value || '',
    note: $('#reviewNote').value.trim(),
    updatedAt: new Date().toISOString()
  };
}

function switchPage(page) {
  $$('.page').forEach((section) => section.classList.toggle('active', section.id === `${page}Page`));
  $$('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.page === page));
  if (page === 'history') renderHistory();
  if (page === 'review') renderReviewSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderHistory() {
  const record = getRecord(elements.historyDate.value || selectedDate);
  const completedTasks = record.tasks.filter((task) => task.completed);
  const review = record.review || {};
  const total = record.payments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const reviewFields = [
    ['今天完成了什么', review.done], ['今天没完成什么', review.undone],
    ['今天的问题', review.problems], ['明天要改进什么', review.improve],
    ['今日心情', review.mood], ['今日备注', review.note]
  ].filter(([, value]) => value);

  elements.historyContent.innerHTML = `
    <section class="card history-card">
      <h3>已完成任务 · ${completedTasks.length}</h3>
      ${completedTasks.length ? `<ul class="history-list">${completedTasks.map((task) => `<li>${escapeHTML(task.title)} <span class="history-muted">${task.completedAt ? `· ${escapeHTML(task.completedAt)}` : ''}</span></li>`).join('')}</ul>` : '<p class="history-muted">这一天没有已完成的任务。</p>'}
    </section>
    <section class="card history-card">
      <h3>当日复盘</h3>
      ${reviewFields.length ? reviewFields.map(([label, value]) => `<div class="review-entry"><strong>${label}</strong><p>${escapeHTML(value)}</p></div>`).join('') : '<p class="history-muted">这一天还没有写复盘。</p>'}
    </section>
    <section class="card history-card">
      <h3>付款记录 · <span class="history-total">${money(total)}</span></h3>
      ${record.payments.length ? record.payments.map((payment) => `<div class="payment-row"><div class="pay-cat-icon">${catIcon(payment.category)}</div><div style="flex:1;min-width:0"><span class="payment-name">${escapeHTML(payment.item)}</span><span class="payment-meta">${escapeHTML(payment.time)} · ${escapeHTML(payment.method)}${payment.note ? ` · ${escapeHTML(payment.note)}` : ''}</span></div><span class="payment-amount">${money(payment.amount)}</span></div>`).join('') : '<p class="history-muted">这一天没有付款记录。</p>'}
    </section>
  `;
}

elements.taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = elements.taskInput.value.trim();
  if (!title) return;
  getRecord().tasks.push({ id: uid(), title, desc: '', category: '自定义', completed: false, completedAt: null, createdAt: new Date().toISOString() });
  elements.taskInput.value = '';
  saveRecords();
  renderTasks();
});

elements.taskList.addEventListener('change', (event) => {
  if (!event.target.matches('.task-check')) return;
  const task = getRecord().tasks.find((item) => item.id === event.target.closest('.task-item').dataset.id);
  if (!task) return;
  task.completed = event.target.checked;
  task.completedAt = task.completed ? nowTime() : null;
  saveRecords();
  renderTasks();
  renderHistory();
});

elements.taskList.addEventListener('click', (event) => {
  if (!event.target.matches('.delete-button')) return;
  const id = event.target.closest('.task-item').dataset.id;
  getRecord().tasks = getRecord().tasks.filter((item) => item.id !== id);
  saveRecords();
  renderTasks();
  renderHistory();
});

elements.paymentForm.addEventListener('submit', (event) => {
  event.preventDefault();
  getRecord().payments.push({
    id: uid(), time: $('#paymentTime').value, item: $('#paymentItem').value.trim(),
    amount: Number($('#paymentAmount').value), method: $('#paymentMethod').value,
    category: selectedPayCat,
    note: $('#paymentNote').value.trim(), createdAt: new Date().toISOString()
  });
  elements.paymentForm.reset();
  $('#paymentTime').value = nowTime();
  selectedPayCat = '餐饮';
  document.querySelectorAll('.payment-cat-chip').forEach((c) => c.classList.toggle('active', c.dataset.cat === '餐饮'));
  saveRecords();
  renderPayments();
  renderHistory();
  toast('付款记录已保存 ✓');
});

elements.paymentList.addEventListener('click', (event) => {
  if (!event.target.matches('.delete-button')) return;
  const id = event.target.closest('.payment-row').dataset.id;
  getRecord().payments = getRecord().payments.filter((item) => item.id !== id);
  saveRecords();
  renderPayments();
  renderHistory();
});

elements.reviewForm.addEventListener('submit', (event) => {
  event.preventDefault();
  getRecord().review = reviewDataFromForm();
  saveRecords();
  elements.reviewSaveHint.textContent = `已保存 · ${nowTime()}`;
  renderHistory();
  renderReviewSummary();
  toast('复盘已保存');
});

elements.recordDate.addEventListener('change', () => setSelectedDate(elements.recordDate.value));
elements.historyDate.addEventListener('change', () => setSelectedDate(elements.historyDate.value));

// ── Finance ──
let finYear = new Date().getFullYear();
let finMonth = new Date().getMonth();

function renderFinance() {
  const ml = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
  $('#finMonthLabel').textContent = `${finYear}年${ml[finMonth]}`;

  const todayKey = localDateKey();
  let monthTotal = 0, todayTotal = 0, count = 0;
  const catMap = {};
  const monthRecords = [];

  Object.entries(records).forEach(([date, day]) => {
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
  const daysPassed = finYear === new Date().getFullYear() && finMonth === new Date().getMonth()
    ? new Date().getDate() : daysInMonth;
  const avg = daysPassed > 0 ? monthTotal / daysPassed : 0;

  $('#finMonthTotal').textContent = money(monthTotal);
  $('#finTodayTotal').textContent = money(todayTotal);
  $('#finMonthCount').textContent = `${count} 笔`;
  $('#finDailyAvg').textContent = money(avg);
  $('#finRecordBadge').textContent = `${count} 笔`;

  // category breakdown using PAY_CATS order
  const catSorted = PAY_CATS.map((c) => ({ ...c, amt: catMap[c.id] || 0 })).filter((c) => c.amt > 0).sort((a, b) => b.amt - a.amt);
  const maxAmt = catSorted[0]?.amt || 1;
  $('#finMethodBreakdown').innerHTML = catSorted.length
    ? `<div class="fin-method-row">${catSorted.map(({ id, icon, amt }) => {
        const pct = monthTotal > 0 ? Math.round(amt / monthTotal * 100) : 0;
        const w = Math.round(amt / maxAmt * 100);
        return `<div class="fin-method-item"><div class="fin-method-top"><span class="fin-method-name">${icon} ${escapeHTML(id)}</span><span><span class="fin-method-amt">${money(amt)}</span><span class="fin-method-pct">${pct}%</span></span></div><div class="fin-bar-track"><div class="fin-bar-fill" style="width:${w}%"></div></div></div>`;
      }).join('')}</div>`
    : '<p class="history-muted" style="margin:6px 0">本月暂无支出</p>';

  // records list
  monthRecords.sort((a, b) => b.date.localeCompare(a.date) || b.time?.localeCompare(a.time || '') || 0);
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
    </div>
  `).join('');
}

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

$$('[data-page]').forEach((button) => button.addEventListener('click', () => {
  if (button.dataset.page === 'finance') renderFinance();
  if (button.dataset.page === 'makeup') renderMakeup();
  switchPage(button.dataset.page);
}));
$('#openReview').addEventListener('click', () => switchPage('review'));
$('#jumpToday').addEventListener('click', () => { setSelectedDate(localDateKey()); switchPage('today'); });

// ── Review summary (最近30天历史总结) ──
const RV_WINDOW = 30;
const RV_MOOD_EMOJI = { '很棒': '🥰', '开心': '😊', '平静': '😌', '疲惫': '😮‍💨', '低落': '🥺' };
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

function rvHasReview(key) {
  const r = records[key]?.review;
  if (!r) return false;
  return ['done', 'undone', 'problems', 'improve', 'note', 'mood'].some((f) => String(r[f] || '').trim());
}

function rvCompletion(key) {
  const tasks = records[key]?.tasks;
  if (!Array.isArray(tasks) || !tasks.length) return 0;
  return Math.round(tasks.filter((t) => t.completed).length / tasks.length * 100);
}

function rvAvgCompletion(keys) {
  const active = keys.filter((k) => records[k]?.tasks?.some((t) => t.completed) || rvHasReview(k));
  if (!active.length) return null;
  return Math.round(active.reduce((s, k) => s + rvCompletion(k), 0) / active.length);
}

function rvReviewText(key, fields = ['done', 'undone', 'problems', 'improve', 'note']) {
  const r = records[key]?.review || {};
  return fields.map((f) => String(r[f] || '')).join(' ');
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
    const y = 33 - (rvCompletion(k) / 100) * 28;
    return [x.toFixed(1), y.toFixed(1)];
  });
  const line = pts.map((p) => p.join(',')).join(' ');
  svg.innerHTML = `
    <polygon points="0,33 ${line} 100,33" fill="rgba(233,169,167,.25)"></polygon>
    <polyline points="${line}" fill="none" stroke="var(--rose-dark)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"></polyline>`;
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

  // 趋势 + 平均完成率（较上个 30 天周期）
  rvSparkline(keys);
  const avg = rvAvgCompletion(keys) ?? 0;
  const prevAvg = rvAvgCompletion(rvDayKeys(RV_WINDOW, RV_WINDOW));
  $('#rvAvg').textContent = `${avg}%`;
  $('#rvDelta').textContent = prevAvg === null ? '' :
    avg > prevAvg ? `较上周期 ↑ ${avg - prevAvg}%` :
    avg < prevAvg ? `较上周期 ↓ ${prevAvg - avg}%` : '与上周期持平';

  // 复盘天数 + 连续复盘
  $('#rvDays').textContent = `${reviewDays.length} 天`;
  const streak = rvReviewStreak();
  $('#rvStreak').textContent = streak ? `连续复盘 ${streak} 天` : '';

  // 高频情绪 TOP3
  const moodCount = {};
  reviewDays.forEach((k) => {
    const m = records[k].review.mood;
    if (m) moodCount[m] = (moodCount[m] || 0) + 1;
  });
  const topMoods = Object.entries(moodCount).sort((a, b) => b[1] - a[1]).slice(0, 3);
  $('#rvMoods').innerHTML = topMoods.length
    ? topMoods.map(([m, n]) => `<div class="rv-mood-row"><span>${RV_MOOD_EMOJI[m] || '·'} ${m}</span><b>${n} 次</b></div>`).join('')
    : '<div class="rv-mood-row"><span>还没有心情记录</span></div>';

  // 高频关键词（按出现天数）
  const kwCount = RV_KEYWORDS.map(([label, re, tone]) => ({
    label, tone,
    n: reviewDays.filter((k) => re.test(rvReviewText(k))).length
  })).filter((k) => k.n > 0).sort((a, b) => b.n - a.n).slice(0, 10);
  $('#rvKeywords').innerHTML = kwCount.length
    ? kwCount.map((k) => `<span class="rv-kw ${k.tone}">${k.label}<b>${k.n}次</b></span>`).join('')
    : '<p class="history-muted" style="margin:4px 0">复盘写得多一些，关键词会自己浮现出来。</p>';

  // 常见卡点时段（只扫「没完成 / 问题」两栏）
  const timeCount = RV_TIME_BUCKETS.map(([label, re, desc]) => ({
    label, desc,
    n: reviewDays.filter((k) => re.test(rvReviewText(k, ['undone', 'problems']))).length
  })).filter((t) => t.n > 0).sort((a, b) => b.n - a.n);
  $('#rvTimeCard').style.display = timeCount.length ? '' : 'none';
  $('#rvTimes').innerHTML = timeCount.map((t) =>
    `<div class="rv-time-row"><span class="rv-time-tag">◷ ${t.label}</span><span class="rv-time-desc">${t.desc}</span><b>${t.n} 次提到</b></div>`).join('');

  // 你的进步（温和的正向规则）
  const progress = [];
  if (streak >= 3) progress.push(`已连续复盘 ${streak} 天，复盘越来越稳定了 ✨`);
  if (prevAvg !== null && avg > prevAvg) progress.push(`平均完成率比上个周期提升了 ${avg - prevAvg}%`);
  if (kwCount.some((k) => k.tone === 'neg')) progress.push('开始能识别自己的卡点了');
  const posKw = kwCount.filter((k) => k.tone === 'pos').slice(0, 2);
  if (posKw.length) progress.push(`「${posKw.map((k) => k.label).join('」「')}」在慢慢累积中 💛`);
  if (!progress.length) progress.push('已经开始记录自己，这就是最重要的一步 💛');
  $('#rvProgress').innerHTML = progress.slice(0, 4).map((p) => `<li>${p}</li>`).join('');

  // 系统建议（基于共性规律，最多 3 条）
  const advice = [];
  const kwTop = kwCount.map((k) => k.label);
  if (kwTop[0] && kwCount[0].tone === 'neg') advice.push(`「${kwTop[0]}」出现频率较高，建议把最重要的一件事放在起床后先做。`);
  if ((moodCount['疲惫'] || 0) + (moodCount['低落'] || 0) >= reviewDays.length / 3) advice.push('「疲惫 / 低落」占比不小，晚间安排以恢复和整理为主，别排硬任务。');
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

$('#rvAiBtn').addEventListener('click', async () => {
  const keys = rvDayKeys(RV_WINDOW).filter(rvHasReview);
  if (!keys.length) { toast('还没有复盘记录可以分析'); return; }
  const lines = keys.map((k) => {
    const r = records[k].review;
    const parts = [`【${k}】完成率${rvCompletion(k)}%`];
    if (r.mood) parts.push(`心情:${r.mood}`);
    if (r.done) parts.push(`完成:${r.done}`);
    if (r.undone) parts.push(`没完成:${r.undone}`);
    if (r.problems) parts.push(`问题:${r.problems}`);
    if (r.improve) parts.push(`想改进:${r.improve}`);
    if (r.note) parts.push(`备注:${r.note}`);
    return parts.join(' | ');
  });
  const prompt = `以下是我最近 ${keys.length} 天的每日复盘记录。请帮我做深度分析：1) 我最常卡住的重复模式是什么；2) 什么事情我经常能做成、可以依靠；3) 情绪和效率的规律；4) 最值得优先调整的一个点（只要一个）。请温和、具体，不要说教。\n\n${lines.join('\n')}`;
  const ok = await rvCopyText(prompt);
  toast(ok ? '已复制 30 天记录 ✓ 粘贴给 AI 即可深度分析' : '复制失败，请重试');
});

// ── Makeup album ──
const MAKEUP_BUCKET = 'makeup-photos';
const MAKEUP_NS = 'daily-negentropy';
let makeupKind = 'after';
const makeupUrlCache = {};

function getMakeup(date = selectedDate) {
  const rec = getRecord(date);
  rec.makeup = rec.makeup || {};
  return rec.makeup;
}

async function makeupSignedUrl(path) {
  if (!path || !cloudClient) return null;
  if (makeupUrlCache[path]) return makeupUrlCache[path];
  const { data, error } = await cloudClient.storage.from(MAKEUP_BUCKET).createSignedUrl(path, 3600);
  if (error) { console.warn('makeup signed url:', error); return null; }
  makeupUrlCache[path] = data.signedUrl;
  return data.signedUrl;
}

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

async function uploadMakeup(file) {
  if (!cloudClient) { toast('云端未连接，稍后再试'); return; }
  toast('正在上传…');
  try {
    const blob = await compressImage(file);
    const path = `${MAKEUP_NS}/${selectedDate}-${makeupKind}-${Date.now()}.jpg`;
    const { error } = await cloudClient.storage.from(MAKEUP_BUCKET).upload(path, blob, { contentType: 'image/jpeg', upsert: false });
    if (error) throw error;
    getMakeup()[makeupKind] = path;
    saveRecords();
    renderMakeup();
    renderHistory();
    toast('照片已保存 ✓');
  } catch (error) {
    console.warn('makeup upload failed:', error);
    toast('上传失败，请重试');
  }
}

async function setMakeupSlot(selector, emoji, label, path) {
  const slot = $(selector);
  if (path) {
    const url = await makeupSignedUrl(path);
    slot.innerHTML = url
      ? `<img class="ms-photo" src="${url}" alt=""><span class="ms-retake">换一张</span>`
      : `<span class="ms-emoji">${emoji}</span><span class="ms-label">${label}</span>`;
  } else {
    slot.innerHTML = `<span class="ms-emoji">${emoji}</span><span class="ms-label">${label}</span>`;
  }
}

function makeupDays() {
  return Object.keys(records)
    .filter((d) => records[d]?.makeup && (records[d].makeup.before || records[d].makeup.after))
    .sort();
}

async function renderMakeup() {
  $('#makeupDateLabel').textContent = displayDate(selectedDate, false);
  const makeup = getMakeup();
  await setMakeupSlot('#slotBefore', '📷', '素颜 before', makeup.before);
  await setMakeupSlot('#slotAfter', '💄', '妆后 after', makeup.after);

  const days = makeupDays();
  const compareCard = $('#makeupCompareCard');
  const compare = $('#makeupCompare');
  if (days.length >= 2) {
    const first = days[0];
    const last = days[days.length - 1];
    const fu = await makeupSignedUrl(records[first].makeup.after || records[first].makeup.before);
    const lu = await makeupSignedUrl(records[last].makeup.after || records[last].makeup.before);
    compare.innerHTML = `<div class="makeup-compare">
      <figure><img src="${fu}" alt=""><figcaption>最早 · ${first}</figcaption></figure>
      <figure><img src="${lu}" alt=""><figcaption>最近 · ${last}</figcaption></figure>
    </div>`;
    compareCard.style.display = '';
  } else {
    compareCard.style.display = 'none';
  }

  const timeline = $('#makeupTimeline');
  if (!days.length) {
    timeline.innerHTML = '<p class="history-muted" style="margin:6px 0">还没有照片，上传今天的妆容开始吧 ✿</p>';
    return;
  }
  const items = await Promise.all(days.slice().reverse().map(async (d) => {
    const m = records[d].makeup;
    const url = await makeupSignedUrl(m.after || m.before);
    return `<button class="makeup-tl-item" type="button" data-url="${url}" data-date="${d}"><img src="${url}" alt=""><span>${d.slice(5)}</span></button>`;
  }));
  timeline.innerHTML = items.join('');
}

$('#slotBefore').addEventListener('click', () => { makeupKind = 'before'; $('#makeupFile').click(); });
$('#slotAfter').addEventListener('click', () => { makeupKind = 'after'; $('#makeupFile').click(); });
$('#makeupFile').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) uploadMakeup(file);
  event.target.value = '';
});
$('#makeupTimeline').addEventListener('click', (event) => {
  const item = event.target.closest('.makeup-tl-item');
  if (!item) return;
  $('#mlImg').src = item.dataset.url;
  $('#mlDate').textContent = item.dataset.date;
  $('#makeupLightbox').classList.add('show');
});
$('#mlClose').addEventListener('click', () => $('#makeupLightbox').classList.remove('show'));
$('#makeupLightbox').addEventListener('click', (event) => {
  if (event.target.id === 'makeupLightbox') $('#makeupLightbox').classList.remove('show');
});

elements.recordDate.value = selectedDate;
elements.historyDate.value = selectedDate;
$('#paymentTime').value = nowTime();
renderAll();
initCloud();
