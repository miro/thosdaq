/* jshint sub:true */ // Allow function()['value']
define([
    'underscore',
    'jquery',
    'app'
], function (
    _,
    $,
    app
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
                //url: 'http://muro.spinni.org/api/login',
                url: app.baseUrl + '/login',
                type: "POST",
                datatype : "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ user: username, password: password })
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
