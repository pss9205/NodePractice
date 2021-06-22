jest.mock("../../models/user");
const User = require("../../models/user");
jest.mock("../../passport/cache");
const cache = require("../../passport/cache");
const {
  join,
  login,
  logout,
  kakaocallback,
} = require("../../controllers/auth");
jest.mock("passport");
const passport = require("passport");

describe("Join", () => {
  const req = {
    body: {
      email: "test@test.com",
      nick: "test",
      password: "testpw",
    },
  };
  const res = {
    redirect: jest.fn(),
  };
  const next = jest.fn();

  test("아이디가 이미 있음", async () => {
    User.findOne.mockReturnValue(Promise.resolve({}));
    await join(req, res, next);
    expect(res.redirect).toBeCalledWith("/join?error=exist");
  });

  test("신규 가입 성공", async () => {
    User.findOne.mockReturnValue(Promise.resolve(undefined));
    User.create.mockReturnValue(Promise.resolve(true));
    await join(req, res, next);
    expect(res.redirect).toBeCalledWith("/");
  });

  test("에러 발생", async () => {
    const error = "testing error";
    User.findOne.mockReturnValue(Promise.reject(error));
    await join(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});

describe("login", () => {
  const req = {
    login: jest.fn(),
  };
  const res = {
    redirect: jest.fn(),
  };
  const next = jest.fn();
  test("로그인 authError 발생", () => {
    const authError = "error";
    passport.authenticate = jest.fn((authType, callback) => () => {
      callback(authError, null);
    });
    login(req, res, next);
    expect(next).toBeCalledWith(authError);
  });
  test("유저 데이터가 없음", () => {
    const info = {
      message: "error",
    };
    passport.authenticate = jest.fn((authType, callback) => () => {
      callback(null, null, info);
    });
    login(req, res, next);
    expect(res.redirect).toBeCalledWith(`/?loginError=${info.message}`);
  });
  test("로그인 성공", () => {
    const user = {};
    passport.authenticate = jest.fn((authType, callback) => () => {
      callback(null, user, null);
    });
    req.login = jest.fn((user, errorCallback) => {
      errorCallback(null);
    });
    login(req, res, next);
    expect(req.login.mock.calls[0][0]).toBe(user);
    expect(res.redirect).toBeCalledWith("/");
  });
  test("로그인 실패", () => {
    const user = {};
    const error = "error";
    passport.authenticate = jest.fn((authType, callback) => () => {
      callback(null, user, null);
    });
    req.login = jest.fn((user, errorCallback) => {
      errorCallback(error);
    });
    login(req, res, next);

    expect(next).toBeCalledWith(error);
  });
});

describe("logout", () => {
  const req = {
    user: {
      id: 1,
    },
    logout: jest.fn(),
    session: {
      destroy: jest.fn(),
    },
    redirect: jest.fn(),
  };
  const res = {
    redirect: jest.fn(),
  };
  test("로그아웃 성공", () => {
    logout(req, res);
    expect(req.logout).toBeCalled();
    expect(req.session.destroy).toBeCalled();
    expect(res.redirect).toBeCalledWith("/");
  });
});

describe("kakaocallback", () => {
  const req = {};
  const res = {
    redirect: jest.fn(),
  };
  test("카카오 콜백 성공", () => {
    kakaocallback(req, res);
    expect(res.redirect).toBeCalledWith("/");
  });
});
