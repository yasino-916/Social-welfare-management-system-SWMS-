import db from '../../config/database';
import { UserRole } from '../../types/enums';

type Actor = { id: string; role: UserRole; kebele_id?: string };

function scopeToKebele(query: ReturnType<typeof db>, actor: Actor, kebeleField = 'kebele_id') {
  if (actor.role !== UserRole.SUPER_ADMIN && actor.kebele_id) {
    query.where(kebeleField, actor.kebele_id);
  }
}

// SRS §19.1 / §19.2 — Wereda or Kebele dashboard summary
export async function getDashboard(actor: Actor) {
  const hQuery = db('households').count('* as total');
  const aQuery = db('applications').count('* as total');
  const bQuery = db('applications').where('status', 'ACTIVE_BENEFICIARY').count('* as total');
  const cQuery = db('complaints').whereNotIn('status', ['RESOLVED', 'CLOSED']).count('* as open');

  if (actor.role !== UserRole.SUPER_ADMIN && actor.kebele_id) {
    hQuery.where('kebele_id', actor.kebele_id);
    aQuery.join('households', 'applications.household_id', 'households.id').where('households.kebele_id', actor.kebele_id);
    bQuery.join('households', 'applications.household_id', 'households.id').where('households.kebele_id', actor.kebele_id);
    cQuery.where('kebele_id', actor.kebele_id);
  }

  const [households, applications, beneficiaries, openComplaints] = await Promise.all([
    hQuery.first(), aQuery.first(), bQuery.first(), cQuery.first(),
  ]);

  return { households, applications, beneficiaries, open_complaints: openComplaints };
}

// SRS §19.3 — People by age range
export async function getPersonsByAgeRange(filters: Record<string, unknown>, actor: Actor) {
  const ranges = [
    { label: '0-5', min: 0, max: 5 },
    { label: '6-12', min: 6, max: 12 },
    { label: '13-17', min: 13, max: 17 },
    { label: '18-24', min: 18, max: 24 },
    { label: '25-34', min: 25, max: 34 },
    { label: '35-44', min: 35, max: 44 },
    { label: '45-54', min: 45, max: 54 },
    { label: '55-64', min: 55, max: 64 },
    { label: '65+', min: 65, max: 200 },
  ];

  const results = await Promise.all(
    ranges.map(async (r) => {
      const count = await db('persons')
        .whereRaw(`EXTRACT(YEAR FROM AGE(date_of_birth)) BETWEEN ? AND ?`, [r.min, r.max])
        .count('* as count')
        .first();
      return { range: r.label, count: Number(count?.count || 0) };
    })
  );

  return results;
}

export async function getHouseholdReport(filters: Record<string, unknown>, actor: Actor) {
  const query = db('households as h')
    .join('kebeles as k', 'h.kebele_id', 'k.id')
    .select('k.name as kebele', db.raw('COUNT(*) as count'))
    .groupBy('k.name')
    .orderBy('k.name');
  scopeToKebele(query, actor, 'h.kebele_id');
  return query;
}

export async function getApplicationsByStatus(filters: Record<string, unknown>, actor: Actor) {
  const query = db('applications').select('status', db.raw('COUNT(*) as count')).groupBy('status');
  if (actor.role !== UserRole.SUPER_ADMIN && actor.kebele_id) {
    query.join('households', 'applications.household_id', 'households.id').where('households.kebele_id', actor.kebele_id);
  }
  return query;
}

export async function getSupportReport(filters: Record<string, unknown>, actor: Actor) {
  const query = db('support_distributions as sd')
    .join('support_programs as sp', 'sd.support_program_id', 'sp.id')
    .select('sp.name as program', 'sp.support_type', db.raw('COUNT(*) as distributions'), db.raw('SUM(sd.amount) as total_amount'))
    .groupBy('sp.name', 'sp.support_type');
  return query;
}

export async function getComplaintStats(filters: Record<string, unknown>, actor: Actor) {
  const query = db('complaints').select('status', 'priority', db.raw('COUNT(*) as count')).groupBy('status', 'priority');
  if (actor.role !== UserRole.SUPER_ADMIN && actor.kebele_id) {
    query.where('kebele_id', actor.kebele_id);
  }
  return query;
}

export async function exportReport(type: string, filters: Record<string, unknown>, actor: Actor) {
  // Placeholder — integrate pdfkit/exceljs in implementation phase
  const data = JSON.stringify({ type, generated_at: new Date(), filters });
  return {
    buffer: Buffer.from(data),
    contentType: 'application/json',
    filename: `report-${type}-${Date.now()}.json`,
  };
}
