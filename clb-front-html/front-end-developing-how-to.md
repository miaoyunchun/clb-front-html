# CLB-Front前端部分开发介绍

## 目录结构

+ **js** 存放JavaScript文件，其中
    - **controllers** 存放controller相关文件，其下层目录根据模块分类，如：**js/controllers/sm/\*.js**
    - **directives** 存放自定义标签相关文件，其下层目录根据模块分类，范例参考controller部分
    - **filters** 存放自定义过滤器，其下层目录根据模块分类，范例参考controller部分
    - **services** 存放自定义服务，其下层目录根据模块分类，范例参考controller部分
    - **config.router.js** 定义页面的路由规则及其依赖
+ **l10n** 存放国际化相关文件，其文件名目前暂定以语言分类，如zh_CN，各模块的国际化内容统一放于对应语言的文件中
+ **tpl** 存放页面相关文件，其内容根据模块分类，公共页面根据其功能分类。如**tpl/sm/\*.html**为SM模块相关页面；**tpl/error_pages/\*.html**为公共页面，不属于任何一模块，其功能为错误页面。

## 命名规范

### 通用
+ 变量：
    - 变量名必须能清楚的表明其含义，应避免类似**map1**、**a**、**date2**等无意义名称
    - 集合类型变量应采用复数形式，如**people**、**organizations**
    - for循环中可以使用**i**、**j**、**k**等变量名，因其所在位置已表明该变量是一个迭代器
    - foreach循环中迭代器命名采用被遍历对象名称的单数形式，如**person**对应**people**，**organization**对应**organizations**，不建议使用**i**、**j**等作为变量名

+ 方法：
    - 方法名必须能清楚的表明其含义及行为
    - 方法应有JSDoc文档注释
    - 作为workaround应有详细的注释，说明问题的现象，以及处理的方法

### HTML
+ 文件名：应表明该页面负责的功能，如英文全称过长，可使用缩写；页面中的子元素需表明该元素的功能及类型；单词之间使用下划线分割。示例如下：
    - **org_mgmt.html** 代表Organization Management，即机构管理。
    - **add_org_modal_form.html** 代表Add organization modal form，即功能为新增机构，类型是一个Modal弹窗。

### Controller
+ 文件名：与对应HTML文件名对应，以**ctrl**作为后缀表明这是一个Controller。示例如下：
    - **org_mgt_ctrl.js** 对应 **org_mgt.html**
+ Controller名：
    - 页面主controller与页面名对应，以大驼峰式命名。如OrgMgmtCtrl为org_mgmt_ctrl.html的主controller。
    - 页面子元素对应的子controller可以其功能、元素类型、元素ID等命名，保证表意清楚即可，以大驼峰式命名。如：
        * **AccordionCtrl**代表这是一个Accordion的controller
        * **AvailDateCtrl**代表这个controller对应的是页面中“起始日期”元素

### Service
+ 文件名：文件名与service名保持一致
+ Service名：应能表明该service的功能
+ 方法：除getter、setter类型之外的方法，应有JSDoc文档注释

## 开发相关文件及步骤
1. 编写HTML、JS等页面相关文件
2. 在**config.router.js**中添加路由条目
3. 在**tpl/blocks/nav.html**中添加菜单条目
4. 如涉及到的文件被Struts2当作Action名，则需要在**struts.xml**的**struts.action.excludePattern**条目中追加排除项