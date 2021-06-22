const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

beforeAll(async () => {
  await sequelize.sync();
});

describe("POST /join", () => {
  test("회원 가입 실행", (done) => {
    request(app)
      .post("/auth/join")
      .send({ email: "123@123.com", password: "123", nick: "123" })
      .expect("Location", "/")
      .expect(302, done);
  });
});

describe("POST /join", () => {
  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({ email: "123@123.com", password: "123" })
      .end(done);
  });

  test("이미 로그인한 상황", (done) => {
    const message = encodeURIComponent("Already LoggedIn");
    agent
      .post("/auth/login")
      .send({ email: "123@123.com", nick: "123", password: "123" })
      .expect("Location", `/?error=${message}`)
      .expect(302, done);
  });
});

describe("POST /login", () => {
  test("미가입 회원 로그인 실행", (done) => {
    const message = encodeURIComponent("ID Not Found");
    request(app)
      .post("/auth/login")
      .send({
        email: "1234@1234.com",
        password: "1234",
      })
      .expect("Location", `/?loginError=${message}`)
      .expect(302, done);
  });
  test("비밀번호 오류", (done) => {
    const message = encodeURIComponent("Incorrect Password");
    request(app)
      .post("/auth/login")
      .send({
        email: "123@123.com",
        password: "1234",
      })
      .expect("Location", `/?loginError=${message}`)
      .expect(302, done);
  });
  test("로그인 실행", (done) => {
    request(app)
      .post("/auth/login")
      .send({
        email: "123@123.com",
        password: "123",
      })
      .expect("Location", "/")
      .expect(302, done);
  });
});

describe("GET /logout", () => {
  test("로그인 안된 상태로 로그아웃", (done) => {
    request(app).get("/auth/logout").expect(403, done);
  });

  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({ email: "123@123.com", password: "123" })
      .end(done);
  });

  test("로그아웃", (done) => {
    agent.get("/auth/logout").expect("Location", "/").expect(302, done);
  });
});

afterAll(async () => {
  await sequelize.sync({ force: true });
});
