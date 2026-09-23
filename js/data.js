/**
 * INNOVENTA - Dummy Data Repository
 */

const EVENTS_DATA = [
  {
    id: "evt-101",
    name: "Tech Tank 2026",
    date: "15 September 2026",
    time: "10:00 AM - 05:00 PM IST",
    venue: "Main Auditorium, Innovation Block A",
    type: "Tech Tank",
    category: "Competition",
    shortDescription: "Pitch your revolutionary startup idea to industry veterans and win seed funding up to ₹5 Lakhs.",
    description: "Tech Tank 2026 is INNOVENTA's flagship startup pitching competition. Participant teams present early-stage tech ideas, business models, and live prototypes to a panel of venture capitalists, angel investors, and tech leaders.",
    organizer: "INNOVENTA Entrepreneurship Cell",
    registrationStatus: "Open",
    registeredCount: 142,
    badgeColor: "emerald"
  },
  {
    id: "evt-102",
    name: "National Hackathon X",
    date: "20 August 2026",
    time: "09:00 AM (36 Hours Non-Stop)",
    venue: "Central Computing Complex & Online",
    type: "Hackathon",
    category: "Hackathon",
    shortDescription: "36-hour intense hackathon addressing real-world challenges in AI, Web3, Healthcare, and Sustainable Tech.",
    description: "Collaborate in teams of 2-4 developers to build innovative software solutions within 36 hours. Mentors from top tech companies will guide teams throughout the event. Prizes worth ₹2.5 Lakhs!",
    organizer: "INNOVENTA Developer Network",
    registrationStatus: "Open",
    registeredCount: 310,
    badgeColor: "indigo"
  },
  {
    id: "evt-103",
    name: "Modern Web Dev & AI Workshop",
    date: "05 July 2026",
    time: "02:00 PM - 06:00 PM IST",
    venue: "Seminar Hall 2 & Live Stream",
    type: "Workshop",
    category: "Workshop",
    shortDescription: "Hands-on masterclass on integrating LLMs, Tailwind CSS, and Modern Frontend Frameworks into production apps.",
    description: "Learn how to build AI-powered user interfaces using modern JavaScript frameworks, tailwind utility systems, and RESTful/GraphQL APIs. Bring your own laptop with Node.js installed.",
    organizer: "INNOVENTA Tech Guild",
    registrationStatus: "Closing Soon",
    registeredCount: 88,
    badgeColor: "amber"
  },
  {
    id: "evt-104",
    name: "Future of AI Tech Talk",
    date: "12 June 2026",
    time: "11:00 AM - 01:00 PM IST",
    venue: "Virtual Convention Center",
    type: "Tech Talk",
    category: "Tech Talk",
    shortDescription: "Keynote presentation by AI researchers on Autonomous Agents, Neural Architectures, and Ethical AI.",
    description: "An inspiring technical discourse featuring guest speakers from leading AI research labs. Topics include reasoning models, multimodal agent systems, and alignment frameworks.",
    organizer: "INNOVENTA AI Research Wing",
    registrationStatus: "Open",
    registeredCount: 520,
    badgeColor: "purple"
  },
  {
    id: "evt-105",
    name: "Autonomous Robotics Clash",
    date: "28 March 2026",
    time: "10:00 AM - 04:00 PM IST",
    venue: "Robotics Arena, Block C",
    type: "Competition",
    category: "Competition",
    shortDescription: "Battle of autonomous line-followers, maze navigators, and combat bots designed by engineering teams.",
    description: "Watch state-of-the-art student-built robotics navigate obstacle arenas autonomously under timed conditions. Rigorous technical inspection precedes all matches.",
    organizer: "INNOVENTA Robotics Club",
    registrationStatus: "Closed",
    registeredCount: 64,
    badgeColor: "rose"
  },
  {
    id: "evt-106",
    name: "Cyber Security & Defense Seminar",
    date: "18 February 2026",
    time: "03:00 PM - 06:00 PM IST",
    venue: "Cyber Labs & Online Webinar",
    type: "Seminar",
    category: "Seminar",
    shortDescription: "Comprehensive seminar on Zero-Trust Architecture, Penetration Testing, and Cloud Security Defenses.",
    description: "Explore the latest threat intelligence, vulnerability assessment methods, and defensible architecture patterns with certified ethical hackers and security engineers.",
    organizer: "INNOVENTA Cyber Defense Cell",
    registrationStatus: "Closed",
    registeredCount: 215,
    badgeColor: "sky"
  }
];

const CERTIFICATES_DATA = [
  {
    certificateId: "INNOVENTA-2026-001",
    participantName: "Rahul Sharma",
    eventName: "Tech Tank 2026",
    eventDate: "15 September 2026",
    status: "Certificate Verified",
    issueCategory: "1st Rank - Startup Pitch Winner",
    organizer: "INNOVENTA Entrepreneurship Cell",
    college: "Indian Institute of Technology",
    issueHash: "0x8f92a1b74c5d3e2109841f6a",
    verificationStatus: "Verified & Authentic"
  },
  {
    certificateId: "INNOVENTA-2026-002",
    participantName: "Ananya Verma",
    eventName: "National Hackathon X",
    eventDate: "20 August 2026",
    status: "Certificate Verified",
    issueCategory: "Best UI/UX Award",
    organizer: "INNOVENTA Developer Network",
    college: "Delhi Technological University",
    issueHash: "0x4b18c92e7d013f5a892b1e4c",
    verificationStatus: "Verified & Authentic"
  },
  {
    certificateId: "INNOVENTA-2026-003",
    participantName: "Vikram Malhotra",
    eventName: "Modern Web Dev & AI Workshop",
    eventDate: "05 July 2026",
    status: "Certificate Verified",
    issueCategory: "Certificate of Completion",
    organizer: "INNOVENTA Tech Guild",
    college: "Birla Institute of Technology",
    issueHash: "0x12c93847e5012a984b72c3d1",
    verificationStatus: "Verified & Authentic"
  },
  {
    certificateId: "INNOVENTA-2026-004",
    participantName: "Priya Patel",
    eventName: "Future of AI Tech Talk",
    eventDate: "12 June 2026",
    status: "Certificate Verified",
    issueCategory: "Delegate & Contributor",
    organizer: "INNOVENTA AI Research Wing",
    college: "National Institute of Technology",
    issueHash: "0x77a1029384c5b6d7e8f90123",
    verificationStatus: "Verified & Authentic"
  },
  {
    certificateId: "INNOVENTA-2026-005",
    participantName: "Rohan Das",
    eventName: "Autonomous Robotics Clash",
    eventDate: "28 March 2026",
    status: "Certificate Verified",
    issueCategory: "Runner Up - Robot Design",
    organizer: "INNOVENTA Robotics Club",
    college: "Vellore Institute of Technology",
    issueHash: "0x3344556677889900aabbccdd",
    verificationStatus: "Verified & Authentic"
  }
];

if (typeof window !== "undefined") {
  window.EVENTS_DATA = EVENTS_DATA;
  window.CERTIFICATES_DATA = CERTIFICATES_DATA;
}
