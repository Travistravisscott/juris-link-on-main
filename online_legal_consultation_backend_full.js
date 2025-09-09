// ================================
// File: backend/package.json
// ================================
{
  "name": "legal-backend",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "migrate": "knex migrate:latest",
    "migrate:rollback": "knex migrate:rollback",
    "seed": "knex seed:run"
  },
  "dependencies": {
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "express-rate-limit": "^6.7.0",
    "helmet": "^6.0.1",
    "jsonwebtoken": "^9.0.0",
    "knex": "^2.5.1",
    "pg": "^8.10.0",
    "socket.io": "^4.7.0",
    "uuid": "^9.0.0",
    "joi": "^17.9.2",
    "morgan": "^1.10.0",
    "nodemon": "^2.0.22"
  }
}

// ================================
// File: backend/knexfile.js
// ================================
require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: { directory: './migrations' },
    seeds: { directory: './seeds' }
  }
};

// ================================
// File: backend/.env.example
// ================================
// Copy to .env and fill values
DATABASE_URL=postgres://postgres:postgres@localhost:5432/legal_dev
JWT_SECRET=change_this_jwt_secret
JWT_REFRESH_SECRET=change_this_refresh_secret
FRONTEND_ORIGIN=http://localhost:5173
PORT=4000

// ================================
// File: backend/migrations/20250909_initial.js
// ================================
exports.up = async function(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.text('email').unique().notNullable();
    table.text('password_hash').notNullable();
    table.text('role').notNullable();
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('profiles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.text('full_name');
    table.text('phone');
    table.text('bio');
    table.text('location');
    table.text('avatar_url');
    table.integer('experience_years').defaultTo(0);
    table.decimal('rate_per_hour', 8, 2).defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('specialties', (table) => {
    table.increments('id').primary();
    table.text('name').unique().notNullable();
  });

  await knex.schema.createTable('lawyer_specialties', (table) => {
    table.increments('id').primary();
    table.uuid('lawyer_id').references('id').inTable('users').onDelete('CASCADE');
    table.integer('specialty_id').references('id').inTable('specialties').onDelete('CASCADE');
  });

  await knex.schema.createTable('appointments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('client_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('lawyer_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('scheduled_at').notNullable();
    table.integer('duration_mins').defaultTo(30);
    table.text('status').defaultTo('requested');
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('messages', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('appointment_id').references('id').inTable('appointments').onDelete('CASCADE');
    table.uuid('sender_id').references('id').inTable('users').onDelete('SET NULL');
    table.text('content').notNullable();
    table.timestamp('sent_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('reviews', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('appointment_id').references('id').inTable('appointments').onDelete('SET NULL');
    table.uuid('reviewer_id').references('id').inTable('users').onDelete('SET NULL');
    table.integer('rating');
    table.text('comment');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('audit_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL');
    table.text('action').notNullable();
    table.jsonb('meta');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('audit_logs');
  await knex.schema.dropTableIfExists('reviews');
  await knex.schema.dropTableIfExists('messages');
  await knex.schema.dropTableIfExists('appointments');
  await knex.schema.dropTableIfExists('lawyer_specialties');
  await knex.schema.dropTableIfExists('specialties');
  await knex.schema.dropTableIfExists('profiles');
  await knex.schema.dropTableIfExists('users');
};

// ================================
// File: backend/seeds/01_users.js
// ================================
const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  await knex('audit_logs').del();
  await knex('reviews').del();
  await knex('messages').del();
  await knex('appointments').del();
  await knex('lawyer_specialties').del();
  await knex('specialties').del();
  await knex('profiles').del();
  await knex('users').del();

  const hash = await bcrypt.hash('password123', 12);

  const [client] = await knex('users').insert({ email: 'client@example.com', password_hash: hash, role: 'client' }).returning(['id']);
  const [lawyer] = await knex('users').insert({ email: 'lawyer@example.com', password_hash: hash, role: 'lawyer' }).returning(['id']);

  await knex('profiles').insert([{ user_id: client.id, full_name: 'Test Client' }, { user_id: lawyer.id, full_name: 'Test Lawyer', location: 'Delhi', experience_years: 5, rate_per_hour: 50 }]);

  const [specId] = await knex('specialties').insert({ name: 'family law' }).returning('id');
  await knex('lawyer_specialties').insert({ lawyer_id: lawyer.id, specialty_id: specId });
};

// ================================
// File: backend/src/db.js
// ================================
const knex = require('knex');
const config = require('../knexfile');
const env = process.env.NODE_ENV || 'development';
module.exports = knex(config[env]);

// ================================
// File: backend/src/index.js
// ================================
require('dotenv').config();
const http = require('http');
const app = require('./app');
const { setupSocket } = require('./services/socket');
const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
setupSocket(server);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// ================================
// File: backend/src/app.js
// ================================
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const appointmentRoutes = require('./routes/appointments');

const app = express();
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));

app.use(rateLimit({ windowMs: 60 * 1000, max: 200 }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;

// ================================
// File: backend/src/services/socket.js
// ================================
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const db = require('../db');

function setupSocket(server) {
  const io = new Server(server, { cors: { origin: process.env.FRONTEND_ORIGIN || '*' } });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Auth error'));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = payload;
      next();
    } catch (err) {
      next(new Error('Auth error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('socket connected', socket.user.id);

    socket.on('joinAppointment', (appointmentId) => {
      socket.join(appointmentId);
    });

    socket.on('sendMessage', async ({ appointmentId, content }) => {
      try {
        await db('messages').insert({ appointment_id: appointmentId, sender_id: socket.user.id, content });
        const msg = { appointment_id: appointmentId, sender_id: socket.user.id, content, sent_at: new Date() };
        io.to(appointmentId).emit('newMessage', msg);
      } catch (err) {
        console.error('socket message error', err);
      }
    });

    socket.on('disconnect', () => {});
  });
}

module.exports = { setupSocket };

// ================================
// File: backend/src/middlewares/auth.js
// ================================
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ================================
// File: backend/src/routes/auth.js
// ================================
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);

module.exports = router;

// ================================
// File: backend/src/controllers/authController.js
// ================================
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_EXPIRES = '15m';
const REFRESH_EXPIRES = '7d';

module.exports = {
  register: async (req, res, next) => {
    try {
      const { email, password, role } = req.body;
      if (!email || !password || !role) return res.status(400).json({ error: 'Missing fields' });
      const existing = await db('users').where({ email }).first();
      if (existing) return res.status(409).json({ error: 'Email exists' });
      const hash = await bcrypt.hash(password, 12);
      const [user] = await db('users').insert({ email, password_hash: hash, role }).returning(['id','email','role']);
      await db('profiles').insert({ user_id: user.id, full_name: '' });
      res.json({ user });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await db('users').where({ email }).first();
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES });
      const refresh = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
      // NOTE: store refresh hashed in DB if implementing full refresh token rotation
      res.json({ token, refresh });
    } catch (err) {
      next(err);
    }
  },

  refresh: async (req, res, next) => {
    try {
      const { refresh } = req.body;
      if (!refresh) return res.status(400).json({ error: 'Missing refresh token' });
      const payload = jwt.verify(refresh, process.env.JWT_REFRESH_SECRET);
      const user = await db('users').where({ id: payload.id }).first();
      if (!user) return res.status(401).json({ error: 'Invalid refresh' });
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES });
      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
};

// ================================
// File: backend/src/routes/users.js
// ================================
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const UserController = require('../controllers/userController');

router.get('/me', auth, UserController.me);
router.get('/lawyers', UserController.searchLawyers);
router.get('/:id', UserController.getById);
router.put('/me', auth, UserController.updateProfile);

module.exports = router;

// ================================
// File: backend/src/controllers/userController.js
// ================================
const db = require('../db');

module.exports = {
  me: async (req, res, next) => {
    try {
      const user = await db('users').where({ id: req.user.id }).first();
      const profile = await db('profiles').where({ user_id: req.user.id }).first();
      res.json({ user, profile });
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = await db('users').where({ id }).first();
      const profile = await db('profiles').where({ user_id: id }).first();
      res.json({ user, profile });
    } catch (err) { next(err); }
  },

  updateProfile: async (req, res, next) => {
    try {
      const updates = req.body;
      updates.updated_at = new Date();
      await db('profiles').where({ user_id: req.user.id }).update(updates);
      const profile = await db('profiles').where({ user_id: req.user.id }).first();
      res.json({ profile });
    } catch (err) { next(err); }
  },

  searchLawyers: async (req, res, next) => {
    try {
      const { specialty, location, limit = 10, page = 1 } = req.query;
      const qb = db('users').select('users.id','profiles.full_name','profiles.location','profiles.experience_years','profiles.rate_per_hour')
        .join('profiles','profiles.user_id','users.id')
        .where('users.role','lawyer');

      if (location) qb.andWhere('profiles.location','ilike', `%${location}%`);
      if (specialty) qb.join('lawyer_specialties','lawyer_specialties.lawyer_id','users.id')
        .join('specialties','specialties.id','lawyer_specialties.specialty_id')
        .andWhere('specialties.name','ilike', `%${specialty}%`);

      qb.limit(limit).offset((page-1)*limit);
      const rows = await qb;
      res.json({ data: rows });
    } catch (err) { next(err); }
  }
};

// ================================
// File: backend/src/routes/appointments.js
// ================================
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const AppointmentController = require('../controllers/appointmentController');

router.post('/', auth, AppointmentController.requestAppointment);
router.get('/:id/messages', auth, AppointmentController.getMessages);
router.get('/my/upcoming', auth, AppointmentController.myUpcoming);
router.post('/:id/cancel', auth, AppointmentController.cancelAppointment);

module.exports = router;

// ================================
// File: backend/src/controllers/appointmentController.js
// ================================
const db = require('../db');

module.exports = {
  requestAppointment: async (req, res, next) => {
    try {
      const { lawyer_id, scheduled_at, duration_mins = 30, notes } = req.body;
      if (!lawyer_id || !scheduled_at) return res.status(400).json({ error: 'Missing fields' });
      // simple overlap check
      const start = new Date(scheduled_at);
      const end = new Date(start.getTime() + duration_mins * 60000);

      const overlapping = await db('appointments')
        .where('lawyer_id', lawyer_id)
        .andWhere('status', 'confirmed')
        .andWhere(function() {
          this.whereBetween('scheduled_at', [start, end]);
        })
        .first();

      if (overlapping) return res.status(409).json({ error: 'Slot taken' });

      const [appt] = await db('appointments').insert({ client_id: req.user.id, lawyer_id, scheduled_at: start, duration_mins, notes }).returning('*');
      res.json({ appointment: appt });
    } catch (err) { next(err); }
  },

  getMessages: async (req, res, next) => {
    try {
      const apptId = req.params.id;
      const msgs = await db('messages').where({ appointment_id: apptId }).orderBy('sent_at', 'asc');
      res.json({ messages: msgs });
    } catch (err) { next(err); }
  },

  myUpcoming: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const asClient = await db('appointments').where({ client_id: userId }).andWhere('scheduled_at', '>', new Date()).orderBy('scheduled_at', 'asc').limit(20);
      const asLawyer = await db('appointments').where({ lawyer_id: userId }).andWhere('scheduled_at', '>', new Date()).orderBy('scheduled_at', 'asc').limit(20);
      res.json({ asClient, asLawyer });
    } catch (err) { next(err); }
  },

  cancelAppointment: async (req, res, next) => {
    try {
      const id = req.params.id;
      const appt = await db('appointments').where({ id }).first();
      if (!appt) return res.status(404).json({ error: 'Not found' });
      if (appt.client_id !== req.user.id && appt.lawyer_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
      await db('appointments').where({ id }).update({ status: 'cancelled', updated_at: new Date() });
      res.json({ ok: true });
    } catch (err) { next(err); }
  }
};

// ================================
// File: backend/README.md
// ================================
// Quick-start
// 1. copy .env.example -> .env and set DATABASE_URL and secrets
// 2. npm install
// 3. npx knex migrate:latest
// 4. npm run seed
// 5. npm run dev

// Notes: This backend is a complete baseline. For production: store refresh tokens securely, use HTTPS, set stricter CORS, add request sanitization, implement RBAC, and add monitoring/logging.
