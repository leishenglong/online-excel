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
  const sheetId = uuidv4();
  const newWorkbook = {
    id: uuidv4(),
    name,
    sheetIds: [sheetId],
    sheetData: {
      [sheetId]: {
        id: sheetId,
        name: 'Sheet1',
        tabColor: '',
        hidden: 0,
        freeze: { x: 0, y: 1 },
        rowCount: 100,
        columnCount: 26,
        zoomRatio: 1,
        scrollTop: 0,
        scrollLeft: 0,
        defaultColumnWidth: 73,
        defaultRowHeight: 19,
        mergeData: [],
        cellData: {
          '0': {
            '0': { v: 'A1', m: 'A1', t: 2 },
            '1': { v: 'B1', m: 'B1', t: 2 },
            '2': { v: 'C1', m: 'C1', t: 2 }
          },
          '1': {
            '0': { v: 'A2', m: 'A2', t: 2 },
            '1': { v: 'B2', m: 'B2', t: 2 },
            '2': { v: 'C2', m: 'C2', t: 2 }
          }
        },
        rowData: [],
        columnData: [],
        rowHeader: { width: 46, hidden: 0 },
        columnHeader: { height: 20, hidden: 0 },
        showGridlines: 1,
        gridlinesColor: ''
      }
    },
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

  // Use new sheetData format completely
  const newData = {
    id: updates.id || workbooks[index].id,
    name: updates.name || workbooks[index].name,
    sheetIds: updates.sheetIds || [],
    sheetData: updates.sheetData || {},
    createdAt: workbooks[index].createdAt,
    updatedAt: new Date().toISOString()
  };

  workbooks[index] = newData;
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
