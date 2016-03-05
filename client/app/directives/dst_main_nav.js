angular.module( 'moviematch.directive', [] )

.directive ('dstMainNav',  function( ) {
    return {
      restrict: 'E',
      controller: function( $scope, Session, Auth ) {
        $scope.expand = false;
        $scope.lastEventType;
        $scope.username = Auth.getUserName();
        $scope.toggleNavList = function(ev){
          if (!(ev.type === 'mouseleave' && $scope.lastEventType === 'click')) {
            $scope.expand = !$scope.expand;
          }
          $scope.lastEventType = ev.type;
        };
      },
      templateUrl: 'app/directives/dst_main_nav.html',
  }
});
