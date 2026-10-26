import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { db, Project, Service, Skill, Testimonial } from './server/db.js';
import { requireAuth, generateToken, verifyPassword, hashPassword, AuthRequest } from './server/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Configure multer storage for image uploads
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const sanitizedName = file.originalname
      .replace(ext, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_');
    cb(null, `${sanitizedName}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|gif|pdf|mp4/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.test(ext) || allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Please upload JPG, PNG, WEBP, SVG, or PDF.'));
    }
  },
});

async function bootstrap() {
  const app = express();

  // Basic Middleware
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Static uploads directory
  app.use('/uploads', express.static(uploadsDir));

  // Rate-limiting tracking map for contacts to prevent spam
  const ipSubmissionMap = new Map<string, number>();

  // ==========================================
  // PUBLIC CLIENT APIS
  // ==========================================

  // Combined bundle for lightning fast hydration
  app.get('/api/portfolio', (_req, res) => {
    try {
      const settings = db.getSettings();
      const services = db.getServices(true);
      const projects = db.getProjects(true);
      const skills = db.getSkills(true);
      const workSteps = db.getWorkSteps();
      const experience = db.getExperience();
      const testimonials = db.getTestimonials(true);

      res.json({
        settings,
        services,
        projects,
        skills,
        workSteps,
        experience,
        testimonials,
      });
    } catch (err) {
      console.error('Error fetching portfolio bundle:', err);
      res.status(500).json({ error: 'Failed to load portfolio data' });
    }
  });

  // Individual Project Details
  app.get('/api/projects/:slugOrId', (req, res) => {
    const { slugOrId } = req.params;
    const project = db
      .getProjects()
      .find((p) => p.slug === slugOrId || p.id === slugOrId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  });

  // Available Booking Slots calculation (prevents double bookings)
  app.get('/api/bookings/available-slots', (req, res) => {
    const date = req.query.date as string;
    if (!date) {
      return res.status(400).json({ error: 'Date parameter (YYYY-MM-DD) is required.' });
    }

    const settings = db.getSettings().meetingSettings;
    const existingBookings = db
      .getBookings()
      .filter((b) => b.date === date && b.status !== 'cancelled');

    const bookedSlots = new Set(existingBookings.map((b) => b.timeSlot));

    // Generate slots based on startHour & endHour
    const availableSlots: string[] = [];
    for (let hour = settings.startHour; hour < settings.endHour; hour++) {
      const slot1 = `${hour.toString().padStart(2, '0')}:00`;
      const slot2 = `${hour.toString().padStart(2, '0')}:30`;
      if (!bookedSlots.has(slot1)) availableSlots.push(slot1);
      if (!bookedSlots.has(slot2)) availableSlots.push(slot2);
    }

    res.json({ date, availableSlots });
  });

  // Client Meeting Booking
  app.post('/api/bookings', (req, res) => {
    try {
      const {
        clientName,
        clientEmail,
        meetingType,
        date,
        timeSlot,
        durationMinutes,
        communicationMethod,
        projectDetails,
      } = req.body;

      if (!clientName || !clientEmail || !date || !timeSlot || !communicationMethod) {
        return res.status(400).json({ error: 'Please provide all required booking details.' });
      }

      // Check double booking
      const conflict = db
        .getBookings()
        .some((b) => b.date === date && b.timeSlot === timeSlot && b.status !== 'cancelled');

      if (conflict) {
        return res.status(409).json({ error: 'This time slot was just reserved. Please select another slot.' });
      }

      const booking = db.addBooking({
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim().toLowerCase(),
        meetingType: meetingType || '30-min Project Scoping',
        date,
        timeSlot,
        durationMinutes: Number(durationMinutes) || 30,
        communicationMethod,
        projectDetails: (projectDetails || '').trim(),
      });

      res.status(201).json({ success: true, booking });
    } catch (err) {
      console.error('Error reserving booking:', err);
      res.status(500).json({ error: 'Failed to complete booking reservation.' });
    }
  });

  // Client Contact Inquiries
  app.post('/api/inquiries', (req, res) => {
    try {
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'ip';
      const lastSent = ipSubmissionMap.get(clientIp);
      const now = Date.now();

      // Simple rate limit: max 1 per 15 seconds per IP
      if (lastSent && now - lastSent < 15000) {
        return res.status(429).json({ error: 'Please wait a moment before sending another message.' });
      }
      ipSubmissionMap.set(clientIp, now);

      const { name, email, phone, company, service, budget, deadline, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required fields.' });
      }

      const inquiry = db.addInquiry({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : undefined,
        company: company ? company.trim() : undefined,
        service: service || 'General Inquiry',
        budget: budget || undefined,
        deadline: deadline || undefined,
        message: message.trim(),
      });

      res.status(201).json({ success: true, inquiryId: inquiry.id });
    } catch (err) {
      console.error('Error creating inquiry:', err);
      res.status(500).json({ error: 'Failed to record message submission.' });
    }
  });

  // ==========================================
  // ADMIN AUTHENTICATION
  // ==========================================

  app.post('/api/admin/login', (req, res) => {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Please enter both username/email and password.' });
    }

    const user = db.findUserByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = generateToken(user);
    db.logAction('Admin Login', `User ${user.username} logged in successfully`, user.username);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  });

  app.get('/api/admin/me', requireAuth, (req: AuthRequest, res) => {
    const user = db.findUserByUsernameOrEmail(req.user!.username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  });

  app.post('/api/admin/change-password', requireAuth, (req: AuthRequest, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    const user = db.findUserByUsernameOrEmail(req.user!.username);
    if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    const newHash = hashPassword(newPassword);
    db.updateUserPassword(user.id, newHash, user.username);
    res.json({ success: true, message: 'Password updated successfully.' });
  });

  // ==========================================
  // ADMIN DASHBOARD & CRUD
  // ==========================================

  app.get('/api/admin/overview', requireAuth, (_req, res) => {
    const data = db.getData();
    const stats = {
      totalProjects: data.projects.length,
      publishedProjects: data.projects.filter((p) => p.published).length,
      featuredProjects: data.projects.filter((p) => p.featured).length,
      totalServices: data.services.length,
      totalInquiries: data.inquiries.length,
      unreadInquiries: data.inquiries.filter((i) => i.status === 'new').length,
      totalBookings: data.bookings.length,
      upcomingBookings: data.bookings.filter((b) => b.status === 'confirmed').length,
      mediaCount: data.media.length,
    };
    res.json({
      stats,
      recentInquiries: data.inquiries.slice(0, 5),
      recentBookings: data.bookings.slice(0, 5),
      recentLogs: data.auditLogs.slice(-8).reverse(),
    });
  });

  // Settings
  app.put('/api/admin/settings', requireAuth, (req: AuthRequest, res) => {
    const updated = db.updateSettings(req.body, req.user?.username);
    res.json({ success: true, settings: updated });
  });

  // Projects CRUD
  app.get('/api/admin/projects', requireAuth, (_req, res) => {
    res.json(db.getProjects(false));
  });

  app.post('/api/admin/projects', requireAuth, (req: AuthRequest, res) => {
    const saved = db.saveProject(req.body as Project, req.user?.username);
    res.status(201).json(saved);
  });

  app.put('/api/admin/projects/:id', requireAuth, (req: AuthRequest, res) => {
    const project = { ...req.body, id: req.params.id };
    const saved = db.saveProject(project as Project, req.user?.username);
    res.json(saved);
  });

  app.delete('/api/admin/projects/:id', requireAuth, (req: AuthRequest, res) => {
    const success = db.deleteProject(req.params.id, req.user?.username);
    res.json({ success });
  });

  // Services CRUD
  app.get('/api/admin/services', requireAuth, (_req, res) => {
    res.json(db.getServices(false));
  });

  app.post('/api/admin/services', requireAuth, (req: AuthRequest, res) => {
    const saved = db.saveService(req.body as Service, req.user?.username);
    res.status(201).json(saved);
  });

  app.put('/api/admin/services/:id', requireAuth, (req: AuthRequest, res) => {
    const service = { ...req.body, id: req.params.id };
    const saved = db.saveService(service as Service, req.user?.username);
    res.json(saved);
  });

  app.delete('/api/admin/services/:id', requireAuth, (req: AuthRequest, res) => {
    const success = db.deleteService(req.params.id, req.user?.username);
    res.json({ success });
  });

  // Skills CRUD
  app.get('/api/admin/skills', requireAuth, (_req, res) => {
    res.json(db.getSkills(false));
  });

  app.post('/api/admin/skills', requireAuth, (req: AuthRequest, res) => {
    const saved = db.saveSkill(req.body as Skill, req.user?.username);
    res.status(201).json(saved);
  });

  app.put('/api/admin/skills/:id', requireAuth, (req: AuthRequest, res) => {
    const skill = { ...req.body, id: req.params.id };
    const saved = db.saveSkill(skill as Skill, req.user?.username);
    res.json(saved);
  });

  app.delete('/api/admin/skills/:id', requireAuth, (req: AuthRequest, res) => {
    const success = db.deleteSkill(req.params.id, req.user?.username);
    res.json({ success });
  });

  // Testimonials CRUD
  app.get('/api/admin/testimonials', requireAuth, (_req, res) => {
    res.json(db.getTestimonials(false));
  });

  app.post('/api/admin/testimonials', requireAuth, (req: AuthRequest, res) => {
    const saved = db.saveTestimonial(req.body as Testimonial, req.user?.username);
    res.status(201).json(saved);
  });

  app.put('/api/admin/testimonials/:id', requireAuth, (req: AuthRequest, res) => {
    const testimonial = { ...req.body, id: req.params.id };
    const saved = db.saveTestimonial(testimonial as Testimonial, req.user?.username);
    res.json(saved);
  });

  app.delete('/api/admin/testimonials/:id', requireAuth, (req: AuthRequest, res) => {
    const success = db.deleteTestimonial(req.params.id, req.user?.username);
    res.json({ success });
  });

  // Inquiries
  app.get('/api/admin/inquiries', requireAuth, (_req, res) => {
    res.json(db.getInquiries());
  });

  app.patch('/api/admin/inquiries/:id/status', requireAuth, (req: AuthRequest, res) => {
    const { status } = req.body;
    const ok = db.updateInquiryStatus(req.params.id, status, req.user?.username);
    res.json({ success: ok });
  });

  app.delete('/api/admin/inquiries/:id', requireAuth, (req: AuthRequest, res) => {
    const ok = db.deleteInquiry(req.params.id, req.user?.username);
    res.json({ success: ok });
  });

  // Bookings
  app.get('/api/admin/bookings', requireAuth, (_req, res) => {
    res.json(db.getBookings());
  });

  app.patch('/api/admin/bookings/:id/status', requireAuth, (req: AuthRequest, res) => {
    const { status } = req.body;
    const ok = db.updateBookingStatus(req.params.id, status, req.user?.username);
    res.json({ success: ok });
  });

  app.delete('/api/admin/bookings/:id', requireAuth, (req: AuthRequest, res) => {
    const ok = db.deleteBooking(req.params.id, req.user?.username);
    res.json({ success: ok });
  });

  // Media Library
  app.get('/api/admin/media', requireAuth, (_req, res) => {
    res.json(db.getMedia());
  });

  app.post(
    '/api/admin/media/upload',
    requireAuth,
    upload.single('file'),
    (req: AuthRequest, res) => {
      if (!req.file) {
        return res.status(400).json({ error: 'No file received for upload.' });
      }

      const mediaAsset = db.addMedia(
        {
          id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          filename: req.file.filename,
          url: `/uploads/${req.file.filename}`,
          altText: (req.body.altText || req.file.originalname).trim(),
          caption: (req.body.caption || '').trim(),
          fileType: req.file.mimetype,
          fileSize: req.file.size,
          uploadedAt: new Date().toISOString(),
        },
        req.user?.username
      );

      res.status(201).json(mediaAsset);
    }
  );

  app.delete('/api/admin/media/:id', requireAuth, (req: AuthRequest, res) => {
    const success = db.deleteMedia(req.params.id, req.user?.username);
    res.json({ success });
  });

  // Audit Logs
  app.get('/api/admin/audit-logs', requireAuth, (_req, res) => {
    res.json(db.getAuditLogs());
  });

  // ==========================================
  // VITE / STATIC INTEGRATION
  // ==========================================

  if (IS_PROD) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Santosh Kumar Bheel Portfolio Server running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
