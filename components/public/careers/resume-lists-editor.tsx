'use client'

// Work history, education and skills on the apply form, for the APPLICANT to
// check and correct before they submit (Director, 14 Nov 2026 — "extract at
// the time of submission by the submitter itself").
//
// Shown only once MyJKKN's resume-read has said the feature is on, which it
// does on the POST reply. It appears while the reading is still running, empty,
// so somebody with an unreadable resume can type these three lists themselves
// rather than lose them.
//
// Nothing here can stop a submit. Dates and years are free text: MyJKKN
// understands '2019', '2019-06', '06/2019' and 'Jan 2019', and turns an open
// end into 'present'. Where it would drop a row, this says so under the row
// instead of refusing it.

import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  EMPTY_EDUCATION_ITEM, EMPTY_WORK_ITEM, RESUME_LIST_LIMITS,
  educationItemWouldBeDropped, workItemWouldBeDropped,
  type ResumeEducationItem, type ResumeLists, type ResumeWorkItem,
} from '@/lib/utils/resume-lists'

interface ResumeListsEditorProps {
  lists: ResumeLists
  onChange: (next: ResumeLists) => void
  /** True while the resume is still being read: the lists may still fill in. */
  reading: boolean
}

const rowCard = 'space-y-3 rounded-xl border border-border bg-background p-3'
const addButton =
  'inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-primary hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50'
const removeButton =
  'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

/** One labelled text box. Stacked on a phone; the caller pairs them up from sm: upward. */
function Cell({
  id, label, value, onChange, placeholder, maxLength, inputMode,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  maxLength?: number
  inputMode?: 'numeric'
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

function DropHint({ children }: { children: string }) {
  return <p className="text-xs text-muted-foreground">{children}</p>
}

export function ResumeListsEditor({ lists, onChange, reading }: ResumeListsEditorProps) {
  const setWork = (i: number, patch: Partial<ResumeWorkItem>) =>
    onChange({ ...lists, work_history: lists.work_history.map((w, n) => (n === i ? { ...w, ...patch } : w)) })

  const setEducation = (i: number, patch: Partial<ResumeEducationItem>) =>
    onChange({ ...lists, education: lists.education.map((e, n) => (n === i ? { ...e, ...patch } : e)) })

  const workFull = lists.work_history.length >= RESUME_LIST_LIMITS.workItems
  const educationFull = lists.education.length >= RESUME_LIST_LIMITS.educationItems

  return (
    <section className="space-y-6 rounded-xl border border-border bg-muted/30 p-4" aria-busy={reading}>
      <div>
        <h3 className="text-sm font-semibold text-foreground">Your experience, education and skills</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {reading
            ? 'We are still reading your resume. Anything it finds will appear here, and you can add rows yourself in the meantime.'
            : 'Please check these and correct anything that is wrong. You can leave a section empty.'}
        </p>
      </div>

      {/* ── Work history ──────────────────────────────────────────────── */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Work history</h4>

        {lists.work_history.map((item, i) => (
          <div key={`work-${i}`} className={rowCard}>
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">Job {i + 1}</span>
              <button
                type="button"
                className={removeButton}
                onClick={() => onChange({ ...lists, work_history: lists.work_history.filter((_, n) => n !== i) })}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Remove job {i + 1}</span>
              </button>
            </div>
            <Cell
              id={`work-${i}-employer`} label="Employer" value={item.employer}
              maxLength={RESUME_LIST_LIMITS.employer} placeholder="e.g. ABC College of Pharmacy"
              onChange={v => setWork(i, { employer: v })}
            />
            <Cell
              id={`work-${i}-role`} label="Role" value={item.role}
              maxLength={RESUME_LIST_LIMITS.role} placeholder="e.g. Assistant Professor"
              onChange={v => setWork(i, { role: v })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Cell
                id={`work-${i}-from`} label="From" value={item.from} maxLength={30}
                placeholder="2019 or Jun 2019" onChange={v => setWork(i, { from: v })}
              />
              <Cell
                id={`work-${i}-to`} label="To" value={item.to} maxLength={30}
                placeholder="2023 or present" onChange={v => setWork(i, { to: v })}
              />
            </div>
            {workItemWouldBeDropped(item) && (
              <DropHint>Add the employer or the role, or this job will not be saved.</DropHint>
            )}
          </div>
        ))}

        <button
          type="button"
          className={addButton}
          disabled={workFull}
          onClick={() => onChange({ ...lists, work_history: [...lists.work_history, { ...EMPTY_WORK_ITEM }] })}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {lists.work_history.length === 0 ? 'Add a job' : 'Add another job'}
        </button>
        {workFull && <DropHint>{`That is the most we can take (${RESUME_LIST_LIMITS.workItems} jobs).`}</DropHint>}
      </div>

      {/* ── Education ─────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Education</h4>

        {lists.education.map((item, i) => (
          <div key={`edu-${i}`} className={rowCard}>
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">Qualification {i + 1}</span>
              <button
                type="button"
                className={removeButton}
                onClick={() => onChange({ ...lists, education: lists.education.filter((_, n) => n !== i) })}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Remove qualification {i + 1}</span>
              </button>
            </div>
            <Cell
              id={`edu-${i}-degree`} label="Degree" value={item.degree}
              maxLength={RESUME_LIST_LIMITS.degree} placeholder="e.g. M.Pharm"
              onChange={v => setEducation(i, { degree: v })}
            />
            <Cell
              id={`edu-${i}-subject`} label="Subject" value={item.subject}
              maxLength={RESUME_LIST_LIMITS.subject} placeholder="e.g. Pharmaceutics"
              onChange={v => setEducation(i, { subject: v })}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_6rem]">
              <Cell
                id={`edu-${i}-institution`} label="College or university" value={item.institution}
                maxLength={RESUME_LIST_LIMITS.institution} placeholder="e.g. JKKN College of Pharmacy"
                onChange={v => setEducation(i, { institution: v })}
              />
              <Cell
                id={`edu-${i}-year`} label="Year" value={item.year} maxLength={4}
                inputMode="numeric" placeholder="2021" onChange={v => setEducation(i, { year: v })}
              />
            </div>
            {educationItemWouldBeDropped(item) && (
              <DropHint>Add the degree or the college, or this qualification will not be saved.</DropHint>
            )}
          </div>
        ))}

        <button
          type="button"
          className={addButton}
          disabled={educationFull}
          onClick={() => onChange({ ...lists, education: [...lists.education, { ...EMPTY_EDUCATION_ITEM }] })}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {lists.education.length === 0 ? 'Add a qualification' : 'Add another qualification'}
        </button>
        {educationFull && (
          <DropHint>{`That is the most we can take (${RESUME_LIST_LIMITS.educationItems} qualifications).`}</DropHint>
        )}
      </div>

      {/* ── Skills ────────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <Label htmlFor="resume-skills" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Skills
        </Label>
        <Input
          id="resume-skills"
          value={lists.skills}
          placeholder="e.g. HPLC, Formulation, Teaching"
          onChange={e => onChange({ ...lists, skills: e.target.value })}
        />
        <DropHint>{`Comma-separated. Up to ${RESUME_LIST_LIMITS.skills}; anything after that is left out.`}</DropHint>
      </div>
    </section>
  )
}
