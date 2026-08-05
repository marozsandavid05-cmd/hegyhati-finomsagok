/* ==========================================================================
   HEGYHÁTI FINOMSÁGOK, termékoldal (termek.html?id=<slug>)
   Client-side render + súly-stepper + opciók + élő becsült ár + mobil buybar.
   Rossz id → visszairányítás a terméklistára.
   ========================================================================== */
(function () {
  const root = document.getElementById('pdetRoot');
  if (!root || !window.HFDATA) return;
  const fmt = window.HF ? HF.formatFt : n => n + ' Ft';

  const id = new URLSearchParams(location.search).get('id');
  const p = id ? HFDATA.getProduct(id) : null;
  if (!p) { location.replace('termekek.html'); return; }
  const cat = HFDATA.getCategory(p.category);

  document.title = p.name + ' · Hegyháti Finomságok';

  /* ---- morzsamenü ---- */
  const SEP = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>';
  document.getElementById('crumbs').innerHTML =
    `<a href="termekek.html">Termékek</a>${SEP}<a href="termekek.html#kat-${p.category}">${cat ? cat.name : ''}</a>${SEP}<span style="color:var(--ink)">${p.name}</span>`;

  /* ---- fő render ---- */
  const w = p.weight;
  root.innerHTML = `
    <figure class="pdet__media">
      <img src="media/products/${p.id}.webp" alt="${p.name}" width="1200" height="670">
    </figure>
    <div>
      <h1 class="pdet__name">${p.name}</h1>
      <p class="pdet__price num-tab">${fmt(p.price)}<small>/kg · bruttó</small></p>
      <p class="pdet__desc">${p.desc}</p>
      <form class="pdet__form" id="buyForm">
        <div>
          <span class="fld-label">Mennyiség</span>
          <div class="stepper">
            <button type="button" data-st="down" aria-label="Kevesebb">−</button>
            <input type="text" id="wIn" inputmode="decimal" value="${String(w.default).replace('.', ',')}" aria-label="Súly kilogrammban">
            <button type="button" data-st="up" aria-label="Több">+</button>
          </div>
          <span style="margin-left:.8rem;color:var(--muted);font-size:.9rem">kg (${String(w.min).replace('.', ',')}-${String(w.max).replace('.', ',')} kg, ${String(w.step).replace('.', ',')} kg lépésben)</span>
        </div>
        ${p.options.spice ? `
        <div>
          <span class="fld-label">Ízesítés</span>
          <div class="radio-row">
            ${p.options.spice.map((s, i) => `
            <label class="radio-pill">
              <input type="radio" name="spice" value="${s}" ${i === 0 ? 'checked' : ''}>
              <span>${s.charAt(0).toUpperCase() + s.slice(1)}</span>
            </label>`).join('')}
          </div>
        </div>` : ''}
        ${p.options.sliceable ? `
        <label class="check-line">
          <input type="checkbox" id="slicedIn">
          Kérem szeletelve
        </label>` : ''}
        <div class="pdet__note">
          <span class="fld-label">Megjegyzés a tételhez <span style="text-transform:none;letter-spacing:0;opacity:.7">(nem kötelező)</span></span>
          <textarea id="noteIn" maxlength="200" placeholder="Pl. vastagabb szeletek, vákuumcsomagolás…"></textarea>
        </div>
        <div class="pdet__buy">
          <button class="btn btn--solid" type="submit" data-magnet id="addBtn">Kosárba teszem
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1.2 12.2a1 1 0 0 1-1 1.1H5.8a1 1 0 0 1-1-1.1L6 7Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>
          </button>
          <div class="pdet__est">
            <div class="est-label">Becsült ár</div>
            <div class="est-val num-tab" id="estOut">~${fmt(p.price * w.default)}</div>
          </div>
        </div>
        <p class="measure-note">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M12 11v5"/></svg>
          Mérlegelt árut adunk: a feltüntetett ár becslés, a pontos végösszeg a mérés után, átvételkor derül ki. Rendelés után telefonon egyeztetünk.
        </p>
      </form>
    </div>`;

  /* ---- súly-state ---- */
  const wIn = root.querySelector('#wIn');
  let weight = w.default;
  function setW(v) {
    weight = Math.min(w.max, Math.max(w.min, Math.round(v / w.step) * w.step));
    weight = Math.round(weight * 100) / 100;
    wIn.value = String(weight).replace('.', ',');
    updateEst();
  }
  function parseW(str) {
    const n = parseFloat(String(str).replace(',', '.').replace(/[^\d.]/g, ''));
    return isNaN(n) ? w.default : n;
  }
  root.addEventListener('click', e => {
    if (e.target.closest('[data-st="up"]')) { e.preventDefault(); setW(weight + w.step); }
    if (e.target.closest('[data-st="down"]')) { e.preventDefault(); setW(weight - w.step); }
  });
  wIn.addEventListener('change', () => setW(parseW(wIn.value)));
  wIn.addEventListener('focus', () => wIn.select());

  /* ---- becsült ár ---- */
  const estOut = root.querySelector('#estOut');
  const bbPrice = document.getElementById('buybarPrice');
  function updateEst() {
    const est = '~' + fmt(p.price * weight);
    estOut.textContent = est;
    if (bbPrice) bbPrice.textContent = est;
  }
  updateEst();

  /* ---- kosárba ---- */
  function currentOpts() {
    const spiceEl = root.querySelector('input[name="spice"]:checked');
    const slicedEl = root.querySelector('#slicedIn');
    const noteEl = root.querySelector('#noteIn');
    return {
      spice: spiceEl ? spiceEl.value : null,
      sliced: slicedEl ? slicedEl.checked : false,
      note: noteEl ? noteEl.value.trim() : '',
    };
  }
  root.querySelector('#buyForm').addEventListener('submit', e => {
    e.preventDefault();
    if (window.HFUI) HFUI.addAndToast(p.id, weight, currentOpts());
  });
  const bbAdd = document.getElementById('buybarAdd');
  if (bbAdd) bbAdd.addEventListener('click', () => { if (window.HFUI) HFUI.addAndToast(p.id, weight, currentOpts()); });

  /* ---- mobil buybar megjelenítés (K17): ha a fő CTA kiscrollozott ---- */
  const buybar = document.getElementById('buybar');
  const addBtn = root.querySelector('#addBtn');
  if (buybar && addBtn && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([en]) => {
      buybar.classList.toggle('on', !en.isIntersecting);
      buybar.setAttribute('aria-hidden', en.isIntersecting ? 'true' : 'false');
    }, { threshold: 0 });
    io.observe(addBtn);
  }
  /* iOS: input fókusznál a buybar el (billentyűzet-ütközés) */
  root.addEventListener('focusin', e => { if (e.target.matches('input,textarea')) document.body.classList.add('kb-open'); });
  root.addEventListener('focusout', () => setTimeout(() => {
    if (!document.activeElement || !document.activeElement.matches('input,textarea')) document.body.classList.remove('kb-open');
  }, 120));

  /* ---- kapcsolódó termékek ---- */
  const rel = HFDATA.PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 3);
  if (rel.length) {
    document.getElementById('relatedSec').style.display = '';
    document.getElementById('relatedGrid').innerHTML = rel.map(r => `
      <article class="pcard">
        <a class="pcard__link" href="termek.html?id=${r.id}" aria-label="${r.name}"></a>
        <figure class="pcard__media"><img src="media/products/${r.id}-thumb.webp" alt="${r.name}" loading="lazy" width="600" height="335"></figure>
        <div class="pcard__body">
          <h3 class="pcard__name">${r.name}</h3>
          <div class="pcard__foot"><span class="pcard__price num-tab">${fmt(r.price)}<small>/kg</small></span></div>
        </div>
      </article>`).join('');
  }
})();
