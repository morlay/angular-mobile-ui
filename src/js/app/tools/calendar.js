angular.module("app.tools.calendar", [
        "utils.xdate",
        "ui.widgets.buttons"
    ])
    .factory('calendarDataPool', [
        '$rootScope'
        , 'httpMessageTypes'
        , 'httpData'
        , 'dataPool'
        , 'XDate'
        , function ($rootScope, httpMessageTypes, httpData, dataPool, XDate) {

            // 获取日程列表 ownerId  get请求(?后面带参数)
            // 响应 scheduleList (scheduleId,scheduleType,startTime,endTime,summary,detail,ownerId)
            httpMessageTypes['getScheduleList'] = "schedule/getScheduleList.do";

            // 新增日程  scheduleInfo (scheduleType,startTime,endTime,summary,detail,ownerId)
            // 响应
            httpMessageTypes['addSchedule'] = "schedule/addSchedule.do";

            // 修改日程  scheduleInfo (scheduleId,scheduleType,startTime,endTime,summary,detail,ownerId)
            // 响应
            httpMessageTypes['modifySchedule'] = "schedule/modifySchedule.do";

            // 删除日程  ownerId ,scheduleId,startTime get请求(?后面带参数)
            // 响应
            httpMessageTypes['delSchedule'] = "schedule/delSchedule.do";


            // 数据池
            var tasks = {};
            tasks.curMonthList = {}; // 来自后台的原始当月 List
            tasks.curDate = {}; // 今天  XDate 对象
            tasks.curMonth = {}; // 当月  XDate 对象

            tasks.pointDate = {}; // 焦点日期

            tasks.monthDates = {};  // 月任务数据 7 * 5 ~ 6
            tasks.weekDates = {};  // 周任务数据 7 * 1
            tasks.dayDates = {};   // 日任务数据 1 * 1

            tasks.selectDateObj = {}; // 选中的日期对象
            tasks.selectDateObjByHour = {}; // 选中的日期对象（按小时）


            $rootScope.$on('getScheduleList', function (ev, msg) {
                console.log('getScheduleList');
                // 根据月份取数据
                httpData.get('getScheduleList', {
                    ownerId: 1,
                    month: msg.month,
                    courseFlg: true
                }, function (data) {
                    console.log(data);

                    if (data.msgState == 1) {


                        angular.forEach(data.scheduleList, function (obj) {
                            // 将日期转为日期对象
                            obj.startTimeObj = (new XDate(obj.startTime));
                            obj.endTimeObj = (new XDate(obj.endTime));
                            if (obj.scheduleType == 1) {
                                obj.detail = angular.fromJson(obj.detail);
                            }
                        });

                        tasks.curMonthList = data.scheduleList;

                        $rootScope.$broadcast('updateScheduleList');
                    }
                });
            });


            // 添加日程
            $rootScope.$on('addTask', function (ev, msg) {
//                console.log(ev, msg);

                var scheduleInfo = angular.copy(msg.curTask);

                scheduleInfo.ownerId = 1;
                scheduleInfo.scheduleType = 2;
                scheduleInfo.startTime = (new XDate(scheduleInfo.startTimeString)).getTime();
                scheduleInfo.endTime = (new XDate(scheduleInfo.endTimeString)).getTime();


                httpData.post('addSchedule', {scheduleInfo: scheduleInfo}, function (data) {
                    console.log('addSchedule');
                    console.log(data);
//                    $rootScope.$emit('getScheduleList', {month: tasks.curMonth.getMonth() + 1});
                    $rootScope.$broadcast('closeTaskModal');
                });

            });

            // 修改日程
            $rootScope.$on('modifyTask', function (ev, msg) {
                var scheduleInfo = angular.copy(msg.curTask);

                scheduleInfo.ownerId = 1;
                scheduleInfo.startTime = (new XDate(scheduleInfo.startTimeString)).getTime();
                scheduleInfo.endTime = (new XDate(scheduleInfo.endTimeString)).getTime();

                console.log(scheduleInfo);


                httpData.post('modifySchedule', {scheduleInfo: scheduleInfo}, function (data) {
                    console.log('modifySchedule');
                    console.log(data);

//                    $rootScope.$emit('getScheduleList', {month: tasks.curMonth.getMonth() + 1});
                    $rootScope.$broadcast('closeTaskModal');
                });

            });

            // 删除
            $rootScope.$on('removeTask', function (ev, msg) {
//                console.log(ev, msg);

                var scheduleInfo = angular.copy(msg.curTask);

                httpData.get('delSchedule', {ownerId: scheduleInfo.ownerId, scheduleId: scheduleInfo.scheduleId, month: tasks.curMonth.getMonth() + 1}, function (data) {
                    console.log('delSchedule');
                    console.log(data);
//                    $rootScope.$emit('getScheduleList', {month: tasks.curMonth.getMonth() + 1});
                    $rootScope.$broadcast('closeTaskModal');

                });

            });


            dataPool.tasks = tasks;
            return tasks;
        }])

    .service('calendarDataHandler', [
        'calendarDataPool'
        , 'XDate'
        , function (calendarDataPool, XDate) {


            this.XDate = function (date) {
                return (new XDate(date));
            };

            this.getTaskObjById = function (id) {

                var i = calendarDataPool.curMonthList.length, obj;

                while (i--) {
                    obj = calendarDataPool.curMonthList[i];
                    if ((obj.scheduleType != 1) && (obj.scheduleId == id)) {
                        break;
                    }
                }

                return obj;

            };

            // 分割对象
            this.split = function (arr, size) {
                var arrays = [];
                while (arr.length > 0) {
                    arrays.push(arr.splice(0, size));
                }
                return arrays;
            };

            // 批量生成月日期对象
            this.getMonthDates = function (startDate, n) {
                var dates = (new Array(n));
                var current = startDate.clone(), i = 0;
                while (i < n) {
                    dates[i++] = (new XDate(current));
                    current.setDate(current.getDate() + 1);
                }
                return dates;
            };


            this.toDateObjs = function (dates) {
                var dateObjs = [];
                angular.forEach(dates, function (xDateObj, $index) {
                    var dateObj = {};

                    dateObj.date = xDateObj;

                    dateObj.row = parseInt($index / 7);
                    dateObj.column = xDateObj.getDay();

                    dateObj.isoWeek = xDateObj.getWeek();
                    dateObj.isCurMonth = (xDateObj.getMonth() == calendarDataPool.curMonth.getMonth());
                    dateObj.isToday = (xDateObj.clone().clearTime().diffDays(XDate.today()) == 0);
                    dateObj.isSelected = (xDateObj.clone().clearTime().diffDays(calendarDataPool.selectDateObj.date) == 0);

                    dateObj.taskList = [];

                    // todo
                    dateObj.taskTypes = [
                        {id: 0, isHas: false},
                        {id: 1, isHas: false},
                        {id: 2, isHas: false}
                    ];

                    if (dateObj.isToday) {
                        calendarDataPool.selectDateObj = dateObj;
                    }

                    dateObjs.push(dateObj);
                });
                return dateObjs;
            };


            this.refillMonth = function (isHasTask) {
                if (isHasTask) {
                    this.fillTaskInMonth(calendarDataPool.monthDates);
                } else {
                    var baseDate = calendarDataPool.curMonth;
                    var firstDateInCurMonth = baseDate.clone().setDate(1);
                    // 0 for Sunday, 1 for Monday, 2 for Tuesday, and so on.
                    var preNum = firstDateInCurMonth.getDay();
                    var daysInMonth = XDate.getDaysInMonth(baseDate.getFullYear(), baseDate.getMonth());
                    var dates = this.getMonthDates(firstDateInCurMonth.addDays(-preNum), (daysInMonth + preNum > 36) ? 42 : 35); // 可能跨 6 周
                    calendarDataPool.monthDates = this.split(this.toDateObjs(dates), 7);
                }
            };


            this.hourRowsInit = function () {
                var i = 24,
                    j = 7,
                    hourRows = [];
                while (i--) {
                    j = 7;
                    while (j--) {
                        var hourObj = {};

                        hourObj.hour = 23 - i;
                        hourObj.day = 6 - j;

                        hourRows.push(hourObj);
                    }
                }
                return hourRows;
            };
            this.hourRowInit = function () {
                var i = 24,
                    hourRow = [];
                while (i--) {
                    var hourObj = {};
                    hourObj.hour = 23 - i;
                    hourRow.push(hourObj);
                }
                return hourRow;
            };

            this.fillTaskInMonth = function (dateMatrix) {
                var firstDate = dateMatrix[0][0].date;
                var totalRows = dateMatrix.length;
                angular.forEach(calendarDataPool.curMonthList, function (obj) {

                    var diffDays, row, column, targetObj, i, objPre;

                    switch (obj.scheduleType) {
                        case 1:
                            i = totalRows;
                            column = obj.detail.dayInWeek;
                            while (i--) {
                                targetObj = dateMatrix[i][column];

                                obj.startTimeObj = obj.startTimeObj.setFullYear(targetObj.date.getFullYear()).setMonth(targetObj.date.getMonth()).setDate(targetObj.date.getDate());
                                obj.endTimeObj = obj.endTimeObj.setFullYear(targetObj.date.getFullYear()).setMonth(targetObj.date.getMonth()).setDate(targetObj.date.getDate());

//                                if (targetObj.isCurMonth) {

                                objPre = angular.copy(obj);

                                // fix bug __proto__ 变成了 objects
                                objPre.startTimeObj = (new XDate(objPre.startTimeObj[0]));
                                objPre.endTimeObj = (new XDate(objPre.endTimeObj[0]));

                                targetObj.taskList.push(objPre);


                                targetObj.taskTypes[1].isHas = true;
//                                }
                            }
                            break;

                        default:
                            if (obj.startTimeObj.getMonth() != obj.endTimeObj.getMonth()) {
                                obj.endTimeObj.setMonth(obj.startTimeObj.getMonth() + 1).setDate(1).clearTime();
                            }


//                            console.log(obj.startTimeObj, obj.endTimeObj);
                            var deltaDays = obj.startTimeObj.clone().clearTime().diffDays(obj.endTimeObj.clone().clearTime()) + ((obj.endTimeObj.getHours() == 0) ? 0 : 1);
                            diffDays = firstDate.clone().clearTime().diffDays(obj.startTimeObj.clone().clearTime());

//                            console.log(deltaDays);

                            row = parseInt(diffDays / 7);
                            column = diffDays % 7;

                            while (deltaDays--) {

                                if (column > 6) {
                                    column = 0;
                                    row++;
                                }

                                targetObj = dateMatrix[row][column];

                                objPre = angular.copy(obj);

                                // fix bug __proto__ 变成了 objects
                                objPre.startTimeObj = (new XDate(objPre.startTimeObj[0]));
                                objPre.endTimeObj = (new XDate(objPre.endTimeObj[0]));

                                if (objPre.startTimeObj.getDate() != targetObj.date.getDate()) {
                                    objPre.startTimeObj = targetObj.date.clone();
                                }

                                if (objPre.endTimeObj.getDate() > targetObj.date.getDate()) {
                                    objPre.endTimeObj = targetObj.date.clone().addDays(1);
                                }

                                targetObj.taskList.push(objPre);
                                targetObj.taskTypes[2].isHas = true;

                                column++;
                            }


                    }
                });
            };
            this.fillTaskByDate = function (dateObj) {
                var taskList = {};

                taskList.allDay = [];
                taskList.inDay = [];
                taskList.dateObj = dateObj;


                angular.forEach(dateObj.taskList, function (taskObj, $index) {
                    if (taskObj.startTimeObj.diffDays(taskObj.endTimeObj) < 1) {
                        // 当天的任务
                        taskObj.topFix = taskObj.startTimeObj.getHours() + taskObj.startTimeObj.getMinutes() / 60;
                        taskObj.height = taskObj.startTimeObj.diffHours(taskObj.endTimeObj);
                        taskObj.n = 1;
                        taskObj.col = 0;
                        taskList.inDay.push(taskObj);
                    } else {
                        // 跨天的任务
                        taskList.allDay.push(taskObj);
                    }
                });

                taskList.inDay.sort(function (a, b) {
                    return (b.height - a.height);
                });

                taskList.inDay.sort(function (a, b) {
                    return (a.startTimeObj.getTime() - b.startTimeObj.getTime());
                });


                var j, i, targetObj, tempObj;

                for (i = 0; targetObj = taskList.inDay[i]; i++) {
                    targetObj.isMixed = [i];
                    for (j = i + 1; tempObj = taskList.inDay[j]; j++) {
                        if (targetObj.endTimeObj.getTime() > tempObj.startTimeObj.getTime()) {
                            targetObj.isMixed.push(j);
                        }
                    }
                    console.log(targetObj.isMixed);
                }


                console.log(taskList.inDay);

                var getMixed = function (index, targetArr) {
//                    console.log('getMixed');
                    targetArr.push(index);
                    var mixedArr, len = taskList.inDay.length;
                    while (len--) {
                        mixedArr = taskList.inDay[len].isMixed;
//                        console.log(len, mixedArr.indexOf(index));
                        if (mixedArr.indexOf(index) > -1 && len != index) {
                            targetArr.push(len);
                        }
                    }
                };


                i = taskList.inDay.length;

                if (i != 0) {


                    var multiGroup = [];
                    while (i--) {
                        var obj = {
                            index: i,
                            value: taskList.inDay[i].isMixed.length,
                            arr: []
                        };
                        getMixed(i, obj.arr);
                        console.log(obj, obj.arr);
                        multiGroup.push(obj);
                    }


                    multiGroup.sort(function (a, b) {
                        return (b.arr.length - a.arr.length);
                    });

                    var MaxN = multiGroup[0].arr.length;


                    multiGroup.sort(function (a, b) {
                        return (a.index - b.index);
                    });


                    var defIndex = [0];
                    taskList.inDay[0].col = 0;


                    angular.forEach(multiGroup, function (obj) {

                        obj.arr.sort(function (a, b) {
                            return (a - b);
                        });

                        console.log(obj.index, obj.arr);
                        angular.forEach(obj.arr, function (item) {
                            targetObj = taskList.inDay[item];
                            targetObj.n = MaxN;
                            if (obj.index != item) {
                                if (defIndex.indexOf(item) > -1) {

                                } else {
                                    targetObj.col = taskList.inDay[obj.arr.indexOf(item)].col + 1;
                                    defIndex.push(item);
                                }
                            }
                        });
                    });

                }


                return taskList;


            }


        }])
    .controller('CalendarCtrl', [
        '$scope'
        , '$navigate'
        , 'calendarDataPool'
        , 'XDate'
        , function ($scope, $navigate, calendarDataPool, XDate) {


            $scope.calendarType = 'month';

            $scope.curDate = XDate.today();
            calendarDataPool.curDate = $scope.curDate;

            $scope.selectDateObj = {};
            $scope.selectDateObj.date = XDate.today();
            calendarDataPool.selectDateObj = $scope.selectDateObj;

            $scope.modalOpts = {
                backdropFade: true,
                dialogFade: true
            };


            $scope.showTaskModal = function () {
                calendarDataPool.isAddTask = true;
                $scope.isTaskModalOpen = true;
            };


            $scope.closeTaskModal = function () {
                $scope.isTaskModalOpen = false;
            };


            $scope.$on('closeTaskModal', function () {
                $scope.isTaskModalOpen = false;
                $scope.$broadcast('initCtrl.' + calendarDataPool.calendarType, {isNeedUpdate: true});
            });

            $scope.$watch('calendarType', function (newValue, oldValue) {
                calendarDataPool.calendarType = newValue;
                $scope.$broadcast('initCtrl.' + newValue, {isNeedUpdate: false});
            });


        }])
    .controller('CalendarCtrl.Month', [
        '$scope'
        , '$rootScope'
        , 'calendarDataPool'
        , 'calendarDataHandler'
        , function ($scope, $rootScope, calendarDataPool, calendarDataHandler) {
            $scope.taskList = [];

            $scope.curMonth = $scope.$parent.selectDateObj.date.clone();
            calendarDataPool.curMonth = $scope.curMonth;

            $scope.select = function (dateObj) {
                angular.forEach($scope.dateRows, function (dateRow) {
                    angular.forEach(dateRow, function (item) {
                        item.isSelected = false;
                    });
                });
                dateObj.isSelected = true;

                calendarDataPool.selectDateObj = angular.copy(dateObj);
                calendarDataPool.selectDateObj.date = calendarDataHandler.XDate(calendarDataPool.selectDateObj.date[0]);

                $scope.$parent.selectDateObj = calendarDataPool.selectDateObj;

                if (dateObj.date.getMonth() != $scope.curMonth.getMonth()) {
                    $scope.move(dateObj.date.getMonth() - $scope.curMonth.getMonth());
                }
            };

            $scope.showTaskModal = function (task) {
                calendarDataPool.isAddTask = false;

                console.log(task);

                if (task.scheduleType == 1) {
                    calendarDataPool.curTask = task;
                } else {
                    calendarDataPool.curTask = calendarDataHandler.getTaskObjById(task.scheduleId);
                }

                $scope.$parent.isTaskModalOpen = true;
            };


            $scope.move = function (direction) {
                $scope.curMonth.setMonth($scope.curMonth.getMonth() + direction);
                calendarDataPool.curMonth = $scope.curMonth;
                calendarDataHandler.refillMonth(false);
                $scope.dateRows = calendarDataPool.monthDates;

                $scope.$emit('getScheduleList', {month: $scope.curMonth.getMonth() + 1});
            };


            $scope.$on('updateMonthDates', function (ev, msg) {
                console.log('updateMonthDates');
                $scope.move(msg.direction);
            });


            $scope.$on('updateScheduleList', function (ev, msg) {
                console.log('updateScheduleList');
                calendarDataHandler.refillMonth(true);

                console.log($scope.$parent.selectDateObj, calendarDataPool.selectDateObj, calendarDataPool.monthDates);


                $scope.dateRows = calendarDataPool.monthDates;


                if (!calendarDataPool.selectDateObj) {

                    calendarDataPool.selectDateObj = angular.copy(calendarDataPool.monthDates[0][0]);
                    calendarDataPool.selectDateObj.date = calendarDataHandler.XDate(calendarDataPool.selectDateObj.date[0]);
                    $scope.$parent.selectDateObj = calendarDataPool.selectDateObj;

                }

                console.log(calendarDataPool.selectDateObj);


                $rootScope.$broadcast('updateScheduleListCompleted');
            });

            $scope.$on('initCtrl.month', function (ev, msg) {
                console.log('initCtrl.month');
                $scope.move(0);

            });
        }])
    .controller('CalendarCtrl.Week', [
        '$scope'
        , '$rootScope'
        , 'calendarDataPool'
        , 'calendarDataHandler'
        , function ($scope, $rootScope, calendarDataPool, calendarDataHandler) {
            $scope.curWeekRow = null;
            $scope.allDayMax = 0;
            $scope.updating = {};

            $scope.select = function (dateObj) {
                angular.forEach($scope.hourRows, function (hourRow) {
                    angular.forEach(hourRow, function (item) {
                        item.isSelected = false;
                    });
                });
                dateObj.isSelected = true;


                calendarDataPool.selectDateObj = angular.copy(calendarDataPool.weekDates[dateObj.day].dateObj);
                calendarDataPool.selectDateObj.date = calendarDataHandler.XDate(calendarDataPool.selectDateObj.date[0]);

                calendarDataPool.selectDateObj.date.setHours(dateObj.hour);
            };

            $scope.showTaskModal = function (task) {

                calendarDataPool.isAddTask = false;

                if (task.scheduleType == 1) {
                    calendarDataPool.curTask = task;
                } else {
                    calendarDataPool.curTask = calendarDataHandler.getTaskObjById(task.scheduleId);
                }

                $scope.$parent.isTaskModalOpen = true;
            };


            $scope.move = function (direction) {
                calendarDataPool.weekDates = [];


                console.log($scope.curWeekRow, direction, calendarDataPool.monthDates.length);

                if ($scope.curWeekRow + direction < 0) {
                    $scope.updating.is = true;
                    $scope.updating.direction = -1;
                    $rootScope.$broadcast('updateMonthDates', {direction: -1});

                } else if ($scope.curWeekRow + direction >= calendarDataPool.monthDates.length) {
                    $scope.updating.is = true;
                    $scope.updating.direction = 1;
                    $rootScope.$broadcast('updateMonthDates', {direction: 1});

                } else {

                    angular.forEach(calendarDataPool.monthDates[$scope.curWeekRow + direction], function (dateObj) {
                        var weekDate = calendarDataHandler.fillTaskByDate(dateObj);
                        calendarDataPool.weekDates.push(weekDate);
                        if (weekDate.allDay.length > $scope.allDayMax) {
                            $scope.allDayMax = weekDate.allDay.length;
                        }
                    });

                    console.log($scope.allDayMax);

                    $scope.curWeekRow = $scope.curWeekRow + direction;

                    calendarDataPool.selectDateObj = angular.copy(calendarDataPool.weekDates[0].dateObj);
                    calendarDataPool.selectDateObj.date = calendarDataHandler.XDate(calendarDataPool.selectDateObj.date[0]);
                }


                $scope.weekDates = calendarDataPool.weekDates;


                console.log($scope.weekDates);
            };

            $scope.$on('updateScheduleListCompleted', function (ev, msg) {
                console.log('updateScheduleListCompleted');
                var curWeekRow;

                if ($scope.updating.is) {
                    $scope.updating.is = false;
                    switch ($scope.updating.direction) {
                        case 1:
                            $scope.curWeekRow = 0;
                            curWeekRow = calendarDataPool.monthDates[$scope.curWeekRow];

                            if (curWeekRow[0].date.getMonth() != curWeekRow[6].date.getMonth()) {
                                $scope.curWeekRow = 1
                            }

                            $scope.move(0);
                            break;

                        case -1:
                            $scope.curWeekRow = calendarDataPool.monthDates.length - 1;

                            curWeekRow = calendarDataPool.monthDates[$scope.curWeekRow];

                            if (curWeekRow[0].date.getMonth() != curWeekRow[6].date.getMonth()) {
                                $scope.curWeekRow = $scope.curWeekRow - 1;
                            }

                            $scope.move(0);
                            break;
                        case 0:
                            $scope.move(0);
                            break;
                    }


                }


            });


            $scope.$on('initCtrl.week', function (ev, msg) {

                if (msg.isNeedUpdate) {
                    $scope.updating.is = true;
                    $scope.updating.direction = 0;
                    $rootScope.$broadcast('updateMonthDates', {direction: 0});
                } else {
                    console.log('initCtrl.week', calendarDataPool.selectDateObj);
                    $scope.curWeekRow = calendarDataPool.selectDateObj.row;
                    console.log($scope.curWeekRow);
                    $scope.hourRows = calendarDataHandler.split(calendarDataHandler.hourRowsInit(), 7);
                    $scope.move(0);

                }
            });

        }
    ])
    .controller('CalendarCtrl.Day', [
        '$scope'
        , '$rootScope'
        , 'calendarDataPool'
        , 'calendarDataHandler'
        , function ($scope, $rootScope, calendarDataPool, calendarDataHandler) {
            $scope.curDateObj = null;
            $scope.updating = {};

            $scope.select = function (dateObj) {

                angular.forEach($scope.hourRow, function (item) {
                    item.isSelected = false;
                });

                dateObj.isSelected = true;
                calendarDataPool.selectDateObj.date.setHours(dateObj.hour);
            };


            $scope.showTaskModal = function (task) {

                calendarDataPool.isAddTask = false;

                if (task.scheduleType == 1) {
                    calendarDataPool.curTask = task;
                } else {
                    calendarDataPool.curTask = calendarDataHandler.getTaskObjById(task.scheduleId);
                }

                $scope.$parent.isTaskModalOpen = true;
            };

            $scope.move = function (direction) {

                var row, column, nextDate;

                row = $scope.curDateObj.row;
                column = $scope.curDateObj.column;

                column = column + direction;

                $scope.curDateObj.column = $scope.curDateObj.column + direction;

                if (column > 6) {
                    column = 0;
                    row++;
                }
                if (column < 0) {
                    column = 6;
                    row--;
                }


                if (row < 0 || calendarDataPool.monthDates[row][column].date.getMonth() < $scope.curDateObj.date.getMonth()) {
                    $scope.updating.is = true;
                    $scope.updating.direction = -1;
                    $rootScope.$broadcast('updateMonthDates', {direction: -1});
                } else if (row >= calendarDataPool.monthDates.length || calendarDataPool.monthDates[row][column].date.getMonth() > $scope.curDateObj.date.getMonth()) {
                    $scope.updating.is = true;
                    $scope.updating.direction = 1;
                    $rootScope.$broadcast('updateMonthDates', {direction: 1});
                } else {
                    $scope.curDateObj = calendarDataPool.monthDates[row][column];
                    $scope.dayDates = calendarDataHandler.fillTaskByDate($scope.curDateObj);
                    calendarDataPool.dayDates = $scope.dayDates;

                }


            };

            $scope.$on('updateScheduleListCompleted', function (ev, msg) {
                console.log('updateScheduleListCompleted');
                if ($scope.updating.is) {
                    $scope.updating.is = false;

                    switch ($scope.updating.direction) {
                        case 1:
                            if ($scope.curDateObj.column > 6) {
                                $scope.curDateObj.column = $scope.curDateObj.column - 7;
                            }
                            $scope.curDateObj = calendarDataPool.monthDates[0][$scope.curDateObj.column];
                            $scope.move(0);
                            break;
                        case -1:
                            if ($scope.curDateObj.column < 0) {
                                $scope.curDateObj.column = $scope.curDateObj.column + 7;
                            }

                            $scope.curDateObj = calendarDataPool.monthDates[calendarDataPool.monthDates.length - 1][$scope.curDateObj.column];

                            $scope.move(0);
                            break;
                        case 0:
                            $scope.move(0);
                            break;
                    }
                }


            });


            $scope.$on('initCtrl.day', function (ev, msg) {

                if (msg.isNeedUpdate) {
                    $scope.updating.is = true;
                    $scope.updating.direction = 0;
                    $rootScope.$broadcast('updateMonthDates', {direction: 0});
                } else {
                    console.log('initCtrl.day');
                    $scope.curDateObj = calendarDataPool.selectDateObj;
                    $scope.hourRow = calendarDataHandler.hourRowInit();
                    $scope.move(0);
                }
            });

        }
    ])
    .controller('TaskViewCtrl', [
        '$scope'
        , 'calendarDataPool'
        , 'calendarDataHandler'
        , function ($scope, calendarDataPool, calendarDataHandler) {
            // 打开 modal 之后才会触发。
            $scope.isAddTask = calendarDataPool.isAddTask;
            $scope.curTask = calendarDataPool.curTask;

            console.log(calendarDataPool.curMonthList, $scope.isAddTask, calendarDataPool.selectDateObj.date);


            if ($scope.isAddTask) {
                $scope.curTask = {
                    scheduleType: 2,
                    startTimeObj: calendarDataPool.selectDateObj.date
                };

                $scope.curTask.startTimeString = $scope.curTask.startTimeObj.toString('i');


                if (calendarDataPool.selectDateObj.date.getHours() > 0) {
                    $scope.curTask.endTimeObj = calendarDataPool.selectDateObj.date.clone().addHours(1)
                } else {
                    $scope.curTask.endTimeObj = calendarDataPool.selectDateObj.date.clone().addDays(1);
                }


                $scope.curTask.endTimeString = $scope.curTask.endTimeObj.toString('i');


                $scope.curTask.startTime = calendarDataHandler.XDate($scope.curTask.startTimeString).getTime();
                $scope.curTask.endTime = calendarDataHandler.XDate($scope.curTask.endTimeString).getTime();

            }


            $scope.addTask = function () {
                console.log('addTask');
                $scope.$emit('addTask', {curTask: $scope.curTask});
            };


            $scope.preModifyTask = function () {
                console.log('preModifyTask');
                $scope.isModifying = true;

                console.log($scope.curTask);

                $scope.curTask.startTimeObj = calendarDataHandler.XDate($scope.curTask.startTime);
                $scope.curTask.endTimeObj = calendarDataHandler.XDate($scope.curTask.endTime);


                $scope.curTask.startTimeString = $scope.curTask.startTimeObj.toString('i');
                $scope.curTask.endTimeString = $scope.curTask.endTimeObj.toString('i');

            };

            $scope.modifyTask = function () {
                console.log('modifyTask');
                $scope.$emit('modifyTask', {curTask: $scope.curTask});
            };


            $scope.removeTask = function () {
                console.log('removeTask');
                $scope.$emit('removeTask', {curTask: $scope.curTask});
            }
        }]);




