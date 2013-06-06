var CityScreen = function(city)
{
	/**
	 * Redraw all indicators of the city
	 */
	function refresh()
	{
		drawMinimap();
		drawMinimapOverlay();
		drawFoodBar();
		drawProductionShields();
		drawFoodStorage();
		drawShieldBar();
		drawTradeBar();
		drawOutput();

		$("#city-screen .title").text(city.name + ", "+ Game.getYearString());

		// position city icon
		var pos = getUnitIconPosition(3,city.type);
		$("#city-screen .city").css("background-position", pos.x+"px "+ pos.y+"px" );

		// stop propagation
		$("#city-screen").click(function(e) {e.stopPropagation(); });
	}

	function drawFoodBar()
	{
		var canvas = $("#city-screen .foodbar");
		canvas.attr("width", canvas.width());
		canvas.attr("height", canvas.height());
		var context = canvas[0].getContext("2d");
		var image = Images["img/icons-city.png"];

		var width, offset;
		var surplusWidth = Math.max(5, city.surplus * 15+5);

		// draw background
		context.fillStyle = "#3b8e19";
		context.fillRect(0,0,canvas.width(),canvas.height());

		// draw surplus
		if (city.surplus >= 0)
		{
			width = Math.min(canvas[0].width / 2-10, city.surplus*15);
			offset = (width - 15) / (city.surplus - 1);
			context.fillStyle = "#2c7713";
			context.fillRect(canvas.width()-width-5,0,width+5,canvas.height());
			for (var i=0; i<city.surplus; i++)
				context.drawImage(image,
					CityIconsSprites.food.x, CityIconsSprites.food.y,
					14, 14,
					canvas[0].width - width-2+i*offset, 1,
					14, 14);
		}

		// draw hunger
		if (city.surplus < 0)
		{
			width = Math.min(canvas[0].width / 2-10, city.surplus*15);
			offset = (width - 15) / (city.surplus - 1);
			for (var i=0; i<-city.surplus; i++)
				context.drawImage(image,
					CityIconsSprites.hunger.x, CityIconsSprites.hunger.y,
					14, 14,
					canvas[0].width - width-2+i*offset, 1,
					14, 14);
		}

		// draw food production
		width = Math.min((canvas[0].width-width)-15, city.food*15);
		offset = (width-15) / (city.food - 1);
		for (var i=0; i<city.food; i++)
			context.drawImage(image,
				CityIconsSprites.food.x, CityIconsSprites.food.y,
				14, 14,
				3 + i*offset, 1,
				14, 14);
	}

	function drawTradeBar()
	{
		var canvas = $("#city-screen .trade");
		canvas.attr("width", canvas.width());
		canvas.attr("height", canvas.height());
		var context = canvas[0].getContext("2d");
		var image = Images["img/icons-city.png"];

		var width = 0, offset;

		// draw background
		context.fillStyle = "#ee9c07";
		context.fillRect(0,0,canvas.width(),canvas.height());

		// draw corruption
		if (city.corruption > 0)
		{
			width = Math.min(canvas[0].width / 3-10, city.corruption*15);
			offset = (width - 15) / (city.corruption - 1);
			context.fillStyle = "#e2520d";
			context.fillRect(canvas.width()-width-5,0,width+5,canvas.height());
			for (var i=0; i<city.corruption; i++)
				context.drawImage(image,
					CityIconsSprites.corruption.x, CityIconsSprites.corruption.y,
					14, 14,
					canvas[0].width - width-2+i*offset, 1,
					14, 14);
		}

		// draw trade
		width = Math.min((canvas[0].width-width)-15, city.trade*15);
		offset = (width-15) / (city.trade - 1);
		for (var i=0; i<city.trade; i++)
			context.drawImage(image,
				CityIconsSprites.trade.x, CityIconsSprites.trade.y,
				14, 14,
				3 + i*offset, 1,
				14, 14);
	}

	function drawOutput()
	{
		var canvas = $("#city-screen .output");
		canvas.attr("width", canvas.width());
		canvas.attr("height", canvas.height());
		var context = canvas[0].getContext("2d");
		var image = Images["img/icons-city.png"];

		var width = 0, offset;

		// draw gold
		if (city.gold > 0)
		{
			width = Math.min(canvas[0].width / 3-10, city.gold*15);
			offset = (width - 15) / (city.gold - 1);
			for (var i=0; i<city.gold; i++)
				context.drawImage(image,
					CityIconsSprites.gold.x, CityIconsSprites.gold.y,
					14, 14,
					3 + i*offset, 1,
					14, 14);
		}

		// draw luxury
		if (city.luxury > 0)
		{
			width = Math.min(canvas[0].width / 3-10, city.luxury*15);
			offset = (width - 15) / (city.luxury - 1);
			for (var i=0; i<city.luxury; i++)
				context.drawImage(image,
					CityIconsSprites.luxury.x, CityIconsSprites.luxury.y,
					14, 14,
					canvas[0].width / 2 - width/2 + i*offset, 1,
					14, 14);
		}

		// draw science
		if (city.science > 0)
		{
			width = Math.min(canvas[0].width / 3-10, city.science*15);
			offset = (width - 15) / (city.science - 1);
			for (var i=0; i<city.science; i++)
				context.drawImage(image,
					CityIconsSprites.beaker1.x, CityIconsSprites.beaker1.y,
					14, 14,
					canvas[0].width - width + i*offset, 1,
					14, 14);
		}
	}

	function drawShieldBar()
	{
		var canvas = $("#city-screen .shieldbar");
		canvas.attr("width", canvas.width());
		canvas.attr("height", canvas.height());
		var context = canvas[0].getContext("2d");
		var image = Images["img/icons-city.png"];

		var width = 0, offset;

		// draw background
		context.fillStyle = "#3f4fa7";
		context.fillRect(0,0,canvas.width(),canvas.height());

		// draw support
		width = 54-5;
		offset = Math.min(15,(width - 15) / (city.support - 1));
		for (var i=0; i<city.support; i++)
			context.drawImage(image,
				CityIconsSprites.shield.x, CityIconsSprites.shield.y,
				14, 14,
				5 + i*offset, 1,
				14, 14);


		// draw production
		width = Math.min((canvas[0].width-width)-15, city.production*15);
		offset = (width-15) / (city.production - 1);
		context.fillStyle = "#070b67";
		context.fillRect(canvas[0].width - width-5,0,width+5,canvas.height());
		for (var i=0; i<city.production; i++)
			context.drawImage(image,
				CityIconsSprites.shield.x, CityIconsSprites.shield.y,
				14, 14,
				canvas[0].width - width-3 + i*offset, 1,
				14, 14);
	}

	function drawFoodStorage()
	{
		var canvas = $("#city-screen .food-storage");
		canvas.attr("width", canvas.width());
		canvas.attr("height", canvas.height());
		var context = canvas[0].getContext("2d");
		var image = Images["img/icons-city.png"];

		var count = city.food;
		var max = city.size * 20;

		// draw border
		var iconSize = 14;
		var rows = 10;//   Math.min(10, Math.ceil(max / 10));
		var cols = Math.ceil(max / rows);
		var width = Math.min(158, cols * (iconSize+1));
		var offset = (width - iconSize) / (cols - 1);
		var x = (((canvas[0].width - width)/2)|0) - 3.5, y = 15.5;
		var w = width + 2*4, h = 146;

		// draw frame
		context.strokeStyle = "#4b9b23";
		context.beginPath();
		context.moveTo(x,y+h);
		context.lineTo(x,y);
		context.lineTo(x+w,y);
		context.stroke();

		context.strokeStyle = "#003300";
		context.beginPath();
		context.moveTo(x+w,y);
		context.lineTo(x+w,y+h);
		context.lineTo(x,y+h);
		context.stroke();

		// draw divider (only if city has granary) TODO: granary
		context.strokeStyle = "#4b9b23";
		context.beginPath();
		context.moveTo(x+3,y+h/2+1);
		context.lineTo(x+w-3,y+h/2+1);
		context.stroke();


		function drawHaystacks(y,count)
		{
			x = (((canvas[0].width - width)/2)|0);
			for (var i=0; i<count; i++)
			{
				context.drawImage(image,
					CityIconsSprites.food.x, CityIconsSprites.food.y,
					14, 14,
					x + (i % cols) * offset, y + (Math.floor(i / cols)) * iconSize,
					14, 14
				);
			}
		}

		drawHaystacks(18, Math.min(count, max/2));
		drawHaystacks(90, Math.max(0, count-max/2));
	}

	function drawProductionShields()
	{
		var canvas = $("#city-screen .shields");
		canvas.attr("width", canvas.width());
		canvas.attr("height", canvas.height());
		var context = canvas[0].getContext("2d");
		var image = Images["img/icons-city.png"];

		count = city.shields;
		max = 40;		// TODO: temp - depending on the current production

		// draw border
		var iconSize = 14;
		var width = 170;			// width of the shields area
		var rows = Math.min(10, Math.ceil(max / 10));
		var cols = Math.ceil(max / rows);
		var offset = (width - iconSize) / (cols - 1);
		var x = 5.5, y = 42.5;
		var w = 183, h = 2*4+rows*iconSize;


		context.strokeStyle = "#5367bf";
		context.beginPath();
		context.moveTo(x,y+h);
		context.lineTo(x,y);
		context.lineTo(x+w,y);
		context.stroke();

		context.strokeStyle = "#00005f";
		context.beginPath();
		context.moveTo(x+w,y);
		context.lineTo(x+w,y+h);
		context.lineTo(x,y+h);
		context.stroke();

		// shields can have max 10 rows, in each row shields are distributed equally
		// normally there are 10 shields in a row
		x = 11;
		y = 46;

		for (var i=0; i<count; i++)
		{
			context.drawImage(image,
				CityIconsSprites.shield.x, CityIconsSprites.shield.y,
				14, 14,
				x + (i % cols) * offset, y + (Math.floor(i / cols)) * iconSize,
				14, 14
			);
		}
	}

	function drawIcons(count, max, icon, context, x, y, width, height)
	{

	}

	function drawMinimap()
	{
		var canvas = $("#city-screen .minimap .minimap-view");
		canvas.attr("width", 5*TileWidth);
		canvas.attr("height", 8*TileHeight);
		canvas.css("margin-left", -5*TileWidth2);
		canvas.css("margin-top", -8*TileHeight2);
		var context = canvas[0].getContext("2d");

		// draw background
		context.fillStyle = "#000";
		context.fillRect(0,0,canvas.width(),canvas.height());

		//city.x = 5;
		//city.y = 11;

		var x = city.x - (city.y%2 == 1 ? 2 : 3), y = city.y-6;
		var w = 6, h = 13;
		var pos = Game.map.getTilePos(city.x,city.y);

		var options =
		{
			context:		context,
			offset:			new Point(-pos.x+TileWidth*2, -pos.y+TileHeight2*7)
		};

		Game.map.drawTiles(x,y,w,h,options);
	}

	function drawMinimapOverlay()
	{
		var canvas = $("#city-screen .minimap .overlay");
		canvas.attr("width", canvas.width());
		canvas.attr("height", canvas.height());
		var context = canvas[0].getContext("2d");
		var image = Images["img/icons-mini.png"];

		var x = city.x - (y%2 ? 1 : 2), y = city.y-5;
		var w = 5, h = 13;

		// TODO: temp
		city.tiles = [
			{ x: city.x, y: city.y, food: 2 },
			{ x: city.x, y: city.y+1, food: 2, shields: 1 },
			{ x: city.x-1, y: city.y, food: 2, shields: 0, trade: 1 }
			//{ x: city.x-1, y: city.y }
		];

		// TODO: temp
		var taken = [
			{ x: city.x, y: city.y }
		];

		var center = Game.map.getTilePos(city.x, city.y);
		var offset = new Point(
			(TileWidth*0.75)*1.5,
			(TileHeight*0.75)*2.5-4
		);
		var maxWidth = 48-8;
		/*
		 image = Images["img/selection.png"];
		 // draw taken tiles
		 for (var i=0; i<taken.length; i++)
		 {
		 var tile = taken[i];
		 var mapPos = Game.map.getTilePos(tile.x, tile.y);
		 var pos = new Point(
		 TileHeight2*4+(mapPos.x - center.x),
		 TileWidth2*1.7+(mapPos.y - center.y)
		 );
		 context.drawImage(image,0,0,66,34,pos.x+4, pos.y+1,TileWidth*0.85,TileHeight*0.85);
		 }*/

		var image = Images["img/icons-mini.png"];
		// loop over each city tile
		for (var i=0; i<city.tiles.length; i++)
		{
			var tile = city.tiles[i];

			// get the on-screen position of the tile
			var mapPos = Game.map.getTilePos(tile.x, tile.y);
			var pos = new Point(
				offset.x + (mapPos.x - center.x) * 0.75,
				offset.y + (mapPos.y - center.y) * 0.75
			);

			var icons = (tile.shields||0) + (tile.food||0) + (tile.trade||0);
			var margin = Math.min(CityMiniIconsSprites.Size,(maxWidth - CityMiniIconsSprites.Size) / icons)|0;
			var width = Math.min((icons - 1)*margin + CityMiniIconsSprites.Size, maxWidth);
			var x = pos.x + (48 - width)/2;
			var y = pos.y + 9;
			console.log(x,y)

			for (var j=0; j<tile.food; j++)
			{
				context.drawImage(image,
					CityMiniIconsSprites.food.x, CityMiniIconsSprites.food.y,
					CityMiniIconsSprites.Size, CityMiniIconsSprites.Size,
					x, y,
					CityMiniIconsSprites.Size, CityMiniIconsSprites.Size);
				x += margin;
			}

			for (var j=0; j<tile.trade; j++)
			{
				context.drawImage(image,
					CityMiniIconsSprites.trade.x, CityMiniIconsSprites.trade.y,
					CityMiniIconsSprites.Size, CityMiniIconsSprites.Size,
					x, y,
					CityMiniIconsSprites.Size, CityMiniIconsSprites.Size);
				x += margin;
			}

			for (var j=0; j<tile.shields; j++)
			{
				context.drawImage(image,
					CityMiniIconsSprites.shield.x, CityMiniIconsSprites.shield.y,
					CityMiniIconsSprites.Size, CityMiniIconsSprites.Size,
					x, y,
					CityMiniIconsSprites.Size, CityMiniIconsSprites.Size);
				x += margin;
			}
		}

		function screenToTile(x,y)
		{
			x *= 1.25;
			y *= 1.25;
			x += -5;
			//y += TileHeight2;
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

		function tileToMinimapPos(x,y)
		{
			var pos = { x: x, y: y };
			var spos = Game.map.getTilePos(pos.x, pos.y);
			spos.x *= 0.75;
			spos.y *= 0.75;
			spos.y -= 2;
			return spos;
		}

		// Attach click event
		$("#city-screen .minimap .minimap-view")
			/*.unbind("click")
			 .bind("click", function(e)
			 {
			 console.log("click")
			 })
			 .unbind("mousemove")*/
			.bind("mousemove", function(e)
			{
				var offset = $(this).offset();
				var pos = screenToTile(e.clientX - offset.left-16, e.clientY - offset.top-20);

				spos = tileToMinimapPos(pos.x, pos.y);

				$("#city-screen img").css({
					left: spos.x+"px",
					top: spos.y+"px"
				});
			});
	}

	/**
	 * Initialize UI elements
	 */
	function initUI()
	{
		$("#city-screen .close").unbind("click").bind("click", hide);
	}

	/**
	 * Hide city screen dialog
	 */
	function hide()
	{
		$("#city-screen").hide();
		console.log("hide")
	}

	function show()
	{
		$("#city-screen").show();
	}



	show();			// display first to update canvas values
	refresh();
	initUI();


	this.refresh 	= refresh;
	this.hide		= hide;
	this.show		= show;
}