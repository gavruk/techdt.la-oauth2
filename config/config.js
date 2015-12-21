var env = process.env.NODE_ENV || "development";

module.exports = Object.assign(require('./env/all'), require('./env/' + env) || {});
