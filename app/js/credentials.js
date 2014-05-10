/* jshint sub:true */ // Allow function()['value']
define([
    'underscore',
    'jquery'
], function (
    _,
    $
) {

    var credentials = {

        _set: function (username, password) {
            localStorage["username"] = username;
            localStorage["password"] = password;
        },

        _unset: function () {
            localStorage.removeItem('username');
            localStorage.removeItem('password');
        },

        get: function() {
            return {
                username: localStorage["username"],
                password: localStorage["password"]
            };
        },

        authenticated: function () {
            return (localStorage["username"] !== undefined && localStorage["password"] !== undefined);
        },

        loginAsync: function (username, password) {
            var credentials = this;
            username = username || localStorage["username"];
            password = password || localStorage["password"];

            return $.ajax({
                url: 'http://muro.spinni.org/api/login',
                type: "POST",
                data: { user: username, password: password }
            }).then(function() {
                // Authentication was successful -> save login credentials to local storage
                credentials._set(username, password);
            });
        },

        logout: function () {
            this._unset();
        }
    };

    return credentials;

});
