/**
 * Payedaar analytics bridge — Phase 9
 * Publishes storefront events to:
 *   - window.dataLayer (GTM / GA4)
 *   - Shopify.analytics.publish (Customer Events / pixels)
 * Enable via Theme settings → Analytics.
 */
(function () {
  'use strict';

  const settings = window.themeSettings || {};
  if (settings.analyticsEnabled === false) return;

  const dataLayer = (window.dataLayer = window.dataLayer || []);

  function publish(eventName, payload) {
    const detail = Object.assign({ event: eventName, timestamp: Date.now() }, payload || {});

    try {
      dataLayer.push(detail);
    } catch (e) {
      /* ignore */
    }

    try {
      if (window.Shopify && Shopify.analytics && typeof Shopify.analytics.publish === 'function') {
        Shopify.analytics.publish(eventName, detail);
      }
    } catch (e) {
      /* ignore */
    }

    try {
      document.dispatchEvent(new CustomEvent('payedaar:analytics', { detail }));
    } catch (e) {
      /* ignore */
    }
  }

  function moneyFromCents(cents) {
    if (cents == null || cents === '') return undefined;
    const n = Number(cents);
    if (Number.isNaN(n)) return undefined;
    return (n / 100).toFixed(2);
  }

  /* Page view */
  publish('page_view', {
    page_type: document.body?.className?.match(/template-([a-z0-9-]+)/)?.[1] || 'unknown',
    path: window.location.pathname,
  });

  /* Add to cart / cart updates */
  document.addEventListener('cart:updated', (event) => {
    const data = event.detail || {};
    if (data.action !== 'add') {
      publish('cart_updated', {
        action: data.action || 'update',
        item_count: data.cart?.item_count,
        total: moneyFromCents(data.cart?.total_price),
      });
      return;
    }
    const item = data.item || {};
    publish('add_to_cart', {
      product_id: item.product_id,
      variant_id: item.variant_id || item.id,
      quantity: data.quantity || item.quantity,
      price: moneyFromCents(item.price || item.final_price),
      title: item.product_title || item.title,
    });
  });

  /* Variant change on PDP */
  document.addEventListener('variant:change', (event) => {
    const v = event.detail?.variant;
    if (!v) return;
    publish('view_item', {
      variant_id: v.id,
      price: moneyFromCents(v.price),
      available: v.available,
      sku: v.sku,
    });
  });

  /* Wishlist */
  document.addEventListener('wishlist:updated', (event) => {
    publish('wishlist_updated', {
      count: event.detail?.count,
      action: event.detail?.action,
    });
  });

  /* Search submit (header + search page) */
  document.addEventListener(
    'submit',
    (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (!form.action || form.action.indexOf('/search') === -1) return;
      const q = form.querySelector('[name="q"]');
      if (!q || !q.value) return;
      publish('search', { search_term: String(q.value).slice(0, 100) });
    },
    true
  );

  /* Checkout start (cart drawer / cart page) */
  document.addEventListener(
    'click',
    (event) => {
      const link = event.target.closest('a[href*="/checkout"], button[name="checkout"], [data-checkout]');
      if (!link) return;
      publish('begin_checkout', { path: window.location.pathname });
    },
    true
  );

  window.PayedaarAnalytics = { publish };
})();
