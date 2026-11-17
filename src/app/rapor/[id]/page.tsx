'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { TentorService } from '@/lib/supabase/service';
import { EvaluationReport } from '@/lib/types';
import { MOCK_EVALUATION } from '@/lib/data/mock-data';

interface RaporPageProps {
  params: Promise<{ id: string }>;
}

export default function RaporPage({ params }: RaporPageProps) {
  const resolvedParams = use(params);
  const evalId = resolvedParams.id;
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [taskCompleted, setTaskCompleted] = useState(false);

  useEffect(() => {
    async function loadReport() {
      const r = await TentorService.getEvaluationByBookingId(evalId);
      setReport(r || MOCK_EVALUATION);
    }
    loadReport();
  }, [evalId]);

  if (!report) return null;

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <Header
        title="Rapor & Evaluasi Sesi"
        showBack
        backHref="/jadwal"
        rightAction={
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Rapor Belajar ${report.student_name} - TentorKeun`,
                  url: window.location.href,
                });
              } else {
                alert('Tautan rapor belajar telah disalin!');
              }
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-variant text-on-surface"
          >
            <MaterialIcon name="share" className="text-xl" />
          </button>
        }
      />

      <main className="px-4 space-y-4 pt-3">
        {/* Session Card Snapshot */}
        <section className="bg-gradient-to-br from-primary via-primary-container to-[#1a237e] rounded-3xl p-5 text-white shadow-xl shadow-primary/15 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-[10px] font-bold tracking-wide mb-1">
                <MaterialIcon name="verified" className="text-xs" />
                Laporan Resmi Sesi #{report.session_number}
              </span>
              <h1 className="font-bold text-base text-white">{report.subject}</h1>
              <p className="text-xs text-slate-200 mt-0.5">{report.topic}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-300 block">Skor Sesi</span>
              <span className="font-black text-2xl text-amber-300">
                {report.overall_score}
                <span className="text-xs font-normal text-slate-200">/100</span>
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-300 block">Siswa</span>
              <span className="font-bold text-white text-[11px]">{report.student_name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-300 block">Tentor Penguji</span>
              <span className="font-bold text-white text-[11px]">{report.tutor_name}</span>
            </div>
          </div>
        </section>

        {/* Competency Mastery Breakdown */}
        <section className="bg-surface rounded-3xl p-5 shadow-sm border border-outline-variant/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <div>
              <h2 className="font-bold text-sm text-primary">Analisis Kompetensi Topik</h2>
              <p className="text-[11px] text-on-surface-variant">
                Detail penguasaan indikator pembelajaran
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <MaterialIcon name="analytics" className="text-lg" />
            </div>
          </div>

          <div className="space-y-3">
            {report.competencies.map((comp, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-on-surface">{comp.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        comp.score >= 90
                          ? 'bg-emerald-50 text-emerald-700'
                          : comp.score >= 80
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {comp.status}
                    </span>
                    <span className="font-extrabold text-primary">{comp.score}%</span>
                  </div>
                </div>

                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      comp.score >= 90
                        ? 'bg-emerald-500'
                        : comp.score >= 80
                        ? 'bg-primary'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${comp.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tutor Feedback & Observations */}
        <section className="bg-surface rounded-3xl p-5 shadow-sm border border-outline-variant/30 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
            <MaterialIcon name="rate_review" className="text-primary text-lg" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface">
              Catatan Evaluasi {report.tutor_name}
            </h3>
          </div>

          <p className="text-xs text-on-surface leading-relaxed italic bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/20">
            &ldquo;{report.tutor_notes}&rdquo;
          </p>

          <div className="space-y-1.5 pt-1">
            <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider">
              Rekomendasi Langkah Selanjutnya:
            </h4>
            <ul className="space-y-1 text-xs text-on-surface-variant">
              {report.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Tugas Mandiri & Lampiran */}
        <section className="bg-surface rounded-3xl p-5 shadow-sm border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <MaterialIcon name="task" className="text-amber-600 text-lg" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface">
                Tugas Mandiri & Lampiran
              </h3>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                taskCompleted
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {taskCompleted ? 'Sudah Dikerjakan' : 'Belum Dikerjakan'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <MaterialIcon name="picture_as_pdf" className="text-xl" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-primary truncate">
                  {report.homework_title}
                </p>
                <p className="text-[10px] text-on-surface-variant">5 Soal Prediksi • Latihan UTBK</p>
              </div>
            </div>

            <button
              onClick={() => alert(`Mengunduh berkas ${report.homework_title}...`)}
              className="px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/40 text-primary font-bold text-[11px] hover:bg-primary/5 active:scale-95 transition-all flex items-center gap-1 shadow-sm flex-shrink-0"
            >
              <MaterialIcon name="download" className="text-xs" />
              <span>Unduh</span>
            </button>
          </div>

          <button
            onClick={() => setTaskCompleted(!taskCompleted)}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border ${
              taskCompleted
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-surface border-outline-variant/40 text-on-surface hover:bg-surface-container-low'
            }`}
          >
            {taskCompleted ? '✓ Ditandai Selesai' : 'Tandai Selesai Dikerjakan'}
          </button>
        </section>

        {/* Bottom Actions */}
        <div className="pt-2 flex items-center gap-2">
          <Link
            href="/chat"
            className="flex-1 py-3 rounded-2xl bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-md shadow-primary/20 text-center flex items-center justify-center gap-1.5"
          >
            <MaterialIcon name="chat" className="text-sm" />
            <span>Diskusi dengan Kak Sarah</span>
          </Link>

          <Link
            href="/jadwal"
            className="px-4 py-3 rounded-2xl bg-surface border border-outline-variant/40 text-primary font-bold text-xs hover:bg-surface-container-low"
          >
            Jadwal Sesi
          </Link>
        </div>
      </main>
    </div>
  );
}

