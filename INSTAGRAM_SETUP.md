# Configuration Instagram Basic Display API

Ce guide explique comment configurer l'intégration Instagram pour afficher les derniers posts Instagram dans le bloc Gallery4.

## 📋 Prérequis

1. Un compte Instagram Business ou Creator
2. Un compte développeur Facebook
3. Accès au compte Instagram @justice.cool_officiel

## 🚀 Étapes de configuration

### 1. Créer une application Instagram sur Facebook Developers

1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Créez une nouvelle application ou sélectionnez une existante
3. Ajoutez le produit **Instagram Basic Display**
4. Configurez les paramètres OAuth :
   - **Valid OAuth Redirect URIs**: `http://localhost:3000` (pour le développement)
   - **Deauthorize Callback URL**: `http://localhost:3000/api/instagram/deauthorize`
   - **Data Deletion Request URL**: `http://localhost:3000/api/instagram/delete`

### 2. Obtenir les credentials

1. Dans **Settings > Basic**, récupérez :
   - **App ID**
   - **App Secret**

2. Dans **Instagram Basic Display > Basic Display**, créez un **User Token Generator** :
   - Sélectionnez votre compte Instagram
   - Autorisez les permissions :
     - `user_profile`
     - `user_media`
   - Générez un **User Token**

3. Obtenez votre **Instagram User ID** :
   - Utilisez l'endpoint : `https://graph.instagram.com/me?fields=id,username&access_token=VOTRE_TOKEN`
   - Notez l'ID retourné

### 3. Configurer les variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```bash
# Instagram Basic Display API
INSTAGRAM_ACCESS_TOKEN=votre_user_token_ici
INSTAGRAM_USER_ID=votre_user_id_ici

# Optionnel : pour la synchronisation automatique via cron
CRON_SECRET=une_cle_secrete_aleatoire
```

### 4. Synchroniser les posts Instagram

#### Méthode 1 : Via l'endpoint API (recommandé)

```bash
# Synchronisation manuelle
curl -X POST http://localhost:3000/api/sync-instagram-posts

# Ou depuis le navigateur
# http://localhost:3000/api/sync-instagram-posts
```

#### Méthode 2 : Via l'admin Payload

1. Allez dans l'admin Payload
2. Naviguez vers **Instagram Posts**
3. Les posts seront synchronisés automatiquement lors de la première utilisation

### 5. Configurer la synchronisation automatique (optionnel)

#### Avec Vercel Cron

Ajoutez dans `vercel.json` :

```json
{
  "crons": [
    {
      "path": "/api/sync-instagram-posts",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

#### Avec un service externe (cron-job.org)

1. Créez un compte sur [cron-job.org](https://cron-job.org)
2. Créez une nouvelle tâche cron
3. URL : `https://votre-domaine.com/api/sync-instagram-posts`
4. Schedule : Toutes les 6 heures
5. Headers : `Authorization: Bearer VOTRE_CRON_SECRET`

### 6. Configurer le bloc Gallery4 dans Payload

1. Allez dans l'admin Payload
2. Modifiez votre page d'accueil
3. Sélectionnez le bloc **Gallery** avec **Gallery 4 (Large Images with Overlay)**
4. Cochez **Use Instagram posts instead of manual gallery items**
5. Définissez le nombre de posts à afficher (par défaut : 12)
6. Sauvegardez

## 🔄 Renouvellement du token

Les tokens Instagram expirent après **60 jours**. Pour les renouveler :

1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Ouvrez votre application
3. Allez dans **Instagram Basic Display > Basic Display**
4. Générez un nouveau User Token
5. Mettez à jour `INSTAGRAM_ACCESS_TOKEN` dans `.env.local`

## 🐛 Dépannage

### Les posts ne s'affichent pas

1. Vérifiez que les posts sont synchronisés :
   ```bash
   curl http://localhost:3000/api/instagram-posts
   ```

2. Vérifiez que `useInstagramPosts` est coché dans le bloc Gallery4

3. Vérifiez les logs du serveur pour les erreurs

### Erreur "Invalid access token"

- Vérifiez que le token n'a pas expiré
- Régénérez un nouveau token si nécessaire

### Erreur "Rate limit exceeded"

- Instagram limite les appels API
- Attendez quelques minutes avant de réessayer
- Réduisez la fréquence de synchronisation

## 📚 Ressources

- [Documentation Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Facebook Developers Console](https://developers.facebook.com/)
- [Instagram Graph API Explorer](https://developers.facebook.com/tools/explorer/)

