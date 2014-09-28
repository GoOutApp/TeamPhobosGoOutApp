var app = app || {};

app.Events = (function () {
    'use strict'

    // Events model
    var eventsModel = (function () {

        var eventModel = {

            id: 'Id',
            fields: {
                Text: {
                    field: 'Text',
                    defaultValue: ''
                },
                CreatedAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
                },
                Picture: {
                    fields: 'Picture',
                    defaultValue: null
                },
                UserId: {
                    field: 'UserId',
                    defaultValue: null
                },
                Likes: {
                    field: 'Likes',
                    defaultValue: []
                }
            },
            CreatedAtFormatted: function () {

                return app.helper.formatDate(this.get('CreatedAt'));
            },
            PictureUrl: function () {

                return app.helper.resolvePictureUrl(this.get('Picture'));
            },
            User: function () {

                var userId = this.get('UserId');

                var user = $.grep(app.Users.users(), function (e) {
                    return e.Id === userId;
                })[0];

                return user ? {
                    DisplayName: user.DisplayName,
                    PictureUrl: app.helper.resolveProfilePictureUrl(user.Picture)
                } : {
                    DisplayName: 'Anonymous',
                    PictureUrl: app.helper.resolveProfilePictureUrl()
                };
            },
            isVisible: function () {
                var currentUserId = app.Users.currentUser.data.Id;
                var userId = this.get('UserId');

                return currentUserId === userId;
            }
        };

        // Events data source. The Backend Services dialect of the Kendo UI DataSource component
        // supports filtering, sorting, paging, and CRUD operations.
        var eventsDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: eventModel
            },
            transport: {
                // Required by Backend Services
                typeName: 'Events'
            },
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#no-events-span').hide();
                } else {
                    $('#no-events-span').show();
                }
            },
            sort: { field: 'CreatedAt', dir: 'desc' }
        });

        return {
            events: eventsDataSource
        };

    }());

    // Events view model
    var eventsViewModel = (function () {

        // Navigate to eventView When some event is selected
        var eventSelected = function (e) {
            app.mobileApp.navigate('views/eventView.html?uid=' + e.data.uid);
        };

        // Navigate to app home
        var navigateHome = function () {

            app.mobileApp.navigate('#welcome');
        };

        // Logout user
        var logout = function () {

            app.helper.logout()
            .then(navigateHome, function (err) {
                app.showError(err.message);
                navigateHome();
            });
        };

        return {
            events: eventsModel.events,
            eventSelected: eventSelected,
            logout: logout
        };

    }());

    return eventsViewModel;

}());
