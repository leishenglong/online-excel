# Univer 在线表格项目设计

## 概述

基于 Univer Sheet 构建企业级在线表格工具，提供纯前端表格编辑能力，后端 Node.js 服务负责文件持久化存储。

## 技术选型

| 层次 | 技术 | 说明 |
|------|------|------|
| 表格引擎 | @univerjs/base-sheets | Univer 核心表格模块 |
| 前端框架 | React 18 | 配合 Univer 使用 |
| 构建工具 | Vite | 快速开发和构建 |
| 后端框架 | Express | 轻量 Node.js 服务 |
| 存储 | 本地 JSON 文件 | 简化部署，数据可备份 |

## 架构设计

### 整体架构

```
┌─────────────┐     HTTP API      ┌─────────────┐
│   Browser   │ ◄───────────────► │   Express   │
│  (Univer)   │                   │   Server    │
└─────────────┘                   └─────────────┘
                                         │
                                    ┌────▼────┐
                                    │  JSON   │
                                    │  Files  │
                                    └─────────┘
```

### 目录结构

```
online-excel/
├── server/
│   ├── index.js          # Express 服务入口
│   ├── storage.js        # 文件存储模块
│   └── routes/
│       └── workbooks.js  # 表格相关路由
├── src/
│   ├── main.jsx          # React 入口
│   ├── App.jsx           # 主组件
│   └── univer/
│       └── sheets-plugin.ts   # Univer 配置
├── data/                 # JSON 文件存储目录
│   └── workbooks.json    # 表格数据
├── index.html
├── package.json
└── vite.config.js
```

## API 设计

### 路由

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/workbooks` | 获取所有表格列表 |
| GET | `/api/workbooks/:id` | 读取单个表格 |
| POST | `/api/workbooks` | 创建新表格 |
| PUT | `/api/workbooks/:id` | 保存表格 |
| DELETE | `/api/workbooks/:id` | 删除表格 |

### 数据模型

```json
// workbook
{
  "id": "uuid-string",
  "name": "表格名称",
  "sheets": [...],
  "createdAt": "ISO-date",
  "updatedAt": "ISO-date"
}
```

## 实施步骤

1. 初始化项目结构，安装依赖
2. 搭建 Express 服务，实现文件存储
3. 配置 Univer Sheet 前端
4. 实现前后联调
5. 优化界面和交互

## 风险与约束

- 数据存储于单台服务器，不支持分布式
- 无用户认证，所有人能编辑所有文件
- 文件格式为 JSON，不支持直接导入导出 Excel（后续扩展）
