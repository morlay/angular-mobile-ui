angular.module('map.mapHandler', ['map.coordsConverter'])
    .factory("geolocation", function () {
        return window.navigator.geolocation;
    })
    .factory("scriptLoader", function () {
        return function (src, callBack) {
            var s = document.createElement('script');
//            s.async = false;
            s.src = src;
            s.onload = callBack;
            document.body.appendChild(s);
        };
    })
    .service('baseMapHandler', ['coordsConverter', 'geolocation', 'scriptLoader', '$rootScope' , function (coordsConverter, geolocation, scriptLoader, $rootScope) {

        var self = this;

        this.baseMap = null;
        this.locateMarker = null;

        this.BMap = window.BMap;

        this.baseLibLoader = function (callBack) {
            window.BMap_loadScriptTime = (new Date).getTime();
            scriptLoader('http://api.map.baidu.com/getscript?v=2.0&ak=158d2da48ee164abf8ea4074a36c4320', function () {
                self.BMap = window.BMap;
                callBack();
            });
        };

        /**
         * 将 WGS-84 坐标转换为 百度 地图所用 Point 类
         * @param earthCoords
         * @returns {this.BMap.Point}
         * @private
         */
        this._transToMapPoint = function (buildingInfo) {

            var earthCoords = {};


            if (this.baseMap.getMapType() == BMAP_PERSPECTIVE_MAP) {
                earthCoords.longitude = buildingInfo.dlongitude;
                earthCoords.latitude = buildingInfo.dlatitude;
            } else {
                earthCoords.longitude = buildingInfo.longitude;
                earthCoords.latitude = buildingInfo.latitude;
            }


            var baiduCoords = coordsConverter.earthToBaidu(earthCoords);


            return (new this.BMap.Point(
                baiduCoords.longitude,
                baiduCoords.latitude
            ))
        };

        /**
         *  将 百度 地图所用 Point 类  转换为 WGS-84 坐标
         * @param point
         * @returns {buildingInfo}
         * @private
         */
        this._transToEarthCoords = function (point) {

            var earthCoords = coordsConverter.baiduToEarth({
                longitude: point.lng,
                latitude: point.lat
            });

            var buildingInfo = {};

            if (this.baseMap.getMapType() == BMAP_PERSPECTIVE_MAP) {
                buildingInfo.dlongitude = earthCoords.longitude;
                buildingInfo.dlatitude = earthCoords.latitude;
            } else {
                buildingInfo.longitude = earthCoords.longitude;
                buildingInfo.latitude = earthCoords.latitude;
            }

            return buildingInfo;
        };

        /**
         * 根据 WGS - 84 坐标居中地图
         * @param earthCoords
         */
        this.centerMapTo = function (earthCoords) {
            var point = this._transToMapPoint(earthCoords);

            this.baseMap.setCenter(point);


            this.baseMap.removeOverlay(this.markerCircle);

            this.markerCircle.setCenter(point);

            this.baseMap.addOverlay(this.markerCircle);


            this.baseMap.addEventListener('click', function removeMarkerCircle() {
                this.removeOverlay(self.markerCircle);
                this.removeEventListener('click', removeMarkerCircle);

            });
        };


        this.getDistancefromMapCenter = function (earthCoords) {
            var point = this._transToMapPoint(earthCoords);

            return this.baseMap.getDistance(point, this.baseMap.getCenter());
        };


        this.walkPathSearch = function (startEarthCoords, endEarthCoords) {

            self.baseMap.setMapType(BMAP_HYBRID_MAP);
            this.baseMap.clearOverlays();


            var walking = new this.BMap.WalkingRoute(this.baseMap, {
                renderOptions: {
                    map: this.baseMap,
                    autoViewport: true
                }
            });

            var startPoint = this._transToMapPoint(startEarthCoords);
            var endPoint = this._transToMapPoint(endEarthCoords);


            walking.search(startPoint, endPoint);

            self.baseMap.addEventListener('click', function mapReset() {
                self.baseMap.reset();
                $rootScope.$emit('changeDivision', {isNotNeedCenter: false});
                this.removeEventListener('click', mapReset);
            });

        };


        this.drivePathSearch = function (startEarthCoords, endEarthCoords) {


            self.baseMap.setMapType(BMAP_HYBRID_MAP);
            this.baseMap.clearOverlays();

            var driving = new this.BMap.DrivingRoute(this.baseMap, {
                renderOptions: {
                    map: this.baseMap,
                    autoViewport: true
                }
            });

            var startPoint = this._transToMapPoint(startEarthCoords);
            var endPoint = this._transToMapPoint(endEarthCoords);


            driving.search(startPoint, endPoint);

            self.baseMap.addEventListener('click', function mapReset() {
                self.baseMap.reset();
                $rootScope.$emit('changeDivision', {isNotNeedCenter: false});
                this.removeEventListener('click', mapReset);
            });

        };


        /**
         * 根据 buildingId 居中地图
         * @param buildingId
         */
        this.centerMapToMarkerById = function (buildingId) {
            angular.forEach(self.baseMap.getOverlays(), function (item) {
                item.setAnimation(null);

                if (item.buildingId == buildingId) {
                    self.baseMap.setCenter(item.getPosition());
                    item.setAnimation(BMAP_ANIMATION_BOUNCE);

                    item.addEventListener('mouseup', function removeAnimation() {
                        this.setAnimation(null);
                        this.removeEventListener('mouseup', removeAnimation);
                    });
                }
            });

        };


        /**
         *  将 百度 地图所用 Point 类  转换为 WGS-84 坐标
         * @param point
         * @returns {earthCoords}
         * @private
         */
        this._transToEarthCoords = function (point) {
            return coordsConverter.baiduToEarth({
                longitude: point.lng,
                latitude: point.lat
            });
        };

        /**
         * 初始化地图
         * @param mapDomId
         * @param mapTypeName
         * @param centerEarthCoords
         */
        this.mapInit = function (mapDomId, mapTypeName, centerEarthCoords) {

            console.log(this.BMap);

            this.baseMap = (new this.BMap.Map(mapDomId, {
                minZoom: 16,
                maxZoom: 19,
                enableMapClick: false // 底图可点
            }));

            console.log(this.baseMap);

            this.baseMap.enableDragging(); // 启用地图拖拽
            this.baseMap.enableScrollWheelZoom(); // 启用滚轮放大缩小
            this.baseMap.enablePinchToZoom(); // 启用双指操作缩放
            this.baseMap.enableKeyboard(); // 启用键盘操作
            this.baseMap.disableDoubleClickZoom(); // 禁用双击缩放


            var point = this._transToMapPoint(centerEarthCoords);

            // 根据坐标判断城市 因为用到了 3D 地图，必须有设定城市
            (new self.BMap.Geocoder()).getLocation(point, function (rs) {
                self.baseMap.setCurrentCity(rs.addressComponents.city);

                // 切换不同地图类型
                switch (mapTypeName) {
                    case '3D': // 3D 地图

                        self.baseMap.setMapType(BMAP_PERSPECTIVE_MAP);

                        break;
                    case 'NORMAL': // 普通街道视图
                        self.baseMap.setMapType(BMAP_NORMAL_MAP);
                        break;
                    case 'HYBRID': // 卫星和路网的混合视图
                        self.baseMap.setMapType(BMAP_HYBRID_MAP);
                        break;
                    case 'SATELLITE': // 卫星视图
                        self.baseMap.setMapType(BMAP_SATELLITE_MAP);
                        break;
                }

                self.baseMap.centerAndZoom(point, 18);
            });


            this.markerCircle = new this.BMap.Circle(point, 15, {
                strokeColor: '#fff',
                strokeOpacity: 0.1,
                fillColor: 'red'
            });

        };


        /**
         * 建筑标记
         * @param point
         * @returns {this.BMap.Marker}
         * @private
         */
        this._addBuildingMarker = function (point, title) {

            var buildingMarker = new this.BMap.Marker(point, {
                title: title || '当前建筑'
                //				icon:
            });


            if (title != undefined) {

                var label = new BMap.Label(title, {
                        offset: new BMap.Size(20, -10)}
                );

                label.setStyle({padding: '2px 4px', borderColor: '#ddd'});


                buildingMarker.setLabel(label);
            }


            this.baseMap.addOverlay(buildingMarker);
            return buildingMarker;
        };


        /**
         * 显示全部 建筑信息，
         * 并绑定 Click 事件，返回 buildingId，以供外部检索
         * @param buildingList
         * @param callBackClickEvent
         */
        this.showAllCampusBuildings = function (buildingList, callBackClickEvent) {

            var i, point, building, buildingMarker;

            this.baseMap.clearOverlays();


            i = buildingList.length;

            while (i--) {

                building = buildingList[i];

                point = this._transToMapPoint(building);

                buildingMarker = this._addBuildingMarker(point, building.buildingName);

                buildingMarker.buildingId = building.buildingId;

                buildingMarker.addEventListener('click', function () {
                    callBackClickEvent(this.buildingId);
                });
            }
        };


        /**
         * 点击地图获取坐标
         * @param callBackEarthCoords
         */
        this.mapHitBackLocation = function (callBackEarthCoords) {

            this.baseMap.setDefaultCursor('crosshair');

            this.baseMap.addEventListener('click', function getLoc(e) {
                var earthCoords = self._transToEarthCoords(e.point);


//				console.log('hitObj', e);
                //				console.log('百度坐标', e.point);
                //				console.log('墨卡托', BMAP_PERSPECTIVE_MAP.getProjection().lngLatToPoint(e.point));
                //				console.log('二次转换后的百度坐标', BMAP_PERSPECTIVE_MAP.getProjection().pointToLngLat(BMAP_PERSPECTIVE_MAP.getProjection().lngLatToPoint(e.point)));


                self.createOneBuildingMarker(earthCoords, callBackEarthCoords);

                callBackEarthCoords(earthCoords);

                self.baseMap.setDefaultCursor('default');

                this.removeEventListener('click', getLoc);
            });
        };

        /**
         * 定位一个建筑，可居中
         * @param earthCoords
         * @param isNotCenter
         * @returns {*}
         */
        this.showOneBuildingMarker = function (earthCoords, isNotCenter) {

            this.baseMap.clearOverlays();
            var point = this._transToMapPoint(earthCoords);
            var buildingMarker = this._addBuildingMarker(point);
            if (!isNotCenter) {
                this.baseMap.setCenter(point);
            }

            return buildingMarker;
        };

        /**
         * 用于新建标记或者调整标记位置
         * @param earthCoords
         * @param callBackEarthCoords
         */
        this.createOneBuildingMarker = function (earthCoords, callBackEarthCoords) {

            var buildingMarker = this.showOneBuildingMarker(earthCoords, true);

            buildingMarker.enableDragging();
            buildingMarker.addEventListener('dragend', function () {
                callBackEarthCoords(self._transToEarthCoords(this.getPosition()));
            });
        };


        this.showLocalSearch = function (string) {

            this.baseMap.clearOverlays();

            var local = new BMap.LocalSearch(this.baseMap, {
                renderOptions: {
                    map: this.baseMap,
                    panel: "mapInfo",
                    selectFirstResult: false,
                    autoViewport: false
                }
            });

//

            local.searchInBounds(string, this.baseMap.getBounds());


//
//            this.baseMap.addEventListener("dragend", function () {
//                self.baseMap.clearOverlays();
//                local.searchInBounds(string, self.baseMap.getBounds());
//            });

        };


        // 定位

        this.locateMarkerInit = function (centerCoords) {

            this.locateMarker = new this.BMap.Marker(this._transToMapPoint(centerCoords));  // 创建标注
            this.locateMarker.disableMassClear(false);  // 清除覆盖不清楚此标记

            this.locateMarker.addEventListener('click', function () {
                self.baseMap.centerAndZoom(this.getPosition(), 19);
            });
            this._addLocateMarker();
        };


        this._addLocateMarker = function () {
            this.getCenterEarthCoords();
            this.baseMap.addOverlay(this.locateMarker); // 将标注添加到地图中
        };

        /**
         * 可复用的过程，通过 HTML5 Geo 获得 WGS 84 坐标，成功后执行 onSuccess
         */
        this.getCenterEarthCoords = function () {

            function onSuccess(position) {
                self._updateLocate(position);
            }

            function onError(error) {
                alert('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
            }

            geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true});
        };

        /**
         * 更新定位标记的位置
         * @param position
         * @private
         */
        this._updateLocate = function (position) {
            this.locateMarker.setPosition(this._transToMapPoint(position.coords));
        };

        /**
         * 按照更新频率更新
         * @param time
         */
        this.updateLocatePerSecond = function (time) {
            var self = this;
            this.updateLocatePerSecondInterval = setInterval(function () {
                self.getCenterEarthCoords();
            }, time * 1000);
        };

    }
    ])
;

