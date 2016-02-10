/*
Preferences json object
Stored in localstorage.prefs
{
	promptGold: true,
	promptPB: true,
	autoGold: false,
	autoPB: false
}
*/
function Preferences(){
	if (typeof localStorage.prefs == "undefined")
		this.setDefaults();

	this.prefs = this.loadPrefs();
}

Preferences.prototype.togglePref = function(id){
	console.log("Toggling Pref: " + id);
	if (this.prefs[id])
		this.updatePref(id, false);
	else
		this.updatePref(id, true);
}

Preferences.prototype.updatePref = function(id, newValue){
	this.prefs[id] = newValue;
	this.save();
}

Preferences.prototype.loadPrefs = function(){
	return JSON.parse(localStorage.getItem('prefs'));
}

Preferences.prototype.save = function(){
	localStorage.setItem('prefs', JSON.stringify(this.prefs));
}

// This method resets the preferences to the default then saves.
Preferences.prototype.setDefaults = function(){
	this.prefs = {
		promptGold: true,
		promptPB: true,
		autoGold: false,
		autoPB: false
	};
	this.save();
}

Preferences.prototype.getPrefs = function(){
	return this.prefs;
}