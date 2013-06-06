var map3dOffsetX = 0;
var map3dOffsetY = 285;
var map3dPerspective = 646;
var map3dHeightHalf = 9;

var $container		= null;
var $map			= null;
var $mapCanvas 		= null;
var $mapFogCanvas 	= null;
var mapCtx			= null;
var mapFogCtx 		= null;
var $select 		= null;
var $units			= null;

var Width 			= null;
var Height 			= null;

$(function()
{
	loadResources(function()
	{
		console.log("Resources loaded");

		initSelectors();
		initUnitTypes();
		initUI();
		initView();

		Game.start();

		// TODO: Temp
		for (var i=0; i<100; i++)
		{
			//new Unit((Math.random()*UnitTypes.length)|0, 0, i);
		}


		gameLoop();
	});
});

var MaxFPS = 5;
var fps = 0;
var realtime, frametime, oldRealtime;


/**
 * Setup view projection
 */
function initView()
{
	// Setup 3d view
	var rotation = "15deg";
	var perspective = map3dPerspective+"px";
	$("#map_units_outer")
		.css({
			"-webkit-perspective": perspective,
			"perspective": perspective
		})
		.css({
			"-webkit-perspective-origin": "50% -320%",
			"perspective-origin": "50% -320%"
		});

	$("#map_units")
		.css("-webkit-transform", "translate3d("+map3dOffsetX+"px, "+map3dOffsetY+"px, 0px)")
		.css("transform", "translate3d("+map3dOffsetX+"px, "+map3dOffsetY+"px, 0px)")
		.css("-webkit-transform-style", "preserve-3d")
		.css("transform-style", "preserve-3d");
}

/**
 * Grab references to all important DOM elements
 */
function initSelectors()
{
	$container		= $("#view");
	$map			= $("#map");
	$mapCanvas 		= $("#map_tiles");
	$mapFogCanvas 	= $("#map_fog");
	mapCtx			= $("#map_tiles")[0].getContext("2d");
	mapFogCtx 		= $("#map_fog")[0].getContext("2d");
	$select 		= $("#map .selection");
	$units			= $("#map_units");

	Width 			= $container.width();
	Height 			= $container.height();
}


////////////////////////////////////////////////////////////////////
// Init events
////////////////////////////////////////////////////////////////////
function initKeyBindings() {
	$("body").keydown(function(e)
	{
		// Moving the unit
		if (Game.selectedUnit != null)
		{
			var key = e.which || e.keyCode;
			Game.selectedUnit.onKeyPress(key);
		}
	});
}

function initUI()
{
	$("#end-turn").click(Game.endTurn);
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