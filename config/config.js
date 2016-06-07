"use strict";

module.exports = {
    port: process.env.PORT || 3000,
    mongo: process.env.MONGODB_URI || "mongodb://localhost"
};