import type { APIRoute } from 'astro';
import { getSql } from '../../../../lib/db';
import { jsonResponse, parseJsonBody, getUserIdFromRequest } from '../../../../lib/api-utils';

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return jsonResponse({ success: false, error: '请先登录' }, 401);
    }

    const challengeId = params.id;
    if (!challengeId) {
      return jsonResponse({ success: false, error: '缺少挑战 ID' }, 400);
    }

    const body = await parseJsonBody<{
      action: 'save' | 'complete' | 'spend_hint';
      html?: string;
      css?: string;
      js?: string;
      completion_time_seconds?: number;
      hints_used?: number;
      xp_reward?: number;
      coin_reward?: number;
      coin_amount?: number;
    }>(request);

    const sql = getSql();

    if (body.action === 'save') {
      await sql`
        INSERT INTO user_challenge_progress (
          user_id, challenge_id, last_saved_html, last_saved_css, last_saved_js, last_accessed_at
        ) VALUES (
          ${userId}::uuid, ${challengeId}::uuid,
          ${body.html ?? ''}, ${body.css ?? ''}, ${body.js ?? ''},
          NOW()
        )
        ON CONFLICT (user_id, challenge_id) DO UPDATE SET
          last_saved_html = EXCLUDED.last_saved_html,
          last_saved_css = EXCLUDED.last_saved_css,
          last_saved_js = EXCLUDED.last_saved_js,
          last_accessed_at = NOW()
      `;
      return jsonResponse({ success: true });
    }

    if (body.action === 'complete') {
      await sql`
        INSERT INTO user_challenge_progress (
          user_id, challenge_id, status, completion_time_seconds, hints_used, completed_at, last_accessed_at
        ) VALUES (
          ${userId}::uuid, ${challengeId}::uuid, 'completed',
          ${body.completion_time_seconds ?? 0}, ${body.hints_used ?? 0}, NOW(), NOW()
        )
        ON CONFLICT (user_id, challenge_id) DO UPDATE SET
          status = 'completed',
          completion_time_seconds = EXCLUDED.completion_time_seconds,
          hints_used = EXCLUDED.hints_used,
          completed_at = NOW(),
          last_accessed_at = NOW()
      `;

      if (body.xp_reward) {
        await sql`
          INSERT INTO xp_transactions (user_id, amount, reason, source_type, source_id)
          VALUES (
            ${userId}::uuid, ${body.xp_reward},
            '完成挑战', 'challenge', ${challengeId}::uuid
          )
        `;
        await sql`
          UPDATE user_profiles SET
            experience_points = experience_points + ${body.xp_reward},
            total_challenges_completed = total_challenges_completed + 1
          WHERE id = ${userId}::uuid
        `;
      }

      if (body.coin_reward) {
        await sql`
          INSERT INTO coin_transactions (user_id, amount, transaction_type, reason, source_type, source_id)
          VALUES (
            ${userId}::uuid, ${body.coin_reward}, 'earn',
            '完成挑战', 'challenge', ${challengeId}::uuid
          )
        `;
        await sql`
          UPDATE user_profiles SET coins = coins + ${body.coin_reward}
          WHERE id = ${userId}::uuid
        `;
      }

      return jsonResponse({ success: true });
    }

    if (body.action === 'spend_hint') {
      const amount = body.coin_amount ?? 5;
      await sql`
        INSERT INTO coin_transactions (user_id, amount, transaction_type, reason, source_type, source_id)
        VALUES (
          ${userId}::uuid, ${-amount}, 'spend',
          '获取提示', 'hint', ${challengeId}::uuid
        )
      `;
      await sql`
        UPDATE user_profiles SET coins = GREATEST(0, coins - ${amount})
        WHERE id = ${userId}::uuid
      `;
      return jsonResponse({ success: true });
    }

    return jsonResponse({ success: false, error: '未知操作' }, 400);
  } catch (error) {
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : '保存进度失败' },
      500
    );
  }
};
