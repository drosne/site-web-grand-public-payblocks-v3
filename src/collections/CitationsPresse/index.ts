import type { CollectionConfig } from 'payload'

import {
  HeadingFeature,
  ParagraphFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'

const CitationsPresse: CollectionConfig = {
  slug: 'citationsPresse',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'organisation', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titre',
      required: true,
      admin: {
        description: 'Titre de la citation presse',
      },
    },
    {
      name: 'organisation',
      type: 'relationship',
      relationTo: 'organisations',
      label: 'Organisation',
      required: true,
      admin: {
        description: 'Organisation mentionnée dans cette citation presse',
      },
    },
    {
      name: 'extrait',
      type: 'richText',
      label: 'Extrait',
      localized: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          ParagraphFeature(),
        ],
      }),
      admin: {
        description: 'Extrait de la citation presse (au format HTML)',
      },
    },
    {
      name: 'logoMedia',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo média',
      admin: {
        description: 'Logo du média/journal',
      },
    },
    {
      name: 'link',
      type: 'text',
      label: 'Lien vers l\'article',
      admin: {
        description: 'URL de l\'article original',
      },
      validate: (val) => {
        if (val && val.length > 0) {
          try {
            new URL(val)
            return true
          } catch {
            return 'Veuillez entrer une URL valide'
          }
        }
        return true
      },
    },
    ...slugField('title'),
  ],
  timestamps: true,
}

export default CitationsPresse

