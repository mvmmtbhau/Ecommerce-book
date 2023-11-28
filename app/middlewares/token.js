const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const isAuthentication = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    const access_token = bearerHeader.split(" ")[1];

    const decodeJwt = jwt.verify(
      access_token,
      process.env.SECRET_JWT
    );
    
    req.userId = decodeJwt._id; //gán id cho req sau
    next();
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      console.log("token het han");
      return res.status(401).send("Token expired");
    }

    return res.status(401).send("Authentication not valid");
  }
};

module.exports = {
  isAuthentication: isAuthentication,
  isAdmin: isAdmin,
};