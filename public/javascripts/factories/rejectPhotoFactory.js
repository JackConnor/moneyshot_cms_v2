angular.module('rejectPhotoFactory', [])

  .factory('rejectPhoto', rejectPhoto);

  rejectPhoto.$inject = ["$http"];

  function rejectPhoto($http){

    function sendRejection(photo, submissionId){
      console.log(photo);
      console.log(submissionId);
      return $http({
        method: "POST"
        ,url: "https://moneyshotapi.herokuapp.com/api/reject/photo"
        ,data: {photoId: photo, submissionId: submissionId}
      })
    }

    return sendRejection;
  }
