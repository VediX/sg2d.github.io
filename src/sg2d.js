/*
 * 2D игровой движок использующий PixiJS и MatterJS. Кластерная оптимизация отрисовки тайлов.
 * @version 1.0.0
 * @license MIT
 * @copyright Kalashnikov Ilya 2019-2021 (https://github.com/VediX/sg2d.github.io)
 */

"use strict";

import SGModel from './libs/sg-model/sg-model.js';
import SG2DDeferred from './sg2d-deferred.js';
import SG2DConsts from './sg2d-consts.js';
import SG2DMath from './sg2d-math.js';
import SG2DUtils from './sg2d-utils.js';
import SG2DBounds from './sg2d-bounds.js';
import SG2DApplication from './sg2d-application.js';
import SG2DClusters from './sg2d-clusters.js';
import SG2DCluster from './sg2d-cluster.js';
import SG2DTile from './sg2d-tile.js';
import SG2DTileBody from './sg2d-tilebody.js';
import SG2DCamera from './sg2d-camera.js';
import SG2DPointer from './sg2d-pointer.js';
import SG2DEffects from './sg2d-effects.js';
import SG2DPlugins from './sg2d-plugins.js';
import SG2DPluginBase from './sg2d-plugin-base.js';
import SG2DDebugging from './sg2d-debugging.js';
import SG2DFonts from './sg2d-fonts.js';
import {SG2DLabel, SG2DLabelCanvas} from './sg2d-fonts.js';
import SG2DSprite from './sg2d-sprite.js';
import SG2DMessageToast from './sg2d-message-toast.js';
import SG2DSound from './sg2d-sound.js';


/**
 * Объект-аксессор ко всей функциональности библиотеки
 * @module SG2D
 * @property {class} SG2D.Application - Сцена
 * @property {class} SG2D.Clusters - Кластеры
 * @property {class} SG2D.Cluster - Кластер
 * @property {class} SG2D.Camera - Камера
 * @property {class} SG2D.Pointer - Мышь/тач
 * @property {class} SG2D.Tile - Тайл. Может содержать несколько спрайтов и анимаций
 * @property {class} SG2D.TileBody - Тайл с физическим телом (*matterjs*)
 * @property {class} SG2D.Sprite - Одиночный спрайт
 * @property {class} SG2D.Effects - Графические эффекты, в т.ч. шейдеры
 * @property {class} SG2D.Fonts - Графические шрифты
 * @property {class} SG2D.Bounds - Границы
 * @property {class} SG2D.Math - Математические функции
 * @property {class} SG2D.Utils - Графические утилиты
 * @property {class} SG2D.Consts - Константы
 * @property {class} SG2D.Plugins - Загрузчик плагинов
 * @property {class} SG2D.PluginBase - Базовый класс для плагинов
 * @property {class} SG2D.Sound - Звуки и музыка. Поддержка 2D окружения
 * @property {class} SG2D.MessageToast - Плавно исчезающее уведомление
 * @property {object} SG2D.pixi - PIXI instance
 * @property {object} SG2D.matter - MatterJS instance
 * @property {string} SG2D.version - SG2D version
 */
var SG2D = {
	Model: SGModel,
	Deferred: SG2DDeferred,
	Consts: SG2DConsts,
	Math: SG2DMath,
	Utils: SG2DUtils,
	Application: SG2DApplication,
	Clusters: SG2DClusters,
	Camera: SG2DCamera,
	Tile: SG2DTile,
	TileBody: SG2DTileBody,
	Pointer: SG2DPointer,
	Effects: SG2DEffects,
	Plugins: SG2DPlugins,
	PluginBase: SG2DPluginBase,
	Debugging: SG2DDebugging,
	Bounds: SG2DBounds,
	Cluster: SG2DCluster,
	Fonts: SG2DFonts,
	Label: SG2DLabel,
	LabelCanvas: SG2DLabelCanvas,
	Sprite: SG2DSprite,
	MessageToast: SG2DMessageToast,
	Sound: SG2DSound
};

SG2D.pixi = null;
SG2D.matter = null;
SG2D.version = typeof __SG2D_VERSION__ !== 'undefined' ? __SG2D_VERSION__ : '*';
SG2D.LAYER_POSITION_ABSOLUTE = 0;
SG2D.LAYER_POSITION_FIXED = 1;

if (typeof window === 'object' && window.document) window["SG2D"] = SG2D;

export default SG2D;