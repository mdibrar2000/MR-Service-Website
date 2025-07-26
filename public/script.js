// Global variables
let currentModal = null;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Set minimum date to today for date inputs
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        dateInput.setAttribute('min', today);
    }
    
    // Initialize fade-in animations
    observeElements();
    
    // Initialize header scroll effect
    initializeHeaderScroll();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Close modals on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentModal) {
            closeModal(currentModal);
        }
    });
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    };
}

// Mobile menu toggle
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Modal functions
function openModal(modalId, productName = '') {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    currentModal = modalId;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Set product name for order modal
    if (productName && modalId === 'orderModal') {
        const productNameInput = document.getElementById('productName');
        if (productNameInput) {
            productNameInput.value = productName;
        }
    }
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = modal.querySelector('input:not([readonly]), select, textarea');
        if (firstInput) {
            firstInput.focus();
        }
    }, 300);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentModal = null;
    
    // Reset forms when closing
    const form = modal.querySelector('form');
    if (form) {
        form.reset();
    }
}

// Form submissions
function submitBooking(event) {
    event.preventDefault();
    
    if (!validateBookingForm(event.target)) {
        return;
    }
    
    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Log data for development (replace with actual API call)
    console.log('Booking Data:', data);
    
    // Simulate API call
    simulateAPICall(() => {
        closeModal('bookingModal');
        showSuccessMessage(
            `Your service booking has been submitted successfully! We'll contact you at ${data.phone} within 2 hours to confirm your appointment for ${data.serviceType}.`,
            'Booking Confirmed!'
        );
        
        // Send WhatsApp message (optional)
        const message = `New Service Booking:
Name: ${data.customerName}
Phone: ${data.phone}
Service: ${data.serviceType}
Date: ${data.preferredDate}
Time: ${data.preferredTime}
Address: ${data.address}`;
        
        // Reset form
        event.target.reset();
    });
}

function submitOrder(event) {
    event.preventDefault();
    
    if (!validateOrderForm(event.target)) {
        return;
    }
    
    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Log data for development (replace with actual API call)
    console.log('Order Data:', data);
    
    // Simulate API call
    simulateAPICall(() => {
        closeModal('orderModal');
        showSuccessMessage(
            `Your order for ${data.productName} has been placed successfully! Our sales team will contact you at ${data.buyerPhone} within 4 hours with product options and pricing.`,
            'Order Placed!'
        );
        
        // Reset form
        event.target.reset();
    });
}

// Form validation
function validateBookingForm(form) {
    const requiredFields = ['customerName', 'phone', 'address', 'serviceType', 'preferredDate', 'preferredTime'];
    let isValid = true;
    
    requiredFields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field || !field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Validate phone number
    const phoneField = form.querySelector('[name="phone"]');
    if (phoneField && phoneField.value) {
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(phoneField.value.trim())) {
            showFieldError(phoneField, 'Please enter a valid 10-digit phone number');
            isValid = false;
        }
    }
    
    // Validate email if provided
    const emailField = form.querySelector('[name="email"]');
    if (emailField && emailField.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value.trim())) {
            showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateOrderForm(form) {
    const requiredFields = ['productName', 'buyerName', 'buyerPhone', 'deliveryAddress'];
    let isValid = true;
    
    requiredFields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field || !field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Validate phone number
    const phoneField = form.querySelector('[name="buyerPhone"]');
    if (phoneField && phoneField.value) {
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(phoneField.value.trim())) {
            showFieldError(phoneField, 'Please enter a valid 10-digit phone number');
            isValid = false;
        }
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.style.borderColor = '#dc3545';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#e1e8ed';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showSuccessMessage(message, title = 'Success!') {
    const successModal = document.getElementById('successModal');
    const successMessage = document.getElementById('successMessage');
    const successTitle = successModal.querySelector('h2');
    
    if (successMessage) successMessage.textContent = message;
    if (successTitle) successTitle.textContent = title;
    
    openModal('successModal');
}

function simulateAPICall(callback) {
    // Show loading state
    const submitButtons = document.querySelectorAll('form button[type="submit"]');
    submitButtons.forEach(btn => {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    });
    
    // Simulate API delay
    setTimeout(() => {
        submitButtons.forEach(btn => {
            btn.disabled = false;
            btn.innerHTML = btn.innerHTML.includes('Book') ? 
                '<i class="fas fa-calendar-check"></i> Book Service' : 
                '<i class="fas fa-shopping-cart"></i> Place Order';
        });
        callback();
    }, 1500);
}

// WhatsApp integration
function openWhatsApp() {
    const phoneNumber = "916204816314";
    const message = "Hello! I'm interested in your appliance services. Please provide more information.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Google Maps integration
function openMap() {
    const address = "Newalal Chowk, Purnia, Bihar, India";
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navMenu = document.querySelector('.nav-menu');
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                    }
                }
            }
        });
    });
}

// Header scroll effect
function initializeHeaderScroll() {
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateHeader() {
        const header = document.querySelector('header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(102, 126, 234, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = 'none';
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
}

// Intersection Observer for fade-in animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimizations
function prefetchImages() {
    // Preload critical images
    const criticalImages = [
        // Add any critical image URLs here
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Analytics and tracking (placeholder)
function trackEvent(eventName, eventData) {
    // Replace with actual analytics implementation
    console.log('Event tracked:', eventName, eventData);
    
    // Example: Google Analytics
    // gtag('event', eventName, eventData);
    
    // Example: Facebook Pixel
    // fbq('track', eventName, eventData);
}

// Call tracking functions for important events
function trackBookingAttempt() {
    trackEvent('booking_attempted', {
        source: 'website',
        timestamp: new Date().toISOString()
    });
}

function trackOrderAttempt() {
    trackEvent('order_attempted', {
        source: 'website',
        timestamp: new Date().toISOString()
    });
}

// Add event listeners for tracking
document.addEventListener('DOMContentLoaded', function() {
    // Track booking modal opens
    const bookingTriggers = document.querySelectorAll('[onclick*="bookingModal"]');
    bookingTriggers.forEach(trigger => {
        trigger.addEventListener('click', trackBookingAttempt);
    });
    
    // Track order modal opens
    const orderTriggers = document.querySelectorAll('[onclick*="orderModal"]');
    orderTriggers.forEach(trigger => {
        trigger.addEventListener('click', trackOrderAttempt);
    });
    
    // Track WhatsApp clicks
    const whatsappTriggers = document.querySelectorAll('[onclick*="openWhatsApp"]');
    whatsappTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            trackEvent('whatsapp_clicked', {
                source: 'website'
            });
        });
    });
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can send error reports to your logging service here
});

// Initialize tooltips and other UI enhancements
function initializeUIEnhancements() {
    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit') {
                return; // Handle in form submission
            }
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Call UI enhancements on load
document.addEventListener('DOMContentLoaded', initializeUIEnhancements);


document.addEventListener('DOMContentLoaded', function() {
    const saleProductImages = document.querySelectorAll('[id^="saleProductImage"]');
    
    saleProductImages.forEach(saleProductImage => {
        const saleImageContainer = saleProductImage.querySelector('.sale-image-container');
        let isShowingPhoto = false;

        function toggleImage() {
            saleProductImage.classList.add('sale-shimmer');
            
            setTimeout(() => {
                if (isShowingPhoto) {
                    saleImageContainer.classList.remove('sale-show-photo');
                } else {
                    saleImageContainer.classList.add('sale-show-photo');
                }
                isShowingPhoto = !isShowingPhoto;
            }, 200);

            setTimeout(() => {
                saleProductImage.classList.remove('sale-shimmer');
            }, 1000);
        }

        setInterval(toggleImage, 3000);
    });
});