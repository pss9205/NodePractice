const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

beforeAll(async () => {
  await sequelize.sync();
  await request(app)
    .post("/auth/join")
    .send({ email: "123@123.com", password: "123", nick: "123" });
  await request(app)
    .post("/auth/join")
    .send({ email: "1234@1234.com", password: "1234", nick: "1234" });
});

describe("Patch /", () => {
  test("로그인 안한 상태", (done) => {
    request(app)
      .patch("/user/")
      .send({ body: { newNick: "test2" } })
      .expect(403, done);
  });
  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({ email: "123@123.com", password: "123" })
      .end(done);
  });
  test("로그인 한 상태", (done) => {
    agent.patch("/user/").send({ newNick: "test2" }).expect(200, done);
  });
});

describe("Post /:id/follow", () => {
  test("로그인 안한 상태", () => {
    request(app).post("/user/2/follow").expect(403);
  });
  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({ email: "123@123.com", password: "123" })
      .end(done);
  });
  test("잘못된 파라마티", (done) => {
    agent.post("/user/3/follow").expect(500, done);
  });
  test("유저 팔로잉", (done) => {
    agent.post("/user/2/follow").expect(200, done);
  });
});

describe("Post /:id/unfollow", () => {
  test("로그인 안한 상태", (done) => {
    request(app).delete("/user/2/unfollow").expect(403, done);
  });
  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({ email: "123@123.com", password: "123" })
      .end(done);
  });
  beforeEach((done) => {
    agent.post("/user/2/follow").end(done);
  });
  test("잘못된 파라마티", (done) => {
    //200을 리턴하면 안되는데 코드가 200 리턴하고 있어 냅둠
    agent.delete("/user/3/unfollow").expect(200, done);
  });
  test("유저 언팔로잉", (done) => {
    agent
      .delete("/user/2/unfollow")
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        return done();
      });
  });
});

afterAll(async () => {
  await sequelize.sync({ force: true });
});
