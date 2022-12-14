export function toQuery(params: any, delimiter = "&") {
  const keys = Object.keys(params);

  return keys.reduce((str, key, index) => {
    let query = `${str}${key}=${params[key]}`;

    if (index < keys.length - 1) {
      query += delimiter;
    }

    return query;
  }, "");
}

export function toParams(query: string) {
  const q = query.replace(/^\??\//, "");

  return q.split("&").reduce((values: any, param) => {
    const [key, value] = param.split("=");

    values[key] = decodeURIComponent(value);

    return values;
  }, {});
}
