'use strict';

/**
 * @export {Object}
 */
module.exports = {
  //middleware: [],
  //resource: ['index'],

  /**
   * GET {{routePath}}
   */
  index (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('Lambda, Lambda, Lambda');
  }
};
