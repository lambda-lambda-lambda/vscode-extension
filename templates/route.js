'use strict';

/**
 * @export {Object}
 */
module.exports = {
  //middleware: [],
  //resource: ['index'],

  /**
   * GET {{appPrefix}}{{routePath}}
   */
  index (req, res) {
    res.status(200).send();
  }
};
