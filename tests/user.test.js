const request = require("supertest");
const app = require("../src/app");

test("Should signup a new manager", async () => {
  await request(app)
    .post("/managers")
    .send({
      email: "mm@mm.pl",
      password: "12345678",
      name: "MMan",
      surname: "MMan",
      organization: "MM",
      address: "Pinkpanter",
      phone: "1234",
    })
    .expect(201);
}, 20000);

// test("Should login a new user", async () => {
//   await request(app).post("/users").send({});
// }).expect(201);
