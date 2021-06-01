import SG2DTile from "../../sg2d-tile.js";
import {Grass, Sand, BlockStandard, BlockSteel, BlockTriangle, Medikit, Tree} from "./tiles.js";
import Utils from "./utils.js";

export default class Area {
	
	static build(clusters) {
		
		let innerSize = clusters.areasize;
		let q = Math.round(innerSize * innerSize / 100);
		let aGrounds = [Grass];
		let aSpreadCounts = [300];
		let cluster;
		for (var i = 1; i <= q; i++) {
			var	areaX = 5 + Math.floor(Math.random() * (innerSize - 10)),
				areaY = 5 + Math.floor(Math.random() * (innerSize - 10)),
				index = Math.floor( Math.random() * aGrounds.length),
				landClass = aGrounds[index];
			var aSpreading = Utils.getSpreadingRandom( Math.floor(50 + Math.random() * (aSpreadCounts[index] - 50)));
			for (var j = aSpreading.length; j--;) {
				var oSpread = aSpreading[j];
				if (cluster = clusters.getCluster(areaX + oSpread.x, areaY + oSpread.y)) {
					cluster._l = new landClass({ position: cluster.position });
				}
			}
		}
		
		clusters.each((cluster)=>{
			
			// If you need to use the plug-in for smooth transitions between different soil types (SG2DTransitions), then you can't do without classes
			if (! cluster._l) {
				cluster._l = new Sand({ position: cluster.position });
			}
			
			// Simple tiles without any functionality can be created directly using the SG2DTile class
			let bConcrete = false;
			if ((cluster.x - 1) % 16 === 0 || (cluster.y - 1) % 16 === 0) {
				cluster._r = new SG2DTile({ texture: "lands/concrete", position: cluster.position, layer: "roads" });
				bConcrete = true;
			}

			if (cluster.x === 1 || cluster.y === 1 || cluster.x === clusters.width || cluster.y === clusters.height) {
				cluster._e = new BlockSteel({ position: cluster.position }); // Пограничные блоки
			} else {
				if (cluster.x > 10 || cluster.y > 10) {
					if (Math.random() < 0.3 && ! bConcrete) {
						cluster._e = new BlockStandard({ position: cluster.position });
					}
				}
			}
		});
		
		// Corners blocks
		var cc = [];
		clusters.each((cluster)=>{
			if (cluster.tileInCluster("lands/concrete") || cluster._e) return;
			cc.length = 0;
			clusters.nearestClusters90(cluster, (nc, angle)=>{
				cc[angle] = nc;
			});
			cc[360] = cc[0];
			cc[450] = cc[90];
			cc[540] = cc[180];
			for (var a = 0; a <= 270; a+=90) {
				if (! cc[a]) break;
				if (cc[a]._e instanceof BlockStandard && cc[a + 90]._e instanceof BlockStandard && ! cc[a + 180]._e && ! cc[a + 270]._e) {
					cluster._e = new BlockTriangle({ position: cluster.position, type: SG2DMath.normalize_a(a + 45) });
				} else if (cc[a]._e && cc[a + 90]._e && cc[a + 180]._e && ! cc[a + 270]._e && Math.random() < 0.4) {
					cluster._m = new Medikit( {position: cluster.position });
				}
			}
		});
		
		// Trees and bushes
		clusters.each((cluster)=>{
			if (! cluster._r && ! cluster._e && ! cluster._m && Math.random() < 0.1) {
				cluster._e = new Tree( {position: cluster.position });
			}
		});
	}
}