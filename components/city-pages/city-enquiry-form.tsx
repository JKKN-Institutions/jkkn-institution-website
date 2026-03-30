'use client'

import { useActionState } from 'react'
import type { CityPageConfig } from '@/lib/config/city-pages'
import { submitCityEnquiry, type CityEnquiryState } from '@/app/actions/city-enquiry'

interface CityEnquiryFormProps {
  cityConfig: CityPageConfig
}

const PROGRAMMES = ['CSE', 'ECE', 'ME', 'EEE', 'Civil'] as const

export function CityEnquiryForm({ cityConfig }: CityEnquiryFormProps) {
  const [state, formAction, isPending] = useActionState<CityEnquiryState | null, FormData>(
    submitCityEnquiry,
    null
  )

  return (
    <section className="section form-section" id="enquiry-form">
      <div className="section-inner">
        <h2 className="section-title">Get Free Counselling</h2>
        <p className="section-subtitle">
          Fill the form and our admissions team will contact you within 24 hours.
        </p>
        <span className="section-accent" aria-hidden="true" />
        <div className="section-spacer" />

        {state?.success ? (
          <div className="form-success">
            <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '8px' }}>
              Thank you! Our team will contact you within 24 hours.
            </p>
            <p style={{ opacity: 0.7, fontSize: '0.85rem' }}>
              You can also reach us directly:
            </p>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href="tel:+919345855001"
                style={{ color: '#fff', background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600 }}
              >
                +91-9345855001
              </a>
              <a
                href={`https://wa.me/919345855001?text=${encodeURIComponent(cityConfig.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#fff', background: '#25d366', padding: '8px 16px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600 }}
              >
                WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <>
            <form action={formAction} className="enquiry-form">
              {/* Name */}
              <div className="form-group">
                <label htmlFor="enq-name">
                  Full Name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="enq-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your full name"
                />
                {state?.fieldErrors?.name && (
                  <p className="form-field-error">{state.fieldErrors.name}</p>
                )}
              </div>

              {/* Mobile */}
              <div className="form-group">
                <label htmlFor="enq-phone">
                  Mobile Number <span aria-hidden="true">*</span>
                </label>
                <input
                  id="enq-phone"
                  name="phone"
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile"
                />
                {state?.fieldErrors?.phone && (
                  <p className="form-field-error">{state.fieldErrors.phone}</p>
                )}
              </div>

              {/* City (readonly) */}
              <div className="form-group">
                <label htmlFor="enq-city">Your City</label>
                <input
                  id="enq-city"
                  name="city"
                  type="text"
                  readOnly
                  value={cityConfig.displayName}
                  style={{ cursor: 'default' }}
                />
              </div>

              {/* Programme */}
              <div className="form-group">
                <label htmlFor="enq-programme">
                  Programme <span aria-hidden="true">*</span>
                </label>
                <select
                  id="enq-programme"
                  name="programme"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Programme
                  </option>
                  {PROGRAMMES.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
                {state?.fieldErrors?.programme && (
                  <p className="form-field-error">{state.fieldErrors.programme}</p>
                )}
              </div>

              {/* Question (optional) */}
              <div className="form-group full-width">
                <label htmlFor="enq-question">
                  Any Questions? <span style={{ fontWeight: 'normal', opacity: 0.7 }}>(optional)</span>
                </label>
                <input
                  id="enq-question"
                  name="question"
                  type="text"
                  placeholder="E.g. scholarship details, hostel facilities..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="form-submit"
              >
                {isPending ? 'Submitting...' : 'Submit Enquiry \u2014 Get a Call Back'}
              </button>

              {/* Error state */}
              {state && !state.success && state.error && (
                <div className="form-error">
                  {state.error}
                </div>
              )}
            </form>

            {/* Direct contact */}
            <p className="form-contact-text">
              Or call us directly:{' '}
              <a href="tel:+919345855001">+91-9345855001</a>
              {' \u00b7 '}
              <a
                href={`https://wa.me/919345855001?text=${encodeURIComponent(cityConfig.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </p>
          </>
        )}
      </div>
    </section>
  )
}
