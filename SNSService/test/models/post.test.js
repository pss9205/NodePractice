const Sequelize = require("sequelize");
const Post = require("../../models/post");
const config = require("../../config/config")["test"];
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

describe("Post 모델", () => {
  test("static init 메소드", () => {
    expect(Post.init(sequelize)).toBe(Post);
  });
  test("static associate 메소드", () => {
    const db = {
      Hashtag: {},
      User: {},
      Post: {
        belongsTo: jest.fn(),
        belongsToMany: jest.fn(),
      },
    };
    Post.associate(db);
    expect(db.Post.belongsTo).toHaveBeenCalledWith(db.User);
    expect(db.Post.belongsToMany).toHaveBeenCalledWith(db.Hashtag, {
      through: "PostHashtag",
    });
    expect(db.Post.belongsTo).toHaveBeenCalledWith(db.User),
      { through: "PostLikes", as: "Likes" };
  });
});
