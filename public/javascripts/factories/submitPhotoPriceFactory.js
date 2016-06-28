angular.module('submitPhotoPriceFactory', [])

  .factory('submitPrice', submitPrice);

  submitPrice.$inject = ['$http'];

  function submitPrice($http){
    function updatePhoto(photoId, submissionId){
      console.log(photoId);
      console.log(submissionId);
      return $http({
        method: "POST"
        ,url: "http://192.168.0.3:5555/api/accepted/photo"
        ,data: {_id: photoId, status: "offered for sale", submissionId: submissionId}
      })
    }

    return updatePhoto;
  }
