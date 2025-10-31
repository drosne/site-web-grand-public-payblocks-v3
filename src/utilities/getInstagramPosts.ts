import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getCachedInstagramPosts(limit: number = 12) {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'instagram-posts',
      where: {
        isActive: {
          equals: true,
        },
      },
      sort: '-timestamp',
      limit,
    })

    return result.docs.map((post) => ({
      id: post.id,
      instagramId: post.instagramId,
      caption: post.caption || '',
      mediaType: post.mediaType || 'IMAGE',
      mediaUrl: post.mediaUrl || '',
      thumbnailUrl: post.thumbnailUrl || post.mediaUrl || '',
      permalink: post.permalink || '',
      timestamp: post.timestamp || new Date().toISOString(),
    }))
  } catch (error) {
    console.error('Error fetching Instagram posts:', error)
    return []
  }
}

