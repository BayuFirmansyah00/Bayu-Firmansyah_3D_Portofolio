# Bayu Firmansyah — 3D Portfolio

Portfolio 3D personal milik **Bayu Firmansyah** — Mahasiswa D4 Teknik Informatika, Politeknik Negeri Jember.

Konsep: **"The Developer's Desk — Ideas Become Products"**.

## Stack

- React 18 + TypeScript + Vite
- Three.js (imperatif, non React Three Fiber) untuk karakter 3D
- GSAP + ScrollTrigger untuk animasi scroll
- Lenis untuk smooth scrolling

## Perintah

```bash
npm ci        # install dependensi (ikuti package-lock.json)
npm run dev   # development server
npm run build # type-check + production build
npm run lint  # eslint
```

## Sistem desain

Gaya: **editorial 3D**, terinspirasi meja kerja developer — bersih, asimetris, banyak whitespace.

Semua warna, spasi, dan tipografi adalah CSS variable di [`src/index.css`](src/index.css):

| Token | Nilai |
| --- | --- |
| `--ivory` | `#F5F2EB` (latar utama) |
| `--charcoal` | `#20201E` (teks; band Contact & loading) |
| `--cobalt` | `#3155D9` (aksen) |
| `--stone` | `#D9D5CC` (garis, angka besar) |
| `--white` | `#FFFFFF` (permukaan) |

Tipografi: **Space Grotesk** (display) + **Inter** (body), ukuran memakai `clamp()`.
Alias lama `--backgroundColor` / `--accentColor` tetap dipertahankan agar selector animasi lama bekerja.

## Struktur konten

Seluruh teks yang tampil di website bersumber dari **satu file**: [`src/config.ts`](src/config.ts) —
profil, pendidikan, pengalaman (magang), proyek, kategori proyek, kontak, dan skills.
Ubah konten cukup lewat file tersebut; komponen hanya membaca dari config.

Klasifikasi proyek di config:

| Proyek | Kategori |
| --- | --- |
| M-Speed | Internship Project |
| TahanDulu | Personal Project (in development) |
| TummyTrack | PKM Project (didanai nasional) |
| EkrafKuy | Project Based Learning (PBL) |
| E-Jurnal PKL | Project Based Learning (PBL) |
| E-Cash | Project Based Learning (PBL) |
| Kelontong Raya | Project Based Learning (PBL) |

## Aset

Sudah dipakai (screenshot asli, disalin ke `public/images/`):

| Berkas | Dipakai untuk |
| --- | --- |
| `foto_profil_bayu.png` | Foto profil di hero |
| `TahanDulu.png` | Proyek TahanDulu |
| `tummytrack.png` | Proyek TummyTrack |
| `Ekrafkuy.png` | Proyek EkrafKuy |
| `Ejurnal.png` | Proyek E-Jurnal PKL |

Masih placeholder `public/images/*.svg` (SVG dibuat sendiri, bukan screenshot):

- **M-Speed** — `m-speed.svg`
- **E-Cash** — `e-cash.svg`
- **Kelontong Raya** — `kelontong-raya.svg`

Placeholder memakai palet ivory/charcoal dan mencantumkan label "screenshot belum tersedia" — jangan dianggap sebagai tangkapan layar aplikasi.

Belum tersedia:

- `og:image` untuk Open Graph
- Screenshot M-Speed, E-Cash, Kelontong Raya

## Kredit

Based on the original [3D portfolio template by codexahmar](https://github.com/codexahmar) (MIT License).
Konten, identitas, dan konfigurasi di repo ini telah diganti menjadi milik Bayu Firmansyah.
