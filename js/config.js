/* ==========================================================================
   HEGYHÁTI FINOMSÁGOK, központi konfiguráció
   --------------------------------------------------------------------------
   MINTA-ADATOK KÖZPONTI LISTÁJA (éles előtt EZEKET kell cserélni):
     1. SHIPPING.*         = szállítási díjak, min. rendelés, ingyenes küszöb (MINTA!)
     2. LEGAL.*            = cégadatok az impresszumhoz/ÁSZF-hez (MINTA!)
     3. FLAGS.DEMO_MODE    = élesítéskor false
     4. FLAGS.PAYMENT_PROVIDER = élesítéskor 'barion' (functions/ + POSKey env kell,
        lásd functions/README.md)
   ========================================================================== */

const SITE = {
  name: 'Hegyháti Finomságok',
  domain: 'hegyhatifinomsagok.com',
  phone: '+36 30 300 7422',
  phoneHref: 'tel:+36303007422',
  email: 'hegyhatihus@gmail.com',
  facebook: 'https://www.facebook.com/profile.php?id=61588375946089',
  address: 'Pécsi Vásárcsarnok',
  addressShort: 'Pécsi Vásárcsarnok',
  city: 'Pécs',
  openingDays: 'keddtől szombatig',
  openingHours: '6:00-14:00, szombaton 6:00-12:00',
  openingLine: 'Keddtől péntekig 6:00-14:00, szombaton 6:00-12:00',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=P%C3%A9csi+V%C3%A1s%C3%A1rcsarnok',
};

/* MINTA szállítási díjszabás, az ügyféllel egyeztetendő! */
const SHIPPING = {
  zones: {
    pecs:   { label: 'Pécs',                 fee: 990 },   /* MINTA */
    korzet: { label: 'Pécs környéke (40 km)', fee: 1990 },  /* MINTA */
  },
  freeAbove: 25000,   /* MINTA: e felett ingyenes a szállítás */
  minOrder: 8000,     /* MINTA: minimum rendelési érték házhozszállításnál */
  pickupLabel: 'Átvétel az üzletben, ingyenes',
};

/* MINTA cégadatok a jogi oldalakhoz, Barion-élesítés előtt KÖTELEZŐ kitölteni */
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
