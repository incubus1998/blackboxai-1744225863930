document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const container = document.querySelector('.carousel-container');
    const items = Array.from(document.querySelectorAll('.carousel-item'));
    const totalItems = items.length;
    
    if (!carousel || !container || totalItems === 0) {
        console.error('Required carousel elements not found');
        return;
    }

    console.log(`Initializing carousel with ${totalItems} items`);

    let currentIndex = 0;
    let isAnimating = false;

    // Set initial styles
    container.style.display = 'flex';
    container.style.transition = 'transform 0.5s ease-in-out';
    items.forEach(item => {
        item.style.flex = '0 0 100%';
    });

    // Navigation functions
    window.prevSlide = function() {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateSlide();
    };

    window.nextSlide = function() {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex = (currentIndex + 1) % totalItems;
        updateSlide();
    };

    function updateSlide() {
        console.log(`Moving to slide ${currentIndex + 1}`);
        container.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Reset animation lock after transition
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') window.prevSlide();
        else if (e.key === 'ArrowRight') window.nextSlide();
    });

    // Touch navigation
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) window.prevSlide();
            else window.nextSlide();
        }
    });

    // Auto-advance
    let autoPlayInterval = setInterval(window.nextSlide, 5000);

    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    carousel.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(window.nextSlide, 5000);
    });

    // Initialize first slide
    updateSlide();
});
