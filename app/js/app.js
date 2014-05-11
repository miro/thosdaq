/** @jsx React.DOM */
define([
    'underscore',
    'marionette',
    'config'
], function(
    _,
    Marionette,
    config
) {

    var application = new Backbone.Marionette.Application();

    application.addRegions({
        mainRegion: '#root'
    });

    application.data = {}; // Holder for all the app's data
    application.baseUrl = config.baseUrl;


    // Event bus
    application.vent = _.clone(Backbone.Events);

    return application;
});
