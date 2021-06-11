/**
 * SG2D 1.0.0
 * 2D graphics engine based on PixiJS and optimized by tile clustering
 * https://github.com/VediX/sg2d.github.io
 * (c) 2019-2021 Kalashnikov Ilya
 * SG2D may be freely distributed under the MIT license
 */

"use strict";

//import "@babel/polyfill";

import SGModel from './libs/sg-model.js';
import SG2DConsts from './sg2d-consts.js';
import SG2DMath from './sg2d-math.js';
import SG2DUtils from './sg2d-utils.js';
import SG2DBounds from './sg2d-bounds.js';
import SG2DApplication from './sg2d-application.js';
import SG2DClusters from './sg2d-clusters.js';
import SG2DCluster from './sg2d-cluster.js';
import SG2DTile from './sg2d-tile.js';
import SG2DCamera from './sg2d-camera.js';
import SG2DMouse from './sg2d-mouse.js';
import SG2DEffects from './sg2d-effects.js';
import SG2DPlugins from './sg2d-plugins.js';
import SG2DPluginBase from './sg2d-plugin-base.js';
import SG2DDebugging from './sg2d-debugging.js';
import SG2DFonts from './sg2d-fonts.js';
import {SG2DLabel, SG2DLabelCanvas} from './sg2d-fonts.js';
import SG2DSprite from './sg2d-sprite.js';

var SG2D = {
	Model: SGModel,
	Consts: SG2DConsts,
	Math: SG2DMath,
	Utils: SG2DUtils,
	Application: SG2DApplication,
	Clusters: SG2DClusters,
	Camera: SG2DCamera,
	Tile: SG2DTile,
	Mouse: SG2DMouse,
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
	version: typeof __SG2D_VERSION__ !== 'undefined' ? __SG2D_VERSION__ : '*'
};

if (typeof window === "object") window.SG2D = SG2D;
if (typeof self === "object") self.SG2D = SG2D;
if (typeof global === "object") global.SG2D = SG2D;
if (typeof _root === "object") _root.SG2D = SG2D;

export default SG2D;