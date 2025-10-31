// Utilise fetch natif de Node.js 18+
const API_URL = 'http://localhost:3000/api';
const EMAIL = 'drosne@gmail.com';
const PASSWORD = 'PA!rmt082014';

async function addGallery4Block() {
  try {
    // 1. Login
    console.log('🔐 Connexion à l\'API Payload...');
    const loginResponse = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: EMAIL,
        password: PASSWORD,
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.statusText}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;

    if (!token) {
      throw new Error('No token received from login');
    }

    console.log('✅ Connexion réussie');

    // 2. Récupérer la page d'accueil
    console.log('📄 Récupération de la page d\'accueil...');
    const pageResponse = await fetch(`${API_URL}/pages?where[slug][equals]=home&depth=2`, {
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!pageResponse.ok) {
      throw new Error(`Failed to fetch page: ${pageResponse.statusText}`);
    }

    const pageData = await pageResponse.json();
    const homePage = pageData.docs[0];

    if (!homePage) {
      throw new Error('Home page not found');
    }

    console.log(`✅ Page trouvée: ${homePage.title} (${homePage.id})`);
    console.log(`   Blocs actuels: ${homePage.layout?.length || 0}`);

    // 3. Récupérer une image existante pour créer un élément minimal
    console.log('🖼️  Récupération d\'une image existante...');
    const mediaResponse = await fetch(`${API_URL}/media?limit=1`, {
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const mediaData = await mediaResponse.json();
    const firstImage = mediaData.docs?.[0];

    if (!firstImage) {
      throw new Error('Aucune image trouvée dans la base. Veuillez d\'abord uploader une image via l\'admin.');
    }

    console.log(`✅ Image trouvée: ${firstImage.filename} (${firstImage.id})`);

    // 4. Créer le nouveau bloc Gallery4 avec un élément minimal
    const newGalleryBlock = {
      blockType: 'gallery',
      designVersion: 'GALLERY4',
      elements: [
        {
          image: firstImage.id, // Utiliser l'image trouvée
          link: {
            type: 'custom',
            url: 'https://www.instagram.com',
            label: 'Voir sur Instagram',
            newTab: true,
          },
        },
      ],
    };

    // 5. Ajouter le bloc à la fin du layout
    const updatedLayout = [...(homePage.layout || []), newGalleryBlock];

    // 6. Mettre à jour la page
    console.log('💾 Mise à jour de la page...');
    const updateResponse = await fetch(`${API_URL}/pages/${homePage.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        layout: updatedLayout,
      }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Failed to update page: págeResponse.statusText}\n${errorText}`);
    }

    const updatedPage = await updateResponse.json();
    console.log('✅ Page mise à jour avec succès!');
    console.log(`   Nouveau nombre de blocs: ${updatedPage.doc?.layout?.length || 0}`);
    console.log(`   Le bloc Gallery4 a été ajouté à la fin de la page.`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

addGallery4Block();
