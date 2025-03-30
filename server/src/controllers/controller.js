const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('csv-export')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },
});

export default controller;
