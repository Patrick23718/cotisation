const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/epargneController");
const upload = require("../utils/profileUploads");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/epargne", controller.createEpargne);
};
