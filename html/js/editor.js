function Actions()
{
	Actions.instance = this;
	this.updates = [];
	this.interval_id = 0;
	this.key_down = false;
	this.table_pos = null;
	this.split_scroll_status = 0;
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
	var destination = el.dataset.page;
	el.addEventListener('click', this.load_page.bind(this, destination));
}

// Sets events and triggers on buttons
Actions.prototype.init = function()
{
	$("[data-action]").each(Actions.bind_element_action, this);
	$("[data-page]").each(Actions.bind_element_page, this);
}

// Allows a child object to register for periodic timer updates
Actions.prototype.register_updates = function(object)
{
	if(this.updates.indexOf(object) != -1)
		return false;
	
	this.updates.push(object);

	if(this.updates.length == 1)
		this.interval_id = setInterval(this.update.bind(this), 50);

	return true;
}

Actions.prototype.unregister_updates = function(object)
{
	var index = this.updates.indexOf(object);

	if(index == -1)
		return false;

	this.updates.splice(index, 1);

	if(this.updates.length == 0)
		clearInterval(this.interval_id);

	return true;
}

Actions.prototype.reset_timer_edit_form = function()
{
	//Emptying all global info
	if(typeof window.current_timer != null)
	{
		$("#form-edit-timer-name").val(window.current_timer.timer_name);
		$("#form-edit-game-name").val(window.current_timer.run_name);
	}
	else
	{
		$("#form-edit-timer-name").val("");
		$("#form-edit-game-name").val("");
	}
	
	q("#form-edit-timer-type-manual").checked = false;
	q("#form-edit-timer-type-rta").checked = true;
	
	//Emptying splits
	var split_template = $("#edit-timer-split-template");
	$(".timer-split").remove();
	$("#form-edit-timer-split-list").prepend(split_template);
}

// Registered actions, linked to buttons and everything, so-called "controllers"

Actions.prototype.edit_timer_add_split = function()
{
	var split_template = $("#edit-timer-split-template").clone();
	split_template.removeClass("hidden");
	split_template.removeAttr("id");
	
	$("#form-edit-timer-split-list .timer-split:last-of-type").after(split_template);
	
	$(".timer-split:last-of-type [data-action]").each(Actions.bind_element_action, this);
}

Actions.prototype.edit_timer_remove_split = function(el)
{
	var parent = $(el).parents(".timer-split");
	$(parent[0]).remove();
}

Actions.prototype.edit_timer_move_up = function(el)
{
	var parent = $(el).parents(".timer-split");
	var previous_sibling = parent[0].previousSibling;
	
	if(!$(previous_sibling).is("#edit-timer-split-template"))
		$(previous_sibling).before(parent);
}

Actions.prototype.edit_timer_move_down = function(el)
{
	var parent = $(el).parents(".timer-split");
	var next_sibling = parent[0].nextSibling;
	
	if($(next_sibling).is('.timer-split'))
		$(next_sibling).after(parent);
}

Actions.prototype.edit_timer_submit = function()
{
	var new_timer = null;
	
	if(window.current_timer)
	{
		new_timer = window.current_timer;
		new_timer.splits = []; // Empty splits to avoid duplication
	}
	else
		new_timer = new Timer();
	
	new_timer.timer_name = q("#form-edit-timer-name").value;
	new_timer.run_name = q("#form-edit-game-name").value;
	
	if(q("#form-edit-timer-type-rta").checked == true)
		new_timer.timer_type = Timer.Type.RTA;
	else if(q("#form-edit-timer-type-manual").checked == true)
		new_timer.timer_type = Timer.Type.MANUAL;
	
	var pb_elapsed = null;
	$("#form-edit-timer-split-list .timer-split").each(function(el)
	{
		if(!$(el).is(".hidden"))
		{
			var split_name = el.q(".split-name").value;
			var split_reference = el.q(".split-reference").value;
			var pb = null;
			var pb_duration = null;
			
			//Parsing PB time
			if (split_reference.length > 0)
			{
				pb = string_to_msec(split_reference);
				pb_duration = pb - pb_elapsed;
				pb_elapsed = pb;
			}
				
			//Creating the split
			if(split_name.length > 0)
				new_timer.splits.push({ name: split_name, pb_split: pb, pb_duration: pb_duration, split_best: pb_duration });
		}
	});
	
	if(new_timer.splits.length == 0)
	{
		alert("You have to create at least one split in the timer to be able to save it.");
		return false;
	}
	
	new_timer.save();
	//this.refresh_timer_list();
	//this.reset_timer_edit_form();
	//this.load_timer(new_timer);
	//this.load_page('timer-control');

	alert("Saved successfully, you can now close this window.");
}

Actions.prototype.edit_timer_cancel = function()
{

	var confirmation = confirm("Stop editing ? Unsaved changes will be lost !");
	if(confirmation)
	{
		$("#edit-timer-form input").each(function(el)
		{
			el.value = "";
		});
		
		$("#edit-timer-form .timer-split").each(function(el)
		{
			if(!$(el).is("#edit-timer-split-template"))
			{
				$(el).remove();
			}
		})
		
		this.edit_timer_add_split();
		
		this.load_page("main-menu");
	}
}