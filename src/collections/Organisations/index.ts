import type { CollectionConfig } from 'payload'

import {
  HeadingFeature,
  ParagraphFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { populateCitationsPresse } from './hooks/populateCitationsPresse'

// Import des blocks directement pour éviter les références circulaires
import type { Block } from 'payload'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { FormBlock } from '@/blocks/Form/config'
import { FeatureBlock } from '@/blocks/Feature/config'
import { CtaBlock } from '@/blocks/Cta/config'
import { AboutBlock } from '@/blocks/About/config'
import { LogosBlock } from '@/blocks/Logos/config'
import { Gallery } from '@/blocks/Gallery/config'
import { TestimonialBlock } from '@/blocks/Testimonial/config'
import { FaqBlock } from '@/blocks/Faq/config'
import { StatBlock } from '@/blocks/Stat/config'
import { SplitViewBlock } from '@/blocks/SplitView/config'
import { TextBlock } from '@/blocks/TextBlock/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { CustomBlock } from '@/blocks/CustomBlock/config'
import { ChangelogBlock } from '@/blocks/Changelog/config'
import { ContactBlock } from '@/blocks/Contact/config'
import { Blog } from '@/blocks/Blog/config'
import { BannerBlock } from '@/blocks/Banner/config'
import { CasestudiesBlock } from '@/blocks/Casestudies/config'
import { TimelineBlock } from '@/blocks/Timeline/config'
import { LoginBlock } from '@/blocks/Login/config'
import { SignupBlock } from '@/blocks/Signup/config'
import { ChatInput } from '@/blocks/ChatInput/config'
import { OrganisationsListBlock } from '@/blocks/OrganisationsList/config'
import { DerniersArticlesBlock } from '@/blocks/DerniersArticles/config'

const OrganisationPageBlocks: Block[] = [
  FeatureBlock,
  Archive,
  FormBlock,
  CtaBlock,
  LogosBlock,
  AboutBlock,
  ContactBlock,
  Gallery,
  TestimonialBlock,
  FaqBlock,
  StatBlock,
  SplitViewBlock,
  TextBlock,
  MediaBlock,
  CustomBlock,
  ChangelogBlock,
  Blog,
  BannerBlock,
  CasestudiesBlock,
  TimelineBlock,
  LoginBlock,
  SignupBlock,
  ChatInput,
  OrganisationsListBlock,
  DerniersArticlesBlock,
]

const Organisations: CollectionConfig = {
  slug: 'organisations',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'slug', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nom de l\'organisation',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Général',
          fields: [
            {
              type: 'group',
              name: 'visuels',
              label: 'Visuels',
              fields: [
                {
                  name: 'logoBanniere',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo 1 (Logo au dessus de la bannière)',
                  admin: {
                    description: 'Logo de l\'organisation affiché au-dessus de la bannière (section Banner Minisite)',
                  },
                },
                {
                  name: 'logoSeul',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo 2 (Logo seul)',
                  admin: {
                    description: 'Logo de l\'organisation utilisé seul (menus, cards, etc.)',
                  },
                },
                {
                  name: 'banner',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Bannière',
                  admin: {
                    description: 'Bannière affichée en haut de toutes les pages du minisite (section Banner Minisite transverse)',
                  },
                },
                {
                  name: 'card',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Card (visuel de fond)',
                  admin: {
                    description: 'Visuel de fond pour les cards de cette organisation',
                  },
                },
              ],
            },
            {
              type: 'group',
              name: 'taglines',
              label: 'Taglines',
              fields: [
                {
                  name: 'tagline',
                  type: 'text',
                  label: 'Phrase d\'accroche',
                  admin: {
                    description: 'Phrase d\'accroche principale de l\'organisation',
                  },
                },
                {
                  name: 'presentationCourte',
                  type: 'textarea',
                  label: 'Présentation courte',
                  admin: {
                    description: 'Présentation courte de l\'organisation',
                  },
                },
              ],
            },
            {
              type: 'group',
              name: 'relations',
              label: 'Relations',
              fields: [
                {
                  name: 'owners',
                  type: 'relationship',
                  relationTo: 'users',
                  hasMany: true,
                  label: 'Propriétaires',
                  admin: {
                    description: 'Utilisateurs propriétaires de cette organisation',
                  },
                },
                {
                  name: 'contributors',
                  type: 'relationship',
                  relationTo: 'users',
                  hasMany: true,
                  label: 'Contributeurs / Auteurs',
                  admin: {
                    description: 'Utilisateurs contributeurs/auteurs de cette organisation',
                  },
                },
                {
                  name: 'articles',
                  type: 'relationship',
                  relationTo: 'posts',
                  hasMany: true,
                  label: 'Articles',
                  admin: {
                    description: 'Articles associés à cette organisation (rempli automatiquement via post.organisation)',
                    readOnly: true,
                  },
                },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              label: 'Catégories',
              admin: {
                description: 'Catégories associées à cette organisation',
              },
            },
            {
              name: 'offres',
              type: 'relationship',
              relationTo: 'offres',
              hasMany: true,
              label: 'Offres',
              admin: {
                description: 'Offres associées à cette organisation',
              },
            },
            {
              name: 'citationsPresse',
              type: 'relationship',
              relationTo: 'citationsPresse',
              hasMany: true,
              label: 'Mentions presse',
              admin: {
                description: 'Citations presse associées à cette organisation',
                readOnly: true,
              },
            },
              ],
            },
          ],
        },
        {
          label: 'Accueil',
          fields: [
            {
              name: 'homePage',
              type: 'blocks',
              label: 'Sections de la page d\'accueil',
              blocks: OrganisationPageBlocks,
              admin: {
                description: 'Sections disponibles : Nos solutions, La presse en parle, Derniers articles, Derniers posts instagram (Banner Minisite et Menu Minisite sont générés automatiquement depuis les métadonnées)',
              },
            },
          ],
        },
        {
          label: 'Offres',
          fields: [
            {
              name: 'offresPage',
              type: 'blocks',
              label: 'Sections de la page Offres',
              blocks: OrganisationPageBlocks,
              admin: {
                description: 'Sections disponibles : Nos solutions, Témoignages, La presse en parle (Banner Minisite et Menu Minisite sont générés automatiquement depuis les métadonnées)',
              },
            },
          ],
        },
        {
          label: 'Articles',
          fields: [
            {
              name: 'articlesListPage',
              type: 'blocks',
              label: 'Sections de la page Liste d\'Articles',
              blocks: OrganisationPageBlocks,
              admin: {
                description: 'Sections disponibles : Derniers articles, La presse en parle, Témoignages (Banner Minisite et Menu Minisite sont générés automatiquement depuis les métadonnées)',
              },
            },
          ],
        },
        {
          label: 'À propos',
          fields: [
            {
              name: 'aboutPage',
              type: 'blocks',
              label: 'Sections de la page À propos',
              blocks: OrganisationPageBlocks,
              admin: {
                description: 'Sections disponibles : A propos, Equipe, La presse en parle (Banner Minisite et Menu Minisite sont générés automatiquement depuis les métadonnées)',
              },
            },
          ],
        },
        {
          label: 'Aide',
          fields: [
            {
              name: 'aidePage',
              type: 'blocks',
              label: 'Sections de la page Aide',
              blocks: OrganisationPageBlocks,
              admin: {
                description: 'Sections disponibles pour la page Aide / FAQ',
              },
            },
          ],
        },
      ],
    },
    ...slugField('name'),
  ],
  hooks: {
    afterRead: [populateCitationsPresse],
  },
  timestamps: true,
}

export default Organisations


















