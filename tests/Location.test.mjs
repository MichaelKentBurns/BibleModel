
import test from 'node:test';
import * as assert from "node:assert";
import { Book } from '../Book.mjs';
import {Bible} from "../Bible.mjs";
import {Location} from "../Location.mjs";

const ordinal = 40;
const name = "Matthew";
const abbreviation = "Mt";
const cat = "New Testament Narrative";
const title = "The Gospel According to Matthew";
const nChapters = 28;
let matthewByName;

test('Parse some references', () => {
    const theRefs = [ 'gen', 'Gen', '  Genesis'];
    theRefs.forEach( (aRef) => {
       let theLocation = Location.referenceToLocation(aRef);  console.log(`ref=${aRef}`,theLocation);
    });
});

