const app = document.querySelector(".app-shell");
const rangeButtons = document.querySelectorAll("[data-range]");
const tabButtons = document.querySelectorAll("[data-tab-target]");
const screens = document.querySelectorAll("[data-view]");
const openSheetButtons = document.querySelectorAll("[data-open-sheet]");
const closeSheetButtons = document.querySelectorAll("[data-close-sheet]");
const openWishSheetButtons = document.querySelectorAll("[data-open-wish-sheet]");
const closeWishSheetButtons = document.querySelectorAll("[data-close-wish-sheet]");
const addCategoryButton = document.querySelector("[data-add-category]");
const settingsList = document.querySelector(".settings-list");
const saveCategoriesButton = document.querySelector("[data-save-categories]");
const saveSettingsButton = document.querySelector("[data-save-settings]");
const monthlyBudgetInput = document.querySelector("[data-monthly-budget-input]");
const resetRuleSelect = document.querySelector("[data-reset-rule-select]");
const resetActionSelect = document.querySelector("[data-reset-action-select]");
const saveRecordButton = document.querySelector("[data-save-record]");
const recordList = document.querySelector(".record-list");
const addWishButton = document.querySelector("[data-add-wish]");
const wishList = document.querySelector(".wish-list");
const homeWishRail = document.querySelector(".home-wish-rail");
const languageSelect = document.querySelector("[data-language-select]");
const categoryList = document.querySelector(".category-list");
const reserveList = document.querySelector(".reserve-list");
const chipGroup = document.querySelector(".chip-group");
const wishCategorySelect = document.querySelector("[data-wish-category]");
const wishMonthsSelect = document.querySelector("[data-wish-months]");
const heroLeft = document.querySelector("[data-hero-left]");
const heroSubline = document.querySelector("[data-hero-subline]");
const heroPercent = document.querySelector("[data-hero-percent]");
const heroBar = document.querySelector("[data-hero-bar]");
const wishSheet = document.querySelector(".wish-sheet");
const wishSheetTitle = document.querySelector("[data-wish-sheet-title]");
const budgetMonthLabel = document.querySelector("[data-budget-month-label]");
let editingWishId = null;

const defaultCategories = [
  { icon: "🎬", name: "Entertainment", budget: 300, left: 180, tone: "entertainment" },
  { icon: "🎮", name: "Games", budget: 220, left: 70, tone: "games" },
  { icon: "🐾", name: "Pets", budget: 320, left: 240, tone: "pets" },
  { icon: "🛒", name: "Life", budget: 650, left: 430, tone: "life" },
];

const defaultWishes = [
  { id: "default-game", name: "New game", category: "Games", price: "$100", available: "$70", monthly: "$30", createdAt: "default" },
  { id: "default-computer", name: "Computer", category: "Life", price: "$2,000", available: "$1,284", monthly: "$200", createdAt: "default" },
  { id: "default-headphones", name: "Headphones", category: "Entertainment", price: "$260", available: "$180", monthly: "$80", createdAt: "default" },
];

const translations = {
  en: {
    add: "＋ Add", addWishlistItem: "Add wishlist item", afterSpending: "after spending", amount: "Amount", archiveRecords: "Archive records by month", autoRefreshBudget: "Auto refresh budget", budgetLeft: "Budget left", cashRunway: "Cash runway", categories: "Categories", computerFund: "Computer fund", controls: "Controls", currency: "Currency", currentCategoryLeft: "Current category left", customDay: "Custom day", dashboard: "Dashboard", edit: "Edit", firstDay: "First day of every month", fundedByLeftover: "Funded by leftover budget", fundingCategory: "Funding category", goalGap: "Goal gap", goals: "Goals", history: "History", home: "Home", keepRecords: "Keep all records and reset remaining budget", language: "Language", lastDay: "Last day of every month", left: "left", localDevice: "Local device", manageCategories: "Manage categories", mayBudget: "May Budget", monthlyBudget: "Monthly budget", monthlyCategoryBudget: "Monthly category budget", monthlyTotalBudget: "Monthly total budget", name: "Name", nextUnlock: "Next unlock", note: "Note", off: "Off", price: "Price", records: "Records", remainingOverTime: "Remaining budget over time", resetRules: "Reset rules", savedRecords: "Saved records", saveCategories: "Save categories", saveSettings: "Save settings", saveWishlistItem: "Save wishlist item", settings: "Settings", subtractFromBudget: "Subtract from budget", subtractSpending: "Subtract spending", tapRow: "Tap a row later for detail", targetMonths: "Target months", thingsToBuy: "Things to buy", today: "Today", totalRemaining: "Total remaining", totalSpending: "Total spending", whenRefreshed: "When refreshed", wishlist: "Wishlist",
  },
  zh: {
    add: "＋ 添加", addWishlistItem: "添加心愿", afterSpending: "扣除消费后", amount: "金额", archiveRecords: "按月份归档记录", autoRefreshBudget: "自动刷新预算", budgetLeft: "剩余预算", cashRunway: "预算续航", categories: "分类", computerFund: "电脑基金", controls: "控制", currency: "货币", currentCategoryLeft: "当前分类剩余", customDay: "自定义日期", dashboard: "仪表盘", edit: "编辑", firstDay: "每月第一天", fundedByLeftover: "由分类剩余预算推进", fundingCategory: "绑定分类", goalGap: "目标差额", goals: "目标", history: "历史", home: "首页", keepRecords: "保留所有记录并重置剩余预算", language: "语言", lastDay: "每月最后一天", left: "剩余", localDevice: "本机保存", manageCategories: "管理分类", mayBudget: "五月预算", monthlyBudget: "月度预算", monthlyCategoryBudget: "每月分类预算", monthlyTotalBudget: "每月总预算", name: "名称", nextUnlock: "下一个解锁", note: "备注", off: "关闭", price: "价格", records: "记录", remainingOverTime: "剩余预算走势", resetRules: "重置规则", savedRecords: "已保存记录", saveCategories: "保存分类", saveSettings: "保存设置", saveWishlistItem: "保存心愿", settings: "设置", subtractFromBudget: "从预算扣除", subtractSpending: "扣除消费", tapRow: "之后可点进分类详情", targetMonths: "几个月买到", thingsToBuy: "想买的东西", today: "今天", totalRemaining: "总剩余", totalSpending: "总消费", whenRefreshed: "刷新时", wishlist: "心愿单",
  },
};

let currentLanguage = localStorage.getItem("budgetHpLanguage") || "en";
let currentRange = "1M";
let currentChartSeries = "total";

function t(key) {
  return translations[currentLanguage][key] || translations.en[key] || key;
}

function applyLanguage(language) {
  currentLanguage = language;
  localStorage.setItem("budgetHpLanguage", language);
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  languageSelect.value = language;
  renderBudgetMonthLabel();
  renderDashboardCategories(getSavedCategories(), currentRange);
}

function parseMoney(value) {
  const parsed = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(value) {
  return `$${Math.round(value).toLocaleString()}`;
}

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getCategoryByName(name) {
  return getSavedCategories().find((category) => category.name === name);
}

function getCategoryLockedAmount(categoryName, excludeWishId = null) {
  return getSavedWishes()
    .filter((wish) => wish.category === categoryName && wish.id !== excludeWishId)
    .reduce((sum, wish) => sum + (parseMoney(wish.price) / Math.max(Number(wish.months || wish.monthly) || 1, 1)), 0);
}

function getWishAvailable(categoryName, excludeWishId = null) {
  const category = getCategoryByName(categoryName);
  if (!category) return 0;
  return Math.max((Number(category.left) || 0) - getCategoryLockedAmount(categoryName, excludeWishId), 0);
}

function getWishMonths(wish) {
  const price = parseMoney(wish.price);
  const legacyMonthly = parseMoney(wish.monthly);
  const inferredMonths = legacyMonthly > 0 ? Math.ceil(price / legacyMonthly) : 1;
  return Math.min(Math.max(Number(wish.months) || inferredMonths || 1, 1), 24);
}

function renderMonthOptions() {
  wishMonthsSelect.innerHTML = "";
  for (let month = 1; month <= 24; month += 1) {
    const option = document.createElement("option");
    option.value = String(month);
    option.textContent = currentLanguage === "zh" ? `${month} 个月` : `${month} month${month === 1 ? "" : "s"}`;
    wishMonthsSelect.append(option);
  }
}

function getSavedCategories() {
  return JSON.parse(localStorage.getItem("budgetHpCategories") || "null") || defaultCategories;
}

function saveCategories(categories) {
  localStorage.setItem("budgetHpCategories", JSON.stringify(categories));
}

function getSettings() {
  return {
    monthlyBudget: 2000,
    resetRule: "lastDay",
    resetAction: "keepRecords",
    lastResetKey: null,
    ...(JSON.parse(localStorage.getItem("budgetHpSettings") || "null") || {}),
  };
}

function saveSettings(settings) {
  localStorage.setItem("budgetHpSettings", JSON.stringify(settings));
}

function renderSettings(settings) {
  monthlyBudgetInput.value = formatMoney(settings.monthlyBudget || 0);
  resetRuleSelect.value = settings.resetRule || "lastDay";
  resetActionSelect.value = settings.resetAction || "keepRecords";
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getNextMonthKey(date) {
  const next = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return getMonthKey(next);
}

function getLastDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getResetCycleKey(date, rule) {
  if (rule === "off" || rule === "customDay") return null;
  if (rule === "lastDay" && date.getDate() === getLastDayOfMonth(date)) {
    return getNextMonthKey(date);
  }
  return getMonthKey(date);
}

function renderBudgetMonthLabel(date = new Date()) {
  const settings = getSettings();
  const key = getResetCycleKey(date, settings.resetRule) || getMonthKey(date);
  const [year, month] = key.split("-").map(Number);
  const labelDate = new Date(year, month - 1, 1);
  budgetMonthLabel.textContent = currentLanguage === "zh"
    ? `${month}月预算`
    : `${labelDate.toLocaleString("en-US", { month: "long" })} Budget`;
}

function resetMonthlyBudgetsIfDue(date = new Date()) {
  const settings = getSettings();
  const resetKey = getResetCycleKey(date, settings.resetRule);
  if (!resetKey || settings.lastResetKey === resetKey) return false;

  const categories = getSavedCategories().map((category) => ({
    ...category,
    left: Number(category.budget) || 0,
  }));
  saveCategories(categories);
  saveSettings({
    ...settings,
    lastResetKey: resetKey,
    lastResetAt: date.toISOString(),
  });
  return true;
}

function renderHeroBudget(settings = getSettings(), categories = getSavedCategories()) {
  const budget = Math.max(Number(settings.monthlyBudget) || 0, 0);
  const left = categories.reduce((sum, category) => sum + (Number(category.left) || 0), 0);
  const spent = Math.max(budget - left, 0);
  const percent = budget > 0 ? Math.min(Math.round((left / budget) * 100), 100) : 0;
  heroLeft.textContent = formatMoney(left);
  heroSubline.textContent = `${formatMoney(spent)} spent of ${formatMoney(budget)} monthly budget`;
  heroPercent.textContent = `${percent}%`;
  heroBar.style.width = `${percent}%`;
}

function getCategoryPercent(category) {
  const budget = Math.max(Number(category.budget) || 1, 1);
  return Math.min(Math.round((Number(category.left) / budget) * 100), 100);
}

function renderCategoryEditor(categories) {
  settingsList.innerHTML = "";
  categories.forEach((category) => {
    const item = document.createElement("div");
    item.dataset.categoryItem = "";
    item.dataset.left = category.left;
    item.dataset.tone = category.tone || "";
    item.innerHTML = `
      <input class="category-icon-input" type="text" aria-label="Category icon" maxlength="2" />
      <input class="category-name-input" type="text" aria-label="Category name" />
      <input class="category-budget-input" type="text" inputmode="decimal" />
      <button class="icon-button tiny danger" type="button" aria-label="Delete category" data-delete-category>×</button>
    `;
    item.querySelector(".category-icon-input").value = category.icon || "♡";
    item.querySelector(".category-name-input").value = category.name || "Category";
    item.querySelector(".category-budget-input").value = formatMoney(category.budget || 0);
    settingsList.append(item);
  });
}

function readCategoryEditor() {
  return [...settingsList.querySelectorAll("[data-category-item]")].map((item, index) => {
    const budget = parseMoney(item.querySelector(".category-budget-input").value);
    const previousLeft = Number(item.dataset.left);
    return {
      icon: item.querySelector(".category-icon-input").value.trim() || "♡",
      name: item.querySelector(".category-name-input").value.trim() || "Category",
      budget,
      left: Number.isFinite(previousLeft) ? Math.min(previousLeft, budget) : Math.round(budget * 0.6),
      tone: item.dataset.tone || defaultCategories[index]?.tone || "",
    };
  });
}

function renderHomeCategories(categories) {
  categoryList.innerHTML = "";
  categories.forEach((category) => {
    const percent = getCategoryPercent(category);
    const locked = Math.min(getCategoryLockedAmount(category.name), Number(category.left) || 0);
    const available = Math.max((Number(category.left) || 0) - locked, 0);
    const availablePercent = category.budget > 0 ? Math.min((available / category.budget) * 100, 100) : 0;
    const lockedPercent = category.budget > 0 ? Math.min((locked / category.budget) * 100, 100 - availablePercent) : 0;
    const row = document.createElement("article");
    row.className = "category-row";
    row.innerHTML = `
      <div class="category-meta">
        <span class="category-icon"></span>
        <div>
          <h3></h3>
          <p></p>
        </div>
      </div>
      <strong></strong>
      <div class="hp-track small category-lock-track">
        <span class="available-bar"></span>
        <span class="locked-bar"></span>
      </div>
    `;
    row.querySelector(".category-icon").textContent = category.icon || "♡";
    row.querySelector("h3").textContent = category.name;
    row.querySelector("p").textContent = locked > 0
      ? `${formatMoney(available)} spendable · ${formatMoney(locked)} locked`
      : `${formatMoney(category.left)} left of ${formatMoney(category.budget)}`;
    row.querySelector("strong").textContent = `${percent}%`;
    row.querySelector(".hp-track").classList.toggle("warning", percent < 40);
    row.querySelector(".available-bar").style.width = `${availablePercent}%`;
    row.querySelector(".locked-bar").style.width = `${lockedPercent}%`;
    categoryList.append(row);
  });
}

function getRangeMultiplier(range) {
  if (range === "3M") return 3;
  if (range === "6M") return 6;
  if (range === "1Y") return 12;
  if (range === "ALL") return 18;
  return 1;
}

function renderDashboardCategories(categories, range = currentRange) {
  reserveList.innerHTML = "";
  const series = [{ key: "total", label: currentLanguage === "zh" ? "总盈余" : "Total surplus" }]
    .concat(categories.map((category) => ({
      key: category.name,
      label: `${category.icon || "♡"} ${category.name}`,
    })));

  if (currentChartSeries !== "total" && !categories.some((category) => category.name === currentChartSeries)) {
    currentChartSeries = "total";
  }

  series.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.chartSeries = item.key;
    button.textContent = item.label;
    button.classList.toggle("active", item.key === currentChartSeries);
    reserveList.append(button);
  });
  renderChartSeries(currentChartSeries, range);
}

function renderCategoryChoices(categories) {
  chipGroup.innerHTML = "";
  wishCategorySelect.innerHTML = "";
  categories.forEach((category, index) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.textContent = category.name;
    chip.classList.toggle("active", index === 0);
    chipGroup.append(chip);

    const option = document.createElement("option");
    option.textContent = category.name;
    wishCategorySelect.append(option);
  });
}

function getCategoryChartPath(categoryName, range) {
  const categories = getSavedCategories();
  const index = Math.max(categories.findIndex((category) => category.name === categoryName), 0);
  const offset = index * 12 + getRangeMultiplier(range) * 3;
  const start = 118 - offset % 36;
  const midA = 82 + offset % 42;
  const midB = 128 - offset % 58;
  const end = 60 + offset % 60;
  return `M10 ${start} C50 ${start - 26} 78 ${midA + 28} 116 ${midA} C154 ${midA - 32} 178 ${midB + 22} 214 ${midB} C254 ${midB - 28} 288 ${end + 20} 330 ${end}`;
}

function getAreaPath(linePath) {
  return `${linePath} L330 160 L10 160 Z`;
}

function renderChartSeries(series, range = currentRange) {
  const data = rangeData[range];
  const categories = getSavedCategories();
  const category = categories.find((item) => item.name === series);
  const path = series === "total" ? data.path : getCategoryChartPath(series, range);
  const label = series === "total"
    ? (currentLanguage === "zh" ? "总盈余走势" : "Total surplus trend")
    : `${category?.icon || "♡"} ${series}`;
  const value = series === "total"
    ? data.trend
    : `${formatMoney((category?.left || 0) * getRangeMultiplier(range))} ${currentLanguage === "zh" ? "剩余" : "left"}`;

  document.querySelector('[data-i18n="remainingOverTime"]').textContent = label;
  document.querySelector('[data-stat="trend"]').textContent = value;
  document.querySelector(".chart-line").setAttribute("d", path);
  document.querySelector(".chart-area").setAttribute("d", getAreaPath(path));

  const matches = [...path.matchAll(/[-\d.]+/g)].map((match) => Number(match[0]));
  const endX = matches.at(-2) || 330;
  const endY = matches.at(-1) || 42;
  document.querySelector(".line-chart circle").setAttribute("cx", endX);
  document.querySelector(".line-chart circle").setAttribute("cy", endY);

  reserveList.querySelectorAll("[data-chart-series]").forEach((button) => {
    button.classList.toggle("active", button.dataset.chartSeries === series);
  });
}

function applyCategories(categories) {
  renderCategoryEditor(categories);
  renderHomeCategories(categories);
  renderDashboardCategories(categories);
  renderCategoryChoices(categories);
  renderHeroBudget(getSettings(), categories);
}

const rangeData = {
  "1M": {
    spending: "$716",
    surplus: "$1,284",
    goal: "$716 short",
    trend: "$1,284 left",
    goalLine: "$1,284 saved toward $2,000",
    goalHint: "4 months left at $200/mo",
    reserves: {
      entertainment: ["$180 left", "$120 spent"],
      games: ["$70 left", "$150 spent"],
      pets: ["$240 left", "$80 spent"],
      life: ["$430 left", "$220 spent"],
    },
    path: "M10 116 C56 92 70 122 112 84 C148 50 176 78 210 60 C250 36 282 66 330 42",
    area: "M10 116 C56 92 70 122 112 84 C148 50 176 78 210 60 C250 36 282 66 330 42 L330 160 L10 160 Z",
    point: [330, 42],
  },
  "3M": {
    spending: "$2,410",
    surplus: "$3,590",
    goal: "$1,590 ready",
    trend: "$3,590 left",
    goalLine: "$3,590 available after 3 months",
    goalHint: "Computer is covered",
    reserves: {
      entertainment: ["$640 left", "$260 spent"],
      games: ["$320 left", "$340 spent"],
      pets: ["$790 left", "$170 spent"],
      life: ["$1,420 left", "$530 spent"],
    },
    path: "M10 90 C44 64 82 72 112 110 C148 154 178 108 212 86 C250 62 284 74 330 66",
    area: "M10 90 C44 64 82 72 112 110 C148 154 178 108 212 86 C250 62 284 74 330 66 L330 160 L10 160 Z",
    point: [330, 66],
  },
  "6M": {
    spending: "$4,982",
    surplus: "$7,018",
    goal: "$5,018 ready",
    trend: "$7,018 left",
    goalLine: "$7,018 available after 6 months",
    goalHint: "3 computers covered",
    reserves: {
      entertainment: ["$1,210 left", "$590 spent"],
      games: ["$550 left", "$770 spent"],
      pets: ["$1,610 left", "$310 spent"],
      life: ["$2,780 left", "$1,120 spent"],
    },
    path: "M10 126 C50 120 76 80 116 96 C150 108 170 132 208 94 C250 52 286 46 330 72",
    area: "M10 126 C50 120 76 80 116 96 C150 108 170 132 208 94 C250 52 286 46 330 72 L330 160 L10 160 Z",
    point: [330, 72],
  },
  "1Y": {
    spending: "$10,620",
    surplus: "$13,380",
    goal: "$11,380 ready",
    trend: "$13,380 left",
    goalLine: "$13,380 available after 1 year",
    goalHint: "Goal is very safe",
    reserves: {
      entertainment: ["$2,280 left", "$1,320 spent"],
      games: ["$940 left", "$1,700 spent"],
      pets: ["$3,220 left", "$620 spent"],
      life: ["$5,140 left", "$2,660 spent"],
    },
    path: "M10 78 C52 98 80 150 118 128 C150 110 170 58 210 76 C252 98 284 120 330 104",
    area: "M10 78 C52 98 80 150 118 128 C150 110 170 58 210 76 C252 98 284 120 330 104 L330 160 L10 160 Z",
    point: [330, 104],
  },
  ALL: {
    spending: "$18,940",
    surplus: "$21,060",
    goal: "$19,060 ready",
    trend: "$21,060 left",
    goalLine: "$21,060 available since start",
    goalHint: "Long-term surplus",
    reserves: {
      entertainment: ["$3,960 left", "$2,340 spent"],
      games: ["$1,870 left", "$3,060 spent"],
      pets: ["$5,830 left", "$1,090 spent"],
      life: ["$8,740 left", "$4,890 spent"],
    },
    path: "M10 140 C48 132 72 112 108 116 C148 122 164 84 204 76 C244 68 280 34 330 28",
    area: "M10 140 C48 132 72 112 108 116 C148 122 164 84 204 76 C244 68 280 34 330 28 L330 160 L10 160 Z",
    point: [330, 28],
  },
};

function closeSheet() {
  app.classList.remove("sheet-open");
  document.querySelector(".spend-sheet").setAttribute("aria-hidden", "true");
}

function openWishSheet(wish = null) {
  editingWishId = wish?.id || null;
  renderMonthOptions();
  document.querySelector("[data-wish-name]").value = wish?.name || "New game";
  document.querySelector("[data-wish-category]").value = wish?.category || wishCategorySelect.options[0]?.value || "";
  document.querySelector("[data-wish-price]").value = wish?.price || "$100";
  document.querySelector("[data-wish-available]").value = formatMoney(getWishAvailable(document.querySelector("[data-wish-category]").value, editingWishId));
  document.querySelector("[data-wish-months]").value = String(getWishMonths(wish || { months: 1 }));
  const modeKey = editingWishId ? "saveWishlistItem" : "addWishlistItem";
  addWishButton.dataset.i18n = modeKey;
  addWishButton.textContent = t(modeKey);
  wishSheetTitle.dataset.i18n = modeKey;
  wishSheetTitle.textContent = t(modeKey);
  app.classList.add("wish-sheet-open");
  wishSheet.setAttribute("aria-hidden", "false");
}

function closeWishSheet() {
  app.classList.remove("wish-sheet-open");
  wishSheet.setAttribute("aria-hidden", "true");
}

function getSavedRecords() {
  return JSON.parse(localStorage.getItem("budgetHpRecords") || "[]");
}

function saveRecords(records) {
  localStorage.setItem("budgetHpRecords", JSON.stringify(records));
}

function getSavedWishes() {
  const saved = JSON.parse(localStorage.getItem("budgetHpWishes") || "null");
  const wishes = saved && saved.length ? saved : defaultWishes;
  return wishes.map((wish) => ({
    id: wish.id || createId(),
    ...wish,
  }));
}

function saveWishes(wishes) {
  localStorage.setItem("budgetHpWishes", JSON.stringify(wishes));
}

function getWishProgress(wish) {
  const price = Math.max(parseMoney(wish.price), 1);
  const available = Math.min(getWishAvailable(wish.category, wish.id) + (parseMoney(wish.price) / getWishMonths(wish)), price);
  const monthly = Math.max(parseMoney(wish.price) / getWishMonths(wish), 1);
  const remaining = Math.max(price - available, 0);
  return {
    price,
    available,
    remaining,
    percent: Math.min(Math.round((available / price) * 100), 100),
    months: remaining === 0
      ? currentLanguage === "zh" ? "可购买" : "Ready"
      : currentLanguage === "zh" ? `${Math.ceil(remaining / monthly)} 个月` : `${Math.ceil(remaining / monthly)} months`,
  };
}

function getWishIcon(wish) {
  const text = `${wish.name || ""} ${wish.category || ""}`.toLowerCase();
  if (text.includes("game") || text.includes("游戏") || text.includes("skin") || text.includes("steam")) return "🎮";
  if (text.includes("computer") || text.includes("电脑") || text.includes("mac") || text.includes("laptop")) return "💻";
  if (text.includes("headphone") || text.includes("耳机") || text.includes("airpods")) return "🎧";
  if (text.includes("pet") || text.includes("宠物") || text.includes("cat") || text.includes("dog")) return "🐾";
  if (text.includes("life") || text.includes("生活") || text.includes("home")) return "🛒";
  if (text.includes("entertainment") || text.includes("娱乐") || text.includes("movie")) return "🎬";
  return "♡";
}

function renderWish(wish) {
  const progress = getWishProgress(wish);
  const item = document.createElement("article");
  item.className = "wish-card";
  item.dataset.wishItem = "";
  item.dataset.wishId = wish.id;
  item.innerHTML = `
    <div class="wish-main">
      <span class="wish-icon" aria-hidden="true">♡</span>
      <div>
        <h3></h3>
        <p></p>
      </div>
    </div>
    <div class="wish-actions">
      <strong></strong>
      <button class="mini-button" type="button" data-edit-wish>${t("edit")}</button>
    </div>
    <div class="hp-track small wish-progress"><span></span></div>
  `;
  item.querySelector(".wish-icon").textContent = getWishIcon(wish);
  item.querySelector("h3").textContent = wish.name || "Wishlist item";
  item.querySelector("p").textContent = `${wish.category || "Category"} · ${formatMoney(progress.available)} available of ${formatMoney(progress.price)} · ${formatMoney(progress.remaining)} to go`;
  item.querySelector("strong").textContent = progress.months;
  item.querySelector(".wish-progress span").style.width = `${progress.percent}%`;
  return item;
}

function renderHomeWish(wish) {
  const item = renderWish(wish);
  item.classList.add("compact");
  return item;
}

function updateHomeWish(wish) {
  if (!wish) return;
  const progress = getWishProgress(wish);
  document.querySelector("[data-home-wish-name]").textContent = wish.name || "Wishlist item";
  document.querySelector("[data-home-wish-copy]").textContent = `${wish.category || "Category"} · ${formatMoney(progress.available)} available of ${formatMoney(progress.price)} · ${formatMoney(progress.remaining)} to go`;
  document.querySelector("[data-home-wish-months]").textContent = progress.months;
  document.querySelector("[data-home-wish-bar]").style.width = `${progress.percent}%`;
}

function renderSavedWishes() {
  const wishes = getSavedWishes();
  saveWishes(wishes);
  wishList.innerHTML = "";
  homeWishRail.querySelectorAll("[data-wish-item]").forEach((item) => item.remove());
  wishes.forEach((wish) => {
    wishList.prepend(renderWish(wish));
    homeWishRail.prepend(renderHomeWish(wish));
  });
  updateHomeWish(wishes.at(-1));
}

function renderRecord(record) {
  const item = document.createElement("article");
  item.innerHTML = `
    <div>
      <strong></strong>
      <span></span>
    </div>
    <em></em>
  `;
  item.querySelector("strong").textContent = record.note || "Spending";
  item.querySelector("span").textContent = `${record.category} · ${record.date}`;
  item.querySelector("em").textContent = `−${record.amount}`;
  return item;
}

function renderSavedRecords() {
  const records = getSavedRecords();
  records.forEach((record) => recordList.prepend(renderRecord(record)));
}

function setRange(range) {
  currentRange = range;
  const data = rangeData[range];
  document.querySelector('[data-stat="spending"]').textContent = data.spending;
  document.querySelector('[data-stat="surplus"]').textContent = data.surplus;
  document.querySelector('[data-stat="goal"]').textContent = data.goal;
  document.querySelector('[data-stat="goalLine"]').textContent = data.goalLine;
  document.querySelector('[data-stat="goalHint"]').textContent = data.goalHint;

  renderDashboardCategories(getSavedCategories(), range);

  rangeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.range === range);
  });
}

function setView(view) {
  app.dataset.activeView = view;
  screens.forEach((screen) => {
    screen.classList.toggle("hidden", screen.dataset.view !== view);
  });

  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tabTarget === view);
  });
}

rangeButtons.forEach((button) => {
  button.addEventListener("click", () => setRange(button.dataset.range));
});

reserveList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-chart-series]");
  if (!button) return;
  currentChartSeries = button.dataset.chartSeries;
  renderChartSeries(currentChartSeries, currentRange);
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tabTarget;
    if (target) setView(target);
  });
});

openSheetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    app.classList.add("sheet-open");
    document.querySelector(".spend-sheet").setAttribute("aria-hidden", "false");
  });
});

closeSheetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeSheet();
    closeWishSheet();
  });
});

openWishSheetButtons.forEach((button) => {
  button.addEventListener("click", () => openWishSheet());
});

closeWishSheetButtons.forEach((button) => {
  button.addEventListener("click", closeWishSheet);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSheet();
    closeWishSheet();
  }
});

chipGroup.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  chipGroup.querySelectorAll("button").forEach((chip) => chip.classList.remove("active"));
  button.classList.add("active");
});

settingsList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-category]");
  if (!deleteButton) return;
  deleteButton.closest("[data-category-item]").remove();
});

addCategoryButton.addEventListener("click", () => {
  const item = document.createElement("div");
  item.dataset.categoryItem = "";
  item.dataset.left = "60";
  item.innerHTML = `
    <input class="category-icon-input" type="text" value="♡" aria-label="Category icon" maxlength="2" />
    <input class="category-name-input" type="text" value="New category" aria-label="Category name" />
    <input class="category-budget-input" type="text" value="$100" inputmode="decimal" />
    <button class="icon-button tiny danger" type="button" aria-label="Delete category" data-delete-category>×</button>
  `;
  settingsList.append(item);
  item.querySelector(".category-name-input").focus();
});

saveCategoriesButton.addEventListener("click", () => {
  const categories = readCategoryEditor();
  saveCategories(categories);
  applyCategories(categories);
  setView("home");
});

saveSettingsButton.addEventListener("click", () => {
  const previous = getSettings();
  const settings = {
    ...previous,
    monthlyBudget: parseMoney(monthlyBudgetInput.value),
    resetRule: resetRuleSelect.value,
    resetAction: resetActionSelect.value,
  };
  saveSettings(settings);
  renderSettings(settings);
  renderBudgetMonthLabel();
  renderHeroBudget(settings, getSavedCategories());
  setView("home");
});

wishCategorySelect.addEventListener("change", () => {
  document.querySelector("[data-wish-available]").value = formatMoney(getWishAvailable(wishCategorySelect.value, editingWishId));
});

addWishButton.addEventListener("click", () => {
  const wish = {
    id: editingWishId || createId(),
    name: document.querySelector("[data-wish-name]").value.trim() || "Wishlist item",
    category: document.querySelector("[data-wish-category]").value,
    price: document.querySelector("[data-wish-price]").value.trim() || "$0",
    months: Number(document.querySelector("[data-wish-months]").value) || 1,
    createdAt: editingWishId ? getSavedWishes().find((item) => item.id === editingWishId)?.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const wishes = getSavedWishes();
  const nextWishes = editingWishId
    ? wishes.map((item) => item.id === editingWishId ? wish : item)
    : [...wishes, wish];
  editingWishId = null;
  saveWishes(nextWishes);
  renderSavedWishes();
  applyCategories(getSavedCategories());
  updateHomeWish(wish);
  addWishButton.dataset.i18n = "addWishlistItem";
  addWishButton.textContent = t("addWishlistItem");
  closeWishSheet();
});

wishList.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-wish]");
  if (!editButton) return;
  const card = editButton.closest("[data-wish-item]");
  const wish = getSavedWishes().find((item) => item.id === card.dataset.wishId);
  if (!wish) return;
  openWishSheet(wish);
});

saveRecordButton.addEventListener("click", () => {
  const amount = document.querySelector(".amount-field input").value.trim() || "$0";
  const note = document.querySelector(".note-field input").value.trim();
  const category = document.querySelector(".chip-group .active").textContent.trim();
  const record = {
    amount,
    note,
    category,
    date: "Today",
    createdAt: new Date().toISOString(),
  };
  const records = getSavedRecords();
  records.push(record);
  saveRecords(records);
  recordList.prepend(renderRecord(record));
  closeSheet();
  setView("records");
});

languageSelect.addEventListener("change", () => {
  applyLanguage(languageSelect.value);
});

resetMonthlyBudgetsIfDue();
applyLanguage(currentLanguage);
renderSettings(getSettings());
applyCategories(getSavedCategories());
renderSavedRecords();
renderSavedWishes();
