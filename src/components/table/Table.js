import {ExcelComponent} from '@core/ExcelComponent';
import {createTable} from '@/components/table/table.template';
import {resizeHandler} from '@/components/table/table.res';
import {haveToResize, isCell, matrix, nextSelector} from './table.function';
import {TableSelection} from '@/components/table/TableSelection';
import {$} from '@core/dom';


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
      return createTable()
    }

    prepare() {
      this.selection = new TableSelection()
    }

    init() {
      super.init()
      const $cell = this.$root.find('[data-id="0:0"]')
      this.selection.select($cell)
      this.$emit('tableselect', $cell)

      this.$on('formulainput', (text) => {
        this.selection.current.text(text)
      })
      this.$on('formuladone', () => {
        this.selection.current.focus()
      })
    }

    onMousedown(event) {
      if (haveToResize(event)) {
        resizeHandler(this.$root, event)
      } else if (isCell(event)) {
        const $target = $(event.target)
        if (event.shiftKey) {
          // eslint-disable-next-line max-len
          const $cells = matrix($target, this.selection.current).map((id) => this.$root.find(`[data-id="${id}"]`))
          this.selection.selectGroup($cells)
        } else {
          this.selection.select($target)
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

      if (keys .includes(key) && !event.shiftKey) {
        event.preventDefault()
        const id = this.selection.current.id(true)
        const $next = this.$root.find(nextSelector(key, id))
        this.selection.select($next)
        this.$emit('tableselect', $next)
      }
    }

    onInput(event) {
      this.$emit('tableinput', $(event.target))
    }
}


