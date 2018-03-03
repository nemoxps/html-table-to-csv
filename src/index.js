/**
 * @param {Array[]} table
 * @param {Object} [options]
 * @param {boolean} [options.repeatSpans=false]
 * @returns {Array[]}
 */
let tableToMatrix = (table, { repeatSpans = false } = {}) => {
    let rowsLen = table.length;
    let colsLen = table[0].reduce((sum, cell) => sum + cell.colSpan, 0);
    let matrix = Array.from({ length: rowsLen }, () => Array.from({ length: colsLen }, () => null));
    for (let i = 0; i < rowsLen; i++)
      for (let j = 0, jj = 0; j < colsLen; j++)
      {
        if (matrix[i][j] !== null)
          continue;
        let cell = table[i][jj++];
        matrix[i][j] = cell.textContent;
        if (cell.colSpan > 1)
          matrix[i].fill((repeatSpans) ? cell.textContent : undefined, j + 1, j + cell.colSpan);
        if (cell.rowSpan > 1)
          for (let ii = i + 1, l = ii + cell.rowSpan - 1; ii < l; ii++)
            matrix[ii].fill((repeatSpans) ? cell.textContent : undefined, j, j + cell.colSpan);
      }
    return matrix;
};

/**
 * @param {Array[]} table
 * @param {Object} [options]
 * @param {string} [options.itemSeparator='\t']
 * @param {string} [options.lineSeparator='\n']
 * @returns {string}
 */
let tableToCSV = (table, { itemSeparator = '\t', lineSeparator = '\n', ...toMatrixOptions } = {}) => {
    let reCellNeedsEscape = new RegExp(`[\r\n\t,"${itemSeparator + lineSeparator}]`);
    return tableToMatrix(table, toMatrixOptions).map((row) => {
        return row.map((text) => {
            if (!text)
              return '';
            return (reCellNeedsEscape.test(text)) ? `"${text.replace(/"/g, '""')}"` : text;
        }).join(itemSeparator);
    }).join(lineSeparator);
};

/**
 * @param {Element} elem
 * @returns {Array[]}
 */
let HTMLTableToArray = (elem) => Array.from(elem.querySelectorAll('tr'), (row) => Array.from(row.querySelectorAll('th,td')));

/**
 * @param {Element} elem
 * @param {Object} [options] tableToMatrix~options
 * @returns {Array[]}
 */
let HTMLTableToMatrix = (elem, options) => tableToMatrix(HTMLTableToArray(elem), options);

/**
 * @param {Element} elem
 * @param {Object} [options] tableToCSV~options
 * @returns {string}
 */
let HTMLTableToCSV = (elem, options) => tableToCSV(HTMLTableToArray(elem), options);


module.exports = { tableToMatrix, tableToCSV, HTMLTableToMatrix, HTMLTableToCSV };