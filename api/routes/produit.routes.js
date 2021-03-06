const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/produitController");
const upload = require("../utils/profileUploads");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/produit", controller.createProduit);

  app.get("/produit", controller.getAllProduits);

  app.get("/produit/:id", controller.getProduit);

  app.put("/produit/:id", controller.updateProduit);

  app.put("/produit/delete/:id", controller.archiveProduit);

  app.get("/produit/categorie/:cid", controller.getAllProduitsFromCategory);
};
