@Mermaid markup extracted from Validation.mjs
 # Class: Validation

 The results of the validation of a specific object.
 The validation algorithm is a method named 'validate' implemented
 by the class itself.

 ## Responsibilities:
 ### Capture the results of the validation of each property of the object.
 ### Each attribute validation results in an entry named for the attribute
   in one of three lists:  valid, warnings, errors.
 ### If all goes well, the validation will contain a list called 'valid'
   containing the names of all the properties that were validated.
   In that case there will be no 'errors' or 'warnings' lists.

 ## Collaborators:
 * Potentially any class in the object model which implements 'validate'
 ```mermaid
 classDiagram
    class Validation {
         +String title   // Some description or name
         +Object testSubject   // the object that was validated
         +Object valid         // the list of valid properties
         +Object errors  // null or a list of properties with errors
         +Object warnings // null or a list of properties with warnings
     setTitle(String someText)$ Note  // sets the title and returns this
     getTitle()$ String // returns the title of the validation
     setTestSubject(Object objectBeingValidate)$ // sets the title and returns this
     getTestSubject()   Object   // returns the object validated
     getValids()    Object // returns a list of all valid properties
     addValid( String propertyName, Object note )
            note can be a string, or other object.
     removeValid(propertyName)  // removes any valid note for propertyName
     getErrors()    Object // returns a list of all errored properties
     addError( String propertyName, Object error )
            error can be a string, or an Error or other exception.
     removeError(propertyName)  // removes any error for propertyName
     getWarnings()    Object // returns a list of all warned properties
     addWarning( String propertyName, Object warning )
            warning can be a string, or an Error or other exception.
     removeWarning(propertyName)  // removes any warnings for propertyName
 }
 ```
