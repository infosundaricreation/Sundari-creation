# Sundari Creation Website — Live Karne Ki Puri Guide (Step-by-Step)

Yeh website 2 hisso mein hai:
1. **frontend/** — jo log dekhenge (homepage + upload page)
2. **backend/** — jo data store karta hai (audio, video, photo, text + MongoDB + Cloudinary)

Website live karne ke liye 4 free services chahiye:
- **GitHub** — code rakhne ke liye
- **MongoDB Atlas** — content ki details (title, description etc.) store karne ke liye
- **Cloudinary** — audio/video/photo files store karne ke liye (free 25 GB)
- **Render** — backend chalane ke liye (free tier)
- **Netlify** — frontend (website) dikhane ke liye (free)

Sab free hain. Neeche ekdum step-by-step likha hai — jahan bhi atko, mujhe bata dena, main aage samjha dunga.

---

## STEP 1: GitHub Account Banao Aur Code Upload Karo

1. https://github.com par jaake free account banao (agar nahi hai to)
2. "New Repository" par click karo, naam do: `sundari-creation-website`
3. Public rakho, "Create repository" click karo
4. Is poore `sundari-website` folder (jo maine banaya hai) ko us repository mein upload kar do:
   - Sabse aasan tareeka: GitHub ki website par "uploading an existing file" link se, saare files/folders drag-drop kar do
   - Ya agar computer par `git` install hai to terminal mein:
     ```
     cd sundari-website
     git init
     git add .
     git commit -m "first upload"
     git branch -M main
     git remote add origin https://github.com/<aapka-username>/sundari-creation-website.git
     git push -u origin main
     ```

**Isse mujhe batao: "GitHub par upload ho gaya"** — phir aage badhenge.

---

## STEP 2: MongoDB Atlas (Database) Setup

1. https://www.mongodb.com/cloud/atlas/register par free account banao
2. "Create a Free Cluster" (M0 Free tier) select karo, koi bhi region choose karo (jaise Mumbai)
3. Cluster ban jaye (2-3 min lagenge), phir:
   - Left menu mein **"Database Access"** → "Add New Database User" → username/password banao (yaad rakhna!)
   - Left menu mein **"Network Access"** → "Add IP Address" → **"Allow Access from Anywhere"** (0.0.0.0/0) select karo
4. **"Connect"** button dabao → "Drivers" choose karo → ek connection string milegi jaisi:
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/
   ```
5. Isme `<password>` ki jagah apna actual password daal do, aur end mein `sundari_creation` add kar do:
   ```
   mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/sundari_creation
   ```
6. **Yeh puri string kahin safe jagah (notes mein) save kar lo** — agle step mein use hogi.

---

## STEP 3: Cloudinary (Audio/Video/Photo Storage) Setup

1. https://cloudinary.com/users/register/free par free account banao
2. Login karne ke baad Dashboard par teen cheezein milengi:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (eye icon dabakar dekho)
3. In teeno ko safe jagah save kar lo.

---

## STEP 4: Backend Ko Render Par Live Karo

1. https://render.com par GitHub account se sign up karo
2. Dashboard mein **"New +"** → **"Web Service"** click karo
3. Apna GitHub repo (`sundari-creation-website`) connect karo aur select karo
4. Settings mein:
   - **Name**: `sundari-creation-api` (ya jo naam chahiye)
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Neeche **"Environment Variables"** section mein yeh sab add karo (ek-ek karke "Add Environment Variable"):

   | Key | Value |
   |---|---|
   | `MONGODB_URI` | Step 2 wali puri connection string |
   | `CLOUDINARY_CLOUD_NAME` | Step 3 wala Cloud Name |
   | `CLOUDINARY_API_KEY` | Step 3 wala API Key |
   | `CLOUDINARY_API_SECRET` | Step 3 wala API Secret |
   | `ADMIN_KEY` | Apna khud ka secret password (jo aap upload karte waqt daaloge) |
   | `FRONTEND_URL` | Abhi ke liye kuch bhi daal do, Step 6 ke baad update karenge |

6. **"Create Web Service"** click karo. 2-5 minute mein deploy ho jayega.
7. Upar ek URL milega jaisa: `https://sundari-creation-api.onrender.com` — **yeh URL save kar lo.**

**Note**: Render ka free tier 15 min tak koi use na kare to "so" jaata hai — pehli request mein 20-30 second lag sakte hain, phir normal chalta hai. Yeh free plan ki limitation hai.

---

## STEP 5: Frontend Mein Backend URL Daalo

1. Apne computer par `sundari-website/frontend/js/config.js` file kholo
2. Yeh line change karo:
   ```js
   const API_BASE_URL = "http://localhost:5000";
   ```
   Isko Step 4 wale Render URL se replace karo:
   ```js
   const API_BASE_URL = "https://sundari-creation-api.onrender.com";
   ```
3. File save karke wapas GitHub par upload/update kar do (ya `git add . && git commit -m "update api url" && git push`)

---

## STEP 6: Frontend Ko Netlify Par Live Karo

1. https://app.netlify.com par GitHub se sign up karo
2. **"Add new site"** → **"Deploy manually"** (sabse aasan tareeka)
3. Sirf `frontend` folder ko seedha drag-and-drop kar do Netlify ke upload box mein
4. 30 second mein ek live URL milega jaisa: `https://sundari-creation.netlify.app`
5. (Optional) Settings → "Change site name" se naam apni pasand ka rakh sakte ho
6. (Optional) Agar apna khud ka domain (jaise sundaricreation.com) hai to Netlify Settings → "Domain management" se add kar sakte ho

---

## STEP 7: CORS Fix Karo (Zaroori)

1. Wapas Render dashboard par jaake apni backend service kholo
2. **Environment** tab mein `FRONTEND_URL` ki value ko Step 6 wale Netlify URL se update karo:
   ```
   FRONTEND_URL=https://sundari-creation.netlify.app
   ```
3. Save karo — service apne aap redeploy ho jayegi.

---

## STEP 8: Test Karo!

1. Apna Netlify URL kholo — homepage dikhna chahiye (3 services ke saath)
2. **"Upload Content"** button dabao
3. Password box mein wahi `ADMIN_KEY` daalo jo Step 4 mein set kiya tha
4. Ek test audio/photo upload karke try karo
5. Homepage par "Gallery" section mein wapas jaakar dekho — upload hua content dikhna chahiye

---

## Aage Content Kaise Upload Karoge (Roz-marra Use)

1. `yoursite.netlify.app/upload.html` par jao
2. Apna admin password daalo
3. Type choose karo (Audio/Video/Photo/Text)
4. Title, description, file bharo → "Upload Karein" dabao
5. Turant homepage ki gallery mein dikhega — sabko live website par visible hoga

---

## Agar Kahin Atak Jao

Jahan bhi koi step samajh na aaye ya error aaye — mujhe exact error message ya screenshot bhej dena, main turant next step bataunga. Poora process 30-45 minute mein ho jata hai pehli baar mein.
