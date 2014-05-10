define([
    'underscore',
    'jquery',
    'marionette',
    'text!templates/login.html'
], function (
    _,
    $,
    Marionette,
    template
) {
    return Backbone.Marionette.ItemView.extend({
        template: template,
        className: 'login-wrap',

        initialize: function() {
            
        }

    });
});