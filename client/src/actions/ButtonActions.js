/**
 * Actions定义模块
 */

'use strict';

const AppDispatcher = require('../dispatcher/AppDispatcher');

const ButtonActions = {

    addNewItem: function (text) {
        AppDispatcher.dispatch({
            actionType: 'ADD_NEW_ITEM',
            text: text
        });
    }

};

module.exports = ButtonActions;
