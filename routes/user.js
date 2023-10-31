const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
var router = express.Router();
const {
  addEntitiy,
  getEntities,
  getEntitiesById,
  updateEntityById,
  getEntitiesByAttribute,
} = require("../utils/dynamo");

//USER REGISTRATION
router.post("/user/register", async (req, res) => {
  const userCheck = await getEntities("registeredUsers");

  let existingIds = [];
  userCheck.Items.forEach((item) => {
    existingIds.push(Number(item.user_id));
  });

  let user_id;
  do {
    user_id = Math.floor(10000 + Math.random() * 90000);
  } while (existingIds.includes(user_id));
  const _id = "US01" + user_id.toString();

  try {

    const passHash = bcrypt.hashSync(req.body.password, 10);

    const userEmail = await getEntitiesByAttribute(
      "registeredUsers",
      "email",
      req.body.email
    );
    const userPhone = await getEntitiesByAttribute(
      "registeredUsers",
      "phone",
      req.body.phone
    );
    if (userEmail.length > 0 || userPhone.length > 0) {
      return res.send("Email id or phone number already registered");
    }
    
    const userData = {
      user_id: _id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: passHash,
      isArtist: req.body.isArtist,
    };
    await addEntitiy("registeredUsers", userData);
    const data = await getEntitiesById("registeredUsers", { user_id: _id });
    console.log("Data saved:", data);
    res.status(200).json({
      status: "User Registered",
      data,
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

//USER LOGIN
router.post("/user/login", async (req, res) => {
  let cred = req.body.userId;
  let isEmail = cred.includes("@");
  let attribute = isEmail ? "email" : "phone";
  try {
    const user = await getEntitiesByAttribute(
      "registeredUsers",
      attribute,
      cred
    );
    if (user.length === 0) {
      return res.status(404).send("User not registered");
    }
    const passCheck = await bcrypt.compare(req.body.password, user[0].password);
    console.log("abc", passCheck);
    if (!passCheck) {
      return res.status(404).send("Wrong credentials");
    }
    res.status(200).send(user[0]);
  } catch (error) {
    res.status(500).send({ error });
  }
});

module.exports = router;
