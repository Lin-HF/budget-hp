# Budget HP Technical Summary

## Current Project Structure

The prototype is a static web app in:

- `index.html`
- `styles.css`
- `app.js`

No build step is currently required.

Local preview has been run with a Node static server on:

- `http://10.0.0.30:4174`

The IP may change depending on Wi-Fi/DHCP. The server must be restarted if the terminal/session dies.

## Current Runtime Model

The app uses plain DOM manipulation and `localStorage`.

Important localStorage keys:

- `budgetHpCategories`
- `budgetHpRecords`
- `budgetHpWishes`
- `budgetHpSettings`
- `budgetHpLanguage`

## Main DOM/Data Wiring

### App State

Important globals in `app.js`:

- `currentLanguage`
- `currentRange`
- `editingWishId`

Important DOM refs:

- `categoryList`
- `reserveList`
- `chipGroup`
- `wishCategorySelect`
- `wishMonthsSelect`
- `homeWishRail`
- `wishList`
- `monthlyBudgetInput`
- hero refs:
  - `heroLeft`
  - `heroSubline`
  - `heroPercent`
  - `heroBar`

## Categories

Default categories:

```js
const defaultCategories = [
  { icon: "🎬", name: "Entertainment", budget: 300, left: 180, tone: "entertainment" },
  { icon: "🎮", name: "Games", budget: 220, left: 70, tone: "games" },
  { icon: "🐾", name: "Pets", budget: 320, left: 240, tone: "pets" },
  { icon: "🛒", name: "Life", budget: 650, left: 430, tone: "life" },
];
```

Current functions:

- `getSavedCategories()`
- `saveCategories(categories)`
- `renderCategoryEditor(categories)`
- `readCategoryEditor()`
- `renderHomeCategories(categories)`
- `renderDashboardCategories(categories, range)`
- `renderCategoryChoices(categories)`
- `applyCategories(categories)`

Current behavior:

- Category editor lives on a dedicated `categories` view.
- Home Categories `Edit` button navigates to `categories`.
- Save Categories:
  - Reads editor.
  - Saves to localStorage.
  - Re-renders Home Categories.
  - Re-renders Dashboard category summaries.
  - Re-renders spending category chips.
  - Re-renders wishlist category select.
  - Returns Home.

## Settings

Settings storage:

```js
budgetHpSettings = { monthlyBudget: number }
```

Current functions:

- `getSettings()`
- `saveSettings(settings)`
- `renderSettings(settings)`
- `renderHeroBudget(settings, categories)`

Save settings behavior:

- Reads monthly total budget input.
- Saves to localStorage.
- Updates hero budget.
- Returns Home.

Hero calculation currently:

```js
left = sum(category.left)
spent = monthlyBudget - left
percent = left / monthlyBudget
```

This is a prototype approximation. Future correct source of truth should be monthly budget minus spending records, with category budgets also computed from records.

## Wishlist

Default wishes:

```js
const defaultWishes = [
  { id: "default-game", name: "New game", category: "Games", price: "$100", available: "$70", monthly: "$30", createdAt: "default" },
  { id: "default-computer", name: "Computer", category: "Life", price: "$2,000", available: "$1,284", monthly: "$200", createdAt: "default" },
  { id: "default-headphones", name: "Headphones", category: "Entertainment", price: "$260", available: "$180", monthly: "$80", createdAt: "default" },
];
```

Note: older/default wishes may still contain legacy `available` or `monthly`. New model should prefer:

- `price`
- `months`
- `category`

Current Wishlist functions:

- `getSavedWishes()`
- `saveWishes(wishes)`
- `getWishMonths(wish)`
- `getWishAvailable(categoryName, excludeWishId)`
- `getCategoryLockedAmount(categoryName, excludeWishId)`
- `getWishProgress(wish)`
- `getWishIcon(wish)`
- `renderWish(wish)`
- `renderHomeWish(wish)`
- `renderSavedWishes()`
- `openWishSheet(wish)`
- `closeWishSheet()`

Current Wishlist interaction:

- Wishlist tab has list cards with `Edit`.
- Add button opens bottom sheet.
- Edit opens same bottom sheet with data populated.
- Save updates existing item if `editingWishId` is set, otherwise creates new item.
- Save closes the sheet and re-renders Wishlist and Home Wishlist.

Current locking model:

```js
lockedMonthly = price / months
categoryLocked = sum(lockedMonthly for category)
categorySpendable = category.left - categoryLocked
```

Home category bar:

- Green = spendable.
- Gray striped = locked.

Important caveat:

`getWishProgress()` currently mixes locked amount into availability with a simplified formula. This should be revisited when moving to a real data model.

## Bottom Sheets

There are currently two bottom sheets:

- `spend-sheet`
- `wish-sheet`

State classes on `.app-shell`:

- `sheet-open`
- `wish-sheet-open`

Shared backdrop:

- `.sheet-backdrop`

Closing behavior:

- Close buttons.
- Backdrop click through `data-close-sheet`.
- Escape closes both.

## Language

Language is handled with a translation dictionary in `app.js`.

Key:

- `budgetHpLanguage`

Functions:

- `t(key)`
- `applyLanguage(language)`

Elements use:

```html
data-i18n="..."
```

User-generated labels are not translated.

## Navigation

Screens use:

```html
data-view="home|wishlist|records|settings|categories"
```

Navigation buttons use:

```html
data-tab-target="..."
```

`setView(view)` toggles `.hidden` on screens and updates `data-active-view`.

Bottom tab order:

- Home
- Wishlist
- center subtract button
- Records
- Settings

Categories is not a bottom tab. It is reached from Home > Categories > Edit.

## Known Weaknesses / Next Refactor Targets

### 1. Stable IDs

Categories are currently matched by name in several places.

This is fragile. Future model should use stable category IDs:

```js
categoryId
```

Wishlist and records should reference `categoryId`, not category name.

### 2. Source of Truth

Current category `left` is stored directly.

Better model:

- Monthly budget.
- Category budget.
- Spending records.
- Wishlist locks.

Derived:

- Category spent.
- Category left.
- Spendable.
- Locked.
- Total remaining.

### 3. Records Do Not Recalculate Budgets Yet

Spending records currently save and display, but do not fully update category left or dashboard totals.

This should be the next functional milestone.

### 4. Dashboard Uses Mixed Static and Dynamic Data

Dashboard category list is dynamic now.

Some metric cards and chart values are still static/range mock data.

Future:

- Compute metrics from records.
- Compute by selected range.
- Use real time-series aggregation.

### 5. Wishlist Locking Needs Formal Definition

Current locking is:

```js
price / months
```

Open decisions:

- Does lock reset monthly?
- If a category has insufficient spendable budget, is the wishlist underfunded or does it overdraft?
- Does buying the item create a spending record?
- Can multiple wishlist items lock the same category beyond its remaining amount?

### 6. Persistence

Current persistence is `localStorage`.

Future AWS approach discussed:

- S3 + CloudFront for frontend.
- API Gateway + Lambda for API.
- DynamoDB for data.
- Auth through Cognito or equivalent.

Do not put AWS keys in frontend or directly write to DynamoDB from unauthenticated browser code.

## Local Preview Command

The static server used during development:

```bash
node -e "const http=require('http'),fs=require('fs'),path=require('path');const root=process.cwd();const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'};http.createServer((req,res)=>{const u=req.url==='/'?'/index.html':req.url.split('?')[0];const file=path.join(root,u);fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'text/plain'});res.end(data);});}).listen(4174,'0.0.0.0',()=>console.log('http://10.0.0.30:4174'));setInterval(()=>{},1000);"
```

If IP changes, replace `10.0.0.30` with the active `en0` IPv4 address from `ifconfig`.

