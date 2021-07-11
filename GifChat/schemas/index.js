const mongoose = require("mongoose");

const { MONGO_ID, MONGO_PW, NODE_ENV } = process.env;
const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PW}@localhost:27017/admin`;

const connect = () => {
  if (NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }
  mongoose.connect(
    MONGO_URL,
    {
      dbName: "gifchat",
      useNewUrlParser: true,
      useCreateIndex: true,
    },
    (error) => {
      if (error) {
        console.error("db connection error ", error);
      } else {
        console.log("db connected");
      }
    }
  );
};

mongoose.connection.on("error", (error) => {
  console.error("db connection error ", error);
});
mongoose.connection.on("disconnected", () => {
  console.error("db disconnected, try reconnect");
  connect();
});

module.exports = connect;
