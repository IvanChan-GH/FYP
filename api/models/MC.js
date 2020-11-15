/**
 * MC.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    question: {
      type: 'string',
    },
    folder:{
      type: 'string'
    },
    answerA: {
      type: 'string',
    },
    answerB: {
      type: 'string',
    },
    answerC: {
      type: 'string',
    },
    answerD: {
      type: 'string',
    },
    trueAnswer:{
      type: 'string',
    },
    voteA: {
      type: 'number',
    },
    voteB: {
      type: 'number',
    },
    voteC: {
      type: 'number',
    },
    voted: {
      type: 'number',
    },
    participate:{
      type: 'number',
    },
  },

};

