# SIPELKEMAS
**Sistem Pelayanan Keluhan Mahasiswa**

Platform digital untuk pengelolaan keluhan dan masukan mahasiswa dalam meningkatkan kualitas layanan kampus.

## 📋 Deskripsi Proyek

SIPELKEMAS merupakan sistem manajemen keluhan berbasis web yang memfasilitasi komunikasi dua arah antara mahasiswa dengan pihak kampus. Sistem ini dirancang untuk mempercepat proses penanganan keluhan dan meningkatkan transparansi dalam pelayanan kampus.

## ⚡ Fitur Utama

### 🎓 Untuk Mahasiswa
- **Pengajuan Keluhan Digital**: Form pengajuan dengan dukungan upload media
- **Tracking Status Real-time**: Pantau progress penanganan keluhan
- **Mode Anonim**: Opsi pengajuan keluhan tanpa identitas
- **Sistem Komunikasi**: Chat interaktif dengan petugas terkait

### 👨‍💼 Untuk Officer
- **Dashboard Keluhan**: Manajemen keluhan berdasarkan kategori tugas
- **Sistem Respon**: Tools untuk memberikan tanggapan dan solusi
- **Update Status**: Kontrol penuh atas alur penanganan keluhan
- **Manajemen Kategori**: Pengaturan bidang tanggung jawab

### 🔐 Untuk Administrator
- **User Management**: Kelola akun mahasiswa dan officer
- **Analytics Dashboard**: Statistik dan laporan komprehensif
- **System Configuration**: Pengaturan kategori dan hak akses
- **Data Export**: Ekspor laporan dalam format CSV

## 👥 Hierarki Pengguna

| Role | Akses | Tanggung Jawab |
|------|-------|---------------|
| **Mahasiswa** | Pengajuan & tracking keluhan | Menyampaikan keluhan dan berkomunikasi dengan officer |
| **Officer** | Kategori yang ditugaskan | Menangani dan merespon keluhan sesuai bidang tugas |
| **Admin** | Full system access | Mengelola seluruh sistem dan monitoring kinerja |

## 🛠️ Tech Stack

- **Backend**: Laravel 11, PHP 8.2+
- **Frontend**: React + TypeScript, Inertia.js
- **Database**: MySQL/PostgreSQL
- **Styling**: Tailwind CSS
- **Authentication**: Laravel Fortify
- **File Storage**: Laravel Storage System

## 🚀 Installation

### Prerequisites
- PHP 8.2 atau lebih tinggi
- Composer
- Node.js & npm/yarn
- MySQL/PostgreSQL

### Setup Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/idanfath/sipelkemas.git
   cd sipelkemas
   ```

2. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database Setup**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

5. **Storage Link**
   ```bash
   php artisan storage:link
   ```

6. **Development Server**
   ```bash
   php artisan serve
   npm run dev
   ```

## 📱 Workflow Sistem

### Alur Pengajuan Keluhan
1. **Mahasiswa** submit keluhan melalui form digital
2. **Sistem** assign keluhan ke officer berdasarkan kategori
3. **Officer** review dan berikan respon/solusi
4. **Mahasiswa** dapat memberikan feedback tambahan
5. **Officer** update status hingga resolved

### Status Keluhan
- 🟡 **Menunggu**: Keluhan baru masuk, belum ditangani
- 🔵 **Sedang Diproses**: Officer sudah mulai menangani
- 🟢 **Selesai**: Keluhan telah diselesaikan

## 📁 Struktur Fitur per Role

<details>
<summary><strong>👨‍🎓 Mahasiswa</strong></summary>

- **Dashboard**: Overview keluhan dan statistik personal
- **Ajukan Keluhan**: Form submission dengan kategori dan media
- **Daftar Keluhan**: List dengan filter kategori dan status
- **Detail & Chat**: Komunikasi real-time dengan officer
- **Profile**: Manajemen data personal

</details>

<details>
<summary><strong>👨‍💼 Officer</strong></summary>

- **Dashboard**: Statistik keluhan pada kategori tugas
- **Keluhan Masuk**: Queue keluhan yang perlu ditangani
- **Detail & Respon**: Tools untuk memberikan solusi
- **Manajemen Status**: Update progress penanganan
- **Kategori**: Setting bidang tanggung jawab

</details>

<details>
<summary><strong>🔐 Administrator</strong></summary>

- **Analytics Dashboard**: Metrics dan KPI sistem
- **User Management**: CRUD mahasiswa dan officer
- **Laporan**: Export data dengan filter custom
- **Kategori**: Setup dan assignment ke officer
- **System Settings**: Konfigurasi global

</details>

## 🔒 Keamanan & Privasi

- Autentikasi multi-level dengan Laravel Fortify
- Otorisasi berbasis role dan permission
- Enkripsi data sensitif mahasiswa
- Audit trail untuk tracking aktivitas
- Option anonymous reporting untuk kasus sensitif

## 📊 Monitoring & Analytics

Sistem dilengkapi dengan dashboard analytics yang menyediakan:
- Response time rata-rata penanganan keluhan
- Kategori keluhan terbanyak
- Tingkat kepuasan mahasiswa
- Performance officer berdasarkan resolution rate

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---
*SIPELKEMAS - Membangun komunikasi yang lebih baik antara mahasiswa dan institusi pendidikan*
