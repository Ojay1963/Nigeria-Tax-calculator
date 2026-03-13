document.addEventListener('DOMContentLoaded', () => {
  // ===== Hamburger Menu (existing functionality) =====
  const hamburger = document.getElementById('hamburger');
  const siteNav = document.getElementById('site-nav');

  if (hamburger && siteNav) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      siteNav.classList.toggle('open');
      if (siteNav.style.display === 'block') {
        siteNav.style.display = '';
      } else {
        siteNav.style.display = 'block';
      }
    });
  }

  // ===== Smooth Scroll (existing) =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      e.preventDefault();
      const id = this.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // ===== NEW: Tax Calculator for "New Law" =====
  const inputs = [
    'gross-income',
    'annual-rent',
    'nhf',
    'nhis',
    'pension',
    'housing-loan-interest',
    'life-insurance'
  ];

  const elements = {};
  inputs.forEach(id => {
    elements[id] = document.getElementById(id);
    if (elements[id]) {
      elements[id].addEventListener('input', calculateNewLawTax);
    }
  });

  // Output fields
  const taxableIncomeEl = document.getElementById('taxable-income');
  const totalTaxEl = document.getElementById('total-tax');
  const monthlyPayeEl = document.getElementById('monthly-paye');
  const effectiveRateEl = document.getElementById('effective-tax-rate');

  function calculateNewLawTax() {
    // Get values (default to 0 if empty or invalid)
    const gross = parseFloat(elements['gross-income']?.value) || 0;
    const rent = parseFloat(elements['annual-rent']?.value) || 0;
    const nhf = parseFloat(elements['nhf']?.value) || 0;
    const nhis = parseFloat(elements['nhis']?.value) || 0;
    const pension = parseFloat(elements['pension']?.value) || 0;
    const loanInterest = parseFloat(elements['housing-loan-interest']?.value) || 0;
    const insurance = parseFloat(elements['life-insurance']?.value) || 0;

    // Total deductions
    const totalDeductions = rent + nhf + nhis + pension + loanInterest + insurance;

    // Taxable income = gross - deductions (but not below 0)
    const taxableIncome = Math.max(0, gross - totalDeductions);

    // Apply New Law tax brackets
    let tax = 0;
    let remaining = taxableIncome;

    // First ₦800,000 @ 0%
    if (remaining <= 800000) {
      tax = 0;
    } else {
      remaining -= 800000;

      // Next ₦2,200,000 @ 15%
      const slab1 = Math.min(remaining, 2200000);
      tax += slab1 * 0.15;
      remaining -= slab1;

      if (remaining > 0) {
        // Next ₦9,000,000 @ 18%
        const slab2 = Math.min(remaining, 9000000);
        tax += slab2 * 0.18;
        remaining -= slab2;
      }

      if (remaining > 0) {
        // Next ₦13,000,000 @ 21%
        const slab3 = Math.min(remaining, 13000000);
        tax += slab3 * 0.21;
        remaining -= slab3;
      }

      if (remaining > 0) {
        // Next ₦25,000,000 @ 23%
        const slab4 = Math.min(remaining, 25000000);
        tax += slab4 * 0.23;
        remaining -= slab4;
      }

      if (remaining > 0) {
        // Above ₦50,000,000 @ 25%
        tax += remaining * 0.25;
      }
    }

    // Update UI
    taxableIncomeEl.textContent = formatNaira(taxableIncome);
    totalTaxEl.textContent = formatNaira(tax);
    monthlyPayeEl.textContent = formatNaira(tax / 12);
    const effectiveRate = gross > 0 ? ((tax / gross) * 100).toFixed(2) : 0;
    effectiveRateEl.textContent = `${effectiveRate}%`;
  }

  function formatNaira(amount) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Trigger initial calculation if inputs exist
  if (elements['gross-income']) {
    calculateNewLawTax();
  }
});