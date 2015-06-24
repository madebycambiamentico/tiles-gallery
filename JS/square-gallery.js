/******************************************
square tiles gallery + integrated ligthbox
by mbc (http://altervista.cambiamentico.org/PAGES/experiments/faces-tiles/)
thanks to imagelightbox (http://osvaldas.info/image-lightbox-responsive-touch-friendly)
******************************************/
var TAlib = {
	overlay : {
		created : false,
		create : function(){
			if (TAlib.overlay.created) return false;
			TAlib.overlay.created = true;
			$('body').append('<div id="imagelightbox-overlay"></div>');
		},
		on : function(){
			$( '#imagelightbox-overlay' ).addClass('visible');
		},
		off : function(){
			$( '#imagelightbox-overlay' ).removeClass('visible');
		}
	},
	loader : {
		created : false,
		create : function(){
			if (TAlib.loader.created) return false;
			TAlib.loader.created = true;
			$('body').append('<div id="imagelightbox-loading"></div>');
		},
		on : function(){
			$( '#imagelightbox-loading' ).addClass('visible');
		},
		off : function(){
			$( '#imagelightbox-loading' ).removeClass('visible');
		}
	},
	closeButton : {
		created : false,
		create : function(){
			if (TAlib.closeButton.created) return false;
			TAlib.closeButton.created = true;
			$('body').append('<div id="imagelightbox-x">&times;</div>');
		},
		on : function(){
			$( '#imagelightbox-x' ).addClass('visible');
		},
		off : function(){
			$( '#imagelightbox-x' ).removeClass('visible');
		}
	},
	caption : {
		created : false,
		create : function(textClass){
			if (TAlib.caption.created) return false;
			TAlib.caption.created = true;
			$('body').append('<div id="imagelightbox-desc"><div id="imagelightbox-text"'+(textClass ? ' class="'+textClass+'"' : '')+'></div></div>');
		},
		on : function(){
			if ($('#imagelightbox-text').html() === '') TAlib.caption.off();
			else $('#imagelightbox-desc').addClass('visible');
		},
		off : function(){
			$('#imagelightbox-desc').removeClass('visible');
		}
	},
	createDefault : function(textClass){
		$(function(){
			TAlib.overlay.create();
			TAlib.loader.create();
			TAlib.caption.create(textClass); //eventually pass string "visible" to have default caption always visible.
			TAlib.closeButton.create();
		});
	},
	allowRot : true,
	TAs : []
};

//create default lightbox parts
TAlib.createDefault();

function TA(obj){
	//-------------------------------------------------------- private variables
	var tiles,					//{div.tile html, img html, rotating}
		gallery,					//container
		max=0,					//max images to rotate (must be > nTiles)
		timer,
		currents,				//array of image id showed in tiles
		isRotating = false,	//for toggle() and stop() functions
		self = this;
	//-------------------------------------------------------- public variables
	this.lightbox = new imageLightbox({
			onStart: 	 function() { TAlib.overlay.on(); TAlib.closeButton.on(); $.each(TAlib.TAs,function(){this.stop();}); },
			onEnd:	 	 function() { TAlib.overlay.off(); TAlib.closeButton.off(); TAlib.caption.off(); TAlib.loader.off(); $.each(TAlib.TAs,function(){this.rotate();}); },
			onLoadStart: function() { TAlib.loader.on(); TAlib.caption.off(); },
			onLoadEnd:	 function() { TAlib.loader.off(); TAlib.caption.on(); }
		});
	this.images;					//[thumb, big, desc]
	this.nTiles = 0;				//tiles to create
	this.rotMany = 1;				//how many tiles (maximum) to rotate at the same time
	this.rotDuration = 650;		//tile transition duration [CSS], better rise some millisecond
	this.rotDelay = 500;			//frequency to apply a rotation
	this.probability = 0.85;	//probability to rotate a tile
	//-------------------------------------------------------- main functions
	this.ini = function(obj){
		if (typeof obj.id === 'undefined' || !$.isArray(obj.images)) return false;
		if (obj.images.length === 0) return false;
		max = obj.images.length;
		self.images = obj.images;
		obj = $.extend({
			from : 0,
			n : max,
			autostart : true,
			fill : 3
		}, obj);
		//check if tiles are more than available images
		if (max < obj.from + obj.n){
			self.nTiles = max - obj.from;
		} else self.nTiles = obj.n;
		if (!self.nTiles) return false;
		//set gallery for lightbox:
		self.lightbox.updateoptions({fillMode : obj.fill});
		var lightboximgs = new Array(max)
		for (var i=0;i<max;i++){
			if (typeof self.images[i][2] === 'undefined') self.images[i].push('');
			lightboximgs[i] = {
				src : obj.images[i][1],
				desc : obj.images[i][2]
			};
		}
		self.lightbox.setGallery(lightboximgs);
		//create gallery (in case replace everything in target container)
		tiles = new Array(max);
		currents = new Array(max);
		gallery = $(obj.id).html('').addClass('square-gallery');
		for (var i=0;i<self.nTiles;i++){
			tiles[i] = {
				rotating : false,
				tile : $('<div class="tile"></div>'),
				a : self.lightbox.addTrigger( $('<a class="zoom" href="'+self.images[obj.from+i][1]+'" target="_blank">')
					.data('id',i)
					.data('desc',self.images[obj.from+i][2]) ),
				img : $('<img src="'+self.images[obj.from+i][0]+'">')
			};
			currents[i] = obj.from+i;
			gallery.append(tiles[i].tile
				.append(tiles[i].img)
				.append(tiles[i].a)
			);
		}
		if (obj.autostart === true) self.rotate();
		return self;
	};
	
	this.rotate = function(){
		if (self.images.length <= 1 || !self.rotMany) return false;
		isRotating = true;
		if (self.rotMany > self.images.length - self.nTiles) self.rotMany = self.images.length - self.nTiles;
		if (!self.rotMany) return false;
		//if there's no lightbox open:
		if (TAlib.allowRot){
			var a = new Array(self.rotMany);
			var x=0;
			//select random tile(s) in set
			for (var i=0;i<a.length;i++){
				var maxstep = 20;
				do{
					x = Math.floor(Math.random()*self.nTiles);
				} while(a.indexOf(x) !== -1 && maxstep-- > 0);
				if (maxstep){
					a[i] = x;
					if (Math.random() <= self.probability) self.rotateTile(x);
				}
			}
		}
		//apply next rotation after some time...
		clearTimeout(timer);
		timer = setTimeout(function(){
				self.rotate();
			}, self.rotDelay);
		return self;
	};
	
	this.rotateTile = function(i){
		if (typeof tiles[i] === 'undefined') return false;
		if (tiles[i].rotating === true) return false;
		tiles[i].rotating = true;
		//random image
		var newId=0;
		do{
			newId = Math.floor(Math.random()*max);
		} while(currents.indexOf(newId) !== -1);
		currents[i] = newId;
		var newImg = $('<img src="'+self.images[newId][0]+'">');
		//append image under current, slide current up, then delete it
		tiles[i].tile.append(newImg);
		tiles[i].img.addClass('slide');
		tiles[i].a.attr('href',self.images[newId][1]).data('id',newId).data('desc',self.images[newId][2]);
		setTimeout(function(){
			tiles[i].rotating = false;
			tiles[i].img.remove();
			tiles[i].img = newImg;
		},self.rotDuration);
		return self;
	};
	
	this.stop = function(){
		clearTimeout(timer);
		isRotating = false;
		return self;
	};
	
	this.toggle = function(){
		if (isRotating) self.stop();
		else self.rotate();
		return self;
	}
	
	//initialize immediately if params given
	if (!$.isEmptyObject(obj)){
		$(function(){
			self.ini(obj);
		})
	}
	
	//add this object to global list
	TAlib.TAs.push(this);
	
	//end :)
	return this;
}
