const gateScreen = document.getElementById('gateScreen');
const uploadScreen = document.getElementById('uploadScreen');
const adminKeyInput = document.getElementById('adminKeyInput');
const unlockBtn = document.getElementById('unlockBtn');
const gateError = document.getElementById('gateError');

// Agar pehle se saved hai to seedha unlock kar do
const savedKey = sessionStorage.getItem('sc_admin_key');
if (savedKey) {
  gateScreen.style.display = 'none';
  uploadScreen.style.display = 'block';
}

unlockBtn.addEventListener('click', async () => {
  const key = adminKeyInput.value.trim();
  if (!key) {
    gateError.textContent = 'Password daalein.';
    return;
  }
  // Test key by hitting a protected-ish check: hum sirf save karte hain aur asli check upload/delete request par hoga
  sessionStorage.setItem('sc_admin_key', key);
  gateScreen.style.display = 'none';
  uploadScreen.style.display = 'block';
});

// ---- Type tabs ----
let selectedType = 'audio';
const typeTabs = document.querySelectorAll('.type-tab');
const fileField = document.getElementById('fileField');
const fileInput = document.getElementById('fileInput');

typeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    typeTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    selectedType = tab.dataset.type;

    if (selectedType === 'text') {
      fileField.style.display = 'none';
      fileInput.required = false;
    } else {
      fileField.style.display = 'block';
      const acceptMap = { audio: 'audio/*', video: 'video/*', photo: 'image/*' };
      fileInput.accept = acceptMap[selectedType] || '*';
    }
  });
});

// ---- Form submit ----
const form = document.getElementById('uploadForm');
const submitBtn = document.getElementById('submitBtn');
const statusMsg = document.getElementById('statusMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusMsg.className = 'status-msg';
  statusMsg.textContent = '';

  const title = document.getElementById('title').value.trim();
  if (!title) return;

  if (selectedType !== 'text' && !fileInput.files[0]) {
    statusMsg.className = 'status-msg err';
    statusMsg.textContent = 'Is type ke liye file chuno.';
    return;
  }

  const formData = new FormData();
  formData.append('type', selectedType);
  formData.append('title', title);
  formData.append('titleEnglish', document.getElementById('titleEnglish').value.trim());
  formData.append('category', document.getElementById('category').value);
  formData.append('description', document.getElementById('description').value.trim());
  formData.append('composer', document.getElementById('composer').value.trim());
  formData.append('publisher', document.getElementById('publisher').value.trim());
  if (fileInput.files[0]) formData.append('file', fileInput.files[0]);

  submitBtn.disabled = true;
  submitBtn.textContent = 'Upload ho raha hai...';

  try {
    const res = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: { 'x-admin-key': sessionStorage.getItem('sc_admin_key') || '' },
      body: formData
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Kuch galat hua');
    }

    statusMsg.className = 'status-msg ok';
    statusMsg.textContent = '✅ Upload safal! Website par gallery mein dikh jayega.';
    form.reset();
  } catch (err) {
    statusMsg.className = 'status-msg err';
    statusMsg.textContent = '❌ ' + err.message + ' — agar password galat tha to niche "Logout" karke firse try karein.';
    // Agar password galat tha, saved key hata do
    if (err.message.toLowerCase().includes('password')) {
      sessionStorage.removeItem('sc_admin_key');
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Upload Karein';
  }
});
