/* =========================================
 * Hexo-Blog Purple Animations
 * GSAP Scroll Reveal + 3D Card Tilt
 * ========================================= */

(function () {
    'use strict';

    /* ----- Intersection Observer for Scroll Reveal ----- */
    function initScrollReveal() {
        var cards = document.querySelectorAll('.post-preview-card, .card, .sidebar-block, .post-block, .page-header');
        if (!cards.length) return;

        cards.forEach(function (el, i) {
            el.classList.add('gsap-reveal');
            el.style.transitionDelay = (i * 0.06) + 's';
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        cards.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ----- Banner 标题淡入动画 ----- */
    function initBannerAnimation() {
        var banner = document.querySelector('.index-header, #board .h2, .banner-title');
        if (!banner) return;

        banner.style.opacity = '0';
        banner.style.transform = 'translateY(30px)';
        banner.style.transition = 'opacity 1s cubic-bezier(0.23,1,0.32,1), transform 1s cubic-bezier(0.23,1,0.32,1)';

        setTimeout(function () {
            banner.style.opacity = '1';
            banner.style.transform = 'translateY(0)';
        }, 200);
    }

    /* ----- 导航栏滚动效果 ----- */
    function initNavbarScroll() {
        var navbar = document.querySelector('.navbar');
        if (!navbar) return;

        var lastScroll = 0;
        window.addEventListener('scroll', function () {
            var currentScroll = window.pageYOffset;
            if (currentScroll > 100) {
                navbar.style.boxShadow = '0 10px 40px rgba(126,90,220,0.2)';
                navbar.style.backdropFilter = 'blur(25px)';
            } else {
                navbar.style.boxShadow = '0 10px 40px rgba(126,90,220,0.15)';
                navbar.style.backdropFilter = 'blur(20px)';
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    /* ----- 链接悬停光标跟随效果 ----- */
    function initLinkGlow() {
        document.querySelectorAll('.post-preview-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                card.style.setProperty('--glow-x', x + 'px');
                card.style.setProperty('--glow-y', y + 'px');
            });
        });
    }

    /* ----- 返回顶部按钮增强 ----- */
    function initScrollTop() {
        var btn = document.querySelector('.scroll-top-btn, .go-up-btn, [class*="back-to-top"]');
        if (!btn) return;

        btn.classList.add('scroll-top-btn');
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            } else {
                btn.style.opacity = '0';
                btn.style.pointerEvents = 'none';
            }
        }, { passive: true });

        btn.style.transition = 'opacity 0.3s ease, transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease';
        btn.style.opacity = '0';
        btn.style.pointerEvents = 'none';
    }

    /* ----- 平滑滚动 ----- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    /* ----- 卡片光晕跟随 (CSS variable) ----- */
    var cardStyle = document.createElement('style');
    cardStyle.textContent = [
        '.post-preview-card {',
        '  position: relative;',
        '  overflow: hidden;',
        '}',
        '.post-preview-card::after {',
        '  content: "";',
        '  position: absolute;',
        '  top: var(--glow-y, 50%);',
        '  left: var(--glow-x, 50%);',
        '  width: 200px;',
        '  height: 200px;',
        '  background: radial-gradient(circle, rgba(126,90,220,0.15) 0%, transparent 70%);',
        '  transform: translate(-50%, -50%);',
        '  pointer-events: none;',
        '  z-index: 0;',
        '  opacity: 0;',
        '  transition: opacity 0.3s ease;',
        '}',
        '.post-preview-card:hover::after {',
        '  opacity: 1;',
        '}'
    ].join('\n');
    document.head.appendChild(cardStyle);

    /* ----- 初始化 ----- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initScrollReveal();
        initBannerAnimation();
        initNavbarScroll();
        initLinkGlow();
        initScrollTop();
        initSmoothScroll();
    }

    /* Hexo PJAX 兼容 */
    if (typeof window.pjax !== 'undefined' || document.querySelector('[data-pjax]')) {
        document.addEventListener('pjax:complete', init);
    }
})();
