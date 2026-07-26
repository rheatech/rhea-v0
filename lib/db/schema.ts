import { pgTable, text, timestamp, boolean, serial, integer, numeric } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  isAdmin: boolean('isAdmin').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Add your app tables below. Always include a plain `userId` column so queries
// can be scoped per user — the security model depends on this column existing,
// not on a foreign key. Do NOT add a foreign key constraint
// (`.references(() => user.id, ...)`) unless the user explicitly asks for
// foreign keys or referential integrity; FK constraints make iterating on the
// schema harder.
//
// Example:
//
// import { serial } from "drizzle-orm/pg-core"
//
// export const todos = pgTable("todos", {
//   id: serial("id").primaryKey(),
//   userId: text("userId").notNull(),
//   title: text("title").notNull(),
//   completed: boolean("completed").notNull().default(false),
//   createdAt: timestamp("createdAt").notNull().defaultNow(),
// })
//
// If the user asks for foreign keys, add the reference back in:
//   userId: text("userId")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),

// --- Admin Analytics -------------------------------------------------------
export const pageAnalytics = pgTable('pageAnalytics', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  page: text('page').notNull(),
  views: integer('views').notNull().default(0),
  uniqueVisitors: integer('uniqueVisitors').notNull().default(0),
  avgTimeOnPage: numeric('avgTimeOnPage', { precision: 10, scale: 2 }).notNull().default('0'),
  bounceRate: numeric('bounceRate', { precision: 5, scale: 2 }).notNull().default('0'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const performanceMetrics = pgTable('performanceMetrics', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  page: text('page').notNull(),
  fcp: numeric('fcp', { precision: 10, scale: 2 }).notNull(),
  lcp: numeric('lcp', { precision: 10, scale: 2 }).notNull(),
  cls: numeric('cls', { precision: 5, scale: 3 }).notNull(),
  ttfb: numeric('ttfb', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const formSubmissions = pgTable('formSubmissions', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  formType: text('formType').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  message: text('message'),
  subject: text('subject'),
  status: text('status').notNull().default('new'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const clientData = pgTable('clientData', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  clientName: text('clientName').notNull(),
  clientType: text('clientType').notNull(),
  email: text('email').notNull(),
  website: text('website'),
  industry: text('industry'),
  projectName: text('projectName'),
  projectStatus: text('projectStatus').notNull().default('active'),
  budget: numeric('budget', { precision: 12, scale: 2 }),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- Advanced Analytics ---
export const siteVisits = pgTable('siteVisits', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  sessionId: text('sessionId').notNull(),
  deploymentUrl: text('deploymentUrl').notNull(),
  page: text('page').notNull(),
  referrer: text('referrer'),
  duration: integer('duration').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const deviceAnalytics = pgTable('deviceAnalytics', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  sessionId: text('sessionId').notNull(),
  deviceType: text('deviceType').notNull(),
  osName: text('osName').notNull(),
  osVersion: text('osVersion'),
  browserName: text('browserName').notNull(),
  browserVersion: text('browserVersion'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const locationAnalytics = pgTable('locationAnalytics', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  sessionId: text('sessionId').notNull(),
  country: text('country'),
  region: text('region'),
  city: text('city'),
  latitude: numeric('latitude', { precision: 10, scale: 6 }),
  longitude: numeric('longitude', { precision: 10, scale: 6 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const deploymentTracking = pgTable('deploymentTracking', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  deploymentUrl: text('deploymentUrl').notNull(),
  environment: text('environment').notNull(),
  visits: integer('visits').notNull().default(0),
  uniqueVisitors: integer('uniqueVisitors').notNull().default(0),
  lastSeen: timestamp('lastSeen').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const timeMetrics = pgTable('timeMetrics', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  sessionId: text('sessionId').notNull(),
  page: text('page').notNull(),
  timeSpent: integer('timeSpent').notNull().default(0),
  scrollDepth: numeric('scrollDepth', { precision: 5, scale: 2 }).notNull().default('0'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const utmTracking = pgTable('utmTracking', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  sessionId: text('sessionId').notNull(),
  source: text('source'),
  medium: text('medium'),
  campaign: text('campaign'),
  content: text('content'),
  term: text('term'),
  conversions: integer('conversions').notNull().default(0),
  revenue: numeric('revenue', { precision: 12, scale: 2 }).default('0'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
