'use strict';

angular.module('servicesModule', [])
.factory('apiService', ['$http', '$log', '$q', '$resource',
    function ($http, $log, $q, $resource, localStore) {
        'use strict';

        var domainApiUrl = 'BaseURL';  //We'll cover how to determine base url by domain later, for now you can pull from your constants

        function getResourcePromise(uri, payload, parameters, resourceConfig, resourceMethod, additionalHeaders) {
        // calcualte URL
            var url = domainApiUrl + uri;

            // calculate HEADERS
            var headers = angular
            .extend({}, {
                'Accept': 'application/json,text/html',
            }, additionalHeaders || {});

            // calculate method
            var method = methodMap[resourceMethod] || methodMap[resourceMethod].get;
            var isGet = method.verb === 'GET';
            var isAuthenticating = uri === '/authenticateUser';

            if (resourceConfig) {

                // initialize resource method configuration
                resourceConfig[resourceMethod] = {
                    headers: headers,
                    method: method.verb
                };

                if (isGet) {
                    resourceConfig[resourceMethod].isArray = false;
                }

                if (isAuthenticating) {
                    resourceConfig[resourceMethod].isArray = true;
                }

            }

            return method.fn($resource(url, parameters || null, resourceConfig), payload).$promise;
        }

        var methodMap = {
            delete: {
                verb: 'DELETE',
                fn: function (resource) { return resource.delete(); }
            },
            get: {
                verb: 'GET',
                fn: function (resource) { return resource.get(); }
            },
            query: {
                verb: 'GET',
                fn: function (resource) { return resource.query(); }
            },
            save: {
                verb: 'POST',
                fn: function (resource, payload) { return resource.save(payload); }
            },
            update: {
                verb: 'PUT',
                fn: function (resource, payload) { return resource.update(payload); }
            }
        };

        return {
            get: function (url, parameters) {
                return $http({
                    method: 'GET',
                    url: domainApiUrl + url,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    params: parameters
                });
            },
            post: function (uri, payload, params) {
                return getResourcePromise(
                uri,
                payload,
                params,
                null,
                'save');
            },
            put: function (uri, payload, params) {
                return getResourcePromise(
                uri,
                payload,
                params,
                null,
                'update');
            },
            remove: function (uri, params) {
                return getResourcePromise(
                uri,
                null,
                params,
                null,
                'delete');
            }
        };
    }
]);
