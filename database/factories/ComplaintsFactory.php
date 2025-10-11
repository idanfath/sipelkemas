<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Complaints>
 */
class ComplaintsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Indonesian complaint titles and descriptions
        $complaintTypes = [
            'Infrastruktur' => [
                'titles' => [
                    'Jalan Berlubang di Depan Sekolah',
                    'Lampu Jalan Mati di Perumahan',
                    'Trotoar Rusak Membahayakan Pejalan Kaki',
                    'Drainase Tersumbat Menyebabkan Banjir',
                    'Jembatan Penyeberangan Rusak',
                    'Fasilitas WC Umum Tidak Terawat',
                    'Halte Bus Rusak dan Kotor',
                    'Pagar Taman Kota Patah',
                ],
                'descriptions' => [
                    'Kondisi jalan di depan sekolah sangat memprihatinkan dengan banyak lubang yang membahayakan pengguna jalan, terutama pelajar yang berangkat dan pulang sekolah.',
                    'Lampu penerangan jalan di area perumahan sudah mati sejak seminggu yang lalu, membuat kondisi malam hari sangat gelap dan rawan kejahatan.',
                    'Trotoar di sepanjang jalan utama banyak yang retak dan berlubang, sangat membahayakan pejalan kaki terutama lansia dan anak-anak.',
                    'Saluran drainase tersumbat sampah dan sedimen, menyebabkan genangan air saat hujan dan berpotensi menimbulkan banjir.',
                    'Jembatan penyeberangan mengalami kerusakan pada bagian tangga dan pegangan, membahayakan keselamatan pengguna.',
                    'Fasilitas toilet umum dalam kondisi sangat kotor, tidak ada air bersih, dan bau tidak sedap.',
                    'Halte bus dalam kondisi rusak dengan atap bocor dan tempat duduk patah, tidak layak digunakan penumpang.',
                    'Pagar pembatas taman kota banyak yang patah dan berkarat, merusak estetika dan keamanan area taman.',
                ]
            ],
            'Lingkungan' => [
                'titles' => [
                    'Penumpukan Sampah di Pinggir Jalan',
                    'Polusi Udara dari Pabrik',
                    'Pencemaran Sungai oleh Limbah',
                    'Kebisingan dari Aktivitas Konstruksi',
                    'Bau Tidak Sedap dari TPA',
                    'Pembuangan Limbah Sembarangan',
                    'Asap Kendaraan Bermotor Berlebihan',
                    'Pembakaran Sampah di Area Pemukiman',
                ],
                'descriptions' => [
                    'Terdapat penumpukan sampah yang sudah berhari-hari di pinggir jalan, menimbulkan bau tidak sedap dan mengundang lalat serta tikus.',
                    'Asap dan polusi udara dari pabrik terdekat sangat mengganggu kesehatan warga, terutama anak-anak dan lansia.',
                    'Sungai yang mengalir di dekat pemukiman tercemar limbah industri, air berubah warna dan berbau busuk.',
                    'Kebisingan dari aktivitas konstruksi berlangsung hingga malam hari, mengganggu istirahat warga sekitar.',
                    'Bau tidak sedap dari tempat pembuangan akhir sampah sangat menyengat hingga ke pemukiman warga.',
                    'Masih banyak warga yang membuang limbah rumah tangga sembarangan ke selokan dan sungai.',
                    'Asap kendaraan bermotor di jalan utama sangat pekat, terutama pada jam sibuk, mengganggu kesehatan.',
                    'Beberapa warga masih membakar sampah di halaman rumah, menimbulkan polusi udara dan asap tebal.',
                ]
            ],
            'Sosial' => [
                'titles' => [
                    'Akses Pendidikan Terbatas untuk Anak Disabilitas',
                    'Kurangnya Fasilitas Kesehatan di Daerah Terpencil',
                    'Diskriminasi dalam Pelayanan Publik',
                    'Kurangnya Program Pemberdayaan Masyarakat',
                    'Kesenjangan Ekonomi yang Tinggi',
                    'Kurangnya Akses Internet untuk Pendidikan',
                    'Fasilitas Olahraga yang Tidak Memadai',
                    'Program Bantuan Sosial Tidak Tepat Sasaran',
                ],
                'descriptions' => [
                    'Anak-anak berkebutuhan khusus di daerah kami kesulitan mengakses pendidikan karena tidak tersedia sekolah inklusi dan fasilitas yang memadai.',
                    'Daerah terpencil masih kekurangan fasilitas kesehatan, warga harus menempuh perjalanan jauh untuk berobat.',
                    'Terjadi diskriminasi dalam pelayanan publik berdasarkan status sosial dan ekonomi, melanggar prinsip keadilan.',
                    'Kurangnya program pemberdayaan masyarakat yang berkelanjutan untuk meningkatkan keterampilan dan ekonomi warga.',
                    'Kesenjangan ekonomi antara kelompok masyarakat semakin lebar, perlu ada program pemerataan.',
                    'Akses internet untuk pendidikan online masih terbatas, terutama untuk keluarga kurang mampu.',
                    'Fasilitas olahraga di lingkungan kami sangat minim, padahal penting untuk kesehatan masyarakat.',
                    'Program bantuan sosial dari pemerintah tidak tepat sasaran, masih banyak yang membutuhkan belum terdata.',
                ]
            ],
            'Keamanan' => [
                'titles' => [
                    'Tingkat Kriminalitas Meningkat di Malam Hari',
                    'Kurangnya Pos Keamanan di Area Strategis',
                    'Rawan Kecelakaan di Persimpangan Jalan',
                    'Gangguan Ketertiban dari Pemabuk',
                    'Pencurian Kendaraan Bermotor Meningkat',
                    'Pelecehan di Area Publik',
                    'Tindak Kekerasan Antar Warga',
                    'Keamanan Sekolah yang Kurang Memadai',
                ],
                'descriptions' => [
                    'Tingkat kriminalitas di area pemukiman meningkat, terutama pencurian dan perampokan pada malam hari.',
                    'Area strategis seperti pasar dan terminal kurang memiliki pos keamanan yang memadai untuk mengawasi aktivitas.',
                    'Persimpangan jalan utama sangat rawan kecelakaan karena tidak ada rambu lalu lintas yang jelas.',
                    'Seringkali terjadi gangguan ketertiban dari sekelompok pemabuk yang berkumpul di area publik.',
                    'Kasus pencurian sepeda motor semakin sering terjadi, terutama di area parkir yang kurang pengawasan.',
                    'Terjadi kasus pelecehan terhadap perempuan di area publik, perlu peningkatan keamanan.',
                    'Konflik antar warga yang berujung pada tindak kekerasan mulai sering terjadi.',
                    'Keamanan di lingkungan sekolah masih kurang, perlu ada petugas keamanan tambahan.',
                ]
            ]
        ];

        $categories = ['Infrastruktur', 'Lingkungan', 'Sosial', 'Keamanan'];
        $selectedCategory = fake()->randomElement($categories);
        $categoryData = $complaintTypes[$selectedCategory];

        $titleIndex = fake()->numberBetween(0, count($categoryData['titles']) - 1);
        $title = $categoryData['titles'][$titleIndex];
        $description = $categoryData['descriptions'][$titleIndex];

        // Generate realistic media array (sometimes null, sometimes with fake file paths)
        $media = null;
        if (fake()->boolean(40)) { // 40% chance to have media
            $mediaCount = fake()->numberBetween(1, 3);
            $media = [];
            for ($i = 0; $i < $mediaCount; $i++) {
                $media[] = [
                    'type' => fake()->randomElement(['image', 'video']),
                    'filename' => fake()->uuid() . '.' . fake()->randomElement(['jpg', 'png', 'mp4']),
                    'size' => fake()->numberBetween(100000, 5000000), // 100KB to 5MB
                    'uploaded_at' => fake()->dateTimeThisMonth()->format('Y-m-d H:i:s'),
                ];
            }
        }

        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'title' => $title,
            'description' => $description,
            'status' => fake()->randomElement(['pending', 'in_progress', 'resolved']),
            'media' => $media,
            'is_anonymous' => fake()->boolean(25), // 25% chance to be anonymous
        ];
    }

    /**
     * Indicate that the complaint is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the complaint is in progress.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'in_progress',
        ]);
    }

    /**
     * Indicate that the complaint is resolved.
     */
    public function resolved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'resolved',
        ]);
    }

    /**
     * Indicate that the complaint is anonymous.
     */
    public function anonymous(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_anonymous' => true,
        ]);
    }

    /**
     * Indicate that the complaint is not anonymous.
     */
    public function notAnonymous(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_anonymous' => false,
        ]);
    }

    /**
     * Indicate that the complaint has media attachments.
     */
    public function withMedia(): static
    {
        return $this->state(fn (array $attributes) => [
            'media' => [
                [
                    'type' => 'image',
                    'filename' => fake()->uuid() . '.jpg',
                    'size' => fake()->numberBetween(500000, 2000000),
                    'uploaded_at' => fake()->dateTimeThisMonth()->format('Y-m-d H:i:s'),
                ],
                [
                    'type' => 'image',
                    'filename' => fake()->uuid() . '.png',
                    'size' => fake()->numberBetween(300000, 1500000),
                    'uploaded_at' => fake()->dateTimeThisMonth()->format('Y-m-d H:i:s'),
                ],
            ],
        ]);
    }

    /**
     * Indicate that the complaint has no media attachments.
     */
    public function withoutMedia(): static
    {
        return $this->state(fn (array $attributes) => [
            'media' => null,
        ]);
    }

    /**
     * Create a complaint for a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }

    /**
     * Create a complaint for a specific category.
     */
    public function forCategory(Category $category): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => $category->id,
        ]);
    }
}
