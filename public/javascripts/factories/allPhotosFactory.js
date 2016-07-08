angular.module('allPhotosFactory', [])

  .factory('allSavedPhotos', allPhotos);

  allPhotos.$inject = ["$http"];

  function allPhotos($http){
    function getPhotos(){
      return $http({
        method: "GET"
        ,url: "http://45.55.24.234:5555/api/allSavedPhotos"
      })
    }
    return getPhotos;
  }
