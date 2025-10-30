import fetch from 'node-fetch';

async function createHomepage() {
  try {
    // D'abord, créons un utilisateur admin si nécessaire
    const adminResponse = await fetch('http://localhost:3000/api/users/first-register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@justice.cool',
        password: 'admin123',
        confirmPassword: 'admin123',
      }),
    });

    if (adminResponse.ok) {
      console.log('✅ Utilisateur admin créé');
    }

    // Maintenant, créons la page d'accueil
    const pageResponse = await fetch('http://localhost:3000/api/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Accueil',
        slug: 'home',
        hero: {
          designVersion: 'none'
        },
        layout: [
          {
            blockType: 'chatInput',
            title: 'Comment puis-je vous aider ?',
            subtitle: 'L\'intelligence artificielle de Justice.cool est là pour vous aider à trouver votre chemin afin de résoudre vos contentieux',
            placeholder: 'Posez votre question...',
            buttonText: 'Envoyer'
          }
        ],
        _status: 'published'
      }),
    });

    if (pageResponse.ok) {
      const page = await pageResponse.json();
      console.log('✅ Page d\'accueil créée avec succès:', page.id);
      console.log('🌐 Accessible sur: http://localhost:3000/');
    } else {
      const error = await pageResponse.text();
      console.log('❌ Erreur lors de la création de la page:', error);
    }

  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}

createHomepage();
