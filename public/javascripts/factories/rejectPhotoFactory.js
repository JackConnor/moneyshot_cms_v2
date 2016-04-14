angular.module('rejectPhotoFactory', [])

  .factory('rejectPhoto', rejectPhoto);

  rejectPhoto.$inject = ["$http"];

  function rejectPhoto($http){

    function sendRejection(photoId){
      return $http({
        method: "POST"
        ,url: "https://moneyshotapi.herokuapp.com/api/reject/photo"
        ,data: {photoId: photoId}
      })
    }

    return sendRejection;
  }
