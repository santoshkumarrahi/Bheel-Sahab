import { useState } from 'react';
import { Mail, MessageCircle, Send, CheckCircle2, AlertCircle, MapPin, Sparkles } from 'lucide-react';
import { SiteSettings } from '../types/portfolio.ts';
import { submitContactInquiry } from '../lib/api.ts';

interface ContactSectionProps {
  settings: SiteSettings;
  preselectedService?: string;
}

export function ContactSection({ settings, preselectedService }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: preselectedService || 'Full-Stack Development',
    budget: '$3,000 - $5,000',
    deadline: 'Within 1 Month',
    message: '',
    consent: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please provide your name, email, and project message.');
      return;
    }
    if (!formData.consent) {
      setErrorMsg('Please confirm agreement to communicate regarding this project inquiry.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await submitContactInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        service: formData.service,
        budget: formData.budget,
        deadline: formData.deadline,
        message: formData.message,
      });

      setSubmittedId(res.inquiryId || 'INQ_RECORDED');
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#0b0e17] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Inquiries & Details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
                08. Inquiries &amp; Collaboration
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Let's Build Something Exceptional Together
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
                Have a project in mind, need a full brand identity overhaul, or want to architect a modern React &amp; Node.js application? Send an inquiry or reach out directly.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              <a
                href={`mailto:${settings.contactEmail}`}
                className="p-4 rounded-2xl bg-slate-900/60 border border-white/8 hover:border-amber-400/40 transition-colors flex items-center gap-4 group shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Direct Email</div>
                  <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate font-mono">
                    {settings.contactEmail}
                  </div>
                </div>
              </a>

              <a
                href={settings.socialLinks?.whatsapp || `https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-slate-900/60 border border-white/8 hover:border-emerald-400/40 transition-colors flex items-center gap-4 group shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Direct WhatsApp Chat</div>
                  <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors font-mono">
                    +{settings.whatsappNumber || '923000000000'}
                  </div>
                </div>
              </a>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/8 flex items-center gap-4 shadow-md">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Location &amp; Working Hours</div>
                  <div className="text-sm font-bold text-white">
                    {settings.location} (Mon–Fri, 09:00–18:00 UTC)
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-400/5 border border-amber-400/20 text-xs text-slate-300 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                All inquiries receive a response within 12 business hours. NDA and proprietary code handoff provided upon request.
              </span>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-white/10 shadow-2xl">
              {submittedId ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Inquiry Received!</h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-amber-400">{formData.name}</strong>. Your project brief has been recorded under reference{' '}
                    <code className="text-amber-300 font-mono text-xs">{submittedId}</code>. Santosh will review your scope and get in touch shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmittedId(null);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        service: 'Full-Stack Development',
                        budget: '$3,000 - $5,000',
                        deadline: 'Within 1 Month',
                        message: '',
                        consent: true,
                      });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Email Address *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Company / Brand (Optional)</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Acme Innovations"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Service Category</label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                      >
                        <option value="Graphic Design">Graphic Design &amp; Brand</option>
                        <option value="Frontend Development">Frontend Development</option>
                        <option value="Backend Development">Backend &amp; API Architecture</option>
                        <option value="Full-Stack Development">Full-Stack Web App</option>
                        <option value="Consultation">General Consultation</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Project Budget</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                      >
                        <option value="Under $1,000">Under $1,000</option>
                        <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                        <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                        <option value="$5,000+">$5,000+</option>
                        <option value="Flexible">To be scoped</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Target Deadline</label>
                      <select
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                      >
                        <option value="Urgent (< 1 Week)">Urgent (&lt; 1 Week)</option>
                        <option value="Within 1 Month">Within 1 Month</option>
                        <option value="1 - 3 Months">1 - 3 Months</option>
                        <option value="Flexible Timeline">Flexible Timeline</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                      Project Requirements &amp; Message *
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe what you want to build, existing assets, goals, or reference websites..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none placeholder:text-slate-600"
                      required
                    />
                  </div>

                  {/* Consent checkbox */}
                  <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-0.5 rounded border-white/20 bg-slate-950 text-amber-400 focus:ring-0"
                    />
                    <span>
                      I agree to allow Santosh Kumar Bheel to contact me regarding this project proposal.
                    </span>
                  </label>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Transmitting Proposal...' : 'Submit Project Request'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
