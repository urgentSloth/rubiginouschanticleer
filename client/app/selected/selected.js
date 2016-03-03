angular.module( 'moviematch.selected', [] )

.controller( 'SelectedController', function( $scope, Session, Socket, $location, Auth) {
  $scope.selectedOption = Session.getSelectedOption();
})