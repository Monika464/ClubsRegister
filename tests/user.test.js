const request = require("supertest");
const app = require("../src/app");
const Club = require("../src/models/club");
const User = require("../src/models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const clubOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();

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
  owner: clubOneId,
};
const userTwo = {
  email: "bu@bu.pl",
  password: "12345678",
  name: "BBu",
  surname: "Buu",
  age: "63",
  weight: "87",
  phone: "1234",
  fights: "444",
  owner: clubOneId,
  tokens: [
    { token: jwt.sign({ _id: userTwoId }, process.env.TOKEN_DECIFER_USER) },
  ],
};

beforeEach(async () => {
  await User.deleteMany();
  await Club.deleteMany();
  await new Club(clubOne).save();
  //await new User({ ...userOne, owner: clubOne._id }).save();
});

test("Should signup a new user", async () => {
  // await new Club(clubOne).save();

  const response = await request(app)
    .post("/users")
    .set("Authorization", `Bearer ${clubOne.tokens[0].token}`)
    .send(userOne);
  //console.log("clubOnetoken", clubOne.tokens[0].token);
  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty("user");
  expect(response.body.user.owner).toBe(clubOne._id.toString());
});

test("Should login existing user", async () => {
  const user = new User({ ...userTwo, owner: clubOne._id });
  await user.save();
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userTwo.email,
      password: userTwo.password,
    })
    .expect(200);
  expect(response.body).toHaveProperty("token");
});

//funkcja pomocnicza
const loginUser = async (userData) => {
  const user = new User(userData);
  await user.save();

  const loginResponse = await request(app).post("/users/login").send({
    email: userData.email,
    password: userData.password,
  });
  return loginResponse.body.token; // Zwraca token
};
////////////
test("Should get profile user", async () => {
  const token = await loginUser(userTwo);

  const response = await request(app)
    .get("/userss/me")
    .set("Authorization", `Bearer ${token}`)
    .send()
    .expect(200);

  expect(response.body.email).toBe(userTwo.email);
});
