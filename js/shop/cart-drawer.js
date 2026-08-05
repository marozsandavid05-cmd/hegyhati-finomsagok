/* ==========================================================================
   HEGYHÁTI FINOMSÁGOK, kosár-drawer + toast (JS-injektált, minden oldalon)
   Szándékosan gsap-mentes: CSS transition + osztályok. Lenis stop/start kötelező.
   ========================================================================== */
(function () {
  if (!window.HFCART) return;

  /* ---- DOM injektálás ---- */
  const ov = document.createElement('div');
  ov.className = 'drawer-ov';
  const dr = document.createElement('aside');
  dr.className = 'drawer';
  dr.setAttribute('role', 'dialog');
  dr.setAttribute('aria-modal', 'true');
  dr.setAttribute('aria-label', 'Kosár');
  dr.innerHTML = `
    <div class="drawer__head">
      <h3>Kosár <small id="drCount"></small></h3>
      <button class="drawer__close" aria-label="Kosár bezárása">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>
      </button>
    </div>
    <div class="drawer__list" data-lenis-prevent id="drList"></div>
    <div class="drawer__foot" id="drFoot">
      <div class="drawer__sum"><span>Becsült részösszeg</span><strong id="drSum" class="num-tab">~0 Ft</strong></div>
      <p class="drawer__note">A pontos végösszeg a mérés után, átvételkor derül ki.</p>
      <a href="penztar.html" class="btn btn--solid">Tovább a pénztárhoz</a>
      <a href="termekek.html" class="drawer__cont">Vásárlás folytatása</a>
    </div>`;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5l5 5L19.5 7"/></svg>
    <span class="toast__msg"></span>
    <button class="toast__act" type="button">Kosár</button>`;
  document.body.append(ov, dr, toast);

  const list = dr.querySelector('#drList');
  const sumEl = dr.querySelector('#drSum');
  const cntEl = dr.querySelector('#drCount');
  const footEl = dr.querySelector('#drFoot');
  const badge = document.getElementById('cartBadge');
  const cartBtn = document.getElementById('cartBtn');
  const fmt = window.HF ? HF.formatFt : n => n + ' Ft';

  /* ---- nyitás / zárás ---- */
  let lastFocus = null;
  function open() {
    lastFocus = document.activeElement;
    toast.classList.remove('on');
    document.body.classList.add('drawer-open');
    if (window.lenis) window.lenis.stop();
    render();
    dr.querySelector('.drawer__close').focus();
  }
  function close() {
    document.body.classList.remove('drawer-open');
    if (window.lenis && !document.body.classList.contains('menu-open')) window.lenis.start();
    if (lastFocus) lastFocus.focus();
  }
  cartBtn && cartBtn.addEventListener('click', open);
  ov.addEventListener('click', close);
  dr.querySelector('.drawer__close').addEventListener('click', close);
  addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('drawer-open')) close(); });
  /* fókusz-csapda */
  dr.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = dr.querySelectorAll('button, a, input');
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---- badge ---- */
  function renderBadge(bump) {
    if (!badge) return;
    const n = HFCART.count();
    badge.textContent = n;
    badge.classList.toggle('on', n > 0);
    if (bump && n > 0) { badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump'); }
  }

  /* ---- lista render ---- */
  function optLine(i) {
    const parts = [];
    if (i.spice) parts.push(i.spice);
    if (i.sliced) parts.push('szeletelve');
    if (i.note) parts.push('„' + i.note + '”');
    return parts.join(' · ');
  }
  function render() {
    const items = HFCART.items();
    cntEl.textContent = items.length ? '(' + items.length + ' tétel)' : '';
    if (!items.length) {
      list.innerHTML = `<div class="drawer__empty">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1.2 12.2a1 1 0 0 1-1 1.1H5.8a1 1 0 0 1-1-1.1L6 7Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>
        <p>A kosara még üres.</p>
        <a href="termekek.html" class="btn btn--sm" style="margin-top:1.2rem">Termékek böngészése</a>
      </div>`;
      footEl.style.display = 'none';
      return;
    }
    footEl.style.display = '';
    list.innerHTML = items.map(i => `
      <div class="citem" data-key="${i.key}">
        <div class="citem__img"><img src="${i.product.img ? i.product.img : 'media/products/' + i.productId + '-thumb.webp'}" alt=""></div>
        <div>
          <p class="citem__name">${i.product.name}</p>
          ${optLine(i) ? `<p class="citem__opts">${optLine(i)}</p>` : ''}
          <div class="citem__row">
            <div class="stepper stepper--sm">
              <button type="button" data-st="down" aria-label="Kevesebb">−</button>
              <input type="text" inputmode="decimal" value="${String(i.weightKg).replace('.', ',')} kg" readonly>
              <button type="button" data-st="up" aria-label="Több">+</button>
            </div>
            <span class="citem__price num-tab">~${fmt(i.estPrice)}</span>
          </div>
        </div>
        <button class="citem__del" aria-label="${i.product.name} törlése">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/></svg>
        </button>
      </div>`).join('');
    sumEl.textContent = '~' + fmt(HFCART.estSubtotal());
  }

  list.addEventListener('click', e => {
    const row = e.target.closest('.citem');
    if (!row) return;
    const key = row.dataset.key;
    const item = HFCART.items().find(i => i.key === key);
    if (!item) return;
    const step = item.product.weight.step || 0.5;
    if (e.target.closest('[data-st="up"]')) HFCART.setWeight(key, item.weightKg + step);
    else if (e.target.closest('[data-st="down"]')) {
      if (item.weightKg - step < (item.product.weight.min || step)) HFCART.remove(key);
      else HFCART.setWeight(key, item.weightKg - step);
    }
    else if (e.target.closest('.citem__del')) HFCART.remove(key);
  });

  /* ---- toast ---- */
  let toastT = null;
  function showToast(msg) {
    toast.querySelector('.toast__msg').textContent = msg;
    toast.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove('on'), 3400);
  }
  toast.querySelector('.toast__act').addEventListener('click', () => { toast.classList.remove('on'); open(); });

  /* ---- publikus API + frissítés ---- */
  HFCART.onChange(() => {
    renderBadge(true);
    if (document.body.classList.contains('drawer-open')) render();
  });
  renderBadge(false);

  window.HFUI = {
    openCart: open,
    closeCart: close,
    toast: showToast,
    addAndToast(productId, weightKg, opts) {
      const p = HFDATA.getProduct(productId);
      if (!p) return;
      const ok = HFCART.add(productId, weightKg, opts);
      if (ok) showToast('Kosárba tettük: ' + p.name + ' · ' + String(weightKg).replace('.', ',') + ' kg');
    },
  };

  /* ---- localStorage-fallback jelzés ---- */
  if (!HFCART.storageOk()) {
    const bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:500;background:#2A2620;color:#E8B96A;font-size:.82rem;text-align:center;padding:.55rem 1rem';
    bar.textContent = 'A böngésző tárolása nem elérhető, a kosár tartalma az oldal bezárásakor elveszhet.';
    document.body.appendChild(bar);
  }
})();
