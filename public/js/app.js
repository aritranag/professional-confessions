// create module for custom directives
var angbootApp = angular.module('angbootApp',['angular-timeline','oitozero.ngSweetAlert']).config(
	[ '$routeProvider', '$locationProvider','$httpProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider.when('/login', {
			templateUrl : 'views/login.html'
		}).when('/main', {
			templateUrl : 'views/main.html',
			controller : 'AppCtrl'
		}).when('/timeline',{
			templateUrl : 'views/timeline.html',
			controller : 'TimelineCtrl'
		}).otherwise({
			redirectTo : '/login'
		});
	}
	]);
