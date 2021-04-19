const UI = require("../ui/ui.js");

class PubspecGen {
  constructor(pubspecPath, infos) {
    this.pubspecPath = pubspecPath;
    this.infos = infos;
  }

  gen() {
    const yaml = require("js-yaml");
    const fs = require("fs");
    try {
      const doc = yaml.safeLoad(fs.readFileSync(this.pubspecPath));
      
      const assets = this.infos.map( (i) => {
        return i.tag.substring(0, i.tag.lastIndexOf("/")) + "/";
      });

      // 使用js-yaml会导致注释丢失, 故用以下方法暂时替代

      // 去重
      let datas = new Set(assets);

      // const oringinDatas = doc.flutter.assets;
      // const targetDatas = Array.from(datas);

     

      // // 判断是否有变更
      // if ((oringinDatas == null || oringinDatas.length > 0) && (targetDatas == null || targetDatas.length >0)) {
      //   if (oringinDatas != null && targetDatas != null && targetDatas.sort().toString() == oringinDatas.sort().toString()) {
      //     return;
      //   } else {
      //     console.log("有变化");
      //   }
      // } else {
      //   return;
      // }


      const readline = require('readline');

      var fRead = fs.createReadStream(this.pubspecPath);
      var objReadline = readline.createInterface({
          input:fRead
      });
      var arr = new Array();
      objReadline.on('line',function (line) {
          arr.push(line);
          // console.log('line:'+ line);
      });
      objReadline.on('close',function () {
        //  console.log(arr);
          // callback(arr);

          // console.log(arr);
          var line;
          for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            if (element.indexOf(" assets:") != -1) {
              line = index;
              break;
            }
          }
          if (line == undefined) {
            return;
          }

          // 移除旧的
          // console.log(line);
          var hasNext = true;
          while(hasNext) {
            const element = arr[line+1];
            if (element != undefined && element.indexOf("- ") != -1) {
              arr.splice(line+1,1);
            } else {
              hasNext = false;
            }
          }
          
          // 添加新的
          const element = arr[line];
          const indent = element != undefined ? element.replace("assets:","") : "  ";
          
          const items = Array.from(datas);
          for (let index = 0; index < items.length; index++) {
            const element = items[index];
            const item = indent.repeat(2) + "- " + element;
            arr.splice(line + index + 1, 0, item);
          }

          console.log(datas);

         // 重新写入文件
         fs.writeFile('pubspec.yaml',arr.join("\n"),(err)=> {
           if (err == null) {
            UI.verbose(`assets declaration: ${JSON.stringify(items)}`, 2);
           } else {
            UI.error(`gen pubspec code error: ${err}`);
           }
         });
      });

    } catch (error) {
      UI.error(`gen pubspec code error: ${error}`);
    }
  }
}

module.exports = PubspecGen;
