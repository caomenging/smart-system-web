smart-system-web
====

#### 协作文档

本仓库目前有2个分支，master和dev。主要在dev分支上进行开发和测试，功能完善之后再合并到master。

```
├─master
└─dev
```

#### 1.1、准备工作

* 前端仓库： https://github.com/SikeX/smart-system-web
* 后端仓库： https://github.com/SikeX/smart-system-server

在github上fork（前端，后端）仓库到你自己的github，将你fork之后的远程仓库克隆到本地，并在你的本地仓库上添加上游仓库，即源仓库。fork一般是fork了仓库的master分支，所以可能还需要自己去切出dev分支然后拉取源仓库dev分支上的内容。

```
# 前端
git clone https://github.com/{你的github}/smart-system-web
# 后端
git clone https://github.com/{你的github}/smart-system-server

# 上游的源仓库地址只需添加一次，在你的本地前端项目
git remote add upstream https://github.com/SikeX/smart-system-web.git
# 然后添加你自己的远程仓库（如果你是clone的话，就已经自动添加的，如果你是下载的zip则需要手动添加）
git remote add origin https://github.com/{你的github}/smart-system-web.git
# 上游的源仓库地址只需添加一次，在你的本地后端项目
git remote add upstream https://github.com/SikeX/smart-system-server.git
# 然后添加你自己的远程仓库（如果你是clone的话，就已经自动添加的，如果你是下载的zip则需要手动添加）
git remote add origin https://github.com/{你的github}/smart-system-server.git

# 切出dev分支并拉取源仓库dev分支上的内容
git checkout -b dev
git pull upstream dev
```

#### 1.2.1、协作方式-1

要开发某个模块的时候，在你的本地仓库创建一个分支，例如mydev。

```
git checkout -b mydev
```

切换之后你的本地仓库上就有3个分支了，如下所示。checkout之后会自动切换到mydev分支。

```
├─master
├─dev
└─mydev
```

在mydev分支上进行开发和测试，完成相应的功能或者模块，完成之后再切回到dev分支将mydev的内容合并到dev。

```
# mydev分支上提交你的更新
git add *
git commit -m "add something"
# 切换到dev分支
git checkout dev
```

由于在你开发过程中，我也可能在开发并且更新了仓库，为了避免冲突，在合并分支之前你还需要更新你本地仓库的dev分支。先在本地仓库上添加上游仓库upstream，上游仓库即我的仓库，然后使用pull命令从上游仓库拉取更新。

```
# 拉取上游的源仓库dev分支上的更新
git pull upstream dev
```

更新完dev之后，将mydev分支合并到dev分支并提交到你自己的远程仓库。完成之后，mydev分支就可以删除了，你也可以继续留着。

```
# 将mydev分支合并到dev，可能会有冲突需要自行解决
git merge mydev
# 推送到你自己的远程仓库，注意这里是push到origin dev，不是upstream dev
git push origin dev
# 删除mydev分支
git branch -d mydev
```

推送到自己的远程仓库后，就可以到github上面给我发Pull Request了，然后等待我合并你的代码。

#### 1.2.2、协作方式-2

嫌上面太麻烦？你也可以直接在fork之后的的dev分支上面进行开发，然后在发送PR之前先从源仓库拉取更新。

```
# 提交你的代码
git add *
git commit -m "add something"
# 拉取上游的源仓库dev分支上的更新，可能会有冲突需要自行解决
git pull upstream dev
# 推送到你自己的远程仓库，注意这里是push到origin dev，不是upstream dev
git push origin dev
```

#### 1.3、备注

所有拉取远程仓库的更新的操作请在本地仓库上使用命令行完成。

开发之前和合并分支之前从上游仓库dev分支pull一下

```
# 拉取上游的源仓库dev分支上的更新
git pull upstream dev
```

严禁通过其他做法拉取更新（例如在GitHub网站上通过网页操作进行更新然后在本地pull origin dev），以免造成不必要的合并冲突以及多余的commit。

当前最新版本： 3.0.0（发布日期：2021-11-01）

Overview
----

基于 [Ant Design of Vue](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/) 实现的 Ant Design Pro  Vue 版
Jeecg-boot 的前端UI框架，采用前后端分离方案，提供强大代码生成器的低代码平台。
前端页面代码和后端功能代码一键生成，不需要写任何代码，保持jeecg一贯的强大！！



#### 前端技术
 
- 基础框架：[ant-design-vue](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue 实现
- JavaScript框架：Vue
- Webpack
- node
- yarn
- eslint
- @vue/cli 3.2.1
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - 头像裁剪组件
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - Alipay AntV 数据可视化图表
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation)  - antv/g2 封装实现



项目下载和运行
----

- 拉取项目代码
```bash
git clone https://github.com/zhangdaiscott/jeecg-boot.git
cd  jeecg-boot/ant-design-vue-jeecg
```

- 安装依赖
```
yarn install
```

- 开发模式运行
```
yarn run serve
```

- 编译项目
```
yarn run build
```

- Lints and fixes files
```
yarn run lint
```



其他说明
----

- 项目使用的 [vue-cli3](https://cli.vuejs.org/guide/), 请更新您的 cli

- 关闭 Eslint (不推荐) 移除 `package.json` 中 `eslintConfig` 整个节点代码

- 修改 Ant Design 配色，在文件 `vue.config.js` 中，其他 less 变量覆盖参考 [ant design](https://ant.design/docs/react/customize-theme-cn) 官方说明
```ecmascript 6
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      }
    }
  }
```



附属文档
----
- [Ant Design Vue](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn)

- [报表 viser-vue](https://viserjs.github.io/demo.html#/viser/bar/basic-bar)

- [Vue](https://cn.vuejs.org/v2/guide)

- [路由/菜单说明](https://github.com/zhangdaiscott/jeecg-boot/tree/master/ant-design-vue-jeecg/src/router/README.md)

- [ANTD 默认配置项](https://github.com/zhangdaiscott/jeecg-boot/tree/master/ant-design-vue-jeecg/src/defaultSettings.js)

- 其他待补充...


备注
----

> @vue/cli 升级后，eslint 规则更新了。由于影响到全部 .vue 文件，需要逐个验证。既暂时关闭部分原本不验证的规则，后期维护时，在逐步修正这些 rules


Docker 镜像使用
----

 ``` 
# 1.修改前端项目的后台域名
    .env.development
    域名改成： http://jeecg-boot-system:8080/jeecg-boot
   
# 2.先进入打包前端项目
  yarn run build

# 3.构建镜像
  docker build -t nginx:jeecgboot .

# 4.启动镜像
  docker run --name jeecg-boot-nginx -p 80:80 -d nginx:jeecgboot

# 5.配置host

    # jeecgboot
    127.0.0.1   jeecg-boot-redis
    127.0.0.1   jeecg-boot-mysql
    127.0.0.1   jeecg-boot-system
  
# 6.访问前台项目
  http://localhost:80
``` 