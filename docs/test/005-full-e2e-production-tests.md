# Test Case 05: Full production test report with screenshots
**Sprint**: 3
**Description**: Comprehensive end-to-end production testing covering all major user workflows and system integrations with visual evidence.

## Test Objectives
- Verify all features work correctly in production environment
- Validate user workflows from login through data management
- Confirm system stability under normal operations
- Document visual evidence of successful test execution

## Prerequisites
- Production environment deployed and accessible
- Test data prepared and loaded
- Administrator and user accounts available
- Browser developer tools enabled for network monitoring

## Final Production Rights Check

### 1.1 User Provisioning & Authentication
- [x] **Multi-Type Login:** Verified that accounts can successfully log in via both Email/Password and Google OAuth.

<details>
  <summary>Screenshots</summary>
  
##### Email Login
![](/docs/test/0005-screenshots/activationtest.png)
##### Google OAuth Login
![](/docs/test/0005-screenshots/googlelogin.png)
</details>


- [x] **Admin Activation Workflow:** Confirmed that Admin accounts can successfully activate and deactivate standard user rows.  

<details>
  <summary>Screenshots</summary>
  
##### Activate account
![](/docs/test/0005-screenshots/activationtest.png)


</details>


- [x] **RLS Scope Enforcement:** Verified through network inspection that standard Users are restricted from seeing INACTIVE rows at the database level.



### 1.2 Core Transactions (Sales)
- [x] **Sales CRUD Cycle:** Confirmed that create, read, update, and soft-delete operations for Sales work end-to-end in the live environment.

<details>
  <summary>Screenshots</summary>
  
##### CREATE
![](/docs/test/0005-screenshots/crudcycle-create.png)
##### READ
![](/docs/test/0005-screenshots/crudcycle-read.png)
##### UPDATE
![](/docs/test/0005-screenshots/crudcycle-update.png)
##### DELETE
![](/docs/test/0005-screenshots/crudcycle-delete.png)
</details>



- [x] **Soft-Delete Cascade:** Verified that deactivating a transaction automatically sets all related salesDetail rows to INACTIVE.
<details>
  <summary>Screenshots</summary>
  
![](/docs/test/0005-screenshots/softdeletecascade.png)

</details>

- [x] **Recovery Cascade:** Verified that recovering a transaction restored all related salesDetail rows to ACTIVE.
<details>
  <summary>Screenshots</summary>
  
![](/docs/test/0005-screenshots/recoverycascade.png)

</details>


### 1.3 Transaction Details (SalesDetail)
- [x] **SD CRUD Cycle:** Confirmed line items can be added, edited, and soft-deleted within the production Sales Detail view.
<details>
  <summary>Screenshots</summary>
  
##### CREATE
![](/docs/test/0005-screenshots/crudcyclesd-create.png)
##### UPDATE
![](/docs/test/0005-screenshots/crudcyclesd-update.png)
##### DELETE
![](/docs/test/0005-screenshots/crudcyclesd-delete.png)
</details>


- [x] **Price Auto-fill:** Verified that selecting a product automatically populates the unit price with the latest priceHist entry via the price service.
<details>
  <summary>Screenshots</summary>

![](/docs/test/0005-screenshots/priceautofill.png)
</details>


### 1.4 Read-Only Operations
- [x] **Lookup Access:** Confirmed all 4 lookup pages (Customer, Employee, Product, Price History) are accessible to all user types.
<details>
  <summary>Screenshots</summary>
  
##### EMPLOYEE
![](/docs/test/0005-screenshots/lookup-employees.png)
##### CUSTOMER
![](/docs/test/0005-screenshots/lookup-customers.png)
##### PRODUCT
![](/docs/test/0005-screenshots/lookup-products.png)
##### PRICE HISTORY
![](/docs/test/0005-screenshots/lookup-pricehist.png)
</details>

- [x] **Mutation Guard:** Verified that zero "Add," "Edit," or "Delete" buttons exist on any lookup page for any user type in production.
<details>
  <summary>Screenshots</summary>
  
![](/docs/test/0005-screenshots/user-nomutation.png)
</details>

- [x] **Analytical Reports:** Confirmed all 4 reports (Sales by Employee, Customer, Products, and Trend) generate correct data and visualizations using production SQL views.
<details>
  <summary>Screenshots</summary>
  
##### By Employee
![](/docs/test/0005-screenshots/analytics-employee.png)
##### By Customers
![](/docs/test/0005-screenshots/analytics-customer.png)
##### Top Products
![](/docs/test/0005-screenshots/analytics-topproducts.png)
##### Monthly Trends
![](/docs/test/0005-screenshots/analytics-monthlytrend.png)
</details>

### 1.5 Security & Access Control
- [x] **SUPERADMIN UI Protection:** Verified that "Activate/Deactivate" buttons for Superadmin accounts are disabled and greyed out (with tooltip) for other Admins.
<details>
  <summary>Screenshots</summary>

![](/docs/test/0005-screenshots/adminprotect.png)

</details>

- [x] **Database Guard:** Confirmed that direct database API attempts to update a Superadmin record by an Admin account are rejected.
- [x] **Hard Delete Audit:** Final codebase scan confirmed zero DELETE statements exist; all data removal is strictly via record_status.
