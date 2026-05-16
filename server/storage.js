import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const WORKBOOKS_FILE = path.join(DATA_DIR, 'workbooks.json');

function readWorkbooks() {
  if (!fs.existsSync(WORKBOOKS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(WORKBOOKS_FILE, 'utf-8');
  return JSON.parse(data);
}

function writeWorkbooks(workbooks) {
  fs.writeFileSync(WORKBOOKS_FILE, JSON.stringify({ workbooks }, null, 2));
}

export function getAllWorkbooks() {
  const data = readWorkbooks();
  return data.workbooks || [];
}

export function getWorkbook(id) {
  const workbooks = getAllWorkbooks();
  return workbooks.find(w => w.id === id) || null;
}

export function createWorkbook(name = '未命名表格') {
  const workbooks = getAllWorkbooks();
  const newWorkbook = {
    id: uuidv4(),
    name,
    sheets: [{
      id: uuidv4(),
      name: 'Sheet1',
      data: {
        cellData: {},
        rowCount: 100,
        columnCount: 26
      }
    }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  workbooks.push(newWorkbook);
  writeWorkbooks(workbooks);
  return newWorkbook;
}

export function updateWorkbook(id, updates) {
  const workbooks = getAllWorkbooks();
  const index = workbooks.findIndex(w => w.id === id);
  if (index === -1) {
    return null;
  }
  workbooks[index] = {
    ...workbooks[index],
    ...updates,
    id,
    updatedAt: new Date().toISOString()
  };
  writeWorkbooks(workbooks);
  return workbooks[index];
}

export function deleteWorkbook(id) {
  const workbooks = getAllWorkbooks();
  const index = workbooks.findIndex(w => w.id === id);
  if (index === -1) {
    return false;
  }
  workbooks.splice(index, 1);
  writeWorkbooks(workbooks);
  return true;
}
