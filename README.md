# html-table-to-csv
> Converts a HTML table to CSV.

## Installation
```sh
$ npm install nemoxps/html-table-to-csv
```

## Usage
Simple table:
```html
<table id="table">
  <tr>
    <th>#Track</th>
    <th>Title</th>
  </tr>
  <tr>
    <td>1</td>
    <td>First</td>
  </tr>
  <tr>
    <td>2</td>
    <td>Second</td>
  </tr>
</table>
```
```js
let { HTMLTableToCSV } = require('html-table-to-csv');
HTMLTableToCSV(document.getElementById('table'));
// `#Track\tTitle\n
// 1\tFirst\n
// 2\tSecond`

// Custom CSV separators:
HTMLTableToCSV(document.getElementById('table'), { itemSeparator: ',', lineSeparator: '\r\n' });
// `#Track,Title\r\n
// 1,First\r\n
// 2,Second`
```

Table with spans:
```html
<table id="table">
  <tr>
    <th>#Disc</th>
    <th>#Track</th>
    <th>Title</th>
  </tr>
  <tr>
    <td rowspan="2">1</td>
    <td>1</td>
    <td>First</td>
  </tr>
  <tr>
    <td>2</td>
    <td>Second</td>
  </tr>
  <tr>
    <td rowspan="2">2</td>
    <td>1</td>
    <td>Third</td>
  </tr>
  <tr>
    <td>2</td>
    <td>Fourth</td>
  </tr>
</table>
```
```js
let { HTMLTableToCSV } = require('html-table-to-csv');
HTMLTableToCSV(document.getElementById('table'));
// `#Disc\t#Track\tTitle\n
// 1\t1\tFirst\n
// \t2\tSecond\n
// 2\t1\tThird\n
// \t2\tFourth`

// Repeat spans:
HTMLTableToCSV(document.getElementById('table'), { repeatSpans: true });
// `#Disc\t#Track\tTitle\n
// 1\t1\tFirst\n
// 1\t2\tSecond\n
// 2\t1\tThird\n
// 2\t2\tFourth`
```

## License
MIT