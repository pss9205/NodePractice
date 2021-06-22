jest.mock("../../models/post");
jest.mock("../../models/hashtag");
jest.mock("../../models/user");

const Post = require("../../models/post");
const Hashtag = require("../../models/hashtag");
jest.mock("../../passport/cache");
const Cache = require("../../passport/cache");
const {
  like,
  dislike,
  postImg,
  post,
  deletepost,
} = require("../../controllers/post");

describe("like", () => {
  const req = {
    user: {
      id: 1,
    },
    body: {
      id: 1,
    },
  };
  const res = {
    send: jest.fn(),
  };
  const next = jest.fn();
  test("포스팅 찾아서 like 완료", async () => {
    Post.findOne.mockReturnValue(
      Promise.resolve({
        addLikes(id) {
          return Promise.resolve(true);
        },
      })
    );
    Cache.setDirty.mockReturnValue(true);
    await like(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });
  test("포스팅 찾기 실패", async () => {
    const error = "testing error";
    Post.findOne.mockReturnValue(
      Promise.resolve({
        addLikes(id) {
          return Promise.reject(error);
        },
      })
    );
    Cache.setDirty.mockReturnValue(true);
    await like(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});

describe("dislike", () => {
  const req = {
    user: {
      id: 1,
    },
    body: {
      id: 1,
    },
  };
  const res = {
    send: jest.fn(),
  };
  const next = jest.fn();
  test("포스팅 찾아서 dislike 완료", async () => {
    Post.findOne.mockReturnValue(
      Promise.resolve({
        removeLikes(id) {
          return Promise.resolve(true);
        },
      })
    );
    Cache.setDirty.mockReturnValue(true);
    await dislike(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });
  test("포스팅 찾기 실패", async () => {
    const error = "testing error";
    Post.findOne.mockReturnValue(
      Promise.resolve({
        removeLikes(id) {
          return Promise.reject(error);
        },
      })
    );
    Cache.setDirty.mockReturnValue(true);
    await dislike(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});

describe("postImg", () => {
  const req = {
    file: {
      filename: "testing",
    },
  };
  const res = {
    json: jest.fn(),
  };
  const next = jest.fn();
  test("이미지 경로 url로 전달", () => {
    postImg(req, res);
    expect(res.json).toBeCalledWith({ url: `/img/${req.file.filename}` });
  });
});

describe("post", () => {
  const req = {
    body: {
      content: "testingContent",
      url: "testingUrl",
    },
    user: {
      id: 1,
    },
  };
  const res = {
    redirect: jest.fn(),
  };
  const next = jest.fn();
  test("해시태그 없는 포스팅", async () => {
    Post.create.mockReturnValue(Promise.resolve(true));
    await post(req, res, next);
    expect(Hashtag.findOrCreate).not.toBeCalled();
    expect(res.redirect).toBeCalledWith("/");
  });
  test("해시태그 존재하는 포스팅", async () => {
    req.body.content = "testing#Content";
    Hashtag.findOrCreate.mockReturnValue(Promise.resolve(true));
    Post.create.mockReturnValue(
      Promise.resolve({
        addHashtags(item) {
          return Promise.resolve(true);
        },
      })
    );
    await post(req, res, next);
    expect(res.redirect).toBeCalledWith("/");
  });
});

describe("deletepost", () => {
  const req = {
    params: {
      id: 1,
    },
  };
  const res = {
    send: jest.fn(),
    status: jest.fn(() => res),
  };
  const next = jest.fn();

  test("포스팅 삭제 성공", async () => {
    Post.destroy.mockReturnValue(Promise.resolve(1));
    await deletepost(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });
  test("삭제할 포스팅이 없음", async () => {
    Post.destroy.mockReturnValue(Promise.resolve(0));
    await deletepost(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no twit");
  });
  test("포스팅 삭제 중 에러 발생", async () => {
    const error = "testing error";
    Post.destroy.mockReturnValue(Promise.reject(error));
    await deletepost(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
