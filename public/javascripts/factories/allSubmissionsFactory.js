angular.module('allSubmissionsFactory', [])

  .factory('allSubmissions', allSubmissions);

  allSubmissions.$inject = ['$http'];

  function allSubmissions($http){

    function getSubs(){
      return $http({
        method: "GET"
        ,url: "http://192.168.0.9:5555/api/all/submissions"
      });
    }

    return getSubs;
  }
