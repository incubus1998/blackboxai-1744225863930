// Simple carousel implementation
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelector('.slides');
    if (!slides) {
        console.error('Carousel not found');
        return;
    }

    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.slide').length;
    let isAnimating = false;

    console.log(`Initializing carousel with ${totalSlides} slides`);

    // Initialize
    slides.style.width = `${totalSlides * 100}%`;
    document.querySelectorAll('.slide').forEach(slide => {
        slide.style.width = `${100 / totalSlides}%`;
    });

    window.moveSlide = function(direction) {
        if (isAnimating) return;
        isAnimating = true;

        console.log(`Moving slide: ${direction > 0 ? 'next' : 'previous'}`);
        currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
        slides.style.transform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;

        setTimeout(() => {
            isAnimating = false;
        }, 500);
    };

    // Auto advance
    let autoAdvance = setInterval(() => moveSlide(1), 5000);

    // Pause on hover
    slides.addEventListener('mouseenter', () => clearInterval(autoAdvance));
    slides.addEventListener('mouseleave', () => {
        autoAdvance = setInterval(() => moveSlide(1), 5000);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') moveSlide(-1);
        if (e.key === 'ArrowRight') moveSlide(1);
    });

    // Touch support
    let touchStart = 0;
    slides.addEventListener('touchstart', (e) => {
        touchStart = e.touches[0].clientX;
        clearInterval(autoAdvance);
    });

    slides.addEventListener('touchend', (e) => {
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchEnd - touchStart;
        if (Math.abs(diff) > 50) {
            moveSlide(diff > 0 ? -1 : 1);
        }
        autoAdvance = setInterval(() => moveSlide(1), 5000);
    });
});
