import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config })

    // Récupérer les credentials Instagram depuis les variables d'environnement
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    const userId = process.env.INSTAGRAM_USER_ID

    if (!accessToken || !userId) {
      return Response.json(
        {
          error: 'Instagram credentials not configured',
          message:
            'Please set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID in your .env.local file',
        },
        { status: 400 },
      )
    }

    // Récupérer les posts Instagram via l'API
    const response = await fetch(
      `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}&limit=12`,
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return Response.json(
        {
          error: 'Failed to fetch Instagram posts',
          details: errorData,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    const posts = data.data || []

    // Synchroniser les posts avec la base de données
    let created = 0
    let updated = 0

    for (const post of posts) {
      try {
        // Chercher si le post existe déjà
        const existingPost = await payload.find({
          collection: 'instagram-posts',
          where: {
            instagramId: {
              equals: post.id,
            },
          },
          limit: 1,
        })

        const postData = {
          instagramId: post.id,
          caption: post.caption || '',
          mediaType: post.media_type || 'IMAGE',
          mediaUrl: post.media_url || post.thumbnail_url || '',
          thumbnailUrl: post.thumbnail_url || post.media_url || '',
          permalink: post.permalink || '',
          timestamp: new Date(post.timestamp).toISOString(),
          isActive: true,
          order: 0,
        }

        if (existingPost.docs.length > 0) {
          // Mettre à jour le post existant
          await payload.update({
            collection: 'instagram-posts',
            id: existingPost.docs[0].id,
            data: postData,
          })
          updated++
        } else {
          // Créer un nouveau post
          await payload.create({
            collection: 'instagram-posts',
            data: postData,
          })
          created++
        }
      } catch (error) {
        console.error(`Error syncing post ${post.id}:`, error)
      }
    }

    return Response.json({
      success: true,
      message: `Instagram posts synchronized successfully`,
      created,
      updated,
      total: posts.length,
    })
  } catch (error) {
    console.error('Error syncing Instagram posts:', error)
    return Response.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

// GET endpoint pour déclencher la synchronisation manuellement
export async function GET() {
  try {
    const payload = await getPayload({ config })

    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    const userId = process.env.INSTAGRAM_USER_ID

    if (!accessToken || !userId) {
      return Response.json(
        {
          error: 'Instagram credentials not configured',
          message:
            'Please set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID in your .env.local file',
        },
        { status: 400 },
      )
    }

    // Appeler POST pour synchroniser
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/sync-instagram-posts`, {
      method: 'POST',
    })

    return response
  } catch (error) {
    return Response.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

