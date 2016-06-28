angular.module('allPhotosFactory', [])

  .factory('allSavedPhotos', allPhotos);

  allPhotos.$inject = ["$http"];

  function allPhotos($http){
    function getPhotos(){
      return $http({
        method: "GET"
        ,url: "http://192.168.0.9:5555/api/allSavedPhotos"
      })
    }
    return getPhotos;
  }
