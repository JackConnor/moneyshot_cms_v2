angular.module('dashboardController', ['allSubmissionsFactory', 'ngFileUpload'])

  .controller('dashboardCtrl', dashboardCtrl)

  .filter('trustUrl', function ($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  })

  dashboardCtrl.$inject = ['$http','allSavedPhotos', 'submitPrice', 'rejectPhoto', '$sce', 'allSubmissions', 'Upload', '$scope', '$window'];

  function dashboardCtrl($http, allSavedPhotos, submitPrice, rejectPhoto, $sce, allSubmissions, Upload, $scope, $window){
    //////////////////////////////////
    ////////begin all global variables
    var self = this;
    self.currentTab = "allPhotos";///////////this can be set to "allPhotos", "soldPhotos", or "photoStream"
    self.yesNoPopupVariable = false;
    self.submissionsOpen = true;
    self.allPhotosSubmission = false;
    self.singleSubmissionOpen = false;
    self.submissionsOpenAll   = false;
    self.activeSubmission = {}
    self.openSingleSubmission = openSingleSubmission;
    self.selectionActive = false;
    self.openCarousel = false;
    self.allSaved = false;
    //////////end all global variables
    //////////////////////////////////

    ///////function to load all Photos
    allSubmissions()
    .then(function(subs){
      console.log(subs);
      self.allSubmissions = subs.data.reverse().slice(0, 100);
      console.log(self.allSubmissions[10]);
      console.log(self.allSubmissions[100]);
      console.log(self.allSubmissions[600]);
      console.log(self.allSubmissions[623]);
      self.activeSubmission = self.allSubmissions[0];
      console.log(self.activeSubmission);
      var subLength = subs.data.length;
      if(subLength > 21){
        var subLength = 20;
      }
      console.log(subLength);
      self.allPhotos = [];
      self.soldPhotos = [];
    });

    ////////funciotn to click through to single submission
    function openSingleSubmission(submission){
      if(self.submissionsOpen){
        self.activeSubmission = submission;
        self.submissionsOpen = false;
        self.submissionsOpenAll = false;
        self.singleSubmissionOpen = true;
        self.allPhotosSubmission = false;
      }
      else {
        self.activeSubmission = submission;
        self.submissionsOpen = false;
        self.submissionsOpenAll = false;
        self.singleSubmissionOpen = true;
        self.allPhotosSubmission = true;
      }
    }

    function backToList(){
      if(self.allPhotosSubmission === false){
        self.submissionsOpen      = true;
        self.selectionActive      = false;
        self.singleSubmissionOpen = false;
        self.allSaved             = false;
        self.submissionsOpenAll   = false;
      }
      else if(self.allPhotosSubmission){
        self.submissionsOpen      = false;
        self.selectionActive      = false;
        self.allSaved             = false;
        self.singleSubmissionOpen = false;
        self.allPhotosSubmission  = false;
        self.submissionsOpenAll   = true;
      }
      else {
        self.submissionsOpen      = true;
        self.allSaved             = false;
        self.selectionActive      = false;
        self.singleSubmissionOpen = false;
        self.submissionsOpenAll   = false;
      }
    }
    self.backToList = backToList;

    function activateSelection(){
      if(!self.selectionActive){
        self.selectionActive = true;
      }
      else {
        self.selectionActive = false;
        var allSelects = $('.selected')
        var selectsLength = allSelects;
        for (var i = 0; i < selectsLength.length; i++) {
          $(selectsLength[i]).removeClass('selected');
        }
      }
    }
    self.activateSelection = activateSelection;

    function carScrollFunc(){
      console.log('yowza');
    }
    self.carScrollFunc = carScrollFunc;

    $('document').on('scroll', function(evt){
      console.log('yooooo');
      console.log(evt);
    })

    ////function to openCarousel
    function photoClickFunc(evt, index){
      if(self.allSaved){
        $scope.carouselPhotos = self.savedPhotos;
        console.log($scope.carouselPhotos);
      }
      else if(self.singleSubmissionOpen){
        $scope.carouselPhotos = self.activeSubmission.photos;
        console.log($scope.carouselPhotos);
        if(self.allPhotosSubmission){
          console.log($scope.carouselPhotos);
        }
        else {
          console.log('regular------------------------------------');
          var carLength = $scope.carouselPhotos.length;
          console.log(carLength);
          var tempArr = [];
          for (var i = 0; i < carLength; i++) {
            console.log($scope.carouselPhotos[i].status);
            if($scope.carouselPhotos[i].status === 'submitted for sale'){
              console.log('you got one');
              tempArr.push($scope.carouselPhotos[i])
            }
            if(i === carLength-1){
              $scope.carouselPhotos = tempArr;
              console.log($scope.carouselPhotos);
            }
          }
        }
      }
      if(!self.selectionActive){
        self.openCarousel = true;
        $scope.currentCarPhoto = JSON.parse(evt.currentTarget.id);
        setTimeout(function(){
          var off = $(".carouselTunnel").offset();
          var offWindow = $(".photoMiniWindow").offset();
          var tunnelLength = (($scope.carouselPhotos.length)*100)+5
          $($('.carouselTunnel')[0]).css({
            marginLeft: offWindow.left
          })
          var scrollLeft = (100*index);
          $(".carouselOuterTunnel").animate({
            scrollLeft: scrollLeft
          }, 100);
          $(".carouselTunnel").css({
            width: tunnelLength+offWindow.left+2
            ,paddingRight: offWindow.left
          });
          scrollFunc();
        }, 50);
      }
      else if(self.selectionActive === true){
        var isSelected = $(evt.currentTarget).hasClass('selected');
        if(!isSelected){
          $(evt.currentTarget).addClass('selected');
        }
        else {
          $(evt.currentTarget).removeClass('selected');
        }
      }
    }
    self.photoClickFunc = photoClickFunc;

    function scrollFunc(){
      $('.carouselOuterTunnel').scroll(function(evt){
        var leftScr = $(".carouselOuterTunnel").scrollLeft();
        var index = Math.floor(leftScr/100);
        $scope.currentCarPhoto = $scope.carouselPhotos[index];
        $scope.$apply();
      })
    }

    function saveOrRejectFunc(saveOrReject){
      console.log(saveOrReject);
      var photoArr = $('.selected');
      if(saveOrReject === 'reject'){
        var confirming = confirm('Throw away all selcted photos?')
        if(confirming){
          var photoArrLength = photoArr.length;
          for (var i = 0; i < photoArrLength; i++) {
            rejectPhotoFunc(photoArr[i].id, self.activeSubmission._id);
          }
        }
      }
      else if(saveOrReject === 'save'){
        var confirming = confirm('Save all selected photos to sell?')
        if(confirming){
          var photoArrLength = photoArr.length;
          console.log(photoArrLength);
          console.log(photoArr[0]);
          console.log(photoArr[0].id);
          for (var i = 0; i < photoArrLength; i++) {
            console.log(i);
            console.log(typeof photoArr[i].id);
            var stringObject = JSON.parse(photoArr[i].id);
            console.log(stringObject);
            console.log(typeof stringObject);
            var photoId = stringObject._id;
            console.log(photoId);
            acceptPhoto(stringObject, self.activeSubmission._id);
            // if(typeof photoArr[i]=== 'object'){
            //   acceptPhoto(photoArr[i].id, self.activeSubmission._id);
            // }
            // else if(typeof photoArr[i]=== 'string'){
            //   acceptPhoto(JSON.parse(photoArr[i]).id, self.activeSubmission._id);
            // }
          }
        }
      }
    }
    self.saveOrRejectFunc = saveOrRejectFunc;

    function acceptPhoto(photo, submissionId){
      submitPrice(photo._id, submissionId)
      .then(function(acceptedPhoto){
        console.log(acceptedPhoto);
      },function(err){
        console.log(err);
      });
    }
    self.acceptPhoto = acceptPhoto;

    function acceptSinglePhoto(photo, submissionId, acceptOrReject){
      if(acceptOrReject === 'accept'){
        var acceptConfirm = confirm('Save this photo to download later?')
      }
      else if(acceptOrReject === 'reject'){
        var acceptConfirm = confirm('Reject this Photo?')
      }
      if(acceptConfirm){
        if(self.allPhotosSubmission === true){
          acceptPhoto(photo, submissionId)
        }
        if(acceptOrReject === 'accept'){
          acceptPhoto(photo, submissionId);
        }
        else if(acceptOrReject === 'reject'){
          rejectPhotoFunc(photo, submissionId);
        }
        if(self.allPhotosSubmission === false){
          ////////function to remove from carousel
          for (var i = 0; i < $scope.carouselPhotos.length; i++) {
            if($scope.carouselPhotos[i]._id === photo._id){
              console.log('got one');
              $scope.carouselPhotos.splice(i, 1);
              if($scope.carouselPhotos.length === 0){
                exitCarousel();
                backToList();
                for (var i = 0; i < self.allSubmissions.length; i++) {
                  if(self.allSubmissions[i]._id === self.activeSubmission._id){
                    self.allSubmissions.splice(i, 1);
                  }
                }
              }
              else {
                var tunWidth = $($(".carouselTunnel")[0]).css("width").split('px')[0];
                $('.carouselTunnel').css({
                  width: tunWidth-100+'px'
                });
                scrollFunc();
              }
            }
          }
          for (var i = 0; i < self.activeSubmission.photos.length; i++) {
            if(self.activeSubmission.photos[i]._id === photo._id){
              console.log('got one in the submission');
              console.log(self.activeSubmission.photos);
              if(acceptOrReject === 'accept'){
                self.activeSubmission.photos[i].status = 'offered for sale'
              }
              else if(acceptOrReject === 'reject'){
                self.activeSubmission.photos[i].status = 'rejected';
              }
              console.log(self.activeSubmission.photos);
            }
          }
        }
      }
    }
    self.acceptSinglePhoto = acceptSinglePhoto;

    //////function to create a base64 photo form a remote url
    function getBase64FromImageUrl(photo) {
      var confirmSave = confirm('Download this one photo?');
      if(confirmSave){
        var zip = new JSZip();
        JSZipUtils.getBinaryContent(photo.url, function (err, data) {
           if(err) {
              throw err; // or handle the error
           }
           zip.file(photo._id+".jpg", data, {binary:true});
           setTimeout(function(){
             zip.generateAsync({type: 'blob'})
             .then(function(newPhoto){
               var date = new Date();
               saveAs(newPhoto, date);
             })
             .catch(function(err){
               console.log(err);
             })
           }, 3000)

        });
      }
    }
    self.getBase64FromImageUrl = getBase64FromImageUrl;

    function rejectPhotoFunc(photo, submissionId){
      console.log('rejecting');
      rejectPhoto(photo, submissionId)
      .then(function(rejectedPhoto){

      })
      .catch(function(err){
        console.log(err);
      });
    }
    self.rejectPhotoFunc = rejectPhotoFunc;

    // function toggleTabs(){
    //   console.log(self.submissionsOpen);
    //   if(self.submissionsOpen === true){
    //     self.submissionsOpen = false;
    //     self.submissionsOpenAll = true;
    //   }
    //   if(self.submissionsOpen === false){
    //     self.submissionsOpen = true;
    //     self.submissionsOpenAll = false;
    //   }
    // }
    // self.toggleTabs = toggleTabs;

    function exitCarousel(){
      self.openCarousel = false;
    }
    self.exitCarousel = exitCarousel;

    function allSubmissionsFunc(){
      self.submissionsOpen = false;
      self.submissionsOpenAll = true;
      self.allSaved = false;
      self.selectionActive = false;
    }
    self.allSubmissionsFunc = allSubmissionsFunc;

    function unprocessedSubmissionsFunc(){
      self.submissionsOpen = true;
      self.submissionsOpenAll = false;
      self.allSaved = false;
      self.selectionActive = false;
    }
    self.unprocessedSubmissionsFunc = unprocessedSubmissionsFunc;
    // setInterval(function(){
    //   console.log(self.allSaved);
    //   console.log($('.allSavedPhotosContainer'));
    // }, 500);
    function openAllSaved(){
      self.submissionsOpenAll = false;
      self.submissionsOpen = false;
      console.log(self.savedPhotos);
      self.allSaved = true;
      if(self.savedPhotos === undefined){
        allSavedPhotos()
        .then(function(savedPhotos){
          // console.log($('.allSavedPhotosContainer'));
          console.log(savedPhotos);
          self.savedPhotos = savedPhotos.data;
          self.selectionActive = false;
        }, function(err){
          console.log(err);
        })
      }
      else {
        self.savedPhotos;
      }
    }
    self.openAllSaved = openAllSaved;

    /////this function send all saved photos to admin via zip (that haven't been downloaded or which he selects)
    function getSavedPhotos(allSaved){
      console.log(allSaved);
      // var allSaved = self.savedPhotos;
      var savedLength = allSaved.length;
      var zipUrlCache = [];
      var zip = new JSZip();
      for (var i = 0; i < savedLength; i++) {
        var elId = allSaved[i]._id
        if(i !== savedLength-1){
          $http({
            method: "POST"
            ,url: "http://192.168.0.5:5555/api/accepted/savedPhoto"
            ,data: {_id: elId, status: "downloaded"}
          })
          .then(function(updatedPhoto){
            JSZipUtils.getBinaryContent(updatedPhoto.data.url, function (err, data) {
               if(err) {
                  throw err; // or handle the error
               }
               zip.file(updatedPhoto.data._id+".jpg", data, {binary:true});
            });
          });
        }
        else {
          $http({
            method: "POST"
            ,url: "http://192.168.0.5:5555/api/accepted/savedPhoto"
            ,data: {_id: elId, status: "downloaded"}
          })
          .then(function(updatedPhoto){
            JSZipUtils.getBinaryContent(updatedPhoto.data.url, function (err, data) {
               if(err) {
                  throw err; // or handle the error
               }
               zip.file(updatedPhoto.data._id+".jpg", data, {binary:true});
               setTimeout(function(){
                 zip.generateAsync({type: 'blob'})
                 .then(function(newPhoto){
                   var date = new Date();
                   saveAs(newPhoto, date);
                 })
                 .catch(function(err){
                   console.log(err);
                 })
               }, 10000)

            });
          });
        }
      }
    }
    self.getSavedPhotos = getSavedPhotos;

    function getSavedSelected(){
      console.log('yooooo');
      var selectedPhotos = $(".selected");
      console.log(selectedPhotos);
      var selectedPhotosArr = [];
      var selLength = selectedPhotos.length;
      for (var i = 0; i < selLength; i++) {
        selectedPhotosArr.push(JSON.parse(selectedPhotos[i].id));
        console.log(selectedPhotosArr);
        if(i === selLength-1){
          getSavedPhotos(selectedPhotosArr);
        }
      }
    }
    self.getSavedSelected = getSavedSelected;

    function getOldSubmissionPhotos(){
      console.log(self.selectionActive);
      if(self.selectionActive){
        var selectedPhotos = $('.selected');
        var selectedLength = selectedPhotos.length;
        var selectedUrlCache = [];
        for (var i = 0; i < selectedLength; i++) {
          selectedUrlCache.push(JSON.parse(selectedPhotos[i].id));
          console.log(selectedUrlCache);
          if(i === selectedLength-1){
            setTimeout(function(){
              getSavedPhotos(selectedUrlCache);
            }, 200);
          }
        }
      }
      else if(self.selectionActive === false){
        console.log(self.activeSubmission);
        var confirmer = confirm('Download all photos from this set?');
        if(confirmer){
          getSavedPhotos(self.activeSubmission.photos);
        }
      }
    }
    self.getOldSubmissionPhotos = getOldSubmissionPhotos;

    // allPhotos()
    // .then(function(photoList){
    //   console.log(photoList)
    //   self.rawPhotos = photoList.data.reverse();
    //   //////lets add all the sold photos to it's own array
    //   self.soldPhotos = [];
    //   self.allPhotos  = [];
    //   // self.allPhotos  = [];
    //   for (var i = 0; i < self.rawPhotos.length; i++) {
    //     if(self.rawPhotos[i].status == 'sold || offered for sale'){
    //       self.soldPhotos.push(self.rawPhotos[i]);
    //     }
    //     else if(self.rawPhotos[i].status == 'submitted for sale'){
    //       self.allPhotos.push(self.rawPhotos[i])
    //     }
    //   }
    //   self.currentPhoto = self.allPhotos[0];
    //   console.log('all photos')
    //   console.log(self.allPhotos)
    // })

    ////////////function to controler which tab is showing;
  //   self.tabController = function tabController(event){
  //     ///////function checks to see which tab you've clicked on (via the classname), and changes self.currentTab to trigger the html ng-if statements for each tab
  //     var targetClassStream = $(event.currentTarget).hasClass('photoCarouselTab');
  //     var targetClassAll = $(event.currentTarget).hasClass('photoAllTab');
  //     var targetClassSold = $(event.currentTarget).hasClass('photoSoldTab');
  //     if(targetClassStream){
  //       console.log('stream');
  //       self.currentTab = "photoStream";
  //     }
  //     else if(targetClassAll){
  //       console.log('all');
  //       self.currentTab = "allPhotos";
  //     }
  //     else if(targetClassSold){
  //       console.log('sold');
  //       self.currentTab = "soldPhotos";
  //     }
  //   }
  //
  //   self.yesNoPopup = function(){
  //     self.yesNoPopupVariable = true;
  //   }
  //
  //   /////////////functions to submit accepted photo, with price, to the database
  //   self.submitSuccessPhoto = function submitSuccessPhoto(photo){
  //     var price = $('.popupPrice').val();
  //     // var submissionId
  //     submitPrice(photo.photo._id, price, photo.submission)
  //     .then(function(newPhoto){
  //       console.log(newPhoto);
  //       self.soldPhotos.push(newPhoto.data);
  //       self.yesNoPopupVariable = false;
  //       //////function to slice out the photo from the allphotos array
  //       for (var i = 0; i < self.allPhotos.length; i++) {
  //         if(self.allPhotos[i]._id == photo.photo._id){
  //           self.allPhotos.splice(i, 1);
  //         }
  //       }
  //       self.currentPhoto = self.allPhotos[0];
  //     })
  //   }
  //
  //   self.rejectPhoto = function(photo){
  //     rejectPhoto(photo)
  //     .then(function(rejectedPhoto){
  //       console.log(rejectedPhoto);
  //       //////lets clean up the dashboard arrays
  //       /////allPhotosArray
  //       for (var i = 0; i < self.allPhotos.length; i++) {
  //         if(self.allPhotos[i]._id == rejectedPhoto.data._id){
  //           self.allPhotos.splice(i, 1);
  //         }
  //       }
  //       /////soldPhotos array
  //       for (var i = 0; i < self.soldPhotos.length; i++) {
  //         if(self.soldPhotos[i]._id == rejectedPhoto.data._id){
  //           self.soldPhotos.splice(i, 1);
  //         }
  //       }
  //     })
  //   }
  //
  //   /////close popup
  //   self.closePopup = function(){
  //     self.yesNoPopupVariable = false;
  //   }
  //
  //   //////////function to click on a photo to open the photo Popup modal
  //   self.submitPhoto = function(photo){
  //     currentPhotoFunc(photo);
  //     self.yesNoPopupVariable = true;
  //   }
  //
  //   //////////function to downloads file from src
  //   self.downloadPhoto = function(photo) {
  //     var down = document.createElement('a');
  //     down.download = photo.photosubjects.join('_');
  //     down.href = photo.url;
  //     down.click();
  //     self.closePopup();
  //   }
  //
  //   ////function to change a the active current photo to a new one
  //   function currentPhotoFunc(photo){
  //     //////photo is the whole photo object
  //     self.currentPhoto = photo;
  //   }
  //   self.currentPhotoFunc = currentPhotoFunc;
  //
  //   ///////function to have the photo carousel change properly
  //   function nextCarousel(){
  //     self.allPhotos = self.allPhotos.slice(1, self.allPhotos.length);
  //     self.currentPhoto = self.allPhotos[0];
  //     console.log(self.allPhotos);
  //   }
  //   self.nextCarousel = nextCarousel;
  //
  }
