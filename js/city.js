var CityType =
{
	Stone:		0,
	Ancient:	1,
	FarEast:	2,
	Medieval:	3,
	Industrial:	4,
	Modern:		5
};

var CityTile =
{
	x: 0, y: 0,						// position
	shields: 0,
	food: 0,
	trade: 0
};

var City = function(x, y, player, name, options)
{
	var city = this;
	options = options || {};

	// city parameters
	this.name 			= name;
	this.type			= options.type || CityType.Medieval;
	this.player			= player;
	this.size			= options.size || 1;

	this.population		= 0;
	this.food			= 0;
	this.surplus		= 0;						// < 0 = hunger
	this.trade			= 0;
	this.corruption		= 0;
	this.support		= 0;
	this.production		= 0;
	this.foodStorage	= 0;						// amount of food stored
	this.shields		= 0;						// amount of shields produced
	this.gold			= 0;						// output parameters
	this.luxury			= 0;
	this.science		= 0;

	this.tiles			= [];						// list of tiles used
	this.supportedUnits	= [];						// list of supported units
	this.supplies		= [];						// list of supplied resources
	this.demands		= [];						// list of required resources
	this.buildings		= [];						// buildings constructed in this city
	this.tradeRoutes	= [];						// established trade routes

	this.x				= x;
	this.y				= y;
	this.div			= null;						// DOM element
	this.absPos			= Game.map.getTilePos(x,y);		// get map pixel position

	// create DOM element
	var pos = getUnitIconPosition(3,this.type);
	this.div = $("<div class='city'/>").css("background-position", pos.x+"px "+ pos.y+"px" );

	// city name
	var title = $("<span class='city-name'></span>").text(this.name);
	title.appendTo(this.div);

	// city size
	var size = $("<span class='city-size'></span>").text(this.size);
	size.appendTo(this.div);

	/**
	 * Position DOM element on the map
	 * @param x
	 * @param y
	 */
	function setMapPosition(x,y)
	{
		city.x = x;
		city.y = y;
		city.absPos	= Game.map.getTilePos(x,y);
		city.div.css("transform", "translate3d("+(city.absPos.x)+"px, 0px, "+((y/2-map3dHeightHalf)*map3dHeightHalf)+"px)");
		city.div.css("z-index",y*10);
	}

	/**
	 * Update city object according to it's state
	 */
	function update()
	{
		size.text(city.size);

		// choose appropriate city icon according to size
		var pos;
		if (city.size >= 8) pos = getUnitIconPosition(3,this.type); else
		if (city.size >= 6) pos = getUnitIconPosition(2,this.type); else
		if (city.size >= 4) pos = getUnitIconPosition(1,this.type); else
			pos = getUnitIconPosition(0,this.type);
		city.div.css("background-position", pos.x+"px "+ pos.y+"px" );

		// update position
		setMapPosition(x, y);
		//city.div.css("transform", "translate3d("+(city.absPos.x)+"px, 2px, "+((city.y/2-map3dHeightHalf)*map3dHeightHalf)+"px)");
		//city.div.css("z-index",y);
	}

	/**
	 * Select city
	 */
	this.div.click(function()
	{
		//Game.selectCity(city);
	});

	/**
	 * Called when city is selected
	 */
	function onSelect()
	{

	}

	update();

	this.update			= update;
	this.onSelect		= onSelect;
};

// Positioning of the icons
var CityIconsSprites =
{
	hunger:			{ x: 1, y: 1 },
	food:			{ x: 1, y: 16 },
	luxury:			{ x: 1, y: 32 },
	unhappy:		{ x: 1, y: 46 },
	shieldWasted:	{ x: 16, y: 1 },
	shield:			{ x: 16, y: 16 },
	gold:			{ x: 16, y: 31 },
	goldWasted:		{ x: 16, y: 46 },
	corruption:		{ x: 31, y: 1 },
	trade:			{ x: 31, y: 16 },
	coin1:			{ x: 46, y: 1 },
	coin2:			{ x: 61, y: 1 },
	coin3:			{ x: 46, y: 16 },
	coin4:			{ x: 61, y: 16 },
	beaker1:		{ x: 31, y: 31 },
	beaker2:		{ x: 46, y: 46 },
	beaker3:		{ x: 46, y: 31 },
	beaker4:		{ x: 61, y: 31 },

	Size:			14
};

var CityMiniIconsSprites =
{
	food:			{ x: 1, y : 1 },
	shield:			{ x: 12, y : 1 },
	trade:			{ x: 23, y : 1 },
	unhappy:		{ x: 34, y : 1 },
	luxury:			{ x: 1, y : 12 },
	gold:			{ x: 12, y : 12 },
	beaker:			{ x: 23, y : 12 },
	unhappy2:		{ x: 34, y : 12 },

	Size:			10
};

var CityNames = 
{
	Americans: [
		"Washington",
		"New York",
		"Boston",
		"Philadelphia",
		"Atlanta",
		"Chicago",
		"San Francisco",
		"Buffalo",
		"St. Louis",
		"Detroit",
		"New Orleans",
		"Baltimore",
		"Denver",
		"Cincinnati",
		"Dallas",
		"Los Angeles",
		"Kansas City",
		"San Diego",
		"Richmond",
		"Las Vegas",
		"Phoenix",
		"Seattle",
		"Albuquerque",
		"Portland",
		"Minneapolis",
	]
}
