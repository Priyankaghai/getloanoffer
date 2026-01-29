// ========================================
// GetLoanOffer - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    const preloaderSpan = document.querySelector('.preloader span');
    let progress = 0;
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 300);
        }
        if (preloaderSpan) {
            preloaderSpan.textContent = Math.floor(progress) + '%';
        }
    }, 100);

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    };

    // Intersection Observer for Stats
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => animateCounter(stat));
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // EMI Calculator
    const loanAmountSlider = document.getElementById('loan-amount');
    const interestRateSlider = document.getElementById('interest-rate');
    const loanTenureSlider = document.getElementById('loan-tenure');
    const loanAmountValue = document.getElementById('loan-amount-value');
    const interestRateValue = document.getElementById('interest-rate-value');
    const loanTenureValue = document.getElementById('loan-tenure-value');
    const monthlyEmiElement = document.getElementById('monthly-emi');
    const totalInterestElement = document.getElementById('total-interest');
    const totalAmountElement = document.getElementById('total-amount');

    let emiChart = null;

    function calculateEMI() {
        const principal = parseFloat(loanAmountSlider?.value || 500000);
        const rate = parseFloat(interestRateSlider?.value || 10.5) / 100 / 12;
        const tenure = parseInt(loanTenureSlider?.value || 36);

        // EMI Formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
        const emi = principal * rate * Math.pow(1 + rate, tenure) / (Math.pow(1 + rate, tenure) - 1);
        const totalAmount = emi * tenure;
        const totalInterest = totalAmount - principal;

        // Update display
        if (monthlyEmiElement) {
            monthlyEmiElement.textContent = '₹' + Math.round(emi).toLocaleString('en-IN');
        }
        if (totalInterestElement) {
            totalInterestElement.textContent = '₹' + Math.round(totalInterest).toLocaleString('en-IN');
        }
        if (totalAmountElement) {
            totalAmountElement.textContent = '₹' + Math.round(totalAmount).toLocaleString('en-IN');
        }

        // Update Chart
        updateChart(principal, totalInterest);
    }

    function updateChart(principal, interest) {
        const ctx = document.getElementById('emi-chart');
        if (!ctx) return;

        if (emiChart) {
            emiChart.destroy();
        }

        emiChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    data: [principal, interest],
                    backgroundColor: ['#8B5CF6', '#EC4899'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#B4B4C7',
                            padding: 20,
                            font: {
                                family: 'Poppins',
                                size: 12
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    // Slider event listeners
    if (loanAmountSlider) {
        loanAmountSlider.addEventListener('input', () => {
            loanAmountValue.value = loanAmountSlider.value;
            calculateEMI();
        });
    }

    if (interestRateSlider) {
        interestRateSlider.addEventListener('input', () => {
            interestRateValue.value = interestRateSlider.value;
            calculateEMI();
        });
    }

    if (loanTenureSlider) {
        loanTenureSlider.addEventListener('input', () => {
            loanTenureValue.value = loanTenureSlider.value;
            calculateEMI();
        });
    }

    // Number input event listeners
    if (loanAmountValue) {
        loanAmountValue.addEventListener('change', () => {
            loanAmountSlider.value = loanAmountValue.value;
            calculateEMI();
        });
    }

    if (interestRateValue) {
        interestRateValue.addEventListener('change', () => {
            interestRateSlider.value = interestRateValue.value;
            calculateEMI();
        });
    }

    if (loanTenureValue) {
        loanTenureValue.addEventListener('change', () => {
            loanTenureSlider.value = loanTenureValue.value;
            calculateEMI();
        });
    }

    // Initial calculation
    if (loanAmountSlider) {
        calculateEMI();
    }

    // Form Submission - Google Sheets Integration
    const heroForm = document.getElementById('hero-form');
    const contactForm = document.getElementById('contact-form');
    
    // Google Apps Script URL
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwYd6sbDr1od5Jly84JapmDywmLIfyri2NhMZ2N3rjic2gTB7F6Yk_VZS_W6YKQtK06/exec';

    async function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span>Submitting...</span> <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        try {
            // Collect form data
            const formData = new FormData(form);
            const data = {
                name: formData.get('name') || '',
                email: formData.get('email') || '',
                phone: formData.get('phone') || '',
                loan_type: formData.get('loan_type') || '',
                amount: formData.get('amount') || '',
                employment: formData.get('employment') || '',
                income: formData.get('income') || '',
                city: formData.get('city') || '',
                message: formData.get('message') || ''
            };
            
            // Send to Google Sheets
            await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            // Redirect to thank you page
            window.location.href = 'thankyou.html';
            
        } catch (error) {
            console.error('Error submitting form:', error);
            // Still redirect even if there's an error (no-cors doesn't return response)
            window.location.href = 'thankyou.html';
        }
    }

    if (heroForm) {
        heroForm.addEventListener('submit', handleFormSubmit);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .process-step, .testimonial-card, .service-detail-content');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for animated elements
    document.querySelectorAll('.feature-card, .process-step, .testimonial-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load

    // Active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const navHeight = navbar.offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
});

// Utility function to format currency
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// Utility function to validate phone number
function validatePhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// Utility function to validate email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
