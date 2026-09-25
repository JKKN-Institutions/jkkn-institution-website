// components/city-pages/city-district-colleges.tsx
// Server Component — props: cityConfig. Renders only when the city carries districtColleges.

import type { CityPageConfig } from '@/lib/config/city-pages'

interface CityDistrictCollegesProps {
  cityConfig: CityPageConfig
}

export default function CityDistrictColleges({ cityConfig }: CityDistrictCollegesProps) {
  const list = cityConfig.districtColleges
  if (!list) return null

  return (
    <section id="district-colleges" className="section">
      <div className="section-inner">
        <h2 className="section-title">{list.heading}</h2>
        <p className="section-subtitle">{list.intro}</p>
        <span className="section-accent" aria-hidden="true" />
        <div className="section-spacer" />

        <div className="district-table-wrap">
          <table className="district-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">College</th>
                <th scope="col">TNEA code</th>
              </tr>
            </thead>
            <tbody>
              {list.colleges.map((college, index) => (
                <tr key={college.tneaCode}>
                  <td>{index + 1}</td>
                  <td>{college.name}</td>
                  <td>{college.tneaCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="district-note">{list.jkknNote}</p>
        <p className="district-source">
          Source:{' '}
          <a href={list.sourceUrl} target="_blank" rel="noopener noreferrer">
            {list.sourceLabel}
          </a>
          , read on {list.readOn}.
        </p>
      </div>
    </section>
  )
}
