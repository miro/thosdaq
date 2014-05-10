/** @jsx React.DOM */

define([
    'marionette',
    'app',
    'credentials',
    'views/login',
    'views/invest'
], function(
    Marionette,
    app,
    credentials,
    LoginView,
    InvestView
) {

    return Marionette.AppRouter.extend({
        
        routes: {
            "": "index",
            "invest": "invest"
        },

        index: function() {
            app.mainRegion.show(new LoginView());
        },

        invest: function() {
            if (credentials.authenticated()) {
                app.mainRegion.show(new InvestView());
            }
            else {
                app.navigate('');
            }
        }
    });
});
