# 一、概述

此项目是更加若依 vue3 项目修改而来：https://github.com/yangzongzhuan/RuoYi-Vue3.git

# 二、增加 eslint 校验

安装：

> npm i eslint eslint-plugin-vue vite-plugin-eslint eslint-config-prettier prettier @vue/eslint-config-prettier--save-dev

包管理文件增加 eslint 脚本启动命令：

> "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore"

在项目根目录添加 eslint 配置文件 .eslintrc.cjs
