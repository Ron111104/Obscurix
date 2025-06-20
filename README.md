# Obscurix - Comprehensive Technical Documentation

**Secure Communication & Redaction Platform with Generative AI, OCR, and PII Intelligence**

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Architecture & Tech Stack](#architecture--tech-stack)
4. [Frontend Structure](#frontend-structure)
5. [API Endpoints](#api-endpoints)
6. [Component Architecture](#component-architecture)
7. [Authentication & User Management](#authentication--user-management)
8. [Data Flow & Integration](#data-flow--integration)
9. [Deployment & CI/CD](#deployment--cicd)
10. [Security Implementation](#security-implementation)
11. [Development Guidelines](#development-guidelines)
12. [Run Locally](#how-to-run-locally)

---

## Project Overview

**Obscurix** is a next-generation data redaction and content moderation platform designed to help teams and enterprises securely communicate and collaborate without risking sensitive data exposure. The chatbot interface, **Redactify**, enables users to interact naturally while ensuring compliance, privacy, and safety—powered by Generative AI and real-time monitoring. Optical Character Recognition (OCR), and advanced PII detection techniques, Obscurix ensures sensitive data is automatically detected, redacted, or rewritten before exposure.

### Key Objectives

* **Data Privacy**: Automated detection and redaction of sensitive content across text and images.
* **AI-Powered Rewriting**: Transformation of sensitive content while preserving meaning and context.
* **Compliance Monitoring**: Real-time risk analysis via a centralized dashboard.
* **Secure Collaboration**: Converts source code into readable pseudocode, protecting intellectual property.

---
##  Features

| **Feature**                                | **Description** |
|--------------------------------------------|-----------------|
| **PII Redaction Engine**                   | Real-time masking of sensitive data such as emails, phone numbers, passwords, API keys, card numbers, and bank account details using regex and NLP. |
| **Generative AI Rewriting**                | Uses Google Gemini to rewrite redacted content while preserving the original context and softening tone, especially in sensitive or negative sentiment messages. |
| **Admin Monitoring Dashboard**             | Displays analytics for flagged content, user behavior trends, and PII redaction frequency in real time. |
| **Multilingual Redaction Support**         | Redaction and rewriting supported for English, Hindi, and Spanish using spaCy’s NER and GenAI’s language-agnostic capabilities. |
| **Dual-Mode Redaction (Strict & Creative)**| Strict mode performs full redaction; Creative mode redacts and then rephrases the content while maintaining meaning. |
| **Leak Prevention Browser Extension**      | Chrome/Edge extension that uses OCR and NLP to detect and block screenshots or copied code/text containing sensitive info before it is posted to social media. |
| **Code Sanitization & Pseudocode Conversion** | Automatically converts code to anonymized pseudocode to ensure safe collaboration without exposing internal logic or credentials. |
| **Sentiment-Aware Moderation**             | Detects and softens toxic or harmful language, ensuring that content is emotionally neutral or constructive. |
| **Cognitive Code Obfuscation via GenAI**   | Converts flagged code into obfuscated pseudocode while explaining the logic, allowing safe public sharing (e.g., StackOverflow). |
| **Sensitivity Scoring System**             | Assigns a numeric risk score (0–100) to messages based on redacted content and sentiment, enabling proactive flagging. |
| **Audit Trail & Reporting Dashboard**      | Tracks redaction activity, sentiment trends, and high-risk users or teams; helps enterprises monitor compliance. |

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
| CI/CD                 | GitHub Actions + AWS EC2      |

### Database & Storage

| Technology    | Purpose                                |
| ------------- | -------------------------------------- |
| MongoDB Atlas | Authentication, Session & Logs         |
| Local Storage | Client-side State Management           |
| Extensions    | Custom Chrome/Edge extension using OCR |

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
##  How to Run Locally

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
venv/Scripts/activate 
pip install -r requirements.txt
python manage.py runserver
```