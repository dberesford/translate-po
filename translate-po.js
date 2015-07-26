#!/usr/bin/env node
var po = require('node-po');
var async = require('async');
var _ = require('lodash');
var debug = require('debug')('translate-po');
var googleTranslate = require('google-translate')(process.env.APIKEY);
var argv = require('minimist')(process.argv.slice(2));
var usage = 'Usage: translate-po.js <po-input-file> <output-lang> <po-output-file>\n'
          + 'e.g. translate-po.js en/messages.po it it/messages.po';

function main(cb) {
  var poFile = argv._[0];
  var lang = argv._[1];
  var outputFile = argv._[2];
  debug('poFile:', poFile);
  debug('lang:', lang);
  debug('outputFile:', outputFile);

  if (!poFile || !lang || !outputFile) return cb(usage);

  po.load(poFile, function(po){
    translate(po.items, lang, function(err, translations){
      if (err) return cb(err);

      _.each(po.items, function(item, index) {
        if (translations[index]) item.msgstr = translations[index].translatedText;
      });

      po.save(outputFile, cb);
    });
  });
};

function translate(items, lang, cb) {
  var q = async.queue(doTranslate, 5);

  function doTranslate (item, cb) {
    debug('translating:', item);
    googleTranslate.translate(item.msgstr, lang, cb);
  };

  var translations= [];
  q.push(items, function(err, data) {
    if (err) return cb(err);
    translations.push(data);
  });

  q.drain = function() {
    return cb(null, translations);
  }
};

main(function(err) {
  if (err) console.error(err);
});