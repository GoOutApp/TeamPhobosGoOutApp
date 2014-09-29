/* jQuerry, app*/

var app = app || {};

app.homepage = (function () {
    'use strict';

   var everlive = new Everlive("39dbaEzAeRl1ddLP");

    //homepage model
    var homepageViewModel = (function () {

        $("#imageAdd").hide();
        $("#imageLoad").show();

        var addImage = function () {

            var success = function (data) {
                var file = everlive.Files.create({
                    Filename: app.Users.currentUser.get('data').Username + ".jpg",
                    ContentType: "image/jpeg",
                    base64: data
                }).then(loadImage)
                var url = everlive.DATA_URL(file);   // UPLOADED FILE URL
                //app.Users.currentUser.Avatar = url;
                //app.Users.users.sync();
                //currentUser.set('Avatar') = file;
            };
            var error = function () {
                navigator.notification.alert("Unfortunately we could not add the image");
            };
            var config = {
                destinationType: Camera.DestinationType.DATA_URL,
                allowEdit: true,
                quality: 50,
                targetHeight: 400,
                targetWidth: 400
            };
            navigator.camera.getPicture(success, error, config);
        };

        var loadImage = function () {
            $("#imageAdd").show();
            $("#imageLoad").hide();

            everlive.Files.get().then(function (data) {
                var files = [];

                data.result.forEach(function (image) {

                    console.log(image.Uri);
                    console.log(image.Filename);
                    if (image.Filename === app.Users.currentUser.get('data').Username + ".jpg")
                    {
                        files.push(image.Uri);
                    }
                });

                files.reverse()
                
                $("#images").kendoMobileListView({
                    dataSource: files,
                    template: "<img src='#: data #'>"
                });
            });
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
            addImage: addImage,
            loadImage: loadImage,
            logout: logout
        };        
    }());
    
    return homepageViewModel;
}());