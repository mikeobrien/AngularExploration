angular.module('libraryApp', ['ngResource', 'ui.bootstrap'])

    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'BooksCtrl',
                templateUrl: 'books.html'
            })
            .when('/edit/:id', {
                controller: 'EditBookCtrl',
                templateUrl: 'edit-book.html'
            })
            .otherwise({ redirectTo: '/' });
    })

    .controller('BooksCtrl', function($scope, $resource, $dialog) {
        $scope.library = $resource('/books', { callback: 'JSON_CALLBACK' });
        
        $scope.search = function() {
            $scope.books = $scope.library.query({ q: $scope.filter });
        }

        $scope.add = function() {
            $dialog.dialog({ templateUrl: 'add-book.html', controller: 'AddBookCtrl' }).open();
        }
    })

    .controller('AddBookCtrl', function($scope, $resource, dialog) {
        $scope.library = $resource('/books', { callback: 'JSON_CALLBACK' });
        $scope.close = function(ok) {
            if (ok) $scope.library.save($scope.book);
            dialog.close();
        };
    })

    .controller('EditBookCtrl', function($scope, $routeParams, $resource) {
        console.log($routeParams.id);
    });