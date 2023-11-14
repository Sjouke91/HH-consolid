function parseGoogleParams({ str = '' }) {
  const campaignParams = ['source', 'medium', 'campaign', 'term', 'content'];
  const regex = new RegExp(
    '(utm_(' + campaignParams.join('|') + ')|(d|g)clid)=.*?([^&#]*|$)',
    'gi',
  );
  const gaParams = str.match(regex);
  let paramsObj, vals, len, i;

  if (gaParams) {
    paramsObj = {};
    len = gaParams.length;

    for (i = 0; i < len; i++) {
      vals = gaParams[i].split('=');

      if (vals) {
        paramsObj[vals[0]] = vals[1];
      }
    }
  }

  return paramsObj;
}

function parseReferrer({ referrer, referringDomain, thisDomain }) {
  if (!referrer) return;

  const searchEngines = {
    'yahoo.com': {
      p: 'p',
      n: 'yahoo',
    },
    'msn.com': {
      p: 'q',
      n: 'msn',
    },
    'bing.com': {
      p: 'q',
      n: 'live',
    },
    'ask.com': {
      p: 'q',
      n: 'ask',
    },
    'search.com': {
      p: 'q',
      n: 'search',
    },
    google: {
      p: 'q',
      n: 'google',
    },
  };
  const a = document.createElement('a');
  const values = {};
  let searchEngine, termRegex, term;

  a.href = referrer;

  if (a.hostname.indexOf('google') > -1) {
    referringDomain = 'google';
  }

  if (searchEngines[referringDomain]) {
    searchEngine = searchEngines[referringDomain];
    termRegex = new RegExp(searchEngine.p + '=.*?([^&#]*|$)', 'gi');
    term = a.search.match(termRegex);

    values.source = searchEngine.n;
    values.medium = 'organic';

    values.term = (term ? term[0].split('=')[1] : '') || '(not provided)';
  } else if (referringDomain !== thisDomain) {
    values.source = a.hostname;
    values.medium = 'referral';
  }

  return values;
}

function writeUtm(referrer) {
  function getDomain_(url) {
    if (!url) return '';

    let a = document.createElement('a');
    a.href = url;

    try {
      return a.hostname.match(/[^.]*\.[^.]{2,3}(?:\.[^.]{2,3})?$/)[0];
    } catch (squelch) {}
  }

  let gaReferral = {
    utmcsr: '(direct)',
    utmcmd: '(none)',
    utmccn: '(not set)',
  };
  const thisHostname = document.location.hostname;
  const thisDomain = getDomain_(thisHostname);
  const referringDomain = getDomain_(document.referrer);
  const sessionUtmSessionsStorage =
    window.sessionStorage.getItem('session_utms');
  const storedVals = window.sessionStorage.getItem('utms');

  const qs = document.location.search.replace('?', '');
  const hash = document.location.hash.replace('#', '');
  let gaParams = parseGoogleParams({ str: qs + '#' + hash });
  let referringInfo = parseReferrer({
    referrer: referrer,
    referringDomain: referringDomain,
    thisDomain: thisDomain,
  });

  let newSessionVals = [];
  const keyMap = {
    utm_source: 'utmcsr',
    utm_medium: 'utmcmd',
    utm_campaign: 'utmccn',
    utm_content: 'utmcct',
    utm_term: 'utmctr',
    gclid: 'utmgclid',
    dclid: 'utmdclid',
  };
  let keyName, values, _val, _key, raw, key, len, i;

  if (sessionUtmSessionsStorage && referringDomain === thisDomain) {
    gaParams = null;
    referringInfo = null;
  }

  if (gaParams && (gaParams.utm_source || gaParams.gclid || gaParams.dclid)) {
    for (key in gaParams) {
      if (typeof gaParams[key] !== 'undefined') {
        keyName = keyMap[key];
        gaReferral[keyName] = gaParams[key];
      }
    }

    if (gaParams.gclid || gaParams.dclid) {
      gaReferral.utmcsr = 'google';
      gaReferral.utmcmd = gaReferral.utmgclid ? 'cpc' : 'cpm';
    }
  } else if (referringInfo) {
    gaReferral.utmcsr = referringInfo.source;
    gaReferral.utmcmd = referringInfo.medium;
    if (referringInfo.term) gaReferral.utmctr = referringInfo.term;
  } else if (storedVals) {
    values = {};
    raw = storedVals.split('|');
    len = raw.length;

    for (i = 0; i < len; i++) {
      _val = raw[i].split('=');
      _key = _val[0].split('.').pop();
      values[_key] = _val[1];
    }

    gaReferral = values;
  }

  var regexLookup = {
    email:
      /list-manage(.*)\.com|campaign-archive(.*)\.com|mailchi\.mp|mailchimp\.com|mail.*\.(.*)(com|nl|be|it|de|eu|ru|cz|pl)|kpnmail\.nl|outlook\.live\.com|messagerie|deref-|poczta\..*pl/,
    organic:
      /duckduckgo\.com$|search\.yahoo\.com$|search\.tb\.ask\.com$|google\.android\.googlequicksearchbox$|ecosia\.org$/,
    facebook: /facebook\.com$/,
    instagram: /instagram\.com$/,
    linkedin: /(linkedin\.com|lnkd\.in)$/,
    twitter: /^(t\.co|twitter\.com)$/,
    'social-organic': /^(facebook|linkedin|twitter|instagram)$/,
  };

  for (key in regexLookup) {
    if (
      regexLookup[key].test(gaReferral.utmcsr) &&
      gaReferral.utmcmd === 'referral'
    ) {
      gaReferral.utmcmd = key;
      break;
    }
  }

  for (key in gaReferral) {
    if (typeof gaReferral[key] !== 'undefined') {
      if (key === 'utmcsr' || key === 'utmcmd' || key === 'utmccm') {
        gaReferral[key] = gaReferral[key].toLowerCase();
      }
      newSessionVals.push(key + '=' + gaReferral[key]);
    }
  }

  const response = newSessionVals.join('|');
  console.info('newSessionVals: ', response);
  window.sessionStorage.setItem('utms', response);
  window.sessionStorage.setItem('session_utms', 1);

  return response;
}

export default writeUtm;
