

angular.module('Pal_citiesApi',[]).service('Pal_citiesApi', function() {
    this.Pal_citiesUrl = function () {
        var citiesUrl = "https://api.myjson.com/bins/kfvmg";
        console.log(citiesUrl)
        return citiesUrl;
    }
});
