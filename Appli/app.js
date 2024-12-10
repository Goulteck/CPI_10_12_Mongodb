const products = [
    "Chocolatine",
    "Viennoiserie",
    "Pain au chocolat", 
    "Pain au chocolatine", 
    "Escargot au chocolat",
    "Croissant au chocolat"
];

/**
 * Récuperer le produit
 * @param {*} nom 
 */
function getProduct(nom)
{
    // For classique
    for (const index in products) 
    {
        if (products[index] == nom)
        {
            return products[index];
        }
    }
    return null;
}

// Tester la fonction
// const foundProduct = getProduct("Chocolatine");
// console.log(foundProduct);

// Predicate

const foundProduct = products.find(product => product == "Chocolatine");
console.log(foundProduct);