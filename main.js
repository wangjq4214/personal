const {app, BrowserWindow, ipcMain} = require('electron');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win;

function createWindow() {
  // 创建浏览器窗口。
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // 加载index.html文件
  // win.loadFile('index.html');
  win.loadURL('http://localhost:3000');

  // 打开开发者工具
  win.webContents.openDevTools();

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null;
  });
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow();
  }
});

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。

ipcMain.on('saveFile', (event, arg) => {
  let temp = '';
  arg.rows.forEach((item, index) => {
    temp = `${temp}${index + 1}、${item}\n\n`
  });

  let type = null;
  if (arg.type === 1) {
    type = '小学';
  } else if (arg.type === 2) {
    type = '初中';
  } else {
    type = '高中';
  }

  fs.writeFile(
    path.join(__dirname, 'questionBank', arg.name, type, `${dayjs().format('YYYY-M-D-H-m-s')}.txt`),
    temp,
    function (err) {
      if (err) {
        console.error(err);
        // event.reply('asynchronous-reply', 'pong')
      }
    }
  );
});

ipcMain.on('check', (event, args) => {
  const temp = [];
  let type = null;
  if (args.type === 1) {
    type = '小学';
  } else if (args.type === 2) {
    type = '初中';
  } else {
    type = '高中';
  }
  const files = fs.readdirSync(path.join(__dirname, 'questionBank', args.name, type));

  files.forEach((item) => {
    const file = fs.readFileSync(path.join(__dirname, 'questionBank', args.name, type, item)).toString().split('\n\n');
    file.forEach((item) => {
      if (item !== '') {
        temp.push(item.split('、')[1])
      }
    })
  });

  event.reply('check-reply', temp)
});
