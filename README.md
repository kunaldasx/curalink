<h1 align="center" style>
  <br>
  <a href="https://curalink-research.vercel.app/" target="_blank"><img src="https://raw.githubusercontent.com/kunaldasx/curalink/refs/heads/main/public/logo.png" alt="CuraLink" width="150"></a>
  <br>
  CuraLink
  <br>
</h1>

<h4 align="center">
  A clinical research platform that connects patients and researchers to discover trials, publications, experts, and collaboration opportunities — powered by AI.
</h4>

<p align="center">
  <a href="" target="_blank">
      <img src="https://img.shields.io/badge/Next.js-14+-black?logo=nextdotjs">
  </a>
  <a href="https://choosealicense.com/licenses/mit" target="_blank">
      <img src="https://img.shields.io/badge/License-MIT-blue.svg">
  </a>
  <a href="" target="_blank">
      <img src="https://img.shields.io/badge/AI-Gemini%20Pro-brightgreen?logo=google">
  </a>
  <a href="" target="_blank">
      <img src="https://img.shields.io/badge/DB-MongoDB-green?logo=mongodb">
  </a>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#how-to-contribute">How To Contribute</a> •
  <a href="#technologies">Technologies</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/kunaldasx/curalink/refs/heads/main/public/demo-banner.png" alt="preview" width="100%" />
</p>

🌐 **Live Demo**🔗 [curalink-research.vercel.app](https://curalink-research.vercel.app)

## Key Features

**For Patients**

- Natural Language Search — Describe your condition in plain language
- Clinical Trial Recommendations — Personalized matches from ClinicalTrials.gov
- Expert Discovery — Search and connect with health researchers
- Publication Browser — Explore relevant medical research
- Community Forums — Post questions and get answers from researchers
- Favorites — Save trials, publications, and experts
- Meeting Requests — Schedule consultations with researchers

**For Researchers**

- ORCID Integration — Link and verify your research identity
- Trial Management — Create and manage your clinical trials
- Researcher Collaboration — Connect with peers across institutions
- Forum Responses — Engage with patient questions
- Publication Discovery — Browse and save relevant papers
- Meeting Management — Accept or decline patient consultation requests

**Platform**

- AI-Powered Summaries — Gemini Pro translates research into patient-friendly language
- Smart Keyword Extraction — Auto-extract disease terms from natural language input
- Role-Based Access — Separate, tailored experiences for patients and researchers

## Project Structure

```
curalink/
├── app/                        # Next.js App Router pages
│   ├── (auth)/                 # Authentication routes
│   ├── (patient)/              # Patient-facing pages
│   ├── (researcher)/           # Researcher dashboard pages
│   └── api/                    # API route handlers
│
├── components/                 # Reusable UI components
│
├── lib/                        # Database connection and utilities
│
├── models/                     # Mongoose schemas and models
│
├── hooks/                      # Custom React hooks
│
├── context/                    # React context providers
│
├── utils/                      # Helper functions and external API integrations
│                               # (ClinicalTrials.gov, PubMed, ORCID, Google Scholar)
│
├── .env.local.example          # Environment variables template
├── package.json                # Dependencies and scripts
└── README.md                   # Project documentation
```

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download), and [MongoDB](https://www.mongodb.com) (or Docker) installed on your computer.

##### Clone this repository

```bash
$ git clone https://github.com/your-username/curalink
$ cd curalink
```

##### Install dependencies

```bash
$ npm install
```

##### Configure environment variables

```bash
$ cp .env.local.example .env.local  # Fill in your values
```

Required variables:

- `MONGODB_URI` — MongoDB connection string
- `NEXTAUTH_SECRET` — NextAuth.js secret
- `GEMINI_API_KEY` — Google Gemini API key
- `PUBMED_API_KEY` _(optional)_ — PubMed credentials
- `ORCID_CLIENT_ID` / `ORCID_CLIENT_SECRET` _(optional)_ — ORCID OAuth

##### Start MongoDB (if running locally)

```bash
# Using Docker
$ docker run -d -p 27017:27017 --name mongodb mongo:latest
```

##### Run the development server

```bash
$ npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Contribute

1. Clone the repo and create a new branch: `$ git checkout -b name_for_new_branch`
2. Make your changes and test thoroughly
3. Submit a Pull Request with a comprehensive description of your changes

## Technologies

This software uses the following technologies:

- **Frontend**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js Server Actions
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: NextAuth.js with JWT
- **AI**: Google Gemini Pro — keyword extraction and patient-friendly summarization
- **External APIs**: ClinicalTrials.gov, PubMed, ORCID, Google Scholar

## License

MIT

---

> 🖥️ [GitHub](https://github.com/kunaldasx) &nbsp;&middot;&nbsp;
> 💼 [LinkedIn](https://www.linkedin.com/in/kunaldasx) &nbsp;&middot;&nbsp;
