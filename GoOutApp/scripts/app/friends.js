var app = app || {};

app.Friends = (function () {
    'use strict'

    // Friends model
    var friendsModel = (function () {

        var friendModel = {

            id: 'Id',
            fields: {
            //    Picture: {
            //        fields: 'Picture',
            //        defaultValue: null
            //    },
                UserId: {
                    field: 'UserId'
                },
                UserFriends: {
                    field: 'UserFriends',
                    defaultValue: []
                }
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

        // Friends data source. The Backend Services dialect of the Kendo UI DataSource component
        // supports filtering, sorting, paging, and CRUD operations.
        var friendsDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: friendModel
            },
            transport: {
                // Required by Backend Services
                typeName: 'Friends'
            },
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#no-friends-span').hide();
                } else {
                    $('#no-friends-span').show();
                }
            }
        });


        var userModel = {
            UserId: {
                field: 'UserId'
            },
            Email: {
                filed: 'Email'
            },
            DisplayName: {
                field: 'DisplayName',
                defaultValue: 'Anonymous'
            }
        };

        var usersDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: userModel
            },
            transport: {
                // Required by Backend Services
                typeName: 'Users'
            },
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#no-users-span').hide();
                } else {
                    $('#no-users-span').show();
                }
            }
        });

        return {
            users: usersDataSource,
            friends: friendsDataSource
        };

    }());

    // Friends view model
    var friendsViewModel = (function () {

        // Navigate to friendView When some friend is selected
        var friendSelected = function (e) {
            app.mobileApp.navigate('views/friends/friendView.html?uid=' + e.data.uid);
        };

        var userSelected = function (e) {
            console.log("ADD SELECTED USER TO FRIENDS LIST");
            app.showConfirm(
                appSettings.messages.addFriendConfirm,
                'Add Friend',
                function (confirmed) {
                    if (confirmed === true || confirmed === 1) {

                        console.log("User added!");
                        //friends.add(friend);
                        //friends.one('sync', function () {
                        //    app.mobileApp.navigate('#:back');
                        //});
                        //friends.sync();
                    }
                }
            );


            //// GET USERS WITH Everlive
            var el = new Everlive('39dbaEzAeRl1ddLP');
            var allUsers;
            el.Users.get()
                .then(function (data) {
                    allUsers = data.result;
                    console.log(allUsers);
                    
                    //console.log(JSON.stringify(data));
                },
                function (error) {
                    //console.log(JSON.stringify(error));
                });

            el.Users.getById('94712a30-46a5-11e4-ad1f-c9ada8b300e7')
                .then(function (data) {

                    //console.log(data.result.Username);
                    //console.log(JSON.stringify(data));
                },
                function (error) {
                    //console.log(JSON.stringify(error));
                });


            //// GET USERS WITH AJAX
            //$.ajax({
            //    url: 'https://api.everlive.com/v1/39dbaEzAeRl1ddLP/Users/' + userID,
            //    type: "GET",
            //    success: function (data) {
            //        console.log(JSON.stringify(data, null, 2));
            //    },
            //    error: function (error) {
            //        console.log(JSON.stringify(error, null, 2));
            //    }
            //});

        };
        
        return {
            users: friendsModel.users,
            userSelected: userSelected,
            friends: friendsModel.friends,
            friendSelected: friendSelected
        };

    }());

    return friendsViewModel || {};

}());
