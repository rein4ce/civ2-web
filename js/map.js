var TileWidth = 64;
var TileHeight = 32;
var TileWidth2 = TileWidth/2;
var TileHeight2 = TileHeight/2;
var TileWidth4 = TileWidth/4;
var TileHeight4 = TileHeight/4;

var mapMouseX = 0;			// mouse coordinates in the map-space
var mapMouseY = 0;

var Roads =
{
	None:		0,
	Road:		1,
	Railroad:	2
};

var TileFeatures =
{
	None:			0,
	Irrigation:		1,
	Farmland:		2,
	Mine:			3,
	Airfield:		4,
	Factory:		5
};

var Fortifications =
{
	None:			0,
	Simple:			1,
	Advanced:		2
};

var Tile = function(type)
{
	this.type	= type;
	this.variant = null;
	this.river	= false;
	this.roads	= Roads.None;
	this.units	= [];
	this.city	= null;					// tile is used by a city
	this.feature = TileFeatures.None;
	this.fortification = Fortifications.None;
	this.div	= null;					// DOM elements for 3d tiles
};

var Spawnpoint = function(x,y,race)
{
	this.x		= x;
	this.y 		= y;
	this.race	= race;		// optional: race preferred spawn location
}



var Map = function()
{
	var map = this;

	this.name		= "New map";
	this.author		= "Author";

	this.width 		= 0;
	this.height 	= 0;
	this.tiles 		= [];
	this.tileset	= [];
	this.x			= 0;				// current position of the map container
	this.y			= 0;
	this.actualWidth	= 0;
	this.actualHeight 	= 0;

	this.select 	= new Point(0,0);
	this.hover		= new Point(0,0);
	this.cursor		= new Point(0,0);
	this.view		= new Rect(0,0,0,0);

	this.editor		= null;
	this.spawnPoints = [];

	this.dragX = 0;
	this.dragY = 0;
	this.dragging = false;
	this.scrolling = false;
};


/**
 * Initialize map for new game
 */
Map.prototype.init = function(sizeX, sizeY)
{
	this.editor = Editor;
	this.width = sizeX;
	this.height = sizeY;
	this.actualWidth = this.width * TileWidth;
	this.actualHeight = (this.height + 1) * TileHeight / 2;
	this.view = new Rect(0,0,Width,Height);
	this.tileset = [
		Images["img/terrain1.png"],
		Images["img/terrain2.png"]
	];
	$mapCanvas.attr("width", this.actualWidth);
	$mapCanvas.attr("height", this.actualHeight);
	$mapFogCanvas.attr("width", this.actualWidth);
	$mapFogCanvas.attr("height", this.actualHeight);

	$("#terrain").empty();			// remove terrain tiles

	this.moveTo(this.width/2,this.height/2);
	this.generateRandom();
	this.initEvents();
	this.initSelect();
	this.redrawMap();

	// TODO: temp
	/*this.spawnPoints =
	[
		new Spawnpoint( (Math.random()*sizeX)|0, (Math.random()*sizeY)|0, null ),
		new Spawnpoint( (Math.random()*sizeX)|0, (Math.random()*sizeY)|0, null ),
		new Spawnpoint( (Math.random()*sizeX)|0, (Math.random()*sizeY)|0, null ),
		new Spawnpoint( (Math.random()*sizeX)|0, (Math.random()*sizeY)|0, null )
	];*/
};


/**
 * Get save data
 */
Map.prototype.save = function()
{
	return {
		name:		this.name,
		author:		this.author,
		width:		this.width,
		height:		this.height,
		tiles:		this.tiles
	};
}


/**
 * Load map from saved data
 * @param data
 */
Map.prototype.load = function(data)
{
	// copy over the parameters
	this.name 		= data.name;
	this.author		= data.author;
	this.width		= data.width;
	this.height		= data.height;
	this.tiles		= [];

	// create the tiles
	for (var y=0; y<data.tiles.length; y++)
	{
		this.tiles.push([]);
		for (var x=0; x<data.tiles[y].length; x++)
		{
			var tile = new Tile();
			for (var key in data.tiles[y][x])
				tile[key] = data.tiles[y][x][key];
			this.tiles[y].push(tile);
		}
	}

	// initialize the map
	this.init(this.width, this.height);
}


/**
 * Generate random level using perlin noise
 */
Map.prototype.generateRandom = function()
{
	var scale = 0.09;
	var noise = new SimplexNoise();
	var margin = 3;

	for (var y=0; y<this.height; y++)
	{
		this.tiles.push([]);
		for (var x=0; x<this.width-(y%2==0?0:1); x++)
		{
			var h = noise.noise(x*scale, (y+x%y)*scale/2 + (Math.random()-0.5)*0.2) / 2 + 0.5;
			var type = TileTypes.Ocean;

			if (h > 0.9) type = TileTypes.Mountains; else
			if (h > 0.75) type = Math.random() > 0.4 ? TileTypes.Hills : TileTypes.Forest; else
			if (h > 0.6) type = Math.random() > 0.4 ? TileTypes.Forest : TileTypes.Plains; else
			if (h > 0.4) type = Math.random() > 0.3 ? TileTypes.Grassland : TileTypes.Plains;

			if (h > 0.4 && h < 0.6 && Math.random() > 0.7) type = Math.random() > 0.4 ? TileTypes.Jungle : TileTypes.Swamp;

			if (y < margin || y > this.height - margin - 1 && type != TileTypes.Ocean)
				type = Math.random() > 0.3 ? TileTypes.Tundra : type;

			if ((y == 0 || y == this.height-1) && type != TileTypes.Ocean)
				type = TileTypes.Glacier;

			var tile = new Tile(type.id);
			if (type == TileTypes.Ocean && h < 0.25 + Math.random() * 0.02) tile.variant = 1;
			this.tiles[y].push(tile);// new Tile((Math.random() * TileTypesList.length)|0) );
		}
	}

	// check the shallow water tiles
	for (var y=0; y<this.tiles.length; y++)
		for (var x=0; x<this.tiles[y].length; x++)
		{
			if (this.tiles[y][x].type != TileTypes.Ocean.id) continue;

			// get neighbouring tiles
			var N = this.getTileType(x,y-2);
			var S = this.getTileType(x,y+2);
			var E = this.getTileType(x+1,y);
			var W = this.getTileType(x-1,y);
			var NE = this.getTileType(y%2==0?x:x+1,y-1);
			var NW = this.getTileType(y%2==0?x-1:x,y-1);
			var SE = this.getTileType(y%2==0?x:x+1,y+1);
			var SW = this.getTileType(y%2==0?x-1:x,y+1);

			if (N != TileTypes.Ocean.id ||
				S != TileTypes.Ocean.id ||
				E != TileTypes.Ocean.id ||
				W != TileTypes.Ocean.id ||
				N != TileTypes.Ocean.id ||
				NE != TileTypes.Ocean.id ||
				NW != TileTypes.Ocean.id ||
				SE != TileTypes.Ocean.id ||
				SW != TileTypes.Ocean.id)
				this.tiles[y][x].variant = 0;
		}
};


/**
 * Draw map fragment within specified tile boundaries
 * @param x
 * @param y
 * @param numx
 * @param numy
 * @param [options]
 */
Map.prototype.drawTiles = function(x,y,numx,numy, options)
{
	for (var j=y; j<y+numy; j++)
		for (var i=x; i<x+numx-(j%2==0?0:1); i++)
		{
			this.drawTile(i,j,false, null, options);
		}
};


/**
 * Get coordinates of the tile sprite in the tileset image
 * @param tileId
 * @param [variant]
 */
Map.prototype.getTilesetTileCoord = function(tileId, variant)
{
	variant = variant || 0;
	var type = TileTypesList[tileId];
	var tx = 1 + (TileWidth + 1) * variant;
	var ty = 1 + type.iconY * (TileHeight + 1);
	return { x: tx, y: ty };
}


/**
 * Redraw a single tile on the map, redrawing neighbouring ones if necessary
 * @param x
 * @param y
 * @param drawNeighbours
 * @param [top]
 * @param [options]
 */
Map.prototype.drawTile = function(x,y,drawNeighbours,top, options)
{
	if (!this.checkTile(x,y)) return;
	if (top!=null && this.getTileType(x,y) == 10) top = null;

	options = options || {};
	var context = options.context || mapCtx;		// where to draw the tile
	var offset = options.offset || new Point(0,0);	// how much to offset the drawing?

	var sx = x-(1-(y%2));			// x coord shift
	var sy = (top!=null && false==top ? TileHeight2 : 0);
	var sty = sy;
	var th = ((top!=null)?TileHeight2:TileHeight);

	// redraw neighbouring top tiles?
	if (drawNeighbours)
	{
		this.drawTile(x,y-2,false,true, options);
		this.drawTile(y%2==0?x-1:x,y-1,false,false, options);
		this.drawTile(y%2==0?x:x+1,y-1,false,false, options);
		this.drawTile(x-1,y,false,true, options);
		this.drawTile(x+1,y,false,true, options);
	}

	// draw tile base
	var tile = this.tiles[y][x];
	var type = TileTypesList[tile.type];
	var variant = tile.variant !== null ? tile.variant :  ((type.iconsNum == 1 ? 0 : ((x+y)%2)));
	var tx = 1 + variant  * (TileWidth+1);
	var ty = 1 + tile.type * (TileHeight + 1);
	var mapPos = this.getTilePos(x, y);
	var pos = { x: mapPos.x, y: mapPos.y };

	// offset the tile position
	pos.x += offset.x;
	pos.y += offset.y;

	// if it's water tile, remove the shape of a tile from the map entirely to make it full transparent
	if (type == TileTypes.Ocean)
	{
		context.save();
		context.globalCompositeOperation = "destination-out";
		context.drawImage(Images["img/blacktile.png"], 0, 0, TileWidth, TileHeight, pos.x, pos.y+sy, TileWidth, th);
		context.restore();
	}

	// if it's a 3d tile and 3d map is on
	if (civ.map3d)
	{
		if (type == TileTypes.Forest || type == TileTypes.Mountains)
		{
			if (!tile.div)
			{
				tile.div = $("<div class='terrain'></div>").css({ top: mapPos.y+"px", left: mapPos.x+"px" });
				$terrain.append(tile.div);
			}

			if (type == TileTypes.Forest)
				tile.div.css("background-position", -1+"px -"+(1 + 4 * 33)+"px")
			if (type == TileTypes.Mountains)
				tile.div.css("background-position", -1+"px -"+(1 + 6 * 33)+"px")

			// draw grassland on the main map
			tx = 1;
			ty = 1 + 33 * 2;
		}
		else
		{
			// remove the 3d tile if exists
			if (tile.div)
			{
				tile.div.remove();
				tile.div = null;
			}
		}
	}

	context.drawImage(this.tileset[0], tx, ty+sty, TileWidth, th, pos.x, pos.y+sy, TileWidth, th);

	// get neighbouring tiles
	var N = this.getTile(x,y-2);
	var S = this.getTile(x,y+2);
	var E = this.getTile(x+1,y);
	var W = this.getTile(x-1,y);
	var NE = this.getTile(y%2==0?x:x+1,y-1);
	var NW = this.getTile(y%2==0?x-1:x,y-1);
	var SE = this.getTile(y%2==0?x:x+1,y+1);
	var SW = this.getTile(y%2==0?x-1:x,y+1);

	// if it's water, draw coastline
	if (tile.type == 10)
	{
		tx = 0; ty = 0;

		// top
		tx = 4*(NE && NE.type != 10) + 2*(N && N.type != 10) + 1*(NW && NW.type != 10);
		context.drawImage(this.tileset[1], 1+tx*(TileWidth+2), 1+0*(TileHeight2+1)+428, TileWidth2, TileHeight2, pos.x+TileWidth4, pos.y, TileWidth2, TileHeight2);

		// bottom
		tx = 4*(SW && SW.type != 10) + 2*(S && S.type != 10) + 1*(SE && SE.type != 10);
		context.drawImage(this.tileset[1], 1+tx*(TileWidth+2), 1+1*(TileHeight2+1)+428, TileWidth2, TileHeight2, pos.x+TileWidth4, pos.y+TileHeight2, TileWidth2, TileHeight2);

		// left
		tx = 4*(NW && NW.type != 10) + 2*(W && W.type != 10) + 1*(SW && SW.type != 10);
		context.drawImage(this.tileset[1], 1+tx*(TileWidth+2), 1+2*(TileHeight2+1)+428, TileWidth2, TileHeight2, pos.x, pos.y+TileHeight4, TileWidth2, TileHeight2);

		// right
		tx = 4*(SE && SE.type != 10) + 2*(E && E.type != 10) + 1*(NE && NE.type != 10);
		context.drawImage(this.tileset[1], 2+tx*(TileWidth+2)+TileWidth2, 1+2*(TileHeight2+1)+428, TileWidth2, TileHeight2, pos.x+TileWidth2, pos.y+TileHeight4, TileWidth2, TileHeight2);
	}

	// draw blending edges into surrouding tiles
	var mask = document.createElement("canvas");
	mask.width = TileWidth2;
	mask.height = TileHeight2;
	var maskCtx = mask.getContext("2d");

	// NE
	if (NE && tile.type != 8 && tile.type != 9 && (tile.type != 10 || NE.type != 10))
	{
		// draw tile piece
		ty = 1 + (NE.type == 10 ? 2 : NE.type) * (TileHeight + 1);
		maskCtx.drawImage(this.tileset[0], 1+TileWidth2, ty, TileWidth2, TileHeight2, 0, 0, TileWidth2, TileHeight2);

		// mask it out with the diffuse pattern
		maskCtx.globalCompositeOperation = "destination-in";
		maskCtx.drawImage(this.tileset[0], 1+TileWidth2, 448, TileWidth2, TileHeight2, 0, 0, TileWidth2, TileHeight2);

		// draw it into the map
		context.drawImage(mask,0,0,TileWidth2,TileHeight2, pos.x+TileWidth2, pos.y, TileWidth2, TileHeight2);
	}

	// NW
	if (NW && tile.type != 9 && (tile.type != 10 || NW.type != 10)) {
		// draw tile piece
		maskCtx.clearRect(0,0,TileWidth2,TileHeight2);
		maskCtx.globalCompositeOperation = "source-over";
		ty = 1 + (NW.type == 10 ? 2 : NW.type) * (TileHeight + 1);
		maskCtx.drawImage(this.tileset[0], 1, ty, TileWidth2, TileHeight2, 0, 0, TileWidth2, TileHeight2);

		// mask it out with the diffuse pattern
		maskCtx.globalCompositeOperation = "destination-in";
		maskCtx.drawImage(this.tileset[0], 1, 448, TileWidth2, TileHeight2, 0, 0, TileWidth2, TileHeight2);

		// draw it into the map
		context.drawImage(mask,0,0,TileWidth2,TileHeight2, pos.x, pos.y, TileWidth2, TileHeight2);
	}
/*
	// SW
	if (SW && tile.type < 10) {
		// draw tile piece
		maskCtx.clearRect(0,0,TileWidth2,TileHeight2);
		maskCtx.globalCompositeOperation = "source-over";
		ty = 1 + (SW.type == 10 ? 2 : SW.type) * (TileHeight + 1);
		maskCtx.drawImage(this.tileset[0], 1, ty+TileHeight2, TileWidth2, TileHeight2, 0, 0, TileWidth2, TileHeight2);

		// mask it out with the diffuse pattern
		maskCtx.globalCompositeOperation = "destination-in";
		maskCtx.drawImage(this.tileset[0], 1, 448+TileHeight2, TileWidth2, TileHeight2, 0, 0, TileWidth2, TileHeight2);

		// draw it into the map
		context.drawImage(mask,0,0,TileWidth2,TileHeight2, pos.x, pos.y+TileHeight2, TileWidth2, TileHeight2);
	}

	// SW
	if (SE && tile.type < 10) {
		// draw tile piece
		maskCtx.clearRect(0,0,TileWidth2,TileHeight2);
		maskCtx.globalCompositeOperation = "source-over";
		ty = 1 + (SE.type == 10 ? 2 : SE.type) * (TileHeight + 1);
		maskCtx.drawImage(this.tileset[0], 1+TileWidth2, ty+TileHeight2, TileWidth2, TileHeight2, 0, 0, TileWidth2, TileHeight2);

		// mask it out with the diffuse pattern
		maskCtx.globalCompositeOperation = "destination-in";
		maskCtx.drawImage(this.tileset[0], 1+TileWidth2, 448+TileHeight2, TileWidth2, TileHeight2, 0, 0, TileWidth2, TileHeight2);

		// draw it into the map
		context.drawImage(mask,0,0,TileWidth2,TileHeight2, pos.x_TileWidth2, pos.y+TileHeight2, TileWidth2, TileHeight2);
	}*/

	// check for Forest, Hills, Mountains
	tx = 0; ty = -1;
	switch (type.name)
	{
		case "Forest": ty = 4; break;				// 3d tile
		case "Mountains": ty = 6; break;			// 3d tile
		case "Hills": ty = 8; break;
	}

	// check for neighbours and choose proper tile
	if (ty != -1)
	{
		if (tile.type == this.getTileType(sx,y-1)) ty += 1;
		if (tile.type == this.getTileType(sx,y+1)) tx += 4;
		if (tile.type == this.getTileType(sx+1,y+1)) tx += 2;
		if (tile.type == this.getTileType(sx+1,y-1)) tx += 1;

		if (civ.map3d && tile.div)
		{
			tile.div.css("background-position", (-(1+tx*(TileWidth+1)))+"px "+(-(1+ty*(TileHeight+1)))+"px");
		}
		else
			context.drawImage(this.tileset[1], 1+tx*(TileWidth+1), 1+ty*(TileHeight+1)+sty, TileWidth, th, pos.x, pos.y+sy, TileWidth, th);
	}

	// check for rivers
	tx = 0; ty = 2;
	if (tile.river)
	{
		if (this.checkTile(sx,y-1) && this.tiles[y-1][sx].river) ty += 1;
		if (this.checkTile(sx,y+1) && this.tiles[y+1][sx].river) tx += 4;
		if (this.checkTile(sx+1,y+1) && this.tiles[y+1][sx+1].river) tx += 2;
		if (this.checkTile(sx+1,y-1) && this.tiles[y-1][sx+1].river) tx += 1;
		context.drawImage(this.tileset[1], tx * (TileWidth+1), ty * (TileHeight+1)+sy, TileWidth, th, pos.x, pos.y+sy, TileWidth, th);
	}

	// check for roads
	tx = 0; ty = 10; var r = -1, none=true;
	if (tile.roads > 0)
	{
		if (this.checkTile(sx,y-1) && ((r=this.tiles[y-1][sx].roads) > 0))
		{none=false; context.drawImage(this.tileset[0], 1+7 * (TileWidth+1), 1+(ty + Math.min(tile.roads, r)) * (TileHeight+1), TileWidth, TileHeight, pos.x, pos.y, TileWidth, TileHeight);}
		if (this.checkTile(sx,y+1) && ((r=this.tiles[y+1][sx].roads) > 0))
		{none=false; context.drawImage(this.tileset[0], 1+5 * (TileWidth+1), 1+(ty + Math.min(tile.roads, r)) * (TileHeight+1), TileWidth, TileHeight, pos.x, pos.y, TileWidth, TileHeight);}
		if (this.checkTile(sx+1,y-1) && ((r=this.tiles[y-1][sx+1].roads) > 0))
		{none=false; context.drawImage(this.tileset[0], 1+1 * (TileWidth+1), 1+(ty + Math.min(tile.roads, r)) * (TileHeight+1), TileWidth, TileHeight, pos.x, pos.y, TileWidth, TileHeight);}
		if (this.checkTile(sx+1,y+1) && ((r=this.tiles[y+1][sx+1].roads) > 0))
		{none=false; context.drawImage(this.tileset[0], 1+3 * (TileWidth+1), 1+(ty + Math.min(tile.roads, r)) * (TileHeight+1), TileWidth, TileHeight, pos.x, pos.y, TileWidth, TileHeight);}
		if (this.checkTile(x+1,y) && ((r=this.tiles[y][x+1].roads) > 0))
		{none=false; context.drawImage(this.tileset[0], 1+2 * (TileWidth+1), 1+(ty + Math.min(tile.roads, r)) * (TileHeight+1), TileWidth, TileHeight, pos.x, pos.y, TileWidth, TileHeight);}
		if (this.checkTile(x-1,y) && ((r=this.tiles[y][x-1].roads) > 0))
		{none=false; context.drawImage(this.tileset[0], 1+6 * (TileWidth+1), 1+(ty + Math.min(tile.roads, r)) * (TileHeight+1), TileWidth, TileHeight, pos.x, pos.y, TileWidth, TileHeight);}
		if (this.checkTile(sx,y+2) && ((r=this.tiles[y+2][sx].roads) > 0))
		{none=false; context.drawImage(this.tileset[0], 1+4 * (TileWidth+1), 1+(ty + Math.min(tile.roads, r)) * (TileHeight+1), TileWidth, TileHeight, pos.x, pos.y, TileWidth, TileHeight);}
		if (this.checkTile(sx,y-2) && ((r=this.tiles[y-2][sx].roads) > 0))
		{none=false; context.drawImage(this.tileset[0], 1+8 * (TileWidth+1), 1+(ty + Math.min(tile.roads, r)) * (TileHeight+1), TileWidth, TileHeight, pos.x, pos.y, TileWidth, TileHeight);}
		if (none)
			context.drawImage(this.tileset[0], 1, 1+(ty + tile.roads) * (TileHeight+1), TileWidth, TileHeight, pos.x, pos.y, TileWidth, TileHeight);
	}

	// redraw neighbouring bottom tiles?
	if (drawNeighbours)
	{
		this.drawTile(sx,y+1,false,true, options);
		this.drawTile(sx+1,y+1,false,true, options);
		this.drawTile(x,y+2,false,true, options);
	}
};


/**
 * Get tile type index of the given tile or -1
 * @param x
 * @param y
 * @return {*}
 */
Map.prototype.getTileType = function(x,y)
{
	if (!this.checkTile(x,y)) return -1;
	return this.tiles[y][x].type;
};


/**
 * Get tile x,y or null
 */
Map.prototype.getTile = function(x,y)
{
	if (!this.checkTile(x,y)) return null;
	return this.tiles[y][x];
};


/**
 * Redraw entire map
 */
Map.prototype.redrawMap = function()
{
	// draw black border
	mapCtx.fillStyle="#000";
	mapCtx.fillRect(0,0,this.actualWidth,TileHeight/2);
	mapCtx.fillRect(0,this.actualHeight-TileHeight/2,this.actualWidth,TileHeight/2);
	mapCtx.fillRect(0,0,TileWidth/2,this.actualHeight);
	mapCtx.fillRect(this.actualWidth-TileWidth/2,0,TileWidth/2,this.actualHeight);
	this.drawTiles(0,0,this.width,this.height);
	//this.redrawFog();
};


/**
 * TODO: move to be part of map drawing
 */
Map.prototype.redrawFog = function()
{
	//mapFogCtx.fillStyle = "#000";
	//mapFogCtx.fillRect(0,0,this.actualWidth, this.actualHeight);
	for (var j=0; j<this.height; j++)
		for (var i=0; i<this.width-(j%2==0?0:1); i++)
		{
			if (!this.checkTile(i,j)) return;
			if (Math.random() > 0.5) continue;

			var pos = this.getTilePos(i, j);

			mapFogCtx.drawImage(this.blackTile, 0, 0, TileWidth, TileHeight, pos.x-1, pos.y-1, TileWidth, TileHeight);
		}
};


/**
 * Check if tile coordinates are valid
 * @param x
 * @param y
 * @return {Boolean}
 */
Map.prototype.checkTile = function(x,y)
{
	return x>=0 && y>=0 && x<this.width-(y%2==0?0:1) && y<this.height;
};


/**
 * Get absolute tile image coordinates
 * @param x
 * @param y
 * @return {Object}
 */
Map.prototype.getTilePos = function(x,y)
{
	var pos = {};
	pos.x = x * TileWidth;
	pos.y = y * TileHeight / 2;
	if (Math.abs(y) % 2 == 1) pos.x += TileWidth / 2;
	return pos;
};


/**
 * Position the view at coordinates
 * @param x
 * @param y
 */
Map.prototype.moveTo = function(x,y)
{
	this.x = x;
	this.y = y;
	$map.css("transform", "matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, "+ (x|0)+","+(y|0)+",1,1)");
	this.view.x = -x;
	this.view.y = -y;

	// check units visibility
	//for (var i=0; i<units.length; i++) units[i].checkVisible(); // TODO: temp
};


/**
 * Init scrolling and other events
 */
Map.prototype.initEvents = function()
{
	$container.unbind(".map");

	// Mouse Click events
	$container.bind("mousedown.map", function(e)
	{
		e.preventDefault();

		// if we want to start scrolling, make units click-through
		$("#map_units").toggleClass("scrolling", e.which == 3)

		// dragging using right click
		if (e.which == 3)
		{
			if (this.scrolling) return;
			this.dragging = true;
			this.dragX = e.pageX;
			this.dragY = e.pageY;
			this.dragX -= this.x;
			this.dragY -= this.y;
			$container.css("cursor","move");
		}

		// painting tiles
		if (e.which == 1)
		{
			this.tiles[this.hover.y][this.hover.x].type = this.editor.tile;
			/*if (this.getTile(this.hover.x, this.hover.y).units.length == 0)
			{
				//new Unit((Math.random()*UnitTypes.length)|0, this.hover.x, this.hover.y);
			}*/
			this.drawTile(this.hover.x, this.hover.y, true);
		}
	}.bind(this));

	$container.bind("mouseup.map", function(e)
	{
		this.dragging = false;
		$container.css("cursor","default");
	}.bind(this));

	$container.bind("mouseleave.map", function(e)
	{
		this.dragging = false;
		$container.css("cursor","default");
	}.bind(this));

	$("#map_view").unbind("mousemove").mousemove(function(e)
	{
		if (e.offsetX == undefined)
		{
			this.cursor.x = mapMouseX = e.originalEvent.layerX;
			this.cursor.y = mapMouseY = e.originalEvent.layerY;
		}
		else
		{
			this.cursor.x = mapMouseX = e.offsetX;
			this.cursor.y = mapMouseY = e.offsetY;
		}

		mapMouseX = mapMouseX|0;
		mapMouseY = mapMouseY|0;

		// Calculate which tile we are hovering above
		var tile = this.screenToTile(mapMouseX, mapMouseY);
		if (this.checkTile(tile.x, tile.y))
		{
			this.hover = tile;
			var pos = this.getTilePos(this.hover.x, this.hover.y);
			$select.move(pos.x, pos.y, null, 1);
		}

		// check if hovering over a unit
		if (this.getTile(this.hover.x, this.hover.y).units.length > 0)
			$map.css("cursor","pointer");
		else
			$map.css("cursor","");

		// If dragging
		if (this.dragging)
		{
			var newX = e.pageX - this.dragX;
			var newY = e.pageY - this.dragY;
			if (newX > 0 || newX < $container.width() - this.actualWidth) this.dragX = e.pageX - this.x;
			if (newY > 0 || newY < $container.height() - this.actualHeight) this.dragY = e.pageY - this.y;
			var newX = Math.min(0, Math.max(newX, $container.width() - this.actualWidth));
			var newY = Math.min(0, Math.max(newY, $container.height() - this.actualHeight));
			this.moveTo( newX, newY );
		}

		// If we are scrolling, make units not-block the scrolling operation
		//$("#map_units").toggleClass("scrolling", this.dragging)
	}.bind(this));
};


/**
 * Convert container local coordinates into tile
 */
Map.prototype.screenToTile = function(x,y)
{
	//	x += -this.x;
	//y += -this.y;
	var ty = (y / TileHeight)|0; ty *= 2;
	var tx = (x / TileWidth)|0;
	var oy = y % TileHeight;
	var ox = x % TileWidth;
	if (ox >= TileWidth2 && oy < TileHeight2) {
		ox -= TileWidth2;
		if (oy < (ox/TileWidth2)*TileHeight2) { ty--; }
	} else
	if (ox < TileWidth2 && oy < TileHeight2) {
		if (oy < (1-ox/TileWidth2)*TileHeight2) { tx--; ty-- };
	} else
	if (ox >= TileWidth2 && oy >= TileHeight2) {
		ox -= TileWidth2;
		oy -= TileHeight2;
		if (oy >= (1-ox/TileWidth2)*TileHeight2) { ty++;}
	} else
	if (ox < TileWidth2 && oy >= TileHeight2) {
		oy -= TileHeight2;
		if (oy >= (ox/TileWidth2)*TileHeight2) { tx--; ty++ };
	}
	return { x: tx, y: ty };
};


/**
 * Init blinking selection
 */
Map.prototype.initSelect = function()
{
	var speed = 300;
	$select.unbind("fade_cycle").bind("fade_cycle", function() {
		$(this).fadeOut(speed, function() {
			$(this).fadeIn(speed, function() {
				$(this).trigger('fade_cycle');
			});
		});
	});
	$select.trigger('fade_cycle');
};


/**
 * Move selector to tile
 */
Map.prototype.selectTile = function(x,y)
{
	var pos = this.getTilePos(x,y);
	$select.move(pos.x, pos.y, null, 1);
};







