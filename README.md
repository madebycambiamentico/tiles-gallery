# tiles-gallery

###### Gallery experiment with dynamic css tiles, less script possible, integrated lightbox with touch events.

> As soon as I understand how this github works, I'll upload a working example.

#### example page
<a href="http://cambiamentico.altervista.org/PAGES/experiments/faces-tiles/micro.php" target="_blank">face tiles example</a>

### Needed files

for users:
- [js] jquery.js
- [js] square-gallery-lightbox.min.js
- [css] square-gallery-lightbox.min.css
- [images] big images, and related _square_ thumbnail

for developers:
- [js] jquery.js
- [js] square-gallery.js
- [js] image-lightbox-like.js
- [css] square-gallery.css
- [css] image-lightbox.css
- [images] big images, and related _square_ thumbnail

### How to

After putting the link to scripts and css,
you have to create a div with custom id, wherever you want to place the gallery...
```html
	<body>
		...
		<div id="gallery"></div>
		...
	</body>
```

...then add few line of javascript:
```javascript
	//images array must contain the thumbnail and the big image urls
	//here an example if you named all the files like "face-#", where # = (int) 1...40
	//obviously you can also create an array manually, and/or with other languages.
	var squares = new Array(40);
	for (var i=1;i<=40;i++){
		squares[i-1] = ['IMAGES/squares/face-'+i+'.jpg', 'IMAGES/face-'+i+'.jpg'];
	}
	//woops: add another image I forgotted... :)
	squares.push(['IMAGES/squares/face-41.jpg', 'IMAGES/face-41.jpg']);
	
	//optionally TileAnimation() function accepts this bunch of parameters
	//(string) selector, (array) images, (int) from, (int) how many tiles (multiple of 8), (int) fill mode for lightbox
		//fill mode:
		//0 : image fully contained in screen with margins
		//1 : as 0, but without margins
		//2 : fill the whole screen (if possible)
	var gallery = new TA('#gallery', squares, 0, 32, 0);
```

### API

You can set the _TA()_ parameters at any time:

```javascript
	gallery.ini("#custom-gallery-id", 5, 32, 2);
```

You can manipulate the default behavior setting:

```javascript
	//how many tiles rotate at the same time:
	gallery.rotMany = 1; //(int) 0, 1, 2...
	//frequency to apply a random rotation:
	gallery.rotDelay = 250; //(int) milliseconds
	//probability of rotation for each called tile (depends by <rotMany>)
	gallery.probability = 0.85; //(int) milliseconds
	//minimum delay before apply another rotation to same tile.
	//MUST be at least long as the CSS transition (default 600ms)
	gallery.rotDuration = 650; //(int) milliseconds
```

And you can stop/restart/apply a rotation manually:

```javascript
	//stop tiles sliding:
	gallery.stop();
	//start tiles sliding:
	gallery.rotate();
	//toggle tiles sliding:
	gallery.toggle();
	//force a tile rotation
	gallery.rotateTile(5);//index must exist, eg. 5th in the array <squares>
```

That's all. Enjoy
