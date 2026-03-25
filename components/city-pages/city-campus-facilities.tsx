// components/city-pages/city-campus-facilities.tsx
// Server Component — no props (same for all cities)

const FACILITIES = [
  {
    icon: '🔬',
    title: 'Modern Labs',
    desc: 'State-of-the-art laboratories and smart classrooms',
  },
  {
    icon: '📚',
    title: 'Digital Library',
    desc: 'Well-stocked library with digital access and journals',
  },
  {
    icon: '🏠',
    title: 'Hostel',
    desc: 'Separate hostels for boys and girls with mess facility',
  },
  {
    icon: '🚌',
    title: 'Transport',
    desc: 'College buses connecting to surrounding areas',
  },
  {
    icon: '🏏',
    title: 'Sports',
    desc: 'Playground, indoor games, gym, and annual sports events',
  },
  {
    icon: '📶',
    title: 'WiFi Campus',
    desc: 'High-speed internet across the entire campus',
  },
] as const

export default function CityCampusFacilities() {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-poppins text-3xl font-bold text-gray-900 text-center mb-2">
          Campus Facilities
        </h2>
        <p className="text-center text-gray-500 text-base mb-3 max-w-2xl mx-auto">
          Everything you need for a complete campus experience — academics, sports, and
          student life all in one place.
        </p>
        <span className="block w-12 h-1 bg-secondary rounded mx-auto mt-3 mb-8" aria-hidden="true" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FACILITIES.map((facility) => (
            <div
              key={facility.title}
              className="flex items-start gap-3.5 bg-white rounded-xl p-5 border border-gray-200 hover:border-primary/60 hover:shadow-sm transition-all"
            >
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                <span aria-hidden="true">{facility.icon}</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-0.5">{facility.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{facility.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
