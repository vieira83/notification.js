
n (require) {
  'use strict';
  var Notification = {},
      $ = require('jquery'),
      Labels = require('i18n!crete/nls/labels'),
      easing = require('jquery.easing');

  Notification.timer=0;
  Notification.defaultMessage = Labels.patientRatingNotificationBar;
  Notification.notice = function (options) {
    var notifOptions = options || {},
      time = 5000,
      $alertBar = $(".notification_container .notification--item"),
      $notificationSection = $alertBar.find('.notification--message'),
      oldMessage =  Notification.defaultMessage,
      message = notifOptions.message,
      headerHeight = $('#header .container').height();

    if ('height' in notifOptions) {
      headerHeight = notifOptions.height;
    }

    if (message) {
      $notificationSection.text(message);
    }

    if(Notification.timer!=0 && $alertBar.is(":visible")){
      Notification.reset(time, headerHeight, $alertBar, oldMessage);
    }
    else{
      Notification.animate(time, headerHeight, $alertBar, oldMessage);
    }
  },

      Notification.reset = function (time, height, $alertBar, oldMessage) {
        clearTimeout(Notification.timer);
        Notification.timer = 0;
        $alertBar.fadeOut(400,function(){
          $(this).css('top', height);
        }).fadeIn(400, 'easeInElastic')
            .animate({top:'+=25px'},400 , 'easeOutElastic');
        Notification.setFadeOutTime(time, $alertBar, oldMessage);
      },

      Notification.animate = function (time, height, $alertBar, oldMessage){
        $alertBar.css('top', height);
        $alertBar.stop()
            .fadeIn(400, 'easeInElastic')
            .animate({top:'+=25px'},400, 'easeOutElastic');
        Notification.setFadeOutTime(time, $alertBar, oldMessage);
      },

      Notification.setFadeOutTime =  function (time, $alertBar, oldMessage) {
        Notification.timer = setTimeout(function(){
          $alertBar.fadeOut(400, function() {
            $alertBar.find('.notification--message').text(oldMessage);
          });
        }, time);
      },

      Notification.Close = function() {
        clearTimeout(Notification.timer);
        $(".notification_container .notification--item").fadeOut(400);
      };

  return Notification;
});
