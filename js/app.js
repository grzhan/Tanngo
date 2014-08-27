// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('tanngo', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

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
  }

})
.controller('AccentCtrl', function($scope, $http) {
  $scope.buttonMsg = "Press to record audio";
  $scope.recordState = 0;
  
  $http.get('resources/jpw_recog.json',{cache:true}).success(function(data) {
    $scope.words = data;
    $scope.windex = 0;
  });

  $scope.mediaRec = new Media('/android_asset/dest.amr', 
    function() {
      console.log('Start record audio dest.amr success.');
    }, function(err) {
      console.log('Record audio error: ' + err);
    }
  );

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

});


