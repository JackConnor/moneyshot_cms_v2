angular.module('rejectPhotoFactory', [])

  .factory('rejectPhoto', rejectPhoto);

  rejectPhoto.$inject = ["$http"];

  function rejectPhoto($http){

    function sendRejection(photo){
      console.log(photo);
      return $http({
        method: "POST"
        ,url: "https://moneyshotapi.herokuapp.com/api/reject/photo"
        ,data: {photoId: photo.photo._id, submissionId: photo.submission}
      })
    }

    return sendRejection;
  }
