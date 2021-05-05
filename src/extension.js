const vscode = require('vscode');
const util = require('./util/util');

/**
 * 插件被激活时触发，所有代码总入口
 * @param {*} context 插件上下文
 */
exports.activate = function(context) {
    console.log('恭喜，您的扩展“flutter_assets”已被激活！');
    console.log(vscode);

    var folders = vscode.workspace.workspaceFolders;
    const rootPath = folders[0].uri.path;

    console.log(rootPath);
    
    require("./ui/ui.js").isVerbose = true;
    const { trimEnd } = require("lodash/string");
    const FlutterAssets = require("./flutter_assets.js");
    new FlutterAssets(trimEnd(rootPath, "/")).start();
};

/**
 * 插件被释放时触发
 */
exports.deactivate = function() {
    console.log('您的扩展“flutter_assets”已被释放！')
};