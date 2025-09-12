(function () {
    emailjs.init("VA4S-2IG-U5CczdSV");
})();


// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
const icon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
});

function updateIcon(theme) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Hamburger menu functionality
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        emailjs.sendForm('service_dju56d4', 'template_a7eojha', this).then(() => {
            Swal.fire({
                icon: "success",
                text: "Thank you for your message! I will get back to you soon.",
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true
            })
        })

        this.reset();
    });
}

// Add scroll-based animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Scroll arrow functionality
const scrollArrow = document.getElementById('scroll-arrow');
if (scrollArrow) {
    scrollArrow.addEventListener('click', () => {
        const nextSection = document.getElementById('our-services');
        if (nextSection) {
            nextSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Hide scroll arrow when user scrolls down
window.addEventListener('scroll', () => {
    if (scrollArrow) {
        const heroSection = document.querySelector('.hero');
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.pageYOffset + window.innerHeight;
        
        if (scrollPosition > heroBottom) {
            scrollArrow.style.opacity = '0';
            scrollArrow.style.pointerEvents = 'none';
        } else {
            scrollArrow.style.opacity = '1';
            scrollArrow.style.pointerEvents = 'auto';
        }
    }
});

// Share Modal Functionality
const shareButton = document.getElementById('share-button');
const shareModal = document.getElementById('share-modal');
const modalClose = document.getElementById('modal-close');
const copyButton = document.getElementById('copy-button');
const shareLink = document.getElementById('share-link');
const copyFeedback = document.getElementById('copy-feedback');
const qrCodeContainer = document.getElementById('qr-code');

// Open modal when share button is clicked
if (shareButton) {
    shareButton.addEventListener('click', () => {
        // Update the share link input with the current page URL
        const currentPage = window.location.pathname;
        const url = currentPage.includes('services.html') ? 'https://nicfosland.com/services.html' : 'https://nicfosland.com';
        shareLink.value = url;
        
        shareModal.classList.add('show');
        generateQRCode();
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
}

// Close modal when close button is clicked
if (modalClose) {
    modalClose.addEventListener('click', () => {
        closeModal();
    });
}

// Close modal when clicking outside of it
if (shareModal) {
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            closeModal();
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && shareModal.classList.contains('show')) {
        closeModal();
    }
});

// Copy link functionality
if (copyButton) {
    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(shareLink.value);
            showCopyFeedback('Link copied to clipboard!');
        } catch (err) {
            // Fallback for older browsers
            shareLink.select();
            document.execCommand('copy');
            showCopyFeedback('Link copied to clipboard!');
        }
    });
}

// Generate QR Code
function generateQRCode() {
    // Determine the URL based on the current page
    const currentPage = window.location.pathname;
    const url = currentPage.includes('services.html') ? 'https://nicfosland.com/services.html' : 'https://nicfosland.com';
    
    // Clear previous QR code
    qrCodeContainer.innerHTML = '';
    
    // Check if QRCode library is available
    if (typeof QRCode === 'undefined') {
        console.error('QRCode library not loaded, using fallback');
        generateQRCodeFallback(url);
        return;
    }
    
    // Generate new QR code using the library
    QRCode.toCanvas(qrCodeContainer, url, {
        width: 180,
        height: 180,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        },
        margin: 2,
        errorCorrectionLevel: 'M'
    }, function (error) {
        if (error) {
            console.error('QR Code generation error:', error);
            generateQRCodeFallback(url);
        } else {
            console.log('QR Code generated successfully');
            // Add margin around the generated QR code
            const canvas = qrCodeContainer.querySelector('canvas');
            if (canvas) {
                canvas.style.margin = '10px';
                canvas.style.maxWidth = '100%';
                canvas.style.height = 'auto';
            }
        }
    });
}

// Fallback QR code generation using API
function generateQRCodeFallback(url) {
    const encodedUrl = encodeURIComponent(url);
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}`;
    
    const img = document.createElement('img');
    img.src = qrApiUrl;
    img.alt = 'QR Code';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.borderRadius = '8px';
    img.style.margin = '10px';
    img.style.display = 'block';
    
    img.onload = function() {
        console.log('Fallback QR Code loaded successfully');
    };
    
    img.onerror = function() {
        qrCodeContainer.innerHTML = '<p style="color: red; text-align: center; padding: 2rem;">Unable to generate QR code. Please try again later.</p>';
    };
    
    qrCodeContainer.appendChild(img);
}

// Show copy feedback
function showCopyFeedback(message) {
    copyFeedback.textContent = message;
    copyFeedback.classList.add('show');
    
    setTimeout(() => {
        copyFeedback.classList.remove('show');
    }, 2000);
}

// Close modal function
function closeModal() {
    shareModal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restore background scrolling
} 