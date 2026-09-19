/**
 * Payedaar Phase 6 — PDP: gallery, variants, sticky ATC, recommendations
 */
(() => {
  'use strict';

  const strings = window.themeStrings || {};

  function formatMoney(cents) {
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

  /* -------------------------------------------------------------------- */
  /* Media gallery                                                        */
  /* -------------------------------------------------------------------- */
  class MediaGallery extends HTMLElement {
    connectedCallback() {
      this.slides = Array.from(this.querySelectorAll('.product-gallery__slide'));
      this.thumbs = Array.from(this.querySelectorAll('[data-thumb]'));
      this.dots = Array.from(this.querySelectorAll('[data-gallery-dot]'));
      this.counter = this.querySelector('[data-gallery-count]');
      this.thumbsRail = this.querySelector('[data-gallery-thumbs]');
      this.lightbox = this.querySelector('[data-gallery-lightbox]');
      this.lightboxImg = this.querySelector('[data-lightbox-img]');
      this.prevBtn = this.querySelector('[data-gallery-prev]');
      this.nextBtn = this.querySelector('[data-gallery-next]');
      this.viewer = this.querySelector('[data-gallery-viewer]');
      this.touchStartX = 0;
      this.touchStartY = 0;
      this.isAnimating = false;
      this.activeIndex = Math.max(
        0,
        this.slides.findIndex((slide) => slide.classList.contains('is-active'))
      );
      if (this.activeIndex < 0) this.activeIndex = 0;

      this.thumbs.forEach((thumb) => {
        thumb.addEventListener('click', () => this.goToMedia(thumb.dataset.mediaId));
      });
      this.dots.forEach((dot) => {
        dot.addEventListener('click', () => this.goToMedia(dot.dataset.mediaId));
      });
      this.prevBtn?.addEventListener('click', () => this.step(-1));
      this.nextBtn?.addEventListener('click', () => this.step(1));

      this.querySelectorAll('[data-gallery-zoom]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const src = btn.dataset.zoomSrc;
          if (!src || !this.lightbox || !this.lightboxImg) return;
          this.lightboxImg.src = src;
          this.lightboxImg.alt = btn.querySelector('img')?.alt || '';
          if (typeof this.lightbox.showModal === 'function') this.lightbox.showModal();
          else this.lightbox.setAttribute('open', '');
        });
      });

      this.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          this.step(-1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          this.step(1);
        }
      });

      if (this.viewer) {
        this.viewer.addEventListener(
          'touchstart',
          (event) => {
            this.touchStartX = event.changedTouches[0]?.clientX || 0;
            this.touchStartY = event.changedTouches[0]?.clientY || 0;
          },
          { passive: true }
        );
        this.viewer.addEventListener(
          'touchend',
          (event) => {
            const touch = event.changedTouches[0];
            if (!touch || this.slides.length < 2) return;
            const dx = touch.clientX - this.touchStartX;
            const dy = touch.clientY - this.touchStartY;
            if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
            this.step(dx < 0 ? 1 : -1);
          },
          { passive: true }
        );
      }

      document.addEventListener('variant:change', (event) => {
        const mediaId = event.detail?.variant?.featured_media?.id;
        if (mediaId) this.goToMedia(String(mediaId));
      });

      this.syncUi(false);
    }

    step(delta) {
      if (this.slides.length < 2) return;
      const next = (this.activeIndex + delta + this.slides.length) % this.slides.length;
      this.goToIndex(next, delta);
    }

    goToMedia(mediaId) {
      const index = this.slides.findIndex((slide) => String(slide.dataset.mediaId) === String(mediaId));
      if (index < 0 || index === this.activeIndex) return;
      const delta = index > this.activeIndex ? 1 : -1;
      this.goToIndex(index, delta);
    }

    goToIndex(index, direction = 1) {
      if (index < 0 || index >= this.slides.length || index === this.activeIndex) return;
      if (this.isAnimating) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const fromSlide = this.slides[this.activeIndex];
      const toSlide = this.slides[index];
      const dir = direction < 0 ? -1 : 1;

      this.activeIndex = index;

      if (reduceMotion) {
        this.slides.forEach((slide, i) => {
          slide.classList.toggle('is-active', i === index);
          slide.classList.remove('is-enter-from-left', 'is-enter-from-right', 'is-exit-to-left', 'is-exit-to-right');
          slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
        });
        this.syncUi(true);
        return;
      }

      this.isAnimating = true;
      fromSlide.classList.remove('is-active', 'is-enter-from-left', 'is-enter-from-right');
      fromSlide.classList.add(dir > 0 ? 'is-exit-to-left' : 'is-exit-to-right');
      fromSlide.setAttribute('aria-hidden', 'true');

      toSlide.classList.remove('is-exit-to-left', 'is-exit-to-right');
      toSlide.classList.add('is-active', dir > 0 ? 'is-enter-from-right' : 'is-enter-from-left');
      toSlide.setAttribute('aria-hidden', 'false');

      const finish = () => {
        fromSlide.classList.remove('is-exit-to-left', 'is-exit-to-right');
        toSlide.classList.remove('is-enter-from-left', 'is-enter-from-right');
        this.isAnimating = false;
        toSlide.removeEventListener('animationend', finish);
      };
      toSlide.addEventListener('animationend', finish, { once: true });
      window.setTimeout(finish, 520);

      this.syncUi(true);
    }

    syncUi(scrollThumb) {
      this.slides.forEach((slide, i) => {
        const active = i === this.activeIndex;
        if (!slide.classList.contains('is-enter-from-left') && !slide.classList.contains('is-enter-from-right')) {
          slide.classList.toggle('is-active', active);
        }
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      });

      this.thumbs.forEach((thumb, i) => {
        const active = i === this.activeIndex;
        thumb.classList.toggle('is-active', active);
        thumb.setAttribute('aria-current', active ? 'true' : 'false');
        if (active && scrollThumb && this.thumbsRail) {
          thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      });

      this.dots.forEach((dot, i) => {
        const active = i === this.activeIndex;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      if (this.counter && this.slides.length > 1) {
        const labelIndex = Number(this.slides[this.activeIndex]?.dataset.mediaIndex || this.activeIndex + 1);
        this.counter.textContent = `${labelIndex} / ${this.slides.length}`;
      }

      if (this.prevBtn) this.prevBtn.disabled = this.slides.length < 2;
      if (this.nextBtn) this.nextBtn.disabled = this.slides.length < 2;
    }

    setActiveMedia(mediaId) {
      this.goToMedia(mediaId);
    }
  }

  /* -------------------------------------------------------------------- */
  /* Variant selects                                                      */
  /* -------------------------------------------------------------------- */
  class VariantSelects extends HTMLElement {
    connectedCallback() {
      this.section = this.closest('[data-section-type="main-product"]') || document;
      const jsonEl = this.section.querySelector('[data-product-json]');
      try {
        this.product = jsonEl ? JSON.parse(jsonEl.textContent) : null;
      } catch (e) {
        this.product = null;
      }
      if (!this.product) return;

      this.addEventListener('change', this.onVariantChange.bind(this));
      // Initial sync from URL ?variant=
      const params = new URLSearchParams(window.location.search);
      const variantId = params.get('variant');
      if (variantId) {
        const variant = this.product.variants.find((v) => String(v.id) === String(variantId));
        if (variant) this.updateOptionsFromVariant(variant);
      }
      this.onVariantChange();
    }

    getOptions() {
      return Array.from(this.querySelectorAll('input[type="radio"]:checked')).map((input) => input.value);
    }

    getVariantData() {
      const options = this.getOptions();
      return (
        this.product.variants.find((variant) =>
          variant.options.every((option, index) => option === options[index])
        ) || null
      );
    }

    updateOptionsFromVariant(variant) {
      variant.options.forEach((value, index) => {
        const inputs = this.querySelectorAll(`input[data-option-position="${index + 1}"]`);
        inputs.forEach((input) => {
          if (input.value === value) input.checked = true;
        });
      });
    }

    onVariantChange() {
      this.updateOptionAvailability();
      const variant = this.getVariantData();
      this.updateSelectedLabels();
      this.updateMasterSelect(variant);
      this.updateURL(variant);
      this.updatePrice(variant);
      this.updateAvailability(variant);
      this.updateSku(variant);
      this.updateInventory(variant);

      document.dispatchEvent(
        new CustomEvent('variant:change', {
          detail: { variant, product: this.product },
        })
      );
    }

    updateSelectedLabels() {
      this.querySelectorAll('.variant-selects__fieldset').forEach((fieldset) => {
        const checked = fieldset.querySelector('input:checked');
        const label = fieldset.querySelector('[data-selected-value]');
        if (checked && label) label.textContent = checked.value;
      });
    }

    updateMasterSelect(variant) {
      const select = this.section.querySelector('[data-product-variant-select]');
      if (!select) return;
      if (!variant) {
        select.value = '';
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return;
      }
      select.value = variant.id;
      Array.from(select.options).forEach((opt) => {
        opt.selected = String(opt.value) === String(variant.id);
      });
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }

    updateOptionAvailability() {
      const selected = this.getOptions();
      this.querySelectorAll('input[data-option-position]').forEach((input) => {
        const position = Number(input.dataset.optionPosition) - 1;
        const possible = this.product.variants.some((variant) => {
          if (!variant.available || variant.options[position] !== input.value) return false;
          return variant.options.every((value, index) => index >= position || value === selected[index]);
        });
        input.disabled = !possible;
        input.dataset.unavailable = possible ? 'false' : 'true';
        const label = this.querySelector(`label[for="${CSS.escape(input.id)}"]`);
        label?.classList.toggle('is-unavailable', !possible);
        label?.setAttribute('aria-disabled', possible ? 'false' : 'true');
      });
    }

    updateURL(variant) {
      if (!variant || !this.dataset.url) return;
      const url = `${this.dataset.url}?variant=${variant.id}`;
      window.history.replaceState({}, '', url);
    }

    updatePrice(variant) {
      const priceRoot = this.section.querySelector('[data-product-price]');
      if (!priceRoot || !variant) return;

      const onSale = variant.compare_at_price && variant.compare_at_price > variant.price;
      let html = '<div class="price';
      if (onSale) html += ' price--on-sale';
      if (!variant.available) html += ' price--sold-out';
      html += '"><div class="price__regular">';
      if (onSale) {
        const save = variant.compare_at_price - variant.price;
        const pct = Math.round((save * 100) / variant.compare_at_price);
        html += `<span class="price__sale">${formatMoney(variant.price)}</span>`;
        html += `<s class="price__compare">${formatMoney(variant.compare_at_price)}</s>`;
        html += `<span class="badge badge--sale">-${pct}%</span>`;
        const saveLabel = (window.themeStrings?.youSave || 'You save AMOUNT').replace(
          /AMOUNT|\{\{\s*amount\s*\}\}/g,
          formatMoney(save)
        );
        html += `<span class="price__save">${saveLabel}</span>`;
      } else {
        html += `<span class="price__current">${formatMoney(variant.price)}</span>`;
      }
      html += '</div></div>';

      const priceEl = priceRoot.querySelector('.price');
      if (priceEl) priceEl.outerHTML = html;
      else priceRoot.insertAdjacentHTML('afterbegin', html);

      const stickyPrice = document.querySelector('[data-sticky-price]');
      if (stickyPrice) stickyPrice.textContent = formatMoney(variant.price);
    }

    updateAvailability(variant) {
      const btn = this.section.querySelector('[data-main-atc]');
      const btnText = this.section.querySelector('[data-add-to-cart-text]');
      const buyNowBtn = this.section.querySelector('[data-buy-now]');
      const buyNowText = this.section.querySelector('[data-buy-now-text]');
      const stickyBtn = document.querySelector('[data-sticky-atc-trigger]');
      const stickyText = document.querySelector('[data-sticky-atc-text]');
      const available = Boolean(variant?.available);

      if (btn) {
        btn.disabled = !available;
        const form = btn.closest('product-form');
        if (form) form._available = available;
      }
      if (buyNowBtn) buyNowBtn.disabled = !available;
      if (btnText) {
        btnText.textContent = available
          ? strings.addToCart || 'Add to Cart'
          : variant
            ? strings.soldOut || 'Sold out'
            : 'Choose an available combination';
      }
      if (buyNowText) {
        buyNowText.textContent = available
          ? strings.buyNow || 'Buy Now'
          : strings.soldOut || 'Sold out';
      }
      if (stickyBtn) stickyBtn.disabled = !available;
      if (stickyText) {
        stickyText.textContent = available
          ? strings.addToCart || 'Add to Cart'
          : strings.soldOut || 'Sold out';
      }
    }

    updateSku(variant) {
      const skuWrap = this.section.querySelector('[data-product-sku]');
      const skuValue = this.section.querySelector('[data-sku-value]');
      if (!skuWrap || !skuValue) return;
      if (variant?.sku) {
        skuValue.textContent = variant.sku;
        skuWrap.hidden = false;
      } else {
        skuWrap.hidden = true;
      }
    }

    updateInventory(variant) {
      const inventory = this.section.querySelector('[data-product-inventory]');
      if (!inventory || !variant) return;
      const threshold = Number(inventory.dataset.threshold || 5);
      let html = '';
      if (variant.available === false) {
        html = `<p class="product-inventory__out">${strings.soldOut || 'Sold out'}</p>`;
      } else if (variant.inventory_management && typeof variant.inventory_quantity === 'number') {
        if (variant.inventory_quantity > 0 && variant.inventory_quantity <= threshold) {
          const template = (strings.lowStockHtml || 'Only COUNT left').replace(/COUNT|\{\{\s*count\s*\}\}/gi, String(variant.inventory_quantity));
          html = `<p class="product-inventory__low">${template}</p>`;
        } else if (variant.inventory_quantity > threshold) {
          html = `<p class="product-inventory__in">${strings.inStock || 'In stock'}</p>`;
        }
      }
      inventory.innerHTML = html;
    }
  }

  /* -------------------------------------------------------------------- */
  /* Sticky ATC                                                           */
  /* -------------------------------------------------------------------- */
  class StickyAtc extends HTMLElement {
    connectedCallback() {
      this.trigger = this.querySelector('[data-sticky-atc-trigger]');
      this.mainAtc = document.querySelector('[data-main-atc]');
      if (!this.mainAtc || !window.IntersectionObserver) {
        this.hidden = true;
        return;
      }

      // Desktop: sticky bar not used (P6-AC2 is mobile)
      if (window.matchMedia('(min-width: 750px)').matches) {
        this.hidden = true;
        return;
      }

      this.trigger?.addEventListener('click', () => {
        this.mainAtc.click();
      });

      this.observer = new IntersectionObserver(
        ([entry]) => {
          const show = !entry.isIntersecting;
          this.hidden = !show;
          this.classList.toggle('is-visible', show);
          document.body.classList.toggle('sticky-atc-visible', show);
        },
        { rootMargin: '0px', threshold: 0 }
      );
      this.observer.observe(this.mainAtc);
    }

    disconnectedCallback() {
      this.observer?.disconnect();
      document.body.classList.remove('sticky-atc-visible');
    }
  }

  /* -------------------------------------------------------------------- */
  /* Product recommendations                                              */
  /* -------------------------------------------------------------------- */
  class ProductRecommendations extends HTMLElement {
    connectedCallback() {
      const url = this.dataset.url;
      if (!url) return;
      fetch(url)
        .then((res) => res.text())
        .then((html) => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const sectionId = this.dataset.sectionId;
          const next =
            doc.querySelector(`#shopify-section-${sectionId}`) ||
            doc.querySelector('product-recommendations');
          if (!next) return;
          const content = next.querySelector('.page-width') || next;
          if (content && content.innerHTML.trim()) {
            this.innerHTML = next.innerHTML;
          }
        })
        .catch((error) => console.error('[Payedaar recommendations]', error));
    }
  }

  /* -------------------------------------------------------------------- */
  /* Qty + share helpers on PDP                                           */
  /* -------------------------------------------------------------------- */
  document.querySelectorAll('[data-product-qty]').forEach((wrap) => {
    const input = wrap.querySelector('[data-qty-input]');
    wrap.querySelector('[data-qty-minus]')?.addEventListener('click', () => {
      const next = Math.max(1, Number(input.value || 1) - 1);
      input.value = String(next);
    });
    wrap.querySelector('[data-qty-plus]')?.addEventListener('click', () => {
      const max = Number(input.max || 0);
      let next = Number(input.value || 1) + 1;
      if (max > 0) next = Math.min(max, next);
      input.value = String(next);
    });
  });

  document.querySelectorAll('[data-copy-link]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const url = btn.dataset.copyLink || window.location.href;
      const label = btn.querySelector('[data-copy-link-label]');
      const original = label?.textContent;
      try {
        await navigator.clipboard.writeText(url);
        if (label) label.textContent = strings.copied || 'Copied!';
        window.setTimeout(() => {
          if (label && original) label.textContent = original;
        }, 1500);
      } catch (e) {
        console.error('[Payedaar share]', e);
      }
    });
  });

  if (!customElements.get('media-gallery')) {
    customElements.define('media-gallery', MediaGallery);
  }
  if (!customElements.get('variant-selects')) {
    customElements.define('variant-selects', VariantSelects);
  }
  if (!customElements.get('sticky-atc')) {
    customElements.define('sticky-atc', StickyAtc);
  }
  if (!customElements.get('product-recommendations')) {
    customElements.define('product-recommendations', ProductRecommendations);
  }
})();
