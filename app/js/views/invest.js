define([
    'underscore',
    'jquery',
    'marionette',
    'app',
    'credentials',
    'text!templates/invest.html'
], function (
    _,
    $,
    Marionette,
    app,
    credentials,
    template
) {
    return Backbone.Marionette.ItemView.extend({
        template: template,
        className: 'invest-wrap',

        events: {
            'click  #logout-button': "_logout"
        },

        initialize: function() {
            
        },

        _logout: function() {
            if (confirm("Log out?")) {
                credentials.logout();
                app.navigate('');
            }
        }

    });
});