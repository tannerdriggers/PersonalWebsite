const { db } = require("../util/admin");
const { UserHandle } = require("../util/helpers");

// Gets all of the orders from the user
const GetAllOrders = async (req, res) => {
  const userHandle = UserHandle(req);

  try {
    const data = await db
      .collection("orders")
      .where("userHandle", "==", userHandle)
      .where("enabled", "==", true)
      .orderBy("createdAt", "desc")
      .get();
    let orders = [];
    data.forEach((doc) => {
      orders.push({
        orderId: doc.id,
        userHandle,
        createdAt: doc.data().createdAt,
        items: doc.data().items,
      });
    });
    return res.json(orders);
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
};

// Creates a new order
const CreateOrder = async (req, res) => {
  const newOrder = {
    body: req.body.body,
    userhandle: req.user.handle,
    createdAt: new Date().toISOString(),
    enabled: true,
    items: []
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

// Gets an order from the user
const GetOrder = (req, res) => {
  const orderId = req.params.orderId;
  const userHandle = UserHandle(req);

  if (orderId) {
    return db.doc(`orders/${orderId}`)
      .where("enabled", "==", true)
      .get()
      .then((doc) => {
        if (req.user.admin || doc.userHandle === userHandle) {
          return res.json({
            orderId: doc.id,
            body: doc.data().body,
            userHandle,
            createdAt: doc.data().createdAt,
            items: GetItems(doc.data().items)
          });
        }
        return res.status(400).json({ error: "Unauthorized" });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  }
  return res.status(400).json({ error: "Invalid Order" });
}

const GetItems = async (itemIds) => {
  try {
    return db.collection("items").where("itemId", "in", itemIds).get();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Deletes an order from the user
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

module.exports = { GetAllOrders, CreateOrder, DeleteOrder, GetOrder };
