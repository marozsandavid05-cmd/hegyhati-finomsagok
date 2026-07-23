/* ==========================================================================
   HEGYHÁTI FINOMSÁGOK — bolt-oldal (termekek.html)
   Kategória-szekciók render + K9 sticky tabsor csúszó indikátorral + scrollspy.
   ========================================================================== */
(function () {
  const root = document.getElementById('shopRoot');
  const tabsEl = document.getElementById('shopTabs');
  if (!root || !tabsEl || !window.HFDATA) return;
  const fmt = window.HF ? HF.formatFt : n => n + ' Ft';

  const CHILI = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4c0-1 .8-2 2-2M14 4c-4 0-5 3-5 6 0 5-3 9-6 10 2 1 5 1 8-.5 4-2 6-6 6-10.5 0-3-1-5-3-5Z"/></svg>';
  const KNIFE = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17L17 3l2.5 2.5L8 17H3ZM12 17h9"/></svg>';

  function chips(p) {
    const out = [];
    if (p.options.spice) out.push(`<span class="opt-chip">${CHILI}csípős / csemege</span>`);
    if (p.options.sliceable) out.push(`<span class="opt-chip">${KNIFE}szeletelve kérhető</span>`);
    return out.length ? `<div class="pcard__opts">${out.join('')}</div>` : '';
  }

  function card(p) {
    const hasOpts = !!p.options.spice;
    const btn = hasOpts
      ? `<a class="btn btn--sm btn--ghost" href="termek.html?id=${p.id}">Választás
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>`
      : `<button class="btn btn--sm" type="button" data-qadd="${p.id}">Kosárba</button>`;
    return `
    <article class="pcard" data-reveal>
      <a class="pcard__link" href="termek.html?id=${p.id}" aria-label="${p.name}"></a>
      ${p.featured ? '<span class="pcard__flag">Kiemelt</span>' : ''}
      <figure class="pcard__media"><img src="media/products/${p.id}-thumb.webp" alt="${p.name}" loading="lazy" width="600" height="335"></figure>
      <div class="pcard__body">
        <h3 class="pcard__name">${p.name}</h3>
        <p class="pcard__desc">${p.desc}</p>
        ${chips(p)}
        <div class="pcard__foot">
          <span class="pcard__price num-tab">${fmt(p.price)}<small>/kg</small></span>
          ${btn}
        </div>
      </div>
    </article>`;
  }

  /* ---- szekciók render ---- */
  root.innerHTML = HFDATA.CATEGORIES.map(cat => {
    const items = HFDATA.PRODUCTS.filter(p => p.category === cat.id);
    return `
    <section class="cat-sec" id="kat-${cat.id}" style="padding-block:2.2rem 3.4rem">
      <div class="cat-head">
        <img src="${cat.img}" alt="" loading="lazy">
        <div class="cat-head__body">
          <h2>${cat.name}</h2>
          <p>${cat.desc}</p>
          <span class="cat-head__count">${items.length} termék</span>
        </div>
      </div>
      <div class="pgrid">${items.map(card).join('')}</div>
    </section>`;
  }).join('');

  /* ---- quick-add ---- */
  root.addEventListener('click', e => {
    const btn = e.target.closest('[data-qadd]');
    if (!btn) return;
    e.preventDefault();
    const p = HFDATA.getProduct(btn.dataset.qadd);
    if (p && window.HFUI) HFUI.addAndToast(p.id, p.weight.default || 1);
  });

  /* ---- tabsor + csúszó indikátor ---- */
  tabsEl.innerHTML = HFDATA.CATEGORIES.map(c =>
    `<a class="tab" href="#kat-${c.id}" data-cat="${c.id}" role="tab">${c.name}</a>`).join('')
    + '<span class="tabs__ind" aria-hidden="true"></span>';
  const ind = tabsEl.querySelector('.tabs__ind');
  const tabs = [...tabsEl.querySelectorAll('.tab')];

  function moveInd(tab) {
    if (!tab) return;
    tabs.forEach(t => t.classList.toggle('on', t === tab));
    ind.style.left = tab.offsetLeft + 'px';
    ind.style.width = tab.offsetWidth + 'px';
    /* mobil: az aktív tab látszódjon a görgethető sávban */
    const tl = tab.offsetLeft, tr = tl + tab.offsetWidth;
    if (tl < tabsEl.scrollLeft || tr > tabsEl.scrollLeft + tabsEl.clientWidth) {
      tabsEl.scrollTo({ left: tl - 24, behavior: 'smooth' });
    }
  }
  moveInd(tabs[0]);
  addEventListener('resize', () => moveInd(tabsEl.querySelector('.tab.on')), { passive: true });

  tabs.forEach(tab => tab.addEventListener('click', e => {
    e.preventDefault();
    const target = document.getElementById('kat-' + tab.dataset.cat);
    if (!target) return;
    if (window.lenis) window.lenis.scrollTo(target, { offset: -172 });
    else target.scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---- scrollspy (IO) ---- */
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const id = en.target.id.replace('kat-', '');
      moveInd(tabs.find(t => t.dataset.cat === id));
    });
  }, { rootMargin: '-22% 0px -62% 0px' });
  document.querySelectorAll('.cat-sec').forEach(s => spy.observe(s));

  /* a dinamikusan beszúrt [data-reveal] elemek azonnali ellenőrzése */
  dispatchEvent(new Event('scroll'));
})();
