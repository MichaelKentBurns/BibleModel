function updateTable(tableId, jsonData){

    var tableHTML = "<tr>";
    for (var headers in jsonData[0]) {
      tableHTML += "<th>" + headers + "</th>";
    }
    tableHTML += "</tr>";
  
    for (var eachItem in jsonData) {
      tableHTML += "<tr>";
      var dataObj = jsonData[eachItem];
      for (var eachValue in dataObj){
        tableHTML += "<td>" + dataObj[eachValue] + "</td>";
      }
      tableHTML += "</tr>";
    }
  
    tableId.innerHTML = tableHTML;
  }