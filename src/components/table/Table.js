import {ExcelComponent} from '@core/ExcelComponent';
import {createTable} from '@/components/table/table.template';
import {resizeHandler} from '@/components/table/table.res';
import {haveToResize, isCell, matrix, nextSelector} from './table.function';
import {TableSelection} from '@/components/table/TableSelection';
import {$} from '@core/dom';
import * as actions from '@/redux/actions'
import {defaultStyles} from '@/constants';
import {parse} from '@core/parse';


export class Table extends ExcelComponent {
    static className = 'excel__table'
    constructor($root, options) {
      super($root, {
        name: 'Table',
        listeners: ['mousedown', 'keydown', 'input'],
        ...options,
      })
    }

    toHTML() {
      return createTable(20, this.store.getState())
    }

    prepare() {
      this.selection = new TableSelection()
    }

    init() {
      super.init()
      this.selectCell(this.$root.find('[data-id="0:0"]'))


      this.$on('formulainput', (value) => {
        this.selection.current
            .attr('data-value', value)
            .text(parse(value))
        this.updateText(value)
      })
      this.$on('formuladone', () => {
        this.selection.current.focus()
      })
      this.$on('toolbarapplyStyle', (value) => {
        this.selection.applyStyle(value)
        this.$dispatch(actions.applyStyle({
          value,
          ids: this.selection.selectedIds,
        }))
      })
    }

    async resizeTable(event) {
      try {
        const data = await resizeHandler(this.$root, event)
        this.$dispatch(actions.tableResize(data))
      } catch (e) {
        console.warn(e.message)
      }
    }

    selectCell($cell) {
      this.selection.select($cell)
      this.$emit('tableselect', $cell)
      const styles = $cell.getStyles(Object.keys(defaultStyles))
      this.$dispatch(actions.changeStyles(styles))
    }

    onMousedown(event) {
      if (haveToResize(event)) {
        this.resizeTable(event)
      } else if (isCell(event)) {
        const $target = $(event.target)
        if (event.shiftKey) {
          // eslint-disable-next-line max-len
          const $cells = matrix($target, this.selection.current).map((id) => this.$root.find(`[data-id="${id}"]`))
          this.selection.selectGroup($cells)
        } else {
          this.selectCell($target)
        }
      }
    }

    onKeydown(event) {
      const keys = [
        'Enter',
        'Tab',
        'ArrowLeft',
        'ArrowRight',
        'ArrowDown',
        'ArrowUp',
      ]
      const {key} = event


      if (keys.includes(key) && !event.shiftKey) {
        event.preventDefault()
        const id = this.selection.current.id(true)
        const $next = this.$root.find(nextSelector(key, id))
        this.selectCell($next)
      }
    }

    updateText(value) {
      this.$dispatch(actions.changeText({
        id: this.selection.current.id(),
        value,
      }))
    }

    onInput(event) {
      // this.$emit('tableinput', $(event.target))
      this.updateText($(event.target).text())
    }
}


