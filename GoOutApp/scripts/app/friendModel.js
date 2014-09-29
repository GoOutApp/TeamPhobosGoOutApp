var app = app || {};

app.FriendModel = (function () {
    'use strict'

    var $friendsContainer,
        listScroller;

    var friendViewModel = (function () {

        var friendUid,
            friend;

        var init = function () {
            $friendsContainer = $('#status-container');
        };

        var show = function (e) {

            $friendsContainer.empty();

            listScroller = e.view.scroller;
            listScroller.reset();

            friendUid = e.view.params.uid;
            // Get current event (based on item uid) from Events model
            friend = app.Friends.friends.getByUid(friendUid);
            $eventPicture[0].style.display = event.Picture ? 'block' : 'none';

            app.Friends.friends.filter({
                field: 'FriendId',
                operator: 'eq',
                value: friend.Id
            });

            kendo.bind(e.view.element, friend, kendo.mobile.ui);
        };

        var removeEvent = function () {

            var friends = app.Friends.friends;
            var friend = friends.getByUid(friendUid);

            app.showConfirm(
                appSettings.messages.removeFriendConfirm,
                'Delete Event',
                function (confirmed) {
                    if (confirmed === true || confirmed === 1) {

                        friends.remove(friend);
                        friends.one('sync', function () {
                            app.mobileApp.navigate('#:back');
                        });
                        friends.sync();
                    }
                }
            );
        };

        return {
            init: init,
            show: show,
            remove: removeFriend,
            friend: function () {
                return friend;
            },
        };

    }());

    return friendViewModel;

}());