// Liast of all image files that need to be preloaded
var ImagesList =
[
	"img/icons-city.png",
	"img/icons-mini.png",
	"img/icons-techtree.png",
	"img/icons-buildings.png",
	"img/terrain1.png",
	"img/terrain2.png",
	"img/units.png",
	"img/blacktile.png",
	"img/selection.png"
];

// List of all sounds
var SoundsList =
[
];

// Global libraries of images/sounds
var Images = {};
var Sounds = {};

/**
 * Start downloading all the resource files in the background
 * @param callback
 */
function loadResources(callback)
{
	var loader = new PxLoader();
	for (var i=0; i<ImagesList.length; i++)
	{
		var name = ImagesList[i];
		Images[name] = loader.addImage(name);
	}

	for (var i=0; i<SoundsList.length; i++)
	{
		var name = SoundsList[i];
		Sounds[name] = loader.addSound(name);
	}

	loader.addCompletionListener(callback);
	loader.start();
}

