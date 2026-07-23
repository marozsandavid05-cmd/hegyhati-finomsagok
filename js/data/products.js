/* ==========================================================================
   HEGYHÁTI FINOMSÁGOK — termékkatalógus (22 termék, 6 kategória)
   Árak: bruttó Ft/kg (a bolti árlistával egyező, 2026-07 állapot).
   weight: kg-lépésköz — MINTA finomhangolás az ügyféllel (pl. tepertő 0,25).
   options.spice: csípős/csemege választható · options.sliceable: szeletelve kérhető
   ========================================================================== */

const CATEGORIES = [
  { id: 'fustolt',   name: 'Füstölt',              img: 'media/stock/kat-fustolt.webp',
    desc: 'Bükkfán, türelemmel füstölve — ahogy a nagyapáink csinálták.' },
  { id: 'sonka',     name: 'Sonka és szalonna',    img: 'media/stock/kat-sonka.webp',
    desc: 'Sózva, érlelve, vékonyra szeletelve is kérhető.' },
  { id: 'mangalica', name: 'Mangalica',            img: 'media/stock/kat-mangalica.webp',
    desc: 'A magyar őshonos fajta — mélyebb íz, selymesebb zsír.' },
  { id: 'kolbasz',   name: 'Kolbász és stifolder', img: 'media/stock/kat-kolbasz.webp',
    desc: 'Kézzel töltve, csípős vagy csemege — ízlés szerint.' },
  { id: 'marha',     name: 'Marha',                img: 'media/stock/kat-marha.webp',
    desc: 'Saját tartású marhából, karakteres, tiszta ízek.' },
  { id: 'egyeb',     name: 'Egyéb finomságok',     img: 'media/stock/kat-egyeb.webp',
    desc: 'Tepertő, májas, disznósajt — a disznótorok világa.' },
];

const W_DEFAULT = { min: 0.5, step: 0.5, max: 5, default: 1 };
const W_SMALL   = { min: 0.25, step: 0.25, max: 3, default: 0.5 }; /* MINTA: tepertő/májas lépésköz */

const PRODUCTS = [
  /* ---- Füstölt ---- */
  { id: 'fustolt-csulok', name: 'Füstölt csülök', category: 'fustolt', price: 3000,
    weight: W_DEFAULT, featured: false, options: { spice: null, sliceable: false },
    desc: 'Hagyományos füstöléssel készült, szaftos csülök. Bableves, csülökpörkölt vagy sültcsülök alapja — a füst mélysége a kész ételben is érződik.' },
  { id: 'fustolt-tarja-karaj', name: 'Füstölt tarja / karaj', category: 'fustolt', price: 5000,
    weight: W_DEFAULT, featured: true, options: { spice: null, sliceable: true },
    desc: 'Sokoldalú füstölt sertéshús: hidegen vékonyra szelve, rakott ételbe vagy főzve egyaránt megállja a helyét. Szeletelve is kérhető.' },
  { id: 'fustolt-oldalas', name: 'Füstölt oldalas', category: 'fustolt', price: 3000,
    weight: W_DEFAULT, featured: false, options: { spice: null, sliceable: false },
    desc: 'Pácolva, majd füstölve. Sütőben ropogósra sütve vagy töltött káposztába — a csonton érlelt hús íze semmihez sem fogható.' },

  /* ---- Sonka és szalonna ---- */
  { id: 'szivsonka', name: 'Szívsonka', category: 'sonka', price: 4500,
    weight: W_DEFAULT, featured: false, options: { spice: null, sliceable: true },
    desc: 'A comb legszebb, legtömörebb része, sózva és érlelve. Vékonyra szeletelve is kérhető — jelezze a megjegyzésben.' },
  { id: 'angol-szalonna', name: 'Angol szalonna', category: 'sonka', price: 4500,
    weight: W_DEFAULT, featured: false, options: { spice: null, sliceable: true },
    desc: 'Húsos, füstölt szalonna sütéshez és pirításhoz. Reggeli tojás mellé vagy egy jó házi burger koronájának.' },
  { id: 'csaszar-szalonna', name: 'Császárszalonna', category: 'sonka', price: 4500,
    weight: W_DEFAULT, featured: false, options: { spice: null, sliceable: true },
    desc: 'Rétegesen húsos, fűszeres kérgű császár. Ropogósra sütve, kenyérre vagy lencsefőzelékbe — a klasszikus, ahogy lennie kell.' },
  { id: 'kenyerszalonna', name: 'Kenyérszalonna', category: 'sonka', price: 2500,
    weight: W_DEFAULT, featured: false, options: { spice: null, sliceable: false },
    desc: 'A szalonnasütések főszereplője. Nyárson, parázs felett csepegtetve hagymás kenyérre — vagy egyszerűen a zsírjáért.' },
  { id: 'paprikas-tokaszalonna', name: 'Paprikás–fokhagymás abált tokaszalonna', category: 'sonka', price: 2600,
    weight: W_DEFAULT, featured: false, options: { spice: null, sliceable: true },
    desc: 'Lassan abált tokaszalonna, paprikás-fokhagymás bundában. Puha, omlós, fűszeres — friss kenyérrel és lilahagymával az igazi.' },

  /* ---- Mangalica ---- */
  { id: 'mangalica-sonka-szalonna', name: 'Mangalica sonka / szalonna', category: 'mangalica', price: 5500,
    weight: W_DEFAULT, featured: true, options: { spice: null, sliceable: true },
    desc: 'Az őshonos mangalica húsa zsírosabb, íze mélyebb, selymesebb. Sózva, érlelve — vékony szeletekben olvad az ember száján.' },
  { id: 'mangalica-stifolder', name: 'Mangalica stifolder', category: 'mangalica', price: 6000,
    weight: W_DEFAULT, featured: true, options: { spice: null, sliceable: true },
    desc: 'Házi jellegű, lassan érlelt mangalica stifolder. Vastagabb szemcséjű, gazdag fűszerezésű — szeletelve is kérhető.' },
  { id: 'mangalica-kolbasz', name: 'Mangalica kolbász', category: 'mangalica', price: 4500,
    weight: W_DEFAULT, featured: false, options: { spice: ['csípős', 'csemege'], sliceable: false },
    desc: 'Mangalicából töltött kolbász, csípős vagy csemege változatban. A zsírosabb hús miatt szaftosabb, teltebb ízű, mint a megszokott.' },

  /* ---- Kolbász és stifolder ---- */
  { id: 'stifolder', name: 'Stifolder', category: 'kolbasz', price: 5000,
    weight: W_DEFAULT, featured: false, options: { spice: ['csípős', 'csemege'], sliceable: true },
    desc: 'A baranyai svábok öröksége: vastag, lassan érlelt, paprikás szalámiféle. Csípős vagy csemege — mindkettő a türelem íze.' },
  { id: 'sertes-kolbasz', name: 'Sertéskolbász', category: 'kolbasz', price: 3800,
    weight: W_DEFAULT, featured: false, options: { spice: ['csípős', 'csemege'], sliceable: false },
    desc: 'A mindennapok kolbásza, kézzel töltve. Erős vagy lágy fűszerezéssel — reggelihez, vacsorához, útravalónak.' },
  { id: 'sutokolbasz', name: 'Sütőkolbász', category: 'kolbasz', price: 2600,
    weight: W_DEFAULT, featured: false, options: { spice: ['csípős', 'csemege'], sliceable: false },
    desc: 'Frissen a sütőbe vagy serpenyőbe. Hagymás tört burgonyával, mustárral — egyszerű, becsületes vacsora, ahogy régen.' },

  /* ---- Marha ---- */
  { id: 'marha-stifolder', name: 'Marha stifolder', category: 'marha', price: 7000,
    weight: W_DEFAULT, featured: true, options: { spice: null, sliceable: true },
    desc: 'Saját tartású marhából érlelt stifolder — ritkaság a maga nemében. Mély, karakteres íz, szeletelve is kérhető.' },
  { id: 'marha-kolbasz', name: 'Marha kolbász', category: 'marha', price: 5000,
    weight: W_DEFAULT, featured: false, options: { spice: ['csípős', 'csemege'], sliceable: false },
    desc: 'Tiszta marhahúsból töltve, csípős vagy csemege fűszerezéssel. Markánsabb, „vadabb” karakter, mint a sertés kolbászé.' },

  /* ---- Egyéb finomságok ---- */
  { id: 'teperto-chips', name: 'Tepertő chips', category: 'egyeb', price: 6000,
    weight: W_SMALL, featured: false, options: { spice: null, sliceable: false },
    desc: 'Vékonyra sütött, üvegropogós tepertő. Sörkorcsolyának, salátára morzsolva vagy csak úgy, marokból — veszélyesen fogyós.' },
  { id: 'hagyomanyos-teperto', name: 'Hagyományos tepertő', category: 'egyeb', price: 5000,
    weight: W_SMALL, featured: false, options: { spice: null, sliceable: false },
    desc: 'Ahogy a disznótorban készül: omlós, szaftos tepertő. Zsírjával együtt is kérhető — friss kenyérre kenve maga a gyerekkor.' },
  { id: 'parasztmajas', name: 'Paraszt májas', category: 'egyeb', price: 3000,
    weight: W_SMALL, featured: false, options: { spice: null, sliceable: false },
    desc: 'Kenhető, sűrű, fűszeres májas — a ház egyik büszkesége. Pirítósra vastagon, savanyúsággal mellé. Saját recept, sehol máshol.' },
  { id: 'hurka-valogat', name: 'Hurka választék (húsos, véres)', category: 'egyeb', price: 2100,
    weight: W_DEFAULT, featured: true, options: { spice: null, sliceable: false },
    desc: 'Húsos és véres hurka, frissen, készlet szerint. Bő zsírban ropogósra sütve, hagymás tört burgonyával — a disznótor lelke.' },
  { id: 'hazias-disznosajt', name: 'Házias disznósajt', category: 'egyeb', price: 2900,
    weight: W_DEFAULT, featured: false, options: { spice: null, sliceable: false },
    desc: 'Hagyományos családi recept szerint, kemencében abálva. Ecetes lilahagymával, friss kenyérrel — férfias, becsületes falat.' },
  { id: 'toltott-szupecsenye', name: 'Töltött szűzpecsenye', category: 'egyeb', price: 2800,
    weight: W_DEFAULT, featured: false, options: { spice: null, sliceable: false },
    desc: 'Szűzpecsenye házi töltelékkel — a töltelék a szezon szerint változhat, érdemes rákérdezni az üzletben. Ünnepi asztalra való.' },
];

function getProduct(id) { return PRODUCTS.find(p => p.id === id) || null; }
function getCategory(id) { return CATEGORIES.find(c => c.id === id) || null; }

window.HFDATA = { CATEGORIES, PRODUCTS, getProduct, getCategory };
