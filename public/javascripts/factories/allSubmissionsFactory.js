angular.module('allSubmissionsFactory', [])

  .factory('allSubmissions', allSubmissions);

  allSubmissions.$inject = ['$http'];

  function allSubmissions($http){

    function getSubs(){
      return $http({
        method: "GET"
        ,url: "http://45.55.24.234:5555/api/all/submissions"
      });
    }

    return getSubs;
  }
