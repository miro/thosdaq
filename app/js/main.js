require.config({
	baseUrl: 'js',
    paths: {
        underscore: '../bower_components/underscore/underscore',
        backbone: '../bower_components/backbone/backbone',
        marionette: '../bower_components/marionette/lib/backbone.marionette',
        jquery: '../bower_components/jquery/dist/jquery',
        text: '../bower_components/requirejs-text/text'
    },

    shim: {
		'underscore': {
            exports: '_'
        },
        backbone : {
	      deps : ['jquery', 'underscore'],
	      exports : 'Backbone'
	    },
	    marionette : {
	      deps : ['jquery', 'underscore', 'backbone'],
	      exports : 'Marionette'
	    }
    }
});

// Load main module to start the app
require([
	'backbone',
	'router',
	'app'
], function(
	Backbone,
	Router,
	Application
) {

	var router = new Router();
	Backbone.history.start();
	console.log("App started");
	return Application;
});
