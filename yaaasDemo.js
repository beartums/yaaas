var yaaasDemo = angular.module('yaaasDemo', ['yaaas']);

yaaasDemo.controller('yaaasDemoCtrl',function($scope, yaaaService) {
	
	$scope.yaaaService = yaaaService;
	
	$scope.addAlert = function(level,name) {
		var timeout = name=='dir1' ? $scope.alertTime1 : $scope.alertTime2
		var timeout = isNaN(timeout) ? 5 : timeout;
		level = level || 'warning';
		yaaaService.addAlert('Title!',
				'This is an important alert.  Please pay attention',
				timeout,level,name,new Error('help','this is my eror').stack);
	}

});
