const createDOMPurify = require('isomorphic-dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Middleware for global sanitization
const sanitizeInputs = (req, res, next) => {
  for (let key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = DOMPurify.sanitize(req.body[key]);
    }
  }
  next();
};

module.exports = sanitizeInputs