var UnitsX = 9;				// number of units per row in the tileset

var units = [];
var selectedUnit = null;

var UnitMoveSpeed = 350;

// Action the unit is currently performing
var UnitAction =
{
	Idle:			"-",
	Sleep:			"S",
	Goto:			"G",
	Irrigate:		"I",
	Road:			"R",
	Fortify:		"F",
	Mine:			"M"
}

// Classes of the units define their abilities
var UnitClass =
{
	Engineer:		0,
	Infantry:		1,
	Cavalry:		2,
	Artillery:		3,
	Fighter:		4,
	Bomber:			5,
	Caravan:		6,
	Warship:		7,
	Transport:		8,
	Missile:		9
}

/**
 * Get the background position for the specific unit icon in the sprite-sheet
 * @param x
 * @param y
 * @return {Object}
 */
function getUnitIconPosition(x,y)
{
	return {
		x:	(-1-(TileWidth+1)*x),
		y:	(-1-(TileHeight2+TileHeight+1)*y)
	};
}

var Unit = function(type, x, y, player, options)
{
	if (!type || !player) console.error("Invalid unit parameters");

	var unit = this;
	options = options || {};

	this.player			= player;
	this.x				= x;
	this.y				= y;
	this.type			= type;
	this.div			= null;						// DOM element
	this.absPos			= Game.map.getTilePos(x,y);		// get map pixel position
	this.movePoints		= type.move;				// move points this turn
	this.hp				= type.hp;					// health points
	this.action			= UnitAction.Idle;

	// create DOM element
	var pos = getUnitIconPosition(type.iconX, type.iconY);
	this.div = $("<div class='unit'/>").css("background-position", pos.x+"px "+ pos.y+"px" );

	var colorIndex = PlayerColors.indexOf(player.color);

	// create shield
	this.shield = $("<div class='shield'>-</div>")
		.css("margin-left", type.shieldX+"px")
		.css("margin-top", type.shieldY+"px")
		.css("background-position-x", (colorIndex * -12)+"px");
	this.shield.appendTo(this.div);

	// health bar
	this.hpBar = $("<div class='hp green'></div>");
	this.shield.append(this.hpBar);

	/**
	 * Position DOM element on the map
	 * @param x
	 * @param y
	 */
	function setMapPosition(x,y)
	{
		unit.x = x;
		unit.y = y;
		unit.absPos	= Game.map.getTilePos(x,y);
		unit.div.css("transform", "translate3d("+(unit.absPos.x)+"px, 0px, "+((y/2-map3dHeightHalf)*map3dHeightHalf)+"px)");
		unit.div.css("z-index",y*10);
	}

	/**
	 * Check if given tile is moveable for us
	 * @param x
	 * @param y
	 */
	function isTileMoveable(x,y)
	{
		var tile = Game.map.getTile(x,y);
		if (!tile) return false;

		var type = TileTypesList[tile.type];
		switch (unit.type.moveType)
		{
			case UnitMoveType.Land:
				return (type != TileTypes.Ocean);

			case UnitMoveType.Sea:
				return (type == TileTypes.Ocean);	// TODO: check if river

			case UnitMoveType.Air:
				return true;
		}
	}

	/**
	 * Move unit in given direction
	 * @param dir
	 */
	function move(dir)
	{
		if (unit.movePoints == 0) return;		// no movepoints left

		// determine destination tile
		var x = this.x, y = this.y;
		switch (dir)
		{
			case 0: y-=2; break;						// straight up (y - 2)
			case 1: x=y%2==0?x:x+1; y--; break;			// upper right
			case 2: x++; break;
			case 3: x=y%2==0?x:x+1; y++; break;
			case 4: y+=2; break;
			case 5: x=y%2==0?x-1:x; y++; break;
			case 6: x--; break;
			case 7: x=y%2==0?x-1:x; y--; break;
		}

		// check if the destination tile is ok
		if (!isTileMoveable(x,y)) return;

		unit.div.removeClass("selected").css("opacity", 1);

		unit.x = x;
		unit.y = y;
		unit.movePoints--;
		update();
	};

	/**
	 * Select unit on click as long as it's our unit
	 */
	this.div.click(function()
	{
		Game.selectUnit(unit);
	});

	/**
	 * Refresh unit state
	 */
	function update()
	{
		// set up position
		setMapPosition(unit.x, unit.y);

		// adjust hp bar
		var hp = (unit.hp / type.hp);
		unit.hpBar.css("width", (hp*10)+"px");
		unit.hpBar.removeClass("green yellow red");
		if (hp < 0.25) 	unit.hpBar.addClass("red"); else
		if (hp < 0.50) 	unit.hpBar.addClass("yellow"); else
						unit.hpBar.addClass("green");

		// unit action inside shield
		unit.shield.text(unit.action);
		unit.shield.append(unit.hpBar);

		// change appearance if sleeping or used
		unit.div.toggleClass("used", unit.movePoints == 0);
		unit.div.toggleClass("sleep", unit.action == UnitAction.Sleep);

		// if there are no move points left, stop blinking
		if (unit.movePoints == 0) unit.div.removeClass("selected");

		// check if the unit is still visible
		//this.checkVisible();
	}

	/**
	 * Update the unit with the new turn (i.e. replenish movepoints, heal etc)
	 */
	function endTurn()
	{
		unit.movePoints = type.move;

		update();
	}

	/**
	 * Fortify unit (or build fortress if engineer)
	 */
	function fortify()
	{
		unit.action = UnitAction.Fortify;
		unit.movePoints = 0;
		unit.update();
	}

	/**
	 * Goto sleep
	 */
	function sleep()
	{
		unit.action = UnitAction.Sleep;
		unit.movePoints = 0;
		unit.update();
	}

	/**
	 * When the unit is selected
	 */
	function onSelect()
	{
		unit.div.toggleClass("selected", unit.movePoints > 0);
	}

	/**
	 * Try to build new city
	 */
	function buildCity()
	{
		if (type != UnitTypes.Settler && type != unitTypes.Engineer) return;
		if (Game.buildNewCity(unit.player, unit.x, unit.y))
		{
			Game.destroyUnit(unit);
		}
	}

	/**
	 * Handle key press when unit is selected
	 * @param key
	 */
	function onKeyPress(key)
	{
		if (unit.movePoints == 0) return;	// if there are no move points left, we can't do anything more
		switch (key)
		{
			// Movement
			case Keys.LEFT_ARROW:
			case Keys.NUMPAD_4:
				unit.move(6); break;			// left

			case Keys.RIGHT_ARROW:
			case Keys.NUMPAD_6:
				unit.move(2); break;			// right

			case Keys.UP_ARROW:
			case Keys.NUMPAD_8:
				unit.move(0); break;			// up

			case Keys.DOWN_ARROW:
			case Keys.NUMPAD_2:
				unit.move(4); break;			// down

			case Keys.NUMPAD_9: unit.move(1); break;		// NE
			case Keys.NUMPAD_7: unit.move(7); break;		// NW
			case Keys.NUMPAD_3: unit.move(3); break;		// SE
			case Keys.NUMPAD_1: unit.move(5); break;		// SW

			// Actions
			case Keys.KEY_F:	unit.fortify(); break;
			case Keys.KEY_S:	unit.sleep(); break;
			case Keys.KEY_B:	unit.buildCity(); break;
		}

	}

	// Check if it's visible
	this.checkVisible = function()
	{
		if (this.absPos.x < Game.map.view.x-TileWidth || this.absPos.y < Game.map.view.y-TileHeight || this.absPos.x > Game.map.view.x+Game.map.view.width || this.absPos.y > Game.map.view.y+Game.map.view.height) {
			if (!this.hidden) { this.div.css("display","none"); this.hidden = true; }
		} else
		if (this.hidden) { this.div.css("display","block"); this.hidden = false; }
		return this.hidden;
	};

	// After creating the unit update it
	update();

	// Interface
	this.setMapPosition = setMapPosition;
	this.move			= move;
	this.fortify 		= fortify;
	this.update			= update;
	this.sleep			= sleep;
	this.buildCity		= buildCity;
	this.isTileMoveable = isTileMoveable;
	this.endTurn		= endTurn;
	this.onKeyPress		= onKeyPress;
	this.onSelect		= onSelect;
}




function UnitType(name, until, move, range, attack, defense, hitpoints, firepower, cost, hold, role, preq, flags) {
	this.name = name;
	this.until = until=="nil"?null:until;
	this.move = move;
	this.range = range;
	this.attack = attack;
	this.defense = defense;
	this.hitpoints = hitpoints;
	this.firepower = firepower;
	this.cost = cost;
	this.hold = hold;
	this.role = role;
	this.preq = preq=="nil"?null:preq;
	this.flags = flags;
}

var UnitTypes = [];




