import type { $CDXField, $CDXQueryOptions } from "./types";
import { AsyncConfirm, Prompter } from "./prompter";

import {
  ValidateTimestamp,
  ValidateCollapse,
  ValidateFieldSelection,
  ValidateTimestampRange,
} from "./sanitization";
import { Interface } from "node:readline";

export async function Prompt(io: Interface) {
  console.log("* [Prompt] Form: Common values");

  const common_prompt = [
    "URL",
    "Match Type <exact | prefix | host | domain>",
    "From <timestamp>",
    "To <timetamp>",
    "Fields <field> CSV",
    "Filters [!]<field>:<java-regex> CSV", // this one's gonna fucking suck, gotta do something like || to separate them :sob:
    "Collapses <field>:<ltr-depth> CSV",
  ];

  const common_answers = await Prompter(io, ...common_prompt);

  const [
    url_str,
    match_type,
    from_timestamp_str,
    to_timestamp_str,
    field_csv,
    filter_csv,
    collapse_csv,
  ] = common_answers;

  const url = URL.parse(url_str);

  if (!url) {
    console.log("* [Prompt] Failed: URL invalid.");
    return;
  }

  const cdx_query_options: $CDXQueryOptions = {
    url,
  };

  const from_timestamp =
    from_timestamp_str && ValidateTimestamp(from_timestamp_str);

  const to_timestamp = to_timestamp_str && ValidateTimestamp(to_timestamp_str);

  if (
    from_timestamp &&
    to_timestamp &&
    !ValidateTimestampRange(from_timestamp_str, to_timestamp_str)
  )
    return;

  if (from_timestamp) {
    cdx_query_options.from = from_timestamp;
  }

  if (to_timestamp) {
    cdx_query_options.to = to_timestamp;
  }

  const collapse_arr = collapse_csv && ValidateCollapse(collapse_csv);

  if (collapse_arr && collapse_arr.length > 0) {
    cdx_query_options.collapse = collapse_arr;
  }

  const field_arr = field_csv && ValidateFieldSelection(field_csv);

  if (field_arr && field_arr.length > 0) {
    cdx_query_options.fl = field_arr as $CDXField[];
  }

  const confirm = await AsyncConfirm(io, "Confirm common prompt values");

  if (!confirm) return;

  // console.log("* [Prompt] Form: Limit values");
  // console.log("* [Prompt] Form: Sequential querying values");
  // console.log("* [Prompt] Form: Parallel querying values");

  return cdx_query_options;
}
