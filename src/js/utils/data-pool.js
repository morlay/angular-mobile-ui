angular.module('utils.data-pool', [])
    .factory('dataPool', function () {
        return {};
    })
    .factory('httpMessageTypes', function () {
        return {};
    })
    .directive('aliSrc', ['serverUrl', function (serverUrl) {
        return function (scope, element, attrs) {
            scope.$watch(attrs.aliSrc, function (newValue, oldValue) {
                element.attr('src', serverUrl.aliUrl + newValue);
            });
        }
    }])
    .factory("httpData", [
        "$rootScope",
        "$http",
        "$window",
        "httpMessageTypes",
        "serverUrl" ,
        function ($rootScope, $http, $window, httpMessageTypes, serverUrl) {

            return {
                url: serverUrl.http,
                post: function (type, data, successCallBack) {
                    var params = {}, jsonStr;

//                    console.log(this.url);


                    if (angular.isObject(data)) {
                        params = angular.copy(data);
                    }

                    jsonStr = JSON.stringify(params);

                    console.log(httpMessageTypes[type]);
                    console.log(jsonStr);

                    var config = {
                        url: this.url + httpMessageTypes[type],
                        method: "POST",
                        data: jsonStr,
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8',
                            'token': serverUrl.token
                        }
                    };

                    if (type == 'UPLOAD_BUILDING_IMG' || type == 'INSERT_NEWS_IMG') {

                        // 图片文件上传

                        config.headers['Content-Type'] = false;
                        config.data = data;
                        config.transformRequest = function (data) {
                            console.log('UPLOAD_IMG', this.data);

                            var formData = new FormData();

                            if (data.hasOwnProperty('buildingId')) {
                                formData.append('buildingId', data.buildingId);
                            }

                            formData.append("file", data.file);

                            return formData;
                        };


                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', config.url, true);
                        xhr.setRequestHeader('token', config.headers.token);

                        xhr.onload = function (e) {
                            console.log('onload');
                            $rootScope.$apply(function () {
                                successCallBack(angular.fromJson(xhr.responseText));
                            })
                        };


                        xhr.upload.onprogress = function (e) {
                            if (e.lengthComputable) {
                                $rootScope.$apply(function () {
                                    data.file.uploadProgress = (e.loaded / e.total) * 100;
                                });
                            }
                        };

                        xhr.send(config.transformRequest(data));


                    } else {
                        // 一般 post
                        $http(config)
                            .success(function (data, status, headers, config) {
                                successCallBack(data, status, headers, config);
                            }
                        )
                            .error(function (data, status, headers, config) {
                                if (status == 0) {
                                    status = '数据服务未开';
                                }
                                console.log(status, config);
                            });
                    }


                },
                get: function (type, params, successCallBack) {
                    $http({
                        url: this.url + httpMessageTypes[type],
                        params: params,
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8',
                            'token': serverUrl.token
                        }
                    })
                        .success(function (data, status, headers, config) {
                            successCallBack(data);
                        }
                    )
                        .error(function (data, status, headers, config) {
                            if (status == 0) {
                                status = '数据服务未开';
                            }
                            console.log(status);
                        });
                },
                linkTo: function (type, params) {
                    var self = this;
                    this.get(type, params, function (data, status, headers, config) {
                        $window.location.href = self.url + httpMessageTypes[type] + '?fileName=' + params.fileName;
                    })
                }


            }
        }]);
