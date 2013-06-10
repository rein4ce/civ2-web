var SampleProject =
{
	name:			"Scenario name",
	author:			"Mike",
	startingYear:	"1000 B.C.",
	version:		1,
	randomSeed:		123456,

	map:
	{
		width: 100,
		height: 50,
		tiles: [
			{
				type: 1,
				river: false,
				roads: Roads.None,
				feature: TileFeatures.None,
				fortification: Fortifications.None
			}
			/* ... etc. ... */
		]
	},

	cities: [
		{
			player:		1,
			name:		"Washington",
			x:			1,
			y:			1,
			type:		CityType.Medieval,
			size:		1,
			population:		1,
			food:			1,
			tiles: [
				{ x: 1, y: 1 }
				/* ... */
			],
			supportedUnits: [ 1, 2, 3 /* ... */],
			buildings: [ 1, 2, 3 /* ... */ ]
		}
		/* ... */
	],

	units: [
		{
			player:		1,
			type:		1,
			x:			1,
			y:			1
		}
	]
}




var Editor =
{
	tile: 		0,					// id of the tile that's being selected for drawing

	/**
	 * Initialize interface of the editor
	 */
	init: function()
	{
		var panel = $(".editor").empty();

		// create icons for tile selection
		$.each(TileTypesList, function(i, type)
		{
			var div 	= $("<div class='tile' />");
			var canvas	= document.createElement("canvas");
			var ctx		= canvas.getContext("2d");

			canvas.width = TileWidth;
			canvas.height = TileHeight;

			var coord = civ.map.getTilesetTileCoord(i);

			// draw tile base
			ctx.drawImage(civ.map.tileset[0], coord.x, coord.y,	TileWidth, TileHeight, 0, 0,	TileWidth, TileHeight);

			// draw extra layer for some tiles
			switch (type)
			{
				case TileTypes.Forest:
					ctx.drawImage(civ.map.tileset[1], 1, 4 * (TileHeight + 1) + 1, TileWidth, TileHeight, 0, 0,	TileWidth, TileHeight);
					break;

				case TileTypes.Hills:
					ctx.drawImage(civ.map.tileset[1], 1, 8 * (TileHeight + 1) + 1, TileWidth, TileHeight, 0, 0,	TileWidth, TileHeight);
					break;

				case TileTypes.Mountains:
					ctx.drawImage(civ.map.tileset[1], 1, 6 * (TileHeight + 1) + 1, TileWidth, TileHeight, 0, 0,	TileWidth, TileHeight);
					break;

				case TileTypes.Ocean:
					div.css("background", "url('img/ocean_tile.png')");
					break;
			}

			div.append(canvas);

			//div.css("background-position", "-1px -"+((TileHeight+1)*i+1)+"px");
			if (i == 0) div.addClass("selected");
			div.append("<span>" + TileTypesList[i].name + "</span>");

			div.click(function()
			{
				$(".editor .tile").removeClass("selected");
				Editor.tile = i;
				$(this).addClass("selected");				
			});
			panel.append(div);
		});
		panel.prepend("<div style='clear: both' />");
		panel.append("<div style='clear: both' />");
	}
}