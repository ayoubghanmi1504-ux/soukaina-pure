// SOUKAINA PURE — script único para index.html, index-fr.html e index-ar.html
// El idioma se detecta por el nombre del archivo (los tres HTML son idénticos).
// Pega aquí la URL de tu Google Apps Script (ver google-apps-script.gs) para guardar pedidos en una hoja.
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzVDxXMW9NtNrkAxYfFWiglBWZRXfm6W0ift3oXn4pdtOZT5lfCsKAvsfib9PBhjMSz4w/exec';
const PHONE = "212710270328", $ = s => document.querySelector(s);
const L = /-fr/.test(location.pathname) ? 1 : /-ar/.test(location.pathname) ? 2 : 0;
const lang = ['en', 'fr', 'ar'][L], loc = ['en', 'fr', 'ar-MA'][L];
document.documentElement.lang = lang;
if (L == 2) document.documentElement.dir = 'rtl';

// [EN, FR, AR]
const D = {
  n1: ['Collection', 'Collection', 'المجموعة'], n2: ['Philosophy', 'Philosophie', 'فلسفتنا'],
  n3: ['Routine', 'Routine', 'الروتين'], n4: ['FAQ', 'FAQ', 'الأسئلة'],
  eyebrow: ['Natural cosmetics & wellness', 'Cosmétique naturelle & bien-être', 'مستحضرات طبيعية وعافية'],
  hero: ['Your health, in its purest form', 'Votre santé, dans sa forme la plus pure', 'صحتك في أنقى صورها'],
  cta: ['Explore the collection', 'Découvrir la collection', 'اكتشف المجموعة'],
  s1: ['Free delivery to Morocco & Europe', 'Livraison gratuite Maroc & Europe', 'توصيل مجاني للمغرب وأوروبا'],
  cod: ['Cash on delivery', 'Paiement à la livraison', 'الدفع عند الاستلام'],
  s3: ['Certified quality', 'Qualité certifiée', 'جودة معتمدة'],
  col: ['The collection', 'La collection', 'المجموعة'],
  search: ['Search products…', 'Rechercher un produit…', 'ابحث عن منتج…'],
  all: ['All', 'Tout', 'الكل'], 'Bienestar': ['Wellness', 'Bien-être', 'العافية'],
  'Cosmética': ['Cosmetics', 'Cosmétique', 'مستحضرات التجميل'], 'Packs': ['Packs', 'Packs', 'عروض'],
  'Cuidado Personal': ['Personal care', 'Soin personnel', 'عناية شخصية'],
  'Nuevo': ['New', 'Nouveau', 'جديد'], 'Top Ventas': ['Best seller', 'Best-seller', 'الأكثر مبيعاً'],
  'Recomendado': ['Recommended', 'Recommandé', 'موصى به'],
  'Ahorro': ['Savings', 'Économies', 'توفير'], 'Ecológico': ['Eco-friendly', 'Écologique', 'صديق للبيئة'], 'Económico': ['Budget-friendly', 'Économique', 'اقتصادي'],
  'Esencial': ['Essential', 'Essentiel', 'أساسي'], 'Especial': ['Special', 'Spécial', 'خاص'], 'Lujo': ['Luxury', 'Luxe', 'فاخر'],
  'Popular': ['Popular', 'Populaire', 'شائع'], 'Práctico': ['Practical', 'Pratique', 'عملي'],
  more: ['Load more', 'Voir plus', 'عرض المزيد'], empty: ['No products found', 'Aucun produit trouvé', 'لم يتم العثور على منتجات'],
  add: ['Add', 'Ajouter', 'إضافة'], ing: ['Ingredients', 'Ingrédients', 'المكونات'],
  addc: ['Add to cart', 'Ajouter au panier', 'أضف إلى السلة'],
  ph: ['Our philosophy', 'Notre philosophie', 'فلسفتنا'],
  pht: ['Natural formulas, designed as daily wellness tools', 'Des formules naturelles, pensées comme des outils de bien-être quotidien', 'تركيبات طبيعية مصممة كأدوات يومية للعافية'],
  a1: ['100% natural', '100% naturel', '100% طبيعي'], a1d: ['Top-tier aloe vera and botanical extracts.', "Aloe vera et extraits botaniques de qualité supérieure.", 'الصبار ومستخلصات نباتية عالية الجودة.'],
  a2: ['Premium quality', 'Qualité premium', 'جودة ممتازة'], a2d: ['Formulas built for visible, lasting results.', 'Des formules pour des résultats visibles et durables.', 'تركيبات لنتائج ظاهرة ودائمة.'],
  a3: ['Personal support', 'Accompagnement personnalisé', 'دعم شخصي'], a3d: ['We guide you on WhatsApp.', 'Nous vous guidons sur WhatsApp.', 'نرشدك عبر واتساب.'],
  ban: ['The Soukaina Pure system', 'Le système Soukaina Pure', 'نظام سكينة بيور'],
  st: ['essential steps', 'étapes essentielles', 'خطوات أساسية'],
  std: ['for lasting skin and body performance.', 'pour une peau et un corps performants.', 'لأداء دائم للبشرة والجسم.'],
  k1: ['Nourish', 'Nourrir', 'تغذية'], k2: ['Boost', 'Activer', 'تنشيط'], k3: ['Glow', 'Éclat', 'إشراقة'], k4: ['Care', 'Soin', 'عناية'],
  fq1: ['How long does delivery take?', 'Quel est le délai de livraison ?', 'كم تستغرق مدة التوصيل؟'],
  fa1: ['Usually 2 to 5 days. We confirm details on WhatsApp before dispatch.', 'En général 2 à 5 jours. Nous confirmons les détails sur WhatsApp avant l’envoi.', 'عادةً من 2 إلى 5 أيام. نؤكد التفاصيل عبر واتساب قبل الشحن.'],
  fq2: ['How do I pay?', 'Comment payer ?', 'كيف أدفع؟'], fa2: ['In cash when you receive your order.', 'En espèces à la réception de votre commande.', 'نقداً عند استلام طلبك.'],
  cart: ['Your cart', 'Votre panier', 'سلتك'], total: ['Total', 'Total', 'المجموع'],
  nm: ['Your name (optional)', 'Votre nom (facultatif)', 'اسمك (اختياري)'], ct: ['Your city (optional)', 'Votre ville (facultatif)', 'مدينتك (اختياري)'],
  order: ['Order via WhatsApp', 'Commander via WhatsApp', 'اطلب عبر واتساب'],
  empty0: ['Your cart is empty', 'Votre panier est vide', 'سلتك فارغة'],
  added: ['Added to cart ✓', 'Ajouté au panier ✓', 'تمت الإضافة ✓'],
  ord: ['NEW ORDER', 'NOUVELLE COMMANDE', 'طلب جديد'],
  sent: ['Order sent via WhatsApp ✓', 'Commande envoyée via WhatsApp ✓', 'تم إرسال الطلب عبر واتساب ✓'],
  ck: ['We use cookies to improve the site.', 'Nous utilisons des cookies pour améliorer le site.', 'نستخدم ملفات الارتباط لتحسين الموقع.'],
  ok: ['Accept', 'Accepter', 'قبول'], no: ['Decline', 'Refuser', 'رفض'],
  pk: ['Packs & offers', 'Packs & offres', 'العروض والباقات'], pkd: ['Better value when you buy together.', 'Plus avantageux en packs.', 'أوفر عند الشراء ضمن باقة.'],
  gl: ['Shop by goal', 'Par objectif', 'حسب هدفك'], g_hair: ['Hair & nails', 'Cheveux & ongles', 'الشعر والأظافر'], g_skin: ['Skin', 'Peau', 'البشرة'],
  g_joints: ['Joints & bones', 'Articulations & os', 'المفاصل والعظام'], g_energy: ['Energy', 'Énergie', 'الطاقة'], g_immune: ['Immunity', 'Immunité', 'المناعة'],
  fq3: ['Do you deliver outside Morocco?', 'Livrez-vous hors du Maroc ?', 'هل تتوفرون على التوصيل خارج المغرب؟'],
  fa3: ['Yes. Delivery is free to Morocco and all of Europe, in 2 to 5 days.', 'Oui. La livraison est gratuite au Maroc et dans toute l’Europe, en 2 à 5 jours.', 'نعم. التوصيل مجاني إلى المغرب وكل أوروبا خلال 2 إلى 5 أيام.'],
  indep: ['Independent distributor of Forever products', 'Distributeur indépendant des produits Forever', 'موزّع مستقل لمنتجات فوريفر'],
  legal: ['Legal & privacy', 'Mentions légales', 'الشروط والخصوصية']
};
// Objetivos: palabras clave buscadas en los textos del catálogo (en español)
const GOALS = { hair: /pelo|cabello|capilar|caspa|uñas/, skin: /piel|facial|arrugas|colágeno|hidrat|rostro/, joints: /articul|hueso|muscul|cúrcuma/, energy: /energ|fatiga|vitalidad|cansancio/, immune: /inmun|defensas|resfri/ };
let goal = '';
const t = k => D[k] ? D[k][L] : k;

// Estado. Moneda: se recuerda; la primera vez se deduce de la zona horaria (sin servicios externos).
let cat = 'all', vis = 8, cart = {};
let cur = localStorage.cur || (Intl.DateTimeFormat().resolvedOptions().timeZone == 'Africa/Casablanca' ? 'DH' : '€');
try { cart = JSON.parse(localStorage.sc2 || '{}'); } catch (e) {}
const fmt = dh => cur == '€' ? (dh / 10).toLocaleString(loc, { maximumFractionDigits: 2 }) + ' €' : dh.toLocaleString(loc) + ' DH';
const find = id => productos.find(p => p.id == id);
// Texto de producto en el idioma actual (i: 0 corta, 1 completa, 2 ingredientes); si falta la traducción, usa el original
const tx = (p, i, k) => (window.PT && PT[p.id] && PT[p.id][lang] && PT[p.id][lang][i]) || p[k] || '';

// Textos estáticos
document.querySelectorAll('[data-i]').forEach(e => e.textContent = t(e.dataset.i));
document.querySelectorAll('[data-ip]').forEach(e => e.placeholder = t(e.dataset.ip));
document.querySelectorAll('.lang a')[L].classList.add('on');
$('#cur').value = cur;
$('#cur').onchange = e => { cur = e.target.value; localStorage.cur = cur; draw(); ui(); };
document.querySelectorAll('nav a').forEach(a => a.onclick = () => document.body.classList.remove('menu'));
addEventListener('scroll', () => $('#hd').classList.toggle('sc', scrollY > 20), { passive: true });
addEventListener('keydown', e => e.key == 'Escape' && closeAll());

// Aparición al hacer scroll
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
const observe = () => document.querySelectorAll('.rv:not(.in)').forEach(e => io.observe(e));

// Catálogo
function tabs() {
  $('#tabs').innerHTML = ['all', 'Bienestar', 'Cosmética', 'Packs', 'Cuidado Personal']
    .map(c => `<button class="tab${c == cat ? ' on' : ''}" onclick="cat='${c}';tabs();draw(1)">${t(c)}</button>`).join('');
}
const card = p => `
    <article class="card rv">
      <button class="pimg" onclick="openP(${p.id})" aria-label="${p.name}">${p.tag ? `<i>${t(p.tag)}</i>` : ''}<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.visibility='hidden'"></button>
      <div class="ci"><h3>${p.name}</h3><p>${fmt(p.price)}</p></div>
      <button class="add" onclick="add(${p.id})">+ ${t('add')}</button>
    </article>`;
const hay = p => [p.name, p.descShort, p.descFull, p.ingredients].join(' ').toLowerCase();
function goals() {
  $('#goals').innerHTML = `<span>${t('gl')}</span>` + Object.keys(GOALS).map(g => `<button class="tab${g == goal ? ' on' : ''}" onclick="goal=goal=='${g}'?'':'${g}';goals();draw(1)">${t('g_' + g)}</button>`).join('');
}
function draw(reset) {
  if (reset) vis = 8;
  const q = $('#q').value.toLowerCase().trim();
  const f = productos.filter(p => (cat == 'all' || p.category == cat) && (p.name + tx(p, 0, 'descShort')).toLowerCase().includes(q) && (!goal || GOALS[goal].test(hay(p))));
  $('#grid').innerHTML = f.length ? f.slice(0, vis).map(card).join('') : `<p class="empty">${t('empty')}</p>`;
  $('.more').hidden = f.length <= vis;
  observe();
}

// Modal de producto
function openP(id) {
  const p = find(id); if (!p) return;
  $('#mi').src = p.image; $('#mi').alt = p.name;
  $('#mt').textContent = p.name; $('#mp').textContent = fmt(p.price);
  $('#mc').textContent = t(p.category || ''); $('#md').textContent = tx(p, 1, 'descFull') || tx(p, 0, 'descShort');
  $('#mg').textContent = tx(p, 2, 'ingredients');
  $('#ma').onclick = () => { add(id); closeAll(); };
  document.body.classList.add('m'); $('.x').focus();
}
function closeAll() { document.body.classList.remove('m', 'c'); }

// Carrito: solo guarda id → cantidad (los precios y nombres siempre vienen del catálogo)
const save = () => localStorage.sc2 = JSON.stringify(cart);
function toast(m) { const e = $('#toast'); e.textContent = m; e.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove('on'), 1800); }
function add(id) {
  cart[id] = (cart[id] || 0) + 1; save(); ui(); toast(t('added'));
  $('#cnt').animate([{ transform: 'scale(1.6)' }, { transform: 'scale(1)' }], 300);
  if (window.gtag) gtag('event', 'add_to_cart', { items: [{ item_id: id }] });
}
function qty(id, d) { cart[id] = (cart[id] || 0) + d; if (cart[id] <= 0) delete cart[id]; save(); ui(); }
function ui() {
  const ids = Object.keys(cart).filter(i => find(i));
  let n = 0, tot = 0;
  $('#items').innerHTML = ids.length ? ids.map(i => {
    const p = find(i), q = cart[i]; n += q; tot += p.price * q;
    return `<div class="it"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><p>${fmt(p.price * q)}</p></div>
      <div class="qt"><button onclick="qty(${i},-1)" aria-label="-">−</button><span>${q}</span><button onclick="qty(${i},1)" aria-label="+">+</button></div></div>`;
  }).join('') : `<p class="empty">${t('empty0')}</p>`;
  $('#cnt').textContent = n; $('#tot').textContent = fmt(tot);
}
function order() {
  const ids = Object.keys(cart).filter(i => find(i));
  if (!ids.length) return toast(t('empty0'));
  let tot = 0, m = `🛍️ *SOUKAINA PURE* — ${t('ord')}\n\n👤 ${$('#nm').value.trim() || '-'}\n📍 ${$('#ct').value.trim() || '-'}\n\n`;
  ids.forEach(i => { const p = find(i); tot += p.price * cart[i]; m += `▫️ ${cart[i]}x ${p.name} — ${fmt(p.price * cart[i])}\n`; });
  m += `\n💳 ${t('cod')}\n💰 *${t('total')}: ${fmt(tot)}*`;
  if (SHEET_URL) fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', keepalive: true, body: JSON.stringify({ name: $('#nm').value.trim(), city: $('#ct').value.trim(), items: ids.map(i => cart[i] + 'x ' + find(i).name).join('; '), total: tot, currency: 'DH', lang }) }).catch(() => {});
  window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(m)}`, '_blank', 'noopener');
  if (window.gtag) gtag('event', 'click_whatsapp_checkout', { value: tot, currency: 'MAD' });
  cart = {}; save(); ui(); closeAll(); toast(t('sent'));
}

// Pasos: usan los productos 1 a 4 del catálogo
$('#steps-list').innerHTML = [1, 2, 3, 4].map(i => { const p = find(i); return p ? `<div class="step rv"><button class="bub" onclick="openP(${i})" aria-label="${p.name}"><img src="${p.image}" alt=""></button><div><span class="num">${i}/</span><h3>${t('k' + i)}</h3><p>${p.name}</p></div></div>` : ''; }).join('');

// Analítica solo con consentimiento (RGPD)
function loadA() {
  ['https://www.googletagmanager.com/gtag/js?id=G-9905CBYM81', 'https://www.clarity.ms/tag/ys3836pw5z'].forEach(u => { const s = document.createElement('script'); s.async = 1; s.src = u; document.head.append(s); });
  window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date()); gtag('config', 'G-9905CBYM81');
}
function consent(v) { localStorage.ck = v; $('#ck').hidden = true; if (v) loadA(); }
if (localStorage.ck == '1') loadA(); else if (localStorage.ck == null) $('#ck').hidden = false;

const packs = productos.filter(p => p.category == 'Packs');
$('#prow').innerHTML = packs.map(p => card(p).replace('card rv', 'card rv in')).join('');
$('#packs').hidden = !packs.length;

// SEO: canonical por idioma y datos estructurados de producto
const cn = document.createElement('link'); cn.rel = 'canonical'; cn.href = location.origin + location.pathname; document.head.append(cn);
const ld = document.createElement('script'); ld.type = 'application/ld+json';
ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': productos.map(p => ({ '@type': 'Product', name: p.name, image: new URL(p.image, location.href).href, description: tx(p, 0, 'descShort'), offers: { '@type': 'Offer', price: p.price, priceCurrency: 'MAD', availability: 'https://schema.org/InStock' } })) });
document.head.append(ld);

tabs(); goals(); draw(); ui(); observe();
