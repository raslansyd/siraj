/**
 * SIRAJUDDEEN MOHAMMED - WEB PORTAL JAVASCRIPT
 * Interactive controls, GRN simulator, Workflow visualizer, vCard exporter, and Theme engine.
 */

// ==========================================
// 1. Workflow Data & Controller
// ==========================================
const workflowSteps = [
  {
    step: 1,
    badge: "Step 1 of 5 • Dock Inward Control",
    heading: "Gate Receiving & 3-Way PO Cross-Check",
    text: "When supplier delivery vehicles arrive at the hypermarket receiving docks, Siraj cross-examines the driver's Delivery Note against the authorized Purchase Order (PO) in the ERP. Only pre-authorized items and confirmed delivery dates are admitted to the receiving staging zone.",
    controls: "Check PO validity, verify supplier commercial license, inspect vehicle seal, and log arrival timestamp.",
    tools: "SAP B1 / S/4 HANA PO Module, Inward Receiving Manifest, Mobile Dock Scanners.",
    impact: "Eliminates unauthorized shipments, wrong vendor consignments, and over-delivery liability before unloading."
  },
  {
    step: 2,
    badge: "Step 2 of 5 • Physical Quality & Barcoding",
    heading: "Physical Quality Inspection & Barcode Verification",
    text: "Every carton and pallet is physically inspected for packaging integrity, correct SKU identifiers, and shelf-life expiration dates. Using designated barcode software and handheld scanners, barcodes are scanned to confirm POS readability and price tag compliance.",
    controls: "Visual carton integrity check, batch/lot expiration review, barcode scan readability test, temperature check for perishables.",
    tools: "Thermal Barcode Printers, Zebra Handheld Terminals, POS Barcode Testing Utility.",
    impact: "Prevents defective, un-scannable, or expired products from entering store shelves, protecting retail margin and customer trust."
  },
  {
    step: 3,
    badge: "Step 3 of 5 • SAP System Entry",
    heading: "GRN Generation & System Booking in SAP ERP",
    text: "Siraj generates the official Goods Receipt Note (GRN) in SAP (S/4 HANA / B1). The exact physically verified quantities are entered against the purchase order lines. Any short-shipped quantities or rejected units are immediately segregated and flagged in the system.",
    controls: "Strict quantity validation, line-by-line item matching, unit cost verification, system batch code assignment.",
    tools: "SAP Business One Inventory Module, SAP S/4 HANA MIGO / MB01, Mycom Retail ERP.",
    impact: "Increases book stock accurately and real-time across aisles, preventing phantom inventory and enabling precise re-order points."
  },
  {
    step: 4,
    badge: "Step 4 of 5 • Financial Posting",
    heading: "General Ledger Posting & Accounts Payable Handoff",
    text: "Following GRN generation, the transaction is posted to the General Ledger. The accounting entry debits Inventory Asset Account and credits Goods Received Not Invoiced (GRNI) / AP Clearing Account. Supplier invoices are matched with the GRN for finance sign-off.",
    controls: "GL account code verification, debit/credit ledger validation, 3-way invoice matching (PO - GRN - Invoice).",
    tools: "SAP Finance & Controlling (FICO) Modules, General Ledger, Accounts Payable Sub-ledger.",
    impact: "Ensures flawless fiscal accounting, prevents duplicate vendor payments, and maintains immaculate audit trails for external auditors."
  },
  {
    step: 5,
    badge: "Step 5 of 5 • Warehousing & FIFO",
    heading: "Discrepancy Reporting, Audit Trail & FIFO Staging",
    text: "Approved goods are transferred to hypermarket storage racking following strict FIFO (First-In, First-Out) protocols. Detailed discrepancy and damage reports are compiled and escalated to suppliers for formal credit notes / debit claims, completing the audit cycle.",
    controls: "FIFO color-coding and shelf placement, vendor claim voucher generation, monthly cycle count cross-check.",
    tools: "Discrepancy Reporting System, MS Excel Reconciliation Trackers, FIFO Staging Racks.",
    impact: "Maximizes stock turnover, reduces shrinkage and write-offs to near zero, and keeps retail operations running at peak efficiency."
  }
];

let currentWfStep = 1;

function selectWorkflowStep(stepNum) {
  currentWfStep = stepNum;
  updateWorkflowUI();
}

function nextWorkflowStep() {
  if (currentWfStep < workflowSteps.length) {
    currentWfStep++;
  } else {
    currentWfStep = 1; // loop back
  }
  updateWorkflowUI();
}

function prevWorkflowStep() {
  if (currentWfStep > 1) {
    currentWfStep--;
  } else {
    currentWfStep = workflowSteps.length;
  }
  updateWorkflowUI();
}

function updateWorkflowUI() {
  const data = workflowSteps[currentWfStep - 1];

  // Update tabs
  const stepTabs = document.querySelectorAll(".workflow-step");
  stepTabs.forEach((tab, index) => {
    if (index + 1 === currentWfStep) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  // Update content
  document.getElementById("wfBadge").textContent = data.badge;
  document.getElementById("wfHeading").textContent = data.heading;
  document.getElementById("wfText").textContent = data.text;
  document.getElementById("wfControls").textContent = data.controls;
  document.getElementById("wfTools").textContent = data.tools;
  document.getElementById("wfImpact").textContent = data.impact;
  document.getElementById("stepCounterText").textContent = `Step ${currentWfStep} / ${workflowSteps.length}`;
}

// ==========================================
// 2. Interactive Reconciliation Simulator
// ==========================================
function runReconciliation() {
  const poQty = parseFloat(document.getElementById("simPoQty").value) || 0;
  const rcvQty = parseFloat(document.getElementById("simRcvQty").value) || 0;
  const invQty = parseFloat(document.getElementById("simInvQty").value) || 0;
  const unitPrice = parseFloat(document.getElementById("simUnitPrice").value) || 0;
  const damagedQty = parseFloat(document.getElementById("simDamagedQty").value) || 0;

  // Calculations
  const netAccepted = Math.max(0, rcvQty - damagedQty);
  const varianceQty = netAccepted - invQty; // negative means invoice is higher than accepted
  const approvedGrnVal = netAccepted * unitPrice;
  const invoicedVal = invQty * unitPrice;
  const debitClaimVal = Math.max(0, invoicedVal - approvedGrnVal);

  // Update metric figures
  document.getElementById("resAcceptedQty").textContent = `${netAccepted} Units`;
  document.getElementById("resVarianceQty").textContent = `${varianceQty > 0 ? "+" : ""}${varianceQty} Units`;
  document.getElementById("resGrnValue").textContent = `QAR ${approvedGrnVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.getElementById("resClaimValue").textContent = `QAR ${debitClaimVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Status Banner & Action text
  const banner = document.getElementById("simStatusBanner");
  const icon = document.getElementById("simStatusIcon");
  const title = document.getElementById("simStatusTitle");
  const subtitle = document.getElementById("simStatusSubtitle");
  const actionText = document.getElementById("resActionText");

  if (varianceQty === 0 && damagedQty === 0) {
    banner.style.backgroundColor = "var(--color-success-bg)";
    banner.style.borderColor = "var(--color-success)";
    icon.className = "fa-solid fa-circle-check";
    icon.style.color = "var(--color-success)";
    title.textContent = "100% Clean Match Verified";
    subtitle.textContent = "Physical stock, PO quantity, and Supplier Invoice are in exact alignment.";
    actionText.innerHTML = `Post GRN for full <strong>${netAccepted} units</strong> directly to General Ledger. Approve supplier invoice for 100% payment clearance. Zero vendor debit claim required.`;
  } else if (varianceQty < 0 && damagedQty === 0) {
    banner.style.backgroundColor = "var(--color-danger-bg)";
    banner.style.borderColor = "var(--color-primary)";
    icon.className = "fa-solid fa-triangle-exclamation";
    icon.style.color = "var(--color-primary)";
    title.textContent = "Supplier Shortage Detected";
    subtitle.textContent = `Supplier invoiced ${invQty} units, but dock received only ${rcvQty} units (Shortage: ${Math.abs(varianceQty)} units).`;
    actionText.innerHTML = `Book GRN strictly for <strong>${netAccepted} physical units</strong>. Issue formal Debit Note / Shortage Claim for <strong>QAR ${debitClaimVal.toFixed(2)}</strong> (${Math.abs(varianceQty)} units @ QAR ${unitPrice.toFixed(2)}). Notify supplier representative and dispatch revised invoice batch to Accounts Payable.`;
  } else if (damagedQty > 0) {
    banner.style.backgroundColor = "var(--color-primary-soft)";
    banner.style.borderColor = "var(--color-primary)";
    icon.className = "fa-solid fa-box-tissue";
    icon.style.color = "var(--color-primary)";
    title.textContent = "Damaged Goods Segregated & Flagged";
    subtitle.textContent = `${damagedQty} units failed physical quality inspection and cannot be stocked.`;
    actionText.innerHTML = `Immediately quarantine ${damagedQty} damaged units in the dock returns zone. Book GRN for accepted <strong>${netAccepted} units</strong>. Generate formal Supplier Return Voucher and Debit Claim of <strong>QAR ${debitClaimVal.toFixed(2)}</strong> before Accounts Payable clearing.`;
  } else {
    // Over-delivery
    banner.style.backgroundColor = "var(--color-primary-soft)";
    banner.style.borderColor = "var(--color-gold)";
    icon.className = "fa-solid fa-circle-exclamation";
    icon.style.color = "var(--color-gold)";
    title.textContent = "Over-Delivery / Excess Consignment";
    subtitle.textContent = `Received quantity exceeds invoiced quantity by ${varianceQty} units.`;
    actionText.innerHTML = `Verify if excess ${varianceQty} units are promotional samples or delivery error. Obtain retail category manager authorization before generating GRN or returning excess inventory to supplier driver.`;
  }
}

function loadSimPreset(type) {
  if (type === 'clean') {
    document.getElementById("simPoQty").value = 500;
    document.getElementById("simRcvQty").value = 500;
    document.getElementById("simInvQty").value = 500;
    document.getElementById("simDamagedQty").value = 0;
    document.getElementById("simUnitPrice").value = 25.00;
  } else if (type === 'shortage') {
    document.getElementById("simPoQty").value = 600;
    document.getElementById("simRcvQty").value = 550;
    document.getElementById("simInvQty").value = 600;
    document.getElementById("simDamagedQty").value = 0;
    document.getElementById("simUnitPrice").value = 32.00;
  } else if (type === 'damage') {
    document.getElementById("simPoQty").value = 400;
    document.getElementById("simRcvQty").value = 400;
    document.getElementById("simInvQty").value = 400;
    document.getElementById("simDamagedQty").value = 18;
    document.getElementById("simUnitPrice").value = 19.50;
  } else if (type === 'over') {
    document.getElementById("simPoQty").value = 300;
    document.getElementById("simRcvQty").value = 330;
    document.getElementById("simInvQty").value = 300;
    document.getElementById("simDamagedQty").value = 0;
    document.getElementById("simUnitPrice").value = 45.00;
  }
  runReconciliation();
}

// ==========================================
// 3. Skills Filtering Logic
// ==========================================
function initSkillsFilter() {
  const tabs = document.querySelectorAll(".skill-tab");
  const cards = document.querySelectorAll(".skill-card");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.getAttribute("data-filter");

      cards.forEach(card => {
        if (filter === "all") {
          card.style.display = "flex";
        } else {
          const categories = card.getAttribute("data-category") || "";
          if (categories.includes(filter)) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        }
      });
    });
  });
}

// ==========================================
// 4. vCard (.vcf) Generator (No mobile number)
// ==========================================
function downloadVCard() {
  const vcardData = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:Sirajuddeen Mohammed",
    "N:Mohammed;Sirajuddeen;;;",
    "TITLE:Inventory and Accountant Associate / GRN Specialist",
    "EMAIL;TYPE=WORK,INTERNET:msirajudeen02@gmail.com",
    "URL:https://linkedin.com/in/mohammed-sirajuddeen-549371244/",
    "ADR;TYPE=HOME:;;Doha;Qatar;;;",
    "NOTE:Immediate Joiner in Doha, Qatar. Experienced with SAP S4 HANA, SAP B1, GRN Processing, Stock Reconciliation, Dana & Nesto Hypermarkets. B.Sc Computer Science.",
    "END:VCARD"
  ].join("\r\n");

  const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "Sirajuddeen_Mohammed_Contact.vcf";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);

  showToast("Professional vCard exported! Email and credentials saved to contacts.");
}

// ==========================================
// 5. Contact Modal & Inquiry Form
// ==========================================
function openContactModal() {
  const modal = document.getElementById("contactModal");
  if (modal) {
    modal.classList.add("show");
  }
}

function closeContactModal() {
  const modal = document.getElementById("contactModal");
  if (modal) {
    modal.classList.remove("show");
  }
}

// Close modal when clicking outside dialog
window.addEventListener("click", (e) => {
  const modal = document.getElementById("contactModal");
  if (e.target === modal) {
    closeContactModal();
  }
});

function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("cName").value;
  const email = document.getElementById("cEmail").value;
  const company = document.getElementById("cCompany").value;
  const role = document.getElementById("cRole").value;
  const msg = document.getElementById("cMessage").value;

  const subject = encodeURIComponent(`Interview Inquiry: ${role} - ${name}`);
  const body = encodeURIComponent(
    `Hello Sirajuddeen,\n\n` +
    `My name is ${name} from ${email}.\n` +
    `Company/Location: ${company || 'Not specified'}\n` +
    `Position Open: ${role}\n\n` +
    `Message:\n${msg}\n\n` +
    `Looking forward to speaking with you.`
  );

  const mailtoUrl = `mailto:msirajudeen02@gmail.com?subject=${subject}&body=${body}`;

  // Launch email client
  window.location.href = mailtoUrl;

  closeContactModal();
  showToast("Inquiry prepared! Your default email client has opened to dispatch the message.");
}

// ==========================================
// 6. Toast Notification Helper
// ==========================================
function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fa-solid fa-bell" style="color: var(--color-gold); margin-right: 8px;"></i> ${message}`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.4s ease";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  }, 4500);
}

// ==========================================
// 7. Theme Engine (Royal Navy, Emerald, Slate, Maroon, Dark)
// ==========================================
function changeTheme(themeName) {
  if (themeName === "navy") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", themeName);
  }
  localStorage.setItem("sm_portal_theme", themeName);

  const themeSelect = document.getElementById("themeSelect");
  if (themeSelect && themeSelect.value !== themeName) {
    themeSelect.value = themeName;
  }

  const themeLabels = {
    navy: "Royal Navy & Gold",
    emerald: "Emerald Forest",
    slate: "Executive Charcoal",
    maroon: "Lite Maroon Classic",
    dark: "Midnight Dark"
  };

  showToast(`Switched palette to ${themeLabels[themeName] || themeName}`);
}

function initThemeEngine() {
  const savedTheme = localStorage.getItem("sm_portal_theme") || "navy";
  const themeSelect = document.getElementById("themeSelect");

  if (savedTheme === "navy") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }

  if (themeSelect) {
    themeSelect.value = savedTheme;
  }
}

// ==========================================
// 8. Mobile Navigation & Active Scroll Spy
// ==========================================
function initNavigation() {
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });

    // Close mobile nav on link click
    const links = navLinks.querySelectorAll("a");
    links.forEach(l => {
      l.addEventListener("click", () => {
        navLinks.classList.remove("show");
      });
    });
  }

  // Active scroll highlight
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");

      const navItem = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        if (navItem) navItem.classList.add("active");
      } else {
        if (navItem) navItem.classList.remove("active");
      }
    });
  });
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initThemeEngine();
  initSkillsFilter();
  initNavigation();
  runReconciliation(); // initial simulator computation
  updateWorkflowUI();  // initial workflow step render
});
