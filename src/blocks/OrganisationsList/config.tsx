import { Block } from 'payload'
import { backgroundColor } from '@/fields/color'

export const OrganisationsListBlock: Block = {
  slug: 'organisationsList',
  interfaceName: 'OrganisationsListBlock',
  labels: {
    singular: 'Liste d\'organisations',
    plural: 'Listes d\'organisations',
  },
  fields: [
    backgroundColor,
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: 'Titre de la section',
      defaultValue: 'Nos organisations partenaires',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      label: 'Sous-titre',
      defaultValue: 'Découvrez les organisations qui nous font confiance',
    },
    {
      name: 'showTitle',
      type: 'checkbox',
      label: 'Afficher le titre',
      defaultValue: true,
    },
    {
      name: 'showSubtitle',
      type: 'checkbox',
      label: 'Afficher le sous-titre',
      defaultValue: true,
    },
  ],
}
