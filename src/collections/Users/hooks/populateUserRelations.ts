import type { CollectionAfterReadHook } from 'payload'

// Hook pour peupler automatiquement les relations de l'utilisateur
// - Organisations (propriétaire ou contributeur)
// - Articles (auteur)
// - Citations presse (si applicable)
export const populateUserRelations: CollectionAfterReadHook = async ({
  doc,
  req,
}) => {
  if (!doc.id) {
    return doc
  }

  try {
    // Chercher les organisations où cet utilisateur est propriétaire ou contributeur
    // Les champs owners et contributors sont dans le groupe "relations" qui est dans l'onglet "Général"
    const organisationsResult = await req.payload.find({
      collection: 'organisations',
      where: {
        or: [
          {
            'relations.owners': {
              equals: doc.id,
            },
          },
          {
            'relations.contributors': {
              equals: doc.id,
            },
          },
        ],
      },
      limit: 1000,
      depth: 1,
    })
    
    const organisations = organisationsResult && 'docs' in organisationsResult 
      ? organisationsResult 
      : { docs: [] }

    // Chercher les articles écrits par cet utilisateur
    const articles = await req.payload.find({
      collection: 'posts',
      where: {
        authors: {
          equals: doc.id,
        },
      },
      limit: 1000,
      depth: 0,
    })

    // Populer les champs
    if (organisations && 'docs' in organisations) {
      doc.organisations = organisations.docs.map((org) => org.id)
    }

    if (articles && 'docs' in articles) {
      doc.articles = articles.docs.map((article) => article.id)
    }

    // Pour l'instant, citationsPresse est vide (à implémenter si besoin)
    // doc.citationsPresse = []
  } catch (error) {
    console.error('Error populating user relations:', error)
  }

  return doc
}

