angular.module('allPhotosFactory', [])

  .factory('allSavedPhotos', allPhotos);

  allPhotos.$inject = ["$http"];

  function allPhotos($http){
    function getPhotos(){
      return $http({
        method: "GET"
        ,url: "https://moneyshotapi.herokuapp.com/api/allSavedPhotos"
      })
    }
    return getPhotos;
  }
