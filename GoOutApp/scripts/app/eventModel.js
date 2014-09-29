var app = app || {};

app.EventModel = (function () {
    'use strict'
    
    var $friendsContainer,
        listScroller;
    
    var eventViewModel = (function () {
        
        var eventUid,
            event,
            eventID,
            $eventPicture;
        
        var init = function () {
            $friendsContainer = $('#friends-listview');
            $eventPicture = $('#picture');
        };
        
        var show = function (e) {
            
            eventID = e.view.params.uid;
            //eventUid = e.view.params.uid;
            var allevents = app.Events.events._view;
            // Get event by user id
            for (var ev in allevents) {
                var currentEventId = allevents[ev].Id;
                if (currentEventId === eventID) {
                    event = allevents[ev];
                    eventUid = event.CreatedBy;
                    break;
                }
            }

            //console.log(event);
            //console.log(eventID);
            //console.log(eventUid);

            //$eventPicture[0].style.display = event.Picture ? 'block' : 'none';
            
            app.Friends.friends.filter({
                field: 'EventId',
                operator: 'eq',
                value: event.Id
            });
            
            kendo.bind(e.view.element, event, kendo.mobile.ui);
        };
        
        var removeEvent = function () {
            
            var events = app.Events.events;
            //var event = events.getByUid(eventUid);
            
            app.showConfirm(
                appSettings.messages.removeEventConfirm,
                'Delete Event',
                function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                        
                        events.remove(event);
                        events.one('sync', function () {
                            app.mobileApp.navigate('#:back');
                        });
                        events.sync();
                    }
                }
            );
        };

        var joinEvent = function () {
            console.log("You have joined this event!");
        };
        
        return {
            init: init,
            show: show,
            remove: removeEvent,
            join: joinEvent,
            event: function () {
                return event;
            },
        };
        
    }());
    
    return eventViewModel;
    
}());
