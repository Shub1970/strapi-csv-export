'use strict';
// const ExcelJS = require('excel.js');

const myController = ({ strapi }) => ({
  async getDropDownData(ctx) {
    ctx.body = await strapi.plugin('csv-export').service('service').getDropDownData();
  },
  async getTableData(ctx) {
    ctx.body = await strapi.plugin('csv-export').service('service').getTableData(ctx);
  },
  async downloadCSV(ctx) {
    ctx.body = await strapi.plugin('csv-export').service('service').downloadCSV(ctx);
  },
});

export default myController;
