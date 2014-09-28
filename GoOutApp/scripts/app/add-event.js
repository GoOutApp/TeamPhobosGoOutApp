var app = app || {};

app.AddEvent = (function () {
    'use strict'

    var addEventViewModel = (function () {
        
        var $newStatus;
        var validator;
        
        var init = function () {
            
            validator = $('#enterStatus').kendoValidator().data('kendoValidator');
            $newStatus = $('#newStatus');
        };
        
        var show = function () {
            
            // Clear field on view show
            $newStatus.val('');
            validator.hideMessages();
        };
        
        var saveEvent = function () {
            
            // Validating of the required fields
            if (validator.validate()) {
                
                // Adding new event to Events model
                var events = app.Events.events;
                var event = events.add();
                
                event.Text = $newStatus.val();
                event.UserId = app.Users.currentUser.get('data').Id;
                
                events.one('sync', function () {
                    app.mobileApp.navigate('#:back');
                });
                
                events.sync();
            }
        };
        
        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            saveEvent: saveEvent
        };
        
    }());
    
    return addEventViewModel;
    
}());
