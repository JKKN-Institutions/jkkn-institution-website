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
    <section className="py-12 px-4 bg-gradient-to-br from-primary to-primary/85" id="enquiry-form">
      <div className="max-w-xl mx-auto">
        <h2 className="font-poppins text-3xl font-bold text-white text-center mb-2">
          Get Free Counselling
        </h2>
        <p className="text-white/80 text-base text-center mb-6">
          Fill the form and our admissions team will contact you within 24 hours.
        </p>

        {state?.success ? (
          <div className="max-w-lg mx-auto bg-green-500/20 border border-green-400/40 rounded-2xl px-6 py-8 text-center">
            <p className="text-white font-semibold text-lg mb-2">
              Thank you! Our team will contact you within 24 hours.
            </p>
            <p className="text-white/70 text-sm">
              You can also reach us directly:
            </p>
            <div className="mt-4 flex justify-center gap-3 flex-wrap">
              <a
                href="tel:+919345855001"
                className="text-white bg-white/15 px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/25 transition-colors"
              >
                +91-9345855001
              </a>
              <a
                href={`https://wa.me/919345855001?text=${encodeURIComponent(cityConfig.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white bg-[#25d366] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#1ebe5d] transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <>
            <form action={formAction} className="max-w-lg mx-auto grid grid-cols-2 gap-3.5">
              {/* Name */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="enq-name" className="block text-xs font-semibold mb-1.5 text-white opacity-90">
                  Full Name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="enq-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-white/10 text-white text-sm backdrop-blur-sm focus:outline-none focus:border-secondary placeholder:text-white/50 transition-colors"
                />
                {state?.fieldErrors?.name && (
                  <p className="text-red-300 text-xs mt-1">{state.fieldErrors.name}</p>
                )}
              </div>

              {/* Mobile */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="enq-phone" className="block text-xs font-semibold mb-1.5 text-white opacity-90">
                  Mobile Number <span aria-hidden="true">*</span>
                </label>
                <input
                  id="enq-phone"
                  name="phone"
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile"
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-white/10 text-white text-sm backdrop-blur-sm focus:outline-none focus:border-secondary placeholder:text-white/50 transition-colors"
                />
                {state?.fieldErrors?.phone && (
                  <p className="text-red-300 text-xs mt-1">{state.fieldErrors.phone}</p>
                )}
              </div>

              {/* City (readonly) */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="enq-city" className="block text-xs font-semibold mb-1.5 text-white opacity-90">
                  Your City
                </label>
                <input
                  id="enq-city"
                  name="city"
                  type="text"
                  readOnly
                  value={cityConfig.displayName}
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-white/10 text-white text-sm backdrop-blur-sm focus:outline-none focus:border-secondary placeholder:text-white/50 transition-colors cursor-default"
                />
              </div>

              {/* Programme */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="enq-programme" className="block text-xs font-semibold mb-1.5 text-white opacity-90">
                  Programme <span aria-hidden="true">*</span>
                </label>
                <select
                  id="enq-programme"
                  name="programme"
                  required
                  defaultValue=""
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-white/10 text-white text-sm backdrop-blur-sm focus:outline-none focus:border-secondary transition-colors"
                >
                  <option value="" disabled className="text-gray-800">
                    Select Programme
                  </option>
                  {PROGRAMMES.map((prog) => (
                    <option key={prog} value={prog} className="text-gray-800">
                      {prog}
                    </option>
                  ))}
                </select>
                {state?.fieldErrors?.programme && (
                  <p className="text-red-300 text-xs mt-1">{state.fieldErrors.programme}</p>
                )}
              </div>

              {/* Question (optional) */}
              <div className="col-span-2">
                <label htmlFor="enq-question" className="block text-xs font-semibold mb-1.5 text-white opacity-90">
                  Any Questions? <span className="font-normal opacity-70">(optional)</span>
                </label>
                <input
                  id="enq-question"
                  name="question"
                  type="text"
                  placeholder="E.g. scholarship details, hostel facilities..."
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-white/10 text-white text-sm backdrop-blur-sm focus:outline-none focus:border-secondary placeholder:text-white/50 transition-colors"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="col-span-2 bg-secondary text-gray-900 border-none px-8 py-3.5 rounded-full text-base font-bold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {isPending ? 'Submitting...' : 'Get Free Counselling'}
              </button>

              {/* Error state */}
              {state && !state.success && state.error && (
                <div className="col-span-2 bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 text-sm text-red-200">
                  {state.error}
                </div>
              )}
            </form>

            {/* Direct contact */}
            <p className="text-white/60 text-xs text-center mt-5">
              Or call us directly:{' '}
              <a href="tel:+919345855001" className="text-white/80 underline underline-offset-2">
                +91-9345855001
              </a>
              {' · '}
              <a
                href={`https://wa.me/919345855001?text=${encodeURIComponent(cityConfig.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 underline underline-offset-2"
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
