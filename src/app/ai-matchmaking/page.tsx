'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { TentorService } from '@/lib/supabase/service';

export default function AiMatchmakingPage() {
  const router = useRouter();

  const [studentName, setStudentName] = useState('Arga Pramudya');
  const [grade, setGrade] = useState('Kelas 12 SMA (Saintek)');
  const [curriculum, setCurriculum] = useState('Kurikulum Merdeka + UTBK');
  const [learningStyle, setLearningStyle] = useState('Visual & Analitis Terstruktur');
  const [targetGoal, setTargetGoal] = useState('Lolos SNBT / UTBK Top PTN (UI, ITB, UGM)');
  const [weakTopics, setWeakTopics] = useState<string[]>([
    'Kalkulus & Turunan Aljabar',
    'Limit Fungsi Trigonometri',
  ]);
  const [topicInput, setTopicInput] = useState('');
  const [mode, setMode] = useState<'tatap_muka' | 'online' | 'keduanya'>('tatap_muka');
  const [budgetMax, setBudgetMax] = useState(150000);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);

  const styleOptions = [
    {
      id: 'Visual & Analitis Terstruktur',
      title: 'Visual & Analitis Terstruktur',
      desc: 'Paling mudah paham lewat grafik, mind-map diagram alur, dan penjabaran rumus terstruktur langkah demi langkah.',
      icon: 'insights',
    },
    {
      id: 'Auditori & Diskusi Terbuka',
      title: 'Auditori & Diskusi Terbuka',
      desc: 'Suka membedah soal sambil berdiskusi dua arah, tanya-jawab santai, dan penjelasan verbal analogis kehidupan nyata.',
      icon: 'record_voice_over',
    },
    {
      id: 'Drilling Soal & Trik Cepat',
      title: 'Drilling Soal & Trik Cepat',
      desc: 'Fokus intensif bedah bank soal asli UTBK/SNBT, eliminasi opsi cepat, dan strategi manajemen waktu pengerjaan.',
      icon: 'speed',
    },
  ];

  const handleAddTopic = () => {
    if (topicInput.trim() && !weakTopics.includes(topicInput.trim())) {
      setWeakTopics([...weakTopics, topicInput.trim()]);
      setTopicInput('');
    }
  };

  const handleRemoveTopic = (t: string) => {
    setWeakTopics(weakTopics.filter((x) => x !== t));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    const steps = [
      'Menganalisis profil kognitif dan gaya belajar siswa...',
      'Menyaring 412 database pengajar bersertifikasi UI, ITB & UGM...',
      'Mengkalkulasi kecocokan skor materi dan riwayat kelulusan siswa...',
      'Menyusun matriks komparasi 3 kandidat terbaik...',
    ];

    for (let i = 0; i < steps.length; i++) {
      setAnalyzeStep(i);
      await new Promise((r) => setTimeout(r, 650));
    }

    await TentorService.processMatchmaking({
      student_name: studentName,
      grade,
      curriculum,
      learning_style: learningStyle,
      target_goal: targetGoal,
      weak_topics: weakTopics,
      budget_max: budgetMax,
      mode,
    });

    router.push('/ai-matchmaking/hasil');
  };

  return (
    <div className="flex flex-col min-h-screen pb-12">
      <Header title="Matchmaking AI Tentor" showBack backHref="/" />

      <main className="px-4 space-y-5 pt-3">
        {/* Intro Banner */}
        <section className="p-4 rounded-3xl bg-gradient-to-br from-primary via-primary-container to-secondary text-white shadow-md relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
              <MaterialIcon name="auto_awesome" className="text-sm text-amber-300" />
            </span>
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              AI Precision Matchmaking
            </span>
          </div>
          <h2 className="font-bold text-base text-white leading-tight">
            Temukan Tentor Berkarakter Tepat
          </h2>
          <p className="text-xs text-slate-200 mt-1 leading-relaxed">
            Sistem kami memetakan gaya belajar kognitif dan kurikulum siswa untuk merekomendasikan pengajar paling kompatibel.
          </p>
        </section>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Data Siswa */}
          <div className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <MaterialIcon name="person" className="text-primary text-lg" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface">
                1. Data Siswa & Target Belajar
              </h3>
            </div>

            <div>
              <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                Nama Siswa
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                  Jenjang & Kelas
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="Kelas 12 SMA (Saintek)">Kelas 12 SMA (Saintek)</option>
                  <option value="Kelas 12 SMA (Soshum)">Kelas 12 SMA (Soshum)</option>
                  <option value="Kelas 11 SMA">Kelas 11 SMA</option>
                  <option value="Kelas 10 SMA">Kelas 10 SMA</option>
                  <option value="SMP">SMP / MTs</option>
                  <option value="Gap Year / Alumni">Gap Year / Alumni</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                  Kurikulum
                </label>
                <select
                  value={curriculum}
                  onChange={(e) => setCurriculum(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="Kurikulum Merdeka + UTBK">Kurikulum Merdeka + UTBK</option>
                  <option value="Kurikulum Cambridge / IB">Cambridge / IB Curriculum</option>
                  <option value="Kurikulum 2013 Revisi">Kurikulum 2013 Revisi</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                Target Utama Belajar
              </label>
              <input
                type="text"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* 2. Gaya Belajar Siswa */}
          <div className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <MaterialIcon name="psychology_alt" className="text-secondary text-lg" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface">
                2. Karakter & Gaya Belajar Siswa
              </h3>
            </div>

            <div className="space-y-2">
              {styleOptions.map((opt) => {
                const isSelected = learningStyle === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLearningStyle(opt.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-outline-variant/30 hover:border-outline-variant bg-surface'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <MaterialIcon name={opt.icon} className="text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-on-surface">{opt.title}</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Materi yang Dirasa Sulit */}
          <div className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <MaterialIcon name="priority_high" className="text-amber-600 text-lg" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface">
                3. Bab / Topik yang Sering Menjadi Kendala
              </h3>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {weakTopics.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-error-container/30 text-on-error-container text-xs font-semibold border border-error-container/50"
                >
                  <span>{topic}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(topic)}
                    className="hover:text-error"
                  >
                    <MaterialIcon name="close" className="text-sm" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Tambah topik lain, misal: Geometri Dimensi Tiga..."
                className="flex-1 px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTopic();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTopic}
                className="px-3.5 py-2 rounded-xl bg-surface-container text-primary font-bold text-xs hover:bg-surface-variant"
              >
                + Tambah
              </button>
            </div>
          </div>

          {/* 4. Preferensi Mode & Anggaran */}
          <div className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <MaterialIcon name="tune" className="text-primary text-lg" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface">
                4. Mode & Maksimal Anggaran
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'tatap_muka', label: 'Tatap Muka' },
                { id: 'online', label: 'Online HD' },
                { id: 'keduanya', label: 'Fleksibel' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id as any)}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all ${
                    mode === m.id
                      ? 'border-primary bg-primary text-white shadow-sm'
                      : 'border-outline-variant/30 text-on-surface'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-on-surface-variant">Batas Biaya per Sesi</span>
                <span className="font-bold text-primary">
                  Rp {budgetMax.toLocaleString('id-ID')}
                </span>
              </div>
              <input
                type="range"
                min="80000"
                max="250000"
                step="10000"
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary via-primary-container to-secondary text-white font-bold text-sm shadow-xl shadow-primary/25 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <MaterialIcon name="auto_awesome" className="text-amber-300 text-lg" />
            <span>Mulai Analisis Matchmaking AI</span>
          </button>
        </form>
      </main>

      {/* Loading Modal Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
          <div className="w-full max-w-sm bg-surface rounded-3xl p-6 shadow-2xl border border-outline-variant/30 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center text-primary relative">
              <MaterialIcon name="psychology" className="text-3xl animate-bounce" />
              <div className="absolute inset-0 rounded-2xl border-2 border-primary border-t-transparent animate-spin" />
            </div>

            <div>
              <h3 className="font-bold text-base text-primary">Algoritma AI Sedang Bekerja</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Menghitung skor probabilitas kecocokan tentor
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-surface-container-low text-xs font-semibold text-primary min-h-[44px] flex items-center justify-center">
              {[
                'Menganalisis profil kognitif dan gaya belajar siswa...',
                'Menyaring 412 database pengajar bersertifikasi UI, ITB & UGM...',
                'Mengkalkulasi kecocokan skor materi dan riwayat kelulusan siswa...',
                'Menyusun matriks komparasi 3 kandidat terbaik...',
              ][analyzeStep]}
            </div>

            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${((analyzeStep + 1) / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

