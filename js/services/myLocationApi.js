

angular.module('myLocationApi',[]).service('myLocationApi', function() {
    this.myLocationUrl = function () {
        var myLocation_url = "http://www.geoplugin.net/json.gp";
        return myLocation_url;
    }
});