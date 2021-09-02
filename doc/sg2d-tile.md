## Typedefs

<dl>
<dt><a href="#SG2DAnimationConfig">SG2DAnimationConfig</a> : <code>object</code></dt>
<dd><p>static animation = { start: 1, count: 8, sleep: 2, basetexture: &quot;objects/tank_shot_&quot;, running: true }; // example</p>
</dd>
<dt><a href="#SG2DSpriteConfig">SG2DSpriteConfig</a> : <code>object</code></dt>
<dd><p>static sprites = { // example    tank_platform: { texture: &quot;objects/tank-platform&quot;, zindex: 2 },    tank_turret: { texture: &quot;objects/tank-turret&quot;, anchor: { x: 0.5, y: 0.2 }, zindex: 3 }    tank_track_left: { texture: &quot;objects/tank-track&quot;, offset: { x: -40, y: 0 }, zindex: 1, basetexture: { count: 8, sleep: 2 } }    tank_track_right { texture: &quot;objects/tank-track&quot;, offset: {x: 40, y: 0}, zindex: 1, basetexture: { count: 8, sleep: 2 } }};</p>
</dd>
</dl>

<a name="SG2DAnimationConfig"></a>

## SG2DAnimationConfig : <code>object</code>
static animation = { start: 1, count: 8, sleep: 2, basetexture: "objects/tank_shot_", running: true }; // example

**Kind**: global typedef  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| [start] | <code>number</code> | <code>1</code> | 
| count | <code>number</code> |  | 
| [sleep] | <code>number</code> | <code>1</code> | 
| [running] | <code>boolean</code> | <code>false</code> | 
| [loop] | <code>boolean</code> | <code>false</code> | 
| [onComplete] | <code>function</code> | <code>void 0</code> | 

<a name="SG2DSpriteConfig"></a>

## SG2DSpriteConfig : <code>object</code>
static sprites = { // example	tank_platform: { texture: "objects/tank-platform", zindex: 2 },	tank_turret: { texture: "objects/tank-turret", anchor: { x: 0.5, y: 0.2 }, zindex: 3 }	tank_track_left: { texture: "objects/tank-track", offset: { x: -40, y: 0 }, zindex: 1, basetexture: { count: 8, sleep: 2 } }	tank_track_right { texture: "objects/tank-track", offset: {x: 40, y: 0}, zindex: 1, basetexture: { count: 8, sleep: 2 } }};

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| texture | <code>string</code> |  |  |
| [anchor] | <code>number</code> \| <code>object</code> | <code>0.5</code> |  |
| [angle] | <code>number</code> | <code>0</code> | in degrees |
| [scale] | <code>number</code> \| <code>object</code> | <code>1</code> |  |
| [zindex] | <code>number</code> | <code>0</code> |  |
| [animation] | [<code>SG2DAnimationConfig</code>](#SG2DAnimationConfig) |  |  |

