// Simple carousel implementation
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelector('.slides');
    if (!slides) {
        console.error('Carousel not found');
        return;
    }

    const slideItems = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const totalSlides = slideItems.length;
    let isAnimating = false;

    console.log(`Initializing carousel with ${totalSlides} slides`);

    // Initialize
    slides.style.width = `${totalSlides * 100}%`;
    slideItems.forEach((slide, index) => {
        slide.style.width = `${100 / totalSlides}%`;
        slide.style.left = `${index * 100}%`;
    });

    function updateCarousel() {
        slides.style.transform = `translateX(-${currentSlide * 100 / totalSlides}%)`;
    }

    window.moveSlide = function(direction) {
        if (isAnimating) return;
        isAnimating = true;

        currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
        console.log(`Moving to slide: ${currentSlide + 1}`);
        updateCarousel();

        setTimeout(() => {
            isAnimating = false;
        }, 500);
    };

    // Auto advance
    let autoAdvance = setInterval(() => moveSlide(1), 5000);

    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoAdvance));
    carousel.addEventListener('mouseleave', () => {
        autoAdvance = setInterval(() => moveSlide(1), 5000);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') moveSlide(-1);
        if (e.key === 'ArrowRight') moveSlide(1);
    });

    // Touch support
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        clearInterval(autoAdvance);
    });

    carousel.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 50) {
            moveSlide(diff > 0 ? -1 : 1);
        }
        autoAdvance = setInterval(() => moveSlide(1), 5000);
    });

    // Initialize first slide
    updateCarousel();
});
