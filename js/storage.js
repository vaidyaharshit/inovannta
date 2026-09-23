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
      return data ? JSON.parse(data) : [];
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
