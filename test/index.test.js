let test = require('tape');

let { tableToMatrix, tableToCSV } = require('../');


let createTableWithLen = (colLen, rowLen = colLen) => {
    return Array.from({ length: rowLen }, (x, rowIdx) => Array.from({ length: colLen }, (x, colIdx) => ({
        textContent: 1 + colLen * rowIdx + colIdx,
        rowSpan: 1,
        colSpan: 1,
    })));
};
let createTableWithRowSpans = (tableRowSpans) => {
    return tableRowSpans.map((rowSpans, rowIdx) => rowSpans.map((rowSpan, colIdx) => (rowSpan !== 0) ? ({
        textContent: 1 + rowSpans.length * rowIdx + colIdx,
        rowSpan,
        colSpan: 1,
    }) : null).filter(Boolean));
};
let createTableWithColSpans = (tableColSpans) => {
    return tableColSpans.map((colSpans, rowIdx) => colSpans.map((colSpan, colIdx) => (colSpan !== 0) ? ({
        textContent: 1 + colSpans.length * rowIdx + colIdx,
        rowSpan: 1,
        colSpan,
    }) : null).filter(Boolean));
};
let createTableWithSpans = (tableSpans) => {
    return tableSpans.map((spans, rowIdx) => spans.map((span, colIdx) => {
        if (span === 0)
          return null;
        let [colSpan, rowSpan] = (Array.isArray(span)) ? span : [span, span];
        return {
            textContent: 1 + spans.length * rowIdx + colIdx,
            rowSpan,
            colSpan,
        };
    }).filter(Boolean));
};

test('tableToMatrix', (t) => {
    t.test('should handle normal tables', (t) => {
        let createTable = createTableWithLen;
        
        t.deepEqual(
            tableToMatrix(createTable(4)),
            [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]
        );
        t.deepEqual(
            tableToMatrix(createTable(4, 6)),
            [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16], [17, 18, 19, 20], [21, 22, 23, 24]]
        );
        
        t.end();
    });
    
    t.test('should handle tables with `HTMLTableCellElement#rowSpan`', (t) => {
        let createTable = createTableWithRowSpans;
        
        let table = createTable([[4, 1, 1], [0, 1, 2], [0, 1, 0], [0, 1, 1]]);
        t.deepEqual(
            tableToMatrix(table),
            [[1, 2, 3], [undefined, 5, 6], [undefined, 8, undefined], [undefined, 11, 12]]
        );
        t.deepEqual(
            tableToMatrix(table, { repeatSpans: true }),
            [[1, 2, 3], [1, 5, 6], [1, 8, 6], [1, 11, 12]]
        );
        table = createTable([[3, 2, 1], [0, 0, 3], [0, 2, 0], [1, 0, 0]]);
        t.deepEqual(
            tableToMatrix(table),
            [[1, 2, 3], [undefined, undefined, 6], [undefined, 8, undefined], [10, undefined, undefined]]
        );
        t.deepEqual(
            tableToMatrix(table, { repeatSpans: true }),
            [[1, 2, 3], [1, 2, 6], [1, 8, 6], [10, 8, 6]]
        );
        
        t.end();
    });
    
    t.test('should handle tables with `HTMLTableCellElement#colSpan`', (t) => {
        let createTable = createTableWithColSpans;
        
        let table = createTable([[4, 0, 0, 0], [1, 1, 2, 0], [1, 1, 1, 1]]);
        t.deepEqual(
            tableToMatrix(table),
            [[1, undefined, undefined, undefined], [5, 6, 7, undefined], [9, 10, 11, 12]]
        );
        t.deepEqual(
            tableToMatrix(table, { repeatSpans: true }),
            [[1, 1, 1, 1], [5, 6, 7, 7], [9, 10, 11, 12]]
        );
        table = createTable([[3, 0, 0, 1], [2, 0, 2, 0], [1, 3, 0, 0]]);
        t.deepEqual(
            tableToMatrix(table),
            [[1, undefined, undefined, 4], [5, undefined, 7, undefined], [9, 10, undefined, undefined]]
        );
        t.deepEqual(
            tableToMatrix(table, { repeatSpans: true }),
            [[1, 1, 1, 4], [5, 5, 7, 7], [9, 10, 10, 10]]
        );
        
        t.end();
    });
    
    t.test('should handle tables with `HTMLTableCellElement#rowSpan` & `HTMLTableCellElement#colSpan`', (t) => {
        let createTable = createTableWithSpans;
        
        let table = createTable([[3, 0, 0], [0, 0, 0], [0, 0, 0]]);
        t.deepEqual(
            tableToMatrix(table),
            [[1, undefined, undefined], [undefined, undefined, undefined], [undefined, undefined, undefined]]
        );
        t.deepEqual(
            tableToMatrix(table, { repeatSpans: true }),
            [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
        );
        table = createTable([[2, 0, 2, 0], [0, 0, 0, 0], [2, 0, 2, 0], [0, 0, 0, 0]]);
        t.deepEqual(
            tableToMatrix(table),
            [[1, undefined, 3, undefined], [undefined, undefined, undefined, undefined], [9, undefined, 11, undefined], [undefined, undefined, undefined, undefined]]
        );
        t.deepEqual(
            tableToMatrix(table, { repeatSpans: true }),
            [[1, 1, 3, 3], [1, 1, 3, 3], [9, 9, 11, 11], [9, 9, 11, 11]]
        );
        table = createTable([[[2, 4], 0, [2, 1], 0], [0, 0, [1, 2], 1], [0, 0, 0, 1], [0, 0, [2, 1], 0]]);
        t.deepEqual(
            tableToMatrix(table),
            [[1, undefined, 3, undefined], [undefined, undefined, 7, 8], [undefined, undefined, undefined, 12], [undefined, undefined, 15, undefined]]
        );
        t.deepEqual(
            tableToMatrix(table, { repeatSpans: true }),
            [[1, 1, 3, 3], [1, 1, 7, 8], [1, 1, 7, 12], [1, 1, 15, 15]]
        );
        
        t.end();
    });
    
    t.end();
});

test('tableToCSV', (t) => {
    let createTable = (...args) => {
        if (typeof args[0] === 'number')
          return createTableWithLen(...args);
        return createTableWithSpans(...args);
    };
    let modifyTableText = (table, modifications) => {
        for (let [row, col, text] of modifications)
          table[row][col].textContent += text;
        return table;
    };
    
    t.test('should stringify a table to CSV', (t) => {
        t.equal(
            tableToCSV(createTable(4)),
            '1\t2\t3\t4\n5\t6\t7\t8\n9\t10\t11\t12\n13\t14\t15\t16'
        );
        t.equal(
            tableToCSV(createTable(4), { itemSeparator: ',', lineSeparator: '\r\n' }),
            '1,2,3,4\r\n5,6,7,8\r\n9,10,11,12\r\n13,14,15,16'
        );
        t.equal(
            tableToCSV(createTable([[[2, 4], 0, [2, 1], 0], [0, 0, [1, 2], 1], [0, 0, 0, 1], [0, 0, [2, 1], 0]])),
            '1\t\t3\t\n\t\t7\t8\n\t\t\t12\n\t\t15\t'
        );
        t.equal(
            tableToCSV(createTable([[[2, 4], 0, [2, 1], 0], [0, 0, [1, 2], 1], [0, 0, 0, 1], [0, 0, [2, 1], 0]]), { itemSeparator: ',', lineSeparator: '\r\n', repeatSpans: true }),
            '1,1,3,3\r\n1,1,7,8\r\n1,1,7,12\r\n1,1,15,15'
        );
        t.equal(
            tableToCSV(modifyTableText(createTable(4, 2), [[0, 0, '\r'], [0, 1, '\n'], [0, 2, '\t'], [0, 3, ','], [1, 0, '"'], [1, 0, '"']])),
            '"1\r"\t"2\n"\t"3\t"\t"4,"\n"5"""""\t6\t7\t8'
        );
        
        t.end();
    });
    
    t.test('should support unusual CSV separators', (t) => {
        t.equal(
            tableToCSV(modifyTableText(createTable(4, 1), [[0, 0, '%'], [0, 1, '$']]), { itemSeparator: '%', lineSeparator: '$' }),
            '"1%"%"2$"%3%4'
        );
        
        t.end();
    });
    
    t.end();
});