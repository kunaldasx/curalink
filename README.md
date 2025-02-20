# CuraLink

A full-stack MVP application that connects patients and researchers to discover clinical trials, publications, experts, and collaboration opportunities.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions, MongoDB with Mongoose
- **Authentication**: NextAuth.js with JWT
- **Google Gemini**: Gemini Pro for disease keyword extraction and patient-friendly summarization
- **External APIs**: ClinicalTrials.gov, PubMed, ORCID, Google Scholar

## Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
Create a `.env.local` file based on `.env.local.example` and fill in your values:
- MongoDB connection string
- NextAuth secret
- Google Gemini API key
- Optional: PubMed, ORCID credentials

3. **Run MongoDB locally** (or use MongoDB Atlas):
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

4. **Run the development server**:
```bash
npm run dev
```

5. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Features

### For Patients
- Natural language condition input
- Personalized clinical trial recommendations
- Search and discover health experts
- Browse publications relevant to their conditions
- Community forums (post questions)
- Save favorites (trials, publications, experts)
- Request meetings with researchers

### For Researchers
- ORCID integration
- Manage clinical trials
- Collaborate with other researchers
- Respond to patient questions
- Browse and save publications
- Accept/decline meeting requests

## Project Structure

```
/app          - Next.js App Router pages
/components   - Reusable UI components
/lib          - Database connection, utilities
/models       - Mongoose schemas
/api          - API routes
/hooks        - Custom React hooks
/context      - React context providers
/utils        - Helper functions and external API integrations
```

## User Roles

- **Patient**: Search trials, publications, experts; post forum questions
- **Researcher**: Manage trials, respond to forums, collaborate

## License

MIT
