module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "appId": "com.example.app",
        "productName": "Ledvance tapTronic", //项目名，也是生成的安装文件名
        "copyright": "Copyright © 2022", //版权信息
        "directories": {
          "output": "./dist_electron" //输出文件路径
        },
        "extraResources": { // 拷贝dll等静态文件到指定位置
          "from": "./NodeMapping",
          "to": "../NodeMapping"
        },
        "nsis": { //nsis安装器配置
          "oneClick": false, // 是否需要点击安装，自动更新需要关掉
          "allowToChangeInstallationDirectory":true, //是否能够选择安装路径
          "perMachine": true, // 是否需要辅助安装页面
           "createDesktopShortcut": true, // 创建桌面图标
           "createStartMenuShortcut": true,// 创建开始菜单图标
        },
        "win": { //win相关配置
          "icon": "./public/icons.ico", //图标，当前图标在根目录下，注意这里有两个坑
          "target": [{
            "target": "nsis", //利用nsis制作安装程序
            "arch": [
              "x64", //64位
              "ia32" //32位
            ]
          }]
        }
      } 
    }

  }
}