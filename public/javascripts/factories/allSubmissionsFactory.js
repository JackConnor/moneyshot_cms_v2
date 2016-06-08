angular.module('allSubmissionsFactory', [])

  .factory('allSubmissions', allSubmissions);

  allSubmissions.$inject = ['$http'];

  function allSubmissions($http){

    function getSubs(){
      return $http({
        method: "GET"
        ,url: "https://moneyshotapi.herokuapp.com/api/all/submissions"
      });
    }

    return getSubs;
  }
