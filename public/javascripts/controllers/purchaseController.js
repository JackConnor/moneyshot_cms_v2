angular.module('purchaseController', [])

  .controller('purchaseCtrl', purchaseCtrl);

  purchaseCtrl.$inject = ['$http'];

  function purchaseCtrl($http){
    var self = this;
    self.purchaseModalBool = false;



    function sendPhotoPrice(){
      // var price = $('#purchasePhotoPrice').val();
      var photoId = $('#purchasePhotoId').val();
      var price = $('#purchasePhotoPrice').val();
      self.userPrice = price;
      // var photoPublication = $('#purchasePhotoPublication').val();
      // console.log(price + photoId);
      $http({
        method: "GET"
        ,url: "http://192.168.0.9:5555/api/photo/"+photoId
      })
      .then(function(data){
        console.log(data);
        self.purchaseModalBool = true;
        self.photoToSell = data.data;
      })
    }
    self.sendPhotoPrice = sendPhotoPrice;

    function sendEmail(){
      var price = $('#purchasePhotoPrice').val();
      var photoId = $('#purchasePhotoId').val();
      var photoPublication = $('#purchasePhotoPublication').val();
      $http({
        method: "POST"
        ,url: 'http://192.168.0.9:5555/api/soldPhoto'
        ,data: {photoId: photoId, photoPrice: price, purchaser: photoPublication}
      })
      .then(function(data){
        console.log(data);
        if(data.data.message = "Success"){
          alert('Your Photo has been sent!')
          // window.location.reload();
        }
        else {
          alert('There was a problem, please try again');
        }
      })
    }
    self.sendEmail = sendEmail;

  //////end controller
  }
