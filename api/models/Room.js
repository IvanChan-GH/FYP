/**
 * Room.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    roomId: {
      type: 'string',
      required: true
    },
    
    userId: {
      type: 'number',
      required: true,
    },

    currentPage: {
      type: 'number',
      defaultsTo: 1
    }
  },

};

