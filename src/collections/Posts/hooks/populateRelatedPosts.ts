import type { CollectionAfterReadHook } from 'payload'

// Hook pour peupler automatiquement les articles liés
// Logique de suggestion :
// 1. Priorité : Articles de la même organisation
// 2. Priorité : Articles avec catégories communes
// 3. Priorité : Articles récents (tri par publishedAt)
// 4. Limite : Maximum 6 articles suggérés
export const populateRelatedPosts: CollectionAfterReadHook = async ({
  doc,
  req,
}) => {
  if (!doc.id || !doc.organisation) {
    return doc
  }

  try {
    // Récupérer l'organisation (peut être un ID ou un objet)
    const organisationId =
      typeof doc.organisation === 'object' && doc.organisation !== null
        ? doc.organisation.id
        : doc.organisation

    if (!organisationId) {
      return doc
    }

    // Récupérer les catégories de l'article courant
    const currentCategories =
      doc.categories && Array.isArray(doc.categories)
        ? doc.categories.map((cat) =>
            typeof cat === 'object' && cat !== null ? cat.id : cat,
          )
        : []

    // Construire la requête : articles de la même organisation
    const where: any = {
      organisation: {
        equals: organisationId,
      },
      id: {
        not_equals: doc.id, // Exclure l'article courant
      },
    }

    // Chercher tous les articles de la même organisation
    const allArticles = await req.payload.find({
      collection: 'posts',
      where,
      limit: 100, // Limite large pour le tri
      depth: 1,
      sort: '-publishedAt', // Tri par date de publication décroissante
    })

    if (!allArticles || !('docs' in allArticles) || allArticles.docs.length === 0) {
      return doc
    }

    // Score et trier les articles selon la logique de suggestion
    const scoredArticles = allArticles.docs.map((article) => {
      let score = 0

      // Bonus pour articles récents (publiés dans les 30 derniers jours)
      if (article.publishedAt) {
        const publishedDate = new Date(article.publishedAt)
        const daysSincePublished =
          (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)
        if (daysSincePublished <= 30) {
          score += 10 // Bonus pour articles récents
        } else if (daysSincePublished <= 90) {
          score += 5 // Bonus pour articles assez récents
        }
      }

      // Bonus pour catégories communes
      if (article.categories && Array.isArray(article.categories)) {
        const articleCategories = article.categories.map((cat) =>
          typeof cat === 'object' && cat !== null ? cat.id : cat,
        )

        const commonCategories = articleCategories.filter((catId) =>
          currentCategories.includes(catId),
        )

        if (commonCategories.length > 0) {
          // Plus il y a de catégories communes, plus le score est élevé
          score += commonCategories.length * 5
        }
      }

      // Bonus pour même offre (si applicable)
      if (
        doc.offre &&
        article.offre &&
        typeof doc.offre === 'object' &&
        doc.offre !== null &&
        typeof article.offre === 'object' &&
        article.offre !== null
      ) {
        if (doc.offre.id === article.offre.id) {
          score += 15 // Fort bonus pour même offre
        }
      } else if (
        doc.offre &&
        article.offre &&
        doc.offre === article.offre
      ) {
        score += 15
      }

      return {
        article,
        score,
      }
    })

    // Trier par score décroissant, puis par date de publication
    scoredArticles.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score
      }
      // Si score égal, trier par date de publication
      const dateA = a.article.publishedAt
        ? new Date(a.article.publishedAt).getTime()
        : 0
      const dateB = b.article.publishedAt
        ? new Date(b.article.publishedAt).getTime()
        : 0
      return dateB - dateA
    })

    // Prendre les 6 meilleurs articles
    const suggestedArticles = scoredArticles
      .slice(0, 6)
      .map((item) => item.article.id)

    // Populer le champ relatedPosts
    doc.relatedPosts = suggestedArticles
  } catch (error) {
    console.error('Error populating related posts:', error)
  }

  return doc
}

