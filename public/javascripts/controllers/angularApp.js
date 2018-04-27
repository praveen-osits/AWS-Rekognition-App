
var app = angular.module('RekognitionApp', ['ui.router']);


app.config(['$stateProvider','$urlRouterProvider', '$locationProvider',function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.state('home', {
        url: '/home'
        , templateUrl: '/home.html'
        , controller: 'homeCtrl'
        })
    
    $urlRouterProvider.otherwise('home');
	$locationProvider.html5Mode({
        enabled: true
    });
}]);

// creating service for home
app.factory('rekog', ['$http', function ($http) {
        var o = {
            data:[]
        }
        o.getAllFaults = function () {
           return $http.get('/faults').success(function (data) {
                angular.copy(data, o.data);
            });
        };
        o.postImgData = function (imgData, callback) {
            return $http.post('/imgData', imgData).success(function (data) {
                //o.data.push(data);
                callback(data);
            });
        };
        return o;
    }
]);

/*****************************************************************************/
/*               controller for home                                         */
/*****************************************************************************/
app.controller('homeCtrl', ['$scope', 'rekog',function($scope, rekog) {
	$scope.rekog = rekog.data;
	console.log("data: "+$scope.rekog);
	$scope.RekognitionTypes = [{id:"1",name:"Object and scene detection", description:"Rekognition automatically labels objects, concepts and scenes in your images, and provides a confidence score."},{id:"2",name:"Image moderation", description:"Rekognition automatically detects explicit or suggestive adult content in your images, and provides confidence scores."}];
    //$scope.selectedType = {id:1,name:"Object and scene detection", description:"Rekognition automatically labels objects, concepts and scenes in your images, and provides a confidence score."};
    $scope.selectedType = $scope.RekognitionTypes[0].name;
    $scope.Labels = null;
    $scope.isProccessing = false;

    $scope.uploadImage = function() {
        console.log("uploadImage called");
        var imgFile = document.getElementById('imgUpload').files[0];
        console.log("imgFile", imgFile);
        //return;
		if(imgFile.type != 'image/jpeg'&&imgFile.type != 'image/png'){
			Materialize.toast('Only jpg/png file is allowed.', 2000, 'red');
			return;
		} 
        if($scope.isProccessing){
            Materialize.toast("Already processing another image, please wait and try later.", 2000, 'red');
            return;
        }
        var reader = new FileReader();
		reader.readAsDataURL(imgFile);
		reader.onloadend = function(e){
            var imgData = reader.result;
            $('#imagePreview').attr('src', imgData);
            //console.log("imgData", imgData);
            //return;
            $scope.Labels = null;
            $scope.isProccessing = true;
            //$("#imgUploadPath").addClass('disabled');

            rekog.postImgData({'imageDataUrl':imgData}, function(res){
                console.log("res : ",res);
                if(res.status=="success"){
                    $scope.isProccessing = false;
                    //$("#imgUploadPath").removeClass('disabled');
                    Materialize.toast(res.message, 2000, 'green');
                    $scope.Labels = res.data.Labels;
                } else{
                    $scope.isProccessing = false;
                    //$("#imgUploadPath").removeClass('disabled');
                    Materialize.toast(res.message, 2000, 'red'); 
                }
            });

		}
        
    }
}]);
