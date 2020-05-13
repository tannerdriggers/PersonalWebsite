const { admin, db } = require('./admin');

module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No auth token found");
    return res.status(403).json({ error: "Unauthorized" });
  }

  return admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      req.user.handle = data.docs[0].data().handle;
      const admin = data.docs[0].data().admin;
      if (admin && admin === true) {
        return next();
      }
      else {
        console.log(`User ${data.handle} is not an admin`);
        return res.status(401).json({ error: "Unauthorized" });
      }
    })
    .catch((err) => {
      console.error("Error while verifying token ", err);
      return res.status(403).json(err.code);
    });
};