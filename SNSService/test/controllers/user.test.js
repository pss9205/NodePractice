jest.mock("../../models/user");
const User = require("../../models/user");
jest.mock("../../passport/cache");
const Cache = require("../../passport/cache");
const {
  addFollowing,
  unFollowing,
  updateNickName,
} = require("../../controllers/user");

describe("addFollowing", () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test("사용자 추가하고 success 리턴", async () => {
    Cache.setDirty.mockReturnValue(true);
    User.findOne.mockReturnValue(
      Promise.resolve({
        addFollowing(id) {
          return Promise.resolve(true);
        },
      })
    );
    await addFollowing(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });
  test("사용자를 못찾으면 404와 no user 리턴", async () => {
    User.findOne.mockReturnValue(null);
    await addFollowing(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");
  });

  test("DB에러는 next(error)호출", async () => {
    const error = "Testing Error";
    User.findOne.mockReturnValue(Promise.reject(error));
    await addFollowing(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});

describe("unFollowing", () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test("사용자 제거하고 success 리턴", async () => {
    Cache.setDirty.mockReturnValue(true);
    User.findOne.mockReturnValue(
      Promise.resolve({
        getFollowings(id) {
          return Promise.resolve({});
        },
        removeFollowing(follower) {
          return Promise.resolve(true);
        },
      })
    );
    await unFollowing(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });
  test("사용자를 못찾으면 404와 no user 리턴", async () => {
    User.findOne.mockReturnValue(null);
    await unFollowing(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");
  });

  test("DB에러는 next(error)호출", async () => {
    const error = "Testing Error";
    User.findOne.mockReturnValue(Promise.reject(error));
    await unFollowing(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});

describe("updateNickName", () => {
  const req = {
    user: { id: 1 },
    body: { newNick: "test" },
  };
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test("닉네임 바뀌면 success 리턴", async () => {
    Cache.setDirty.mockReturnValue(true);
    User.update.mockReturnValue(1);
    await updateNickName(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });

  test("사용자를 못찾으면 404와 no user 리턴", async () => {
    User.update.mockReturnValue(null);
    await updateNickName(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");
  });

  test("DB에러는 next(error)호출", async () => {
    const error = "Testing Error";
    User.update.mockReturnValue(Promise.reject(error));
    await updateNickName(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
