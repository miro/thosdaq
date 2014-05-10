define([
    'underscore',
    'jquery',
    'marionette',
    'app',
    'credentials',
    'text!templates/login.html'
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
        className: 'login-wrap',

        events: {
            'click  #login-button': "_login"
        },

        initialize: function() {
            
        },

        _login: function() {
            console.log("halleluja");
            var username = this.$el.find('#username').val();
            var password = this.$el.find('#password').val();

            credentials.loginAsync(username, password)
                .then(function() {
                    app.navigate('invest/');
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 0) {
                        alert("THOSDAQ API is down");
                    } else {
                        alert("Wrong User/PW - go away");
                    }
                });
        }

    });
});