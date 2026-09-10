# Sosmet — Mobile-First PWA Social Media & Simulation Engine

**Sosmet** (singkatan dari *Social Media*) adalah aplikasi Progressive Web App (PWA) berbasis React, TypeScript, dan Vite yang mensimulasikan ekosistem media sosial hidup di sekeliling pengguna. 

Proyek ini dibangun secara independen (*fully sandboxed*) dengan fokus utama pada pengalaman media sosial visual yang bersih, alami, dan bebas dari ornamen AI yang berlebihan.

---

## 🌟 Fitur Utama

- **PWA Ready**: Terinstal di mobile/desktop, dukungan standalone display, `manifest.webmanifest`, dan service worker caching shell.
- **Onboarding Ringan**: Setup profil 3 langkah (Username, Foto Profil, dan Topik Minat).
- **Feed Visual Algorithmic**: Feed foto yang mengurutkan postingan berdasarkan keterbaruan, minat pengguna, dan hubungan sosial.
- **Simulasi Sosial Terdistribusi**: Engine simulasi probabilistik di latar belakang yang menghasilkan *likes*, *comments*, *follows*, dan *profile visits* secara bertahap dan tidak sempurna (termasuk delay dan lonjakan alami).
- **Abstraksi Provider AI (`AIProvider`)**: 
  - **Fallback Provider (Default)**: Berjalan 100% tanpa API key menggunakan logika deterministik lokal.
  - **Gemini Multimodal Vision & Comment Generator**: Opsional jika `VITE_GEMINI_API_KEY` dikonfigurasi.
- **5 Tab Navigasi MVP**: `HOME`, `DISCOVER`, `CREATE`, `ACTIVITY`, `PROFILE`.
- **Inspector Simulasi (Debug Drawer)**: Tombol CPU tersembunyi di sudut kanan atas untuk memantau event stream, mempercepat, menjeda, atau mereset dunia simulasi.

---

## 🛠️ Instalasi & Cara Jalankan

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Dev Server
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

### 3. Build Production & Check Types
```bash
npm run build
# atau
npx tsc --noEmit
```

---

## 🔑 Konfigurasi Environment Variables (Opsional)

Aplikasi ini **TIDAK** membutuhkan API Key untuk berfungsi penuh. Jika Anda ingin mengaktifkan integrasi Google Gemini API untuk analisis gambar multimodal & pembentukan komentar LLM:

Buat file `.env.local` di root proyek:
```env
VITE_GEMINI_API_KEY=API_KEY_GEMINI_ANDA
```

---

## 🏛️ Arsitektur Proyek

```text
src/
├── components/
│   ├── create/          # Modal upload postingan & tagging
│   ├── debug/           # Developer debug drawer & simulation controls
│   ├── discover/        # Grid jelajah & rekomendasi akun
│   ├── feed/            # Timeline feed & PostCard (double tap like)
│   ├── layout/          # MobileShell & Navbar (5 tabs)
│   ├── notifications/   # Activity log (likes, comments, follows)
│   ├── onboarding/      # 3-step modal onboarding
│   └── profile/         # Profil pengguna & profil akun sintetis
├── data/
│   ├── seedAccounts.ts  # Data awal 35+ akun sintetis realistis
│   └── seedPosts.ts     # Postingan awal feed berbagai niche
├── services/
│   ├── aiProvider.ts         # Abstraksi Gemini & Fallback Provider
│   ├── aiCommentGenerator.ts # Generasi komentar sosial alami
│   ├── imageAnalyzer.ts      # Ekstraksi visual metadata 1x per upload
│   └── simulationEngine.ts   # Core probabilistic simulation loop
├── store/
│   └── sosmetStore.ts   # State management (Zustand + localStorage)
└── types/
    └── sosmet.ts        # Interface TypeScript
```

---

## 📱 PWA & Mobile Test

Sosmet dioptimalkan untuk tampilan viewport mobile 360px–430px. Pada layar desktop, aplikasi akan ditampilkan di dalam *centered mobile shell container* yang elegan.
