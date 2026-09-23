/**
 * INNOVENTA - LocalStorage Service
 */

const STORAGE_KEYS = {
  THEME: "innoventa_theme",
  SAVED_CERTS: "innoventa_saved_certificates",
  REGISTRATIONS: "innoventa_registrations"
};

const StorageService = {
  // Theme Management
  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || "light";
  },

  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // Saved Certificates Management
  getSavedCertificates() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_CERTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading saved certificates from localStorage", e);
      return [];
    }
  },

  saveCertificate(certificate) {
    const certs = this.getSavedCertificates();
    const exists = certs.some(c => c.certificateId === certificate.certificateId);
    if (!exists) {
      certs.unshift(certificate);
      localStorage.setItem(STORAGE_KEYS.SAVED_CERTS, JSON.stringify(certs));
      return true;
    }
    return false;
  },

  removeCertificate(certificateId) {
    let certs = this.getSavedCertificates();
    certs = certs.filter(c => c.certificateId !== certificateId);
    localStorage.setItem(STORAGE_KEYS.SAVED_CERTS, JSON.stringify(certs));
    return certs;
  },

  isCertificateSaved(certificateId) {
    const certs = this.getSavedCertificates();
    return certs.some(c => c.certificateId === certificateId);
  },

  // Event Registrations Management
  getRegistrations() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      if (data) return JSON.parse(data);

      // Default demo registrations matching initial sample certificates
      const demoRegs = [
        { id: "REG-001", fullName: "Rahul Sharma", email: "rahul.sharma@example.com", eventId: "evt-101", eventName: "Tech Tank 2026", college: "Indian Institute of Technology", certificateId: "INNOVENTA-2026-001" },
        { id: "REG-002", fullName: "Ananya Verma", email: "ananya.verma@example.com", eventId: "evt-102", eventName: "National Hackathon X", college: "Delhi Technological University", certificateId: "INNOVENTA-2026-002" },
        { id: "REG-003", fullName: "Vikram Malhotra", email: "vikram.m@example.com", eventId: "evt-103", eventName: "Modern Web Dev & AI Workshop", college: "Birla Institute of Technology", certificateId: "INNOVENTA-2026-003" },
        { id: "REG-004", fullName: "Priya Patel", email: "priya.patel@example.com", eventId: "evt-104", eventName: "Future of AI Tech Talk", college: "National Institute of Technology", certificateId: "INNOVENTA-2026-004" },
        { id: "REG-005", fullName: "Rohan Das", email: "rohan.das@example.com", eventId: "evt-105", eventName: "Autonomous Robotics Clash", college: "Vellore Institute of Technology", certificateId: "INNOVENTA-2026-005" }
      ];
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(demoRegs));
      return demoRegs;
    } catch (e) {
      return [];
    }
  },

  saveRegistration(regData) {
    const registrations = this.getRegistrations();
    const newEntry = {
      ...regData,
      id: "REG-" + Date.now(),
      registeredAt: new Date().toISOString()
    };
    registrations.unshift(newEntry);
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
    return newEntry;
  }
};

if (typeof window !== "undefined") {
  window.StorageService = StorageService;
}
