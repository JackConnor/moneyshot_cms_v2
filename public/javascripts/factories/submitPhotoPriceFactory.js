angular.module('submitPhotoPriceFactory', [])

  .factory('submitPrice', submitPrice);

  submitPrice.$inject = ['$http'];

  function submitPrice($http){
    function updatePhoto(photoId, newPrice){
      return $http({
        method: "POST"
        ,url: "https://moneyshotapi.herokuapp.com/api/accepted/photo"
        ,data: {_id: photoId, price: newPrice, status: "offered for sale"}
      })
    }

    return updatePhoto;
  }
