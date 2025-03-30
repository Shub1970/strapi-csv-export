# Strapi CSV Export Plugin

A powerful Strapi plugin that enables easy export of content types to CSV format. This plugin provides a user-friendly interface to export your Strapi content with customizable field selection, filtering options, and batch operations.

## Features

- Export any content type to CSV format
- Select specific fields to export
- Filter data before export
- Support for all field types including relations and media
- Batch export capabilities
- Clean and intuitive user interface
- Respects Strapi's permissions system
- Internationalization support

## Installation

\`\`\`bash
# Using npm
npm install strapi-plugin-csv-export

# Using yarn
yarn add strapi-plugin-csv-export
\`\`\`

## Configuration

1. Enable the plugin in your Strapi project's \`config/plugins.js\`:

\`\`\`javascript
module.exports = {
  'csv-export': {
    enabled: true,
    config: {
      // Optional configuration
      maxExportCount: 1000, // Maximum number of entries to export
      defaultFields: ['id', 'createdAt', 'updatedAt'], // Default fields to include
    }
  }
};
\`\`\`

2. Rebuild your Strapi admin panel:

\`\`\`bash
# Using npm
npm run build

# Using yarn
yarn build
\`\`\`

## Usage

1. Navigate to your content type in the Strapi admin panel
2. Click on the "CSV Export" button in the top toolbar
3. Select the fields you want to export
4. Apply any filters if needed
5. Click "Export" to download your CSV file

### Advanced Usage

#### Custom Field Selection

You can select specific fields to export, including:
- Basic fields (text, number, date, etc.)
- Relation fields
- Media fields
- Component fields
- Dynamic zones

#### Filtering

Use the filter options to export only the data you need:
- Date range filters
- Status filters
- Custom field filters

#### Batch Operations

Export multiple entries at once:
1. Select entries using the checkbox
2. Click "Export Selected" to export only chosen entries

## Contributing

We welcome contributions! Please check our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[MIT License](LICENSE.md) © [Shubha Kumar](https://github.com/Shub1970)

## Documentation

For detailed documentation, visit our [documentation page](https://github.com/Shub1970/strapi-csv-export/wiki).

## Support

- Create an [issue](https://github.com/Shub1970/strapi-csv-export/issues)
- Join our [Discord community](https://discord.strapi.io)
- Email: 18shubham1998@gmail.com

## Show your support

Give a star if this project helped you!
