const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

beforeAll(async () => {
  await sequelize.sync();
  await request(app)
    .post("/auth/join")
    .send({ email: "123@123.com", password: "123", nick: "123" });
});

describe("GET /profile", () => {
  test("로그인 안한 상태", (done) => {
    request(app).get("/profile").expect(403, done);
  });
  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({ email: "123@123.com", password: "123" })
      .end(done);
  });
  test("로그인 한 상태", (done) => {
    agent.get("/profile").expect(200, done);
  });
});

describe("GET /join", () => {
  test("로그인 안한 상태", (done) => {
    request(app).get("/join").expect(200, done);
  });
  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({ email: "123@123.com", password: "123" })
      .end(done);
  });
  test("로그인 한 상태", (done) => {
    const message = encodeURIComponent("Already LoggedIn");
    agent
      .get("/join")
      .expect("Location", `/?error=${message}`)
      .expect(302, done);
  });
});

describe("GET /", () => {
  test("루트 페이지 조회", (done) => {
    request(app).get("/").expect(200, done);
  });
});

describe("GET /hashtag", () => {
  test("태그 키워드 없이 조회", (done) => {
    request(app).get("/hashtag").expect("Location", "/").expect(302, done);
  });
  test("태그 조회", (done) => {
    request(app)
      .get("/hashtag")
      .send({ query: { hashtag: "test" } })
      .expect("Location", "/")
      .expect(302, done);
  });
});

afterAll(async () => {
  await sequelize.sync({ force: true });
});
