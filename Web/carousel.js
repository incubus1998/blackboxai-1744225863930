// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Carousel with Debug Logging
    function initCarousel() {
        console.log('Initializing carousel...');
        
        const carousel = document.querySelector('.carousel');
        const items = document.querySelectorAll('.carousel-item');
        const totalItems = items.length;
        
        if (!carousel || totalItems === 0) {
            console.error('Carousel elements not found:', { carousel: !!carousel, items: totalItems });
            return;
        }

        console.log(`Found ${totalItems} carousel items`);

        let currentIndex = 0;
        let isAnimating = false;
        let autoPlayInterval;

        // Debug image sources
        items.forEach((item, index) => {
            const img = item.querySelector('img');
            if (img) {
                console.log(`Image ${index + 1} source:`, img.src);
                // Force reload image
                const currentSrc = img.src;
                img.src = '';
                img.src = currentSrc;
            }
        });

        // Handle image loading errors and add loading states
        function handleImageError(img) {
            if (!img) return;
            
            // Set error handler
            img.onerror = function() {
                console.error(`Failed to load image: ${img.src}`);
                this.onerror = null; // Prevent infinite loop
                this.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'600\' viewBox=\'0 0 800 600\'%3E%3Crect width=\'800\' height=\'600\' fill=\'%23f3f4f6\'/%3E%3Ctext x=\'400\' y=\'300\' font-family=\'Arial\' font-size=\'24\' fill=\'%236b7280\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3EImage Loading Error%3C/text%3E%3C/svg%3E';
            };

            // Add loading state
            img.style.opacity = '0.5';
            img.style.transition = 'opacity 0.3s ease';

            // Show image when loaded
            img.onload = function() {
                this.style.opacity = '1';
            };

            // Force error handler if image is already broken
            if (!img.complete || img.naturalWidth === 0) {
                img.onerror();
            }
        }

        // Initialize all images
        items.forEach(item => {
            const img = item.querySelector('img');
            if (img) handleImageError(img);
        });

        function showSlide(index, direction = 'next') {
            if (isAnimating) return;
            isAnimating = true;

            const currentSlide = items[currentIndex];
            const nextSlide = items[index];

            if (!currentSlide || !nextSlide) {
                isAnimating = false;
                return;
            }

            // Reset positions
            currentSlide.style.transform = 'translateX(0)';
            nextSlide.style.transform = `translateX(${direction === 'next' ? '100%' : '-100%'})`;
            nextSlide.style.opacity = '1';

            // Trigger animation
            requestAnimationFrame(() => {
                currentSlide.style.transform = `translateX(${direction === 'next' ? '-100%' : '100%'})`;
                currentSlide.style.opacity = '0';
                nextSlide.style.transform = 'translateX(0)';
                
                setTimeout(() => {
                    currentSlide.style.zIndex = '0';
                    nextSlide.style.zIndex = '1';
                    isAnimating = false;
                }, 500);
            });

            currentIndex = index;
        }

        function nextSlide() {
            const nextIndex = (currentIndex + 1) % items.length;
            showSlide(nextIndex, 'next');
        }

        function prevSlide() {
            const prevIndex = (currentIndex - 1 + items.length) % items.length;
            showSlide(prevIndex, 'prev');
        }

        // Touch events for carousel
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            clearInterval(autoPlayInterval);
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
            
            startAutoPlay();
        });

        // Auto-advance carousel
        function startAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextSlide, 5000);
        }

        // Initialize carousel
        showSlide(currentIndex);
        startAutoPlay();

        // Pause auto-play when hovering
        carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carousel.addEventListener('mouseleave', startAutoPlay);

        // Expose functions to window for button clicks
        window.nextSlide = nextSlide;
        window.prevSlide = prevSlide;
    }

    // Start the carousel
    initCarousel();
});
