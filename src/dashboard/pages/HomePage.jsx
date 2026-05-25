import SummaryCard from '../components/SummaryCard'
import { useGuestSummary } from '../hooks/useGuestSummary'
import { attendanceRate } from '../services/guestSummary'

function formatCount(value, loading) {
  if (loading) return '—'
  return String(value ?? 0)
}

function HomePage() {
  const { summary, loading, error } = useGuestSummary()
  const rate = summary ? attendanceRate(summary) : 0

  return (
    <div>
      <header className="border-b border-stone-300 pb-6">
        <h2 className="font-serif text-3xl text-stone-900">Home</h2>
        <p className="mt-2 text-stone-600">
          Overview of guest attendance for today&apos;s event.
        </p>
      </header>

      {error ? (
        <p
          className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          Could not load summary: {error}
        </p>
      ) : null}

      <section
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Attendance summary"
        aria-busy={loading}
      >
        <SummaryCard
          label="Total guests"
          value={formatCount(summary?.totalGuests, loading)}
          hint="Invited or registered"
          accent="stone"
        />
        <SummaryCard
          label="Present"
          value={formatCount(summary?.presentGuests, loading)}
          hint="Checked in at venue"
          accent="emerald"
        />
        <SummaryCard
          label="Not yet arrived"
          value={formatCount(summary?.absentGuests, loading)}
          hint="Still expected"
          accent="amber"
        />
        <SummaryCard
          label="Attendance"
          value={loading ? '—' : `${rate}%`}
          hint={
            summary?.totalGuests
              ? `${summary.presentGuests} of ${summary.totalGuests}`
              : 'No guests recorded yet'
          }
          accent="slate"
        />
      </section>

      {!loading && summary?.totalGuests === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-stone-300 bg-white/60 px-4 py-3 text-sm text-stone-600">
          No guests in the <strong>guests</strong> collection yet. Add documents
          with <code className="rounded bg-stone-200/80 px-1.5 py-0.5 text-xs">first_name</code>{' '}
          and <code className="rounded bg-stone-200/80 px-1.5 py-0.5 text-xs">last_name</code>{' '}
          in Firestore to see totals here.
        </p>
      ) : null}
    </div>
  )
}

export default HomePage
