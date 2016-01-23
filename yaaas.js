var yaaasApp = angular.module('yaaas', []);

yaaasApp.constant('CONSTANTS',{
		alertsTemplate: 
					"<div class='yaaas-alerts {{ isPe ? \"yaaas-pe\" : \"yaaas-not-pe\" }}' \n" +
					"		ng-style='getPosNgStyle()' \n" +
					"		ng-if='!yaaas.isShowingHistory(name)'>\n" +
					"	<div ng-repeat='alert in yaaas.yaaasAlerts | Level : yaaas.activeLevels(name) : name' \n" +
					"		class='alert yaaas-alert {{ isPe ? \"yaaas-pe\" : \"yaaas-not-pe\" }} \n" +
					"				alert-{{alert.alertLevel}}'> \n" +
					"		<button type='button' class='close' ng-click='alert.removeMe()'>&times;</button>" +
					"		<strong>{{alert.title}} </strong>{{alert.text}}\n" +
					"	</div>\n" +
					"</div>\n",
		toolbarTemplate: 
					"<div class='yaaas-alerts'\n" +
					"		ng-style='getPosNgStyle()'>\n" +
					"	<div class='btn-toolbar btn-toolbar-xs' \n" +
					"		ng-mouseenter='showCounts=true'\n" +
					"		ng-mouseleave='showCounts=false'>\n" +
					"		<div class='btn-group btn-group-xs' ng-show='showCounts || pinCounts'>\n" +
					"			<a ng-repeat='level in levels' \n" +
					"				ng-click='yaaas.toggleLevel(name,level.class)'\n" +
					"				ng-class='{active:yaaas.activeLevelIndex(name,level.class)>-1}'\n" +
					"				class='btn btn-default' title='{{level.description}}'>\n" +
					"				{{(yaaas.getAlertsHistory() | Level : level.class : name).length}}\n" +
					"				<span class='fa fa-circle text-{{level.class}}'></span>\n" +
					"			</a>\n" +
					"		</div>\n" +
					"		<div class='btn-group btn-group-xs'>\n" +
					"			<a ng-click='toggleHistory(name)'  ng-show='showCounts || pinCounts' \n" +
					"				ng-disabled='(yaaas.getAlertsHistory() | Name:name).length==0'\n" +
					"				class='btn btn-default' \n" +
					"				ng-class='{active:showHistory}' title='Show history'>\n" +
					"				<span class='fa fa-clock-o'></span>\n" +
					"			</a>\n" +
					"			<a ng-click='downloadMessages()' \n" +
					"				ng-show='(showCounts || pinCounts) && yaaas.canExport()' \n" +
					"				class='btn btn-default' \n" +
					"				 ng-disabled='(yaaas.getAlertsHistory() | Name:name).length==0'\n" +
					"				 title='Download Active Messages'>\n" +
					"				<span class='fa fa-download'></span>\n" +
					"			</a>\n" +
					"			<!--<a ng-click=''  ng-if='showCounts' class='btn btn-default' \n" +
					"				ng-disabled='(yaaas.getAlertsHistory() | Name:name).length==0'\n" +
					"				 title='Clear all messages'>\n" +
					"				<span class='fa fa-trash-o'></span>\n" +
					"			</a>-->\n" +
					"			<a ng-click='pinCounts=!pinCounts' \n" +
					"				ng-show='showCounts || pinCounts' class='btn btn-default' \n" +
					"				ng-class='{active: pinCounts}'\n" +
					"				title='Pin message counts to the screen'>\n" +
					"				<span class='fa fa-thumb-tack' ng-if='pinCounts'></span>\n" +
					"				<span class='fa fa-thumb-tack fa-rotate-90' ng-if='!pinCounts'></span>\n" +
					"			</a>\n" +
					"			<a  \n" +
					"				ng-disabled='(yaaas.getAlertsHistory() | Name:name).length==0'\n" +
					"				class='btn btn-default' \n" +
					"				ng-class='{active: showCounts}'>\n" +
					"				<span class='fa fa-warning'></span>\n" +
					"			</a>\n" +
					"		</div>\n" +
					"	</div>\n" +
					"</div>\n" +
					"<div ng-if='showHistory==true'\n" +
					"    style='overflow:auto' \n" +
					"    ng-style='getPosNgStyle()' \n" +
					"	 class='yaaas-alerts'> \n" +
					"	<div ng-repeat='alert in yaaas.getAlertsHistory() | Name:name | 		Level:yaaas.activeLevels(name)' \n" +
					"		class='alert yaaas-alert \n" +
					"				alert-{{alert.alertLevel}}'> \n" +
					"		<small ng-attr-title='{{alert.timestamp | date : \"dd MMM yyyy\"}}'>\n" +
					"			{{alert.timestamp | date : '(HH:mm:ss)'}} </small>\n" +
					"		<strong>{{alert.title}} </strong>{{alert.text}}\n" +
					"	</div>\n" +
					"</div>"
					,
		// pixel values for keywords used in positioning
		defaults: {
				'v': {'top': 0, 'bottom': 0},
				'h': {'left': 20, 'right': -20}
				},
		// Valid Levels
		levels: [
					{ type: 'error', class:'danger', description:'Error Messages'},
					{ type: 'warning', class:'warning', description:'Warning Messages'},
					{ type: 'success', class:'success', description:'Success Messages'},
					{ type: 'info', class:'info', description:'Info Messages'},
				]
			}
		);

/**
 * Filter alerts by directive name
**/ 
yaaasApp.filter('Name', function() {
	return function(alerts,name) {
		var filtered = [];
		name = name || '';
		angular.forEach(alerts, function(alert) {
			if (alert.name==name || alert.name == '') {
				filtered.push(alert)
			}
		});
		return filtered;
	}
})
/**
 * Filter by alertLevel.class or an array of alertLevel classes
 * secondary filter by directive name, if included
 **/
yaaasApp.filter('Level', function(NameFilter) {
	return function(alerts,level,name) {
		var levels = level;
		if (levels) {
			levels = angular.isArray(levels) ? levels : [levels]
		} else {
			levels = [];
		}
		var filtered = [];
		var nameFilteredAlerts = name ? NameFilter(alerts,name) : alerts;
		angular.forEach(nameFilteredAlerts, function(alert) {
			if (!levels) filtered.push(alert)
			var isMatched = levels.some(function(level) { return alert.alertLevel==level });
			if (isMatched || !levels) {
				filtered.push(alert)
			}
		});
		return filtered;
	}
})

yaaasApp.service('yaaaService',function($timeout,$filter,LevelFilter, CONSTANTS) {
	/**
	 * Define the alert object
	 **/
  var Alert = function(title,text,timeout,alertLevel,name,stacktrace) {
  	  this.name = name || '';
	  this.title = title || '';
	  this.text = text || '';
	  this.timeout = timeout || 5;
	  this.alertLevel = !alertLevel ? 'info' :
	  						alertLevel == 'error' ? 'danger' : alertLevel;
	  this.timestamp = new Date();
	  this.stacktrace = stacktrace || new Error().stack;
  };
  
	/**
	 * Is this alert of the specified level
	 **/
  Alert.prototype.isLevel = function(level) {
	  return this.alertLevel==level;
  };
	
	/** 
	 * Remove this alert from the list of active alerts
	 **/
  Alert.prototype.removeMe = function() {
	  yaaas.removeAlert(this);
  };
  
	// Alert Service Object
  var yaaas = {};
  // Alerts which have not yet timed out
  var _alerts = [];
  // All alerts
  var _alertsHistory = [];
  // Currently displayed alertLevels for each directive defined
  // elements: {name: 'directiveName', level: 'levelClassName'}
  // if the element exists, the specified alertLevel will be displayed for the directive
  var _activeLevels = [];
  // string array of directive names for the directives that are in history mode
  var _directivesShowingHistory = [];
  
  /**
   * if alasql is loaded, then at least CSV files can be downloaded
   **/
  yaaas.canExport = function() {
	  if (alasql) return true;
	  else return false;
  }
  
  /**
   * If alasql and XLSX are loaded, then XLS files can be downloaded
   **/
  yaaas.canExportXlsx = function() {
	  return alasql && XLSX;
  }
  
  /**
   * Turn on or off the history-display-mode for a named directive
   **/
  yaaas.toggleShowingHistory = function(name) {
	  var idx = _directivesShowingHistory.indexOf(name);
	  if (idx==-1) _directivesShowingHistory.push(name);
	  else _directivesShowingHistory.splice(idx,1);
  }
  /**
   * Check to see if the directive specified by name is showing history or 
   * only displaying the un-tomed-out alerts
   **/
  yaaas.isShowingHistory = function(name) {
	  var idx = _directivesShowingHistory.indexOf(name);
	  return idx>-1;
  }
  /**
   * Activate/deacivate a level based on the alertLevel and Directive name strings
   **/
  yaaas.toggleLevel = function(name,levelClass) {
	// create the filter
	var filterObj = {};
	if (levelClass) filterObj.level = levelClass;
	if (name) filterObj.name = name;
	// add if not found, otherwise remove
	var idx = yaaas.activeLevelIndex(name,levelClass);
	if (idx>-1) _activeLevels.splice(idx,1);
	else _activeLevels.push({name: name, level:levelClass});	
  }
  
  /**
   * Given a directive name and an alertLevel, return the index of that level in the activeLevels
   * array for the service
   **/
  yaaas.activeLevelIndex = function(name,levelClass) {
	return _activeLevels.reduce(
		function(matchIdx,level,idx) {
			if (matchIdx>-1) return matchIdx;
			if (level.name==name && level.level == levelClass) return idx;
			return -1;
		},-1);
  }
  
  /**
   * Return an array of strings of all the alert classes that are active for the named directive
   **/
  yaaas.activeLevels = function(name) {
	  return _activeLevels.reduce(function(levels,activeLevel) {
		  if (activeLevel.name==name) levels.push(activeLevel.level);
		  return levels;
	  },[]);
  }
  /**
   * Remove the specified alert from the active alerts collection
   * (ie. stop showing the alert)
   **/
  yaaas.removeAlert = function(alert) {
	  var i = _alerts.indexOf(alert);
	  _alerts.splice(i,1);
	  yaaas.yaaasAlerts = _alerts;
  };
  
  /**
   * Add an alert to the active alerts and the alert history
   **/
  yaaas.addAlert = function(title, text, timeout, alertLevel,name,stacktrace) {
	  var alert = new Alert(title,text,timeout,alertLevel,name,stacktrace);
	  _alertsHistory.push(alert);
	  _alerts.push(alert);
	  if (timeout>0) {
		  $timeout(function() {
			  yaaas.removeAlert(alert);
		  }, alert.timeout * 1000);
	  }
	  yaaas.yaaasAlerts = _alerts;
  };
  /**
   * returns all the alerts for the specified directive name
   **/
  yaaas.getAlertsHistory = function(filterTextOrArray) {
	  if (!filterTextOrArray) return _alertsHistory;
	  var filterArray = angular.isArray(filterTextOrArray) ? filterTextOrArray : [filterTextOrArray];
	  return LevelFilter(_alertsHistory,filterArray);
  };
  /** 
   * returns the appropriate style element for each vertical and horizontal 
   * options set by the client
   *
   * posData - value passed from the v-pos or h-pos attributes
   * posType - 'v' or 'h'
   * bump - amount to add to the positional offset
   **/
  yaaas.getPosObj = function (posData, posType, bump) {
  	bump = +bump || 0;
  	posData = posData ? posData.toLowerCase() : '';
  	posType = posType ? posType.toLowerCase() : '';
  	if (posType != 'v' && posType != 'h') return '';

  	var posDefaults = CONSTANTS.defaults[posType]

  	// If not numeric, MUST be 'top' or 'bottom' for vertical or 'left' or 'right' for horizontal
  	if (isNaN(parseInt(posData))) {
  		posData = posDefaults.hasOwnProperty(posData) ? posData : '';
  		if (!posData && posType) {
  			posData = posType == 'v' ? 'bottom' : 'right'
  		}
  		var pos = posDefaults.hasOwnProperty(posData) ? posDefaults[posData] : 0;
  		// if numeric, negative indicates offset from bottom or right while positive is offset from top or left
  	} else {
  		var pos = parseInt(posData);
  		if (pos <= 0) {
  			posData = posType == 'v' ? 'bottom' : 'right';
  		} else {
  			posData = posType == 'v' ? 'top' : 'left';
  		}
  	}
  	// turn negative numbers
  	var posObj = {};
  	posObj[posData] = (Math.abs(pos) + bump) + 'px'
  	return posObj;
  };

  return yaaas;
});

/** 
 * Directive for displaying the popup alerts as they are created
 **/
yaaasApp.directive('yaaAlert', function(CONSTANTS, yaaaService, $window) {
	
	return {
		restrict: 'EA',
		scope: {
			vPos: "@vPos",  	// Vertical position
			hPos: "@hPos",		// Horizontal position
			pe: "@pe",
			width: "@width", 	// Message width
			name: "@name",		// Directive name (for multiple directives)
			activeAlerts: "@"	// Alert Levels to be active when this directive is loaded
		},
		template: CONSTANTS.alertsTemplate,
		link: function(scope,element,attrs) {
			
			scope.yaaas = yaaaService;
			scope.levels = CONSTANTS.levels;
			
			// default the displayed alerts to warnings and errors
			scope.activeAlerts = scope.activeAlerts || ['danger','warning']; 
			scope.activeAlerts = angular.isArray(scope.activeAlerts) ? scope.activeAlerts : [scope.activeAlerts];
			
			// Register the default active alerts for this directive
			scope.activeAlerts.forEach(function(level) {
				scope.yaaas.toggleLevel(scope.name,level);
			});
			
			scope.isPe = function() {
				pe = pe ? pe.toLowerCase()=='true': false;
			};
			
			scope.getPosNgStyle = function () {
				var styleObj = {};
				angular.extend(styleObj, scope.yaaas.getPosObj(scope.vPos,'v'));
				angular.extend(styleObj, scope.yaaas.getPosObj(scope.hPos,'h'));

				var width = scope.width || '300';
				width = width.replace(/\D/g, '');
				styleObj.width = width + 'px; ';

				return styleObj;
			}

	
		}
		
		
	};
});


/**
 *  Directive to display the alerts toolbar
 *  Allows user to control which messages are displayed, the ability to display all the messages
 *  for this session and the ability to download historical messages
 **/
yaaasApp.directive('yaaToolbar', function(CONSTANTS, yaaaService, $window) {
	
	return {
		restrict: 'E',
		scope: {
			vPos: "@vPos",  	// Vertical position
			hPos: "@hPos",		// Horizontal position
			name: "@name",		// Directive name (for multiple directives)
			pinned: "@pinned" // should the count buttons be displayed when directive starts
		},
		template: CONSTANTS.toolbarTemplate,
		controller: function($scope,$timeout,$filter,NameFilter,LevelFilter) {
			
			// Make the service and valid-level list available to the directive
			$scope.yaaas = yaaaService;
			$scope.levels = CONSTANTS.levels
			
			// Default to showing the entire toolbar
			if ($scope.pinned===true || $scope.pinned=='true') {
				$scope.pinCounts=true;
			} else {
				$timeout(function() {
					$scope.pinCounts=false;
				});
			}
			
			/**
			 * Get the style object for displaying using ng-style;
			 **/
			$scope.getPosNgStyle = function () {
				var styleObj = {};
				angular.extend(styleObj, $scope.yaaas.getPosObj($scope.vPos,'v'));
				angular.extend(styleObj, $scope.yaaas.getPosObj($scope.hPos,'h'));
				return styleObj;
			}

			/**
			 * Turn on and off the history display
			 **/
			$scope.toggleHistory = function(dirName) {
				$scope.yaaas.toggleShowingHistory(dirName);
				$scope.showHistory = !$scope.showHistory;
			}
			
			/**
			 * Download messages currently marked as active by level
			 **/
			$scope.downloadMessages = function() {
				// functions for formatting the date and time for output
				if (!alasql.fn.dateFmt) {
					alasql.fn.dateFmt = function(date) {
						return $filter('date')(date,'dd MMM yyyy');
					}
					alasql.fn.timeFmt = function(date) {
						return $filter('date')(date,'HH:mm:ss');
					}
					alasql.fn.jsonify = function(obj) {
						if (!angular.isString(obj)) {
							//var rtn = angular.toJson(obj,true).replace('>','&gt;').replace('<','&lt;');
							var rtn = angular.toJson(obj,true);
							return rtn;
						} else {
							//var rtn = obj.replace(/\>/g,'&gt;').replace(/\</g,'&lt;').replace(/\&/g,'&amp;');
							var rtn = obj;
							return rtn
						}
					}
				}
				
				
				target = $scope.yaaas.canExportXlsx ? 'XLSX' : 'CSV';
				var fileName = 'messages.' + target;
				// Get the appropriate data
				data = NameFilter($scope.yaaas.getAlertsHistory(),$scope.name);
				data = LevelFilter(data,$scope.yaaas.activeLevels($scope.name));
				// export
				var opts = {
					sheetid: 'Messages',
					headers: true,

					/*columns: [
					  {columnid:'name'},
					  {columnid:'title',width:100},
					  {columnid:'text',width:300},
					  {columnid:'alertLevel'},
					  {columnid:'stack',width:500},
					]*/
				};
				var select = "SELECT name,title,text,";
				select += "alertLevel,jsonify(stacktrace) as stack";
				select += " INTO " + target + "('" + fileName + "',?) FROM ? ";
				var x = alasql(select,[opts,data]);
			}
	
		}
		
		
	};
});