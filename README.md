Sistem Pelayanan Keluhan Mahasiswa (Sipelkemas)

Sipelkemas adalah sebuah aplikasi berbasis web yang dirancang untuk memudahkan mahasiswa dalam menyampaikan keluhan atau masukan terkait layanan kampus. Aplikasi ini bertujuan untuk meningkatkan kualitas pelayanan di lingkungan kampus dengan menyediakan platform yang mudah diakses oleh mahasiswa.

Fitur Utama
1. **Pendaftaran dan Login**: Mahasiswa dapat mendaftar dan masuk ke dalam sistem.
    - Role officer tidak bisa melakukan pendaftaran, hanya admin yang bisa menambahkan officer.
    - Admin dapat menambahkan, mengedit, dan menghapus akun officer dan user.
2. **Pengajuan Keluhan**: Mahasiswa dapat mengajukan keluhan melalui sistem dengan mengisi formulir yang telah disediakan.
    - Mahasiswa dapat mengunggah bukti pendukung berupa gambar atau dokumen.
    - Bisa memilih anonim
    - Bisa melihat status keluhan yang diajukan.
3. **Manajemen Keluhan**: Officer dapat melihat, menanggapi, dan mengelola keluhan yang masuk.
    - Officer dapat mengubah status keluhan (misalnya: menunggu, diproses, selesai)
    - Officer dapat memberikan tanggapan atau solusi terhadap keluhan yang diajukan (fitur comments)
    - Officer meng-manage kategori keluhan.
4. **Dashboard Admin**: Admin memiliki akses penuh untuk mengelola seluruh sistem, termasuk manajemen user dan laporan keluhan.

Role Pengguna
1. **User** (mahasiswa): Dapat mengajukan keluhan, melihat status keluhan, dan mengedit profil.
2. **Officer**: Bertanggung jawab untuk menanggapi dan mengelola keluhan yang masuk pada kategori yang ditugaskan.
3. **Admin**: Memiliki kontrol penuh atas sistem, termasuk manajemen user dan pengaturan sistem.

Pages Khusus
1. User
    - Pengajuan Keluhan
    - List Keluhan
        - Di paling atas bisa pilih kategori
        - Pada list yang belum ditanggapi, bisa menghapus keluhan
        - Pada daftarlist, di atas adlah keluhan yang chat terakhirnya dari officer, dan di bawahnya adalah keluhan yang belum ditanggapi (komen terakhir dari user).
    - Detail Keluhan
        - Bisa melihat detail keluhan, termasuk tanggapan dari officer.
        - Bisa menambahkan komentar (chat) pada keluhan yang diajukan.
        pada detail keluhan, jika statusnya "selesai", user tidak bisa menambahkan komentar lagi.
        komentar bisa dalam bentuk quoting, yakni chat biasa, namun meng-embed chat lain di atasnya.
2. Officer
    - List Keluhan
        - Bisa memilih kategori keluhan yang ditangani.
        - Bisa melihat semua keluhan yang masuk pada kategori tersebut.
        - Bisa mengubah status keluhan.
    - Detail Keluhan
        - Bisa melihat detail keluhan, termasuk komentar dari user.
        - Bisa menambahkan komentar (chat) pada keluhan yang ditangani.
        pada detail keluhan, jika statusnya "selesai", officer tidak bisa menambahkan komentar lagi.
        komentar bisa dalam bentuk quoting, yakni chat biasa, namun meng-embed chat lain di atas
3. Admin
    - Manajemen User
        - Bisa menambahkan, mengedit, dan menghapus akun officer dan user.
    - Dashboard
        - Menampilkan statistik keluhan, seperti jumlah keluhan masuk, keluhan yang sedang diproses, dan keluhan yang telah selesai.
    - Laporan Keluhan
        - Bisa melihat laporan keluhan berdasarkan kategori, status, dan periode waktu tertentu.
    - Manajemen Kategori
        - Bisa menambahkan, mengedit, dan menghapus kategori keluhan.
    - Full Access
        - Admin memiliki akses penuh ke semua fitur dan halaman dalam sistem.
