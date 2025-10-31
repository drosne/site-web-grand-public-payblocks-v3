import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

export const InstagramPosts: CollectionConfig = {
  slug: 'instagram-posts',
  labels: {
    singular: 'Post Instagram',
    plural: 'Posts Instagram',
  },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    defaultColumns: ['caption', 'instagramId', 'timestamp', 'updatedAt'],
    useAsTitle: 'caption',
    description: 'Posts Instagram synchronisés depuis le compte @justice.cool_officiel',
  },
  fields: [
    {
      name: 'instagramId',
      type: 'text',
      required: true,
      admin: {
        description: 'ID unique du post Instagram',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      admin: {
        description: 'Légende du post Instagram',
      },
    },
    {
      name: 'mediaType',
      type: 'select',
      options: [
        { label: 'Image', value: 'IMAGE' },
        { label: 'Video', value: 'VIDEO' },
        { label: 'Carousel', value: 'CAROUSEL_ALBUM' },
      ],
      required: true,
    },
    {
      name: 'mediaUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'URL de l\'image/vidéo du post',
      },
    },
    {
      name: 'thumbnailUrl',
      type: 'text',
      admin: {
        description: 'URL de la miniature (pour les vidéos)',
      },
    },
    {
      name: 'permalink',
      type: 'text',
      required: true,
      admin: {
        description: 'Lien permanent vers le post Instagram',
      },
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      admin: {
        description: 'Date de publication du post',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Afficher ce post dans la galerie',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Ordre d\'affichage (plus petit = affiché en premier)',
      },
    },
  ],
  indexes: [
    {
      fields: ['instagramId'],
      unique: true,
    },
    {
      fields: ['timestamp'],
    },
    {
      fields: ['isActive', 'order'],
    },
  ],
}

