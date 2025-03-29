// import Note from "../Note.mjs"; // imported in the main document such as NotesData.html
let LlocalNotesMenu;
let localNotesArray;
let localNotesTable;
let serverNotesMenu;
let serverNotesArray;
let serverNotesTable;
let serverNotesTargetURL;
let notesColumns = ['Row','Select','Errors'];
let notesObjectColumns = ['title','text','reference','author','created','modified']; 
let allColumns = notesColumns;

 export function NoteListDoIt(){
     return NoteListPostAll();
 }
 export function NoteListPostAllArgs(
    localNotesArrayArg,localNotesTableArg,
    serverNotesArrayArg,serverNotesTableArg,
    serverNotesTargetArg)
    {
    localNotesArray = localNotesArrayArg;
    localNotesTable = localNotesTableArg;
    serverNotesArray = serverNotesArrayArg;
    serverNotesTable = serverNotesTableArg;
    serverNotesTargetURL = serverNotesTargetArg;
    NoteListUpdateTableLocal();
    NoteListUpdateTableServer();
    return NoteListVerifyArguments();
    }

export function NoteListUpdateTableLocal()
{
    return NoteListUpdateTable(localNotesTable,localNotesArray);
}

export function NoteListUpdateTableServer()
{
    return NoteListUpdateTable(serverNotesTable,serverNotesArray);
}

 export function NoteListVerifyArguments() {
    //console.log(
    //`localNotesArray: ${localNotesArray} \n
    // localNotesTable: ${localNotesTable} \n
    // serverNotesArray: ${localNotesArray} \n
    // serverNotesTable: ${localNotesTable} \n`
    //);
    if (    localNotesArray == undefined
         || localNotesTable == undefined
         || serverNotesArray == undefined
         || serverNotesTable == undefined
       ) {
    //   console.log("Something is missing from NotesList arguments");
       return false;
       }
       else return true;
}

export function NoteListUpdateTable(tableElement, jsonData) {
    // console.log("NoteListUpdateTable:");
    if (!NoteListVerifyArguments())
        return false;
    // build header row
    var tableHTML = "<tr>";
    notesColumns.forEach((columnName) => {
        tableHTML += "<th>" + columnName + "</th>";
    });
    notesObjectColumns.forEach((columnName) => {
        tableHTML += "<th>" + columnName + "</th>";
    });
    tableHTML += "</tr>";

    // build each data row
    let row = 0;
    jsonData.forEach((aNote) => {
        row++;
        try {

            if (aNote !== null && aNote !== undefined) {
                let validation = aNote.validate();
                let nErrors = 0;
                let someErrors = validation.getErrors();
                if ( someErrors )
                    nErrors = Object.entries(someErrors).length;
                let nWarnings = 0;
                let someWarnings = validation.getWarnings();
                if ( someWarnings )
                    nWarnings = Object.entries(someWarnings).length;
                let errorSummary = 'good';
                if ( nErrors > 0 || nWarnings > 0 )
                    errorSummary = `${nErrors} errors, ${nWarnings} warnings`;

                //     tableHTML += "<tr>";
                //     tableHTML += "<td style='border: thin double black'>" + dataObj[eachItem] + "</td>";

                //     var dataObj = jsonData[eachItem];
                tableHTML += "<tr>";
                tableHTML += "<td style='border: thin double black'>" + row + "</td>";
                tableHTML += "<td style='border: thin double black'>" + '<input type="checkbox"/>' + "</td>";
                tableHTML += "<td style='border: thin double black'>" + errorSummary + "</td>";
                notesObjectColumns.forEach((columnName) => {
                    let toolTipText = '';
                    let value = aNote[columnName];
                    let showValue = '';
                    if ( value !== undefined) {
                        if ( value instanceof Date)
                            showValue = value.toLocaleString();//      toISOString();
                        else
                            showValue = value;

                    }
                    let showColor;
                    if ( someErrors != undefined && someErrors[columnName] ) {
                        showColor = 'hsl(0,100%,80%)'; // 'red';
                        toolTipText += someErrors[columnName] + ' ';
                    }
                    else if ( someWarnings != undefined && someWarnings[columnName] ){
                        showColor = 'hsl(60,100%,80%)';//'yellow';
                        toolTipText += someWarnings[columnName];
                    }
                    else
                        showColor = 'hsl(120,100%,80%)'; // 'green';
                    if ( toolTipText.length > 0 ) {
                        tableHTML += `<td class="CellWithComment" `
                            + `style='border: thin double black; background-color: ${showColor}'>`
                            + showValue
                            + `<span class="CellComment">${toolTipText}</span>`
                            + '</td>';
                    }
                    else {
                        tableHTML += `<td style='border: thin double black; background-color: ${showColor}'>` + showValue + '</td>';
                    }

                });
                tableHTML += "</tr>";

            }

        } catch (rowError) {
            console.log(`error rendering note for row ${row}: ${rowError}`);
        }
    });

    tableElement.innerHTML = tableHTML;
    return true;
}

export function NoteListPostAll() {
   // console.log("NoteListPostAll()", localNotesArray);
    if ( !NoteListVerifyArguments() )
        return false;

    // TO DO: implement a POST to the notes endpoint
    try {
    //    console.log('Next step is to POST the Notes .');
        fetch(serverNotesTargetURL + "?action=replace",
            {
                method: "POST",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'http://Bible.MichaelKentBurns.com'
                },
                body: JSON.stringify(localNotesArray)
            }
        ).then((response) => response.json())
            .then((notesResult) =>
            {
                serverNotesArray = noteCastMany(notesResult);
                console.log("notesJSON=", serverNotesArray);
                notesText = JSON.stringify(serverNotesArray);
            });
    } catch(error) {
        console.log("Error trying to post notes data: ",error);
        notesError = JSON.stringify(error);
        console.log("Error posting ", url, " : ", notesError);
    }
    console.log("NoteListPostAll complete.")

    // now refresh the table
    NoteListUpdateTable(localNotesTable,localNotesArray);
    NoteListUpdateTable(serverNotesTable,serverNotesArray);
    return true;
}
// export default { NoteListPostAll, NoteListUpdateTable, NoteListPostAllArgs };