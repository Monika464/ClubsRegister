const request = require("supertest");
const app = require("../src/app");
const Manager = require("../src/models/manager");

const managerOne = {
  email: "aa@aa.pl",
  password: "12345678",
  name: "Aan",
  surname: "AAAan",
  organization: "AA",
  address: "Pinkpanter",
  phone: "1234",
};
beforeEach(async () => {
  await Manager.deleteMany();
  await new Manager(managerOne).save();
});

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
}, 10000);

test("Should login existing manager", async () => {
  await request(app)
    .post("/managers/login")
    .send({
      email: managerOne.email,
      password: managerOne.password,
    })
    .expect(200);
});

test("Should not login nonexisting manager", async () => {
  await request(app)
    .post("/managers/login")
    .send({
      email: "",
      password: managerOne.password,
    })
    .expect(400);
});

// test("Should login a new user", async () => {
//   await request(app).post("/users").send({});
// }).expect(201);
