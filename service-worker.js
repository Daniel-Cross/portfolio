"use strict";var precacheConfig=[["/portfolio/index.html","43f554d49ca8e13bb759e81a15482144"],["/portfolio/static/css/main.fd9141b6.css","e7851617030bf987c6c21d892b168882"],["/portfolio/static/js/main.ab53bf87.js","3eeacc8e4014f71ef056727a79048b0b"],["/portfolio/static/media/5-3-1.deed4047.png","deed4047ee832a5b05757ab5f105b80f"],["/portfolio/static/media/Screen Shot 2018-09-05 at 12.56.12.7b9551bb.png","7b9551bb7094701a093b55f2d088a84e"],["/portfolio/static/media/Screen Shot 2018-09-07 at 13.26.04.3cf1f0f9.png","3cf1f0f910f13047f4e865303f91ceb4"],["/portfolio/static/media/Screen Shot 2018-09-07 at 13.32.07.fecf6f9b.png","fecf6f9b609350eb3439a1cd51d04616"],["/portfolio/static/media/Screen Shot 2018-09-10 at 15.07.00.c7b5c080.png","c7b5c08070bb1fd87cbf74b05262c3cc"],["/portfolio/static/media/Screen Shot 2018-09-19 at 00.16.59.481fb5c4.png","481fb5c4234c5fd4c2f69bb5ad126eee"],["/portfolio/static/media/Screen Shot 2018-09-24 at 13.31.48.eb3ceab0.png","eb3ceab06ad9551e892ff9922b0d9a69"],["/portfolio/static/media/Screen Shot 2018-09-26 at 12.29.50.20f14b60.png","20f14b603b3db7df8cad859922561ad1"],["/portfolio/static/media/faviconcolour.8ce08752.png","8ce087521ccb443bcf373d17cc6f044d"],["/portfolio/static/media/logocolour.96e7e402.png","96e7e402e0191745df5e0561dc4ca34e"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=t),n.toString()},cleanResponse=function(t){return t.redirected?("body"in t?Promise.resolve(t.body):t.blob()).then(function(e){return new Response(e,{headers:t.headers,status:t.status,statusText:t.statusText})}):Promise.resolve(t)},createCacheKey=function(e,t,n,r){var a=new URL(e);return r&&a.pathname.match(r)||(a.search+=(a.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(n)),a.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var n=new URL(t).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,n){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(t){return n.every(function(e){return!e.test(t[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],n=e[1],r=new URL(t,self.location),a=createCacheKey(r,hashParamName,n,/\.\w{8}\./);return[r.toString(),a]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(r){return setOfCachedUrls(r).then(function(n){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!n.has(t)){var e=new Request(t,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+t+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return r.put(t,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var n=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(t){return t.keys().then(function(e){return Promise.all(e.map(function(e){if(!n.has(e.url))return t.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(t){if("GET"===t.request.method){var e,n=stripIgnoredUrlParameters(t.request.url,ignoreUrlParametersMatching),r="index.html";(e=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,r),e=urlsToCacheKeys.has(n));var a="/portfolio/index.html";!e&&"navigate"===t.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],t.request.url)&&(n=new URL(a,self.location).toString(),e=urlsToCacheKeys.has(n)),e&&t.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',t.request.url,e),fetch(t.request)}))}});