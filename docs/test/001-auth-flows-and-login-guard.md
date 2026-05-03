
# Test Case 01: Email + Google OAuth + login guard test cases 
**Sprint**: 1  
**Description**: This test case verifies the authentication flows for Email/Password and Google OAuth, and validates the login guard behavior for protected routes. It ensures that approved users can access the dashboard, while inactive, unverified, or unauthenticated users are prevented and receive appropriate error or notice messages.

## Precondition: 
- The SMS web application is deployed and accessible at the provided URL.
- Test accounts for approved, inactive/unverified, and non-existent users are available.
- A Google account linked to an approved test user is available for OAuth testing.
- The tester has a stable internet connection and a supported browser.
- The tester is logged out before running the login guard and authentication flow tests.

### Test Steps
1. Open the SMS:   
https://improject-hope-sms.netlify.app/
2. Check access on restricted pages
3. Login using Email/Google Account

### Expected Result:
- User can access the SMS if the account is approved 
- User can't access the SMS when the account is tagged `INACTIVE`

### Test Data:
> Legend:
> ✅: Pass
> ❌: Fail
> ?: Confirming

#### Login Guard
| Scenario          | Steps                                  | Result                            | Passed? |
|-------------------|----------------------------------------|-----------------------------------|--------|
| Allowed access    | Access dashboard while authenticated   | Allowed access to dashboard pages | ✅      |
| Restricted access | Access dashboard while unauthenticated | Redirected to `/login`              | ✅      |

#### Email + Password 
| Scenario                    | Steps                                      | Result                                                                | Passed? |
|-----------------------------|--------------------------------------------|-----------------------------------------------------------------------|---------|
| Valid login                 | Enter registered email + correct password. | Logged in, then directed to dashboard                                 | ✅       |
| Invalid Password            | Enter registered email + wrong password.   | Shows error "Invalid login credentials"                               | ✅       |
| Unverified/Inactive Account | Enter registered email + correct password  | Shows notice "Your account is pending activation by a Sales Manager." | ✅       |
| Non-existent account        | Enter unregistered email + password        | Shows error "Invalid login credentials"                               | ✅       |

#### Google Account
| Scenario                    | Steps                                      | Result                                                                | Pass? |
|-----------------------------|--------------------------------------------|-----------------------------------------------------------------------|-------|
| Valid Google login          | Enter registered email + correct password. | Logged in, then directed to dashboard                                 | ✅     |
| Unverified/Inactive Account | Enter registered email + correct password  | Shows notice "Your account is pending activation by a Sales Manager." | ✅     |