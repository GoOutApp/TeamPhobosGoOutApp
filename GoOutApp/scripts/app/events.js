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
            JoinedFormatter: function () {
                var joinsCount = this.get('Joined');
                if (joinsCount === null || joinsCount === undefined || joinsCount === 0) {
                    return 'Noone has joined yet';
                }
                else {
                    return 'Joined: ' + joinsCount;
                }
            },
            LocationFormatted: function () {
                var eventCoords = this.get('Location');
                //console.log(eventCoords);
                if (eventCoords !== 'No location provided') {
                    
                    var latlon = eventCoords.latitude + "," + eventCoords.longitude;
                    var googleApi = 'http://maps.googleapis.com/maps/api/staticmap?center=';
                    var options = '&zoom=11&size=400x300&sensor=false';
                    var marker = '&markers=icon:http://thumb18.shutterstock.com/photos/thumb_large/347836/347836,1327514947,4.jpg|' + latlon;
                    var img_url = googleApi + latlon + options + marker;
                    document.getElementById("show-location").innerHTML = "<img src='" + img_url + "'>";
                    return 'Location';
                }
                else {
                    return 'No location provided!';
                }
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
                    PictureUrl: app.helper.resolveProfilePictureUrl(user.Avatar)
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
            console.log(e.data);
            // TODO: CHANGED TO e.data.CreatedBy / e.data.Id from e.data.Uid 
            app.mobileApp.navigate('views/events/eventView.html?uid=' + e.data.Id);
        };
        
        return {
            events: eventsModel.events,
            eventSelected: eventSelected
        };

    }());

    return eventsViewModel;

}());
