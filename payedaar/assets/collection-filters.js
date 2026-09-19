/**
 * Payedaar Phase 5 — Ajax Storefront Filtering (Section Rendering API)
 * Progressive enhancement: forms still work without JS via full page submit (noscript).
 */
(() => {
  'use strict';

  const DEBOUNCE_MS = 350;
  const PRICE_DEBOUNCE_MS = 500;
  const DESKTOP_MQ = window.matchMedia('(min-width: 990px)');

  function debounce(fn, wait) {
    let t;
    return (...args) => {
      window.clearTimeout(t);
      t = window.setTimeout(() => fn.apply(null, args), wait);
    };
  }

  function focusables(root) {
    return Array.from(
      root.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('hidden') && el.offsetParent !== null);
  }

  /* -------------------------------------------------------------------- */
  /* Facet drawer (mobile modal, desktop sidebar)                         */
  /* -------------------------------------------------------------------- */
  class FacetDrawer extends HTMLElement {
    constructor() {
      super();
      this.onKeydown = this.onKeydown.bind(this);
      this.onOpenClick = this.onOpenClick.bind(this);
    }

    connectedCallback() {
      this.panel = this.querySelector('[data-facet-drawer-panel]');
      this.querySelectorAll('[data-facet-drawer-close]').forEach((el) => {
        el.addEventListener('click', () => this.close());
      });
      document.addEventListener('click', this.onOpenClick);
    }

    disconnectedCallback() {
      document.removeEventListener('click', this.onOpenClick);
      document.removeEventListener('keydown', this.onKeydown);
      document.body.classList.remove('facet-drawer-open');
    }

    onOpenClick(event) {
      const opener = event.target.closest('[data-facet-drawer-open]');
      if (!opener) return;
      const controls = opener.getAttribute('aria-controls');
      if (controls !== this.id) return;
      event.preventDefault();
      this.open(opener);
    }

    get isDesktop() {
      return DESKTOP_MQ.matches;
    }

    open(opener) {
      if (this.isDesktop) return;
      this._opener = opener || document.activeElement;
      this.classList.add('is-open');
      this.removeAttribute('hidden');
      document.body.classList.add('facet-drawer-open');
      document.addEventListener('keydown', this.onKeydown);
      document.querySelectorAll('[data-facet-drawer-open]').forEach((btn) => {
        if (btn.getAttribute('aria-controls') === this.id) {
          btn.setAttribute('aria-expanded', 'true');
        }
      });
      window.requestAnimationFrame(() => {
        const closeBtn = this.querySelector('[data-facet-drawer-close]:not(.facet-drawer__overlay)');
        (closeBtn || this.panel)?.focus?.();
      });
    }

    close() {
      this.classList.remove('is-open');
      document.body.classList.remove('facet-drawer-open');
      document.removeEventListener('keydown', this.onKeydown);
      document.querySelectorAll('[data-facet-drawer-open]').forEach((btn) => {
        if (btn.getAttribute('aria-controls') === this.id) {
          btn.setAttribute('aria-expanded', 'false');
        }
      });
      if (this._opener && typeof this._opener.focus === 'function') {
        this._opener.focus();
      }
    }

    onKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.close();
        return;
      }
      if (event.key !== 'Tab' || !this.classList.contains('is-open')) return;
      const nodes = focusables(this.panel || this);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  /* -------------------------------------------------------------------- */
  /* Facets form + section rendering                                      */
  /* -------------------------------------------------------------------- */
  class FacetsForm extends HTMLElement {
    connectedCallback() {
      this.form = this.querySelector('form');
      this.sectionId = this.dataset.sectionId;
      this.baseUrl = this.dataset.url || window.location.pathname;
      this.root = this.closest('[data-facets-root]') || document.getElementById('ProductGridContainer');
      this.cache = new Map();
      this.abort = null;

      if (!this.form || !this.sectionId) return;

      this.onSubmit = this.onSubmit.bind(this);
      this.onRootClick = this.onRootClick.bind(this);
      this.onSortChange = this.onSortChange.bind(this);
      this.onPopState = this.onPopState.bind(this);

      this.form.addEventListener('submit', this.onSubmit);
      this.debouncedFilter = debounce((event) => this.renderPage(this.buildSearchParams(event), true), DEBOUNCE_MS);
      this.debouncedPrice = debounce((event) => this.renderPage(this.buildSearchParams(event), true), PRICE_DEBOUNCE_MS);

      this.form.addEventListener('input', (event) => {
        const isPrice = event.target.closest('[data-price-range]');
        if (isPrice) this.debouncedPrice(event);
        else if (event.target.matches('input, select')) this.debouncedFilter(event);
      });
      this.form.addEventListener('change', (event) => {
        if (event.target.matches('input[type="checkbox"], input[type="radio"], select')) {
          this.renderPage(this.buildSearchParams(event), true);
        }
      });

      if (this.root) {
        this.root.addEventListener('click', this.onRootClick);
        this.root.querySelectorAll('[data-facet-sort]').forEach((select) => {
          select.addEventListener('change', this.onSortChange);
        });
      }

      window.addEventListener('popstate', this.onPopState);
    }

    disconnectedCallback() {
      window.removeEventListener('popstate', this.onPopState);
      if (this.root) this.root.removeEventListener('click', this.onRootClick);
      if (this.abort) this.abort.abort();
    }

    onSubmit(event) {
      event.preventDefault();
      this.renderPage(this.buildSearchParams(), true);
    }

    onSortChange(event) {
      const select = event.target;
      const hidden = this.form.querySelector('[data-facet-sort-input]');
      if (hidden) hidden.value = select.value;
      else {
        let input = this.form.querySelector('input[name="sort_by"]');
        if (!input && select.name === 'sort_by') {
          /* sort-only form */
        }
      }
      this.renderPage(this.buildSearchParams(), true);
    }

    onRootClick(event) {
      const remove = event.target.closest('[data-facet-remove], [data-facet-clear]');
      if (remove) {
        event.preventDefault();
        const url = new URL(remove.href, window.location.origin);
        this.renderPage(url.searchParams, true);
        return;
      }
      const pageLink = event.target.closest('[data-facets-page]');
      if (pageLink) {
        event.preventDefault();
        const url = new URL(pageLink.href, window.location.origin);
        this.renderPage(url.searchParams, true);
      }
    }

    onPopState() {
      const params = new URLSearchParams(window.location.search);
      this.renderPage(params, false);
    }

    buildSearchParams(event) {
      const formData = new FormData(this.form);
      const params = new URLSearchParams();

      for (const [key, value] of formData.entries()) {
        if (value === '' || value == null) continue;
        params.append(key, value);
      }

      // Ensure sort from external select is included
      const sortSelect = this.root?.querySelector('[data-facet-sort]');
      if (sortSelect?.value) {
        params.set('sort_by', sortSelect.value);
      }

      // Never keep page when filters change (except explicit pagination)
      if (!event?.target?.closest?.('[data-facets-page]')) {
        params.delete('page');
      }

      return params;
    }

    setBusy(busy) {
      const grid = this.root?.querySelector('[data-product-grid]');
      if (grid) grid.setAttribute('aria-busy', busy ? 'true' : 'false');
      this.root?.classList.toggle('is-loading', busy);
    }

    async renderPage(searchParams, push) {
      if (!this.root) return;
      const params = searchParams instanceof URLSearchParams ? searchParams : new URLSearchParams(searchParams);
      const qs = params.toString();
      const historyUrl = qs ? `${this.baseUrl}?${qs}` : this.baseUrl;
      const sectionParams = new URLSearchParams(params);
      sectionParams.set('section_id', this.sectionId);
      const fetchUrl = `${this.baseUrl}?${sectionParams.toString()}`;

      if (this.abort) this.abort.abort();
      this.abort = new AbortController();
      this.setBusy(true);

      try {
        let html = this.cache.get(fetchUrl);
        if (!html) {
          const res = await fetch(fetchUrl, {
            signal: this.abort.signal,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'same-origin',
          });
          if (!res.ok) throw new Error('Facet section fetch failed');
          html = await res.text();
          this.cache.set(fetchUrl, html);
        }

        this.applySectionHtml(html);

        if (push) {
          window.history.pushState({ facets: true }, '', historyUrl);
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('[Payedaar facets]', error);
        // Fallback: full navigation
        window.location.href = historyUrl;
      } finally {
        this.setBusy(false);
      }
    }

    applySectionHtml(html) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const nextRoot =
        doc.querySelector('[data-facets-root]') ||
        doc.querySelector('#ProductGridContainer') ||
        doc.getElementById(`shopify-section-${this.sectionId}`);

      if (!nextRoot) return;

      const openIndexes = Array.from(this.root.querySelectorAll('details.js-filter[open]')).map(
        (el) => el.dataset.index
      );

      const swap = (selector) => {
        const current = this.root.querySelector(selector);
        const incoming = nextRoot.querySelector(selector);
        if (current && incoming) current.innerHTML = incoming.innerHTML;
        else if (current && !incoming) current.innerHTML = '';
      };

      // Full filters replace (counts change)
      const filtersCurrent = this.root.querySelector('[data-facets-filters]');
      const filtersNext = nextRoot.querySelector('[data-facets-filters]');
      if (filtersCurrent && filtersNext) {
        filtersCurrent.innerHTML = filtersNext.innerHTML;
        filtersCurrent.querySelectorAll('details.js-filter').forEach((el) => {
          if (openIndexes.includes(el.dataset.index)) el.setAttribute('open', '');
        });
      }

      const gridCurrent = this.root.querySelector('[data-product-grid]');
      const gridNext = nextRoot.querySelector('[data-product-grid]');
      if (gridCurrent && gridNext) {
        gridCurrent.innerHTML = gridNext.innerHTML;
        gridCurrent.className = gridNext.className;
      }

      swap('[data-facets-active-wrap]');
      // count is text node container
      const countCurrent = this.root.querySelector('[data-facets-count]');
      const countNext = nextRoot.querySelector('[data-facets-count]');
      if (countCurrent && countNext) countCurrent.innerHTML = countNext.innerHTML;

      swap('[data-facets-pagination-wrap]');

      // Active filter counts on buttons
      const nextCounts = nextRoot.querySelectorAll('[data-facet-active-count]');
      this.root.querySelectorAll('[data-facet-active-count]').forEach((el, i) => {
        const src = nextCounts[i] || nextRoot.querySelector('[data-facet-active-count]');
        if (!src) return;
        el.innerHTML = src.innerHTML;
        if (src.hasAttribute('hidden')) el.setAttribute('hidden', '');
        else el.removeAttribute('hidden');
      });

      // Sync sort selects
      const nextSort = nextRoot.querySelector('[data-facet-sort]');
      this.root.querySelectorAll('[data-facet-sort]').forEach((select) => {
        if (nextSort) select.value = nextSort.value;
        const hidden = this.form.querySelector('[data-facet-sort-input]');
        if (hidden) hidden.value = select.value;
      });

      // Rebind sort listeners on replaced nodes if any
      this.root.querySelectorAll('[data-facet-sort]').forEach((select) => {
        select.removeEventListener('change', this.onSortChange);
        select.addEventListener('change', this.onSortChange);
      });
    }
  }

  if (!customElements.get('facet-drawer')) {
    customElements.define('facet-drawer', FacetDrawer);
  }
  if (!customElements.get('facets-form')) {
    customElements.define('facets-form', FacetsForm);
  }
})();
