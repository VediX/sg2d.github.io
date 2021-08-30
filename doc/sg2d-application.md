
* [sg2d-application](#module_sg2d-application)
    * [module.exports](#exp_module_sg2d-application--module.exports) ⏏
        * [new module.exports(config)](#new_module_sg2d-application--module.exports_new)

<a name="exp_module_sg2d-application--module.exports"></a>

### module.exports ⏏
**Kind**: Exported class  
<a name="new_module_sg2d-application--module.exports_new"></a>

#### new module.exports(config)
SG2DApplication constructor


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>object</code> |  |  |
| [config.canvasId] | <code>string</code> |  |  |
| [config.cellsizepix] | <code>number</code> | <code>32</code> |  |
| [config.camera] | <code>object</code> | <code>void 0</code> | Config or instanceof SG2DCamera |
| [config.camera.rotation] | <code>boolean</code> | <code>true</code> |  |
| [config.camera.rotate] | <code>number</code> | <code>0</code> |  |
| [config.camera.position] | <code>object</code> | <code>{x: 0, y: 0}</code> |  |
| [config.camera.scale_min] | <code>number</code> | <code>1</code> |  |
| [config.camera.scale_max] | <code>number</code> | <code>16</code> |  |
| [config.camera.movement_by_pointer] | <code>flag</code> | <code>0</code> |  |
| config.camera.rotate_adjustment | <code>number</code> | <code>0</code> |  |
| [config.clusters] | <code>object</code> | <code>void 0</code> | Config or instanceof SG2DClusters |
| [config.clusters.areasize] | <code>number</code> | <code>128</code> |  |
| [config.pointer] | <code>object</code> | <code>void 0</code> | Config or instanceof SG2DPointer |
| [config.iterate] | <code>function</code> | <code>void 0</code> |  |
| [config.resize] | <code>function</code> | <code>void 0</code> |  |
| [config.layers] | <code>object</code> | <code>{main: {}}</code> |  |
| [config.pixi] | <code>object</code> |  | Config for PIXI.Application constructor |
| [config.pixi.resizeTo] | <code>HTMLElement</code> | <code>canvas.parentElement</code> |  |
| [config.pixi.backgroundColor] | <code>number</code> | <code>0x000000</code> |  |
| [config.pixi.antialias] | <code>boolean</code> | <code>false</code> |  |
| [config.pixi.autoStart] | <code>boolean</code> | <code>true</code> |  |
| [config.pixi.width] | <code>number</code> | <code>100</code> |  |
| [config.pixi.height] | <code>number</code> | <code>100</code> |  |
| [config.matter] | <code>object</code> | <code>void 0</code> | Config for Matter.Engine constructor. For MatterJS to connect, you need to transfer at least an empty object or true value! |
| [config.matter.gravity] | <code>object</code> | <code>void 0</code> | Example for setting gravity |
| [config.plugins] | <code>array</code> | <code>void 0</code> | Array of string, example: ["sg2d-transitions", ...] |
| [config.sound] | <code>object</code> \| <code>string</code> | <code>void 0</code> | Sound config file path or sound settings |
| [config.sound.options] | <code>object</code> | <code>{}</code> |  |
| [config.sound.options.config] | <code>object</code> \| <code>string</code> | <code>void 0</code> | File path to sound config or object sound config |
| [config.sound.options.music_dir] | <code>undefined</code> \| <code>string</code> | <code>void 0</code> | Music directory |
| [config.sound.options.sounds_dir] | <code>undefined</code> \| <code>string</code> | <code>void 0</code> | Sounds directory |
| [config.sound.options.library_pathfile] | <code>undefined</code> \| <code>string</code> | <code>void 0</code> | Path to the PIXI.Sound library file is applied only the first time the parameter is passed |
| [config.sound.properties] | <code>object</code> | <code>{}</code> |  |
| [config.sound.properties.sounds] | <code>boolean</code> | <code>true</code> |  |
| [config.sound.properties.music] | <code>boolean</code> | <code>true</code> |  |
| [config.sound.properties.musicVolume] | <code>number</code> | <code>100</code> |  |
| [config.sound.properties.soundsVolume] | <code>number</code> | <code>100</code> |  |
| [config.sound.properties.muteOnLossFocus] | <code>boolean</code> | <code>true</code> |  |
| [config.sound.properties.volumeDecreaseDistance] | <code>number</code> | <code>0</code> |  |
| [config.sound.properties.environment2D] | <code>boolean</code> | <code>true</code> |  |
| [config.sound.properties.bass] | <code>boolean</code> | <code>false</code> |  |
| [config.sound.properties.view] | <code>undefined</code> \| <code>string</code> | <code>void 0</code> |  |
| [config.deferred] | <code>object</code> | <code>SG2D.Deferred()</code> | Promise that will be executed when the scene is created and run |

