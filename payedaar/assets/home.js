/**
 * Payedaar Phase 4 — Homepage: hero slider, countdown, coupon copy
 */
(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------------------- */
  /* Hero slider                                                          */
  /* -------------------------------------------------------------------- */
  document.querySelectorAll('[data-hero-slider]').forEach((root) => {
    const slides = Array.from(root.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(root.querySelectorAll('[data-hero-dot]'));
    if (slides.length < 2) return;

    let index = 0;
    let timer = null;
    const autoplay = root.dataset.autoplay === 'true' && !reducedMotion;
    const speed = Number(root.dataset.autoplaySpeed || 5000);

    const show = (next) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === index;
        slide.classList.toggle('is-active', active);
        slide.hidden = !active;
      });
      dots.forEach((dot, i) => {
        const active = i === index;
        dot.classList.toggle('is-active', active);
        if (active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    };

    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    const start = () => {
      stop();
      if (!autoplay) return;
      timer = window.setInterval(() => show(index + 1), speed);
    };

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        show(Number(dot.dataset.index || 0));
        start();
      });
    });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    show(0);
    start();
  });

  /* -------------------------------------------------------------------- */
  /* Deal countdown                                                       */
  /* -------------------------------------------------------------------- */
  class DealCountdown extends HTMLElement {
    connectedCallback() {
      this.live = this.querySelector('[data-countdown-live]');
      this.ended = this.querySelector('[data-countdown-ended]');
      this.days = this.querySelector('[data-days]');
      this.hours = this.querySelector('[data-hours]');
      this.minutes = this.querySelector('[data-minutes]');
      this.seconds = this.querySelector('[data-seconds]');

      const raw = this.dataset.end;
      this.endMs = Date.parse(raw || '');
      if (!raw || Number.isNaN(this.endMs)) {
        this.showEnded();
        return;
      }

      this.tick = this.tick.bind(this);
      this.tick();
      this.timer = window.setInterval(this.tick, 1000);
    }

    disconnectedCallback() {
      if (this.timer) window.clearInterval(this.timer);
    }

    pad(n) {
      return String(Math.max(0, n)).padStart(2, '0');
    }

    tick() {
      const diff = this.endMs - Date.now();
      if (diff <= 0) {
        this.showEnded();
        return;
      }
      const totalSec = Math.floor(diff / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;
      if (this.days) this.days.textContent = this.pad(days);
      if (this.hours) this.hours.textContent = this.pad(hours);
      if (this.minutes) this.minutes.textContent = this.pad(minutes);
      if (this.seconds) this.seconds.textContent = this.pad(seconds);
    }

    showEnded() {
      if (this.timer) {
        window.clearInterval(this.timer);
        this.timer = null;
      }
      this.classList.add('is-ended');
      if (this.live) this.live.hidden = true;
      if (this.ended) this.ended.hidden = false;
    }
  }

  if (!customElements.get('deal-countdown')) {
    customElements.define('deal-countdown', DealCountdown);
  }

  /* -------------------------------------------------------------------- */
  /* Coupon copy                                                          */
  /* -------------------------------------------------------------------- */
  document.querySelectorAll('[data-copy-code]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const code = btn.dataset.copyCode || '';
      if (!code) return;
      const label = btn.querySelector('[data-copy-label]');
      const original = label?.textContent || code;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(code);
        } else {
          const input = document.createElement('input');
          input.value = code;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          input.remove();
        }
        btn.classList.add('is-copied');
        if (label) label.textContent = window.themeStrings?.copied || 'Copied!';
        window.setTimeout(() => {
          btn.classList.remove('is-copied');
          if (label) label.textContent = original;
        }, 1600);
      } catch (error) {
        console.error('[Payedaar coupon]', error);
      }
    });
  });
})();
