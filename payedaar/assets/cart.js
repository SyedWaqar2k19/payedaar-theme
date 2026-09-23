/**
 * Payedaar Phase 3 — Cart drawer + Ajax add to cart
 */
(() => {
  'use strict';

  const routes = window.themeRoutes || {};
  const strings = window.themeStrings || {};
  const PUB_SUB = (window.Payedaar = window.Payedaar || {});
  PUB_SUB.version = '0.3.0-phase3';

  const cartAddUrl = (routes.cart_add_url || '/cart/add').replace(/\.js$/, '') + '.js';
  const cartChangeUrl = (routes.cart_change_url || '/cart/change').replace(/\.js$/, '') + '.js';
  const cartUrl = routes.cart_url || '/cart';
  const SECTION_ID = 'cart-drawer';

  function parseSectionHtml(sectionsHtml, sectionId) {
    if (!sectionsHtml || !sectionsHtml[sectionId]) return null;
    const doc = new DOMParser().parseFromString(sectionsHtml[sectionId], 'text/html');
    return doc.querySelector(`#shopify-section-${sectionId}`) || doc.body;
  }

  function cartCountLabel(count) {
    const n = Number(count) || 0;
    const template = n === 1 ? strings.cartCountOne : strings.cartCountOther;
    if (!template) return `${n} item${n === 1 ? '' : 's'} in cart`;
    return template.replace(/COUNT/g, String(n)).replace(/\{\{\s*count\s*\}\}/g, String(n));
  }

  function updateCartCounts(count) {
    const n = Number(count) || 0;
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      const num = el.querySelector('[data-cart-count-number]');
      if (num) num.textContent = String(n);
      const label = el.querySelector('[data-cart-count-label]');
      if (label) label.textContent = cartCountLabel(n);
      if (n > 0) {
        el.classList.remove('is-empty');
        el.removeAttribute('hidden');
      } else {
        el.classList.add('is-empty');
        el.setAttribute('hidden', '');
      }
    });
    document.querySelectorAll('[data-cart-drawer-count]').forEach((el) => {
      el.textContent = `(${n})`;
    });
  }

  let cartBusyCount = 0;

  function formatCartMoney(cents) {
    const format = window.themeMoneyFormat || 'Rs. {{amount}}';
    if (window.Shopify?.formatMoney) {
      return window.Shopify.formatMoney(cents, format);
    }
    const amount = (Number(cents) / 100).toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return format.replace(/\{\{\s*amount[^}]*\}\}/g, amount);
  }

  function setCheckoutBusy(busy) {
    document.querySelectorAll('[data-cart-checkout]').forEach((el) => {
      if (el.tagName === 'BUTTON' || el.tagName === 'INPUT') {
        el.disabled = Boolean(busy);
      }
      if (busy) el.setAttribute('aria-disabled', 'true');
      else el.removeAttribute('aria-disabled');
    });
  }

  function setCartBusy(busy, row) {
    cartBusyCount += busy ? 1 : -1;
    if (cartBusyCount < 0) cartBusyCount = 0;
    if (row) row.classList.toggle('is-updating', Boolean(busy));
    setCheckoutBusy(cartBusyCount > 0);
  }

  function applyDrawerFromCart(cart) {
    if (!cart || !Array.isArray(cart.items)) return;
    document.querySelectorAll('[data-cart-item][data-key]').forEach((row) => {
      const key = row.getAttribute('data-key');
      const item = cart.items.find((entry) => entry.key === key);
      if (!item) {
        row.remove();
        return;
      }
      const priceEl = row.querySelector('[data-cart-drawer-line-price]');
      if (priceEl) {
        let html = formatCartMoney(item.final_line_price);
        if (item.original_line_price > item.final_line_price) {
          html += ` <s class="cart-drawer__compare text-muted">${formatCartMoney(item.original_line_price)}</s>`;
        }
        priceEl.innerHTML = html;
      }
      const input = row.querySelector('[data-qty-input]');
      if (input) input.value = String(item.quantity);
    });
    const subtotal = document.querySelector('[data-cart-subtotal]');
    if (subtotal) subtotal.textContent = formatCartMoney(cart.total_price);
    const count = document.querySelector('[data-cart-drawer-count]');
    if (count) count.textContent = `(${cart.item_count ?? 0})`;
  }

  async function fetchCart() {
    const res = await fetch(`${cartUrl}.js`, {
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
    });
    if (!res.ok) throw new Error('Cart fetch failed');
    return res.json();
  }

  class CartDrawer extends HTMLElement {
    constructor() {
      super();
      this.panel = null;
      this._opener = null;
      this._lineQueue = Promise.resolve();
      this._onKeydown = this._onKeydown.bind(this);
      this._onDocumentClick = this._onDocumentClick.bind(this);
    }

    connectedCallback() {
      this.panel = this.querySelector('[data-cart-drawer-panel]');
      this.setAttribute('aria-hidden', this.classList.contains('is-open') ? 'false' : 'true');
      this.bindInternal();
      document.addEventListener('click', this._onDocumentClick);
    }

    disconnectedCallback() {
      document.removeEventListener('click', this._onDocumentClick);
      document.removeEventListener('keydown', this._onKeydown);
      document.body.classList.remove('cart-drawer-open');
    }

    _onDocumentClick(event) {
      const opener = event.target.closest('[data-cart-drawer-open]');
      if (!opener) return;
      if (opener.hasAttribute('data-cart-drawer-allow-nav')) return;
      event.preventDefault();
      this.open(opener);
    }

    bindInternal() {
      this.querySelectorAll('[data-cart-drawer-close]').forEach((btn) => {
        btn.addEventListener('click', () => this.close());
      });

      this.querySelectorAll('[data-qty-minus]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const line = Number(btn.dataset.line);
          const input = this.querySelector(`[data-qty-input][data-line="${line}"]`);
          const next = Math.max(0, Number(input?.value || 1) - 1);
          this.changeLine(line, next);
        });
      });

      this.querySelectorAll('[data-qty-plus]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const line = Number(btn.dataset.line);
          const input = this.querySelector(`[data-qty-input][data-line="${line}"]`);
          const max = Number(input?.max || 0);
          let next = Number(input?.value || 0) + 1;
          if (max > 0) next = Math.min(max, next);
          this.changeLine(line, next);
        });
      });

      this.querySelectorAll('[data-qty-remove]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const line = Number(btn.dataset.line);
          this.changeLine(line, 0);
        });
      });

      this.querySelectorAll('[data-qty-input]').forEach((input) => {
        input.addEventListener('change', () => {
          const line = Number(input.dataset.line);
          let next = Math.max(0, Number(input.value || 0));
          const max = Number(input.max || 0);
          if (max > 0) next = Math.min(max, next);
          input.value = String(next);
          this.changeLine(line, next);
        });
      });
    }

    open(opener) {
      if (opener instanceof HTMLElement) this._opener = opener;
      else if (!this._opener) this._opener = document.activeElement;
      this.classList.add('is-open');
      this.removeAttribute('hidden');
      this.setAttribute('aria-hidden', 'false');
      document.body.classList.add('cart-drawer-open');
      document.addEventListener('keydown', this._onKeydown);
      window.requestAnimationFrame(() => {
        const closeBtn = this.querySelector('[data-cart-drawer-close]:not(.cart-drawer__overlay)');
        (closeBtn || this.panel)?.focus?.();
      });
    }

    close() {
      this.classList.remove('is-open');
      this.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('cart-drawer-open');
      document.removeEventListener('keydown', this._onKeydown);
      const opener = this._opener;
      window.setTimeout(() => {
        if (!this.classList.contains('is-open')) this.setAttribute('hidden', '');
        if (opener && typeof opener.focus === 'function') opener.focus();
      }, 280);
    }

    _onKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.close();
      } else if (window.Payedaar?.trapFocus) {
        window.Payedaar.trapFocus(event, this.panel);
      }
    }

    showError(message) {
      const region = this.querySelector('[data-cart-error]');
      if (!region) return;
      region.textContent = message || strings.addToCartError || 'Something went wrong. Please try again.';
      region.hidden = false;
      region.focus?.();
    }

    clearError() {
      const region = this.querySelector('[data-cart-error]');
      if (region) {
        region.textContent = '';
        region.hidden = true;
      }
    }

    async renderFromSections(sectionsHtml) {
      const sectionEl = parseSectionHtml(sectionsHtml, SECTION_ID);
      if (!sectionEl) return false;
      const nextDrawer =
        sectionEl.querySelector('cart-drawer') || sectionEl.querySelector('[data-cart-drawer]');
      if (!nextDrawer) return false;
      const wasOpen = this.classList.contains('is-open');
      this.innerHTML = nextDrawer.innerHTML;
      if (nextDrawer.hasAttribute('data-empty')) this.setAttribute('data-empty', '');
      else this.removeAttribute('data-empty');
      this.panel = this.querySelector('[data-cart-drawer-panel]');
      this.bindInternal();
      if (wasOpen) {
        this.classList.add('is-open');
        this.removeAttribute('hidden');
        this.setAttribute('aria-hidden', 'false');
      }
      return true;
    }

    changeLine(line, quantity) {
      if (!line || line < 1) return;
      this._lineQueue = this._lineQueue
        .then(() => this._changeLine(line, quantity))
        .catch((error) => {
          console.error('[Payedaar cart]', error);
        });
      return this._lineQueue;
    }

    async _changeLine(line, quantity) {
      const row = this.querySelector(`[data-qty-input][data-line="${line}"]`)?.closest('[data-cart-item]');
      setCartBusy(true, row);
      this.clearError();
      try {
        const needsRebuild = quantity === 0;
        const res = await fetch(cartChangeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify(
            needsRebuild
              ? {
                  line,
                  quantity,
                  sections: SECTION_ID,
                  sections_url: window.location.pathname,
                }
              : { line, quantity }
          ),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.description || data.message || 'Cart change failed');
        }
        updateCartCounts(data.item_count ?? 0);
        if (needsRebuild || !data.item_count) {
          if (data.sections) {
            const ok = await this.renderFromSections(data.sections);
            if (!ok) await this.refresh();
          } else {
            await this.refresh();
          }
        } else {
          applyDrawerFromCart(data);
        }
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: { action: 'change', cart: data } }));
      } catch (error) {
        this.showError(error.message);
        throw error;
      } finally {
        setCartBusy(false, row);
      }
    }

    async refresh() {
      try {
        const res = await fetch(`${window.location.pathname}?sections=${SECTION_ID}`, {
          headers: { Accept: 'application/json' },
          credentials: 'same-origin',
        });
        if (!res.ok) throw new Error('Section refresh failed');
        const sections = await res.json();
        await this.renderFromSections(sections);
        const cart = await fetchCart();
        updateCartCounts(cart.item_count || 0);
      } catch (error) {
        console.error('[Payedaar cart refresh]', error);
      }
    }
  }

  class ProductForm extends HTMLElement {
    connectedCallback() {
      this.form = this.querySelector('form');
      this.button = this.querySelector('[data-add-to-cart]');
      this.buttonText = this.querySelector('[data-add-to-cart-text]');
      this.buyNowBtn = this.querySelector('[data-buy-now]');
      this.buyNowText = this.querySelector('[data-buy-now-text]');
      this.spinner = this.querySelector('.product-form__spinner');
      this._busy = false;
      this._available = this.button ? !this.button.disabled : true;
      if (!this.form) return;

      this.form.addEventListener('submit', this.onSubmit.bind(this));
      this.buyNowBtn?.addEventListener('click', this.onBuyNow.bind(this));

      const variantSelect = this.form.querySelector('[data-product-variant-select]');
      if (variantSelect) {
        variantSelect.addEventListener('change', () => this.onVariantChange(variantSelect));
        this.onVariantChange(variantSelect);
      }
    }

    onVariantChange(select) {
      const option = select.options[select.selectedIndex];
      if (!option || !this.button) return;
      const available = option.dataset.available !== 'false' && !option.disabled;
      this._available = available;
      this.button.disabled = !available;
      if (this.buyNowBtn) this.buyNowBtn.disabled = !available;
      if (this.buttonText && !this._showAdded) {
        this.buttonText.textContent = available
          ? strings.addToCart || 'Add to Cart'
          : strings.soldOut || 'Sold out';
      }
      if (this.buyNowText) {
        this.buyNowText.textContent = available
          ? strings.buyNow || 'Buy Now'
          : strings.soldOut || 'Sold out';
      }
    }

    setLoading(loading) {
      if (!this.button) return;
      this.button.setAttribute('aria-busy', loading ? 'true' : 'false');
      if (this.buyNowBtn) this.buyNowBtn.setAttribute('aria-busy', loading ? 'true' : 'false');
      if (this.spinner) this.spinner.hidden = !loading;
      this.classList.toggle('is-loading', loading);
      if (loading) {
        this.button.setAttribute('disabled', '');
        this.buyNowBtn?.setAttribute('disabled', '');
        return;
      }
      const select = this.form?.querySelector('[data-product-variant-select]');
      if (select) {
        const option = select.options[select.selectedIndex];
        const available = option && option.dataset.available !== 'false' && !option.disabled;
        this._available = Boolean(available);
        this.button.disabled = !available;
        if (this.buyNowBtn) this.buyNowBtn.disabled = !available;
      } else if (this._available === false) {
        this.button.setAttribute('disabled', '');
        this.buyNowBtn?.setAttribute('disabled', '');
      } else {
        this.button.removeAttribute('disabled');
        this.buyNowBtn?.removeAttribute('disabled');
      }
    }

    checkoutUrl() {
      const root = (window.themeRoutes?.root_url || '/').replace(/\/?$/, '/');
      return `${root}checkout`;
    }

    async addToCart(options = {}) {
      const { redirectCheckout = false } = options;
      if (!this.form || this._busy || this.button?.disabled) return false;

      const formData = new FormData(this.form);
      const id = Number(formData.get('id'));
      if (!id) {
        document.querySelector('cart-drawer')?.showError(strings.addToCartError || 'Could not add to cart');
        return false;
      }

      formData.set('sections', SECTION_ID);
      formData.set('sections_url', window.location.pathname);

      this._busy = true;
      this.setLoading(true);
      let added = false;
      try {
        const res = await fetch(cartAddUrl, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          credentials: 'same-origin',
          body: formData,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.description || data.message || strings.addToCartError || 'Add to cart failed');
        }

        if (redirectCheckout) {
          added = true;
          window.location.href = this.checkoutUrl();
          return true;
        }

        const drawer = document.querySelector('cart-drawer');
        if (drawer) {
          if (data.sections) {
            const ok = await drawer.renderFromSections(data.sections);
            if (!ok) await drawer.refresh();
          } else {
            await drawer.refresh();
          }
        }

        const cart = await fetchCart();
        updateCartCounts(cart.item_count || 0);

        added = true;
        drawer?.open(this.button);
        document.dispatchEvent(
          new CustomEvent('cart:updated', {
            detail: {
              action: 'add',
              item: data,
              quantity: Number(formData.get('quantity') || 1),
            },
          })
        );
      } catch (error) {
        console.error('[Payedaar ATC]', error);
        const drawer = document.querySelector('cart-drawer');
        drawer?.showError(error.message || strings.addToCartError || 'Could not add to cart');
        drawer?.open(this.button);
      } finally {
        if (!(redirectCheckout && added)) {
          this._busy = false;
          this.setLoading(false);
        }
      }

      if (added && this.buttonText) {
        this._showAdded = true;
        this.button?.classList.add('is-added');
        this.buttonText.textContent = strings.addedToCart || 'Added';
        window.setTimeout(() => {
          this._showAdded = false;
          this.button?.classList.remove('is-added');
          const select = this.form?.querySelector('[data-product-variant-select]');
          if (select) this.onVariantChange(select);
          else if (this.buttonText) {
            this.buttonText.textContent = strings.addToCart || 'Add to Cart';
          }
        }, 1200);
      }

      return added;
    }

    async onSubmit(event) {
      event.preventDefault();
      await this.addToCart({ redirectCheckout: false });
    }

    async onBuyNow(event) {
      event.preventDefault();
      if (this.buyNowBtn?.disabled) return;
      await this.addToCart({ redirectCheckout: true });
    }
  }

  if (!customElements.get('cart-drawer')) {
    customElements.define('cart-drawer', CartDrawer);
  }
  if (!customElements.get('product-form')) {
    customElements.define('product-form', ProductForm);
  }

  document.querySelectorAll('cart-drawer').forEach((drawer) => {
    if (!drawer.classList.contains('is-open')) {
      drawer.setAttribute('hidden', '');
      drawer.setAttribute('aria-hidden', 'true');
    }
  });

  /* Cart page qty uses the same changeLine API as the drawer. */
  let cartPageRefresh = Promise.resolve();

  function cartPageRoot() {
    return document.querySelector('.section-main-cart');
  }

  function applyCartPageFromCart(cart) {
    if (!cart || !cartPageRoot()) return;
    if (!Array.isArray(cart.items) || cart.item_count === 0) {
      refreshCartPageSection();
      return;
    }

    document.querySelectorAll('.cart-page__item[data-key]').forEach((row) => {
      const key = row.getAttribute('data-key');
      const item = cart.items.find((entry) => entry.key === key);
      if (!item) {
        row.remove();
        return;
      }
      const priceEl = row.querySelector('[data-cart-page-line-price]');
      if (priceEl) {
        let html = formatCartMoney(item.final_line_price);
        if (item.original_line_price > item.final_line_price) {
          html += ` <s class="cart-page__compare">${formatCartMoney(item.original_line_price)}</s>`;
        }
        if (item.quantity > 1) {
          html += `<span class="cart-page__unit">${formatCartMoney(item.final_price)} each</span>`;
        }
        priceEl.innerHTML = html;
      }
      const input = row.querySelector('[data-cart-page-qty-input]');
      if (input) input.value = String(item.quantity);
    });

    const subtotal = document.querySelector('[data-cart-page-subtotal]');
    if (subtotal) subtotal.textContent = formatCartMoney(cart.total_price);

    const count = document.querySelector('[data-cart-page-count]');
    if (count) count.textContent = cartCountLabel(cart.item_count);
  }

  function refreshCartPageSection() {
    const root = cartPageRoot();
    const sectionId = root?.dataset.sectionId;
    if (!sectionId) return Promise.resolve();
    cartPageRefresh = cartPageRefresh
      .then(async () => {
        const res = await fetch(`${window.location.pathname}?sections=${encodeURIComponent(sectionId)}`, {
          headers: { Accept: 'application/json' },
          credentials: 'same-origin',
        });
        if (!res.ok) throw new Error('Cart page refresh failed');
        const sections = await res.json();
        const html = sections[sectionId];
        if (!html) return;
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const nextId = `shopify-section-${sectionId}`;
        const next = doc.getElementById(nextId) || doc.querySelector('.section-main-cart');
        const current = document.getElementById(nextId);
        if (next && current) {
          current.innerHTML = next.id === nextId ? next.innerHTML : next.outerHTML;
        }
      })
      .catch((error) => {
        console.error('[Payedaar cart page]', error);
      });
    return cartPageRefresh;
  }

  function changeCartPageLine(line, quantity) {
    const drawer = document.querySelector('cart-drawer');
    if (drawer && typeof drawer.changeLine === 'function') {
      return drawer.changeLine(line, quantity);
    }
    return fetch(cartChangeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({ line, quantity }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.description || data.message || 'Cart change failed');
        updateCartCounts(data.item_count ?? 0);
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: { action: 'change', cart: data } }));
      });
  }

  document.addEventListener('cart:updated', (event) => {
    if (!cartPageRoot()) return;
    const cart = event.detail?.cart;
    if (!cart || !Array.isArray(cart.items)) return;
    if (cart.item_count === 0) {
      refreshCartPageSection();
      return;
    }
    applyCartPageFromCart(cart);
  });

  document.addEventListener('click', (event) => {
    const blockedCheckout = event.target.closest('[data-cart-checkout][aria-disabled="true"]');
    if (blockedCheckout) {
      event.preventDefault();
      return;
    }

    const btn = event.target.closest('[data-cart-page-qty-btn]');
    if (!btn) return;
    const form = document.getElementById('cart-page-form');
    if (!form || !form.contains(btn)) return;
    event.preventDefault();
    const wrap = btn.closest('[data-cart-page-qty]');
    const input = wrap?.querySelector('[data-cart-page-qty-input]');
    const line = Number(wrap?.dataset.line || input?.dataset.line);
    if (!input || !line) return;
    const step = Number(btn.getAttribute('data-cart-page-qty-btn')) || 0;
    const min = input.min === '' ? 0 : Number(input.min);
    const max = input.max === '' ? Infinity : Number(input.max);
    const next = Math.min(max, Math.max(min, (Number(input.value) || 0) + step));
    input.value = String(next);
    const row = btn.closest('.cart-page__item');
    setCartBusy(true, row);
    Promise.resolve(changeCartPageLine(line, next))
      .catch(() => refreshCartPageSection())
      .finally(() => setCartBusy(false, row));
  });

  document.addEventListener('change', (event) => {
    const input = event.target.closest('[data-cart-page-qty-input]');
    if (!input) return;
    const form = document.getElementById('cart-page-form');
    if (!form || !form.contains(input)) return;
    const wrap = input.closest('[data-cart-page-qty]');
    const line = Number(wrap?.dataset.line || input.dataset.line);
    if (!line) return;
    let next = Math.max(0, Number(input.value || 0));
    const max = Number(input.max || 0);
    if (max > 0) next = Math.min(max, next);
    input.value = String(next);
    const row = input.closest('.cart-page__item');
    setCartBusy(true, row);
    Promise.resolve(changeCartPageLine(line, next))
      .catch(() => refreshCartPageSection())
      .finally(() => setCartBusy(false, row));
  });

  /* Browser Back restores a frozen page (bfcache). Re-sync cart without opening the drawer. */
  function isHistoryRestore(event) {
    if (event?.persisted) return true;
    const nav = performance.getEntriesByType?.('navigation')?.[0];
    return nav?.type === 'back_forward';
  }

  window.addEventListener('pageshow', (event) => {
    if (!isHistoryRestore(event)) return;
    const drawer = document.querySelector('cart-drawer');
    if (drawer && typeof drawer.refresh === 'function') {
      drawer.refresh();
    } else {
      fetchCart()
        .then((cart) => updateCartCounts(cart.item_count || 0))
        .catch(() => {});
    }
    if (cartPageRoot()) refreshCartPageSection();
  });
})();
