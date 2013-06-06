////////////////////////////////////////////////////////////////////
// Game Rules
////////////////////////////////////////////////////////////////////
var Rules = {

	////////////////////////////////////////////////////////////////////
	// Process Rules file
	////////////////////////////////////////////////////////////////////
	processRules: function(file) {
		/*$.get(file, function(data) {
			trace("Downloaded rules file");
			UnitTypes = [];
			var lines = data.split("\n");
			var mode = null;
			
			// parse each line
			for (var i=0; i<lines.length; i++) {			
				var s = lines[i];
				if (s.charAt(0) == ";") continue;
				if (s.charAt(0) == "@") { mode = $.trim(s.split("@")[1].toLowerCase()); continue; }				
				
				// Units
				if (mode == "units") {
					var p = s.split(",");
					if (p.length != 14) { mode = null; trace("Units loaded: "+UnitTypes.length); continue; }
					UnitTypes.push( new UnitType(
							$.trim(p[0]),
							$.trim(p[1]),
							parseInt(p[2]),
							parseInt(p[3].replace(".","")),
							parseInt(p[4]),
							p[5],
							p[6],
							p[7],
							p[8],
							parseInt(p[9]),
							parseInt(p[10]),
							parseInt(p[11]),
							p[12],
							p[13] ) );					
				}
			}
		})
		.error(function() { alert("Error occurred when downloading RULES.TXT file"); });*/
	}
}