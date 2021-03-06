import {toInlineStyles} from '@core/utils';
import {defaultStyles} from '@/constants';
import {parse} from '@core/parse';

const CODES = {
  A: 65,
  Z: 90,
}

const DEFAULT_WIDTH = 120
const DEFAULT_HEIGHT = 24

function toCell(state, row) {
  return function(_, col) {
    const id = `${row}:${col}`
    const data = state.dataState[id]
    const styles = toInlineStyles({
      ...defaultStyles,
      ...state.stylesState[id],
    })
    return `
    <div class="cell"
     contenteditable
     data-col="${col}"
     data-type="cell"
     data-id="${id}"
     data-value="${data || ''}"
     style="${styles}; 
     width: ${getWidth(state.colState, col)}">${parse(data) || ''}</div>
  `
  }
}


function createCol(el, index, width) {
  return `
    <div class="column"
     data-type="resizable"
      data-col="${index}"
       style="width: ${width}">
      ${el}
      <div class="col-resize" data-resize="col"></div>
    </div>
  `
}

function createRow(index, content, state) {
  // eslint-disable-next-line max-len
  const resizer = index ? '<div class="row-resize" data-resize="row"></div>' : ''
  return `
    <div class="row" 
    data-type="resizable" 
    data-row="${index}"
    style="height: ${getHeight(state, index)}">
      <div class="row-info">
        ${index ? index : 'Ayan'}
        ${resizer}
      </div>
      <div class="row-data">${content}</div>
    </div>
  `
}

function getWidth(state, index) {
  return (state[index] || DEFAULT_WIDTH) + 'px'
}
function getHeight(state, index) {
  return (state[index] || DEFAULT_HEIGHT) + 'px'
}

export function createTable(rowsCount = 12, state = {}) {
  const colsCount = CODES.Z - CODES.A + 1
  const rows = []

  const cols = new Array(colsCount)
      .fill('')
      .map((el, index) => {
        return String.fromCharCode(CODES.A + index)
      })
      .map((el, index) => {
        const width = getWidth(state.colState, index)
        return createCol(el, index, width)
      })
      .join('')

  rows.push(createRow(null, cols, {}))
  for (let row = 0; row < rowsCount; row++) {
    const cells = new Array(colsCount)
        .fill('')
        .map(toCell(state, row))
        .join('')
    rows.push(createRow(row + 1, cells, state.rowState))
  }
  return rows.join('')
}
