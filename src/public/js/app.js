angular.module('Library', ['ngResource']);

function LibraryCtrl($scope, $resource) {
    $scope.library = $resource('/:action', 
        { action: 'books', q: '', callback: 'JSON_CALLBACK' });
    
    $scope.search = function() {
        $scope.books = $scope.library.query({ q: $scope.filter });
    }
}