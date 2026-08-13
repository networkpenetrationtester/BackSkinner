import type { $CDXCollapse, $CDXField, $CDXQueryOptions } from "./types";
import { AsyncConfirm, Prompter } from "./prompter";

import {
  ValidateTimestamp,
  ValidateCollapse,
  ValidateFieldSelection,
  ValidateTimestampRange,
} from "./sanitization";

export async function Prompt() {
  const questions = [
    "URL",
    "From Timestamp",
    "To Timestamp",
    "Collapse CSV",
    "Field Selection CSV",
    // "URL <url>",
    // "CDX Page Size <int> [50]",
    // "Collapse Field <field>:<ltr_depth>, ... [digest]",
    // "Search Flags",
    // "Year Range yyyy-yyyy|* [*]",
    // "Unmodified y|n [y]",
    // "Storage db|dir [dir]",
    // "Keep Failed y|n [n]",
    // "Retry Failed y|n [y]",
    // "Log File y|n [n]",
  ];

  const answers = await Prompter(...questions);

  const [
    url_str,
    timestamp_from_str,
    timestamp_to_str,
    collapse_csv,
    field_csv,
    // url_str,
    // page_size_str,
    // collapse_csv,
    // search_flags,
    // year_range,
    // unmodified,
    // storage,
    // keep_failed,
    // retry_failed,
    // log_file,
  ] = answers;

  const url = URL.parse(url_str);

  if (!url) {
    console.log("* [Prompt] Failed: URL invalid.");
    return;
  }

  const cdx_query_options: $CDXQueryOptions = {
    url,
  };

  const timestamp_from = timestamp_from_str
    ? ValidateTimestamp(timestamp_from_str)
    : "*";

  const timestamp_to = timestamp_to_str
    ? ValidateTimestamp(timestamp_to_str)
    : "*";

  // move to validate range

  if (!ValidateTimestampRange(timestamp_from_str, timestamp_to_str)) return;

  if (timestamp_from !== "*") {
    cdx_query_options.from = timestamp_from;
  }

  if (timestamp_to !== "*") {
    cdx_query_options.to = timestamp_to;
  }

  const collapse_arr = ValidateCollapse(collapse_csv);

  if (collapse_arr && collapse_arr.length > 0) {
    cdx_query_options.collapse = collapse_arr;
  }

  const field_arr = ValidateFieldSelection(field_csv);

  if (field_arr && field_arr.length > 0) {
    cdx_query_options.fl = field_arr as $CDXField[];
  }

  const confirm = await AsyncConfirm("form values");

  if (!confirm) return;

  return cdx_query_options;
}
