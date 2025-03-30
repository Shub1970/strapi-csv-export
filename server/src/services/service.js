const ExcelJS = require('exceljs');

const service = ({ strapi }) => ({
  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },
  async getDropDownData() {
    try {
      let excel = strapi.config.get('excel');
      let dropDownValues = [];
      let array = Object.keys(excel?.config || {});
      // strapi.contentTypes is an object, not an array, so we need to use Object.entries
      Object.entries(strapi.contentTypes).forEach(([uid, contentType]) => {
        if (contentType?.kind === 'collectionType') {
          array?.forEach((data) => {
            if (uid?.startsWith(data)) {
              dropDownValues.push({
                label: contentType?.info?.displayName,
                value: uid,
              });
            }
          });
        }
      });
      // Fixed typo in property name 'lable' -> 'label'
      dropDownValues.sort((a, b) => a.label.localeCompare(b.label));
      console.log('drop', dropDownValues);
      return {
        data: dropDownValues,
      };
    } catch (error) {
      strapi.log.error('Error fetching dropdown data:', error);
      Context.throw(500, 'internal server error while fetching dropdown data');
    }
  },
  async getTableData(ctx) {
    try {
      const excel = strapi.config.get('excel');
      const uid = ctx.query.uid;
      console.log(JSON.stringify(uid));
      const limit = parseInt(ctx.query.limit, 10) || 10;
      const offset = parseInt(ctx.query.offset, 10) || 0;

      if (!uid || !excel?.config[uid]) {
        return ctx.badRequest('Invalid content type uid');
      }

      const query = await this.restructureObject(excel.config[uid], uid, limit, offset);

      console.log('query', query);

      // In Strapi v5, entityService provides a more unified API for querying
      const response = await strapi.entityService.findMany(uid, query);
      const header = [
        ...excel.config[uid].columns,
        ...Object.keys(excel.config[uid].relation || {}),
      ];
      let where = {};
      if (excel.config[uid].locale === 'true') {
        where = {
          locale: 'en',
        };
      }

      // Count total entries
      const count = await strapi.entityService.count(uid, { filters: where });

      const tableData = await this.restructureData(response, excel.config[uid]);

      return {
        data: tableData,
        count,
        columns: header,
      };
    } catch (error) {
      strapi.log.error('Error fetching table data:', error);
      ctx.throw(500, 'Internal server error while fetching table data');
    }
  },
  async downloadCSV(ctx) {
    try {
      const excel = strapi.config.get('excel');
      const uid = ctx.query.uid;
      console.log('hello on downloadCSV');

      if (!uid || !excel?.config[uid]) {
        return ctx.badRequest('Invalid content type uid');
      }

      const query = await this.restructureObject(excel.config[uid], uid);
      // Use entityService instead of query
      const response = await strapi.entityService.findMany(uid, query);
      const csvData = await this.restructureData(response, excel.config[uid]);
      console.log('response', response, 'csvData', csvData);

      // Extract column headers dynamically from the data
      const headers = [
        ...excel.config[uid].columns,
        ...Object.keys(excel.config[uid].relation || {}),
      ];

      // Transform the original headers to the desired format
      const headerRestructure = headers.map((element) =>
        element
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      );

      // Create CSV content
      let csvContent = headerRestructure.join(',') + '\n';

      // Add data rows to CSV
      csvData.forEach((row) => {
        const csvRow = headers
          .map((header) => {
            // Handle values with commas by wrapping them in quotes
            const value =
              row[header] !== undefined && row[header] !== null ? row[header].toString() : '';
            return value.includes(',') ? `"${value}"` : value;
          })
          .join(',');

        csvContent += csvRow + '\n';
      });

      // Set response headers
      ctx.set('Content-Disposition', 'attachment; filename=export.csv');
      ctx.set('Content-Type', 'text/csv');

      return Buffer.from(csvContent);
    } catch (error) {
      strapi.log.error('Error generating CSV file:', error);
      ctx.throw(500, 'Internal server error while generating CSV file');
    }
  },
  async restructureObject(inputObject, uid, limit, offset) {
    const excel = strapi.config.get('excel');

    let filters = {};

    if (excel?.config[uid]?.locale === 'true') {
      filters = {
        locale: 'en',
      };
    }

    // In Strapi v5, the query structure is updated
    const restructuredObject = {
      fields: inputObject.columns || undefined,
      populate: {},
      filters,
      sort: { id: 'asc' },
      limit: limit,
      offset: offset,
    };

    // Populate relations
    for (const key in inputObject.relation || {}) {
      restructuredObject.populate[key] = {
        fields: inputObject.relation[key].column,
      };
    }

    return restructuredObject;
  },
  async restructureData(data, objectStructure) {
    return data.map((item) => {
      const restructuredItem = {};

      // Restructure main data based on columns
      for (const key of objectStructure.columns) {
        if (key in item) {
          restructuredItem[key] = item[key];
        }
      }

      // Restructure relation data based on the specified structure
      for (const key in objectStructure.relation || {}) {
        if (key in item) {
          const column = objectStructure.relation[key].column[0];
          if (item[key] && typeof item[key] === 'object') {
            if (Array.isArray(item[key]) && item[key].length > 0) {
              restructuredItem[key] = item[key]
                .map((obj) => obj[column])
                .filter(Boolean)
                .join(' ');
            } else {
              restructuredItem[key] = item[key][column];
            }
          } else {
            restructuredItem[key] = null;
          }
        }
      }

      return restructuredItem;
    });
  },
});

export default service;
