//mm # Class: Validation
//mm
//mm The results of the validation of a specific object.
//mm The validation algorithm is a method named 'validate' implemented
//mm by the class itself.
//mm
//mm ## Responsibilities:
//mm ### Capture the results of the validation of each property of the object.
//mm ### Each attribute validation results in an entry named for the attribute
//mm   in one of three lists:  valid, warnings, errors.
//mm ### If all goes well, the validation will contain a list called 'valid'
//mm   containing the names of all the properties that were validated.
//mm   In that case there will be no 'errors' or 'warnings' lists.
//mm
//mm ## Collaborators:
//mm * Potentially any class in the object model which implements 'validate'
//mm ```mermaid
//mm classDiagram
//mm    class Validation {
//- - - - - - - - - - - begin Class definition - - - - - - - - - - -
export class Validation {
    constructor(title, testSubject) {
        //mm +String title   // Some description or name
        this.title = title;
        //mm +Object testSubject   // the object that was validated
        this.testSubject = testSubject;
        //mm +Object valid         // the list of valid properties
        this.valids = new Object();
        //mm +Object errors  // null or a list of properties with errors
        this.errors = null;
        //mm +Object warnings // null or a list of properties with warnings
    }

    //mm setTitle(String someText)$ Note  // sets the title and returns this
    setTitle(someText) {
        this.title = someText;
        return this;
    }
    //mm getTitle()$ String // returns the title of the validation
    getTitle() {
        return this.title;
    }

    //mm setTestSubject(Object objectBeingValidate)$ // sets the title and returns this
    setTestSubject(someObject) {
        this.testSubject = someObject;
        return this;
    }
    //mm getTestSubject()   Object   // returns the object validated
    getTestSubject() {
        return this.testSubject;
    }

    //mm getValids()    Object // returns a list of all valid properties
    getValids() {
        return this.valids;
    }
    //mm addValid( String propertyName, Object note )
    //mm        note can be a string, or other object.
    addValid(propertyName, note) {
        if ( this.valid == undefined )
            this.valids = new Object();
        this.valids[propertyName] = note;
    }
    //mm removeValid(propertyName)  // removes any valid note for propertyName
    removeValid(propertyName) {
        this.valids.remove(propertyName);
    }

    //mm getErrors()    Object // returns a list of all errored properties
    getErrors() {
        return this.errors;
    }
    //mm addError( String propertyName, Object error )
    //mm        error can be a string, or an Error or other exception.
    addError(propertyName, error) {
        if ( this.errors == undefined )
            this.errors = new Object();
        this.errors[propertyName] = error;
    }
    //mm removeError(propertyName)  // removes any error for propertyName
    removeError(propertyName) {
        this.errors.remove(propertyName);
    }

    //mm getWarnings()    Object // returns a list of all warned properties
    getWarnings() {
        return this.warnings;
    }
    //mm addWarning( String propertyName, Object warning )
    //mm        warning can be a string, or an Error or other exception.
    addWarning(propertyName, warning) {
        if ( this.warnings == undefined )
            this.warnings = new Object();
        this.warnings[propertyName] = warning;
    }
    //mm removeWarning(propertyName)  // removes any warnings for propertyName
    removeWarning(propertyName) {
        this.warnings.remove(propertyName);
    }

}
//mm }
//mm ```
//- - - - - - - - - - - end Class definition - - - - - - - - - - -

export default { Validation };