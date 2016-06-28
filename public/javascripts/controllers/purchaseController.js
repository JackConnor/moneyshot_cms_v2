angular.module('purchaseController', [])

  .controller('purchaseCtrl', purchaseCtrl);

  purchaseCtrl.$inject = ['$http'];

  function purchaseCtrl($http){
    var self = this;

    function sendPhotoPrice(){
      var price = $('#purchasePhotoPrice').val();
      var photoId = $('#purchasePhotoId').val();
      var photoPublication = $('#purchasePhotoPublication').val();
      console.log(price + photoId);
      $http({
        method: "POST"
        ,url: 'http://192.168.0.122:5555/api/soldPhoto'
        ,data: {photoId: photoId, photoPrice: price}
      })
      .then(function(data){
        console.log(data);
        ///////this needs to be an email callback confirming that they received their email
      })
    }
    self.sendPhotoPrice = sendPhotoPrice;

  //////end controller
  }
