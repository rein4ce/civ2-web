var UnitMoveType =
{
	Land:			0,
	Sea:			1,
	Air:			2
}

var UnitType =
{
	name:			"Unit Name",				// display name of the unit
	cost:			10,
	iconX: 			0,							// position of the icon in the gfx set
	iconY: 			0,
	shieldX:		0,							// shield position offset
	shieldY:		0,
	moveType:		UnitMoveType.Land,			// movement type
	move:			1,							// movement points
	hp:				10,							// health points
	dmg:			0
}

var UnitTypes =
{
	Settler: {
		name:		"Settler",
		cost:		40,
		iconX:		0,
		iconY:		0,
		moveType:	UnitMoveType.Land,
		move:		1,
		hp:			20,
		dmg:		1
	},
	Warrior: {
		name:		"Warrior",
		cost:		40,
		iconX:		2,
		iconY:		0,
		moveType:	UnitMoveType.Land,
		move:		1,
		hp:			10,
		dmg:		5
	}
};

var UnitTypesList = [];
for (var name in UnitTypes) UnitTypesList.push(UnitTypes[name]);

/**
 * Analyze units spritesheet and extract shield positions for each unit type
 */
function initUnitTypes()
{
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	var image = Images["img/units.png"];

	canvas.width = image.width;
	canvas.height = image.height;
	context.drawImage(image, 0, 0);
	var data = context.getImageData(0, 0, image.width, image.height);
	var unitsX = 9;
	var unitsY = 6;
	var unitIndex = 0;

	for (var i=0; i<unitsX; i++)
		for (var j=0; j<unitsY; j++)
		{
			unitIndex = j*unitsX + i;
			if (!UnitTypesList[unitIndex]) break;

			// look for blue/black markers on the top and left border of each unit
			var sx = i * (TileWidth+1);
			var sy = j * (48+1);

			for (var x=sx; x<sx+TileWidth; x++)
				if (data.data[(sy * image.width*4) + (x*4)+1] == 0)
				{
					UnitTypesList[unitIndex].shieldX = x - sx;
					break;
				}

			for (var y=sy; y<sy+48; y++)
				if (data.data[(y * image.width*4) + (sx*4)+1] == 0)
				{
					UnitTypesList[unitIndex].shieldY = y - sy;
					break;
				}
		}
}