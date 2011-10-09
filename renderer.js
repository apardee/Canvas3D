RENDER.run = function() {
	// shim layer with setTimeout fallback : 
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function(callback, element) {
  			window.setTimeout(callback, 66);
		};
	})();
	
	var ctx;
	var triangles = [];
	var thetaZ = 0.0;
	var matrixProjection;
	var transformedTriangles = [];

	var vertices = RENDER.Teapot.vertices;
	var indices = RENDER.Teapot.indices;

	var triangleColors = [
		"#E00", "#E00",
		"#0E0", "0E0",
		"#00E", "#00E",
		"#E0E", "#E0E"
	];

	function buildVertex(vertexIndex) {
		return RENDER.Vector(vertices[vertexIndex][0], vertices[vertexIndex][1], vertices[vertexIndex][2], 1.0);
	}

	function buildFace(vert1, vert2, vert3) {
		var face = [ buildVertex(vert1), buildVertex(vert2), buildVertex(vert3) ];
		return face;
	}

	function faceSort(a, b) {
	    //var avgA = (a[0].values[2] + a[1].values[2] + a[2].values[2]); /// 3.0;
	    //var avgB = (b[0].values[2] + b[1].values[2] + b[2].values[2]); /// 3.0;
	    //return avgB - avgA;
		return a[0].values[2] - b[0].values[2];
	}

	function draw() {
		var modelToWorld = RENDER.Matrix();
		var sinTheta = Math.sin(thetaZ);
		var cosTheta = Math.cos(thetaZ);
	
		// Rotation matrix around Y.
		modelToWorld.setRow(0, RENDER.Vector(cosTheta, 0.0, sinTheta, 100.0));
		modelToWorld.setRow(1, RENDER.Vector(0.0, -1.0, 0.0, 70.0));
		modelToWorld.setRow(2, RENDER.Vector(-sinTheta, 0.0, cosTheta, 0.0));
		modelToWorld.setRow(3, RENDER.Vector(0.0, 0.0, 0.0, 1.0));
	
		for (var i = 0; i < triangles.length; ++i) {
			modelToWorld.multiplyVector(triangles[i][0], transformedTriangles[i][0]);
			modelToWorld.multiplyVector(triangles[i][1], transformedTriangles[i][1]);
			modelToWorld.multiplyVector(triangles[i][2], transformedTriangles[i][2]);
		}
	
		// Sort triangles in world space.
		transformedTriangles.sort(faceSort);
	
		ctx.clearRect(0, 0, 200.0, 200.0);
		ctx.fillStyle = "rgb(200, 200, 200)";
		for (var i = 0; i < transformedTriangles.length; ++i)
		{
		    var projectedVertices = transformedTriangles[i];
			ctx.save();
		    ctx.beginPath();
		    ctx.moveTo(projectedVertices[0].values[0], projectedVertices[0].values[1]);
		    ctx.lineTo(projectedVertices[1].values[0], projectedVertices[1].values[1]);
		    ctx.lineTo(projectedVertices[2].values[0], projectedVertices[2].values[1]);
		    ctx.fill();
			ctx.stroke();
		    ctx.closePath();
		    ctx.restore();
		}
	
		thetaZ += 0.03;
	    if (thetaZ >= 360.0) {
		    thetaZ = thetaZ - 360.0;
	    }
	
		window.requestAnimFrame(draw);
	}
	
	// Set up the renderer to run.
	for (var i = 0; i < indices.length; i += 3)
	{
		var face = buildFace(indices[i] - 1, indices[i + 1] - 1, indices[i + 2] - 1);
		triangles.push(face);
	}

	for (var i = 0; i < triangles.length; ++i)
	{
		transformedTriangles.push([ RENDER.Vector(0, 0, 0, 0), RENDER.Vector(0, 0, 0, 0), RENDER.Vector(0, 0, 0, 0) ]);	
	}

	// Simple orthographic projection.
	matrixProjection = RENDER.Matrix();
	matrixProjection.setRow(0, RENDER.Vector(1.0, 0.0, 0.0, 0.0));
	matrixProjection.setRow(1, RENDER.Vector(0.0, 1.0, 0.0, 0.0));
	matrixProjection.setRow(2, RENDER.Vector(0.0, 0.0, 0.0, 0.0));
	matrixProjection.setRow(3, RENDER.Vector(0.0, 0.0, 0.0, 1.0));

	ctx = document.getElementById("canvas").getContext("2d");
	
  	// return setInterval(draw, 10);
	window.requestAnimFrame(draw);

	draw();
}