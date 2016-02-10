var ipc = require('electron').ipcRenderer;

function Actions()
{
	Actions.instance = this;
}

// Singleton implementation
Actions.instance = null;
Actions.get_manager = function()
{
	return Actions.instance;
}

// Binders
Actions.bind_element_action = function(el)
{
	var callback = el.dataset.action;
	if(this[callback])
		el.addEventListener('click', this[callback].bind(this, el));
}

Actions.bind_element_page = function(el)
{
	console.log(el);
	var destination = el.dataset.page;
	console.log(destination);
	el.addEventListener('click', this.load_page.bind(this, destination));
}

// Sets events and triggers on buttons
Actions.prototype.init = function()
{	
	$("[data-action]").each(Actions.bind_element_action, this);
	$("[data-page]").each(Actions.bind_element_page, this);

	//Initializing timer list if it isn't already done
	if(typeof localStorage.timer_names == "undefined" || typeof JSON.parse(localStorage.timer_names).pop == "undefined")
		localStorage.timer_names = "[]";
	
	this.refresh_timer_list();
}

Actions.prototype.load_timer_submit = function()
{
	var select = q("#form-load-timer-timer-name");
	var selected_timer = select.options[select.selectedIndex].value;
	
	if(typeof localStorage != "undefined")
	{
		var timer_names = JSON.parse(localStorage.timer_names);
		
		if(timer_names.indexOf(selected_timer) != -1)
		{
			ipc.send("load_timer", selected_timer);
		}
	}
}

Actions.prototype.delete_timer = function()
{
	var select = q("#form-load-timer-timer-name");
	var selected_timer = select.options[select.selectedIndex].value;
	
	var confirm = confirm("Are you sure you want to delete this timer?");
	
	if(confirm && typeof localStorage != "undefined")
	{
		var timer_names = JSON.parse(localStorage.timer_names);
		
		if(timer_names.indexOf(selected_timer) != -1)
		{
			var timer = Timer.load(selected_timer);
			timer.delete();
			this.refresh_timer_list();
			alert("Deleted successfully.");
		}
	}
	
	return false;
}

Actions.prototype.refresh_timer_list = function()
{
	if(typeof localStorage != "undefined")
	{
		$("#form-load-timer-timer-name option").remove();
		
		var new_line = document.createElement("option");
		new_line.value = "";
		new_line.innerHTML = "---";
		
		q("#form-load-timer-timer-name").appendChild(new_line);
		
		var names = JSON.parse(localStorage.timer_names);
		for(var k in names)
		{
			var option = $(new_line).clone();
			option[0].value = names[k];
			option.text(names[k]);
			
			$("#form-load-timer-timer-name").append(option);	
		}
	}
}