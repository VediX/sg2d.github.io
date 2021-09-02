## Functions

<dl>
<dt><a href="#initialize">initialize(properties, [scale], [rotation], [rotate], [start_position], [rotate_adjustment], [movement_by_pointer])</a></dt>
<dd><p>Config parameters and default values:</p>
</dd>
<dt><a href="#setRotate">setRotate()</a></dt>
<dd><p>Own setter for rotate property</p>
</dd>
<dt><a href="#startPosition">startPosition()</a></dt>
<dd><p>Set the starting position of the camera</p>
</dd>
<dt><a href="#setPosition">setPosition()</a></dt>
<dd><p>Own setter for position property</p>
</dd>
<dt><a href="#followTo">followTo()</a></dt>
<dd><p>Tile that the camera will follow</p>
</dd>
<dt><a href="#moveTo">moveTo(point, [flag])</a></dt>
<dd><p>Smoothly move the camera to position</p>
</dd>
<dt><a href="#getScale">getScale()</a></dt>
<dd></dd>
</dl>

<a name="initialize"></a>

## initialize(properties, [scale], [rotation], [rotate], [start_position], [rotate_adjustment], [movement_by_pointer])
Config parameters and default values:

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| properties | <code>object</code> |  |  |
| [properties.scale_wheel] | <code>boolean</code> | <code>true</code> | Allow camera zoom |
| [scale] | <code>number</code> | <code>8</code> | Start scale |
| [rotation] | <code>boolean</code> | <code>true</code> | Allow camera rotation |
| [rotate] | <code>number</code> | <code>0</code> | Start camera rotation |
| [start_position] | <code>object</code> | <code>{ x: 0, y: 0}</code> | Start position |
| [rotate_adjustment] | <code>number</code> | <code>0</code> | Basic offset of the camera angle in degrees |
| [movement_by_pointer] | <code>boolean</code> | <code>0</code> | Allow free movement of the camera with the right mouse button |

<a name="setRotate"></a>

## setRotate()
Own setter for rotate property

**Kind**: global function  
<a name="startPosition"></a>

## startPosition()
Set the starting position of the camera

**Kind**: global function  
<a name="setPosition"></a>

## setPosition()
Own setter for position property

**Kind**: global function  
<a name="followTo"></a>

## followTo()
Tile that the camera will follow

**Kind**: global function  
<a name="moveTo"></a>

## moveTo(point, [flag])
Smoothly move the camera to position

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| point | <code>object</code> |  |  |
| [flag] | <code>boolean</code> | <code>false</code> | Move instantly (true) or smoothly (false) |

<a name="getScale"></a>

## getScale()
**Kind**: global function  
**Access**: public  
