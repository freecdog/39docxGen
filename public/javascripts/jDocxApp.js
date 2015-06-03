/**
 * Created by jaric on 03.06.2015.
 */

(function (angular){

    "use strict";

    console.log("angular is here:", angular);

    var jDocxApp = angular.module('jDocxApp', [
        //'ngRoute',
        'jDocxControllers'
    ]);
    console.log("jDocxApp", jDocxApp);

})(angular);