angular.module('submitPhotoPriceFactory', [])

  .factory('submitPrice', submitPrice);

  submitPrice.$inject = ['$http'];

  function submitPrice($http){
    function updatePhoto(photoId, submissionId){
      console.log(submissionId);
      console.log(photoId);
      return $http({
        method: "POST"
        ,url: "http://45.55.24.234:5555/api/accepted/photo"
        ,data: {_id: photoId, status: "offered for sale", submissionId: submissionId}
      })
    }

    return updatePhoto;
  }
