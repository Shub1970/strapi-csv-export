'use strict';

const { setupStrapi, cleanupStrapi } = require('./helpers/strapi');

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  await cleanupStrapi();
});

describe('CSV Export Plugin', () => {
  test('strapi is defined', () => {
    expect(strapi).toBeDefined();
  });

  describe('exportToCSV service', () => {
    test('service exists', () => {
      expect(strapi.plugin('csv-export').service('exportToCSV')).toBeDefined();
    });

    test('can generate CSV content', async () => {
      const service = strapi.plugin('csv-export').service('exportToCSV');
      const mockData = [
        { id: 1, title: 'Test 1', description: 'Description 1' },
        { id: 2, title: 'Test 2', description: 'Description 2' },
      ];
      const result = await service.generateCSV(mockData, ['id', 'title', 'description']);
      expect(result).toContain('id,title,description');
      expect(result).toContain('1,Test 1,Description 1');
      expect(result).toContain('2,Test 2,Description 2');
    });
  });

  describe('csv-export controller', () => {
    test('controller exists', () => {
      expect(strapi.plugin('csv-export').controller('controller')).toBeDefined();
    });
  });
});
