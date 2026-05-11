# HOPE-SMS User Manual
**Project:** Sales Management System (SMS)  
**Version:** 1.0 (Production Final)  
**Status:** [✓] Production Verified  

---

## Table of Contents
1. [**Introduction**](#1-introduction)
2. [**Getting Started**](#2-getting-started)
    * 2.1 [Authentication](#21-authentication)
    * 2.2 [Navigation Overview](#22-navigation-overview)
3. [**Sales Management**](#3-sales-management)
    * 3.1 [Managing Transactions](#31-managing-transactions)
    * 3.2 [Sales Details & Line Items](#32-sales-details--line-items)
    * 3.3 [Automated Pricing Logic](#33-automated-pricing-logic)
4. [**Reference Modules (Lookups)**](#4-reference-modules-lookups)
5. [**Analytical Reports**](#5-analytical-reports)
6. [**System Administration**](#6-system-administration)
    * 6.1 [User Management](#61-user-management)
    * 6.2 [Superadmin Protection](#62-superadmin-protection)
    * 6.3 [Data Recovery (Deleted Items)](#63-data-recovery-deleted-items)
7. [**Troubleshooting**](#7-troubleshooting)

---

## 1. Introduction
The Sales Management System (SMS) is a full-stack sales management app for Hope Inc. designed to streamline transaction tracking, provide real-time inventory pricing, and generate analytical insights for business growth. 

Core features include full CRUD for sales and salesDetail with soft-delete recovery; read-only lookup views for customers, employees, products, and price history; role-based access control with 13 granular rights; four analytical reports (by employee, by customer, top products, and monthly trends); admin user management with deleted-items recovery; and Email/password plus Google OAuth authentication via Supabase.


## 2. Getting Started
### 2.1 Authentication
- **Email Login:** Standard credentials provided by your Administrator.
- **Google OAuth:** Use your Google account for secure, one-click access.
- **Login Guard:** Users with an "Inactive" status will be denied access to the dashboard.

### 2.2 Navigation Overview
The Sidebar provides access to:
* **Dashboard/Sales:** Daily transaction management.
* **Lookups:** Master data for Customers, Employees, and Products.
* **Reports:** Data visualizations and performance metrics.
* **Admin Module:** User rights and account status (Restricted).

## 3. Sales Management
### 3.1 Managing Transactions
- **Add Transaction:** Select a Customer and Employee from the validated dropdowns.

> [!NOTE]  
> This feature can only be done by accounts that has ``SUPERADMIN`` or ``ADMIN`` role

- **Delete:** Use the "Delete" icon to deactivate a sale. This triggers a **Cascade**, hiding all associated line items.
> [!NOTE]  
> This module can only be accessed by accounts that has ``SUPERADMIN`` role

### 3.2 Sales Details & Line Items
- Navigate into a specific sale to manage line items.
- Line items support adding, editing, and soft-deletion.

### 3.3 Automated Pricing Logic
The system automatically fetches the unit price from the **Price History** table based on the most recent effective date for the selected product.

## 4. Reference Modules (Lookups)
Lookup pages are **Strictly Read-Only** to maintain data integrity:
- **Customers:** Database of clients.
- **Employees:** Active personnel records.
- **Products:** Item catalog.
- **Price History:** Audit log of all price changes.

## 5. Analytical Reports
- **Sales by Employee:** Performance metrics for sales staff.
- **Sales by Customer:** Revenue breakdown per client.
- **Top Products:** High-volume inventory analysis.
- **Monthly Trend:** Time-series visualization of revenue and volume.

## 6. System Administration
### 6.1 User Management
> [!NOTE]  
> This module can only be accessed by accounts that has ``SUPERADMIN`` and ``ADMIN`` role

Administrators can toggle user status between **Active** and **Inactive**. Inactivating a user revokes their system access immediately.

### 6.2 Superadmin Protection
The system includes a hard guard: **Superadmin accounts cannot be deactivated by other Administrators.** This prevents accidental lockout of the primary system owners.

### 6.3 Data Recovery (Deleted Items)
> [!NOTE]  
> This module can only be accessed by accounts that has ``SUPERADMIN`` role

The **Deleted Items** module allows Admins to view soft-deleted records and restore them to the main Sales list.

## 7. Troubleshooting
- **Permission Denied (403):** Your account lacks the specific Right (e.g., `SALES_DEL`) required for this action.
- **Incorrect Price:** Check the Price History module to ensure an effective price is set for the current date.