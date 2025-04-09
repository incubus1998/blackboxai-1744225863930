// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Image Preloader with Error Handling
    const preloadImages = (images) => {
        return Promise.all(images.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                
                img.onload = () => {
                    console.log(`Successfully loaded: ${src}`);
                    resolve(img);
                };
                
                img.onerror = (e) => {
                    console.error(`Error loading image ${src}:`, e);
                    reject(new Error(`Failed to load ${src}`));
                };
                
                img.src = src;
            });
        })).catch(error => {
            console.warn('Some images failed to preload:', error);
        });
    };

    // Carousel Functionality
    const carousel = {
        container: document.querySelector('.carousel-container'),
        items: document.querySelectorAll('.carousel-item'),
        prevBtn: document.querySelector('.carousel-prev'),
        nextBtn: document.querySelector('.carousel-next'),
        indicators: document.querySelectorAll('.carousel-indicator'),
        currentIndex: 0,
        itemCount: document.querySelectorAll('.carousel-item').length,
        imageUrls: ['./images/A.jpg', './images/B.jpg', './images/C.jpg'],

        handleImageError(img) {
            img.onerror = null;
            img.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'600\' viewBox=\'0 0 800 600\'%3E%3Crect width=\'800\' height=\'600\' fill=\'%23f3f4f6\'/%3E%3Ctext x=\'400\' y=\'300\' font-family=\'Arial\' font-size=\'24\' fill=\'%236b7280\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3EImage Loading Error%3C/text%3E%3C/svg%3E';
        },

        preloadImages() {
            return Promise.all(this.imageUrls.map(src => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = () => {
                        console.error(`Failed to load image: ${src}`);
                        reject(new Error(`Failed to load ${src}`));
                    };
                    img.src = src;
                });
            }));
        },
        
        async init() {
            if (!this.container || this.itemCount === 0) return;

            try {
                // Show loading state
                this.items.forEach(item => {
                    const img = item.querySelector('img');
                    if (img) {
                        img.style.opacity = '0.5';
                        img.style.transition = 'opacity 0.3s ease';
                    }
                });

                // Preload images
                await preloadImages(this.imageUrls);
                
                // Remove loading state and set initial state
                this.items.forEach(item => {
                    const img = item.querySelector('img');
                    if (img) {
                        img.style.opacity = '1';
                    }
                });
                
                this.updateCarousel();
                this.indicators[0].style.backgroundColor = 'white';

                // Add event listeners
                this.prevBtn.addEventListener('click', () => this.prev());
                this.nextBtn.addEventListener('click', () => this.next());
                
                // Add indicator clicks
                this.indicators.forEach((indicator, index) => {
                    indicator.addEventListener('click', () => this.goToSlide(index));
                });
                
                // Add touch support
                let touchStartX = 0;
                let touchEndX = 0;
                
                this.container.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                }, false);
                
                this.container.addEventListener('touchend', (e) => {
                    touchEndX = e.changedTouches[0].screenX;
                    if (touchStartX - touchEndX > 50) {
                        this.next();
                    } else if (touchEndX - touchStartX > 50) {
                        this.prev();
                    }
                }, false);
                
                // Auto slide every 5 seconds
                setInterval(() => this.next(), 5000);
            } catch (error) {
                console.error('Error initializing carousel:', error);
                // Show error state in the UI
                this.items.forEach(item => {
                    const img = item.querySelector('img');
                    if (img) {
                        img.style.opacity = '1';
                        // Trigger the onerror handler to show fallback image
                        if (img.onerror) img.onerror();
                    }
                });
            }
        }
            
            // Add event listeners
            this.prevBtn.addEventListener('click', () => this.prev());
            this.nextBtn.addEventListener('click', () => this.next());
            
            // Add indicator clicks
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });
            
            // Add touch support
            let touchStartX = 0;
            let touchEndX = 0;
            
            this.container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, false);
            
            this.container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) {
                    this.next();
                } else if (touchEndX - touchStartX > 50) {
                    this.prev();
                }
            }, false);
            
            // Auto slide every 5 seconds
            setInterval(() => this.next(), 5000);
        },
        
        updateCarousel() {
            const offset = -this.currentIndex * 100;
            this.container.style.transform = `translateX(${offset}%)`;
            
            // Update indicators
            this.indicators.forEach((indicator, index) => {
                indicator.style.backgroundColor = index === this.currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)';
            });
        },
        
        next() {
            this.currentIndex = (this.currentIndex + 1) % this.itemCount;
            this.updateCarousel();
        },
        
        prev() {
            this.currentIndex = (this.currentIndex - 1 + this.itemCount) % this.itemCount;
            this.updateCarousel();
        },
        
        goToSlide(index) {
            this.currentIndex = index;
            this.updateCarousel();
        }
    };
    
    // Initialize carousel with error handling
    carousel.init().catch(err => {
        console.error('Carousel initialization failed:', err);
        // Add a retry button
        const gallery = document.getElementById('gallery');
        const retryBtn = document.createElement('button');
        retryBtn.className = 'bg-pink-500 text-white px-6 py-2 rounded-full mt-4 hover:bg-pink-600';
        retryBtn.textContent = 'Retry Loading Images';
        retryBtn.onclick = () => {
            retryBtn.remove();
            carousel.init().catch(console.error);
        };
        gallery.appendChild(retryBtn);
    });
    
    // Parallax Effect
    const parallax = document.querySelector('.parallax-bg');
    if (parallax) {
        window.addEventListener('scroll', function() {
            let scrollPosition = window.pageYOffset;
            parallax.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px)';
        });
    }

    // Floating Hearts Animation
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 2 + 's';
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }

    setInterval(createHeart, 3000);

    // Scroll Progress Indicator
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.onscroll = function() {
            let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            let scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + "%";
        };
    }

    // Back to Top Button
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Photo Lightbox
    const galleryImages = document.querySelectorAll('.gallery-image');
    if (galleryImages.length > 0) {
        galleryImages.forEach(image => {
            image.addEventListener('click', e => {
                const lightbox = document.createElement('div');
                lightbox.id = 'lightbox';
                lightbox.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
                
                const img = document.createElement('img');
                img.src = e.target.src;
                img.className = 'max-h-[90vh] max-w-[90vw] object-contain';
                
                lightbox.appendChild(img);
                document.body.appendChild(lightbox);
                
                lightbox.addEventListener('click', e => {
                    if (e.target !== img) {
                        lightbox.remove();
                    }
                });
            });
        });
    }

    // Anniversary Countdown
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
    function updateCountdown() {
            const anniversaryDate = new Date('2025-04-14').getTime();
            const now = new Date().getTime();
            const distance = anniversaryDate - now;

            if (distance < 0) {
                countdownElement.innerHTML = `
                    <div class="countdown-item text-pink-500">Anniversary has passed!</div>
                `;
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                countdownElement.innerHTML = `
                    <div class="countdown-item">${days}d</div>
                    <div class="countdown-item">${hours}h</div>
                    <div class="countdown-item">${minutes}m</div>
                    <div class="countdown-item">${seconds}s</div>
                `;
            }
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Rotating Love Quotes
    const quotes = [
        "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.",
        "The best thing to hold onto in life is each other.",
        "I love you not only for what you are, but for what I am when I am with you.",
        "Every love story is beautiful, but ours is my favorite."
    ];

    const quoteElement = document.getElementById('rotating-quote');
    if (quoteElement) {
        let currentQuote = 0;
        function rotateQuotes() {
            quoteElement.style.opacity = 0;
            setTimeout(() => {
                currentQuote = (currentQuote + 1) % quotes.length;
                quoteElement.textContent = quotes[currentQuote];
                quoteElement.style.opacity = 1;
            }, 500);
        }

        setInterval(rotateQuotes, 5000);
    }

    // Carousel functionality
    const slides = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const nextButton = document.querySelector('.carousel-next');
    const prevButton = document.querySelector('.carousel-prev');

    if (slides.length > 0 && indicators.length > 0) {
        let currentSlide = 0;

        function showSlide(n) {
            slides.forEach(slide => slide.style.opacity = 0);
            indicators.forEach(indicator => indicator.classList.remove('opacity-100'));
            
            slides[n].style.opacity = 1;
            indicators[n].classList.add('opacity-100');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        if (nextButton) nextButton.addEventListener('click', nextSlide);
        if (prevButton) prevButton.addEventListener('click', prevSlide);

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Initialize carousel
        showSlide(0);
        setInterval(nextSlide, 5000);
    }

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
