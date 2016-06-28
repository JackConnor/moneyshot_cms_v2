angular.module('dashboardController', ['allSubmissionsFactory', 'ngFileUpload'])

  .controller('dashboardCtrl', dashboardCtrl)

  .filter('trustUrl', function ($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  })

  dashboardCtrl.$inject = ['$http','allSavedPhotos', 'submitPrice', 'rejectPhoto', '$sce', 'allSubmissions', 'Upload'];

  function dashboardCtrl($http, allSavedPhotos, submitPrice, rejectPhoto, $sce, allSubmissions, Upload){
    //////////////////////////////////
    ////////begin all global variables
    var self = this;
    self.currentTab = "allPhotos";///////////this can be set to "allPhotos", "soldPhotos", or "photoStream"
    self.yesNoPopupVariable = false;
    self.submissionsOpen = true;
    self.singleSubmissionOpen = false;
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
      self.allSubmissions = subs.data.reverse();
      self.activeSubmission = self.allSubmissions[0];
      var subLength = subs.data.length;
      if(subLength > 21){
        var subLength = 20;
      }
      console.log(subLength);
      self.allPhotos = [];
      self.soldPhotos = [];
      // for (var i = 0; i < subLength; i++) {
      //   console.log(self.allSubmissions[i].photos);
      //   var photoLength = self.allSubmissions[i].photos.length;
      //   console.log(photoLength);
      //   for (var k = 0; k < photoLength; k++) {
      //     self.allSubmissions[i].photos[k].meta = self.allSubmissions[i].metadata;
      //     if(self.allSubmissions[i].photos[k].status == 'sold || offered for sale'){
      //       self.soldPhotos.push(self.allSubmissions[i].photos[k]);
      //     }
      //     else if(self.allSubmissions[i].photos[k].status == 'submitted for sale'){////submitted for sale means it comes from the user
      //       self.allPhotos.push({photo: self.allSubmissions[i].photos[k], submission: self.allSubmissions[i]._id});
      //     }
      //     console.log(self.allPhotos);
      //     console.log(self.soldPhotos);
      //   }
      // }
      // console.log(allPhotos);
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
      console.log(self.allPhotosSubmission);
      if(self.allPhotosSubmission === false){
        console.log('normal');
        self.submissionsOpen = true;
        self.selectionActive = false;
        self.singleSubmissionOpen = false;
        self.submissionsOpenAll = false;
      }
      else if(self.allPhotosSubmission){
        console.log('all submissions');
        self.submissionsOpen = false;
        self.selectionActive = false;
        self.singleSubmissionOpen = false;
        self.allPhotosSubmission = false;
        self.submissionsOpenAll = true;
      }
    }
    self.backToList = backToList;

    function activateSelection(){
      if(!self.selectionActive){
        self.selectionActive = true;
      }
      else {
        self.selectionActive = false;
      }
    }
    self.activateSelection = activateSelection;

    function photoClickFunc(evt){
      if(!self.selectionActive){
        self.singleSubmissionOpen = false;
        self.openCarousel = true;
      }
      else if(self.selectionActive === true){
        var isSelected = $(evt.currentTarget).hasClass('selected');
        if(!isSelected){
          console.log(evt.currentTarget);
          $(evt.currentTarget).addClass('selected');
        }
        else {
          $(evt.currentTarget).removeClass('selected');
        }
      }
    }
    self.photoClickFunc = photoClickFunc;

    function saveOrRejectFunc(saveOrReject){
      console.log(saveOrReject);
      var photoArr = $('.selected');
      if(saveOrReject === 'reject'){
        var confirming = confirm('Throw away all selcted photos?')
        if(confirming){
          var photoArrLength = photoArr.length;
          for (var i = 0; i < photoArrLength; i++) {
            rejectPhotoFunc(photoArr[i].id, self.activeSubmission);
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
            acceptPhoto(photoArr[i], self.activeSubmission._id);
          }
        }
      }
    }
    self.saveOrRejectFunc = saveOrRejectFunc;

    function acceptPhoto(photo, submissionId){
      console.log(photo);
      console.log('saving');
      submitPrice(photo.id, submissionId)
      .then(function(acceptedPhoto){
        console.log(acceptedPhoto);
      },function(err){
        console.log(err);
      });
    }
    self.acceptPhoto = acceptPhoto;

    function rejectPhotoFunc(photo, submission){
      console.log('rejecting');
      rejectPhoto(photo, submission._id)
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

    function openAllSaved(){
      console.log('rolling');
      allSavedPhotos()
      .then(function(savedPhotos){
        console.log(savedPhotos);
        self.savedPhotos = savedPhotos.data;
        self.submissionsOpen = false;
        self.submissionsOpenAll = false;
        self.selectionActive = false;
        self.allSaved = true;
      }, function(err){
        console.log(err);
      })
    }
    self.openAllSaved = openAllSaved;

    /////this function send all saved photos to admin via zip (that haven't been downloaded or which he selects)
    function getSavedPhotos(){
      var allSaved = self.savedPhotos;
      var savedLength = allSaved.length;
      var emailCache = [];
      var zipUrlCache = [];
      var zip = new JSZip();
      for (var i = 0; i < savedLength; i++) {
        var elId = allSaved[i]._id
        if(i !== savedLength-1){
          $http({
            method: "POST"
            ,url: "https://moneyshotapi.herokuapp.com/api/accepted/savedPhoto"
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
            ,url: "https://moneyshotapi.herokuapp.com/api/accepted/savedPhoto"
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
                   saveAs(newPhoto, "hello.zip");
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
