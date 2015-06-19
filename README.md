# tiles-gallery

###### Gallery experiment with dynamic css tiles, less script possible, integrated lightbox with touch events.

> As soon as I understand how this github works, I'll upload a working example.

#### example page
[face tiles example](http://cambiamentico.altervista.org/PAGES/experiments/faces-tiles/micro.php)

### Needed files

for users:
- [js] jquery.js
- [js] square-gallery-lightbox.min.js
- [css] square-gallery-lightbox.min.css

for developers:
- [js] jquery.js
- [js] square-gallery.js
- [js] image-lightbox-like.js
- [css] square-gallery.css
- [css] image-lightbox.css

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
	
	//TileAnimation() function requires this bunch of things
	//(string) selector, (array) images, (int) from, (int) how many tiles, (int) fill mode for lightbox
		//fill mode:
		//0 : image fully contained in screen with margins
		//1 : as 0, but without margins
		//2 : fill the whole screen (if possible)
	var gallery = new TileAnimation('#gallery', squares, 0, 32, 0);
```

That's all. Enjoy
