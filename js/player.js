// Available faction colors
var PlayerColors =
[
	"red",
	"green",
	"yellow",
	"white",
	"blue"
];

// Player races
var PlayerRaces =
[
	"Americans",
	"Germans",
	"Egyptians",
	"Babylonians",
	"Russians"
];

var Player = function(name, color, race)
{
	this.id			= 0;					// index of the player in the array
	this.name		= name || "Player";				// display name of the player
	this.color		= color || PlayerColors[0];		// color
	this.race		= race || PlayerRaces[0];		// race
	this.gold		= 0;					// how much money does player have
	this.units		= [];
	this.cities		= [];

	this.cursorX = 0;						// where did player put his cursor last time ?
	this.cursorY = 0;
}