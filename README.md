# Resumenyzer 🚀
### Optimize your resume for your dream internship with AI.

## 💡 The Motivation
Applying for your first student internship is a daunting process. As a student myself, I realized that while I have the skills, I didn't always know how to "speak the language" of the companies I was applying to. Generic resumes often get lost in the sea of applications because they aren't tailored to specific job descriptions or optimized for **Applicant Tracking Systems (ATS)**.

I built **Resumenyzer** to solve this exact problem. It's a tool designed to help students and first-time job seekers bridge the gap between their current experience and what top-tier companies are looking for.

## 🛠️ The Problem
- **The ATS Gap:** Most companies use automated filters. If your resume doesn't hit the right keywords, a human might never see it.
- **Lack of Feedback:** Rejections often come without explanation. You don't know *why* your resume wasn't a match.
- **Generic Applications:** Sending the same PDF to 50 companies rarely works. Tailoring takes time—time that students often don't have.

## ✨ The Solution
Resumenyzer uses advanced AI to act as your personal career coach. By comparing your resume directly against a specific job description, it provides:
- **Semantic Scoring:** A visual, color-coded score (Green/Amber/Red) across categories like Skills, Structure, and Tone.
- **Actionable Tips:** Specific "Good" and "Needs Improvement" points that tell you exactly what to change.
- **Instant Preview:** A fast, sleek interface to manage all your tailored resumes in one place.

## 🚀 Technology Stack
This project is built using modern, cloud-native technologies for a seamless, serverless experience:

- **Frontend:** [React Router v7](https://reactrouter.com/) & [Vite](https://vitejs.dev/) for a lightning-fast Single Page Application (SPA).
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with a focus on **HCI (Human-Computer Interaction)** principles for a minimalist, professional aesthetic.
- **Cloud Infrastructure:** Powered entirely by [Puter.js](https://puter.com/).
  - **Puter AI:** For intelligent resume analysis and feedback generation.
  - **Puter KV:** A high-speed key-value store for saving your analysis history.
  - **Puter FS:** Secure cloud file storage for your resume PDFs.
  - **Puter Hosting:** For zero-config, free static deployment.
- **PDF Engine:** [PDF.js](https://mozilla.github.io/pdf.js/) for generating instant high-quality previews of your documents.

## 📖 How to Use
1. **Upload:** Drop your resume (PDF) into the smart uploader.
2. **Details:** Enter the Company Name and Job Title you're aiming for.
3. **Context:** Paste the Job Description from the company's hiring page.
4. **Analyze:** Hit "Analyze Resume" and let the AI go to work.
5. **Optimize:** Use the specific feedback to refine your bullet points, fix your tone, and highlight the skills that matter most to that specific recruiter.

## 🛠️ Local Development
To run this project locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🌐 Deployment
This project is configured as a static SPA for easy deployment on **Puter.com**:
1. Run `npm run build`.
2. Upload the `build/client` directory to the Puter Hosting app.
3. Your AI Resume Analyzer is live!

---
*Created with intent by student, for students.*
