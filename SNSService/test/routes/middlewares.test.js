const { isLoggedIn, isNotLoggedIn } = require("../../routes/middlewares");

describe("isLoggedIn", () => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();
  test("로그인 되어 있으면 isLoggedIn에서 next()호출", () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    isLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
  test("로그인 안 되어 있으면 isLoggedIn에서 에러 리턴", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isLoggedIn(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.send).toBeCalledWith("Need Login");
  });
});

describe("isNotLoggedIn", () => {
  const res = {
    redirect: jest.fn(),
  };
  const next = jest.fn();
  test("로그인 되어 있으면 isLoggedIn에서 에러 리턴", () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    isNotLoggedIn(req, res, next);
    const message = encodeURIComponent("Already LoggedIn");
    expect(res.redirect).toBeCalledWith(`/?error=${message}`);
  });
  test("로그인 안 되어 있으면 isLoggedIn에서 next()호출", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isNotLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
});
