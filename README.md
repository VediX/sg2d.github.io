## Documentation

2D game engine based on PixiJS (WebGL) and MatterJS (physics engine), optimized for large maps through matrix clustering of tiles. Written in modern ES6. Supported by the latest versions of Chrome, Opera, Mozilla and Yandex browsers.

[See Wiki for API documentation](https://github.com/VediX/sg2d.github.io/wiki/SG2D-API)

## Ready installation

* [sg2d.js (187KB)](https://raw.githubusercontent.com/VediX/sg2d.github.io/main/build/sg2d.js)
* [sg2d.min.js (94KB)](https://raw.githubusercontent.com/VediX/sg2d.github.io/main/build/sg2d.min.js)

## Plugins

* [sg2d-transitions.js](https://raw.githubusercontent.com/VediX/sg2d.github.io/main/build/plugins/sg2d-transitions.js)

## Connection in HTML5 application

Library connection (for example index.html):

```html
<script src="sg2d/sg2d.js" type="text/javascript"></script>
```

## Plugins connection:

Plugin registration in SG2D application:

```js
let sg2dApp =  new SG2D.Application({
	...
	plugins: ["sg2d-transitions", ...]
});
```

To use the functionality of plugin, you can connect it in your scripts using ES6 import:

```js
import SG2DTransitions from "./sg2d/plugins/sg2d-transitions.js";
...
// Smooth transitions between different land types (use plugin)
SG2DTransitions.ready(()=>{
	SG2DTransitions.run(sg2dApp.clusters);
});
...
```

## Examples

Example of realizing game on the engine SG2D and SG2DTransitions plugin: [https://sg2d.ru/example/](https://sg2d.ru/example/)

Controls: W and S - movement, A and D - turn, Shift + W - forward acceleration, left mouse button - shot, right mouse button - move around the map, scrolling - map zoom

![SG2D Example 2D game](https://sg2d.ru/example.png "SG2D Example 2D game")

## License

SG2D is licensed under [The MIT License (MIT)](https://opensource.org/licenses/MIT)  
Copyright (c) 2021 Ilya Kalashnikov

This license is also supplied with the release and source code.
As stated in the license, absolutely no warranty is provided.