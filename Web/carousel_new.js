// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Carousel with Debug Logging
    function initCarousel() {
        console.log('Initializing carousel...');
        
        const carousel = document.querySelector('.carousel');
        const container = document.querySelector('.carousel-container');
        const items = document.querySelectorAll('.carousel-item');
        const totalItems = items.length;
        
        if (!carousel || !container || totalItems === 0) {
            console.error('Carousel elements not found:', { 
                carousel: !!carousel, 
                container: !!container, 
                items: totalItems 
            });
            return;
        }

        console.log(`Found ${totalItems} carousel items`);

        let currentIndex = 0;
        let isAnimating = false;
        let autoPlayInterval;

        // Preload images
        function preloadImages() {
            return Promise.all(Array.from(items).map((item, index) => {
                return new Promise((resolve) => {
                    const img = item.querySelector('img');
                    if (!img) {
                        console.error(`No image found in item ${index}`);
                        resolve(false);
                        return;
                    }

                    // Set initial loading state
                    img.style.opacity = '0.5';
                    img.style.transition = 'opacity 0.3s ease';

                    // Handle successful load
                    img.onload = function() {
                        console.log(`Successfully loaded image ${index + 1}`);
                        img.style.opacity = '1';
                        resolve(true);
                    };

                    // Handle load error
                    img.onerror = function() {
                        console.error(`Failed to load image ${index + 1}: ${img.src}`);
                        img.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'600\' viewBox=\'0 0 800 600\'%3E%3Crect width=\'800\' height=\'600\' fill=\'%23f3f4f6\'/%3E%3Ctext x=\'400\' y=\'300\' font-family=\'Arial\' font-size=\'24\' fill=\'%236b7280\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3EImage Loading Error%3C/text%3E%3C/svg%3E';
                        resolve(false);
                    };

                    // Force reload image
                    const currentSrc = img.src;
                    img.src = '';
                    setTimeout(() => {
                        img.src = currentSrc;
                    }, 100);
                });
            }));
        }

        // Set initial styles
        container.style.transition = 'transform 0.5s ease-in-out';
        items.forEach(item => {
            item.style.transition = 'opacity 0.5s ease-in-out';
        });

        function showSlide(index, direction = 'next') {
            if (isAnimating || index >= totalItems) {
                console.log('Cannot show slide:', { isAnimating, index, totalItems });
                return;
            }

            isAnimating = true;
            console.log(`Showing slide ${index + 1}`);

            // Update transform with smooth transition
            const offset = -index * 100;
            requestAnimationFrame(() => {
                container.style.transform = `translateX(${offset}%)`;
                
                // Update active state
                items.forEach((item, i) => {
                    const img = item.querySelector('img');
                    if (img) {
                        img.style.opacity = i === index ? '1' : '0.5';
                    }
                });

                // Update indicators
                const indicators = document.querySelectorAll('.carousel-indicator');
                indicators.forEach((indicator, i) => {
                    indicator.style.backgroundColor = i === index ? 'white' : 'rgba(255, 255, 255, 0.5)';
                });
            });

            setTimeout(() => {
                isAnimating = false;
            }, 500);

            currentIndex = index;
        }

        // Navigation functions
        function nextSlide() {
            showSlide((currentIndex + 1) % totalItems, 'next');
        }

        function prevSlide() {
            showSlide((currentIndex - 1 + totalItems) % totalItems, 'prev');
        }

        // Event Listeners
        const prevButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');

        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
                console.log('Previous button clicked');
                prevSlide();
            });

            nextButton.addEventListener('click', () => {
                console.log('Next button clicked');
                nextSlide();
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
                if (diff > 0) prevSlide();
                else nextSlide();
            }
            
            startAutoPlay();
        });

        // Auto-advance
        function startAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextSlide, 5000);
        }

        // Initialize
        preloadImages().then(() => {
            console.log('Images preloaded, starting carousel');
            showSlide(0);
            startAutoPlay();
        });

        // Pause on hover
        carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carousel.addEventListener('mouseleave', startAutoPlay);
    }

    // Start the carousel
    initCarousel();
});
