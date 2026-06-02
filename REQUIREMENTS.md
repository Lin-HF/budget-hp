# Budget HP Requirements

## Product Goal

Build a mobile-first web app for iPhone that behaves like a lightweight app when added to the home screen. The core model is reverse budgeting: each month starts with a fixed budget, and spending subtracts from it like a game HP bar.

The app should help the user answer:

- How much budget do I have left this month?
- How much remains in each category?
- How have my spending and remaining budget changed across time ranges?
- Can I afford a wishlist item based on the category budget left?
- How much of a category is locked for wishlist goals?

## Platform

- Web app optimized for iPhone 15 Pro Max.
- Should be usable from Safari and as a home-screen web app.
- Current prototype is static HTML/CSS/JS.
- Current storage is `localStorage`; future target is AWS-backed persistence.

## Core Screens

### Home

Home is the primary status dashboard.

Required elements:

- Monthly total remaining budget.
- Large HP-style progress bar.
- Percent indicator.
- Wishlist preview section.
- Categories section.
- Dashboard section.
- Floating center subtract button.
- Bottom tab navigation.

Home should not be a marketing page. It should open directly into the usable app.

### Categories On Home

The Categories module shows budget state per category.

Each category row should show:

- Icon.
- Category name.
- Spendable amount.
- Locked amount if wishlist goals reserve part of the category.
- Total category budget.
- HP bar.

HP bar behavior:

- Green portion = spendable remaining budget.
- Gray/locked portion = money reserved for wishlist goals.
- Warning style when remaining budget is low.

The Categories module has an `Edit` button. This opens a dedicated category management page.

### Category Management

Category editing should not live inside Settings.

Category management requirements:

- Entered from Home > Categories > Edit.
- Supports create, read, update, delete.
- Each category has:
  - Icon/emoji.
  - Name.
  - Monthly budget.
  - Current remaining amount.
- Save action:
  - Persists categories.
  - Returns to Home.
  - Updates Home Categories.
  - Updates Dashboard category summaries.
  - Updates spending sheet category buttons.
  - Updates Wishlist category selector.

### Spending Entry

The global subtract button is the main action.

Requirements:

- Floating button fixed at bottom center.
- Visible across screens.
- Opens bottom sheet.
- Bottom tab has no separate Spend tab.
- Spend sheet includes:
  - Amount.
  - Category.
  - Note.
  - Confirm button.
- Saving a record should:
  - Persist record.
  - Add it to Records.
  - Eventually update category remaining and dashboard calculations.

Current prototype saves records but does not fully recalculate all budgets from records yet.

### Records

Records is a bottom tab.

Requirements:

- Shows saved spending records.
- Each record has note, category, date, and amount.
- Future requirements:
  - Edit/delete records.
  - Filter by range/category.
  - Use records as source of truth for category spending.

### Wishlist

Wishlist is a bottom tab.

Concept:

Wishlist items are not independent wallets. They are funded by category budget left.

Example:

- Category: Games.
- Game target price: `$100`.
- If Games category has `$70` left this month, progress is based on that category.
- If the user spends on skins in Games, Games remaining goes down, so wishlist progress slows.

Wishlist item fields:

- Name.
- Funding category.
- Price.
- Current category left, read-only.
- Target months, 1 to 24.

Wishlist saving logic:

- User chooses target months.
- Locked amount per month = `price / targetMonths`.
- That amount is locked inside the linked category.

Example:

- Price `$100`.
- Target `1 month`: locks `$100` from the category this month.
- Target `2 months`: locks `$50`.
- Target `10 months`: locks `$10`.

Wishlist UI requirements:

- Wishlist tab list cards have `Edit`.
- Editing opens a bottom sheet from the bottom.
- Add also opens the same bottom sheet.
- Home Wishlist preview should be horizontally scrollable.
- Home Wishlist cards should not show edit buttons.
- Wishlist cards should show icon, name, category, available amount, target price, remaining gap, and estimated months/readiness.

### Dashboard

Dashboard explains overall budget performance across time.

Time ranges:

- `1M`
- `3M`
- `6M`
- `1Y`
- `ALL`

Dashboard should be amount-first, not percentage-first.

Important metrics:

- Total spending.
- Budget left.
- Goal gap.
- Remaining budget trend.
- Category summary for selected range.

Dashboard section should include a horizontally scrollable metric-card area. Only that internal area should scroll horizontally; the page itself must not have horizontal overflow.

Dashboard category summaries must update when category names or budgets change.

### Settings

Settings is for global app settings only.

Includes:

- Language.
- Monthly total budget.
- Currency.
- Auto refresh budget.
- Refresh behavior.

Settings should not contain category CRUD.

Save Settings behavior:

- Persist settings.
- Return to Home.
- Update Home hero budget:
  - Total remaining.
  - Monthly budget.
  - Spent.
  - Percent.
  - HP bar width.

### Language

Settings supports language switching:

- English.
- Chinese.

Language switching requirements:

- Immediate UI update.
- Persist selected language.
- User-created category names and wishlist names should not be translated automatically.

## Navigation

Bottom tab order:

1. Home
2. Wishlist
3. Center floating subtract button
4. Records
5. Settings

The subtract button is visually centered and fixed. It should not overlap tab labels.

## Storage Requirements

Current local prototype:

- `budgetHpCategories`
- `budgetHpRecords`
- `budgetHpWishes`
- `budgetHpSettings`
- `budgetHpLanguage`

Current storage is `localStorage`.

Risks:

- Not cross-device.
- Can be cleared by Safari website-data cleanup.
- Bound to origin/IP/host.

Future target:

- AWS-backed persistence using DynamoDB.
- Static hosting via S3/CloudFront.
- API layer should mediate writes to DynamoDB; browser should not directly write to DynamoDB with broad permissions.

## Future Backend Direction

Preferred AWS architecture:

- S3 + CloudFront for static frontend.
- API Gateway + Lambda for backend API.
- DynamoDB for persistence.
- Cognito or another auth layer for user identity.

Avoid:

- Direct unauthenticated browser calls to DynamoDB.
- Embedding AWS keys in frontend.

## Data Model Concepts

### Category

Fields:

- `id`
- `icon`
- `name`
- `budget`
- `left`
- optional `tone`

### Spending Record

Fields:

- `id`
- `amount`
- `category`
- `note`
- `date`
- `createdAt`

Future: category should be referenced by stable category id, not name.

### Wishlist Item

Fields:

- `id`
- `name`
- `category`
- `price`
- `months`
- `createdAt`
- `updatedAt`

Future: category should be referenced by stable category id.

Derived values:

- `lockedMonthly = price / months`
- `categorySpendable = category.left - sum(lockedMonthly for category)`
- `progress = min((categorySpendable + lockedMonthly) / price, 1)`

## Important UX Rules

- Bottom sheets for quick edits/actions.
- Home is primarily read-only and glanceable.
- Management actions live on dedicated screens or bottom sheets.
- Avoid making the whole page horizontally scrollable.
- Only specific rails/cards should scroll horizontally.
- Save actions should visibly complete, usually returning to the relevant previous page.

