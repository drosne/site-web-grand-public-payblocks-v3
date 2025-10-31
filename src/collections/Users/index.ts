import type { CollectionConfig } from 'payload'
import {
  HeadingFeature,
  ParagraphFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { authenticated } from '@/access/authenticated'
import { isAdmin, isAdminFieldLevel } from '@/access/isAdmin'
import { isAdminOrSelf } from '@/access/isAdminOrCreatedBy'
import { checkRole } from '@/utilities/checkRole'
import { populateUserRelations } from './hooks/populateUserRelations'

async function findRole(payload: any, slug: string) {
  const { docs } = await payload.find({
    collection: 'roles',
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  return docs[0] || null
}

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  access: {
    create: isAdmin,
    read: authenticated,
    update: isAdminOrSelf,
    delete: isAdminOrSelf,
    /**
     * Limit the access to the admin dashboard here
     */
    admin: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  hooks: {
    beforeValidate: [
      async ({ req, data = {}, operation }) => {
        if (operation === 'create') {
          try {
            // If roles are already set in the data (e.g., from admin dashboard), don't override them
            if (data.roles && Array.isArray(data.roles) && data.roles.length > 0) {
              req.payload.logger.info('User already has roles assigned, keeping existing roles')
              return data
            }

            const { totalDocs } = await req.payload.find({
              collection: 'users',
              limit: 0,
            })

            // Determine which role to assign. First user should be admin. Emails with domain
            // in ALLOWED_EMAIL_DOMAINS will be assigned admin as well
            const isAdmin =
              totalDocs === 0 ||
              (data.email &&
                process.env.ALLOWED_EMAIL_DOMAINS?.split(',').includes(data.email.split('@')[1]))

            // Find the appropriate role
            const role = await findRole(req.payload, isAdmin ? 'admin' : 'editor')

            if (role?.id) {
              req.payload.logger.info(`Assigning ${role.name}, id: ${role.id} role to new user`)
              return {
                ...data,
                roles: [role.id],
              }
            } else {
              req.payload.logger.error('No suitable role found for user')
            }
          } catch (error) {
            req.payload.logger.error(`Error in beforeValidate hook: ${error}`)
          }
        }
        return data
      },
    ],
    afterRead: [populateUserRelations],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Général',
          fields: [
            {
              name: 'auth0Id',
              type: 'text',
              label: 'ID Auth0',
              admin: {
                description: 'Identifiant Auth0 (utilisé pour l\'authentification OAuth2)',
                position: 'sidebar',
              },
              access: {
                update: isAdminFieldLevel,
              },
            },
            {
              name: 'firstName',
              type: 'text',
              label: 'Prénom',
              admin: {
                description: 'Prénom de l\'utilisateur',
              },
            },
            {
              name: 'lastName',
              type: 'text',
              label: 'Nom',
              admin: {
                description: 'Nom de famille de l\'utilisateur',
              },
            },
            {
              name: 'name',
              type: 'text',
              label: 'Nom complet',
              admin: {
                description: 'Nom complet de l\'utilisateur (utilisé comme titre)',
              },
            },
            {
              name: 'displayName',
              type: 'text',
              label: 'Nom à afficher publiquement',
              admin: {
                description: 'Nom à afficher publiquement (si différent du nom complet)',
              },
            },
            {
              name: 'jobTitle',
              type: 'text',
              label: 'Métier / Fonction',
              admin: {
                description: 'Fonction ou métier de l\'utilisateur',
              },
            },
            {
              name: 'bio',
              type: 'richText',
              label: 'Bio',
              localized: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  ParagraphFeature(),
                ],
              }),
              admin: {
                description: 'Biographie de l\'utilisateur',
              },
            },
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
              label: 'Photo',
              admin: {
                description: 'Photo de profil de l\'utilisateur',
              },
            },
            {
              name: 'language',
              type: 'select',
              label: 'Langue',
              options: [
                { label: 'Français', value: 'fr' },
                { label: 'English', value: 'en' },
                { label: 'Deutsch', value: 'de' },
              ],
              defaultValue: 'fr',
              admin: {
                description: 'Langue préférée de l\'utilisateur',
              },
            },
            {
              name: 'website',
              type: 'text',
              label: 'Site web associé',
              admin: {
                description: 'URL du site web personnel ou professionnel',
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
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Liens sociaux',
              admin: {
                description: 'Liens vers les réseaux sociaux',
              },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  label: 'Plateforme',
                  required: true,
                  options: [
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Twitter', value: 'twitter' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'GitHub', value: 'github' },
                    { label: 'Autre', value: 'other' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL',
                  required: true,
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
              ],
            },
            {
              name: 'roles',
              type: 'relationship',
              relationTo: 'roles',
              hasMany: true,
              required: false,
              saveToJWT: true,
              access: {
                create: () => true,
                update: isAdminFieldLevel,
                read: () => true,
              },
              admin: {
                position: 'sidebar',
                description: {
                  en: 'User roles. Admin has full access. Editor is the most common role, with limited access. First user is always admin.',
                  de: 'Benutzerrollen. Admin hat vollständigen Zugriff. Editor ist der allgemeine Benutzer, mit begrenztem Zugriff. Erster Benutzer ist immer Admin.',
                },
                // This field will be hidden in the create first user dialog
                // but visible when editing users or creating subsequent users
                condition: (_, __, ctx) => !!ctx.user?.id,
              },
            },
          ],
        },
        {
          label: 'Relations',
          fields: [
            {
              name: 'organisations',
              type: 'relationship',
              relationTo: 'organisations',
              hasMany: true,
              label: 'Organisations associées',
              admin: {
                description: 'Organisations auxquelles cet utilisateur est associé (propriétaire ou contributeur)',
                readOnly: true,
              },
            },
            {
              name: 'articles',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              label: 'Articles associés',
              admin: {
                description: 'Articles écrits par cet utilisateur (rempli automatiquement)',
                readOnly: true,
              },
            },
            {
              name: 'citationsPresse',
              type: 'relationship',
              relationTo: 'citationsPresse',
              hasMany: true,
              label: 'Citations presse',
              admin: {
                description: 'Citations presse associées (rempli automatiquement)',
                readOnly: true,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'sub',
      type: 'text',
      admin: {
        description: 'This is the Oauth2 sub field (ID Auth0 legacy)',
        hidden: true,
      },
      index: true,
      access: {
        update: isAdminFieldLevel,
      },
    },
  ],
  timestamps: true,
}

export default Users
