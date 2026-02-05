'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DVVMetricTable } from './dvv-metric-table'
import { dvvData } from '@/lib/data/dvv-data'

export function DVVTabs() {
  const [activeTab, setActiveTab] = useState('criterion1')

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <div className="md:w-64 bg-gradient-to-b from-green-600 to-green-700 p-4">
          <h2 className="text-white font-bold text-lg mb-4">NAAC Criteria</h2>
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('criterion1')}
              className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                activeTab === 'criterion1'
                  ? 'bg-white text-green-700 font-semibold'
                  : 'text-white hover:bg-green-500'
              }`}
            >
              Criterion I
            </button>
            <button
              onClick={() => setActiveTab('criterion2')}
              className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                activeTab === 'criterion2'
                  ? 'bg-white text-green-700 font-semibold'
                  : 'text-white hover:bg-green-500'
              }`}
            >
              Criterion II
            </button>
            <button
              onClick={() => setActiveTab('criterion3')}
              className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                activeTab === 'criterion3'
                  ? 'bg-white text-green-700 font-semibold'
                  : 'text-white hover:bg-green-500'
              }`}
            >
              Criterion III
            </button>
            <button
              onClick={() => setActiveTab('criterion4')}
              className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                activeTab === 'criterion4'
                  ? 'bg-white text-green-700 font-semibold'
                  : 'text-white hover:bg-green-500'
              }`}
            >
              Criterion IV
            </button>
            <button
              onClick={() => setActiveTab('criterion5')}
              className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                activeTab === 'criterion5'
                  ? 'bg-white text-green-700 font-semibold'
                  : 'text-white hover:bg-green-500'
              }`}
            >
              Criterion V
            </button>
            <button
              onClick={() => setActiveTab('criterion6')}
              className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                activeTab === 'criterion6'
                  ? 'bg-white text-green-700 font-semibold'
                  : 'text-white hover:bg-green-500'
              }`}
            >
              Criterion VI
            </button>
            <button
              onClick={() => setActiveTab('criterion7')}
              className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                activeTab === 'criterion7'
                  ? 'bg-white text-green-700 font-semibold'
                  : 'text-white hover:bg-green-500'
              }`}
            >
              Criterion VII
            </button>
            <button
              onClick={() => setActiveTab('extended')}
              className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                activeTab === 'extended'
                  ? 'bg-white text-green-700 font-semibold'
                  : 'text-white hover:bg-green-500'
              }`}
            >
              Extended Profile
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 max-h-screen overflow-y-auto">
          {activeTab === 'criterion1' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  CRITERION 1 – CURRICULAR ASPECTS (100)
                </h2>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR – 1.2 ACADEMIC FLEXIBILITY
                </h3>
                <DVVMetricTable
                  metricId="1.2.1 QNM"
                  description="Number of Certificate/Value added courses offered and online courses of MOOCs, SWAYAM, NPTEL etc. (where the students of the institution have enrolled and successfully completed during the last five years)"
                  clarifications={dvvData.criterion1.indicator12.metric121}
                />
                <div className="mt-6">
                  <DVVMetricTable
                    metricId="1.2.2 QNM"
                    description="Percentage of students enrolled in Certificate/ Value added courses and also completed online courses of MOOCs, SWAYAM, NPTEL etc. as against the total number of students during the last five years"
                    clarifications={dvvData.criterion1.indicator12.metric122}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR – 1.3 CURRICULUM ENRICHMENT
                </h3>
                <DVVMetricTable
                  metricId="1.3.2 QNM"
                  description="Percentage of students undertaking project work/field work/ internships (Data for the latest completed academic year)"
                  clarifications={dvvData.criterion1.indicator13.metric132}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR – 1.4 FEEDBACK SYSTEM
                </h3>
                <DVVMetricTable
                  metricId="1.4.1 QNM"
                  description="Institution obtains feedback on the academic performance and ambience of the institution from various stakeholders"
                  clarifications={dvvData.criterion1.indicator14.metric141}
                />
              </div>
            </div>
          )}

          {activeTab === 'criterion2' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  CRITERION 2 – TEACHING-LEARNING AND EVALUATION
                </h2>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR- 2.1 STUDENT ENROLMENT AND PROFILE
                </h3>
                <DVVMetricTable
                  metricId="2.1.1 QNM"
                  description="Enrolment percentage - Number of seats filled year wise during last five years"
                  clarifications={dvvData.criterion2.indicator21.metric211}
                />
                <div className="mt-6">
                  <DVVMetricTable
                    metricId="2.1.2 QNM"
                    description="Percentage of seats filled against reserved categories (SC, ST, OBC etc.)"
                    clarifications={dvvData.criterion2.indicator21.metric212}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR-2.2 STUDENT TEACHER RATIO
                </h3>
                <DVVMetricTable
                  metricId="2.2.1 QNM"
                  description="Student – Full time Teacher Ratio (Data for the latest completed academic year)"
                  clarifications={dvvData.criterion2.indicator22.metric221}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR- 2.4 TEACHER PROFILE AND QUALITY
                </h3>
                <DVVMetricTable
                  metricId="2.4.1 QNM"
                  description="Percentage of full-time teachers against sanctioned posts during the last five years"
                  clarifications={dvvData.criterion2.indicator24.metric241}
                />
                <div className="mt-6">
                  <DVVMetricTable
                    metricId="2.4.2 QNM"
                    description="Percentage of full time teachers with NET/SET/SLET/ Ph. D./D.Sc. / D.Litt./L.L.D. during the last five years"
                    clarifications={dvvData.criterion2.indicator24.metric242}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR- 2.6 STUDENT PERFORMANCE AND LEARNING OUTCOME
                </h3>
                <DVVMetricTable
                  metricId="2.6.3 QNM"
                  description="Pass percentage of Students during last five years (excluding backlog students)"
                  clarifications={dvvData.criterion2.indicator26.metric263}
                />
              </div>
            </div>
          )}

          {activeTab === 'criterion3' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  CRITERION 3- RESEARCH, INNOVATIONS AND EXTENSION
                </h2>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR 3.1- RESOURCE MOBILIZATION FOR RESEARCH
                </h3>
                <DVVMetricTable
                  metricId="3.1.1 QNM"
                  description="Grants received from Government and non-governmental agencies for research projects"
                  clarifications={dvvData.criterion3.indicator31.metric311}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR 3.2- INNOVATION ECOSYSTEM
                </h3>
                <DVVMetricTable
                  metricId="3.2.2 QNM"
                  description="Number of workshops/seminars/conferences on Research Methodology, IPR and entrepreneurship"
                  clarifications={dvvData.criterion3.indicator32.metric322}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR 3.3- RESEARCH PUBLICATION AND AWARDS
                </h3>
                <DVVMetricTable
                  metricId="3.3.1 QNM"
                  description="Number of research papers published per teacher in UGC care list journals"
                  clarifications={dvvData.criterion3.indicator33.metric331}
                />
                <div className="mt-6">
                  <DVVMetricTable
                    metricId="3.3.2 QNM"
                    description="Number of books and chapters in edited volumes/books published"
                    clarifications={dvvData.criterion3.indicator33.metric332}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR 3.4- EXTENSION ACTIVITIES
                </h3>
                <DVVMetricTable
                  metricId="3.4.3 QNM"
                  description="Number of extension and outreach programs conducted"
                  clarifications={dvvData.criterion3.indicator34.metric343}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATORS 3.5 – COLLABORATION
                </h3>
                <DVVMetricTable
                  metricId="3.5.1 QNM"
                  description="Number of functional MoUs/linkages with institutions/industries"
                  clarifications={dvvData.criterion3.indicator35.metric351}
                />
              </div>
            </div>
          )}

          {activeTab === 'criterion4' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  CRITERION 4 – INFRASTRUCTURE AND LEARNING RESOURCES
                </h2>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR – 4.1 PHYSICAL FACILITIES
                </h3>
                <DVVMetricTable
                  metricId="4.1.2 QNM"
                  description="Percentage of expenditure for infrastructure development and augmentation"
                  clarifications={dvvData.criterion4.indicator41.metric412}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR- 4.3 IT INFRASTRUCTURE
                </h3>
                <DVVMetricTable
                  metricId="4.3.2 QNM"
                  description="Student – Computer ratio (Data for the latest completed academic year)"
                  clarifications={dvvData.criterion4.indicator43.metric432}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR – 4.4 MAINTENANCE OF CAMPUS INFRASTRUCTURE
                </h3>
                <DVVMetricTable
                  metricId="4.4.1 QNM"
                  description="Percentage expenditure incurred on maintenance of physical facilities"
                  clarifications={dvvData.criterion4.indicator44.metric441}
                />
              </div>
            </div>
          )}

          {activeTab === 'criterion5' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  CRITERION 5 -STUDENT SUPPORT AND PROGRESSION (140)
                </h2>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR-5.1 STUDENT SUPPORT
                </h3>
                <DVVMetricTable
                  metricId="5.1.1 QNM"
                  description="Percentage of students benefited by scholarships and freeships"
                  clarifications={dvvData.criterion5.indicator51.metric511}
                />
                <div className="mt-6">
                  <DVVMetricTable
                    metricId="5.1.2 QNM"
                    description="Capacity development and skills enhancement activities"
                    clarifications={dvvData.criterion5.indicator51.metric512}
                  />
                </div>
                <div className="mt-6">
                  <DVVMetricTable
                    metricId="5.1.3 QNM"
                    description="Percentage of students benefitted by guidance for competitive examinations"
                    clarifications={dvvData.criterion5.indicator51.metric513}
                  />
                </div>
                <div className="mt-6">
                  <DVVMetricTable
                    metricId="5.1.4 QNM"
                    description="Student grievance redressal mechanism"
                    clarifications={dvvData.criterion5.indicator51.metric514}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR- 5.2 STUDENT PROGRESSION
                </h3>
                <DVVMetricTable
                  metricId="5.2.1 QNM"
                  description="Percentage of placement of outgoing students and students progressing to higher education"
                  clarifications={dvvData.criterion5.indicator52.metric521}
                />
                <div className="mt-6">
                  <DVVMetricTable
                    metricId="5.2.2 QNM"
                    description="Percentage of students qualifying in state/national/international level examinations"
                    clarifications={dvvData.criterion5.indicator52.metric522}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR-5.3 STUDENT PARTICIPATION AND ACTIVITIES
                </h3>
                <DVVMetricTable
                  metricId="5.3.1 QNM"
                  description="Number of awards/medals for outstanding performance in sports/cultural activities"
                  clarifications={dvvData.criterion5.indicator53.metric531}
                />
                <div className="mt-6">
                  <DVVMetricTable
                    metricId="5.3.2 QNM"
                    description="Average number of sports and cultural programs"
                    clarifications={dvvData.criterion5.indicator53.metric532}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'criterion6' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  CRITERION 6- GOVERNANCE, LEADERSHIP AND MANAGEMENT (100)
                </h2>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR- 6.2 STRATEGY DEVELOPMENT AND DEPLOYMENT
                </h3>
                <DVVMetricTable
                  metricId="6.2.2 QNM"
                  description="Institution implements e-governance in its operations"
                  clarifications={dvvData.criterion6.indicator62.metric622}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR- 6.3 FACULTY EMPOWERMENT STRATEGIES
                </h3>
                <DVVMetricTable
                  metricId="6.3.2 QNM"
                  description="Percentage of teachers provided with financial support"
                  clarifications={dvvData.criterion6.indicator63.metric632}
                />
                <div className="mt-6">
                  <DVVMetricTable
                    metricId="6.3.3 QNM"
                    description="Percentage of teaching and non-teaching staff participating in FDP, MDP"
                    clarifications={dvvData.criterion6.indicator63.metric633}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR- 6.5 INTERNAL QUALITY ASSURANCE SYSTEM
                </h3>
                <DVVMetricTable
                  metricId="6.5.2 QNM"
                  description="Quality assurance initiatives of the institution"
                  clarifications={dvvData.criterion6.indicator65.metric652}
                />
              </div>
            </div>
          )}

          {activeTab === 'criterion7' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  CRITERION 7-INSTITUTIONAL VALUES AND BEST PRACTICES (100)
                </h2>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  KEY INDICATOR – 7.1 INSTITUTIONAL VALUES AND SOCIAL RESPONSIBILITIES
                </h3>
                <DVVMetricTable
                  metricId="7.1.2 QNM"
                  description="Facilities and initiatives for environment and accessibility"
                  clarifications={dvvData.criterion7.indicator71.metric712}
                />
                <div className="mt-6">
                  <DVVMetricTable
                    metricId="7.1.3 QNM"
                    description="Quality audits on environment and energy"
                    clarifications={dvvData.criterion7.indicator71.metric713}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'extended' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Extended Profile
                </h2>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  1. STUDENTS
                </h3>
                <DVVMetricTable
                  metricId="1.1"
                  description="Number of students year wise during the last five years"
                  clarifications={dvvData.extendedProfile.students.metric11}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  2. TEACHERS
                </h3>
                <DVVMetricTable
                  metricId="2.1"
                  description="Number of Teaching staff/full-time teachers during the last five years (without repeat count)"
                  clarifications={dvvData.extendedProfile.teachers.metric21}
                />
                <div className="mt-6">
                  <DVVMetricTable
                    metricId="2.2"
                    description="Number of Teaching staff/full-time teachers during the last five years"
                    clarifications={dvvData.extendedProfile.teachers.metric22}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  3. INSTITUTION
                </h3>
                <DVVMetricTable
                  metricId="3.1"
                  description="Expenditure excluding salary component year wise during the last five years"
                  clarifications={dvvData.extendedProfile.institution.metric31}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
