const xss = require('xss');

function sanitizeValue(v) {
  if (v == null) return v;
  if (typeof v === 'string') return xss(v);
  if (Array.isArray(v)) return v.map(sanitizeValue);
  if (typeof v === 'object') {
    const out = {};
    for (const [k, val] of Object.entries(v)) out[k] = sanitizeValue(val);
    return out;
  }
  return v;
}

module.exports = function sanitizeIncoming(req, _res, next) {
  req.query  = sanitizeValue(req.query);
  req.params = sanitizeValue(req.params);
  req.body   = sanitizeValue(req.body);
  next();
};