const cache = require("../../passport/cache");

describe("passport caching 테스트", () => {
  const user = {
    id: 1,
  };
  test("신규 사용자 등록", () => {
    cache.add(user);
    expect(cache.get(user.id)).toBe(user);
  });
  test("사용자 조회", () => {
    cache.add(user);
    expect(cache.find(user.id)).toBe(true);
    expect(cache.get(user.id)).toBe(user);
  });
  test("Dirty 업데이트", () => {
    cache.add(user);
    cache.setDirty(user.id);
    expect(cache.find(user.id)).toBe(false);
  });
  test("사용자 삭제", () => {
    cache.add(user);
    cache.remove(user.id);
    expect(cache.find(user.id)).toBe(false);
  });
});
