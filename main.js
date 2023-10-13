// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron')
const path = require('node:path')

function handleSetTitle (event, title) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
}

async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}

function handleOpenDialog () {
  // dialog.showOpenDialog({
  //   defaultPath: app.getPath("downloads"),
  //   buttonLabel: 'Select'
  // }).then(res => console.log(res));

  dialog.showSaveDialog({
    defaultPath: app.getPath("downloads"),
  }).then(res => console.log(res));

  // dialog.showMessageBox({
  //   message: 'This is a message box',
  //   type: 'info',
  //   buttons: ['gotcha'],
  // })

  // dialog.showErrorBox('Error', 'This is an error message')
}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    title: "Demo",
    // frame: false,
    // titleBarStyle: "customButtonsOnHover",
    // roundedCorners: false,
    titleBarOverlay: {
      color: '#FF0000',
      height: 300
    },
    // backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow.webContents.send('update-counter', 1),
          label: 'Increment'
        },
        {
          click: () => mainWindow.webContents.send('update-counter', -1),
          label: 'Decrement'
        }
      ]
    },
    {
      label: 'Test',
      submenu: [
        {
          click: () => mainWindow.webContents.send('update-counter', 1),
          label: 'Increment'
        },
        {
          click: () => mainWindow.webContents.send('update-counter', -1),
          label: 'Decrement'
        }
      ]
    },
  ])
  Menu.setApplicationMenu(menu)

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // load a remote URL
  // mainWindow.loadURL('https://chat.openai.com/')

  const childWindow1 = new BrowserWindow({
    width: 800,
    height: 600,
    parent: mainWindow,
    // modal: true,
    show: false
  })

  const mainWc = mainWindow.webContents
  mainWc.on("dom-ready", () => {
    // childWindow1.loadURL('https://github.com')
    // childWindow1.once('ready-to-show', () => {
    //   childWindow1.show()
    // })
  }) 

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.on('set-title', handleSetTitle)
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.on('openDialog', handleOpenDialog)

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
