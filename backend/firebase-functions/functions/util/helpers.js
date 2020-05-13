const { db } = require("./admin");

const UserHandle = (uid) => {
  return db
    .collection("users")
    .where("userId", "==", uid)
    .then((users) => {
      return users[0].handle;
    })
    .catch((err) => {
      console.error(err);
      return None;
    });
};

module.exports = { UserHandle };
