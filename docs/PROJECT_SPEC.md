# Product
Crowdsourced​ Civic Issue Reporting and Resolution System.

# Project Specification (PROJECT_SPEC.md)

## Problem



## Target users

User —

   Organizations
      - Admin
      - Department
        - Staff
      - Citizens


## Main capabilities
1. Report issues.
2. Issue lifecycle management.
3. Issue priority.
4. Department Dashboard.
5. Automatic Issue Routing.
6. Issue Tracking.


# Users and Roles3


## User Flow

## Flow 1 - Organization Registration
1. Create account
2. Add departments
3. Add staff
4. Select operational area

## Flow 2 — Civic Issue Reporting
- Report a new civic issue
- Select an issue category 
- Add title and description 
- Upload images, photos, videos or audio 
- Automated location 
- Route to organization dashboard
- Add to issue tracking dashboard

## Flow 3 - Organization Issue Management
- Viewed submitted issue 
- 

## Data

Elements —
- Organization
    - Name
    - Area
    - Departments
- Department
    - head
    - Role
    - category
    - staff
    - oraganization
- Staff
    - name
    - dapartment
- Citizen
    - userid
    - email
    - mobile no.
    - address
    - password
- Issue
    - Name
    - Description
    - location


## Tech Stack
  ## Backend  
  - Python 
  - FASTAPI
  - Rest APIS
  
  ## Frontend (WEB) 
  - React
  - JavaScript 
  
  ## Frontend (Android) 
  - React Native

  ## Database 
  - Postgres


## APIs
POST    /api/auth/register
POST    /api/auth/login

GET     /api/issues
    data = {
        name,
        description,
        category,
        photo_evidence,
        location,
        status,
        support_count,
        assigned_to
    }

POST    /api/issues
    data = {
        reported_by,
        name,
        description,
        category,
        photo_evidence,
        location
    }

GET     /api/updates