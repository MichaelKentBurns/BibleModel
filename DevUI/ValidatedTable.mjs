// devUI/ValidatedTable.mjs
import { Note } from '../Note.mjs';
// import { Book } from '../Book.mjs';
// import { NoteList } from '../NoteList.mjs';
import validation, { Validation } from '../Validation.mjs';
import {NotesManager} from "./NotesManager.mjs";

const fixedColumns = ['Row','Select','Errors'];

//mm # Class: ValidatedTable   (EXPERIMENTAL CONCEPT)
//mm
//mm Manage an HTML table containing an array of objects.
//mm
//mm This presents an array of objects in an HTML table with index and select columns added.
//mm If the class of the objects implements the validate method, then that will be used to
//mm validate the cells and color code them accordingly.
//mm ```mermaid
//mm classDiagram
//mm    class NotesManager {
//- - - - - - - - - - - begin Class definition - - - - - - - - - - -
export class ValidatedTable {
    //mm  +constructor() ValidatedTable // initialize a paired array and an HTML table
    constructor(title, arrayClass, objectArray, objectColumnNames, tableElement) {
        this.title = title;
        this.arrayClass = arrayClass;
        this.objectArray = objectArray;
        this.columnNames = [...fixedColumns,...objectColumnNames];
        this.objectColumnNames = objectColumnNames;
        this.tableElement = tableElement;
        this.autoValidate = false;
        this.autoValidateElement = undefined;
        this.refreshTable();
    }

    setObjectArray( anArray ) {
        this.objectArray = anArray;
    }

    setTableElement( anElement ) {
        this.tableElement = anElement;
    }

    setAutoValidate(aBoolean) {
        this.autoValidate = aBoolean;
    }
    setAutoValidateElement( anElement ) {
        this.autoValidateElement = anElement;
        anElement.onclick = () => {
            this.autoValidate = true;
            this.autoValidateElement.clicked = true;
        }
    }

    refreshTable(validateSelected,validateAll) {
        // build header row
        var tableHTML = "<tr>";
        this.columnNames.forEach((columnName) => {
            tableHTML += "<th>" + columnName + "</th>";
        });
        tableHTML += "</tr>";

        // build each data row
        let row = 0;
        this.objectArray.forEach((anObject) => {
            row++;
            try {
                let errorSummary = '';
                let nErrors = 0;
                let nWarnings = 0;
                let someErrors = false;
                let someWarnings = false;
                let didValidation = false;
                let doValidationOnThisOne = false;
                if ( this.autoValidate )
                    doValidationOnThisOne = true;

                if ( validateSelected ) {
                    validateSelected.forEach( item => {
                       if ( item == row )
                           doValidationOnThisOne = true;
                    });
                }

                if (this.autoValidate || doValidationOnThisOne ) {

                    if (anObject !== null && anObject !== undefined) {
                        let validation = anObject.validate();
                        console.log(`validation of `,anObject, ' is ',validation);
                        if (validation) {
                            didValidation = true;
                            let someErrors = validation.getErrors();
                            if (someErrors)
                                nErrors = Object.entries(someErrors).length;
                            let someWarnings = validation.getWarnings();
                            if (someWarnings)
                                nWarnings = Object.entries(someWarnings).length;
                            let errorSummary = 'good';
                            if (nErrors > 0 || nWarnings > 0)
                                errorSummary = `${nErrors} errors, ${nWarnings} warnings`;
                        }
                    }
                }

                    //     tableHTML += "<tr>";
                    //     tableHTML += "<td style='border: thin double black'>" + dataObj[eachItem] + "</td>";

                    //     var dataObj = jsonData[eachItem];
                    tableHTML += "<tr>";
                    tableHTML += "<td style='border: thin double black'>" + row + "</td>";
                    tableHTML += "<td style='border: thin double black'>" + '<input type="checkbox"/>' + "</td>";
                    tableHTML += "<td style='border: thin double black'>" + errorSummary + "</td>";
                    this.objectColumnNames.forEach((columnName) => {
                        // default to undecorated
                        let toolTipText = '';
                        let value = anObject[columnName];
                        let showValue = '';
                        let showColor = 'hsl(0,0%,100%)';  // clear

                        if (value !== undefined) {
                            if (value instanceof Date)
                                showValue = value.toLocaleString();//      toISOString();
                            else
                                showValue = value;

                        }
                        if (someErrors != undefined && someErrors != false && someErrors[columnName]) {
                            showColor = 'hsl(0,100%,80%)'; // 'red';
                            toolTipText += someErrors[columnName] + ' ';
                        } else if (someWarnings != undefined && someWarnings != false && someWarnings[columnName]) {
                            showColor = 'hsl(60,100%,80%)';//'yellow';
                            toolTipText += someWarnings[columnName];
                        } else if (didValidation){
                            showColor = 'hsl(120,100%,80%)';
                        }// 'green';
                        if (toolTipText.length > 0) {
                            tableHTML += `<td class="CellWithComment" `
                                + `style='border: thin double black; background-color: ${showColor}'>`
                                + showValue
                                + `<span class="CellComment">${toolTipText}</span>`
                                + '</td>';
                        } else {
                            tableHTML += `<td style='border: thin double black; background-color: ${showColor}'>` + showValue + '</td>';
                        }

                    });
                tableHTML += "</tr>";

            } catch (rowError) {
                console.log(`error rendering note for row ${row}: ${rowError}`);
            }
        });

        this.tableElement.innerHTML = tableHTML;
        return true;
    }

    getSelectedRows() {
        //Reference the Table.
        let grid = this.tableElement;
        let rowsSelected = [];
        //Reference the CheckBoxes in Table.
        let checkBoxes = grid.getElementsByTagName("INPUT");
        //Loop through the CheckBoxes.
        for (let i = 0; i < checkBoxes.length; i++) {
            if (checkBoxes[i].checked) {
                let row = checkBoxes[i].parentNode.parentNode;
                let rowNumber = Number(row.cells[0].innerText);
                rowsSelected.push(rowNumber);
            }
        }
        return rowsSelected;
    }

    validateSelectedRows() {
        let selectedRows = this.getSelectedRows();
        for (let i = 0; i < selectedRows.length; i++) {
            console.log(`Should validate row ${i} `,selectedRows[i]);
        }
        this.refreshTable(selectedRows);
    }
}

//mm }
//mm ```
//- - - - - - - - - - - end Class definition - - - - - - - - - - -
export default { ValidatedTable };
