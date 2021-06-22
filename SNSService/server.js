const app = require("./app");

app.listen(app.get("port"), () => {
  console.log(`waiting at port ${app.get("port")}`);
});
