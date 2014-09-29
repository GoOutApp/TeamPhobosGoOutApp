var app = app || {};

app.AddFriend = (function () {
    'use strict'

    var addFriendViewModel = (function () {
        
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
        
        var saveFriend = function () {
            
            // Validating of the required fields
            if (validator.validate()) {
                
                // Adding new event to Events model
                var friends = app.Friends.friends;
                var friend = friends.add();
                
                friend.Text = $newStatus.val();
                friend.UserId = app.Users.currentUser.get('data').Id;
                
                friends.one('sync', function () {
                    app.mobileApp.navigate('#:back');
                });
                
                friends.sync();
            }
        };
        
        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            saveFriend: saveFriend
        };
        
    }());
    
    return addFriendViewModel;
    
}());
