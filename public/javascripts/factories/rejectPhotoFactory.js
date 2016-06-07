angular.module('rejectPhotoFactory', [])

  .factory('rejectPhoto', rejectPhoto);

  rejectPhoto.$inject = ["$http"];

  function rejectPhoto($http){

    function sendRejection(photo){
      console.log(photo);
      return $http({
        method: "POST"
        ,url: "http://192.168.0.17:5555/api/reject/photo"
        ,data: {photoId: photo.photo._id, submissionId: photo.submission}
      })
    }

    return sendRejection;
  }
