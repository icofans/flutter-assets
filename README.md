## 说明

基于auto_assets插件修改,修改了配置方式, pubspec自动添加声明等...

1、在项目pubspec.yaml下添加：

```json
flutter_assets:
  assets_path: assets/images/
  output_path: lib/common/assets/
```

- `assets_path` 代表项目中资源文件的目录，有多个的时候可以传入数组。
- `output_path` 代表自动生成的代码的根目录。

2、在 VSCode -> Extensions 下搜索 `flutter_assets` 并安装, 重新打开项目

3、如资源目录如下:

```
|-- assets
    |-- images
    |   |-- tab
    |   |   |-- 2x
    |   |   |   |-- home.png
    |   |   |-- 3x
    |   |   |   |-- home.png
    |   |   |-- home.png
    |   |-- login
    |   |   |-- 2x
    |   |   |   |-- logo.png
    |   |   |-- 3x
    |   |   |   |-- logo.png
    |   |   |-- logo.png
```

生成dart文件如下:

lib/common/assets/assets.dart

```dart
class Assets {
  Assets._();
  
  /// Assets for loginLogo
  /// login/2x/logo, login/3x/logo, login/logo
  static const String loginLogo = "assets/images/login/logo.png";

  /// Assets for tabHome
  /// tab/2x/home, tab/3x/home, tab/home
  static const String tabHome = "assets/images/tab/home.png";
}
```
lib/common/assets/assets_images.dart

```dart
import 'package:flutter/widgets.dart';
import 'assets.dart';

class AssetImages {
  AssetImages._();
  
  /// Assets for loginLogo
  /// login/2x/logo, login/3x/logo, login/logo
  static AssetImage get loginLogo => const AssetImage(Assets.loginLogo);

  /// Assets for tabHome
  /// tab/2x/home, tab/3x/home, tab/home
  static AssetImage get tabHome => const AssetImage(Assets.tabHome);
}
```
lib/common/assets/flutter_assets.dart
```dart
export 'assets.dart';
export 'assets_images.dart';
```

pubspec.yaml
```
...
  assets:
    - assets/images/login/
    - assets/images/tab/
...
```