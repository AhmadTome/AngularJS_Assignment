var apikey = "2f8796eefe67558dc205b09dd336d022";

var app = angular.module("myApp", []);

// Controllers
app.controller('HomeController', function ($scope,$http,$compile) {
    $scope.reminderText = 'here is the note';

    // Show The Popups if we have reminder today
    if(localStorage.getItem("usersInfo")){
        var today = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        var obj = JSON.parse(localStorage.getItem("usersInfo")) ;
        for(var i=0;i<obj.length;i++){
            if(obj[i].apiKey == apikey){
                var reminder_arr = obj[i].appointment;
                for(var j =0 ; j<reminder_arr.length;j++){
                  if((reminder_arr[j].date).slice(0,10).replace(/-/g,'/') == today&&reminder_arr[j].shown ==false){
                        $scope.reminderText = reminder_arr[j].note;
                        $(".pop-outer").fadeIn("slow");
                        reminder_arr[j].shown=true;
                    }
                }
            }
        }
        obj = JSON.stringify(obj);
        localStorage.setItem("usersInfo",obj);
    }

    // find My location using free API
    var myLocation_url = "http://www.geoplugin.net/json.gp";
    $http.get(myLocation_url).success(function (data) {
        $scope.myCity = data.geoplugin_city;
        $scope.lat = data.geoplugin_latitude;
        $scope.lon = data.geoplugin_longitude;

        // if the city not exist we will search by latitude and longitude
        if($scope.myCity)
            var openWeatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+$scope.myCity+"&cnt=7&appid="+apikey;
        else
            var openWeatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?lat="+$scope.lat+"&lon="+$scope.lon+"&cnt=7&appid="+apikey;

        // API Key 2f8796eefe67558dc205b09dd336d022
        // find the Forecast for 7 days (a week) starting from today
        $http.get(openWeatherUrl).success(function (data) {
            $scope.list_of_forecast = data;
        });

        // find the list of all cities that we can searched
        var cities_url = "https://api.myjson.com/bins/kfvmg";
        $http.get("https://api.myjson.com/bins/kfvmg").success(function (data) {
            $scope.allCity  = data;
        });
    });


    // List of the Events
    // change the forecast to a new city (the city what we searched before and listed under the search term)
    $scope.viewCity = function(event){
        $scope.myCity  = event.target.id;
        var openWeatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+$scope.myCity+"&cnt=7&appid="+apikey;
        $http.get(openWeatherUrl).success(function (data) {
            $scope.list_of_forecast = data;
        });
    };

    // change the forecast to a new city (the city what we searched) and add the city under the search term as a backup
    $scope.changeTheForecast = function (city) {

        if(localStorage.getItem("usersInfo")){
            var obj = JSON.parse(localStorage.getItem("usersInfo")) ;
            for(var i=0;i<obj.length;i++){
                if(obj[i].apiKey == apikey){
                    obj[i].cities.push(city);
                }
            }
            obj = JSON.stringify(obj);
            localStorage.setItem("usersInfo",obj);

        }else{
            var obj = [{"apiKey":apikey, "cities":[city], "appointment":[] }];
            obj = JSON.stringify(obj);
           localStorage.setItem("usersInfo",obj);
        }
        $scope.myCity = city ;
        var openWeatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+$scope.myCity+"&cnt=7&appid="+apikey;
        $http.get(openWeatherUrl).success(function (data) {
            $scope.list_of_forecast = data;
        });

        $(".selected").append('' +
            '        <tr class="addelement">>' +
            '        <td><li class="pull-left"></li>'+  $scope.search  +'</td>' +
            '        <td>' +
            '               <button type="button" aria-label="View"> ' +
            '                    <span ng-click="viewCity($event)" id="'+  $scope.search  +'" aria-hidden="true">view</span>' +
            '               </button>' +
            '        </td>' +
            '        <td>' +
            '               <button type="button" aria-label="View" class="x"> ' +
            '                    <span aria-hidden="true">x</span>' +
            '               </button>' +
            '        </td>' +
            '      </tr>' +
            '');
        $(".x").on("click",function () {
            $(this).closest('.addelement').remove();
        });
        $compile( $(".selected"))($scope);
    };

    // Add new Reminder
    $scope.addReminder = function (date,note) {
        date = $('#reminder').val();
        while (date.indexOf('-') > -1){
            date = date.replace('-','/');
        }
        console.log(date)
        if(localStorage.getItem("usersInfo")){
            var obj = JSON.parse(localStorage.getItem("usersInfo")) ;
            for(var i=0;i<obj.length;i++){
                if(obj[i].apiKey == apikey){
                    obj[i].appointment.push({"date":date,"note":note,"shown":false});
                }
            }
            obj = JSON.stringify(obj);
            localStorage.setItem("usersInfo",obj);
            alert("The Reminder added successfully")

        }else{
            var obj = [{"apiKey":apikey, "cities":[], "appointment":[{"date":date,"note":note,"shown":false}] }];
            obj = JSON.stringify(obj);
            localStorage.setItem("usersInfo",obj);
            alert("The Reminder added successfully")
        }

    };

    // Hide the Popups
    $scope.hideModal = function(){
        $(".pop-outer").fadeOut("slow");

    };
});




