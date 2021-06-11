const { Domain, User } = require("../models");
const RateLimit = require("express-rate-limit");
const url = require("url");
const freeLimiter = new RateLimit({
  windowMs: 60 * 1000,
  max: 10,
  delayMs: 0,
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode,
      message: "API limit : 10 time per minute",
    });
  },
});
const paidLimiter = new RateLimit({
  windowMs: 60 * 1000,
  max: 100,
  delayMs: 0,
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode,
      message: "API limit : 100 time per minute",
    });
  },
});
async function limiter(req, res, next) {
  try {
    const domain = await Domain.findOne({
      where: { host: url.parse(req.get("origin")).host },
    });
    if (domain.type === "free") {
      freeLimiter(req, res, next);
    } else {
      paidLimiter(req, res, next);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
}

module.exports = limiter;
