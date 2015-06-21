var TAlib = {
	overlay : {
		created : false,
		create : function(){
			if (this.created) return false;
			this.created = true;
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
			if (this.created) return false;
			this.created = true;
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
			if (this.created) return false;
			this.created = true;
			$('body').append('<div id="imagelightbox-x">&times;</div>');
		},
		on : function(){
			$( '#imagelightbox-x' ).addClass('visible');
		},
		off : function(){
			$( '#imagelightbox-x' ).removeClass('visible');
		}
	},
	createDefault : function(){
		$(function(){
			TAlib.overlay.create();
			TAlib.loader.create();
			TAlib.closeButton.create();
		});
	},
	allowRot : true
};

TAlib.createDefault();

function TA(_a,_b,_c,_d,_fill,_e){
	//private variables
	var tiles,			//{div.tile html, img html, rotating}
		gallery,			//container
		max=0,			//max images to rotate (must be > nTiles)
		timer,
		currents,		//array of image id showed in tiles
		isRotating = false,
		self = this;
	//public variables
	this.lightbox = new imageLightbox({
			onStart: 	 function() { TAlib.overlay.on(); TAlib.closeButton.on(); TAlib.allowRot = false; self.stop(); },
			onEnd:	 	 function() { TAlib.overlay.off(); TAlib.closeButton.off(); TAlib.loader.off(); TAlib.allowRot = true; self.rotate(); },
			onLoadStart: function() { TAlib.loader.on(); },
			onLoadEnd:	 function() { TAlib.loader.off(); },
			fillMode: (typeof _fill === 'undefined' ? 2 : _fill)
		});
	this.images;					//[thumb, big]
	this.nTiles = 0;				//tiles to create
	this.rotMany = 1;				//how many tiles (maximum) to rotate at the same time
	this.rotDuration = 650;		//tile transition duration [CSS], better rise some millisecond
	this.rotDelay = 500;			//frequency to apply a rotation
	this.probability = 0.85;	//probability to rotate a tile
	//functions
	this.ini = function(sContainerId, aImages, iFrom, iNum, autoStart){
		max = aImages.length;
		self.nTiles = iNum;
		if (max < self.nTiles) return false;
			var tileeeeees = new Array(max)
			for (var i=0;i<max;i++){
				tileeeeees[i] = aImages[i][1];
			}
			self.lightbox.setGallery(tileeeeees);
		self.images = aImages;
		tiles = new Array(max);
		currents = new Array(max);
		gallery = $(sContainerId).html('').addClass('square-gallery');
		for (var i=0;i<self.nTiles;i++){
			tiles[i] = {
				rotating : false,
				tile : $('<div class="tile"></div>'),
				a : self.lightbox.addTrigger( $('<a class="zoom" href="'+aImages[iFrom+i][1]+'" target="_blank">').data('id',i) ),
				img : $('<img src="'+aImages[iFrom+i][0]+'">')
			};
			currents[i] = iFrom+i;
			gallery.append(tiles[i].tile
				.append(tiles[i].img)
				.append(tiles[i].a)
			);
		}
		if (autoStart === true) self.rotate();
		return self;
	};
	this.rotate = function(){
		if (self.images.length <= 1 || !self.rotMany) return false;
		isRotating = true;
		if (self.rotMany > self.images.length - self.nTiles) self.rotMany = self.images.length - self.nTiles
		if (!self.rotMany) return false;
		if (TAlib.allowRot){
			var a = new Array(self.rotMany);
			var x=0;
			for (var i=0;i<a.length;i++){
				var maxstep = 20;
				do{
					x = Math.floor(Math.random()*self.nTiles);
				} while(a.indexOf(x) !== -1 && maxstep-- > 0);
				a[i] = x;
				if (Math.random() <= self.probability) self.rotateTile(x);
			}
		}
		clearTimeout(timer);
		timer = setTimeout(function(){
				self.rotate();
			}, self.rotDelay);
		return self;
	};
	this.rotateTile = function(i){
		if (typeof tiles[i] === 'undefined'){
			console.log(tiles);
			console.log(i);
			return false;
		}
		if (tiles[i].rotating === true) return false;
		tiles[i].rotating = true;
		var newId=0;
		do{
			newId = Math.floor(Math.random()*max);
		} while(currents.indexOf(newId) !== -1);
		currents[i] = newId;
		var newImg = $('<img src="'+self.images[newId][0]+'">');
		tiles[i].tile.append(newImg);
		tiles[i].img.addClass('slide');
		tiles[i].a.attr('href',self.images[newId][1]).data('id',newId);
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
	//apply to html
	if (typeof _a !== 'undefined' && typeof _b !== 'undefined'){
		if (typeof _c === 'undefined') _c = 0;
		if (typeof _d === 'undefined') _d = _b.length;
		if (typeof _e === 'undefined') _e = true;
		$(function(){
			self.ini(_a,_b,_c,_d,_e);
		})
	}
	return this;
}
