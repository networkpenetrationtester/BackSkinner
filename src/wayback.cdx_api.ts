import { LoggedFetchWrapper } from "./fetch_wrapper";
import { $CDXQueryOptions } from "./types";
import { WAYBACK_FETCH_OPTIONS } from "./wayback";

export async function GetCDXPage(args: $CDXQueryOptions) {
  const request_url =
    "https://web.archive.org/cdx/search/cdx" +
    ("?url=" + encodeURIComponent(args.url.href)) +
    (args.match_type ? "&matchType=" + args.match_type : "") +
    (args.gzip === false ? "&gzip=false" : "") +
    (args.json ? "&json=true" : "") +

    (args.from && )

    (args.show_num_pages ? "&showNumPages=true" : "") +
    (args.page_size ? "&pageSize=" + args.page_size : "") +
    (args.collapse
      ? "&collapse=" +
        args.collapse
          .map((c) => (c.field + c.ltr_depth ? ":" + c.ltr_depth : ""))
          .join("&collapse=")
      : "") +
    (args.json ? "&json=true" : "");

  const request = await LoggedFetchWrapper<string>({
    url: request_url,
    options: WAYBACK_FETCH_OPTIONS,
    handler: async (res) => await res.text(),
  });

  if (request.success) return request.result;
}

export async function GetCDXPageCount(args: $CDXQueryOptions) {
  const page_count = parseInt(
    (await GetCDXPage({
      ...args,
      show_num_pages: true,
    })) ?? "-1",
  );

  if (page_count < 1) {
    console.log(`* [GetCDXPageCount] Error: Unable to determine page count...`);
  } else if (page_count === 1) {
    console.log(`* [GetCDXPageCount] Page Count: ${page_count}`);
    console.log(
      `* [GetCDXPageCount] Results: Approximately <= ${(args.page_size ?? 50) * 3000} results (in total)`,
    );
  } else if (page_count > 1) {
    console.log(`* [GetCDXPageCount] Page Count: ${page_count}`);
    console.log(
      `* [GetCDXPageCount] Results: Approximately <= ${(args.page_size ?? 50) * 3000} results per page`,
    );
    console.log(
      `* [GetCDXPageCount] Total: Approximately <= ${(args.page_size ?? 50) * 3000 * page_count} results in total`,
    );
  }

  return page_count;
}

export async function GetAllCDXPages(args: $CDXQueryOptions) {
  const page_count = await GetCDXPageCount(args);
}
