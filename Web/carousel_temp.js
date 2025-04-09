// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    function initCarousel() {
        console.log('Initializing carousel...');
        
        const carousel = document.querySelector('.carousel');
        const container = document.querySelector('.carousel-container');
        const items = document.querySelectorAll('.carousel-item');
        const totalItems = items.length;
        
        if (!carousel || !container || totalItems === 0) {
            console.error('Carousel elements not found');
            return;
        }

        console.log(`Found ${totalItems} carousel items`);

        let currentIndex = 0;
        let isAnimating = false;
        let autoPlayInterval;

        // Set initial styles
        container.style.transition = 'transform 0.5s ease-in-out';
        items.forEach(item => {
            item.style.transition = 'opacity 0.5s ease-in-out';
        });

        function showSlide(index) {
            if (isAnimating) return;
            console.log(`Showing slide ${index + 1}`);
            
            isAnimating = true;
            const offset = -index * 100;
            
            // Update transform
            container.style.transform = `translateX(${offset}%)`;
            
            // Update active states
            items.forEach((item, i) => {
                const img = item.querySelector('img');
                if (img) {
                    img.style.opacity = i === index ? '1' : '0.5';
                }
            });

            // Update indicators
            document.querySelectorAll('.carousel-indicator').forEach((indicator, i) => {
                indicator.style.backgroundColor = i === index ? 'white' : 'rgba(255, 255, 255, 0.5)';
            });

            currentIndex = index;
            setTimeout(() => { isAnimating = false; }, 500);
        }

        // Navigation functions
        window.nextSlide = function() {
            console.log('Next slide called');
            clearInterval(autoPlayInterval);
            showSlide((currentIndex + 1) % totalItems);
            startAutoPlay();
        };

        window.prevSlide = function() {
            console.log('Previous slide called');
            clearInterval(autoPlayInterval);
            showSlide((currentIndex - 1 + totalItems) % totalItems);
            startAutoPlay();
        };

        // Set up navigation buttons
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');

        if (prevButton && nextButton) {
            console.log('Setting up navigation buttons');
            
            prevButton.onclick = window.prevSlide;
            nextButton.onclick = window.nextSlide;

            // Add hover effects
            [prevButton, nextButton].forEach(button => {
                button.addEventListener('mouseenter', () => {
                    button.style.backgroundColor = 'rgba(255, 255, 255, 0.75)';
                });
                button.addEventListener('mouseleave', () => {
                    button.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                });
            });
        }

        // Touch support
        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            clearInterval(autoPlayInterval);
        });

        carousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchEndX - touchStartX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) window.prevSlide();
                else window.nextSlide();
            }
        });

        // Auto-advance
        function startAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(window.nextSlide, 5000);
        }

        // Initialize
        console.log('Starting carousel');
        showSlide(0);
        startAutoPlay();

        // Pause on hover
        carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carousel.addEventListener('mouseleave', startAutoPlay);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') window.prevSlide();
            else if (e.key === 'ArrowRight') window.nextSlide();
        });
    }

    // Start the carousel
    initCarousel();
});
