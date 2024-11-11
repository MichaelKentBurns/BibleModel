
// Function to turn it into a table
function makeTable(D) {
    var a = '';
    cols = Object.keys(D[0]);
    a += '<table><thead><tr>';
    for (j = 0; j < cols.length; j++) {
        a += `<th>${cols[j]}</th>`;
    }
    a += '</tr></thead><tbody>';

    for (i = 0; i < D.length; i++) {
        a += '<tr>';
        for (j = 0; j < cols.length; j++) {
            a += `<td>${D[i][cols[j]]}</td>`;
        }
        a += '</tr>';
    }
    a += '</tbody></table>';
    return a;
}
console.log('check if document is ready');
// First, read the json
console.log('document=', document );
//  document.ready(function () {

//  $("button").click(function () {
//         $.getJSON("./books.json", {}, function (data) {
           // makeTable(data);
//               updateTable("booksTable", data);
//           });
//   });
//});
