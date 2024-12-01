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
});

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

test("Should get profile manager", async () => {
  const token = await loginManager(managerOne);

  const response = await request(app)
    .get("/managers/me")
    .set("Authorization", `Bearer ${token}`)
    .send()
    .expect(200);

  expect(response.body.email).toBe(managerOne.email);
});
//funkcja pomocnicza
const loginManager = async (managerData) => {
  // const manager = new Manager(managerData);
  // await manager.save();

  const loginResponse = await request(app).post("/managers/login").send({
    email: managerData.email,
    password: managerData.password,
  });
  return loginResponse.body.token; // Zwraca token
};
////////////
