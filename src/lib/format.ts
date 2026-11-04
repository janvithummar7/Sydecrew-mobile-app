/** "7:42 pm", or "5 Nov, 7:42 am" when the moment is not today (e.g. a lock that ends after midnight). */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  const sameDay = d.toDateString() === new Date().toDateString();
  return d.toLocaleString(
    'en-IN',
    sameDay ? { hour: 'numeric', minute: '2-digit' } : { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' },
  );
}
