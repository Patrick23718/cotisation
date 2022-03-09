const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/categoryController");
const upload = require("../utils/profileUploads");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/categorie", controller.createCategory);

  app.get("/categorie", controller.getAllCategories);

  app.get("/categorie/:id", controller.getCategory);

  app.put("/categorie/:id", controller.updateCategory);

  app.put("/categorie/delete/:id", controller.archiveCategory);
};
