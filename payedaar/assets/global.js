/**
 * Payedaar Phase 2 — Header drawer, predictive search, sticky UX helpers
 */
(() => {
  'use strict';

  const Payedaar = (window.Payedaar = window.Payedaar || {});
  Payedaar.version = '0.2.0-phase2';
  Payedaar.prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  document.documentElement.classList.add('js-ready');

  const focusableSelector =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function trapFocus(event, container) {
    if (event.key !== 'Tab' || !container) return;
    const items = Array.from(container.querySelectorAll(focusableSelector)).filter(
      (item) => !item.hidden && item.offsetParent !== null
    );
    if (!items.length) {
      event.preventDefault();
      container.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  Payedaar.trapFocus = trapFocus;

  /* -------------------------------------------------------------------- */
  /* Header drawer                                                        */
  /* -------------------------------------------------------------------- */
  const drawer = document.querySelector('[data-header-drawer]');
  if (drawer) {
    const panel = drawer.querySelector('[data-drawer-panel]');
    const openButtons = document.querySelectorAll('[data-drawer-open]');
    const closeButtons = drawer.querySelectorAll('[data-drawer-close]');
    let lastFocus = null;

    const setOpen = (open) => {
      if (open) {
        lastFocus = document.activeElement;
        drawer.hidden = false;
        drawer.setAttribute('aria-hidden', 'false');
        document.body.classList.add('drawer-open');
        openButtons.forEach((btn) => btn.setAttribute('aria-expanded', 'true'));
        requestAnimationFrame(() => drawer.classList.add('is-open'));
        const focusable = panel.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        (focusable || panel).focus();
      } else {
        drawer.classList.remove('is-open');
        openButtons.forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
        document.body.classList.remove('drawer-open');
        const onEnd = () => {
          drawer.hidden = true;
          drawer.setAttribute('aria-hidden', 'true');
          drawer.removeEventListener('transitionend', onEnd);
        };
        drawer.addEventListener('transitionend', onEnd);
        if (lastFocus) lastFocus.focus();
      }
    };

    openButtons.forEach((btn) =>
      btn.addEventListener('click', () => setOpen(true))
    );
    closeButtons.forEach((btn) =>
      btn.addEventListener('click', () => setOpen(false))
    );
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
        setOpen(false);
      } else if (drawer.classList.contains('is-open')) {
        trapFocus(event, panel);
      }
    });
  }

  /* -------------------------------------------------------------------- */
  /* Predictive search                                                    */
  /* -------------------------------------------------------------------- */
  class PredictiveSearch extends HTMLElement {
    constructor() {
      super();
      this.input = this.querySelector('input[type="search"]');
      this.panel = this.querySelector('.predictive-search__panel');
      this.status = this.querySelector('.predictive-search__status');
      this.form = this.querySelector('form');
      this.abortController = null;
      this.debounceTimer = null;
      this.activeIndex = -1;
      this.enabled = this.dataset.enabled !== 'false' && !this.hasAttribute('data-disabled');
      this.limit = this.dataset.limit || '6';
    }

    connectedCallback() {
      if (!this.input || !this.enabled) return;
      this.input.addEventListener('input', this.onInput.bind(this));
      this.input.addEventListener('focus', this.onInput.bind(this));
      document.addEventListener('click', this.onClickOutside.bind(this));
      this.input.addEventListener('keydown', this.onKeydown.bind(this));
    }

    getEndpoint(term) {
      const url = new URL(
        window.themeRoutes?.predictive_search_url || '/search/suggest',
        window.location.origin
      );
      url.searchParams.set('q', term);
      url.searchParams.set('resources[type]', 'product');
      url.searchParams.set('resources[limit]', this.limit);
      url.searchParams.set('section_id', 'predictive-search');
      return url.toString();
    }

    onInput() {
      const term = this.input.value.trim();
      clearTimeout(this.debounceTimer);
      if (!term.length) {
        this.close();
        return;
      }
      this.debounceTimer = setTimeout(() => this.search(term), 280);
    }

    async search(term) {
      if (this.abortController) this.abortController.abort();
      this.abortController = new AbortController();
      this.setLoading(true);
      try {
        const response = await fetch(this.getEndpoint(term), {
          signal: this.abortController.signal,
        });
        if (!response.ok) throw new Error('Search failed');
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const results = doc.querySelector('#predictive-search-results');
        if (results) {
          this.panel.innerHTML = results.outerHTML;
          this.open();
          const count = results.querySelectorAll('.predictive-search__item').length;
          if (this.status) {
            this.status.textContent =
              count > 0
                ? `${count} ${window.themeStrings?.suggestions || 'suggestions'}`
                : window.themeStrings?.noSuggestions || 'No suggestions';
          }
        } else {
          this.close();
        }
      } catch (error) {
        if (error.name !== 'AbortError') this.close();
      } finally {
        this.setLoading(false);
      }
    }

    setLoading(loading) {
      this.classList.toggle('is-loading', loading);
    }

    open() {
      this.panel.hidden = false;
      this.input.setAttribute('aria-expanded', 'true');
      this.classList.add('is-open');
      this.activeIndex = -1;
    }

    close() {
      this.panel.hidden = true;
      this.panel.innerHTML = '';
      this.input.setAttribute('aria-expanded', 'false');
      this.classList.remove('is-open');
      this.activeIndex = -1;
      this.input.removeAttribute('aria-activedescendant');
      if (this.status) this.status.textContent = '';
    }

    onClickOutside(event) {
      if (!this.contains(event.target)) this.close();
    }

    onKeydown(event) {
      if (event.key === 'Escape') {
        this.close();
        this.input.blur();
        return;
      }
      if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key) || this.panel.hidden) return;
      const options = Array.from(this.panel.querySelectorAll('[role="option"]'));
      if (!options.length) return;
      if (event.key === 'Enter' && this.activeIndex >= 0) {
        event.preventDefault();
        options[this.activeIndex].querySelector('a')?.click();
        return;
      }
      if (event.key === 'Enter') return;
      event.preventDefault();
      this.activeIndex =
        event.key === 'ArrowDown'
          ? (this.activeIndex + 1) % options.length
          : (this.activeIndex - 1 + options.length) % options.length;
      options.forEach((option, index) => {
        const active = index === this.activeIndex;
        option.setAttribute('aria-selected', active ? 'true' : 'false');
        option.classList.toggle('is-active', active);
      });
      const active = options[this.activeIndex];
      this.input.setAttribute('aria-activedescendant', active.id);
      active.scrollIntoView({ block: 'nearest' });
    }
  }

  if (!customElements.get('predictive-search')) {
    customElements.define('predictive-search', PredictiveSearch);
  }

  /* -------------------------------------------------------------------- */
  /* Announcement dismiss                                                 */
  /* -------------------------------------------------------------------- */
  const announcement = document.querySelector('[data-announcement-bar][data-dismissible]');
  if (announcement) {
    const key = 'payedaar-announcement-dismissed';
    try {
      if (sessionStorage.getItem(key) === '1') announcement.hidden = true;
    } catch (e) {}
    const dismissBtn = announcement.querySelector('[data-announcement-dismiss]');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        announcement.hidden = true;
        try {
          sessionStorage.setItem(key, '1');
        } catch (e) {}
      });
    }
  }

  /* -------------------------------------------------------------------- */
  /* Scroll to top                                                        */
  /* -------------------------------------------------------------------- */
  const scrollTopBtn = document.querySelector('[data-scroll-top]');
  if (scrollTopBtn) {
    const toggle = () => {
      scrollTopBtn.hidden = window.scrollY < 400;
    };
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: Payedaar.prefersReducedMotion ? 'auto' : 'smooth',
      });
    });
  }

  /* -------------------------------------------------------------------- */
  /* Card press feedback                                                  */
  /* -------------------------------------------------------------------- */
  document.addEventListener(
    'pointerdown',
    (event) => {
      const card = event.target.closest('.card--interactive');
      if (!card || Payedaar.prefersReducedMotion) return;
      card.style.transform = 'scale(0.99)';
    },
    { passive: true }
  );
  const clearCardPress = (event) => {
    const card = event.target.closest('.card--interactive');
    if (card) card.style.transform = '';
  };
  document.addEventListener('pointerup', clearCardPress, { passive: true });
  document.addEventListener('pointercancel', clearCardPress, { passive: true });

  /* -------------------------------------------------------------------- */
  /* Announcement rotator                                                 */
  /* -------------------------------------------------------------------- */
  const rotateBar = document.querySelector('[data-announcement-rotate]');
  if (rotateBar && !Payedaar.prefersReducedMotion) {
    const msgs = Array.from(rotateBar.querySelectorAll('[data-announcement-msg]'));
    const ms = Number(rotateBar.dataset.rotateMs || 4000);
    let i = 0;
    if (msgs.length > 1) {
      window.setInterval(() => {
        msgs[i].hidden = true;
        msgs[i].classList.remove('is-active');
        i = (i + 1) % msgs.length;
        msgs[i].hidden = false;
        msgs[i].classList.add('is-active');
      }, ms);
    }
  }

  /* -------------------------------------------------------------------- */
  /* Account menu                                                         */
  /* -------------------------------------------------------------------- */
  document.querySelectorAll('[data-account-menu]').forEach((wrap) => {
    const trigger = wrap.querySelector('[data-account-menu-trigger]');
    const panel = wrap.querySelector('[data-account-menu-panel]');
    if (!trigger || !panel) return;

    const close = () => {
      panel.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    };
    const open = () => {
      panel.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    };

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (panel.hidden) open();
      else close();
    });

    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        close();
        trigger.focus();
      }
      if (!panel.hidden && ['ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        const items = Array.from(panel.querySelectorAll('[role="menuitem"]'));
        if (!items.length) return;
        const current = items.indexOf(document.activeElement);
        const next =
          e.key === 'ArrowDown'
            ? (current + 1) % items.length
            : (current - 1 + items.length) % items.length;
        items[next].focus();
      }
    });
  });

  /* -------------------------------------------------------------------- */
  /* Track order drawer                                                   */
  /* -------------------------------------------------------------------- */
  class TrackOrderDrawer extends HTMLElement {
    connectedCallback() {
      this.panel = this.querySelector('[data-track-drawer-panel]');
      this.opener = null;
      this._onDocClick = this._onDocClick.bind(this);
      this._onKey = this._onKey.bind(this);
      document.addEventListener('click', this._onDocClick);
      document.addEventListener('keydown', this._onKey);
      this.querySelectorAll('[data-track-drawer-close]').forEach((btn) => {
        btn.addEventListener('click', () => this.close());
      });
    }

    disconnectedCallback() {
      document.removeEventListener('click', this._onDocClick);
      document.removeEventListener('keydown', this._onKey);
      document.body.classList.remove('track-drawer-open');
    }

    _onDocClick(event) {
      const opener = event.target.closest('[data-track-drawer-open]');
      if (!opener) return;
      event.preventDefault();
      this.open(opener);
    }

    _onKey(event) {
      if (!this.classList.contains('is-open')) return;
      if (event.key === 'Escape') this.close();
      else trapFocus(event, this.panel);
    }

    open(opener) {
      this.opener = opener || document.activeElement;
      this.hidden = false;
      this.classList.add('is-open');
      this.setAttribute('aria-hidden', 'false');
      document.body.classList.add('track-drawer-open');
      const focusEl = this.querySelector('[data-track-order-number]') || this.querySelector('[data-track-drawer-close]');
      window.setTimeout(() => focusEl?.focus(), 50);
    }

    close() {
      this.classList.remove('is-open');
      this.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('track-drawer-open');
      window.setTimeout(() => {
        if (!this.classList.contains('is-open')) this.hidden = true;
        this.opener?.focus?.();
      }, 260);
    }
  }

  if (!customElements.get('track-order-drawer')) {
    customElements.define('track-order-drawer', TrackOrderDrawer);
  }

  document.querySelectorAll('[data-track-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const order = form.querySelector('[data-track-order-number]')?.value?.trim() || '';
      const email = form.querySelector('[data-track-email]')?.value?.trim() || '';
      const hint = form.querySelector('[data-track-hint]') || form.parentElement?.querySelector('[data-track-hint]');
      const scope = form.closest('.track-drawer, .section-track-order') || document;
      const wa = scope.querySelector('[data-track-whatsapp]');
      if (wa && order) {
        const base = wa.getAttribute('href').split('?')[0];
        const text = encodeURIComponent(`Hi Payedaar, please help me check order ${order}. Customer email: ${email}`);
        wa.setAttribute('href', `${base}?text=${text}`);
        wa.focus();
      }
      if (hint) {
        hint.textContent = wa
          ? `Your details are ready. Continue on WhatsApp for a support agent to check ${order}.`
          : `For ${order}, use the secure status link in your order confirmation email or sign in to view your orders.`;
        hint.hidden = false;
      }
    });
  });
})();
