import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  try {
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    
    // 测试数据库连接
    const { data: tables, error } = await supabase
      .from('course_modules')
      .select('count')
      .limit(1);

    const result = {
      status: error ? 'error' : 'ok',
      supabaseUrl: supabaseUrl || 'NOT_SET',
      supabaseKeyExists: !!supabaseKey,
      databaseError: error ? {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      } : null,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(result, null, 2), {
      status: error ? 500 : 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, null, 2), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

