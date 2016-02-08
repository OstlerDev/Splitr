'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow; 
const ipc = electron.ipcMain;

// Define the different windows so we can check if they are null later.
var splits = null;
var menu = null;
var edit = null;
var load = null;
var timerControls = null;
var importSplits = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  splits = new BrowserWindow({width: 300, height: 400});

  splits.loadURL('file://' + __dirname + '/html/splits.html');

  // Open the DevTools.
  //splits.webContents.openDevTools();

  // Emitted when the window is closed.
  splits.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    splits = null;
  });

  ipc.on("load_timer", function(event, timer){
    splits.webContents.send("load_timer", timer);
  })

  ipc.on("new-splits", function(event){
    edit = new BrowserWindow({width: 800, height: 600});

    edit.loadURL('file://' + __dirname + '/html/edit.html');

    // Open the DevTools.
    //edit.webContents.openDevTools();

    // Emitted when the window is closed.
    edit.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      edit = null;
    });
  })

  ipc.on("open", function(event){
    load = new BrowserWindow({width: 800, height: 600});

    load.loadURL('file://' + __dirname + '/html/load.html');

    // Open the DevTools.
    load.webContents.openDevTools();

    // Emitted when the window is closed.
    load.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      load = null;
    });
  })
});