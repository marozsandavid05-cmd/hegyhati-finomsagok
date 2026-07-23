/* ==========================================================================
   HEGYHÁTI FINOMSÁGOK — központi konfiguráció
   --------------------------------------------------------------------------
   MINTA-ADATOK KÖZPONTI LISTÁJA (éles előtt EZEKET kell cserélni):
     1. SITE.address       — pontos bolt-cím a Pécsi Vásárcsarnokban (MINTA!)
     2. SHIPPING.*         — szállítási díjak, min. rendelés, ingyenes küszöb (MINTA!)
     3. LEGAL.*            — cégadatok az impresszumhoz/ÁSZF-hez (MINTA!)
     4. FLAGS.DEMO_MODE    — élesítéskor false
     5. FLAGS.PAYMENT_PROVIDER — élesítéskor 'barion' (functions/ + POSKey env kell,
        lásd functions/README.md)
   ========================================================================== */

const SITE = {
  name: 'Hegyháti Finomságok',
  domain: 'hegyhatihusbolt.hu',
  phone: '+36 30 300 7422',
  phoneHref: 'tel:+36303007422',
  email: 'hegyhatihus@gmail.com',
  facebook: 'https://www.facebook.com/profile.php?id=61588375946089',
  /* MINTA: a pontos utca-cím a vásárcsarnokon belül egyeztetendő az ügyféllel */
  address: 'Pécsi Vásárcsarnok (MINTA: pontos cím egyeztetés alatt)',
  addressShort: 'Pécsi Vásárcsarnok',
  city: 'Pécs',
  openingDays: 'szerda és péntek',
  openingHours: '8:00–11:00',
  openingLine: 'Szerda és péntek, 8:00–11:00',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=P%C3%A9csi+V%C3%A1s%C3%A1rcsarnok',
};

/* MINTA szállítási díjszabás — az ügyféllel egyeztetendő! */
const SHIPPING = {
  zones: {
    pecs:   { label: 'Pécs',                 fee: 990 },   /* MINTA */
    korzet: { label: 'Pécs környéke (40 km)', fee: 1990 },  /* MINTA */
  },
  freeAbove: 25000,   /* MINTA: e felett ingyenes a szállítás */
  minOrder: 8000,     /* MINTA: minimum rendelési érték házhozszállításnál */
  pickupLabel: 'Átvétel az üzletben — ingyenes',
};

/* MINTA cégadatok a jogi oldalakhoz — Barion-élesítés előtt KÖTELEZŐ kitölteni */
const LEGAL = {
  operatorName: 'MINTA: üzemeltető neve (kistermelő)',
  operatorId: 'MINTA: kistermelői nyilvántartási szám',
  taxNumber: 'MINTA: adószám',
  registeredSeat: 'MINTA: székhely',
};

const FLAGS = {
  DEMO_MODE: true,              /* true = demó jelzések + szimulált fizetés */
  PAYMENT_PROVIDER: 'demo',     /* 'demo' | 'barion' (éleskor, functions/ + POSKey) */
};

const FMT = new Intl.NumberFormat('hu-HU');
function formatFt(n) { return FMT.format(Math.round(n)) + ' Ft'; }

window.HF = { SITE, SHIPPING, LEGAL, FLAGS, formatFt };
