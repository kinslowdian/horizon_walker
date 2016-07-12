// DEBUG
var trace = function(str){ console.log(str); };
// DEBUG

var displayList;
var floor;
var control;

var floorPoints_ARR;
var floorTimer;

var firstRun;

var tt;

function page_init()
{
	trace("page_init();");

	firstRun = true;

	display_init();
}

function display_init()
{
	displayList = {};

	displayList.scene 	= document.querySelector("#display-wrapper .display-main");
	displayList.floor 	= document.querySelector("#display-wrapper .flooring");
	displayList.player	= document.querySelector("#display-wrapper .flooring .player-sprite");

	if(firstRun)
	{
		first_init();
	}
}

function first_init()
{
	var exitFrame;

	floor_init();

	control_init();
	control_port(true);

	floor_center();
	floor_timer(true);

	exitFrame = setTimeout(first_sub_init, 20);

	firstRun = false;
}

function first_sub_init()
{
	displayList.floor.classList.add("tween-change");
}

function control_init()
{
	control 			= {};
	control.x 			= 0;
	control.inc 		= 40;
	control.playerWidth = 80;
	control.floorWidth	= 8000;
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

	
	if(control.direction === "L")
	{
		if(control.x > 0)
		{
			displayList.player.style.transform 	= 'translateX(' + control.x + 'px)';
		}

		else
		{
			// RESET
			control.x = 0;
		}
	}

	else if(control.direction === "R")
	{
		if(control.x < 8000)
		{
			displayList.player.style.transform 	= 'translateX(' + control.x + 'px)';
		}

		else
		{
			// RESET
			control.x = 8000;
		}
	}





	floor_check();
	floor_center();
}

function floor_init()
{
	floor = {};

	floor.focusPoint;
	floor.focusPointCurrent;

	floor.point0 = {"x": [0, 500], "steep": 0};

	floor.point1 = {"x": [900, 1400], "steep": 40};

	floor.point2 = {"x": [1600, 2100], "steep": -30};

	floor.point3 = {"x": [3000, 3500], "steep": 60};

	floor.point4 = {"x": [5000, 5500], "steep": 0};

	floor.maxPoint = 5;
}

function floor_timer(run)
{
	if(run)
	{
		floorTimer = setInterval(floor_center, 1.5 * 1000);
	}

	else
	{
		clearInterval(floorTimer);
	}
}

function floor_check()
{
	for(var i = 0; i < floor.maxPoint; i++)
	{
		var p = floor['point' + i];

		if(control.x >= p.x[0] && control.x < p.x[1])
		{
			floor.focusPoint = i;

			if(floor.focusPointCurrent != floor.focusPoint)
			{
				floor.focusPointCurrent = floor.focusPoint;

				displayList.scene.style.transform = 'rotate(' + floor['point' + floor.focusPointCurrent].steep + 'deg)';

				trace(floor.focusPointCurrent);
			}
		}
	}
}

function floor_center()
{
	var width_across = window.innerWidth;
	var player_pos = control.x;
	var center_x = -Math.round(player_pos) + (width_across * 0.5);

	displayList.floor.style.transform 	= 'translateX(' + center_x + 'px)';
}








