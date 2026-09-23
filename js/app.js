/**
 * INNOVENTA - Main Application Controller
 */

(function () {
  // Application State
  const state = {
    currentTab: "home",
    events: [],
    certificates: [],
    savedCertificates: [],
    searchQuery: "",
    categoryFilter: "All",
    passportCategoryFilter: "All",
    activeEvent: null,
    verifiedCert: null,
    verificationState: "idle", // 'idle' | 'searching' | 'verified' | 'invalid' | 'empty'
    verificationInput: "",
    theme: "light"
  };

  // DOM Cache
  let elements = {};

  document.addEventListener("DOMContentLoaded", () => {
    initApp();
  });

  function initApp() {
    // Load Data
    state.events = window.EVENTS_DATA || [];
    state.certificates = window.CERTIFICATES_DATA || [];
    state.savedCertificates = window.StorageService.getSavedCertificates();
    state.theme = window.StorageService.getTheme();

    // Cache DOM Elements
    cacheElements();

    // Apply Theme
    applyTheme(state.theme);

    // Bind Event Listeners
    bindEvents();

    // Initial Renders
    renderEvents();
    renderSavedCertificates();
    updateSavedCountBadge();

    // Initialize Animations & Scroll Features
    initScrollProgress();
    initScrollReveal();
    initHowItWorksLineObserver();
    initParallaxEffects();
    initScrollSpy();

    // Check for URL / Hash Query Parameter ID (e.g. #verify?id=INNOVENTA-2026-001)
    checkUrlForVerificationId();
  }

  function cacheElements() {
    elements = {
      html: document.documentElement,
      themeToggleBtn: document.getElementById("theme-toggle-btn"),
      themeIcon: document.getElementById("theme-icon"),
      themeLabel: document.getElementById("theme-label"),
      mobileMenuBtn: document.getElementById("mobile-menu-btn"),
      mobileMenuDrawer: document.getElementById("mobile-menu-drawer"),
      mobileMenuCloseBtn: document.getElementById("mobile-menu-close-btn"),
      navLinks: document.querySelectorAll(".nav-link"),
      mobileNavLinks: document.querySelectorAll(".mobile-nav-link"),
      tabContents: document.querySelectorAll(".tab-content"),
      
      // Events Section
      eventSearchInput: document.getElementById("event-search-input"),
      eventCategoryFilters: document.getElementById("event-category-filters"),
      eventsGrid: document.getElementById("events-grid"),
      eventsEmptyState: document.getElementById("events-empty-state"),
      
      // Certificate Verification Section
      certIdInput: document.getElementById("cert-id-input"),
      verifyCertBtn: document.getElementById("verify-cert-btn"),
      scanQrBtn: document.getElementById("scan-qr-btn"),
      verifyHelperText: document.getElementById("verify-helper-text"),
      
      // Verification Result Area
      verificationStateIdle: document.getElementById("verification-state-idle"),
      verificationStateSearching: document.getElementById("verification-state-searching"),
      searchingStepText: document.getElementById("searching-step-text"),
      verificationStateResult: document.getElementById("verification-state-result"),
      verificationStateInvalid: document.getElementById("verification-state-invalid"),
      verificationStateEmpty: document.getElementById("verification-state-empty"),
      
      // Verified Result Details
      resultParticipantName: document.getElementById("result-participant-name"),
      resultEventName: document.getElementById("result-event-name"),
      resultEventDate: document.getElementById("result-event-date"),
      resultCertId: document.getElementById("result-cert-id"),
      resultCategory: document.getElementById("result-category"),
      resultStatusBadge: document.getElementById("result-status-badge"),
      resultQrCodeContainer: document.getElementById("result-qr-code-container"),
      
      // Verification Action Buttons
      btnViewCert: document.getElementById("btn-view-cert"),
      btnDownloadCert: document.getElementById("btn-download-cert"),
      btnAddMyCert: document.getElementById("btn-add-my-cert"),
      btnVerifyAnother: document.getElementById("btn-verify-another"),
      btnVerifyAnotherInvalid: document.getElementById("btn-verify-another-invalid"),

      // Passport Section
      savedCertificatesGrid: document.getElementById("saved-certificates-grid"),
      savedCertificatesEmptyState: document.getElementById("saved-certificates-empty-state"),
      savedCertCountBadge: document.getElementById("saved-cert-count-badge"),
      passportCategoryFilters: document.getElementById("passport-category-filters"),
      statCertCount: document.getElementById("stat-cert-count"),
      statEventCount: document.getElementById("stat-event-count"),

      // Modals
      eventDetailsModal: document.getElementById("event-details-modal"),
      eventDetailsModalClose: document.getElementById("event-details-modal-close"),
      eventDetailsModalBody: document.getElementById("event-details-modal-body"),
      
      registrationModal: document.getElementById("registration-modal"),
      registrationModalClose: document.getElementById("registration-modal-close"),
      registrationForm: document.getElementById("registration-form"),
      regEventSelect: document.getElementById("reg-event-select"),
      regSuccessContainer: document.getElementById("reg-success-container"),
      regFormContainer: document.getElementById("reg-form-container"),
      regSuccessBtnClose: document.getElementById("reg-success-btn-close"),
      
      qrScannerModal: document.getElementById("qr-scanner-modal"),
      qrScannerModalClose: document.getElementById("qr-scanner-modal-close"),
      qrChipContainer: document.getElementById("qr-chip-container"),
      
      certPreviewModal: document.getElementById("cert-preview-modal"),
      certPreviewModalClose: document.getElementById("cert-preview-modal-close"),
      certPreviewContainer: document.getElementById("cert-preview-container"),
      certPreviewVerifyBtn: document.getElementById("cert-preview-verify-btn"),
      certPreviewDownloadBtn: document.getElementById("cert-preview-download-btn"),

      // Toasts
      toast: document.getElementById("toast-notification"),
      toastMessage: document.getElementById("toast-message")
    };
  }

  function bindEvents() {
    // Theme Switcher
    elements.themeToggleBtn.addEventListener("click", toggleTheme);

    // Mobile Menu
    elements.mobileMenuBtn.addEventListener("click", () => {
      elements.mobileMenuDrawer.classList.remove("hidden");
    });
    elements.mobileMenuCloseBtn.addEventListener("click", () => {
      elements.mobileMenuDrawer.classList.add("hidden");
    });

    // Navigation Links Smooth Scroll
    elements.navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetTab = link.getAttribute("data-tab");
        switchTab(targetTab);
      });
    });

    elements.mobileNavLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetTab = link.getAttribute("data-tab");
        elements.mobileMenuDrawer.classList.add("hidden");
        switchTab(targetTab);
      });
    });

    // Search and Category Filters
    elements.eventSearchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderEvents();
    });

    if (elements.eventCategoryFilters) {
      elements.eventCategoryFilters.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        const category = btn.getAttribute("data-category");
        if (category) {
          state.categoryFilter = category;
          const buttons = elements.eventCategoryFilters.querySelectorAll("button");
          buttons.forEach(b => {
            b.classList.remove("active");
            b.classList.add("inactive");
          });
          btn.classList.remove("inactive");
          btn.classList.add("active");
          renderEvents();
        }
      });
    }

    // Passport Category Filters
    if (elements.passportCategoryFilters) {
      elements.passportCategoryFilters.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        const category = btn.getAttribute("data-passport-category");
        if (category) {
          state.passportCategoryFilter = category;
          const buttons = elements.passportCategoryFilters.querySelectorAll("button");
          buttons.forEach(b => {
            b.classList.remove("active");
            b.classList.add("inactive");
          });
          btn.classList.remove("inactive");
          btn.classList.add("active");
          renderSavedCertificates();
        }
      });
    }

    // Verification Logic
    elements.verifyCertBtn.addEventListener("click", () => {
      performVerification(elements.certIdInput.value);
    });

    elements.certIdInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        performVerification(elements.certIdInput.value);
      }
    });

    elements.btnVerifyAnother.addEventListener("click", resetVerificationFlow);
    elements.btnVerifyAnotherInvalid.addEventListener("click", resetVerificationFlow);

    // QR Scan Simulation
    elements.scanQrBtn.addEventListener("click", openQrScannerModal);
    elements.qrScannerModalClose.addEventListener("click", closeQrScannerModal);

    // Verification Action Handlers
    elements.btnViewCert.addEventListener("click", () => {
      if (state.verifiedCert) {
        openCertPreviewModal(state.verifiedCert);
      }
    });

    elements.btnDownloadCert.addEventListener("click", () => {
      if (state.verifiedCert) {
        window.CertificateExporter.download(state.verifiedCert);
        showToast("Certificate downloaded successfully!");
      }
    });

    elements.btnAddMyCert.addEventListener("click", () => {
      if (state.verifiedCert) {
        const added = window.StorageService.saveCertificate(state.verifiedCert);
        state.savedCertificates = window.StorageService.getSavedCertificates();
        renderSavedCertificates();
        updateSavedCountBadge();
        updateAddCertButtonState();
        if (added) {
          showToast("Added to My Passport!");
        } else {
          showToast("Certificate is already in your Passport.");
        }
      }
    });

    // Modals Close Listeners
    elements.eventDetailsModalClose.addEventListener("click", () => {
      elements.eventDetailsModal.classList.add("hidden");
    });

    elements.registrationModalClose.addEventListener("click", () => {
      elements.registrationModal.classList.add("hidden");
    });

    elements.regSuccessBtnClose.addEventListener("click", () => {
      elements.registrationModal.classList.add("hidden");
    });

    elements.certPreviewModalClose.addEventListener("click", () => {
      elements.certPreviewModal.classList.add("hidden");
    });

    // Registration Form Submit
    elements.registrationForm.addEventListener("submit", handleRegistrationSubmit);
  }

  // Standalone Vector SVG QR Code Generator Helper
  function generateSvgQr(certId, size = 70) {
    const qrGrid = [
      [1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,1,1,1,0,1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0],
      [1,1,0,1,0,1,1,0,1,1,1,0,1,1,0,1,0,1,1],
      [1,0,1,0,1,0,0,1,0,1,0,1,0,1,1,0,1,0,1],
      [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0,1,1,1,0,1,0,0,0,0,0,0,0],
      [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,1,1,0,1,1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1]
    ];
    const count = qrGrid.length;
    const cellSize = size / count;
    let rects = '';
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qrGrid[r][c] === 1) {
          rects += `<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="#0f172a" />`;
        }
      }
    }
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" class="select-none">${rects}</svg>`;
  }

  // Check URL / Hash for direct verification links
  function checkUrlForVerificationId() {
    const searchParams = new URLSearchParams(window.location.search);
    let certId = searchParams.get("id");
    
    if (!certId && window.location.hash.includes("id=")) {
      const match = window.location.hash.match(/id=([^&]+)/);
      if (match) certId = match[1];
    }

    if (certId) {
      elements.certIdInput.value = certId;
      switchTab("verify");
      performVerification(certId);
    }
  }

  // Router / Hash Navigation & Smooth Scroll to Section
  function switchTab(tabId, updateHash = true) {
    state.currentTab = tabId;
    if (updateHash && tabId !== "404") {
      history.pushState(null, "", `#${tabId}`);
    }

    updateActiveNavLink(tabId);

    // Find section element by tab ID or anchor ID
    let targetSection = document.getElementById(`tab-${tabId}`);
    if (!targetSection && tabId === "why-innoventa") {
      targetSection = document.getElementById("why-innoventa-section");
    } else if (!targetSection && tabId === "journey") {
      targetSection = document.getElementById("journey-section");
    } else if (!targetSection && tabId === "home") {
      targetSection = document.getElementById("hero-section");
    }

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function updateActiveNavLink(tabId) {
    elements.navLinks.forEach(link => {
      if (link.getAttribute("data-tab") === tabId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Theme Toggle
  function toggleTheme() {
    state.theme = state.theme === "light" ? "dark" : "light";
    window.StorageService.setTheme(state.theme);
    applyTheme(state.theme);
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      elements.html.classList.add("dark");
      elements.themeLabel.textContent = "Dark";
      elements.themeIcon.innerHTML = `
        <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>`;
    } else {
      elements.html.classList.remove("dark");
      elements.themeLabel.textContent = "Light";
      elements.themeIcon.innerHTML = `
        <svg class="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>`;
    }
  }

  // Scroll Progress Indicator
  function initScrollProgress() {
    const progressBar = document.getElementById("scroll-progress-bar");
    if (!progressBar) return;

    window.addEventListener("scroll", () => {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${scrollPercent}%`;
      });
    }, { passive: true });
  }

  // IntersectionObserver for Scroll Reveal
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal-init:not(.reveal-active)");
    if (!revealElements.length) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -40px 0px",
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }

  // ScrollSpy to update active tab link on page scroll
  function initScrollSpy() {
    const sections = [
      { id: "hero-section", tab: "home" },
      { id: "why-innoventa-section", tab: "why-innoventa" },
      { id: "journey-section", tab: "journey" },
      { id: "tab-events", tab: "events" },
      { id: "tab-verify", tab: "verify" },
      { id: "tab-my-certificates", tab: "my-certificates" },
      { id: "tab-about", tab: "about" }
    ];

    window.addEventListener("scroll", () => {
      requestAnimationFrame(() => {
        const scrollPos = window.scrollY + 200;
        for (let i = sections.length - 1; i >= 0; i--) {
          const secEl = document.getElementById(sections[i].id);
          if (secEl && secEl.offsetTop <= scrollPos) {
            updateActiveNavLink(sections[i].tab);
            break;
          }
        }
      });
    }, { passive: true });
  }

  // How It Works / Journey Line Observer
  function initHowItWorksLineObserver() {
    const line = document.getElementById("how-it-works-line");
    const section = document.getElementById("journey-section");
    if (!line || !section) return;

    window.addEventListener("scroll", () => {
      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight && rect.bottom > 0) {
          const totalDist = windowHeight + rect.height;
          const currentProgress = (windowHeight - rect.top) / totalDist;
          const fillPercent = Math.min(Math.max(currentProgress * 150, 0), 100);
          line.style.width = `${fillPercent}%`;
        }
      });
    }, { passive: true });
  }

  // Hero Certificate Parallax Effect (Kept static per design specification)
  function initParallaxEffects() {
    // Certificate hero is kept clean and static
  }

  // Events Rendering with Staggered Scroll Reveal
  function renderEvents() {
    if (!elements.eventsGrid) return;

    let filtered = state.events.filter(evt => {
      const matchesSearch = evt.name.toLowerCase().includes(state.searchQuery) ||
                            evt.shortDescription.toLowerCase().includes(state.searchQuery) ||
                            evt.type.toLowerCase().includes(state.searchQuery);
      const matchesCategory = state.categoryFilter === "All" || evt.category === state.categoryFilter;
      return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
      elements.eventsGrid.classList.add("hidden");
      elements.eventsEmptyState.classList.remove("hidden");
    } else {
      elements.eventsEmptyState.classList.add("hidden");
      elements.eventsGrid.classList.remove("hidden");
      
      elements.eventsGrid.innerHTML = filtered.map((evt, idx) => {
        const staggerClass = `stagger-delay-${(idx % 4) + 1}`;
        return `
          <div class="reveal-init ${staggerClass} bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between interactive-card shadow-sm">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50">
                  ${evt.type}
                </span>
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  ${evt.date}
                </span>
              </div>
              
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 font-heading">${evt.name}</h3>
              <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 line-clamp-2">${evt.shortDescription}</p>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full ${evt.registrationStatus === 'Open' ? 'bg-teal-500' : evt.registrationStatus === 'Closing Soon' ? 'bg-amber-500' : 'bg-slate-400'}"></span>
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">${evt.registrationStatus}</span>
              </div>
              
              <button onclick="window.appOpenEventDetails('${evt.id}')" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all duration-200 group">
                <span>View Details</span>
                <svg class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        `;
      }).join("");

      // Re-observe newly created reveal elements
      setTimeout(initScrollReveal, 50);
    }
  }

  // Event Details Modal
  window.appOpenEventDetails = function (eventId) {
    const evt = state.events.find(e => e.id === eventId);
    if (!evt) return;
    state.activeEvent = evt;

    elements.eventDetailsModalBody.innerHTML = `
      <div class="space-y-6">
        <div>
          <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 mb-3">
            ${evt.type} • ${evt.category}
          </span>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-heading">${evt.name}</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <div class="flex items-start gap-3">
            <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Date & Time</p>
              <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">${evt.date}</p>
              <p class="text-xs text-slate-600 dark:text-slate-400">${evt.time}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Venue</p>
              <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">${evt.venue}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Organizer</p>
              <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">${evt.organizer}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Registration Status</p>
              <p class="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                ${evt.registrationStatus}
                <span class="text-xs text-slate-500">(${evt.registeredCount} Registered)</span>
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-base font-semibold text-slate-900 dark:text-white mb-2">About Event</h4>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${evt.description}</p>
        </div>

        <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
          <button onclick="document.getElementById('event-details-modal').classList.add('hidden')" class="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Close
          </button>
          <button onclick="window.appOpenRegistrationModal('${evt.id}')" class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all">
            Register Now
          </button>
        </div>
      </div>
    `;

    elements.eventDetailsModal.classList.remove("hidden");
  };

  // Registration Modal
  window.appOpenRegistrationModal = function (eventId) {
    elements.eventDetailsModal.classList.add("hidden");
    
    // Populate Event Selector options
    elements.regEventSelect.innerHTML = state.events.map(e => `
      <option value="${e.id}" ${e.id === eventId ? 'selected' : ''}>${e.name} (${e.date})</option>
    `).join("");

    // Reset Form UI
    elements.registrationForm.reset();
    clearRegistrationFormErrors();
    elements.regFormContainer.classList.remove("hidden");
    elements.regSuccessContainer.classList.add("hidden");

    elements.registrationModal.classList.remove("hidden");
  };

  function handleRegistrationSubmit(e) {
    e.preventDefault();
    clearRegistrationFormErrors();

    const fullName = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const college = document.getElementById("reg-college").value.trim();
    const phone = document.getElementById("reg-phone").value.trim();
    const eventId = elements.regEventSelect.value;

    let hasError = false;

    // Name Validation
    if (!fullName) {
      showFieldError("reg-name-error", "Full Name is required.");
      hasError = true;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showFieldError("reg-email-error", "Email is required.");
      hasError = true;
    } else if (!emailRegex.test(email)) {
      showFieldError("reg-email-error", "Please enter a valid email address.");
      hasError = true;
    }

    // College Validation
    if (!college) {
      showFieldError("reg-college-error", "College / Institution is required.");
      hasError = true;
    }

    // Phone Validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone) {
      showFieldError("reg-phone-error", "Phone Number is required.");
      hasError = true;
    } else if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
      showFieldError("reg-phone-error", "Please enter a valid 10-digit phone number.");
      hasError = true;
    }

    if (hasError) return;

    // Save Registration
    const selectedEvt = state.events.find(ev => ev.id === eventId);
    window.StorageService.saveRegistration({
      fullName,
      email,
      college,
      phone,
      eventId,
      eventName: selectedEvt ? selectedEvt.name : "Event"
    });

    // Show Success UI
    elements.regFormContainer.classList.add("hidden");
    elements.regSuccessContainer.classList.remove("hidden");
  }

  function clearRegistrationFormErrors() {
    ["reg-name-error", "reg-email-error", "reg-college-error", "reg-phone-error"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = "";
        el.classList.add("hidden");
      }
    });
  }

  function showFieldError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = message;
      el.classList.remove("hidden");
    }
  }

  // Enhanced Certificate Verification Workflow with Multi-Step Scanning Animation
  function performVerification(certId) {
    const trimmedId = certId.trim().toUpperCase();
    state.verificationInput = trimmedId;

    if (!trimmedId) {
      setVerificationState("empty");
      return;
    }

    // Show Animated Scanning State
    setVerificationState("searching");

    // Animated Step progression over 1.8 seconds
    if (elements.searchingStepText) {
      elements.searchingStepText.textContent = "Scanning Certificate ID...";
      setTimeout(() => {
        if (state.verificationState === "searching" && elements.searchingStepText) {
          elements.searchingStepText.textContent = "Checking Certificate...";
        }
      }, 600);

      setTimeout(() => {
        if (state.verificationState === "searching" && elements.searchingStepText) {
          elements.searchingStepText.textContent = "Validating Details...";
        }
      }, 1200);
    }

    setTimeout(() => {
      const match = state.certificates.find(c => c.certificateId.toUpperCase() === trimmedId);
      if (match) {
        state.verifiedCert = match;
        setVerificationState("verified");
        triggerConfettiCelebration();
        updateAddCertButtonState();
      } else {
        state.verifiedCert = null;
        setVerificationState("invalid");
      }
    }, 1800);
  }

  function setVerificationState(stateName) {
    state.verificationState = stateName;

    elements.verificationStateIdle.classList.add("hidden");
    elements.verificationStateSearching.classList.add("hidden");
    elements.verificationStateResult.classList.add("hidden");
    elements.verificationStateInvalid.classList.add("hidden");
    elements.verificationStateEmpty.classList.add("hidden");

    if (stateName === "idle") {
      elements.verificationStateIdle.classList.remove("hidden");
    } else if (stateName === "searching") {
      elements.verificationStateSearching.classList.remove("hidden");
    } else if (stateName === "verified" && state.verifiedCert) {
      elements.resultParticipantName.textContent = state.verifiedCert.participantName;
      elements.resultEventName.textContent = state.verifiedCert.eventName;
      elements.resultEventDate.textContent = state.verifiedCert.eventDate;
      elements.resultCertId.textContent = state.verifiedCert.certificateId;
      elements.resultCategory.textContent = state.verifiedCert.issueCategory || "Certificate Verified";
      
      // Inject SVG QR code with "Scan to Verify" label
      if (elements.resultQrCodeContainer) {
        elements.resultQrCodeContainer.innerHTML = generateSvgQr(state.verifiedCert.certificateId, 72);
      }

      elements.verificationStateResult.classList.remove("hidden");
    } else if (stateName === "invalid") {
      elements.verificationStateInvalid.classList.remove("hidden");
    } else if (stateName === "empty") {
      elements.verificationStateEmpty.classList.remove("hidden");
    }
  }

  function resetVerificationFlow() {
    elements.certIdInput.value = "";
    state.verificationInput = "";
    state.verifiedCert = null;
    setVerificationState("idle");
    elements.certIdInput.focus();
  }

  function updateAddCertButtonState() {
    if (!state.verifiedCert) return;
    const isSaved = window.StorageService.isCertificateSaved(state.verifiedCert.certificateId);
    if (isSaved) {
      elements.btnAddMyCert.innerHTML = `
        <svg class="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        Saved in Passport
      `;
      elements.btnAddMyCert.classList.add("opacity-80");
    } else {
      elements.btnAddMyCert.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
        Add to My Passport
      `;
      elements.btnAddMyCert.classList.remove("opacity-80");
    }
  }

  // QR Scanner Simulation Modal
  function openQrScannerModal() {
    // Populate sample chips
    elements.qrChipContainer.innerHTML = state.certificates.map(c => `
      <button onclick="window.appSelectQrCert('${c.certificateId}')" class="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
        ${c.certificateId} (${c.participantName})
      </button>
    `).join("");

    elements.qrScannerModal.classList.remove("hidden");
  }

  function closeQrScannerModal() {
    elements.qrScannerModal.classList.add("hidden");
  }

  window.appSelectQrCert = function (certId) {
    closeQrScannerModal();
    elements.certIdInput.value = certId;
    switchTab("verify");
    performVerification(certId);
  };

  // Certificate Visual Preview Modal
  function openCertPreviewModal(cert) {
    const canvas = window.CertificateExporter.generateCanvas(cert);
    elements.certPreviewContainer.innerHTML = "";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    canvas.classList.add("rounded-lg", "shadow-xl", "border", "border-slate-200", "dark:border-slate-700");
    elements.certPreviewContainer.appendChild(canvas);

    elements.certPreviewVerifyBtn.onclick = () => {
      elements.certPreviewModal.classList.add("hidden");
      elements.certIdInput.value = cert.certificateId;
      switchTab("verify");
      performVerification(cert.certificateId);
    };

    elements.certPreviewDownloadBtn.onclick = () => {
      window.CertificateExporter.download(cert);
      showToast("Certificate downloaded successfully!");
    };

    elements.certPreviewModal.classList.remove("hidden");
  }

  // Passport Section Rendering with Stagger & Category Filtering
  function renderSavedCertificates() {
    if (!elements.savedCertificatesGrid) return;
    let saved = state.savedCertificates;

    if (state.passportCategoryFilter && state.passportCategoryFilter !== "All") {
      saved = saved.filter(c => c.eventName.toLowerCase().includes(state.passportCategoryFilter.toLowerCase()));
    }

    // Update Counter Stats
    if (elements.statCertCount) {
      elements.statCertCount.textContent = String(state.savedCertificates.length).padStart(2, '0');
    }

    if (saved.length === 0) {
      elements.savedCertificatesGrid.classList.add("hidden");
      elements.savedCertificatesEmptyState.classList.remove("hidden");
    } else {
      elements.savedCertificatesEmptyState.classList.add("hidden");
      elements.savedCertificatesGrid.classList.remove("hidden");

      elements.savedCertificatesGrid.innerHTML = saved.map((cert, idx) => `
        <div class="reveal-init stagger-delay-${(idx % 4) + 1} bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm interactive-card flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200/50 dark:border-teal-800/50">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Verified
              </span>
              <span class="font-mono text-xs text-slate-500 dark:text-slate-400">${cert.certificateId}</span>
            </div>

            <div class="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-1 font-heading">${cert.participantName}</h3>
                <p class="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">${cert.eventName}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">Issued: ${cert.eventDate}</p>
              </div>

              <!-- Interactive QR Code for Card -->
              <div onclick="window.appSelectQrCert('${cert.certificateId}')" class="flex flex-col items-center cursor-pointer group/qr p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-500 transition-colors">
                <div class="w-14 h-14 bg-white p-1 rounded-lg shadow-2xs flex items-center justify-center">
                  ${generateSvgQr(cert.certificateId, 50)}
                </div>
                <span class="text-[9px] font-bold text-slate-500 group-hover/qr:text-blue-600 mt-1 uppercase tracking-tighter">Scan to Verify</span>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <button onclick="window.appViewSavedCert('${cert.certificateId}')" class="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors">
                View
              </button>
              <button onclick="window.appVerifySavedCert('${cert.certificateId}')" class="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-600 hover:text-white text-teal-600 dark:text-teal-400 text-xs font-semibold transition-colors flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Verify
              </button>
              <button onclick="window.appDownloadSavedCert('${cert.certificateId}')" class="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 text-xs font-semibold transition-colors">
                Download
              </button>
            </div>
            
            <button onclick="window.appRemoveSavedCert('${cert.certificateId}')" title="Remove Certificate" class="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      `).join("");

      setTimeout(initScrollReveal, 50);
    }
  }

  function updateSavedCountBadge() {
    if (elements.savedCertCountBadge) {
      elements.savedCertCountBadge.textContent = state.savedCertificates.length;
    }
  }

  window.appViewSavedCert = function (certId) {
    const cert = state.savedCertificates.find(c => c.certificateId === certId);
    if (cert) openCertPreviewModal(cert);
  };

  window.appVerifySavedCert = function (certId) {
    elements.certIdInput.value = certId;
    switchTab("verify");
    performVerification(certId);
  };

  window.appDownloadSavedCert = function (certId) {
    const cert = state.savedCertificates.find(c => c.certificateId === certId);
    if (cert) {
      window.CertificateExporter.download(cert);
      showToast("Certificate downloaded successfully!");
    }
  };

  window.appRemoveSavedCert = function (certId) {
    state.savedCertificates = window.StorageService.removeCertificate(certId);
    renderSavedCertificates();
    updateSavedCountBadge();
    showToast("Certificate removed from list.");
  };

  // Celebration Confetti Effect (1.5s professional burst)
  function triggerConfettiCelebration() {
    if (typeof confetti === "function") {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]
      });
    }
  }

  // Toast Notification
  function showToast(msg) {
    if (!elements.toast) return;
    elements.toastMessage.textContent = msg;
    elements.toast.classList.remove("hidden", "opacity-0", "translate-y-4");
    elements.toast.classList.add("opacity-100", "translate-y-0");

    setTimeout(() => {
      elements.toast.classList.remove("opacity-100", "translate-y-0");
      elements.toast.classList.add("opacity-0", "translate-y-4");
      setTimeout(() => elements.toast.classList.add("hidden"), 300);
    }, 3000);
  }

  // Expose global methods for tab switching CTA buttons
  window.switchTab = switchTab;
  window.performVerification = performVerification;
})();
