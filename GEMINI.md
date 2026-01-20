# GEMINI-ROOT.MD - Project Setup

Create a Next.js 15 project with App Router using the following specifications:

## Initial Setup Commands
```bash
npx create-next-app@latest organization-website --typescript --tailwind --app --turbopack
cd organization-website
npx shadcn@latest init
```

## Project Configuration

### tailwind.config.ts
Update with custom colors:
```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8B4513",
          light: "#A0522D",
          dark: "#654321",
        },
        secondary: {
          DEFAULT: "#E88C30",
          light: "#FFA54F",
          dark: "#D67820",
        },
        background: {
          DEFAULT: "#F9F5E8",
          light: "#FFFEF9",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
```

## Folder Structure
```
/app
  layout.tsx
  page.tsx
  /about
    /vision
      page.tsx
    /mission
      page.tsx
    /board-members
      page.tsx
    /news-events
      page.tsx
  /gallery
    page.tsx
  /services
    /it
      page.tsx
    /medical
      page.tsx
    /sports
      page.tsx
    /banquets
      page.tsx
    /education
      page.tsx
    /graveyard
      page.tsx
  /contact
    page.tsx
/components
  /navigation
    navbar.tsx
    nav-links.tsx
    mobile-menu.tsx
  /ui
  /layout
    footer.tsx
/lib
  utils.ts
/public
  /images
```

## Install shadcn Components
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sheet
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add accordion
npx shadcn@latest add tabs
npx shadcn@latest add dialog
npx shadcn@latest add avatar
npx shadcn@latest add badge
```

## Additional Packages
```bash
npm install framer-motion lucide-react react-hook-form @hookform/resolvers zod
```

## Layout Component (app/layout.tsx)
Create root layout with:
- Navbar component
- Footer component
- Background color: #F9F5E8
- Font: Inter

Generate all necessary files with proper TypeScript types and Next.js 15 best practices.

---

# GEMINI-NAVBAR.MD - Navigation Bar Component

Create a professional, responsive navigation bar with the following specifications:

## Design Requirements
- Background: White with subtle shadow
- Logo: Left side (placeholder for now)
- Navigation Links: Center (dynamic with dropdowns)
- Donate Button: Right side with background color #E88C30
- Sticky on scroll
- Smooth animations

## Navigation Structure
```typescript
const navigationLinks = [
  { name: "Home", href: "/" },
  {
    name: "About",
    href: "/about",
    subLinks: [
      { name: "Vision", href: "/about/vision" },
      { name: "Mission", href: "/about/mission" },
      { name: "Board of Members", href: "/about/board-members" },
      { name: "News & Events", href: "/about/news-events" },
    ],
  },
  { name: "Gallery", href: "/gallery" },
  {
    name: "Services",
    href: "/services",
    subLinks: [
      { name: "IT Services", href: "/services/it" },
      { name: "Medical Services", href: "/services/medical" },
      { name: "Sports Services", href: "/services/sports" },
      { name: "Banquets", href: "/services/banquets" },
      { name: "Education", href: "/services/education" },
      { name: "Graveyard Services", href: "/services/graveyard" },
    ],
  },
  { name: "Contact Us", href: "/contact" },
]
```

## Features
1. Desktop dropdown menus with hover effect
2. Mobile hamburger menu using shadcn Sheet
3. Active link highlighting
4. Smooth transitions
5. Donate button with #E88C30 background
6. Responsive at all breakpoints

## Components to Create
- components/navigation/navbar.tsx (main component)
- components/navigation/nav-links.tsx (desktop links)
- components/navigation/mobile-menu.tsx (mobile menu)

Use Next.js 15 Link component, Lucide React icons, and Framer Motion for animations.

---

# GEMINI-HOME.MD - Home Page Design

Create a professional home page with the following sections:

## Background
- Main background: #F9F5E8

## Sections Required

### 1. Hero Section
- Full-width banner
- Compelling headline about organization
- Subheadline with mission statement
- Two CTA buttons:
  - Primary: "Get Involved" (#E88C30 background)
  - Secondary: "Learn More" (outline with #8B4513 border)
- Background: Gradient overlay on hero image

### 2. About Section (Brief)
- 2-3 paragraphs introduction
- Background: White
- "Read More" button linking to /about/mission

### 3. Services Overview
- Grid layout (3 columns on desktop, 1 on mobile)
- 6 service cards with icons
- Each card:
  - Icon (Lucide React)
  - Service name
  - Brief description
  - "Learn More" link
- Hover effects
- Background: #F9F5E8

### 4. Stats Section
- 4 animated counters showing:
  - Years of Service
  - People Served
  - Projects Completed
  - Team Members
- Background: #8B4513 with white text
- Use Framer Motion for number animations

### 5. Latest News/Events
- 3 recent news cards in grid
- Each card: image, date, title, excerpt
- "View All News" button
- Background: White

### 6. Call to Action
- Full-width section
- "Support Our Cause" heading
- Donate button (#E88C30)
- Background: Linear gradient with #8B4513

## Animations
- Fade in on scroll
- Smooth transitions
- Hover effects on cards

Generate complete page.tsx file with all sections, proper TypeScript types, and responsive design.

---

# GEMINI-ABOUT-VISION.MD - Vision Page

Create vision page with:

## Background
- Main: #F9F5E8

## Layout

### Hero Section
- Page title: "Our Vision"
- Breadcrumb: Home > About > Vision
- Background: White with subtle pattern

### Vision Statement Section
- Large, inspiring heading
- 2-3 paragraphs about organization's vision
- Background: #F9F5E8
- Quote block with border-left: #E88C30

### Vision Points
- 4-6 key vision points in cards
- Icon for each point
- Background: White cards on #F9F5E8
- Hover effects

### Image Section
- Inspiring image related to vision
- Overlay with key message
- Background overlay: rgba(139, 69, 19, 0.7)

### Future Goals
- Timeline component or list
- 3-5 future goals
- Icons and descriptions
- Background: White

Generate complete page with animations and responsive design.

---

# GEMINI-ABOUT-MISSION.MD - Mission Page

Create mission page with:

## Background
- Main: #F9F5E8

## Layout

### Hero Section
- Page title: "Our Mission"
- Breadcrumb: Home > About > Mission

### Mission Statement
- Bold, clear mission statement
- Background: White card with shadow
- Accent color: #E88C30 for decorative elements

### Core Values
- Grid of 4-6 value cards
- Each card:
  - Icon
  - Value name
  - Description
- Background: #F9F5E8
- Cards: White with hover effect

### What We Do
- 3-4 sections explaining activities
- Alternating layout (text-image, image-text)
- Background: Alternating white and #F9F5E8

### Impact Section
- Statistics with icons
- Achievements list
- Background: #8B4513 with white text

### CTA Section
- "Join Our Mission" button
- Background: #E88C30

Generate complete responsive page with smooth animations.

---

# GEMINI-ABOUT-BOARD.MD - Board of Members Page

Create board members page with:

## Background
- Main: #F9F5E8

## Layout

### Hero Section
- Title: "Board of Members"
- Subtitle about leadership
- Background: White

### Board Members Grid
- Grid layout (3 columns desktop, 1 mobile)
- Each member card:
  - Photo (Avatar component)
  - Name
  - Position
  - Brief bio
  - Social links (optional)
- Card background: White
- Hover effect: Lift with shadow
- Accent border-top: #E88C30

### Leadership Structure (Optional)
- Organizational chart
- Different sections for:
  - Executive Board
  - Advisory Board
  - Department Heads

### Styling
- Cards with rounded corners
- Smooth transitions
- Professional look

Generate complete page with TypeScript interfaces for member data.

---

# GEMINI-ABOUT-NEWS.MD - News & Events Page

Create news and events page with:

## Background
- Main: #F9F5E8

## Layout

### Hero Section
- Title: "News & Events"
- Filter tabs: All, News, Events, Updates

### News Grid
- Masonry or grid layout
- Each news card:
  - Featured image
  - Category badge (#E88C30)
  - Date
  - Title
  - Excerpt
  - "Read More" link
- Background: White cards on #F9F5E8

### Upcoming Events Section
- Timeline layout or calendar
- Event cards with:
  - Date badge
  - Event name
  - Location
  - Time
  - Register button (#E88C30)

### Newsletter Signup
- Email subscription form
- Background: #8B4513
- White text
- Input and button

### Pagination
- Load more button or page numbers
- Style with accent colors

Generate complete page with filtering functionality and animations.

---

# GEMINI-GALLERY.MD - Gallery Page

Create an image gallery with:

## Background
- Main: #F9F5E8

## Layout

### Hero Section
- Title: "Gallery"
- Subtitle: "Moments and Memories"

### Filter Tabs
- Categories: All, Events, Services, Community, Achievements
- Active tab: #E88C30 background
- Background: White

### Gallery Grid
- Masonry layout using CSS Grid
- Images with:
  - Hover overlay
  - Title appears on hover
  - Click to open lightbox
- Overlay color: rgba(139, 69, 19, 0.8)

### Lightbox/Dialog
- Full-screen image viewer
- Navigation arrows
- Close button
- Image caption
- Use shadcn Dialog component

### Load More
- Button at bottom
- Background: #E88C30

## Features
- Lazy loading images
- Smooth animations
- Responsive grid (4 cols desktop, 2 tablet, 1 mobile)
- Next.js Image optimization

Generate complete gallery with working lightbox functionality.

---

# GEMINI-SERVICES-IT.MD - IT Services Page

Create IT services page with:

## Background
- Main: #F9F5E8

## Layout

### Hero Section
- Title: "IT Services"
- Icon: Computer/Code icon
- Brief tagline
- Background: Gradient with #8B4513

### Services Overview
- Introduction paragraph
- What we offer section

### IT Services List
- Cards for each service:
  1. Web Development
  2. Software Solutions
  3. Network Management
  4. IT Consulting
  5. Technical Support
  6. Hardware Solutions

Each card:
- Icon
- Service name
- Description
- Features list
- Background: White

### Technology Stack (Optional)
- Icons of technologies used
- Background: #F9F5E8

### Why Choose Us
- 4-6 benefit points
- Icons with descriptions
- Background: White

### CTA Section
- "Request IT Services" button
- Contact form or link to contact
- Background: #E88C30

Generate complete page with professional IT service presentation.

---

# GEMINI-SERVICES-MEDICAL.MD - Medical Services Page

Create medical services page with:

## Background
- Main: #F9F5E8

## Layout

### Hero Section
- Title: "Medical Services"
- Medical icon
- Caring tagline
- Background: White with medical imagery

### Services Offered
Cards for:
1. Primary Healthcare
2. Emergency Services
3. Diagnostic Services
4. Preventive Care
5. Medical Consultations
6. Health Programs

Each card:
- Medical icon
- Service name
- Description
- "Learn More" expandable
- Background: White on #F9F5E8

### Medical Team (Optional)
- Photos and qualifications
- Grid layout

### Facilities Section
- List or grid of facilities
- Icons and descriptions
- Background: White

### Appointment Booking
- Call to action
- Contact information
- Timings
- Button: #E88C30

### Health Tips Section
- 3-4 quick health tips
- Card layout
- Background: #F9F5E8

Generate professional medical services page with trust-building elements.

---

# GEMINI-SERVICES-SPORTS.MD - Sports Services Page

Create sports services page with:

## Background
- Main: #F9F5E8

## Layout

### Hero Section
- Title: "Sports Services"
- Dynamic sports image
- Motivational tagline

### Sports Programs
Cards for:
1. Cricket
2. Football
3. Basketball
4. Badminton
5. Athletics
6. Swimming (if applicable)

Each card:
- Sport icon
- Program name
- Age groups
- Schedule
- Enrollment info
- Background: White

### Facilities
- Sports complex details
- Images of facilities
- Equipment available
- Background: #F9F5E8

### Coaching Staff
- Profiles of coaches
- Qualifications
- Achievements
- Grid layout

### Achievements
- Awards and trophies
- Player highlights
- Background: #8B4513 with white text

### Registration CTA
- "Join Our Sports Programs" button
- Background: #E88C30
- Contact details

Generate engaging sports page with energy and motivation.

---

# GEMINI-SERVICES-BANQUETS.MD - Banquets Page

Create banquets services page with:

## Background
- Main: #F9F5E8

## Layout

### Hero Section
- Title: "Banquet Services"
- Elegant image
- Subtitle about hosting events

### Banquet Halls
- 2-3 hall options if multiple
- Each hall:
  - Name
  - Capacity
  - Dimensions
  - Features
  - Image gallery
  - Pricing info (optional)
- Background: White cards

### Services Included
List with icons:
- Catering
- Decoration
- Audio/Visual equipment
- Parking
- Security
- Staff support
- Background: #F9F5E8

### Event Types
Cards for:
- Weddings
- Corporate events
- Conferences
- Social gatherings
- Religious ceremonies

### Gallery
- Images of past events
- Masonry layout
- Background: White

### Booking CTA
- "Book Your Event" button
- Contact form
- Availability calendar (optional)
- Background: #E88C30

Generate elegant banquet services page with premium feel.

---

# GEMINI-SERVICES-EDUCATION.MD - Education Services Page

Create education services page with:

## Background
- Main: #F9F5E8

## Layout

### Hero Section
- Title: "Education Services"
- Education-focused imagery
- Inspiring tagline about learning

### Educational Programs
Cards for:
1. Primary Education
2. Secondary Education
3. Adult Education
4. Vocational Training
5. Computer Literacy
6. Language Classes

Each card:
- Education icon
- Program name
- Age/Level
- Duration
- Curriculum highlights
- Background: White

### Facilities
- Classrooms
- Library
- Computer lab
- Science lab
- Sports facilities
- Background: #F9F5E8

### Faculty
- Teacher profiles
- Qualifications
- Experience
- Grid layout

### Scholarships & Support
- Financial aid information
- Scholarship programs
- Requirements
- Background: White

### Admission Process
- Step-by-step guide
- Timeline
- Required documents
- Contact for inquiries

### CTA Section
- "Enroll Now" button (#E88C30)
- Download prospectus link

Generate comprehensive education services page.

---

# GEMINI-SERVICES-GRAVEYARD.MD - Graveyard Services Page

Create graveyard services page with respectful design:

## Background
- Main: #F9F5E8

## Layout

### Hero Section
- Title: "Graveyard Services"
- Peaceful, respectful imagery
- Compassionate message
- Subtle, dignified design

### Services Offered
Cards with respectful tone:
1. Burial Services
2. Grave Allocation
3. Maintenance Services
4. Memorial Services
5. Record Keeping
6. Family Support

Each card:
- Simple icon
- Service name
- Description
- Contact information
- Background: White

### Facilities
- Cemetery details
- Location
- Map
- Operating hours
- Amenities
- Background: #F9F5E8

### Procedures
- Step-by-step process
- Documentation required
- Timing
- Protocols
- Background: White

### Contact Information
- 24/7 helpline
- Office timings
- Location
- Emergency contact

### Respectful Design Notes
- Muted colors
- Minimal animations
- Professional typography
- Compassionate language
- Peaceful imagery

Generate dignified and respectful graveyard services page.

---

# GEMINI-CONTACT.MD - Contact Us Page

Create contact page with:

## Background
- Main: #F9F5E8

## Layout

### Hero Section
- Title: "Contact Us"
- Subtitle: "We'd love to hear from you"
- Background: White

### Contact Form
- Fields:
  - Full Name (required)
  - Email (required)
  - Phone Number
  - Subject
  - Message (textarea, required)
- Submit button: #E88C30
- Form validation using react-hook-form + zod
- Success message on submit
- Background: White card with shadow

### Contact Information
Sidebar or section with:
- Office Address
- Phone Numbers
- Email Addresses
- Office Hours
- Icons for each (Lucide React)
- Background: #F9F5E8

### Map Integration
- Google Maps embed or similar
- Office location marked
- Full width section

### Social Media Links
- Icons linking to:
  - Facebook
  - Twitter/X
  - Instagram
  - LinkedIn
  - YouTube
- Background: White

### FAQ Section (Optional)
- Accordion with common questions
- 5-7 frequently asked questions
- Background: #F9F5E8

### Additional Offices (if applicable)
- List of branch locations
- Mini cards with address and contact

Generate complete contact page with working form and validation.

---

# GEMINI-FOOTER.MD - Footer Component

Create a comprehensive footer with:

## Background
- Background: #8B4513
- Text: White

## Layout (3 Columns on Desktop)

### Column 1: About
- Organization logo (white version)
- Brief description (2-3 lines)
- Social media icons
- Icon colors: White, hover: #E88C30

### Column 2: Quick Links
Two sub-columns:

Quick Links 1:
- Home
- About Us
- Gallery
- Contact Us

Quick Links 2:
- All Services
- News & Events
- Privacy Policy
- Terms of Service

### Column 3: Contact Info
- Address with icon
- Phone with icon
- Email with icon
- Office hours

## Bottom Bar
- Copyright text: "© 2024 [Organization Name]. All rights reserved."
- Background: Darker shade of #8B4513
- Center aligned

## Features
- Responsive (stacks on mobile)
- Hover effects on links
- Link color: White, hover: #E88C30
- Icons from Lucide React

## Additional Elements
- Newsletter subscription (optional)
- Back to top button (fixed, bottom-right)
  - Background: #E88C30
  - Icon: Arrow up
  - Smooth scroll

Generate complete footer component with all sections.