// Importer le module express
const express = require('express');
// Importer le module mongoose
const mongoose = require('mongoose');

// ================================================
// Connexion à la base de données
// ================================================
// Quand je suis connecté à la bdd (evenementiel)
mongoose.connection.once('open', () => {
    console.log("Connexion à la base de données effectué");
});

// Quand la bdd aura des erreurs
mongoose.connection.on('error', () => {
    console.log("Erreur dans la BDD");
});

// Se connecter sur mongodb (async)
// Ca prend x temps à s'executer
mongoose.connect("mongodb://127.0.0.1:27017/tp_article_api");

// Todo : Creer le modèle Article

const Article = mongoose.model('Article', {name : String}, 'Articles');

// ================================================
// Instancier un serveur et autoriser envokie json
// ================================================
// Instancier le server grace à express
const app = express();

// AUTORISER LE BACK A RECEVOIR DES DONNEES DANS LE BODY
app.use(express.json());

// ================================================
// Les routes (url/point d'entrée)
// ================================================

// une route / un point d'entrée
app.get('/articles', async (request, response) => {
    //recuperer toyt les produits dans mongo
    // Attention asynchrome
    const articles = await Article.find();

   // RG-001 : Si la liste est vide retourner un code 701
    if (articles.length == 0){
        return response.json({ code : "701"});
    }

   // RG-002 : Sinon la liste des produits
    return response.json(articles);
});

// URL  GET BY ID
app.get('/article/:id', async (request, response) => {
    /// Récupérer le param de l'url
   const idParam = request.params.id;

   // Récupérer dans la base, le produit avec l'id saisie
   const foundArticle = await Article.findOne({'_id' : idParam});

    // RG-003 : Si l'id n'existe pas en base code 705
   if(!foundArticle){
    return response.json({ code : "705"});
   }

   // RG-004 : Sinon on retourne le produit trouvé

   return response.json(foundArticle);
 

});
app.post('/save-article', async (request, response) => {
    return response.json({ message : "Va Créer ou modifiée un article"}); 

});
app.delete('/article/:id', async (request, response) => {
    return response.json({ message : "Supprimera l'article de l'id choisie"}); 
});

// ================================================
// Lancer le serveur
// ================================================
app.listen(3000, () => {
    console.log("Le serveur a démarré");
});