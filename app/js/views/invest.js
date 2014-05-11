define([
    'underscore',
    'jquery',
    'moment',
    'marionette',
    'app',
    'credentials',
    'text!templates/invest.html'
], function (
    _,
    $,
    moment,
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

        onShow: function() {
            // Find previous author name from localStorage, if it exists
            this.$el.find('#author').val(localStorage["investmentAuthor"]);
        },

        makeInvestment: function(event) {
            var self = this;

            var author = this.$el.find('#author').val();
            var type = $(event.target).text();
            var points = $(event.target).data('points');
            var userObject = credentials.get();

            localStorage["investmentAuthor"] = author;

            if (confirm("Make investment to " + type + "?")) {

                var payload = {
                    user: userObject.username,
                    password: userObject.password,
                    author: author,
                    value: points,
                    type: type
                };

                return $.ajax({
                    url: app.baseUrl + '/invest',
                    type: "POST",
                    datatype: "json",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(payload)
                }).then(function(response) {
                    self.$el.find('.investments-done').append(
                        '<p>' + response.type + ' @ ' + moment(response.timestamp).format('HH:mm') + ' ' + response.company + '</p>');
                }).fail(function() {
                    alert("ERROR - no connection to THOSDAQ Mainframe");
                });

            }
        },

        _logout: function() {
            if (confirm("Log out?")) {
                credentials.logout();
                app.navigate('');
            }
        }

    });
});