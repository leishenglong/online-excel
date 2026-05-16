import express from 'express';
import cors from 'cors';
import { getAllWorkbooks, getWorkbook, createWorkbook, updateWorkbook, deleteWorkbook } from './storage.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 获取所有表格
app.get('/api/workbooks', (req, res) => {
  const workbooks = getAllWorkbooks();
  res.json(workbooks);
});

// 获取单个表格
app.get('/api/workbooks/:id', (req, res) => {
  const workbook = getWorkbook(req.params.id);
  if (!workbook) {
    return res.status(404).json({ error: '表格不存在' });
  }
  res.json(workbook);
});

// 创建新表格
app.post('/api/workbooks', (req, res) => {
  const { name } = req.body;
  const workbook = createWorkbook(name);
  res.status(201).json(workbook);
});

// 更新表格
app.put('/api/workbooks/:id', (req, res) => {
  const workbook = updateWorkbook(req.params.id, req.body);
  if (!workbook) {
    return res.status(404).json({ error: '表格不存在' });
  }
  res.json(workbook);
});

// 删除表格
app.delete('/api/workbooks/:id', (req, res) => {
  const success = deleteWorkbook(req.params.id);
  if (!success) {
    return res.status(404).json({ error: '表格不存在' });
  }
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
