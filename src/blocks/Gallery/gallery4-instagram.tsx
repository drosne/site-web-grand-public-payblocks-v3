'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import type { CarouselApi } from '@/components/ui/carousel'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { GalleryBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'

interface InstagramPost {
  id: string
  instagramId: string
  caption?: string
  mediaType: string
  mediaUrl: string
  thumbnailUrl?: string
  permalink: string
  timestamp: string
}

const Gallery4Instagram: React.FC<
  GalleryBlock & {
    publicContext: PublicContextProps
    instagramPosts: InstagramPost[]
  }
> = ({ richText, publicContext, instagramPosts }) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!carouselApi) {
      return
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
      setCurrentSlide(carouselApi.selectedScrollSnap())
    }
    updateSelection()
    carouselApi.on('select', updateSelection)
    return () => {
      carouselApi.off('select', updateSelection)
    }
  }, [carouselApi])

  if (!instagramPosts || instagramPosts.length === 0) {
    // Si pas de posts Instagram, ne rien afficher plutôt que de causer une erreur d'hydratation
    return null
  }

  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
          {richText && (
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-medium md:text-4xl lg:text-5xl lg:mb-6 md:mb-4">
                Derniers posts Instagram
              </h2>
              <p className="text-muted-foreground max-w-lg">
                Découvrez nos dernières publications sur Instagram
              </p>
            </div>
          )}
          <div className="hidden shrink-0 gap-2 md:flex">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollPrev()
              }}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollNext()
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              '(max-width: 768px)': {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
            {instagramPosts.map((post) => (
              <CarouselItem key={post.id} className="max-w-[320px] pl-[20px] lg:max-w-[360px]">
                <a
                  href={post.permalink}
                  className="group rounded-xl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl md:aspect-5/4 lg:aspect-16/9">
                    <img
                      src={post.mediaUrl}
                      alt={post.caption || 'Post Instagram'}
                      className="absolute size-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 h-full bg-[linear-gradient(transparent_20%,var(--primary)_100%)] mix-blend-multiply" />
                    <div className="text-primary-foreground absolute inset-x-0 bottom-0 flex flex-col items-start p-6 md:p-8">
                      {post.caption && (
                        <div className="mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4">
                          <p className="line-clamp-2">{post.caption}</p>
                        </div>
                      )}
                      <div className="flex items-center text-sm mt-4">
                        Voir sur Instagram{' '}
                        <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {instagramPosts.length > 0 && (
          <div className="mt-8 flex justify-center gap-2">
            {instagramPosts.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-primary' : 'bg-primary/20'
                }`}
                onClick={() => carouselApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Gallery4Instagram

