
function load_data_json(callbackFunct)
{
	var xobj = new XMLHttpRequest();

	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'public/data/setup.json', true);

	xobj.onreadystatechange = function()
	{
		if(xobj.readyState == 4 && xobj.status == "200")
		{
			callbackFunct(xobj.responseText);
		}
	};

	xobj.send(null);
}

