const Strapi = require('@strapi/strapi');
const fs = require('fs');
const path = require('path');

let instance;

async function setupStrapi() {
  if (!instance) {
    await Strapi().load();
    instance = strapi;

    await instance.server.mount();
  }
  return instance;
}

async function cleanupStrapi() {
  const dbSettings = strapi.config.get('database.connection');

  // Close server to release the db-file
  await strapi.server.httpServer.close();

  // Close the connection to the database
  await strapi.db.connection.destroy();

  // Delete test database after all tests
  if (dbSettings && dbSettings.connection && dbSettings.connection.filename) {
    const tmpDbFile = dbSettings.connection.filename;
    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
}

module.exports = { setupStrapi, cleanupStrapi };
