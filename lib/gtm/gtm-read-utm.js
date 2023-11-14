function readUtm() {
  if (!window) {
    return;
  }
  const utms = window.sessionStorage.getItem('utms');

  if (!utms) return;

  const parts = utms.split('|');
  const dict = {
    utmcsr: 'source',
    utmcmd: 'medium',
    utmccn: 'campaign',
    utmcct: 'content',
    utmctr: 'keyword',
    utmgclid: 'googleclid',
    utmdclid: 'dcclid',
  };
  let output = {};
  let part, key, val, i;

  for (i = 0; i < parts.length; i++) {
    part = parts[i].split('=');
    key = part[0];
    val = part[1];

    output[dict[key]] = val;
  }

  return output;
}

export default readUtm;
