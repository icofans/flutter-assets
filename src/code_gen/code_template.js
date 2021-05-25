const UI = require("../ui/ui.js");

class CodeTemplate {
  constructor(templateName, exts, nodeType, infos,packageName, imports) {
    this.templateName = templateName;
    this.exts = exts;
    this.nodeType = nodeType;
    this.infos = infos;
    this.imports = imports || [];
    this.packageName = packageName;
  }

  gen() {
    const templatePath = `${__dirname}/code_template/${this.templateName}`;
    const fs = require("fs");
    const templateStr = fs.readFileSync(templatePath, { encoding: "utf8" });

    const filteredIdens = this.infos.filter(i => this.exts.includes(i.ext));
    if (filteredIdens.length === 0) {
      return { code: "", valid: false };
    }
    var contentStr = filteredIdens
      .map(i => this._codeForNode(this.nodeType, i,this.packageName))
      .join("\n");

    // 添加包名
    if (this.packageName != '' & this.nodeType == 'asset') {
      contentStr = this._codeForPackage(this.packageName)  + contentStr;
    } 
    const fileContents = templateStr
      .replace("__CODE_TEMPLATE_CONTENTS_REPLACEMENT__", contentStr)
      .replace(
        "__CODE_TEMPLATE_IMPORTS_REPLACEMENT__",
        this.imports.join("\n")
      );
    return { code: fileContents, valid: true };
  }

  _codeForNode(type, identifier,packageName) {
    const Node = require("./node.js");
    return Node.type(type, identifier,packageName).gen();
  }

  _codeForPackage(packageName) {
    return `
  /// Assets for module define
  /// flutter run --dart-define=${packageName}=true
  static const isRunModule =
    bool.fromEnvironment('${packageName}', defaultValue: false);
  
  /// AssetImage with package
  static const String? package = isRunModule ? null : '${packageName}';\n`;
  }
}

module.exports = CodeTemplate;
