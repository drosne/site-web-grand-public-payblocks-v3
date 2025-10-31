import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Post, Category } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { DerniersArticles } from './Component'

interface DerniersArticlesBlock {
  tagline?: string
  title?: string
  subtitle?: string
  limit?: number
  categories?: (string | Category)[]
  buttonLink?: {
    type?: string
    url?: string
    label?: string
    newTab?: boolean
  }
  publicContext: PublicContextProps
}

/**
 * Fetch posts and render the DerniersArticles component
 */
export const DerniersArticlesBlockComponent: React.FC<DerniersArticlesBlock> = async (props) => {
  const {
    tagline,
    title = 'Derniers articles',
    subtitle,
    limit = 3,
    categories,
    buttonLink,
    publicContext,
  } = props

  // Fetch posts from Payload
  let posts: Post[] = []

  try {
    const payload = await getPayload({ config: configPromise })

    // Flatten categories for query
    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      return category
    })

    // Fetch posts
    const sortString = '-publishedAt'
    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 2, // Include categories and authors
      limit,
      sort: sortString,
      where: {
        ...(flattenedCategories && flattenedCategories.length > 0
          ? {
              categories: {
                in: flattenedCategories,
              },
            }
          : {}),
      },
    })

    posts = fetchedPosts.docs as Post[]
  } catch (error) {
    console.error('Error fetching posts:', error)
    posts = []
  }

  // Don't render if no posts
  if (posts.length === 0) {
    return null
  }

  // Format button URL and text
  const buttonText = buttonLink?.label || 'Voir tous les articles'
  const buttonUrl = buttonLink?.url || (publicContext.locale && publicContext.locale !== 'en' 
    ? `/${publicContext.locale}/posts` 
    : '/posts')

  return (
    <DerniersArticles
      tagline={tagline}
      title={title}
      subtitle={subtitle}
      buttonText={buttonText}
      buttonUrl={buttonUrl}
      posts={posts}
      publicContext={publicContext}
    />
  )
}

