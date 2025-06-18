---
# Obscurix - Comprehensive Technical Documentation

**Secure Communication & Redaction Platform with Generative AI, OCR, and PII Intelligence**

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Frontend Structure](#frontend-structure)
4. [API Endpoints](#api-endpoints)
5. [Component Architecture](#component-architecture)
6. [Authentication & User Management](#authentication--user-management)
7. [Core Features](#core-features)
8. [Data Flow & Integration](#data-flow--integration)
9. [Deployment & CI/CD](#deployment--cicd)
10. [Security Implementation](#security-implementation)
11. [Development Guidelines](#development-guidelines)

---

## Project Overview

**Obscurix** is a secure content redaction and moderation platform designed for teams and enterprises to communicate and collaborate safely. By leveraging Generative AI, Optical Character Recognition (OCR), and advanced PII detection techniques, Obscurix ensures sensitive data is automatically detected, redacted, or rewritten before exposure.

### Key Objectives

* **Data Privacy**: Automated detection and redaction of sensitive content across text and images.
* **AI-Powered Rewriting**: Transformation of sensitive content while preserving meaning and context.
* **Compliance Monitoring**: Real-time risk analysis via a centralized dashboard.
* **Secure Collaboration**: Converts source code into readable pseudocode, protecting intellectual property.

---

## Architecture & Tech Stack

### Frontend

| Technology    | Purpose           | Version |
| ------------- | ----------------- | ------- |
| Next.js       | React Framework   | Latest  |
| React         | UI Library        | 18+     |
| Tailwind CSS  | Styling Framework | 3+      |
| Framer Motion | Animations        | Latest  |
| Lucide React  | Icon Set          | Latest  |
| Axios         | HTTP Client       | Latest  |

### Backend

| Technology            | Purpose                       |
| --------------------- | ----------------------------- |
| Django REST Framework | API Layer                     |
| Python 3.11+          | Backend Logic                 |
| spaCy                 | Named Entity Recognition      |
| Google Gemini API     | Generative AI Engine          |
| EasyOCR               | OCR for Image Text Extraction |

### Database & Storage

| Technology    | Purpose                        |
| ------------- | ------------------------------ |
| MongoDB Atlas | Authentication, Session & Logs |
| SQLite        | Temporary Session Storage      |
| Local Storage | Client-side State Management   |

---

## Frontend Structure

### Directory Overview

```
frontend/
├── components/         # Reusable React components
├── pages/              # Route-based structure
│   ├── index.js
│   ├── login.js
│   ├── signup.js
│   ├── redactify.js
│   ├── profile.js
│   ├── dashboard.js
│   └── ocr.js
├── public/             # Static assets
├── styles/             # Tailwind and global styles
└── utils/              # API clients and helpers
```

### Key Pages

* **Home**: Animated landing page with responsive layout.
* **Login / Signup**: Authentication with validation and animated visuals.
* **Redactify**: Main chat interface for redaction and rewriting.
* **Profile**: Editable user profile with real-time sync.
* **Dashboard**: Admin-only analytics view.
* **OCR**: Upload interface for image-based redaction.

---

## API Endpoints

### Authentication

| Endpoint      | Method | Description                     |
| ------------- | ------ | ------------------------------- |
| `/api/signup` | POST   | User registration with roles    |
| `/api/login`  | POST   | Authenticates user, returns JWT |

### Core Functionality

| Endpoint          | Method | Description                         |
| ----------------- | ------ | ----------------------------------- |
| `/api/redact`     | POST   | Handles PII detection and rewriting |
| `/api/metrics`    | GET    | Dashboard metrics for admin view    |
| `/api/updateUser` | PUT    | Update user credentials and profile |

### OCR & Extensions

| Endpoint   | Method | Description                           |
| ---------- | ------ | ------------------------------------- |
| `/api/ocr` | POST   | OCR-based text extraction from images |

---

## Component Architecture

### Primary Components

1. **Navbar**

   * Role-aware navigation with profile dropdown and route guards.

2. **Hero**

   * Animated intro section using Framer Motion.

3. **Redactify**

   * Real-time chat with strict vs. creative redaction modes.

4. **Dashboard**

   * Privacy metrics, user analytics, and visual trend indicators.

5. **Animated Backgrounds**

   * Starfield effects for aesthetic enhancement.

6. **News Ticker**

   * Scrollable text feed showing platform updates.

7. **Footer**

   * Contact form and site navigation links.

---

## Authentication & User Management

### Flow

1. **Signup**

   * Collect user credentials and role, store in MongoDB.

2. **Login**

   * Validate against hashed credentials and return JWT.

3. **Session Handling**

   * Store JWT securely in localStorage for API auth.

4. **Access Control**

   * Route guards enforce role-based access on frontend/backend.

### User Roles

| Role  | Permissions                           |
| ----- | ------------------------------------- |
| User  | Redactify, OCR, Profile               |
| Admin | Full access including Dashboard views |

---

## Core Features

1. **PII Redaction Engine**

   * Uses spaCy, regex, and heuristic rules for redaction of emails, phone numbers, API keys, bank details, SSNs, and passwords.

2. **Generative AI Rewriting**

   * Strict Mode: Masks sensitive data.
   * Creative Mode: Rewrites content using Gemini API.

3. **OCR Processing**

   * Supports image input and screenshot-based text extraction.

4. **Code Obfuscation & Pseudocode Conversion**

   * Converts input code into generalized logic with comments.

5. **Browser Extension Protection**

   * Prevents copy, screenshot, and clipboard leakage.

6. **Sentiment Filtering**

   * Detects and rewrites toxic or harmful content.

7. **Sensitivity Scoring**

   * Calculates a risk score based on detected PII, sentiment, and profanity.

8. **Admin Analytics Dashboard**

   * Real-time metrics including daily redactions, user behavior, and historical trends.

---

## Data Flow & Integration

### Core Flows

* **Frontend → Backend**
  All secure requests carry JWTs in headers for validation.

* **Redaction Request**
  Input sent to `/api/redact`, processed via spaCy, Gemini, and EasyOCR.

* **Dashboard Metrics**
  Admin panels fetch data from `/api/metrics` and visualize user risk.

* **Extension Hooks**
  OCR triggers NLP pipeline before permitting screen-based actions.

### State Management

* React Hooks + Context API for runtime state.
* localStorage for JWT tokens and session persistence.

---

## Deployment & CI/CD

### Frontend

* **Platform**: Vercel
* **Branch**: `main`
* **Integration**: GitHub Auto-deploy
* **Performance**: Global CDN + asset optimization

### Backend

* **Platform**: AWS EC2 (Amazon Linux 2023, t2.micro)
* **Stack**: Gunicorn + Nginx
* **Database**: MongoDB Atlas
* **Monitoring**: CloudWatch alerts (CPU > 90%)
* **Security**: Open ports only for SSH (22), HTTP (80), HTTPS (443), and API (8000)

### CI/CD via GitHub Actions

```yaml
# .github/workflows/deploy-backend.yml
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: SSH & Deploy
        uses: appleboy/ssh-action@v0.1.6
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ec2-user
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ec2-user/obscurix/backend
            git pull origin main
            pip install -r requirements.txt
            sudo systemctl restart gunicorn
            sudo systemctl reload nginx
```

---

## Security Implementation

1. **Authentication Security**

   * Passwords are hashed using bcrypt.
   * JWT tokens expire and are validated on each request.
   * Frontend and backend routes are protected by role checks.

2. **Data Protection**

   * HTTPS is enforced for all communication.
   * PII is never stored in raw form. Only metadata is logged.

3. **Privacy Features**

   * Dashboard exposes redaction logs and scores.
   * Minimal data collection with user control over data retention.

4. **API Security**

   * Input sanitization, rate limiting, and validation implemented on all endpoints.

---

## Development Guidelines

### Code Organization

* Follow modular design with separation of components, pages, and services.

### State Management

* Prefer hooks and React Context over prop drilling.
* Use localStorage only for non-sensitive session data.

### Error Handling

* Use try-catch with user feedback alerts.
* Centralized error logger for debugging.

### Styling & UX

* Tailwind CSS for utility-first styling.
* Maintain design consistency with shared styles and theme tokens.

### Accessibility

* Use semantic HTML and ARIA attributes where appropriate.

### Testing Strategy

* **Unit Testing**: Component-level via Jest.
* **Integration Testing**: API routes tested using Supertest.
* **End-to-End Testing**: User flow validation via Cypress.
* **Performance Testing**: Simulated load for critical endpoints.

---
