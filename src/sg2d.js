/**
 * 2D игровой движок использующий PixiJS и MatterJS. Кластерная оптимизация отрисовки тайлов.
 * @module SG2D
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
 * SG2D - Объект-аксессор ко всей функциональности библиотеки:
 * - [SG2D.Application](/sg2d-application) - Сцена
 * - SG2D.Clusters - Кластеры
 * - SG2D.Cluster - Кластер
 * - SG2D.Camera - Камера
 * - SG2D.Pointer - Мышь/тач
 * - SG2D.Tile - Тайл. Может содержать несколько спрайтов и анимаций
 * - SG2D.TileBody - Тайл с физическим телом (matterjs)
 * - SG2D.Sprite - Одиночный спрайт
 * - SG2D.Effects - Графические эффекты, в т.ч. шейдеры
 * - SG2D.Fonts - Графические шрифты
 * - SG2D.Bounds - Границы
 * - SG2D.Math - Математические функции
 * - SG2D.Utils - Графические утилиты
 * - SG2D.Consts - Константы
 * - SG2D.Plugins - Загрузчик плагинов
 * - SG2D.PluginBase - Базовый класс для плагинов
 * - SG2D.Sound - Звуки и музыка. Поддержка 2D окружения
 * - SG2D.MessageToast - Плавно исчезающее уведомление
 * - SG2D.Debugging - Визуальная отладка графики
 * @alias module:SG2D
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