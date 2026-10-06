export function errorHandler(
  error,
  req,
  res,
  next
) {
  const status =
    Number.isInteger(error.status)
      ? error.status
      : 500;

  const title =
    error.title ?? 'Internal Server Error';

  const detail =
    status === 500
      ? 'An unexpected error occurred'
      : error.detail ?? title;

  const response = {
    type: 'about:blank',
    title,
    status,
    detail,
    instance: req.originalUrl,
    requestId: req.requestId
  };

  if (error.extras) {
    Object.assign(
      response,
      error.extras
    );
  }

  // Log full details for 5xx only; a 4xx is the
  // client's fault and is already in the response.
  if (status >= 500) {
    console.error(
      `[${req.requestId ?? 'no-request-id'}]`,
      error
    );
  }

  res
    .status(status)
    .type('application/problem+json')
    .json(response);
}