const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");
const path = require("path");
const fs = require("fs");
const { fstat } = require("fs");

beforeAll(async () => {
  await sequelize.sync();
  await request(app)
    .post("/auth/join")
    .send({ email: "123@123.com", password: "123", nick: "123" });
  await request(app)
    .post("/auth/join")
    .send({ email: "1234@1234.com", password: "1234", nick: "1234" });

  const u1agent = request.agent(app);
  await u1agent
    .post("/auth/login")
    .send({ email: "123@123.com", password: "123" });
  await u1agent.post("/post").send({ content: "test#test", id: 1 });
  const u2agent = request.agent(app);
  await u2agent
    .post("/auth/login")
    .send({ email: "1234@1234.com", password: "1234" });
  await u2agent.post("/post").send({ content: "test2#test2", id: 2 });
});

describe("POST /", () => {
  test("로그인 안한 상태", (done) => {
    request(app).post("/post").expect(403, done);
  });
  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({ email: "123@123.com", password: "123" })
      .end(done);
  });
  test("로그인 한 상태", (done) => {
    agent
      .post("/post")
      .send({ content: "test#test", id: 1 })
      .expect("Location", "/")
      .expect(302, done);
  });
});

describe("POST /like", () => {
  test("로그인 안한 상태", (done) => {
    request(app).post("/post/like").expect(403, done);
  });
  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({ email: "123@123.com", password: "123" })
      .end(done);
  });
  test("로그인 한 상태", (done) => {
    agent.post("/post/like").send({ id: 2 }).expect(200, done);
  });
});

describe("POST /dislike", () => {
  test("로그인 안한 상태", (done) => {
    request(app).post("/post/dislike").expect(403, done);
  });
  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({ email: "123@123.com", password: "123" })
      .end(done);
  });
  beforeEach((done) => {
    agent.post("/post/like").send({ id: 2 }).end(done);
  });
  test("로그인 한 상태", (done) => {
    agent.post("/post/dislike").send({ id: 2 }).expect(200, done);
  });
});

describe("DELETE /:id", () => {
  test("로그인 안한 상태", (done) => {
    request(app).delete("/post/1").expect(403, done);
  });
  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({ email: "123@123.com", password: "123" })
      .end(done);
  });
  test("로그인 한 상태", (done) => {
    agent.delete("/post/1").expect(200, done);
  });
});

describe("POST /img", () => {
  test("로그인 안한 상태", (done) => {
    request(app).post("/post/img").expect(403, done);
  });
  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({ email: "123@123.com", password: "123" })
      .end(done);
  });
  test("로그인 한 상태", (done) => {
    agent
      .post("/post/img")
      .attach("img", path.join(__dirname, "../img/DummyTest_123.jpg"))
      .expect(200, done);
  });
  afterEach((done) => {
    const dir =
      process.env.NODE_ENV == "test"
        ? process.env.UPLOAD_TEST
        : process.env.UPLOAD;
    fs.readdir(dir, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlinkSync(path.join(dir, file));
      }
      done();
    });
  });
});

afterAll(async () => {
  await sequelize.sync({ force: true });
});
