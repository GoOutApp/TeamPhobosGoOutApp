var app = app || {};

app.Events = (function () {
    'use strict'

    // Events model
    var eventsModel = (function () {

        var eventModel = {

            id: 'Id',
            fields: {
                Description: {
                    field: 'Description',
                    defaultValue: 'No description provided'
                },
                EventDate: {
                    field: 'EventDate',
                    defaultValue: new Date()
                },
                Location: {
                    field: 'Location',
                    defaultValue: 'No location provided'
                },
                Joined: {
                    field: 'Joined',
                    defaultValue: 0
                },
                CreatedAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
                }
            },
            CreatedAtFormatted: function () {
                return app.helper.formatDate(this.get('EventDate'));
            },
            LocationFormatted: function () {
                //var location = this.get('Location');
                //if (location != null && location != undefined && location != 'No location provided') {
                //    return 'Latitude: ' + location.coords.latitude + '<br />' +
				//		 'Longitude: ' + location.coords.longitude + '<br />';
                //}

                return 'No location provided';
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
            filter: {
                field: "EventDate",
                operator: "gt",
                value: new Date()
            },
            sort: { field: 'EventDate', dir: 'asc' }
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
        
        return {
            events: eventsModel.events,
            eventSelected: eventSelected
        };

    }());

    return eventsViewModel;

}());
