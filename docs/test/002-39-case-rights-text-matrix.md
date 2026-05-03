---
sprint: 2
testCase: 002
title: "Full 39-case rights test matrix"

---
# Test Case 02: Full 39-case rights test matrix


### Expected Result:
- User may be allowed or restrict access to different SMS modules depending on role

### Test Steps
1. Open the SMS:   
https://improject-hope-sms.netlify.app/
2. Login using Email/Google Account
3. Check access to system modules


### Test Data:
> **Legend**:  
> ✅: Pass  
> ❌: Fail  
> ? : confirming...

| Rights                    | Superadmin  | Admin | User               |
|---------------------------|-------------|-------|--------------------|
| View Sales Transactions   | ✅ (Allowed) |       | ✅ (Allowed)        |
| Add new Sales Transaction | ✅ (Allowed) |       | ?                  |
| Edit Sales Transaction    | ?           |       | ?                  |
| Delete Sales Transactions | ?           |       | ✅ (Hidden/Blocked) |
| Add Sales Details         | ?           |       | ?                  |
| Edit Sales Details        | ?           |       | ?                  |
| Delete Sales Details      | ?           |       | ✅ (Hidden/Blocked) |
| Customer Lookup           | ✅ (Allowed) |       | ✅ (Allowed)        |
| Employee Lookup           | ✅ (Allowed) |       | ✅ (Allowed)        |
| Products lookup           | ✅ (Allowed) |       | ✅ (Allowed)        |
| Price lookup              | ✅ (Allowed) |       | ✅ (Allowed)        |
| Manage User accounts      | ✅ (Allowed) |       | ✅ (Hidden/Blocked) |