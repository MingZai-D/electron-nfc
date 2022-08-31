// import { app } from 'electron'

// 读取信息
export const ReadInfo = (test) => {
  // let appPath = app.getPath('exe')
  const path = window.require('path')
  let exePath = path.resolve('ISOHostSample.exe')
  console.log(path, exePath, 'path')
  const {
    exec
  } = require('child_process')
  const ls = exec(`"ISOHostSample.exe" ${test}`, {
    cwd: "D:\\project\\需求\\NFCHost",
    encoding: 'buffer'
  })
  // 状态码
  ls.on('close', (code) => {
    console.log(code)
  })
  // 标准返回值
  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  //标准错误输出
  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  //失败
  ls.on('error', (error) => {
    console.log(`error: ${error}`)
  })
}
// 21 000186A0

export const outputStatus = (code) => {
  switch (code) {
    case 0:
      return '处理成功'
    case 1:
      return '处理失败'
    default:
      return '失败'
  }
}

// 16进制转10进制
export const hex2int = function (hex) {
  // console.log(hex,'hex')
  var len = hex.length,
    a = new Array(len),
    code;
  for (var i = 0; i < len; i++) {
    code = hex.charCodeAt(i);
    if (48 <= code && code < 58) {
      code -= 48;
    } else {
      code = (code & 0xdf) - 65 + 10;
    }
    a[i] = code;
  }

  return a.reduce(function (acc, c) {
    acc = 16 * acc + c;
    return acc;
  }, 0);
}

// 10进制转16进制

export const int2hex = function (num, width) {
  if(num < 0) return
  var hex = "0123456789ABCDEF";
  var s = "";
  while (num) {
    s = hex.charAt(num % 16) + s;
    num = Math.floor(num / 16);
  }
  // if (typeof width === "undefined" || width <= s.length) {
  // return "0" + s;
  // }
  var delta = width - s.length;
  var padding = "";
  while (delta-- > 0) {
    padding += "0";
  }
  return padding + s;
}