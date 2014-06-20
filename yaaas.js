var yaaasApp = angular.module('yaaas', []);

yaaasApp.constant('template',
		"<div class='yaaasList'>\n" +
			"<div ng-repeat='alert in yaaasAlerts' \n" +
				"class='alert yaaasItem' \n" +
				"ng-class=\"{'alert-info':alert.isLevel('info'),\n" +
							"'alert-warning':alert.isLevel('warning'),\n" +
							"'alert-danger':alert.isLevel('danger'),\n" +
							"'alert-success':alert.isLevel('success')}\">\n" +
							"<button type='button' class='close' aria-hidden='true' ng-click='alert.removeMe()'>&times;</button>" +
							"<strong>{{alert.title}} </strong>{{alert.text}}\n" +
			"</div>\n" +
		"</div>\n"
		)
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
  Alert.prototype.removeMe = function() {
	  yaaas.removeAlert(this);
  };
  
  var yaaas = {};
  
  var _alerts = [];
  var _alertsHistory = [];
  
  yaaas.removeAlert = function(alert) {
	  var i = _alerts.indexOf(alert);
	  _alerts.splice(i,1);
	  $rootScope.yaaasAlerts = _alerts;
	  //$rootScope.$digest();
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

yaaasApp.directive('yaaAlert', function(template) {
	return {
		restrict: 'EA',
		template: template.replace('yaaasList','yaaas-alerts')
		.replace('yaaasItem','yaaas-alert')
	};
});

yaaasApp.directive('yaaAlertPlus', function(template) {
	return {
		restrict: 'EA',
		template: template.replace('yaaasList','yaaas-alerts-plus')
						.replace('yaaasItem','yaaas-alert-plus')
	};
					
});
	