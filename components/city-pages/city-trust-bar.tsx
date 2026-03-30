// components/city-pages/city-trust-bar.tsx
// Server Component — same for all city pages

export default function CityTrustBar() {
  const badges = ['AICTE', 'NBA', 'NAAC'] as const

  return (
    <div className="trust-bar">
      {badges.map((badge) => (
        <div key={badge} className="accred-badge">
          <span className="accred-icon">&#10003;</span>
          <span className="accred-name">{badge}</span>
        </div>
      ))}

      <span className="trust-sep" aria-hidden="true">
        |
      </span>

      <span className="trust-univ">
        Affiliated to Anna University, Chennai
      </span>
    </div>
  )
}
