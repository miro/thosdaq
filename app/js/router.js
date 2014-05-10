/** @jsx React.DOM */

define([
    'marionette',
    'app',
    'views/login'
], function(
    Marionette,
    app,
    LoginView
) {

    return Marionette.AppRouter.extend({
        
        routes: {
            "(/)": "index"
        },

        index: function() {
            app.mainRegion.show(new LoginView());
        }
    });
});
