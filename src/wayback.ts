export const WAYBACK_FETCH_OPTIONS: RequestInit = {
  headers: {
    accept: "*/*",
    "cache-control": "no-cache",
    pragma: "no-cache",
  },
  referrer: "https://web.archive.org/",
  method: "GET",
};

export const SENSIBLE_LTR_DEPTH_FIELD_NAMES = [
  "timestamp",
  "original",
  "digest",
  "length",
];

export const FIELD_NAMES = [
  "urlkey",
  "mimetype",
  "statuscode",
  ...SENSIBLE_LTR_DEPTH_FIELD_NAMES,
];
