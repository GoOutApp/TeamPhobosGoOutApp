var app = app || {};

app.Friends = (function () {
    'use strict'

    // Friends model
    var friendsModel = (function () {

        var friendModel = {

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
                    $('#no-events-span').hide();
                } else {
                    $('#no-events-span').show();
                }
            },
            sort: { field: 'CreatedAt', dir: 'desc' }
        });

        return {
            friends: friendsDataSource
        };

    }());

    // Friends view model
    var friendsViewModel = (function () {

        // Navigate to friendView When some friend is selected
        var friendSelected = function (e) {
            app.mobileApp.navigate('views/friendView.html?uid=' + e.data.uid);
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
            friends: friendsModel.friends,
            friendSelected: friendSelected,
            logout: logout
        };

    }());

    return friendsViewModel;

}());