'use strict';

/**
 *
 * @param {string} input
 * @param {string} endsWith
 * @returns {*}
 */
var testContainsRel = function( input, endsWith ) {
  return input.match( makeRegex( endsWith ) );
};

/**
 * Construct the regular expression
 * @param {string} endsWith
 * @returns {RegExp}
 */
var makeRegex = function( endsWith ) {
  var ending = ( endsWith ) ? makePositiveLookAhead( endsWith ) : '';
  return new RegExp( '\\.(js|css|jpg|png|svg)\\?rel=(\\d.+)' + ending );
};

/**
 * @param {string} character [eg. '"']
 * @returns {string}
 */
var makePositiveLookAhead = function( character ) {
  return '(?=' + character + ')';
};

exports.testContainsRel = testContainsRel;