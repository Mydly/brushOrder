/**
 * Created by Administrator on 2017/4/12.
 */

const path = require('path')
const electron = require('electron')
const {ipcMain} = require('electron');
const {Menu} = require('electron');

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const url = require('url');

const settings = require('electron-settings');

const Common = require('./function/common');
const CONFIG = require('./config/config');
const Consts = require('./config/consts');

const fs = require('fs');


const debug = 1;
const debug2 = /--debug/.test(process.argv[2])

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const menuData = [
    {
        label:"编辑",
        submenu:[
            {
                label:'剪切',
                role:'cut',
                // accelerator:'CmdOrCtrl+X'
            },
            {
                label:'复制',
                role:'copy',
                // accelerator:'CmdOrCtrl+C'
            },
            {
                label:'粘贴',
                role:'paste',
                // accelerator:'CmdOrCtrl+V'
            },
            {
                label:'全选',
                role:'selectall',
                // accelerator:'CmdOrCtrl+A'
            }
        ]
    },
    {
        label:"窗口",
        submenu:[
            {
                label:'打开/关闭开发者工具',
                role:'toggledevtools',
                accelerator:'CmdOrCtrl+D'
            },
            {
                label:'刷新',
                role:'reload'
            }
        ]
    }
];

function createWindow () {


    if (process.platform === 'darwin') {
        menuData.unshift({
          label: app.getName(),
          submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'services', submenu: []},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'}
          ]
        })
    }


        const menu = Menu.buildFromTemplate(menuData)
        Menu.setApplicationMenu(menu)

        let windowSize = {width: 1200, height: 800};
        mainWindow = new BrowserWindow( windowSize );
        
        // and load the index.html of the app.
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        }))

        let thatWindow = mainWindow;
        mainWindow.on('resize', function (data) {
            // console.log(thatWindow.getContentSize());
        });
    
        //mainWindow.loadURL('http://demo.movesay.com')
    
        // Open the DevTools.
        !debug || mainWindow.webContents.openDevTools()

        // Emitted when the window is closed.
        mainWindow.on('closed', function () {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            mainWindow = null
        });


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//用于传递参数
global.params = {
    hello:'world'
};



ipcMain.on('toMainSize', (event, arg) => {

    // let windowSize = {width: 1800, height: 900};
    mainWindow.setSize(1200,800);

})


