import { PortfolioData, Project, Service, Skill, Testimonial, SiteSettings, ContactInquiry, MeetingBooking, MediaAsset } from '../types/portfolio.ts';

const TOKEN_KEY = 'santosh_portfolio_admin_token';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
};

export async function fetchPortfolioData(): Promise<PortfolioData> {
  const res = await fetch('/api/portfolio');
  if (!res.ok) {
    throw new Error('Failed to fetch portfolio data');
  }
  return res.json();
}

export async function submitContactInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget?: string;
  deadline?: string;
  message: string;
}): Promise<{ success: boolean; inquiryId?: string }> {
  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to submit inquiry');
  }
  return json;
}

export async function fetchAvailableSlots(date: string): Promise<string[]> {
  const res = await fetch(`/api/bookings/available-slots?date=${encodeURIComponent(date)}`);
  if (!res.ok) {
    throw new Error('Failed to fetch available time slots');
  }
  const json = await res.json();
  return json.availableSlots || [];
}

export async function createBooking(data: {
  clientName: string;
  clientEmail: string;
  meetingType: string;
  date: string;
  timeSlot: string;
  durationMinutes: number;
  communicationMethod: 'Google Meet' | 'WhatsApp' | 'Custom Link';
  projectDetails: string;
}): Promise<{ success: boolean; booking: MeetingBooking }> {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to reserve meeting');
  }
  return json;
}

// Admin helper
async function authFetch(url: string, options: RequestInit = {}) {
  const token = authStorage.getToken();
  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : '',
  };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    authStorage.clearToken();
    window.location.hash = '#admin-login';
    throw new Error('Session expired. Please log in.');
  }
  return res;
}

export const adminApi = {
  login: async (usernameOrEmail: string, password: string) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Login failed');
    authStorage.setToken(json.token);
    return json;
  },

  getOverview: async () => {
    const res = await authFetch('/api/admin/overview');
    if (!res.ok) throw new Error('Failed to load admin overview');
    return res.json();
  },

  updateSettings: async (settings: Partial<SiteSettings>) => {
    const res = await authFetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.json();
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    const res = await authFetch('/api/admin/projects');
    return res.json();
  },
  saveProject: async (project: Project): Promise<Project> => {
    const isEdit = !!project.id && !project.id.startsWith('new_');
    const res = await authFetch(isEdit ? `/api/admin/projects/${project.id}` : '/api/admin/projects', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    return res.json();
  },
  deleteProject: async (id: string) => {
    const res = await authFetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Services
  getServices: async (): Promise<Service[]> => {
    const res = await authFetch('/api/admin/services');
    return res.json();
  },
  saveService: async (service: Service): Promise<Service> => {
    const isEdit = !!service.id && !service.id.startsWith('new_');
    const res = await authFetch(isEdit ? `/api/admin/services/${service.id}` : '/api/admin/services', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    });
    return res.json();
  },
  deleteService: async (id: string) => {
    const res = await authFetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Skills
  getSkills: async (): Promise<Skill[]> => {
    const res = await authFetch('/api/admin/skills');
    return res.json();
  },
  saveSkill: async (skill: Skill): Promise<Skill> => {
    const isEdit = !!skill.id && !skill.id.startsWith('new_');
    const res = await authFetch(isEdit ? `/api/admin/skills/${skill.id}` : '/api/admin/skills', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skill),
    });
    return res.json();
  },
  deleteSkill: async (id: string) => {
    const res = await authFetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Inquiries
  getInquiries: async (): Promise<ContactInquiry[]> => {
    const res = await authFetch('/api/admin/inquiries');
    return res.json();
  },
  updateInquiryStatus: async (id: string, status: ContactInquiry['status']) => {
    const res = await authFetch(`/api/admin/inquiries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
  deleteInquiry: async (id: string) => {
    const res = await authFetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Bookings
  getBookings: async (): Promise<MeetingBooking[]> => {
    const res = await authFetch('/api/admin/bookings');
    return res.json();
  },
  updateBookingStatus: async (id: string, status: MeetingBooking['status']) => {
    const res = await authFetch(`/api/admin/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
  deleteBooking: async (id: string) => {
    const res = await authFetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Media
  getMedia: async (): Promise<MediaAsset[]> => {
    const res = await authFetch('/api/admin/media');
    return res.json();
  },
  uploadMedia: async (formData: FormData): Promise<MediaAsset> => {
    const token = authStorage.getToken();
    const res = await fetch('/api/admin/media/upload', {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
  deleteMedia: async (id: string) => {
    const res = await authFetch(`/api/admin/media/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Audit Logs
  getAuditLogs: async () => {
    const res = await authFetch('/api/admin/audit-logs');
    return res.json();
  },
};
