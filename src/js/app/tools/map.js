angular.module("app.tools.map", [
        "ui.container.modal-btn-group",
        "ui.container.modal",
        'map.mapHandler'
    ])
    .factory('mapDataPool', [
        '$rootScope'
        , 'httpMessageTypes'
        , 'httpData'
        , 'dataPool'
        , function ($rootScope, httpMessageTypes, httpData, dataPool) {

            //获取学校建筑列表
            //响应 buildingList(buildingId buildingName divisionId latitude longitude summary,dlatitude,dlongitude)，offset，totalPages，limit
            httpMessageTypes['GET_SCHOOL_BUILDING_LIST'] = "building/getSchoolBuildingList.do";


            var map = {};
            map.buildingList = {};
            map.buildingTypes = [
                {id: 1, name: '教学楼'},
                {id: 2, name: '宿舍楼'},
                {id: 3, name: '体育场'},
                {id: 4, name: '宾馆'},
                {id: 5, name: '餐厅'},
                {id: 6, name: '风景'},
                {id: 7, name: '其他'}
            ];

            $rootScope.$on('getMapInfo', function (ev, msg) {
                console.log('getMapInfo');
                // 获取全部建筑数据
                httpData.get('GET_SCHOOL_BUILDING_LIST', null, function (data) {
                    console.log('GET_SCHOOL_BUILDING_LIST');
                    console.log(data);

                    map.buildingList = data.buildingList;

                    $rootScope.$emit('updateMapInfo', {isReady: true});
                });
            });

            dataPool.map = map;

            return map;
        }])
    .controller('MapCtrl', [
        '$scope'
        , '$rootScope'
        , '$timeout'
        , '$navigate'
        , 'baseMapHandler'
        , 'mapDataPool'
        , function ($scope, $rootScope, $timeout, $navigate, baseMapHandler, mapDataPool) {
            // 初始化地图
            var centerCoords = {
                latitude: 39.95143124833905,
                longitude: 116.3411808013916
            };


            function init() {
                //				baseMapHandler.mapInit('mapMain', '3D', centerCoords);
                baseMapHandler.mapInit('mapMain', 'HYBRID', centerCoords);
                baseMapHandler.locateMarkerInit(centerCoords);
            }

            // 加载库

            if (window.BMap) {
                $timeout(init, 300);
            } else {
                baseMapHandler.baseLibLoader(init);
            }


            $scope.$emit('getMapInfo');


            function buildingMarkersInit() {

                console.log('buildingMarkersInit');


                console.log('showAllCampusBuildings');

                baseMapHandler.showAllCampusBuildings(mapDataPool.buildingList, function (buildingId) {

                    // maker 的点击事件写在这里


                    angular.forEach(mapDataPool.buildingList, function (item) {
                        if (item.buildingId == buildingId) {

                            $scope.$emit('showMapInfoModal', {
                                    buildingInfo: item
                                }
                            );
                        }
                    });


                    $scope.$apply();
                });


            }


            $rootScope.$on('updateMapInfo', function (ev, msg) {
                console.log('updateMapInfo');
                // 必要的延迟
                $timeout(buildingMarkersInit, 3000);

            });


            var centerBuildingById = function (buildingId) {

//                baseMapHandler.centerMapToMarkerById(buildingId);


                angular.forEach(mapDataPool.buildingList, function (item) {
                    if (item.buildingId == buildingId) {
                        baseMapHandler.centerMapTo(item);

                    }
                });
            };

            $rootScope.$on('centerBuildingById', function (event, msg) {
                console.log('centerBuildingById');
                console.log(msg);

                buildingMarkersInit();

                centerBuildingById(msg.buildingId);

                $scope.$emit('closeModal');
            });

            // 地图控件
            $scope.geoLocation = function () {
                // 定位到 geoLocation 捕获的坐标位置
                baseMapHandler.baseMap.setMapType(BMAP_HYBRID_MAP);
                baseMapHandler.baseMap.centerAndZoom(baseMapHandler.locateMarker.getPosition(), 19);
            };


            $scope.isMapInfoModalOpen = false;
            $rootScope.$on('showMapInfoModal', function (event, msg) {

                $scope.buildingInfo = msg.buildingInfo;

                console.log(msg);

                $scope.isMapInfoModalOpen = true;


            });

            $scope.mapModalOpts = {
                backdropFade: true,
                dialogFade: true
            };


            $scope.closeMapInfoModal = function () {

                console.log('closeMapInfoModal');
                $scope.isMapInfoModalOpen = false;
            };


        }])
    .controller('MapSearchCtrl', [
        '$scope'
        , 'mapDataPool'
        , function ($scope, mapDataPool) {

            $scope.beginSearch = function () {
                $scope.isShowSearch = true;
                $scope.buildingList = mapDataPool.buildingList;
                $scope.buildingTypes = mapDataPool.buildingTypes;
            };

            $scope.cancelSearch = function () {
                $scope.isShowSearch = false;
            };


            $scope.centerToBuilding = function (building) {

                $scope.$emit('centerBuildingById', {
                    buildingId: building.buildingId
                });

                $scope.cancelSearch();
            };

        }]);