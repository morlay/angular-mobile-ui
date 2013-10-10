angular.module("app.tools.daily", [
        "ui.widgets.chart"
    ])
    .controller('DailyCtrl', [
        '$scope'
        , '$navigate'
        , function ($scope, $navigate) {
            $scope.options = {
                animation: false
            };


            $scope.myLineChartData = {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        fillColor: "rgba(220,220,220,0.5)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        data: [65, 59, 90, 81, 56, 55, 40]
                    },
                    {
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        data: [28, 48, 40, 19, 96, 27, 100]
                    }
                ]
            };


            $scope.myPolarAreaChartData = [
                {
                    value: 30,
                    color: "#D97041"
                },
                {
                    value: 90,
                    color: "#C7604C"
                },
                {
                    value: 24,
                    color: "#21323D"
                },
                {
                    value: 58,
                    color: "#9D9B7F"
                },
                {
                    value: 82,
                    color: "#7D4F6D"
                },
                {
                    value: 8,
                    color: "#584A5E"
                }
            ]


        }]);