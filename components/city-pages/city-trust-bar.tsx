// components/city-pages/city-trust-bar.tsx
// Server Component — same for all city pages

export default function CityTrustBar() {
  const badges = ['AICTE', 'NBA', 'NAAC'] as const

  return (
    <div className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-center gap-4 flex-wrap">
      {badges.map((badge) => (
        <span
          key={badge}
          className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full"
        >
          <span aria-hidden="true">&#10003;</span>
          {badge}
        </span>
      ))}

      <span className="text-gray-300 text-lg" aria-hidden="true">
        |
      </span>

      <span className="text-sm text-gray-500 font-medium">
        Affiliated to Anna University, Chennai
      </span>
    </div>
  )
}
