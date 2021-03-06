var models = require('../models');
var marked = require('marked');
var async = require('async');
var moment = require('moment');
var config = require('../config');
var helpers = require( '../helpers' );

moment.lang(config.lang);

exports.index = function (req, res) {
    async.parallel({
        blog: function (callback) {
            var q = models.blog.find({}).sort({'created_at': -1}).limit(10);
            q.exec(function (err, rows) {
                if (!err && rows) {
                    callback(null, rows);
                }
                else {
                    callback(null, null);
                }
            });
        },
        questions: function (callback) {
            var q = models.questions.find({}).sort({'created_at': -1}).limit(10);
            q.exec(function (err, rows) {
                if (!err && rows) {
                    callback(null, rows);
                }
                else {
                    callback(null, null);
                }
            });
        },
        training: function (callback) {
            var q = models.training.find({}).sort({'created_at': -1}).limit(10);
            q.exec(function (err, rows) {
                if (!err && rows) {
                    callback(null, rows);
                }
                else {
                    callback(null, null);
                }
            });
        },
        streaming: function (callback) {
            var q = models.streaming.find({}).sort({'created_at': -1}).limit(15);
            q.exec(function (err, rows) {
                if (!err && rows) {

                    var output = [];

                    rows.forEach(function(item){

                        output.push( marked( item.activity + ' ' + moment( item.created_at ).fromNow() )  );

                    });

                    callback(null, output);
                }
                else {
                    callback(null, null);
                }
            });
        }
    },
    function (err, results) {

        res.render(helpers.site.template( 'index' ), { blog: results.blog, questions: results.questions, training: results.training, streaming: results.streaming });

    });

}

exports.notFound = function (req, res) {
    res.render( helpers.site.template( '404' ) );
}