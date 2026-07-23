/* ==========================================================================
   HEGYHÁTI FINOMSÁGOK — kosár-állapot (localStorage + in-memory fallback)
   Kulcs: productId|spice|sliced — azonos sorok összevonódnak.
   Minden ár BECSÜLT (kg-alapú mérlegelt áru) — a UI mindig „~” jellel mutatja.
   ========================================================================== */
(function () {
  const KEY = 'hf_cart_v1';
  let memory = null;          /* fallback, ha a localStorage nem elérhető */
  let storageOk = true;

  function readRaw() {
    if (memory !== null) return memory;
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : { v: 1, items: [] };
    } catch (e) {
      storageOk = false;
      memory = { v: 1, items: [] };
      return memory;
    }
  }
  function write(state) {
    if (!storageOk) { memory = state; notify(); return; }
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { storageOk = false; memory = state; }
    notify();
  }

  const listeners = [];
  function notify() { listeners.forEach(fn => { try { fn(); } catch (e) {} }); }

  function itemKey(productId, spice, sliced) {
    return productId + '|' + (spice || '-') + '|' + (sliced ? 'sz' : '-');
  }

  function add(productId, weightKg, opts) {
    const p = window.HFDATA && HFDATA.getProduct(productId);
    if (!p) return false;
    const spice = (opts && opts.spice) || null;
    const sliced = !!(opts && opts.sliced);
    const note = (opts && opts.note) || '';
    const state = readRaw();
    const key = itemKey(productId, spice, sliced);
    const found = state.items.find(i => i.key === key);
    const maxW = p.weight.max || 8;
    if (found) {
      found.weightKg = Math.min(maxW, Math.round((found.weightKg + weightKg) * 100) / 100);
      if (note) found.note = found.note ? (found.note + ' · ' + note) : note;
    } else {
      state.items.push({ key, productId, weightKg, spice, sliced, note, addedAt: Date.now() });
    }
    write(state);
    return true;
  }

  function setWeight(key, weightKg) {
    const state = readRaw();
    const it = state.items.find(i => i.key === key);
    if (!it) return;
    const p = HFDATA.getProduct(it.productId);
    const minW = p ? p.weight.min : 0.25;
    const maxW = p ? p.weight.max : 8;
    it.weightKg = Math.min(maxW, Math.max(minW, Math.round(weightKg * 100) / 100));
    write(state);
  }

  function remove(key) {
    const state = readRaw();
    state.items = state.items.filter(i => i.key !== key);
    write(state);
  }

  function clear() { write({ v: 1, items: [] }); }

  function items() {
    return readRaw().items.map(i => {
      const p = window.HFDATA ? HFDATA.getProduct(i.productId) : null;
      return Object.assign({}, i, {
        product: p,
        estPrice: p ? Math.round(p.price * i.weightKg) : 0,
      });
    }).filter(i => i.product);
  }

  function count() { return readRaw().items.length; }
  function estSubtotal() { return items().reduce((s, i) => s + i.estPrice, 0); }
  function totalWeight() { return Math.round(items().reduce((s, i) => s + i.weightKg, 0) * 100) / 100; }

  window.HFCART = {
    add, setWeight, remove, clear, items, count, estSubtotal, totalWeight,
    onChange: fn => listeners.push(fn),
    storageOk: () => storageOk,
    itemKey,
  };
})();
