// DEBUG
var trace = function(str){ console.log(str); };
// DEBUG

var displayList;
var floor;
var control;

var floorPoints_ARR;

var tt;

function page_init()
{
	trace("page_init();");

	display_init();

	// tt = setTimeout(quick, 2  * 1000);
}

function display_init()
{
	displayList = {};

	displayList.scene 	= document.querySelector("#display-wrapper .display-main");
	displayList.floor 	= document.querySelector("#display-wrapper .flooring");
	displayList.player	= document.querySelector("#display-wrapper .flooring .player-sprite");


	floor_init();

	control_init();
}

function floor_init()
{
	floor = {};

	floor.point0 = {"x": 900, "steep": 40};

	floor.point1 = {"x": 1600, "steep": -30};

	floor.point2 = {"x": 3000, "steep": 60};

	floor.point3 = {"x": 5000, "steep": 0};
}

function quick()
{
	displayList.scene.style.transform = 'rotate(' + floor.point1.steep + 'deg)';
}

function control_init()
{
	control 			= {};
	control.x 			= 0;
	control.inc 		= 40;
	control.playerWidth = 80;
	control.floorWidth	= 8000;

	control_port(true);
}

function control_port(connect) 
{
	if(connect)
	{
		window.addEventListener("keydown", control_event, false);
	}

	else
	{
		window.removeEventListener("keydown", control_event, false);
	}
}

function control_event(event)
{
	var dir = event.keyCode;

	switch(dir)
	{
		case 37:
		{
			dir = "L";
			break;
		}

		case 39:
		{
			dir = "R";
			break;
		}

		default:
		{
			dir = "S";
		}
	}

	control.direction = dir;

	if(control.direction !== "S")
	{
		control_unit();
	}
}

function control_unit()
{
	control.direction === "L" ? control.x -= control.inc : control.x += control.inc;

	if(control.x > 0)
	{
		displayList.player.style.transform 	= 'translateX(' + control.x + 'px)';
	}

	floor_check();
	floor_center();
}

function floor_check()
{
	for(var i = 0; i < 4; i++)
	{
		var p = floor['point' + i];

		if(control.x >= p.x)
		{
			displayList.scene.style.transform = 'rotate(' + p.steep + 'deg)';
		}
	}
}

function floor_center()
{
	var width_across = window.innerWidth;
	var player_pos = control.x;
	var center_x = Math.round(-player_pos) + (width_across * 0.5);

	trace(center_x);

}








