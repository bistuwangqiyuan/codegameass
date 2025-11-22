import type { APIRoute } from 'astro';
import { seedSampleData } from '../../lib/utils/seed-data';

export const POST: APIRoute = async () => {
  try {
    await seedSampleData();
    
    return new Response(
      JSON.stringify({ success: true, message: 'Sample data seeded successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error seeding data:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to seed data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

