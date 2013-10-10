/**
 * WGS-84 GCJ-02 BD-09 粗略转换
 *
 *
 * 对于 Google 地图
 * 引用不同的数据，会得到不同的地图切片
 * 卫星（无地标） WGS-84 一般 GCJ-02
 * <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
 * 卫星（有地标） GCJ-02 一般 GCJ-02
 * <script src="https://ditu.google.cn/maps/api/js?v=3.exp&sensor=false"></script>
 *
 *
 * 对于 Baidu 地图
 * <script src="http://api.map.baidu.com/api?v=1.5&ak=158d2da48ee164abf8ea4074a36c4320"></script>
 *
 *
 * 对于 HTML5 Geolocation 得到的 坐标是 WGS-84 下的，
 * 行货手机不确定
 */


angular.module('map.coordsConverter', [])
    .factory("coordsConverter", function () {

        var CoordsConverter = function () {
            // Krasovsky 1940
            //
            // a = 6378245.0, 1/f = 298.3
            // b = a * (1 - f)
            // ee = (a^2 - b^2) / a^2;
            this.a = 6378245.0;
            this.ee = 0.00669342162296594323;
            // 频繁使用 Math 先引用吧
            this.Math = Math;
        };
        CoordsConverter.prototype = {
            /**
             * 判断是否坐标是否在国外
             * @param earthCoords
             * @returns {boolean}
             * @private
             */
            _isOnEarth: function (earthCoords) {
                return (earthCoords.longitude < 72.004 || earthCoords.longitude > 137.8347 || earthCoords.latitude < 0.8293 || earthCoords.latitude > 55.8271);
            },
            /**
             * 获取纬度差值
             * @param x
             * @param y
             * @returns {number}
             * @private
             */
            _getDeltaLat: function (x, y) {
                var delta = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * this.Math.sqrt(this.Math.abs(x));
                delta += (20.0 * this.Math.sin(6.0 * x * this.Math.PI) + 20.0 * this.Math.sin(2.0 * x * this.Math.PI)) * 2.0 / 3.0;
                delta += (20.0 * this.Math.sin(y * this.Math.PI) + 40.0 * this.Math.sin(y / 3.0 * this.Math.PI)) * 2.0 / 3.0;
                delta += (160.0 * this.Math.sin(y / 12.0 * this.Math.PI) + 320 * this.Math.sin(y * this.Math.PI / 30.0)) * 2.0 / 3.0;
                return delta;
            },
            /**
             * 获取经度差值
             * @param x
             * @param y
             * @returns {number}
             * @private
             */
            _getDeltaLon: function (x, y) {
                var delta = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * this.Math.sqrt(this.Math.abs(x));
                delta += (20.0 * this.Math.sin(6.0 * x * this.Math.PI) + 20.0 * this.Math.sin(2.0 * x * this.Math.PI)) * 2.0 / 3.0;
                delta += (20.0 * this.Math.sin(x * this.Math.PI) + 40.0 * this.Math.sin(x / 3.0 * this.Math.PI)) * 2.0 / 3.0;
                delta += (150.0 * this.Math.sin(x / 12.0 * this.Math.PI) + 300.0 * this.Math.sin(x / 30.0 * this.Math.PI)) * 2.0 / 3.0;
                return delta;
            },
            /**
             * World Geodetic System ==> Mars Geodetic System
             * WGS-84 ==> GCJ-02
             * 直接纠偏转换，部分地区，如较高海拔，可能会造成较大的误差
             * @param earthCoords include{latitude:value,longitude: value}
             * @returns marsCoords include{latitude:value,longitude: value}
             */
            earthToMars: function (earthCoords) {
                var marsCoords = {
//                latitude: 0,
//                longitude: 0
                }, dLat, dLon, radLat, magic, sqrtMagic;

                if (this._isOnEarth(earthCoords)) {
                    marsCoords.latitude = earthCoords.latitude;
                    marsCoords.longitude = earthCoords.longitude;
                    return marsCoords;
                }

                dLat = this._getDeltaLat(earthCoords.longitude - 105.0, earthCoords.latitude - 35.0);
                dLon = this._getDeltaLon(earthCoords.longitude - 105.0, earthCoords.latitude - 35.0);
                radLat = earthCoords.latitude / 180.0 * this.Math.PI;
                magic = this.Math.sin(radLat);
                magic = 1 - this.ee * magic * magic;
                sqrtMagic = this.Math.sqrt(magic);

                dLat = (dLat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtMagic) * this.Math.PI);
                dLon = (dLon * 180.0) / (this.a / sqrtMagic * this.Math.cos(radLat) * this.Math.PI);

                marsCoords.latitude = earthCoords.latitude + dLat;
                marsCoords.longitude = earthCoords.longitude + dLon;

                return marsCoords;
            },
            /**
             * GCJ-02 ==> WGS-84
             * 反推，假设 GCJ-02 就是 WGS-84，计算大概差值，精度不高，
             * 二分法查表内插可能会好点，但是太多数据，前端不好做
             * @param marsCoords include{latitude:value,longitude: value}
             * @returns earthCoords include{latitude:value,longitude: value}
             */
            marsToEarth: function (marsCoords) {
                var earthCoords = {
//                latitude: 0,
//                longitude: 0
                }, marsTemp, dLat, dLon;

                marsTemp = this.earthToMars(marsCoords);

                dLat = marsTemp.latitude - marsCoords.latitude;
                dLon = marsTemp.longitude - marsCoords.longitude;

                earthCoords.latitude = marsCoords.latitude - dLat;
                earthCoords.longitude = marsCoords.longitude - dLon;

                return earthCoords;
            },
            /**
             * GCJ-02 ==> BD-09
             * 三角函数转换后计算误差本来就有点蛋疼
             * @param marsCoords include{latitude:value,longitude: value}
             * @returns baiduCoords include{latitude: value,longitude: value}
             */
            marsToBaidu: function (marsCoords) {
                var baiduCoords = {
//                latitude: 0,
//                longitude: 0
                };

                var x = marsCoords.longitude,
                    y = marsCoords.latitude,
                    z, theta, x_pi;

                x_pi = this.Math.PI * 3000.0 / 180.0;
                z = this.Math.sqrt(x * x + y * y) + 0.00002 * this.Math.sin(y * x_pi);
                theta = this.Math.atan2(y, x) + 0.000003 * this.Math.cos(x * x_pi);

                baiduCoords.latitude = z * this.Math.sin(theta) + 0.006;
                baiduCoords.longitude = z * this.Math.cos(theta) + 0.0065;

                return baiduCoords;

            },
            /**
             * BD-09 ==> GCJ-02
             * 三角函数转换后计算误差本来就有点蛋疼
             * @param baiduCoords include{latitude:value,longitude: value}
             * @returns marsCoords include{latitude:value,longitude: value}
             */
            baiduToMars: function (baiduCoords) {
                var marsCoords = {
//                latitude: 0,
//                longitude: 0
                };
                var x = baiduCoords.longitude - 0.0065, y = baiduCoords.latitude - 0.006,
                    z, theta, x_pi;

                x_pi = this.Math.PI * 3000.0 / 180.0;
                z = this.Math.sqrt(x * x + y * y) - 0.00002 * this.Math.sin(y * x_pi);
                theta = this.Math.atan2(y, x) - 0.000003 * this.Math.cos(x * x_pi);

                marsCoords.latitude = z * this.Math.sin(theta);
                marsCoords.longitude = z * this.Math.cos(theta);

                return marsCoords;
            },
            /**
             * WGS-84 ==> BD-09
             * 直接纠偏转换，部分地区，如较高海拔，可能会造成较大的误差
             * @param baiduCoords include{latitude:value,longitude: value}
             * @returns earthCoords include{latitude:value,longitude: value}
             */
            baiduToEarth: function (baiduCoords) {
                return this.marsToEarth(this.baiduToMars(baiduCoords));
            },
            /**
             * BD-09 ==>  WGS-84
             * 直接纠偏转换，部分地区，如较高海拔，可能会造成较大的误差
             * @param earthCoords include{latitude:value,longitude: value}
             * @returns baiduCoords include{latitude:value,longitude: value}
             */
            earthToBaidu: function (earthCoords) {
                return this.marsToBaidu(this.earthToMars(earthCoords));
            }
        };

        return new CoordsConverter;
    });


