const { db } = require("../util/admin");
const { UserHandle } = require("../util/helpers");

const GetAllOrders = async (req, res) => {
  const userHandle = UserHandle(req);

  try {
    const data = await db
      .collection("orders")
      .where("userHandle", "==", userHandle)
      .orderBy("createdAt", "desc")
      .get();
    let orders = [];
    data.forEach((doc) => {
      orders.push({
        orderId: doc.id,
        body: doc.data().body,
        userHandle,
        createdAt: doc.data().createdAt,
      });
    });
    return res.json(orders);
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
};

const CreateOrder = async (req, res) => {
  const newOrder = {
    body: req.body.body,
    userhandle: req.user.handle,
    createdAt: new Date().toISOString(),
  };

  try {
    const doc = await db
      .collection("orders")
      .add(newOrder);
    return res.json({ message: `document ${doc.id} created successfully` });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

const DeleteOrder = async (req, res) => {
  const orderId = req.params.username;
  try {
    await db.doc(`orders/${orderId}`)
      .update({ disabled: true })
      .catch(err => {
        console.log(err);
        res.status(400).json({ error: `Order ${orderId} not found` });
      });
    return res.json({ message: `Order ${orderId} deleted` });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
}

module.exports = { GetAllOrders, CreateOrder, DeleteOrder };
