/******************************************
square tiles gallery + integrated ligthbox
by mbc (http://altervista.cambiamentico.org/PAGES/experiments/faces-tiles/)
thanks to imagelightbox (http://osvaldas.info/image-lightbox-responsive-touch-friendly)
******************************************/
function imageLightbox(_a,_b){
	//-------------------------------------------------------- private
	var imageWidth		= 0,
		imageHeight		= 0,
		swipeDiff		= 0,
		image				= $(),
		targets			= [],
		description		= '',
		inProgress		= false
		options			= {},
		targetID			= 0;
	var self = this;
	//-------------------------------------------------------- utility functions
	var cssTransitionSupport = function(){
			var s = document.body || document.documentElement, s = s.style;
			if( s.WebkitTransition == '' ) return '-webkit-';
			if( s.MozTransition == '' ) return '-moz-';
			if( s.OTransition == '' ) return '-o-';
			if( s.transition == '' ) return '';
			return false;
		},
		isCssTransitionSupport = cssTransitionSupport() === false ? false : true,
		cssTransitionTranslateX = function( element, positionX, speed ){
			var options = {}, prefix = cssTransitionSupport();
			options[ prefix + 'transform' ]	 = 'translateX(' + positionX + ')';
			options[ prefix + 'transition' ] = prefix + 'transform ' + speed + 's linear';
			element.css( options );
		},
		hasTouch	= ( 'ontouchstart' in window ),
		hasPointers = window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
		wasTouched	= function(event){
			if( hasTouch ) return true;
			if( !hasPointers || typeof event === 'undefined' || typeof event.pointerType === 'undefined' ) return false;

			if( typeof event.MSPOINTER_TYPE_MOUSE !== 'undefined' ){
				if( event.MSPOINTER_TYPE_MOUSE != event.pointerType ) return true;
			}
			else{
				if( event.pointerType != 'mouse' ) return true;
			}
			return false;
		};
	//-------------------------------------------------------- main functions
	//options!!!
	this.setOptions = function(opt){
		options = $.extend(
		{
			selector:			'imagelightbox',
			caption:				'imagelightbox-text',
			specialitems:		['imagelightbox-desc','imagelightbox-text'],
			allowedTypes:		'png|jpg|jpeg|gif',
			animationSpeed:	250,
			preloadNext:		true,
			enableKeyboard:	true,
			quitOnEnd:			false,
			quitOnImgClick: 	false,
			quitOnDocClick: 	true,
			onStart:				false,
			onEnd:				false,
			onLoadStart:		false,
			onLoadEnd:			false,
			fillMode:			3//0 = leave borders, //1 = fill width or height, //2 = fill screen, //3 = auto adjust
		 }, opt )
	};
	
	this.updateoptions = function(opt){
		options = $.extend(options,opt);
	};
	
	//targets!!!
	this.setGallery = function(array){
		targets = array;
	}
	
	//eventually set targets if passed
	if (typeof _b !== 'undefined'){
		this.setOptions(_b);
		this.setGallery(_a);
	}
	//or set only options
	else if (typeof _a !== 'undefined' ) this.setOptions(_a);
	
	
	//update image dimensions
	this.setImage = function(){
		if( !image.length ) return true;
		var screenWidth	= $(window).width(),
			screenHeight	= $(window).height(),
			tmpImage			= new Image();
		//auto fill mode on?
		var fill = options.fillMode;
		if (fill == 3){
			var area = screenWidth * screenHeight / 10000;
			if (area < 35) fill = 2;
			else if (area < 70) fill = 1;
			else fill = 0;
		}
		//when temporary image loaded (may be in cache) update displayed image:
		tmpImage.onload = function(){
			imageWidth		= tmpImage.width;
			imageHeight		= tmpImage.height;
			//set up the displayed image dimensions on screen:
			if (fill == 0){
				screenWidth	*= 0.9;
				screenHeight *= 0.95;
			}
			if ( imageWidth > screenWidth || imageHeight > screenHeight ){
				var ratio;
				if (fill == 2){
					if (imageHeight < screenHeight || imageWidth < screenWidth) ratio = 1;
					else ratio = Math.min( imageHeight/screenHeight, imageWidth/screenWidth );
				}
				else {
					ratio	 = imageWidth/imageHeight > screenWidth/screenHeight ? imageWidth/screenWidth : imageHeight/screenHeight;
				}
				imageWidth	/= ratio;
				imageHeight	/= ratio;
			}
			//update image dimension according to window size
			image.css({
				'width':  imageWidth + 'px',
				'height': imageHeight + 'px',
				'top':    ( $( window ).height() - imageHeight ) / 2 + 'px',
				'left':   ( $( window ).width() - imageWidth ) / 2 + 'px'
			});
			//create description
			$('#'+options.caption).html( targets[targetID].desc.replace(/\r\n|\n|\r/g,"<br>") );
		};
		//start loading image
		tmpImage.src	= image.attr('src');
	};
	
	this.loadImage = function( direction ){
		if( inProgress ) return false;
		direction = typeof direction === 'undefined' ? false : direction == 'left' ? 1 : -1;
		
		//if there is an image:
		if( image.length ){
			//when quitting the lightbox and stop every script?
			if( direction !== false &&
				( targets.length < 2 ||
					( options.quitOnEnd === true &&
						( ( direction === +1 && targetID == 0 ) || ( direction === -1 && targetID == targets.length-1 ) )
					)
				)
			){
				self.self.quitLightbox();
				return false;
			}
			//animate swifting the current image, then destroy it.
			var params = { 'opacity': 0 };
			if( isCssTransitionSupport ) cssTransitionTranslateX( image, ( 100 * direction ) - swipeDiff + 'px', options.animationSpeed / 1000 );
			else params.left = parseInt( image.css( 'left' ) ) + 100 * direction + 'px';
			image.animate( params, options.animationSpeed, function(){ self.removeImage(); });
			swipeDiff = 0;
		}
		
		//always, if not quitted the lightbox:
		inProgress = true;
		//run custom script on load image start:
		if( options.onLoadStart !== false ) options.onLoadStart();
		setTimeout( function(){
			//setup "image"
			image = $( '<img id="'+options.selector+'">' )
			.load( function(){
				image.appendTo( 'body' );	//create image
				self.setImage();				//set dimensions of image
				//animate swifting the new image
				var params = { 'opacity': 1 };
				image.css( 'opacity', 0 );
				if (isCssTransitionSupport){
					cssTransitionTranslateX( image, -100 * direction + 'px', 0 );
					setTimeout( function(){ cssTransitionTranslateX( image, 0 + 'px', options.animationSpeed / 1000 ) }, 50 );
				}
				else{
					var imagePosLeft = parseInt( image.css( 'left' ) );
					params.left = imagePosLeft + 'px';
					image.css( 'left', imagePosLeft - 100 * direction + 'px' );
				}
				image.animate( params, options.animationSpeed, function(){
					inProgress = false;
					if( options.onLoadEnd !== false ) options.onLoadEnd();
				});
				
				//start preloading next image:
				if( options.preloadNext ){
					var NEXTtargetID = targetID+1;
					if (NEXTtargetID < 0) NEXTtargetID = targets.length-1;
					else if (NEXTtargetID >= targets.length) NEXTtargetID = 0;
					$( '<img>' ).attr( 'src', targets[NEXTtargetID].src ).load();
				}
			})
			.error( function(){
				//in case error occurs, call the custom end-function
				if( options.onLoadEnd !== false ) options.onLoadEnd();
			})
			.attr( 'src', targets[targetID].src )
			
			//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
			//apply touch/click/any other event applyed to the #imagelightbox.
			var swipeStart	 = 0,
				swipeEnd	 = 0,
				imagePosLeft = 0;
			image
			.on( hasPointers ? 'pointerup MSPointerUp' : 'click', function(e){
				e.preventDefault();
				//stop/quit lightbox:
				if( options.quitOnImgClick ){
					self.self.quitLightbox();
					return false;
				}
				if( wasTouched(e.originalEvent) ) return true;
				//get where it was released the pointer:
				var posX = ( e.pageX || e.originalEvent.pageX ) - e.target.offsetLeft;
				targetID += ( imageWidth / 2 > posX ? -1 : 1 );
				if (targetID < 0) targetID = targets.length-1;
				else if (targetID >= targets.length) targetID = 0;
				//load and show next image (prev/next)
				self.loadImage( imageWidth / 2 > posX ? 'left' : 'right' );
			})
			.on( 'touchstart pointerdown MSPointerDown', function(e){
				if( !wasTouched( e.originalEvent ) || options.quitOnImgClick ) return true;
				if( isCssTransitionSupport ) imagePosLeft = parseInt( image.css( 'left' ) );
				swipeStart = e.originalEvent.pageX || e.originalEvent.touches[ 0 ].pageX;
			})
			.on( 'touchmove pointermove MSPointerMove', function(e){
				if( !wasTouched( e.originalEvent ) || options.quitOnImgClick ) return true;
				e.preventDefault();
				swipeEnd = e.originalEvent.pageX || e.originalEvent.touches[ 0 ].pageX;
				swipeDiff = swipeStart - swipeEnd;
				if( isCssTransitionSupport ) cssTransitionTranslateX( image, -swipeDiff + 'px', 0 );
				else image.css( 'left', imagePosLeft - swipeDiff + 'px' );
			})
			.on( 'touchend touchcancel pointerup pointercancel MSPointerUp MSPointerCancel', function(e){
				if( !wasTouched( e.originalEvent ) || options.quitOnImgClick ) return true;
				if( Math.abs( swipeDiff ) > 50 ){
					targetID += ( swipeDiff < 0 ? -1 : +1 );
					if (targetID < 0) targetID = targets.length-1;
					else if (targetID >= targets.length) targetID = 0;
					self.loadImage( swipeDiff > 0 ? 'right' : 'left' );	
				}
				else{
					if( isCssTransitionSupport ) cssTransitionTranslateX( image, 0 + 'px', options.animationSpeed / 1000 );
					else image.animate({ 'left': imagePosLeft + 'px' }, options.animationSpeed / 2 );
				}
			});
		},
		options.animationSpeed + 100);
	}
	
	this.removeImage = function(){
		if( !image.length ) return false;
		image.remove();
		image = $();
	};
	
	//close lightbox
	this.quitLightbox = function(){
		if( !image.length ) return false;
		image.animate({ 'opacity': 0 }, options.animationSpeed, function(){
			self.removeImage();
			inProgress = false;
			if( options.onEnd !== false ) options.onEnd();
		});
	};
	
	//html trigger - must have data "id": self.loadImage(targets[id])
	this.addTrigger = function($elem){
		return $elem.click(function(e){
			e.preventDefault();
			if( options.onStart !== false ) options.onStart();
			targetID = Number($(this).data('id'));
			description = $(this).data('desc');
			self.loadImage();
		});
	}
	
	//-------------------------------------------------------- document ready function
	$(function(){
		//update image dimension on window resizing
		$( window ).on( 'resize', self.setImage );
		
		//close lightbox if clicking out of #imagelightbox [optional]
		if (options.quitOnDocClick){
			$( document ).on( hasTouch ? 'touchend' : 'click', function(e){
				if( image.length && !$(e.target).is(image) && options.specialitems.indexOf(e.target.id) === -1 ) self.quitLightbox();
			});
		}
		
		//keyboard arrows
		if( options.enableKeyboard ){
			$( document ).on( 'keyup', function(e){
				if( !image.length ) return true;
				e.preventDefault();
				if( e.keyCode == 27 ) self.quitLightbox();
				if( e.keyCode == 37 || e.keyCode == 39 ){
					targetID += ( e.keyCode == 37 ? -1 : +1 );
					if (targetID < 0) targetID = targets.length-1;
					else if (targetID >= targets.length) targetID = 0;
					self.loadImage( e.keyCode == 37 ? 'left' : 'right' );
				}
			});
		}
	});
}
