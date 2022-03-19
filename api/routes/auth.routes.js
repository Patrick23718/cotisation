const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/userController");
const upload = require("../utils/profileUploads");
const uploadcni = require("../utils/CNIUploads");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/signup",
    [verifySignUp.checkDuplicateUsername, verifySignUp.checkRolesExisted],
    controller.signup
  );

  app.post("/logout", [authJwt.verifyToken, authJwt.logOut], controller.logout);

  app.post("/signin", controller.signin);

  app.get("/profile", [authJwt.verifyToken], controller.getCurrentUser);

  app.put("/auth/update", [authJwt.verifyToken], controller.updateUser);

  app.put(
    "/auth/updatepassword",
    [authJwt.verifyToken],
    controller.changePassword
  );

  app.put(
    "/auth/updateCNI",
    [authJwt.verifyToken],
    uploadcni.single("imageURL"),
    controller.updateUserCNIImage
  );

  app.put(
    "/auth/updateCNI/:id",
    [authJwt.verifyToken],
    controller.updateUserRemoveCNIImage
  );

  // app.get("/users", [authJwt.verifyToken], controller.getCurrentUser);

  app.put(
    "/auth/updateimage",
    [authJwt.verifyToken],
    upload.single("imageURL"),
    controller.updateUserImage
  );

  app.post("/resetpasswordcode", controller.initPasswordReset);

  app.post("/resetpassword", controller.resetPassword);

  app.get("/users", controller.getAllUsers);
};
