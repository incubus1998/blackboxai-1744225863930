document.addEventListener('DOMContentLoaded', function() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    // Add loading animation class
    document.body.classList.add('loading');

    // Remove loading animation after content loads
    window.addEventListener('load', () => {
        document.body.classList.remove('loading');
        document.querySelectorAll('.photo-card').forEach(card => {
            card.classList.add('animate-fade-in');
        });
    });

    darkModeToggle.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');
        const isDark = htmlElement.classList.contains('dark');
        localStorage.setItem('darkMode', isDark);
        
        // Animate dark mode toggle
        darkModeToggle.classList.add('animate-spin');
        setTimeout(() => darkModeToggle.classList.remove('animate-spin'), 500);
    });

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        htmlElement.classList.add('dark');
    }

    // Enhanced Carousel functionality with error handling
    const carousel = document.querySelector('.carousel');
    const items = document.querySelectorAll('.carousel-item');
    
    if (carousel && items.length > 0) {
        let currentIndex = 0;
        let isAnimating = false;
        let autoPlayInterval;

        // Handle image loading errors and add loading states
        const handleImageError = (img) => {
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
        };

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

    window.nextSlide = function() {
        const nextIndex = (currentIndex + 1) % totalItems;
        showSlide(nextIndex, 'next');
        resetAutoPlay();
    };

    window.prevSlide = function() {
        const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
        showSlide(prevIndex, 'prev');
        resetAutoPlay();
    };

    // Touch events for carousel
    const carousel = document.querySelector('.carousel');
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        pauseAutoPlay();
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
        resumeAutoPlay();
    });

    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Auto-advance carousel
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function pauseAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function resumeAutoPlay() {
        startAutoPlay();
    }

    function resetAutoPlay() {
        pauseAutoPlay();
        resumeAutoPlay();
    }

    // Scroll animations
    const scrollRevealElements = document.querySelectorAll('.photo-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    scrollRevealElements.forEach(element => {
        element.classList.add('scroll-reveal');
        scrollObserver.observe(element);
    });

    // Initialize carousel
    showSlide(currentIndex);
    startAutoPlay();

    // Pause auto-play when hovering over carousel
    carousel.addEventListener('mouseenter', pauseAutoPlay);
    carousel.addEventListener('mouseleave', resumeAutoPlay);

    // Add hover effect to photo cards
    document.querySelectorAll('.photo-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05) translateY(-10px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1) translateY(0)';
        });
    });

    // File Upload Handling
    const fileInput = document.getElementById('fileInput');
    const preview = document.getElementById('preview');
    const uploadForm = document.getElementById('uploadForm');

    if (fileInput && preview) {
        // Handle drag and drop
        const dropZone = fileInput.parentElement;
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            dropZone.classList.add('border-blue-500', 'bg-blue-50');
        }

        function unhighlight(e) {
            dropZone.classList.remove('border-blue-500', 'bg-blue-50');
        }

        dropZone.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }

        // Handle file selection
        fileInput.addEventListener('change', function(e) {
            handleFiles(this.files);
        });

        async function handleFiles(files) {
            preview.innerHTML = ''; // Clear existing previews
            const uploadProgress = document.querySelector('.upload-progress');
            const uploadSuccess = document.querySelector('.upload-success');
            const uploadError = document.querySelector('.upload-error');
            
            // Hide status indicators
            uploadSuccess.classList.add('hidden');
            uploadError.classList.add('hidden');
            
            let successCount = 0;
            let errorCount = 0;
            const totalFiles = files.length;
            
            Array.from(files).forEach((file, index) => {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    errorCount++;
                    uploadError.textContent = 'Some files are too large (max 5MB)';
                    uploadError.classList.remove('hidden');
                    return;
                }

                if (!file.type.startsWith('image/')) {
                    errorCount++;
                    uploadError.textContent = 'Please upload only image files';
                    uploadError.classList.remove('hidden');
                    return;
                }

                const reader = new FileReader();
                reader.onload = async function(e) {
                    const div = document.createElement('div');
                    div.className = 'preview-item relative aspect-square rounded-lg overflow-hidden shadow-md';
                    
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'w-full h-full object-cover';
                    
                    const overlay = document.createElement('div');
                    overlay.className = 'absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center flex-col';
                    
                    const fileName = document.createElement('p');
                    fileName.className = 'text-white text-sm text-center px-2 mb-2';
                    fileName.textContent = file.name;

                    const uploadStatus = document.createElement('p');
                    uploadStatus.className = 'text-white text-xs text-center px-2';
                    uploadStatus.textContent = 'Uploading to Dropbox...';
                    
                    overlay.appendChild(fileName);
                    overlay.appendChild(uploadStatus);
                    div.appendChild(img);
                    div.appendChild(overlay);
                    preview.appendChild(div);
                    
                    // Try to upload to Dropbox if connected
                    if (window.dropboxInstance) {
                        try {
                            // Convert base64 to blob for upload
                            const base64Data = e.target.result.split(',')[1];
                            const byteCharacters = atob(base64Data);
                            const byteArrays = [];
                            
                            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                                const slice = byteCharacters.slice(offset, offset + 512);
                                const byteNumbers = new Array(slice.length);
                                
                                for (let i = 0; i < slice.length; i++) {
                                    byteNumbers[i] = slice.charCodeAt(i);
                                }
                                
                                byteArrays.push(new Uint8Array(byteNumbers));
                            }
                            
                            const blob = new Blob(byteArrays, { type: file.type });

                            // Upload to Dropbox
                            const result = await window.dropboxInstance.filesUpload({
                                path: '/photos/' + file.name,
                                contents: blob,
                                mode: 'overwrite'
                            });
                            
                            if (result) {
                                uploadStatus.textContent = 'Uploaded to Dropbox ✓';
                                uploadStatus.className = 'text-green-400 text-xs text-center px-2';
                                successCount++;
                                
                                // Create shared link
                                try {
                                    const shareResult = await window.dropboxInstance.sharingCreateSharedLink({
                                        path: result.path_display
                                    });
                                    
                                    if (shareResult) {
                                        const linkElem = document.createElement('a');
                                        linkElem.href = shareResult.url;
                                        linkElem.target = '_blank';
                                        linkElem.className = 'text-blue-400 text-xs hover:underline mt-1';
                                        linkElem.textContent = 'View on Dropbox';
                                        overlay.appendChild(linkElem);
                                    }
                                } catch (shareError) {
                                    console.error('Error creating share link:', shareError);
                                }
                            } else {
                                uploadStatus.textContent = 'Dropbox upload failed ✗';
                                uploadStatus.className = 'text-red-400 text-xs text-center px-2';
                                errorCount++;
                            }
                        } catch (error) {
                            console.error('Upload error:', error);
                            uploadStatus.textContent = 'Dropbox upload failed ✗';
                            uploadStatus.className = 'text-red-400 text-xs text-center px-2';
                            errorCount++;
                        }
                    } else {
                        uploadStatus.textContent = 'Dropbox not connected';
                        uploadStatus.className = 'text-yellow-400 text-xs text-center px-2';
                        successCount++; // Still count as success for local preview
                    }
                    
                    // Update progress
                    const progress = ((index + 1) / totalFiles) * 100;
                    uploadProgress.style.width = `${progress}%`;
                    
                    // Show final status when all files are processed
                    if (successCount + errorCount === totalFiles) {
                        setTimeout(() => {
                            if (errorCount === 0) {
                                uploadSuccess.classList.remove('hidden');
                                uploadProgress.style.width = '100%';
                            } else {
                                uploadError.textContent = `${errorCount} file(s) failed to upload`;
                                uploadError.classList.remove('hidden');
                            }
                        }, 500);
                    }
                };
                
                reader.onerror = function() {
                    errorCount++;
                    uploadError.textContent = 'Error processing some files';
                    uploadError.classList.remove('hidden');
                };
                
                reader.readAsDataURL(file);
            });
        }
    }
});
