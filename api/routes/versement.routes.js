const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/versementController");
const upload = require("../utils/profileUploads");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/versement/:Eid",
    [authJwt.verifyToken],
    controller.getUserVersement
  );
  app.post("/versement", [authJwt.verifyToken], controller.createVersement);
};
