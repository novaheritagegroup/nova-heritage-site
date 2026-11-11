/* NHG conversion tracking
 * - GA4 click events (book_call_click, phone_call_click, email_click)
 * - Google Ads conversion when a Calendly fit call is actually booked
 *   (Calendly opens as a popup on our site so we can see the booking event)
 */
(function () {
  var ADS_ID = 'AW-18560665737';
  var BOOKED_CONVERSION = 'AW-18560665737/PbQUCIayz7YdEImRtZJF'; // "Calendly Fit Call Booked"

  if (window.gtag) gtag('config', ADS_ID);

  // Load Calendly's popup widget (falls back to a normal link if it fails to load)
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'https://assets.calendly.com/assets/external/widget.css';
  document.head.appendChild(css);
  var js = document.createElement('script');
  js.src = 'https://assets.calendly.com/assets/external/widget.js';
  js.async = true;
  document.head.appendChild(js);

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var params = { link_url: href, page_path: location.pathname };
    if (href.indexOf('calendly.com') !== -1) {
      if (window.gtag) gtag('event', 'book_call_click', params);
      if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
        e.preventDefault();
        window.Calendly.initPopupWidget({ url: href });
      }
    } else if (href.indexOf('tel:') === 0) {
      if (window.gtag) gtag('event', 'phone_call_click', params);
    } else if (href.indexOf('mailto:') === 0) {
      if (window.gtag) gtag('event', 'email_click', params);
    }
  }, true);

  // Fires only when someone finishes booking inside the Calendly popup
  var booked = false;
  window.addEventListener('message', function (e) {
    if (e.origin !== 'https://calendly.com') return;
    var d = e.data;
    if (!d || d.event !== 'calendly.event_scheduled' || booked) return;
    booked = true;
    if (!window.gtag) return;
    gtag('event', 'conversion', { send_to: BOOKED_CONVERSION });
    gtag('event', 'generate_lead', { method: 'calendly_fit_call', page_path: location.pathname });
  });
})();
