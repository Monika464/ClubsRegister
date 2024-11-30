const request = require("supertest");
const app = require("../src/app");
const Club = require("../src/models/club");
const User = require("../src/models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const clubOneId = new mongoose.Types.ObjectId();

const clubOne = {
  _id: clubOneId,
  email: "club@club.pl",
  password: "clubpass",
  name: "Club Name",
  city: "City",
  region: "Region",
  phone: "123456",
  tokens: [
    { token: jwt.sign({ _id: clubOneId }, process.env.TOKEN_DECIFER_CLUB) },
  ],
};

const userOne = {
  email: "uu@uu.pl",
  password: "12345678",
  name: "UU",
  surname: "UUu",
  age: "33",
  weight: "67",
  phone: "1234",
  fights: "44",
  tokens: [
    { token: jwt.sign({ _id: clubOneId }, process.env.TOKEN_DECIFER_USER) },
  ],
};
beforeEach(async () => {
  await User.deleteMany();
  await Club.deleteMany();
  await new Club(clubOne).save();
});

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .set("Authorization", `Bearer ${clubOne.tokens[0].token}`)
    .send(userOne);

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty("user");
  expect(response.body.user.owner).toBe(clubOne._id.toString());
});

test("Should login existing user", async () => {
  const user = new User({ ...userOne, owner: clubOne._id });
  await user.save();
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  expect(response.body).toHaveProperty("token");
});
