 Member 4: Full Production Regression Test Log
**Sprint 3: W6 PR-03 — test/e2e-rights-production**

 Test Overview
Sinubukan ang access permissions para sa lahat ng **13 System Rights/Routes** base sa **Section 3.2 Rights Matrix**.

- **Environment:** Production (Live)
- **Tester:** Member 4 (Rights & Auth)
- **Status:**  100% COMPLIANT WITH RIGHTS MATRIX

---

 13 Rights Access Matrix (Compliance Check)
Ito ang verification kung tama ang access ng bawat role base sa documentation.

| #  | Right / Feature (per Matrix 3.2) | STAFF | ADMIN | SUPERADMIN | Status |
|:---|:---------------------------------|:-----:|:-----:|:----------:|:------:|
| 1  | SALES_VIEW (View Transactions)   | ✅    | ✅    | ✅         | Pass   |
| 2  | SALES_ADD (Create Transaction)   | ❌    | ✅    | ✅         | Pass   |
| 3  | SALES_EDIT (Edit Transaction)    | ❌    | ✅    | ✅         | Pass   |
| 4  | SALES_DEL (Soft Delete)          | ❌    | ❌    | ✅         | Pass   |
| 5  | SD_VIEW (View Sales Details)     | ✅    | ✅    | ✅         | Pass   |
| 6  | SD_ADD (Add Line Item)           | ❌    | ✅    | ✅         | Pass   |
| 7  | SD_EDIT (Edit Line Item)         | ❌    | ✅    | ✅         | Pass   |
| 8  | SD_DEL (Soft Delete Line)        | ❌    | ❌    | ✅         | Pass   |
| 9  | CUST_LOOKUP (Customers)          | ✅    | ✅    | ✅         | Pass   |
| 10 | EMP_LOOKUP (Employees)           | ✅    | ✅    | ✅         | Pass   |
| 11 | PROD_LOOKUP (Products)           | ✅    | ✅    | ✅         | Pass   |
| 12 | PRICE_LOOKUP (Price History)     | ✅    | ✅    | ✅         | Pass   |
| 13 | ADM_USER (Manage Users)          | ❌    | ❌    | ✅         | Pass   |



Detailed Regression Results

 1. STAFF (Sales Agent) Role
- **Access Check:** Nakakakita lang ng Sales View at Lookups.
- **Gating:** Hindi nakikita ang "Administration" sa Sidebar.
- **Result:** **PASSED** (Strictly followed "NO" flags in Matrix).

 2. ADMIN (Sales Manager) Role
- **Access Check:** May access sa Sales Add/Edit pero **WALANG** access sa Delete.
- **Gating:** Base sa Matrix 3.2, ang `ADM_USER` ay **NO** para sa Admin. Na-verify na hidden ang "User Management" sa kanila.
- **Result:** **PASSED** (Correctly restricted despite "Admin" role name).

 3. SUPERADMIN Role
- **Access Check:** "YES" sa lahat ng 13 Rights.
- **Protection Logic:** Na-verify na kahit ang SuperAdmin ay hindi pwedeng i-deactivate ang sarili nilang row (🛡️ Protected).
- **Result:** **PASSED**


 