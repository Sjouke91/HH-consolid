function pushToDataLayer(data) {
  if (typeof window === 'undefined')
    return console.error('dataLayer not defined');
  window.dataLayer = window.dataLayer || [];
  try {
    window.dataLayer.push(data);
  } catch (error) {
    console.error('An error occurred while pushing data to dataLayer:', error);
  }
}
// Example usage:
// const eventData = {
//   event: 'customEvent',
//   someKey: 'someValue',
// };

export default pushToDataLayer;
