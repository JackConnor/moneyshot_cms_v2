angular.module('allPhotosFactory', [])

  .factory('allPhotos', allPhotos);

  allPhotos.$inject = ["$http"];

  function allPhotos($http){
    function getPhotos(){
      return $http({
        method: "GET"
        ,url: "https://moneyshotapi.herokuapp.com/api/allPhotos"
      })
    }
    return getPhotos;
  }
