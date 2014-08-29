// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('tanngo', ['ionic'])

.run(function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    // if(window.cordova && window.cordova.plugins.Keyboard) {
    //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    // }
    // if(window.StatusBar) {
    //   StatusBar.styleDefault();
    // }
    $rootScope.serverURL = "http://192.168.56.1/Tanngo/upload.php";
  });
});

angular.module('tanngo', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views : {
        'home-tab' : {
          templateUrl: "home.html"
        }
      }
    })
    .state('tabs.settings', {
      url: "/settings",
      views: {
        'settings-tab' : {
          templateUrl: "settings.html"
        }
      }
    })
    .state('tabs.about', {
      url: "/about",
      views : {
        'about-tab' : {
          templateUrl: "about.html"
        }
      }
    })
    .state('tabs.manage', {
      url: "/manage",
      views: {
        'home-tab' : {
          templateUrl: "manage.html",
          controller: 'WordManageCtrl'
        }
      }
    })
    .state('tabs.accent', {
      url: "/accent",
      views: {
        'home-tab' : {
          templateUrl: "accent.html",
          controller: 'AccentCtrl'
        }
      }
    })
    .state('tabs.four', {
      url: "/four",
      views: {
        'home-tab' : {
          templateUrl: "four.html",
          controller: 'FourCtrl'
        }
      }
    })
    .state('tabs.test', {
      url: "/test",
      views: {
        'home-tab' : {
          templateUrl: 'test.html',
          controller: 'TestCtrl'
        }
      }
    });

    $urlRouterProvider.otherwise('/tab/home');
})

.controller('WordManageCtrl', function($scope,$http, $ionicModal) {
  $scope.words = [];
  $scope.isSuccess = false;
  $http.get('resources/jpw_sample.json', {cache:true}).success(function(data) {
      $scope.words = data;
      $scope.isSuccess = true;
      console.log('JSON FILE GOT SUCCESS.');
  });

  $ionicModal.fromTemplateUrl('word_modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function(word) {
    $scope.activeWord = word;
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.audioPlay = function(word) {
    var url = '/android_asset/tts/tts_' + word.wid + '.mp3';
    console.log(url);
    var tts_media = new Media(url, 
        function() {
          console.log("playAudio(): Audio Success");
          tts_media.release();
        },
        function(err) {
          console.log("playAudio(): Audio Err " + err);
        }
    );
    tts_media.play();
  };

})
.controller('AccentCtrl', function($scope, $rootScope, $http, $ionicModal) {
  $scope.buttonMsg = "Press to record audio";
  $scope.recordState = 0;
  
  $http.get('resources/jpw_recog.json',{cache:true}).success(function(data) {
    $scope.words = data;
    $scope.windex = 0;
  });

  $ionicModal.fromTemplateUrl('accent_modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function(word) {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  var audio_file = 'tanngo_src.amr';
  $scope.mediaRec = new Media(audio_file, 
    function() {
      console.log('Start record audio dest.amr success.');
    }, function(err) {
      console.log('Record audio error: ' + err);
    }
  );

  var server_url = "http://192.168.56.1/Tanngo/upload.php";
  var ft = new FileTransfer();
  var options = new FileUploadOptions();
  var fileURI = '/sdcard/' + audio_file;

  options.fileKey = "file";
  options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
  options.mimeType = "multipart/form-data";

  $scope.record = function() {
    if ($scope.recordState == 0){
      $scope.buttonMsg = "Recoding...please speak";
      $scope.recordState =1;
      $scope.mediaRec.startRecord();
      console.log('Media Starting record... ')
    } else if ($scope.recordState == 1) {

      $scope.buttonMsg = "Putting data to server...";
      $scope.recordState = 2;
      $scope.mediaRec.stopRecord();
      console.log('Record stopped.');
      var params = {};
      params.rome = $scope.words[$scope.windex].rome;
      options.params = params;

      ft.upload(fileURI,encodeURI(server_url),
        function(resp){
          $scope.recordState = 0;
          $scope.openModal();
          $scope.buttonMsg = "Press to record audio";
          $scope.response = JSON.parse(resp.response);
        },function(error){
          $scope.recordState = 3;
          $scope.buttonMsg = "Error Occured";
        }, options);

    }
  };

  $scope.windexAdd = function() {
    if (($scope.windex < $scope.words.length -1) && ($scope.recordState == 0) ){
      $scope.windex = $scope.windex + 1;
    }
  };

  $scope.windexMinus = function() {
    if (($scope.windex > 0) && ($scope.recordState == 0)) {
      $scope.windex = $scope.windex -1;
    }
  };

  $scope.audioPlay = function(word) {
    var url = '/android_asset/tts_a/tts_' + word.wid + '.mp3';
    console.log(url);
    var tts_media = new Media(url, 
        function() {
          console.log("playAudio(): Audio Success");
          tts_media.release();
        },
        function(err) {
          console.log("playAudio(): Audio Err " + err);
        }
    );
    tts_media.play();
  };

})
.controller('FourCtrl', function($scope,$http){
  $http.get('resources/jpw_sample.json').success(function(data){
    $scope.words = data;
    $scope.randomWords = [];
    for (var i=0; i<4;i++) {
      var rand = Math.floor(Math.random() * $scope.words.length);
      $scope.randomWords.push($scope.words[rand]);
      console.log(rand);
    }
  });
  $scope.audioPlay = function(word) {
    var url = '/android_asset/tts/tts_' + word.wid + '.mp3';
    console.log(url);
    var tts_media = new Media(url, 
        function() {
          console.log("playAudio(): Audio Success");
          tts_media.release();
        },
        function(err) {
          console.log("playAudio(): Audio Err " + err);
        }
    );
    tts_media.play();
  };
})
.controller('TestCtrl' , function($scope,$http,$ionicModal) {
  $scope.windex = 0;
  $scope.ans = '...';
  $http.get('resources/jpw_sample.json').success(function(data){
    $scope.raw = data;
    $scope.words = [];
    for (var i=0; i<5;i++) {
      var rand = Math.floor(Math.random() * $scope.raw.length);
      $scope.words.push($scope.raw[rand]);
    }
  }); 

  $scope.audioPlay = function(word) {
    var url = '/android_asset/tts/tts_' + word.wid + '.mp3';
    console.log(url);
    var tts_media = new Media(url, 
        function() {
          console.log("playAudio(): Audio Success");
          tts_media.release();
        },
        function(err) {
          console.log("playAudio(): Audio Err " + err);
        }
    );
    tts_media.play();
  };  

  $scope.windexAdd = function() {
    if (($scope.windex < $scope.words.length -1)){
      $scope.windex = $scope.windex + 1;
    }
  };

  $scope.windexMinus = function() {
    if (($scope.windex > 0)) {
      $scope.windex = $scope.windex -1;
    }
  };  

  $scope.check = function(ans) {
    console.log(ans);
    console.log($scope.words[$scope.windex].kana);
    if ($scope.ans == $scope.words[$scope.windex].kana) {
      $scope.state = "BINGO";
    } else {
      $scope.state = "WRONG";
    }
    $scope.openModal();
  };

  $ionicModal.fromTemplateUrl('test_modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function(word) {
    $scope.activeWord = $scope.words[$scope.windex];
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

});


