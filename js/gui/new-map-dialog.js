var NewMapDialog = function()
{
	$("#new-map-name").text("New map").select();
	$("#new-map-width, #new-map-height").text("50");
	$("#dialog-new-map, #dialog-backdrop").show();

	$("#new-map-create-btn").on("click", function()
	{
		var name = $("#new-map-name").val();
		var width = parseInt($("#new-map-width").val());
		var height = parseInt($("#new-map-height").val());

		if (!width || !height || width < 0 || height < 0)
			return alert("Invalid map size!");

		if (!name)
			return alert("Please provide a map name!");

		$("#dialog-new-map, #dialog-backdrop").hide();
		Game.createNewMap(name, width, height);
	});

	this.close = function()
	{
		$("#dialog-new-map, #dialog-backdrop").hide();
	}
}

var CaptionDialog = function(message, title)
{
	$("#caption-dialog-text").text(message);
	$("#caption-dialog .dialog-title").text(title || "Please Wait");
	$("#caption-dialog,  #dialog-backdrop").show();

	this.close = function()
	{
		$("#dialog-caption, #dialog-backdrop").hide();
	}
}