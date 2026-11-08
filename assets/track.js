/* NHG conversion click tracking -> GA4 (imported into Google Ads as conversions) */
(function () {
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || !window.gtag) return;
    var href = a.getAttribute('href') || '';
    var params = { link_url: href, page_path: location.pathname };
    if (href.indexOf('calendly.com') !== -1) {
      gtag('event', 'book_call_click', params);
    } else if (href.indexOf('tel:') === 0) {
      gtag('event', 'phone_call_click', params);
    } else if (href.indexOf('mailto:') === 0) {
      gtag('event', 'email_click', params);
    }
  }, true);
})();
