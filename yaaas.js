var yaaasApp = angular.module('yaaas', []);

yaaasApp.service('yaaaService',function($timeout, $rootScope) {
  var Alert = function(title,text,timeout,alertLevel) {
	  this.title = title || '';
	  this.text = text || '';
	  this.timeout = timeout || 5;
	  this.alertLevel = alertLevel || 'info';
	  this.timestamp = new Date();
  };
  
  Alert.prototype.isLevel = function(level) {
	  return this.alertLevel==level;
  };
  
  var yaaas = {};
  
  var _alerts = [];
  var _alertsHistory = [];
  
  yaaas.removeAlert = function(alert) {
	  var i = _alerts.indexOf(alert);
	  _alerts.splice(i,1);
	  $rootScope.yaaasAlerts = _alerts;
	  $rootScope.$digest();
  };
  
  yaaas.addAlert = function(title, text, timeout, alertLevel) {
	  var alert = new Alert(title,text,timeout,alertLevel);
	  _alertsHistory.push(alert);
	  _alerts.push(alert);
	  if (timeout>0) {
		  $timeout(function() {
			  yaaas.removeAlert(alert);
		  }, alert.timeout * 1000);
	  }
	  $rootScope.yaaasAlerts=_alerts;
	  //$rootScope.$digest();
  };
  
  yaaas.getAlertsHistory = function() {
	  return _alertsHistory;
  };
  
  
  return yaaas;
});

yaaasApp.directive('yaaAlert', function() {
	return {
		restrict: 'EA',
		templateUrl: 'bower_components/yaaas.tpl.html'
	};
});
	