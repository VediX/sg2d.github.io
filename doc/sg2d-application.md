<a name="SG2DApplication"></a>

## SG2DApplication
SG2DApplication - Сцена

**Kind**: global class  
**this**: <code>{SG2D.Application}</code>  

* [SG2DApplication](#SG2DApplication)
    * [new SG2DApplication(config)](#new_SG2DApplication_new)
    * _instance_
        * [.run()](#SG2DApplication+run)
        * [.iterate()](#SG2DApplication+iterate)
        * [.matterIterate()](#SG2DApplication+matterIterate)
        * [.pause()](#SG2DApplication+pause)
        * [.destroy()](#SG2DApplication+destroy)
        * [.resize()](#SG2DApplication+resize)
    * _static_
        * [.STATE_IDLE](#SG2DApplication.STATE_IDLE)
        * [.STATE_RUN](#SG2DApplication.STATE_RUN)
        * [.STATE_PAUSE](#SG2DApplication.STATE_PAUSE)
        * [.STATE_DESTROY](#SG2DApplication.STATE_DESTROY)
        * [.plugins](#SG2DApplication.plugins)
        * [.spritesCount](#SG2DApplication.spritesCount)
        * [.getInstance([bIgnoreEmpty])](#SG2DApplication.getInstance) ⇒ <code>object</code>
        * [.setCellSizePix()](#SG2DApplication.setCellSizePix)

<a name="new_SG2DApplication_new"></a>

### new SG2DApplication(config)
Создает экземпляр сцены SG2D.Application


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>object</code> |  |  |
| [config.canvasId] | <code>undefined</code> \| <code>string</code> | <code>void 0</code> | По умолчанию ищется первый CANVAS |
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

<a name="SG2DApplication+run"></a>

### sG2DApplication.run()
Запустить сцену

**Kind**: instance method of [<code>SG2DApplication</code>](#SG2DApplication)  
<a name="SG2DApplication+iterate"></a>

### sG2DApplication.iterate()
Итерация сцены

**Kind**: instance method of [<code>SG2DApplication</code>](#SG2DApplication)  
<a name="SG2DApplication+matterIterate"></a>

### sG2DApplication.matterIterate()
Итерация физического движка

**Kind**: instance method of [<code>SG2DApplication</code>](#SG2DApplication)  
<a name="SG2DApplication+pause"></a>

### sG2DApplication.pause()
Поставить на паузу сцену

**Kind**: instance method of [<code>SG2DApplication</code>](#SG2DApplication)  
<a name="SG2DApplication+destroy"></a>

### sG2DApplication.destroy()
Удалить сцену

**Kind**: instance method of [<code>SG2DApplication</code>](#SG2DApplication)  
<a name="SG2DApplication+resize"></a>

### sG2DApplication.resize()
Обработчик события на изменение размера экрана, в т.ч. поворот экрана для мобильных устройств

**Kind**: instance method of [<code>SG2DApplication</code>](#SG2DApplication)  
<a name="SG2DApplication.STATE_IDLE"></a>

### SG2DApplication.STATE\_IDLE
**Kind**: static property of [<code>SG2DApplication</code>](#SG2DApplication)  
**Access**: public  
<a name="SG2DApplication.STATE_RUN"></a>

### SG2DApplication.STATE\_RUN
**Kind**: static property of [<code>SG2DApplication</code>](#SG2DApplication)  
**Access**: public  
<a name="SG2DApplication.STATE_PAUSE"></a>

### SG2DApplication.STATE\_PAUSE
**Kind**: static property of [<code>SG2DApplication</code>](#SG2DApplication)  
**Access**: public  
<a name="SG2DApplication.STATE_DESTROY"></a>

### SG2DApplication.STATE\_DESTROY
**Kind**: static property of [<code>SG2DApplication</code>](#SG2DApplication)  
**Access**: public  
<a name="SG2DApplication.plugins"></a>

### SG2DApplication.plugins
**Kind**: static property of [<code>SG2DApplication</code>](#SG2DApplication)  
**Access**: public  
<a name="SG2DApplication.spritesCount"></a>

### SG2DApplication.spritesCount
**Kind**: static property of [<code>SG2DApplication</code>](#SG2DApplication)  
**Read only**: true  
<a name="SG2DApplication.getInstance"></a>

### SG2DApplication.getInstance([bIgnoreEmpty]) ⇒ <code>object</code>
Получить singleton-экземпляр сцены

**Kind**: static method of [<code>SG2DApplication</code>](#SG2DApplication)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [bIgnoreEmpty] | <code>boolean</code> | <code>false</code> | true - не генерировать ошибку при отсутствующем singleton-экземпляре |

<a name="SG2DApplication.setCellSizePix"></a>

### SG2DApplication.setCellSizePix()
**Kind**: static method of [<code>SG2DApplication</code>](#SG2DApplication)  
**Access**: public  
