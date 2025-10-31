import type { CollectionAfterReadHook, CollectionConfig } from 'payload'

import {
  HeadingFeature,
  ParagraphFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'

// Hook pour peupler automatiquement les articles associés à une offre
const populateArticles: CollectionAfterReadHook = async ({
  doc,
  req,
}) => {
  if (!doc.id) {
    return doc
  }

  try {
    // Chercher tous les articles (posts) qui ont cette offre dans leur champ 'offre'
    const articles = await req.payload.find({
      collection: 'posts',
      where: {
        offre: {
          equals: doc.id,
        },
      },
      limit: 1000, // Limite pour éviter les problèmes de performance
      depth: 1,
    })

    // Populer le champ articles avec les IDs des articles trouvés
    if (articles && 'docs' in articles) {
      doc.articles = articles.docs.map((article) => article.id)
    }
  } catch (error) {
    console.error('Error populating articles for offre:', error)
  }

  return doc
}

const Offres: CollectionConfig = {
  slug: 'offres',
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
      label: 'Titre de l\'offre',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Général',
          fields: [
            {
              name: 'organisation',
              type: 'relationship',
              relationTo: 'organisations',
              label: 'Organisation',
              required: true,
              admin: {
                description: 'Organisation à laquelle cette offre appartient',
              },
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'Tagline / Phrase d\'accroche',
              admin: {
                description: 'Phrase d\'accroche pour cette offre',
              },
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Description',
              localized: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  ParagraphFeature(),
                ],
              }),
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Image de l\'offre',
              admin: {
                description: 'Image principale de l\'offre',
              },
            },
            {
              name: 'tarification',
              type: 'richText',
              label: 'Tarification',
              localized: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  ParagraphFeature(),
                ],
              }),
              admin: {
                description: 'Tarification de l\'offre (au format HTML)',
              },
            },
            {
              name: 'formulaireLink',
              type: 'text',
              label: 'Lien vers le formulaire',
              admin: {
                description: 'Lien vers le formulaire depuis l\'application Justice.cool',
              },
            },
          ],
        },
        {
          label: 'Relations',
          fields: [
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              label: 'Catégories',
              admin: {
                description: 'Catégories associées à cette offre',
              },
            },
            {
              name: 'articles',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              label: 'Articles associés',
              admin: {
                description: 'Articles liés à cette offre (rempli automatiquement via post.offre)',
                readOnly: true,
              },
            },
          ],
        },
      ],
    },
    ...slugField('title'),
  ],
  hooks: {
    afterRead: [populateArticles],
  },
  timestamps: true,
}

export default Offres

