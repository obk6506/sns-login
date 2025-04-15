// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality (for responsive design)
    const mobileMenuToggle = document.createElement('div');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('header .container').appendChild(mobileMenuToggle);
    
    mobileMenuToggle.addEventListener('click', function() {
        const nav = document.querySelector('nav');
        nav.classList.toggle('active');
    });
    
    // Product image hover effect
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.product-overlay');
            if (overlay) {
                overlay.style.bottom = '0';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.product-overlay');
            if (overlay) {
                overlay.style.bottom = '-50px';
            }
        });
    });
    
    // Newsletter form validation
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email || !isValidEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Simulate form submission
            alert('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        });
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add CSS for mobile menu in JavaScript to keep it together with its functionality
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            header .container {
                position: relative;
            }
            
            .mobile-menu-toggle {
                display: block;
                font-size: 24px;
                cursor: pointer;
            }
            
            nav {
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background-color: #fff;
                padding: 20px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                transform: translateY(-150%);
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 99;
            }
            
            nav.active {
                transform: translateY(0);
                opacity: 1;
            }
            
            nav ul {
                flex-direction: column;
                gap: 15px;
            }
        }
        
        @media (min-width: 769px) {
            .mobile-menu-toggle {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
});
