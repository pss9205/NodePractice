jest.mock("../../models/Post");
jest.mock("../../models/User");
jest.mock("../../models/Hashtag");
const Post = require("../../models/post");
const Hashtag = require("../../models/hashtag");
const User = require("../../models/user");
const { saveUser, join, pages, hashtag } = require("../../controllers/pages");

describe("user data saving", () => {
  const req = {
    user: {
      Followers: [{ id: "1" }, { id: "2" }],
      Followings: [{ id: "1" }, { id: "2" }],
      Likes: [{ id: "1" }, { id: "2" }],
    },
  };
  const res = {
    locals: {},
  };
  const next = jest.fn();

  test("user 데이터 있음", () => {
    saveUser(req, res, next);
    expect(res.locals).toHaveProperty(
      "user",
      "followerCount",
      "follweingCount",
      "follwerIdList",
      "likes"
    );
    expect(res.locals.followerIdList).toHaveLength(2);
    expect(res.locals.likes).toHaveLength(2);
  });
});
describe("join", () => {
  const req = {};
  const res = {
    render: jest.fn(),
  };
  test("회원가입 페이지 진입", () => {
    join(req, res);
    expect(res.render).toBeCalledWith("join", { title: "Register Account" });
  });
});
describe("pages", () => {
  const req = {};
  const res = {
    render: jest.fn(),
  };
  const next = jest.fn();
  test("포스팅 가져오기 성공", async () => {
    const dummyPosts = {};
    Post.findAll.mockReturnValue(Promise.resolve(dummyPosts));
    await pages(req, res, next);
    expect(res.render).toBeCalledWith("main", {
      title: "NodeBird",
      twits: dummyPosts,
    });
  });
  test("포스팅 가져오기 실패", async () => {
    const error = "testing error";
    Post.findAll.mockReturnValue(Promise.reject(error));
    await pages(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});

describe("hashtag", () => {
  const req = {
    query: {
      hashtag: "test",
    },
  };
  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
  };
  const next = jest.fn();
  test("태그에 해당하는 포스트 있음", async () => {
    const post = ["test"];
    Hashtag.findOne.mockReturnValue(
      Promise.resolve({
        getPosts: () => Promise.resolve(post),
      })
    );
    await hashtag(req, res, next);
    expect(res.render).toBeCalledWith("main", {
      title: `${req.query.hashtag} | NodeBird`,
      twits: post,
    });
  });
  test("해당하는 태그 없음", async () => {
    Hashtag.findOne.mockReturnValue(Promise.resolve(undefined));
    await hashtag(req, res, next);
    expect(res.render).toBeCalledWith("main", {
      title: `${req.query.hashtag} | NodeBird`,
      twits: [],
    });
  });
  test("태그 가져오기 실패", async () => {});
  test("쿼리가 없음", async () => {
    req.query.hashtag = undefined;
    await hashtag(req, res, next);
    expect(res.redirect).toBeCalledWith("/");
  });
});
describe("profile", () => {});
