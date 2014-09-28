var app = app || {};

app.Join = (function () {
    'use strict'

    var JoinViewModel = (function () {
        
        var $newJoin;
        var validator;
        
        var init = function () {
            
            validator = $('#enterJoin').kendoValidator().data('kendoValidator');
            $newJoin = $('#newJoin');
        };
        
        var show = function () {
            
            // Clear field on view show
            $newJoin.val('');
            validator.hideMessages();
        };
        
        var saveJoin = function () {
            
            // Validating of the required fields
            if (validator.validate()) {
                
                // Adding new comment to Comments model
                var comments = app.Comments.comments;
                var comment = comments.add();
                
                join.Comment = $newJoin.val();
                join.UserId = app.Users.currentUser.get('data').Id;
                join.EventId = app.Event.event().Id;
                
                joins.one('sync', function () {
                    app.mobileApp.navigate('#:back');
                });
                
                joins.sync();
            }
        };
        
        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            saveComment: saveComment
        };
        
    }());
    
    return AddCommentViewModel;
    
}());
