# tiles-gallery

###### Gallery experiment with dynamic css tiles, less script possible, integrated lightbox with touch events.
Now with multi galleries support! Soon API for lightbox.

Minified size: *12.58 kb (9.16 kb js + 3.42 kb css)*.

> As soon as I understand how this github works, I'll upload a working example.

#### example page
- <a href="http://cambiamentico.altervista.org/PAGES/experiments/faces-tiles/" target="_blank">face tiles example 2 [main page]</a> (lightbox fill mode = 3: auto)
- <a href="http://cambiamentico.altervista.org/PAGES/experiments/faces-tiles/micro.php" target="_blank">face tiles example</a> (lightbox fill mode = 2: fill screen)

### Needed files

for users:
- [js] jquery.js, link or download at <a href="https://jquery.com/" target="_blank">jquery site</a>
- [js] square-gallery-lightbox.min.js
- [css] square-gallery-lightbox.min.css
- [images] big images, and related _square_ thumbnail (at least 180&times;180 px)

for developers:
- [js] jquery.js
- [js] square-gallery.js
- [js] image-lightbox-like.js
- [css] square-gallery.css
- [css] image-lightbox.css
- [images] big images, and related _square_ thumbnail

### How to

Load the required stylesheet files, jQuery library and other required resources in the head section of the document
```html
	<head>
		<script src="jquery.min.js"></script>
		<script src="square-gallery-lightbox.min.js"></script>
		...
		<link rel="stylesheet" href="square-gallery-lightbox.min.css">
		...
	</head>
```

Put a div with custom id in the body section of the document, wherever you want to place the gallery.
```html
	<body>
		...
		<div id="custom-gallery-id"></div>
		...
	</body>
```

Last: add few line of javascript:
```javascript
	//images array must contain the thumbnail, the big image urls and (optionally) a description
	//here an example if you named all the files like "face-#", where # = (int) 1...40
	//obviously you can also create an array manually, and/or with other languages.
	var squares = new Array(40);
	for (var i=1;i<=40;i++){
		squares[i-1] = ['IMAGES/squares/face-'+i+'.jpg', 'IMAGES/face-'+i+'.jpg'];
	}
	//woops: add another image I forgotted... :)
	squares.push(['IMAGES/squares/face-41.jpg', 'IMAGES/face-41.jpg', "this is a description!\nWith new lines too."]);
	
	//optionally TA() function accepts a bunch of parameters. see API section
	var gallery = new TA({
		id : "#custom-gallery-id",
		images : squares
	});
```

### API

You can set the _TA()_ parameters at any time, and start the gallery automatic creation:

```javascript
	gallery.ini({
		id : "#custom-gallery-id",
			//mandatory - no default
			//the id of the html element to fill with tiles
		images : squares
			//mandatory - no default
			//array containing arrays with url of thumbnail, url of original image, optional description.
		from : 5,
			//optional - default = 0
			//define from what image create tiles
		n : 32,
			//optional - default = images length
			//how many tiles initialize. For default CSS it should be a multiple of 8 for better visualization.
			//If you want to use other multiples, then the last row wouldn't be filled.
			//For using other multiples it's recommended to change the CSS accordingly.
		fill : 2,
			//optional - default = 3
			//0 : image fully contained in screen with margins
			//1 : as 0, but without margins
			//2 : fill the whole screen (if possible)
			//3 : auto adapt based on screen area (uses 0, 1, 2 the bigger is the screen)
		autostart : true
			//optional - default = true
	});
```

You can manipulate the default behavior setting:

```javascript
	//how many tiles rotate at the same time:
	gallery.rotMany = 1; //(int) 0, 1, 2...
	
	//frequency to apply a random rotation:
	gallery.rotDelay = 500; //(int) milliseconds
	
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
