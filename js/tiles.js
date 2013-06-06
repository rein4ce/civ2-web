var TileResources =
{
	Oasis:		0,
	Oil:		1,
	Buffalo:	2,
	Wheat:		3,
	Grassland:	4,
	Pheasant:	5,
	Silk:		6,
	Coal:		7,
	Wine:		8,
	Gold:		9,
	Iron:		10,
	Furs:		11,
	Musk:		12,
	Ivory:		13,
	Peat:		14,
	Spice:		15,
	Gems:		16,
	Fruit:		17,
	Fish:		18,
	Whales:		19
}

var TileType =
{
	name:			"Tile type",			// terrain type
	iconY:			0,						// which row in the spritesheet
	iconsNum:		1,						// how many variations of tile
	move:			1,						// move points cost
	defense:		1,						// defense points
	food:			1,						// amount of food
	shields:		1,						// amount of shields
	trade:			1,						// amount of trade
	irrigate:		true,					// can be irrigated (or type of terrain converted to)
	extraFood:		1,						// extra food after irrigating
	mine:			true,					// can create mine (or type of terrain converted to)
	extraShields:	0,						// extra shields after adding mines
	transform:		"Plains",				// name of terrain it transforms to
	transformTurns:	5,						// how many turns needed to transform
	resources:		[]						// array of potential resources
}

var TileTypes =
{
	Desert:
	{
		name:			"Desert",
		iconY:			0,
		iconsNum:		2,
		move:			1,
		defense:		2,
		food:			0,
		shields:		1,
		trade:			0,
		irrigate:		true,
		extraFood:		1,
		mine:			true,
		extraShields:	1,
		transform:		"Plains",
		transformTurns:	5,
		resources:		[ TileResources.Oasis, TileResources.Oil ]
	},
	Plains:
	{
		name:			"Plains",
		iconY:			1,
		iconsNum:		1,
		move:			1,
		defense:		2,
		food:			0,
		shields:		1,
		trade:			0,
		irrigate:		true,
		extraFood:		1,
		mine:			true,
		extraShields:	1,
		transform:		"Plains",
		transformTurns:	5,
		resources:		[ TileResources.Buffalo, TileResources.Wheat ]
	},
	Grassland:
	{
		name:			"Grassland",
		iconY:			2,
		iconsNum:		2,
		move:			1,
		defense:		2,
		food:			0,
		shields:		1,
		trade:			0,
		irrigate:		true,
		extraFood:		1,
		mine:			true,
		extraShields:	1,
		transform:		"Plains",
		transformTurns:	5,
		resources:		[ TileResources.Grassland ]
	},
	Forest:
	{
		name:			"Forest",
		iconY:			3,
		iconsNum:		2,
		move:			1,
		defense:		2,
		food:			0,
		shields:		1,
		trade:			0,
		irrigate:		true,
		extraFood:		1,
		mine:			true,
		extraShields:	1,
		transform:		"Plains",
		transformTurns:	5,
		resources:		[ TileResources.Oasis, TileResources.Oil ]
	},
	Hills:
	{
		name:			"Hills",
		iconY:			4,
		iconsNum:		2,
		move:			1,
		defense:		2,
		food:			0,
		shields:		1,
		trade:			0,
		irrigate:		true,
		extraFood:		1,
		mine:			true,
		extraShields:	1,
		transform:		"Plains",
		transformTurns:	5,
		resources:		[ TileResources.Oasis, TileResources.Oil ]
	},
	Mountains:
	{
		name:			"Mountains",
		iconY:			5,
		iconsNum:		2,
		move:			1,
		defense:		2,
		food:			0,
		shields:		1,
		trade:			0,
		irrigate:		true,
		extraFood:		1,
		mine:			true,
		extraShields:	1,
		transform:		"Plains",
		transformTurns:	5,
		resources:		[ TileResources.Oasis, TileResources.Oil ]
	},
	Tundra:
	{
		name:			"Tundra",
		iconY:			6,
		iconsNum:		1,
		move:			1,
		defense:		2,
		food:			0,
		shields:		1,
		trade:			0,
		irrigate:		true,
		extraFood:		1,
		mine:			true,
		extraShields:	1,
		transform:		"Plains",
		transformTurns:	5,
		resources:		[ TileResources.Oasis, TileResources.Oil ]
	},
	Glacier:
	{
		name:			"Glacier",
		iconY:			7,
		iconsNum:		1,
		move:			1,
		defense:		2,
		food:			0,
		shields:		1,
		trade:			0,
		irrigate:		true,
		extraFood:		1,
		mine:			true,
		extraShields:	1,
		transform:		"Plains",
		transformTurns:	5,
		resources:		[ TileResources.Oasis, TileResources.Oil ]
	},
	Swamp:
	{
		name:			"Swamp",
		iconY:			8,
		iconsNum:		1,
		move:			1,
		defense:		2,
		food:			0,
		shields:		1,
		trade:			0,
		irrigate:		true,
		extraFood:		1,
		mine:			true,
		extraShields:	1,
		transform:		"Plains",
		transformTurns:	5,
		resources:		[ TileResources.Oasis, TileResources.Oil ]
	},
	Jungle:
	{
		name:			"Jungle",
		iconY:			9,
		iconsNum:		2,
		move:			1,
		defense:		2,
		food:			0,
		shields:		1,
		trade:			0,
		irrigate:		true,
		extraFood:		1,
		mine:			true,
		extraShields:	1,
		transform:		"Plains",
		transformTurns:	5,
		resources:		[ TileResources.Oasis, TileResources.Oil ]
	},
	Ocean:
	{
		name:			"Ocean",
		iconY:			10,
		iconsNum:		1,
		move:			1,
		defense:		2,
		food:			0,
		shields:		1,
		trade:			0,
		irrigate:		true,
		extraFood:		1,
		mine:			true,
		extraShields:	1,
		transform:		"Plains",
		transformTurns:	5,
		resources:		[ TileResources.Oasis, TileResources.Oil ]
	}
};

var TileTypesList = [];
for (var name in TileTypes)
{
	TileTypes[name].id = TileTypesList.length;
	TileTypesList.push(TileTypes[name]);
}

