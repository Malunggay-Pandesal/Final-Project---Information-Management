# Test Case 03: Cascade soft-delete, recovery, RLS bypass tests
**Sprint**: 2   
**Description**: This document documents test cases focusing on the data integrity and visibility logic involving the "ripple effect" of soft-deletes and the security of Row Level Security (RLS)

## Precondition
 - Database seeded with sample Sales and SalesDetail records including at least one linked transaction with multiple line items.
 - A Superadmin and an Admin user accounts exist; their credentials are available for testing.
 - Supabase RLS policies are enabled: only rows with status = "ACTIVE" are visible to standard users; admins/superadmins bypass or view inactive rows as per policy.
 - The Superadmin account has permission to soft-delete (set to INACTIVE) and recover (set to ACTIVE) sales records.
 - The standard User role has restricted visibility: cannot see INACTIVE sales or access a /deleted-items route.
 - Browser cleared of auth state or use a private window before each login to ensure fresh session.


### Test Steps

#### 1. Cascade Soft-Delete Test
1. Log in as Superadmin user
2. Navigate to the Sales list
3. Identify a Sales record with multiple linked SalesDetail rows
4. Click the soft-delete button to set the Sales record to INACTIVE
5. Verify in the database that all linked SalesDetail rows are also marked INACTIVE
6. Log in as a standard User in a fresh session
7. Verify the deleted Sales record and its line items are no longer visible in the UI

#### 2. Cascade Recovery Test
1. Log in as Admin user
2. Navigate to the Deleted Items route
3. Locate the previously soft-deleted Sales record
4. Click the recovery/restore button to set the Sales record back to ACTIVE
5. Verify in the database that all linked SalesDetail rows are also marked ACTIVE
6. Log in as a standard User in a fresh session
7. Verify the recovered Sales record and its line items are now visible in the UI again

#### 3. RLS Bypass & Access Control Test
1. Log in as a standard User
2. Attempt to call getSales() without ACTIVE filter via API/console (if applicable)
3. Verify Supabase RLS blocks all INACTIVE rows from being returned
4. Locate an inactive Sales record ID
5. Call getDetailByTrans() for that inactive sale
6. Verify RLS blocks access to the line items
7. Check the sidebar - confirm "Deleted Items" link is not visible
8. Attempt direct navigation to /deleted-items route
9. Verify access is blocked/redirected

#### 4. Audit Trail Visibility Test
1. Log in as a standard User
2. Navigate to Sales list and detail views
3. Verify that stamp/audit columns (created_at, updated_at, created_by, etc.) are hidden
4. Log in as Admin/Superadmin user
5. Navigate to the same Sales list and detail views
6. Verify that stamp/audit columns are visible for auditing purposes

### Test Data:
#### Cascade Test
| Test        | Action                                         | Expected result                                                                         | Actual result | Pass/Fail |
|-------------|------------------------------------------------|-----------------------------------------------------------------------------------------|---------------|-----------|
| Soft-Delete | Set sales record to ``INACTIVE`` as Superadmin | All linked salesDetail rows automatically update to INACTIVE.                           |               |           |
| Recovery    | Set sales record back to ``ACTIVE`` as Admin.  | All linked salesDetail rows automatically update to ACTIVE.                             |               |           |
| UI Sync     | Soft-delete a transaction                      | The transaction and its line items disappear from the standard User's view immediately. |               |           |

### RLS & Visibility Enforcement
| Test       | Action                                                  | Expected result                                                       | Actual result | Pass/Fail |
|------------|---------------------------------------------------------|-----------------------------------------------------------------------|---------------|-----------|
| RLS Bypass | Call getSales() as a User without the ACTIVE filter.    | Supabase RLS policies block all INACTIVE rows from being returned.    |               |           |
| Recovery   | Call getDetailByTrans() for an inactive sale as a User. | RLS blocks access to the line items of inactive transactions.         |               |           |
| Sidebar    | Log in as a standard User                               | The "Deleted Items" link and /deleted-items route are hidden/blocked. |               |           |

### 3. Audit Trail Visibility
| Test         | Action                                         | Expected result                                                 | Actual result | Pass/Fail |
|--------------|------------------------------------------------|-----------------------------------------------------------------|---------------|-----------|
| Stamp Gating | View Sales list/detail as a standard User.     | The stamp (audit) columns are completely hidden from the table. |               |           |
| Recovery     | View Sales list/detail as an Admin/Superadmin. | The stamp columns are visible for auditing purposes.            |               |           |