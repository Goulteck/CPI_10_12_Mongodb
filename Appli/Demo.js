// Importer le module express
const express = require ('express');
// Importer le module mongoose
const mongoose = require ('mongoose');

// quand je suis connecté a la bdd (evenementiel)
mongoose.connection.once('open', ()=> {
    console.log ("Connexion a la base de données effectué");
});

// quand la bdd aura des erreur
mongoose.connection.on('error', () => {
console.log("Erreur dans la bdd");
});


//se connecter sur mongodb (async)
mongoose.connect("mongodb://127.0.0.1:27017/db_demo");


// Crer le modele product

const Product = mongoose.model('Product', {name : String}, 'products');


// Instancier le sereur grace à express
const app = express();

// AUTORISER LE BACK A RECEVOIR DES DONNEES DANS LE BODY
app.use(express.json());

// une route / un point d'entrée
app.get('/welcome', async (request,  response) => {

    //recuperer toyt les produits dans mongo
    // Attention asynchrome
    const products = await Product.find();

   // RG-001 : Si la liste est vide retourner un code 701
    if (products.length == 0){
        return response.json({ code : "701"});
    }

   // RG-002 : Sinon la liste des produits
    return response.json(products);
});


// URL  GET BY ID
app.get('/product/:id', async (request, response) => {
   /// Récupérer le param de l'url
   const idParam = request.params.id;

   // Récupérer dans la base, le produit avec l'id saisie
   const foundProduct = await Product.findOne({'_id' : idParam});

    // RG-003 : Si l'id n'existe pas en base code 705
   if(!foundProduct){
    return response.json({ code : "705"});
   }

   // RG-004 : Sinon on retourne le produit trouvé

   return response.json(foundProduct);
});

// Ajouter un article
app.post("/save-product", async (request, response) => {
    // Récupérer la requête
    const productJson = request.body;

    // Envoyer le productJson dans mongodb
    // -- Instancier le modele Product avec les donnée 
    const product = new Product(productJson)

    // Donnée objet => language de prog (java, js, python)
    // Donnée physique => Stockage de donnée (sql, nosql)
    // -- Persisiter en base (envoyer dans le BDD)
    await product.save();
    
    // Retourner un js
    return response.json(product);
});



// Lancer le serveur
app.listen(3000);
console.log("le serveur a démarré")
// Ton serveur:3000/une-url
// Ton serveur:3000/welcome
// localhost:3000/welcome