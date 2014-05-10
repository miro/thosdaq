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
            'click  #logout-button': '_logout',
            'click  .investment-btn': 'makeInvestment'

        },

        initialize: function() {
            
        },

        makeInvestment: function(event) {

            var author = this.$el.find('#author');
            var type = $(event.target).text();
            var points = $(event.target).data('points');

            console.log(event.target.text());
        },

        _logout: function() {
            if (confirm("Log out?")) {
                credentials.logout();
                app.navigate('');
            }
        }

    });
});