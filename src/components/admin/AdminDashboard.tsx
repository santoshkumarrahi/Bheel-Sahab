import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Briefcase,
  Cpu,
  Mail,
  Calendar,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Upload,
  Eye,
  RefreshCw,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { adminApi, authStorage } from '../../lib/api.ts';
import { Project, Service, Skill, ContactInquiry, MeetingBooking, MediaAsset, SiteSettings } from '../../types/portfolio.ts';

interface AdminDashboardProps {
  onBackToSite: () => void;
  onRefreshSiteData: () => void;
}

export function AdminDashboard({ onBackToSite, onRefreshSiteData }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'services' | 'skills' | 'inquiries' | 'bookings' | 'media' | 'settings'>('overview');

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Overview data
  const [overview, setOverview] = useState<any>(null);

  // Entity lists
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [bookings, setBookings] = useState<MeetingBooking[]>([]);
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Edit modals / states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Password change state
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passMsg, setPassMsg] = useState('');

  // Media upload state
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [ov, pr, sr, sk, inq, bk, med] = await Promise.all([
        adminApi.getOverview(),
        adminApi.getProjects(),
        adminApi.getServices(),
        adminApi.getSkills(),
        adminApi.getInquiries(),
        adminApi.getBookings(),
        adminApi.getMedia(),
      ]);
      setOverview(ov);
      setProjects(pr);
      setServices(sr);
      setSkills(sk);
      setInquiries(inq);
      setBookings(bk);
      setMediaList(med);

      // fetch site bundle for settings
      const siteRes = await fetch('/api/portfolio');
      const siteJson = await siteRes.json();
      setSettings(siteJson.settings);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleLogout = () => {
    authStorage.clearToken();
    onBackToSite();
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // Projects actions
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      await adminApi.saveProject(editingProject);
      setEditingProject(null);
      showNotification('Project saved successfully!');
      loadAll();
      onRefreshSiteData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save project');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await adminApi.deleteProject(id);
      showNotification('Project deleted');
      loadAll();
      onRefreshSiteData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete');
    }
  };

  // Services actions
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      await adminApi.saveService(editingService);
      setEditingService(null);
      showNotification('Service updated successfully!');
      loadAll();
      onRefreshSiteData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save service');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await adminApi.deleteService(id);
      showNotification('Service deleted');
      loadAll();
      onRefreshSiteData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete');
    }
  };

  // Skills actions
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    try {
      await adminApi.saveSkill(editingSkill);
      setEditingSkill(null);
      showNotification('Skill saved successfully!');
      loadAll();
      onRefreshSiteData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save skill');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await adminApi.deleteSkill(id);
      showNotification('Skill deleted');
      loadAll();
      onRefreshSiteData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete');
    }
  };

  // Inquiry actions
  const handleUpdateInquiryStatus = async (id: string, status: ContactInquiry['status']) => {
    try {
      await adminApi.updateInquiryStatus(id, status);
      showNotification(`Inquiry marked as ${status}`);
      loadAll();
    } catch (err: any) {
      setErrorMsg(err.message || 'Status update failed');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Permanently delete this inquiry?')) return;
    try {
      await adminApi.deleteInquiry(id);
      showNotification('Inquiry deleted');
      loadAll();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete inquiry');
    }
  };

  // Booking actions
  const handleUpdateBookingStatus = async (id: string, status: MeetingBooking['status']) => {
    try {
      await adminApi.updateBookingStatus(id, status);
      showNotification(`Meeting status updated to ${status}`);
      loadAll();
    } catch (err: any) {
      setErrorMsg(err.message || 'Booking update failed');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Cancel and delete this booking reservation?')) return;
    try {
      await adminApi.deleteBooking(id);
      showNotification('Booking removed');
      loadAll();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to remove booking');
    }
  };

  // Media upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('file', file);
    fd.append('altText', file.name.replace(/\.[^/.]+$/, ''));

    setUploadingMedia(true);
    setErrorMsg('');
    try {
      await adminApi.uploadMedia(fd);
      showNotification('Asset uploaded to media library!');
      loadAll();
    } catch (err: any) {
      setErrorMsg(err.message || 'Upload failed. File may be too large or unsupported.');
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Delete this asset from storage?')) return;
    try {
      await adminApi.deleteMedia(id);
      showNotification('Asset deleted from media library');
      loadAll();
    } catch (err: any) {
      setErrorMsg(err.message || 'Delete failed');
    }
  };

  // Settings save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await adminApi.updateSettings(settings);
      showNotification('Site settings updated live on portfolio!');
      onRefreshSiteData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update settings');
    }
  };

  // Password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPass !== passForm.confirm) {
      setPassMsg('New passwords do not match.');
      return;
    }
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStorage.getToken()}`,
        },
        body: JSON.stringify({
          currentPassword: passForm.current,
          newPassword: passForm.newPass,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Password update failed');
      setPassMsg('Password successfully changed!');
      setPassForm({ current: '', newPass: '', confirm: '' });
      setTimeout(() => setPassMsg(''), 4000);
    } catch (err: any) {
      setPassMsg(err.message || 'Failed to change password');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      {/* Top Admin Bar */}
      <header className="h-16 bg-slate-900/90 border-b border-white/10 px-6 flex items-center justify-between shrink-0 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm">
            SB
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Santosh Kumar Bheel · Admin Studio</h1>
            <div className="text-[11px] text-slate-400">Production Portfolio CMS &amp; Client Operations</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSite}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>View Public Site</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-emerald-500 text-slate-950 font-bold text-xs py-2 px-6 flex items-center justify-center gap-2 shadow-md">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-500 text-white font-medium text-xs py-2 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="p-1 hover:text-black">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dashboard Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-60 bg-slate-950 border-r border-white/8 flex flex-col justify-between p-4 shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'projects' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderGit2 className="w-4 h-4" />
                <span>Projects Showcase</span>
              </div>
              <span className="font-mono text-[10px] tabular-nums opacity-70">{projects.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'services' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4" />
                <span>Services &amp; Pricing</span>
              </div>
              <span className="font-mono text-[10px] tabular-nums opacity-70">{services.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'skills' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4" />
                <span>Skills &amp; Tech</span>
              </div>
              <span className="font-mono text-[10px] tabular-nums opacity-70">{skills.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'inquiries' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Client Inquiries</span>
              </div>
              {inquiries.filter((i) => i.status === 'new').length > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-[10px]">
                  {inquiries.filter((i) => i.status === 'new').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'bookings' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4" />
                <span>Video Meetings</span>
              </div>
              <span className="font-mono text-[10px] tabular-nums opacity-70">{bookings.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'media' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4" />
                <span>Media Library</span>
              </div>
              <span className="font-mono text-[10px] tabular-nums opacity-70">{mediaList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'settings' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Site &amp; Meeting Setup</span>
            </button>
          </div>

          <div className="pt-4 border-t border-white/5 text-[11px] text-slate-500">
            <div>Logged in as: <span className="text-white font-medium">Santosh Kumar Bheel</span></div>
            <div>Role: <span className="text-amber-400 font-mono">Super Admin</span></div>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {loading ? (
            <div className="h-64 flex items-center justify-center gap-2 text-slate-400 text-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              <span>Loading system records...</span>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && overview && (
                <div className="space-y-8 max-w-6xl">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Operations &amp; Metrics Overview</h2>
                    <p className="text-xs text-slate-400">Live statistics computed directly from the persistent database.</p>
                  </div>

                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/8 space-y-1">
                      <div className="text-xs text-slate-400">Total Projects</div>
                      <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                        {overview.stats.totalProjects}
                      </div>
                      <div className="text-[11px] text-amber-400 font-mono">
                        {overview.stats.publishedProjects} Published · {overview.stats.featuredProjects} Featured
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/8 space-y-1">
                      <div className="text-xs text-slate-400">Client Inquiries</div>
                      <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                        {overview.stats.totalInquiries}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono">
                        {overview.stats.unreadInquiries} New Unread Messages
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/8 space-y-1">
                      <div className="text-xs text-slate-400">Scheduled Consultations</div>
                      <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                        {overview.stats.totalBookings}
                      </div>
                      <div className="text-[11px] text-blue-400 font-mono">
                        {overview.stats.upcomingBookings} Confirmed Upcoming
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/8 space-y-1">
                      <div className="text-xs text-slate-400">Active Services</div>
                      <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                        {overview.stats.totalServices}
                      </div>
                      <div className="text-[11px] text-purple-400 font-mono">
                        {overview.stats.mediaCount} Media Assets in Storage
                      </div>
                    </div>
                  </div>

                  {/* Recent Inquiries and Bookings split */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Inquiries */}
                    <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/8 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Mail className="w-4 h-4 text-amber-400" />
                          <span>Recent Inbound Inquiries</span>
                        </h3>
                        <button
                          onClick={() => setActiveTab('inquiries')}
                          className="text-xs text-amber-400 hover:underline"
                        >
                          View All
                        </button>
                      </div>

                      {inquiries.slice(0, 4).map((inq) => (
                        <div key={inq.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white">{inq.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{inq.service}</span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1">{inq.message}</p>
                          <div className="text-[10px] text-slate-500 font-mono">{inq.email}</div>
                        </div>
                      ))}
                    </div>

                    {/* Upcoming Meetings */}
                    <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/8 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span>Upcoming Client Consultations</span>
                        </h3>
                        <button
                          onClick={() => setActiveTab('bookings')}
                          className="text-xs text-blue-400 hover:underline"
                        >
                          View All
                        </button>
                      </div>

                      {bookings.slice(0, 4).map((bk) => (
                        <div key={bk.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white">{bk.clientName}</span>
                            <span className="text-xs font-mono text-amber-400 font-bold">{bk.timeSlot} · {bk.date}</span>
                          </div>
                          <div className="text-xs text-slate-400">{bk.meetingType} ({bk.communicationMethod})</div>
                          <a
                            href={bk.meetingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-blue-400 hover:underline font-mono block truncate"
                          >
                            {bk.meetingUrl}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROJECTS MANAGER */}
              {activeTab === 'projects' && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Projects &amp; Case Studies</h2>
                      <p className="text-xs text-slate-400">Create, edit, feature, or publish portfolio projects.</p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingProject({
                          id: `proj_new_${Date.now()}`,
                          title: '',
                          slug: '',
                          category: 'Full-Stack Websites',
                          coverImage: '/assets/projects/lumina_cover.svg',
                          gallery: ['/assets/projects/lumina_cover.svg'],
                          description: '',
                          technologies: ['React', 'TypeScript', 'Tailwind CSS'],
                          date: new Date().getFullYear().toString(),
                          client: '',
                          liveUrl: '',
                          githubUrl: '',
                          caseStudy: { overview: '', challenge: '', solution: '', results: '' },
                          featured: false,
                          published: true,
                          orderIndex: projects.length + 1,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Project</span>
                    </button>
                  </div>

                  {/* Projects List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="rounded-2xl bg-slate-900/50 border border-white/8 overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                            <img src={proj.coverImage} alt={proj.title} className="w-full h-full object-cover object-center" />
                            <div className="absolute top-2 right-2 flex items-center gap-1.5">
                              {proj.featured && (
                                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-bold">
                                  Featured
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  proj.published ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'
                                }`}
                              >
                                {proj.published ? 'Published' : 'Draft'}
                              </span>
                            </div>
                          </div>
                          <div className="p-4 space-y-1">
                            <div className="text-xs font-mono text-amber-400">{proj.category}</div>
                            <h3 className="text-base font-bold text-white">{proj.title}</h3>
                            <p className="text-xs text-slate-400 line-clamp-2">{proj.description}</p>
                          </div>
                        </div>

                        <div className="p-4 pt-2 border-t border-white/5 flex items-center justify-between">
                          <button
                            onClick={() => setEditingProject({ ...proj })}
                            className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROJECT EDIT MODAL */}
              {editingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                  <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="text-lg font-bold text-white">
                        {editingProject.id.startsWith('proj_new_') ? 'Add New Project' : 'Edit Project Details'}
                      </h3>
                      <button onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Project Title *</label>
                        <input
                          type="text"
                          value={editingProject.title}
                          onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-slate-300 font-semibold mb-1 block">Category</label>
                          <select
                            value={editingProject.category}
                            onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                          >
                            <option value="Graphic Design">Graphic Design</option>
                            <option value="Branding and Logos">Branding and Logos</option>
                            <option value="Social Media Design">Social Media Design</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="Frontend Development">Frontend Development</option>
                            <option value="Backend Development">Backend Development</option>
                            <option value="Full-Stack Websites">Full-Stack Websites</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-slate-300 font-semibold mb-1 block">Client Name</label>
                          <input
                            type="text"
                            value={editingProject.client}
                            onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Cover Image URL *</label>
                        <input
                          type="text"
                          value={editingProject.coverImage}
                          onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                          placeholder="/assets/projects/lumina_cover.svg or upload via Media tab"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Short Description</label>
                        <textarea
                          rows={2}
                          value={editingProject.description}
                          onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Technologies (comma separated)</label>
                        <input
                          type="text"
                          value={editingProject.technologies.join(', ')}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-slate-300 font-semibold mb-1 block">Live Demo URL</label>
                          <input
                            type="url"
                            value={editingProject.liveUrl || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-300 font-semibold mb-1 block">GitHub Repository</label>
                          <input
                            type="url"
                            value={editingProject.githubUrl || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                            placeholder="https://github.com/..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                          />
                        </div>
                      </div>

                      {/* Case Study Details */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-3">
                        <div className="font-bold text-amber-400">Case Study Details</div>
                        <div>
                          <label className="text-slate-400 block mb-1">Challenge Faced:</label>
                          <textarea
                            rows={2}
                            value={editingProject.caseStudy?.challenge || ''}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                caseStudy: { ...editingProject.caseStudy, challenge: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Solution Implemented:</label>
                          <textarea
                            rows={2}
                            value={editingProject.caseStudy?.solution || ''}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                caseStudy: { ...editingProject.caseStudy, solution: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Measurable Results:</label>
                          <textarea
                            rows={2}
                            value={editingProject.caseStudy?.results || ''}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                caseStudy: { ...editingProject.caseStudy, results: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                          />
                        </div>
                      </div>

                      {/* Status Checkboxes */}
                      <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProject.featured}
                            onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                            className="rounded border-white/20 bg-slate-950 text-amber-400"
                          />
                          <span>Showcase on Homepage Slider (Featured)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProject.published}
                            onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                            className="rounded border-white/20 bg-slate-950 text-amber-400"
                          />
                          <span>Published</span>
                        </label>
                      </div>

                      <div className="pt-4 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="px-4 py-2 rounded-xl bg-white/10 text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold"
                        >
                          Save Project
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 3: SERVICES MANAGER */}
              {activeTab === 'services' && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Services &amp; Pricing Packages</h2>
                      <p className="text-xs text-slate-400">Manage your offerings, deliverables, and starting rates.</p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingService({
                          id: `srv_new_${Date.now()}`,
                          category: 'Full-Stack Development',
                          title: '',
                          slug: '',
                          iconName: 'Layers',
                          shortDesc: '',
                          features: ['Brand alignment', 'Production code', 'Ongoing support'],
                          startingPrice: '$500',
                          deliveryTime: '1 Week',
                          orderIndex: services.length + 1,
                          published: true,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Service</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((srv) => (
                      <div key={srv.id} className="p-6 rounded-2xl bg-slate-900/50 border border-white/8 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-amber-400">{srv.category}</span>
                          <span className="text-xs font-bold text-white font-mono">{srv.startingPrice}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">{srv.title}</h3>
                        <p className="text-xs text-slate-400">{srv.shortDesc}</p>
                        <div className="text-xs text-slate-300 font-mono">Delivery: {srv.deliveryTime}</div>
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                          <button
                            onClick={() => setEditingService({ ...srv })}
                            className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Service</span>
                          </button>
                          <button
                            onClick={() => handleDeleteService(srv.id)}
                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SERVICE EDIT MODAL */}
              {editingService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="text-base font-bold text-white">Edit Service</h3>
                      <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveService} className="space-y-4 text-xs">
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Service Title</label>
                        <input
                          type="text"
                          value={editingService.title}
                          onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-300 font-semibold mb-1 block">Starting Price</label>
                          <input
                            type="text"
                            value={editingService.startingPrice}
                            onChange={(e) => setEditingService({ ...editingService, startingPrice: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-300 font-semibold mb-1 block">Delivery Time</label>
                          <input
                            type="text"
                            value={editingService.deliveryTime}
                            onChange={(e) => setEditingService({ ...editingService, deliveryTime: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Short Description</label>
                        <textarea
                          rows={2}
                          value={editingService.shortDesc}
                          onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Features (comma separated)</label>
                        <textarea
                          rows={3}
                          value={editingService.features.join('\n')}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              features: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingService(null)}
                          className="px-4 py-2 rounded-xl bg-white/10 text-white"
                        >
                          Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold">
                          Save Service
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 4: SKILLS MANAGER */}
              {activeTab === 'skills' && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Skills &amp; Technologies</h2>
                      <p className="text-xs text-slate-400">Configure technologies, proficiency levels, and years of experience.</p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingSkill({
                          id: `sk_new_${Date.now()}`,
                          category: 'Frontend',
                          name: '',
                          level: 'Expert',
                          percentage: 90,
                          experienceYears: '4 yrs',
                          iconName: 'Code',
                          orderIndex: skills.length + 1,
                          published: true,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Skill</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skills.map((sk) => (
                      <div key={sk.id} className="p-4 rounded-xl bg-slate-900/60 border border-white/8 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-white">{sk.name}</span>
                          <span className="text-amber-400 font-mono">{sk.percentage}%</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex justify-between">
                          <span>{sk.category}</span>
                          <span>{sk.experienceYears} · {sk.level}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-white/5 text-[11px]">
                          <button
                            onClick={() => setEditingSkill({ ...sk })}
                            className="text-amber-400 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(sk.id)}
                            className="text-red-400 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SKILL EDIT MODAL */}
              {editingSkill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-4">
                    <h3 className="text-base font-bold text-white">Configure Skill</h3>
                    <form onSubmit={handleSaveSkill} className="space-y-3 text-xs">
                      <div>
                        <label className="text-slate-300 mb-1 block">Skill Name</label>
                        <input
                          type="text"
                          value={editingSkill.name}
                          onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 mb-1 block">Category</label>
                        <select
                          value={editingSkill.category}
                          onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        >
                          <option value="Design">Design</option>
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                          <option value="Workflow & Tools">Workflow &amp; Tools</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-300 mb-1 block">Proficiency %</label>
                          <input
                            type="number"
                            min="10"
                            max="100"
                            value={editingSkill.percentage}
                            onChange={(e) => setEditingSkill({ ...editingSkill, percentage: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-300 mb-1 block">Experience Label</label>
                          <input
                            type="text"
                            value={editingSkill.experienceYears}
                            onChange={(e) => setEditingSkill({ ...editingSkill, experienceYears: e.target.value })}
                            placeholder="e.g. 5 yrs"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-3">
                        <button
                          type="button"
                          onClick={() => setEditingSkill(null)}
                          className="px-3 py-1.5 rounded-lg bg-white/10"
                        >
                          Cancel
                        </button>
                        <button type="submit" className="px-4 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold">
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 5: INQUIRIES MANAGER */}
              {activeTab === 'inquiries' && (
                <div className="space-y-6 max-w-6xl">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Client Project Inquiries</h2>
                    <p className="text-xs text-slate-400">View, organize, update, or archive inbound client submissions.</p>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-xs">No client inquiries found.</div>
                  ) : (
                    <div className="space-y-4">
                      {inquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className={`p-6 rounded-2xl border transition-all ${
                            inq.status === 'new'
                              ? 'bg-slate-900 border-amber-400/40'
                              : 'bg-slate-900/40 border-white/5'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-base text-white">{inq.name}</span>
                              {inq.company && <span className="text-xs text-slate-400">({inq.company})</span>}
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  inq.status === 'new'
                                    ? 'bg-amber-400 text-slate-950'
                                    : inq.status === 'replied'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {inq.status.toUpperCase()}
                              </span>
                            </div>
                            <span className="text-xs font-mono text-slate-400">
                              {new Date(inq.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-400 mb-3 font-mono">
                            <div>Email: <a href={`mailto:${inq.email}`} className="text-amber-400 hover:underline">{inq.email}</a></div>
                            <div>Phone: {inq.phone || 'N/A'}</div>
                            <div>Service: <span className="text-slate-200">{inq.service}</span></div>
                            <div>Budget: <span className="text-slate-200">{inq.budget || 'Flexible'}</span></div>
                            <div>Deadline: <span className="text-slate-200">{inq.deadline || 'Flexible'}</span></div>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 text-xs text-slate-200 leading-relaxed mb-4">
                            {inq.message}
                          </div>

                          <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateInquiryStatus(inq.id, 'read')}
                                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                              >
                                Mark Read
                              </button>
                              <button
                                onClick={() => handleUpdateInquiryStatus(inq.id, 'replied')}
                                className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                              >
                                Mark Replied
                              </button>
                              <button
                                onClick={() => handleUpdateInquiryStatus(inq.id, 'archived')}
                                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-400"
                              >
                                Archive
                              </button>
                            </div>

                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="text-red-400 hover:underline flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: BOOKINGS MANAGER */}
              {activeTab === 'bookings' && (
                <div className="space-y-6 max-w-6xl">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Client Video Consultations</h2>
                    <p className="text-xs text-slate-400">Manage client scheduled appointments, time slots, and room links.</p>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-xs">No bookings recorded.</div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((bk) => (
                        <div key={bk.id} className="p-6 rounded-2xl bg-slate-900/60 border border-white/8 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="font-bold text-base text-white">{bk.clientName}</span>
                              <span className="text-xs text-slate-400 ml-2 font-mono">({bk.clientEmail})</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono font-bold text-amber-400">
                                {bk.date} at {bk.timeSlot} UTC ({bk.durationMinutes}m)
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  bk.status === 'confirmed'
                                    ? 'bg-blue-500/20 text-blue-300'
                                    : bk.status === 'rescheduled'
                                    ? 'bg-amber-400/20 text-amber-300'
                                    : 'bg-red-500/20 text-red-300'
                                }`}
                              >
                                {bk.status.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <div className="text-xs text-slate-300">
                            <strong>Platform:</strong> {bk.communicationMethod} · <strong>Type:</strong> {bk.meetingType}
                          </div>

                          {bk.projectDetails && (
                            <p className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-white/5">
                              {bk.projectDetails}
                            </p>
                          )}

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-mono text-[11px]">Room Link:</span>
                              <a
                                href={bk.meetingUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-amber-400 hover:underline font-mono text-[11px] truncate max-w-sm"
                              >
                                {bk.meetingUrl}
                              </a>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateBookingStatus(bk.id, 'confirmed')}
                                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                              >
                                Confirmed
                              </button>
                              <button
                                onClick={() => handleUpdateBookingStatus(bk.id, 'cancelled')}
                                className="px-2 py-1 rounded bg-red-500/10 text-red-300 hover:bg-red-500/20"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(bk.id)}
                                className="p-1 text-slate-400 hover:text-red-400"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: MEDIA LIBRARY */}
              {activeTab === 'media' && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Central Media Storage</h2>
                      <p className="text-xs text-slate-400">Upload and manage project mockups, graphics, and visual assets.</p>
                    </div>

                    <label className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingMedia ? 'Uploading...' : 'Upload Image / Video'}</span>
                      <input type="file" onChange={handleFileUpload} disabled={uploadingMedia} className="hidden" />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mediaList.map((m) => (
                      <div key={m.id} className="p-3 rounded-2xl bg-slate-900/60 border border-white/8 space-y-2 group">
                        <div className="aspect-video rounded-xl bg-slate-950 overflow-hidden relative flex items-center justify-center p-1 border border-white/5">
                          <img src={m.url} alt={m.altText} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="text-xs font-bold text-white truncate">{m.filename}</div>
                        <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                          <span>{m.fileType.split('/')[1] || 'img'}</span>
                          <span>{Math.round(m.fileSize / 1024)} KB</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(m.url);
                              showNotification('Image URL copied to clipboard!');
                            }}
                            className="text-amber-400 hover:underline flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy URL</span>
                          </button>
                          <button
                            onClick={() => handleDeleteMedia(m.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: SETTINGS & AVAILABILITY */}
              {activeTab === 'settings' && settings && (
                <div className="space-y-8 max-w-4xl">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Site Settings &amp; Availability</h2>
                    <p className="text-xs text-slate-400">Global identity, hero text, working hours, and password credentials.</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6 text-xs">
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Personal Branding</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-300 mb-1 block">Full Name</label>
                        <input
                          type="text"
                          value={settings.name}
                          onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 mb-1 block">Professional Title</label>
                        <input
                          type="text"
                          value={settings.title}
                          onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 mb-1 block">Hero Headline</label>
                      <input
                        type="text"
                        value={settings.heroHeadline}
                        onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 mb-1 block">Hero Subtext</label>
                      <textarea
                        rows={2}
                        value={settings.heroSubtext}
                        onChange={(e) => setSettings({ ...settings, heroSubtext: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 mb-1 block">Detailed Biography</label>
                      <textarea
                        rows={3}
                        value={settings.bio}
                        onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-slate-300 mb-1 block">Years Experience</label>
                        <input
                          type="text"
                          value={settings.yearsExperience}
                          onChange={(e) => setSettings({ ...settings, yearsExperience: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 mb-1 block">Completed Projects</label>
                        <input
                          type="text"
                          value={settings.completedProjects}
                          onChange={(e) => setSettings({ ...settings, completedProjects: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 mb-1 block">Client Satisfaction</label>
                        <input
                          type="text"
                          value={settings.clientSatisfaction}
                          onChange={(e) => setSettings({ ...settings, clientSatisfaction: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-300 mb-1 block">Contact Email</label>
                        <input
                          type="email"
                          value={settings.contactEmail}
                          onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 mb-1 block">WhatsApp Number (e.g. 923000000000)</label>
                        <input
                          type="text"
                          value={settings.whatsappNumber}
                          onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        />
                      </div>
                    </div>

                    {/* Meeting Availability Configuration */}
                    <div className="pt-4 border-t border-white/10 space-y-4">
                      <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                        Client Booking &amp; Calendar Availability
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-slate-300 mb-1 block">Start Hour (24h format)</label>
                          <input
                            type="number"
                            min="0"
                            max="23"
                            value={settings.meetingSettings?.startHour ?? 9}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                meetingSettings: {
                                  ...settings.meetingSettings,
                                  startHour: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-300 mb-1 block">End Hour (24h format)</label>
                          <input
                            type="number"
                            min="1"
                            max="24"
                            value={settings.meetingSettings?.endHour ?? 18}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                meetingSettings: {
                                  ...settings.meetingSettings,
                                  endHour: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-300 mb-1 block">Default Meeting Video Link</label>
                        <input
                          type="url"
                          value={settings.meetingSettings?.customMeetingUrl || ''}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              meetingSettings: {
                                ...settings.meetingSettings,
                                customMeetingUrl: e.target.value,
                              },
                            })
                          }
                          placeholder="https://meet.google.com/..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wide cursor-pointer shadow-md"
                    >
                      Save All Configuration
                    </button>
                  </form>

                  {/* Password Change Box */}
                  <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
                    <h3 className="text-sm font-bold text-white">Security: Change Admin Password</h3>
                    <form onSubmit={handleChangePassword} className="space-y-3 max-w-sm text-xs">
                      <div>
                        <label className="text-slate-400 mb-1 block">Current Password</label>
                        <input
                          type="password"
                          value={passForm.current}
                          onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 mb-1 block">New Password</label>
                        <input
                          type="password"
                          value={passForm.newPass}
                          onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 mb-1 block">Confirm New Password</label>
                        <input
                          type="password"
                          value={passForm.confirm}
                          onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                          required
                        />
                      </div>
                      {passMsg && <div className="text-amber-400 font-semibold">{passMsg}</div>}
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                      >
                        Update Password
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
