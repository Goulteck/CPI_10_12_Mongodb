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

const Article = mongoose.model('Article', {title : String , content : String , author : String} , 'articles');

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

   // RG-001 : Sinon la liste des produits
    return response.json(articles);
});

// URL  GET BY ID
app.get('/article/:id', async (request, response) => {
    /// Récupérer le param de l'url
   const idParam = request.params.id;

   // Récupérer dans la base, le produit avec l'id saisie
   const foundArticle = await Article.findOne({'_id' : idParam});

    // RG-002 : Si l'id n'existe pas en base code 705
   if(!foundArticle){
    return response.json({ code : "702"});
   }

   // RG-002 : Sinon on retourne le produit trouvé

   return response.json(foundArticle);
 

});
app.post('/save-article', async (request, response) => {
    // Récupérer la requête
    const articleJson = request.body;

    // Envoyer le productJson dans mongodb
    // -- Instancier le modele Product avec les donnée 
    const article = new Article(articleJson)

    // Donnée objet => language de prog (java, js, python)
    // Donnée physique => Stockage de donnée (sql, nosql)
    // -- Persisiter en base (envoyer dans le BDD)
    await article.save();
    
    // RG-003 : Retourner un js
    return response.json(article);

});
app.delete('/article/:id', async (request, response) => {

    /// Récupérer le param de l'url
   const idParam = request.params.id;

   // Récupérer dans la base, le produit avec l'id saisie
   const foundArticle = await Article.findOne({'_id' : idParam});

   // RG-004 : Si l'id n'existe pas en base code 705
   if(!foundArticle){
    return response.json({ code : "702"});
   }

   // RG-004 : l'article a bien été supprimer  
   return response.json({ code : "200"});
 

    
});

// ================================================
// Lancer le serveur
// ================================================
app.listen(3000, () => {
    console.log("Le serveur a démarré");
});