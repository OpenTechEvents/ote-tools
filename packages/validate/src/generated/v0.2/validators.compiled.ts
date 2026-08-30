// GENERATED FILE — DO NOT EDIT.
// Standalone validator code for the OTE Spec 0.2.0 schemas, compiled from
// @opentechevents/schema by Ajv at codegen time — see
// scripts/compile-validators.mjs for why this is precompiled rather than
// compiled at runtime (short version: no `new Function`, so no
// 'unsafe-eval' in the CSP of any page that runs it).
// Regenerate with: pnpm gen
// A guard test (test/compiled-validators.test.ts) fails if this drifts.
// @ts-nocheck -- machine-generated JavaScript, not authored/typed here.

import ucs2lengthRuntimeModule from "ajv/dist/runtime/ucs2length.js";
import { formats, keywords } from "../../compiled-scope.js";
const ucs2lengthRuntime = ucs2lengthRuntimeModule.default ?? ucs2lengthRuntimeModule;

export const validateEvent = validate21;
const schema32 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://opentechevents.org/schema/v0.2/event.schema.json","title":"OTE Event","description":"A single tech community event. See https://opentechevents.org for the normative prose.","allOf":[{"$ref":"#/$defs/event"},{"type":"object","description":"A standalone event document must carry its own specVersion and license. Inside a feed, both are inherited from the feed.","required":["specVersion","license"]}],"$defs":{"event":{"type":"object","required":["id","name","startDate","timezone"],"properties":{"specVersion":{"description":"Version of OTE Spec this document adheres to.","const":"0.2.0","examples":["0.2.0"]},"id":{"description":"Stable, globally unique identifier. A URI under a domain the publisher controls. Minted once, never rewritten — this is what lets consumers update an event instead of duplicating it.","type":"string","format":"uri","pattern":"^[a-zA-Z][a-zA-Z0-9+.-]*:","examples":["https://pyalmeria.example/eventos/2026-06-async","https://calendar.example/ics/rust-madrid#a1b2c3d4-uid"]},"url":{"description":"Canonical URL where the event is described today. May change over time; id may not.","type":"string","format":"uri","pattern":"^https?://","examples":["https://pyalmeria.example/eventos/2026-06-async"]},"name":{"description":"Display name of the event.","type":"string","minLength":1,"examples":["PyAlmería — Introducción a async/await"]},"description":{"description":"Short description. Plain text or Markdown.","type":"string","examples":["Charla introductoria a la programación asíncrona en Python, con ejemplos en vivo."]},"timezone":{"description":"IANA timezone (e.g. Europe/Madrid). Turns a wall-clock startDate into an unambiguous instant. For all-day events it contextualises the date — it does not shift it.","type":"string","pattern":"^[A-Za-z_]+(?:/[A-Za-z0-9_+-]+)+$|^UTC$","examples":["Europe/Madrid","America/Bogota","UTC"]},"startDate":{"description":"Wall-clock start: a date (2026-10-15) for all-day events, or a local date-time (2026-10-15T09:00:00). Never carries a UTC offset — timezone does that.","$ref":"#/$defs/wallClock","examples":["2026-06-11T18:30:00","2026-10-15"]},"endDate":{"description":"Wall-clock end, in the SAME form as startDate (both dates, or both date-times). If absent, the event is assumed to end on the day it starts.","$ref":"#/$defs/wallClock","examples":["2026-06-11T20:00:00","2026-10-16"]},"license":{"description":"License of THIS DATA, not of the event. SPDX identifier (CC0-1.0, CC-BY-4.0…, full list at https://spdx.org/licenses/) or a URL.","$ref":"#/$defs/license","examples":["CC-BY-4.0","CC0-1.0"]},"location":{"$ref":"#/$defs/location","examples":[{"venue":"El Cable, Almería"},{"onlineUrl":"https://meet.example/pyalmeria"},{"venue":"Campus Madrid, Calle de Moreno Nieto 2, Madrid","onlineUrl":"https://meet.example/rust-madrid"}]},"attendanceMode":{"description":"What the organiser says this event is. NO DEFAULT: absent means unknown, never in-person.","enum":["in-person","online","hybrid"],"examples":["in-person","online","hybrid"]},"languages":{"description":"BCP 47 tags, e.g. [\"es\",\"en\"]. No default: absent means unknown.","type":"array","items":{"type":"string","pattern":"^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$"},"minItems":1,"examples":[["es"],["es","en"]]},"tags":{"description":"Free-form topic tags. Maps to iCal CATEGORIES and schema.org keywords. A controlled vocabulary may layer on top later; the field itself stays free. No default: absent means unknown.","type":"array","items":{"type":"string","minLength":1},"minItems":1,"examples":[["rust","wasm"],["python","async"]]},"status":{"description":"A cancelled or postponed event MUST stay published: removing it leaves a dead event in subscribers' calendars.","enum":["scheduled","cancelled","postponed","rescheduled"],"default":"scheduled","examples":["scheduled","cancelled"]},"source":{"description":"Provenance. Required when the event was imported or aggregated from elsewhere; omitted when the organiser describes their own event — they are the source.","$ref":"#/$defs/source","examples":[{"name":"Rust Madrid","url":"https://calendar.example/ics/rust-madrid","license":"CC-BY-4.0","retrievedAt":"2026-06-01T05:00:00Z"}]},"updatedAt":{"description":"Instant the event's DATA last changed — equivalent to iCal LAST-MODIFIED, not DTSTAMP (which marks generation and changes on every export). Lets a consumer sync incrementally: fetch only what changed since its last read. Absent means unknown, not 'never changed'.","$ref":"#/$defs/instant","examples":["2026-06-10T18:00:00Z"]}},"allOf":[{"description":"startDate and endDate must be of the same form: two all-day dates, or two local date-times.","oneOf":[{"properties":{"startDate":{"$ref":"#/$defs/date"},"endDate":{"$ref":"#/$defs/date"}},"type":"object"},{"properties":{"startDate":{"$ref":"#/$defs/dateTime"},"endDate":{"$ref":"#/$defs/dateTime"}},"type":"object"}]}]},"date":{"type":"string","pattern":"^\\d{4}-\\d{2}-\\d{2}$"},"dateTime":{"type":"string","pattern":"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$"},"wallClock":{"type":"string","anyOf":[{"$ref":"#/$defs/date"},{"$ref":"#/$defs/dateTime"}]},"instant":{"description":"An absolute point in time, WITH offset or Z. Used for metadata (when data was fetched), never for when an event happens.","type":"string","pattern":"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"},"license":{"type":"string","minLength":2,"pattern":"^([A-Za-z0-9.+-]+|https?://.+)$"},"location":{"description":"What is KNOWN about where the event happens. Not the same question as attendanceMode, which states the organiser's intent.","type":"object","properties":{"venue":{"description":"Human-readable physical location. Its presence means the event has a physical venue.","type":"string","minLength":1,"examples":["El Cable, Almería"]},"onlineUrl":{"description":"URL to attend online. Its presence means the event has online access.","type":"string","format":"uri","pattern":"^https?://","examples":["https://meet.example/pyalmeria"]},"geo":{"description":"Coordinates of the physical venue (WGS-84 decimal degrees). Independent of venue, which is free text — a point, not a name. Maps to iCal GEO and schema.org Place.geo (GeoCoordinates).","type":"object","required":["lat","lon"],"properties":{"lat":{"description":"Latitude in decimal degrees.","type":"number","minimum":-90,"maximum":90,"examples":[40.4168]},"lon":{"description":"Longitude in decimal degrees.","type":"number","minimum":-180,"maximum":180,"examples":[-3.7038]}}}},"anyOf":[{"required":["venue"]},{"required":["onlineUrl"]}]},"source":{"type":"object","required":["name"],"properties":{"name":{"description":"Name of the origin (e.g. \"Rust Madrid\", \"Meetup\").","type":"string","minLength":1,"examples":["Rust Madrid","Meetup"]},"url":{"description":"Link to the original record, so the data can be verified and corrected upstream.","type":"string","format":"uri","pattern":"^https?://","examples":["https://calendar.example/ics/rust-madrid"]},"license":{"description":"License under which the ORIGIN publishes the data. Constrains what may be republished: declaring a license does not grant rights the origin never gave.","$ref":"#/$defs/license","examples":["CC-BY-4.0"]},"retrievedAt":{"description":"When the data was fetched.","$ref":"#/$defs/instant","examples":["2026-06-01T05:00:00Z"]}}}}};
const schema33 = {"type":"object","required":["id","name","startDate","timezone"],"properties":{"specVersion":{"description":"Version of OTE Spec this document adheres to.","const":"0.2.0","examples":["0.2.0"]},"id":{"description":"Stable, globally unique identifier. A URI under a domain the publisher controls. Minted once, never rewritten — this is what lets consumers update an event instead of duplicating it.","type":"string","format":"uri","pattern":"^[a-zA-Z][a-zA-Z0-9+.-]*:","examples":["https://pyalmeria.example/eventos/2026-06-async","https://calendar.example/ics/rust-madrid#a1b2c3d4-uid"]},"url":{"description":"Canonical URL where the event is described today. May change over time; id may not.","type":"string","format":"uri","pattern":"^https?://","examples":["https://pyalmeria.example/eventos/2026-06-async"]},"name":{"description":"Display name of the event.","type":"string","minLength":1,"examples":["PyAlmería — Introducción a async/await"]},"description":{"description":"Short description. Plain text or Markdown.","type":"string","examples":["Charla introductoria a la programación asíncrona en Python, con ejemplos en vivo."]},"timezone":{"description":"IANA timezone (e.g. Europe/Madrid). Turns a wall-clock startDate into an unambiguous instant. For all-day events it contextualises the date — it does not shift it.","type":"string","pattern":"^[A-Za-z_]+(?:/[A-Za-z0-9_+-]+)+$|^UTC$","examples":["Europe/Madrid","America/Bogota","UTC"]},"startDate":{"description":"Wall-clock start: a date (2026-10-15) for all-day events, or a local date-time (2026-10-15T09:00:00). Never carries a UTC offset — timezone does that.","$ref":"#/$defs/wallClock","examples":["2026-06-11T18:30:00","2026-10-15"]},"endDate":{"description":"Wall-clock end, in the SAME form as startDate (both dates, or both date-times). If absent, the event is assumed to end on the day it starts.","$ref":"#/$defs/wallClock","examples":["2026-06-11T20:00:00","2026-10-16"]},"license":{"description":"License of THIS DATA, not of the event. SPDX identifier (CC0-1.0, CC-BY-4.0…, full list at https://spdx.org/licenses/) or a URL.","$ref":"#/$defs/license","examples":["CC-BY-4.0","CC0-1.0"]},"location":{"$ref":"#/$defs/location","examples":[{"venue":"El Cable, Almería"},{"onlineUrl":"https://meet.example/pyalmeria"},{"venue":"Campus Madrid, Calle de Moreno Nieto 2, Madrid","onlineUrl":"https://meet.example/rust-madrid"}]},"attendanceMode":{"description":"What the organiser says this event is. NO DEFAULT: absent means unknown, never in-person.","enum":["in-person","online","hybrid"],"examples":["in-person","online","hybrid"]},"languages":{"description":"BCP 47 tags, e.g. [\"es\",\"en\"]. No default: absent means unknown.","type":"array","items":{"type":"string","pattern":"^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$"},"minItems":1,"examples":[["es"],["es","en"]]},"tags":{"description":"Free-form topic tags. Maps to iCal CATEGORIES and schema.org keywords. A controlled vocabulary may layer on top later; the field itself stays free. No default: absent means unknown.","type":"array","items":{"type":"string","minLength":1},"minItems":1,"examples":[["rust","wasm"],["python","async"]]},"status":{"description":"A cancelled or postponed event MUST stay published: removing it leaves a dead event in subscribers' calendars.","enum":["scheduled","cancelled","postponed","rescheduled"],"default":"scheduled","examples":["scheduled","cancelled"]},"source":{"description":"Provenance. Required when the event was imported or aggregated from elsewhere; omitted when the organiser describes their own event — they are the source.","$ref":"#/$defs/source","examples":[{"name":"Rust Madrid","url":"https://calendar.example/ics/rust-madrid","license":"CC-BY-4.0","retrievedAt":"2026-06-01T05:00:00Z"}]},"updatedAt":{"description":"Instant the event's DATA last changed — equivalent to iCal LAST-MODIFIED, not DTSTAMP (which marks generation and changes on every export). Lets a consumer sync incrementally: fetch only what changed since its last read. Absent means unknown, not 'never changed'.","$ref":"#/$defs/instant","examples":["2026-06-10T18:00:00Z"]}},"allOf":[{"description":"startDate and endDate must be of the same form: two all-day dates, or two local date-times.","oneOf":[{"properties":{"startDate":{"$ref":"#/$defs/date"},"endDate":{"$ref":"#/$defs/date"}},"type":"object"},{"properties":{"startDate":{"$ref":"#/$defs/dateTime"},"endDate":{"$ref":"#/$defs/dateTime"}},"type":"object"}]}]};
const schema34 = {"type":"string","pattern":"^\\d{4}-\\d{2}-\\d{2}$"};
const schema36 = {"type":"string","pattern":"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$"};
const schema41 = {"type":"string","minLength":2,"pattern":"^([A-Za-z0-9.+-]+|https?://.+)$"};
const schema42 = {"description":"What is KNOWN about where the event happens. Not the same question as attendanceMode, which states the organiser's intent.","type":"object","properties":{"venue":{"description":"Human-readable physical location. Its presence means the event has a physical venue.","type":"string","minLength":1,"examples":["El Cable, Almería"]},"onlineUrl":{"description":"URL to attend online. Its presence means the event has online access.","type":"string","format":"uri","pattern":"^https?://","examples":["https://meet.example/pyalmeria"]},"geo":{"description":"Coordinates of the physical venue (WGS-84 decimal degrees). Independent of venue, which is free text — a point, not a name. Maps to iCal GEO and schema.org Place.geo (GeoCoordinates).","type":"object","required":["lat","lon"],"properties":{"lat":{"description":"Latitude in decimal degrees.","type":"number","minimum":-90,"maximum":90,"examples":[40.4168]},"lon":{"description":"Longitude in decimal degrees.","type":"number","minimum":-180,"maximum":180,"examples":[-3.7038]}}}},"anyOf":[{"required":["venue"]},{"required":["onlineUrl"]}]};
const schema45 = {"description":"An absolute point in time, WITH offset or Z. Used for metadata (when data was fetched), never for when an event happens.","type":"string","pattern":"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"};
const pattern4 = new RegExp("^\\d{4}-\\d{2}-\\d{2}$", "u");
const pattern6 = new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$", "u");
const pattern8 = new RegExp("^[a-zA-Z][a-zA-Z0-9+.-]*:", "u");
const pattern9 = new RegExp("^https?://", "u");
const pattern10 = new RegExp("^[A-Za-z_]+(?:/[A-Za-z0-9_+-]+)+$|^UTC$", "u");
const pattern13 = new RegExp("^([A-Za-z0-9.+-]+|https?://.+)$", "u");
const pattern15 = new RegExp("^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$", "u");
const pattern18 = new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$", "u");
const formats0 = formats.uri;
const func1 = ucs2lengthRuntime;
const schema38 = {"type":"string","anyOf":[{"$ref":"#/$defs/date"},{"$ref":"#/$defs/dateTime"}]};

function validate23(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate23.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(typeof data !== "string"){
const err0 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
const _errs1 = errors;
let valid0 = false;
const _errs2 = errors;
if(typeof data === "string"){
if(!pattern4.test(data)){
const err1 = {instancePath,schemaPath:"#/$defs/date/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
else {
const err2 = {instancePath,schemaPath:"#/$defs/date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs2 === errors;
valid0 = valid0 || _valid0;
const _errs5 = errors;
if(typeof data === "string"){
if(!pattern6.test(data)){
const err3 = {instancePath,schemaPath:"#/$defs/dateTime/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$"+"\""};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
else {
const err4 = {instancePath,schemaPath:"#/$defs/dateTime/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
var _valid0 = _errs5 === errors;
valid0 = valid0 || _valid0;
if(!valid0){
const err5 = {instancePath,schemaPath:"#/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
else {
errors = _errs1;
if(vErrors !== null){
if(_errs1){
vErrors.length = _errs1;
}
else {
vErrors = null;
}
}
}
validate23.errors = vErrors;
return errors === 0;
}
validate23.evaluated = {"dynamicProps":false,"dynamicItems":false};

const schema43 = {"type":"object","required":["name"],"properties":{"name":{"description":"Name of the origin (e.g. \"Rust Madrid\", \"Meetup\").","type":"string","minLength":1,"examples":["Rust Madrid","Meetup"]},"url":{"description":"Link to the original record, so the data can be verified and corrected upstream.","type":"string","format":"uri","pattern":"^https?://","examples":["https://calendar.example/ics/rust-madrid"]},"license":{"description":"License under which the ORIGIN publishes the data. Constrains what may be republished: declaring a license does not grant rights the origin never gave.","$ref":"#/$defs/license","examples":["CC-BY-4.0"]},"retrievedAt":{"description":"When the data was fetched.","$ref":"#/$defs/instant","examples":["2026-06-01T05:00:00Z"]}}};

function validate26(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate26.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.name === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name !== undefined){
let data0 = data.name;
if(typeof data0 === "string"){
if(func1(data0) < 1){
const err1 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
else {
const err2 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.url !== undefined){
let data1 = data.url;
if(typeof data1 === "string"){
if(!pattern9.test(data1)){
const err3 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(!(formats0(data1))){
const err4 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.license !== undefined){
let data2 = data.license;
if(typeof data2 === "string"){
if(func1(data2) < 2){
const err6 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/minLength",keyword:"minLength",params:{limit: 2},message:"must NOT have fewer than 2 characters"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(!pattern13.test(data2)){
const err7 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/pattern",keyword:"pattern",params:{pattern: "^([A-Za-z0-9.+-]+|https?://.+)$"},message:"must match pattern \""+"^([A-Za-z0-9.+-]+|https?://.+)$"+"\""};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
else {
const err8 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.retrievedAt !== undefined){
let data3 = data.retrievedAt;
if(typeof data3 === "string"){
if(!pattern18.test(data3)){
const err9 = {instancePath:instancePath+"/retrievedAt",schemaPath:"#/$defs/instant/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"+"\""};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/retrievedAt",schemaPath:"#/$defs/instant/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
else {
const err11 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
validate26.errors = vErrors;
return errors === 0;
}
validate26.evaluated = {"props":{"name":true,"url":true,"license":true,"retrievedAt":true},"dynamicProps":false,"dynamicItems":false};


function validate22(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate22.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs2 = errors;
let valid1 = false;
let passing0 = null;
const _errs3 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.startDate !== undefined){
let data0 = data.startDate;
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
const err0 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/date/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
else {
const err1 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
if(data.endDate !== undefined){
let data1 = data.endDate;
if(typeof data1 === "string"){
if(!pattern4.test(data1)){
const err2 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/date/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
else {
const err4 = {instancePath,schemaPath:"#/allOf/0/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
var _valid0 = _errs3 === errors;
if(_valid0){
valid1 = true;
passing0 = 0;
var props0 = {};
props0.startDate = true;
props0.endDate = true;
}
const _errs11 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.startDate !== undefined){
let data2 = data.startDate;
if(typeof data2 === "string"){
if(!pattern6.test(data2)){
const err5 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/dateTime/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$"+"\""};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
else {
const err6 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/dateTime/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.endDate !== undefined){
let data3 = data.endDate;
if(typeof data3 === "string"){
if(!pattern6.test(data3)){
const err7 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/dateTime/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$"+"\""};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
else {
const err8 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/dateTime/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
}
else {
const err9 = {instancePath,schemaPath:"#/allOf/0/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
var _valid0 = _errs11 === errors;
if(_valid0 && valid1){
valid1 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid1 = true;
passing0 = 1;
if(props0 !== true){
props0 = props0 || {};
props0.startDate = true;
props0.endDate = true;
}
}
}
if(!valid1){
const err10 = {instancePath,schemaPath:"#/allOf/0/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
else {
errors = _errs2;
if(vErrors !== null){
if(_errs2){
vErrors.length = _errs2;
}
else {
vErrors = null;
}
}
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.name === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.startDate === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "startDate"},message:"must have required property '"+"startDate"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data.timezone === undefined){
const err14 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "timezone"},message:"must have required property '"+"timezone"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(props0 !== true){
props0 = props0 || {};
props0.specVersion = true;
props0.id = true;
props0.url = true;
props0.name = true;
props0.description = true;
props0.timezone = true;
props0.startDate = true;
props0.endDate = true;
props0.license = true;
props0.location = true;
props0.attendanceMode = true;
props0.languages = true;
props0.tags = true;
props0.status = true;
props0.source = true;
props0.updatedAt = true;
}
if(data.specVersion !== undefined){
if("0.2.0" !== data.specVersion){
const err15 = {instancePath:instancePath+"/specVersion",schemaPath:"#/properties/specVersion/const",keyword:"const",params:{allowedValue: "0.2.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.id !== undefined){
let data5 = data.id;
if(typeof data5 === "string"){
if(!pattern8.test(data5)){
const err16 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z][a-zA-Z0-9+.-]*:"},message:"must match pattern \""+"^[a-zA-Z][a-zA-Z0-9+.-]*:"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(!(formats0(data5))){
const err17 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
else {
const err18 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.url !== undefined){
let data6 = data.url;
if(typeof data6 === "string"){
if(!pattern9.test(data6)){
const err19 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(!(formats0(data6))){
const err20 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
else {
const err21 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data.name !== undefined){
let data7 = data.name;
if(typeof data7 === "string"){
if(func1(data7) < 1){
const err22 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
else {
const err23 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data.description !== undefined){
if(typeof data.description !== "string"){
const err24 = {instancePath:instancePath+"/description",schemaPath:"#/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.timezone !== undefined){
let data9 = data.timezone;
if(typeof data9 === "string"){
if(!pattern10.test(data9)){
const err25 = {instancePath:instancePath+"/timezone",schemaPath:"#/properties/timezone/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z_]+(?:/[A-Za-z0-9_+-]+)+$|^UTC$"},message:"must match pattern \""+"^[A-Za-z_]+(?:/[A-Za-z0-9_+-]+)+$|^UTC$"+"\""};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
else {
const err26 = {instancePath:instancePath+"/timezone",schemaPath:"#/properties/timezone/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data.startDate !== undefined){
if(!(validate23.call(this, data.startDate, {instancePath:instancePath+"/startDate",parentData:data,parentDataProperty:"startDate",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
errors = vErrors.length;
}
}
if(data.endDate !== undefined){
if(!(validate23.call(this, data.endDate, {instancePath:instancePath+"/endDate",parentData:data,parentDataProperty:"endDate",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
errors = vErrors.length;
}
}
if(data.license !== undefined){
let data12 = data.license;
if(typeof data12 === "string"){
if(func1(data12) < 2){
const err27 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/minLength",keyword:"minLength",params:{limit: 2},message:"must NOT have fewer than 2 characters"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(!pattern13.test(data12)){
const err28 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/pattern",keyword:"pattern",params:{pattern: "^([A-Za-z0-9.+-]+|https?://.+)$"},message:"must match pattern \""+"^([A-Za-z0-9.+-]+|https?://.+)$"+"\""};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
else {
const err29 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data.location !== undefined){
let data13 = data.location;
const _errs38 = errors;
let valid11 = false;
const _errs39 = errors;
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
if(data13.venue === undefined){
const err30 = {instancePath:instancePath+"/location",schemaPath:"#/$defs/location/anyOf/0/required",keyword:"required",params:{missingProperty: "venue"},message:"must have required property '"+"venue"+"'"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
var _valid1 = _errs39 === errors;
valid11 = valid11 || _valid1;
const _errs40 = errors;
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
if(data13.onlineUrl === undefined){
const err31 = {instancePath:instancePath+"/location",schemaPath:"#/$defs/location/anyOf/1/required",keyword:"required",params:{missingProperty: "onlineUrl"},message:"must have required property '"+"onlineUrl"+"'"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
var _valid1 = _errs40 === errors;
valid11 = valid11 || _valid1;
if(!valid11){
const err32 = {instancePath:instancePath+"/location",schemaPath:"#/$defs/location/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
else {
errors = _errs38;
if(vErrors !== null){
if(_errs38){
vErrors.length = _errs38;
}
else {
vErrors = null;
}
}
}
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
if(data13.venue !== undefined){
let data14 = data13.venue;
if(typeof data14 === "string"){
if(func1(data14) < 1){
const err33 = {instancePath:instancePath+"/location/venue",schemaPath:"#/$defs/location/properties/venue/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
else {
const err34 = {instancePath:instancePath+"/location/venue",schemaPath:"#/$defs/location/properties/venue/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(data13.onlineUrl !== undefined){
let data15 = data13.onlineUrl;
if(typeof data15 === "string"){
if(!pattern9.test(data15)){
const err35 = {instancePath:instancePath+"/location/onlineUrl",schemaPath:"#/$defs/location/properties/onlineUrl/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
if(!(formats0(data15))){
const err36 = {instancePath:instancePath+"/location/onlineUrl",schemaPath:"#/$defs/location/properties/onlineUrl/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
else {
const err37 = {instancePath:instancePath+"/location/onlineUrl",schemaPath:"#/$defs/location/properties/onlineUrl/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
if(data13.geo !== undefined){
let data16 = data13.geo;
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
if(data16.lat === undefined){
const err38 = {instancePath:instancePath+"/location/geo",schemaPath:"#/$defs/location/properties/geo/required",keyword:"required",params:{missingProperty: "lat"},message:"must have required property '"+"lat"+"'"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(data16.lon === undefined){
const err39 = {instancePath:instancePath+"/location/geo",schemaPath:"#/$defs/location/properties/geo/required",keyword:"required",params:{missingProperty: "lon"},message:"must have required property '"+"lon"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data16.lat !== undefined){
let data17 = data16.lat;
if((typeof data17 == "number") && (isFinite(data17))){
if(data17 > 90 || isNaN(data17)){
const err40 = {instancePath:instancePath+"/location/geo/lat",schemaPath:"#/$defs/location/properties/geo/properties/lat/maximum",keyword:"maximum",params:{comparison: "<=", limit: 90},message:"must be <= 90"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data17 < -90 || isNaN(data17)){
const err41 = {instancePath:instancePath+"/location/geo/lat",schemaPath:"#/$defs/location/properties/geo/properties/lat/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
else {
const err42 = {instancePath:instancePath+"/location/geo/lat",schemaPath:"#/$defs/location/properties/geo/properties/lat/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data16.lon !== undefined){
let data18 = data16.lon;
if((typeof data18 == "number") && (isFinite(data18))){
if(data18 > 180 || isNaN(data18)){
const err43 = {instancePath:instancePath+"/location/geo/lon",schemaPath:"#/$defs/location/properties/geo/properties/lon/maximum",keyword:"maximum",params:{comparison: "<=", limit: 180},message:"must be <= 180"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
if(data18 < -180 || isNaN(data18)){
const err44 = {instancePath:instancePath+"/location/geo/lon",schemaPath:"#/$defs/location/properties/geo/properties/lon/minimum",keyword:"minimum",params:{comparison: ">=", limit: -180},message:"must be >= -180"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
else {
const err45 = {instancePath:instancePath+"/location/geo/lon",schemaPath:"#/$defs/location/properties/geo/properties/lon/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
}
else {
const err46 = {instancePath:instancePath+"/location/geo",schemaPath:"#/$defs/location/properties/geo/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
}
else {
const err47 = {instancePath:instancePath+"/location",schemaPath:"#/$defs/location/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
if(data.attendanceMode !== undefined){
let data19 = data.attendanceMode;
if(!(((data19 === "in-person") || (data19 === "online")) || (data19 === "hybrid"))){
const err48 = {instancePath:instancePath+"/attendanceMode",schemaPath:"#/properties/attendanceMode/enum",keyword:"enum",params:{allowedValues: schema33.properties.attendanceMode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data.languages !== undefined){
let data20 = data.languages;
if(Array.isArray(data20)){
if(data20.length < 1){
const err49 = {instancePath:instancePath+"/languages",schemaPath:"#/properties/languages/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
const len0 = data20.length;
for(let i0=0; i0<len0; i0++){
let data21 = data20[i0];
if(typeof data21 === "string"){
if(!pattern15.test(data21)){
const err50 = {instancePath:instancePath+"/languages/" + i0,schemaPath:"#/properties/languages/items/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$"},message:"must match pattern \""+"^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$"+"\""};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
else {
const err51 = {instancePath:instancePath+"/languages/" + i0,schemaPath:"#/properties/languages/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
}
else {
const err52 = {instancePath:instancePath+"/languages",schemaPath:"#/properties/languages/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data.tags !== undefined){
let data22 = data.tags;
if(Array.isArray(data22)){
if(data22.length < 1){
const err53 = {instancePath:instancePath+"/tags",schemaPath:"#/properties/tags/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
const len1 = data22.length;
for(let i1=0; i1<len1; i1++){
let data23 = data22[i1];
if(typeof data23 === "string"){
if(func1(data23) < 1){
const err54 = {instancePath:instancePath+"/tags/" + i1,schemaPath:"#/properties/tags/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
else {
const err55 = {instancePath:instancePath+"/tags/" + i1,schemaPath:"#/properties/tags/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
}
else {
const err56 = {instancePath:instancePath+"/tags",schemaPath:"#/properties/tags/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
if(data.status !== undefined){
let data24 = data.status;
if(!((((data24 === "scheduled") || (data24 === "cancelled")) || (data24 === "postponed")) || (data24 === "rescheduled"))){
const err57 = {instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema33.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
if(data.source !== undefined){
if(!(validate26.call(this, data.source, {instancePath:instancePath+"/source",parentData:data,parentDataProperty:"source",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate26.errors : vErrors.concat(validate26.errors);
errors = vErrors.length;
}
}
if(data.updatedAt !== undefined){
let data26 = data.updatedAt;
if(typeof data26 === "string"){
if(!pattern18.test(data26)){
const err58 = {instancePath:instancePath+"/updatedAt",schemaPath:"#/$defs/instant/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"+"\""};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
else {
const err59 = {instancePath:instancePath+"/updatedAt",schemaPath:"#/$defs/instant/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
}
else {
const err60 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
validate22.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate22.evaluated = {"dynamicProps":true,"dynamicItems":false};


function validate21(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="https://opentechevents.org/schema/v0.2/event.schema.json" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate21.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate22.call(this, data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
errors = vErrors.length;
}
else {
var props0 = validate22.evaluated.props;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.specVersion === undefined){
const err0 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "specVersion"},message:"must have required property '"+"specVersion"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.license === undefined){
const err1 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
else {
const err2 = {instancePath,schemaPath:"#/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
validate21.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate21.evaluated = {"dynamicProps":true,"dynamicItems":false};

export const validateFeed = validate29;
const schema47 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://opentechevents.org/schema/v0.2/feed.schema.json","title":"OTE Feed","description":"A collection of OTE events published at a stable URL. An exchange format, not an API.","type":"object","required":["specVersion","title","license","updatedAt","events"],"properties":{"specVersion":{"description":"Version of OTE Spec this feed adheres to. Applies to every event in it.","const":"0.2.0","examples":["0.2.0"]},"title":{"description":"Human-readable name of the feed.","type":"string","minLength":1,"examples":["Eventos de PyAlmería"]},"description":{"description":"Short description of the feed.","type":"string","examples":["Meetups mensuales de Python en Almería."]},"url":{"description":"Canonical URL of the community, directory or organisation publishing the feed.","type":"string","format":"uri","pattern":"^https?://","examples":["https://pyalmeria.example"]},"license":{"description":"License for the feed's contents. Acts as the DEFAULT for every event that does not declare its own. SPDX identifier (full list at https://spdx.org/licenses/) or URL.","$ref":"https://opentechevents.org/schema/v0.2/event.schema.json#/$defs/license","examples":["CC-BY-4.0","CC0-1.0"]},"licenseUrl":{"description":"URL of the full license text.","type":"string","format":"uri","pattern":"^https?://","examples":["https://creativecommons.org/licenses/by/4.0/"]},"updatedAt":{"description":"When this feed was generated.","$ref":"https://opentechevents.org/schema/v0.2/event.schema.json#/$defs/instant","examples":["2026-07-06T10:00:00Z"]},"events":{"description":"Events in this feed. Each one inherits the feed's specVersion and license unless it declares its own.","type":"array","items":{"$ref":"https://opentechevents.org/schema/v0.2/event.schema.json#/$defs/event"}}}};

function validate30(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate30.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs2 = errors;
let valid1 = false;
let passing0 = null;
const _errs3 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.startDate !== undefined){
let data0 = data.startDate;
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
const err0 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/date/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
else {
const err1 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
if(data.endDate !== undefined){
let data1 = data.endDate;
if(typeof data1 === "string"){
if(!pattern4.test(data1)){
const err2 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/date/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
else {
const err4 = {instancePath,schemaPath:"#/allOf/0/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
var _valid0 = _errs3 === errors;
if(_valid0){
valid1 = true;
passing0 = 0;
var props0 = {};
props0.startDate = true;
props0.endDate = true;
}
const _errs11 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.startDate !== undefined){
let data2 = data.startDate;
if(typeof data2 === "string"){
if(!pattern6.test(data2)){
const err5 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/dateTime/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$"+"\""};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
else {
const err6 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/dateTime/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.endDate !== undefined){
let data3 = data.endDate;
if(typeof data3 === "string"){
if(!pattern6.test(data3)){
const err7 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/dateTime/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$"+"\""};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
else {
const err8 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/dateTime/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
}
else {
const err9 = {instancePath,schemaPath:"#/allOf/0/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
var _valid0 = _errs11 === errors;
if(_valid0 && valid1){
valid1 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid1 = true;
passing0 = 1;
if(props0 !== true){
props0 = props0 || {};
props0.startDate = true;
props0.endDate = true;
}
}
}
if(!valid1){
const err10 = {instancePath,schemaPath:"#/allOf/0/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
else {
errors = _errs2;
if(vErrors !== null){
if(_errs2){
vErrors.length = _errs2;
}
else {
vErrors = null;
}
}
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.name === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.startDate === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "startDate"},message:"must have required property '"+"startDate"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data.timezone === undefined){
const err14 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "timezone"},message:"must have required property '"+"timezone"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(props0 !== true){
props0 = props0 || {};
props0.specVersion = true;
props0.id = true;
props0.url = true;
props0.name = true;
props0.description = true;
props0.timezone = true;
props0.startDate = true;
props0.endDate = true;
props0.license = true;
props0.location = true;
props0.attendanceMode = true;
props0.languages = true;
props0.tags = true;
props0.status = true;
props0.source = true;
props0.updatedAt = true;
}
if(data.specVersion !== undefined){
if("0.2.0" !== data.specVersion){
const err15 = {instancePath:instancePath+"/specVersion",schemaPath:"#/properties/specVersion/const",keyword:"const",params:{allowedValue: "0.2.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.id !== undefined){
let data5 = data.id;
if(typeof data5 === "string"){
if(!pattern8.test(data5)){
const err16 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z][a-zA-Z0-9+.-]*:"},message:"must match pattern \""+"^[a-zA-Z][a-zA-Z0-9+.-]*:"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(!(formats0(data5))){
const err17 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
else {
const err18 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.url !== undefined){
let data6 = data.url;
if(typeof data6 === "string"){
if(!pattern9.test(data6)){
const err19 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(!(formats0(data6))){
const err20 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
else {
const err21 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data.name !== undefined){
let data7 = data.name;
if(typeof data7 === "string"){
if(func1(data7) < 1){
const err22 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
else {
const err23 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data.description !== undefined){
if(typeof data.description !== "string"){
const err24 = {instancePath:instancePath+"/description",schemaPath:"#/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.timezone !== undefined){
let data9 = data.timezone;
if(typeof data9 === "string"){
if(!pattern10.test(data9)){
const err25 = {instancePath:instancePath+"/timezone",schemaPath:"#/properties/timezone/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z_]+(?:/[A-Za-z0-9_+-]+)+$|^UTC$"},message:"must match pattern \""+"^[A-Za-z_]+(?:/[A-Za-z0-9_+-]+)+$|^UTC$"+"\""};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
else {
const err26 = {instancePath:instancePath+"/timezone",schemaPath:"#/properties/timezone/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data.startDate !== undefined){
if(!(validate23.call(this, data.startDate, {instancePath:instancePath+"/startDate",parentData:data,parentDataProperty:"startDate",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
errors = vErrors.length;
}
}
if(data.endDate !== undefined){
if(!(validate23.call(this, data.endDate, {instancePath:instancePath+"/endDate",parentData:data,parentDataProperty:"endDate",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
errors = vErrors.length;
}
}
if(data.license !== undefined){
let data12 = data.license;
if(typeof data12 === "string"){
if(func1(data12) < 2){
const err27 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/minLength",keyword:"minLength",params:{limit: 2},message:"must NOT have fewer than 2 characters"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(!pattern13.test(data12)){
const err28 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/pattern",keyword:"pattern",params:{pattern: "^([A-Za-z0-9.+-]+|https?://.+)$"},message:"must match pattern \""+"^([A-Za-z0-9.+-]+|https?://.+)$"+"\""};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
else {
const err29 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data.location !== undefined){
let data13 = data.location;
const _errs38 = errors;
let valid11 = false;
const _errs39 = errors;
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
if(data13.venue === undefined){
const err30 = {instancePath:instancePath+"/location",schemaPath:"#/$defs/location/anyOf/0/required",keyword:"required",params:{missingProperty: "venue"},message:"must have required property '"+"venue"+"'"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
var _valid1 = _errs39 === errors;
valid11 = valid11 || _valid1;
const _errs40 = errors;
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
if(data13.onlineUrl === undefined){
const err31 = {instancePath:instancePath+"/location",schemaPath:"#/$defs/location/anyOf/1/required",keyword:"required",params:{missingProperty: "onlineUrl"},message:"must have required property '"+"onlineUrl"+"'"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
var _valid1 = _errs40 === errors;
valid11 = valid11 || _valid1;
if(!valid11){
const err32 = {instancePath:instancePath+"/location",schemaPath:"#/$defs/location/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
else {
errors = _errs38;
if(vErrors !== null){
if(_errs38){
vErrors.length = _errs38;
}
else {
vErrors = null;
}
}
}
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
if(data13.venue !== undefined){
let data14 = data13.venue;
if(typeof data14 === "string"){
if(func1(data14) < 1){
const err33 = {instancePath:instancePath+"/location/venue",schemaPath:"#/$defs/location/properties/venue/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
else {
const err34 = {instancePath:instancePath+"/location/venue",schemaPath:"#/$defs/location/properties/venue/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(data13.onlineUrl !== undefined){
let data15 = data13.onlineUrl;
if(typeof data15 === "string"){
if(!pattern9.test(data15)){
const err35 = {instancePath:instancePath+"/location/onlineUrl",schemaPath:"#/$defs/location/properties/onlineUrl/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
if(!(formats0(data15))){
const err36 = {instancePath:instancePath+"/location/onlineUrl",schemaPath:"#/$defs/location/properties/onlineUrl/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
else {
const err37 = {instancePath:instancePath+"/location/onlineUrl",schemaPath:"#/$defs/location/properties/onlineUrl/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
if(data13.geo !== undefined){
let data16 = data13.geo;
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
if(data16.lat === undefined){
const err38 = {instancePath:instancePath+"/location/geo",schemaPath:"#/$defs/location/properties/geo/required",keyword:"required",params:{missingProperty: "lat"},message:"must have required property '"+"lat"+"'"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(data16.lon === undefined){
const err39 = {instancePath:instancePath+"/location/geo",schemaPath:"#/$defs/location/properties/geo/required",keyword:"required",params:{missingProperty: "lon"},message:"must have required property '"+"lon"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data16.lat !== undefined){
let data17 = data16.lat;
if((typeof data17 == "number") && (isFinite(data17))){
if(data17 > 90 || isNaN(data17)){
const err40 = {instancePath:instancePath+"/location/geo/lat",schemaPath:"#/$defs/location/properties/geo/properties/lat/maximum",keyword:"maximum",params:{comparison: "<=", limit: 90},message:"must be <= 90"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data17 < -90 || isNaN(data17)){
const err41 = {instancePath:instancePath+"/location/geo/lat",schemaPath:"#/$defs/location/properties/geo/properties/lat/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
else {
const err42 = {instancePath:instancePath+"/location/geo/lat",schemaPath:"#/$defs/location/properties/geo/properties/lat/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data16.lon !== undefined){
let data18 = data16.lon;
if((typeof data18 == "number") && (isFinite(data18))){
if(data18 > 180 || isNaN(data18)){
const err43 = {instancePath:instancePath+"/location/geo/lon",schemaPath:"#/$defs/location/properties/geo/properties/lon/maximum",keyword:"maximum",params:{comparison: "<=", limit: 180},message:"must be <= 180"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
if(data18 < -180 || isNaN(data18)){
const err44 = {instancePath:instancePath+"/location/geo/lon",schemaPath:"#/$defs/location/properties/geo/properties/lon/minimum",keyword:"minimum",params:{comparison: ">=", limit: -180},message:"must be >= -180"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
else {
const err45 = {instancePath:instancePath+"/location/geo/lon",schemaPath:"#/$defs/location/properties/geo/properties/lon/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
}
else {
const err46 = {instancePath:instancePath+"/location/geo",schemaPath:"#/$defs/location/properties/geo/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
}
else {
const err47 = {instancePath:instancePath+"/location",schemaPath:"#/$defs/location/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
if(data.attendanceMode !== undefined){
let data19 = data.attendanceMode;
if(!(((data19 === "in-person") || (data19 === "online")) || (data19 === "hybrid"))){
const err48 = {instancePath:instancePath+"/attendanceMode",schemaPath:"#/properties/attendanceMode/enum",keyword:"enum",params:{allowedValues: schema33.properties.attendanceMode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data.languages !== undefined){
let data20 = data.languages;
if(Array.isArray(data20)){
if(data20.length < 1){
const err49 = {instancePath:instancePath+"/languages",schemaPath:"#/properties/languages/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
const len0 = data20.length;
for(let i0=0; i0<len0; i0++){
let data21 = data20[i0];
if(typeof data21 === "string"){
if(!pattern15.test(data21)){
const err50 = {instancePath:instancePath+"/languages/" + i0,schemaPath:"#/properties/languages/items/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$"},message:"must match pattern \""+"^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$"+"\""};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
else {
const err51 = {instancePath:instancePath+"/languages/" + i0,schemaPath:"#/properties/languages/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
}
else {
const err52 = {instancePath:instancePath+"/languages",schemaPath:"#/properties/languages/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data.tags !== undefined){
let data22 = data.tags;
if(Array.isArray(data22)){
if(data22.length < 1){
const err53 = {instancePath:instancePath+"/tags",schemaPath:"#/properties/tags/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
const len1 = data22.length;
for(let i1=0; i1<len1; i1++){
let data23 = data22[i1];
if(typeof data23 === "string"){
if(func1(data23) < 1){
const err54 = {instancePath:instancePath+"/tags/" + i1,schemaPath:"#/properties/tags/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
else {
const err55 = {instancePath:instancePath+"/tags/" + i1,schemaPath:"#/properties/tags/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
}
else {
const err56 = {instancePath:instancePath+"/tags",schemaPath:"#/properties/tags/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
if(data.status !== undefined){
let data24 = data.status;
if(!((((data24 === "scheduled") || (data24 === "cancelled")) || (data24 === "postponed")) || (data24 === "rescheduled"))){
const err57 = {instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema33.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
if(data.source !== undefined){
if(!(validate26.call(this, data.source, {instancePath:instancePath+"/source",parentData:data,parentDataProperty:"source",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate26.errors : vErrors.concat(validate26.errors);
errors = vErrors.length;
}
}
if(data.updatedAt !== undefined){
let data26 = data.updatedAt;
if(typeof data26 === "string"){
if(!pattern18.test(data26)){
const err58 = {instancePath:instancePath+"/updatedAt",schemaPath:"#/$defs/instant/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"+"\""};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
else {
const err59 = {instancePath:instancePath+"/updatedAt",schemaPath:"#/$defs/instant/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
}
else {
const err60 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
validate30.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate30.evaluated = {"dynamicProps":true,"dynamicItems":false};


function validate29(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="https://opentechevents.org/schema/v0.2/feed.schema.json" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate29.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.specVersion === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "specVersion"},message:"must have required property '"+"specVersion"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.title === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "title"},message:"must have required property '"+"title"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.license === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.updatedAt === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "updatedAt"},message:"must have required property '"+"updatedAt"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.events === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "events"},message:"must have required property '"+"events"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.specVersion !== undefined){
if("0.2.0" !== data.specVersion){
const err5 = {instancePath:instancePath+"/specVersion",schemaPath:"#/properties/specVersion/const",keyword:"const",params:{allowedValue: "0.2.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.title !== undefined){
let data1 = data.title;
if(typeof data1 === "string"){
if(func1(data1) < 1){
const err6 = {instancePath:instancePath+"/title",schemaPath:"#/properties/title/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
else {
const err7 = {instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.description !== undefined){
if(typeof data.description !== "string"){
const err8 = {instancePath:instancePath+"/description",schemaPath:"#/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.url !== undefined){
let data3 = data.url;
if(typeof data3 === "string"){
if(!pattern9.test(data3)){
const err9 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(!(formats0(data3))){
const err10 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.license !== undefined){
let data4 = data.license;
if(typeof data4 === "string"){
if(func1(data4) < 2){
const err12 = {instancePath:instancePath+"/license",schemaPath:"https://opentechevents.org/schema/v0.2/event.schema.json#/$defs/license/minLength",keyword:"minLength",params:{limit: 2},message:"must NOT have fewer than 2 characters"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(!pattern13.test(data4)){
const err13 = {instancePath:instancePath+"/license",schemaPath:"https://opentechevents.org/schema/v0.2/event.schema.json#/$defs/license/pattern",keyword:"pattern",params:{pattern: "^([A-Za-z0-9.+-]+|https?://.+)$"},message:"must match pattern \""+"^([A-Za-z0-9.+-]+|https?://.+)$"+"\""};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/license",schemaPath:"https://opentechevents.org/schema/v0.2/event.schema.json#/$defs/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.licenseUrl !== undefined){
let data5 = data.licenseUrl;
if(typeof data5 === "string"){
if(!pattern9.test(data5)){
const err15 = {instancePath:instancePath+"/licenseUrl",schemaPath:"#/properties/licenseUrl/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(!(formats0(data5))){
const err16 = {instancePath:instancePath+"/licenseUrl",schemaPath:"#/properties/licenseUrl/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/licenseUrl",schemaPath:"#/properties/licenseUrl/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.updatedAt !== undefined){
let data6 = data.updatedAt;
if(typeof data6 === "string"){
if(!pattern18.test(data6)){
const err18 = {instancePath:instancePath+"/updatedAt",schemaPath:"https://opentechevents.org/schema/v0.2/event.schema.json#/$defs/instant/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"+"\""};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
else {
const err19 = {instancePath:instancePath+"/updatedAt",schemaPath:"https://opentechevents.org/schema/v0.2/event.schema.json#/$defs/instant/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.events !== undefined){
let data7 = data.events;
if(Array.isArray(data7)){
const len0 = data7.length;
for(let i0=0; i0<len0; i0++){
if(!(validate30.call(this, data7[i0], {instancePath:instancePath+"/events/" + i0,parentData:data7,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate30.errors : vErrors.concat(validate30.errors);
errors = vErrors.length;
}
}
}
else {
const err20 = {instancePath:instancePath+"/events",schemaPath:"#/properties/events/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
}
else {
const err21 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
validate29.errors = vErrors;
return errors === 0;
}
validate29.evaluated = {"props":{"specVersion":true,"title":true,"description":true,"url":true,"license":true,"licenseUrl":true,"updatedAt":true,"events":true},"dynamicProps":false,"dynamicItems":false};
