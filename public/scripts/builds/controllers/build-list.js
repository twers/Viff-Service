module.exports = [
    '$rootScope',
    '$scope',
    '$routeParams',
    'Builds',
    function (rootScope, scope, params, Builds) {
        var id = params.id;
        scope.builds = Builds.get(id);


        scope.getTaskListLength = function (config) {
            // todo
            return config.match(new RegExp(/paths:\s\[([^\]]+)]/))[1].split(',').length;
        };

        scope.hasRunningHistory = function () {
            return scope.isRunning || !!(scope.builds && scope.builds.length);
        };

        getList();


        function getList() {
            Builds.all({ jid: id }, function () {
            });
        }


    }
];
