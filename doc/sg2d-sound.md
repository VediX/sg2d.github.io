## Members

<dl>
<dt><a href="#bass">bass</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#load">load([options], [properties])</a></dt>
<dd><p>Sound library loader and parameter setter</p>
</dd>
<dt><a href="#musicPlay">musicPlay([viewcode], [options], [strict])</a></dt>
<dd><p>Play music</p>
</dd>
<dt><a href="#play">play(Sound, config_or_tile, tile)</a></dt>
<dd><p>Play sound</p>
</dd>
</dl>

<a name="bass"></a>

## bass
**Kind**: global variable  
**Access**: protected  
<a name="load"></a>

## load([options], [properties])
Sound library loader and parameter setter

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [options] | <code>object</code> | <code>{}</code> | 
| [options.config] | <code>object</code> \| <code>string</code> | <code>&quot;./res/sound.json&quot;</code> | 
| [options.music_dir] | <code>string</code> | <code>&quot;\&quot;./res/music/\&quot;&quot;</code> | 
| [options.sounds_dir] | <code>string</code> | <code>&quot;\&quot;./res/sounds/\&quot;&quot;</code> | 
| [options.library_pathfile] | <code>string</code> | <code>&quot;\&quot;./libs/pixi/pixi-sound.js\&quot;&quot;</code> | 
| [properties] | <code>object</code> | <code>{}</code> | 
| [properties.sounds] | <code>boolean</code> | <code>true</code> | 
| [properties.music] | <code>boolean</code> | <code>true</code> | 
| [properties.musicVolume] | <code>number</code> | <code>100</code> | 
| [properties.soundsVolume] | <code>number</code> | <code>100</code> | 
| [properties.muteOnLossFocus] | <code>boolean</code> | <code>true</code> | 
| [properties.volumeDecreaseDistance] | <code>number</code> | <code>0</code> | 
| [properties.environment2D] | <code>boolean</code> | <code>true</code> | 
| [properties.bass] | <code>boolean</code> | <code>false</code> | 

<a name="musicPlay"></a>

## musicPlay([viewcode], [options], [strict])
Play music

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [viewcode] | <code>string</code> \| <code>bool</code> | <code>true</code> | Page code or true value. If true, then the current music starts playing if it is not playing yet |
| [options] | <code>object</code> | <code>{}</code> | Options passed to the play() method, for example, sound volume, playback speed, start and end times |
| [strict] | <code>boolean</code> | <code>false</code> | If the melody is not loaded, then the console will display an error |

<a name="play"></a>

## play(Sound, config_or_tile, tile)
Play sound

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| Sound | <code>string</code> \| <code>object</code> | name or base sound object from sounds.json |
| config_or_tile | <code>object</code> | Sound settings overriding basic sounds.json or Tile instance |
| tile | <code>object</code> | If a tile is specified, then position is taken from it to calculate the distance and sound volume |

