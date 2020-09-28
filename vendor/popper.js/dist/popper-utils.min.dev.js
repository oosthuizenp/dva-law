"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeAutoPlacement = z;
exports.findIndex = H;
exports.getBordersSize = n;
exports.getBoundaries = x;
exports.getBoundingClientRect = s;
exports.getClientRect = r;
exports.getOffsetParent = h;
exports.getOffsetRect = I;
exports.getOffsetRectRelativeToArbitraryNode = t;
exports.getOuterSizes = J;
exports.getParentNode = b;
exports.getPopperOffsets = L;
exports.getReferenceOffsets = M;
exports.getScroll = l;
exports.getScrollParent = c;
exports.getStyleComputedProperty = a;
exports.getSupportedPropertyName = N;
exports.getWindowSizes = p;
exports.isFixed = v;
exports.isFunction = O;
exports.isModifierEnabled = P;
exports.isModifierRequired = Q;
exports.isNumeric = R;
exports.removeEventListeners = T;
exports.runModifiers = U;
exports.setAttributes = V;
exports.setStyles = W;
exports.setupEventListeners = Y;
exports["default"] = exports.debounce = void 0;

/*
 Copyright (C) Federico Zivolo 2019
 Distributed under the MIT License (license terms are at https://opensource.org/licenses/MIT).
 */
function a(a, b) {
  if (1 !== a.nodeType) return [];
  var c = a.ownerDocument.defaultView,
      d = c.getComputedStyle(a, null);
  return b ? d[b] : d;
}

function b(a) {
  return 'HTML' === a.nodeName ? a : a.parentNode || a.host;
}

function c(d) {
  if (!d) return document.body;

  switch (d.nodeName) {
    case 'HTML':
    case 'BODY':
      return d.ownerDocument.body;

    case '#document':
      return d.body;
  }

  var _a = a(d),
      e = _a.overflow,
      f = _a.overflowX,
      g = _a.overflowY;

  return /(auto|scroll|overlay)/.test(e + g + f) ? d : c(b(d));
}

var d = 'undefined' != typeof window && 'undefined' != typeof document;
var e = d && !!(window.MSInputMethodContext && document.documentMode),
    f = d && /MSIE 10/.test(navigator.userAgent);

function g(a) {
  return 11 === a ? e : 10 === a ? f : e || f;
}

function h(b) {
  if (!b) return document.documentElement;
  var c = g(10) ? document.body : null;
  var d = b.offsetParent || null;

  for (; d === c && b.nextElementSibling;) {
    d = (b = b.nextElementSibling).offsetParent;
  }

  var e = d && d.nodeName;
  return e && 'BODY' !== e && 'HTML' !== e ? -1 !== ['TH', 'TD', 'TABLE'].indexOf(d.nodeName) && 'static' === a(d, 'position') ? h(d) : d : b ? b.ownerDocument.documentElement : document.documentElement;
}

function i(a) {
  var b = a.nodeName;
  return 'BODY' !== b && ('HTML' === b || h(a.firstElementChild) === a);
}

function j(a) {
  return null === a.parentNode ? a : j(a.parentNode);
}

function k(a, b) {
  if (!a || !a.nodeType || !b || !b.nodeType) return document.documentElement;
  var c = a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING,
      d = c ? a : b,
      e = c ? b : a,
      f = document.createRange();
  f.setStart(d, 0), f.setEnd(e, 0);
  var g = f.commonAncestorContainer;
  if (a !== g && b !== g || d.contains(e)) return i(g) ? g : h(g);
  var l = j(a);
  return l.host ? k(l.host, b) : k(a, j(b).host);
}

function l(a) {
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';
  var c = 'top' === b ? 'scrollTop' : 'scrollLeft',
      d = a.nodeName;

  if ('BODY' === d || 'HTML' === d) {
    var _b = a.ownerDocument.documentElement,
        _d = a.ownerDocument.scrollingElement || _b;

    return _d[c];
  }

  return a[c];
}

function m(a, b) {
  var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : !1;
  var d = l(b, 'top'),
      e = l(b, 'left'),
      f = c ? -1 : 1;
  return a.top += d * f, a.bottom += d * f, a.left += e * f, a.right += e * f, a;
}

function n(a, b) {
  var c = 'x' === b ? 'Left' : 'Top',
      d = 'Left' == c ? 'Right' : 'Bottom';
  return parseFloat(a["border".concat(c, "Width")], 10) + parseFloat(a["border".concat(d, "Width")], 10);
}

function o(a, b, c, d) {
  return Math.max(b["offset".concat(a)], b["scroll".concat(a)], c["client".concat(a)], c["offset".concat(a)], c["scroll".concat(a)], g(10) ? parseInt(c["offset".concat(a)]) + parseInt(d["margin".concat('Height' === a ? 'Top' : 'Left')]) + parseInt(d["margin".concat('Height' === a ? 'Bottom' : 'Right')]) : 0);
}

function p(a) {
  var b = a.body,
      c = a.documentElement,
      d = g(10) && getComputedStyle(c);
  return {
    height: o('Height', b, c, d),
    width: o('Width', b, c, d)
  };
}

var q = Object.assign || function (a) {
  for (var b, c = 1; c < arguments.length; c++) {
    for (var d in b = arguments[c], b) {
      Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]);
    }
  }

  return a;
};

function r(a) {
  return q({}, a, {
    right: a.left + a.width,
    bottom: a.top + a.height
  });
}

function s(b) {
  var c = {};

  try {
    if (g(10)) {
      c = b.getBoundingClientRect();

      var _a2 = l(b, 'top'),
          _d2 = l(b, 'left');

      c.top += _a2, c.left += _d2, c.bottom += _a2, c.right += _d2;
    } else c = b.getBoundingClientRect();
  } catch (a) {}

  var d = {
    left: c.left,
    top: c.top,
    width: c.right - c.left,
    height: c.bottom - c.top
  },
      e = 'HTML' === b.nodeName ? p(b.ownerDocument) : {},
      f = e.width || b.clientWidth || d.right - d.left,
      h = e.height || b.clientHeight || d.bottom - d.top;
  var i = b.offsetWidth - f,
      j = b.offsetHeight - h;

  if (i || j) {
    var _c = a(b);

    i -= n(_c, 'x'), j -= n(_c, 'y'), d.width -= i, d.height -= j;
  }

  return r(d);
}

function t(b, d) {
  var e = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : !1;
  var f = Math.max;
  var h = g(10),
      i = 'HTML' === d.nodeName,
      j = s(b),
      k = s(d),
      l = c(b),
      n = a(d),
      o = parseFloat(n.borderTopWidth, 10),
      p = parseFloat(n.borderLeftWidth, 10);
  e && i && (k.top = f(k.top, 0), k.left = f(k.left, 0));
  var q = r({
    top: j.top - k.top - o,
    left: j.left - k.left - p,
    width: j.width,
    height: j.height
  });

  if (q.marginTop = 0, q.marginLeft = 0, !h && i) {
    var _a3 = parseFloat(n.marginTop, 10),
        _b2 = parseFloat(n.marginLeft, 10);

    q.top -= o - _a3, q.bottom -= o - _a3, q.left -= p - _b2, q.right -= p - _b2, q.marginTop = _a3, q.marginLeft = _b2;
  }

  return (h && !e ? d.contains(l) : d === l && 'BODY' !== l.nodeName) && (q = m(q, d)), q;
}

function u(a) {
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !1;
  var c = Math.max;
  var d = a.ownerDocument.documentElement,
      e = t(a, d),
      f = c(d.clientWidth, window.innerWidth || 0),
      g = c(d.clientHeight, window.innerHeight || 0),
      h = b ? 0 : l(d),
      i = b ? 0 : l(d, 'left'),
      j = {
    top: h - e.top + e.marginTop,
    left: i - e.left + e.marginLeft,
    width: f,
    height: g
  };
  return r(j);
}

function v(c) {
  var d = c.nodeName;
  if ('BODY' === d || 'HTML' === d) return !1;
  if ('fixed' === a(c, 'position')) return !0;
  var e = b(c);
  return !!e && v(e);
}

function w(b) {
  if (!b || !b.parentElement || g()) return document.documentElement;
  var c = b.parentElement;

  for (; c && 'none' === a(c, 'transform');) {
    c = c.parentElement;
  }

  return c || document.documentElement;
}

function x(a, d, e, f) {
  var g = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : !1;
  var h = {
    top: 0,
    left: 0
  };
  var i = g ? w(a) : k(a, d);
  if ('viewport' === f) h = u(i, g);else {
    var _e;

    'scrollParent' === f ? (_e = c(b(d)), 'BODY' === _e.nodeName && (_e = a.ownerDocument.documentElement)) : 'window' === f ? _e = a.ownerDocument.documentElement : _e = f;

    var _j = t(_e, i, g);

    if ('HTML' === _e.nodeName && !v(i)) {
      var _p = p(a.ownerDocument),
          _b3 = _p.height,
          _c2 = _p.width;

      h.top += _j.top - _j.marginTop, h.bottom = _b3 + _j.top, h.left += _j.left - _j.marginLeft, h.right = _c2 + _j.left;
    } else h = _j;
  }
  e = e || 0;
  var j = 'number' == typeof e;
  return h.left += j ? e : e.left || 0, h.top += j ? e : e.top || 0, h.right -= j ? e : e.right || 0, h.bottom -= j ? e : e.bottom || 0, h;
}

function y(_ref) {
  var a = _ref.width,
      b = _ref.height;
  return a * b;
}

function z(a, b, c, d, e) {
  var f = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  if (-1 === a.indexOf('auto')) return a;
  var g = x(c, d, f, e),
      h = {
    top: {
      width: g.width,
      height: b.top - g.top
    },
    right: {
      width: g.right - b.right,
      height: g.height
    },
    bottom: {
      width: g.width,
      height: g.bottom - b.bottom
    },
    left: {
      width: b.left - g.left,
      height: g.height
    }
  },
      i = Object.keys(h).map(function (a) {
    return q({
      key: a
    }, h[a], {
      area: y(h[a])
    });
  }).sort(function (c, a) {
    return a.area - c.area;
  }),
      j = i.filter(function (_ref2) {
    var a = _ref2.width,
        b = _ref2.height;
    return a >= c.clientWidth && b >= c.clientHeight;
  }),
      k = 0 < j.length ? j[0].key : i[0].key,
      l = a.split('-')[1];
  return k + (l ? "-".concat(l) : '');
}

var A = ['Edge', 'Trident', 'Firefox'];
var B = 0;

for (var _a4 = 0; _a4 < A.length; _a4 += 1) {
  if (d && 0 <= navigator.userAgent.indexOf(A[_a4])) {
    B = 1;
    break;
  }
}

function C(a) {
  var b = !1;
  return function () {
    b || (b = !0, window.Promise.resolve().then(function () {
      b = !1, a();
    }));
  };
}

function D(a) {
  var b = !1;
  return function () {
    b || (b = !0, setTimeout(function () {
      b = !1, a();
    }, B));
  };
}

var E = d && window.Promise;
var F = E ? C : D;
exports.debounce = F;

function G(a, b) {
  return Array.prototype.find ? a.find(b) : a.filter(b)[0];
}

function H(a, b, c) {
  if (Array.prototype.findIndex) return a.findIndex(function (a) {
    return a[b] === c;
  });
  var d = G(a, function (a) {
    return a[b] === c;
  });
  return a.indexOf(d);
}

function I(a) {
  var b;

  if ('HTML' === a.nodeName) {
    var _p2 = p(a.ownerDocument),
        _c3 = _p2.width,
        _d3 = _p2.height;

    b = {
      width: _c3,
      height: _d3,
      left: 0,
      top: 0
    };
  } else b = {
    width: a.offsetWidth,
    height: a.offsetHeight,
    left: a.offsetLeft,
    top: a.offsetTop
  };

  return r(b);
}

function J(a) {
  var b = a.ownerDocument.defaultView,
      c = b.getComputedStyle(a),
      d = parseFloat(c.marginTop || 0) + parseFloat(c.marginBottom || 0),
      e = parseFloat(c.marginLeft || 0) + parseFloat(c.marginRight || 0),
      f = {
    width: a.offsetWidth + e,
    height: a.offsetHeight + d
  };
  return f;
}

function K(a) {
  var b = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom'
  };
  return a.replace(/left|right|bottom|top/g, function (a) {
    return b[a];
  });
}

function L(a, b, c) {
  c = c.split('-')[0];
  var d = J(a),
      e = {
    width: d.width,
    height: d.height
  },
      f = -1 !== ['right', 'left'].indexOf(c),
      g = f ? 'top' : 'left',
      h = f ? 'left' : 'top',
      i = f ? 'height' : 'width',
      j = f ? 'width' : 'height';
  return e[g] = b[g] + b[i] / 2 - d[i] / 2, e[h] = c === h ? b[h] - d[j] : b[K(h)], e;
}

function M(a, b, c) {
  var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var e = d ? w(b) : k(b, c);
  return t(c, e, d);
}

function N(a) {
  var b = [!1, 'ms', 'Webkit', 'Moz', 'O'],
      c = a.charAt(0).toUpperCase() + a.slice(1);

  for (var _d4 = 0; _d4 < b.length; _d4++) {
    var _e2 = b[_d4],
        _f = _e2 ? "".concat(_e2).concat(c) : a;

    if ('undefined' != typeof document.body.style[_f]) return _f;
  }

  return null;
}

function O(a) {
  return a && '[object Function]' === {}.toString.call(a);
}

function P(a, b) {
  return a.some(function (_ref3) {
    var a = _ref3.name,
        c = _ref3.enabled;
    return c && a === b;
  });
}

function Q(a, b, c) {
  var d = G(a, function (_ref4) {
    var a = _ref4.name;
    return a === b;
  }),
      e = !!d && a.some(function (a) {
    return a.name === c && a.enabled && a.order < d.order;
  });

  if (!e) {
    var _a5 = "`".concat(b, "`"),
        _d5 = "`".concat(c, "`");

    console.warn("".concat(_d5, " modifier is required by ").concat(_a5, " modifier in order to work, be sure to include it before ").concat(_a5, "!"));
  }

  return e;
}

function R(a) {
  return '' !== a && !isNaN(parseFloat(a)) && isFinite(a);
}

function S(a) {
  var b = a.ownerDocument;
  return b ? b.defaultView : window;
}

function T(a, b) {
  return S(a).removeEventListener('resize', b.updateBound), b.scrollParents.forEach(function (a) {
    a.removeEventListener('scroll', b.updateBound);
  }), b.updateBound = null, b.scrollParents = [], b.scrollElement = null, b.eventsEnabled = !1, b;
}

function U(a, b, c) {
  var d = void 0 === c ? a : a.slice(0, H(a, 'name', c));
  return d.forEach(function (a) {
    a['function'] && console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    var c = a['function'] || a.fn;
    a.enabled && O(c) && (b.offsets.popper = r(b.offsets.popper), b.offsets.reference = r(b.offsets.reference), b = c(b, a));
  }), b;
}

function V(a, b) {
  Object.keys(b).forEach(function (c) {
    var d = b[c];
    !1 === d ? a.removeAttribute(c) : a.setAttribute(c, b[c]);
  });
}

function W(a, b) {
  Object.keys(b).forEach(function (c) {
    var d = '';
    -1 !== ['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(c) && R(b[c]) && (d = 'px'), a.style[c] = b[c] + d;
  });
}

function X(a, b, d, e) {
  var f = 'BODY' === a.nodeName,
      g = f ? a.ownerDocument.defaultView : a;
  g.addEventListener(b, d, {
    passive: !0
  }), f || X(c(g.parentNode), b, d, e), e.push(g);
}

function Y(a, b, d, e) {
  d.updateBound = e, S(a).addEventListener('resize', d.updateBound, {
    passive: !0
  });
  var f = c(a);
  return X(f, 'scroll', d.updateBound, d.scrollParents), d.scrollElement = f, d.eventsEnabled = !0, d;
}

var Z = {
  computeAutoPlacement: z,
  debounce: F,
  findIndex: H,
  getBordersSize: n,
  getBoundaries: x,
  getBoundingClientRect: s,
  getClientRect: r,
  getOffsetParent: h,
  getOffsetRect: I,
  getOffsetRectRelativeToArbitraryNode: t,
  getOuterSizes: J,
  getParentNode: b,
  getPopperOffsets: L,
  getReferenceOffsets: M,
  getScroll: l,
  getScrollParent: c,
  getStyleComputedProperty: a,
  getSupportedPropertyName: N,
  getWindowSizes: p,
  isFixed: v,
  isFunction: O,
  isModifierEnabled: P,
  isModifierRequired: Q,
  isNumeric: R,
  removeEventListeners: T,
  runModifiers: U,
  setAttributes: V,
  setStyles: W,
  setupEventListeners: Y
};
var _default = Z;
exports["default"] = _default;