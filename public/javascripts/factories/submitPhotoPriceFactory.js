angular.module('submitPhotoPriceFactory', [])

  .factory('submitPrice', submitPrice);

  submitPrice.$inject = ['$http'];

  function submitPrice($http){
    function updatePhoto(photoId, newPrice, submissionId){
      return $http({
        method: "POST"
        ,url: "http://192.168.0.17:5555/api/accepted/photo"
        ,data: {_id: photoId, price: newPrice, status: "offered for sale", submissionId: submissionId}
      })
    }

    return updatePhoto;
  }
