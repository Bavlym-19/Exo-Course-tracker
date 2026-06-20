# Exo - Course Progress Tracker TODO

## Database Schema
- [x] Create students table with id, name, course_link, role
- [x] Create progress_logs table with student_id, section_reached, percentage_complete, percentage_remaining, created_at
- [x] Create quiz_attempts table with student_id, questions, answers, score, passed, cumulative_understanding, created_at
- [x] Create screenshots table with student_id, image_url, analyzed_percentage, last_section, created_at
- [x] Seed initial student data (990, 980, 970, 960, 950, 1)

## Authentication & Authorization
- [x] Implement numeric code login (replace OAuth for this feature)
- [x] Restrict admin dashboard to ID: 1 only
- [ ] Create auth middleware for role-based access control

## Student Dashboard
- [x] Display assigned course link
- [x] Show personal progress history (table/timeline)
- [x] Display quiz results history
- [x] Show cumulative understanding percentage

## Screenshot Upload & Analysis
- [ ] Create screenshot upload form
- [ ] Integrate LLM vision analysis to extract:
  - [ ] Percentage of course completed
  - [ ] Last section reached
  - [ ] Remaining percentage
- [ ] Store analysis results in database

## Auto-Generated Quiz System
- [ ] Create AI quiz generation logic (5-20 random questions)
- [ ] Generate questions based on last completed section
- [ ] Implement quiz UI with question display and answer submission
- [ ] Validate quiz answers and calculate score
- [ ] Enforce 50% pass threshold
- [ ] Store quiz attempt with all metadata

## Quiz History & Scoring
- [ ] Display quiz results per attempt
- [ ] Calculate and display cumulative understanding percentage
- [ ] Show pass/fail status per quiz

## Admin Dashboard
- [ ] Display all students with activity status
- [ ] Show student progress percentages
- [ ] Display active vs inactive students
- [ ] Show per-student quiz performance
- [ ] Display platform-wide analytics
- [ ] Restrict access to ID: 1 only

## Admin Notifications
- [ ] Send notification when student submits screenshot
- [ ] Send notification when student completes quiz
- [ ] Display notification history

## UI/UX - RTL & Arabic Support
- [x] Configure RTL layout globally
- [x] Translate all UI text to Arabic
- [x] Ensure all components respect RTL direction
- [x] Apply dark professional theme
- [ ] Test RTL responsiveness on mobile

## Deployment & Integration
- [ ] Prepare Dockerfile for Render
- [ ] Create GitHub repository with proper .gitignore
- [ ] Add environment variables documentation
- [ ] Create deployment guide

## Testing
- [ ] Write vitest tests for authentication
- [ ] Write vitest tests for quiz generation
- [ ] Write vitest tests for progress calculation
- [ ] Write vitest tests for admin access control
