var Game = function()
{
	// Game global state
	this.name		= "New Game";			// name of the game instance
	this.players	= [];					// players in the game
	this.units		= [];					// all units in the game
	this.cities		= [];					// all cities in the game
	this.turn		= 0;					// which turn is it
	this.year		= -1000;
	// Current state
	this.currentPlayer		= null;			// which player's turn is it right now?
	this.selectedUnit		= null;
	this.selectedCity		= null;

	// Game elements
	this.cityScreen			= null;
}

/**
 * Start game
 */
Game.prototype.start = function()
{
	console.log("Game start");

	civ.map = new Map();
	civ.map.init(50, 80);


	Rules.processRules("RULES.TXT");
	initKeyBindings();


	// TODO: temp
	// create players default players
	this.players =
	[
		new Player("Player 1", PlayerColors[0], PlayerRaces[0]),
		new Player("Player 2", PlayerColors[1], PlayerRaces[1])
	];

	// spawn settlers for each player
	/*for (var i=0; i<this.players.length; i++)
	{
		this.createUnit(this.players[i], 5+i,20+i*5, UnitTypes.Settler);//(Math.random()*Map.width)|0, (Math.random()*Map.height)|0, UnitTypes.Settler);
	}*/
	/*for (var i=0; i<50; i++)
	{

		var x = (Math.random() * civ.map.width)|0;
		var y = (Math.random() * civ.map.height)|0;
		var pos = civ.map.getTilePos(x, y);

		var city = $('<div class="city"></div>');
		city.css({
			top: pos.y+"px",
			left: pos.x+"px"
		});
		$("#cities").append(city);
	}*/

	this.endTurn();

	// TODO: temp
	// create default cities scattered around land
	for (var i=0; i<CityNames.Americans.length; i++)
	{
		var x = (Math.random()*civ.map.width)|0;
		var y = (Math.random()*civ.map.height)|0;
		var tile = civ.map.getTileType(x,y);
		while (tile == TileTypes.Ocean.id)
		{
			x = (Math.random()*civ.map.width)|0;
			y = (Math.random()*civ.map.height)|0;
			tile = civ.map.getTileType(x,y);
		}
		this.createCity( this.players[0], x, y, CityNames.Americans[i]);
	}
}


Game.prototype.createNewMap = function(name, width, height)
{
	civ.map = new Map();
	civ.map.init(width, height);
	civ.map.name = name;

	// remove all units
	$("#units").empty();
	$("#cities").empty();

	this.cities = [];

	for (var i=0; i<CityNames.Americans.length; i++)
	{
		var x = (Math.random()*civ.map.width)|0;
		var y = (Math.random()*civ.map.height)|0;
		var tile = civ.map.getTileType(x,y);
		while (tile == TileTypes.Ocean.id)
		{
			x = (Math.random()*civ.map.width)|0;
			y = (Math.random()*civ.map.height)|0;
			tile = civ.map.getTileType(x,y);
		}
		this.createCity( this.players[0], x, y, CityNames.Americans[0]);
	}
}

Game.prototype.finish = function()
{
	console.log("Game finished");
}

/**
 * Next turn
 */
Game.prototype.endTurn = function()
{
	console.log("Ending turn %d", this.turn);
	this.onEndTurn();

	this.turn++;

	// get next player in the queue
	if (!this.currentPlayer)
	{
		this.currentPlayer = this.players[0];
	}
	else
	{
		for (var i=0; i<this.players.length; i++)
			if (this.players[i] == this.currentPlayer)
			{
				i++;
				if (i == this.players.length) i = 0;
				this.currentPlayer = this.players[i];
				break;
			}
	}

	this.onBeginTurn();
}

Game.prototype.onEndTurn = function()
{
	console.log("onEndTurn()");
	this.selectUnit(null);				// deselect unit
	this.selectedCity = null;		// deselect city

	// refresh all units
	for (var i=0; i<this.units.length; i++) this.units[i].endTurn();
}

Game.prototype.onBeginTurn = function()
{
	console.log("onBeginTurn()");
	console.log("Now it's %s's turn", this.currentPlayer.name);
	$("#turn").text(this.currentPlayer.name+"'s turn").css("color", this.currentPlayer.color);
}

/**
 * Create a new city
 * @param player
 * @param x
 * @param y
 * @param name
 * @param options
 */
Game.prototype.createCity = function(player, x, y, name, options)
{
	console.log("Creating city '%s' at %d, %d", name, x, y);

	var city = new City(x, y, player, name, options);
	this.cities.push(city);
	player.cities.push(city);
	//$units.append(city.div);
}

/**
 * Create a new unit
 * @param player
 * @param x
 * @param y
 * @param type
 * @param options
 */
Game.prototype.createUnit = function(player, x, y, type, options)
{
	console.log("Creating unit '%s' at %d, %d", type.name, x, y);

	var unit = new Unit(type, x, y, player);
	this.units.push(unit);
	player.units.push(unit);
	$units.append(unit.div);
}

/**
 * Remove unit from the game
 * @param unit
 */
Game.prototype.destroyUnit = function(unit)
{
	// If this unit was selected, deselect
	if (this.selectedUnit == unit) selectUnit(null);

	// remove from the global array
	for (var i=0; i<this.units.length; i++)
		if (this.units[i] == unit)
		{
			this.units.splice(i, 1);
			break;
		}

	// remove from player's array
	for (var i=0; i<unit.player.units.length; i++)
		if (unit.player.units[i] == unit)
		{
			unit.player.units.splice(i, 1);
			break;
		}

	unit.div.remove();
	console.log("Unit '%s' has been removed", unit.type.name);
}

/**
 * Remove city
 * @param city
 */
Game.prototype.destroyCity = function(city)
{
	// remove from the global array
	for (var i=0; i<this.cities.length; i++)
		if (this.cities[i] == city)
		{
			this.cities.splice(i, 1);
			break;
		}

	// remove from player's array
	for (var i=0; i<city.player.cities.length; i++)
		if (city.player.cities[i] == city)
		{
			city.player.cities.splice(i, 1);
			break;
		}

	console.log("City '%s' has been removed", city.name);
}

/**
 * Select given unit
 * @param unit
 */
Game.prototype.selectUnit = function(unit)
{
	if (!unit)
	{
		// Deselect unit
		console.log("Unit deselected");
		if (this.selectedUnit)
		{
			this.selectedUnit.div.removeClass("selected");
			this.selectedUnit = null;
		}
		return;
	}
	else
	{
		// Make sure that unit belongs to current player
		if (unit.player != this.currentPlayer)
		{
			console.warn("Unit doesn't belong to current player!");
			return;
		}

		this.selectCity(null);		// deselect any selected unit
		this.selectedUnit = unit;
		unit.onSelect();
		console.log("Selected unit '%s'", unit.type.name);
	}
}

Game.prototype.selectCity = function(city)
{
	this.hideCityScreen();
	if (!city)
	{
		console.log("City deselected");
		if (this.selectedCity)
		{
			this.selectedCity.div.removeClass("selected");
			this.selectedCity = null;
		}
	}
	else
	{
		if (city.player != this.currentPlayer)
		{
			console.warn("City doesn't belong to the current player!");
			return;
		}

		this.selectUnit(null);		// deselect any selected unit
		this.selectedCity = city;
		city.onSelect();
		console.log("Selected city '%s'", city.name);
		this.cityScreen = new CityScreen(city);			// show city screen for city
	}
}

Game.prototype.hideCityScreen = function()
{
	if (this.cityScreen)
	{
		this.cityScreen.hide();
		this.cityScreen = null;
	}
}

/**
 * When build new city is selected
 * @param player
 * @param x
 * @param y
 */
Game.prototype.buildNewCity = function(player,x,y)
{
	var name = prompt("Build new city", "Washington");		// TODO: better placeholder name
	if (!name) return false;
	this.createCity(player, x, y, name);
	return true;
}

Game.prototype.getYearString = function()
{
	return this.year < 0 ? (-this.year+" B.C.") : (this.year+" A.D.");
}


