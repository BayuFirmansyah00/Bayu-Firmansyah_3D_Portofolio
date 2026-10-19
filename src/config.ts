// ============================================================
// SINGLE SOURCE OF TRUTH — seluruh konten portfolio.
// Ubah konten hanya di file ini; komponen membaca dari sini.
// ============================================================

// Satu item teknologi. icon, url & short bersifat opsional —
// short = label ringkas khusus untuk piramida ikon Tech Stack.
export interface TechItem {
    name: string;
    short?: string;
    icon?: string;
    url?: string;
}

export interface SkillGroup {
    label: string;
    items: TechItem[];
}

export interface SkillCard {
    title: string;
    description: string;
    details: string;
    groups: SkillGroup[];
}

// Satu screenshot proyek. Sebagian aset (M-Speed) berupa komposit beberapa
// layar dalam satu berkas — `caption` mencatat layar apa saja yang terlihat.
export interface ProjectShot {
    src: string;
    alt: string;
    caption?: string;
}

// Galeri per role, dipakai proyek dengan beberapa jenis pengguna
// (M-Speed: Buyer, Seller, Admin, Manager).
export interface ProjectRoleGallery {
    role: string;
    summary: string;
    shots: ProjectShot[];
}

export interface Project {
    id: number;
    title: string;
    category: string;
    role?: string;
    period?: string;
    technologies: string;
    image: string;
    description: string;
    featured?: boolean;
    // Screenshot asli untuk halaman detail. Kosong/absen = aset belum ada.
    screenshots?: ProjectShot[];
    // Bila diisi, halaman detail memakai tab per role, bukan galeri tunggal.
    roleGalleries?: ProjectRoleGallery[];
}

export const config = {
    developer: {
        name: "Bayu",
        fullName: "Bayu Firmansyah",
        title: "Mobile Developer",
        tagline:
            "Mobile developer yang mengeksplorasi IoT dan AI — membangun aplikasi nyata dengan Flutter, Laravel, dan Firebase.",
        focus: ["IoT & AI", "Flutter · Laravel · Firebase"]
    },
    education: {
        degree: "D4 Teknik Informatika",
        institution: "Politeknik Negeri Jember",
        period: "Agustus 2023 – sekarang",
        gpa: "3,81/4,00"
    },
    social: {
        github: "https://github.com/BayuFirmansyah00",
        email: "bayufirr27@gmail.com",
        location: "Nganjuk, Jawa Timur"
    },
    about: {
        title: "About Me",
        description:
            "Mahasiswa D4 Teknik Informatika di Politeknik Negeri Jember dengan ketertarikan pada pengembangan aplikasi mobile, pengembangan perangkat lunak, integrasi IoT, serta eksplorasi AI dan machine learning. Sejauh ini saya lebih banyak bekerja dari sisi aplikasi: membangun aplikasi mobile dengan Flutter dan Dart, sesekali backend dengan Laravel, dan Firebase saat aplikasi butuh sinkronisasi data realtime. Saya juga mengerjakan pengujian dan dokumentasi perangkat lunak — bagian yang sering dilewati, tapi menentukan apakah aplikasi tetap bisa dipercaya saat dipakai."
    },
    // Bagian Experience HANYA menampilkan pengalaman magang.
    experiences: [
        {
            position: "Mobile Developer Intern",
            company: "CV Alkas Triyasa Adhimukti",
            period: "Juli - November 2026",
            status: "Sedang berlangsung",
            description:
                "Magang di software house yang menyediakan layanan pengembangan aplikasi dan website. Berkontribusi dalam pengembangan aplikasi mobile menggunakan Flutter dan Dart, terlibat dalam pengembangan backend menggunakan Laravel sesuai kebutuhan proyek, menggunakan Firebase dalam konteks pengembangan aplikasi, serta berkolaborasi dalam pengembangan aplikasi M-Speed."
        }
    ],
    // featured = tampil di bagian "My Work" beranda.
    // Halaman /myworks menampilkan SEMUA proyek dengan kategorinya.
    projects: [
        {
            id: 1,
            title: "M-Speed",
            category: "Internship Project",
            role: "Mobile Developer",
            period: "2026",
            technologies: "Flutter, Dart, Laravel, Firebase",
            image: "/images/Buyer_MSpeed.webp",
            description:
                "Aplikasi marketplace yang dikembangkan selama program magang untuk mendukung kebutuhan perusahaan dan vendor. Proyek ini berkaitan dengan Mitra Karya Prima (MKP), anak perusahaan PLN. Satu aplikasi dipakai beberapa peran pengguna — Buyer, Seller, Admin, dan Manager.",
            featured: true,
            // Setiap berkas berisi komposit beberapa layar dalam satu gambar.
            roleGalleries: [
                {
                    role: "Buyer",
                    summary:
                        "Sisi pembeli: katalog spare part, daftar favorit, pelacakan pesanan, dan pengaturan akun.",
                    shots: [
                        {
                            src: "/images/Buyer_MSpeed.webp",
                            alt: "Empat layar M-Speed untuk peran Buyer: beranda katalog dengan kategori dan produk, daftar produk favorit, daftar pesanan saya, dan halaman akun pengguna.",
                            caption: "Beranda · Favorit · Pesanan Saya · Akun"
                        }
                    ]
                },
                {
                    role: "Seller",
                    summary:
                        "Sisi penjual: ringkasan bisnis, pengelolaan produk, pesanan masuk, dan permintaan negosiasi.",
                    shots: [
                        {
                            src: "/images/Seller_MSpeed.webp",
                            alt: "Empat layar M-Speed untuk peran Seller: dashboard toko dengan grafik penjualan, daftar produk yang bisa diubah, daftar pesanan, dan daftar permintaan nego.",
                            caption:
                                "Dashboard · Produk · Pesanan · Permintaan Nego"
                        }
                    ]
                },
                {
                    role: "Admin",
                    summary:
                        "Sisi admin: pemantauan pengguna terdaftar dan konfigurasi data dasar platform.",
                    shots: [
                        {
                            src: "/images/Admin_MSpeed.webp",
                            alt: "Tiga layar M-Speed untuk peran Admin: dashboard admin dengan filter seller dan jumlah user terdaftar, halaman user data per kategori, dan halaman master data.",
                            caption: "Dashboard · User Data · Master Data"
                        }
                    ]
                },
                {
                    role: "Manager",
                    summary:
                        "Sisi manajer: performa tim, peninjauan pesanan, dan data anggota tim.",
                    shots: [
                        {
                            src: "/images/Manager_MSpeed.webp",
                            alt: "Tiga layar M-Speed untuk peran Manager: dashboard performa dan status pesanan, manajemen pesanan yang menunggu persetujuan, dan daftar anggota tim buyer.",
                            caption: "Dashboard · Manajemen Pesanan · Anggota Tim"
                        }
                    ]
                }
            ]
        },
        {
            id: 2,
            title: "TahanDulu",
            category: "Personal Project",
            technologies: "",
            image: "/images/TahanDulu_Dashboard.webp",
            description:
                "Aplikasi pengelolaan keuangan personal yang dirancang untuk membantu pengguna mengatur keuangan, membangun kebiasaan menabung, dan mengambil keputusan pembelian dengan lebih bijak. Saat ini masih dalam pengembangan.",
            featured: true,
            screenshots: [
                {
                    src: "/images/TahanDulu_Dashboard.webp",
                    alt: "Lima layar TahanDulu: beranda dengan uang aman hari ini dan total saldo, daftar transaksi terbaru, riwayat transaksi, halaman target keuangan, dan profil pengguna.",
                    caption: "Dashboard · Transaksi · Target Keuangan · Profil"
                },
                {
                    src: "/images/Onboarding_TahanDulu.webp",
                    alt: "Enam layar alur onboarding TahanDulu, mulai dari masuk akun, pengisian kondisi keuangan, sumber dana, pengeluaran rutin, sampai ringkasan rencana keuangan.",
                    caption: "Onboarding · Rencana keuangan"
                }
            ]
        },
        {
            id: 3,
            title: "TummyTrack",
            category: "PKM Project",
            role: "Team Leader",
            period: "Juli - November 2025",
            technologies: "Flutter, ESP32, Sensor, Firebase",
            image: "/images/tummytrack.webp",
            description:
                "Proyek smart mattress berbasis IoT untuk membantu memantau aktivitas tummy time bayi sebagai bagian dari pemantauan perkembangan motorik. Didanai dalam program PKM tingkat nasional.",
            featured: true,
            screenshots: [
                {
                    src: "/images/tummytrack.webp",
                    alt: "Tiga layar TummyTrack: splash screen, beranda dengan grafik pemantauan tummy time harian, dan halaman timer tummy time dengan pilihan mood bayi.",
                    caption: "Splash · Beranda · Tummy Time"
                }
            ]
        },
        {
            id: 4,
            title: "EkrafKuy",
            category: "Project Based Learning (PBL)",
            role: "Mobile Developer",
            period: "Februari - Mei 2025",
            technologies: "Flutter, Dart, Laravel API",
            image: "/images/Ekrafkuy.webp",
            description:
                "Proyek aplikasi yang memanfaatkan data Dinas Pemuda dan Olahraga Kabupaten Nganjuk pada 17 sektor ekonomi kreatif.",
            featured: true,
            screenshots: [
                {
                    src: "/images/Ekrafkuy.webp",
                    alt: "Tiga layar EkrafKuy: beranda berisi kategori ekonomi kreatif, daftar event terbaru, dan halaman daftar seluruh sektor.",
                    caption: "Beranda · Event · Semua Sektor"
                }
            ]
        },
        {
            id: 5,
            title: "Prediksi_DO",
            category: "Independent Study (Pijak)",
            technologies: "Python, Machine Learning, Deep Learning",
            image: "/images/Prediksi_DO.webp",
            description:
                "Proyek yang dikerjakan selama program studi independen Pijak, tempat saya mempelajari AI, machine learning, dan deep learning. Prediksi_DO adalah aplikasi web prediksi dini risiko mahasiswa berhenti kuliah (dropout) berdasarkan data akademik, sosial, dan ekonomi yang diisi pengguna lewat formulir. Antarmuka aplikasi memakai nama DontBe-DO.",
            featured: false,
            screenshots: [
                {
                    src: "/images/Prediksi_DO.webp",
                    alt: "Tiga tangkapan layar aplikasi Prediksi_DO: beranda berisi penjelasan singkat dan langkah penggunaan, formulir prediksi drop-out, dan halaman Tentang yang menjelaskan cara kerja serta privasi data.",
                    caption: "Beranda · Form Prediksi · Tentang"
                },
                {
                    src: "/images/Form_Prediksi.webp",
                    alt: "Formulir prediksi Prediksi_DO secara penuh, terbagi menjadi faktor akademik, faktor sosial, dan faktor ekonomi, dengan tombol mulai prediksi di bagian bawah.",
                    caption: "Form prediksi lengkap"
                }
            ]
        },
        {
            id: 6,
            title: "E-Jurnal PKL",
            category: "Project Based Learning (PBL)",
            role: "Mobile Frontend Developer",
            period: "September - Desember 2024",
            technologies: "",
            image: "/images/Ejurnal.webp",
            description:
                "Project Based Learning (PBL) berfokus pada implementasi UI Android dan alur interaksi aplikasi jurnal Praktik Kerja Lapangan.",
            featured: false,
            screenshots: [
                {
                    src: "/images/Ejurnal.webp",
                    alt: "Tiga layar E-Jurnal PKL: splash screen dengan logo SMKN 1 Tanjunganom, beranda berisi formulir tambah kegiatan PKL dan statusnya, serta halaman konfirmasi berhasil tambah kegiatan.",
                    caption:
                        "Splash · Beranda · Berhasil Tambah Kegiatan"
                }
            ]
        },
        {
            id: 7,
            title: "E-Cash",
            category: "Project Based Learning (PBL)",
            role: "Software Tester",
            period: "Februari - Mei 2024",
            technologies: "MySQL, NetBeans, JasperReports",
            image: "/images/E_Cash.webp",
            description:
                "Project Based Learning (PBL) dengan fokus pengujian perangkat lunak menggunakan pendekatan Black Box Testing dan White Box Testing. Aplikasi yang diuji adalah E-Cash, aplikasi kasir desktop untuk Amanah Busana dengan basis data MySQL, dikembangkan di NetBeans, memakai kartu member RFID, dan menyediakan laporan JasperReports.",
            featured: false,
            screenshots: [
                {
                    src: "/images/E_Cash.webp",
                    alt: "Tiga tampilan aplikasi kasir desktop E-Cash: halaman sambutan, halaman login, dan dashboard berisi menu produk, transaksi, data supplier, laporan, dan member.",
                    caption: "Sambutan · Login · Dashboard"
                }
            ]
        },
        {
            id: 8,
            title: "Kelontong Raya",
            category: "Project Based Learning (PBL)",
            role: "System Documentation",
            period: "September - Desember 2023",
            technologies: "",
            image: "/images/kelontong-raya.svg",
            description:
                "Project Based Learning (PBL) dengan fokus dokumentasi kebutuhan sistem, alur sistem, dan laporan pengujian."
        }
    ] as Project[],
    contact: {
        email: "bayufirr27@gmail.com",
        github: "https://github.com/BayuFirmansyah00",
        linkedin: "https://www.linkedin.com/in/bayu-firmansyah-064438361/"
    },
    // Dua kartu "What I Do". Setiap kartu memuat beberapa grup skills.
    // Tech Stack (piramida ikon) diambil otomatis dari grup-grup di bawah ini.
    skills: {
        cards: [
            {
                title: "MOBILE DEVELOPER",
                description: "Aplikasi mobile Flutter & pengembangan perangkat lunak",
                details:
                    "Membangun aplikasi mobile dengan Flutter dan Dart, didukung backend Laravel dan Firebase, serta pengujian perangkat lunak dengan pendekatan black box dan white box.",
                groups: [
                    {
                        label: "Mobile Development",
                        items: [
                            { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", url: "https://flutter.dev" },
                            { name: "Dart", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg", url: "https://dart.dev" },
                            { name: "Android Studio", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg", url: "https://developer.android.com/studio" }
                        ]
                    },
                    {
                        label: "Backend & Database",
                        items: [
                            { name: "Laravel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg", url: "https://laravel.com" },
                            { name: "SQL" },
                            { name: "Firebase Realtime Database", short: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg", url: "https://firebase.google.com/products/realtime-database" }
                        ]
                    },
                    {
                        label: "Testing",
                        items: [{ name: "Black Box Testing" }, { name: "White Box Testing" }]
                    }
                ]
            },
            {
                title: "IoT & AI",
                description: "Integrasi perangkat IoT & eksplorasi AI/machine learning",
                details:
                    "Menghubungkan perangkat ESP32 dan sensor ke aplikasi mobile, serta mendalami Python untuk machine learning dan deep learning.",
                groups: [
                    {
                        label: "IoT",
                        items: [
                            { name: "ESP32", url: "https://www.espressif.com/en/products/socs/esp32" },
                            { name: "Integrasi sensor" },
                            { name: "Integrasi perangkat IoT dengan aplikasi mobile" }
                        ]
                    },
                    {
                        label: "AI & Data",
                        items: [
                            { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", url: "https://www.python.org" },
                            { name: "Machine Learning" },
                            { name: "Deep Learning" }
                        ]
                    },
                    {
                        label: "Tools & Workflow",
                        items: [
                            { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", url: "https://git-scm.com" },
                            { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", url: "https://github.com" },
                            { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", url: "https://www.figma.com" },
                            { name: "Draw.io", icon: "https://cdn.simpleicons.org/diagramsdotnet", url: "https://app.diagrams.net" },
                            { name: "Microsoft Office" },
                            { name: "Google Workspace", url: "https://workspace.google.com" }
                        ]
                    }
                ]
            }
        ] as SkillCard[]
    }
};
