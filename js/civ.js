// Global selectors
var $container		= null;
var $map			= null;
var $mapCanvas 		= null;
var $mapFogCanvas 	= null;
var mapCtx			= null;
var mapFogCtx 		= null;
var $select 		= null;
var $units			= null;
var $terrain		= null;
var $cities			= null;

var Width 			= null;
var Height 			= null;



var Civ = function()
{
	this.map3d			= true;			// make forests and mountains 3d tiles

	this.game			= null;
	this.map			= null;
	this.editor			= Editor;
}

Civ.prototype.init = function()
{
	this.initSelectors();
	initUnitTypes();

	this.game = new Game();
	this.game.start();
	this.editor.init();

	this.initUI();
}


Civ.prototype.initSelectors = function()
{
	$container		= $("#view");
	$map			= $("#map");
	$mapCanvas 		= $("#map_tiles");
	$mapFogCanvas 	= $("#map_fog");
	mapCtx			= $("#map_tiles")[0].getContext("2d");
	mapFogCtx 		= $("#map_fog")[0].getContext("2d");
	$select 		= $("#map .selection");

	$units			= $("#units");
	$cities			= $("#cities");
	$terrain		= $("#terrain");

	Width 			= $container.width();
	Height 			= $container.height();
}


Civ.prototype.initUI = function()
{
	$("#end-turn").on("click", civ.game.endTurn.bind(civ.game));
	/*$("#dialogs").click(function()
	 {
	 $("#dialogs").hide();
	 });*/

	// dialog close button
	$(".dialog-close-btn, .cancel-button").on("click", function()
	{
		$("#dialog-backdrop").hide();
		$(this).parents(".dialog").hide();
	});

	// clicking the backdrop closes any dialogs
	$("#dialog-backdrop").on("click", function()
	{
		$("#dialog-backdrop, #gui .dialog").hide();
	});

	// main menu
	$("#menu-new-map").on("click", function()
	{
		new NewMapDialog();
	});
}


var civ = new Civ();

$(function()
{
	loadResources(function()
	{
		console.log("Resources loaded");
		civ.init();
		gameLoop();
	});
});

var MaxFPS = 5;
var fps = 0;
var realtime, frametime, oldRealtime;




////////////////////////////////////////////////////////////////////
// Init events
////////////////////////////////////////////////////////////////////
function initKeyBindings() {
	$("body").keydown(function(e)
	{
		// Moving the unit
		if (civ.game.selectedUnit != null)
		{
			var key = e.which || e.keyCode;
			civ.game.selectedUnit.onKeyPress(key);
		}
	});
}


function gameLoop()
{
	window.requestAnimFrame(gameLoop);
	filterTime();

	$("#fps-counter").text(sprintf("FPS: %2.2f",fps));
}

function filterTime()
{
	realtime = new Date().getTime();
	frametime = realtime - (oldRealtime || realtime);
	oldRealtime = realtime;

	fps = 1000 / frametime;
	frametime /= 1000;
}

window.requestAnimFrame = (function()
{
	return (
		window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(callback)
			{
				window.setTimeout(callback, 1000 / MaxFPS);
			});
})();