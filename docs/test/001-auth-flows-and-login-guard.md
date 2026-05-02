---
sprint: 1
testCase: 001
title: "Email + Google OAuth + login guard test cases"

---
# Test Case 01: Email + Google OAuth + login guard test cases

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
| Scenario                 | Steps                                      | Result                                                                | Passed? |
|--------------------------|--------------------------------------------|-----------------------------------------------------------------------|---------|
| Valid login              | Enter registered email + correct password. | Logged in, then directed to dashboard                                 | ✅       |
| Invalid Password         | Enter registered email + wrong password.   | Shows error "Invalid login credentials"                               | ✅       |
| Unverified Account       | Enter registered email + correct password  | Shows notice "Your account is pending activation by a Sales Manager." | ✅       |
| Non-existent account     | Enter unregistered email + password        | Shows error "Invalid login credentials"                               | ✅       |
| Deleted/Inactive account | Enter deleted email + correct password     |                                     ?                                  |      ?   |

#### Google Account
| Scenario                 | Steps                                                        | Result                                                                | Pass? |
|--------------------------|--------------------------------------------------------------|-----------------------------------------------------------------------|-------|
| Valid Google login       | Enter registered email + correct password.                   | Logged in, then directed to dashboard                                 | ✅     |
| Unverified Account       | Enter registered email + correct password                    | Shows notice "Your account is pending activation by a Sales Manager." | ✅     |
| Deleted/Inactive account | Enter registered email + correct password of deleted account |   ?                                                                    |     ?  |