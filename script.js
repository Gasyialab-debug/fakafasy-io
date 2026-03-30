// ═══════════════════════════════════════════════════════════════════════════
// FAKAFASY IO - Website JavaScript
// Made with ❤️ by GASY IA LAB - Nosy Be, Madagascar
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

const burger = document.getElementById('burger')
const navLinks = document.getElementById('navLinks')
const navbar = document.getElementById('navbar')

// Toggle mobile menu
burger?.addEventListener('click', () => {
  burger.classList.toggle('active')
  navLinks.classList.toggle('active')
})

// Close menu on link click
navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    burger?.classList.remove('active')
    navLinks.classList.remove('active')
  })
})

// Navbar scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled')
  } else {
    navbar?.classList.remove('scrolled')
  }
})

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute('href'))
    if (target) {
      const offsetTop = target.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// FEATURES TABS
// ═══════════════════════════════════════════════════════════════════════════

const tabBtns = document.querySelectorAll('.tab-btn')
const tabContents = document.querySelectorAll('.tab-content')

tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab

    // Remove active from all
    tabBtns.forEach((b) => b.classList.remove('active'))
    tabContents.forEach((c) => c.classList.remove('active'))

    // Add active to current
    btn.classList.add('active')
    document.querySelector(`[data-content="${tab}"]`)?.classList.add('active')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// PRICING
// ═══════════════════════════════════════════════════════════════════════════

const billingBtns = document.querySelectorAll('.toggle-btn')
const currencyBtns = document.querySelectorAll('.currency-btn')

let currentBilling = 'monthly'
let currentCurrency = 'mga'

// Exchange rates
const exchangeRates = {
  mga: 1,
  eur: 4100,
  usd: 3700
}

// Billing toggle
billingBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    billingBtns.forEach((b) => b.classList.remove('active'))
    btn.classList.add('active')
    currentBilling = btn.dataset.billing
    updatePrices()
  })
})

// Currency toggle
currencyBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    currencyBtns.forEach((b) => b.classList.remove('active'))
    btn.classList.add('active')
    currentCurrency = btn.dataset.currency
    updatePrices()
  })
})

function updatePrices() {
  const priceValues = document.querySelectorAll('.price-value')

  priceValues.forEach((el) => {
    let baseMga
    if (currentBilling === 'monthly') {
      baseMga = parseInt(el.dataset.monthlyMga) || 0
    } else {
      baseMga = parseInt(el.dataset.yearlyMga) || 0
    }

    let displayPrice
    let currencySymbol

    if (currentCurrency === 'mga') {
      displayPrice = formatNumber(baseMga)
      currencySymbol = 'Ar'
    } else if (currentCurrency === 'eur') {
      displayPrice = Math.round(baseMga / exchangeRates.eur)
      currencySymbol = '€'
    } else {
      displayPrice = Math.round(baseMga / exchangeRates.usd)
      currencySymbol = '$'
    }

    el.textContent = displayPrice

    // Update currency symbol
    const currencyEl = el.nextElementSibling
    if (currencyEl && currencyEl.classList.contains('price-currency')) {
      currencyEl.textContent = currencySymbol
    }
  })

  // Update period text
  const periodEls = document.querySelectorAll('.price-period')
  periodEls.forEach((el) => {
    if (!el.textContent.includes('une fois') && !el.textContent.includes('jours')) {
      el.textContent = currentBilling === 'monthly' ? '/mois' : '/an'
    }
  })
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

// ═══════════════════════════════════════════════════════════════════════════
// PAYMENT FLOW
// ═══════════════════════════════════════════════════════════════════════════

let selectedLocation = null
let selectedOperator = null
let selectedPlan = 'Pro'
let basePrice = 45000
let operatorFee = 0.05

// Location selection
const locationCards = document.querySelectorAll('.location-card')
locationCards.forEach((card) => {
  card.addEventListener('click', () => {
    const location = card.dataset.location
    selectedLocation = location

    // Remove selected from all
    locationCards.forEach((c) => c.classList.remove('selected'))
    card.classList.add('selected')

    // Hide all steps
    document.querySelectorAll('.payment-step').forEach((s) => s.classList.remove('active'))

    // Show appropriate step
    if (location === 'madagascar') {
      document.getElementById('step-madagascar')?.classList.add('active')
    } else {
      document.getElementById('step-international')?.classList.add('active')
    }
  })
})

// Operator selection
const operatorCards = document.querySelectorAll('.operator-card')
operatorCards.forEach((card) => {
  card.addEventListener('click', () => {
    const operator = card.dataset.operator
    selectedOperator = operator

    // Remove selected from all
    operatorCards.forEach((c) => c.classList.remove('selected'))
    card.classList.add('selected')

    // Update fee
    operatorFee = operator === 'orange' ? 0.05 : 0.04

    // Show/hide instruction lists
    document
      .getElementById('instruction-list-orange')
      ?.classList.toggle('hidden', operator !== 'orange')
    document
      .getElementById('instruction-list-mvola')
      ?.classList.toggle('hidden', operator !== 'mvola')

    // Update summary
    updatePaymentSummary()
  })
})

function updatePaymentSummary() {
  const feeAmount = Math.round(basePrice * operatorFee)
  const total = basePrice + feeAmount

  document.getElementById('selected-plan-name').textContent = selectedPlan
  document.getElementById('base-price').textContent = formatNumber(basePrice) + ' Ar'
  document.getElementById('operator-fee-percent').textContent = `(${operatorFee * 100}%)`
  document.getElementById('operator-fee').textContent = formatNumber(feeAmount) + ' Ar'
  document.getElementById('total-price').textContent = formatNumber(total) + ' Ar'

  // Update USSD amounts
  document.getElementById('ussd-amount').textContent = total
  document.getElementById('ussd-amount-mvola').textContent = total
}

// Show proof upload step
function showProofUpload() {
  document.querySelectorAll('.payment-step').forEach((s) => s.classList.remove('active'))
  document.getElementById('step-proof')?.classList.add('active')

  // Scroll to top of section
  document.getElementById('paiement')?.scrollIntoView({ behavior: 'smooth' })
}

// ═══════════════════════════════════════════════════════════════════════════
// FILE UPLOAD
// ═══════════════════════════════════════════════════════════════════════════

const uploadZone = document.getElementById('upload-zone')
const uploadPreview = document.getElementById('upload-preview')
const proofFile = document.getElementById('proof-file')

// Drag and drop
uploadZone?.addEventListener('dragover', (e) => {
  e.preventDefault()
  uploadZone.classList.add('dragover')
})

uploadZone?.addEventListener('dragleave', () => {
  uploadZone.classList.remove('dragover')
})

uploadZone?.addEventListener('drop', (e) => {
  e.preventDefault()
  uploadZone.classList.remove('dragover')

  const files = e.dataTransfer.files
  if (files.length > 0) {
    handleFile(files[0])
  }
})

// Click to upload
uploadZone?.addEventListener('click', () => {
  proofFile?.click()
})

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    handleFile(file)
  }
}

function handleFile(file) {
  // Validate file
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!validTypes.includes(file.type)) {
    alert('Format non supporté. Utilisez PNG, JPG ou PDF.')
    return
  }

  if (file.size > maxSize) {
    alert('Fichier trop volumineux. Maximum 5 MB.')
    return
  }

  // Show preview
  uploadZone?.classList.add('hidden')
  uploadPreview?.classList.remove('hidden')

  document.getElementById('file-name').textContent = file.name
  document.getElementById('file-size').textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB'

  // Show image preview if image
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      document.getElementById('preview-image').src = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function removeFile() {
  uploadZone?.classList.remove('hidden')
  uploadPreview?.classList.add('hidden')
  proofFile.value = ''
}

// ═══════════════════════════════════════════════════════════════════════════
// FORM SUBMISSIONS
// ═══════════════════════════════════════════════════════════════════════════

function submitPayment(event) {
  event.preventDefault()

  const email = document.getElementById('customer-email')?.value
  const phone = document.getElementById('customer-phone')?.value
  const transRef = document.getElementById('transaction-ref')?.value

  // Generate order reference
  const orderRef = generateOrderRef()
  document.getElementById('order-ref').textContent = orderRef

  // Show confirmation
  document.querySelectorAll('.payment-step').forEach((s) => s.classList.remove('active'))
  document.getElementById('step-confirmation')?.classList.add('active')

  // Scroll to top
  document.getElementById('paiement')?.scrollIntoView({ behavior: 'smooth' })

  // In real app: Send to backend
  console.log('Payment submitted:', { email, phone, transRef, orderRef })
}

function generateOrderRef() {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `${dateStr}-${random}`
}

function submitContactForm(event) {
  event.preventDefault()

  const formData = {
    name: document.getElementById('contact-name')?.value,
    email: document.getElementById('contact-email')?.value,
    phone: document.getElementById('contact-phone')?.value,
    subject: document.getElementById('contact-subject')?.value,
    message: document.getElementById('contact-message')?.value
  }

  // Show success message
  alert('Message envoyé ! Nous vous répondrons sous 24h.')

  // Reset form
  event.target.reset()

  // In real app: Send to backend
  console.log('Contact form submitted:', formData)
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert('Numéro copié !')
    })
    .catch((err) => {
      console.error('Erreur copie:', err)
    })
}

// ═══════════════════════════════════════════════════════════════════════════
// AI ASSISTANT
// ═══════════════════════════════════════════════════════════════════════════

const aiAssistant = document.getElementById('ai-assistant')
const aiTrigger = document.getElementById('ai-trigger')

function openAiAssistant() {
  aiAssistant?.classList.remove('hidden')
  aiTrigger?.classList.add('hidden')
}

function closeAiAssistant() {
  aiAssistant?.classList.add('hidden')
  aiTrigger?.classList.remove('hidden')
}

function aiSuggest(topic) {
  const responses = {
    tarifs:
      'Nos tarifs commencent à 25 000 Ar/mois pour le plan Basic. Le plan Pro à 45 000 Ar/mois inclut le module BTP et la gestion de stock. Nous proposons aussi une licence à vie à 820 000 Ar.',
    diaspora:
      "Vous pouvez payer depuis l'étranger via TapTapSend (sans frais) ou Sendwave. Envoyez l'argent au +261 32 02 198 89 et uploadez votre preuve de paiement.",
    essai:
      "Oui ! Vous bénéficiez de 30 jours d'essai gratuit avec toutes les fonctionnalités. Aucune carte bancaire requise."
  }

  alert(responses[topic] || "Contactez-nous pour plus d'informations.")
}

// Show AI popup after 30 seconds (optional)
// setTimeout(() => {
//   if (!aiAssistant?.classList.contains('hidden')) return;
//   openAiAssistant();
// }, 30000);

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1'
      entry.target.style.transform = 'translateY(0)'
    }
  })
}, observerOptions)

// Apply to cards
document
  .querySelectorAll('.trust-card, .pricing-card, .feature-card, .contact-card, .service-card')
  .forEach((el) => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(30px)'
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
    observer.observe(el)
  })

// ═══════════════════════════════════════════════════════════════════════════
// LOCATION DETECTION (Auto-switch payment methods)
// ═══════════════════════════════════════════════════════════════════════════

async function detectUserLocation() {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()

    if (data.country_code === 'MG') {
      console.log('User detected in Madagascar')
      // Auto-select Madagascar option
      document.querySelector('[data-location="madagascar"]')?.classList.add('highlight')
    } else {
      console.log('User detected outside Madagascar:', data.country_code)
      // Auto-select international option
      document.querySelector('[data-location="international"]')?.classList.add('highlight')
    }
  } catch (error) {
    console.log('Could not detect location:', error)
  }
}

// Uncomment to enable auto-detection
// detectUserLocation();

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  console.log('🏝️ Fakafasy IO Website loaded')
  console.log('Made with ❤️ by GASY IA LAB - Nosy Be, Madagascar')

  // Initialize payment summary
  updatePaymentSummary()
})
// ═══════════════════════════════════════════════════════════════════════════
// DOWNLOAD FUNCTIONALITY
// ═══════════════════════════════════════════════════════════════════════════

const downloadButton = document.getElementById('download-button')
const downloadModal = document.getElementById('download-modal')
const downloadProgress = document.getElementById('download-progress')

// Show download modal
downloadButton?.addEventListener('click', (e) => {
  e.preventDefault()
  downloadModal?.classList.remove('hidden')
  document.body.style.overflow = 'hidden'
})

function closeDownloadModal() {
  downloadModal?.classList.add('hidden')
  document.body.style.overflow = ''
}

function closeDownloadProgress() {
  downloadProgress?.classList.add('hidden')
  document.body.style.overflow = ''
}

function startDownload(type) {
  // Close modal
  closeDownloadModal()

  // Show progress
  downloadProgress?.classList.remove('hidden')

  // Simulate download progress
  let progress = 0
  const progressFill = document.getElementById('progress-fill')
  const progressPercent = document.getElementById('progress-percent')
  const progressSpeed = document.getElementById('progress-speed')

  const interval = setInterval(() => {
    progress += Math.random() * 10

    if (progress >= 100) {
      progress = 100
      clearInterval(interval)

      // Download completed
      setTimeout(() => {
        closeDownloadProgress()
        showDownloadComplete(type)
      }, 500)
    }

    progressFill.style.width = progress + '%'
    progressPercent.textContent = Math.round(progress)
    progressSpeed.textContent = (Math.random() * 5 + 2).toFixed(1)
  }, 200)

  // Start actual download
  initiateActualDownload(type)
}

function initiateActualDownload(type) {
  // Path to your .exe file
  const downloadPath =
    type === 'trial'
      ? '../release/FakaFasy-IO-Setup-1.0.0.exe'
      : '../release/FakaFasy-IO-Setup-1.0.0.exe'

  // Create download link
  const link = document.createElement('a')
  link.href = downloadPath
  link.download = 'FakaFasy-IO-Setup-1.0.0.exe'

  // Trigger download
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function showDownloadComplete(type) {
  const message =
    type === 'trial'
      ? "Téléchargement terminé !\n\nVous pouvez maintenant installer Fakafasy IO et profiter de 30 jours d'essai gratuit."
      : 'Téléchargement terminé !\n\nInstall​ez Fakafasy IO et procédez au paiement pour activer votre licence.'

  alert(message)

  // Redirect to installation guide or payment
  if (type === 'buy') {
    window.location.hash = '#paiement'
  }
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDownloadModal()
    closeDownloadProgress()
  }
})
