/**
 * Created by jaric on 03.06.2015.
 */

(function (angular){

    "use strict";

    console.log("jDocxControllers", angular);

    var jDocxControllers = angular.module('jDocxControllers', []);

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function getSearchPlayersCount(){
        var defaultCount = '2';
        var localStorage = window.localStorage;
        if (!localStorage) return defaultCount;
        var searchPlayersCount = localStorage.getItem("searchPlayersCount");
        if (isNumber(searchPlayersCount)) {
            //searchPlayersCount = Math.floor(parseFloat(searchPlayersCount));
            return searchPlayersCount.toString();   // due to next usage as a string
        } else return defaultCount;
    }

    jDocxControllers.controller('jDocxMainController', ['$scope', '$http', function($scope, $http) {

        init();

        function init(){
            ;
        }

    }]);

    jDocxControllers.controller('TabController', function(){
        this.curTab = 0;

        this.setTab = function(tabIndex){
            this.curTab = tabIndex;
        };
        this.isSet = function(tabIndex){
            return this.curTab === tabIndex;
        };
    });

    jDocxControllers.controller('TODOController', ['$scope', '$http', function($scope, $http){

        init();

        function init(){
            console.log("TODOController initializing");

            $scope.TODOs = [];
            clearTODO();

            $scope.iconsForTODOs = ['glyphicon-ok', 'glyphicon-remove'];
            $scope.colorsForTODOs = ['text-muted', 'text-primary', 'text-warning', 'text-danger', 'text-success', 'text-info'];

            $http.get('/api/todos')
                .success(function(data){
                    console.log("TODOs", data);
                    $scope.TODOs = data;
                })
                .error(function(err){
                    console.log("TODOs list was not sent, error:", err);
                });
        }

        function clearTODO(){
            $scope.newTODO = {
                concentration: "back-end",
                glyphicon: "glyphicon-remove",
                glyphiconColor: "",
                text: "",
                author: "",
                createdOn: ""
            };
        }

        this.addTODO = function(){
            console.log('trying to add, TODO:', $scope.newTODO);
            $scope.newTODO.createdOn = Date.now();

            $http.post('/api/todo', $scope.newTODO)
                .success(function(data) {
                    console.log("new todo posted successfully, response:", data);

                    $scope.TODOs.push($scope.newTODO);

                    clearTODO();
                })
                .error(function(err){
                    console.log("todo wasn't added, error:", err);
                });
        };
    }]);

    jDocxControllers.controller('ReportController', ['$scope', '$http', function($scope, $http){

        init();

        function init(){
            console.log("TODOController initializing");

            clearReport();
        }

        function clearReport(){
            $scope.newReport = {
                lastName: "",
                firstName: "",
                patronymic: "",
                createdOn: ""
            };
        }

        this.generateReport = function(){
            console.log('trying to add, Report:', $scope.newReport);
            $scope.newReport.createdOn = Date.now();

            $http.post('/api/doc', $scope.newReport, {responseType:'arraybuffer'})
                .success(function(data) {
                    console.log("new Report posted successfully, response:", data);
                    var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
                    var url = (window.URL || window.webkitURL).createObjectURL(blob);
                    var element = angular.element('<a/>');
                    element.attr({
                        href: url,
                        target: '_blank',
                        download: 'doc' + $scope.newReport.lastName + '.docx'
                    })[0].click();

                    clearReport();
                })
                .error(function(err){
                    console.log("todo wasn't added, error:", err);
                });
        };

        this.generateReportAlternativeRaw = function(){
            console.log('trying to add, ReportAlternative:', $scope.newReport);
            $scope.newReport.createdOn = Date.now();

            $http.post('/api/docAsParamRaw', $scope.newReport)//, {responseType:'arraybuffer'})
                .success(function(data) {

                    function ab2str(buf) {
                        return String.fromCharCode.apply(null, new Uint8Array(buf));
                    }
                    var dataRaw = ab2str(data.doc);
                    var blob = new Blob([dataRaw], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});

                    var url = (window.URL || window.webkitURL).createObjectURL(blob);

                    var element = angular.element('<a/>');
                    element.attr({
                        href: url,
                        target: '_blank',
                        download: 'doc' + $scope.newReport.lastName + '.docx'
                    })[0].click();

                    clearReport();
                })
                .error(function(err){
                    console.log("todo wasn't added, error:", err);
                });
        };

        this.generateReportAlternativeBase64 = function(){
            console.log('trying to add, ReportAlternative:', $scope.newReport);
            $scope.newReport.createdOn = Date.now();

            $http.post('/api/docAsParamBase64', $scope.newReport)//, {responseType:'arraybuffer'})
                .success(function(data) {
                    // from: http://stackoverflow.com/a/21797381
                    function base64ToArrayBuffer(base64) {
                        var binary_string =  window.atob(base64);
                        var len = binary_string.length;
                        var bytes = new Uint8Array( len );
                        for (var i = 0; i < len; i++)        {
                            bytes[i] = binary_string.charCodeAt(i);
                        }
                        return bytes.buffer;
                    }

                    var data64 = base64ToArrayBuffer(data.doc64); // atob(data.doc64);

                    var blob64 = new Blob([data64], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});

                    var url = (window.URL || window.webkitURL).createObjectURL(blob64);

                    var element = angular.element('<a/>');
                    element.attr({
                        href: url,
                        target: '_blank',
                        download: 'doc' + $scope.newReport.lastName + '.docx'
                    })[0].click();

                    clearReport();
                })
                .error(function(err){
                    console.log("todo wasn't added, error:", err);
                });
        };

    }]);

})(angular);