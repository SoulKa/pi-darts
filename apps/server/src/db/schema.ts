// Drizzle table definitions for typed queries, plus the idempotent init SQL that
// creates them on first boot. Keeping both here (next to each other) makes drift
// obvious; no migration-generation step is needed to start the server.
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type {
  BracketSlot,
  MatchStatus,
  OutMode,
  StageFormat,
  StageType,
  TournamentStatus,
} from '@pi-darts/shared'

export const tournaments = sqliteTable('tournaments', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  status: text('status').$type<TournamentStatus>().notNull().default('setup'),
  createdAt: text('created_at').notNull(),
})

export const participants = sqliteTable('participants', {
  id: text('id').primaryKey(),
  tournamentId: text('tournament_id').notNull(),
  name: text('name').notNull(),
  seed: integer('seed'),
})

export const stages = sqliteTable('stages', {
  id: text('id').primaryKey(),
  tournamentId: text('tournament_id').notNull(),
  name: text('name').notNull(),
  type: text('type').$type<StageType>().notNull(),
  format: text('format').$type<StageFormat>().notNull(),
  order: integer('order').notNull(),
  bestOf: integer('best_of').notNull(),
  startScore: integer('start_score').notNull(),
  outMode: text('out_mode').$type<OutMode>().notNull(),
})

export const groups = sqliteTable('groups', {
  id: text('id').primaryKey(),
  stageId: text('stage_id').notNull(),
  name: text('name').notNull(),
})

export const groupMembers = sqliteTable('group_members', {
  groupId: text('group_id').notNull(),
  participantId: text('participant_id').notNull(),
})

export const matches = sqliteTable('matches', {
  id: text('id').primaryKey(),
  tournamentId: text('tournament_id').notNull(),
  stageId: text('stage_id').notNull(),
  groupId: text('group_id'),
  round: integer('round').notNull(),
  slot: integer('slot').notNull(),
  participantAId: text('participant_a_id'),
  participantBId: text('participant_b_id'),
  bestOf: integer('best_of').notNull(),
  startScore: integer('start_score').notNull(),
  outMode: text('out_mode').$type<OutMode>().notNull(),
  status: text('status').$type<MatchStatus>().notNull().default('pending'),
  legsA: integer('legs_a').notNull().default(0),
  legsB: integer('legs_b').notNull().default(0),
  winnerId: text('winner_id'),
  nextMatchId: text('next_match_id'),
  nextSlot: text('next_slot').$type<BracketSlot>(),
})

export const legs = sqliteTable('legs', {
  id: text('id').primaryKey(),
  matchId: text('match_id').notNull(),
  index: integer('index').notNull(),
  startScore: integer('start_score').notNull(),
  outMode: text('out_mode').$type<OutMode>().notNull(),
  winnerId: text('winner_id'),
})

export const throws = sqliteTable('throws', {
  id: text('id').primaryKey(),
  legId: text('leg_id').notNull(),
  participantId: text('participant_id').notNull(),
  dartIndex: integer('dart_index').notNull(),
  base: integer('base').notNull(),
  multiplier: integer('multiplier').notNull(),
  points: integer('points').notNull(),
})

/** Executed once on startup; CREATE ... IF NOT EXISTS makes it safe to re-run. */
export const INIT_SQL = `
CREATE TABLE IF NOT EXISTS tournaments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'setup',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS participants (
  id TEXT PRIMARY KEY,
  tournament_id TEXT NOT NULL,
  name TEXT NOT NULL,
  seed INTEGER
);
CREATE TABLE IF NOT EXISTS stages (
  id TEXT PRIMARY KEY,
  tournament_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  format TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  best_of INTEGER NOT NULL,
  start_score INTEGER NOT NULL,
  out_mode TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  stage_id TEXT NOT NULL,
  name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS group_members (
  group_id TEXT NOT NULL,
  participant_id TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  tournament_id TEXT NOT NULL,
  stage_id TEXT NOT NULL,
  group_id TEXT,
  round INTEGER NOT NULL,
  slot INTEGER NOT NULL,
  participant_a_id TEXT,
  participant_b_id TEXT,
  best_of INTEGER NOT NULL,
  start_score INTEGER NOT NULL,
  out_mode TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  legs_a INTEGER NOT NULL DEFAULT 0,
  legs_b INTEGER NOT NULL DEFAULT 0,
  winner_id TEXT,
  next_match_id TEXT,
  next_slot TEXT
);
CREATE TABLE IF NOT EXISTS legs (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  "index" INTEGER NOT NULL,
  start_score INTEGER NOT NULL,
  out_mode TEXT NOT NULL,
  winner_id TEXT
);
CREATE TABLE IF NOT EXISTS throws (
  id TEXT PRIMARY KEY,
  leg_id TEXT NOT NULL,
  participant_id TEXT NOT NULL,
  dart_index INTEGER NOT NULL,
  base INTEGER NOT NULL,
  multiplier INTEGER NOT NULL,
  points INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_participants_tournament ON participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_stages_tournament ON stages(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_stage ON matches(stage_id);
CREATE INDEX IF NOT EXISTS idx_legs_match ON legs(match_id);
CREATE INDEX IF NOT EXISTS idx_throws_leg ON throws(leg_id);
`
