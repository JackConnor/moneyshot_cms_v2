angular.module('rejectPhotoFactory', [])

  .factory('rejectPhoto', rejectPhoto);

  rejectPhoto.$inject = ["$http"];

  function rejectPhoto($http){

    function sendRejection(photo, submissionId){
      console.log(photo);
      console.log(submissionId);
      return $http({
        method: "POST"
        ,url: "http://45.55.24.234:5555/api/reject/photo"
        ,data: {photoId: photo, submissionId: submissionId}
      })
    }

    return sendRejection;
  }
