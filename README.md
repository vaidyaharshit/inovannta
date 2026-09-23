# INNOVENTA

> A modern event management and digital certificate platform for discovering events, managing registrations, generating certificates, and verifying credentials.

---

## ✨ Overview

**INNOVENTA** is a lightweight, responsive single-page web application (SPA) designed to streamline the lifecycle of technical events, workshops, hackathons, and academic competitions. It bridges event discovery and participant management with an instant, verifiable digital credential system.

Traditional certificate issuance processes often suffer from delayed distribution, lack of verification mechanisms, and risk of document tampering. INNOVENTA addresses these challenges by offering a centralized platform where participants can explore upcoming events, complete validated registrations, generate high-resolution digital certificates, and store them securely in a personalized digital credential vault ("My Passport").

For recruiters, academic institutions, and event organizers, INNOVENTA provides an instant verification workflow. Certificates are assigned unique identification keys (`INNOVENTA-2026-XXX`) and simulated cryptographic hashes (`0x...`), allowing credentials to be verified instantly via manual input, direct deep-linking, or optical QR code scanning.

---

## 🚀 Key Features

### 📅 Event Management & Discovery
- **Comprehensive Event Catalog**: Browse technical events categorized into Hackathons, Workshops, Tech Talks, Seminars, and Competitions.
- **Search & Category Filtering**: Instantly search events by keyword or filter by domain categories.
- **Detailed Event Modal**: View complete event details including date, time, venue, organizing body, registration status, and participant counts.

### 📝 Participant Registration
- **Streamlined Form Validation**: Seamless registration requiring full name, valid email format, college/institution, and a valid 10-digit phone number.
- **Automatic ID Assignment**: Generates a unique Certificate ID (`INNOVENTA-2026-XXX`) upon successful registration.
- **Registered Events Tracking**: Dedicated "Registered Events" view displaying all active registrations, participant details, and instant actions to generate or view certificates.

### 🎓 Certificate Generation System
- **HTML5 Canvas Renderer**: Dynamic, client-side rendering of high-resolution A4 landscape certificates (1600x1131) complete with ornamental borders, branding, metadata, dual digital signatures, and seal graphics.
- **Email-Validated Issuance**: Secure generation portal verifying participant registration against registered email credentials before producing certificates.
- **Instant PNG Export**: High-quality PNG download functionality directly from the HTML5 Canvas engine (`INNOVENTA_Certificate_<ID>.png`).

### 🔍 Verification & QR Scanner
- **Multi-Step Verification Workflow**: Simulated multi-stage scanning animation (Scanning ID → Checking Record → Validating Details) resulting in verified badge confirmation and celebration effects.
- **QR Code Engine & Scanner Simulation**: Inline SVG vector QR generator embedded in certificate views and an optical QR camera scanner modal with quick-select test chips.
- **Deep-Link Verification**: Supports direct URL parameter and hash-based verification (`#verify?id=INNOVENTA-2026-001` or `?id=INNOVENTA-2026-001`).

### 🧳 My Passport (Credential Vault)
- **Personal Credential Storage**: Save verified certificates locally into a personal credential vault.
- **Passport Management**: Search, filter by event category, view full-screen previews, verify credentials, download PNGs, or remove stored certificates.
- **Dynamic Badge Counter**: Live visual indicator tracking saved certificates count.

### 🎨 UI / UX Excellence
- **Single Page Architecture (SPA)**: Smooth tab navigation and scroll-spy tracking.
- **Dark / Light Theme Toggle**: Persistent theme switching with automatic system detection fallback.
- **Interactive Animations**: Glassmorphism navigation, ambient background floaters, scroll progress bar, staggered scroll reveal, and toast notifications.

---

## 🔄 How INNOVENTA Works

```text
       Discover Events
              │
              ▼
      View Event Details
              │
              ▼
     Register for Event  ───── (Generates Unique Cert ID)
              │
              ▼
      Registered Events
              │
              ▼
 Select Registered Event / Portal
              │
              ▼
   Verify Registered Email
              │
              ▼
 Dynamic HTML5 Canvas Generation
              │
    ┌─────────┴─────────┐
    ▼                   ▼
Download PNG      Add to Passport
    │                   │
    └─────────┬─────────┘
              ▼
   QR / Cert ID Verification
```

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Core** | HTML5, Vanilla JavaScript (ES6+ Module Pattern), Vanilla CSS (`css/styles.css`) |
| **Styling & Design** | Tailwind CSS (CDN with custom brand palette & dark mode configuration) |
| **Graphics Engine** | Native HTML5 2D Canvas API (High-res 1600x1131 rendering) |
| **Typography** | Google Fonts (`Inter`, `Outfit`) |
| **Icons & QR** | Scalable Vector Graphics (SVG) |
| **Third-Party Libraries** | `canvas-confetti` (v1.6.0 via jsDelivr CDN) |
| **Data Persistence** | Browser `localStorage` via custom `StorageService` abstraction layer |
| **Development Tooling**| Node.js, `npx serve` |

---

## 📂 Project Structure

```text
inovanta/
├── css/
│   └── styles.css          # Custom CSS, keyframe animations, ambient orbs, scrollbar styles
├── js/
│   ├── app.js              # Core application controller, SPA routing, state management, modal logic
│   ├── certificate.js      # HTML5 Canvas dynamic certificate generator & PNG export service
│   ├── data.js             # Initial seed data for events and sample verified certificates
│   └── storage.js          # LocalStorage service managing themes, registrations, and saved passport certs
├── index.html              # Main HTML5 SPA structure, templates, and modal markups
├── package.json            # Node.js dev server scripts
└── README.md               # Project documentation
```

---

## 💾 Data & Storage Mechanics

INNOVENTA relies on a decoupled architecture combining in-memory state management with browser `localStorage` persistence through `StorageService`:

- **Theme Key (`innoventa_theme`)**: Remembers user choice between `light` and `dark` modes.
- **Registrations Key (`innoventa_registrations`)**: Stores participant registration objects containing `fullName`, `email`, `college`, `phone`, `eventId`, `eventName`, and `certificateId`. Pre-populated with sample demo registrations.
- **Saved Certificates Key (`innoventa_saved_certificates`)**: Maintains user's personal passport collection across sessions.
- **Seed Datasets (`js/data.js`)**: Contains default event listings (`EVENTS_DATA`) and pre-issued certificates (`CERTIFICATES_DATA`) for instant verification testing.

---

## 🔐 Certificate Generation & Verification Mechanics

### Dynamic Canvas Generation Engine
Certificates are generated purely on the client side using `CertificateExporter` in `js/certificate.js`:
1. Renders a 1600x1131 pixel canvas matching standard A4 landscape ratio.
2. Applies double decorative border vectors (Slate & Amber gold) with corner ornaments.
3. Draws typographic elements (`Outfit` and `Inter` fonts), participant metadata, and event details.
4. Generates dynamic badge seals ("VERIFIED SECURE ID") and signature fields.
5. Embeds a custom vector matrix QR code pattern representing the Certificate ID.
6. Exports directly as a PNG data URL for zero-dependency local download.

### Verification Flow & Deep Linking
1. **Manual Verification**: Enter any Certificate ID (e.g., `INNOVENTA-2026-001`) into the verification input.
2. **Deep Linking**: Access direct URL hashes or query strings:
   - `http://localhost:3000/#verify?id=INNOVENTA-2026-001`
   - `http://localhost:3000/?id=INNOVENTA-2026-002`
3. **QR Code Scanning**: Open the QR Scanner simulation modal and select any sample chip to auto-populate and verify.

---

## 🚀 How to Run the Project

### Prerequisites
- Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
- Node.js (Optional, for running local dev server).

### Option 1: Direct Browser Launch (No Installation Required)
Simply open `index.html` in your web browser.

### Option 2: Using NPM / Node.js Local Server (Recommended)
1. Clone the repository:
   ```bash
   git clone https://github.com/vaidyaharshit/inovannta.git
   cd inovannta
   ```
2. Start the local server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

### Option 3: Using Python HTTP Server
```bash
python -m http.server 8000
```
Navigate to `http://localhost:8000`.

---

## ⚠️ Important Limitations

- **Client-Side Storage**: Data is saved locally in browser `localStorage`. Clearing browser cache will reset registrations and passport items to default demo data.
- **Simulated Cryptographics**: Issue hashes (`0x...`) and QR scanning mechanisms are client-side simulated representations designed for demonstration and interface workflows.
- **No Backend Database**: Registration and certificate records exist within browser state and `localStorage` without a centralized remote server.

---

## 🔮 Future Improvements

- **Backend Integration**: Implement a Node.js / Express backend with MongoDB / PostgreSQL database.
- **Blockchain / Cryptographic Verification**: Web3 smart contract integration or Ed25519 digital signatures for tamper-proof verification on public blockchains.
- **Camera QR Scanner**: Integrate WebRTC `navigator.mediaDevices.getUserMedia` for real-world optical camera QR code scanning.
- **PDF Export Engine**: Add PDF export support alongside PNG downloads using `jsPDF` or `pdfkit`.
- **Organizer Admin Dashboard**: Add an admin management portal for event organizers to publish events, track attendee attendance, and bulk-issue credentials.
