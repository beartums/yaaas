yaaas
=====

## Yet Another Angular Alert Service

When finished, this component will provide a trail of alerts with variable timeouts as well as an alert history.  Alerts will display on top of the DOM, obscuring interactions with other DOM objects, but the spaces between alerts will be interactive. Envisioned is the ability to attache the allerts to any sector of the browser, dynamically specify the allowable number of displayed alerts, etc.  Currently in its infancy.

## Installation
```bower install yaaas --save```

## Features
### yaaas
* Closeable popover alerts
* Anchored to top-right of window
* Variable display time
* Bootstrap Info, Warning, Danger, and Success are supported
* Variable number of alerts to display at one time (NYI)
* Alert history (NYI)

###yaaas+
* Same as above, plus...
* Variable anchor points (NYI)

*NYI: Not Yet Implemented*

## Usage
* Include yaaas.js and yaaas.css in your html file
* Pass yaaas into your module
`angular.app('myApp',['yaaas'])`
* Pass yaaaService into your controller
`myApp.controller('myAppCtrl', function(yaaaService) {...}`
* Include the `<yaa-alert></yaa-alert>` or `<yaa-alert-plus></yaa-alert-plus>` in your html file
* Add alerts using yaaaService.addAlert()
* Everything else is done for you

### yaaaService
>#### .addAlert (title, message, timeout, level)
>>##### title
Bolded portion of the alert: **Warning** This is an alert
##### message
Alert protion of the alert ('This is an alert' in the above example)
##### timeout (default = 5)
Seconds before the message will disappear from the screen. 0 or a negative will make it display until the close button is clicked.
##### level
Alert level, corresponding to Bootstrap standards ('info', 'success', 'warning'. 'danger').


