/**
 * Payedaar motion — mega nav, sticky header, scroll reveals
 */
(() => {
  'use strict';

  const initMegaNav = () => {
    document.querySelectorAll('[data-nav-mega]').forEach((item) => {
      const trigger = item.querySelector('[data-nav-mega-trigger]');
      const panel = item.querySelector('[data-nav-mega-panel]');
      if (!trigger || !panel) return;

      let timer = null;
      const open = () => {
        clearTimeout(timer);
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      };
      const close = (immediate) => {
        clearTimeout(timer);
        const hide = () => {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        };
        if (immediate) hide();
        else timer = setTimeout(hide, 120);
      };

      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', () => close(false));
      trigger.addEventListener('focus', open);
      panel.addEventListener('focusin', open);
      panel.addEventListener('focusout', (e) => {
        if (!item.contains(e.relatedTarget)) close(false);
      });
      trigger.addEventListener('click', (e) => {
        if (window.matchMedia('(min-width: 990px)').matches) {
          e.preventDefault();
          if (item.classList.contains('is-open')) close(true);
          else open();
        }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && item.classList.contains('is-open')) {
          close(true);
          trigger.focus();
        }
      });
    });
  };

  const initStickyHeader = () => {
    const premiumHeader = document.querySelector('.site-header--premium');
    if (!premiumHeader) return;
    const onScroll = () => {
      premiumHeader.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  };

  initMegaNav();
  initStickyHeader();

  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
  if (!revealEls.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );

  revealEls.forEach((el) => io.observe(el));
})();
