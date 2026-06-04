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
  { icon: "🎬", name: "娱乐", budget: 300, left: 300, tone: "entertainment" },
  { icon: "🎮", name: "游戏", budget: 220, left: 220, tone: "games" },
  { icon: "🐾", name: "宠物", budget: 320, left: 320, tone: "pets" },
  { icon: "🛒", name: "生活", budget: 1160, left: 1160, tone: "life" },
];

const translations = {
  en: {
    add: "＋ Add", addWishlistItem: "Add wishlist item", appTitle: "Budget HP", amount: "Amount", archiveRecords: "Archive records by month", autoRefreshBudget: "Auto refresh budget", availableToSave: "available to save", budgetDeviation: "Budget deviation", budgetLeft: "Budget left", cashRunway: "Spending pace", categories: "Categories", comparedWithPlan: "compared with plan", controls: "Controls", currency: "Currency", currentCategoryLeft: "This month left", customDay: "Custom day", dashboard: "Dashboard", delete: "Delete", edit: "Edit", emptyRecords: "No spending records yet", emptyWishlist: "No wishlist items yet", firstDay: "First day of every month", fundedByLeftover: "Funded by leftover budget", fundingCategory: "Funding category", goals: "Goals", history: "History", home: "Home", keepRecords: "Keep all records and reset remaining budget", language: "Language", lastDay: "Last day of every month", left: "left", localDevice: "Local device", manageCategories: "Manage categories", monthlyBudget: "Monthly budget", monthlyCategoryBudget: "Monthly category budget", monthlyPlan: "Monthly plan", monthlyTotalBudget: "Monthly total budget", name: "Name", nextUnlock: "Next unlock", note: "Note", off: "Off", plannedBudgetLine: "gray = budget plan", price: "Price", records: "Records", resetRules: "Reset rules", savedRecords: "Saved records", saveCategories: "Save categories", saveSettings: "Save settings", saveWishlistItem: "Save wishlist item", settings: "Settings", spendingTrend: "Spending over time", subtractFromBudget: "Subtract from budget", subtractSpending: "Subtract spending", targetMonths: "Target months", thingsToBuy: "Things to buy", today: "Today", totalRemaining: "Total remaining", totalSpending: "Total spending", whenRefreshed: "When refreshed", wishlist: "Wishlist",
  },
  zh: {
    add: "＋ 添加", addWishlistItem: "添加心愿", appTitle: "预算血条", amount: "金额", archiveRecords: "按月份归档记录", autoRefreshBudget: "自动刷新预算", availableToSave: "可存下", budgetDeviation: "偏离预算", budgetLeft: "剩余预算", cashRunway: "花费节奏", categories: "分类", comparedWithPlan: "相对计划", controls: "设置", currency: "货币", currentCategoryLeft: "本月分类剩余", customDay: "自定义日期", dashboard: "分析", delete: "删除", edit: "编辑", emptyRecords: "还没有消费记录", emptyWishlist: "还没有心愿单", firstDay: "每月第一天", fundedByLeftover: "由分类剩余预算推进", fundingCategory: "绑定分类", goals: "目标", history: "历史", home: "首页", keepRecords: "保留所有记录并重置剩余预算", language: "语言", lastDay: "每月最后一天", left: "剩余", localDevice: "本机保存", manageCategories: "管理分类", monthlyBudget: "月度预算", monthlyCategoryBudget: "每月分类预算", monthlyPlan: "月度计划", monthlyTotalBudget: "每月总预算", name: "名称", nextUnlock: "下一个解锁", note: "备注", off: "关闭", plannedBudgetLine: "灰线=预算基准", price: "价格", records: "记录", resetRules: "刷新规则", savedRecords: "已保存记录", saveCategories: "保存分类", saveSettings: "保存设置", saveWishlistItem: "保存心愿", settings: "设置", spendingTrend: "消费金额走势", subtractFromBudget: "扣除预算", subtractSpending: "记录消费", targetMonths: "几个月买到", thingsToBuy: "想买的东西", today: "今天", totalRemaining: "总剩余", totalSpending: "总消费", whenRefreshed: "刷新时", wishlist: "心愿单",
  },
};

let currentLanguage = localStorage.getItem("budgetHpLanguage") || "zh";
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
  renderHeroBudget(getSettings(), getSavedCategories());
  renderHomeCategories(getCategoriesWithBalances());
  renderSavedRecords();
  renderSavedWishes();
  setRange(currentRange);
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
  return getCategoriesWithBalances().find((category) => category.name === name);
}

function getCategoryLockedAmount(categoryName, excludeWishId = null) {
  return getSavedWishes()
    .filter((wish) => wish.category === categoryName && wish.id !== excludeWishId)
    .reduce((sum, wish) => sum + getWishCurrentMonthContribution(wish), 0);
}

function getWishAvailable(categoryName, excludeWishId = null) {
  const category = getCategoryByName(categoryName);
  if (!category) return 0;
  return Math.max(Number(category.left) || 0, 0);
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

function migrateLegacyMockData() {
  const records = JSON.parse(localStorage.getItem("budgetHpRecords") || "[]");
  const wishes = JSON.parse(localStorage.getItem("budgetHpWishes") || "null");
  if (Array.isArray(wishes)) {
    const realWishes = wishes.filter((wish) => wish.createdAt !== "default" && !String(wish.id || "").startsWith("default-"));
    if (realWishes.length !== wishes.length) saveWishes(realWishes);
  }

  const categories = JSON.parse(localStorage.getItem("budgetHpCategories") || "null");
  const legacyCategories = ["Entertainment", "Games", "Pets", "Life"];
  const isLegacyCategorySet = Array.isArray(categories)
    && categories.length === 4
    && categories.every((category, index) => category.name === legacyCategories[index])
    && categories.reduce((sum, category) => sum + (Number(category.budget) || 0), 0) === 1490;

  if (!records.length && isLegacyCategorySet) {
    saveCategories(defaultCategories);
  }
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

function getRecordDate(record) {
  const raw = record.createdAt || record.date;
  const parsed = raw && raw !== "Today" ? new Date(raw) : new Date();
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function getRecordAmount(record) {
  return parseMoney(record.amount);
}

function getStartOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getEndOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function getMonthStartsBetween(startDate, endDate = new Date()) {
  const months = [];
  const cursor = getStartOfMonth(startDate);
  const end = getStartOfMonth(endDate);
  while (cursor <= end) {
    months.push(new Date(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
}

function getCategorySpentInMonth(categoryName, monthDate) {
  const start = getStartOfMonth(monthDate);
  const end = getEndOfMonth(monthDate);
  return getSavedRecords().reduce((sum, record) => {
    const date = getRecordDate(record);
    return record.category === categoryName && date >= start && date <= end
      ? sum + getRecordAmount(record)
      : sum;
  }, 0);
}

function getWishStartDate(wish) {
  return getRecordDate({ createdAt: wish.createdAt || new Date().toISOString() });
}

function getCategoryBudget(categoryName) {
  const category = getSavedCategories().find((item) => item.name === categoryName);
  return Math.max(Number(category?.budget) || 0, 0);
}

function getWishFundedAmount(wish, includeCurrentMonth = true) {
  const price = Math.max(parseMoney(wish.price), 1);
  const monthlyBudget = getCategoryBudget(wish.category);
  const currentMonth = getStartOfMonth(new Date());
  const months = getMonthStartsBetween(getWishStartDate(wish)).filter((monthDate) => (
    includeCurrentMonth || monthDate < currentMonth
  ));
  return Math.min(months.reduce((sum, monthDate) => {
    const monthLeft = Math.max(monthlyBudget - getCategorySpentInMonth(wish.category, monthDate), 0);
    return sum + monthLeft;
  }, 0), price);
}

function getWishCurrentMonthContribution(wish) {
  const price = Math.max(parseMoney(wish.price), 1);
  const fundedBeforeCurrentMonth = getWishFundedAmount(wish, false);
  const stillNeededThisMonth = Math.max(price - fundedBeforeCurrentMonth, 0);
  return Math.min(stillNeededThisMonth, getWishAvailable(wish.category, wish.id));
}

function getRangeMonths(range) {
  if (range === "3M") return 3;
  if (range === "6M") return 6;
  if (range === "1Y") return 12;
  if (range === "ALL") {
    const records = getSavedRecords();
    if (!records.length) return 1;
    const earliest = records.reduce((min, record) => {
      const date = getRecordDate(record);
      return date < min ? date : min;
    }, new Date());
    const now = new Date();
    return Math.max((now.getFullYear() - earliest.getFullYear()) * 12 + now.getMonth() - earliest.getMonth() + 1, 1);
  }
  return 1;
}

function getRangeWindow(range, date = new Date()) {
  const end = date;
  if (range === "ALL") {
    const records = getSavedRecords();
    const earliest = records.reduce((min, record) => {
      const recordDate = getRecordDate(record);
      return recordDate < min ? recordDate : min;
    }, date);
    const start = records.length ? earliest : date;
    return { start, end, months: getRangeMonths(range) };
  }

  const months = getRangeMonths(range);
  const start = new Date(date);
  start.setMonth(start.getMonth() - months);
  return { start, end, months };
}

function getRecordsForRange(range, series = "total") {
  const { start, end } = getRangeWindow(range);
  return getSavedRecords().filter((record) => {
    const date = getRecordDate(record);
    const matchesSeries = series === "total" || record.category === series;
    return matchesSeries && date >= start && date <= end;
  });
}

function getCurrentMonthSpent(categoryName = null) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return getSavedRecords().reduce((sum, record) => {
    const date = getRecordDate(record);
    const matchesCategory = !categoryName || record.category === categoryName;
    return matchesCategory && date >= start && date <= end ? sum + getRecordAmount(record) : sum;
  }, 0);
}

function getCategoriesWithBalances(categories = getSavedCategories()) {
  return categories.map((category) => ({
    ...category,
    left: Math.max((Number(category.budget) || 0) - getCurrentMonthSpent(category.name), 0),
  }));
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
  const spent = getCurrentMonthSpent();
  const left = Math.max(budget - spent, 0);
  const percent = budget > 0 ? Math.min(Math.round((left / budget) * 100), 100) : 0;
  heroLeft.textContent = formatMoney(left);
  heroSubline.textContent = currentLanguage === "zh"
    ? `本月已花 ${formatMoney(spent)} / 月预算 ${formatMoney(budget)}`
    : `${formatMoney(spent)} spent of ${formatMoney(budget)} monthly budget`;
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
    return {
      icon: item.querySelector(".category-icon-input").value.trim() || "♡",
      name: item.querySelector(".category-name-input").value.trim() || "Category",
      budget,
      left: budget,
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
    row.dataset.categoryName = category.name;
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
        <span class="damage-bar"></span>
        <span class="available-bar"></span>
        <span class="locked-bar"></span>
      </div>
    `;
    row.querySelector(".category-icon").textContent = category.icon || "♡";
    row.querySelector("h3").textContent = category.name;
    row.querySelector("p").textContent = locked > 0
      ? currentLanguage === "zh"
        ? `${formatMoney(available)} 可花 · ${formatMoney(locked)} 已锁定`
        : `${formatMoney(available)} spendable · ${formatMoney(locked)} locked`
      : currentLanguage === "zh"
        ? `${formatMoney(category.left)} 剩余 / ${formatMoney(category.budget)}`
        : `${formatMoney(category.left)} left of ${formatMoney(category.budget)}`;
    row.querySelector("strong").textContent = `${percent}%`;
    row.querySelector(".hp-track").classList.toggle("warning", percent < 40);
    row.querySelector(".available-bar").style.width = `${availablePercent}%`;
    row.querySelector(".locked-bar").style.width = `${lockedPercent}%`;
    categoryList.append(row);
  });
}

function getRangeMultiplier(range) {
  return getRangeMonths(range);
}

function renderDashboardCategories(categories, range = currentRange) {
  reserveList.innerHTML = "";
  const series = [{ key: "total", label: currentLanguage === "zh" ? "总消费" : "Total spending" }]
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
  return getSpendingChart(categoryName, range).actualPath;
}

function getAreaPath(linePath) {
  return `${linePath} L330 160 L10 160 Z`;
}

function getRangeLabel(range) {
  const labels = {
    "1M": currentLanguage === "zh" ? "过去1个月" : "Past 1 month",
    "3M": currentLanguage === "zh" ? "过去3个月" : "Past 3 months",
    "6M": currentLanguage === "zh" ? "过去6个月" : "Past 6 months",
    "1Y": currentLanguage === "zh" ? "过去1年" : "Past 1 year",
    ALL: currentLanguage === "zh" ? "全部历史" : "All history",
  };
  return labels[range] || labels["1M"];
}

function getSeriesBudget(series) {
  if (series === "total") return Number(getSettings().monthlyBudget) || 0;
  const category = getSavedCategories().find((item) => item.name === series);
  return Number(category?.budget) || 0;
}

function getSeriesSpent(series) {
  return getRecordsForRange(currentRange, series).reduce((sum, record) => sum + getRecordAmount(record), 0);
}

function pointsToPath(points) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"}${point[0]} ${point[1]}`).join(" ");
}

function getSpendingChart(series, range) {
  const { start, end, months } = getRangeWindow(range);
  const budget = getSeriesBudget(series) * months;
  const records = getRecordsForRange(range, series).sort((a, b) => getRecordDate(a) - getRecordDate(b));
  const actualSpent = records.reduce((sum, record) => sum + getRecordAmount(record), 0);
  const limit = Math.max(budget, actualSpent, 1);
  const toY = (value) => 148 - Math.min(value / limit, 1.15) * 106;
  const x = [10, 74, 138, 202, 266, 330];
  const span = Math.max(end - start, 1);
  const actualPoints = x.map((pointX, index) => {
    const checkpoint = new Date(start.getTime() + span * (index / (x.length - 1)));
    const spentAtPoint = records
      .filter((record) => getRecordDate(record) <= checkpoint)
      .reduce((sum, record) => sum + getRecordAmount(record), 0);
    return [pointX, Math.max(toY(spentAtPoint), 28)];
  });
  const planPoints = x.map((pointX, index) => [pointX, toY(budget * (index / (x.length - 1)))]);
  return {
    actualPath: pointsToPath(actualPoints),
    planPath: pointsToPath(planPoints),
    point: actualPoints.at(-1),
    spent: actualSpent,
    budget,
    deviation: actualSpent - budget,
  };
}

function renderChartSeries(series, range = currentRange) {
  const categories = getSavedCategories();
  const category = categories.find((item) => item.name === series);
  const chart = getSpendingChart(series, range);
  const path = chart.actualPath;
  const label = series === "total"
    ? (currentLanguage === "zh" ? "总消费走势" : "Total spending trend")
    : `${category?.icon || "♡"} ${series}`;
  const value = currentLanguage === "zh"
    ? `${formatMoney(chart.spent)} / ${formatMoney(chart.budget)}`
    : `${formatMoney(chart.spent)} / ${formatMoney(chart.budget)}`;

  document.querySelector('[data-i18n="spendingTrend"]').textContent = label;
  document.querySelector('[data-stat="trend"]').textContent = value;
  document.querySelector(".chart-line").setAttribute("d", path);
  document.querySelector(".chart-area").setAttribute("d", getAreaPath(path));
  document.querySelector(".plan-line").setAttribute("d", chart.planPath);

  document.querySelector(".line-chart circle").setAttribute("cx", chart.point[0]);
  document.querySelector(".line-chart circle").setAttribute("cy", chart.point[1]);

  reserveList.querySelectorAll("[data-chart-series]").forEach((button) => {
    button.classList.toggle("active", button.dataset.chartSeries === series);
  });
}

function applyCategories(categories) {
  renderCategoryEditor(categories);
  renderHomeCategories(getCategoriesWithBalances(categories));
  renderCategoryChoices(categories);
  renderHeroBudget(getSettings(), getCategoriesWithBalances(categories));
  setRange(currentRange);
}

function closeSheet() {
  app.classList.remove("sheet-open");
  document.querySelector(".spend-sheet").setAttribute("aria-hidden", "true");
}

function openWishSheet(wish = null) {
  editingWishId = wish?.id || null;
  renderMonthOptions();
  document.querySelector("[data-wish-name]").value = wish?.name || "";
  document.querySelector("[data-wish-category]").value = wish?.category || wishCategorySelect.options[0]?.value || "";
  document.querySelector("[data-wish-price]").value = wish?.price || "";
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
  let changed = false;
  const records = JSON.parse(localStorage.getItem("budgetHpRecords") || "[]").map((record) => {
    if (record.id) return record;
    changed = true;
    return { id: createId(), ...record };
  });
  if (changed) saveRecords(records);
  return records;
}

function saveRecords(records) {
  localStorage.setItem("budgetHpRecords", JSON.stringify(records));
}

function getSavedWishes() {
  const saved = JSON.parse(localStorage.getItem("budgetHpWishes") || "null");
  const wishes = Array.isArray(saved) ? saved.filter((wish) => wish.createdAt !== "default" && !String(wish.id || "").startsWith("default-")) : [];
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
  const monthlyBudget = getCategoryBudget(wish.category);
  const available = getWishFundedAmount(wish);
  const remaining = Math.max(price - available, 0);
  const monthsLeft = monthlyBudget > 0 ? Math.ceil(remaining / monthlyBudget) : 0;
  return {
    price,
    available,
    remaining,
    percent: Math.min(Math.round((available / price) * 100), 100),
    months: remaining === 0
      ? currentLanguage === "zh" ? "可购买" : "Ready"
      : monthlyBudget > 0
        ? currentLanguage === "zh" ? `${monthsLeft} 个月` : `${monthsLeft} months`
        : currentLanguage === "zh" ? "缺少分类预算" : "No category budget",
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
  item.querySelector("p").textContent = currentLanguage === "zh"
    ? `${wish.category || "Category"} · 已攒 ${formatMoney(progress.available)} / 目标 ${formatMoney(progress.price)} · 还差 ${formatMoney(progress.remaining)}`
    : `${wish.category || "Category"} · ${formatMoney(progress.available)} saved of ${formatMoney(progress.price)} · ${formatMoney(progress.remaining)} to go`;
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
  if (!document.querySelector("[data-home-wish-name]")) return;
  const progress = getWishProgress(wish);
  document.querySelector("[data-home-wish-name]").textContent = wish.name || "Wishlist item";
  document.querySelector("[data-home-wish-copy]").textContent = currentLanguage === "zh"
    ? `${wish.category || "Category"} · 已攒 ${formatMoney(progress.available)} / 目标 ${formatMoney(progress.price)} · 还差 ${formatMoney(progress.remaining)}`
    : `${wish.category || "Category"} · ${formatMoney(progress.available)} saved of ${formatMoney(progress.price)} · ${formatMoney(progress.remaining)} to go`;
  document.querySelector("[data-home-wish-months]").textContent = progress.months;
  document.querySelector("[data-home-wish-bar]").style.width = `${progress.percent}%`;
}

function renderSavedWishes() {
  const wishes = getSavedWishes();
  saveWishes(wishes);
  wishList.innerHTML = "";
  homeWishRail.innerHTML = "";
  if (!wishes.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = t("emptyWishlist");
    wishList.append(empty);
    const homeEmpty = empty.cloneNode(true);
    homeWishRail.append(homeEmpty);
    return;
  }
  wishes.forEach((wish) => {
    wishList.prepend(renderWish(wish));
    homeWishRail.prepend(renderHomeWish(wish));
  });
  updateHomeWish(wishes.at(-1));
}

function renderRecord(record) {
  const item = document.createElement("article");
  item.dataset.recordId = record.id;
  item.innerHTML = `
    <div>
      <strong></strong>
      <span></span>
    </div>
    <div class="record-actions">
      <em></em>
      <button class="mini-button danger" type="button" data-delete-record></button>
    </div>
  `;
  const date = getRecordDate(record);
  const label = currentLanguage === "zh"
    ? date.toLocaleDateString("zh-CN", { month: "long", day: "numeric" })
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  item.querySelector("strong").textContent = record.note || (currentLanguage === "zh" ? "消费" : "Spending");
  item.querySelector("span").textContent = `${record.category} · ${label}`;
  item.querySelector("em").textContent = `−${record.amount}`;
  item.querySelector("[data-delete-record]").textContent = t("delete");
  return item;
}

function renderSavedRecords() {
  const records = getSavedRecords();
  recordList.innerHTML = "";
  if (!records.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = t("emptyRecords");
    recordList.append(empty);
    return;
  }
  records.forEach((record) => recordList.prepend(renderRecord(record)));
}

function refreshMoneyViews() {
  renderSavedRecords();
  renderHeroBudget(getSettings(), getCategoriesWithBalances());
  renderHomeCategories(getCategoriesWithBalances());
  renderSavedWishes();
  setRange(currentRange);
}

function getCategoryLeftPercent(category) {
  const budget = Math.max(Number(category?.budget) || 1, 1);
  return Math.min(Math.max(((Number(category?.left) || 0) / budget) * 100, 0), 100);
}

function animateCategoryDamage(categoryName, previousPercent, nextPercent) {
  const row = [...categoryList.querySelectorAll("[data-category-name]")]
    .find((item) => item.dataset.categoryName === categoryName);
  if (!row) return;
  row.style.setProperty("--damage-start", `${Math.max(previousPercent, nextPercent)}%`);
  row.style.setProperty("--damage-end", `${Math.min(previousPercent, nextPercent)}%`);
  row.classList.remove("category-hit");
  void row.offsetWidth;
  row.classList.add("category-hit");
  window.setTimeout(() => row.classList.remove("category-hit"), 900);
}

function setRange(range) {
  currentRange = range;
  const months = getRangeMonths(range);
  const settings = getSettings();
  const monthlyBudget = Number(settings.monthlyBudget) || 0;
  const planned = monthlyBudget * months;
  const spent = getRecordsForRange(range).reduce((sum, record) => sum + getRecordAmount(record), 0);
  const left = Math.max(planned - spent, 0);
  const deviation = spent - planned;
  document.querySelector('[data-stat="spending"]').textContent = formatMoney(spent);
  document.querySelector('[data-stat="surplus"]').textContent = formatMoney(left);
  document.querySelector('[data-stat="goal"]').textContent = deviation <= 0
    ? currentLanguage === "zh" ? `低于 ${formatMoney(Math.abs(deviation))}` : `${formatMoney(Math.abs(deviation))} under`
    : currentLanguage === "zh" ? `超出 ${formatMoney(deviation)}` : `${formatMoney(deviation)} over`;
  document.querySelector('[data-stat="goalLine"]').textContent = currentLanguage === "zh"
    ? `${getRangeLabel(range)} · 计划 ${formatMoney(planned)}`
    : `${getRangeLabel(range)} · ${formatMoney(planned)} planned`;
  document.querySelector('[data-stat="goalHint"]').textContent = currentLanguage === "zh"
    ? `实际 ${formatMoney(spent)}`
    : `Actual ${formatMoney(spent)}`;
  document.querySelector('[data-stat="rangeLabel"]').textContent = getRangeLabel(range);

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
  setRange(currentRange);
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

recordList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-record]");
  if (!deleteButton) return;
  const record = deleteButton.closest("[data-record-id]");
  if (!record) return;
  saveRecords(getSavedRecords().filter((item) => item.id !== record.dataset.recordId));
  refreshMoneyViews();
});

saveRecordButton.addEventListener("click", () => {
  const amount = document.querySelector(".amount-field input").value.trim() || "$0";
  const note = document.querySelector(".note-field input").value.trim();
  const activeCategory = document.querySelector(".chip-group .active");
  if (!activeCategory) return;
  const category = activeCategory.textContent.trim();
  const previousCategory = getCategoriesWithBalances().find((item) => item.name === category);
  const previousPercent = getCategoryLeftPercent(previousCategory);
  const record = {
    id: createId(),
    amount: formatMoney(parseMoney(amount)),
    note,
    category,
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  const records = getSavedRecords();
  records.push(record);
  saveRecords(records);
  refreshMoneyViews();
  closeSheet();
  setView("home");
  const nextCategory = getCategoriesWithBalances().find((item) => item.name === category);
  window.requestAnimationFrame(() => {
    animateCategoryDamage(category, previousPercent, getCategoryLeftPercent(nextCategory));
  });
});

languageSelect.addEventListener("change", () => {
  applyLanguage(languageSelect.value);
});

migrateLegacyMockData();
resetMonthlyBudgetsIfDue();
applyLanguage(currentLanguage);
renderSettings(getSettings());
applyCategories(getSavedCategories());
renderSavedRecords();
renderSavedWishes();
