/**
 * Shivangi Beauty Parlour & Cosmetics - Interactive Scripts
 * Handles mobile nav, gallery lightbox, service filtering, language toggle & WhatsApp booking
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initDateInput();
    initScrollSpy();
    initKeyboardShortcuts();
});

// Mobile menu and sticky navbar
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Close nav links when a link is clicked on mobile
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('show');
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-xmark');
                    }
                }
            });
        });
    }

    // Sticky navbar shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Minimum date for appointment booking (today onwards)
function initDateInput() {
    const bookingDateInput = document.getElementById('bookingDate');
    if (bookingDateInput) {
        const today = new Date().toISOString().split('T')[0];
        bookingDateInput.setAttribute('min', today);
        bookingDateInput.value = today;
    }
}

// Scrollspy to highlight active nav link
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

// Filter Services by category
function filterServices(category) {
    const cards = document.querySelectorAll('.service-card');
    const buttons = document.querySelectorAll('.service-tabs .tab-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Filter Gallery items
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const buttons = document.querySelectorAll('.gallery-filters .g-filter');

    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    items.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Quick pre-select service in booking form
function selectServiceInForm(serviceName) {
    const selectElem = document.getElementById('serviceSelect');
    if (selectElem) {
        let found = false;
        for (let i = 0; i < selectElem.options.length; i++) {
            if (selectElem.options[i].value.includes(serviceName) || serviceName.includes(selectElem.options[i].value)) {
                selectElem.selectedIndex = i;
                found = true;
                break;
            }
        }
        if (!found) {
            selectElem.value = serviceName;
        }
    }
}

// Lightbox Modal functions
function openLightbox(imageSrc, captionText) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');

    if (modal && img) {
        img.src = imageSrc;
        caption.textContent = captionText || 'शिवांगी ब्यूटी पार्लर एण्ड कास्मेटिक्स, अगस्तपार देवरिया';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close lightbox on Escape key or click outside
function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeLightbox();
            }
        });
    }
}

// Handle Form Submission and generate WhatsApp Message
function handleBookingSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const service = document.getElementById('serviceSelect').value;
    const date = document.getElementById('bookingDate').value;
    const message = document.getElementById('clientMessage').value.trim();
    const successMsg = document.getElementById('bookingSuccessMsg');

    // Build WhatsApp Message
    const textMsg = 
`👑 *शिवांगी ब्यूटी पार्लर एण्ड कास्मेटिक्स (अगस्तपार, देवरिया)*
✨ *नया अपॉइंटमेंट अनुरोध:*

👤 *ग्राहक का नाम:* ${name}
📱 *मोबाइल नंबर:* ${phone}
💅 *चयनित सेवा:* ${service}
📅 *पसंदीदा तारीख:* ${date}
${message ? `📝 *अतिरिक्त नोट:* ${message}\n` : ''}
📍 *स्थान:* अगस्तपार, देवरिया, उ.प्र.
_कृपया इस अपॉइंटमेंट की पुष्टि करें।_`;

    const encodedMsg = encodeURIComponent(textMsg);
    // WhatsApp URL with Parlour Owner's Number
    const whatsappUrl = `https://api.whatsapp.com/send?phone=918840517212&text=${encodedMsg}`;

    // Show temporary success feedback
    if (successMsg) {
        successMsg.style.display = 'flex';
    }

    // Open WhatsApp after a brief delay
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 600);
}

// Bilingual Language Switcher (Hindi <-> English)
let currentLang = 'hi';
const langData = {
    en: {
        currentLangLabel: 'हिन्दी',
        home: 'Home',
        about: 'About Us',
        services: 'Services',
        cosmetics: 'Cosmetics & Bangles',
        awards: 'Awards & Certificates',
        gallery: 'Gallery',
        packages: 'Packages',
        contact: 'Contact',
        bookNow: 'Book Now',
        heroBadge: 'Certified & Award Winning Bridal Makeup Artist',
        heroTitle: 'Your Beauty, <br><span class="text-gold">Our Perfection</span>',
        heroSubtext: 'Welcome to Shivangi Beauty Parlour & Cosmetics, Agastpar (Deoria). Professional salon services, bridal makeup, party looks, and certified cosmetics at affordable prices.'
    },
    hi: {
        currentLangLabel: 'Eng',
        home: 'होम',
        about: 'हमारे बारे में',
        services: 'सेवाएं (Services)',
        cosmetics: 'कॉस्मेटिक्स & चूड़ी',
        awards: 'प्रमाणपत्र एवं सम्मान',
        gallery: 'गैलरी',
        packages: 'पैकेजेस',
        contact: 'संपर्क',
        bookNow: 'बुक करें',
        heroBadge: 'सर्टिफाइड & अवार्ड विनिंग ब्राइडल मेकअप आर्टिस्ट',
        heroTitle: 'आपका रूप, <br><span class="text-gold">हमारा निखार</span>',
        heroSubtext: 'शिवांगी ब्यूटी पार्लर एण्ड कास्मेटिक्स, अगस्तपार (देवरिया) में आपका स्वागत है। आधुनिक तकनीक, बेस्ट ब्यूटी प्रोडक्ट्स और सेलिब्रिटी ट्रेनर द्वारा सर्टिफाइड आर्टिस्ट द्वारा ब्राइडल मेकअप, पार्टी लुक एवं सैलून सेवाएं।'
    }
};

const langToggleBtn = document.getElementById('langToggle');
if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'hi' ? 'en' : 'hi';
        const data = langData[currentLang];
        document.getElementById('currentLangLabel').textContent = data.currentLangLabel;
        
        // Update nav links text while preserving icons
        const links = document.querySelectorAll('#navLinks .nav-box-item');
        const updateSpan = (link, text) => {
            if (!link) return;
            const span = link.querySelector('span');
            if (span) {
                span.textContent = text;
            } else {
                link.textContent = text;
            }
        };

        if (currentLang === 'en') {
            updateSpan(links[0], data.home);
            updateSpan(links[1], data.about);
            updateSpan(links[2], data.services);
            updateSpan(links[3], data.cosmetics);
            updateSpan(links[4], data.awards);
            updateSpan(links[5], data.gallery);
            updateSpan(links[6], data.packages);
            updateSpan(links[7], data.contact);
            updateSpan(links[8], data.bookNow);
            document.querySelector('.badge-hero span').textContent = data.heroBadge;
            document.querySelector('.hero-title').innerHTML = data.heroTitle;
            document.querySelector('.hero-subtext').textContent = data.heroSubtext;
        } else {
            updateSpan(links[0], data.home);
            updateSpan(links[1], data.about);
            updateSpan(links[2], data.services);
            updateSpan(links[3], data.cosmetics);
            updateSpan(links[4], data.awards);
            updateSpan(links[5], data.gallery);
            updateSpan(links[6], data.packages);
            updateSpan(links[7], data.contact);
            updateSpan(links[8], data.bookNow);
            document.querySelector('.badge-hero span').textContent = data.heroBadge;
            document.querySelector('.hero-title').innerHTML = data.heroTitle;
            document.querySelector('.hero-subtext').textContent = data.heroSubtext;
        }
    });
}
