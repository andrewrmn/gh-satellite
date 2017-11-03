// ---------------------------------------------------------------------
// Global JavaScript
// Authors: Andrew Ross & a little help from my friends
// ---------------------------------------------------------------------

var AROSSMN = AROSSMN || {};

(function($, APP) {

    $(function() {
        APP.BrowserDeviceDetection.init();
        APP.DetectViewPort.init();
    });

// ---------------------------------------------------------------------
// Browser and Feature Detection
// ---------------------------------------------------------------------

APP.BrowserDeviceDetection = {
    userAgent: undefined,
    $html: undefined,

    init: function() {
        APP.Features = APP.Features || {};
        this.userAgent = navigator.userAgent.toLowerCase();
        this.$html = $('html');
        this.detectJs();
        this.noTouch();
        this.isTouch();
        this.isNewIE();
        this.isIE();
    },

    detectJs: function() {
        $(document).ready(function() {
            $('body').addClass('page-loaded');
            $('.js-section-full').css({'height': $(window).height() });
        });

        $(window).resize(function(){
            $('.js-section-full').css({'height': $(window).height() });
        });
    },

    noTouch: function() {
        if ( ! ('ontouchstart' in window) ) {
            APP.Features.noTouch = false;
            this.$html.addClass('noTouch');
            return;
        }
        APP.Features.noTouch = false;
    },

    isTouch: function() {
        if ( 'ontouchstart' in window ) {
            APP.Features.isTouch = false;
            this.$html.addClass('isTouch');
            return;
        }
        APP.Features.isTouch = false;
    },

    isNewIE: function() {
        if (document.documentMode || /Edge/.test(navigator.userAgent)) {
            if(navigator.appVersion.indexOf('Trident') === -1) {
                this.$html.addClass('isEDGE');
            } else {
                this.$html.addClass('isIE isIE11');
            }
            return;
        }

        APP.Features.isNewIE = false;
    },

    isIE: function() {
        if( navigator.appVersion.indexOf("MSIE") !== -1 ) {
            this.$html.addClass('isIE');
            APP.Features.isIE = true;
            return;
        }
        APP.Features.isIE = false;
    }
}



// ---------------------------------------------------------------------
// Detect when an element is in the viewport
// ---------------------------------------------------------------------

APP.DetectViewPort = {

    init: function() {
        $.fn.isOnScreen = function(){
			var elementTop = $(this).offset().top,
				elementBottom = elementTop + $(this).outerHeight(),
				viewportTop = $(window).scrollTop(),
				viewportBottom = viewportTop + $(window).height();
			return elementBottom > viewportTop && elementTop < viewportBottom;
		};

		function detection() {
			for(var i = 0; i < items.length; i++) {
				var el = $( items[i] );
				if( el.isOnScreen() ){
					el.addClass('in-view');
				} else {
					el.removeClass('in-view');
				}
			}
		}

		var items = document.querySelectorAll('*[data-animate-in], *[data-detect-viewport]'),
            waiting = false;

		$(window).on("resize scroll", function(){
			detection();
		});

		$(document).ready(function(){
            setTimeout(function(){
                detection();
            }, 500);

			for(var i = 0; i < items.length; i++) {
				var d = 0,
					el = $( items[i] );
				if( items[i].getAttribute('data-animate-in-delay') ) {
					d = items[i].getAttribute('data-animate-in-delay') / 1000 + 's';
				} else {
					d = 0;
				}
				el.css('transition-delay', d);
			}
		});
    }
}

}(jQuery, AROSSMN));
