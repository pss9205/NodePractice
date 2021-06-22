const Sequelize = require("sequelize");
const Hashtag = require("../../models/hashtag");
const config = require("../../config/config")["test"];
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

describe("Hashtag 모델", () => {
  test("static init 메소드", () => {
    expect(Hashtag.init(sequelize)).toBe(Hashtag);
  });
  test("static associate 메소드", () => {
    const db = {
      Hashtag: {
        belongsToMany: jest.fn(),
      },
      Post: {},
    };
    Hashtag.associate(db);
    expect(db.Hashtag.belongsToMany).toHaveBeenCalledWith(db.Post, {
      through: "PostHashtag",
    });
  });
});
