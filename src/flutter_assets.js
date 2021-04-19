const Constant = Object.freeze({
    FLUTTER_PUBSPEC: "pubspec.yaml"
  });
  
  class FlutterAssets {
    constructor(root) {
      this.root = root;
    }
  
    stop() {
      this.folderWatcher.stop();
    }
  
    start() {
      /// 当前文件夹设置为 root 位置
      const process = require("process");
      process.chdir(this.root);
      /// 校验是否是 flutter 项目
      this._validateFlutterProject();
      /// 提取配置文件
      const configs = this._extraConfigFileContent();
      const FolderWatcher = require("./folder_watcher/folder_watcher.js");
      this.folderWatcher = new FolderWatcher(configs);
      this.folderWatcher.start();
    }
  
    _validateFlutterProject() {
      const yamlFilePath = `${this.root}/${Constant.FLUTTER_PUBSPEC}`;
      const fs = require("fs");
      if (!fs.existsSync(yamlFilePath)) {
        throw new Error("root path must have an pubspec.yaml file");
      }
    }
  
    _extraConfigFileContent() {
      const yaml = require("js-yaml");
      const fs = require("fs");
  
     
      const doc = yaml.safeLoad(fs.readFileSync(Constant.FLUTTER_PUBSPEC));
      if (!doc.hasOwnProperty("flutter_assets")) {
        throw new Error("not found assets_config in pubspec.yaml file");
      }
  
      const config = doc.flutter_assets;
      const assets = config.assets_path;
      const code = config.output_path || "lib/assets";
  
      if (!assets) {
        throw new Error(
          "assets_config.json file must specify `assets` folder as assets"
        );
      }
      const { trimEnd } = require("lodash/string");
      const { flatten } = require("lodash/array");
      return {
        assets_path: flatten([assets]).map(a => trimEnd(a, "/")),
        output_path: trimEnd(code, "/"),
        pubspec: Constant.FLUTTER_PUBSPEC
      };
    }
  }
  
  module.exports = FlutterAssets;
  