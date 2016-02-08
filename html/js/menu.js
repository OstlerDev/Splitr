var remote = require('remote');
var Menu = remote.require('menu');
var ipc = require('electron').ipcRenderer;

var template = [
  {
    label: 'ElectronSplit',
    submenu: [
      {
        label: 'About ElectronSplit',
        selector: 'orderFrontStandardAboutPanel:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide Electron',
        accelerator: 'Command+H',
        selector: 'hide:'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:'
      },
      {
        label: 'Show All',
        selector: 'unhideAllApplications:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        selector: 'terminate:'
      },
    ]
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'New Splits',
        accelerator: 'Command+N',
        click: function() { ipc.send("new-splits"); }
      },
      {
        label: 'Open',
        accelerator: 'Command+O',
        click: function() { ipc.send("open"); }
      },
      {
        label: 'Import',
        accelerator: 'Command+I',
        click: function() { ipc.send("import"); }
      },
      {
        label: 'Edit',
        accelerator: 'Command+E',
        click: function() { ipc.send("edit"); }
      },
      ,
      {
        label: 'Open Controls',
        accelerator: 'Command+C',
        click: function() { ipc.send("open-controls"); }
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'Command+R',
        click: function() { remote.getCurrentWindow().reload(); }
      },
      {
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click: function() { remote.getCurrentWindow().toggleDevTools(); }
      },
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      },
    ]
  },
  {
    label: 'Window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:'
      },
      {
        label: 'Close',
        accelerator: 'Command+W',
        selector: 'performClose:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      }
    ]
  }
];

menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);