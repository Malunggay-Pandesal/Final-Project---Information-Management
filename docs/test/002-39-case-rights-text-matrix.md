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


### Test Steps
1. Open the SMS:   
https://improject-hope-sms.netlify.app/
2. Login using Email/Google Account
3. Check access to system modules

### Expected Result:
- User may be allowed or restrict access to different SMS modules depending on role's access limitations


### Test Data:
> **Legend**:  
> ✅: Pass  
> ❌: Fail  
> ? : confirming...

| Rights                         | Superadmin  | Admin              | User               |
|--------------------------------|-------------|--------------------|--------------------|
| View Sales Transactions        | ✅ (Allowed) | ✅ (Allowed)        | ✅ (Allowed)        |
| Add new Sales Transaction      | ✅ (Allowed) | ?                  | ✅ (Hidden/Blocked) |
| Edit Sales Transaction         | ?           | ?                  | ✅ (Hidden/Blocked) |
| Soft-Delete Sales Transactions | ?           | ✅ (Blocked)        | ✅ (Hidden/Blocked) |
| Add Sales Details              | ?           | ?                  | ✅ (Hidden/Blocked) |
| Edit Sales Details             | ?           | ?                  | ✅ (Hidden/Blocked) |
| Soft-Delete Sales Details      | ?           | ✅ (Blocked)        | ✅ (Hidden/Blocked) |
| Customer Lookup                | ✅ (Allowed) | ✅ (Allowed)        | ✅ (Allowed)        |
| Employee Lookup                | ✅ (Allowed) | ✅ (Allowed)        | ✅ (Allowed)        |
| Products lookup                | ✅ (Allowed) | ✅ (Allowed)        | ✅ (Allowed)        |
| Price lookup                   | ✅ (Allowed) | ✅ (Allowed)        | ✅ (Allowed)        |
| Manage User accounts           | ✅ (Allowed) | ✅ (Hidden/Blocked) | ✅ (Hidden/Blocked) |