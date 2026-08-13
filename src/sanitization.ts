import { FIELD_NAMES, SENSIBLE_LTR_DEPTH_FIELD_NAMES } from "./wayback";

export function ValidateTimestamp(timestamp: string) {
  if (!timestamp || timestamp.length === 0) {
    console.error("* [ValidateTimestamp] Failure: No timestamp specified");
    return;
  }

  const is_numerical = /^[0-9]+$/g.test(timestamp);

  if (!is_numerical) {
    console.error(
      "* [ValidateTimestamp] Failure: Timestamp contains non-number characters",
    );
    return;
  }

  if (timestamp.length < 1 || timestamp.length > 14) {
    console.error(
      "* [ValidateTimestamp] Failure: Timestamp outside valid length [1-14]",
    );
    return;
  }

  // Default to first instant of year?
  const timestamp_pieces = [
    parseInt(timestamp.substring(0, 4)),
    parseInt(timestamp.substring(4, 6) || "1"),
    parseInt(timestamp.substring(6, 8) || "1"),
    parseInt(timestamp.substring(8, 10) || "0"),
    parseInt(timestamp.substring(10, 12) || "0"),
    parseInt(timestamp.substring(12, 14) || "0"),
  ];

  const [year, month, date, hours, minutes, seconds] = timestamp_pieces;

  // Wayback timestamps are in UTC-7 btw
  // FUCK MONTHINDEX
  const parsed_timestamp = new Date(
    year,
    Math.max(0, month - 1),
    date,
    hours,
    minutes,
    seconds,
  );

  if (parsed_timestamp.toString() === "Invalid Date") {
    console.error("* [ValidateTimestamp] Failure: Timestamp invalid");
    return;
  }

  const parsed_timestamp_pieces = [
    parsed_timestamp.getFullYear(),
    parsed_timestamp.getMonth() + 1, // FUCK MONTHINDEX
    parsed_timestamp.getDate(),
    parsed_timestamp.getHours(),
    parsed_timestamp.getMinutes(),
    parsed_timestamp.getSeconds(),
  ];

  const timestamp_piece_names = [
    "Year",
    "Month",
    "Day",
    "Hour",
    "Minute",
    "Second",
  ];

  for (let i = 0; i < 6; i++) {
    const timestamp_piece_name = timestamp_piece_names[i];
    const before_value = timestamp_pieces[i];
    const after_value = parsed_timestamp_pieces[i];

    if (before_value !== after_value) {
      console.log(
        "* [ValidateTimestamp]",
        "Failure:",
        timestamp_piece_name,
        "mismatch",
      );
      return;
    }
  }

  return [
    parsed_timestamp_pieces[0],
    ...parsed_timestamp_pieces
      .slice(1)
      .map((piece) => piece.toString().padStart(2, "0")),
  ].join("");
}

export function ValidateCollapse(collapser_csv: string) {
  const collapse_arr = collapser_csv.split(",");

  if (collapse_arr.length === 1 && !collapse_arr[0]) {
    console.log("* [ValidateCollapse] Failure: No collapse specified");
    return;
  }

  const consumed_fields = new Array<string>();

  const sanitized_collapse_arr = collapse_arr
    .map((collapse) => {
      const [field_name, ltr_depth_str] = collapse.split(":");
      const ltr_depth = parseInt(ltr_depth_str);

      if (!FIELD_NAMES.includes(field_name)) {
        console.log(`* [ValidateCollapse] Skipping ${collapse}: Field invalid`);
        return;
      } else if (
        ltr_depth_str &&
        !SENSIBLE_LTR_DEPTH_FIELD_NAMES.includes(field_name)
      ) {
        console.log(
          `* [ValidateCollapse] Skipping ${collapse}: Nonsensical match depth usage`,
        );
        return;
      } else if (ltr_depth_str && isNaN(ltr_depth)) {
        console.log(
          `* [ValidateCollapse] Omitting match depth from ${collapse}: Match depth invalid`,
        );
        return field_name;
      } else if (consumed_fields.includes(field_name)) {
        console.log(
          `* [ValidateCollapse] Skipping ${collapse}: Field already specified`,
        );
        return;
      } else {
        consumed_fields.push(field_name);
        return collapse;
      }
    })
    .filter((collapse) => collapse !== undefined && collapse);

  return sanitized_collapse_arr;
}

export function ValidateFieldSelection(field_csv: string) {
  const field_arr = field_csv.split(",");

  if (field_arr.length === 1 && !field_arr[0]) {
    console.log("* [ValidateFieldSelection] Failure: No fields specified");
    return;
  }

  const consumed_fields = new Array<string>();

  const sanitized_field_arr = field_arr
    .map((field_name) => {
      if (!FIELD_NAMES.includes(field_name)) {
        console.log(
          `* [ValidateFieldSelection] Skipping ${field_name}: Field invalid`,
        );
        return;
      } else if (consumed_fields.includes(field_name)) {
        console.log(
          `* [ValidateFieldSelection] Skipping ${field_name}: Field already specified`,
        );
        return;
      } else {
        consumed_fields.push(field_name);
        return field_name;
      }
    })
    .filter((collapse) => collapse !== undefined && collapse);

  return sanitized_field_arr;
}
