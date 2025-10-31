'use client'

import { ArrowRight } from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Post, Category } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'
import RichText from '@/components/RichText'
import { extractPlainText } from '@/utilities/richtext'

interface DerniersArticlesProps {
  title?: string
  subtitle?: string
  tagline?: string
  buttonText?: string
  buttonUrl?: string
  posts: Post[]
  publicContext: PublicContextProps
  limit?: number
}

/**
 * Format date for display
 */
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
  return date.toLocaleDateString('fr-FR', options)
}

/**
 * Get category name for badge
 */
function getCategoryName(category: Category | string | null | undefined): string {
  if (!category) return ''
  if (typeof category === 'string') return category
  return category.title || ''
}

const DerniersArticles: React.FC<DerniersArticlesProps> = ({
  title,
  subtitle,
  tagline,
  buttonText = 'Voir tous les articles',
  buttonUrl,
  posts = [],
  publicContext,
}) => {
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="mx-auto max-w-3xl text-center">
          {tagline && (
            <Badge variant="secondary" className="mb-6">
              {tagline}
            </Badge>
          )}
          {title && (
            <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-5xl lg:mb-6">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-muted-foreground mb-12 md:text-base lg:text-lg">
              {subtitle}
            </p>
          )}
        </div>

        <div className="mx-auto max-w-5xl space-y-12">
          {posts.map((post) => {
            // Generate post URL - use slug directly for now (can be improved with generatePreviewPath)
            const localePrefix = publicContext.locale && publicContext.locale !== 'en' ? `/${publicContext.locale}` : ''
            const postUrl = post.slug 
              ? `${localePrefix}/posts/${post.slug}`
              : '#'
            
            const category = post.categories?.[0]
            const author = post.authors?.[0]
            
            return (
              <Card
                key={post.id}
                className="overflow-hidden border-0 bg-transparent shadow-none"
              >
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="shrink-0">
                    <CMSLink
                      url={postUrl}
                      className="block transition-opacity duration-200 hover:opacity-90"
                    >
                      {(post.meta?.image && typeof post.meta.image === 'object') || 
                       (post.bannerImage && typeof post.bannerImage === 'object') ? (
                        <Media
                          resource={(post.meta?.image && typeof post.meta.image === 'object') 
                            ? post.meta.image 
                            : post.bannerImage}
                          className="aspect-16/9 w-full rounded-lg object-cover object-center sm:w-[260px]"
                          imgClassName="aspect-16/9 w-full rounded-lg object-cover object-center sm:w-[260px]"
                        />
                      ) : (
                        <img
                          src="https://via.placeholder.com/260x146"
                          alt={post.title || 'Article'}
                          className="aspect-16/9 w-full rounded-lg object-cover object-center sm:w-[260px]"
                        />
                      )}
                    </CMSLink>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      {category && (
                        <Badge variant="secondary">
                          {getCategoryName(category)}
                        </Badge>
                      )}
                      {author && typeof author === 'object' && author.name && (
                        <span>{author.name}</span>
                      )}
                      {post.publishedAt && (
                        <span>{formatDate(post.publishedAt)}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold leading-tight lg:text-2xl">
                      <CMSLink
                        url={postUrl}
                        className="hover:underline"
                      >
                        {post.title}
                      </CMSLink>
                    </h3>
                    {post.excerpt ? (
                      <p className="text-muted-foreground text-base">
                        {post.excerpt}
                      </p>
                    ) : post.content ? (
                      <p className="text-muted-foreground text-base line-clamp-2">
                        {extractPlainText(post.content).substring(0, 200)}
                        {extractPlainText(post.content).length > 200 ? '...' : ''}
                      </p>
                    ) : null}
                    <CMSLink
                      url={postUrl}
                      className="text-primary inline-flex items-center hover:underline"
                    >
                      Lire la suite
                      <ArrowRight className="ml-2 size-4" />
                    </CMSLink>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {buttonUrl && (
          <div className="mt-16 text-center">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              asChild
            >
              <CMSLink url={buttonUrl}>
                {buttonText}
                <ArrowRight className="ml-2 size-4" />
              </CMSLink>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

export { DerniersArticles }

