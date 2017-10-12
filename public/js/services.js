angbootApp.service('ApiService',function($http,$location){

    var server = $location.host();
    var port = $location.port();
    var protocol = "https";

    function postData(url,data,successCallback,errorCallback){
      
        $http.post(url + '/',data).then(function(res){
            successCallback(res);
        },function(err){
            errorCallback(err);
        });
    }

    function getData(url,successCallback,errorCallback){
        $http.get(url + '/').then(function(res){
            successCallback(res);
        },function(err){
            errorCallback(err);
        });

    }

    return({
        postData : postData,
        getData  : getData
    });
});
