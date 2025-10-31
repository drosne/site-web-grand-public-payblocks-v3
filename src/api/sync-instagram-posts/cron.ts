/**
 * Cron job pour synchroniser les posts Instagram automatiquement
 * 
 * Configuration dans Vercel :
 * - Path: /api/sync-instagram-posts
 * - Schedule: 0 */6 * * * (toutes les 6 heures)
 * 
 * Ou utiliser un service externe comme cron-job.org
 */

import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60 // 60 secondes max

export async function GET(request: NextRequest) {
  // Vérifier la clé secrète pour la sécurité
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || 'default-secret-change-me'

  if (authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rediriger vers POST
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/sync-instagram-posts`, {
    method: 'POST',
  })

  return response
}

