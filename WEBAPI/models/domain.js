const Sequelize = require("sequelize");

module.exports = class Domain extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        host: {
          type: Sequelize.STRING(80),
          allowNull: false,
        },
        type: {
          type: Sequelize.ENUM("free", "premium"),
          allowNull: false,
        },
        clientSecret: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        frontSecret: {
          type: Sequelize.UUID,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: "Domain",
        tableName: "Domains",
      }
    );
  }
  static associate(db) {
    db.Domain.belongsTo(db.User);
  }
};
