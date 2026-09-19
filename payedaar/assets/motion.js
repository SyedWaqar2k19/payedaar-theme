/**
 * Payedaar motion — scroll reveals, staggered children, reduced-motion safe
 */
(() => {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach((el) => {
      el.classList.add('is-revealed');
    });
    return;
  }

  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
  if (!revealEls.length || !('IntersectionObserver' in window)) {
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

  /* Sticky header scroll elevation */
  const premiumHeader = document.querySelector('.site-header--premium');
  if (premiumHeader) {
    const onScroll = () => {
      premiumHeader.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mega menu keyboard + hover open */
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
    const close = () => {
      timer = setTimeout(() => {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }, 120);
    };

    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', close);
    trigger.addEventListener('focus', open);
    panel.addEventListener('focusin', open);
    panel.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) close();
    });
    trigger.addEventListener('click', (e) => {
      if (window.matchMedia('(min-width: 990px)').matches) {
        e.preventDefault();
        item.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', item.classList.contains('is-open') ? 'true' : 'false');
      }
    });
  });
})();
