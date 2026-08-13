import type {
  $FetchResponse,
  $FetchFailure,
  $FetchSuccess,
  $FetchHandler,
} from "./types";

export async function FetchWrapper<T>(args: {
  url: string;
  options?: RequestInit;
  handler?: $FetchHandler<T>;
}): Promise<$FetchResponse<T>> {
  return await fetch(args.url, args.options ?? {})
    .then(async (response) => {
      if (response.status < 200 || response.status >= 300) {
        const response_text = await response.text();

        return {
          success: false,
          status_code: response.status,
          status_message: `HTTP Error: ${response.statusText}`,
          result: response_text,
        } as $FetchFailure;
      } else {
        return {
          success: true,
          status_code: response.status,
          status_message: `HTTP Success: ${response.statusText}`,
          result: args.handler ? await args.handler(response) : response,
        } as $FetchSuccess<T>;
      }
    })
    .catch((reason) => {
      return {
        success: false,
        status_code: 0,
        status_message: `Fetch Error: ${reason}`,
        result: undefined,
      } as $FetchFailure;
    });
}

export async function LoggedFetchWrapper<T>(args: {
  url: string;
  options?: RequestInit;
  handler?: $FetchHandler<T>;
}) {
  const request = await FetchWrapper(args);

  console.log(
    "* [LoggedFetchWrapper]",
    request.status_message,
    `(${request.status_code})`,
    args.url,
  );

  return request;
}
