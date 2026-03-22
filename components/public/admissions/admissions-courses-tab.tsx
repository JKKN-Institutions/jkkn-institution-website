'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

interface Course {
  name: string
  duration?: string
  specializations?: string[]
}

interface CourseGroup {
  label: string
  courses: Course[]
}

interface CollegeTab {
  id: string
  label: string
  collegeName: string
  affiliation: string
  groups: CourseGroup[]
}

const COLLEGE_TABS: CollegeTab[] = [
  {
    id: 'dental',
    label: 'Dental',
    collegeName: 'JKKN Dental College and Hospital',
    affiliation: 'Established 1987 | Affiliated to Dr. MGR Medical University | DCI Approved',
    groups: [
      {
        label: 'Undergraduate',
        courses: [
          { name: 'Bachelor of Dental Surgery (BDS)', duration: '4 years + 1 year Internship' },
        ],
      },
      {
        label: 'Postgraduate',
        courses: [
          {
            name: 'Master of Dental Surgery (MDS)',
            duration: '3 years',
            specializations: [
              'Prosthodontics Crown and Bridge',
              'Conservative Dentistry and Endodontics',
              'Periodontics',
              'Orthodontics and Dentofacial Orthopedics',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    collegeName: 'JKKN College of Engineering and Technology',
    affiliation: 'Autonomous | Affiliated to Anna University | AICTE Approved',
    groups: [
      {
        label: 'Undergraduate',
        courses: [
          { name: 'B.E Computer Science and Engineering', duration: '4 years' },
          { name: 'B.E Electrical and Electronic Engineering', duration: '4 years' },
          { name: 'B.E Electronics and Communication Engineering', duration: '4 years' },
          { name: 'B.E Mechanical Engineering', duration: '4 years' },
          { name: 'B.Tech Information Technology', duration: '4 years' },
        ],
      },
      {
        label: 'Postgraduate',
        courses: [
          { name: 'M.E Computer Science and Engineering', duration: '2 years' },
          { name: 'M.B.A - Master of Business Administration', duration: '2 years' },
        ],
      },
    ],
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    collegeName: 'JKKN College of Pharmacy',
    affiliation: 'AICTE Approved | PCI Approved | Affiliated to Tamil Nadu Dr. MGR Medical University',
    groups: [
      {
        label: 'Undergraduate',
        courses: [
          { name: 'Bachelor of Pharmacy (B.Pharm)', duration: '4 years' },
        ],
      },
      {
        label: 'Postgraduate',
        courses: [
          {
            name: 'Masters of Pharmacy (M.Pharm)',
            duration: '2 years',
            specializations: [
              'M.Pharm (Pharmacology)',
              'M.Pharm (Pharmacy Practice)',
              'M.Pharm (Pharmaceutics)',
              'M.Pharm (Pharmaceutical Chemistry)',
              'M.Pharm (Pharmaceutical Analysis)',
            ],
          },
          { name: 'Doctor of Pharmacy (Pharm.D)', duration: '6 years' },
          { name: 'Post Baccalaureate (Pharm.D)', duration: '3 years' },
        ],
      },
      {
        label: 'Research Programme',
        courses: [
          { name: 'Ph.D in Pharmaceutics', duration: '3 years - Full Time, 4 Years - Part Time' },
          { name: 'Ph.D in Pharmaceutical Chemistry', duration: '3 years - Full Time, 4 Years - Part Time' },
          { name: 'Ph.D in Pharmaceutical Analysis', duration: '3 years - Full Time, 4 Years - Part Time' },
        ],
      },
    ],
  },
  {
    id: 'nursing',
    label: 'Nursing',
    collegeName: 'Sresakthimayeil Institute of Nursing and Research',
    affiliation: 'INC Approved | Affiliated to Tamil Nadu Dr. MGR Medical University',
    groups: [
      {
        label: 'Undergraduate',
        courses: [
          { name: 'Bachelor of Science in Nursing (B.Sc., Nursing)', duration: '4 years' },
          { name: 'Post Basic Bachelor of Science (P.B.B.Sc., Nursing)', duration: '2 years' },
        ],
      },
      {
        label: 'Postgraduate',
        courses: [
          {
            name: 'Master of Science in Nursing (M.Sc., Nursing)',
            duration: '2 years',
            specializations: [
              'Medical-Surgical Nursing',
              'Child Health Nursing',
              'Obstetrics and Gynaecological Nursing',
              'Community Health Nursing',
              'Mental Health Nursing',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ahs',
    label: 'Allied Health Sciences',
    collegeName: 'JKKN College of Allied Health Sciences',
    affiliation: 'Affiliated to Tamil Nadu Dr. MGR Medical University | 3 Years + 1 Year Internship',
    groups: [
      {
        label: 'Undergraduate Courses',
        courses: [
          { name: 'B.Sc. Accident and Emergency Care Technology', duration: '3 years + 1 year Internship' },
          { name: 'B.Sc. Operation Theatre and Anaesthesia Technology', duration: '3 years + 1 year Internship' },
          { name: 'B.Sc. Radiography and Imaging Technology', duration: '3 years + 1 year Internship' },
          { name: 'B.Sc. Cardiac Technology', duration: '3 years + 1 year Internship' },
          { name: 'B.Sc. Dialysis Technology', duration: '3 years + 1 year Internship' },
          { name: 'B.Sc. Physician Assistant', duration: '3 years + 1 year Internship' },
          { name: 'B.Sc. Respiratory Therapy', duration: '3 years + 1 year Internship' },
          { name: 'B.Sc. Critical Care Technology', duration: '3 years + 1 year Internship' },
          { name: 'B.Sc. Medical Record Sciences', duration: '3 years + 1 year Internship' },
        ],
      },
    ],
  },
  {
    id: 'arts',
    label: 'Arts & Science',
    collegeName: 'JKKN College of Arts and Science (Autonomous)',
    affiliation: 'Affiliated to Periyar University | UGC Approved | NAAC Accredited',
    groups: [
      {
        label: 'Undergraduate',
        courses: [
          { name: 'B.Sc. Computer Science', duration: '3 years' },
          { name: 'B.Sc. Computer Science & Cyber Security', duration: '3 years' },
          { name: 'B.Sc. Visual Communication', duration: '3 years' },
          { name: 'B.C.A.', duration: '3 years' },
          { name: 'B.Sc. Maths', duration: '3 years' },
          { name: 'B.Sc. Physics', duration: '3 years' },
          { name: 'B.Sc. Zoology', duration: '3 years' },
          { name: 'B.Sc. Textile & Fashion Designing', duration: '3 years' },
          { name: 'B.A. English', duration: '3 years' },
          { name: 'B.B.A.', duration: '3 years' },
          { name: 'B.Com', duration: '3 years' },
          { name: 'B.A. History', duration: '3 years' },
          { name: 'B.Sc. Microbiology', duration: '3 years' },
          { name: 'B.Sc. Chemistry', duration: '3 years' },
          { name: 'B.Sc. Artificial Intelligence & Data Science', duration: '3 years' },
          { name: 'B.Sc. Clinical Laboratory Technology', duration: '3 years' },
        ],
      },
      {
        label: 'Postgraduate',
        courses: [
          { name: 'M.A English', duration: '2 years' },
          { name: 'M.A History', duration: '2 years' },
          { name: 'M.Sc Data Analytics', duration: '2 years' },
          { name: 'M.Sc Computer Science', duration: '2 years' },
          { name: 'M.Sc Zoology', duration: '2 years' },
          { name: 'M.Sc Maths', duration: '2 years' },
          { name: 'M.Com', duration: '2 years' },
          { name: 'M.C.A.', duration: '2 years' },
        ],
      },
      {
        label: 'Research Programmes',
        courses: [
          { name: 'Ph.D in Zoology', duration: '2 years' },
          { name: 'Ph.D in Tamil', duration: '2 years' },
          { name: 'Ph.D in Chemistry', duration: '2 years' },
        ],
      },
    ],
  },
  {
    id: 'education',
    label: 'Education',
    collegeName: 'JKKN College of Education',
    affiliation: 'Established 2016 | Affiliated to Periyar University | B.Ed Programs',
    groups: [
      {
        label: 'B.Ed in Pedagogy Subjects',
        courses: [
          { name: 'B.Ed in Tamil', duration: '2 years' },
          { name: 'B.Ed in English', duration: '2 years' },
          { name: 'B.Ed in Zoology', duration: '2 years' },
          { name: 'B.Ed in Maths', duration: '2 years' },
          { name: 'B.Ed in Chemistry', duration: '2 years' },
          { name: 'B.Ed in Computer Science', duration: '2 years' },
          { name: 'B.Ed in Physics', duration: '2 years' },
          { name: 'B.Ed in Botany', duration: '2 years' },
          { name: 'B.Ed in History', duration: '2 years' },
          { name: 'B.Ed in Microbiology', duration: '2 years' },
          { name: 'B.Ed in Social Science', duration: '2 years' },
          { name: 'B.Ed in Commerce', duration: '2 years' },
          { name: 'B.Ed in Economics', duration: '2 years' },
          { name: 'B.Ed in Political Science', duration: '2 years' },
        ],
      },
    ],
  },
]

export function AdmissionsCoursesTab() {
  const [activeTab, setActiveTab] = useState('dental')

  const activeCollege = COLLEGE_TABS.find(t => t.id === activeTab)!
  const isMultiGroup = activeCollege.groups.length > 1

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {COLLEGE_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-semibold border-[1.5px] transition-all duration-200 cursor-pointer',
              activeTab === tab.id
                ? 'bg-primary border-primary text-white shadow-sm'
                : 'bg-white border-border text-foreground hover:bg-primary hover:border-primary hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Panel */}
      <div
        key={activeTab}
        className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        {/* Card Header */}
        <div className="bg-gradient-to-r from-[#085032] to-[#0b6d41] px-8 py-6 text-white">
          <h3 className="text-xl font-bold">{activeCollege.collegeName}</h3>
          <p className="text-sm text-white/80 mt-1">{activeCollege.affiliation}</p>
        </div>

        {/* Course Groups */}
        <div
          className={cn(
            'p-6 md:p-8 gap-6',
            isMultiGroup ? 'grid grid-cols-1 md:grid-cols-2' : 'block'
          )}
        >
          {activeCollege.groups.map((group, groupIndex) => {
            // Last group in a 3+ group layout spans full width
            const spanFull =
              activeCollege.groups.length >= 3 &&
              groupIndex === activeCollege.groups.length - 1

            return (
              <div
                key={group.label}
                className={cn(spanFull && 'md:col-span-2')}
              >
                {/* Group header with course count badge */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-accent">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                    {group.label}
                  </h4>
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {group.courses.length} {group.courses.length === 1 ? 'course' : 'courses'}
                  </span>
                </div>

                {/* Course list — scrollable if more than 8 items */}
                <div
                  className={cn(
                    'space-y-0',
                    group.courses.length > 8 && 'max-h-80 overflow-y-auto pr-1 scrollbar-thin'
                  )}
                >
                  {group.courses.map(course => (
                    <div
                      key={course.name}
                      className="py-2.5 border-b border-border/60 last:border-0"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground leading-snug">
                            {course.name}
                          </p>
                          {course.duration && (
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {course.duration}
                            </p>
                          )}
                          {/* Specializations */}
                          {course.specializations && course.specializations.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {course.specializations.map(spec => (
                                <li key={spec} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                  {spec}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
