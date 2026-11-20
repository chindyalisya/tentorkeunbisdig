/** Garis tipis di atas halaman: berapa jauh halaman sudah dibaca. Digerakkan CSS, tanpa JavaScript. */
export function ScrollProgress() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[3px] pointer-events-none" aria-hidden="true">
      <div className="scroll-progress h-full bg-secondary" />
    </div>
  );
}
