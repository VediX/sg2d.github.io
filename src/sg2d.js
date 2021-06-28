/**
 * SG2D 1.0.0
 * 2D game engine based on PixiJS and MatterJS, optimized by tile clustering
 * https://github.com/VediX/sg2d.github.io
 * SG2D may be freely distributed under the MIT license
 * (c) Kalashnikov Ilya 2019-2021
 */

"use strict";

import SGModel from './libs/sg-model.js';
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