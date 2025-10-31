import type { CollectionAfterReadHook } from 'payload'

// Hook pour peupler automatiquement les citations presse dans l'organisation
// Ce hook recherche tous les citations presse qui mentionnent cette organisation
export const populateCitationsPresse: CollectionAfterReadHook = async ({
  doc,
  req,
}) => {
  if (!doc.id) {
    return doc
  }

  try {
    // Chercher toutes les citations presse qui mentionnent cette organisation
    const citations = await req.payload.find({
      collection: 'citationsPresse',
      where: {
        organisation: {
          equals: doc.id,
        },
      },
      limit: 1000,
      depth: 1,
    })

    // Populer le champ citationsPresse avec les IDs des citations trouvées
    if (citations && 'docs' in citations) {
      doc.citationsPresse = citations.docs.map((citation) => citation.id)
    }
  } catch (error) {
    console.error('Error populating citations presse for organisation:', error)
  }

  return doc
}

