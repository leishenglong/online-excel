# Online Excel - 基于 Univer 的在线表格工具

一个简洁的在线电子表格应用，基于 Univer Sheet 引擎构建，支持本地 JSON 文件存储。

## 功能特性

- 创建、打开、编辑、保存和删除 Excel 工作簿
- 多工作表支持
- 单元格编辑（双击编辑，Enter 提交）
- 网格线显示
- 数据持久化到本地 JSON 文件
- RESTful API 接口

## 技术栈

- **前端框架**: React 18 + Vite
- **表格引擎**: Univer Sheet v0.22
- **后端**: Express.js
- **数据存储**: 本地 JSON 文件

## 项目结构

```
online-excel/
├── server/
│   ├── index.js          # Express 服务入口，REST API
│   └── storage.js        # JSON 文件存储模块
├── src/
│   ├── main.jsx          # React 应用入口
│   └── App.jsx           # 主组件（Univer 表格集成）
├── data/
│   └── workbooks.json    # 工作簿数据存储
├── index.html             # HTML 入口
├── vite.config.js         # Vite 配置（含 API 代理）
└── package.json
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

这将同时启动：
- 前端开发服务器: http://localhost:5173
- 后端 API 服务器: http://localhost:3001

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## API 接口

| 方法   | 路径                    | 描述         |
|--------|------------------------|--------------|
| GET    | `/api/workbooks`        | 获取所有工作簿 |
| GET    | `/api/workbooks/:id`    | 获取单个工作簿 |
| POST   | `/api/workbooks`        | 创建新工作簿   |
| PUT    | `/api/workbooks/:id`    | 更新工作簿     |
| DELETE | `/api/workbooks/:id`    | 删除工作簿     |

### 创建工作簿

```bash
curl -X POST http://localhost:3001/api/workbooks \
  -H "Content-Type: application/json" \
  -d '{"name": "我的表格"}'
```

### 更新工作簿

```bash
curl -X PUT http://localhost:3001/api/workbooks/{id} \
  -H "Content-Type: application/json" \
  -d '{"name": "新名称", "sheetIds": [...], "sheetData": {...}}'
```

## 数据格式

工作簿数据结构：

```json
{
  "id": "uuid",
  "name": "工作簿名称",
  "sheetIds": ["sheet-uuid-1", "sheet-uuid-2"],
  "sheetData": {
    "sheet-uuid-1": {
      "id": "sheet-uuid-1",
      "name": "Sheet1",
      "cellData": {
        "0": {
          "0": { "v": "A1", "m": "A1", "t": 2 }
        }
      },
      "rowCount": 100,
      "columnCount": 26,
      "showGridlines": 1
    }
  },
  "createdAt": "ISO日期",
  "updatedAt": "ISO日期"
}
```

## 使用说明

1. **创建工作簿**: 点击页面右上角"新建表格"按钮
2. **编辑单元格**: 双击单元格进入编辑模式，输入内容后按 Enter 提交
3. **保存**: 点击工具栏的"Save"按钮保存当前工作簿
4. **关闭**: 点击"Close"返回工作簿列表
5. **删除**: 在工作簿列表中点击卡片上的"删除"按钮

## 配置说明

### 端口配置

- 前端 Vite: `vite.config.js` 中 `server.port` (默认 5173)
- 后端 Express: `server/index.js` 中 `PORT` (默认 3001)

### API 代理

Vite 开发服务器配置了 `/api` 到 `http://localhost:3001` 的代理，避免跨域问题。

## 部署

1. 构建生产版本：`npm run build`
2. 使用 `npm run preview` 本地预览，或将 `dist` 目录部署到静态托管服务
3. 确保 Express 服务运行在服务器上，数据存储目录 `data/` 有写入权限

## 许可证

MIT
