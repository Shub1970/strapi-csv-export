export default [
  {
    method: 'GET',
    path: '/get/dropdown/values',
    handler: 'myController.getDropDownData',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/get/table/data',
    handler: 'myController.getTableData',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/download/csv',
    handler: 'myController.downloadCSV',
    config: {
      policies: [],
      auth: false,
    },
  },
];
