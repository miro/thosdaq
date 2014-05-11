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

        ui: {
            authorInput:            '#author',
            doneInvestments:        '.investments-done'
        },

        onShow: function() {
            // Find previous author name from localStorage, if it exists
            this.ui.authorInput.val(localStorage["investmentAuthor"]);
        },

        makeInvestment: function(event) {
            var self = this;

            var author = this.ui.authorInput.val();
            var type = $(event.target).text();
            var points = $(event.target).data('points');
            var userObject = credentials.get();

            localStorage["investmentAuthor"] = author;

            if (confirm("Make an investment to " + type + "?")) {

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
                    self.addInvestmentInfo(response);
                }).fail(function() {
                    alert("ERROR - no connection to THOSDAQ Mainframe");
                });

            }
        },

        addInvestmentInfo: function(investment) {
            this.ui.doneInvestments.append(
            '<p>' + investment.type + ' @ ' + moment(investment.timestamp).format('HH:mm') + ' ' + investment.company + '</p>');
        },

        _logout: function() {
            if (confirm("Log out?")) {
                credentials.logout();
                app.navigate('');
            }
        }

    });
});