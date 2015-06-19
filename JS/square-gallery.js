var ilbFunc = {
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
			ilbFunc.overlay.create();
			ilbFunc.loader.create();
			ilbFunc.closeButton.create();
		});
	}
};

ilbFunc.createDefault();

function TileAnimation(_a,_b,_c,_d,_fill){
	//private variables
	var tiles,			//{div.tile html, img html, rotating}
		images,			//[thumb, big]
		gallery,			//container
		max=0,			//max images to rotate (must be > nTiles)
		nTiles=0,		//tiles to create
		timer,
		isRotating=false,
		currents,		//array of image id showed in tiles
		lightbox = new imageLightbox({
				onStart: 	 function() { ilbFunc.overlay.on(); ilbFunc.closeButton.on(); self.stop(); },
				onEnd:	 	 function() { ilbFunc.overlay.off(); ilbFunc.closeButton.off(); ilbFunc.loader.off(); self.rotate(); },
				onLoadStart: function() { ilbFunc.loader.on(); },
				onLoadEnd:	 function() { ilbFunc.loader.off(); },
				fillMode: (typeof _fill === 'undefined' ? 2 : _fill)
			}),
		self = this;
	//public variables
	this.rotMany = 1;				//how many tiles (maximum) to rotate at the same time
	this.rotDuration = 650;		//tile transition duration [CSS], better rise some millisecond
	this.rotDelay = 250;			//frequency to apply a rotation
	this.probability = 0.85;	//probability to rotate a tile
	//functions
	this.ini = function(sContainerId, aImages, iFrom, iNum){
		max = aImages.length;
		nTiles = iNum;
		if (max <= nTiles) return false;
			var tileeeeees = new Array(max)
			for (var i=0;i<max;i++){
				tileeeeees[i] = aImages[i][1];
			}
			lightbox.setGallery(tileeeeees);
		images = aImages;
		tiles = new Array(max);
		currents = new Array(max);
		gallery = $(sContainerId).html('').addClass('square-gallery');
		for (var i=0;i<nTiles;i++){
			tiles[i] = {
				rotating : false,
				tile : $('<div class="tile"></div>'),
				a : lightbox.addTrigger( $('<a class="zoom" href="'+aImages[iFrom+i][1]+'" target="_blank">').data('id',i) ),
				img : $('<img src="'+aImages[iFrom+i][0]+'">')
			};
			currents[i] = iFrom+i;
			gallery.append(tiles[i].tile
				.append(tiles[i].img)
				.append(tiles[i].a)
			);
		}
		self.rotate();
	};
	this.rotate = function(){
		isRotating = true;
		var a = new Array(self.rotMany);
		var x=0;
		for (var i=0;i<a.length;i++){
			do{
				x = Math.floor(Math.random()*nTiles);
			} while(a.indexOf(x) !== -1);
			a[i] = x;
			if (Math.random() <= self.probability) self.rotateTile(x);
		}
		clearTimeout(timer);
		timer = setTimeout(function(){
			self.rotate();
		},self.rotDelay);
	};
	this.rotateTile = function(i){
		if (tiles[i].rotating === true) return false;
		tiles[i].rotating = true;
		var newId=0;
		do{
			newId = Math.floor(Math.random()*max);
		} while(currents.indexOf(newId) !== -1);
		currents[i] = newId;
		var newImg = $('<img src="'+images[newId][0]+'">');
		tiles[i].tile.append(newImg);
		tiles[i].img.addClass('slide');
		tiles[i].a.attr('href',images[newId][1]).data('id',newId);
		setTimeout(function(){
			tiles[i].rotating = false;
			tiles[i].img.remove();
			tiles[i].img = newImg;
		},self.rotDuration)
	};
	this.stop = function(){
		clearTimeout(timer);
		isRotating = false;
	};
	this.toggle = function(){
		if (isRotating) self.stop();
		else self.rotate();
	}
	//apply to html
	if (typeof _a !== 'undefined' && typeof _b !== 'undefined'){
		if (typeof _c === 'undefined') _c=0;
		if (typeof _d === 'undefined') _d=_b.length;
		$(function(){
			self.ini(_a,_b,_c,_d);
		})
	}
}
