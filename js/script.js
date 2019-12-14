var apikey = "2f8796eefe67558dc205b09dd336d022";

var app = angular.module("myApp", ['myLocationApi','ForecastApi','Pal_citiesApi']);


// Controllers
app.controller('HomeController', function ($http,$compile, myLocationApi , ForecastApi , Pal_citiesApi) {
    var vm = this;
    vm.searched = [];

    vm.reminderText = 'here is the note';
    // Show The Popups if we have reminder today
    if(localStorage.getItem("usersInfo")){
        var today = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        var obj = JSON.parse(localStorage.getItem("usersInfo")) ;
        for(var i=0;i<obj.length;i++){
            if(obj[i].apiKey == apikey){
                var reminder_arr = obj[i].appointment;
                for(var j =0 ; j<reminder_arr.length;j++){
                  if((reminder_arr[j].date).slice(0,10).replace(/-/g,'/') == today&&reminder_arr[j].shown ==false){
                        vm.reminderText = reminder_arr[j].note;
                      vm.showModalPopups=true;
                        reminder_arr[j].shown=true;
                    }
                }
            }
        }
        obj = JSON.stringify(obj);
        localStorage.setItem("usersInfo",obj);
    }

    // find My location using free API

    var myLocation_url = myLocationApi.myLocationUrl();
    $http.get(myLocation_url).success(function (data) {
        vm.myCity = data.geoplugin_city;
        vm.lat = data.geoplugin_latitude;
        vm.lon = data.geoplugin_longitude;


        // API Key 2f8796eefe67558dc205b09dd336d022
        // find the Forecast for 7 days (a week) starting from today
        var openWeatherUrl = ForecastApi.ForecastUrl(vm.myCity,vm.lat,vm.lon);
        $http.get(openWeatherUrl).success(function (data) {
            vm.list_of_forecast = data;
        });

        // find the list of all cities that we can searched
        var cities_url = Pal_citiesApi.Pal_citiesUrl() ;
        $http.get(cities_url).success(function (data) {
            vm.allCity = [];
            for(var i=0;i<data.length;i++){
                vm.allCity.push(data[i].name)
            }
            console.log(vm.allCity)
        });
    });

    vm.complete = function(string){

        vm.hidethis = false;
        var output = [];
        angular.forEach(vm.allCity, function(country){

            if(country.toLowerCase().indexOf(string.toLowerCase()) >= 0)
            {
                output.push(country);
            }
        });
        vm.filterCountry = output;
        console.log(vm.filterCountry)

    }
    vm.fillTextbox = function(string){
        vm.search = string;
        vm.hidethis = true;
    }

    // List of the Events
    // change the forecast to a new city (the city what we searched before and listed under the search term)
    vm.viewCity = function(event){

        vm.myCity  = event.target.className;
        var openWeatherUrl = ForecastApi.ForecastUrl(vm.myCity,vm.lat,vm.lon);
        $http.get(openWeatherUrl).success(function (data) {
            vm.list_of_forecast = data;
        });
    };

    // change the forecast to a new city (the city what we searched before and listed under the search term)
    vm.deleteCity = function(event){
        vm.myCity  = event.target.className;
        vm.searched = vm.searched.filter(e => e !== vm.myCity);
    };

    // change the forecast to a new city (the city what we searched) and add the city under the search term as a backup
    vm.changeTheForecast = function (city) {

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
        vm.myCity = city ;
        var openWeatherUrl = ForecastApi.ForecastUrl(vm.myCity,vm.lat,vm.lon);
        $http.get(openWeatherUrl).success(function (data) {
            vm.list_of_forecast = data;
        });


        vm.searched.push(vm.search)
        $compile( vm.selected)(vm);


    };

    // Add new Reminder
    vm.addReminder = function (date,note) {

        date = document.querySelector('#reminder').value;
        while (date.indexOf('-') > -1){
            date = date.replace('-','/');
        }
        console.log(date)
        console.log(note)
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
    vm.hideModal = function(){
        vm.showModalPopups = false;
    };
});




