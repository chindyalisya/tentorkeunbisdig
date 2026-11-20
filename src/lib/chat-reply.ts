import type { Booking } from './types';

/**
 * Simulasi balasan tentor untuk mode demo (tanpa tentor sungguhan di seberang).
 * Membaca topik pesan siswa, memakai detail sesi, dan tidak mengulang balasan
 * yang baru saja dipakai. Untuk balasan sungguhan, hubungkan ke Supabase Realtime
 * (tentor membalas dari panel tentor) atau ke API LLM.
 */

type Rule = { test: RegExp; replies: (ctx: Ctx) => string[] };

interface Ctx {
  text: string;
  nomor?: string;
  booking?: Booking | null;
}

const when = (b?: Booking | null) =>
  b?.session_date && b?.session_time ? `${b.session_date}, ${b.session_time}` : null;

const RULES: Rule[] = [
  {
    test: /\b(terima kasih|makasih|thanks|thx|tengkyu)\b/i,
    replies: () => [
      'Sama-sama, Arga! Semangat terus ya.',
      'Siap, senang bisa bantu. Kalau ada yang masih bingung, tanya lagi aja.',
      'Sama-sama! Jangan lupa istirahat yang cukup sebelum sesi.',
    ],
  },
  {
    test: /\b(kalkulator|alat tulis|bawa apa|perlu bawa|siapkan|peralatan)\b/i,
    replies: () => [
      'Kalkulator ilmiah biasa sudah cukup, kalkulator grafik tidak wajib. Yang penting bawa buku catatan dan modul yang sudah dicetak.',
      'Tidak perlu kalkulator grafik. Siapkan kalkulator ilmiah, pensil, dan lembar latihan dari modul ya.',
    ],
  },
  {
    test: /\b(alamat|lokasi|rumah|senopati|patokan|dimana|di mana|titik)\b/i,
    replies: () => [
      'Alamatnya sudah aku catat. Aku berangkat 30 menit sebelum sesi, nanti kabari lagi kalau sudah dekat ya.',
      'Oke, alamat dikonfirmasi. Kalau ada patokan khusus atau akses masuk lingkungan, kabari aku sebelum sesi.',
      'Siap, aku sudah simpan alamatnya. Pastikan ada meja belajar yang cukup terang dan tenang ya.',
    ],
  },
  {
    test: /\b(jadwal|reschedule|ganti jam|pindah|mundur|maju|batal|batalkan|libur|izin|telat|terlambat)\b/i,
    replies: (c) => [
      `Boleh. ${when(c.booking) ? `Jadwal sekarang ${when(c.booking)}.` : 'Jadwal sekarang bisa dilihat di halaman Jadwal.'} Kamu bisa kasih tahu jam yang cocok, nanti aku cek ketersediaanku.`,
      'Perubahan jadwal sebaiknya paling lambat H-1 supaya slotnya tidak hangus. Mau pindah ke hari apa?',
      'Kalau mau menjadwal ulang, ajukan lewat halaman Jadwal ya, biar rekber dan e-tiketnya ikut terbarui.',
    ],
  },
  {
    test: /\b(bayar|pembayaran|rekber|harga|tarif|biaya|refund|uang|dana)\b/i,
    replies: () => [
      'Dana kamu aman di rekber TentorKeun. Baru diteruskan ke aku setelah sesi selesai, jadi tidak perlu khawatir.',
      'Untuk urusan pembayaran, semua lewat rekber di aplikasi. Rinciannya bisa kamu lihat di halaman Jadwal.',
    ],
  },
  {
    test: /\b(tiket|e-tiket|qr|presensi|absen)\b/i,
    replies: () => [
      'E-tiket ada di halaman Jadwal, tombol "Buka Tiket". Tunjukkan kode QR-nya saat aku tiba untuk presensi.',
      'Kode QR e-tiket dipindai di awal sesi. Cukup siapkan layar ponsel yang menyala ya.',
    ],
  },
  {
    test: /\b(modul|pdf|materi|rumus|rangkuman|catatan)\b/i,
    replies: (c) => [
      c.nomor
        ? `Soal nomor ${c.nomor} di modul memang sering bikin bingung. Coba tuliskan dulu apa yang diketahui dan ditanyakan, nanti kita bahas langkahnya bareng.`
        : 'Modulnya bisa diunduh di chat ini. Bab mana yang mau didalami dulu?',
      'Untuk materi itu, kuncinya hafal pola dulu baru latihan variasi. Aku siapkan beberapa contoh tambahan untuk sesi nanti.',
      'Boleh kirim foto bagian yang belum paham? Biar aku lihat langkah mana yang bikin macet.',
    ],
  },
  {
    test: /\b(soal|nomor|no\.?|latihan|pr|tugas|ujian|try ?out|tryout|utbk|snbt|kuis|ulangan)\b/i,
    replies: (c) => [
      c.nomor
        ? `Soal nomor ${c.nomor} ya. Coba kerjakan sampai bagian yang kamu bisa, lalu kirim fotonya. Nanti aku tunjukkan di mana letak macetnya.`
        : 'Kirim aja soalnya (foto juga boleh), nanti kita bahas sama-sama di sesi atau langsung di sini.',
      'Untuk persiapan UTBK, targetkan 20 soal per hari dengan batas waktu. Kecepatan itu hasil dari latihan rutin.',
      'Catat soal yang salah beserta alasannya. Buku kesalahan seperti itu biasanya paling efektif menaikkan skor.',
    ],
  },
  {
    test: /\b(bingung|tidak paham|nggak paham|gak paham|belum paham|susah|sulit|pusing|stres|stress|cemas|takut)\b/i,
    replies: () => [
      'Wajar kok kalau terasa sulit di awal. Kita pecah jadi langkah kecil, bagian mana yang paling bikin bingung?',
      'Tenang, pelan-pelan saja. Ceritakan bagian yang tersangkut, nanti aku jelaskan dengan contoh yang lebih sederhana.',
    ],
  },
  {
    test: /\b(halo|hai|hi|hello|selamat (pagi|siang|sore|malam)|assalamualaikum|permisi)\b/i,
    replies: () => [
      'Halo Arga! Ada yang bisa aku bantu sebelum sesi?',
      'Hai! Siap membantu. Mau tanya soal materi atau jadwal?',
    ],
  },
  {
    test: /\b(oke|ok|siap|baik|sip|noted|ya|iya)\b/i,
    replies: (c) => [
      'Sip! Sampai ketemu di sesi ya.',
      when(c.booking) ? `Oke, noted. Sampai jumpa ${when(c.booking)}.` : 'Oke, noted. Sampai jumpa di sesi berikutnya.',
      'Mantap. Kabari aku kalau ada perubahan.',
    ],
  },
];

const FALLBACK = [
  'Terima kasih sudah kabari. Boleh dijelaskan sedikit lebih detail supaya aku bisa bantu dengan tepat?',
  'Noted. Kalau ini soal materi, sebutkan bab dan nomor soalnya ya.',
  'Aku catat dulu. Nanti kita bahas juga di sesi tatap muka.',
  'Oke, nanti aku siapkan. Ada hal lain yang mau ditanyakan sebelum sesi?',
];

/** Pilih balasan yang belum dipakai belakangan ini. */
function pick(options: string[], recent: string[]): string {
  const fresh = options.filter((o) => !recent.includes(o));
  const pool = fresh.length > 0 ? fresh : options;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getTutorReply(text: string, recentTutorTexts: string[], booking?: Booking | null): string {
  const ctx: Ctx = {
    text,
    nomor: text.match(/(?:nomor|no\.?)\s*(\d{1,3})/i)?.[1],
    booking,
  };
  const recent = recentTutorTexts.slice(-4).map((t) => t.trim());
  for (const rule of RULES) {
    if (rule.test.test(text)) {
      let options = rule.replies(ctx);
      if (ctx.nomor) {
        const specific = options.filter((o) => o.includes(`nomor ${ctx.nomor}`));
        if (specific.length > 0) options = specific;
      }
      return pick(options, recent);
    }
  }
  return pick(FALLBACK, recent);
}

/** Lama "mengetik" yang terasa wajar: lebih panjang untuk pesan yang lebih panjang. */
export function typingDelay(text: string): number {
  return Math.min(2600, 900 + text.length * 25);
}
