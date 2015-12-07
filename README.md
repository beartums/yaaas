yaaas
=====

## Yet Another Angular Alert Service

When finished, this component will provide a trail of alerts with variable timeouts as well as an alert history.  Alerts will display on top of the DOM, obscuring interactions with other DOM objects, but the spaces between alerts will be interactive. Envisioned is the ability to attache the allerts to any sector of the browser, dynamically specify the allowable number of displayed alerts, etc.  Currently in its infancy.

[github page](http://beartums.github.io/yaaas)
[demo](http://beartums.github.io/yaaas/yaaasDemo.html)

## Installation
```bower install yaaas --save```

## Features
* Closeable, auto-scrolling, popover alerts
* Anchored to one of the widnow's four corners
* Variable display time
* Bootstrap Info, Warning, Danger, and Success are supported
* Variable number of alerts to display at one time (NYI)
* Alert history

*NYI: Not Yet Implemented*

## Usage
* Include yaaas.js and yaaas.css in your html file
* Pass yaaas into your module
`angular.app('myApp',['yaaas']);`
* Pass yaaaService into your controller
`myApp.controller('myAppCtrl', function(yaaaService) {...};`
* Include the `<yaa-alert></yaa-alert>` element in your html file
* Configure your <yaa-alert> directive with v-pos, h-pos, width, and pe attributes
* Add alerts using yaaaService.addAlert() in your controller
* Everything else is done for you

myApp.js:
```
angular.module('myApp',['yaaas'])

  .controller('myAppCtrl', function($scope, yaaaService) {
    yaaaService.addAlert('Warning!', 'This is an important alert'); // default to 5 seconds, info style
    yaaaService.addAlert('Warning!', 'This is a more important alert',10,'danger'); // 10 second display, danger style
    yaaaService.addAlert('Thank goodness!', 'Dodged a bullet on that one',15, 'success'); 15 seconds, success style
  });
```

The HTML:
```
<!DOCTYPE html>
<html>
	<head>
  	  <title>yaaas demo</title>
    	  <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
    	  <link rel="stylesheet" href="yaaas.css">
	</head>

	<body ng-app="myApp"  ng-controller="myAppCtrl">
          <script src="bower_components/angular/angular.min.js"></script>
          <script src="yaaas.js"></script>
          <script src="myApp.js"></script>
          <yaa-alert></yaa-alert>
        </body> 
```

### yaa-alert element
>#### **h-pos** attribute
Which side of the screen to display the scrolling alerts. ('left'/'right', default 'right') 
#### **name** attribute
If specified, this directive will only show alerts named with this name AND alerts named with ''.
#### **v-pos** attrribute
Whether to show the alerts at the bottom of the screen or the top.  NOTE: as currently 
implemented, if pe is not set to 'true', this value will always set itself to 'top'. 
('bottom'/'top', defaults 'top')
#### **width** attribute
Width of the alert (default '300px')
#### **pe** attribute
Boolean, indicating whether your target browsers support pointer-events (most modern non-mobile 
browsers do, but that is only recently).  If you do not specify this and set it to 'true', alerts
cannot, as currently implemented, scroll from the bottom.

### Examples
```<yaa-alert width="400px" v-pos="bottom" pe="true"></yaa-alert>```
...wil scroll your alerts from the bottom on the right side of the screen and each alert will be 400 pixels wide

```<yaa-alert v-pos="bottom" h-pos="left"></yaa-alert>```
...will scroll your 300 pixel wide alerts from the top (pe is not set to true) on the left side of the screen

NOTE: The attributes are dynamic.  If you set it to be `width="{{alertWidth}}"` you can change it in the controller
or through user input and the size will immediately reflect the change.

### yaaaService
>#### .addAlert(title, message, timeout, level, name)
Add an alert to the queue.
>>##### title
Bolded portion of the alert: **Warning** This is an alert
##### message
Alert protion of the alert ('This is an alert' in the above example)
##### timeout (default = 5)
Seconds before the message will disappear from the screen. 0 or a negative will make it display until the close button is clicked.
##### level
Alert level, corresponding to Bootstrap standards ('info', 'success', 'warning'. 'danger').
##### name
The name of the directive this alert is associated with.  '' displays it in all yaa-alert directives (default = '').

>#### .removeAlert(alert)
remove the specified alert from the queue.
>>##### alert
The alert object to be removed

>#### .getAlertHistory()
Get an array of all the alerts since the app was initialised.



