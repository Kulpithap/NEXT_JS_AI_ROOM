# ManuVox — Rencana Desain UI Lengkap (Per Layar)
### Siap pakai untuk prompt di Stitch AI / Figma / desain markdown

---

## 0. Prinsip Desain (baca ini dulu sebelum masuk ke screen)

ManuVox dipakai oleh penyandang Tuli — jadi desainnya **bukan sekadar cantik, tapi harus komunikatif secara visual**. Tiga prinsip yang jadi pegangan di semua layar:

1. **Visual-first, bukan audio-first.** Setiap notifikasi/status yang biasanya disampaikan lewat suara (nada dering, "typing...", notif) harus punya padanan visual yang jelas (getar, animasi, badge warna, ikon).
2. **Glassmorphism sebagai identitas, bukan dekorasi.** Efek frosted-glass (Haze) dipakai konsisten di header & bottom nav supaya orang langsung tahu "ini ManuVox" — bukan ditempel sembarangan.
3. **Aksesibilitas = prioritas #1, bukan checklist akhir.** Touch target ≥48dp, kontras tinggi, reduce-motion switch, contentDescription di semua ikon. Ini yang membedakan ManuVox dari clone WhatsApp biasa.

---

## 1. Design System

### 1.1 Warna
Brand fixed (bukan Material You dinamis) — biar konsisten dan gampang dites aksesibilitasnya.

| Token | Light Mode | Dark Mode | Pemakaian |
|---|---|---|---|
| `brand.primary` | `#6D5DF6` (violet) | `#8B7CFA` | Tombol utama, aksen aktif |
| `brand.secondary` | `#00C2A8` (teal) | `#2EDFC7` | Sukses, gesture terdeteksi, tombol terima call |
| `brand.gradientStart → End` | `#6D5DF6 → #9B5DF6` | sama, opacity disesuaikan | Splash, header auth, FAB |
| `surface.base` | `#FFFFFF` | `#111218` | Background utama |
| `surface.glass` | `rgba(255,255,255,0.55)` + blur 24 | `rgba(20,21,28,0.55)` + blur 24 | Bottom nav, header chat (Haze) |
| `state.danger` | `#EF4444` | `#F87171` | Missed call, hapus, error |
| `state.warning` | `#F59E0B` | `#FBBF24` | Rekam gesture (mode orange) |
| `text.primary` | `#14151C` | `#F4F4F6` | — |
| `text.secondary` | `#6B6E7B` | `#9A9DA8` | Timestamp, subtitle |

Kontras minimal WCAG AA (4.5:1) untuk semua teks di atas glass — ini yang paling sering gagal di desain glassmorphism, jadi solid color fallback wajib disiapkan untuk mode "reduce transparency".

### 1.2 Tipografi
- Font: **Plus Jakarta Sans** atau **Inter** (geometris, jelas dibaca di ukuran kecil — penting karena subtitle gesture harus terbaca cepat saat video call).
- Skala: Display 28/36 · Title 20/28 · Body 16/24 · Caption 13/18.
- Font size adjustable oleh user (sudah ada di Settings) → semua teks pakai unit `sp`, jangan hardcode.

### 1.3 Spacing & Radius
- Grid dasar 4dp. Spacing umum: 8 / 12 / 16 / 24 / 32.
- Radius: card 20dp, bottom sheet 28dp (top corners), button pill 999dp (untuk CTA utama), chip 999dp.
- Touch target minimum **48×48dp**, termasuk ikon kecil seperti close chip di CreateGroup.

### 1.4 Elevation & Glass
- 3 layer: `flat` (list item), `raised` (card post/gesture), `glass` (nav + header floating).
- Glass selalu punya **border 1px semi-transparan** di atasnya supaya tetap terbaca di background terang maupun gelap.

### 1.5 Motion
- Durasi standar: micro 150ms, transisi antar-screen 300ms, easing `easeOutCubic`.
- **Setiap animasi harus punya versi "reduce motion"**: fade sederhana 100ms menggantikan scale/parallax/shimmer. Ini toggle di Settings dan wajib dihormati di semua 18 layar.

### 1.6 Ikonografi
- Set ikon konsisten (Phosphor / Lucide, style rounded), stroke 1.5–2px.
- Semua ikon fungsional (bukan dekorasi) wajib `contentDescription` — tulis di catatan desain tiap layar di bawah supaya writer/dev tidak lupa.

---

## 2. Rencana Per Layar

Format tiap layar: **Tujuan → Layout → Komponen kunci → Interaksi & motion → Catatan aksesibilitas → Prompt Stitch AI** (tinggal copy-paste, tinggal sesuaikan nama produk kalau perlu).

---

### A. Onboarding & Autentikasi

#### 1. SplashScreen
**Layout:** Full-bleed gradient background (`brandGradient`, diagonal 135°). Di tengah: logo tangan/isyarat dalam lingkaran putih dengan soft-shadow, scale-in 0.8→1.0 + fade 0–100%. Teks "ManuVox" di bawah logo, tagline kecil di bawahnya, versi app di pojok bawah. 2–3 lingkaran outline transparan sebagai dekorasi mengambang di belakang logo (parallax halus).

**Interaksi:** Auto-navigasi setelah ±1.5s, tanpa input user.

**Aksesibilitas:** Splash tidak boleh jadi satu-satunya sumber info — pastikan tidak ada delay berlebihan yang menghalangi screen reader startup.

**Prompt Stitch AI:**
> "Mobile splash screen for a sign-language translation app called ManuVox. Diagonal purple-to-violet gradient background (#6D5DF6 to #9B5DF6). Centered circular white badge with a minimalist hand/sign-language icon, soft shadow. App name 'ManuVox' in bold geometric sans-serif below, small tagline underneath. Two faint concentric outline circles floating behind the badge. Version number bottom center. Clean, calm, accessible feel."

---

#### 2. OnboardingScreen
**Layout:** 3-page horizontal carousel. Tiap halaman: ilustrasi/ikon besar gradient di atas (area ~50% layar), judul fitur, deskripsi singkat 2 baris, dot indicator animasi di bawah ilustrasi. Tombol "Skip" pojok kanan atas, tombol "Lanjut"/"Mulai Sekarang" full-width pill di bawah.

**3 halaman:** (1) Chat — bubble chat ilustratif, (2) Deteksi Gesture — ikon tangan dengan garis landmark, (3) Video Call — ikon kamera + gelombang suara jadi teks.

**Interaksi:** Swipe horizontal, haptic feedback ringan di tiap transisi halaman.

**Aksesibilitas:** Dot indicator perlu label "Halaman 1 dari 3" untuk screen reader, bukan cuma visual.

**Prompt Stitch AI:**
> "Onboarding carousel screen, page 2 of 3, for accessibility app ManuVox. Large gradient icon illustration of a hand with landmark dots (representing hand-tracking), centered top half. Bold title 'Deteksi Gesture Real-Time', two-line description below. Animated dot page indicator. Skip button top-right, full-width pill button 'Lanjut' at bottom. Light background, violet-teal gradient accents, rounded modern UI, Material 3 style."

---

#### 3. LoginScreen
**Layout:** Bagian atas ±30% layar diisi gradient dekoratif melengkung (curved bottom edge), logo kecil di dalamnya. Di bawahnya, card putih/gelap dengan field Email, field Password (ikon show/hide di kanan), link "Lupa password?" align kanan, tombol gradient pill "Masuk" full-width, divider "atau", link ke Register di bawah.

**Interaksi:** Error → field shake horizontal + border merah + Snackbar di bawah.

**Aksesibilitas:** Label field harus visible (bukan cuma placeholder yang hilang saat diketik) — penting untuk low-vision.

**Prompt Stitch AI:**
> "Mobile login screen, Material 3 style. Top 30% has a curved-bottom purple gradient header with a small centered logo. Below it, clean white card with email input field, password field with show/hide eye icon, 'Forgot password?' link right-aligned, full-width gradient pill button 'Masuk', divider text 'atau', and a 'Belum punya akun? Daftar' link at bottom. Soft shadows, rounded 16dp inputs, generous spacing, accessible high-contrast text."

---

#### 4. RegisterScreen
**Layout:** Back button pojok kiri atas. Judul "Buat Akun Baru". Field: Nama tampilan, Email, Password, Konfirmasi Password — dengan indikator real-time (ikon centang hijau/silang merah kecil di samping field konfirmasi begitu user mulai mengetik). Tombol "Daftar" full-width, disabled (abu-abu) sampai semua valid, lalu berubah gradient saat aktif.

**Aksesibilitas:** State disabled/enabled tombol harus punya perbedaan kontras yang jelas, bukan cuma opacity 0.5 (bisa gagal kontras AA).

**Prompt Stitch AI:**
> "Mobile registration screen, Material 3. Back arrow top-left, title 'Buat Akun Baru'. Four stacked input fields: display name, email, password, confirm password — confirm-password field shows a small green check or red cross icon inline as user types. Below, a full-width button 'Daftar', shown in disabled gray state transitioning to active gradient purple when valid. Clean spacing, rounded inputs, subtle helper text under each field."

---

### B. Home & Komunikasi Inti

#### 5. HomeScreen (Hub 5 tab)
**Layout:** Header gradient di atas dengan greeting ("Halo, Faruq 👋") + avatar kecil + ikon Settings kanan atas. Konten tab di bawahnya (isi berubah sesuai tab aktif). Bottom navigation **frosted-glass** melayang (bukan menempel penuh ke edge — beri margin 12dp kiri-kanan-bawah, radius 28dp) dengan 5 ikon: Chat (badge unread merah), Kontak, Gesture (ikon tengah sedikit lebih besar/highlight karena fitur utama), Feed, Riwayat. FAB muncul hanya di tab Chat (di atas bottom nav, offset kanan bawah), expand jadi 2 opsi: "Chat baru" & "Grup baru".

**Interaksi:** Transisi antar tab pakai crossfade, bukan slide (supaya tidak berat). FAB expand dengan mini stagger animation.

**Aksesibilitas:** Ikon tab tengah (Gesture) yang di-highlight jangan sampai membuat urutan tab membingungkan screen reader — beri label eksplisit "Tab 3 dari 5: Gesture".

**Prompt Stitch AI:**
> "Mobile home screen hub with floating frosted-glass bottom navigation bar (5 icons: Chat with red unread badge, Contacts, Gesture as center highlighted icon, Feed, Call History), rounded 28dp corners, blurred translucent background showing content behind it. Top header with purple gradient, greeting text 'Halo, Faruq 👋', small circular avatar and settings gear icon top-right. Content area below shows a chat list. Floating action button bottom-right above the nav bar. Modern glassmorphism, Material 3, light mode."

---

#### 6. ChatScreen
**Layout:** Header floating glassmorphic menempel di atas (bukan solid), berisi tombol back, avatar+nama+status ("online"/"terakhir dilihat..."), ikon video-call kanan. Body: LazyColumn bubble chat (kiri=lawan bicara warna surface, kanan=user warna brand gradient), timestamp kecil di bawah tiap bubble/grup. Input bar bawah: ikon tambah gambar, text field rounded pill, tombol kirim (berubah dari mic→send saat ada teks). Indikator "sedang mengetik..." dengan 3 dots animasi mengambang di atas input bar.

**Interaksi:** Tap avatar → Profile. Tap ikon video → VideoCallScreen. Banner kuning/merah muncul dari atas kalau network bermasalah atau chat diblokir.

**Aksesibilitas:** Wallpaper chat kustom & kontras bubble harus tetap dites — user bisa pilih wallpaper gelap yang menurunkan kontras teks, jadi sistem perlu auto-adjust warna teks bubble berdasar wallpaper.

**Prompt Stitch AI:**
> "Mobile chat conversation screen, Material 3. Floating frosted-glass header with back arrow, avatar, contact name, 'online' status text, and a video-call icon on the right. Below, a scrollable message list with rounded chat bubbles — gray bubbles left-aligned for received messages, purple gradient bubbles right-aligned for sent messages, small timestamps. Typing indicator with animated three dots above the input bar. Bottom input bar: image-add icon, pill-shaped text field, send button. Subtle chat wallpaper pattern in background. Clean, warm, accessible."

---

#### 7. CreateGroupScreen
**Layout:** Header "Grup Baru" + back. Field nama grup di atas. Baris chip horizontal scrollable menampilkan anggota yang sudah dipilih (tiap chip: avatar mini + nama + ikon "x" untuk hapus, ≥48dp touch target meski chipnya kecil visualnya). Di bawahnya daftar kontak dengan checkbox/avatar-selected-state. FAB centang di kanan bawah untuk konfirmasi (disabled kalau nama grup kosong atau anggota <1).

**Prompt Stitch AI:**
> "Mobile 'Create Group' screen, Material 3. Header with back arrow and title 'Grup Baru'. Group name input field at top. Horizontal scrollable row of selected-member chips (avatar + name + small removable X). Below, a full contact list with checkboxes and avatars, some selected showing a purple checkmark overlay on the avatar. Floating circular confirm button (checkmark icon) bottom-right in gradient purple, disabled gray state example also shown."

---

#### 8. ContactScreen
**Layout:** Search bar sticky di atas. Daftar kontak dikelompokkan alfabetis dengan index huruf (A-Z) mengambang di sisi kanan layar (seperti kontak iOS/Android native) untuk fast-scroll. Tiap item: avatar + status dot (online/offline) + nama + tombol aksi kecil (chat/call ikon). FAB "+" untuk tambah kontak → membuka overlay dengan 3 mode tab: PIN / QR / Browse.

**Aksesibilitas:** Index alfabet di sisi kanan targetnya kecil secara visual — pastikan hit-area tetap 48dp per huruf meski visualnya rapat, atau ganti dengan gesture drag yang lebih toleran.

**Prompt Stitch AI:**
> "Mobile contacts screen, Material 3. Sticky search bar at top. Contact list grouped alphabetically with section headers (A, B, C...), each row showing circular avatar with small online-status dot, contact name, and quick chat/call icon buttons. Floating alphabet index strip on the right edge for fast scrolling. Purple gradient floating action button bottom-right to add contact, opening a bottom sheet with three tabs: PIN, QR Code, Browse."

---

#### 9. FeedScreen
**Layout:** Compose area di atas (avatar + input placeholder "Apa yang kamu pikirkan?" → buka dialog buat post). Pull-to-refresh custom (bukan spinner default — pakai animasi brand, misal logo kecil berputar). Feed cards: avatar+nama+waktu, konten teks, gambar (kalau ada, rounded 16dp), row aksi like/comment/share dengan ikon + counter. Bottom sheet muncul untuk komentar (draggable, snap points 50%/90%). Shimmer skeleton saat loading awal/infinite-scroll.

**Aksesibilitas:** Tombol like harus punya state visual jelas selain warna (misal ikon outline→filled), karena color-blind users juga perlu dipertimbangkan meski beda dari audiens utama.

**Prompt Stitch AI:**
> "Mobile social feed screen, Material 3. Top compose bar with avatar and placeholder text 'Apa yang kamu pikirkan?'. Below, a scrollable feed of post cards: avatar, name, timestamp, text content, optional rounded image, and a row of like/comment/share icon buttons with counters. One card shows a shimmer skeleton loading state. A comment bottom sheet is partially visible sliding up from the bottom. Clean card design with soft shadows, rounded corners, light background."

---

#### 10. ProfileScreen
**Layout:** Cover photo full-width di atas dengan efek parallax scroll. Avatar besar overlap antara cover dan konten (setengah nongol di cover, setengah di card), dot indikator online di pojok avatar. Di bawah avatar: nama, status singkat. Dua tombol besar berdampingan: "Chat" & "Video Call". Card info: email, PIN (dengan tombol copy), status, terakhir dilihat, "kontak sejak [tanggal]". Section keamanan (untuk profil orang lain) berisi tombol Block/Report dengan warna danger, masing-masing memicu dialog konfirmasi.

**Prompt Stitch AI:**
> "Mobile profile screen, Material 3. Full-width cover photo at top with parallax feel. Large circular avatar overlapping the cover and content area, small green online-status dot on avatar edge. Name and status text below avatar. Two side-by-side pill buttons: 'Chat' and 'Video Call'. Info card listing email, PIN with copy icon, status, last seen, 'contact since' date. Lower section with red-accented 'Block' and 'Report' buttons for security. Clean elevated cards, soft shadow, rounded 20dp corners."

---

### C. Video Call (fitur inti dengan gesture)

#### 11. VideoCallScreen — layar paling penting
**Layout:** Video remote full-screen sebagai base layer. Self-view (PiP) kecil di pojok kanan atas, mirrored, rounded corner, bisa di-drag pindah pojok. Header floating transparan di atas (avatar kecil, nama, durasi call format mm:ss) — auto-hide setelah beberapa detik tanpa tap, muncul lagi saat layar disentuh. **Subtitle gesture** di posisi center-top (di bawah header): teks hasil terjemahan BISINDO, muncul dengan efek fade/typewriter, background semi-transparan gelap supaya kontras di atas video apapun. Indikator "Menyambungkan..." full-screen sebelum call tersambung (dengan CallPulseAvatar). Control bar bawah floating-glass: mic, kamera on/off, switch kamera, speaker, end-call (merah, sedikit lebih besar & terpisah dari yang lain supaya tidak salah tap).

**Interaksi:** Tap layar toggle visibility header+controls. Subtitle gesture harus **stay lebih lama** dari subtitle biasa (minimal 2-3 detik) karena ini pengganti audio bagi user Tuli — jangan buru-buru hilang.

**Aksesibilitas — KRITIS di layar ini:** Subtitle adalah pengganti telinga. Ukuran font subtitle harus lebih besar dari subtitle video biasa, kontras tinggi (putih di atas overlay gelap ~70% opacity), dan idealnya ada opsi riwayat subtitle (scroll ke atas untuk lihat kalimat sebelumnya) karena real-time caption gampang terlewat.

**Prompt Stitch AI:**
> "Mobile video call screen (full-screen video call UI). Full-screen remote video background. Small mirrored self-view picture-in-picture window top-right with rounded corners. Semi-transparent floating header with avatar, name, call duration timer. Below header, a real-time sign-language caption/subtitle in bold white text over a dark semi-transparent rounded pill background, center-aligned, positioned upper-middle of screen. Bottom floating glass control bar with icons: mute mic, toggle camera, switch camera, speaker, and a larger red end-call button. Modern WebRTC video call interface, dark overlay UI elements for contrast, accessible large caption text."

---

#### 12. IncomingCallScreen
**Layout:** Full-screen gradient background (bisa pakai foto kontak sebagai background blur + gradient overlay). Di tengah: avatar besar dengan **ring berdenyut** (pulse animation, 2-3 ring melebar bergantian). Nama pemanggil di bawah avatar, teks "Panggilan masuk...". Dua tombol besar di bawah: Tolak (merah, kiri) & Terima (hijau, kanan), keduanya bulat besar (≥64dp) dengan ikon telepon.

**Aksesibilitas:** Ini pengganti "dering" — pastikan device bergetar dengan pola jelas + layar auto-wake dengan brightness maksimal, karena user tidak bisa mendengar bunyi dering.

**Prompt Stitch AI:**
> "Mobile incoming call screen, full-screen dark gradient background with subtle blurred contact photo behind. Centered large circular avatar with animated pulsing rings expanding outward around it. Caller name in bold text below avatar, subtitle 'Panggilan masuk...'. Two large circular buttons at bottom: red decline button (phone-hangup icon) on left, green accept button (phone icon) on right, both at least 64dp with soft glow shadow."

---

#### 13. CallLogsScreen
**Layout:** List dikelompokkan per section tanggal ("Hari Ini", "Kemarin", tanggal spesifik). Tiap item: avatar, nama, ikon panah kecil warna-coded (masuk=hijau mengarah ke dalam, keluar=brand mengarah keluar, missed=merah), durasi & waktu di bawah nama, tombol callback (ikon telepon) di kanan. Empty state kalau belum ada riwayat: ilustrasi + teks ajakan mulai call pertama.

**Prompt Stitch AI:**
> "Mobile call history screen, Material 3. List grouped by date sections ('Hari Ini', 'Kemarin', specific dates). Each row: circular avatar, contact name, small color-coded arrow icon (green inward arrow for incoming, purple outward arrow for outgoing, red arrow for missed calls), duration and time as secondary text, callback phone icon button on the right. Clean list dividers, generous row height for touch accessibility."

---

### D. Sistem Gesture (jantung skripsi)

#### 14. GestureHubScreen
**Layout:** Background dekoratif wave canvas halus di bagian atas (subtle, jangan ganggu keterbacaan). Hero icon tangan berdenyut (pulse lembut) di tengah atas. Progress card di bawahnya: jumlah gesture tersimpan & label unik (misal "24 gesture · 18 kata unik") dengan progress bar/ring. Tiga kartu mode besar (stacked vertikal atau grid 2+1):
- **Rekam Gesture** — aksen orange/merah, ikon kamera+plus
- **Uji Gesture** — aksen hijau/teal, ikon kamera+check
- **Rekam Dataset BISINDO** — aksen biru, badge kecil "DEBUG" (hanya tampil di build debug)
Di bawah kartu mode: daftar gesture tersimpan (LazyRow horizontal, tiap item chip dengan preview huruf/kata). Banner tutorial kecil bisa di-dismiss di paling bawah/atas.

**Prompt Stitch AI:**
> "Mobile hub screen for a sign-language training feature, Material 3. Subtle decorative wave pattern background at top. Centered pulsing hand icon illustration. Below, a progress card showing '24 gesture · 18 kata unik' with a circular progress ring. Three mode cards stacked vertically: orange-accented 'Rekam Gesture' card with camera-plus icon, teal-accented 'Uji Gesture' card with camera-check icon, blue-accented 'Rekam Dataset BISINDO' card with a small 'DEBUG' badge. Horizontal scrollable row of saved gesture chips below. Dismissible tutorial banner. Clean, encouraging, accessible design."

---

#### 15. GestureTrainingScreen
**Layout:** Stats card di atas (jumlah sampel per gesture). Tips card expandable (collapse/expand chevron) berisi cara merekam gesture yang baik. List gesture tersimpan atau empty-state ilustratif kalau belum ada. FAB "+" membuka **AddGestureDialog** (input label huruf/kata + kategori) yang lanjut ke **CameraTrainingView full-screen**: preview kamera besar, overlay panduan posisi tangan, tombol rekam besar di tengah bawah (dengan ring progress timer saat rekam), tombol save muncul setelah rekam selesai.

**Aksesibilitas:** Overlay panduan posisi tangan harus pakai bentuk/kontur, bukan hanya warna, supaya jelas terlihat di berbagai kondisi cahaya.

**Prompt Stitch AI:**
> "Mobile gesture-recording camera screen for a sign-language app, full-screen camera preview mode. Large circular record button centered at bottom with a circular timer progress ring around it while recording. Semi-transparent hand-position guide outline overlay on the camera view. Small top bar showing gesture label being recorded and a save/cancel icon. Below the main screen, also show a secondary card-based screen: stats card '32 samples recorded', an expandable tips card with a chevron, and a list of previously recorded gestures with thumbnails."

---

#### 16. GestureTestScreen
**Layout:** Camera preview full-screen dengan overlay landmark tangan (titik-titik + garis penghubung sendi, style teknikal tapi tetap elegan — warna brand, bukan default MediaPipe merah-hijau). Kata terdeteksi tampil besar di bawah kamera dengan efek typewriter (huruf muncul satu-satu). Stats bar kecil (akurasi %, FPS, confidence score) di pojok, collapsible supaya tidak mengganggu untuk user umum tapi tersedia untuk evaluasi skripsi.

**Prompt Stitch AI:**
> "Mobile gesture-testing screen, full-screen camera view with hand landmark overlay (connected dot-and-line skeleton over the hand, purple accent color instead of default red-green). Large detected word text below the camera area with a typewriter reveal effect. Small collapsible stats overlay in the corner showing accuracy percentage, FPS, and confidence score. Minimal, technical-but-elegant, dark mode friendly."

---

#### 17. BuiltinCaptureScreen (dev/debug — bukan prioritas visual publik)
**Layout:** Fase 1 — Form profil kontributor (ID, gender, umur, postur, handedness, native speaker) dalam form vertikal standar. Fase 2 — Capture: huruf berjalan (progress "Huruf: B (2/36)"), preview kamera + landmark overlay, quality gate indicator (misal ring hijau/merah menandakan kualitas cukup), tombol rekam/save/export/upload berjejer di bawah.

**Catatan:** Karena ini tool internal, cukup desain fungsional-rapi mengikuti sistem yang sama (warna, spacing) — tidak perlu polish setinggi layar publik.

**Prompt Stitch AI:**
> "Mobile internal dev-tool screen for dataset capture. Step 2 of 2: progress indicator 'Huruf: B (2/36)' at top, camera preview with hand landmark overlay in the center, a colored quality-gate ring (green = good quality, red = poor) around the preview, and a row of four buttons at bottom: record, save, export, upload. Functional, clean utilitarian UI consistent with the app's design system but simpler."

---

### E. Pengaturan & Utility

#### 18. SettingsScreen
**Layout:** Header dengan cover & foto profil (tap untuk upload/ganti), nama & PIN di bawahnya (PIN ada tombol copy). List section dengan ikon di kiri tiap grup:
- **Profil** — nama, status, privasi
- **Tampilan** — tema (light/dark/system), wallpaper chat, ukuran font (slider dengan preview live)
- **Notifikasi** — push, ringtone, floating bubble
- **Data & Backup** — backup/restore gesture, bahasa gesture
- **Akun** — reset password, hapus akun (danger zone, dipisah visual dengan warna merah + divider)
- **Logout** (tombol merah outline, bukan filled — supaya tidak seperti aksi utama)
- **Tentang**

Tiap item settings pakai row standar (ikon + label + value/chevron), dengan dialog atau bottom sheet untuk pilihan (bukan navigasi ke screen baru untuk hal kecil).

**Aksesibilitas — penting untuk layar ini:** Toggle **reduce-motion** dan **contrast tinggi** harus ada di sini secara eksplisit (bukan tersembunyi), karena ini pusat kontrol aksesibilitas seluruh app.

**Prompt Stitch AI:**
> "Mobile settings screen, Material 3. Header with cover photo, editable profile avatar, name and copyable PIN. Grouped settings list with section headers: Profil, Tampilan (theme, chat wallpaper, font size slider with live preview), Notifikasi (push, ringtone, floating bubble toggles), Data & Backup, Akun with a visually separated red danger-zone for delete account, red-outlined Logout button, and Tentang. Include explicit toggles for 'Reduce Motion' and 'Kontras Tinggi' near top of accessibility-related section. Clean grouped list style, generous touch targets, rounded section cards."

---

#### PermissionScreen (komponen reusable)
**Layout:** Ikon besar (kamera/mic) di tengah dalam lingkaran soft-color, judul singkat ("Izin Kamera Diperlukan"), deskripsi 1-2 kalimat kenapa izin dibutuhkan, tombol "Izinkan" pill full-width, opsi kecil "Buka Pengaturan" kalau user sudah pernah menolak permanen.

**Prompt Stitch AI:**
> "Mobile permission-request screen, Material 3. Centered large camera icon inside a soft-colored circle. Bold title 'Izin Kamera Diperlukan', short two-line explanation text below, full-width pill button 'Izinkan', and a small secondary text link 'Buka Pengaturan'. Friendly, reassuring, minimal design with generous white space."

---

## 3. Urutan Kerja yang Disarankan di Stitch AI

Supaya hasilnya konsisten (bukan 18 layar yang "nyasar" gaya masing-masing), disarankan urutan ini:

1. **Generate dulu 1 layar "anchor"** — pakai **HomeScreen**, karena di situ ada glass nav + header gradient yang jadi acuan semua layar lain.
2. Lock warna & style yang keluar dari situ, lalu **re-use di prompt-prompt berikutnya** (tambahkan kalimat "same design system as previous — purple gradient #6D5DF6, frosted glass nav, Plus Jakarta Sans font" di tiap prompt lanjutan).
3. Urutan generate yang efisien: Home → Splash/Onboarding/Login/Register (grup auth, gampang karena mirip pola) → Chat → Profile → VideoCall (paling kompleks, kerjakan setelah gaya sudah matang) → GestureHub/Training/Test → sisanya.
4. Setelah semua layar jadi, cek ulang 4 hal aksesibilitas ini di setiap hasil: kontras teks di atas glass, ukuran touch target, ukuran subtitle di VideoCall, dan keberadaan toggle reduce-motion/high-contrast di Settings.

---

*Dokumen ini dibuat berdasarkan `UI_OPTIMASI` (analisis 18 layar ManuVox). Kalau butuh versi yang lebih dalam untuk satu layar tertentu (misal breakdown komponen sampai level spacing px demi px untuk VideoCallScreen), tinggal bilang layar mana.*
