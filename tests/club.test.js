const request = require("supertest");
const app = require("../src/app");
const Club = require("../src/models/club");
const jwt = require("jsonwebtoken");
const mongoose = "mongoose";
const axios = require("axios");

jest.mock("axios");

const clubOne = {
  email: "kkk@kkk.pl",
  password: "12345678",
  name: "Fight Club",
  city: "Kraków",
  region: "małop",
  phone: "1234",
};
beforeEach(async () => {
  await Club.deleteMany();
  //await new Club(clubOne).save();
});
// Mockuj odpowiedź z serwera reCAPTCHA
axios.post.mockResolvedValue({
  data: { success: true },
});

test("Should signup a new club", async () => {
  const response = await request(app)
    .post("/clubs")
    .send({
      ...clubOne,
      "g-recaptcha-response": "fake-captcha-token",
    })
    .expect(200); // Oczekiwany status 201 (utworzono)
  expect(response.body).toHaveProperty("club");
  expect(response.body).toHaveProperty("token");
});

test("Should login existing club", async () => {
  await new Club(clubOne).save();
  const response = await request(app)
    .post("/clubs/login")
    .send({
      email: clubOne.email,
      password: clubOne.password,
    })
    .expect(200);
  expect(response.body).toHaveProperty("token");
});
