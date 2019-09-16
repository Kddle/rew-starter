const { electron, app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const fs = require('fs');

const { LOAD_LOCAL_FILE, LOCAL_FILE_TEXT } = require('../src/constants');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ width: 900, height: 680, webPreferences: { nodeIntegration: true } });
    mainWindow.loadURL(
        isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'dist/index.html')}`
    );

    mainWindow.on('closed', () => mainWindow = null);
}

function loadFile() {
    fs.readFile('localfile.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        let jsondata = JSON.parse(data);
        let filedata = jsondata['key'];
        mainWindow.webContents.send(LOCAL_FILE_TEXT, filedata);
    });
}

ipcMain.on(LOAD_LOCAL_FILE, () => {
    loadFile();
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
})
