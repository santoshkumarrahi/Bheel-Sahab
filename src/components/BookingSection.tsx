import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Video, MessageCircle, CheckCircle2, AlertCircle, ArrowRight, Link as LinkIcon, RefreshCw, Copy, Check } from 'lucide-react';
import { SiteSettings, MeetingBooking } from '../types/portfolio.ts';
import { fetchAvailableSlots, createBooking } from '../lib/api.ts';

interface BookingSectionProps {
  settings: SiteSettings;
  isModal?: boolean;
  onCloseModal?: () => void;
}

const MEETING_TYPES = [
  {
    id: 'discovery',
    name: '15-min Discovery Call',
    duration: 15,
    desc: 'Quick initial alignment on design or development scope, fit, and timeline.',
  },
  {
    id: 'scoping',
    name: '30-min Project Scoping',
    duration: 30,
    desc: 'Detailed discussion of requirements, deliverables, tech stack, and budget estimations.',
  },
  {
    id: 'architecture',
    name: '60-min Technical / Design Review',
    duration: 60,
    desc: 'In-depth consultation, architecture blueprinting, or brand identity deep-dive.',
  },
];

export function BookingSection({ settings, isModal = false, onCloseModal }: BookingSectionProps) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [selectedType, setSelectedType] = useState(MEETING_TYPES[1]);
  const [selectedDate, setSelectedDate] = useState(defaultDateStr);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [commMethod, setCommMethod] = useState<'Google Meet' | 'WhatsApp' | 'Custom Link'>('Google Meet');

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Form fields
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectDetails, setProjectDetails] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<MeetingBooking | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadSlots() {
      setLoadingSlots(true);
      setErrorMsg('');
      try {
        const slots = await fetchAvailableSlots(selectedDate);
        if (active) {
          setAvailableSlots(slots);
          if (slots.length > 0) {
            setSelectedSlot(slots[0]);
          } else {
            setSelectedSlot('');
          }
        }
      } catch (err: any) {
        if (active) {
          setErrorMsg(err.message || 'Failed to load open calendar slots');
        }
      } finally {
        if (active) setLoadingSlots(false);
      }
    }
    loadSlots();
    return () => {
      active = false;
    };
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !selectedSlot) {
      setErrorMsg('Please complete all required fields and pick a time slot.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await createBooking({
        clientName,
        clientEmail,
        meetingType: selectedType.name,
        date: selectedDate,
        timeSlot: selectedSlot,
        durationMinutes: selectedType.duration,
        communicationMethod: commMethod,
        projectDetails,
      });

      setConfirmedBooking(res.booking);
    } catch (err: any) {
      setErrorMsg(err.message || 'Booking reservation failed. Please try another time.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setClientName('');
    setClientEmail('');
    setProjectDetails('');
    setSelectedSlot('');
  };

  const handleCopyLink = () => {
    if (!confirmedBooking) return;
    navigator.clipboard.writeText(confirmedBooking.meetingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const containerClasses = isModal
    ? 'p-6 sm:p-8 max-w-3xl w-full bg-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]'
    : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

  return (
    <section id="book-meeting" className={isModal ? '' : 'py-20 md:py-28 relative'}>
      <div className={containerClasses}>
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            Online Client Booking
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Schedule a Direct Video Consultation
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Reserve a 1-on-1 discovery or scoping session directly with Santosh. Real-time calendar protection against double bookings.
          </p>
        </div>

        {confirmedBooking ? (
          /* Confirmation Card */
          <div className="p-8 rounded-3xl bg-slate-900 border border-emerald-500/30 text-center space-y-6 max-w-xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Meeting Confirmed!</h3>
              <p className="text-sm text-slate-300">
                A calendar invitation has been prepared for <strong className="text-amber-400">{confirmedBooking.clientName}</strong>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/8 text-left space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Meeting Type:</span>
                <span className="font-semibold text-white">{confirmedBooking.meetingType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Scheduled Date:</span>
                <span className="font-semibold text-white">{confirmedBooking.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Time Slot:</span>
                <span className="font-semibold text-amber-400 font-mono">{confirmedBooking.timeSlot} UTC</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Conferencing:</span>
                <span className="font-semibold text-white">{confirmedBooking.communicationMethod}</span>
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">Direct Meeting Link:</span>
                  <button
                    onClick={handleCopyLink}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
                <a
                  href={confirmedBooking.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs text-amber-400 hover:underline break-all block p-2 rounded-lg bg-slate-900 border border-white/5"
                >
                  {confirmedBooking.meetingUrl}
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={confirmedBooking.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-400/20"
              >
                Join Meeting Link
              </a>
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Book Another Time
              </button>
              {isModal && onCloseModal && (
                <button
                  onClick={onCloseModal}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-medium cursor-pointer"
                >
                  Close Window
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Multi-Step Interactive Booking Grid */
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Step 1: Meeting Type & Platform */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 block">
                  1. Select Meeting Agenda
                </label>
                <div className="space-y-3">
                  {MEETING_TYPES.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setSelectedType(type)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedType.id === type.id
                          ? 'bg-amber-400/10 border-amber-400 text-white shadow-md ring-1 ring-amber-400/20'
                          : 'bg-slate-900/40 border-white/8 hover:border-white/20 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold">{type.name}</span>
                        <span className="text-xs font-mono text-amber-400 font-semibold">{type.duration} min</span>
                      </div>
                      <p className="text-xs text-slate-400">{type.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 block">
                  2. Preferred Communication Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setCommMethod('Google Meet')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      commMethod === 'Google Meet'
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-sm'
                        : 'bg-slate-900/60 text-slate-300 border-white/8 hover:bg-slate-800'
                    }`}
                  >
                    <Video className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs block">Google Meet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCommMethod('WhatsApp')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      commMethod === 'WhatsApp'
                        ? 'bg-emerald-500 text-white font-bold border-emerald-400 shadow-sm'
                        : 'bg-slate-900/60 text-slate-300 border-white/8 hover:bg-slate-800'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs block">WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCommMethod('Custom Link')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      commMethod === 'Custom Link'
                        ? 'bg-blue-500 text-white font-bold border-blue-400 shadow-sm'
                        : 'bg-slate-900/60 text-slate-300 border-white/8 hover:bg-slate-800'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs block">Video Room</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Date, Slot & Client Details */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-white/10 space-y-6 shadow-xl">
              {/* Date & Time Slot selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 block flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Choose Date</span>
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 block flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Available Time Slot</span>
                    </span>
                    {loadingSlots && <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />}
                  </label>
                  {availableSlots.length > 0 ? (
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                      required
                    >
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot} UTC
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-3.5 py-2.5 rounded-xl bg-slate-950 text-slate-500 text-xs italic border border-white/5">
                      {loadingSlots ? 'Checking open slots...' : 'No available slots on this date'}
                    </div>
                  )}
                </div>
              </div>

              {/* Client Info inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1.5 block">Your Name *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none placeholder:text-slate-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1.5 block">Email Address *</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="elena@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none placeholder:text-slate-600"
                    required
                  />
                </div>
              </div>

              {/* Project Brief */}
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Project Scope &amp; Topics to Discuss
                </label>
                <textarea
                  rows={3}
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  placeholder="Tell me briefly about your project goals, design requirements, or technical challenges..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none placeholder:text-slate-600"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting || !selectedSlot}
                className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Confirming Reservation...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Video Meeting ({selectedSlot || 'Select Slot'})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
