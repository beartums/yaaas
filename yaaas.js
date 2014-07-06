var yaaasApp = angular.module('yaaas', []);

yaaasApp.constant('CONSTANTS',{
		template: "<div class='yaaas-alerts {{ isPe ? \"yaaas-pe\" : \"yaaas-not-pe\" }}' \n" +
					"		style='{{getPosStyle(vPos,\"v\")}}{{getPosStyle(hPos,\"h\")}}{{getWidthStyle()}}'>\n" +
					"	<div ng-repeat='alert in yaaas.yaaasAlerts' \n" +
					"			class='alert yaaas-alert {{ isPe ? \"yaaas-pe\" : \"yaaas-not-pe\" }}' \n" +
					"			ng-class=\"{'alert-info':alert.isLevel('info'),\n" +
					"				'alert-warning':alert.isLevel('warning'),\n" +
					"				'alert-danger':alert.isLevel('danger'),\n" +
					"				'alert-success':alert.isLevel('success')}\">\n" +
					"					<button type='button' class='close' aria-hidden='true' ng-click='alert.removeMe()'>&times;</button>" +
					"					<strong>{{alert.title}} </strong>{{alert.text}}\n" +
					"	</div>\n" +
					"</div>\n",
		defaults: {
				'v': {'top': 0, 'bottom': 0},
				'h': {'left': 20, 'right': -20}
				}
			}
		);

yaaasApp.service('yaaaService',function($timeout) {
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
	  yaaas.yaaasAlerts = _alerts;
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
	  yaaas.yaaasAlerts = _alerts;
  };
  
  yaaas.getAlertsHistory = function() {
	  return _alertsHistory;
  };
  
  return yaaas;
});

yaaasApp.directive('yaaAlert', function(CONSTANTS, yaaaService, $window) {
	
	return {
		restrict: 'EA',
		scope: {
			vPos: "@vPos",
			hPos: "@hPos",
			pe: "@pe",
			width: "@width"
		},
		template: CONSTANTS.template,
		link: function(scope,element,attrs) {
			
			scope.yaaas = yaaaService;
			
			scope.isPe = function() {
				pe = pe ? pe.toLowerCase()=='true': false;
			};
			
			scope.getWidthStyle = function(width) {
				width = width || scope.width || '300';
				width = width.replace(/\D/g,'');
				return 'width: ' + width + 'px; ';				
			};
			
			/**
			 * @function
			 * @description Return the position parameters for a specified 
			 * position attribute
			 * @param {string} if non-numeric, expext "top/bottom" for v and "left/right"
			 * @param {string} posType 'V' for vertical position attribute, 'H' for horizontal
			 " for h.  If numeric, + number indicates ofset from top or left 
			 * and - number indicates offset from right or bottom based on posType;
			 * 0 will be considered negative for defaulting position
			 */
			scope.getPosStyle = function(posData, posType) {
				posData = posData ? posData.toLowerCase() : '';
				posType = posType ? posType.toLowerCase() : '';
				if (posType != 'v' && posType != 'h') return '';
				
				var posDefaults = CONSTANTS.defaults[posType]

				if (isNaN(parseInt(posData))) {	
					posData = posDefaults.hasOwnProperty(posData) ? posData : '';
					if (!posData && posType) {
						posData = posType == 'v' ? 'top' : 'right'
					}
					var pos = posDefaults[posData] ? posDefaults[posData] : 0;
				} else {
					var pos = parseInt(posData);
					if (pos<=0) {
						posData = posType == 'v' ? 'bottom' : 'right';
						pos = -1 * pos
					} else {
						posData = posType == 'v' ? 'top' : 'left';
					}
				}
				
				return posData + ': ' + pos + 'px; '
			};
			
	
		}
		
		
	};
});


	