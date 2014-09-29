var app = app || {};

app.AddEvent = (function () {
    'use strict'

    var addEventViewModel = (function () {
        
        var $newEventDescription;
        var $newEventDate;
        var $newEventTime;
        var eventLocation;
        var validator;
        
        var init = function () {
            validator = $('#enter-event').kendoValidator().data('kendoValidator');
            $newEventDescription = $('#event-description');
            $newEventDate = $('#event-date');
            $newEventTime = $('#event-time');
        };
        
        var show = function () {
            
            // Clear field on view show
            $newEventDescription.val('');
            validator.hideMessages();
        };
        
        var saveEvent = function () {
            var date = new Date($newEventDate.val() + ' ' + $newEventTime.val());
            // Validating of the required fields
            if (validator.validate()) {
                
                // Adding new event to Events model
                var events = app.Events.events;
                var event = events.add();
                
                event.Description = $newEventDescription.val();
                event.Joined = 0;
                event.EventDate = date;
                event.UserId = app.Users.currentUser.get('data').Id;

                if (eventLocation != null) {
                    event.Location = eventLocation;
                }
                else {
                    console.warn("No Event Location!");
                }

                events.one('sync', function () {
                    app.mobileApp.navigate('#:back');
                });
                
                events.sync();
            }
        };

        var getGeolocation = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    //SUCCESS
                    function (position) {
                        eventLocation = position.coords;
                        console.log(eventLocation);
                        console.log('Success! Coordinates: '
                            + position.coords.latitude
                            + " " + position.coords.longitude);
                        drawPosition(position);
                        
                    },
                    //FAIL
                    function (err) {
                        switch (err.code) {
                            case err.PERMISSION_DENIED:
                            case err.POSITION_UNAVAILABLE:
                            case err.TIMEOUT:
                            case err.UNKNOWN_ERROR:
                                break;
                    }
                });
            }

            function drawPosition(position) {
                var latlon = position.coords.latitude + "," + position.coords.longitude;
                var googleApi = 'http://maps.googleapis.com/maps/api/staticmap?center=';
                var options = '&zoom=11&size=400x300&sensor=false';
                var marker = '&markers=icon:http://thumb18.shutterstock.com/photos/thumb_large/347836/347836,1327514947,4.jpg|' + latlon;
                var img_url = googleApi + latlon + options + marker;
                document.getElementById("event-location").innerHTML = "<img src='" + img_url + "'>";
            }
        };
        
        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            getGeolocation: getGeolocation,
            saveEvent: saveEvent
        };
        
    }());
    
    return addEventViewModel;
    
}());
