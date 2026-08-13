export type $FetchShared = {
  status_code: number;
  status_message: string;
};

export type $FetchSuccess<T> = $FetchShared & {
  success: true;
  result: T;
};

export type $FetchFailure = $FetchShared & {
  success: false;
  result: any | undefined;
};

export type $FetchResponse<T> = $FetchSuccess<T> | $FetchFailure;

export type $FetchHandler<T> = (res: Response) => Promise<T> | T;

export type $CDXField =
  | "urlkey"
  | "timestamp"
  | "original"
  | "mimetype"
  | "statuscode"
  | "digest"
  | "length";
// | dupecount;

export type $CDXMatchType = "exact" | "prefix" | "host" | "domain"; // set implicitly by *.domain.com or domain.com/*

export type $CDXFilter = {
  invert: boolean;
  field: $CDXField;
  java_regex: string;
};

export type $CDXCollapse = {
  field: $CDXField;
  ltr_depth?: number;
};

export type $CDXQueryOptions = {
  // URL OPTIONS
  url: URL; // url
  match_type?: $CDXMatchType; // matchType (default exact)

  // RESPONSE ENCODING
  gzip?: boolean; // gzip (default true)
  json?: boolean // output (default cdx) // JSON LAGS SO MUCH

  // DATE RANGE
  from?: string; // from (default none): <yyyyMMddmmhhss>[1:14]
  to?: string; // to (default none): <yyyyMMddmmhhss>[1:14]

  // FIELD OPTIONS
  fl?: $CDXField[]; // fl (default all in $CDXField order): <field>,<field>,...
  filters?: $CDXFilter[]; // filter & filter & ... (default none): [!]<field>:<java-regex>
  collapse?: $CDXCollapse[]; // collapse & collapse & ... (default timestamp:10): <field>:<ltr-depth>

  // LIMIT
  limit?: number; // limit (default none): -<i> for last <i> results, +<i> for first <i> results
  fast_latest?: boolean; // fastLatest (default none)
  offset?: number; // offset (default 0)

  // SEQUENTIAL QUERYING
  show_resume_key?: boolean; // showResumeKey (default false)
  resume_key?: string; // resumeKey (default none)

  // PARALLEL QUERYING
  show_num_pages?: boolean; // showNumPages (default false)
  page_size?: number; // pageSize (default 1 zipnum block ~ up to 3000 results per pagesize)
  page?: number; // page (default 0): determined with showNumPages [0-numPages] // if there is only one page, 0 = all results...

  // NOT IMPLEMENTED?
  // show_dupe_count?: boolean; // showDupeCount (default false)
  // show_skip_count?: boolean;
  // last_skip_timestamp?: boolean;
};

export type $CDXResult = {
  urlkey: string;
  timestamp: string;
  original: string;
  mimetype: string;
  statuscode: string;
  digest: string;
  length: string;
  // dupecount
};
