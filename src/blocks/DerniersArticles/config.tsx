import { Block } from 'payload'
import { HeadingFeature, ParagraphFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { link } from '@/fields/link'
import { backgroundColor } from '@/fields/color'

export const DerniersArticlesBlock: Block = {
  slug: 'derniersArticles',
  interfaceName: 'DerniersArticlesBlock',
  labels: {
    singular: 'Derniers articles',
    plural: 'Derniers articles',
  },
  fields: [
    backgroundColor,
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      label: 'Tagline (badge)',
      admin: {
        description: 'Texte affiché dans un badge en haut (ex: "Actualités", "Blog")',
      },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: 'Titre',
      required: true,
      defaultValue: 'Derniers articles',
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      label: 'Sous-titre',
      admin: {
        description: 'Description de la section',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Nombre d\'articles à afficher',
      defaultValue: 3,
      required: true,
      admin: {
        description: 'Nombre maximum d\'articles à afficher',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Catégories',
      admin: {
        description: 'Filtrer par catégories (optionnel - laissez vide pour tous les articles)',
      },
    },
    {
      name: 'buttonLink',
      type: 'group',
      label: 'Bouton "Voir tous les articles"',
      admin: {
        description: 'Lien du bouton en bas de la section (optionnel)',
      },
      fields: [
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'custom',
          options: [
            { label: 'URL personnalisée', value: 'custom' },
            { label: 'Lien interne', value: 'reference' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'custom',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Texte du bouton',
          defaultValue: 'Voir tous les articles',
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Ouvrir dans un nouvel onglet',
        },
      ],
    },
  ],
}

