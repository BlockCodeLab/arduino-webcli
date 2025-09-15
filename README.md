# arduino-webcli

在线 **arduino-cli** 编译 `.ino` 文件。

## 调试

```bash
$ bun install
$ bun run dev
```

服务器启动后，打开浏览器访问：[http://localhost:18125/compile/gui](http://localhost:18125/compile/gui)

## 安装 arduino-cli

执行 `bun install` 时 arduino-cli 将被自动安装在 `arduino` 文件夹中，所有主核和库也将被安装在此。如果需要修改主核和库的安装位置，请修改 `arduino` 文件夹中的 `arduino-cli.yaml` 配置文件。

如果没有自动安装请执行下面安装指令：

```bash
$ bun run preinstall
```
