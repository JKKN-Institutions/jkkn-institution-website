'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Clock, FileText, GraduationCap, Trophy, User, Briefcase,
  BookOpen, ShieldCheck, Users, HelpCircle, Sparkles, BookMarked,
  Monitor, Mail, ChevronRight, ExternalLink, Award as AwardIcon
} from 'lucide-react'
import type { FacultyRow } from '@/lib/schemas/faculty'
import type {
  Qualification, ExperienceEntry, Publication, FundedProject,
  Certification, Award, Membership, PhdScholar, Faq
} from '@/lib/schemas/faculty'

interface FacultyProfileViewProps {
  faculty: FacultyRow
  relatedFaculty: FacultyRow[]
}

// ============================================
// Scroll Reveal Hook
// ============================================
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const sections = el.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 80)
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    sections.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])
  return ref
}

export function FacultyProfileView({ faculty, relatedFaculty }: FacultyProfileViewProps) {
  const containerRef = useScrollReveal()

  const initials = faculty.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const badges = (faculty.badges as string[]) || []
  const qualifications = (faculty.qualifications as Qualification[]) || []
  const specialisations = (faculty.specialisations as string[]) || []
  const experienceEntries = (faculty.experience_entries as ExperienceEntry[]) || []
  const researchFocusAreas = (faculty.research_focus_areas as string[]) || []
  const publications = (faculty.publications as Publication[]) || []
  const fundedProjects = (faculty.funded_projects as FundedProject[]) || []
  const certifications = (faculty.certifications as Certification[]) || []
  const awards = (faculty.awards as Award[]) || []
  const memberships = (faculty.memberships as Membership[]) || []
  const phdScholars = (faculty.phd_scholars_list as PhdScholar[]) || []
  const faqs = (faculty.faqs as Faq[]) || []

  // Group experience by type
  const teachingExp = experienceEntries.filter(e => e.type === 'Teaching')
  const clinicalExp = experienceEntries.filter(e => e.type === 'Clinical')
  const industryExp = experienceEntries.filter(e => e.type === 'Industry' || e.type === 'Research')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const institutionName = process.env.NEXT_PUBLIC_INSTITUTION_NAME || 'JKKN College of Engineering & Technology'

  return (
    <>
      <style jsx global>{`
        .faculty-page {
          --green: #0b6d41; --green-dark: #085533; --green-light: #0e8a52;
          --green-pale: #e8f5ee; --green-faint: rgba(11,109,65,0.05);
          --green-border: rgba(11,109,65,0.1); --green-border-hover: rgba(11,109,65,0.22);
          --yellow: #ffde59; --yellow-dim: rgba(255,222,89,0.25);
          --cream: #fbfbee; --bg-card: #ffffff;
          --border: rgba(11,109,65,0.08); --border-hover: rgba(11,109,65,0.18);
          --text: #1a2a1e; --text-secondary: #3d5443; --text-muted: #7a8f80;
          --gradient-brand: linear-gradient(135deg, #0b6d41 0%, #0e8a52 50%, #12a863 100%);
          --gradient-hero: linear-gradient(160deg, #0b6d41 0%, #085533 40%, #074a2d 70%, #0b6d41 100%);
          --shadow-sm: 0 1px 3px rgba(11,109,65,0.04), 0 1px 2px rgba(11,109,65,0.06);
          --shadow-md: 0 4px 16px rgba(11,109,65,0.06), 0 2px 6px rgba(11,109,65,0.04);
          --shadow-lg: 0 12px 40px rgba(11,109,65,0.08), 0 4px 12px rgba(11,109,65,0.04);
          --radius: 16px; --radius-sm: 10px; --radius-pill: 100px;
          --ease: cubic-bezier(0.4, 0, 0.2, 1);
          font-family: var(--font-poppins), 'Poppins', ui-sans-serif, system-ui, sans-serif;
          background: var(--cream); color: var(--text);
        }
        .faculty-page .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s var(--ease), transform 0.7s var(--ease); }
        .faculty-page .reveal.visible { opacity: 1; transform: translateY(0); }
      `}</style>

      <div className="faculty-page" ref={containerRef}>
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pb-14 sm:pb-20">

          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 py-6 max-[480px]:py-4 text-[0.78rem] text-[#7a8f80]">
            <Link href="/" className="hover:text-[#0b6d41] transition-colors">Home</Link>
            <span className="opacity-30">/</span>
            <Link href="/faculty" className="hover:text-[#0b6d41] transition-colors">Faculty</Link>
            <span className="opacity-30">/</span>
            <span className="text-[#3d5443]">{faculty.full_name}</span>
          </nav>

          {/* ===== HERO ===== */}
          <section className="reveal relative rounded-3xl overflow-hidden mb-6 shadow-lg">
            {/* Background */}
            <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }}>
              <div className="absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,222,89,0.15) 0%, transparent 65%)' }} />
              <div className="absolute -bottom-16 -left-16 w-[350px] h-[350px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,222,89,0.08) 0%, transparent 65%)' }} />
              {/* Dot pattern */}
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            </div>

            <div className="relative z-10 grid grid-cols-[auto_1fr] gap-10 p-6 sm:p-10 lg:p-12 items-center max-[768px]:grid-cols-1 max-[768px]:text-center max-[768px]:gap-6 max-[480px]:p-5 max-[480px]:gap-5">
              {/* Avatar */}
              <div className="max-[768px]:mx-auto">
                <div className="w-[190px] h-[190px] max-[768px]:w-[150px] max-[768px]:h-[150px] max-[480px]:w-[120px] max-[480px]:h-[120px] rounded-full p-1" style={{ background: 'linear-gradient(135deg, #ffde59 0%, #fff 50%, #ffde59 100%)', boxShadow: '0 0 30px rgba(255,222,89,0.3)' }}>
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden shadow-inner">
                    {faculty.photo_url ? (
                      <img src={faculty.photo_url} alt={faculty.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[3.5rem] max-[768px]:text-[2.5rem] max-[480px]:text-[2rem] font-bold text-[#0b6d41]" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>{initials}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-[0.72rem] max-[480px]:text-[0.62rem] font-bold uppercase tracking-[2.5px] max-[480px]:tracking-[1.5px] text-[#ffde59] break-words max-[768px]:justify-center">
                  <span className="inline-block w-6 h-0.5 bg-[#ffde59] rounded" />
                  {institutionName}
                </div>
                <h1 className="text-[clamp(1.1rem,5.5vw,2.75rem)] leading-[1.15] max-[480px]:leading-tight tracking-[-0.5px] text-white break-words" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>
                  {faculty.full_name}
                </h1>
                <p className="text-[clamp(0.8rem,2.6vw,1.05rem)] text-white/80 break-words">
                  {faculty.designation} &mdash; {faculty.department}
                </p>
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 max-[768px]:justify-center">
                    {badges.map((badge, i) => (
                      <span key={i} className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.72rem] font-semibold backdrop-blur-sm transition-all hover:border-[#ffde59] hover:text-[#ffde59] hover:bg-[rgba(255,222,89,0.1)] ${
                        i === 0
                          ? 'border border-[rgba(255,222,89,0.4)] text-[#ffde59] bg-[rgba(255,222,89,0.12)]'
                          : 'border border-white/15 bg-white/8 text-white/85'
                      }`}>
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ===== BENTO STATS ===== */}
          {(faculty.experience_years > 0 || faculty.research_papers > 0 || faculty.phd_scholars > 0 || faculty.awards_won > 0) && (
            <div className="reveal grid grid-cols-4 max-[768px]:grid-cols-2 max-[480px]:grid-cols-2 gap-4 mb-6">
              {[
                { icon: <Clock className="w-6 h-6" />, value: `${faculty.experience_years}+`, label: 'Years Experience', bg: '#e8f5ee', color: '#0b6d41' },
                { icon: <FileText className="w-6 h-6" />, value: faculty.research_papers, label: 'Research Papers', bg: 'rgba(26,115,167,0.08)', color: '#1a73a7' },
                { icon: <GraduationCap className="w-6 h-6" />, value: faculty.phd_scholars, label: 'PhD Scholars', bg: 'rgba(255,222,89,0.25)', color: '#a88c00' },
                { icon: <Trophy className="w-6 h-6" />, value: faculty.awards_won, label: 'Awards Won', bg: 'rgba(196,69,105,0.08)', color: '#c44569' },
              ].filter(s => Number(String(s.value).replace('+', '')) > 0).map((stat, i) => (
                <div key={i} className="bg-white border border-[rgba(11,109,65,0.08)] rounded-2xl p-6 text-center transition-all duration-400 hover:border-[rgba(11,109,65,0.18)] hover:-translate-y-1 hover:shadow-md relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0b6d41] via-[#0e8a52] to-[#12a863] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
                  <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mx-auto mb-3" style={{ background: stat.bg, color: stat.color }}>{stat.icon}</div>
                  <div className="text-[2.2rem] max-[480px]:text-[1.5rem] font-extrabold text-[#0b6d41] leading-tight">{stat.value}</div>
                  <div className="text-[0.78rem] text-[#7a8f80] font-medium mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* ===== PROFESSIONAL SUMMARY ===== */}
          {faculty.professional_summary && (
            <section className="reveal bg-white border border-[rgba(11,109,65,0.08)] rounded-2xl p-5 sm:p-8 mb-5 sm:mb-6 shadow-sm hover:border-[rgba(11,109,65,0.18)] hover:shadow-md transition-all">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-[42px] h-[42px] max-[480px]:w-[36px] max-[480px]:h-[36px] rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(26,115,167,0.08)', color: '#1a73a7' }}><User className="w-5 h-5" /></div>
                <h2 className="text-[1.45rem] max-[480px]:text-[1.15rem] text-[#1a2a1e] break-words" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>Professional Summary</h2>
              </div>
              <p className="text-base leading-[1.9] text-[#3d5443] pl-5 border-l-[3px] border-[#0b6d41] bg-[rgba(11,109,65,0.05)] rounded-r-[10px] p-5">
                {faculty.professional_summary}
              </p>
            </section>
          )}

          {/* ===== QUALIFICATIONS ===== */}
          {qualifications.length > 0 && (
            <section className="reveal bg-white border border-[rgba(11,109,65,0.08)] rounded-2xl p-5 sm:p-8 mb-5 sm:mb-6 shadow-sm hover:border-[rgba(11,109,65,0.18)] hover:shadow-md transition-all">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-[42px] h-[42px] max-[480px]:w-[36px] max-[480px]:h-[36px] rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,222,89,0.25)', color: '#a88c00' }}><GraduationCap className="w-5 h-5" /></div>
                <h2 className="text-[1.45rem] max-[480px]:text-[1.15rem] text-[#1a2a1e] break-words" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>Academic Qualifications</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[0.88rem]">
                  <thead>
                    <tr>
                      {['Degree', 'Specialisation', 'University', 'Year'].map(h => (
                        <th key={h} className="text-left text-[0.7rem] font-bold uppercase tracking-[1.5px] text-[#0b6d41] px-4 py-3 border-b-2 border-[#e8f5ee] bg-[rgba(11,109,65,0.05)]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {qualifications.map((q, i) => (
                      <tr key={i} className="hover:bg-[rgba(11,109,65,0.05)] transition-colors">
                        <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)] font-semibold text-[#1a2a1e]">{q.degree}</td>
                        <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)] text-[#3d5443]">{q.specialisation}</td>
                        <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)] text-[#3d5443]">{q.university}</td>
                        <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)] text-[#0b6d41] font-bold">{q.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ===== SPECIALISATIONS ===== */}
          {specialisations.length > 0 && (
            <section className="reveal bg-white border border-[rgba(11,109,65,0.08)] rounded-2xl p-5 sm:p-8 mb-5 sm:mb-6 shadow-sm hover:border-[rgba(11,109,65,0.18)] hover:shadow-md transition-all">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-[42px] h-[42px] max-[480px]:w-[36px] max-[480px]:h-[36px] rounded-xl flex items-center justify-center shrink-0" style={{ background: '#e8f5ee', color: '#0b6d41' }}><Sparkles className="w-5 h-5" /></div>
                <h2 className="text-[1.45rem] max-[480px]:text-[1.15rem] text-[#1a2a1e] break-words" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>Areas of Specialisation</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {specialisations.map((s, i) => (
                  <span key={i} className="px-4 py-2 rounded-full text-[0.8rem] font-medium bg-[rgba(11,109,65,0.05)] text-[#3d5443] border border-[rgba(11,109,65,0.1)] transition-all hover:bg-[#e8f5ee] hover:text-[#0b6d41] hover:border-[rgba(11,109,65,0.22)] hover:-translate-y-0.5 hover:shadow-sm">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* ===== EXPERIENCE TIMELINE ===== */}
          {experienceEntries.length > 0 && (
            <section className="reveal bg-white border border-[rgba(11,109,65,0.08)] rounded-2xl p-5 sm:p-8 mb-5 sm:mb-6 shadow-sm hover:border-[rgba(11,109,65,0.18)] hover:shadow-md transition-all">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-[42px] h-[42px] max-[480px]:w-[36px] max-[480px]:h-[36px] rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(11,109,65,0.08)', color: '#0b6d41' }}><Briefcase className="w-5 h-5" /></div>
                <h2 className="text-[1.45rem] max-[480px]:text-[1.15rem] text-[#1a2a1e] break-words" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>Experience</h2>
              </div>

              {[
                { label: 'Teaching', entries: teachingExp },
                { label: 'Clinical', entries: clinicalExp },
                { label: 'Industry & Research', entries: industryExp },
              ].filter(g => g.entries.length > 0).map((group, gi) => (
                <div key={gi}>
                  <h3 className="text-[0.78rem] font-bold uppercase tracking-[1.5px] text-[#0b6d41] flex items-center gap-2 mt-8 first:mt-5 mb-3">
                    <span className="w-4 h-0.5 bg-[#0b6d41] rounded opacity-40" />
                    {group.label}
                  </h3>
                  <div className="relative pl-9 mt-4">
                    {/* Timeline line */}
                    <div className="absolute left-2 top-2.5 bottom-2.5 w-0.5 rounded bg-gradient-to-b from-[#0b6d41] to-[#e8f5ee]" />
                    {group.entries.map((entry, i) => (
                      <div key={i} className="relative pb-7 last:pb-0">
                        <div className={`absolute -left-9 top-1.5 w-[18px] h-[18px] rounded-full border-2 bg-white transition-colors ${
                          i === 0 ? 'border-[#0b6d41] bg-[#0b6d41] shadow-[0_0_0_4px_#e8f5ee]' : 'border-[#e8f5ee] hover:border-[#0b6d41]'
                        }`} />
                        <div className="text-[0.72rem] font-bold text-[#0b6d41] uppercase tracking-[0.5px]">{entry.start_year} &ndash; {entry.end_year || 'Present'}</div>
                        <div className="text-base font-semibold text-[#1a2a1e] mt-0.5 break-words">{entry.role}</div>
                        <div className="text-[0.85rem] text-[#7a8f80] break-words">{entry.institution}{entry.description ? ` — ${entry.description}` : ''}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* ===== RESEARCH & PUBLICATIONS ===== */}
          {(researchFocusAreas.length > 0 || publications.length > 0 || fundedProjects.length > 0) && (
            <section className="reveal bg-white border border-[rgba(11,109,65,0.08)] rounded-2xl p-5 sm:p-8 mb-5 sm:mb-6 shadow-sm hover:border-[rgba(11,109,65,0.18)] hover:shadow-md transition-all">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-[42px] h-[42px] max-[480px]:w-[36px] max-[480px]:h-[36px] rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(26,115,167,0.08)', color: '#1a73a7' }}><BookOpen className="w-5 h-5" /></div>
                <h2 className="text-[1.45rem] max-[480px]:text-[1.15rem] text-[#1a2a1e] break-words" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>Research & Publications</h2>
              </div>

              {researchFocusAreas.length > 0 && (
                <>
                  <h3 className="text-[0.78rem] font-bold uppercase tracking-[1.5px] text-[#0b6d41] flex items-center gap-2 mt-5 mb-3">
                    <span className="w-4 h-0.5 bg-[#0b6d41] rounded opacity-40" /> Research Focus
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {researchFocusAreas.map((a, i) => (
                      <span key={i} className="px-4 py-2 rounded-full text-[0.8rem] font-medium bg-[rgba(11,109,65,0.05)] text-[#3d5443] border border-[rgba(11,109,65,0.1)]">{a}</span>
                    ))}
                  </div>
                </>
              )}

              {publications.length > 0 && (
                <>
                  <h3 className="text-[0.78rem] font-bold uppercase tracking-[1.5px] text-[#0b6d41] flex items-center gap-2 mt-8 mb-3">
                    <span className="w-4 h-0.5 bg-[#0b6d41] rounded opacity-40" /> Selected Publications
                  </h3>
                  <div className="flex flex-col gap-3">
                    {publications.map((pub, i) => (
                      <div key={i} className="grid grid-cols-[40px_1fr] max-[768px]:grid-cols-1 gap-4 p-5 rounded-[10px] bg-[rgba(11,109,65,0.05)] border border-[rgba(11,109,65,0.08)] transition-all hover:border-[rgba(11,109,65,0.22)] hover:bg-[#e8f5ee] hover:translate-x-1 hover:shadow-sm items-start">
                        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[0.78rem] font-extrabold text-white max-[768px]:hidden" style={{ background: 'var(--gradient-brand)' }}>{i + 1}</div>
                        <div className="min-w-0">
                          <div className="font-semibold text-[#1a2a1e] text-[0.92rem] leading-[1.5] mb-1 break-words">{pub.title}</div>
                          <div className="text-[0.8rem] text-[#7a8f80] break-words">
                            {pub.authors} &middot; <em className="text-[#3d5443]">{pub.journal}</em>{pub.year ? `, ${pub.year}` : ''}
                          </div>
                          {(pub.doi_url || pub.pubmed_url) && (
                            <div className="flex gap-3 mt-1.5">
                              {pub.doi_url && <a href={pub.doi_url} target="_blank" rel="noopener noreferrer" className="text-[0.72rem] font-bold uppercase tracking-[0.5px] text-[#0b6d41] hover:text-[#085533] inline-flex items-center gap-1">DOI ↗</a>}
                              {pub.pubmed_url && <a href={pub.pubmed_url} target="_blank" rel="noopener noreferrer" className="text-[0.72rem] font-bold uppercase tracking-[0.5px] text-[#0b6d41] hover:text-[#085533] inline-flex items-center gap-1">PubMed ↗</a>}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {fundedProjects.length > 0 && (
                <>
                  <h3 className="text-[0.78rem] font-bold uppercase tracking-[1.5px] text-[#0b6d41] flex items-center gap-2 mt-8 mb-3">
                    <span className="w-4 h-0.5 bg-[#0b6d41] rounded opacity-40" /> Funded Research
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-[0.88rem]">
                      <thead>
                        <tr>
                          {['Project', 'Agency', 'Amount', 'Period', 'Status'].map(h => (
                            <th key={h} className="text-left text-[0.7rem] font-bold uppercase tracking-[1.5px] text-[#0b6d41] px-4 py-3 border-b-2 border-[#e8f5ee] bg-[rgba(11,109,65,0.05)]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {fundedProjects.map((p, i) => (
                          <tr key={i} className="hover:bg-[rgba(11,109,65,0.05)] transition-colors">
                            <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)] font-semibold text-[#1a2a1e]">{p.title}</td>
                            <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)] text-[#3d5443]">{p.agency}</td>
                            <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)] text-[#3d5443]">{p.amount}</td>
                            <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)] text-[#3d5443]">{p.period}</td>
                            <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)]">
                              <span className={`inline-flex items-center gap-1.5 text-[0.72rem] font-bold px-2.5 py-1 rounded-full ${
                                p.status === 'Completed' ? 'bg-[#e8f5ee] text-[#0b6d41]' : 'bg-[rgba(255,222,89,0.25)] text-[#8a7000]'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'Completed' ? 'bg-[#0b6d41]' : 'bg-[#c4a800] animate-pulse'}`} />
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Scholar Links */}
              {(faculty.google_scholar_url || faculty.researchgate_url || faculty.orcid_url) && (
                <>
                  <h3 className="text-[0.78rem] font-bold uppercase tracking-[1.5px] text-[#0b6d41] flex items-center gap-2 mt-8 mb-3">
                    <span className="w-4 h-0.5 bg-[#0b6d41] rounded opacity-40" /> Academic Profiles
                  </h3>
                  <div className="flex gap-2.5 flex-wrap">
                    {faculty.google_scholar_url && (
                      <a href={faculty.google_scholar_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[0.82rem] font-semibold text-[#3d5443] bg-[#f7f7e8] border border-[rgba(11,109,65,0.08)] transition-all hover:text-[#0b6d41] hover:border-[rgba(11,109,65,0.22)] hover:bg-[rgba(11,109,65,0.05)] hover:shadow-sm">
                        <GraduationCap className="w-4 h-4" /> Google Scholar
                      </a>
                    )}
                    {faculty.researchgate_url && (
                      <a href={faculty.researchgate_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[0.82rem] font-semibold text-[#3d5443] bg-[#f7f7e8] border border-[rgba(11,109,65,0.08)] transition-all hover:text-[#0b6d41] hover:border-[rgba(11,109,65,0.22)] hover:bg-[rgba(11,109,65,0.05)] hover:shadow-sm">
                        <ExternalLink className="w-4 h-4" /> ResearchGate
                      </a>
                    )}
                    {faculty.orcid_url && (
                      <a href={faculty.orcid_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[0.82rem] font-semibold text-[#3d5443] bg-[#f7f7e8] border border-[rgba(11,109,65,0.08)] transition-all hover:text-[#0b6d41] hover:border-[rgba(11,109,65,0.22)] hover:bg-[rgba(11,109,65,0.05)] hover:shadow-sm">
                        <ExternalLink className="w-4 h-4" /> ORCID
                      </a>
                    )}
                  </div>
                </>
              )}
            </section>
          )}

          {/* ===== CERTIFICATIONS ===== */}
          {certifications.length > 0 && (
            <section className="reveal bg-white border border-[rgba(11,109,65,0.08)] rounded-2xl p-5 sm:p-8 mb-5 sm:mb-6 shadow-sm hover:border-[rgba(11,109,65,0.18)] hover:shadow-md transition-all">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-[42px] h-[42px] max-[480px]:w-[36px] max-[480px]:h-[36px] rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(11,109,65,0.08)', color: '#0b6d41' }}><ShieldCheck className="w-5 h-5" /></div>
                <h2 className="text-[1.45rem] max-[480px]:text-[1.15rem] text-[#1a2a1e] break-words" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>Certifications & Training</h2>
              </div>
              <div className="grid grid-cols-2 max-[768px]:grid-cols-1 gap-2.5">
                {certifications.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-[10px] bg-[rgba(11,109,65,0.05)] border border-[rgba(11,109,65,0.08)] transition-all hover:border-[rgba(11,109,65,0.22)] hover:bg-[#e8f5ee] hover:shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#0b6d41] shrink-0 mt-1.5" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[0.85rem] font-medium text-[#3d5443] break-words">{c.name}</div>
                      <div className="text-[0.75rem] text-[#7a8f80] break-words">{c.organisation}{c.year ? ` · ${c.year}` : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ===== AWARDS ===== */}
          {awards.length > 0 && (
            <section className="reveal bg-white border border-[rgba(11,109,65,0.08)] rounded-2xl p-5 sm:p-8 mb-5 sm:mb-6 shadow-sm hover:border-[rgba(11,109,65,0.18)] hover:shadow-md transition-all">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-[42px] h-[42px] max-[480px]:w-[36px] max-[480px]:h-[36px] rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,222,89,0.25)', color: '#a88c00' }}><Trophy className="w-5 h-5" /></div>
                <h2 className="text-[1.45rem] max-[480px]:text-[1.15rem] text-[#1a2a1e] break-words" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>Awards & Recognitions</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[0.88rem]">
                  <thead>
                    <tr>
                      {['Award', 'Body', 'Year'].map(h => (
                        <th key={h} className="text-left text-[0.7rem] font-bold uppercase tracking-[1.5px] text-[#0b6d41] px-4 py-3 border-b-2 border-[#e8f5ee] bg-[rgba(11,109,65,0.05)]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {awards.map((a, i) => (
                      <tr key={i} className="hover:bg-[rgba(11,109,65,0.05)] transition-colors">
                        <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)] font-semibold text-[#1a2a1e]">{a.name}</td>
                        <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)] text-[#3d5443]">{a.body}</td>
                        <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)] text-[#0b6d41] font-bold">{a.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ===== MEMBERSHIPS ===== */}
          {memberships.length > 0 && (
            <section className="reveal bg-white border border-[rgba(11,109,65,0.08)] rounded-2xl p-5 sm:p-8 mb-5 sm:mb-6 shadow-sm hover:border-[rgba(11,109,65,0.18)] hover:shadow-md transition-all">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-[42px] h-[42px] max-[480px]:w-[36px] max-[480px]:h-[36px] rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(197,125,32,0.08)', color: '#c57d20' }}><Users className="w-5 h-5" /></div>
                <h2 className="text-[1.45rem] max-[480px]:text-[1.15rem] text-[#1a2a1e] break-words" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>Professional Memberships</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[0.88rem]">
                  <thead>
                    <tr>
                      {['Organisation', 'Type', 'Since'].map(h => (
                        <th key={h} className="text-left text-[0.7rem] font-bold uppercase tracking-[1.5px] text-[#0b6d41] px-4 py-3 border-b-2 border-[#e8f5ee] bg-[rgba(11,109,65,0.05)]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {memberships.map((m, i) => (
                      <tr key={i} className="hover:bg-[rgba(11,109,65,0.05)] transition-colors">
                        <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)] font-semibold text-[#1a2a1e]">{m.organisation}</td>
                        <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)] text-[#3d5443]">{m.type}</td>
                        <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)] text-[#0b6d41] font-bold">{m.since}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ===== MENTORING ===== */}
          {(faculty.mentoring_description || phdScholars.length > 0 || faculty.pg_dissertations_guided > 0 || faculty.ug_projects_guided > 0) && (
            <section className="reveal bg-white border border-[rgba(11,109,65,0.08)] rounded-2xl p-5 sm:p-8 mb-5 sm:mb-6 shadow-sm hover:border-[rgba(11,109,65,0.18)] hover:shadow-md transition-all">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-[42px] h-[42px] max-[480px]:w-[36px] max-[480px]:h-[36px] rounded-xl flex items-center justify-center shrink-0" style={{ background: '#e8f5ee', color: '#0b6d41' }}><GraduationCap className="w-5 h-5" /></div>
                <h2 className="text-[1.45rem] max-[480px]:text-[1.15rem] text-[#1a2a1e] break-words" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>Student Mentoring & Guidance</h2>
              </div>

              {faculty.mentoring_description && (
                <p className="text-[#3d5443] mb-4">{faculty.mentoring_description}</p>
              )}

              {phdScholars.length > 0 && (
                <>
                  <h3 className="text-[0.78rem] font-bold uppercase tracking-[1.5px] text-[#0b6d41] flex items-center gap-2 mt-5 mb-3">
                    <span className="w-4 h-0.5 bg-[#0b6d41] rounded opacity-40" /> PhD Scholars
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-[0.88rem]">
                      <thead>
                        <tr>
                          {['Scholar', 'Research Topic', 'Status'].map(h => (
                            <th key={h} className="text-left text-[0.7rem] font-bold uppercase tracking-[1.5px] text-[#0b6d41] px-4 py-3 border-b-2 border-[#e8f5ee] bg-[rgba(11,109,65,0.05)]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {phdScholars.map((s, i) => (
                          <tr key={i} className="hover:bg-[rgba(11,109,65,0.05)] transition-colors">
                            <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)] font-semibold text-[#1a2a1e]">{s.scholar_name}</td>
                            <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)] text-[#3d5443]">{s.research_topic}</td>
                            <td className="px-4 py-3.5 border-b border-[rgba(11,109,65,0.08)]">
                              <span className={`inline-flex items-center gap-1.5 text-[0.72rem] font-bold px-2.5 py-1 rounded-full ${
                                s.status.toLowerCase() === 'ongoing' ? 'bg-[rgba(255,222,89,0.25)] text-[#8a7000]' : 'bg-[#e8f5ee] text-[#0b6d41]'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${s.status.toLowerCase() === 'ongoing' ? 'bg-[#c4a800] animate-pulse' : 'bg-[#0b6d41]'}`} />
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {(faculty.pg_dissertations_guided > 0 || faculty.ug_projects_guided > 0) && (
                <>
                  <h3 className="text-[0.78rem] font-bold uppercase tracking-[1.5px] text-[#0b6d41] flex items-center gap-2 mt-8 mb-3">
                    <span className="w-4 h-0.5 bg-[#0b6d41] rounded opacity-40" /> Guidance Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {faculty.pg_dissertations_guided > 0 && (
                      <div className="bg-white border border-[rgba(11,109,65,0.08)] rounded-2xl p-6 text-center">
                        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mx-auto mb-3" style={{ background: '#e8f5ee', color: '#0b6d41' }}><BookMarked className="w-6 h-6" /></div>
                        <div className="text-[2.2rem] max-[480px]:text-[1.5rem] font-extrabold text-[#0b6d41]">{faculty.pg_dissertations_guided}</div>
                        <div className="text-[0.78rem] text-[#7a8f80] font-medium">PG Dissertations Guided</div>
                      </div>
                    )}
                    {faculty.ug_projects_guided > 0 && (
                      <div className="bg-white border border-[rgba(11,109,65,0.08)] rounded-2xl p-6 text-center">
                        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(26,115,167,0.08)', color: '#1a73a7' }}><Monitor className="w-6 h-6" /></div>
                        <div className="text-[2.2rem] max-[480px]:text-[1.5rem] font-extrabold text-[#0b6d41]">{faculty.ug_projects_guided}</div>
                        <div className="text-[0.78rem] text-[#7a8f80] font-medium">UG Projects Guided</div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </section>
          )}

          {/* ===== FAQs ===== */}
          {faqs.length > 0 && (
            <section className="reveal bg-white border border-[rgba(11,109,65,0.08)] rounded-2xl p-5 sm:p-8 mb-5 sm:mb-6 shadow-sm hover:border-[rgba(11,109,65,0.18)] hover:shadow-md transition-all">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-[42px] h-[42px] max-[480px]:w-[36px] max-[480px]:h-[36px] rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(196,69,105,0.08)', color: '#c44569' }}><HelpCircle className="w-5 h-5" /></div>
                <h2 className="text-[1.45rem] max-[480px]:text-[1.15rem] text-[#1a2a1e] break-words" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>Frequently Asked Questions</h2>
              </div>
              <div className="flex flex-col gap-2">
                {faqs.map((faq, i) => (
                  <details key={i} className="border border-[rgba(11,109,65,0.08)] rounded-[10px] overflow-hidden transition-all bg-white hover:border-[rgba(11,109,65,0.18)] open:border-[rgba(11,109,65,0.22)] open:shadow-md group">
                    <summary className="px-5 py-4 max-[480px]:px-4 max-[480px]:py-3.5 cursor-pointer font-semibold text-[0.9rem] max-[480px]:text-[0.83rem] text-[#1a2a1e] list-none flex justify-between items-center gap-3 transition-colors hover:bg-[rgba(11,109,65,0.05)]">
                      <span className="break-words min-w-0 flex-1">{faq.question}</span>
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(11,109,65,0.05)] text-[#7a8f80] shrink-0 transition-all group-open:bg-[#e8f5ee] group-open:text-[#0b6d41]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 transition-transform group-open:rotate-180"><path d="M6 9l6 6 6-6" /></svg>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 max-[480px]:px-4 max-[480px]:pb-4 text-[#3d5443] text-[0.88rem] max-[480px]:text-[0.82rem] leading-[1.8] max-[480px]:leading-[1.7] border-t border-[rgba(11,109,65,0.08)] pt-4 break-words">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* ===== CTA BLOCK ===== */}
          <section className="reveal relative rounded-3xl overflow-hidden mb-6 shadow-lg">
            <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }}>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,222,89,0.2) 0%, transparent 60%)' }} />
            </div>
            <div className="relative z-10 p-6 sm:p-10 lg:p-12 text-center">
              <h2 className="text-[1.6rem] max-[480px]:text-[1.2rem] text-white mb-2 break-words" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>
                Interested in {faculty.department.replace('Department of ', '')}?
              </h2>
              <p className="text-white/70 mb-7 text-[0.95rem] max-[480px]:text-[0.82rem] break-words">
                Explore the {faculty.department} at {institutionName} and learn from faculty like {faculty.full_name}.
              </p>
              <div className="flex gap-3 justify-center flex-wrap max-[768px]:flex-col max-[768px]:items-center">
                <Link href="/admissions/enquiry" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-[0.88rem] bg-[#ffde59] text-[#085533] shadow-[0_4px_20px_rgba(255,222,89,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,222,89,0.45)]">
                  <Mail className="w-4 h-4" /> Enquire Now
                </Link>
                <Link href="/faculty" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-[0.88rem] text-white/85 border border-white/20 transition-all hover:border-[#ffde59] hover:text-[#ffde59] hover:-translate-y-1">
                  <Users className="w-4 h-4" /> View All Faculty
                </Link>
              </div>
            </div>
          </section>

          {/* ===== RELATED FACULTY ===== */}
          {relatedFaculty.length > 0 && (
            <section className="reveal bg-white border border-[rgba(11,109,65,0.08)] rounded-2xl p-5 sm:p-8 mb-5 sm:mb-6 shadow-sm">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-[42px] h-[42px] max-[480px]:w-[36px] max-[480px]:h-[36px] rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(26,115,167,0.08)', color: '#1a73a7' }}><Users className="w-5 h-5" /></div>
                <h2 className="text-[1.45rem] max-[480px]:text-[1.15rem] text-[#1a2a1e] break-words" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>{faculty.department} &mdash; Faculty</h2>
              </div>
              <div className="grid grid-cols-4 max-[768px]:grid-cols-2 max-[480px]:grid-cols-2 gap-4">
                {relatedFaculty.map(f => {
                  const fi = f.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                  return (
                    <Link key={f.id} href={`/faculty/${f.slug}`} className="group block bg-white border border-[rgba(11,109,65,0.08)] rounded-2xl p-6 text-center transition-all duration-400 hover:border-[rgba(11,109,65,0.22)] hover:-translate-y-1.5 hover:shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0b6d41] via-[#0e8a52] to-[#12a863] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
                      <div className="w-[60px] h-[60px] rounded-full mx-auto mb-3 flex items-center justify-center text-white text-sm font-bold overflow-hidden" style={{ background: 'linear-gradient(135deg, #0b6d41, #12a863)' }}>
                        {f.photo_url ? <img src={f.photo_url} alt={f.full_name} className="w-full h-full object-cover" /> : fi}
                      </div>
                      <div className="text-[0.88rem] font-semibold text-[#1a2a1e] break-words">{f.full_name}</div>
                      <div className="text-[0.75rem] text-[#7a8f80] break-words">{f.designation}</div>
                    </Link>
                  )
                })}
              </div>
              <div className="text-center mt-5">
                <Link href="/faculty" className="inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-[#0b6d41] hover:text-[#085533] hover:gap-2.5 transition-all">
                  View All Faculty <span className="transition-transform">→</span>
                </Link>
              </div>
            </section>
          )}

          {/* Footer */}
          <footer className="text-center py-8 text-[0.72rem] text-[#7a8f80] border-t border-[rgba(11,109,65,0.08)]">
            Last updated: {new Date(faculty.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} &middot; {institutionName}
          </footer>

        </div>
      </div>
    </>
  )
}
