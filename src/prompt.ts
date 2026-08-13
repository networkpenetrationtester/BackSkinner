import type { $CDXCollapse, $CDXQueryOptions } from "./types";
import { Prompter } from "./prompter";
import { GetAllCDXPages, GetCDXPageCount } from "./wayback.cdx_api";
import {
  ValidateTimestamp,
  ValidateCollapse,
  ValidateFieldSelection,
} from "./sanitization";

async function Prompt(): Promise<$CDXQueryOptions | undefined> {
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
    console.log("* [PromptLoop] Failed: URL Invalid");
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
  if (!timestamp_from) {
    console.log("* [PromptLoop] Failed: From Timestamp Invalid");
    return;
  } else if (!timestamp_to) {
    console.log("* [PromptLoop] Failed: To Timestamp Invalid");
    return;
  } else if (parseInt(timestamp_from) > parseInt(timestamp_to)) {
    console.log(
      "* [PromptLoop] Failed: From Timestamp Greater Than To Timestamp",
    );
    return;
  }

  if (timestamp_from !== "*") {
    cdx_query_options.from = timestamp_from;
  }

  if (timestamp_to !== "*") {
    cdx_query_options.to = timestamp_to;
  }

  const collapse_arr = collapse_csv ? ValidateCollapse(collapse_csv) : [];
  const field_arr = field_csv ? ValidateFieldSelection(field_csv) : [];

  return cdx_query_options;
}
