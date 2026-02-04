/**
 * 光影与留白 - 摄影作品展示网站 JavaScript
 * 包含平滑滚动、动画效果、交互功能
 */

(function() {
    'use strict';

    // ==========================================
    // DOM 加载完成后初始化
    // ==========================================
    document.addEventListener('DOMContentLoaded', function() {
        initPageLoader();
        initCustomCursor();
        initSmoothScroll();
        initNavigation();
        initGallery();
        initLightbox();
        initContactForm();
        initScrollAnimations();
    });

    // ==========================================
    // 页面加载动画
    // ==========================================
    function initPageLoader() {
        const pageLoader = document.querySelector('.page-loader');
        
        if (!pageLoader) return;

        // 页面加载完成后隐藏加载动画
        window.addEventListener('load', function() {
            setTimeout(function() {
                pageLoader.classList.add('hidden');
                
                // 触发首页加载完成状态
                setTimeout(function() {
                    document.querySelector('.hero-section').classList.add('loaded');
                }, 300);
            }, 800);
        });
    }

    // ==========================================
    // 自定义光标
    // ==========================================
    function initCustomCursor() {
        const cursor = document.querySelector('.custom-cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        
        if (!cursor || !cursorFollower) return;
        
        // 移动端禁用自定义光标
        if (window.innerWidth <= 480) {
            cursor.style.display = 'none';
            cursorFollower.style.display = 'none';
            return;
        }

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let followerX = 0;
        let followerY = 0;

        // 鼠标移动事件
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // 光标动画循环
        function animateCursor() {
            // 主光标跟随
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            // 跟随光标延迟跟随
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        
        animateCursor();

        // 可点击元素的悬停效果
        const hoverElements = document.querySelectorAll('a, button, .gallery-item, .filter-btn');
        
        hoverElements.forEach(function(el) {
            el.addEventListener('mouseenter', function() {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', function() {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });
    }

    // ==========================================
    // 平滑滚动
    // ==========================================
    function initSmoothScroll() {
        // 使用 Lenis 实现平滑滚动
        const lenis = new Lenis({
            duration: 1.2,
            easing: function(t) {
                return 1 - Math.pow(1 - t, 3);
            },
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2
        });

        // 将 lenis 实例暴露给全局
        window.lenis = lenis;

        // 滚动动画循环
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        
        requestAnimationFrame(raf);

        // 导航链接平滑滚动
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .about-cta-btn');
        
        navLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        // 关闭移动端菜单
                        closeMobileMenu();
                        
                        lenis.scrollTo(targetElement, {
                            offset: 0,
                            duration: 1.5,
                            easing: function(t) {
                                return 1 - Math.pow(1 - t, 3);
                            }
                        });
                    }
                }
            });
        });
    }

    // ==========================================
    // 导航功能
    // ==========================================
    function initNavigation() {
        const nav = document.querySelector('.main-nav');
        const navToggle = document.querySelector('.nav-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        
        if (!nav || !navToggle || !mobileMenu) return;

        // 滚动时导航栏变化
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });

        // 移动端菜单切换
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // 移动端导航链接点击
        mobileNavLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });

        // 高亮当前导航链接
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', function() {
            const scrollY = window.pageYOffset;
            
            sections.forEach(function(section) {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 200;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');
                
                if (navLink) {
                    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                        document.querySelectorAll('.nav-link').forEach(function(link) {
                            link.classList.remove('active');
                        });
                        navLink.classList.add('active');
                    }
                }
            });
        });

        function closeMobileMenu() {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ==========================================
    // 作品画廊功能
    // ==========================================
    function initGallery() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        const loadMoreBtn = document.querySelector('.load-more-btn');
        
        if (!filterBtns.length || !galleryItems.length) return;

        // 分类筛选
        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // 更新按钮状态
                filterBtns.forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                
                // 筛选作品
                galleryItems.forEach(function(item, index) {
                    const category = item.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hidden');
                        item.style.transitionDelay = (index % 4) * 0.1 + 's';
                        
                        setTimeout(function() {
                            item.classList.add('visible');
                        }, 50);
                    } else {
                        item.classList.remove('visible');
                        
                        setTimeout(function() {
                            item.classList.add('hidden');
                        }, 300);
                    }
                });
            });
        });

        // 初始显示所有作品
        galleryItems.forEach(function(item, index) {
            setTimeout(function() {
                item.classList.add('visible');
            }, index * 100);
        });

        // 加载更多功能
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                // 添加加载状态
                this.classList.add('loading');
                this.querySelector('span').textContent = '加载中...';
                
                // 模拟加载延迟
                setTimeout(function() {
                    loadMoreBtn.querySelector('span').textContent = '没有更多作品了';
                    loadMoreBtn.disabled = true;
                    loadMoreBtn.style.opacity = '0.5';
                }, 1500);
            });
        }

        // 图片悬停效果 - 视差效果
        galleryItems.forEach(function(item) {
            const image = item.querySelector('.item-image');
            
            if (!image) return;

            item.addEventListener('mousemove', function(e) {
                const rect = item.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                image.style.transform = 'scale(1.1) translate(' + (x * -10) + 'px, ' + (y * -10) + 'px)';
            });
            
            item.addEventListener('mouseleave', function() {
                image.style.transform = 'scale(1.1)';
            });
        });
    }

    // ==========================================
    // 灯箱弹窗功能
    // ==========================================
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxTitle = document.getElementById('lightboxTitle');
        const lightboxCategory = document.getElementById('lightboxCategory');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        if (!lightbox || !galleryItems.length) return;

        let currentIndex = 0;
        let visibleItems = [];

        // 更新可见作品列表
        function updateVisibleItems() {
            visibleItems = Array.from(galleryItems).filter(function(item) {
                return !item.classList.contains('hidden');
            });
        }

        // 打开灯箱
        function openLightbox(index) {
            updateVisibleItems();
            currentIndex = index;
            
            const item = visibleItems[currentIndex];
            const image = item.querySelector('.item-image');
            const title = item.querySelector('.item-title');
            const category = item.querySelector('.item-category');
            
            // 获取高清图片 URL
            const imageSrc = image.src.replace('w=800', 'w=1920');
            
            lightboxImage.src = imageSrc;
            lightboxImage.alt = title.textContent;
            lightboxTitle.textContent = title.textContent;
            lightboxCategory.textContent = category.textContent;
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // 动画效果
            gsap.fromTo(lightboxImage, 
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
            );
        }

        // 关闭灯箱
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        // 上一张
        function prevImage() {
            currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
            openLightbox(currentIndex);
        }

        // 下一张
        function nextImage() {
            currentIndex = (currentIndex + 1) % visibleItems.length;
            openLightbox(currentIndex);
        }

        // 绑定事件
        galleryItems.forEach(function(item, index) {
            item.addEventListener('click', function() {
                updateVisibleItems();
                const visibleIndex = visibleItems.indexOf(item);
                openLightbox(visibleIndex);
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', prevImage);
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', nextImage);
        }

        // 键盘导航
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        });

        // 点击背景关闭
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // 触摸滑动支持
        let touchStartX = 0;
        let touchEndX = 0;
        
        lightbox.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        lightbox.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextImage();
                } else {
                    prevImage();
                }
            }
        }
    }

    // ==========================================
    // 联系表单功能
    // ==========================================
    function initContactForm() {
        const form = document.getElementById('contactForm');
        
        if (!form) return;

        // 表单提交
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.querySelector('span').textContent;
            
            // 加载状态
            submitBtn.querySelector('span').textContent = '发送中...';
            submitBtn.disabled = true;
            
            // 模拟提交延迟
            setTimeout(function() {
                // 成功状态
                submitBtn.querySelector('span').textContent = '已发送';
                submitBtn.style.backgroundColor = '#10b981';
                
                // 重置表单
                form.reset();
                
                // 恢复按钮
                setTimeout(function() {
                    submitBtn.querySelector('span').textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        });

        // 输入框动画
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach(function(group) {
            const input = group.querySelector('.form-input');
            
            if (!input) return;

            input.addEventListener('focus', function() {
                group.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                group.classList.remove('focused');
            });
        });
    }

    // ==========================================
    // 滚动动画初始化
    // ==========================================
    function initScrollAnimations() {
        // 数字计数动画
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const numberObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const count = parseInt(target.dataset.count, 10);
                    animateNumber(target, count);
                    numberObserver.unobserve(target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(function(num) {
            numberObserver.observe(num);
        });

        // 作品卡片滚动显现
        const galleryItems = document.querySelectorAll('.gallery-item:not(.visible)');
        
        if (galleryItems.length) {
            const galleryObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            galleryItems.forEach(function(item) {
                galleryObserver.observe(item);
            });
        }

        // 关于区域和联系区域动画
        const animatedSections = document.querySelectorAll('.about-section, .contact-section');
        
        if (animatedSections.length) {
            const sectionObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.2
            });
            
            animatedSections.forEach(function(section) {
                sectionObserver.observe(section);
            });
        }

        // 页脚滚动显现
        const footer = document.querySelector('.main-footer');
        
        if (footer) {
            const footerObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1
            });
            
            footer.style.opacity = '0';
            footer.style.transform = 'translateY(30px)';
            footer.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            footerObserver.observe(footer);
        }
    }

    // ==========================================
    // 数字计数动画
    // ==========================================
    function animateNumber(element, target) {
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 缓动函数
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(startValue + (target - startValue) * easeOutQuart);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }
        
        requestAnimationFrame(update);
    }

    // ==========================================
    // 窗口大小改变处理
    // ==========================================
    window.addEventListener('resize', function() {
        // 移动端禁用自定义光标
        const cursor = document.querySelector('.custom-cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        
        if (window.innerWidth <= 480) {
            if (cursor) cursor.style.display = 'none';
            if (cursorFollower) cursorFollower.style.display = 'none';
        } else {
            if (cursor) cursor.style.display = '';
            if (cursorFollower) cursorFollower.style.display = '';
        }
    });

})();
