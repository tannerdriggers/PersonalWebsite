const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./util/FBAuth");
const ADMINAuth = require("./util/ADMINAuth");
const { GetAllOrders, CreateOrder, DeleteOrder, GetOrder } = require("./handlers/orders");
const { Signup, Login, UploadImage, AddUserDetails, GetAuthenticatedUser } = require("./handlers/users");

// Orders routes
app.get("/orders", FBAuth, GetAllOrders);

// Order routes
app.post("/order", FBAuth, CreateOrder);
app.get("/order/:orderId", FBAuth, GetOrder);
app.delete("/order/:orderId", FBAuth, DeleteOrder);

// User routes
app.post("/signup", Signup);
app.post("/login", Login);
app.post('/user/image', FBAuth, UploadImage);
app.post('/user', FBAuth, AddUserDetails);
app.get('/user', FBAuth, GetAuthenticatedUser);

exports.api = functions.https.onRequest(app);
