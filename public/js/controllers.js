angbootApp.controller('AppCtrl', function AppCtrl($scope, $location, $rootScope, $http, ApiService, SweetAlert) {

	/* ------------------------- SCOPE LEVEL DECLARATIONS -------------------------------------- */
	//$scope.showError = false;
	//$scope.isAdmin = false;

	/* ------------------------- OPERATIONAL CODE -------------------------------------- */
	checkAuthorization();


	/* ------------------------- SCOPE LEVEL FUNCTIONS -------------------------------------- */
	$scope.getLinkedInData = function() {
		if(!$scope.hasOwnProperty("userprofile")){
			IN.API.Profile("me").fields(
					[ "id", "firstName", "lastName", "pictureUrl",
							"publicProfileUrl" ]).result(function(result) {
				// set the model
				$rootScope.$apply(function() {
					var userprofile =result.values[0]
					$rootScope.userprofile = userprofile;
					$rootScope.loggedUser = true;
					createDataObject(userprofile);
					checkAdminAuth();
			    	//go to main
					$location.path("/main");
				});
			}).error(function(err) {
				$scope.error = err;
			});
		}
	};
  //logout and go to login screen
	$scope.logoutLinkedIn = function() {
    //retrieve values from LinkedIn
		IN.User.logout();
		delete $rootScope.userprofile;
		$rootScope.loggedUser = false;
		$location.path("/login");
	};

	// save the entry
	$scope.submitData = function(){
		if($scope.data.text){
			$scope.showError = false;
			var o = {};
			o.name = $scope.data.username;
			o.text = $scope.data.text;
			o.user = $rootScope.userprofile;
			//console.log(o);
			ApiService.postData('/data/save',o,function(res){
				SweetAlert.swal("Good job!", "Your confession has been saved!", "success");
			},function(err){
				SweetAlert.swal("Error!", "Please try again!", "error");
			});
			/**/
		}
		else{
			$scope.showError = true;
		}
	}


    // function to go to timeline
    $scope.goToTimeline = function(){
        $location.path('/timeline');
    };


	/* ------------------------- OTHER FUNCTIONS -------------------------------------- */

	// check the user is authorized or not
	function checkAuthorization(){
		if(!$rootScope.userprofile){
			$location.path("/login");
		}
	}

	//check authorization for timeline
	function checkAdminAuth(){
		var data = {};
		data.user = $rootScope.userprofile;
		ApiService.postData('/auth/check',data,function(res){
			$scope.isAdmin = true;
            //console.log("is Admin : ",$scope.isAdmin);
		},function(err){
			$scope.isAdmin = false;
		});
	}


	/* ------------------------- UTILITY FUNCTIONS -------------------------------------- */

	// create the dropdown object
	function createDataObject(userprofile){
		$scope.data = {};
		$scope.data.option1 = userprofile.firstName + " " + userprofile.lastName;
		$scope.data.option2 = "Anonymous";
		$scope.data.username = $scope.data.option1;
		$scope.data.text = "";
	}

});

/* ========================= LOGIN CTRL =============================================================== */

angbootApp.controller('LoginCtrl',function($scope,$rootScope,$http){

		$scope.signIn = function(){
			IN.User.authorize(function(){
				console.log("authorized");
				$scope.getLinkedInData();
			})
		};
});

/* ========================= TIMELINE CTRL =============================================================== */

angbootApp.controller('TimelineCtrl',function($scope,$rootScope,$http,ApiService){

    /* ------------------------- SCOPE LEVEL DECLARATIONS -------------------------------------- */

    $scope.UnreadEvents = [];

    /* ------------------------- OPERATING FUNCTIONS -------------------------------------- */

    getUnreadEvents();


    /* ------------------------- API CALL(Data Gathering) FUNCTIONS -------------------------------------- */

    //function to get the various types of data entries
    function getUnreadEvents(){

        ApiService.getData('/data/unread',function(response){
            $scope.UnreadEvents = createEvents(response.data);
        },function(err){
            alert("there is an error in data retrieval");
        })
    }

    /* ------------------------- EVENTS CREATION FUNCTIONS -------------------------------------- */

    // create events based on the data supplied
    function createEvents(eventArray){

        var finalEvents = [];

        eventArray.forEach(function(e){
            var o = {};
            o.badgeClass = "info";
            o.badgeIconClass = "glyphicon-credit-card";
            o.title = e.name + "  ("+e.date+")";
            o.content = e.text;
            finalEvents.push(o);
        });

        return finalEvents;
    }


});
