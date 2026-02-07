(function () {
  const cfg = window.__CAL_CONFIG__ || {
    timezone: 'Europe/Prague',
    items: []
  };

  const TZ = cfg.timezone || 'Europe/Prague';
  const grid = document.getElementById('grid');

  if (!grid) return;

  function todayISOInTZ() {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(new Date());

    const y = parts.find(p => p.type === 'year').value;
    const m = parts.find(p => p.type === 'month').value;
    const d = parts.find(p => p.type === 'day').value;

    return `${y}-${m}-${d}`;
  }

  function formatCzDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));

    return new Intl.DateTimeFormat('cs-CZ', {
      timeZone: TZ,
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).format(dt);
  }

  function isUnlocked(iso) {
    return iso <= todayISOInTZ();
  }

  function makeTile(item) {
    const unlocked = item.kind === 'intro' || isUnlocked(item.date);

    const article = document.createElement('article');
    article.className = 'tile';
    if (!unlocked) article.classList.add('locked');

    const link = document.createElement('a');
    link.href = unlocked ? item.img : '#';

    if (unlocked) {
      link.target = '_blank';
      link.rel = 'noopener';
    }

    const thumb = document.createElement('div');
    thumb.className = 'thumb';

    if (unlocked) {
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = item.img;
      img.alt = item.alt || item.title;
      thumb.appendChild(img);
    } else {
      // ❌ žádný obrázek – jen šedý blok
      const cover = document.createElement('div');
      cover.className = 'locked-cover';
      cover.innerHTML = `
        <div class="lock-icon">🔒</div>
        <div class="lock-text">Odemkne se<br>${formatCzDate(item.date)}</div>
      `;
      thumb.appendChild(cover);
    }

    const caption = document.createElement('div');
    caption.className = 'caption';

    const h3 = document.createElement('h3');
    h3.textContent =
      item.kind === 'intro'
        ? item.title
        : `${item.title} – ${formatCzDate(item.date)}`;

    const p = document.createElement('p');
    p.textContent = unlocked ? 'Odemčeno' : 'Zamčeno';

    caption.appendChild(h3);
    caption.appendChild(p);

    link.appendChild(thumb);
    link.appendChild(caption);
    article.appendChild(link);

    return article;
  }

  function render() {
    grid.innerHTML = '';
    cfg.items.forEach(item => {
      grid.appendChild(makeTile(item));
    });
  }

  render();
  setInterval(render, 60 * 1000);
})();

