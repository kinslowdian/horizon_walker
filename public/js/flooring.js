// DEBUG
var trace = function(str){ console.log(str); };
// DEBUG

var displayList;
var floor;
var gate;
var control;
var system;
var game;

var floorTimer;

var firstRun;

var tt;

function page_init()
{
	trace("page_init();");

	firstRun = true;

	system = {};

	game = {};

	display_init();
}

function display_init()
{
	displayList = {};

	displayList.scene 			= document.querySelector("#display-wrapper .display-main");
	displayList.floor 			= document.querySelector("#display-wrapper .flooring");
	displayList.floor_extra_r 	= document.querySelector("#display-wrapper .flooring-extra-r");
	displayList.floor_trees_r 	= document.querySelector("#display-wrapper .trees-r");
	displayList.player			= document.querySelector("#display-wrapper .flooring .player-sprite");
	displayList.gateLayer		= document.querySelector("#display-wrapper .gate-layer");
	displayList.curtain			= document.querySelector("#display-wrapper .curtain");

	if(firstRun)
	{
		data_init();
	}
}

function data_init()
{
	load_data_json(data_loaded);
}

function data_loaded(data)
{
	system.data = JSON.parse(data);

	trace(system);

	first_init();
}

function first_init()
{
	var exitFrame;

	game.level_cleanHTML 	= displayList.scene.innerHTML;
	game.level 				= 0;
	game.level_width 		= system.data._LEVELS['_LEVEL_' + game.level].general.width;
	game.gateAccess			= null;

	floor_init();
	gate_init();
	
	control_init();
	control_port(true);

	floor_center();
	floor_timer(true);

	system.loop_functs = new Array();
	system.loop_functs.push(control_loop);

	exitFrame = setTimeout(first_sub_init, 20);

	firstRun = false;
}

function first_sub_init()
{
	displayList.floor.classList.add("tween-change");

	system_loop_init(true);
}

function system_loop_init(run)
{
	if(run)
	{
		system.cycleUpdate = true;
		window.requestAnimationFrame(system_loop_event);
	}

	else
	{
		system.cycleUpdate = false;
		window.cancelAnimationFrame(system_loop_event)	
	}
}

function system_loop_event()
{
	for(var i in system.loop_functs)
	{
		system.loop_functs[i]();
	}

	if(system.cycleUpdate)
	{
		window.requestAnimationFrame(system_loop_event);
	}
}

function control_init()
{
	control 			= {};
	control.x 			= gate.gates[game.gateAccess.exit].x + 40 || 0; // 0
	control.inc 		= system.data._MAIN.move_inc; // 10
	control.playerWidth = system.data._MAIN.move_width; // 80
	control.floorWidth	= game.level_width;
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

		case 38: case 40:
		{
			dir = "S";

			gate_check();

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
}

function control_loop()
{

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
		if(control.x < (game.level_width - control.playerWidth))
		{
			displayList.player.style.transform 	= 'translateX(' + control.x + 'px)';
		}

		else
		{
			// RESET
			control.x = (game.level_width - control.playerWidth);
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
	
	// JSON
	floor.points = new Array();
	floor.points = system.data._LEVELS['_LEVEL_' + game.level].points;

	// CSS

	displayList.floor.style.width 			= game.level_width + "px";
	displayList.floor_extra_r.style.left 	= game.level_width + "px";
	displayList.floor_trees_r.style.left 	= game.level_width + "px";
}

function floor_timer(run)
{
	if(run)
	{
		floorTimer = setInterval(floor_center, system.data._MAIN.floor_timer_val * 1000);
	}

	else
	{
		clearInterval(floorTimer);
	}
}

function floor_check()
{
	for(var i = 0; i < floor.points.length; i++)
	{
		var p = floor.points[i];

		if(control.x >= p.x[0] && control.x < p.x[1])
		{
			floor.focusPoint = i;

			if(floor.focusPointCurrent != floor.focusPoint)
			{
				floor.focusPointCurrent = floor.focusPoint;

				displayList.scene.style.transform = 'rotate(' + floor.points[floor.focusPointCurrent].steep + 'deg)';

				trace(floor.focusPointCurrent);
			}
		}
	}
}

function floor_force_flatness()
{
	displayList.scene.style.transform = 'rotate(0deg)';
}

function floor_center()
{
	var width_across = window.innerWidth;
	var player_pos = control.x;
	var center_x = -Math.round(player_pos) + (width_across * 0.5);

	displayList.floor.style.transform 	= 'translateX(' + center_x + 'px)';
}

function gate_init()
{
	var gateDynamicHTML = "";

	gate 			= {};
	gate.area 		= 160;
	
	// JSON
	gate.gates 		= new Array();
	gate.gates 		= system.data._LEVELS['_LEVEL_' + game.level].gates;

	// HTML
	for(var i = 0; i < gate.gates.length; i++)
	{
		gateDynamicHTML += '<div class="gate gate' + i + '"></div>';
	}

	displayList.gateLayer.innerHTML = gateDynamicHTML;
	
	// CSS
	for(var j = 0; j < gate.gates.length; j++)
	{
		var g = displayList.gateLayer.querySelector('.gate' + j);

		g.style.transform = 'translateX(' + gate.gates[j].x + 'px)';
	}

}

function gate_check()
{
	for(var i = 0; i < gate.gates.length; i++)
	{
		var g = gate.gates[i];

		if(control.x >= g.x && control.x < (g.x + gate.area))
		{
			if(game.gateAccess == null || game.gateAccess == undefined)
			{
				game.gateAccess = g;
			}
		}

	}

	if(game.gateAccess)
	{
		control_port(false);
		floor_timer(false);

		gate_levelChange();
	}
}

function gate_levelChange()
{
	displayList.curtain.addEventListener("transitionend", gate_levelChange_event, false);
	displayList.curtain.classList.remove("curtain-hide");
}

function gate_levelChange_event(event)
{
	var exitFrame;
	
	displayList.curtain.removeEventListener("transitionend", gate_levelChange_event, false);

	// WIPE CLEAN
	displayList.scene.innerHTML = game.level_cleanHTML;

	// UPDATE LEVEL
	game.level = game.gateAccess.next;

	game.level_width = system.data._LEVELS['_LEVEL_' + game.level].general.width;

	exitFrame = setTimeout(gate_levelNewBuild, 0.5 * 1000);
}

function gate_levelNewBuild()
{
	var delay;

	display_init();
	floor_init();
	gate_init();

	delay = setTimeout(gate_levelNewReveal, 0.5 * 1000);
}

function gate_levelNewReveal()
{
	floor_force_flatness();	
	displayList.floor.classList.add("tween-change");

	displayList.curtain.classList.add("curtain-hide");

	control_init();
	control_port(true);
	floor_timer(true);


	game.gateAccess = null;
}








