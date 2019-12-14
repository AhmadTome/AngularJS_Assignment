angular.module('ForecastApi',[]).service('ForecastApi', function() {
    this.ForecastUrl = function (city,lat,lon) {

        if(city)
            var openWeatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+city+"&cnt=7&appid="+apikey;
        else
            var openWeatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?lat="+lat+"&lon="+lon+"&cnt=7&appid="+apikey;

        return openWeatherUrl;
    }
});