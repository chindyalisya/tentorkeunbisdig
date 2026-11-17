'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { MOCK_TUTORS } from '@/lib/data/mock-data';
import { TentorService } from '@/lib/supabase/service';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tutorId = searchParams.get('tutorId') || 'sarah-amanda';
  const modeParam = (searchParams.get('mode') as 'tatap_muka' | 'online') || 'tatap_muka';
  const dateParam = searchParams.get('date') || 'Rabu, 18 November 2026';
  const timeParam = searchParams.get('time') || '16:00 - 17:30 WIB';
  const topicParam = searchParams.get('topic') || 'Kalkulus & Turunan Aljabar UTBK';

  const tutor = MOCK_TUTORS.find((t) => t.id === tutorId) || MOCK_TUTORS[0];

  const [packageType, setPackageType] = useState<'1_sesi' | '4_sesi' | '8_sesi'>('4_sesi');
  const [studentName, setStudentName] = useState('Arga Pramudya');
  const [studentGrade, setStudentGrade] = useState('Kelas 12 SMA');
  const [studentAddress, setStudentAddress] = useState(
    'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan'
  );
  const [paymentMethod, setPaymentMethod] = useState('BCA Virtual Account');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Package calculation
  const packages = {
    '1_sesi': {
      name: '1 Sesi Eksplorasi (90 Mnt)',
      sessions: 1,
      multiplier: 1,
      discountPercent: 0,
      badge: 'Fleksibel',
    },
    '4_sesi': {
      name: 'Paket Intensif 4 Sesi',
      sessions: 4,
      multiplier: 4,
      discountPercent: 10,
      badge: 'Paling Populer • Hemat 10%',
    },
    '8_sesi': {
      name: 'Paket Master 8 Sesi Garansi Naik Nilai',
      sessions: 8,
      multiplier: 8,
      discountPercent: 20,
      badge: 'Garansi Naik Nilai • Hemat 20%',
    },
  };

  const currentPkg = packages[packageType];
  const basePrice = tutor.hourly_rate * currentPkg.multiplier;
  const packageDiscount = Math.round((basePrice * currentPkg.discountPercent) / 100);
  const promoDiscount = promoApplied ? 25000 : 0;
  const adminFee = 2000;
  const totalAmount = basePrice - packageDiscount - promoDiscount + adminFee;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'TENTORJUARA' || promoCode.toUpperCase() === 'TENTORKEUN') {
      setPromoApplied(true);
    } else {
      alert('Voucher tidak valid. Coba gunakan: TENTORJUARA');
    }
  };

  const handleCreateOrder = async () => {
    setIsSubmitting(true);
    try {
      const randomVA = `8801 2948 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      const booking = await TentorService.createBooking({
        tutor_id: tutor.id,
        tutor_name: tutor.name,
        tutor_avatar: tutor.avatar_url,
        tutor_title: tutor.title,
        subject: tutor.subjects[0] || 'Matematika SMA',
        topic: topicParam,
        package_type: packageType,
        package_name: currentPkg.name,
        sessions_total: currentPkg.sessions,
        sessions_completed: 0,
        mode: modeParam,
        session_date: dateParam,
        session_time: timeParam,
        student_name: studentName,
        student_grade: studentGrade,
        student_address: modeParam === 'tatap_muka' ? studentAddress : 'Sesi Online Google Meet',
        total_amount: totalAmount,
        discount_amount: packageDiscount + promoDiscount,
        payment_method: paymentMethod,
        payment_status: 'pending',
        va_number: randomVA,
      });

      router.push(`/pembayaran/${booking.id}`);
    } catch (e) {
      console.error(e);
      alert('Gagal membuat pesanan, silakan coba lagi');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-28">
      <Header title="Checkout & Pembayaran" showBack backHref={`/tentor/${tutor.id}`} />

      <main className="px-4 space-y-4 pt-3">
        {/* Tutor Card Snapshot */}
        <div className="p-4 rounded-3xl bg-surface border border-outline-variant/30 shadow-sm flex items-start gap-3">
          <img
            src={tutor.avatar_url}
            alt={tutor.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/20 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mb-1">
              {tutor.badge}
            </span>
            <h3 className="font-bold text-sm text-on-surface truncate">{tutor.name}</h3>
            <p className="text-[11px] text-on-surface-variant truncate">{tutor.university}</p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-on-surface-variant">
              <span className="font-semibold text-primary">{modeParam === 'tatap_muka' ? 'Tatap Muka' : 'Online HD'}</span>
              <span>•</span>
              <span>{timeParam}</span>
            </div>
          </div>
        </div>

        {/* 1. Pilih Paket Belajar */}
        <div className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface">
              Pilih Paket Belajar
            </h3>
            <span className="text-[11px] font-bold text-secondary">Garansi Nilai Naik</span>
          </div>

          <div className="space-y-2">
            {[
              {
                id: '1_sesi',
                title: '1 Sesi Eksplorasi (90 Menit)',
                desc: 'Cocok untuk persiapan PR / kuis dadakan',
                price: tutor.hourly_rate,
                badge: 'Fleksibel',
              },
              {
                id: '4_sesi',
                title: '4 Sesi Intensif Bulanan',
                desc: '1x seminggu pemantapan konsep & latihan soal',
                price: tutor.hourly_rate * 4 * 0.9,
                badge: 'Paling Populer • Hemat 10%',
                highlight: true,
              },
              {
                id: '8_sesi',
                title: '8 Sesi Master Persiapan SNBT',
                desc: 'Garansi kenaikan skor TO UTBK + bedah materi lengkap',
                price: tutor.hourly_rate * 8 * 0.8,
                badge: 'Garansi Skor • Hemat 20%',
              },
            ].map((pkg) => {
              const isSelected = packageType === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setPackageType(pkg.id as any)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-start justify-between transition-all relative ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-outline-variant/30 hover:border-outline-variant bg-surface'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0 pr-2">
                    <div
                      className={`w-4 h-4 rounded-full border mt-1 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-primary bg-primary text-white' : 'border-outline'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-primary bg-surface-container px-2 py-0.5 rounded-md inline-block mb-1">
                        {pkg.badge}
                      </span>
                      <p className="font-bold text-xs text-on-surface leading-tight">{pkg.title}</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{pkg.desc}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-extrabold text-xs text-primary">
                      Rp {pkg.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Data Siswa & Lokasi */}
        <div className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface pb-2 border-b border-outline-variant/20">
            Data Siswa & Lokasi Belajar
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                Nama Siswa
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                Kelas
              </label>
              <input
                type="text"
                value={studentGrade}
                onChange={(e) => setStudentGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {modeParam === 'tatap_muka' && (
            <div>
              <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                Alamat Rumah (Tatap Muka)
              </label>
              <textarea
                rows={2}
                value={studentAddress}
                onChange={(e) => setStudentAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          )}

          <div className="p-2.5 rounded-xl bg-surface-container-low text-[11px] text-on-surface flex items-center justify-between">
            <span className="text-on-surface-variant">Topik Bahasan:</span>
            <span className="font-bold text-primary truncate max-w-[200px]">{topicParam}</span>
          </div>
        </div>

        {/* 3. Metode Pembayaran */}
        <div className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface pb-2 border-b border-outline-variant/20">
            Pilih Metode Pembayaran
          </h3>

          <div className="space-y-2">
            {[
              {
                id: 'BCA Virtual Account',
                name: 'BCA Virtual Account',
                desc: 'Verifikasi instan otomatis 24 jam',
                icon: 'account_balance',
                recommended: true,
              },
              {
                id: 'Mandiri Virtual Account',
                name: 'Mandiri Virtual Account',
                desc: 'Verifikasi instan via Livin Mandiri',
                icon: 'account_balance',
              },
              {
                id: 'QRIS / GoPay / ShopeePay',
                name: 'QRIS (GoPay, ShopeePay, OVO, Dana)',
                desc: 'Scan QR code praktis dari semua e-wallet',
                icon: 'qr_code_2',
              },
            ].map((pm) => {
              const isSelected = paymentMethod === pm.id;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-outline-variant/30 hover:border-outline-variant bg-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-primary text-white' : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      <MaterialIcon name={pm.icon} className="text-base" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-on-surface">{pm.name}</p>
                      <p className="text-[10px] text-on-surface-variant">{pm.desc}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <MaterialIcon name="check_circle" className="text-primary text-base" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Voucher Promo Code */}
        <div className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30">
          <form onSubmit={handleApplyPromo} className="flex gap-2">
            <input
              type="text"
              placeholder="Masukkan kode promo (misal: TENTORJUARA)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface text-xs uppercase focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-surface-container text-primary font-bold text-xs hover:bg-surface-variant"
            >
              Gunakan
            </button>
          </form>
          {promoApplied && (
            <p className="text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <MaterialIcon name="check" className="text-xs" />
              Voucher TENTORJUARA berhasil dipasang (-Rp 25.000)
            </p>
          )}
        </div>

        {/* 5. Escrow Guarantee Box */}
        <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <MaterialIcon name="verified_user" className="text-lg" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-emerald-950">Proteksi Rekber TentorKeun Aktif</h4>
            <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
              Dana Anda ditampung di rekening bersama resmi TentorKeun. Tentor baru dibayar setelah sesi belajar selesai divalidasi dengan E-Tiket Anda.
            </p>
          </div>
        </div>

        {/* 6. Rincian Pembayaran */}
        <div className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 space-y-2 text-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface pb-2 border-b border-outline-variant/20">
            Rincian Pembayaran
          </h3>

          <div className="flex justify-between text-on-surface-variant">
            <span>Biaya Les ({currentPkg.sessions} Sesi)</span>
            <span className="font-semibold text-on-surface">
              Rp {basePrice.toLocaleString('id-ID')}
            </span>
          </div>

          {packageDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Diskon Paket ({currentPkg.discountPercent}%)</span>
              <span>-Rp {packageDiscount.toLocaleString('id-ID')}</span>
            </div>
          )}

          {promoApplied && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Diskon Voucher</span>
              <span>-Rp {promoDiscount.toLocaleString('id-ID')}</span>
            </div>
          )}

          <div className="flex justify-between text-on-surface-variant">
            <span>Biaya Proteksi Rekber</span>
            <span className="font-semibold text-on-surface">
              Rp {adminFee.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="pt-2 border-t border-outline-variant/20 flex justify-between items-center text-sm">
            <span className="font-bold text-on-surface">Total Tagihan</span>
            <span className="font-extrabold text-primary text-base">
              Rp {totalAmount.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 p-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-on-surface-variant block">Total Pembayaran</span>
            <span className="text-base font-extrabold text-primary">
              Rp {totalAmount.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            onClick={handleCreateOrder}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-lg shadow-primary/25 active:scale-95 transition-all flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <span>Memproses...</span>
            ) : (
              <>
                <MaterialIcon name="lock" className="text-sm" />
                <span>Bayar Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Memuat checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

