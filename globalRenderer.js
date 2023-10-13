window.addEventListener('contextmenu', (e) => {
  window.electronAPI.showContextMenu()
})

window.electronAPI.getContextMenuCommand((event, command) => {
  console.log(event, command)
})