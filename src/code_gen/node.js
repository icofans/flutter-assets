class Node {
  constructor(infos,packageName) {
    this.identifier = infos.identifier;
    this.ext = infos.ext;
    this.varients = infos.varients;
    this.tag = infos.tag;
  }

  gen() {
    return "";
  }

  static type(type, infos,packageName) {
    switch (type) {
      case "asset":
        return new AssetNode(infos,packageName);
      case "image":
        return new ImageNode(infos,packageName);
    }
  }
}

/// Asset 名称节点
class AssetNode extends Node {
  gen() {
    return `
  /// Assets for ${this.identifier}
  /// ${this.varients.join(", ")}
  static const String ${this.identifier} = "${this.tag}";`;
  }
}

/// 图片资源节点
class ImageNode extends Node {
  gen() {
    const packageInfo = this.packageName == '' ? '' :', package: Assets.package';
    return `
  /// Assets for ${this.identifier}
  /// ${this.varients.join(", ")}
  static AssetImage get ${this.identifier} => const AssetImage(Assets.${
      this.identifier
    }${packageInfo});`;
  }
}

module.exports = Node;
