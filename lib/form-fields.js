// Multipart fields with the same name retain each selection in request order.
export function addFormField(fields, name, value) {
  if (!Object.prototype.hasOwnProperty.call(fields, name)) {
    fields[name] = value;
  } else if (Array.isArray(fields[name])) {
    fields[name].push(value);
  } else {
    fields[name] = [fields[name], value];
  }
}
