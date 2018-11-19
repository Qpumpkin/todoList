## 这是一个用原生 js 做的 todoList.

介绍：使用的都是最最原始的 DOM 接口，innerHtml 和 getElement\*系列接口都没有使用，每次操作的页面重绘次数也是达到了最少。

### 预览

![预览图片](https://raw.githubusercontent.com/Qpumpkin/todoList/master/%E9%A2%84%E8%A7%88.png)

实现需求:

1. 基本的增删改查业务。
2. 左上角一键所有任务全部完成，并且监控任务完成情况，自动勾选。
3. 显示过滤任务操作。
4. 无输入时操作无效。
5. localStorage 储存任务数据。
6. 一键清除全部任务。
