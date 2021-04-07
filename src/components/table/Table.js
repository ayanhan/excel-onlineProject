import {ExcelComponent} from '@core/ExcelComponent';
import {createTable} from '@/components/table/table.template';
import {resizeHandler} from '@/components/table/table.res';
import {haveToResize} from '@/components/table/table.function';

export class Table extends ExcelComponent {
    static className = 'excel__table'
    constructor($root) {
      super($root, {
        listeners: ['mousedown'],
      })
    }


    toHTML() {
      return createTable()
    }

    onMousedown(event) {
      if (haveToResize(event)) {
        resizeHandler(this.$root, event)
      }
    }
}

