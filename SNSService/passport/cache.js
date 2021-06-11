class UserDB {
  static DB = {};
  static add(user) {
    this.DB[user.id] = { user: user, dirty: false };
  }
  static remove(id) {
    delete this.DB[id];
  }
  static setDirty(id) {
    this.DB[id]["dirty"] = true;
  }
  static find(id) {
    return id in this.DB && this.DB[id]["dirty"] == false;
  }
  static get(id) {
    return this.DB[id]["user"];
  }
  static delete(id) {
    delete this.DB.id;
  }
}
module.exports = UserDB;
