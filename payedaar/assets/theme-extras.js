/**
 * Payedaar Phase 7 — Cookie banner, popups, wishlist
 */
(() => {
  'use strict';

  const STORAGE = {
    cookie: 'payedaar_cookie_consent',
    popup: 'payedaar_popup_dismissed',
    wishlist: 'payedaar_wishlist',
  };

  /* -------------------------------------------------------------------- */
  /* Cookie banner — non-blocking, bottom sheet                           */
  /* -------------------------------------------------------------------- */
  const cookieBanner = document.querySelector('[data-cookie-banner]');
  if (cookieBanner) {
    const accepted = localStorage.getItem(STORAGE.cookie);
    if (!accepted) {
      cookieBanner.hidden = false;
      document.body.classList.add('cookie-banner-visible');
    }

    const dismiss = () => {
      localStorage.setItem(STORAGE.cookie, '1');
      cookieBanner.hidden = true;
      document.body.classList.remove('cookie-banner-visible');
    };

    cookieBanner.querySelector('[data-cookie-accept]')?.addEventListener('click', dismiss);
    cookieBanner.querySelector('[data-cookie-dismiss]')?.addEventListener('click', dismiss);
  }

  /* -------------------------------------------------------------------- */
  /* Promo / newsletter popup                                             */
  /* -------------------------------------------------------------------- */
  const popup = document.querySelector('[data-theme-popup]');
  if (popup) {
    const delayMs = Number(popup.dataset.delay || window.themeSettings?.popupDelay || 4) * 1000;
    const days = Number(window.themeSettings?.popupDays || 7);
    const key = STORAGE.popup;
    const raw = localStorage.getItem(key);
    let dismissedAt = 0;
    try {
      dismissedAt = raw ? Number(JSON.parse(raw).at || 0) : 0;
    } catch (e) {
      dismissedAt = 0;
    }
    const reappearMs = days * 24 * 60 * 60 * 1000;
    const canShow = !dismissedAt || Date.now() - dismissedAt > reappearMs;

    const close = () => {
      popup.hidden = true;
      popup.classList.remove('is-open');
      document.body.classList.remove('theme-popup-open');
      localStorage.setItem(key, JSON.stringify({ at: Date.now() }));
    };

    const open = () => {
      popup.hidden = false;
      document.body.classList.add('theme-popup-open');
      requestAnimationFrame(() => popup.classList.add('is-open'));
      popup.querySelector('[data-popup-panel]')?.focus?.();
    };

    popup.querySelectorAll('[data-popup-close]').forEach((el) => {
      el.addEventListener('click', close);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && popup.classList.contains('is-open')) close();
    });

    if (canShow) {
      window.setTimeout(open, Math.max(500, delayMs));
    }
  }

  /* -------------------------------------------------------------------- */
  /* Wishlist (localStorage)                                              */
  /* -------------------------------------------------------------------- */
  const wishlistEnabled = window.themeSettings?.wishlistEnabled !== false;

  function readWishlist() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.wishlist) || '[]');
    } catch (e) {
      return [];
    }
  }

  function writeWishlist(items) {
    localStorage.setItem(STORAGE.wishlist, JSON.stringify(items));
    updateWishlistCount(items.length);
    document.dispatchEvent(new CustomEvent('wishlist:updated', { detail: { items } }));
  }

  function updateWishlistCount(count) {
    document.querySelectorAll('[data-wishlist-count]').forEach((el) => {
      const num = el.querySelector('[data-wishlist-count-number]');
      if (num) num.textContent = String(count);
      if (count > 0) {
        el.classList.remove('is-empty');
        el.removeAttribute('hidden');
      } else {
        el.classList.add('is-empty');
        el.setAttribute('hidden', '');
      }
    });
    document.querySelectorAll('[data-wishlist-toggle]').forEach((btn) => {
      const id = Number(btn.dataset.productId);
      const active = readWishlist().some((item) => item.id === id);
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function toggleWishlistItem(product) {
    const items = readWishlist();
    const index = items.findIndex((item) => item.id === product.id);
    if (index >= 0) items.splice(index, 1);
    else items.unshift(product);
    writeWishlist(items.slice(0, 50));
    return index < 0;
  }

  window.PayedaarWishlist = {
    get: readWishlist,
    toggle: toggleWishlistItem,
    count: () => readWishlist().length,
  };

  if (wishlistEnabled) {
    updateWishlistCount(readWishlist().length);

    document.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-wishlist-toggle]');
      if (!btn) return;
      event.preventDefault();
      const product = {
        id: Number(btn.dataset.productId),
        handle: btn.dataset.productHandle,
        title: btn.dataset.productTitle,
        url: btn.dataset.productUrl,
        image: btn.dataset.productImage || '',
        price: btn.dataset.productPrice || '',
      };
      if (!product.id) return;
      const added = toggleWishlistItem(product);
      btn.classList.toggle('is-active', added);
    });

    const grid = document.querySelector('[data-wishlist-grid]');
    const template = document.querySelector('[data-wishlist-card-template]');
    const empty = document.querySelector('[data-wishlist-empty]');
    const pageCount = document.querySelector('[data-wishlist-page-count]');
    const pageCountNum = document.querySelector('[data-wishlist-page-count-number]');

    const countLabel = (count) => {
      const one = window.themeStrings?.wishlistCountOne || 'COUNT saved item';
      const other = window.themeStrings?.wishlistCountOther || 'COUNT saved items';
      const templateStr = count === 1 ? one : other;
      return templateStr.replace('COUNT', String(count));
    };

    const render = () => {
      const items = readWishlist();

      if (pageCount && pageCountNum) {
        if (items.length) {
          pageCount.hidden = false;
          pageCountNum.textContent = countLabel(items.length);
        } else {
          pageCount.hidden = true;
        }
      }

      if (!grid || !template) return;

      grid.querySelectorAll('.wishlist-card').forEach((el) => el.remove());

      if (!items.length) {
        if (empty) empty.hidden = false;
        grid.hidden = true;
        return;
      }

      if (empty) empty.hidden = true;
      grid.hidden = false;

      items.forEach((item) => {
        const node = template.content.cloneNode(true);
        node.querySelectorAll('[data-wishlist-url]').forEach((el) => {
          el.href = item.url;
        });
        const title = node.querySelector('[data-wishlist-title]');
        if (title) title.textContent = item.title;
        const price = node.querySelector('[data-wishlist-price]');
        if (price) price.textContent = item.price;
        const img = node.querySelector('[data-wishlist-image]');
        if (img) {
          if (item.image) {
            img.src = item.image;
            img.alt = item.title;
          } else {
            img.remove();
          }
        }
        node.querySelector('[data-wishlist-remove]')?.addEventListener('click', () => {
          toggleWishlistItem(item);
        });
        grid.appendChild(node);
      });
    };

    if (grid || empty || pageCount) {
      render();
      document.addEventListener('wishlist:updated', render);
    }
  }

  /* -------------------------------------------------------------------- */
  /* FAQ page search                                                      */
  /* -------------------------------------------------------------------- */
  const faqPage = document.querySelector('[data-faq-page]');
  if (faqPage) {
    const search = faqPage.querySelector('[data-faq-search]');
    const empty = faqPage.querySelector('[data-faq-empty]');
    const items = Array.from(faqPage.querySelectorAll('[data-faq-item]'));
    const groups = Array.from(faqPage.querySelectorAll('[data-faq-group]'));
    const apply = () => {
      const query = (search?.value || '').trim().toLowerCase();
      let visible = 0;
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        const match = !query || text.includes(query);
        item.hidden = !match;
        if (match) visible += 1;
      });
      groups.forEach((group) => {
        const any = group.querySelector('[data-faq-item]:not([hidden])');
        group.hidden = !any;
      });
      if (empty) empty.hidden = visible > 0;
    };
    search?.addEventListener('input', apply);
  }
})();
