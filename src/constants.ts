export const WAYBACK_FETCH_OPTIONS: RequestInit = {
  headers: {
    accept: "*/*",
    "cache-control": "no-cache",
    pragma: "no-cache",
  },
  referrer: "https://web.archive.org/",
  method: "GET",
};

export const CDX_LTR_DEPTH_FIELD_NAMES = [
  "timestamp",
  "original",
  "digest",
  "length",
];

export const CDX_FIELD_NAMES = [
  "urlkey",
  "mimetype",
  "statuscode",
  ...CDX_LTR_DEPTH_FIELD_NAMES,
];
