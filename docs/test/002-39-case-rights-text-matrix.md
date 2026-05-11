# Test Case 02: Full 39-case rights test matrix
**Sprint**: 2   
**Description**: Verifies role-based access control across all 39 rights scenarios by validating which SMS modules and actions are allowed, restricted, hidden, or blocked for Superadmin, Admin, and User accounts when signing in via email or Google OAuth.

## Precondition
- The SMS web application is deployed and accessible at the provided URL: https://improject-hope-sms.netlify.app/.
- The tester has a stable internet connection and an up-to-date browser (Chrome/Firefox/Edge).
- Test user accounts are prepared with these states and credentials documented for use:
	1. Superadmin
	2. Admin 
	3. User 
- OAuth test account: a Google account is linked to the Superadmin or approved User account for Google Sign-In testing.
- Tester is signed out of all SMS sessions and, if testing Google OAuth, signed out of Google accounts in the browser or using an incognito window to avoid session bleed.


## Definitions
- **Allowed**: Feature is visible and clickable; action executes successfully with no permission errors
- **Hidden**: Feature/button/menu item is not visible in the UI for that role
- **Blocked**: Feature is visible but clicking it shows a "No permission" or similar error message

### Test Steps
**For each test user role (Superadmin, Admin, User):**

1. Open the SMS at https://improject-hope-sms.netlify.app/
2. Clear browser cache and sign out of all accounts
3. Login with the test user account (Email or Google OAuth)
4. Navigate to Sales Transactions module
5. For each right listed in the Test Data matrix:
   - **View Sales Transactions**: Verify sales list is visible and loadable
   - **Add new Sales Transaction**: Attempt to click "Add" button → verify visibility, clickability, and success/error
   - **Edit Sales Transaction**: Select a transaction → attempt to click "Edit" → verify visibility, clickability, and success/error
   - **Soft-Delete Sales Transactions**: Select a transaction → attempt to click "Delete" → verify visibility, clickability, and success/error
   - **Add/Edit/Soft-Delete Sales Details**: Repeat above for line items within transactions
6. Navigate to Lookup modules (Customer, Employee, Products, Price) → verify visibility and searchability
7. Navigate to Admin section → attempt to access "Manage User accounts" → verify visibility and access
8. Document actual result for each right/role combination in the Test Data table
9. Sign out and repeat for next role

### Expected Result
All 13 rights × 3 roles = 39 scenarios should match the expected access levels in the Test Data matrix (Allowed/Hidden/Blocked)


### Test Data


#### Superadmin Results

| Rights                         | Expected | Actual | Status |
|--------------------------------|----------|--------|--------|
| (SALES_VIEW) — View Transactions        | ✅ Allowed | ✅ Allowed | ✅ PASS |
| (SALES_ADD) — Create Transaction      | ✅ Allowed | ✅ Allowed | ✅ PASS |
| (SALES_EDIT) — Edit Transactions         | ✅ Allowed | ✅ Allowed | ✅ PASS |
| (SALES_DELETE) — Soft-Delete Transactions | ✅ Allowed | ✅ Allowed | ✅ PASS |
| (SD_VIEW) — View Sales Details        | ✅ Allowed | ✅ Allowed | ✅ PASS |
| (SD_ADD) — Add Line              | ✅ Allowed | ✅ Allowed | ✅ PASS |
| (SD_EDIT) — Edit Line             | ✅ Allowed | ✅ Allowed | ✅ PASS |
| (SD_DEL) — Soft Delete Line      | ✅ Allowed | ✅ Allowed | ✅ PASS |
| (CUST_LOOKUP) — Look Up Customer                | 👁️ Lookup | 👁️ Lookup | ✅ PASS |
| (EMP_LOOKUP) — Look Up Employee                | 👁️ Lookup | 👁️ Lookup | ✅ PASS |
| (PROD_LOOKUP) — Look Up Products                | 👁️ Lookup | 👁️ Lookup | ✅ PASS |
| (PRICE_LOOKUP) — Look Up Price History                   | 👁️ Lookup | 👁️ Lookup | ✅ PASS |
| (ADM_USER) — Manage Users           | ✅ Allowed | ✅ Allowed | ✅ PASS |

#### Admin Results

| Rights                         | Expected | Actual | Status |
|--------------------------------|----------|--------|--------|
| (SALES_VIEW) — View Transactions        | ✅ Allowed | ✅ Allowed | ✅ PASS |
| (SALES_ADD) — Create Transaction      | ✅ Allowed | ✅ Allowed | ✅ PASS |
| (SALES_EDIT) — Edit Transactions         | ✅ Allowed | ✅ Allowed | ✅ PASS |
| (SALES_DELETE) — Soft-Delete Transactions | ❌ Blocked | ❌ Blocked | ✅ PASS |
| (SD_VIEW) — View Sales Details        | ✅ Allowed | ✅ Allowed | ✅ PASS |
| (SD_ADD) — Add Line              | ✅ Allowed | ✅ Allowed | ✅ PASS |
| (SD_EDIT) — Edit Line             | ✅ Allowed | ✅ Allowed | ✅ PASS |
| (SD_DEL) — Soft Delete Line      | ❌ Blocked | ❌ Blocked | ✅ PASS |
| (CUST_LOOKUP) — Look Up Customer                | 👁️ Lookup | 👁️ Lookup | ✅ PASS |
| (EMP_LOOKUP) — Look Up Employee                | 👁️ Lookup | 👁️ Lookup | ✅ PASS |
| (PROD_LOOKUP) — Look Up Products                | 👁️ Lookup | 👁️ Lookup | ✅ PASS |
| (PRICE_LOOKUP) — Look Up Price History                   | 👁️ Lookup | 👁️ Lookup | ✅ PASS |
| (ADM_USER) — Manage Users           | ❌ Blocked | ❌ Blocked | ✅ PASS |

#### User Results

| Rights                         | Expected | Actual | Status |
|--------------------------------|----------|--------|--------|
| (SALES_VIEW) — View Transactions        | ✅ Allowed | ✅ Allowed | ✅ PASS |
| (SALES_ADD) — Create Transaction      | ❌ Blocked | ❌ Blocked | ✅ PASS |
| (SALES_EDIT) — Edit Transactions         | ❌ Blocked | ❌ Blocked | ✅ PASS |
| (SALES_DELETE) — Soft-Delete Transactions | ❌ Blocked | ❌ Blocked | ✅ PASS |
| (SD_VIEW) — View Sales Details        | ✅ Allowed | ✅ Allowed | ✅ PASS |
| (SD_ADD) — Add Line              | ❌ Blocked | ❌ Blocked | ✅ PASS |
| (SD_EDIT) — Edit Line             | ❌ Blocked | ❌ Blocked | ✅ PASS |
| (SD_DEL) — Soft Delete Line      | ❌ Blocked | ❌ Blocked | ✅ PASS |
| (CUST_LOOKUP) — Look Up Customer                | 👁️ Lookup | 👁️ Lookup | ✅ PASS |
| (EMP_LOOKUP) — Look Up Employee                | 👁️ Lookup | 👁️ Lookup | ✅ PASS |
| (PROD_LOOKUP) — Look Up Products                | 👁️ Lookup | 👁️ Lookup | ✅ PASS |
| (PRICE_LOOKUP) — Look Up Price History                   | 👁️ Lookup | 👁️ Lookup | ✅ PASS |
| (ADM_USER) — Manage Users           | ❌ Blocked | ❌ Blocked | ✅ PASS |