/*global angular*/
/*eslint no-loop-func:0, func-names:0*/

(function withAngular(angular) {
  'use strict';

  angular.module('720kb.socialshare', [])
  .directive('socialshare', ['$window', '$location',
  function manageDirective($window, $location) {

    return {
      'restrict': 'A',
      'link': function linkingFunction($scope, element, attr) {

        var key
          , attributeName
          , properties = {}
          , propDefaults = {
            'url': '',
            'redirectUri': '',
            'provider': '',
            'type': '',
            'text': '',
            'caption': '',
            'to': '',
            'ref': '',
            'display': '',
            'from': '',
            'media': '',
            'hashtags': '',
            'via': '',
            'description': '',
            'source': '',
            'subreddit': '',
            'follow': '',
            'popupHeight': 500,
            'popupWidth': 500
          };
        // observe the values in each of the properties so that if they're updated elsewhere,
        // they are updated in this directive.
        for (key in propDefaults) {
          if (propDefaults.hasOwnProperty(key)) {
            attributeName = 'socialshare' + key.substring(0, 1).toUpperCase() + key.substring(1);
            (function observePropValues(keyName) {
              attr.$observe(attributeName, function observeAttrs(value) {
                if (value) {
                  properties[keyName] = value;
                }
              });
            }(key));
            if (properties[key] === undefined){
              properties[key] = propDefaults[key];
            }
          }
        }

        properties.eventTrigger = attr.socialshareTrigger || 'click';

        $scope.facebookShare = function manageFacebookShare(data) {

          if (data.type && data.type === 'feed') {

            // if user specifies that they want to use the Facebook feed dialog (https://developers.facebook.com/docs/sharing/reference/feed-dialog/v2.4)
            var urlString = 'https://www.facebook.com/dialog/feed?display=popup&app_id=' + encodeURI(data.via) + '&redirect_uri=' + encodeURI(data.redirectUri);

            if (data.url) {
              urlString += '&link=' + encodeURIComponent(data.url);
            }

            if (data.to) {
              urlString += '&to=' + encodeURIComponent(data.to);
            }
            if (data.display) {
              urlString += '&display=' + encodeURIComponent(data.display);
            }

            if (data.ref) {
              urlString += '&ref=' + encodeURIComponent(data.ref);
            }

            if (data.from) {
              urlString += '&from=' + encodeURIComponent(data.from);
            }

            if (data.description) {
              urlString += '&description=' + encodeURIComponent(data.description);
            }

            if (data.text) {
              urlString += '&name=' + encodeURIComponent(data.text);
            }

            if (data.caption) {
              urlString += '&caption=' + encodeURIComponent(data.caption);
            }

            if (data.media) {
              urlString += '&picture=' + encodeURIComponent(data.media);
            }

            if (data.source) {
              urlString += '&source=' + encodeURIComponent(data.source);
            }

            $window.open(
              urlString,
              'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight);

          } else {

            //otherwise default to using sharer.php
            $window.open(
              'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(data.url || $location.absUrl())
              , 'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight);
          }
        };

        $scope.twitterShare = function manageTwitterShare(data) {
          var urlString = 'https://www.twitter.com/intent/tweet?';

          if (data.text) {
            urlString += 'text=' + encodeURIComponent(data.text);
          }

          if (data.via) {
            urlString += '&via=' + encodeURI(data.via);
          }

          if (data.hashtags) {
            urlString += '&hashtags=' + encodeURI(data.hashtags);
          }

          //default to the current page if a URL isn't specified
          urlString += '&url=' + encodeURIComponent(data.url || $location.absUrl());

          $window.open(
            urlString,
            'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight
          );

        };

        $scope.googlePlusShare = function manageGooglePlusShare(data) {

          $window.open(
            'https://plus.google.com/share?url=' + encodeURIComponent(data.url || $location.absUrl())
            , 'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight);
        };

        $scope.redditShare = function manageRedditShare(data) {
          var urlString = 'https://www.reddit.com/';

          if (data.subreddit) {
            urlString += 'r/' + data.subreddit + '/submit?url=';
          } else {
            urlString += 'submit?url=';
          }

          /*-
           * Reddit isn't responsive and at default width for our popups (500 x 500), everything is messed up.
           * So, overriding the width if it is less than 900 (played around to settle on this) and height if
           * it is less than 650px.
          */
          if (data.popupWidth < 900) {
            data.popupWidth = 900;
          }

          if (data.popupHeight < 650) {
            data.popupHeight = 650;
          }

          $window.open(
            urlString + encodeURIComponent(data.url || $location.absUrl()) + '&title=' + encodeURIComponent(data.text)
            , 'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight);
        };

        $scope.stumbleuponShare = function manageStumbleuponShare(data) {

          $window.open(
            'https://www.stumbleupon.com/submit?url=' + encodeURIComponent(data.url || $location.absUrl()) + '&title=' + encodeURIComponent(data.text)
            , 'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight);
        };

        $scope.linkedinShare = function manageLinkedinShare(data) {
          /*
           * Refer: https://developer.linkedin.com/docs/share-on-linkedin
           * Tab: Customized URL
           */
          var urlString = 'https://www.linkedin.com/shareArticle?mini=true';

          urlString += '&url=' + encodeURIComponent(data.url || $location.absUrl());

          if (data.text) {
            urlString += '&title=' + encodeURIComponent(data.text);
          }

          if (data.description) {
            urlString += '&summary=' + encodeURIComponent(data.description);
          }

          if (data.source) {
            urlString += '&source=' + encodeURIComponent(data.source);
          }

          $window.open(
              urlString,
              'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight);
        };

        $scope.pinterestShare = function managePinterestShare(data) {

          $window.open(
            'https://www.pinterest.com/pin/create/button/?url=' + encodeURIComponent(data.url || $location.absUrl()) + '&media=' + encodeURI(data.media) + '&description=' + encodeURIComponent(data.text)
            , 'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight);
        };

        $scope.diggShare = function manageDiggShare(data) {

          $window.open(
            'https://www.digg.com/submit?url=' + encodeURIComponent(data.url || $location.absUrl()) + '&title=' + encodeURIComponent(data.text)
            , 'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight);
        };

        $scope.tumblrShare = function manageTumblrShare(data) {

          if (data.media) {
            var urlString = 'https://www.tumblr.com/share/photo?source=' + encodeURIComponent(data.media);

            if (data.text) {
              urlString += '&caption=' + encodeURIComponent(data.text);
            }

            $window.open(
                urlString,
                'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight);
          } else {

            $window.open(
                'https://www.tumblr.com/share/link?url=' + encodeURIComponent(data.url) + '&description=' + encodeURIComponent(data.text)
                , 'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight);
          }
        };

        $scope.vkShare = function manageVkShare(data) {

          $window.open(
            'https://www.vk.com/share.php?url=' + encodeURIComponent(data.url || $location.absUrl())
            , 'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight);
        };

        $scope.deliciousShare = function manageDeliciousShare(data) {

          $window.open(
            'https://www.delicious.com/save?v=5&noui&jump=close&url=' + encodeURIComponent(data.url || $location.absUrl()) + '&title=' + encodeURIComponent(data.text)
            , 'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight);
        };

        $scope.bufferShare = function manageBufferShare(data) {
          var urlString = 'https://bufferapp.com/add?';

          if (data.text) {
            urlString += 'text=' + encodeURIComponent(data.text);
          }

          if (data.via) {
            urlString += '&via=' + encodeURI(data.via);
          }

          //default to the current page if a URL isn't specified
          urlString += '&url=' + encodeURIComponent(data.url || $location.absUrl());

          $window.open(
            urlString,
            'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight
          );
        };

        $scope.hackernewsShare = function manageHackernewsShare(data) {
          var urlString = 'https://news.ycombinator.com/submitlink?';

          if (data.text) {
            urlString += 't=' + encodeURIComponent(data.text) + '&';
          }

          //default to the current page if a URL isn't specified
          urlString += 'u=' + encodeURIComponent(data.url || $location.absUrl());

          $window.open(
            urlString,
            'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight
          );
        };

        $scope.flipboardShare = function manageFlipboardShare(data) {
          var urlString = 'https://share.flipboard.com/bookmarklet/popout?v=2&';

          if (data.text) {
            urlString += 'title=' + encodeURIComponent(data.text) + '&';
          }

          //default to the current page if a URL isn't specified
          urlString += 'url=' + encodeURIComponent(data.url || $location.absUrl());

          $window.open(
            urlString,
            'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight
          );
        };

        $scope.pocketShare = function managePocketShare(data) {
          var urlString = 'https://getpocket.com/save?';

          if (data.text) {
            urlString += 'text=' + encodeURIComponent(data.text) + '&';
          }

          //default to the current page if a URL isn't specified
          urlString += 'url=' + encodeURIComponent(data.url || $location.absUrl());

          $window.open(
            urlString,
            'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight
          );
        };

        $scope.wordpressShare = function manageWordpressShare(data) {
          var urlString = 'http://wordpress.com/press-this.php?';

          if (data.text) {
            urlString += 't=' + encodeURIComponent(data.text) + '&';
          }
          if (data.media) {
            urlString += 'i=' + encodeURIComponent(data.media) + '&';
          }

          //default to the current page if a URL isn't specified
          urlString += 'u=' + encodeURIComponent(data.url || $location.absUrl());

          $window.open(
            urlString,
            'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight
          );
        };

        $scope.xingShare = function manageXingShare(data) {
          var followUrl = '';

          if (data.follow) {
            followUrl = '&follow_url=' + encodeURIComponent(data.follow);
          }
          $window.open(
              'https://www.xing.com/spi/shares/new?url=' + encodeURIComponent(data.url || $location.absUrl()) + followUrl
              , 'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight);
        };
		
		//CybernatiC Addins
		// http://github.com/Fayozjon/angular-socialshare
		
		//done: Ok.ru 
		
	    $scope.okShare = function manageOkShare(data) { 
          $window.open(
            'http://ok.ru/dk?st.cmd=addShare&st.s=1&st._surl=' + encodeURIComponent(data.url || $location.absUrl()) + '&st.comments=' + encodeURIComponent(data.text)
            , 'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight);
        };
		
		//done: mail.ru
		$scope.mailruShare = function manageMailruShare(data) {
          $window.open(
            'http://connect.mail.ru/share?url=' + encodeURIComponent(data.url || $location.absUrl()) + '&title='
			+ encodeURIComponent(data.text) 
            , 'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight);
        };
		//done: telegram
		$scope.telegramShare = function manageTelegramShare(data) {
          $window.open(
            'https://telegram.me/share/url?url=' + encodeURIComponent(data.url || $location.absUrl()) + '&text='
			+ encodeURIComponent(data.text) 
            , 'sharer', 'toolbar=0,status=0,width=' + data.popupWidth + ',height=' + data.popupHeight);
        };
		 
		

        element.bind(properties.eventTrigger, function onEventTriggered() {

          switch (properties.provider) {
            case 'facebook': {

              $scope.facebookShare(properties);
              break;
            }

            case 'google+': {

              $scope.googlePlusShare(properties);
              break;
            }

            case 'twitter': {

              $scope.twitterShare(properties);
              break;
            }

            case 'stumbleupon': {

              $scope.stumbleuponShare(properties);
              break;
            }

            case 'reddit': {

              $scope.redditShare(properties);
              break;
            }

            case 'pinterest': {

              $scope.pinterestShare(properties);
              break;
            }

            case 'linkedin': {

              $scope.linkedinShare(properties);
              break;
            }

            case 'digg': {

              $scope.diggShare(properties);
              break;
            }

            case 'tumblr': {

              $scope.tumblrShare(properties);
              break;
            }

            case 'delicious': {

              $scope.deliciousShare(properties);
              break;
            }

            case 'vk': {

              $scope.vkShare(properties);
              break;
            }

            case 'buffer': {

              $scope.bufferShare(properties);
              break;
            }

            case 'pocket': {

              $scope.pocketShare(properties);
              break;
            }

            case 'wordpress': {

              $scope.wordpressShare(properties);
              break;
            }

            case 'flipboard': {

              $scope.flipboardShare(properties);
              break;
            }

            case 'hackernews': {

              $scope.hackernewsShare(properties);
              break;
            }

            case 'xing': {

              $scope.xingShare(properties);
              break;
            }
			//New addings by CybernatiC 
			//http://github.com/Fayozjon/angular-socialshare
			case 'telegram': {
              $scope.telegramShare(properties);
              break;
            }
			case 'mailru': {
              $scope.mailruShare(properties);
              break;
            }
			case 'ok': {
              $scope.okShare(properties);
              break;
            }

            default: {
              return;
            }
          }
        });
      }
    };
  }]);
}(angular));
