var yaaasDemo = angular.module('yaaasDemo', ['yaaas']);

yaaasDemo.controller('yaaasDemoCtrl',function($scope, yaaaService) {
	
	$scope.yaaaService = yaaaService;
	
	$scope.addAlert = function(level) {
		var timeout = isNaN($scope.alertTime) ? 5 : $scope.alertTime;
		level = level || 'warning';
		yaaaService.addAlert('Title!',
				'This is an important alert.  Please pay attention',
				timeout,level);
	}

});
