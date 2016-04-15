angular.module('passwordController', [])

  .controller('passwordCtrl', passwordCtrl);

  passwordCtrl.$inject = ['$http', '$scope'];

  function passwordCtrl($http, $scope){
    console.log('lol');
    var userId = window.location.hash.split('/')[3];
    console.log(userId);
    console.log('sumthin');

    function newPw(){
      var newPass = $('.newPassword').val();
      var confirmNewPw = $('.newPassword').val();
      var pwArr = newPass.split('');
      //////check for length////
      if(pwArr.length < 6){
        alert('sorry, your password must be at least 6 characters');
        $('.signupPassword').val('');
        $('.signupConfirmPassword').val('');
        return false;
      }
      else{
        console.log('password accepted');
        if(newPass === confirmNewPw){
          console.log('pw match');
          $http({
            method: "POST"
            ,url: 'https://moneyshotapi.herokuapp.com/api/update/pw'
            ,data: {_id: userId, password: newPass}
          })
          .then(function(updatedUser){
            console.log(updatedUser);
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

              window.location.href="mopho://";
            }
            else {
              console.log('not a device');
              alert('your password has been changed, please log into our app again');
            }
          })
        }
        else {
          alert('your passwords do not match');
        }
      }
      /////
    }
    $scope.newPw = newPw;
  }
