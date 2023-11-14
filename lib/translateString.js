//define translate here and pass down
export function translateString(dictionary) {
  if (!dictionary) {
    throw new Error(`Dictionary object is missing!`);
  }

  return function (group, property) {
    if (!group || !property) {
      console.info(`Group = ${group} | Property = ${property}`);
      throw new Error(
        'translateString| Missing dictionary or keyString parameter',
      );
    }
    return dictionary?.[group]?.[property] || property;
  };
}
