/* =========================================
 * Hexo-Blog Purple Animations v2
 * 复刻 lishenghua.com 交互动效
 * ========================================= */

(function () {
    'use strict';

    /* ----- IntersectionObserver 滚动入场 ----- */
    function initScrollReveal() {
        var targets = document.querySelectorAll('.index-card, .post-block, .card, .widget, .post-content, .page-content');
        if (!targets.length) return;

        targets.forEach(function (el, i) {
            el.classList.add('gsap-reveal');
            el.style.transitionDelay = (i * 0.07) + 's';
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -50px 0px'
        });

        targets.forEach(function (el) { observer.observe(el); });
    }

    /* ----- Banner 标题淡入 ----- */
    function initBannerAnimation() {
        var banner = document.querySelector('.index-header');
        if (!banner) return;
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(25px)';
        banner.style.transition = 'opacity 0.9s cubic-bezier(0.23,1,0.32,1), transform 0.9s cubic-bezier(0.23,1,0.32,1)';
        setTimeout(function () {
            banner.style.opacity = '1';
            banner.style.transform = 'translateY(0)';
        }, 150);
    }

    /* ----- 导航栏滚动效果 ----- */
    function initNavbarScroll() {
        var navbar = document.querySelector('.navbar');
        if (!navbar) return;
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    /* ----- 卡片光晕跟随 ----- */
    function initCardGlow() {
        var style = document.createElement('style');
        style.textContent = [
            '.index-card { position: relative; overflow: hidden; }',
            '.index-card .card-glow {',
            '  position: absolute;',
            '  width: 250px; height: 250px;',
            '  background: radial-gradient(circle, rgba(126,90,220,0.18) 0%, transparent 70%);',
            '  border-radius: 50%;',
            '  transform: translate(-50%, -50%);',
            '  pointer-events: none;',
            '  z-index: 0;',
            '  opacity: 0;',
            '  transition: opacity 0.3s ease;',
            '}',
            '.index-card:hover .card-glow { opacity: 1; }'
        ].join('\n');
        document.head.appendChild(style);

        document.querySelectorAll('.index-card').forEach(function (card) {
            var glow = document.createElement('div');
            glow.className = 'card-glow';
            card.appendChild(glow);

            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                glow.style.left = (e.clientX - rect.left) + 'px';
                glow.style.top = (e.clientY - rect.top) + 'px';
            });
        });
    }

    /* ----- 返回顶部按钮 ----- */
    function initScrollTop() {
        var btn = document.querySelector('#go-up, .scroll-top-btn, .go-up-btn, [class*="back-to-top"]');
        if (!btn) return;
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

    /* ----- 平滑锚点滚动 ----- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    /* ========================================= */
    function init() {
        initScrollReveal();
        initBannerAnimation();
        initNavbarScroll();
        initCardGlow();
        initScrollTop();
        initSmoothScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* PJAX 兼容 */
    if (typeof window.pjax !== 'undefined' || document.querySelector('[data-pjax]')) {
        document.addEventListener('pjax:complete', init);
    }
})();
