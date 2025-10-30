import type { Block } from 'payload'

export const ChatInput: Block = {
  slug: 'chatInput',
  labels: {
    singular: 'Chat Input',
    plural: 'Chat Inputs',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titre',
      defaultValue: 'Comment puis-je vous aider ?',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Sous-titre',
      defaultValue: 'L\'intelligence artificielle de Justice.cool est là pour vous aider à trouver votre chemin afin de résoudre vos contentieux',
      required: true,
    },
    {
      name: 'placeholder',
      type: 'text',
      label: 'Placeholder du champ de saisie',
      defaultValue: 'Posez votre question...',
      required: true,
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Texte du bouton',
      defaultValue: 'Envoyer',
      required: true,
    },
  ],
}