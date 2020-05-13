const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./util/FBAuth");
const ADMINAuth = require("./util/ADMINAuth");
const { GetAllOrders, CreateOrder, DeleteOrder } = require("./handlers/orders");
const { Signup, Login, UploadImage, AddUserDetails, GetAuthenticatedUser } = require("./handlers/users");

// Order routes
app.get("/orders", ADMINAuth, GetAllOrders);
app.post("/order", FBAuth, CreateOrder);
app.delete("/order/:orderId", FBAuth, DeleteOrder);

// User routes
app.post("/signup", Signup);
app.post("/login", Login);
app.post('/user/image', FBAuth, UploadImage);
app.post('/user', FBAuth, AddUserDetails);
app.get('/user', FBAuth, GetAuthenticatedUser);

exports.api = functions.https.onRequest(app);
