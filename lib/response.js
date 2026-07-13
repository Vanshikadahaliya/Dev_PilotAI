export const json = (data, init = {}) => Response.json(data, init);

export const errorResponse = (message, status = 500, extra = {}) =>
  Response.json({ success: false, message, ...extra }, { status });
