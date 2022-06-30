import * as util from './lib/ipputil';
import parse from "./lib/parser";
import enums from './lib/enums';
import serialize from "./lib/serializer";
import request from "./lib/request";
import Printer from "./lib/printer";
import versions from "./lib/versions";
import attributes from "./lib/attributes";
import keywords from "./lib/keywords";
import tags from "./lib/tags";
import statusCodes from "./lib/statusCodes";
import StreamParser from "./lib/StreamParser";

const operations = enums['operations-supported'];

const  attribute = {
  // http://www.iana.org/assignments/ipp-registrations/ipp-registrations.xml#ipp-registrations-7
  groups: util.xref(tags.lookup.slice(0x00, 0x0f)),

  // http://www.iana.org/assignments/ipp-registrations/ipp-registrations.xml#ipp-registrations-8
  values: util.xref(tags.lookup.slice(0x10, 0x1f)),

  // http://www.iana.org/assignments/ipp-registrations/ipp-registrations.xml#ipp-registrations-9
  syntaxes: util.xref(tags.lookup.slice(0x20))
};

export {
  parse, serialize, request, Printer, versions, attributes, keywords, enums, tags,
  statusCodes, StreamParser, operations, attribute };

