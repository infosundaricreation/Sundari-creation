document.getElementById('year').textContent = new Date().getFullYear();

const galleryGrid = document.getElementById('galleryGrid');
const shopGrid = document.getElementById('shopGrid');
const filterBar = document.getElementById('filterBar');
const WHATSAPP_NUMBER = '918619494371'; // country code + number, no + or spaces
let allItems = [];
let currentFilter = 'all';

async function loadContent() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/content`);
    if (!res.ok) throw new Error('Server response nahi de raha');
    allItems = await res.json();
    renderGallery();
    renderShop();
  } catch (err) {
    const errMsg = `<div class="empty-state">
      Content load nahi ho paaya. Backend URL check karein (js/config.js).<br>
      Error: ${err.message}
    </div>`;
    galleryGrid.innerHTML = errMsg;
    if (shopGrid) shopGrid.innerHTML = errMsg;
  }
}

function renderShop() {
  if (!shopGrid) return;
  const items = allItems.filter(i => i.forSale);

  if (items.length === 0) {
    shopGrid.innerHTML = `<div class="empty-state">अभी कोई item बिक्री के लिए उपलब्ध नहीं है। जल्द ही आएगा!</div>`;
    return;
  }

  shopGrid.innerHTML = items.map(item => {
    const waMsg = encodeURIComponent(`Namaste! Mujhe "${item.title}" (₹${item.price}) khareedna hai. Payment kaise karun?`);
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`;

    let mediaHtml = `<div class="media">${iconFor(item.type)}</div>`;
    if (item.type === 'photo' && item.fileUrl) {
      mediaHtml = `<div class="media"><img src="${item.fileUrl}" alt="${item.title}" loading="lazy"></div>`;
    }

    return `
      <div class="gcard">
        ${mediaHtml}
        <div class="body">
          <span class="tag">${item.category || 'other'}</span>
          <h4 class="hi">${item.title}</h4>
          ${item.titleEnglish ? `<span class="en">${item.titleEnglish}</span>` : ''}
          ${item.description ? `<p>${item.description}</p>` : ''}
          <div style="font-size:22px; font-weight:800; color:#8b1d1d; margin:10px 0;">₹${item.price}</div>
          <a href="${waLink}" target="_blank" class="btn btn-gold" style="display:block; text-align:center; padding:10px; font-size:14px;">🛒 WhatsApp पर Buy करें</a>
        </div>
      </div>`;
  }).join('');
}

function iconFor(type) {
  return { audio: '🎵', video: '🎬', photo: '📷', text: '📝' }[type] || '📁';
}

function renderGallery() {
  const items = currentFilter === 'all'
    ? allItems
    : allItems.filter(i => i.type === currentFilter);

  if (items.length === 0) {
    galleryGrid.innerHTML = `<div class="empty-state">Abhi is category mein koi content upload nahi hua. <a href="upload.html">Yahan se upload karein →</a></div>`;
    return;
  }

  galleryGrid.innerHTML = items.map(item => {
    let mediaHtml = `<div class="media">${iconFor(item.type)}</div>`;
    if (item.type === 'photo' && item.fileUrl) {
      mediaHtml = `<div class="media"><img src="${item.fileUrl}" alt="${item.title}" loading="lazy"></div>`;
    } else if (item.type === 'video' && item.fileUrl) {
      mediaHtml = `<div class="media"><video src="${item.fileUrl}" controls></video></div>`;
    }

    const audioPlayer = (item.type === 'audio' && item.fileUrl)
      ? `<audio controls src="${item.fileUrl}"></audio>` : '';

    return `
      <div class="gcard">
        ${mediaHtml}
        <div class="body">
          <span class="tag">${item.category || 'other'}</span>
          <h4 class="hi">${item.title}</h4>
          ${item.titleEnglish ? `<span class="en">${item.titleEnglish}</span>` : ''}
          ${item.description ? `<p>${item.description}</p>` : ''}
          ${audioPlayer}
        </div>
      </div>`;
  }).join('');
}

filterBar.addEventListener('click', (e) => {
  if (!e.target.classList.contains('filter-btn')) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  currentFilter = e.target.dataset.filter;
  renderGallery();
});

loadContent();
