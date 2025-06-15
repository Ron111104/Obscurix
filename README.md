# Obscurix   
**Secure Communication & Redaction Platform with GenAI + OCR + PII Intelligence**

Obscurix is a next-generation data redaction and content moderation platform designed to help teams and enterprises securely communicate and collaborate without risking sensitive data exposure. The chatbot interface, **Redactify**, enables users to interact naturally while ensuring compliance, privacy, and safety—powered by Generative AI and real-time monitoring.

---

##  Live Demo  
Frontend: [Obscurix](https://obscurix.vercel.app)  
Backend: Hosted on [AWS EC2](http://3.110.28.234)

---

##  Tech Stack

| Layer         | Technology                        |
|--------------|------------------------------------|
| **Frontend** | Next.js, Tailwind CSS              |
| **Backend**  | Django REST Framework              |
| **Auth**     | MongoDB Atlas                      |
| **CI/CD**    | GitHub Actions + AWS EC2 (t2.micro)|
| **Deployment**| Vercel (Frontend), EC2 (Backend)  |
| **NLP & AI** | spaCy, Google Gemini API           |
| **Database** | MongoDB for auth and session logs  |
| **Extensions**| Custom Chrome/Edge extension using OCR |

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

##  Authentication & Roles

- **Admin Login**  
  - Dashboard access  
  - View redaction stats  
  - Monitor flagged content & risk scores

- **User Login**  
  - Access to Redactify chatbot  
  - Upload/input data for redaction  
  - Get pseudocode and rephrased outputs

Authentication is managed via MongoDB and JWT tokens.

---

##  Deployment

### Frontend
- Hosted on **Vercel**
- Auto-deploys on push to `main`

### Backend
- Hosted on **AWS EC2** (Amazon Linux AMI, t2.micro)
- Public IPv4: `3.110.28.234`
- Django served with Gunicorn and Nginx
- **Security Group** configured for restricted access
- **CloudWatch Alarms** setup for CPU > 90%

---

##  CI/CD Workflow

- **GitHub Actions** for CI/CD:
  - On backend push to main: SSH into EC2, pull latest code, restart services.
  - Ensures zero-downtime deployment.

---

##  OCR + Browser Extension

Custom extension (Chrome/Edge):
- Detects screenshots and copied code/text using **Tesseract OCR**
- Uses NLP + RegEx to identify sensitive data
- Prevents leaks by blocking attempted posts to:
  - Twitter
  - Reddit
  - StackOverflow
  - GitHub

---

##  Scoring & Analytics

Every redaction is assigned a **risk score (0–100)**:
- Factors: number and type of leaks, sentiment, profanity
- Admins can use this to:
  - Flag risky users
  - Audit teams and departments
  - Recommend training or trigger alerts

---

##  How to Run Locally

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
python manage.py runserver
```

---

##  Security Highlights

- PII masking via NLP and RegEx
- Role-based access (admin/user)
- Encrypted tokens via JWT
- Leak-prevention browser extension
- Auto-sanitized shared content
- Audit logging and scoring system

---

##  Future Enhancements

- ML-based scoring model for accuracy
- WebSocket-based real-time redaction
- Integration with Slack/Teams
- Mobile App with OCR-based redaction
- Organization-level analytics reports

---