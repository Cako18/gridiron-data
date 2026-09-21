/* =====================================================================
   Cako's NFL World - lesbar gemachte Fassung von app26.js
   =====================================================================

   Das ist NICHT die urspruengliche Quelle. Die originale
   nfl-predictor.jsx ging verloren; im Repo lag nur das fertige,
   minifizierte Bundle. Diese Datei ist app26.js, durch Prettier
   entzerrt: funktional identisch mit dem, was live laeuft, aber mit
   den von esbuild verkuerzten Variablennamen (a, b, Qc, ym ...).

   Wozu sie da ist:
     * als Nachschlagewerk, WAS die laufende App tut
     * als Notnagel, falls eine Aenderung noetig wird, bevor eine
       saubere Quelle existiert
     * damit dieser Stand ueberhaupt versioniert ist

   Wozu sie NICHT da ist: als Grundlage fuer die Weiterentwicklung.
   Dafuer gehoert nfl-predictor.jsx neu geschrieben und ins Repo.

   Aufbau: bis etwa Zeile 14690 Vendor-Code (React, ReactDOM),
   danach der eigentliche App-Code.

   Kernstelle, oft gesucht - die Wochenwahl beim Laden:
       let O = w.filter(d => d.hs === null).map(d => d.w);
       O.length && Qc(Math.min(...O));
   Die App zeigt also immer die niedrigste Woche mit offenen Spielen.
   Sobald das Montagsspiel ausgewertet ist, springt sie selbst weiter.
   ===================================================================== */

(() => {
  var Bm = Object.create;
  var vs = Object.defineProperty;
  var Om = Object.getOwnPropertyDescriptor;
  var Rm = Object.getOwnPropertyNames;
  var Hm = Object.getPrototypeOf,
    Um = Object.prototype.hasOwnProperty;
  var Ke = (t, e) => () => {
    try {
      return (e || t((e = { exports: {} }).exports, e), e.exports);
    } catch (l) {
      throw ((e = 0), l);
    }
  };
  var Lm = (t, e, l, a) => {
    if ((e && typeof e == "object") || typeof e == "function")
      for (let n of Rm(e))
        !Um.call(t, n) &&
          n !== l &&
          vs(t, n, { get: () => e[n], enumerable: !(a = Om(e, n)) || a.enumerable });
    return t;
  };
  var sa = (t, e, l) => (
    (l = t != null ? Bm(Hm(t)) : {}),
    Lm(e || !t || !t.__esModule ? vs(l, "default", { value: t, enumerable: !0 }) : l, t)
  );
  var ws = Ke((I) => {
    "use strict";
    var $c = Symbol.for("react.transitional.element"),
      qm = Symbol.for("react.portal"),
      Ym = Symbol.for("react.fragment"),
      jm = Symbol.for("react.strict_mode"),
      Gm = Symbol.for("react.profiler"),
      Vm = Symbol.for("react.consumer"),
      Qm = Symbol.for("react.context"),
      Xm = Symbol.for("react.forward_ref"),
      Zm = Symbol.for("react.suspense"),
      km = Symbol.for("react.memo"),
      Ss = Symbol.for("react.lazy"),
      Km = Symbol.for("react.activity"),
      Fm = Symbol.for("react.view_transition"),
      ys = Symbol.iterator;
    function Jm(t) {
      return t === null || typeof t != "object"
        ? null
        : ((t = (ys && t[ys]) || t["@@iterator"]), typeof t == "function" ? t : null);
    }
    var As = {
        isMounted: function () {
          return !1;
        },
        enqueueForceUpdate: function () {},
        enqueueReplaceState: function () {},
        enqueueSetState: function () {},
      },
      Es = Object.assign,
      Ts = {};
    function qa(t, e, l) {
      ((this.props = t), (this.context = e), (this.refs = Ts), (this.updater = l || As));
    }
    qa.prototype.isReactComponent = {};
    qa.prototype.setState = function (t, e) {
      if (typeof t != "object" && typeof t != "function" && t != null)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, t, e, "setState");
    };
    qa.prototype.forceUpdate = function (t) {
      this.updater.enqueueForceUpdate(this, t, "forceUpdate");
    };
    function zs() {}
    zs.prototype = qa.prototype;
    function Wc(t, e, l) {
      ((this.props = t), (this.context = e), (this.refs = Ts), (this.updater = l || As));
    }
    var Pc = (Wc.prototype = new zs());
    Pc.constructor = Wc;
    Es(Pc, qa.prototype);
    Pc.isPureReactComponent = !0;
    var ps = Array.isArray;
    function Ic() {}
    var St = { H: null, A: null, T: null, S: null },
      Cs = Object.prototype.hasOwnProperty;
    function t0(t, e, l) {
      var a = l.ref;
      return { $$typeof: $c, type: t, key: e, ref: a !== void 0 ? a : null, props: l };
    }
    function Im(t, e) {
      return t0(t.type, e, t.props);
    }
    function e0(t) {
      return typeof t == "object" && t !== null && t.$$typeof === $c;
    }
    function $m(t) {
      var e = { "=": "=0", ":": "=2" };
      return (
        "$" +
        t.replace(/[=:]/g, function (l) {
          return e[l];
        })
      );
    }
    var gs = /\/+/g;
    function Jc(t, e) {
      return typeof t == "object" && t !== null && t.key != null ? $m("" + t.key) : e.toString(36);
    }
    function Wm(t) {
      switch (t.status) {
        case "fulfilled":
          return t.value;
        case "rejected":
          throw t.reason;
        default:
          switch (
            (typeof t.status == "string"
              ? t.then(Ic, Ic)
              : ((t.status = "pending"),
                t.then(
                  function (e) {
                    t.status === "pending" && ((t.status = "fulfilled"), (t.value = e));
                  },
                  function (e) {
                    t.status === "pending" && ((t.status = "rejected"), (t.reason = e));
                  },
                )),
            t.status)
          ) {
            case "fulfilled":
              return t.value;
            case "rejected":
              throw t.reason;
          }
      }
      throw t;
    }
    function La(t, e, l, a, n) {
      var u = typeof t;
      (u === "undefined" || u === "boolean") && (t = null);
      var i = !1;
      if (t === null) i = !0;
      else
        switch (u) {
          case "bigint":
          case "string":
          case "number":
            i = !0;
            break;
          case "object":
            switch (t.$$typeof) {
              case $c:
              case qm:
                i = !0;
                break;
              case Ss:
                return ((i = t._init), La(i(t._payload), e, l, a, n));
            }
        }
      if (i)
        return (
          (n = n(t)),
          (i = a === "" ? "." + Jc(t, 0) : a),
          ps(n)
            ? ((l = ""),
              i != null && (l = i.replace(gs, "$&/") + "/"),
              La(n, e, l, "", function (m) {
                return m;
              }))
            : n != null &&
              (e0(n) &&
                (n = Im(
                  n,
                  l +
                    (n.key == null || (t && t.key === n.key)
                      ? ""
                      : ("" + n.key).replace(gs, "$&/") + "/") +
                    i,
                )),
              e.push(n)),
          1
        );
      i = 0;
      var c = a === "" ? "." : a + ":";
      if (ps(t))
        for (var f = 0; f < t.length; f++)
          ((a = t[f]), (u = c + Jc(a, f)), (i += La(a, e, l, u, n)));
      else if (((f = Jm(t)), typeof f == "function"))
        for (t = f.call(t), f = 0; !(a = t.next()).done;)
          ((a = a.value), (u = c + Jc(a, f++)), (i += La(a, e, l, u, n)));
      else if (u === "object") {
        if (typeof t.then == "function") return La(Wm(t), e, l, a, n);
        throw (
          (e = String(t)),
          Error(
            "Objects are not valid as a React child (found: " +
              (e === "[object Object]"
                ? "object with keys {" + Object.keys(t).join(", ") + "}"
                : e) +
              "). If you meant to render a collection of children, use an array instead.",
          )
        );
      }
      return i;
    }
    function Wu(t, e, l) {
      if (t == null) return t;
      var a = [],
        n = 0;
      return (
        La(t, a, "", "", function (u) {
          return e.call(l, u, n++);
        }),
        a
      );
    }
    function Pm(t) {
      if (t._status === -1) {
        var e = t._result,
          l = e();
        (l.then(
          function (a) {
            (t._status === 0 || t._status === -1) &&
              ((t._status = 1),
              (t._result = a),
              l.status === void 0 && ((l.status = "fulfilled"), (l.value = a)));
          },
          function (a) {
            (t._status === 0 || t._status === -1) &&
              ((t._status = 2),
              (t._result = a),
              l.status === void 0 && ((l.status = "rejected"), (l.reason = a)));
          },
        ),
          t._status === -1 && ((t._status = 0), (t._result = l)));
      }
      if (t._status === 1) return t._result.default;
      throw t._result;
    }
    var bs =
      typeof reportError == "function"
        ? reportError
        : function (t) {
            if (typeof window == "object" && typeof window.ErrorEvent == "function") {
              var e = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof t == "object" && t !== null && typeof t.message == "string"
                    ? String(t.message)
                    : String(t),
                error: t,
              });
              if (!window.dispatchEvent(e)) return;
            } else if (typeof process == "object" && typeof process.emit == "function") {
              process.emit("uncaughtException", t);
              return;
            }
            console.error(t);
          };
    function xs(t) {
      var e = St.T,
        l = {};
      ((l.types = e !== null ? e.types : null), (St.T = l));
      try {
        var a = t(),
          n = St.S;
        (n !== null && n(l, a),
          typeof a == "object" && a !== null && typeof a.then == "function" && a.then(Ic, bs));
      } catch (u) {
        bs(u);
      } finally {
        (e !== null && l.types !== null && (e.types = l.types), (St.T = e));
      }
    }
    function Ms(t) {
      var e = St.T;
      if (e !== null) {
        var l = e.types;
        l === null ? (e.types = [t]) : l.indexOf(t) === -1 && l.push(t);
      } else xs(Ms.bind(null, t));
    }
    var tv = {
      map: Wu,
      forEach: function (t, e, l) {
        Wu(
          t,
          function () {
            e.apply(this, arguments);
          },
          l,
        );
      },
      count: function (t) {
        var e = 0;
        return (
          Wu(t, function () {
            e++;
          }),
          e
        );
      },
      toArray: function (t) {
        return (
          Wu(t, function (e) {
            return e;
          }) || []
        );
      },
      only: function (t) {
        if (!e0(t))
          throw Error("React.Children.only expected to receive a single React element child.");
        return t;
      },
    };
    I.Activity = Km;
    I.Children = tv;
    I.Component = qa;
    I.Fragment = Ym;
    I.Profiler = Gm;
    I.PureComponent = Wc;
    I.StrictMode = jm;
    I.Suspense = Zm;
    I.ViewTransition = Fm;
    I.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = St;
    I.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (t) {
        return St.H.useMemoCache(t);
      },
    };
    I.addTransitionType = Ms;
    I.cache = function (t) {
      return function () {
        return t.apply(null, arguments);
      };
    };
    I.cacheSignal = function () {
      return null;
    };
    I.cloneElement = function (t, e, l) {
      if (t == null) throw Error("The argument must be a React element, but you passed " + t + ".");
      var a = Es({}, t.props),
        n = t.key;
      if (e != null)
        for (u in (e.key !== void 0 && (n = "" + e.key), e))
          !Cs.call(e, u) ||
            u === "key" ||
            u === "__self" ||
            u === "__source" ||
            (u === "ref" && e.ref === void 0) ||
            (a[u] = e[u]);
      var u = arguments.length - 2;
      if (u === 1) a.children = l;
      else if (1 < u) {
        for (var i = Array(u), c = 0; c < u; c++) i[c] = arguments[c + 2];
        a.children = i;
      }
      return t0(t.type, n, a);
    };
    I.createContext = function (t) {
      return (
        (t = {
          $$typeof: Qm,
          _currentValue: t,
          _currentValue2: t,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (t.Provider = t),
        (t.Consumer = { $$typeof: Vm, _context: t }),
        t
      );
    };
    I.createElement = function (t, e, l) {
      var a,
        n = {},
        u = null;
      if (e != null)
        for (a in (e.key !== void 0 && (u = "" + e.key), e))
          Cs.call(e, a) && a !== "key" && a !== "__self" && a !== "__source" && (n[a] = e[a]);
      var i = arguments.length - 2;
      if (i === 1) n.children = l;
      else if (1 < i) {
        for (var c = Array(i), f = 0; f < i; f++) c[f] = arguments[f + 2];
        n.children = c;
      }
      if (t && t.defaultProps)
        for (a in ((i = t.defaultProps), i)) n[a] === void 0 && (n[a] = i[a]);
      return t0(t, u, n);
    };
    I.createRef = function () {
      return { current: null };
    };
    I.forwardRef = function (t) {
      return { $$typeof: Xm, render: t };
    };
    I.isValidElement = e0;
    I.lazy = function (t) {
      return { $$typeof: Ss, _payload: { _status: -1, _result: t }, _init: Pm };
    };
    I.memo = function (t, e) {
      return { $$typeof: km, type: t, compare: e === void 0 ? null : e };
    };
    I.startTransition = xs;
    I.unstable_useCacheRefresh = function () {
      return St.H.useCacheRefresh();
    };
    I.use = function (t) {
      return St.H.use(t);
    };
    I.useActionState = function (t, e, l) {
      return St.H.useActionState(t, e, l);
    };
    I.useCallback = function (t, e) {
      return St.H.useCallback(t, e);
    };
    I.useContext = function (t) {
      return St.H.useContext(t);
    };
    I.useDebugValue = function () {};
    I.useDeferredValue = function (t, e) {
      return St.H.useDeferredValue(t, e);
    };
    I.useEffect = function (t, e) {
      return St.H.useEffect(t, e);
    };
    I.useEffectEvent = function (t) {
      return St.H.useEffectEvent(t);
    };
    I.useId = function () {
      return St.H.useId();
    };
    I.useImperativeHandle = function (t, e, l) {
      return St.H.useImperativeHandle(t, e, l);
    };
    I.useInsertionEffect = function (t, e) {
      return St.H.useInsertionEffect(t, e);
    };
    I.useLayoutEffect = function (t, e) {
      return St.H.useLayoutEffect(t, e);
    };
    I.useMemo = function (t, e) {
      return St.H.useMemo(t, e);
    };
    I.useOptimistic = function (t, e) {
      return St.H.useOptimistic(t, e);
    };
    I.useReducer = function (t, e, l) {
      return St.H.useReducer(t, e, l);
    };
    I.useRef = function (t) {
      return St.H.useRef(t);
    };
    I.useState = function (t) {
      return St.H.useState(t);
    };
    I.useSyncExternalStore = function (t, e, l) {
      return St.H.useSyncExternalStore(t, e, l);
    };
    I.useTransition = function () {
      return St.H.useTransition();
    };
    I.version = "19.3.0";
  });
  var Vn = Ke((Ag, Ns) => {
    "use strict";
    Ns.exports = ws();
  });
  var Ys = Ke((Ct) => {
    "use strict";
    function u0(t, e) {
      var l = t.length;
      t.push(e);
      t: for (; 0 < l;) {
        var a = (l - 1) >>> 1,
          n = t[a];
        if (0 < Pu(n, e)) ((t[a] = e), (t[l] = n), (l = a));
        else break t;
      }
    }
    function Fe(t) {
      return t.length === 0 ? null : t[0];
    }
    function ei(t) {
      if (t.length === 0) return null;
      var e = t[0],
        l = t.pop();
      if (l !== e) {
        t[0] = l;
        t: for (var a = 0, n = t.length, u = n >>> 1; a < u;) {
          var i = 2 * (a + 1) - 1,
            c = t[i],
            f = i + 1,
            m = t[f];
          if (0 > Pu(c, l))
            f < n && 0 > Pu(m, c)
              ? ((t[a] = m), (t[f] = l), (a = f))
              : ((t[a] = c), (t[i] = l), (a = i));
          else if (f < n && 0 > Pu(m, l)) ((t[a] = m), (t[f] = l), (a = f));
          else break t;
        }
      }
      return e;
    }
    function Pu(t, e) {
      var l = t.sortIndex - e.sortIndex;
      return l !== 0 ? l : t.id - e.id;
    }
    Ct.unstable_now = void 0;
    typeof performance == "object" && typeof performance.now == "function"
      ? ((_s = performance),
        (Ct.unstable_now = function () {
          return _s.now();
        }))
      : ((l0 = Date),
        (Ds = l0.now()),
        (Ct.unstable_now = function () {
          return l0.now() - Ds;
        }));
    var _s,
      l0,
      Ds,
      dl = [],
      Nl = [],
      ev = 1,
      Ne = null,
      $t = 3,
      i0 = !1,
      Qn = !1,
      Xn = !1,
      c0 = !1,
      Rs = typeof setTimeout == "function" ? setTimeout : null,
      Hs = typeof clearTimeout == "function" ? clearTimeout : null,
      Bs = typeof setImmediate < "u" ? setImmediate : null;
    function ti(t) {
      for (var e = Fe(Nl); e !== null;) {
        if (e.callback === null) ei(Nl);
        else if (e.startTime <= t) (ei(Nl), (e.sortIndex = e.expirationTime), u0(dl, e));
        else break;
        e = Fe(Nl);
      }
    }
    function o0(t) {
      if (((Xn = !1), ti(t), !Qn))
        if (Fe(dl) !== null) ((Qn = !0), ja || ((ja = !0), Ya()));
        else {
          var e = Fe(Nl);
          e !== null && f0(o0, e.startTime - t);
        }
    }
    var ja = !1,
      Zn = -1,
      Us = 5,
      Ls = -1;
    function qs() {
      return c0 ? !0 : !(Ct.unstable_now() - Ls < Us);
    }
    function a0() {
      if (((c0 = !1), ja)) {
        var t = Ct.unstable_now();
        Ls = t;
        var e = !0;
        try {
          t: {
            ((Qn = !1), Xn && ((Xn = !1), Hs(Zn), (Zn = -1)), (i0 = !0));
            var l = $t;
            try {
              e: {
                for (ti(t), Ne = Fe(dl); Ne !== null && !(Ne.expirationTime > t && qs());) {
                  var a = Ne.callback;
                  if (typeof a == "function") {
                    ((Ne.callback = null), ($t = Ne.priorityLevel));
                    var n = a(Ne.expirationTime <= t);
                    if (((t = Ct.unstable_now()), typeof n == "function")) {
                      ((Ne.callback = n), ti(t), (e = !0));
                      break e;
                    }
                    (Ne === Fe(dl) && ei(dl), ti(t));
                  } else ei(dl);
                  Ne = Fe(dl);
                }
                if (Ne !== null) e = !0;
                else {
                  var u = Fe(Nl);
                  (u !== null && f0(o0, u.startTime - t), (e = !1));
                }
              }
              break t;
            } finally {
              ((Ne = null), ($t = l), (i0 = !1));
            }
            e = void 0;
          }
        } finally {
          e ? Ya() : (ja = !1);
        }
      }
    }
    var Ya;
    typeof Bs == "function"
      ? (Ya = function () {
          Bs(a0);
        })
      : typeof MessageChannel < "u"
        ? ((n0 = new MessageChannel()),
          (Os = n0.port2),
          (n0.port1.onmessage = a0),
          (Ya = function () {
            Os.postMessage(null);
          }))
        : (Ya = function () {
            Rs(a0, 0);
          });
    var n0, Os;
    function f0(t, e) {
      Zn = Rs(function () {
        t(Ct.unstable_now());
      }, e);
    }
    Ct.unstable_IdlePriority = 5;
    Ct.unstable_ImmediatePriority = 1;
    Ct.unstable_LowPriority = 4;
    Ct.unstable_NormalPriority = 3;
    Ct.unstable_Profiling = null;
    Ct.unstable_UserBlockingPriority = 2;
    Ct.unstable_cancelCallback = function (t) {
      t.callback = null;
    };
    Ct.unstable_forceFrameRate = function (t) {
      0 > t || 125 < t
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
          )
        : (Us = 0 < t ? Math.floor(1e3 / t) : 5);
    };
    Ct.unstable_getCurrentPriorityLevel = function () {
      return $t;
    };
    Ct.unstable_next = function (t) {
      switch ($t) {
        case 1:
        case 2:
        case 3:
          var e = 3;
          break;
        default:
          e = $t;
      }
      var l = $t;
      $t = e;
      try {
        return t();
      } finally {
        $t = l;
      }
    };
    Ct.unstable_requestPaint = function () {
      c0 = !0;
    };
    Ct.unstable_runWithPriority = function (t, e) {
      switch (t) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          t = 3;
      }
      var l = $t;
      $t = t;
      try {
        return e();
      } finally {
        $t = l;
      }
    };
    Ct.unstable_scheduleCallback = function (t, e, l) {
      var a = Ct.unstable_now();
      switch (
        (typeof l == "object" && l !== null
          ? ((l = l.delay), (l = typeof l == "number" && 0 < l ? a + l : a))
          : (l = a),
        t)
      ) {
        case 1:
          var n = -1;
          break;
        case 2:
          n = 250;
          break;
        case 5:
          n = 1073741823;
          break;
        case 4:
          n = 1e4;
          break;
        default:
          n = 5e3;
      }
      return (
        (n = l + n),
        (t = {
          id: ev++,
          callback: e,
          priorityLevel: t,
          startTime: l,
          expirationTime: n,
          sortIndex: -1,
        }),
        l > a
          ? ((t.sortIndex = l),
            u0(Nl, t),
            Fe(dl) === null &&
              t === Fe(Nl) &&
              (Xn ? (Hs(Zn), (Zn = -1)) : (Xn = !0), f0(o0, l - a)))
          : ((t.sortIndex = n), u0(dl, t), Qn || i0 || ((Qn = !0), ja || ((ja = !0), Ya()))),
        t
      );
    };
    Ct.unstable_shouldYield = qs;
    Ct.unstable_wrapCallback = function (t) {
      var e = $t;
      return function () {
        var l = $t;
        $t = e;
        try {
          return t.apply(this, arguments);
        } finally {
          $t = l;
        }
      };
    };
  });
  var Gs = Ke((Tg, js) => {
    "use strict";
    js.exports = Ys();
  });
  var Xs = Ke((Wt) => {
    "use strict";
    var lv = Vn();
    function Qs(t) {
      var e = "https://react.dev/errors/" + t;
      if (1 < arguments.length) {
        e += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var l = 2; l < arguments.length; l++)
          e += "&args[]=" + encodeURIComponent(arguments[l]);
      }
      return (
        "Minified React error #" +
        t +
        "; visit " +
        e +
        " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
      );
    }
    function _l() {}
    var le = {
        d: {
          f: _l,
          r: function () {
            throw Error(Qs(522));
          },
          D: _l,
          C: _l,
          L: _l,
          m: _l,
          X: _l,
          S: _l,
          M: _l,
        },
        p: 0,
        findDOMNode: null,
      },
      av = Symbol.for("react.portal"),
      nv = Symbol.for("react.recoverable"),
      Vs = Symbol.for("react.optimistic_key");
    function uv(t, e, l) {
      var a = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return {
        $$typeof: av,
        key: a == null ? null : a === Vs ? Vs : "" + a,
        children: t,
        containerInfo: e,
        implementation: l,
      };
    }
    var kn = lv.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function li(t, e) {
      if (t === "font") return "";
      if (typeof e == "string") return e === "use-credentials" ? e : "";
    }
    Wt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = le;
    Wt.browser = function (t) {
      return { $$typeof: nv, _reason: t };
    };
    Wt.createPortal = function (t, e) {
      var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11)) throw Error(Qs(299));
      return uv(t, e, null, l);
    };
    Wt.flushSync = function (t) {
      var e = kn.T,
        l = le.p;
      try {
        if (((kn.T = null), (le.p = 2), t)) return t();
      } finally {
        ((kn.T = e), (le.p = l), le.d.f());
      }
    };
    Wt.preconnect = function (t, e) {
      typeof t == "string" &&
        (e
          ? ((e = e.crossOrigin),
            (e = typeof e == "string" ? (e === "use-credentials" ? e : "") : void 0))
          : (e = null),
        le.d.C(t, e));
    };
    Wt.prefetchDNS = function (t) {
      typeof t == "string" && le.d.D(t);
    };
    Wt.preinit = function (t, e) {
      if (typeof t == "string" && e && typeof e.as == "string") {
        var l = e.as,
          a = li(l, e.crossOrigin),
          n = typeof e.integrity == "string" ? e.integrity : void 0,
          u = typeof e.fetchPriority == "string" ? e.fetchPriority : void 0;
        l === "style"
          ? le.d.S(t, typeof e.precedence == "string" ? e.precedence : void 0, {
              crossOrigin: a,
              integrity: n,
              fetchPriority: u,
            })
          : l === "script" &&
            le.d.X(t, {
              crossOrigin: a,
              integrity: n,
              fetchPriority: u,
              nonce: typeof e.nonce == "string" ? e.nonce : void 0,
            });
      }
    };
    Wt.preinitModule = function (t, e) {
      if (typeof t == "string")
        if (typeof e == "object" && e !== null) {
          if (e.as == null || e.as === "script") {
            var l = li(e.as, e.crossOrigin);
            le.d.M(t, {
              crossOrigin: l,
              integrity: typeof e.integrity == "string" ? e.integrity : void 0,
              nonce: typeof e.nonce == "string" ? e.nonce : void 0,
              fetchPriority: typeof e.fetchPriority == "string" ? e.fetchPriority : void 0,
            });
          }
        } else e == null && le.d.M(t);
    };
    Wt.preload = function (t, e) {
      if (typeof t == "string" && typeof e == "object" && e !== null && typeof e.as == "string") {
        var l = e.as,
          a = li(l, e.crossOrigin);
        le.d.L(t, l, {
          crossOrigin: a,
          integrity: typeof e.integrity == "string" ? e.integrity : void 0,
          nonce: typeof e.nonce == "string" ? e.nonce : void 0,
          type: typeof e.type == "string" ? e.type : void 0,
          fetchPriority: typeof e.fetchPriority == "string" ? e.fetchPriority : void 0,
          referrerPolicy: typeof e.referrerPolicy == "string" ? e.referrerPolicy : void 0,
          imageSrcSet: typeof e.imageSrcSet == "string" ? e.imageSrcSet : void 0,
          imageSizes: typeof e.imageSizes == "string" ? e.imageSizes : void 0,
          media: typeof e.media == "string" ? e.media : void 0,
        });
      }
    };
    Wt.preloadModule = function (t, e) {
      if (typeof t == "string")
        if (e) {
          var l = li(e.as, e.crossOrigin);
          le.d.m(t, {
            as: typeof e.as == "string" && e.as !== "script" ? e.as : void 0,
            crossOrigin: l,
            integrity: typeof e.integrity == "string" ? e.integrity : void 0,
            nonce: typeof e.nonce == "string" ? e.nonce : void 0,
            fetchPriority: typeof e.fetchPriority == "string" ? e.fetchPriority : void 0,
          });
        } else le.d.m(t);
    };
    Wt.requestFormReset = function (t) {
      le.d.r(t);
    };
    Wt.unstable_batchedUpdates = function (t, e) {
      return t(e);
    };
    Wt.useFormState = function (t, e, l) {
      return kn.H.useFormState(t, e, l);
    };
    Wt.useFormStatus = function () {
      return kn.H.useHostTransitionStatus();
    };
    Wt.version = "19.3.0";
  });
  var Ks = Ke((Cg, ks) => {
    "use strict";
    function Zs() {
      if (!(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      ))
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Zs);
        } catch (t) {
          console.error(t);
        }
    }
    (Zs(), (ks.exports = Xs()));
  });
  var O2 = Ke((Lc) => {
    "use strict";
    var qt = Gs(),
      Br = Vn(),
      iv = Ks();
    function C(t) {
      var e = "https://react.dev/errors/" + t;
      if (1 < arguments.length) {
        e += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var l = 2; l < arguments.length; l++)
          e += "&args[]=" + encodeURIComponent(arguments[l]);
      }
      return (
        "Minified React error #" +
        t +
        "; visit " +
        e +
        " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
      );
    }
    function Or(t) {
      return !(!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11));
    }
    function Ou(t) {
      for (var e = t, l = e; l && !l.alternate;)
        ((e = l), (e.flags & 4098) !== 0 && (t = e.return), (l = e.return));
      for (; e.return;) e = e.return;
      return e.tag === 3 ? t : null;
    }
    function Rr(t) {
      if (t.tag === 13) {
        var e = t.memoizedState;
        if ((e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)), e !== null))
          return e.dehydrated;
      }
      return null;
    }
    function Hr(t) {
      if (t.tag === 31) {
        var e = t.memoizedState;
        if ((e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)), e !== null))
          return e.dehydrated;
      }
      return null;
    }
    function Fs(t) {
      if (Ou(t) !== t) throw Error(C(188));
    }
    function cv(t) {
      var e = t.alternate;
      if (!e) {
        if (((e = Ou(t)), e === null)) throw Error(C(188));
        return e !== t ? null : t;
      }
      for (var l = t, a = e; ;) {
        var n = l.return;
        if (n === null) break;
        var u = n.alternate;
        if (u === null) {
          if (((a = n.return), a !== null)) {
            l = a;
            continue;
          }
          break;
        }
        if (n.child === u.child) {
          for (u = n.child; u;) {
            if (u === l) return (Fs(n), t);
            if (u === a) return (Fs(n), e);
            u = u.sibling;
          }
          throw Error(C(188));
        }
        if (l.return !== a.return) ((l = n), (a = u));
        else {
          for (var i = !1, c = n.child; c;) {
            if (c === l) {
              ((i = !0), (l = n), (a = u));
              break;
            }
            if (c === a) {
              ((i = !0), (a = n), (l = u));
              break;
            }
            c = c.sibling;
          }
          if (!i) {
            for (c = u.child; c;) {
              if (c === l) {
                ((i = !0), (l = u), (a = n));
                break;
              }
              if (c === a) {
                ((i = !0), (a = u), (l = n));
                break;
              }
              c = c.sibling;
            }
            if (!i) throw Error(C(189));
          }
        }
        if (l.alternate !== a) throw Error(C(190));
      }
      if (l.tag !== 3) throw Error(C(188));
      return l.stateNode.current === l ? t : e;
    }
    function Ur(t) {
      var e = t.tag;
      if (e === 5 || e === 26 || e === 27 || e === 6) return t;
      for (t = t.child; t !== null;) {
        if (((e = Ur(t)), e !== null)) return e;
        t = t.sibling;
      }
      return null;
    }
    function me(t, e, l, a, n, u) {
      for (; t !== null;) {
        if (
          ((t.tag === 5 || t.tag === 27 || t.tag === 6) && l(t, a, n, u)) ||
          ((t.tag !== 22 || t.memoizedState === null) &&
            (e || (t.tag !== 5 && t.tag !== 27)) &&
            me(t.child, e, l, a, n, u))
        )
          return !0;
        t = t.sibling;
      }
      return !1;
    }
    function Da(t) {
      for (t = t.return; t !== null;) {
        if (t.tag === 3 || t.tag === 5 || t.tag === 27) return t;
        t = t.return;
      }
      return null;
    }
    function Js(t) {
      var e = !1;
      for (
        t = t.return;
        t !== null && (t.tag === 4 && (e = !0), !(t.tag === 3 || t.tag === 5 || t.tag === 27));
      )
        t = t.return;
      return e;
    }
    function Lr(t) {
      var e = [null, null],
        l = Da(t);
      return (l === null || qr(e, t, l.child, { foundSelf: !1 }), e);
    }
    function qr(t, e, l, a) {
      for (; l !== null;) {
        if (l === e) a.foundSelf = !0;
        else if (l.tag === 5 || l.tag === 27 || l.tag === 6) {
          if (a.foundSelf) return ((t[1] = l), !0);
          t[0] = l;
        } else if ((l.tag !== 22 || l.memoizedState === null) && qr(t, e, l.child, a)) return !0;
        l = l.sibling;
      }
      return !1;
    }
    function Lt(t) {
      switch (t.tag) {
        case 5:
        case 27:
        case 6:
          return t.stateNode;
        case 3:
          return t.stateNode.containerInfo;
        default:
          throw Error(C(559));
      }
    }
    var Ka = null,
      G0 = null;
    function ov(t, e, l) {
      return t === l ? !0 : t === e ? ((Ka = t), !0) : !1;
    }
    function fv(t, e, l) {
      return t === l ? ((G0 = t), !1) : t === e ? (G0 !== null && (Ka = t), !0) : !1;
    }
    function Is(t) {
      if (t === null) return null;
      do t = t === null ? null : t.return;
      while (t && t.tag !== 5 && t.tag !== 27 && t.tag !== 3);
      return t || null;
    }
    function V0(t, e, l) {
      for (var a = 0, n = t; n; n = l(n)) a++;
      n = 0;
      for (var u = e; u; u = l(u)) n++;
      for (; 0 < a - n;) ((t = l(t)), a--);
      for (; 0 < n - a;) ((e = l(e)), n--);
      for (; a--;) {
        if (t === e || (e !== null && t === e.alternate)) return t;
        ((t = l(t)), (e = l(e)));
      }
      return null;
    }
    var bt = Object.assign,
      sv = Symbol.for("react.element"),
      ai = Symbol.for("react.transitional.element"),
      Pn = Symbol.for("react.portal"),
      Fa = Symbol.for("react.fragment"),
      Yr = Symbol.for("react.strict_mode"),
      Q0 = Symbol.for("react.profiler"),
      jr = Symbol.for("react.consumer"),
      tl = Symbol.for("react.context"),
      Po = Symbol.for("react.forward_ref"),
      X0 = Symbol.for("react.suspense"),
      Z0 = Symbol.for("react.suspense_list"),
      tf = Symbol.for("react.memo"),
      Rl = Symbol.for("react.lazy"),
      k0 = Symbol.for("react.activity"),
      dv = Symbol.for("react.legacy_hidden"),
      rv = Symbol.for("react.memo_cache_sentinel"),
      K0 = Symbol.for("react.view_transition"),
      hv = Symbol.for("react.recoverable"),
      $s = Symbol.iterator;
    function Kn(t) {
      return t === null || typeof t != "object"
        ? null
        : ((t = ($s && t[$s]) || t["@@iterator"]), typeof t == "function" ? t : null);
    }
    var mv = Symbol.for("react.client.reference");
    function F0(t) {
      if (t == null) return null;
      if (typeof t == "function") return t.$$typeof === mv ? null : t.displayName || t.name || null;
      if (typeof t == "string") return t;
      switch (t) {
        case Fa:
          return "Fragment";
        case Q0:
          return "Profiler";
        case Yr:
          return "StrictMode";
        case X0:
          return "Suspense";
        case Z0:
          return "SuspenseList";
        case k0:
          return "Activity";
        case K0:
          return "ViewTransition";
      }
      if (typeof t == "object")
        switch (t.$$typeof) {
          case Pn:
            return "Portal";
          case tl:
            return t.displayName || "Context";
          case jr:
            return (t._context.displayName || "Context") + ".Consumer";
          case Po:
            var e = t.render;
            return (
              (t = t.displayName),
              t ||
                ((t = e.displayName || e.name || ""),
                (t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef")),
              t
            );
          case tf:
            return ((e = t.displayName || null), e !== null ? e : F0(t.type) || "Memo");
          case Rl:
            ((e = t._payload), (t = t._init));
            try {
              return F0(t(e));
            } catch {}
        }
      return null;
    }
    var tu = Array.isArray,
      J = Br.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      st = iv.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      ga = { pending: !1, data: null, method: null, action: null },
      J0 = [],
      Ja = -1;
    function cl(t) {
      return { current: t };
    }
    function Kt(t) {
      0 > Ja || ((t.current = J0[Ja]), (J0[Ja] = null), Ja--);
    }
    function Tt(t, e) {
      (Ja++, (J0[Ja] = t.current), (t.current = e));
    }
    var nl = cl(null),
      pu = cl(null),
      Ql = cl(null),
      Qi = cl(null);
    function Xi(t, e) {
      switch ((Tt(Ql, e), Tt(pu, t), Tt(nl, null), e.nodeType)) {
        case 9:
        case 11:
          t = (t = e.documentElement) && (t = t.namespaceURI) ? dr(t) : 0;
          break;
        default:
          if (((t = e.tagName), (e = e.namespaceURI))) ((e = dr(e)), (t = o2(e, t)));
          else
            switch (t) {
              case "svg":
                t = 1;
                break;
              case "math":
                t = 2;
                break;
              default:
                t = 0;
            }
      }
      (Kt(nl), Tt(nl, t));
    }
    function yn() {
      (Kt(nl), Kt(pu), Kt(Ql));
    }
    function I0(t) {
      var e = t.memoizedState;
      (e !== null && ((xn._currentValue = e.memoizedState), Tt(Qi, t)), (e = nl.current));
      var l = o2(e, t.type);
      e !== l && (Tt(pu, t), Tt(nl, l));
    }
    function Zi(t) {
      (pu.current === t && (Kt(nl), Kt(pu)), Qi.current === t && (Kt(Qi), (xn._currentValue = ga)));
    }
    var s0, Ws;
    function Bl(t) {
      if (s0 === void 0)
        try {
          throw Error();
        } catch (l) {
          var e = l.stack.trim().match(/\n( *(at )?)/);
          ((s0 = (e && e[1]) || ""),
            (Ws =
              -1 <
              l.stack.indexOf(`
    at`)
                ? " (<anonymous>)"
                : -1 < l.stack.indexOf("@")
                  ? "@unknown:0:0"
                  : ""));
        }
      return (
        `
` +
        s0 +
        t +
        Ws
      );
    }
    var d0 = !1;
    function r0(t, e) {
      if (!t || d0) return "";
      d0 = !0;
      var l = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var a = {
          DetermineComponentFrameRoot: function () {
            try {
              if (e) {
                var A = function () {
                  throw Error();
                };
                if (
                  (Object.defineProperty(A.prototype, "props", {
                    set: function () {
                      throw Error();
                    },
                  }),
                  typeof Reflect == "object" && Reflect.construct)
                ) {
                  try {
                    Reflect.construct(A, []);
                  } catch (x) {
                    var v = x;
                  }
                  Reflect.construct(t, [], A);
                } else {
                  try {
                    A.call();
                  } catch (x) {
                    v = x;
                  }
                  A = !1;
                  try {
                    var p = Object.getOwnPropertyDescriptor(t.prototype, "props");
                    (Object.defineProperty(t.prototype, "props", {
                      configurable: !0,
                      set: function () {
                        throw Error();
                      },
                    }),
                      (A = !0),
                      new t());
                  } finally {
                    A &&
                      (p !== void 0
                        ? Object.defineProperty(t.prototype, "props", p)
                        : delete t.prototype.props);
                  }
                }
              } else {
                try {
                  throw Error();
                } catch (x) {
                  v = x;
                }
                (A = t()) && typeof A.catch == "function" && A.catch(function () {});
              }
            } catch (x) {
              if (x && v && typeof x.stack == "string") return [x.stack, v.stack];
            }
            return [null, null];
          },
        };
        a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var n = Object.getOwnPropertyDescriptor(a.DetermineComponentFrameRoot, "name");
        n &&
          n.configurable &&
          Object.defineProperty(a.DetermineComponentFrameRoot, "name", {
            value: "DetermineComponentFrameRoot",
          });
        var u = a.DetermineComponentFrameRoot(),
          i = u[0],
          c = u[1];
        if (i && c) {
          var f = i.split(`
`),
            m = c.split(`
`);
          for (n = a = 0; a < f.length && !f[a].includes("DetermineComponentFrameRoot");) a++;
          for (; n < m.length && !m[n].includes("DetermineComponentFrameRoot");) n++;
          if (a === f.length || n === m.length)
            for (a = f.length - 1, n = m.length - 1; 1 <= a && 0 <= n && f[a] !== m[n];) n--;
          for (; 1 <= a && 0 <= n; a--, n--)
            if (f[a] !== m[n]) {
              if (a !== 1 || n !== 1)
                do
                  if ((a--, n--, 0 > n || f[a] !== m[n])) {
                    var g =
                      `
` + f[a].replace(" at new ", " at ");
                    return (
                      t.displayName &&
                        g.includes("<anonymous>") &&
                        (g = g.replace("<anonymous>", t.displayName)),
                      g
                    );
                  }
                while (1 <= a && 0 <= n);
              break;
            }
        }
      } finally {
        ((d0 = !1), (Error.prepareStackTrace = l));
      }
      return (l = t ? t.displayName || t.name : "") ? Bl(l) : "";
    }
    function vv(t, e) {
      switch (t.tag) {
        case 26:
        case 27:
        case 5:
          return Bl(t.type);
        case 16:
          return Bl("Lazy");
        case 13:
          return t.child !== e && e !== null ? Bl("Suspense Fallback") : Bl("Suspense");
        case 19:
          return Bl("SuspenseList");
        case 0:
        case 15:
          return r0(t.type, !1);
        case 11:
          return r0(t.type.render, !1);
        case 1:
          return r0(t.type, !0);
        case 31:
          return Bl("Activity");
        case 30:
          return Bl("ViewTransition");
        default:
          return "";
      }
    }
    function Ps(t) {
      try {
        var e = "",
          l = null;
        do ((e += vv(t, l)), (l = t), (t = t.return));
        while (t);
        return e;
      } catch (a) {
        return (
          `
Error generating stack: ` +
          a.message +
          `
` +
          a.stack
        );
      }
    }
    var $0 = Object.prototype.hasOwnProperty,
      ef = qt.unstable_scheduleCallback,
      h0 = qt.unstable_cancelCallback,
      yv = qt.unstable_shouldYield,
      pv = qt.unstable_requestPaint,
      Ee = qt.unstable_now,
      gv = qt.unstable_getCurrentPriorityLevel,
      Gr = qt.unstable_ImmediatePriority,
      Vr = qt.unstable_UserBlockingPriority,
      ki = qt.unstable_NormalPriority,
      bv = qt.unstable_LowPriority,
      Qr = qt.unstable_IdlePriority,
      Sv = qt.log,
      Av = qt.unstable_setDisableYieldValue,
      Ru = null,
      Te = null;
    function Ll(t) {
      if ((typeof Sv == "function" && Av(t), Te && typeof Te.setStrictMode == "function"))
        try {
          Te.setStrictMode(Ru, t);
        } catch {}
    }
    var ze = Math.clz32 ? Math.clz32 : zv,
      Ev = Math.log,
      Tv = Math.LN2;
    function zv(t) {
      return ((t >>>= 0), t === 0 ? 32 : (31 - ((Ev(t) / Tv) | 0)) | 0);
    }
    var ni = 256,
      ui = 262144,
      ii = 4194304;
    function ha(t) {
      var e = t & 42;
      if (e !== 0) return e;
      switch (t & -t) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return t & -t;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return t & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return t & 62914560;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return t;
      }
    }
    function gc(t, e, l) {
      var a = t.pendingLanes;
      if (a === 0) return 0;
      var n = 0,
        u = t.suspendedLanes,
        i = t.pingedLanes;
      t = t.warmLanes;
      var c = a & 134217727;
      return (
        c !== 0
          ? ((a = c & ~u),
            a !== 0
              ? (n = ha(a))
              : ((i &= c), i !== 0 ? (n = ha(i)) : l || ((l = c & ~t), l !== 0 && (n = ha(l)))))
          : ((c = a & ~u),
            c !== 0
              ? (n = ha(c))
              : i !== 0
                ? (n = ha(i))
                : l || ((l = a & ~t), l !== 0 && (n = ha(l)))),
        n === 0
          ? 0
          : e !== 0 &&
              e !== n &&
              (e & u) === 0 &&
              ((u = n & -n), (l = e & -e), u >= l || (u === 32 && (l & 4194048) !== 0))
            ? e
            : n
      );
    }
    function Hu(t, e) {
      return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
    }
    function Xr(t, e) {
      (e & 8) !== 0 && (e |= e & 32);
      var l = t.entangledLanes;
      if (l !== 0)
        for (t = t.entanglements, l &= e; 0 < l;) {
          var a = 31 - ze(l),
            n = 1 << a;
          ((e |= t[a]), (l &= ~n));
        }
      return e;
    }
    function Cv(t, e) {
      switch (t) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return e + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return e + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function Zr() {
      var t = ii;
      return ((ii <<= 1), (ii & 62914560) === 0 && (ii = 4194304), t);
    }
    function m0(t) {
      for (var e = [], l = 0; 31 > l; l++) e.push(t);
      return e;
    }
    function Uu(t, e) {
      ((t.pendingLanes |= e),
        e !== 268435456 && ((t.suspendedLanes = 0), (t.pingedLanes = 0), (t.warmLanes = 0)));
    }
    function xv(t, e, l, a, n, u) {
      var i = t.pendingLanes;
      ((t.pendingLanes = l),
        (t.suspendedLanes = 0),
        (t.pingedLanes = 0),
        (t.warmLanes = 0),
        (t.expiredLanes &= l),
        (t.entangledLanes &= l),
        (t.errorRecoveryDisabledLanes &= l),
        (t.shellSuspendCounter = 0));
      var c = t.entanglements,
        f = t.expirationTimes,
        m = t.hiddenUpdates;
      for (l = i & ~l; 0 < l;) {
        var g = 31 - ze(l),
          A = 1 << g;
        ((c[g] = 0), (f[g] = -1));
        var v = m[g];
        if (v !== null)
          for (m[g] = null, g = 0; g < v.length; g++) {
            var p = v[g];
            p !== null && (p.lane &= -536870913);
          }
        l &= ~A;
      }
      (a !== 0 && kr(t, a, 0),
        u !== 0 && n === 0 && t.tag !== 0 && (t.suspendedLanes |= u & ~(i & ~e)));
    }
    function kr(t, e, l) {
      ((t.pendingLanes |= e), (t.suspendedLanes &= ~e));
      var a = 31 - ze(e);
      ((t.entangledLanes |= e),
        (t.entanglements[a] = t.entanglements[a] | 1073741824 | (l & 261930)));
    }
    function Kr(t, e) {
      var l = (t.entangledLanes |= e);
      for (t = t.entanglements; l;) {
        var a = 31 - ze(l),
          n = 1 << a;
        ((n & e) | (t[a] & e) && (t[a] |= e), (l &= ~n));
      }
    }
    function Fr(t, e) {
      var l = e & -e;
      return ((l = (l & 42) !== 0 ? 1 : lf(l)), (l & (t.suspendedLanes | e)) !== 0 ? 0 : l);
    }
    function lf(t) {
      switch (t) {
        case 2:
          t = 1;
          break;
        case 8:
          t = 4;
          break;
        case 32:
          t = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          t = 128;
          break;
        case 268435456:
          t = 134217728;
          break;
        default:
          t = 0;
      }
      return t;
    }
    function af(t) {
      return ((t &= -t), 2 < t ? (8 < t ? ((t & 134217727) !== 0 ? 32 : 268435456) : 8) : 2);
    }
    function Jr() {
      var t = st.p;
      return t !== 0 ? t : ((t = window.event), t === void 0 ? 32 : _2(t.type));
    }
    function td(t, e) {
      var l = st.p;
      try {
        return ((st.p = t), e());
      } finally {
        st.p = l;
      }
    }
    var zl = Math.random().toString(36).slice(2),
      Zt = "__reactFiber$" + zl,
      ve = "__reactProps$" + zl,
      Nn = "__reactContainer$" + zl,
      ed = "__reactEvents$" + zl,
      Mv = "__reactListeners$" + zl,
      wv = "__reactHandles$" + zl,
      ld = "__reactResources$" + zl,
      Lu = "__reactMarker$" + zl,
      Ki = "__reactLoad$" + zl;
    function bc(t) {
      (delete t[Zt], delete t[ve], delete t[Mv], delete t[wv]);
    }
    function ya(t) {
      var e;
      if ((e = t[Zt])) return e;
      for (var l = t.parentNode; l;) {
        if ((e = l[Nn] || l[Zt])) {
          if (((l = e.alternate), e.child !== null || (l !== null && l.child !== null)))
            for (t = br(t); t !== null;) {
              if ((l = t[Zt])) return l;
              t = br(t);
            }
          return e;
        }
        ((t = l), (l = t.parentNode));
      }
      return null;
    }
    function _n(t) {
      if ((t = t[Zt] || t[Nn])) {
        var e = t.tag;
        if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3) return t;
      }
      return null;
    }
    function eu(t) {
      var e = t.tag;
      if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
      throw Error(C(33));
    }
    function un(t) {
      var e = t[ld];
      return (e || (e = t[ld] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), e);
    }
    function Gt(t) {
      t[Lu] = !0;
    }
    function Ir(t) {
      t[Ki] = void 0;
    }
    var $r = new Set(),
      Wr = {};
    function Ba(t, e) {
      (pn(t, e), pn(t + "Capture", e));
    }
    function pn(t, e) {
      for (Wr[t] = e, t = 0; t < e.length; t++) $r.add(e[t]);
    }
    var Nv = RegExp(
        "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
      ),
      ad = {},
      nd = {};
    function _v(t) {
      return $0.call(nd, t)
        ? !0
        : $0.call(ad, t)
          ? !1
          : Nv.test(t)
            ? (nd[t] = !0)
            : ((ad[t] = !0), !1);
    }
    var ct = !1;
    function ud() {
      var t = ct;
      return ((ct = !1), t);
    }
    function zi(t, e, l) {
      if (_v(e))
        if (l === null) t.removeAttribute(e);
        else {
          switch (typeof l) {
            case "undefined":
            case "function":
            case "symbol":
              t.removeAttribute(e);
              return;
            case "boolean":
              var a = e.toLowerCase().slice(0, 5);
              if (a !== "data-" && a !== "aria-") {
                t.removeAttribute(e);
                return;
              }
          }
          t.setAttribute(e, l);
        }
    }
    function ci(t, e, l) {
      if (l === null) t.removeAttribute(e);
      else {
        switch (typeof l) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            t.removeAttribute(e);
            return;
        }
        t.setAttribute(e, l);
      }
    }
    function rl(t, e, l, a) {
      if (a === null) t.removeAttribute(l);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            t.removeAttribute(l);
            return;
        }
        t.setAttributeNS(e, l, a);
      }
    }
    function ge(t) {
      switch (typeof t) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return t;
        case "object":
          return t;
        default:
          return "";
      }
    }
    function Pr(t) {
      var e = t.type;
      return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
    }
    function Dv(t, e, l) {
      var a = Object.getOwnPropertyDescriptor(t.constructor.prototype, e);
      if (
        !t.hasOwnProperty(e) &&
        typeof a < "u" &&
        typeof a.get == "function" &&
        typeof a.set == "function"
      ) {
        var n = a.get,
          u = a.set;
        return (
          Object.defineProperty(t, e, {
            configurable: !0,
            get: function () {
              return n.call(this);
            },
            set: function (i) {
              ((l = "" + i), u.call(this, i));
            },
          }),
          Object.defineProperty(t, e, { enumerable: a.enumerable }),
          {
            getValue: function () {
              return l;
            },
            setValue: function (i) {
              l = "" + i;
            },
            stopTracking: function () {
              ((t._valueTracker = null), delete t[e]);
            },
          }
        );
      }
    }
    function W0(t) {
      if (!t._valueTracker) {
        var e = Pr(t) ? "checked" : "value";
        t._valueTracker = Dv(t, e, "" + t[e]);
      }
    }
    function t1(t) {
      if (!t) return !1;
      var e = t._valueTracker;
      if (!e) return !0;
      var l = e.getValue(),
        a = "";
      return (
        t && (a = Pr(t) ? (t.checked ? "true" : "false") : t.value),
        (t = a),
        t !== l ? (e.setValue(t), !0) : !1
      );
    }
    var Bv = /[\n"\\]/g;
    function Re(t) {
      return t.replace(Bv, function (e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      });
    }
    function P0(t, e, l, a, n, u, i, c) {
      ((t.name = ""),
        i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean"
          ? (t.type = i)
          : t.removeAttribute("type"),
        e != null
          ? i === "number"
            ? ((e === 0 && t.value === "") || t.value != e) && (t.value = "" + ge(e))
            : t.value !== "" + ge(e) && (t.value = "" + ge(e))
          : (i !== "submit" && i !== "reset") || t.removeAttribute("value"),
        e != null
          ? i === "number" && t.value == e
            ? v0(t, ge(t.value))
            : v0(t, ge(e))
          : l != null
            ? v0(t, ge(l))
            : a != null && t.removeAttribute("value"),
        n == null && u != null && (t.defaultChecked = !!u),
        n != null && (t.checked = n && typeof n != "function" && typeof n != "symbol"),
        c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean"
          ? (t.name = "" + ge(c))
          : t.removeAttribute("name"));
    }
    function e1(t, e, l, a, n, u, i, c) {
      if (
        (u != null &&
          typeof u != "function" &&
          typeof u != "symbol" &&
          typeof u != "boolean" &&
          (t.type = u),
        e != null || l != null)
      ) {
        if (!((u !== "submit" && u !== "reset") || e != null)) {
          W0(t);
          return;
        }
        ((l = l != null ? "" + ge(l) : ""),
          (e = e != null ? "" + ge(e) : l),
          c || e === t.value || (t.value = e),
          (t.defaultValue = e));
      }
      ((a = a ?? n),
        (a = typeof a != "function" && typeof a != "symbol" && !!a),
        (t.checked = c ? t.checked : !!a),
        (t.defaultChecked = !!a),
        i != null &&
          typeof i != "function" &&
          typeof i != "symbol" &&
          typeof i != "boolean" &&
          (t.name = i),
        W0(t));
    }
    function v0(t, e) {
      t.defaultValue !== "" + e && (t.defaultValue = "" + e);
    }
    function cn(t, e, l, a) {
      if (((t = t.options), e)) {
        e = {};
        for (var n = 0; n < l.length; n++) e["$" + l[n]] = !0;
        for (l = 0; l < t.length; l++)
          ((n = e.hasOwnProperty("$" + t[l].value)),
            t[l].selected !== n && (t[l].selected = n),
            n && a && (t[l].defaultSelected = !0));
      } else {
        for (l = "" + ge(l), e = null, n = 0; n < t.length; n++) {
          if (t[n].value === l) {
            ((t[n].selected = !0), a && (t[n].defaultSelected = !0));
            return;
          }
          e !== null || t[n].disabled || (e = t[n]);
        }
        e !== null && (e.selected = !0);
      }
    }
    function l1(t, e, l) {
      if (e != null && ((e = "" + ge(e)), e !== t.value && (t.value = e), l == null)) {
        t.defaultValue !== e && (t.defaultValue = e);
        return;
      }
      t.defaultValue = l != null ? "" + ge(l) : "";
    }
    function a1(t, e, l, a) {
      if (e == null) {
        if (a != null) {
          if (l != null) throw Error(C(92));
          if (tu(a)) {
            if (1 < a.length) throw Error(C(93));
            a = a[0];
          }
          l = a;
        }
        (l == null && (l = ""), (e = l));
      }
      ((l = ge(e)),
        (t.defaultValue = l),
        (a = t.textContent),
        a === l && a !== "" && a !== null && (t.value = a),
        W0(t));
    }
    function gn(t, e) {
      if (e) {
        var l = t.firstChild;
        if (l && l === t.lastChild && l.nodeType === 3) {
          l.nodeValue = e;
          return;
        }
      }
      t.textContent = e;
    }
    var Ov = new Set(
      "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
        " ",
      ),
    );
    function id(t, e, l) {
      var a = e.indexOf("--") === 0;
      l == null || typeof l == "boolean" || l === ""
        ? a
          ? t.setProperty(e, "")
          : e === "float"
            ? (t.cssFloat = "")
            : (t[e] = "")
        : a
          ? t.setProperty(e, l)
          : typeof l != "number" || l === 0 || Ov.has(e)
            ? e === "float"
              ? (t.cssFloat = l)
              : (t[e] = ("" + l).trim())
            : (t[e] = l + "px");
    }
    function n1(t, e, l) {
      if (e != null && typeof e != "object") throw Error(C(62));
      if (((t = t.style), l != null)) {
        for (var a in l)
          !l.hasOwnProperty(a) ||
            (e != null && e.hasOwnProperty(a)) ||
            (a.indexOf("--") === 0
              ? t.setProperty(a, "")
              : a === "float"
                ? (t.cssFloat = "")
                : (t[a] = ""),
            (ct = !0));
        for (var n in e)
          ((a = e[n]), e.hasOwnProperty(n) && l[n] !== a && (id(t, n, a), (ct = !0)));
      } else for (var u in e) e.hasOwnProperty(u) && id(t, u, e[u]);
    }
    function nf(t) {
      if (t.indexOf("-") === -1) return !1;
      switch (t) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return !1;
        default:
          return !0;
      }
    }
    var Rv = new Map([
        ["acceptCharset", "accept-charset"],
        ["htmlFor", "for"],
        ["httpEquiv", "http-equiv"],
        ["crossOrigin", "crossorigin"],
        ["accentHeight", "accent-height"],
        ["alignmentBaseline", "alignment-baseline"],
        ["arabicForm", "arabic-form"],
        ["baselineShift", "baseline-shift"],
        ["capHeight", "cap-height"],
        ["clipPath", "clip-path"],
        ["clipRule", "clip-rule"],
        ["colorInterpolation", "color-interpolation"],
        ["colorInterpolationFilters", "color-interpolation-filters"],
        ["colorProfile", "color-profile"],
        ["colorRendering", "color-rendering"],
        ["dominantBaseline", "dominant-baseline"],
        ["enableBackground", "enable-background"],
        ["fillOpacity", "fill-opacity"],
        ["fillRule", "fill-rule"],
        ["floodColor", "flood-color"],
        ["floodOpacity", "flood-opacity"],
        ["fontFamily", "font-family"],
        ["fontSize", "font-size"],
        ["fontSizeAdjust", "font-size-adjust"],
        ["fontStretch", "font-stretch"],
        ["fontStyle", "font-style"],
        ["fontVariant", "font-variant"],
        ["fontWeight", "font-weight"],
        ["glyphName", "glyph-name"],
        ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
        ["glyphOrientationVertical", "glyph-orientation-vertical"],
        ["horizAdvX", "horiz-adv-x"],
        ["horizOriginX", "horiz-origin-x"],
        ["imageRendering", "image-rendering"],
        ["letterSpacing", "letter-spacing"],
        ["lightingColor", "lighting-color"],
        ["markerEnd", "marker-end"],
        ["markerMid", "marker-mid"],
        ["markerStart", "marker-start"],
        ["maskType", "mask-type"],
        ["overlinePosition", "overline-position"],
        ["overlineThickness", "overline-thickness"],
        ["paintOrder", "paint-order"],
        ["panose-1", "panose-1"],
        ["pointerEvents", "pointer-events"],
        ["renderingIntent", "rendering-intent"],
        ["shapeRendering", "shape-rendering"],
        ["stopColor", "stop-color"],
        ["stopOpacity", "stop-opacity"],
        ["strikethroughPosition", "strikethrough-position"],
        ["strikethroughThickness", "strikethrough-thickness"],
        ["strokeDasharray", "stroke-dasharray"],
        ["strokeDashoffset", "stroke-dashoffset"],
        ["strokeLinecap", "stroke-linecap"],
        ["strokeLinejoin", "stroke-linejoin"],
        ["strokeMiterlimit", "stroke-miterlimit"],
        ["strokeOpacity", "stroke-opacity"],
        ["strokeWidth", "stroke-width"],
        ["textAnchor", "text-anchor"],
        ["textDecoration", "text-decoration"],
        ["textRendering", "text-rendering"],
        ["transformOrigin", "transform-origin"],
        ["underlinePosition", "underline-position"],
        ["underlineThickness", "underline-thickness"],
        ["unicodeBidi", "unicode-bidi"],
        ["unicodeRange", "unicode-range"],
        ["unitsPerEm", "units-per-em"],
        ["vAlphabetic", "v-alphabetic"],
        ["vHanging", "v-hanging"],
        ["vIdeographic", "v-ideographic"],
        ["vMathematical", "v-mathematical"],
        ["vectorEffect", "vector-effect"],
        ["vertAdvY", "vert-adv-y"],
        ["vertOriginX", "vert-origin-x"],
        ["vertOriginY", "vert-origin-y"],
        ["wordSpacing", "word-spacing"],
        ["writingMode", "writing-mode"],
        ["xmlnsXlink", "xmlns:xlink"],
        ["xHeight", "x-height"],
      ]),
      Hv =
        /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function Ci(t) {
      return Hv.test("" + t)
        ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
        : t;
    }
    function el() {}
    var to = null;
    function uf(t) {
      return (
        (t = t.target || t.srcElement || window),
        t.correspondingUseElement && (t = t.correspondingUseElement),
        t.nodeType === 3 ? t.parentNode : t
      );
    }
    var Ia = null,
      on = null;
    function cd(t) {
      var e = _n(t);
      if (e && (t = e.stateNode)) {
        var l = t[ve] || null;
        t: switch (((t = e.stateNode), e.type)) {
          case "input":
            if (
              (P0(
                t,
                l.value,
                l.defaultValue,
                l.defaultValue,
                l.checked,
                l.defaultChecked,
                l.type,
                l.name,
              ),
              (e = l.name),
              l.type === "radio" && e != null)
            ) {
              for (l = t; l.parentNode;) l = l.parentNode;
              for (
                l = l.querySelectorAll('input[name="' + Re("" + e) + '"][type="radio"]'), e = 0;
                e < l.length;
                e++
              ) {
                var a = l[e];
                if (a !== t && a.form === t.form) {
                  var n = a[ve] || null;
                  if (!n) throw Error(C(90));
                  P0(
                    a,
                    n.value,
                    n.defaultValue,
                    n.defaultValue,
                    n.checked,
                    n.defaultChecked,
                    n.type,
                    n.name,
                  );
                }
              }
              for (e = 0; e < l.length; e++) ((a = l[e]), a.form === t.form && t1(a));
            }
            break t;
          case "textarea":
            l1(t, l.value, l.defaultValue);
            break t;
          case "select":
            ((e = l.value), e != null && cn(t, !!l.multiple, e, !1));
        }
      }
    }
    var y0 = !1;
    function u1(t, e, l) {
      if (y0) return t(e, l);
      y0 = !0;
      try {
        var a = t(e);
        return a;
      } finally {
        if (
          ((y0 = !1),
          (Ia !== null || on !== null) &&
            (Oc(), Ia && ((e = Ia), (t = on), (on = Ia = null), cd(e), t)))
        )
          for (e = 0; e < t.length; e++) cd(t[e]);
      }
    }
    function gu(t, e) {
      var l = t.stateNode;
      if (l === null) return null;
      var a = l[ve] || null;
      if (a === null) return null;
      l = a[e];
      t: switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          ((a = !a.disabled) ||
            ((t = t.type),
            (a = !(t === "button" || t === "input" || t === "select" || t === "textarea"))),
            (t = !a));
          break t;
        default:
          t = !1;
      }
      if (t) return null;
      if (l && typeof l != "function") throw Error(C(231, e, typeof l));
      return l;
    }
    var gl = !(
        typeof window > "u" ||
        typeof window.document > "u" ||
        typeof window.document.createElement > "u"
      ),
      eo = !1;
    if (gl)
      try {
        ((Ga = {}),
          Object.defineProperty(Ga, "passive", {
            get: function () {
              eo = !0;
            },
          }),
          window.addEventListener("test", Ga, Ga),
          window.removeEventListener("test", Ga, Ga));
      } catch {
        eo = !1;
      }
    var Ga,
      ql = null,
      cf = null,
      xi = null;
    function i1() {
      if (xi) return xi;
      var t,
        e = cf,
        l = e.length,
        a,
        n = "value" in ql ? ql.value : ql.textContent,
        u = n.length;
      for (t = 0; t < l && e[t] === n[t]; t++);
      var i = l - t;
      for (a = 1; a <= i && e[l - a] === n[u - a]; a++);
      return (xi = n.slice(t, 1 < a ? 1 - a : void 0));
    }
    function Mi(t) {
      var e = t.keyCode;
      return (
        "charCode" in t ? ((t = t.charCode), t === 0 && e === 13 && (t = 13)) : (t = e),
        t === 10 && (t = 13),
        32 <= t || t === 13 ? t : 0
      );
    }
    function oi() {
      return !0;
    }
    function od() {
      return !1;
    }
    function ie(t) {
      function e(l, a, n, u, i) {
        ((this._reactName = l),
          (this._targetInst = n),
          (this.type = a),
          (this.nativeEvent = u),
          (this.target = i),
          (this.currentTarget = null));
        for (var c in t) t.hasOwnProperty(c) && ((l = t[c]), (this[c] = l ? l(u) : u[c]));
        return (
          (this.isDefaultPrevented = (
            u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1
          )
            ? oi
            : od),
          (this.isPropagationStopped = od),
          this
        );
      }
      return (
        bt(e.prototype, {
          preventDefault: function () {
            this.defaultPrevented = !0;
            var l = this.nativeEvent;
            l &&
              (l.preventDefault
                ? l.preventDefault()
                : typeof l.returnValue != "unknown" && (l.returnValue = !1),
              (this.isDefaultPrevented = oi));
          },
          stopPropagation: function () {
            var l = this.nativeEvent;
            l &&
              (l.stopPropagation
                ? l.stopPropagation()
                : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0),
              (this.isPropagationStopped = oi));
          },
          persist: function () {},
          isPersistent: oi,
        }),
        e
      );
    }
    var na = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function (t) {
          return t.timeStamp || Date.now();
        },
        defaultPrevented: 0,
        isTrusted: 0,
      },
      Sc = ie(na),
      qu = bt({}, na, { view: 0, detail: 0 }),
      Uv = ie(qu),
      p0,
      g0,
      Fn,
      Ac = bt({}, qu, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: of,
        button: 0,
        buttons: 0,
        relatedTarget: function (t) {
          return t.relatedTarget === void 0
            ? t.fromElement === t.srcElement
              ? t.toElement
              : t.fromElement
            : t.relatedTarget;
        },
        movementX: function (t) {
          return "movementX" in t
            ? t.movementX
            : (t !== Fn &&
                (Fn && t.type === "mousemove"
                  ? ((p0 = t.screenX - Fn.screenX), (g0 = t.screenY - Fn.screenY))
                  : (g0 = p0 = 0),
                (Fn = t)),
              p0);
        },
        movementY: function (t) {
          return "movementY" in t ? t.movementY : g0;
        },
      }),
      fd = ie(Ac),
      Lv = bt({}, Ac, { dataTransfer: 0 }),
      qv = ie(Lv),
      Yv = bt({}, qu, { relatedTarget: 0 }),
      b0 = ie(Yv),
      jv = bt({}, na, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
      Gv = ie(jv),
      Vv = bt({}, na, {
        clipboardData: function (t) {
          return "clipboardData" in t ? t.clipboardData : window.clipboardData;
        },
      }),
      Qv = ie(Vv),
      Xv = bt({}, na, { data: 0 }),
      sd = ie(Xv),
      Zv = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified",
      },
      kv = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta",
      },
      Kv = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
    function Fv(t) {
      var e = this.nativeEvent;
      return e.getModifierState ? e.getModifierState(t) : (t = Kv[t]) ? !!e[t] : !1;
    }
    function of() {
      return Fv;
    }
    var Jv = bt({}, qu, {
        key: function (t) {
          if (t.key) {
            var e = Zv[t.key] || t.key;
            if (e !== "Unidentified") return e;
          }
          return t.type === "keypress"
            ? ((t = Mi(t)), t === 13 ? "Enter" : String.fromCharCode(t))
            : t.type === "keydown" || t.type === "keyup"
              ? kv[t.keyCode] || "Unidentified"
              : "";
        },
        code: 0,
        location: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        repeat: 0,
        locale: 0,
        getModifierState: of,
        charCode: function (t) {
          return t.type === "keypress" ? Mi(t) : 0;
        },
        keyCode: function (t) {
          return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
        },
        which: function (t) {
          return t.type === "keypress"
            ? Mi(t)
            : t.type === "keydown" || t.type === "keyup"
              ? t.keyCode
              : 0;
        },
      }),
      Iv = ie(Jv),
      $v = bt({}, Ac, {
        pointerId: 0,
        width: 0,
        height: 0,
        pressure: 0,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        pointerType: 0,
        isPrimary: 0,
      }),
      dd = ie($v),
      Wv = bt({}, na, { submitter: 0 }),
      Pv = ie(Wv),
      ty = bt({}, qu, {
        touches: 0,
        targetTouches: 0,
        changedTouches: 0,
        altKey: 0,
        metaKey: 0,
        ctrlKey: 0,
        shiftKey: 0,
        getModifierState: of,
      }),
      ey = ie(ty),
      ly = bt({}, na, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
      ay = ie(ly),
      ny = bt({}, Ac, {
        deltaX: function (t) {
          return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
        },
        deltaY: function (t) {
          return "deltaY" in t
            ? t.deltaY
            : "wheelDeltaY" in t
              ? -t.wheelDeltaY
              : "wheelDelta" in t
                ? -t.wheelDelta
                : 0;
        },
        deltaZ: 0,
        deltaMode: 0,
      }),
      uy = ie(ny),
      iy = bt({}, na, { newState: 0, oldState: 0, source: 0 }),
      cy = ie(iy),
      oy = [9, 13, 27, 32],
      ff = gl && "CompositionEvent" in window,
      nu = null;
    gl && "documentMode" in document && (nu = document.documentMode);
    var fy = gl && "TextEvent" in window && !nu,
      c1 = gl && (!ff || (nu && 8 < nu && 11 >= nu)),
      rd = " ",
      hd = !1;
    function o1(t, e) {
      switch (t) {
        case "keyup":
          return oy.indexOf(e.keyCode) !== -1;
        case "keydown":
          return e.keyCode !== 229;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function f1(t) {
      return ((t = t.detail), typeof t == "object" && "data" in t ? t.data : null);
    }
    var $a = !1;
    function sy(t, e) {
      switch (t) {
        case "compositionend":
          return f1(e);
        case "keypress":
          return e.which !== 32 ? null : ((hd = !0), rd);
        case "textInput":
          return ((t = e.data), t === rd && hd ? null : t);
        default:
          return null;
      }
    }
    function dy(t, e) {
      if ($a)
        return t === "compositionend" || (!ff && o1(t, e))
          ? ((t = i1()), (xi = cf = ql = null), ($a = !1), t)
          : null;
      switch (t) {
        case "paste":
          return null;
        case "keypress":
          if (!(e.ctrlKey || e.altKey || e.metaKey) || (e.ctrlKey && e.altKey)) {
            if (e.char && 1 < e.char.length) return e.char;
            if (e.which) return String.fromCharCode(e.which);
          }
          return null;
        case "compositionend":
          return c1 && e.locale !== "ko" ? null : e.data;
        default:
          return null;
      }
    }
    var ry = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0,
    };
    function md(t) {
      var e = t && t.nodeName && t.nodeName.toLowerCase();
      return e === "input" ? !!ry[t.type] : e === "textarea";
    }
    function s1(t, e, l, a) {
      (Ia ? (on ? on.push(a) : (on = [a])) : (Ia = a),
        (e = vc(e, "onChange")),
        0 < e.length &&
          ((l = new Sc("onChange", "change", null, l, a)), t.push({ event: l, listeners: e })));
    }
    var uu = null,
      bu = null;
    function hy(t) {
      u2(t, 0);
    }
    function Ec(t) {
      var e = eu(t);
      if (t1(e)) return t;
    }
    function vd(t, e) {
      if (t === "change") return e;
    }
    var d1 = !1;
    gl &&
      (gl
        ? ((si = "oninput" in document),
          si ||
            ((S0 = document.createElement("div")),
            S0.setAttribute("oninput", "return;"),
            (si = typeof S0.oninput == "function")),
          (fi = si))
        : (fi = !1),
      (d1 = fi && (!document.documentMode || 9 < document.documentMode)));
    var fi, si, S0;
    function yd() {
      uu && (uu.detachEvent("onpropertychange", r1), (bu = uu = null));
    }
    function r1(t) {
      if (t.propertyName === "value" && Ec(bu)) {
        var e = [];
        (s1(e, bu, t, uf(t)), u1(hy, e));
      }
    }
    function my(t, e, l) {
      t === "focusin"
        ? (yd(), (uu = e), (bu = l), uu.attachEvent("onpropertychange", r1))
        : t === "focusout" && yd();
    }
    function vy(t) {
      if (t === "selectionchange" || t === "keyup" || t === "keydown") return Ec(bu);
    }
    function yy(t, e) {
      if (t === "click") return Ec(e);
    }
    function py(t, e) {
      if (t === "input" || t === "change") return Ec(e);
    }
    function gy(t, e) {
      return (t === e && (t !== 0 || 1 / t === 1 / e)) || (t !== t && e !== e);
    }
    var xe = typeof Object.is == "function" ? Object.is : gy;
    function Su(t, e) {
      if (xe(t, e)) return !0;
      if (typeof t != "object" || t === null || typeof e != "object" || e === null) return !1;
      var l = Object.keys(t),
        a = Object.keys(e);
      if (l.length !== a.length) return !1;
      for (a = 0; a < l.length; a++) {
        var n = l[a];
        if (!$0.call(e, n) || !xe(t[n], e[n])) return !1;
      }
      return !0;
    }
    function lo(t) {
      if (((t = t || (typeof document < "u" ? document : void 0)), typeof t > "u")) return null;
      try {
        return t.activeElement || t.body;
      } catch {
        return t.body;
      }
    }
    function pd(t) {
      for (; t && t.firstChild;) t = t.firstChild;
      return t;
    }
    function gd(t, e) {
      var l = pd(t);
      t = 0;
      for (var a; l;) {
        if (l.nodeType === 3) {
          if (((a = t + l.textContent.length), t <= e && a >= e)) return { node: l, offset: e - t };
          t = a;
        }
        t: {
          for (; l;) {
            if (l.nextSibling) {
              l = l.nextSibling;
              break t;
            }
            l = l.parentNode;
          }
          l = void 0;
        }
        l = pd(l);
      }
    }
    function h1(t, e) {
      return t && e
        ? t === e
          ? !0
          : t && t.nodeType === 3
            ? !1
            : e && e.nodeType === 3
              ? h1(t, e.parentNode)
              : "contains" in t
                ? t.contains(e)
                : t.compareDocumentPosition
                  ? !!(t.compareDocumentPosition(e) & 16)
                  : !1
        : !1;
    }
    function m1(t) {
      t =
        t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null
          ? t.ownerDocument.defaultView
          : window;
      for (var e = lo(t.document); e instanceof t.HTMLIFrameElement;) {
        try {
          var l = typeof e.contentWindow.location.href == "string";
        } catch {
          l = !1;
        }
        if (l) t = e.contentWindow;
        else break;
        e = lo(t.document);
      }
      return e;
    }
    function sf(t) {
      var e = t && t.nodeName && t.nodeName.toLowerCase();
      return (
        e &&
        ((e === "input" &&
          (t.type === "text" ||
            t.type === "search" ||
            t.type === "tel" ||
            t.type === "url" ||
            t.type === "password")) ||
          e === "textarea" ||
          t.contentEditable === "true")
      );
    }
    var by = gl && "documentMode" in document && 11 >= document.documentMode,
      Wa = null,
      ao = null,
      iu = null,
      no = !1;
    function bd(t, e, l) {
      var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
      no ||
        Wa == null ||
        Wa !== lo(a) ||
        ((a = Wa),
        "selectionStart" in a && sf(a)
          ? (a = { start: a.selectionStart, end: a.selectionEnd })
          : ((a = ((a.ownerDocument && a.ownerDocument.defaultView) || window).getSelection()),
            (a = {
              anchorNode: a.anchorNode,
              anchorOffset: a.anchorOffset,
              focusNode: a.focusNode,
              focusOffset: a.focusOffset,
            })),
        (iu && Su(iu, a)) ||
          ((iu = a),
          (a = vc(ao, "onSelect")),
          0 < a.length &&
            ((e = new Sc("onSelect", "select", null, e, l)),
            t.push({ event: e, listeners: a }),
            (e.target = Wa))));
    }
    function da(t, e) {
      var l = {};
      return (
        (l[t.toLowerCase()] = e.toLowerCase()),
        (l["Webkit" + t] = "webkit" + e),
        (l["Moz" + t] = "moz" + e),
        l
      );
    }
    var Pa = {
        animationend: da("Animation", "AnimationEnd"),
        animationiteration: da("Animation", "AnimationIteration"),
        animationstart: da("Animation", "AnimationStart"),
        transitionrun: da("Transition", "TransitionRun"),
        transitionstart: da("Transition", "TransitionStart"),
        transitioncancel: da("Transition", "TransitionCancel"),
        transitionend: da("Transition", "TransitionEnd"),
      },
      A0 = {},
      v1 = {};
    gl &&
      ((v1 = document.createElement("div").style),
      "AnimationEvent" in window ||
        (delete Pa.animationend.animation,
        delete Pa.animationiteration.animation,
        delete Pa.animationstart.animation),
      "TransitionEvent" in window || delete Pa.transitionend.transition);
    function Oa(t) {
      if (A0[t]) return A0[t];
      if (!Pa[t]) return t;
      var e = Pa[t],
        l;
      for (l in e) if (e.hasOwnProperty(l) && l in v1) return (A0[t] = e[l]);
      return t;
    }
    var y1 = Oa("animationend"),
      p1 = Oa("animationiteration"),
      g1 = Oa("animationstart"),
      Sy = Oa("transitionrun"),
      Ay = Oa("transitionstart"),
      Ey = Oa("transitioncancel"),
      b1 = Oa("transitionend"),
      S1 = new Map(),
      uo =
        "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
          " ",
        );
    uo.push("scrollEnd");
    function ke(t, e) {
      (S1.set(t, e), Ba(e, [t]));
    }
    var Ty = 0;
    function bl(t, e) {
      if (t.name != null && t.name !== "auto") return t.name;
      if (e.autoName !== null) return e.autoName;
      t = Ze.identifierPrefix;
      var l = Ty++;
      return ((t = "_" + t + "t_" + l.toString(32) + "_"), (e.autoName = t));
    }
    function Sd(t) {
      if (t == null || typeof t == "string") return t;
      var e = null,
        l = vn;
      if (l !== null)
        for (var a = 0; a < l.length; a++) {
          var n = t[l[a]];
          if (n != null) {
            if (n === "none") return "none";
            e = e == null ? n : e + (" " + n);
          }
        }
      return e ?? t.default;
    }
    function Cl(t, e) {
      return (
        (t = Sd(t)),
        (e = Sd(e)),
        e == null ? (t === "auto" ? null : t) : e === "auto" ? null : e
      );
    }
    var Fi =
        typeof reportError == "function"
          ? reportError
          : function (t) {
              if (typeof window == "object" && typeof window.ErrorEvent == "function") {
                var e = new window.ErrorEvent("error", {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    typeof t == "object" && t !== null && typeof t.message == "string"
                      ? String(t.message)
                      : String(t),
                  error: t,
                });
                if (!window.dispatchEvent(e)) return;
              } else if (typeof process == "object" && typeof process.emit == "function") {
                process.emit("uncaughtException", t);
                return;
              }
              console.error(t);
            },
      De = [],
      tn = 0,
      df = 0;
    function Tc() {
      for (var t = tn, e = (df = tn = 0); e < t;) {
        var l = De[e];
        De[e++] = null;
        var a = De[e];
        De[e++] = null;
        var n = De[e];
        De[e++] = null;
        var u = De[e];
        if (((De[e++] = null), a !== null && n !== null)) {
          var i = a.pending;
          (i === null ? (n.next = n) : ((n.next = i.next), (i.next = n)), (a.pending = n));
        }
        u !== 0 && A1(l, n, u);
      }
    }
    function zc(t, e, l, a) {
      ((De[tn++] = t),
        (De[tn++] = e),
        (De[tn++] = l),
        (De[tn++] = a),
        (df |= a),
        (t.lanes |= a),
        (t = t.alternate),
        t !== null && (t.lanes |= a));
    }
    function rf(t, e, l, a) {
      return (zc(t, e, l, a), Ji(t));
    }
    function Ra(t, e) {
      return (zc(t, null, null, e), Ji(t));
    }
    function A1(t, e, l) {
      t.lanes |= l;
      var a = t.alternate;
      a !== null && (a.lanes |= l);
      for (var n = !1, u = t.return; u !== null;)
        ((u.childLanes |= l),
          (a = u.alternate),
          a !== null && (a.childLanes |= l),
          u.tag === 22 && ((t = u.stateNode), t === null || t._visibility & 1 || (n = !0)),
          (t = u),
          (u = u.return));
      return t.tag === 3
        ? ((u = t.stateNode),
          n &&
            e !== null &&
            ((n = 31 - ze(l)),
            (t = u.hiddenUpdates),
            (a = t[n]),
            a === null ? (t[n] = [e]) : a.push(e),
            (e.lane = l | 536870912)),
          u)
        : null;
    }
    function Ji(t) {
      if (50 < yu) throw ((yu = 0), (Li = null), Error(C(185)));
      for (var e = t.return; e !== null;) ((t = e), (e = t.return));
      return t.tag === 3 ? t.stateNode : null;
    }
    var en = {};
    function zy(t, e, l, a) {
      ((this.tag = t),
        (this.key = l),
        (this.sibling =
          this.child =
          this.return =
          this.stateNode =
          this.type =
          this.elementType =
            null),
        (this.index = 0),
        (this.refCleanup = this.ref = null),
        (this.pendingProps = e),
        (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
        (this.mode = a),
        (this.subtreeFlags = this.flags = 0),
        (this.deletions = null),
        (this.childLanes = this.lanes = 0),
        (this.alternate = null));
    }
    function re(t, e, l, a) {
      return new zy(t, e, l, a);
    }
    function hf(t) {
      return ((t = t.prototype), !(!t || !t.isReactComponent));
    }
    function yl(t, e) {
      var l = t.alternate;
      return (
        l === null
          ? ((l = re(t.tag, e, t.key, t.mode)),
            (l.elementType = t.elementType),
            (l.type = t.type),
            (l.stateNode = t.stateNode),
            (l.alternate = t),
            (t.alternate = l))
          : ((l.pendingProps = e),
            (l.type = t.type),
            (l.flags = 0),
            (l.subtreeFlags = 0),
            (l.deletions = null)),
        (l.flags = t.flags & 1206910976),
        (l.childLanes = t.childLanes),
        (l.lanes = t.lanes),
        (l.child = t.child),
        (l.memoizedProps = t.memoizedProps),
        (l.memoizedState = t.memoizedState),
        (l.updateQueue = t.updateQueue),
        (e = t.dependencies),
        (l.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }),
        (l.sibling = t.sibling),
        (l.index = t.index),
        (l.ref = t.ref),
        (l.refCleanup = t.refCleanup),
        l
      );
    }
    function E1(t, e) {
      t.flags &= 1206910978;
      var l = t.alternate;
      return (
        l === null
          ? ((t.childLanes = 0),
            (t.lanes = e),
            (t.child = null),
            (t.subtreeFlags = 0),
            (t.memoizedProps = null),
            (t.memoizedState = null),
            (t.updateQueue = null),
            (t.dependencies = null),
            (t.stateNode = null))
          : ((t.childLanes = l.childLanes),
            (t.lanes = l.lanes),
            (t.child = l.child),
            (t.subtreeFlags = 0),
            (t.deletions = null),
            (t.memoizedProps = l.memoizedProps),
            (t.memoizedState = l.memoizedState),
            (t.updateQueue = l.updateQueue),
            (t.type = l.type),
            (e = l.dependencies),
            (t.dependencies =
              e === null ? null : { lanes: e.lanes, firstContext: e.firstContext })),
        t
      );
    }
    function wi(t, e, l, a, n, u) {
      var i = 0;
      if (((a = t), typeof a == "function")) hf(a) && (i = 1);
      else if (typeof a == "string")
        i = Ip(t, l, nl.current) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
      else
        t: switch (a) {
          case k0:
            return ((t = re(31, l, e, n)), (t.elementType = k0), (t.lanes = u), t);
          case Fa:
            return ba(l.children, n, u, e);
          case Yr:
            ((i = 8), (n |= 24));
            break;
          case Q0:
            return ((t = re(12, l, e, n | 2)), (t.elementType = Q0), (t.lanes = u), t);
          case X0:
            return ((t = re(13, l, e, n)), (t.elementType = X0), (t.lanes = u), t);
          case Z0:
            return ((t = re(19, l, e, n)), (t.elementType = Z0), (t.lanes = u), t);
          case dv:
          case K0:
            return (
              (t = n | 32),
              (t = re(30, l, e, t)),
              (t.elementType = K0),
              (t.lanes = u),
              (t.stateNode = { autoName: null, paired: null, clones: null, ref: null }),
              t
            );
          default:
            if (typeof a == "object" && a !== null)
              switch (a.$$typeof) {
                case tl:
                  i = 10;
                  break t;
                case jr:
                  i = 9;
                  break t;
                case Po:
                  i = 11;
                  break t;
                case tf:
                  i = 14;
                  break t;
                case Rl:
                  ((i = 16), (a = null));
                  break t;
              }
            ((i = 29), (l = Error(C(130, t === null ? "null" : typeof t, ""))), (a = null));
        }
      return ((e = re(i, l, e, n)), (e.elementType = t), (e.type = a), (e.lanes = u), e);
    }
    function ba(t, e, l, a) {
      return ((t = re(7, t, a, e)), (t.lanes = l), t);
    }
    function E0(t, e, l) {
      return ((t = re(6, t, null, e)), (t.lanes = l), t);
    }
    function T1(t) {
      var e = re(18, null, null, 0);
      return ((e.stateNode = t), e);
    }
    function T0(t, e, l) {
      return (
        (e = re(4, t.children !== null ? t.children : [], t.key, e)),
        (e.lanes = l),
        (e.stateNode = {
          containerInfo: t.containerInfo,
          pendingChildren: null,
          implementation: t.implementation,
        }),
        e
      );
    }
    var Ad = new WeakMap();
    function He(t, e) {
      if (typeof t == "object" && t !== null) {
        var l = Ad.get(t);
        return l !== void 0 ? l : ((e = { value: t, source: e, stack: Ps(e) }), Ad.set(t, e), e);
      }
      return { value: t, source: e, stack: Ps(e) };
    }
    var ln = [],
      an = 0,
      Ii = null,
      Au = 0,
      Be = [],
      Oe = 0,
      Pl = null,
      ll = 1,
      al = "";
    function ml(t, e) {
      ((ln[an++] = Au), (ln[an++] = Ii), (Ii = t), (Au = e));
    }
    function z1(t, e, l) {
      ((Be[Oe++] = ll), (Be[Oe++] = al), (Be[Oe++] = Pl), (Pl = t));
      var a = ll;
      t = al;
      var n = 32 - ze(a) - 1;
      ((a &= ~(1 << n)), (l += 1));
      var u = 32 - ze(e) + n;
      if (30 < u) {
        var i = n - (n % 5);
        ((u = (a & ((1 << i) - 1)).toString(32)),
          (a >>= i),
          (n -= i),
          (ll = (1 << (32 - ze(e) + n)) | (l << n) | a),
          (al = u + t));
      } else ((ll = (1 << u) | (l << n) | a), (al = t));
    }
    function Cc(t) {
      t.return !== null && (ml(t, 1), z1(t, 1, 0));
    }
    function mf(t) {
      for (; t === Ii;) ((Ii = ln[--an]), (ln[an] = null), (Au = ln[--an]), (ln[an] = null));
      for (; t === Pl;)
        ((Pl = Be[--Oe]),
          (Be[Oe] = null),
          (al = Be[--Oe]),
          (Be[Oe] = null),
          (ll = Be[--Oe]),
          (Be[Oe] = null));
    }
    function C1(t, e) {
      ((Be[Oe++] = ll), (Be[Oe++] = al), (Be[Oe++] = Pl), (ll = e.id), (al = e.overflow), (Pl = t));
    }
    var Vt = null,
      Et = null,
      et = !1,
      Xl = null,
      Ue = !1,
      io = Error(C(519));
    function ta(t) {
      var e = Error(
        C(
          418,
          1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
          "",
        ),
      );
      throw (Eu(He(e, t)), io);
    }
    function Ed(t) {
      var e = t.stateNode,
        l = t.type,
        a = t.memoizedProps;
      switch (((e[Zt] = t), (e[ve] = a), l)) {
        case "dialog":
          (nt("cancel", e), nt("close", e));
          break;
        case "iframe":
        case "object":
        case "embed":
          nt("load", e);
          break;
        case "video":
        case "audio":
          for (l = 0; l < xu.length; l++) nt(xu[l], e);
          break;
        case "source":
          nt("error", e);
          break;
        case "img":
        case "image":
        case "link":
          (nt("error", e), nt("load", e));
          break;
        case "details":
          nt("toggle", e);
          break;
        case "input":
          (nt("invalid", e),
            e1(e, a.value, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name, !0));
          break;
        case "select":
          nt("invalid", e);
          break;
        case "textarea":
          (nt("invalid", e), a1(e, a.value, a.defaultValue, a.children));
      }
      ((l = a.children),
        (typeof l != "string" && typeof l != "number" && typeof l != "bigint") ||
        e.textContent === "" + l ||
        a.suppressHydrationWarning === !0 ||
        c2(e.textContent, l)
          ? (a.popover != null && (nt("beforetoggle", e), nt("toggle", e)),
            a.onScroll != null && nt("scroll", e),
            a.onScrollEnd != null && nt("scrollend", e),
            a.onClick != null && (e.onclick = el),
            (e = !0))
          : (e = !1),
        e || ta(t, !0));
    }
    function $i(t) {
      for (Vt = t.return; Vt;)
        switch (Vt.tag) {
          case 5:
          case 31:
          case 13:
            Ue = !1;
            return;
          case 27:
          case 3:
            Ue = !0;
            return;
          default:
            Vt = Vt.return;
        }
    }
    function Va(t) {
      if (t !== Vt) return !1;
      if (!et) return ($i(t), (et = !0), !1);
      var e = t.tag,
        l;
      if (
        ((l = e !== 3 && e !== 27) &&
          ((l = e === 5) &&
            ((l = t.type), (l = !(l !== "form" && l !== "button") || Zo(t.type, t.memoizedProps))),
          (l = !l)),
        l && Et && ta(t),
        $i(t),
        e === 13)
      ) {
        if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t))
          throw Error(C(317));
        Et = gr(t);
      } else if (e === 31) {
        if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t))
          throw Error(C(317));
        Et = gr(t);
      } else
        e === 27
          ? ((e = Et), ua(t.type) ? ((t = Jo), (Jo = null), (Et = t)) : (Et = e))
          : (Et = Vt ? Le(t.stateNode.nextSibling) : null);
      return !0;
    }
    function Ta() {
      ((Et = Vt = null), (et = !1));
    }
    function z0() {
      var t = Xl;
      return (t !== null && (se === null ? (se = t) : se.push.apply(se, t), (Xl = null)), t);
    }
    function Eu(t) {
      Xl === null ? (Xl = [t]) : Xl.push(t);
    }
    var co = cl(null),
      Ha = null,
      vl = null;
    function Yl(t, e, l) {
      (Tt(co, e._currentValue), (e._currentValue = l));
    }
    function pl(t) {
      ((t._currentValue = co.current), Kt(co));
    }
    function Ni(t, e, l) {
      for (; t !== null;) {
        var a = t.alternate;
        if (
          ((t.childLanes & e) !== e
            ? ((t.childLanes |= e), a !== null && (a.childLanes |= e))
            : a !== null && (a.childLanes & e) !== e && (a.childLanes |= e),
          t === l)
        )
          break;
        t = t.return;
      }
    }
    function oo(t, e, l, a) {
      var n = t.child;
      for (n !== null && (n.return = t); n !== null;) {
        var u = n.dependencies;
        if (u !== null) {
          var i = n.child;
          u = u.firstContext;
          t: for (; u !== null;) {
            var c = u;
            u = n;
            for (var f = 0; f < e.length; f++)
              if (c.context === e[f]) {
                ((u.lanes |= l),
                  (c = u.alternate),
                  c !== null && (c.lanes |= l),
                  Ni(u.return, l, t),
                  a || (i = null));
                break t;
              }
            u = c.next;
          }
        } else if (n.tag === 18) {
          if (((i = n.return), i === null)) throw Error(C(341));
          ((i.lanes |= l),
            (u = i.alternate),
            u !== null && (u.lanes |= l),
            Ni(i, l, t),
            (i = null));
        } else
          n.tag === 13 && n.memoizedState !== null && n.memoizedState.dehydrated === null
            ? ((n.lanes |= l),
              (i = n.alternate),
              i !== null && (i.lanes |= l),
              Ni(n.return, l, t),
              (i = n.child),
              (i = i !== null ? i.sibling : null))
            : (i = n.child);
        if (i !== null) i.return = n;
        else
          for (i = n; i !== null;) {
            if (i === t) {
              i = null;
              break;
            }
            if (((n = i.sibling), n !== null)) {
              ((n.return = i.return), (i = n));
              break;
            }
            i = i.return;
          }
        n = i;
      }
    }
    function za(t, e, l, a) {
      t = null;
      for (var n = e, u = !1; n !== null;) {
        if (!u) {
          if ((n.flags & 524288) !== 0) u = !0;
          else if ((n.flags & 262144) !== 0) break;
        }
        if (n.tag === 10) {
          var i = n.alternate;
          if (i === null) throw Error(C(387));
          if (((i = i.memoizedProps), i !== null)) {
            var c = n.type;
            xe(n.pendingProps.value, i.value) || (t !== null ? t.push(c) : (t = [c]));
          }
        } else if (n === Qi.current) {
          if (((i = n.alternate), i === null)) throw Error(C(387));
          i.memoizedState.memoizedState !== n.memoizedState.memoizedState &&
            (t !== null ? t.push(xn) : (t = [xn]));
        }
        n = n.return;
      }
      return (t !== null && oo(e, t, l, a), (e.flags |= 262144), t !== null);
    }
    function Wi(t) {
      for (t = t.firstContext; t !== null;) {
        if (!xe(t.context._currentValue, t.memoizedValue)) return !0;
        t = t.next;
      }
      return !1;
    }
    function Ca(t) {
      ((Ha = t), (vl = null), (t = t.dependencies), t !== null && (t.firstContext = null));
    }
    function kt(t) {
      return x1(Ha, t);
    }
    function di(t, e) {
      return (Ha === null && Ca(t), x1(t, e));
    }
    function x1(t, e) {
      var l = e._currentValue;
      if (((e = { context: e, memoizedValue: l, next: null }), vl === null)) {
        if (t === null) throw Error(C(308));
        ((vl = e), (t.dependencies = { lanes: 0, firstContext: e }), (t.flags |= 524288));
      } else vl = vl.next = e;
      return l;
    }
    var Cy =
        typeof AbortController < "u"
          ? AbortController
          : function () {
              var t = [],
                e = (this.signal = {
                  aborted: !1,
                  addEventListener: function (l, a) {
                    t.push(a);
                  },
                });
              this.abort = function () {
                ((e.aborted = !0),
                  t.forEach(function (l) {
                    return l();
                  }));
              };
            },
      xy = qt.unstable_scheduleCallback,
      My = qt.unstable_NormalPriority,
      Rt = {
        $$typeof: tl,
        Consumer: null,
        Provider: null,
        _currentValue: null,
        _currentValue2: null,
        _threadCount: 0,
      };
    function vf() {
      return { controller: new Cy(), data: new Map(), refCount: 0 };
    }
    function Yu(t) {
      (t.refCount--,
        t.refCount === 0 &&
          xy(My, function () {
            t.controller.abort();
          }));
    }
    function Td(t, e) {
      if ((t.pendingLanes & 4194048) !== 0) {
        var l = t.transitionTypes;
        for (l === null && (l = t.transitionTypes = []), t = 0; t < e.length; t++) {
          var a = e[t];
          l.indexOf(a) === -1 && l.push(a);
        }
      }
    }
    var lu = null;
    function wy(t) {
      var e = t.transitionTypes;
      return ((t.transitionTypes = null), e);
    }
    var cu = null,
      fo = 0,
      xa = 0,
      fn = null;
    function Ny(t, e) {
      if (cu === null) {
        var l = (cu = []);
        ((fo = 0),
          (xa = Qf()),
          (fn = {
            status: "pending",
            value: void 0,
            then: function (a) {
              l.push(a);
            },
          }));
      }
      return (fo++, e.then(zd, zd), e);
    }
    function zd() {
      if (--fo === 0 && ((lu = null), cu !== null)) {
        fn !== null && (fn.status = "fulfilled");
        var t = cu;
        ((cu = null), (xa = 0), (fn = null));
        for (var e = 0; e < t.length; e++) (0, t[e])();
      }
    }
    function _y(t, e) {
      var l = [],
        a = {
          status: "pending",
          value: null,
          reason: null,
          then: function (n) {
            l.push(n);
          },
        };
      return (
        t.then(
          function () {
            ((a.status = "fulfilled"), (a.value = e));
            for (var n = 0; n < l.length; n++) (0, l[n])(e);
          },
          function (n) {
            for (a.status = "rejected", a.reason = n, n = 0; n < l.length; n++) (0, l[n])(void 0);
          },
        ),
        a
      );
    }
    var Cd = J.S;
    J.S = function (t, e) {
      if (
        ((Xh = Ee()),
        typeof e == "object" && e !== null && typeof e.then == "function" && Ny(t, e),
        lu !== null)
      )
        for (var l = Tn; l !== null;) (Td(l, lu), (l = l.next));
      if (((l = t.types), l !== null)) {
        for (var a = Tn; a !== null;) (Td(a, l), (a = a.next));
        if (xa !== 0) {
          ((a = lu), a === null && (a = lu = []));
          for (var n = 0; n < l.length; n++) {
            var u = l[n];
            a.indexOf(u) === -1 && a.push(u);
          }
        }
      }
      Cd !== null && Cd(t, e);
    };
    var Sa = cl(null);
    function yf() {
      var t = Sa.current;
      return t !== null ? t : gt.pooledCache;
    }
    function _i(t, e) {
      e === null ? Tt(Sa, Sa.current) : Tt(Sa, e.pool);
    }
    function M1() {
      var t = yf();
      return t === null ? null : { parent: Rt._currentValue, pool: t };
    }
    var Dn = Error(C(460)),
      pf = Error(C(474)),
      xc = Error(C(542)),
      Pi = { then: function () {} };
    function xd(t) {
      return ((t = t.status), t === "fulfilled" || t === "rejected");
    }
    function w1(t, e, l) {
      switch (
        ((l = t[l]), l === void 0 ? t.push(e) : l !== e && (e.then(el, el), (e = l)), e.status)
      ) {
        case "fulfilled":
          return e.value;
        case "rejected":
          throw ((t = e.reason), wd(t), t === void 0 && !("reason" in e) ? Error(C(600)) : t);
        default:
          if (typeof e.status == "string") e.then(el, el);
          else {
            if (((t = gt), t !== null && 100 < t.shellSuspendCounter)) throw Error(C(482));
            ((t = e),
              (t.status = "pending"),
              t.then(
                function (a) {
                  if (e.status === "pending") {
                    var n = e;
                    ((n.status = "fulfilled"), (n.value = a));
                  }
                },
                function (a) {
                  if (e.status === "pending") {
                    var n = e;
                    ((n.status = "rejected"), (n.reason = a));
                  }
                },
              ));
          }
          switch (e.status) {
            case "fulfilled":
              return e.value;
            case "rejected":
              throw ((t = e.reason), wd(t), t);
          }
          throw ((Aa = e), Dn);
      }
    }
    function ma(t) {
      try {
        var e = t._init;
        return e(t._payload);
      } catch (l) {
        throw l !== null && typeof l == "object" && typeof l.then == "function"
          ? ((Aa = l), Dn)
          : l;
      }
    }
    var Aa = null;
    function Md() {
      if (Aa === null) throw Error(C(459));
      var t = Aa;
      return ((Aa = null), t);
    }
    function wd(t) {
      if (t === Dn || t === xc) throw Error(C(483));
    }
    var sn = null,
      Tu = 0;
    function ri(t) {
      var e = Tu;
      return ((Tu += 1), sn === null && (sn = []), w1(sn, t, e));
    }
    function Dl(t, e) {
      ((e = e.props.ref), (t.ref = e !== void 0 ? e : null));
    }
    function hi(t, e) {
      throw e.$$typeof === sv
        ? Error(C(525))
        : ((t = Object.prototype.toString.call(e)),
          Error(
            C(
              31,
              t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t,
            ),
          ));
    }
    function N1(t) {
      function e(r, h) {
        if (t) {
          var y = r.deletions;
          y === null ? ((r.deletions = [h]), (r.flags |= 16)) : y.push(h);
        }
      }
      function l(r, h) {
        if (!t) return null;
        for (; h !== null;) (e(r, h), (h = h.sibling));
        return null;
      }
      function a(r) {
        for (var h = new Map(); r !== null;)
          (r.key === null ? h.set(r.index, r) : h.set(r.key, r), (r = r.sibling));
        return h;
      }
      function n(r, h) {
        return ((r = yl(r, h)), (r.index = 0), (r.sibling = null), r);
      }
      function u(r, h, y) {
        return (
          (r.index = y),
          t
            ? ((y = r.alternate),
              y !== null
                ? ((y = y.index), y < h ? ((r.flags |= 2), h) : y)
                : ((r.flags |= 134217730), h))
            : ((r.flags |= 1048576), h)
        );
      }
      function i(r) {
        return (t && r.alternate === null && (r.flags |= 134217730), r);
      }
      function c(r, h, y, S) {
        return h === null || h.tag !== 6
          ? ((h = E0(y, r.mode, S)), (h.return = r), h)
          : ((h = n(h, y)), (h.return = r), h);
      }
      function f(r, h, y, S) {
        var _ = y.type;
        return _ === Fa
          ? ((r = g(r, h, y.props.children, S, y.key)), Dl(r, y), r)
          : h !== null &&
              (h.elementType === _ ||
                (typeof _ == "object" && _ !== null && _.$$typeof === Rl && ma(_) === h.type))
            ? ((h = n(h, y.props)), Dl(h, y), (h.return = r), h)
            : ((h = wi(y.type, y.key, y.props, null, r.mode, S)), Dl(h, y), (h.return = r), h);
      }
      function m(r, h, y, S) {
        return h === null ||
          h.tag !== 4 ||
          h.stateNode.containerInfo !== y.containerInfo ||
          h.stateNode.implementation !== y.implementation
          ? ((h = T0(y, r.mode, S)), (h.return = r), h)
          : ((h = n(h, y.children || [])), (h.return = r), h);
      }
      function g(r, h, y, S, _) {
        return h === null || h.tag !== 7
          ? ((h = ba(y, r.mode, S, _)), (h.return = r), h)
          : ((h = n(h, y)), (h.return = r), h);
      }
      function A(r, h, y) {
        if ((typeof h == "string" && h !== "") || typeof h == "number" || typeof h == "bigint")
          return ((h = E0("" + h, r.mode, y)), (h.return = r), h);
        if (typeof h == "object" && h !== null) {
          switch (h.$$typeof) {
            case ai:
              return (
                (y = wi(h.type, h.key, h.props, null, r.mode, y)),
                Dl(y, h),
                (y.return = r),
                y
              );
            case Pn:
              return ((h = T0(h, r.mode, y)), (h.return = r), h);
            case Rl:
              return ((h = ma(h)), A(r, h, y));
          }
          if (tu(h) || Kn(h)) return ((h = ba(h, r.mode, y, null)), (h.return = r), h);
          if (typeof h.then == "function") return A(r, ri(h), y);
          if (h.$$typeof === tl) return A(r, di(r, h), y);
          hi(r, h);
        }
        return null;
      }
      function v(r, h, y, S) {
        var _ = h !== null ? h.key : null;
        if ((typeof y == "string" && y !== "") || typeof y == "number" || typeof y == "bigint")
          return _ !== null ? null : c(r, h, "" + y, S);
        if (typeof y == "object" && y !== null) {
          switch (y.$$typeof) {
            case ai:
              return y.key === _ ? f(r, h, y, S) : null;
            case Pn:
              return y.key === _ ? m(r, h, y, S) : null;
            case Rl:
              return ((y = ma(y)), v(r, h, y, S));
          }
          if (tu(y) || Kn(y)) return _ !== null ? null : g(r, h, y, S, null);
          if (typeof y.then == "function") return v(r, h, ri(y), S);
          if (y.$$typeof === tl) return v(r, h, di(r, y), S);
          hi(r, y);
        }
        return null;
      }
      function p(r, h, y, S, _) {
        if ((typeof S == "string" && S !== "") || typeof S == "number" || typeof S == "bigint")
          return ((r = r.get(y) || null), c(h, r, "" + S, _));
        if (typeof S == "object" && S !== null) {
          switch (S.$$typeof) {
            case ai:
              return ((r = r.get(S.key === null ? y : S.key) || null), f(h, r, S, _));
            case Pn:
              return ((r = r.get(S.key === null ? y : S.key) || null), m(h, r, S, _));
            case Rl:
              return ((S = ma(S)), p(r, h, y, S, _));
          }
          if (tu(S) || Kn(S)) return ((r = r.get(y) || null), g(h, r, S, _, null));
          if (typeof S.then == "function") return p(r, h, y, ri(S), _);
          if (S.$$typeof === tl) return p(r, h, y, di(h, S), _);
          hi(h, S);
        }
        return null;
      }
      function x(r, h, y, S) {
        for (
          var _ = null, F = null, V = h, Q = (h = 0), ot = null;
          V !== null && Q < y.length;
          Q++
        ) {
          V.index > Q ? ((ot = V), (V = null)) : (ot = V.sibling);
          var tt = v(r, V, y[Q], S);
          if (tt === null) {
            V === null && (V = ot);
            break;
          }
          (t && V && tt.alternate === null && e(r, V),
            (h = u(tt, h, Q)),
            F === null ? (_ = tt) : (F.sibling = tt),
            (F = tt),
            (V = ot));
        }
        if (Q === y.length) return (l(r, V), et && ml(r, Q), _);
        if (V === null) {
          for (; Q < y.length; Q++)
            ((V = A(r, y[Q], S)),
              V !== null && ((h = u(V, h, Q)), F === null ? (_ = V) : (F.sibling = V), (F = V)));
          return (et && ml(r, Q), _);
        }
        for (V = a(V); Q < y.length; Q++)
          ((ot = p(V, r, Q, y[Q], S)),
            ot !== null &&
              (t && ((tt = ot.alternate), tt !== null && V.delete(tt.key === null ? Q : tt.key)),
              (h = u(ot, h, Q)),
              F === null ? (_ = ot) : (F.sibling = ot),
              (F = ot)));
        return (
          t &&
            V.forEach(function (wt) {
              return e(r, wt);
            }),
          et && ml(r, Q),
          _
        );
      }
      function R(r, h, y, S) {
        if (y == null) throw Error(C(151));
        for (
          var _ = null, F = null, V = h, Q = (h = 0), ot = null, tt = y.next();
          V !== null && !tt.done;
          Q++, tt = y.next()
        ) {
          V.index > Q ? ((ot = V), (V = null)) : (ot = V.sibling);
          var wt = v(r, V, tt.value, S);
          if (wt === null) {
            V === null && (V = ot);
            break;
          }
          (t && V && wt.alternate === null && e(r, V),
            (h = u(wt, h, Q)),
            F === null ? (_ = wt) : (F.sibling = wt),
            (F = wt),
            (V = ot));
        }
        if (tt.done) return (l(r, V), et && ml(r, Q), _);
        if (V === null) {
          for (; !tt.done; Q++, tt = y.next())
            ((tt = A(r, tt.value, S)),
              tt !== null &&
                ((h = u(tt, h, Q)), F === null ? (_ = tt) : (F.sibling = tt), (F = tt)));
          return (et && ml(r, Q), _);
        }
        for (V = a(V); !tt.done; Q++, tt = y.next())
          ((tt = p(V, r, Q, tt.value, S)),
            tt !== null &&
              (t && ((ot = tt.alternate), ot !== null && V.delete(ot.key === null ? Q : ot.key)),
              (h = u(tt, h, Q)),
              F === null ? (_ = tt) : (F.sibling = tt),
              (F = tt)));
        return (
          t &&
            V.forEach(function (ce) {
              return e(r, ce);
            }),
          et && ml(r, Q),
          _
        );
      }
      function j(r, h, y, S) {
        if (
          (typeof y == "object" &&
            y !== null &&
            y.type === Fa &&
            y.key === null &&
            y.props.ref === void 0 &&
            (y = y.props.children),
          typeof y == "object" && y !== null)
        ) {
          switch (y.$$typeof) {
            case ai:
              t: {
                for (var _ = y.key; h !== null;) {
                  if (h.key === _) {
                    if (((_ = y.type), _ === Fa)) {
                      if (h.tag === 7) {
                        (l(r, h.sibling),
                          (S = n(h, y.props.children)),
                          Dl(S, y),
                          (S.return = r),
                          (r = S));
                        break t;
                      }
                    } else if (
                      h.elementType === _ ||
                      (typeof _ == "object" && _ !== null && _.$$typeof === Rl && ma(_) === h.type)
                    ) {
                      (l(r, h.sibling), (S = n(h, y.props)), Dl(S, y), (S.return = r), (r = S));
                      break t;
                    }
                    l(r, h);
                    break;
                  } else e(r, h);
                  h = h.sibling;
                }
                y.type === Fa
                  ? ((S = ba(y.props.children, r.mode, S, y.key)),
                    Dl(S, y),
                    (S.return = r),
                    (r = S))
                  : ((S = wi(y.type, y.key, y.props, null, r.mode, S)),
                    Dl(S, y),
                    (S.return = r),
                    (r = S));
              }
              return i(r);
            case Pn:
              t: {
                for (_ = y.key; h !== null;) {
                  if (h.key === _)
                    if (
                      h.tag === 4 &&
                      h.stateNode.containerInfo === y.containerInfo &&
                      h.stateNode.implementation === y.implementation
                    ) {
                      (l(r, h.sibling), (S = n(h, y.children || [])), (S.return = r), (r = S));
                      break t;
                    } else {
                      l(r, h);
                      break;
                    }
                  else e(r, h);
                  h = h.sibling;
                }
                ((S = T0(y, r.mode, S)), (S.return = r), (r = S));
              }
              return i(r);
            case Rl:
              return ((y = ma(y)), j(r, h, y, S));
          }
          if (tu(y)) return x(r, h, y, S);
          if (Kn(y)) {
            if (((_ = Kn(y)), typeof _ != "function")) throw Error(C(150));
            return ((y = _.call(y)), R(r, h, y, S));
          }
          if (typeof y.then == "function") return j(r, h, ri(y), S);
          if (y.$$typeof === tl) return j(r, h, di(r, y), S);
          hi(r, y);
        }
        return (typeof y == "string" && y !== "") || typeof y == "number" || typeof y == "bigint"
          ? ((y = "" + y),
            h !== null && h.tag === 6
              ? (l(r, h.sibling), (S = n(h, y)), (S.return = r), (r = S))
              : (l(r, h), (S = E0(y, r.mode, S)), (S.return = r), (r = S)),
            i(r))
          : l(r, h);
      }
      return function (r, h, y, S) {
        try {
          Tu = 0;
          var _ = j(r, h, y, S);
          return ((sn = null), _);
        } catch (V) {
          if (V === Dn || V === xc) throw V;
          var F = re(29, V, null, r.mode);
          return ((F.lanes = S), (F.return = r), F);
        }
      };
    }
    var Ma = N1(!0),
      _1 = N1(!1),
      Hl = !1;
    function gf(t) {
      t.updateQueue = {
        baseState: t.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, lanes: 0, hiddenCallbacks: null },
        callbacks: null,
      };
    }
    function so(t, e) {
      ((t = t.updateQueue),
        e.updateQueue === t &&
          (e.updateQueue = {
            baseState: t.baseState,
            firstBaseUpdate: t.firstBaseUpdate,
            lastBaseUpdate: t.lastBaseUpdate,
            shared: t.shared,
            callbacks: null,
          }));
    }
    function Zl(t) {
      return { lane: t, tag: 0, payload: null, callback: null, next: null };
    }
    function kl(t, e, l) {
      var a = t.updateQueue;
      if (a === null) return null;
      if (((a = a.shared), (ft & 2) !== 0)) {
        var n = a.pending;
        return (
          n === null ? (e.next = e) : ((e.next = n.next), (n.next = e)),
          (a.pending = e),
          (e = Ji(t)),
          A1(t, null, l),
          e
        );
      }
      return (zc(t, a, e, l), Ji(t));
    }
    function ou(t, e, l) {
      if (((e = e.updateQueue), e !== null && ((e = e.shared), (l & 4194048) !== 0))) {
        var a = e.lanes;
        ((a &= t.pendingLanes), (l |= a), (e.lanes = l), Kr(t, l));
      }
    }
    function C0(t, e) {
      var l = t.updateQueue,
        a = t.alternate;
      if (a !== null && ((a = a.updateQueue), l === a)) {
        var n = null,
          u = null;
        if (((l = l.firstBaseUpdate), l !== null)) {
          do {
            var i = { lane: l.lane, tag: l.tag, payload: l.payload, callback: null, next: null };
            (u === null ? (n = u = i) : (u = u.next = i), (l = l.next));
          } while (l !== null);
          u === null ? (n = u = e) : (u = u.next = e);
        } else n = u = e;
        ((l = {
          baseState: a.baseState,
          firstBaseUpdate: n,
          lastBaseUpdate: u,
          shared: a.shared,
          callbacks: a.callbacks,
        }),
          (t.updateQueue = l));
        return;
      }
      ((t = l.lastBaseUpdate),
        t === null ? (l.firstBaseUpdate = e) : (t.next = e),
        (l.lastBaseUpdate = e));
    }
    var ro = !1;
    function fu() {
      if (ro) {
        var t = fn;
        if (t !== null) throw t;
      }
    }
    function su(t, e, l, a) {
      ro = !1;
      var n = t.updateQueue;
      Hl = !1;
      var u = n.firstBaseUpdate,
        i = n.lastBaseUpdate,
        c = n.shared.pending;
      if (c !== null) {
        n.shared.pending = null;
        var f = c,
          m = f.next;
        ((f.next = null), i === null ? (u = m) : (i.next = m), (i = f));
        var g = t.alternate;
        g !== null &&
          ((g = g.updateQueue),
          (c = g.lastBaseUpdate),
          c !== i && (c === null ? (g.firstBaseUpdate = m) : (c.next = m), (g.lastBaseUpdate = f)));
      }
      if (u !== null) {
        var A = n.baseState;
        ((i = 0), (g = m = f = null), (c = u));
        do {
          var v = c.lane & -536870913,
            p = v !== c.lane;
          if (p ? (it & v) === v : (a & v) === v) {
            (v !== 0 && v === xa && (ro = !0),
              g !== null &&
                (g = g.next =
                  { lane: 0, tag: c.tag, payload: c.payload, callback: null, next: null }));
            t: {
              var x = t,
                R = c;
              v = e;
              var j = l;
              switch (R.tag) {
                case 1:
                  if (((x = R.payload), typeof x == "function")) {
                    A = x.call(j, A, v);
                    break t;
                  }
                  A = x;
                  break t;
                case 3:
                  x.flags = (x.flags & -65537) | 128;
                case 0:
                  if (
                    ((x = R.payload), (v = typeof x == "function" ? x.call(j, A, v) : x), v == null)
                  )
                    break t;
                  A = bt({}, A, v);
                  break t;
                case 2:
                  Hl = !0;
              }
            }
            ((v = c.callback),
              v !== null &&
                ((t.flags |= 64),
                p && (t.flags |= 8192),
                (p = n.callbacks),
                p === null ? (n.callbacks = [v]) : p.push(v)));
          } else
            ((p = { lane: v, tag: c.tag, payload: c.payload, callback: c.callback, next: null }),
              g === null ? ((m = g = p), (f = A)) : (g = g.next = p),
              (i |= v));
          if (((c = c.next), c === null)) {
            if (((c = n.shared.pending), c === null)) break;
            ((p = c),
              (c = p.next),
              (p.next = null),
              (n.lastBaseUpdate = p),
              (n.shared.pending = null));
          }
        } while (!0);
        (g === null && (f = A),
          (n.baseState = f),
          (n.firstBaseUpdate = m),
          (n.lastBaseUpdate = g),
          u === null && (n.shared.lanes = 0),
          (aa |= i),
          (t.lanes = i),
          (t.memoizedState = A));
      }
    }
    function D1(t, e) {
      if (typeof t != "function") throw Error(C(191, t));
      t.call(e);
    }
    function B1(t, e) {
      var l = t.callbacks;
      if (l !== null) for (t.callbacks = null, t = 0; t < l.length; t++) D1(l[t], e);
    }
    var ea = cl(null),
      tc = cl(0);
    function Nd(t, e) {
      ((t = Tl), Tt(tc, t), Tt(ea, e), (Tl = t | e.baseLanes));
    }
    function ho() {
      (Tt(tc, Tl), Tt(ea, ea.current));
    }
    function bf() {
      ((Tl = tc.current), Kt(ea), Kt(tc));
    }
    var It = cl(null),
      Pt = null;
    function Kl(t) {
      var e = t.alternate;
      (Tt(Ft, Ft.current & 1),
        Tt(It, t),
        Pt === null && (e === null || ea.current !== null || e.memoizedState !== null) && (Pt = t));
    }
    function mo(t) {
      (Tt(Ft, Ft.current), Tt(It, t), Pt === null && (Pt = t));
    }
    function O1(t) {
      t.tag === 22 ? (Tt(Ft, Ft.current), Tt(It, t), Pt === null && (Pt = t)) : Fl();
    }
    function Fl() {
      (Tt(Ft, Ft.current), Tt(It, It.current));
    }
    function be(t) {
      (Kt(It), Pt === t && (Pt = null), Kt(Ft));
    }
    var Ft = cl(0);
    function zu(t, e) {
      (Tt(It, It.current), Tt(Ft, e));
    }
    function Sf(t) {
      (Kt(Ft), Kt(It), Pt === t && (Pt = null));
    }
    function ec(t) {
      for (var e = t; e !== null;) {
        if (e.tag === 13) {
          var l = e.memoizedState;
          if (l !== null && ((l = l.dehydrated), l === null || Fo(l) || Kf(l))) return e;
        } else if (e.tag === 19 && e.memoizedProps.revealOrder !== "independent") {
          if ((e.flags & 128) !== 0) return e;
        } else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === t) break;
        for (; e.sibling === null;) {
          if (e.return === null || e.return === t) return null;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
      return null;
    }
    var Sl = 0,
      W = null,
      pt = null,
      Ot = null,
      lc = !1,
      dn = !1,
      wa = !1,
      ac = 0,
      Cu = 0,
      rn = null,
      Dy = 0;
    function Nt() {
      throw Error(C(321));
    }
    function Af(t, e) {
      if (e === null) return !1;
      for (var l = 0; l < e.length && l < t.length; l++) if (!xe(t[l], e[l])) return !1;
      return !0;
    }
    function Ef(t, e, l, a, n, u) {
      return (
        (Sl = u),
        (W = e),
        (e.memoizedState = null),
        (e.updateQueue = null),
        (e.lanes = 0),
        (J.H = t === null || t.memoizedState === null ? sh : dh),
        (wa = !1),
        (u = l(a, n)),
        (wa = !1),
        dn && (u = H1(e, l, a, n)),
        R1(t),
        u
      );
    }
    function R1(t) {
      J.H = nc;
      var e = pt !== null && pt.next !== null;
      if (((Sl = 0), (Ot = pt = W = null), (lc = !1), (Cu = 0), (rn = null), e))
        throw Error(C(300));
      t === null || Ht || ((t = t.dependencies), t !== null && Wi(t) && (Ht = !0));
    }
    function H1(t, e, l, a) {
      W = t;
      var n = 0;
      do {
        if ((dn && (rn = null), (Cu = 0), (dn = !1), 25 <= n)) throw Error(C(301));
        if (((n += 1), (Ot = pt = null), t.updateQueue != null)) {
          var u = t.updateQueue;
          ((u.lastEffect = null),
            (u.events = null),
            (u.stores = null),
            u.memoCache != null && (u.memoCache.index = 0));
        }
        ((J.H = Yy), (u = e(l, a)));
      } while (dn);
      return u;
    }
    function By() {
      var t = J.H,
        e = t.useState()[0];
      return (
        (e = typeof e.then == "function" ? ju(e) : e),
        (t = t.useState()[0]),
        (pt !== null ? pt.memoizedState : null) !== t && (W.flags |= 1024),
        e
      );
    }
    function Tf() {
      var t = ac !== 0;
      return ((ac = 0), t);
    }
    function zf(t, e, l) {
      ((e.updateQueue = t.updateQueue), (e.flags &= -2053), (t.lanes &= ~l));
    }
    function Cf(t) {
      if (lc) {
        for (t = t.memoizedState; t !== null;) {
          var e = t.queue;
          (e !== null && (e.pending = null), (t = t.next));
        }
        lc = !1;
      }
      ((Sl = 0), (Ot = pt = W = null), (dn = !1), (Cu = ac = 0), (rn = null));
    }
    function ue() {
      var t = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
      return (Ot === null ? (W.memoizedState = Ot = t) : (Ot = Ot.next = t), Ot);
    }
    function Dt() {
      if (pt === null) {
        var t = W.alternate;
        t = t !== null ? t.memoizedState : null;
      } else t = pt.next;
      var e = Ot === null ? W.memoizedState : Ot.next;
      if (e !== null) ((Ot = e), (pt = t));
      else {
        if (t === null) throw W.alternate === null ? Error(C(467)) : Error(C(310));
        ((pt = t),
          (t = {
            memoizedState: pt.memoizedState,
            baseState: pt.baseState,
            baseQueue: pt.baseQueue,
            queue: pt.queue,
            next: null,
          }),
          Ot === null ? (W.memoizedState = Ot = t) : (Ot = Ot.next = t));
      }
      return Ot;
    }
    function Mc() {
      return { lastEffect: null, events: null, stores: null, memoCache: null };
    }
    function ju(t) {
      var e = Cu;
      return (
        (Cu += 1),
        rn === null && (rn = []),
        (t = w1(rn, t, e)),
        (e = W),
        (Ot === null ? e.memoizedState : Ot.next) === null &&
          ((e = e.alternate), (J.H = e === null || e.memoizedState === null ? sh : dh)),
        t
      );
    }
    function wc(t) {
      if (t !== null && typeof t == "object") {
        if (typeof t.then == "function") return ju(t);
        if (t.$$typeof === hv) return;
        if (t.$$typeof === tl) return kt(t);
      }
      throw Error(C(438, String(t)));
    }
    function xf(t) {
      var e = null,
        l = W.updateQueue;
      if ((l !== null && (e = l.memoCache), e == null)) {
        var a = W.alternate;
        a !== null &&
          ((a = a.updateQueue),
          a !== null &&
            ((a = a.memoCache),
            a != null &&
              (e = {
                data: a.data.map(function (n) {
                  return n.slice();
                }),
                index: 0,
              })));
      }
      if (
        (e == null && (e = { data: [], index: 0 }),
        l === null && ((l = Mc()), (W.updateQueue = l)),
        (l.memoCache = e),
        (l = e.data[e.index]),
        l === void 0)
      )
        for (l = e.data[e.index] = Array(t), a = 0; a < t; a++) l[a] = rv;
      return (e.index++, l);
    }
    function Al(t, e) {
      return typeof e == "function" ? e(t) : e;
    }
    function Di(t) {
      var e = Dt();
      return Mf(e, pt, t);
    }
    function Mf(t, e, l) {
      var a = t.queue;
      if (a === null) throw Error(C(311));
      a.lastRenderedReducer = l;
      var n = t.baseQueue,
        u = a.pending;
      if (u !== null) {
        if (n !== null) {
          var i = n.next;
          ((n.next = u.next), (u.next = i));
        }
        ((e.baseQueue = n = u), (a.pending = null));
      }
      if (((u = t.baseState), n === null)) t.memoizedState = u;
      else {
        e = n.next;
        var c = (i = null),
          f = null,
          m = e,
          g = !1;
        do {
          var A = m.lane & -536870913;
          if (A !== m.lane ? (it & A) === A : (Sl & A) === A) {
            var v = m.revertLane;
            if (v === 0)
              (f !== null &&
                (f = f.next =
                  {
                    lane: 0,
                    revertLane: 0,
                    gesture: null,
                    action: m.action,
                    hasEagerState: m.hasEagerState,
                    eagerState: m.eagerState,
                    next: null,
                  }),
                A === xa && (g = !0));
            else if ((Sl & v) === v) {
              ((m = m.next), v === xa && (g = !0));
              continue;
            } else
              ((A = {
                lane: 0,
                revertLane: m.revertLane,
                gesture: null,
                action: m.action,
                hasEagerState: m.hasEagerState,
                eagerState: m.eagerState,
                next: null,
              }),
                f === null ? ((c = f = A), (i = u)) : (f = f.next = A),
                (W.lanes |= v),
                (aa |= v));
            ((A = m.action), wa && l(u, A), (u = m.hasEagerState ? m.eagerState : l(u, A)));
          } else
            ((v = {
              lane: A,
              revertLane: m.revertLane,
              gesture: m.gesture,
              action: m.action,
              hasEagerState: m.hasEagerState,
              eagerState: m.eagerState,
              next: null,
            }),
              f === null ? ((c = f = v), (i = u)) : (f = f.next = v),
              (W.lanes |= A),
              (aa |= A));
          m = m.next;
        } while (m !== null && m !== e);
        if (
          (f === null ? (i = u) : (f.next = c),
          !xe(u, t.memoizedState) && ((Ht = !0), g && ((l = fn), l !== null)))
        )
          throw l;
        ((t.memoizedState = u), (t.baseState = i), (t.baseQueue = f), (a.lastRenderedState = u));
      }
      return (n === null && (a.lanes = 0), [t.memoizedState, a.dispatch]);
    }
    function x0(t) {
      var e = Dt(),
        l = e.queue;
      if (l === null) throw Error(C(311));
      l.lastRenderedReducer = t;
      var a = l.dispatch,
        n = l.pending,
        u = e.memoizedState;
      if (n !== null) {
        l.pending = null;
        var i = (n = n.next);
        do ((u = t(u, i.action)), (i = i.next));
        while (i !== n);
        (xe(u, e.memoizedState) || (Ht = !0),
          (e.memoizedState = u),
          e.baseQueue === null && (e.baseState = u),
          (l.lastRenderedState = u));
      }
      return [u, a];
    }
    function U1(t, e, l) {
      var a = W,
        n = Dt(),
        u = et;
      if (u) {
        if (l === void 0) throw Error(C(407));
        l = l();
      } else l = e();
      var i = !xe((pt || n).memoizedState, l);
      if (
        (i && ((n.memoizedState = l), (Ht = !0)),
        (n = n.queue),
        wf(Y1.bind(null, a, n, t), [t]),
        (t = n.getSnapshot !== e || i || (Ot !== null && (Ot.memoizedState.tag & 1) !== 0)),
        bn(t ? 9 : 8, { destroy: void 0 }, q1.bind(null, a, n, l, e), null),
        t)
      ) {
        if (((a.flags |= 2048), gt === null)) throw Error(C(349));
        u || (Sl & 127) !== 0 || L1(a, e, l);
      }
      return l;
    }
    function L1(t, e, l) {
      ((t.flags |= 16384),
        (t = { getSnapshot: e, value: l }),
        (e = W.updateQueue),
        e === null
          ? ((e = Mc()), (W.updateQueue = e), (e.stores = [t]))
          : ((l = e.stores), l === null ? (e.stores = [t]) : l.push(t)));
    }
    function q1(t, e, l, a) {
      ((e.value = l), (e.getSnapshot = a), j1(e) && G1(t));
    }
    function Y1(t, e, l) {
      return l(function () {
        j1(e) && G1(t);
      });
    }
    function j1(t) {
      var e = t.getSnapshot;
      t = t.value;
      try {
        var l = e();
        return !xe(t, l);
      } catch {
        return !0;
      }
    }
    function G1(t) {
      var e = Ra(t, 2);
      e !== null && he(e, t, 2);
    }
    function vo(t) {
      var e = ue();
      if (typeof t == "function") {
        var l = t;
        if (((t = l()), wa)) {
          Ll(!0);
          try {
            l();
          } finally {
            Ll(!1);
          }
        }
      }
      return (
        (e.memoizedState = e.baseState = t),
        (e.queue = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Al,
          lastRenderedState: t,
        }),
        e
      );
    }
    function V1(t, e, l, a) {
      return ((t.baseState = l), Mf(t, pt, typeof a == "function" ? a : Al));
    }
    function Oy(t, e, l, a, n) {
      if (_c(t)) throw Error(C(485));
      if (((t = e.action), t !== null)) {
        var u = {
          payload: n,
          action: t,
          next: null,
          isTransition: !0,
          status: "pending",
          value: null,
          reason: null,
          listeners: [],
          then: function (i) {
            u.listeners.push(i);
          },
        };
        (J.T !== null ? l(!0) : (u.isTransition = !1),
          a(u),
          (l = e.pending),
          l === null
            ? ((u.next = e.pending = u), Q1(e, u))
            : ((u.next = l.next), (e.pending = l.next = u)));
      }
    }
    function Q1(t, e) {
      var l = e.action,
        a = e.payload,
        n = t.state;
      if (e.isTransition) {
        var u = J.T,
          i = {};
        ((i.types = u !== null ? u.types : null), (J.T = i));
        try {
          var c = l(n, a),
            f = J.S;
          (f !== null && f(i, c), _d(t, e, c));
        } catch (m) {
          yo(t, e, m);
        } finally {
          (u !== null && i.types !== null && (u.types = i.types), (J.T = u));
        }
      } else
        try {
          ((u = l(n, a)), _d(t, e, u));
        } catch (m) {
          yo(t, e, m);
        }
    }
    function _d(t, e, l) {
      l !== null && typeof l == "object" && typeof l.then == "function"
        ? l.then(
            function (a) {
              Dd(t, e, a);
            },
            function (a) {
              return yo(t, e, a);
            },
          )
        : Dd(t, e, l);
    }
    function Dd(t, e, l) {
      ((e.status = "fulfilled"),
        (e.value = l),
        X1(e),
        (t.state = l),
        (e = t.pending),
        e !== null &&
          ((l = e.next), l === e ? (t.pending = null) : ((l = l.next), (e.next = l), Q1(t, l))));
    }
    function yo(t, e, l) {
      var a = t.pending;
      if (((t.pending = null), a !== null)) {
        a = a.next;
        do ((e.status = "rejected"), (e.reason = l), X1(e), (e = e.next));
        while (e !== a);
      }
      t.action = null;
    }
    function X1(t) {
      t = t.listeners;
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
    function Z1(t, e) {
      return e;
    }
    function Bd(t, e) {
      if (et) {
        var l = gt.formState;
        if (l !== null) {
          t: {
            var a = W;
            if (et) {
              if (Et) {
                e: {
                  for (var n = Et, u = Ue; n.nodeType !== 8;) {
                    if (!u) {
                      n = null;
                      break e;
                    }
                    if (((n = Le(n.nextSibling)), n === null)) {
                      n = null;
                      break e;
                    }
                  }
                  ((u = n.data), (n = u === "F!" || u === "F" ? n : null));
                }
                if (n) {
                  ((Et = Le(n.nextSibling)), (a = n.data === "F!"));
                  break t;
                }
              }
              ta(a);
            }
            a = !1;
          }
          a && (e = l[0]);
        }
      }
      return (
        (l = ue()),
        (l.memoizedState = l.baseState = e),
        (a = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Z1,
          lastRenderedState: e,
        }),
        (l.queue = a),
        (l = ch.bind(null, W, a)),
        (a.dispatch = l),
        (a = vo(!1)),
        (u = Bf.bind(null, W, !1, a.queue)),
        (a = ue()),
        (n = { state: e, dispatch: null, action: t, pending: null }),
        (a.queue = n),
        (l = Oy.bind(null, W, n, u, l)),
        (n.dispatch = l),
        (a.memoizedState = t),
        [e, l, !1]
      );
    }
    function Od(t) {
      var e = Dt();
      return k1(e, pt, t);
    }
    function k1(t, e, l) {
      if (
        ((e = Mf(t, e, Z1)[0]),
        (t = Di(Al)[0]),
        typeof e == "object" && e !== null && typeof e.then == "function")
      )
        try {
          var a = ju(e);
        } catch (i) {
          throw i === Dn ? xc : i;
        }
      else a = e;
      e = Dt();
      var n = e.queue,
        u = n.dispatch;
      return (
        l !== e.memoizedState &&
          ((W.flags |= 2048), bn(9, { destroy: void 0 }, Ry.bind(null, n, l), null)),
        [a, u, t]
      );
    }
    function Ry(t, e) {
      t.action = e;
    }
    function Rd(t) {
      var e = Dt(),
        l = pt;
      if (l !== null) return k1(e, l, t);
      (Dt(), (e = e.memoizedState), (l = Dt()));
      var a = l.queue.dispatch;
      return ((l.memoizedState = t), [e, a, !1]);
    }
    function bn(t, e, l, a) {
      return (
        (t = { tag: t, create: l, deps: a, inst: e, next: null }),
        (e = W.updateQueue),
        e === null && ((e = Mc()), (W.updateQueue = e)),
        (l = e.lastEffect),
        l === null
          ? (e.lastEffect = t.next = t)
          : ((a = l.next), (l.next = t), (t.next = a), (e.lastEffect = t)),
        t
      );
    }
    function K1() {
      return Dt().memoizedState;
    }
    function Bi(t, e, l, a) {
      var n = ue();
      ((W.flags |= t),
        (n.memoizedState = bn(1 | e, { destroy: void 0 }, l, a === void 0 ? null : a)));
    }
    function Nc(t, e, l, a) {
      var n = Dt();
      a = a === void 0 ? null : a;
      var u = n.memoizedState.inst;
      pt !== null && a !== null && Af(a, pt.memoizedState.deps)
        ? (n.memoizedState = bn(e, u, l, a))
        : ((W.flags |= t), (n.memoizedState = bn(1 | e, u, l, a)));
    }
    function Hd(t, e) {
      Bi(8390656, 8, t, e);
    }
    function wf(t, e) {
      Nc(2048, 8, t, e);
    }
    function Hy(t) {
      W.flags |= 4;
      var e = W.updateQueue;
      if (e === null) ((e = Mc()), (W.updateQueue = e), (e.events = [t]));
      else {
        var l = e.events;
        l === null ? (e.events = [t]) : l.push(t);
      }
    }
    function F1(t) {
      var e = Dt().memoizedState;
      return (
        Hy({ ref: e, nextImpl: t }),
        function () {
          if ((ft & 2) !== 0) throw Error(C(440));
          return e.impl.apply(void 0, arguments);
        }
      );
    }
    function J1(t, e) {
      return Nc(4, 2, t, e);
    }
    function I1(t, e) {
      return Nc(4, 4, t, e);
    }
    function $1(t, e) {
      if (typeof e == "function") {
        t = t();
        var l = e(t);
        return function () {
          typeof l == "function" ? l() : e(null);
        };
      }
      if (e != null)
        return (
          (t = t()),
          (e.current = t),
          function () {
            e.current = null;
          }
        );
    }
    function W1(t, e, l) {
      ((l = l != null ? l.concat([t]) : null), Nc(4, 4, $1.bind(null, e, t), l));
    }
    function Nf() {}
    function P1(t, e) {
      var l = Dt();
      e = e === void 0 ? null : e;
      var a = l.memoizedState;
      return e !== null && Af(e, a[1]) ? a[0] : ((l.memoizedState = [t, e]), t);
    }
    function th(t, e) {
      var l = Dt();
      e = e === void 0 ? null : e;
      var a = l.memoizedState;
      if (e !== null && Af(e, a[1])) return a[0];
      if (((a = t()), wa)) {
        Ll(!0);
        try {
          t();
        } finally {
          Ll(!1);
        }
      }
      return ((l.memoizedState = [a, e]), a);
    }
    function _f(t, e, l) {
      return l === void 0 || ((Sl & 1073741824) !== 0 && (it & 261930) === 0)
        ? (t.memoizedState = e)
        : ((t.memoizedState = l), (t = kh()), (W.lanes |= t), (aa |= t), l);
    }
    function eh(t, e, l, a) {
      return xe(l, e)
        ? l
        : ea.current !== null
          ? ((t = _f(t, l, a)), xe(t, e) || (Ht = !0), t)
          : (Sl & 106) === 0 || ((Sl & 1073741824) !== 0 && (it & 261930) === 0)
            ? ((Ht = !0), (t.memoizedState = l))
            : ((t = kh()), (W.lanes |= t), (aa |= t), e);
    }
    function lh(t, e, l, a, n) {
      var u = st.p;
      st.p = u !== 0 && 8 > u ? u : 8;
      var i = J.T,
        c = {};
      ((c.types = i !== null ? i.types : null), (J.T = c), Bf(t, !1, e, l));
      try {
        var f = n(),
          m = J.S;
        if (
          (m !== null && m(c, f), f !== null && typeof f == "object" && typeof f.then == "function")
        ) {
          var g = _y(f, a);
          du(t, e, g, Ce(t));
        } else du(t, e, a, Ce(t));
      } catch (A) {
        du(t, e, { then: function () {}, status: "rejected", reason: A }, Ce());
      } finally {
        ((st.p = u), i !== null && c.types !== null && (i.types = c.types), (J.T = i));
      }
    }
    function Uy() {}
    function po(t, e, l, a) {
      if (t.tag !== 5) throw Error(C(476));
      var n = ah(t).queue;
      lh(
        t,
        n,
        e,
        ga,
        l === null
          ? Uy
          : function () {
              return (nh(t), l(a));
            },
      );
    }
    function ah(t) {
      var e = t.memoizedState;
      if (e !== null) return e;
      e = {
        memoizedState: ga,
        baseState: ga,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Al,
          lastRenderedState: ga,
        },
        next: null,
      };
      var l = {};
      return (
        (e.next = {
          memoizedState: l,
          baseState: l,
          baseQueue: null,
          queue: {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: Al,
            lastRenderedState: l,
          },
          next: null,
        }),
        (t.memoizedState = e),
        (t = t.alternate),
        t !== null && (t.memoizedState = e),
        e
      );
    }
    function nh(t) {
      var e = ah(t);
      (e.next === null && (e = t.alternate.memoizedState), du(t, e.next.queue, {}, Ce()));
    }
    function Df() {
      return kt(xn);
    }
    function uh() {
      return Dt().memoizedState;
    }
    function ih() {
      return Dt().memoizedState;
    }
    function Ly(t) {
      for (var e = t.return; e !== null;) {
        switch (e.tag) {
          case 24:
          case 3:
            var l = Ce();
            t = Zl(l);
            var a = kl(e, t, l);
            (a !== null && (he(a, e, l), ou(a, e, l)), (e = { cache: vf() }), (t.payload = e));
            return;
        }
        e = e.return;
      }
    }
    function qy(t, e, l) {
      var a = Ce();
      ((l = {
        lane: a,
        revertLane: 0,
        gesture: null,
        action: l,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
        _c(t) ? oh(e, l) : ((l = rf(t, e, l, a)), l !== null && (he(l, t, a), fh(l, e, a))));
    }
    function ch(t, e, l) {
      var a = Ce();
      du(t, e, l, a);
    }
    function du(t, e, l, a) {
      var n = {
        lane: a,
        revertLane: 0,
        gesture: null,
        action: l,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      };
      if (_c(t)) oh(e, n);
      else {
        var u = t.alternate;
        if (
          t.lanes === 0 &&
          (u === null || u.lanes === 0) &&
          ((u = e.lastRenderedReducer), u !== null)
        )
          try {
            var i = e.lastRenderedState,
              c = u(i, l);
            if (((n.hasEagerState = !0), (n.eagerState = c), xe(c, i)))
              return (zc(t, e, n, 0), gt === null && Tc(), !1);
          } catch {}
        if (((l = rf(t, e, n, a)), l !== null)) return (he(l, t, a), fh(l, e, a), !0);
      }
      return !1;
    }
    function Bf(t, e, l, a) {
      if (
        ((a = {
          lane: 2,
          revertLane: Qf(),
          gesture: null,
          action: a,
          hasEagerState: !1,
          eagerState: null,
          next: null,
        }),
        _c(t))
      ) {
        if (e) throw Error(C(479));
      } else ((e = rf(t, l, a, 2)), e !== null && he(e, t, 2));
    }
    function _c(t) {
      var e = t.alternate;
      return t === W || (e !== null && e === W);
    }
    function oh(t, e) {
      dn = lc = !0;
      var l = t.pending;
      (l === null ? (e.next = e) : ((e.next = l.next), (l.next = e)), (t.pending = e));
    }
    function fh(t, e, l) {
      if ((l & 4194048) !== 0) {
        var a = e.lanes;
        ((a &= t.pendingLanes), (l |= a), (e.lanes = l), Kr(t, l));
      }
    }
    var nc = {
        readContext: kt,
        use: wc,
        useCallback: Nt,
        useContext: Nt,
        useEffect: Nt,
        useImperativeHandle: Nt,
        useLayoutEffect: Nt,
        useInsertionEffect: Nt,
        useMemo: Nt,
        useReducer: Nt,
        useRef: Nt,
        useState: Nt,
        useDebugValue: Nt,
        useDeferredValue: Nt,
        useTransition: Nt,
        useSyncExternalStore: Nt,
        useId: Nt,
        useHostTransitionStatus: Nt,
        useFormState: Nt,
        useActionState: Nt,
        useOptimistic: Nt,
        useMemoCache: Nt,
        useCacheRefresh: Nt,
        useEffectEvent: Nt,
      },
      sh = {
        readContext: kt,
        use: wc,
        useCallback: function (t, e) {
          return ((ue().memoizedState = [t, e === void 0 ? null : e]), t);
        },
        useContext: kt,
        useEffect: Hd,
        useImperativeHandle: function (t, e, l) {
          ((l = l != null ? l.concat([t]) : null), Bi(4194308, 4, $1.bind(null, e, t), l));
        },
        useLayoutEffect: function (t, e) {
          return Bi(4194308, 4, t, e);
        },
        useInsertionEffect: function (t, e) {
          Bi(4, 2, t, e);
        },
        useMemo: function (t, e) {
          var l = ue();
          e = e === void 0 ? null : e;
          var a = t();
          if (wa) {
            Ll(!0);
            try {
              t();
            } finally {
              Ll(!1);
            }
          }
          return ((l.memoizedState = [a, e]), a);
        },
        useReducer: function (t, e, l) {
          var a = ue();
          if (l !== void 0) {
            var n = l(e);
            if (wa) {
              Ll(!0);
              try {
                l(e);
              } finally {
                Ll(!1);
              }
            }
          } else n = e;
          return (
            (a.memoizedState = a.baseState = n),
            (t = {
              pending: null,
              lanes: 0,
              dispatch: null,
              lastRenderedReducer: t,
              lastRenderedState: n,
            }),
            (a.queue = t),
            (t = t.dispatch = qy.bind(null, W, t)),
            [a.memoizedState, t]
          );
        },
        useRef: function (t) {
          var e = ue();
          return ((t = { current: t }), (e.memoizedState = t));
        },
        useState: function (t) {
          t = vo(t);
          var e = t.queue,
            l = ch.bind(null, W, e);
          return ((e.dispatch = l), [t.memoizedState, l]);
        },
        useDebugValue: Nf,
        useDeferredValue: function (t, e) {
          var l = ue();
          return _f(l, t, e);
        },
        useTransition: function () {
          var t = vo(!1);
          return ((t = lh.bind(null, W, t.queue, !0, !1)), (ue().memoizedState = t), [!1, t]);
        },
        useSyncExternalStore: function (t, e, l) {
          var a = W,
            n = ue();
          if (et) {
            if (l === void 0) throw Error(C(407));
            l = l();
          } else {
            if (((l = e()), gt === null)) throw Error(C(349));
            (it & 127) !== 0 || L1(a, e, l);
          }
          n.memoizedState = l;
          var u = { value: l, getSnapshot: e };
          return (
            (n.queue = u),
            Hd(Y1.bind(null, a, u, t), [t]),
            (a.flags |= 2048),
            bn(9, { destroy: void 0 }, q1.bind(null, a, u, l, e), null),
            l
          );
        },
        useId: function () {
          var t = ue(),
            e = gt.identifierPrefix;
          if (et) {
            var l = al,
              a = ll;
            ((l = (a & ~(1 << (32 - ze(a) - 1))).toString(32) + l),
              (e = "_" + e + "R_" + l),
              (l = ac++),
              0 < l && (e += "H" + l.toString(32)),
              (e += "_"));
          } else ((l = Dy++), (e = "_" + e + "r_" + l.toString(32) + "_"));
          return (t.memoizedState = e);
        },
        useHostTransitionStatus: Df,
        useFormState: Bd,
        useActionState: Bd,
        useOptimistic: function (t) {
          var e = ue();
          e.memoizedState = e.baseState = t;
          var l = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: null,
            lastRenderedState: null,
          };
          return ((e.queue = l), (e = Bf.bind(null, W, !0, l)), (l.dispatch = e), [t, e]);
        },
        useMemoCache: xf,
        useCacheRefresh: function () {
          return (ue().memoizedState = Ly.bind(null, W));
        },
        useEffectEvent: function (t) {
          var e = ue(),
            l = { impl: t };
          return (
            (e.memoizedState = l),
            function () {
              if ((ft & 2) !== 0) throw Error(C(440));
              return l.impl.apply(void 0, arguments);
            }
          );
        },
      },
      dh = {
        readContext: kt,
        use: wc,
        useCallback: P1,
        useContext: kt,
        useEffect: wf,
        useImperativeHandle: W1,
        useInsertionEffect: J1,
        useLayoutEffect: I1,
        useMemo: th,
        useReducer: Di,
        useRef: K1,
        useState: function () {
          return Di(Al);
        },
        useDebugValue: Nf,
        useDeferredValue: function (t, e) {
          var l = Dt();
          return eh(l, pt.memoizedState, t, e);
        },
        useTransition: function () {
          var t = Di(Al)[0],
            e = Dt().memoizedState;
          return [typeof t == "boolean" ? t : ju(t), e];
        },
        useSyncExternalStore: U1,
        useId: uh,
        useHostTransitionStatus: Df,
        useFormState: Od,
        useActionState: Od,
        useOptimistic: function (t, e) {
          var l = Dt();
          return V1(l, pt, t, e);
        },
        useMemoCache: xf,
        useCacheRefresh: ih,
        useEffectEvent: F1,
      },
      Yy = {
        readContext: kt,
        use: wc,
        useCallback: P1,
        useContext: kt,
        useEffect: wf,
        useImperativeHandle: W1,
        useInsertionEffect: J1,
        useLayoutEffect: I1,
        useMemo: th,
        useReducer: x0,
        useRef: K1,
        useState: function () {
          return x0(Al);
        },
        useDebugValue: Nf,
        useDeferredValue: function (t, e) {
          var l = Dt();
          return pt === null ? _f(l, t, e) : eh(l, pt.memoizedState, t, e);
        },
        useTransition: function () {
          var t = x0(Al)[0],
            e = Dt().memoizedState;
          return [typeof t == "boolean" ? t : ju(t), e];
        },
        useSyncExternalStore: U1,
        useId: uh,
        useHostTransitionStatus: Df,
        useFormState: Rd,
        useActionState: Rd,
        useOptimistic: function (t, e) {
          var l = Dt();
          return pt !== null ? V1(l, pt, t, e) : ((l.baseState = t), [t, l.queue.dispatch]);
        },
        useMemoCache: xf,
        useCacheRefresh: ih,
        useEffectEvent: F1,
      };
    function M0(t, e, l, a) {
      ((e = t.memoizedState),
        (l = l(a, e)),
        (l = l == null ? e : bt({}, e, l)),
        (t.memoizedState = l),
        t.lanes === 0 && (t.updateQueue.baseState = l));
    }
    var go = {
      enqueueSetState: function (t, e, l) {
        t = t._reactInternals;
        var a = Ce(),
          n = Zl(a);
        ((n.payload = e),
          l != null && (n.callback = l),
          (e = kl(t, n, a)),
          e !== null && (he(e, t, a), ou(e, t, a)));
      },
      enqueueReplaceState: function (t, e, l) {
        t = t._reactInternals;
        var a = Ce(),
          n = Zl(a);
        ((n.tag = 1),
          (n.payload = e),
          l != null && (n.callback = l),
          (e = kl(t, n, a)),
          e !== null && (he(e, t, a), ou(e, t, a)));
      },
      enqueueForceUpdate: function (t, e) {
        t = t._reactInternals;
        var l = Ce(),
          a = Zl(l);
        ((a.tag = 2),
          e != null && (a.callback = e),
          (e = kl(t, a, l)),
          e !== null && (he(e, t, l), ou(e, t, l)));
      },
    };
    function Ud(t, e, l, a, n, u, i) {
      return (
        (t = t.stateNode),
        typeof t.shouldComponentUpdate == "function"
          ? t.shouldComponentUpdate(a, u, i)
          : e.prototype && e.prototype.isPureReactComponent
            ? !Su(l, a) || !Su(n, u)
            : !0
      );
    }
    function Ld(t, e, l, a) {
      ((t = e.state),
        typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(l, a),
        typeof e.UNSAFE_componentWillReceiveProps == "function" &&
          e.UNSAFE_componentWillReceiveProps(l, a),
        e.state !== t && go.enqueueReplaceState(e, e.state, null));
    }
    function Na(t, e) {
      var l = e;
      if ("ref" in e) {
        l = {};
        for (var a in e) a !== "ref" && (l[a] = e[a]);
      }
      if ((t = t.defaultProps)) {
        l === e && (l = bt({}, l));
        for (var n in t) l[n] === void 0 && (l[n] = t[n]);
      }
      return l;
    }
    function rh(t) {
      Fi(t);
    }
    function hh(t) {
      console.error(t);
    }
    function mh(t) {
      Fi(t);
    }
    function uc(t, e) {
      try {
        var l = t.onUncaughtError;
        l(e.value, { componentStack: e.stack });
      } catch (a) {
        setTimeout(function () {
          throw a;
        });
      }
    }
    function qd(t, e, l) {
      try {
        var a = t.onCaughtError;
        a(l.value, { componentStack: l.stack, errorBoundary: e.tag === 1 ? e.stateNode : null });
      } catch (n) {
        setTimeout(function () {
          throw n;
        });
      }
    }
    function bo(t, e, l) {
      return (
        (l = Zl(l)),
        (l.tag = 3),
        (l.payload = { element: null }),
        (l.callback = function () {
          uc(t, e);
        }),
        l
      );
    }
    function vh(t) {
      return ((t = Zl(t)), (t.tag = 3), t);
    }
    function yh(t, e, l, a) {
      var n = l.type.getDerivedStateFromError;
      if (typeof n == "function") {
        var u = a.value;
        ((t.payload = function () {
          return n(u);
        }),
          (t.callback = function () {
            qd(e, l, a);
          }));
      }
      var i = l.stateNode;
      i !== null &&
        typeof i.componentDidCatch == "function" &&
        (t.callback = function () {
          (qd(e, l, a),
            typeof n != "function" && (Jl === null ? (Jl = new Set([this])) : Jl.add(this)));
          var c = a.stack;
          this.componentDidCatch(a.value, { componentStack: c !== null ? c : "" });
        });
    }
    function jy(t, e, l, a, n) {
      if (((l.flags |= 32768), a !== null && typeof a == "object" && typeof a.then == "function")) {
        if (((e = l.alternate), e !== null && za(e, l, n, !0), (l = It.current), l !== null)) {
          switch (l.tag) {
            case 31:
            case 13:
            case 19:
              return (
                Pt === null ? hc() : l.alternate === null && _t === 0 && (_t = 3),
                (l.flags &= -257),
                (l.flags |= 65536),
                (l.lanes = n),
                a === Pi
                  ? (l.flags |= 16384)
                  : ((e = l.updateQueue),
                    e === null ? (l.updateQueue = new Set([a])) : e.add(a),
                    R0(t, a, n)),
                !1
              );
            case 22:
              return (
                (l.flags |= 65536),
                a === Pi
                  ? (l.flags |= 16384)
                  : ((e = l.updateQueue),
                    e === null
                      ? ((e = {
                          transitions: null,
                          markerInstances: null,
                          retryQueue: new Set([a]),
                        }),
                        (l.updateQueue = e))
                      : ((l = e.retryQueue), l === null ? (e.retryQueue = new Set([a])) : l.add(a)),
                    R0(t, a, n)),
                !1
              );
          }
          throw Error(C(435, l.tag));
        }
        return (R0(t, a, n), hc(), !1);
      }
      if (et)
        return (
          (e = It.current),
          e !== null
            ? ((e.flags & 65536) === 0 && (e.flags |= 256),
              (e.flags |= 65536),
              (e.lanes = n),
              a !== io && ((t = Error(C(422), { cause: a })), Eu(He(t, l))))
            : (a !== io && ((e = Error(C(423), { cause: a })), Eu(He(e, l))),
              (t = t.current.alternate),
              (t.flags |= 65536),
              (n &= -n),
              (t.lanes |= n),
              (a = He(a, l)),
              (n = bo(t.stateNode, a, n)),
              C0(t, n),
              _t !== 4 && (_t = 2)),
          !1
        );
      var u = Error(C(520), { cause: a });
      if (((u = He(u, l)), vu === null ? (vu = [u]) : vu.push(u), _t !== 4 && (_t = 2), e === null))
        return !0;
      ((a = He(a, l)), (l = e));
      do {
        switch (l.tag) {
          case 3:
            return (
              (l.flags |= 65536),
              (t = n & -n),
              (l.lanes |= t),
              (t = bo(l.stateNode, a, t)),
              C0(l, t),
              !1
            );
          case 1:
            if (
              ((e = l.type),
              (u = l.stateNode),
              (l.flags & 128) === 0 &&
                (typeof e.getDerivedStateFromError == "function" ||
                  (u !== null &&
                    typeof u.componentDidCatch == "function" &&
                    (Jl === null || !Jl.has(u)))))
            )
              return (
                (l.flags |= 65536),
                (n &= -n),
                (l.lanes |= n),
                (n = vh(n)),
                yh(n, t, l, a),
                C0(l, n),
                !1
              );
            break;
          case 22:
            if (l.memoizedState !== null) return ((l.flags |= 65536), !1);
        }
        l = l.return;
      } while (l !== null);
      return !1;
    }
    var Of = Error(C(461)),
      Ht = !1;
    function Ut(t, e, l, a) {
      e.child = t === null ? _1(e, null, l, a) : Ma(e, t.child, l, a);
    }
    function Yd(t, e, l, a, n) {
      l = l.render;
      var u = e.ref;
      if ("ref" in a) {
        var i = {};
        for (var c in a) c !== "ref" && (i[c] = a[c]);
      } else i = a;
      return (
        Ca(e),
        (a = Ef(t, e, l, i, u, n)),
        (c = Tf()),
        t !== null && !Ht
          ? (zf(t, e, n), El(t, e, n))
          : (et && c && Cc(e), (e.flags |= 1), Ut(t, e, a, n), e.child)
      );
    }
    function jd(t, e, l, a, n) {
      if (t === null) {
        var u = l.type;
        return typeof u == "function" && !hf(u) && u.defaultProps === void 0 && l.compare === null
          ? ((e.tag = 15), (e.type = u), ph(t, e, u, a, n))
          : ((t = wi(l.type, null, a, e, e.mode, n)),
            (t.ref = e.ref),
            (t.return = e),
            (e.child = t));
      }
      if (((u = t.child), !Hf(t, n))) {
        var i = u.memoizedProps;
        if (((l = l.compare), (l = l !== null ? l : Su), l(i, a) && t.ref === e.ref))
          return El(t, e, n);
      }
      return ((e.flags |= 1), (t = yl(u, a)), (t.ref = e.ref), (t.return = e), (e.child = t));
    }
    function ph(t, e, l, a, n) {
      if (t !== null) {
        var u = t.memoizedProps;
        if (Su(u, a) && t.ref === e.ref)
          if (((Ht = !1), (e.pendingProps = a = u), Hf(t, n)))
            (t.flags & 131072) !== 0 && (Ht = !0);
          else return ((e.lanes = t.lanes), El(t, e, n));
      }
      return So(t, e, l, a, n);
    }
    function gh(t, e, l, a) {
      var n = a.children,
        u = t !== null ? t.memoizedState : null;
      if (
        (t === null &&
          e.stateNode === null &&
          (e.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        a.mode === "hidden")
      ) {
        if ((e.flags & 128) !== 0) {
          if (((u = u !== null ? u.baseLanes | l : l), t !== null)) {
            for (a = e.child = t.child, n = 0; a !== null;)
              ((n = n | a.lanes | a.childLanes), (a = a.sibling));
            a = n & ~u;
          } else ((a = 0), (e.child = null));
          return Gd(t, e, u, l, a);
        }
        if ((l & 536870912) !== 0)
          ((e.memoizedState = { baseLanes: 0, cachePool: null }),
            t !== null && _i(e, u !== null ? u.cachePool : null),
            u !== null ? Nd(e, u) : ho(),
            O1(e));
        else return ((a = e.lanes = 536870912), Gd(t, e, u !== null ? u.baseLanes | l : l, l, a));
      } else
        u !== null
          ? (_i(e, u.cachePool), Nd(e, u), Fl(), (e.memoizedState = null))
          : (t !== null && _i(e, null), ho(), Fl());
      return (Ut(t, e, n, l), e.child);
    }
    function ru(t, e) {
      return (
        (t !== null && t.tag === 22) ||
          e.stateNode !== null ||
          (e.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        e.sibling
      );
    }
    function Gd(t, e, l, a, n) {
      var u = yf();
      return (
        (u = u === null ? null : { parent: Rt._currentValue, pool: u }),
        (e.memoizedState = { baseLanes: l, cachePool: u }),
        t !== null && _i(e, null),
        ho(),
        O1(e),
        t !== null && za(t, e, a, !0),
        (e.childLanes = n),
        null
      );
    }
    function Oi(t, e) {
      return (
        (e = Dc({ mode: e.mode, children: e.children }, t.mode)),
        (e.ref = t.ref),
        (t.child = e),
        (e.return = t),
        e
      );
    }
    function Vd(t, e, l) {
      return (
        Ma(e, t.child, null, l),
        (t = Oi(e, e.pendingProps)),
        (t.flags |= 2),
        be(e),
        (e.memoizedState = null),
        t
      );
    }
    function Gy(t, e, l) {
      var a = e.pendingProps,
        n = (e.flags & 128) !== 0;
      if (((e.flags &= -129), t === null)) {
        if (et) {
          if (a.mode === "hidden")
            return (
              (t = Oi(e, a)),
              (e.lanes = 536870912),
              (t.memoizedState = { baseLanes: 0, cachePool: null }),
              ru(null, t)
            );
          if (
            (mo(e),
            (t = Et)
              ? ((t = g2(t, Ue)),
                (t = t !== null && t.data === "&" ? t : null),
                t !== null &&
                  ((e.memoizedState = {
                    dehydrated: t,
                    treeContext: Pl !== null ? { id: ll, overflow: al } : null,
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (l = T1(t)),
                  (l.return = e),
                  (e.child = l),
                  (Vt = e),
                  (Et = null)))
              : (t = null),
            t === null)
          )
            throw ta(e);
          return ((e.lanes = 536870912), null);
        }
        return Oi(e, a);
      }
      var u = t.memoizedState;
      if (u !== null) {
        var i = u.dehydrated;
        if ((mo(e), n))
          if (e.flags & 256) ((e.flags &= -257), (e = Vd(t, e, l)));
          else if (e.memoizedState !== null) ((e.child = t.child), (e.flags |= 128), (e = null));
          else throw Error(C(558));
        else if ((Ht || za(t, e, l, !1), (n = (l & t.childLanes) !== 0), Ht || n)) {
          if (ea.current === null) {
            if (((a = gt), a !== null && ((i = Fr(a, l)), i !== 0 && i !== u.retryLane)))
              throw ((u.retryLane = i), Ra(t, i), he(a, t, i), Of);
            hc();
          }
          e = Vd(t, e, l);
        } else
          ((t = u.treeContext),
            (Et = Le(i.nextSibling)),
            (Vt = e),
            (et = !0),
            (Xl = null),
            (Ue = !1),
            t !== null && C1(e, t),
            (e = Oi(e, a)),
            (e.flags |= 134221824));
        return e;
      }
      return (
        (t = yl(t.child, { mode: a.mode, children: a.children })),
        (t.ref = e.ref),
        (e.child = t),
        (t.return = e),
        t
      );
    }
    function Xa(t, e) {
      var l = e.ref;
      if (l === null) t !== null && t.ref !== null && (e.flags |= 4194816);
      else {
        if (typeof l != "function" && typeof l != "object") throw Error(C(284));
        (t === null || t.ref !== l) && (e.flags |= 4194816);
      }
    }
    function So(t, e, l, a, n) {
      return (
        Ca(e),
        (l = Ef(t, e, l, a, void 0, n)),
        (a = Tf()),
        t !== null && !Ht
          ? (zf(t, e, n), El(t, e, n))
          : (et && a && Cc(e), (e.flags |= 1), Ut(t, e, l, n), e.child)
      );
    }
    function Qd(t, e, l, a, n, u) {
      return (
        Ca(e),
        (e.updateQueue = null),
        (l = H1(e, a, l, n)),
        R1(t),
        (a = Tf()),
        t !== null && !Ht
          ? (zf(t, e, u), El(t, e, u))
          : (et && a && Cc(e), (e.flags |= 1), Ut(t, e, l, u), e.child)
      );
    }
    function Xd(t, e, l, a, n) {
      if ((Ca(e), e.stateNode === null)) {
        var u = en,
          i = l.contextType;
        (typeof i == "object" && i !== null && (u = kt(i)),
          (u = new l(a, u)),
          (e.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null),
          (u.updater = go),
          (e.stateNode = u),
          (u._reactInternals = e),
          (u = e.stateNode),
          (u.props = a),
          (u.state = e.memoizedState),
          (u.refs = {}),
          gf(e),
          (i = l.contextType),
          (u.context = typeof i == "object" && i !== null ? kt(i) : en),
          (u.state = e.memoizedState),
          (i = l.getDerivedStateFromProps),
          typeof i == "function" && (M0(e, l, i, a), (u.state = e.memoizedState)),
          typeof l.getDerivedStateFromProps == "function" ||
            typeof u.getSnapshotBeforeUpdate == "function" ||
            (typeof u.UNSAFE_componentWillMount != "function" &&
              typeof u.componentWillMount != "function") ||
            ((i = u.state),
            typeof u.componentWillMount == "function" && u.componentWillMount(),
            typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(),
            i !== u.state && go.enqueueReplaceState(u, u.state, null),
            su(e, a, u, n),
            fu(),
            (u.state = e.memoizedState)),
          typeof u.componentDidMount == "function" && (e.flags |= 4194308),
          (a = !0));
      } else if (t === null) {
        u = e.stateNode;
        var c = e.memoizedProps,
          f = Na(l, c);
        u.props = f;
        var m = u.context,
          g = l.contextType;
        ((i = en), typeof g == "object" && g !== null && (i = kt(g)));
        var A = l.getDerivedStateFromProps;
        ((g = typeof A == "function" || typeof u.getSnapshotBeforeUpdate == "function"),
          (c = e.pendingProps !== c),
          g ||
            (typeof u.UNSAFE_componentWillReceiveProps != "function" &&
              typeof u.componentWillReceiveProps != "function") ||
            ((c || m !== i) && Ld(e, u, a, i)),
          (Hl = !1));
        var v = e.memoizedState;
        ((u.state = v),
          su(e, a, u, n),
          fu(),
          (m = e.memoizedState),
          c || v !== m || Hl
            ? (typeof A == "function" && (M0(e, l, A, a), (m = e.memoizedState)),
              (f = Hl || Ud(e, l, f, a, v, m, i))
                ? (g ||
                    (typeof u.UNSAFE_componentWillMount != "function" &&
                      typeof u.componentWillMount != "function") ||
                    (typeof u.componentWillMount == "function" && u.componentWillMount(),
                    typeof u.UNSAFE_componentWillMount == "function" &&
                      u.UNSAFE_componentWillMount()),
                  typeof u.componentDidMount == "function" && (e.flags |= 4194308))
                : (typeof u.componentDidMount == "function" && (e.flags |= 4194308),
                  (e.memoizedProps = a),
                  (e.memoizedState = m)),
              (u.props = a),
              (u.state = m),
              (u.context = i),
              (a = f))
            : (typeof u.componentDidMount == "function" && (e.flags |= 4194308), (a = !1)));
      } else {
        ((u = e.stateNode),
          so(t, e),
          (i = e.memoizedProps),
          (g = Na(l, i)),
          (u.props = g),
          (A = e.pendingProps),
          (v = u.context),
          (m = l.contextType),
          (f = en),
          typeof m == "object" && m !== null && (f = kt(m)),
          (c = l.getDerivedStateFromProps),
          (m = typeof c == "function" || typeof u.getSnapshotBeforeUpdate == "function") ||
            (typeof u.UNSAFE_componentWillReceiveProps != "function" &&
              typeof u.componentWillReceiveProps != "function") ||
            ((i !== A || v !== f) && Ld(e, u, a, f)),
          (Hl = !1),
          (v = e.memoizedState),
          (u.state = v),
          su(e, a, u, n),
          fu());
        var p = e.memoizedState;
        i !== A || v !== p || Hl || (t !== null && t.dependencies !== null && Wi(t.dependencies))
          ? (typeof c == "function" && (M0(e, l, c, a), (p = e.memoizedState)),
            (g =
              Hl ||
              Ud(e, l, g, a, v, p, f) ||
              (t !== null && t.dependencies !== null && Wi(t.dependencies)))
              ? (m ||
                  (typeof u.UNSAFE_componentWillUpdate != "function" &&
                    typeof u.componentWillUpdate != "function") ||
                  (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(a, p, f),
                  typeof u.UNSAFE_componentWillUpdate == "function" &&
                    u.UNSAFE_componentWillUpdate(a, p, f)),
                typeof u.componentDidUpdate == "function" && (e.flags |= 4),
                typeof u.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024))
              : (typeof u.componentDidUpdate != "function" ||
                  (i === t.memoizedProps && v === t.memoizedState) ||
                  (e.flags |= 4),
                typeof u.getSnapshotBeforeUpdate != "function" ||
                  (i === t.memoizedProps && v === t.memoizedState) ||
                  (e.flags |= 1024),
                (e.memoizedProps = a),
                (e.memoizedState = p)),
            (u.props = a),
            (u.state = p),
            (u.context = f),
            (a = g))
          : (typeof u.componentDidUpdate != "function" ||
              (i === t.memoizedProps && v === t.memoizedState) ||
              (e.flags |= 4),
            typeof u.getSnapshotBeforeUpdate != "function" ||
              (i === t.memoizedProps && v === t.memoizedState) ||
              (e.flags |= 1024),
            (a = !1));
      }
      return (
        (u = a),
        Xa(t, e),
        (a = (e.flags & 128) !== 0),
        u || a
          ? ((u = e.stateNode),
            (l = a && typeof l.getDerivedStateFromError != "function" ? null : u.render()),
            (e.flags |= 1),
            t !== null && a
              ? ((e.child = Ma(e, t.child, null, n)), (e.child = Ma(e, null, l, n)))
              : Ut(t, e, l, n),
            (e.memoizedState = u.state),
            (t = e.child))
          : (t = El(t, e, n)),
        t
      );
    }
    function Zd(t, e, l, a) {
      return (Ta(), (e.flags |= 256), Ut(t, e, l, a), e.child);
    }
    var Ao = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
    function Eo(t) {
      return { baseLanes: t, cachePool: M1() };
    }
    function To(t, e, l) {
      return ((t = t !== null ? t.childLanes & ~l : 0), e && (t |= Ae), t);
    }
    function bh(t, e, l) {
      var a = e.pendingProps,
        n = !1,
        u = (e.flags & 128) !== 0,
        i;
      if (
        ((i = u) || (i = t !== null && t.memoizedState === null ? !1 : (Ft.current & 2) !== 0),
        i && ((n = !0), (e.flags &= -129)),
        (i = (e.flags & 32) !== 0),
        (e.flags &= -33),
        t === null)
      ) {
        if (et) {
          if (
            (n ? Kl(e) : Fl(),
            (t = Et)
              ? ((t = g2(t, Ue)),
                (t = t !== null && t.data !== "&" ? t : null),
                t !== null &&
                  ((e.memoizedState = {
                    dehydrated: t,
                    treeContext: Pl !== null ? { id: ll, overflow: al } : null,
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (l = T1(t)),
                  (l.return = e),
                  (e.child = l),
                  (Vt = e),
                  (Et = null)))
              : (t = null),
            t === null)
          )
            throw ta(e);
          return (Kf(t) ? (e.lanes = 32) : (e.lanes = 536870912), null);
        }
        return (
          (u = a.children),
          (a = a.fallback),
          n
            ? (Fl(),
              (n = e.mode),
              (u = Dc({ mode: "hidden", children: u }, n)),
              (a = ba(a, n, l, null)),
              (u.return = e),
              (a.return = e),
              (u.sibling = a),
              (e.child = u),
              (a = e.child),
              (a.memoizedState = Eo(l)),
              (a.childLanes = To(t, i, l)),
              (e.memoizedState = Ao),
              ru(null, a))
            : (Kl(e), Rf(e, u))
        );
      }
      var c = t.memoizedState;
      if (c !== null) {
        var f = c.dehydrated;
        if (f !== null) return Vy(t, e, u, i, a, f, c, l);
      }
      return n
        ? (Fl(),
          (n = a.fallback),
          (u = e.mode),
          (c = t.child),
          (f = c.sibling),
          (a = yl(c, { mode: "hidden", children: a.children })),
          (a.subtreeFlags = c.subtreeFlags & 1206910976),
          f !== null ? (n = yl(f, n)) : ((n = ba(n, u, l, null)), (n.flags |= 2)),
          (n.return = e),
          (a.return = e),
          (a.sibling = n),
          (e.child = a),
          ru(null, a),
          (a = e.child),
          (n = t.child.memoizedState),
          n === null
            ? (n = Eo(l))
            : ((u = n.cachePool),
              u !== null
                ? ((c = Rt._currentValue), (u = u.parent !== c ? { parent: c, pool: c } : u))
                : (u = M1()),
              (n = { baseLanes: n.baseLanes | l, cachePool: u })),
          (a.memoizedState = n),
          (a.childLanes = To(t, i, l)),
          (e.memoizedState = Ao),
          ru(t.child, a))
        : (Kl(e),
          (l = t.child),
          (t = l.sibling),
          (l = yl(l, { mode: "visible", children: a.children })),
          (l.return = e),
          (l.sibling = null),
          t !== null &&
            ((i = e.deletions), i === null ? ((e.deletions = [t]), (e.flags |= 16)) : i.push(t)),
          (e.child = l),
          (e.memoizedState = null),
          l);
    }
    function Rf(t, e) {
      return ((e = Dc({ mode: "visible", children: e }, t.mode)), (e.return = t), (t.child = e));
    }
    function Dc(t, e) {
      return ((t = re(22, t, null, e)), (t.lanes = 0), t);
    }
    function mi(t, e, l) {
      return (
        Ma(e, t.child, null, l),
        (t = Rf(e, e.pendingProps.children)),
        (t.flags |= 2),
        (e.memoizedState = null),
        t
      );
    }
    function Vy(t, e, l, a, n, u, i, c) {
      if (l)
        return e.flags & 256
          ? (Kl(e), (e.flags &= -257), mi(t, e, c))
          : e.memoizedState !== null
            ? (Fl(), (e.child = t.child), (e.flags |= 128), null)
            : (Fl(),
              (u = n.fallback),
              (i = e.mode),
              (n = Dc({ mode: "visible", children: n.children }, i)),
              (u = ba(u, i, c, null)),
              (u.flags |= 2),
              (n.return = e),
              (u.return = e),
              (n.sibling = u),
              (e.child = n),
              Ma(e, t.child, null, c),
              (n = e.child),
              (n.memoizedState = Eo(c)),
              (n.childLanes = To(t, a, c)),
              (e.memoizedState = Ao),
              ru(null, n));
      if ((Kl(e), Kf(u))) {
        if (((a = u.nextSibling && u.nextSibling.dataset), a)) var f = a.dgst;
        return (
          (a = f),
          a !== "" &&
            ((n = Error(C(419))),
            (n.stack = ""),
            (n.digest = a),
            Eu({ value: n, source: null, stack: null })),
          mi(t, e, c)
        );
      }
      if ((Ht || za(t, e, c, !1), (a = (c & t.childLanes) !== 0), Ht || a)) {
        if (ea.current !== null) return mi(t, e, c);
        if (((a = gt), a !== null && ((n = Fr(a, c)), n !== 0 && n !== i.retryLane)))
          throw ((i.retryLane = n), Ra(t, n), he(a, t, n), Of);
        return (Fo(u) || hc(), mi(t, e, c));
      }
      return Fo(u)
        ? ((e.flags |= 192), (e.child = t.child), null)
        : ((t = i.treeContext),
          (Et = Le(u.nextSibling)),
          (Vt = e),
          (et = !0),
          (Xl = null),
          (Ue = !1),
          t !== null && C1(e, t),
          (e = Rf(e, n.children)),
          (e.flags |= 134221824),
          e);
    }
    function kd(t, e, l) {
      t.lanes |= e;
      var a = t.alternate;
      (a !== null && (a.lanes |= e), Ni(t.return, e, l));
    }
    function Kd(t) {
      for (var e = null; t !== null;) {
        var l = t.alternate;
        (l !== null && ec(l) === null && (e = t), (t = t.sibling));
      }
      return e;
    }
    function vi(t, e, l, a, n, u) {
      var i = t.memoizedState;
      i === null
        ? (t.memoizedState = {
            isBackwards: e,
            rendering: null,
            renderingStartTime: 0,
            last: a,
            tail: l,
            tailMode: n,
            treeForkCount: u,
          })
        : ((i.isBackwards = e),
          (i.rendering = null),
          (i.renderingStartTime = 0),
          (i.last = a),
          (i.tail = l),
          (i.tailMode = n),
          (i.treeForkCount = u));
    }
    function w0(t) {
      var e = t.child;
      for (t.child = null; e !== null;) {
        var l = e.sibling;
        ((e.sibling = t.child), (t.child = e), (e = l));
      }
    }
    function zo(t, e, l) {
      var a = e.pendingProps,
        n = a.revealOrder,
        u = a.tail;
      a = a.children;
      var i = Ft.current;
      if (e.flags & 128) return (zu(e, i), null);
      var c = (i & 2) !== 0;
      if (
        (c ? ((i = (i & 1) | 2), (e.flags |= 128)) : (i &= 1),
        zu(e, i),
        n === "backwards" && t !== null ? (w0(t), Ut(t, e, a, l), w0(t)) : Ut(t, e, a, l),
        (a = et ? Au : 0),
        !c && t !== null && (t.flags & 128) !== 0)
      )
        t: for (t = e.child; t !== null;) {
          if (t.tag === 13) t.memoizedState !== null && kd(t, l, e);
          else if (t.tag === 19) kd(t, l, e);
          else if (t.child !== null) {
            ((t.child.return = t), (t = t.child));
            continue;
          }
          if (t === e) break t;
          for (; t.sibling === null;) {
            if (t.return === null || t.return === e) break t;
            t = t.return;
          }
          ((t.sibling.return = t.return), (t = t.sibling));
        }
      switch (n) {
        case "backwards":
          ((l = Kd(e.child)),
            l === null
              ? ((n = e.child), (e.child = null))
              : ((n = l.sibling), (l.sibling = null), w0(e)),
            vi(e, !0, n, null, u, a));
          break;
        case "unstable_legacy-backwards":
          for (l = null, n = e.child, e.child = null; n !== null;) {
            if (((t = n.alternate), t !== null && ec(t) === null)) {
              e.child = n;
              break;
            }
            ((t = n.sibling), (n.sibling = l), (l = n), (n = t));
          }
          vi(e, !0, l, null, u, a);
          break;
        case "together":
          vi(e, !1, null, null, void 0, a);
          break;
        case "independent":
          e.memoizedState = null;
          break;
        default:
          ((l = Kd(e.child)),
            l === null ? ((n = e.child), (e.child = null)) : ((n = l.sibling), (l.sibling = null)),
            vi(e, !1, n, l, u, a));
      }
      return e.child;
    }
    function Fd(t, e, l) {
      var a = e.pendingProps;
      return (Yl(e, e.type, a.value), Ut(t, e, a.children, l), e.child);
    }
    function El(t, e, l) {
      if (
        (t !== null && (e.dependencies = t.dependencies), (aa |= e.lanes), (l & e.childLanes) === 0)
      )
        if (t !== null) {
          if ((za(t, e, l, !1), (l & e.childLanes) === 0)) return null;
        } else return null;
      if (t !== null && e.child !== t.child) throw Error(C(153));
      if (e.child !== null) {
        for (t = e.child, l = yl(t, t.pendingProps), e.child = l, l.return = e; t.sibling !== null;)
          ((t = t.sibling), (l = l.sibling = yl(t, t.pendingProps)), (l.return = e));
        l.sibling = null;
      }
      return e.child;
    }
    function Hf(t, e) {
      return (t.lanes & e) !== 0 ? !0 : ((t = t.dependencies), !!(t !== null && Wi(t)));
    }
    function Qy(t, e, l) {
      switch (e.tag) {
        case 3:
          (Xi(e, e.stateNode.containerInfo), Yl(e, Rt, t.memoizedState.cache), Ta());
          break;
        case 27:
        case 5:
          I0(e);
          break;
        case 4:
          Xi(e, e.stateNode.containerInfo);
          break;
        case 10:
          Yl(e, e.type, e.memoizedProps.value);
          break;
        case 31:
          if (e.memoizedState !== null) return ((e.flags |= 128), mo(e), null);
          break;
        case 13:
          var a = e.memoizedState;
          if (a !== null) {
            if (a.dehydrated !== null) return (Kl(e), (e.flags |= 128), null);
            a = za(t, e, l, !1);
            var n = e.child.childLanes;
            return a || (l & n) !== 0
              ? bh(t, e, l)
              : (Kl(e), (t = El(t, e, l)), t !== null ? t.sibling : null);
          }
          Kl(e);
          break;
        case 19:
          if (e.flags & 128) return zo(t, e, l);
          if (
            ((n = (t.flags & 128) !== 0),
            (a = (l & e.childLanes) !== 0),
            a || (za(t, e, l, !1), (a = (l & e.childLanes) !== 0)),
            n)
          ) {
            if (a) return zo(t, e, l);
            e.flags |= 128;
          }
          if (
            ((n = e.memoizedState),
            n !== null && ((n.rendering = null), (n.tail = null), (n.lastEffect = null)),
            zu(e, Ft.current),
            a)
          )
            break;
          return null;
        case 22:
          return ((e.lanes = 0), gh(t, e, l, e.pendingProps));
        case 24:
          Yl(e, Rt, t.memoizedState.cache);
      }
      return El(t, e, l);
    }
    function Sh(t, e, l) {
      if (t !== null)
        if (t.memoizedProps !== e.pendingProps) Ht = !0;
        else {
          if (!Hf(t, l) && (e.flags & 128) === 0) return ((Ht = !1), Qy(t, e, l));
          Ht = (t.flags & 131072) !== 0;
        }
      else ((Ht = !1), et && (e.flags & 1048576) !== 0 && z1(e, Au, e.index));
      switch (((e.lanes = 0), e.tag)) {
        case 16:
          t: {
            var a = e.pendingProps;
            if (((t = ma(e.elementType)), (e.type = t), typeof t == "function"))
              hf(t)
                ? ((a = Na(t, a)), (e.tag = 1), (e = Xd(null, e, t, a, l)))
                : ((e.tag = 0), (e = So(null, e, t, a, l)));
            else {
              if (t != null) {
                var n = t.$$typeof;
                if (n === Po) {
                  ((e.tag = 11), (e = Yd(null, e, t, a, l)));
                  break t;
                } else if (n === tf) {
                  ((e.tag = 14), (e = jd(null, e, t, a, l)));
                  break t;
                } else if (n === tl) {
                  ((e.tag = 10), (e.type = t), (e = Fd(null, e, l)));
                  break t;
                }
              }
              throw ((e = F0(t) || t), Error(C(306, e, "")));
            }
          }
          return e;
        case 0:
          return So(t, e, e.type, e.pendingProps, l);
        case 1:
          return ((a = e.type), (n = Na(a, e.pendingProps)), Xd(t, e, a, n, l));
        case 3:
          t: {
            if ((Xi(e, e.stateNode.containerInfo), t === null)) throw Error(C(387));
            a = e.pendingProps;
            var u = e.memoizedState;
            ((n = u.element), so(t, e), su(e, a, null, l));
            var i = e.memoizedState;
            if (
              ((a = i.cache),
              Yl(e, Rt, a),
              a !== u.cache && oo(e, [Rt], l, !0),
              fu(),
              (a = i.element),
              u.isDehydrated)
            )
              if (
                ((u = { element: a, isDehydrated: !1, cache: i.cache }),
                (e.updateQueue.baseState = u),
                (e.memoizedState = u),
                e.flags & 256)
              ) {
                e = Zd(t, e, a, l);
                break t;
              } else if (a !== n) {
                ((n = He(Error(C(424)), e)), Eu(n), (e = Zd(t, e, a, l)));
                break t;
              } else
                for (
                  t = e.stateNode.containerInfo,
                    t.nodeType === 9
                      ? (t = t.body)
                      : (t = t.nodeName === "HTML" ? t.ownerDocument.body : t),
                    Et = Le(t.firstChild),
                    Vt = e,
                    et = !0,
                    Xl = null,
                    Ue = !0,
                    l = _1(e, null, a, l),
                    e.child = l;
                  l;
                )
                  ((l.flags = (l.flags & -3) | 134221824), (l = l.sibling));
            else {
              if ((Ta(), a === n)) {
                e = El(t, e, l);
                break t;
              }
              Ut(t, e, a, l);
            }
            e = e.child;
          }
          return e;
        case 26:
          return (
            Xa(t, e),
            t === null
              ? (l = Ar(e.type, null, e.pendingProps, null))
                ? (e.memoizedState = l)
                : et || (e.stateNode = f2(e.type, e.pendingProps, Ql.current, e))
              : (e.memoizedState = Ar(e.type, t.memoizedProps, e.pendingProps, t.memoizedState)),
            null
          );
        case 27:
          return (
            I0(e),
            t === null &&
              et &&
              ((a = e.stateNode = b2(e.type, e.pendingProps, Ql.current)),
              (Vt = e),
              (Ue = !0),
              (n = Et),
              ua(e.type) ? ((Jo = n), (Et = Le(a.firstChild))) : (Et = n)),
            Ut(t, e, e.pendingProps.children, l),
            Xa(t, e),
            t === null && (e.flags |= 4194304),
            e.child
          );
        case 5:
          return (
            t === null &&
              et &&
              ((n = a = Et) &&
                ((a = Hp(a, e.type, e.pendingProps, Ue)),
                a !== null
                  ? ((e.stateNode = a), (Vt = e), (Et = Le(a.firstChild)), (Ue = !1), (n = !0))
                  : (n = !1)),
              n || ta(e)),
            I0(e),
            (n = e.type),
            (u = e.pendingProps),
            (i = t !== null ? t.memoizedProps : null),
            (a = u.children),
            Zo(n, u) ? (a = null) : i !== null && Zo(n, i) && (e.flags |= 32),
            e.memoizedState !== null && ((n = Ef(t, e, By, null, null, l)), (xn._currentValue = n)),
            Xa(t, e),
            Ut(t, e, a, l),
            e.child
          );
        case 6:
          return (
            t === null &&
              et &&
              ((t = l = Et) &&
                ((l = Up(l, e.pendingProps, Ue)),
                l !== null ? ((e.stateNode = l), (Vt = e), (Et = null), (t = !0)) : (t = !1)),
              t || ta(e)),
            null
          );
        case 13:
          return bh(t, e, l);
        case 4:
          return (
            Xi(e, e.stateNode.containerInfo),
            (a = e.pendingProps),
            t === null ? (e.child = Ma(e, null, a, l)) : Ut(t, e, a, l),
            e.child
          );
        case 11:
          return Yd(t, e, e.type, e.pendingProps, l);
        case 7:
          return ((a = e.pendingProps), Xa(t, e), Ut(t, e, a, l), e.child);
        case 8:
          return (Ut(t, e, e.pendingProps.children, l), e.child);
        case 12:
          return (Ut(t, e, e.pendingProps.children, l), e.child);
        case 10:
          return Fd(t, e, l);
        case 9:
          return (
            (n = e.type._context),
            (a = e.pendingProps.children),
            Ca(e),
            (n = kt(n)),
            (a = a(n)),
            (e.flags |= 1),
            Ut(t, e, a, l),
            e.child
          );
        case 14:
          return jd(t, e, e.type, e.pendingProps, l);
        case 15:
          return ph(t, e, e.type, e.pendingProps, l);
        case 19:
          return zo(t, e, l);
        case 31:
          return Gy(t, e, l);
        case 22:
          return gh(t, e, l, e.pendingProps);
        case 24:
          return (
            Ca(e),
            (a = kt(Rt)),
            t === null
              ? ((n = yf()),
                n === null &&
                  ((n = gt),
                  (u = vf()),
                  (n.pooledCache = u),
                  u.refCount++,
                  u !== null && (n.pooledCacheLanes |= l),
                  (n = u)),
                (e.memoizedState = { parent: a, cache: n }),
                gf(e),
                Yl(e, Rt, n))
              : ((t.lanes & l) !== 0 && (so(t, e), su(e, null, null, l), fu()),
                (n = t.memoizedState),
                (u = e.memoizedState),
                n.parent !== a
                  ? ((n = { parent: a, cache: a }),
                    (e.memoizedState = n),
                    e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = n),
                    Yl(e, Rt, a))
                  : ((a = u.cache), Yl(e, Rt, a), a !== n.cache && oo(e, [Rt], l, !0))),
            Ut(t, e, e.pendingProps.children, l),
            e.child
          );
        case 30:
          return (
            e.stateNode === null &&
              (e.stateNode = { autoName: null, paired: null, clones: null, ref: null }),
            (a = e.pendingProps),
            a.name != null && a.name !== "auto"
              ? (e.flags |= t === null ? 18882560 : 18874368)
              : et && Cc(e),
            t !== null && t.memoizedProps.name !== a.name ? (e.flags |= 4194816) : Xa(t, e),
            Ut(t, e, a.children, l),
            e.child
          );
        case 29:
          throw e.pendingProps;
      }
      throw Error(C(156, e.tag));
    }
    function hl(t) {
      t.flags |= 4;
    }
    function N0(t, e, l, a, n) {
      var u;
      if (
        ((u = (t.mode & 32) !== 0) &&
          (u = l === null ? zr(e, a) : zr(e, a) && (a.src !== l.src || a.srcSet !== l.srcSet)),
        u)
      ) {
        if (((t.flags |= 16777216), (n & 335544128) === n))
          if (t.stateNode.complete) t.flags |= 8192;
          else if (Jh()) t.flags |= 8192;
          else throw ((Aa = Pi), pf);
      } else t.flags &= -16777217;
    }
    function Jd(t, e) {
      if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0) t.flags &= -16777217;
      else if (((t.flags |= 16777216), !T2(e)))
        if (Jh()) t.flags |= 8192;
        else throw ((Aa = Pi), pf);
    }
    function yi(t, e) {
      (e !== null && (t.flags |= 4),
        t.flags & 16384 && ((e = t.tag !== 22 ? Zr() : 536870912), (t.lanes |= e), (Sn |= e)));
    }
    function Jn(t, e) {
      if (!et)
        switch (t.tailMode) {
          case "visible":
            break;
          case "collapsed":
            for (var l = t.tail, a = null; l !== null;)
              (l.alternate !== null && (a = l), (l = l.sibling));
            a === null
              ? e || t.tail === null
                ? (t.tail = null)
                : (t.tail.sibling = null)
              : (a.sibling = null);
            break;
          default:
            for (e = t.tail, l = null; e !== null;)
              (e.alternate !== null && (l = e), (e = e.sibling));
            l === null ? (t.tail = null) : (l.sibling = null);
        }
    }
    function At(t) {
      var e = t.alternate !== null && t.alternate.child === t.child,
        l = 0,
        a = 0;
      if (e)
        for (var n = t.child; n !== null;)
          ((l |= n.lanes | n.childLanes),
            (a |= n.subtreeFlags & 1206910976),
            (a |= n.flags & 1206910976),
            (n.return = t),
            (n = n.sibling));
      else
        for (n = t.child; n !== null;)
          ((l |= n.lanes | n.childLanes),
            (a |= n.subtreeFlags),
            (a |= n.flags),
            (n.return = t),
            (n = n.sibling));
      return ((t.subtreeFlags |= a), (t.childLanes = l), e);
    }
    function Xy(t, e, l) {
      var a = e.pendingProps;
      switch ((mf(e), e.tag)) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return (At(e), null);
        case 1:
          return (At(e), null);
        case 3:
          return (
            (l = e.stateNode),
            (a = null),
            t !== null && (a = t.memoizedState.cache),
            e.memoizedState.cache !== a && (e.flags |= 2048),
            pl(Rt),
            yn(),
            l.pendingContext && ((l.context = l.pendingContext), (l.pendingContext = null)),
            (t === null || t.child === null) &&
              (Va(e)
                ? hl(e)
                : t === null ||
                  (t.memoizedState.isDehydrated && (e.flags & 256) === 0) ||
                  ((e.flags |= 1024), z0())),
            At(e),
            null
          );
        case 26:
          var n = e.type,
            u = e.memoizedState;
          return (
            t === null
              ? (hl(e), u !== null ? (At(e), Jd(e, u)) : (At(e), N0(e, n, null, a, l)))
              : u
                ? u !== t.memoizedState
                  ? (hl(e), At(e), Jd(e, u))
                  : (At(e), (e.flags &= -16777217))
                : ((t = t.memoizedProps), t !== a && hl(e), At(e), N0(e, n, t, a, l)),
            null
          );
        case 27:
          if ((Zi(e), (l = Ql.current), (n = e.type), t !== null && e.stateNode != null))
            t.memoizedProps !== a && hl(e);
          else {
            if (!a) {
              if (e.stateNode === null) throw Error(C(166));
              return (At(e), (e.subtreeFlags &= -33554433), null);
            }
            ((t = nl.current), Va(e) ? Ed(e, t) : ((t = b2(n, a, l)), (e.stateNode = t), hl(e)));
          }
          return (At(e), (e.subtreeFlags &= -33554433), null);
        case 5:
          if ((Zi(e), (n = e.type), t !== null && e.stateNode != null))
            t.memoizedProps !== a && hl(e);
          else {
            if (!a) {
              if (e.stateNode === null) throw Error(C(166));
              return (At(e), (e.subtreeFlags &= -33554433), null);
            }
            if (((u = nl.current), Va(e))) Ed(e, u);
            else {
              var i = wu(Ql.current);
              switch (u) {
                case 1:
                  u = i.createElementNS("http://www.w3.org/2000/svg", n);
                  break;
                case 2:
                  u = i.createElementNS("http://www.w3.org/1998/Math/MathML", n);
                  break;
                default:
                  switch (n) {
                    case "svg":
                      u = i.createElementNS("http://www.w3.org/2000/svg", n);
                      break;
                    case "math":
                      u = i.createElementNS("http://www.w3.org/1998/Math/MathML", n);
                      break;
                    case "script":
                      ((u = i.createElement("div")),
                        (u.innerHTML = "<script><\/script>"),
                        (u = u.removeChild(u.firstChild)));
                      break;
                    case "select":
                      ((u =
                        typeof a.is == "string"
                          ? i.createElement("select", { is: a.is })
                          : i.createElement("select")),
                        a.multiple ? (u.multiple = !0) : a.size && (u.size = a.size));
                      break;
                    default:
                      u =
                        typeof a.is == "string"
                          ? i.createElement(n, { is: a.is })
                          : i.createElement(n);
                  }
              }
              ((u[Zt] = e), (u[ve] = a));
              t: for (i = e.child; i !== null;) {
                if (i.tag === 5 || i.tag === 6) u.appendChild(i.stateNode);
                else if (i.tag !== 4 && i.tag !== 27 && i.child !== null) {
                  ((i.child.return = i), (i = i.child));
                  continue;
                }
                if (i === e) break t;
                for (; i.sibling === null;) {
                  if (i.return === null || i.return === e) break t;
                  i = i.return;
                }
                ((i.sibling.return = i.return), (i = i.sibling));
              }
              e.stateNode = u;
              t: switch ((Jt(u, n, a), n)) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  a = !!a.autoFocus;
                  break t;
                case "img":
                  a = !0;
                  break t;
                default:
                  a = !1;
              }
              a && hl(e);
            }
          }
          return (
            At(e),
            (e.subtreeFlags &= -33554433),
            N0(e, e.type, t === null ? null : t.memoizedProps, e.pendingProps, l),
            null
          );
        case 6:
          if (t && e.stateNode != null) t.memoizedProps !== a && hl(e);
          else {
            if (typeof a != "string" && e.stateNode === null) throw Error(C(166));
            if (((t = Ql.current), Va(e))) {
              if (((t = e.stateNode), (l = e.memoizedProps), (a = null), (n = Vt), n !== null))
                switch (n.tag) {
                  case 27:
                  case 5:
                    a = n.memoizedProps;
                }
              ((t[Zt] = e),
                (t = !!(
                  t.nodeValue === l ||
                  (a !== null && a.suppressHydrationWarning === !0) ||
                  c2(t.nodeValue, l)
                )),
                t || ta(e, !0));
            } else ((t = wu(t).createTextNode(a)), (t[Zt] = e), (e.stateNode = t));
          }
          return (At(e), null);
        case 31:
          if (((l = e.memoizedState), t === null || t.memoizedState !== null)) {
            if (((a = Va(e)), l !== null)) {
              if (t === null) {
                if (!a) throw Error(C(318));
                if (((t = e.memoizedState), (t = t !== null ? t.dehydrated : null), !t))
                  throw Error(C(557));
                t[Zt] = e;
              } else (Ta(), (e.flags & 128) === 0 && (e.memoizedState = null), (e.flags |= 4));
              (At(e), (t = !1));
            } else
              ((l = z0()),
                t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = l),
                (t = !0));
            if (!t) return e.flags & 256 ? (be(e), e) : (be(e), null);
            if ((e.flags & 128) !== 0) throw Error(C(558));
          }
          return (At(e), null);
        case 13:
          if (
            ((a = e.memoizedState),
            t === null || (t.memoizedState !== null && t.memoizedState.dehydrated !== null))
          ) {
            if (((n = Va(e)), a !== null && a.dehydrated !== null)) {
              if (t === null) {
                if (!n) throw Error(C(318));
                if (((n = e.memoizedState), (n = n !== null ? n.dehydrated : null), !n))
                  throw Error(C(317));
                n[Zt] = e;
              } else (Ta(), (e.flags & 128) === 0 && (e.memoizedState = null), (e.flags |= 4));
              (At(e), (n = !1));
            } else
              ((n = z0()),
                t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = n),
                (n = !0));
            if (!n) return e.flags & 256 ? (be(e), e) : (be(e), null);
          }
          return (
            be(e),
            (e.flags & 128) !== 0
              ? ((e.lanes = l), e)
              : ((l = a !== null),
                (t = t !== null && t.memoizedState !== null),
                l &&
                  ((a = e.child),
                  (n = null),
                  a.alternate !== null &&
                    a.alternate.memoizedState !== null &&
                    a.alternate.memoizedState.cachePool !== null &&
                    (n = a.alternate.memoizedState.cachePool.pool),
                  (u = null),
                  a.memoizedState !== null &&
                    a.memoizedState.cachePool !== null &&
                    (u = a.memoizedState.cachePool.pool),
                  u !== n && (a.flags |= 2048)),
                l !== t && l && (e.child.flags |= 8192),
                yi(e, e.updateQueue),
                At(e),
                null)
          );
        case 4:
          return (
            yn(),
            t === null && Xf(e.stateNode.containerInfo),
            (e.flags |= 67108864),
            At(e),
            null
          );
        case 10:
          return (pl(e.type), At(e), null);
        case 19:
          if ((Sf(e), (a = e.memoizedState), a === null)) return (At(e), null);
          if (((n = (e.flags & 128) !== 0), (u = a.rendering), u === null))
            if (n) Jn(a, !1);
            else {
              if (_t !== 0 || (t !== null && (t.flags & 128) !== 0))
                for (t = e.child; t !== null;) {
                  if (((u = ec(t)), u !== null)) {
                    for (
                      e.flags |= 128,
                        Jn(a, !1),
                        t = u.updateQueue,
                        e.updateQueue = t,
                        yi(e, t),
                        e.subtreeFlags = 0,
                        t = l,
                        l = e.child;
                      l !== null;
                    )
                      (E1(l, t), (l = l.sibling));
                    return (zu(e, (Ft.current & 1) | 2), et && ml(e, a.treeForkCount), e.child);
                  }
                  t = t.sibling;
                }
              a.tail !== null &&
                Ee() > dc &&
                ((e.flags |= 128), (n = !0), Jn(a, !1), (e.lanes = 4194304));
            }
          else {
            if (!n)
              if (((t = ec(u)), t !== null)) {
                if (
                  ((e.flags |= 128),
                  (n = !0),
                  (t = t.updateQueue),
                  (e.updateQueue = t),
                  yi(e, t),
                  Jn(a, !0),
                  a.tail === null &&
                    a.tailMode !== "collapsed" &&
                    a.tailMode !== "visible" &&
                    !u.alternate &&
                    !et)
                )
                  return (At(e), null);
              } else
                2 * Ee() - a.renderingStartTime > dc &&
                  l !== 536870912 &&
                  ((e.flags |= 128), (n = !0), Jn(a, !1), (e.lanes = 4194304));
            a.isBackwards
              ? ((u.sibling = e.child), (e.child = u))
              : ((t = a.last), t !== null ? (t.sibling = u) : (e.child = u), (a.last = u));
          }
          if (a.tail !== null) {
            t = a.tail;
            t: {
              for (l = t; l !== null;) {
                if (l.alternate !== null) {
                  l = !1;
                  break t;
                }
                l = l.sibling;
              }
              l = !0;
            }
            return (
              (a.rendering = t),
              (a.tail = t.sibling),
              (a.renderingStartTime = Ee()),
              (t.sibling = null),
              (u = Ft.current),
              (u = n ? (u & 1) | 2 : u & 1),
              a.tailMode === "visible" || a.tailMode === "collapsed" || !l || et
                ? zu(e, u)
                : ((l = u), Tt(It, e), Tt(Ft, l), Pt === null && (Pt = e)),
              et && ml(e, a.treeForkCount),
              t
            );
          }
          return (At(e), null);
        case 22:
        case 23:
          return (
            be(e),
            bf(),
            (a = e.memoizedState !== null),
            t !== null
              ? (t.memoizedState !== null) !== a && (e.flags |= 8192)
              : a && (e.flags |= 8192),
            a
              ? (l & 536870912) !== 0 &&
                (e.flags & 128) === 0 &&
                (At(e), e.subtreeFlags & 6 && (e.flags |= 8192))
              : At(e),
            (l = e.updateQueue),
            l !== null && yi(e, l.retryQueue),
            (l = null),
            t !== null &&
              t.memoizedState !== null &&
              t.memoizedState.cachePool !== null &&
              (l = t.memoizedState.cachePool.pool),
            (a = null),
            e.memoizedState !== null &&
              e.memoizedState.cachePool !== null &&
              (a = e.memoizedState.cachePool.pool),
            a !== l && (e.flags |= 2048),
            t !== null && Kt(Sa),
            null
          );
        case 24:
          return (
            (l = null),
            t !== null && (l = t.memoizedState.cache),
            e.memoizedState.cache !== l && (e.flags |= 2048),
            pl(Rt),
            At(e),
            null
          );
        case 25:
          return null;
        case 30:
          return ((e.flags |= 33554432), At(e), null);
      }
      throw Error(C(156, e.tag));
    }
    function Zy(t, e) {
      switch ((mf(e), e.tag)) {
        case 1:
          return ((t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null);
        case 3:
          return (
            pl(Rt),
            yn(),
            (t = e.flags),
            (t & 65536) !== 0 && (t & 128) === 0 ? ((e.flags = (t & -65537) | 128), e) : null
          );
        case 26:
        case 27:
        case 5:
          return (Zi(e), null);
        case 31:
          if (e.memoizedState !== null) {
            if ((be(e), e.alternate === null)) throw Error(C(340));
            Ta();
          }
          return ((t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null);
        case 13:
          if ((be(e), (t = e.memoizedState), t !== null && t.dehydrated !== null)) {
            if (e.alternate === null) throw Error(C(340));
            Ta();
          }
          return ((t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null);
        case 19:
          return (
            Sf(e),
            (t = e.flags),
            t & 65536
              ? ((e.flags = (t & -65537) | 128),
                (t = e.memoizedState),
                t !== null && ((t.rendering = null), (t.tail = null)),
                (e.flags |= 4),
                e)
              : null
          );
        case 4:
          return (yn(), null);
        case 10:
          return (pl(e.type), null);
        case 22:
        case 23:
          return (
            be(e),
            bf(),
            t !== null && Kt(Sa),
            (t = e.flags),
            t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
          );
        case 24:
          return (pl(Rt), null);
        case 25:
          return null;
        default:
          return null;
      }
    }
    function Ah(t, e) {
      switch ((mf(e), e.tag)) {
        case 3:
          (pl(Rt), yn());
          break;
        case 26:
        case 27:
        case 5:
          Zi(e);
          break;
        case 4:
          yn();
          break;
        case 31:
          e.memoizedState !== null && be(e);
          break;
        case 13:
          be(e);
          break;
        case 19:
          Sf(e);
          break;
        case 10:
          pl(e.type);
          break;
        case 22:
        case 23:
          (be(e), bf(), t !== null && Kt(Sa));
          break;
        case 24:
          pl(Rt);
      }
    }
    function Gu(t, e) {
      try {
        var l = e.updateQueue,
          a = l !== null ? l.lastEffect : null;
        if (a !== null) {
          var n = a.next;
          l = n;
          do {
            if ((l.tag & t) === t) {
              a = void 0;
              var u = l.create,
                i = l.inst;
              ((a = u()), (i.destroy = a));
            }
            l = l.next;
          } while (l !== n);
        }
      } catch (c) {
        vt(e, e.return, c);
      }
    }
    function la(t, e, l) {
      try {
        var a = e.updateQueue,
          n = a !== null ? a.lastEffect : null;
        if (n !== null) {
          var u = n.next;
          a = u;
          do {
            if ((a.tag & t) === t) {
              var i = a.inst,
                c = i.destroy;
              if (c !== void 0) {
                ((i.destroy = void 0), (n = e));
                var f = l,
                  m = c;
                try {
                  m();
                } catch (g) {
                  vt(n, f, g);
                }
              }
            }
            a = a.next;
          } while (a !== u);
        }
      } catch (g) {
        vt(e, e.return, g);
      }
    }
    function Eh(t) {
      var e = t.updateQueue;
      if (e !== null) {
        var l = t.stateNode;
        try {
          B1(e, l);
        } catch (a) {
          vt(t, t.return, a);
        }
      }
    }
    function Th(t, e, l) {
      ((l.props = Na(t.type, t.memoizedProps)), (l.state = t.memoizedState));
      try {
        l.componentWillUnmount();
      } catch (a) {
        vt(t, e, a);
      }
    }
    function We(t, e) {
      try {
        var l = t.ref;
        if (l !== null) {
          switch (t.tag) {
            case 26:
            case 27:
            case 5:
              var a = t.stateNode;
              break;
            case 30:
              var n = t.stateNode,
                u = bl(t.memoizedProps, n);
              ((n.ref === null || n.ref.name !== u) && (n.ref = h2(u)), (a = n.ref));
              break;
            case 7:
              if (t.stateNode === null) {
                var i = new Me(t);
                (me(t.child, !1, Op, i, void 0, void 0), (t.stateNode = i));
              }
              a = t.stateNode;
              break;
            default:
              a = t.stateNode;
          }
          typeof l == "function" ? (t.refCleanup = l(a)) : (l.current = a);
        }
      } catch (c) {
        vt(t, e, c);
      }
    }
    function Xt(t, e) {
      var l = t.ref,
        a = t.refCleanup;
      if (l !== null)
        if (typeof a == "function")
          try {
            a();
          } catch (n) {
            vt(t, e, n);
          } finally {
            ((t.refCleanup = null), (t = t.alternate), t != null && (t.refCleanup = null));
          }
        else if (typeof l == "function")
          try {
            l(null);
          } catch (n) {
            vt(t, e, n);
          }
        else l.current = null;
    }
    function ic(t, e) {
      if ((t.tag === 5 || t.tag === 27 || t.tag === 6) && t.alternate === null && e !== null)
        for (var l = 0; l < e.length; l++) p2(t.stateNode, e[l]);
    }
    function Id(t) {
      for (var e = t.return; e !== null && (Lf(e) && p2(t.stateNode, e.stateNode), !Uf(e));)
        e = e.return;
    }
    function hu(t) {
      for (var e = t.return; e !== null && (Lf(e) && Rp(t.stateNode, e.stateNode), !Uf(e));)
        e = e.return;
    }
    function Uf(t) {
      return t.tag === 5 || t.tag === 3 || t.tag === 27;
    }
    function Lf(t) {
      return t && t.tag === 7 && t.stateNode !== null;
    }
    function Co(t) {
      var e = t.type,
        l = t.memoizedProps,
        a = t.stateNode;
      try {
        t: switch (e) {
          case "button":
          case "input":
          case "select":
          case "textarea":
            l.autoFocus && a.focus();
            break t;
          case "img":
            l.src ? (a.src = l.src) : l.srcSet && (a.srcset = l.srcSet);
        }
      } catch (n) {
        vt(t, t.return, n);
      }
    }
    function _0(t, e, l) {
      try {
        var a = t.stateNode;
        (vp(a, t.type, l, e), (a[ve] = e));
      } catch (n) {
        vt(t, t.return, n);
      }
    }
    function zh(t) {
      return (
        t.tag === 5 || t.tag === 3 || t.tag === 26 || (t.tag === 27 && ua(t.type)) || t.tag === 4
      );
    }
    function D0(t) {
      t: for (;;) {
        for (; t.sibling === null;) {
          if (t.return === null || zh(t.return)) return null;
          t = t.return;
        }
        for (
          t.sibling.return = t.return, t = t.sibling;
          t.tag !== 5 && t.tag !== 6 && t.tag !== 18;
        ) {
          if ((t.tag === 27 && ua(t.type)) || t.flags & 2 || t.child === null || t.tag === 4)
            continue t;
          ((t.child.return = t), (t = t.child));
        }
        if (!(t.flags & 2)) return t.stateNode;
      }
    }
    function xo(t, e, l, a) {
      var n = t.tag;
      if (n === 5 || n === 6)
        ((n = t.stateNode),
          e
            ? (l.nodeType === 9
                ? l.body
                : l.nodeName === "HTML"
                  ? l.ownerDocument.body
                  : l
              ).insertBefore(n, e)
            : ((e = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l),
              e.appendChild(n),
              (l = l._reactRootContainer),
              l != null || e.onclick !== null || (e.onclick = el)),
          ic(t, a),
          (ct = !0));
      else if (
        n !== 4 &&
        (n === 27 && (ic(t, a), (a = null), ua(t.type) && ((l = t.stateNode), (e = null))),
        (t = t.child),
        t !== null)
      )
        for (xo(t, e, l, a), t = t.sibling; t !== null;) (xo(t, e, l, a), (t = t.sibling));
    }
    function cc(t, e, l, a) {
      var n = t.tag;
      if (n === 5 || n === 6)
        ((n = t.stateNode), e ? l.insertBefore(n, e) : l.appendChild(n), ic(t, a), (ct = !0));
      else if (
        n !== 4 &&
        (n === 27 && (ic(t, a), (a = null), ua(t.type) && (l = t.stateNode)),
        (t = t.child),
        t !== null)
      )
        for (cc(t, e, l, a), t = t.sibling; t !== null;) (cc(t, e, l, a), (t = t.sibling));
    }
    function Ch(t) {
      var e = t.stateNode,
        l = t.memoizedProps;
      try {
        for (var a = t.type, n = e.attributes; n.length;) e.removeAttributeNode(n[0]);
        (Jt(e, a, l), (e[Zt] = t), (e[ve] = l));
      } catch (u) {
        vt(t, t.return, u);
      }
    }
    var oc = !1,
      Se = null;
    function $d(t) {
      (t.tag === 30 || (t.subtreeFlags & 33554432) !== 0) && (oc = !0);
    }
    var Pe = null;
    function Wd() {
      var t = Pe;
      return ((Pe = null), t);
    }
    var de = 0;
    function Bn(t, e, l, a, n) {
      return ((de = 0), xh(t.child, e, l, a, n));
    }
    function xh(t, e, l, a, n) {
      for (var u = !1; t !== null;) {
        if (t.tag === 5) {
          var i = t.stateNode;
          if (a !== null) {
            var c = ko(i);
            (a.push(c), c.view && (u = !0));
          } else u || (ko(i).view && (u = !0));
          ((oc = !0), s2(i, de === 0 ? e : e + "_" + de, l), de++);
        } else
          (t.tag !== 22 || t.memoizedState === null) &&
            ((t.tag === 30 && n) || (xh(t.child, e, l, a, n) && (u = !0)));
        t = t.sibling;
      }
      return u;
    }
    function il(t, e) {
      for (; t !== null;)
        (t.tag === 5
          ? d2(t.stateNode, t.memoizedProps)
          : (t.tag !== 22 || t.memoizedState === null) && ((t.tag === 30 && e) || il(t.child, e)),
          (t = t.sibling));
    }
    function Ri(t) {
      if ((t.subtreeFlags & 18874368) !== 0)
        for (t = t.child; t !== null;) {
          if (
            (t.tag !== 22 || t.memoizedState === null) &&
            (Ri(t), t.tag === 30 && (t.flags & 18874368) !== 0 && t.stateNode.paired)
          ) {
            var e = t.memoizedProps;
            if (e.name == null || e.name === "auto") throw Error(C(544));
            var l = e.name;
            ((e = Cl(e.default, e.share)),
              e !== "none" && (Bn(t, l, e, null, !1) || il(t.child, !1)));
          }
          t = t.sibling;
        }
    }
    function Mo(t, e) {
      if (t.tag === 30) {
        var l = t.stateNode,
          a = t.memoizedProps,
          n = bl(a, l),
          u = Cl(a.default, l.paired ? a.share : a.enter);
        u !== "none"
          ? Bn(t, n, u, null, !1)
            ? (Ri(t), l.paired || e || An(t, a.onEnter))
            : il(t.child, !1)
          : Ri(t);
      } else if ((t.subtreeFlags & 33554432) !== 0)
        for (t = t.child; t !== null;) (Mo(t, e), (t = t.sibling));
      else Ri(t);
    }
    function wo(t) {
      if (Se !== null && Se.size !== 0) {
        var e = Se;
        if ((t.subtreeFlags & 18874368) !== 0)
          for (t = t.child; t !== null;) {
            if (t.tag !== 22 || t.memoizedState === null) {
              if (t.tag === 30 && (t.flags & 18874368) !== 0) {
                var l = t.memoizedProps,
                  a = l.name;
                if (a != null && a !== "auto") {
                  var n = e.get(a);
                  if (n !== void 0) {
                    var u = Cl(l.default, l.share);
                    if (
                      (u !== "none" &&
                        (Bn(t, a, u, null, !1)
                          ? ((u = t.stateNode), (n.paired = u), (u.paired = n), An(t, l.onShare))
                          : il(t.child, !1)),
                      e.delete(a),
                      e.size === 0)
                    )
                      break;
                  }
                }
              }
              wo(t);
            }
            t = t.sibling;
          }
      }
    }
    function No(t) {
      if (t.tag === 30) {
        var e = t.memoizedProps,
          l = bl(e, t.stateNode),
          a = Se !== null ? Se.get(l) : void 0,
          n = Cl(e.default, a !== void 0 ? e.share : e.exit);
        (n !== "none" &&
          (Bn(t, l, n, null, !1)
            ? a !== void 0
              ? ((n = t.stateNode), (a.paired = n), (n.paired = a), Se.delete(l), An(t, e.onShare))
              : An(t, e.onExit)
            : il(t.child, !1)),
          Se !== null && wo(t));
      } else if ((t.subtreeFlags & 33554432) !== 0)
        for (t = t.child; t !== null;) (No(t), (t = t.sibling));
      else Se !== null && wo(t);
    }
    function Mh(t) {
      for (t = t.child; t !== null;) {
        if (t.tag === 30) {
          var e = t.memoizedProps,
            l = bl(e, t.stateNode);
          ((e = Cl(e.default, e.update)),
            (t.flags &= -5),
            e !== "none" && Bn(t, l, e, (t.memoizedState = []), !1));
        } else (t.subtreeFlags & 33554432) !== 0 && Mh(t);
        t = t.sibling;
      }
    }
    function _o(t) {
      if ((t.subtreeFlags & 18874368) !== 0)
        for (t = t.child; t !== null;) {
          if (t.tag !== 22 || t.memoizedState === null) {
            if (t.tag === 30 && (t.flags & 18874368) !== 0) {
              var e = t.stateNode;
              e.paired !== null && ((e.paired = null), il(t.child, !1));
            }
            _o(t);
          }
          t = t.sibling;
        }
    }
    function Hi(t) {
      if (t.tag === 30) ((t.stateNode.paired = null), il(t.child, !1), _o(t));
      else if ((t.subtreeFlags & 33554432) !== 0)
        for (t = t.child; t !== null;) (Hi(t), (t = t.sibling));
      else _o(t);
    }
    function wh(t) {
      for (t = t.child; t !== null;)
        (t.tag === 30 ? il(t.child, !1) : (t.subtreeFlags & 33554432) !== 0 && wh(t),
          (t = t.sibling));
    }
    function qf(t, e, l, a, n, u, i) {
      for (var c = !1; e !== null;) {
        if (e.tag === 5) {
          var f = e.stateNode;
          if (u !== null && de < u.length) {
            var m = u[de],
              g = ko(f);
            (m.view || g.view) && (c = !0);
            var A;
            if ((A = (t.flags & 4) === 0))
              if (g.clip) A = !0;
              else {
                A = m.rect;
                var v = g.rect;
                A = A.y !== v.y || A.x !== v.x || A.height !== v.height || A.width !== v.width;
              }
            (A && (t.flags |= 4),
              g.abs
                ? (g = !m.abs)
                : ((m = m.rect), (g = g.rect), (g = m.height !== g.height || m.width !== g.width)),
              g && (t.flags |= 32));
          } else t.flags |= 32;
          ((t.flags & 4) !== 0 && s2(f, de === 0 ? l : l + "_" + de, n),
            (c && (t.flags & 4) !== 0) ||
              (Pe === null && (Pe = []), Pe.push(f, de === 0 ? a : a + "_" + de, e.memoizedProps)),
            de++);
        } else
          (e.tag !== 22 || e.memoizedState === null) &&
            (e.tag === 30 && i
              ? (t.flags |= e.flags & 32)
              : qf(t, e.child, l, a, n, u, i) && (c = !0));
        e = e.sibling;
      }
      return c;
    }
    function Nh(t, e) {
      for (t = t.child; t !== null;) {
        if (t.tag === 30) {
          var l = t.memoizedProps,
            a = t.stateNode,
            n = bl(l, a),
            u = Cl(l.default, l.update);
          if (e) {
            a = a.clones;
            var i = a === null ? null : a.map(Ap);
          } else ((i = t.memoizedState), (t.memoizedState = null));
          a = t;
          var c = t.child;
          ((de = 0),
            (n = qf(a, c, n, n, u, i, !1)),
            (t.flags & 4) !== 0 && n && (e || An(t, l.onUpdate)));
        } else (t.subtreeFlags & 33554432) !== 0 && Nh(t, e);
        t = t.sibling;
      }
    }
    var Yt = !1,
      rt = !1,
      Je = !1,
      B0 = !1,
      Pd = typeof WeakSet == "function" ? WeakSet : Set,
      jt = null,
      Ie = !1,
      au = !1,
      fc = !1,
      Do = !1;
    function ky(t, e, l) {
      if (((t = t.containerInfo), (Qo = Mn), (t = m1(t)), sf(t))) {
        if ("selectionStart" in t) var a = { start: t.selectionStart, end: t.selectionEnd };
        else
          t: {
            a = ((a = t.ownerDocument) && a.defaultView) || window;
            var n = a.getSelection && a.getSelection();
            if (n && n.rangeCount !== 0) {
              a = n.anchorNode;
              var u = n.anchorOffset,
                i = n.focusNode;
              n = n.focusOffset;
              try {
                (a.nodeType, i.nodeType);
              } catch {
                a = null;
                break t;
              }
              var c = 0,
                f = -1,
                m = -1,
                g = 0,
                A = 0,
                v = t,
                p = null;
              e: for (;;) {
                for (
                  var x;
                  v !== a || (u !== 0 && v.nodeType !== 3) || (f = c + u),
                    v !== i || (n !== 0 && v.nodeType !== 3) || (m = c + n),
                    v.nodeType === 3 && (c += v.nodeValue.length),
                    (x = v.firstChild) !== null;
                )
                  ((p = v), (v = x));
                for (;;) {
                  if (v === t) break e;
                  if (
                    (p === a && ++g === u && (f = c),
                    p === i && ++A === n && (m = c),
                    (x = v.nextSibling) !== null)
                  )
                    break;
                  ((v = p), (p = v.parentNode));
                }
                v = x;
              }
              a = f === -1 || m === -1 ? null : { start: f, end: m };
            } else a = null;
          }
        a = a || { start: 0, end: 0 };
      } else a = null;
      for (
        Xo = { focusedElem: t, selectionRange: a },
          Mn = !1,
          l = (l & 335544064) === l,
          jt = e,
          e = l ? 9270 : 1024;
        jt !== null;
      ) {
        if (((t = jt), l && ((a = t.deletions), a !== null)))
          for (u = 0; u < a.length; u++) l && No(a[u]);
        if (t.alternate === null && (t.flags & 2) !== 0) (l && $d(t), pi(l));
        else {
          if (t.tag === 22) {
            if (((a = t.alternate), t.memoizedState !== null)) {
              (a !== null && a.memoizedState === null && l && No(a), pi(l));
              continue;
            } else if (a !== null && a.memoizedState !== null) {
              (l && $d(t), pi(l));
              continue;
            }
          }
          ((a = t.child),
            (t.subtreeFlags & e) !== 0 && a !== null
              ? ((a.return = t), (jt = a))
              : (l && Mh(t), pi(l)));
        }
      }
      Se = null;
    }
    function pi(t) {
      for (; jt !== null;) {
        var e = jt,
          l = t,
          a = e.alternate,
          n = e.flags;
        switch (e.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if ((n & 1024) !== 0 && a !== null) {
              ((l = void 0), (n = a.memoizedProps), (a = a.memoizedState));
              var u = e.stateNode;
              try {
                var i = Na(e.type, n);
                ((l = u.getSnapshotBeforeUpdate(i, a)),
                  (u.__reactInternalSnapshotBeforeUpdate = l));
              } catch (c) {
                vt(e, e.return, c);
              }
            }
            break;
          case 3:
            if ((n & 1024) !== 0) {
              if (((a = e.stateNode.containerInfo), (l = a.nodeType), l === 9)) Ko(a);
              else if (l === 1)
                switch (a.nodeName) {
                  case "HEAD":
                  case "HTML":
                  case "BODY":
                    Ko(a);
                    break;
                  default:
                    a.textContent = "";
                }
            }
            break;
          case 5:
          case 26:
          case 27:
          case 6:
          case 4:
          case 17:
            break;
          case 30:
            l &&
              a !== null &&
              ((l = bl(a.memoizedProps, a.stateNode)),
              (n = e.memoizedProps),
              (n = Cl(n.default, n.update)),
              n !== "none" && Bn(a, l, n, (a.memoizedState = []), !0));
            break;
          default:
            if ((n & 1024) !== 0) throw Error(C(163));
        }
        if (((a = e.sibling), a !== null)) {
          ((a.return = e.return), (jt = a));
          break;
        }
        jt = e.return;
      }
    }
    function _h(t, e, l) {
      var a = l.flags;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          ($e(t, l), a & 4 && Gu(5, l));
          break;
        case 1:
          if (($e(t, l), a & 4))
            if (((t = l.stateNode), e === null))
              try {
                t.componentDidMount();
              } catch (i) {
                vt(l, l.return, i);
              }
            else {
              var n = Na(l.type, e.memoizedProps);
              e = e.memoizedState;
              try {
                t.componentDidUpdate(n, e, t.__reactInternalSnapshotBeforeUpdate);
              } catch (i) {
                vt(l, l.return, i);
              }
            }
          (a & 64 && Eh(l), a & 512 && We(l, l.return));
          break;
        case 3:
          if (($e(t, l), a & 64 && ((t = l.updateQueue), t !== null))) {
            if (((e = null), l.child !== null))
              switch (l.child.tag) {
                case 27:
                case 5:
                  e = l.child.stateNode;
                  break;
                case 1:
                  e = l.child.stateNode;
              }
            try {
              B1(t, e);
            } catch (i) {
              vt(l, l.return, i);
            }
          }
          break;
        case 27:
          e === null && a & 4 && Ch(l);
        case 26:
        case 5:
          ($e(t, l), e === null && a & 4 && Co(l), a & 512 && We(l, l.return));
          break;
        case 12:
          $e(t, l);
          break;
        case 31:
          ($e(t, l), a & 4 && Rh(t, l));
          break;
        case 13:
          ($e(t, l),
            a & 4 && Hh(t, l),
            a & 64 &&
              ((t = l.memoizedState),
              t !== null &&
                ((t = t.dehydrated), t !== null && ((l = np.bind(null, l)), Lp(t, l)))));
          break;
        case 22:
          if (((a = l.memoizedState !== null || Yt), !a)) {
            var u = (e !== null && e.memoizedState !== null) || rt;
            ((e = Yt),
              (n = rt),
              (Yt = a),
              (rt = u) && !n
                ? ((a = 2), (l.subtreeFlags & 8772) !== 0 && (a |= 1), Ve(t, l, a))
                : $e(t, l),
              (Yt = e),
              (rt = n));
          }
          break;
        case 30:
          ($e(t, l), a & 512 && We(l, l.return));
          break;
        case 7:
          a & 512 && We(l, l.return);
        default:
          $e(t, l);
      }
    }
    function Bo(t, e) {
      for (t = t.child; t !== null;) (Dh(t, e), (t = t.sibling));
    }
    function Dh(t, e) {
      switch (t.tag) {
        case 5:
        case 26:
          try {
            var l = t.stateNode;
            if (e) {
              var a = l.style;
              typeof a.setProperty == "function"
                ? a.setProperty("display", "none", "important")
                : (a.display = "none");
            } else {
              var n = t.stateNode,
                u = t.memoizedProps.style,
                i = u != null && u.hasOwnProperty("display") ? u.display : null;
              n.style.display = i == null || typeof i == "boolean" ? "" : ("" + i).trim();
            }
          } catch (f) {
            vt(t, t.return, f);
          }
          Oo(t, e);
          break;
        case 6:
          try {
            ((t.stateNode.nodeValue = e ? "" : t.memoizedProps), (ct = !0));
          } catch (f) {
            vt(t, t.return, f);
          }
          break;
        case 18:
          try {
            var c = t.stateNode;
            e ? vr(c, !0) : vr(t.stateNode, !1);
          } catch (f) {
            vt(t, t.return, f);
          }
          break;
        case 22:
        case 23:
          t.memoizedState === null && Bo(t, e);
          break;
        default:
          Bo(t, e);
      }
    }
    function Oo(t, e) {
      if (t.subtreeFlags & 67108864)
        for (t = t.child; t !== null;) {
          t: {
            var l = t,
              a = e;
            switch (l.tag) {
              case 4:
                Dh(l, a);
                break t;
              case 22:
                l.memoizedState === null && Oo(l, a);
                break t;
              default:
                Oo(l, a);
            }
          }
          t = t.sibling;
        }
    }
    function Bh(t) {
      var e = t.alternate;
      (e !== null && ((t.alternate = null), Bh(e)),
        (t.child = null),
        (t.deletions = null),
        (t.sibling = null),
        t.tag === 5 && ((e = t.stateNode), e !== null && bc(e)),
        (t.stateNode = null),
        (t.return = null),
        (t.dependencies = null),
        (t.memoizedProps = null),
        (t.memoizedState = null),
        (t.pendingProps = null),
        (t.stateNode = null),
        (t.updateQueue = null));
    }
    var xt = null,
      fe = !1;
    function Ge(t, e, l) {
      for (l = l.child; l !== null;) (Oh(t, e, l), (l = l.sibling));
    }
    function Oh(t, e, l) {
      if (Te && typeof Te.onCommitFiberUnmount == "function")
        try {
          Te.onCommitFiberUnmount(Ru, l);
        } catch {}
      switch (l.tag) {
        case 26:
          (rt || Xt(l, e),
            Ge(t, e, l),
            l.memoizedState
              ? l.memoizedState.count--
              : l.stateNode && !rt && ((l = l.stateNode), l.parentNode.removeChild(l)));
          break;
        case 27:
          (rt || Xt(l, e), hu(l));
          var a = xt,
            n = fe;
          (ua(l.type) && ((xt = l.stateNode), (fe = !1)),
            Ge(t, e, l),
            S2(l.stateNode, l.type, l.memoizedProps),
            (xt = a),
            (fe = n));
          break;
        case 5:
          (rt || Xt(l, e), hu(l));
        case 6:
          if (
            (l.tag === 6 && hu(l),
            (a = xt),
            (n = fe),
            (xt = null),
            Ge(t, e, l),
            (xt = a),
            (fe = n),
            xt !== null)
          )
            if (fe)
              try {
                ((xt.nodeType === 9
                  ? xt.body
                  : xt.nodeName === "HTML"
                    ? xt.ownerDocument.body
                    : xt
                ).removeChild(l.stateNode),
                  (ct = !0));
              } catch (u) {
                vt(l, e, u);
              }
            else
              try {
                (xt.removeChild(l.stateNode), (ct = !0));
              } catch (u) {
                vt(l, e, u);
              }
          break;
        case 18:
          xt !== null &&
            (fe
              ? ((t = xt),
                mr(
                  t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t,
                  l.stateNode,
                ),
                wn(t))
              : mr(xt, l.stateNode));
          break;
        case 4:
          ((a = xt),
            (n = fe),
            (xt = l.stateNode.containerInfo),
            (fe = !0),
            Ge(t, e, l),
            (xt = a),
            (fe = n));
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          (la(2, l, e), rt || la(4, l, e), Ge(t, e, l));
          break;
        case 1:
          (rt ||
            (Xt(l, e),
            (a = l.stateNode),
            typeof a.componentWillUnmount == "function" && Th(l, e, a)),
            Ge(t, e, l));
          break;
        case 21:
          Ge(t, e, l);
          break;
        case 22:
          ((rt = (a = rt) || l.memoizedState !== null), Ge(t, e, l), (rt = a));
          break;
        case 30:
          (Xt(l, e), Ge(t, e, l));
          break;
        case 7:
          (rt || Xt(l, e), Ge(t, e, l));
          break;
        default:
          Ge(t, e, l);
      }
    }
    function Rh(t, e) {
      if (
        e.memoizedState === null &&
        ((t = e.alternate), t !== null && ((t = t.memoizedState), t !== null))
      ) {
        t = t.dehydrated;
        try {
          wn(t);
        } catch (l) {
          vt(e, e.return, l);
        }
      }
    }
    function Hh(t, e) {
      if (
        e.memoizedState === null &&
        ((t = e.alternate),
        t !== null && ((t = t.memoizedState), t !== null && ((t = t.dehydrated), t !== null)))
      )
        try {
          wn(t);
        } catch (l) {
          vt(e, e.return, l);
        }
    }
    function Ky(t) {
      switch (t.tag) {
        case 31:
        case 13:
        case 19:
          var e = t.stateNode;
          return (e === null && (e = t.stateNode = new Pd()), e);
        case 22:
          return (
            (t = t.stateNode),
            (e = t._retryCache),
            e === null && (e = t._retryCache = new Pd()),
            e
          );
        default:
          throw Error(C(435, t.tag));
      }
    }
    function gi(t, e) {
      var l = Ky(t);
      e.forEach(function (a) {
        if (!l.has(a)) {
          l.add(a);
          var n = up.bind(null, t, a);
          a.then(n, n);
        }
      });
    }
    function ae(t, e, l) {
      var a = e.deletions;
      if (a !== null)
        for (var n = 0; n < a.length; n++) {
          var u = a[n],
            i = t,
            c = e,
            f = c;
          t: for (; f !== null;) {
            switch (f.tag) {
              case 27:
                if (ua(f.type)) {
                  ((xt = f.stateNode), (fe = !1));
                  break t;
                }
                break;
              case 5:
                ((xt = f.stateNode), (fe = !1));
                break t;
              case 3:
              case 4:
                ((xt = f.stateNode.containerInfo), (fe = !0));
                break t;
            }
            f = f.return;
          }
          if (xt === null) throw Error(C(160));
          (Oh(i, c, u),
            (xt = null),
            (fe = !1),
            (i = u.alternate),
            i !== null && (i.return = null),
            (u.return = null));
        }
      if (e.subtreeFlags & 13886) for (e = e.child; e !== null;) (Uh(e, t, l), (e = e.sibling));
    }
    var Qe = null;
    function Uh(t, e, l) {
      var a = t.alternate,
        n = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          if (n & 4 && ((a = t.updateQueue), (a = a !== null ? a.events : null), a !== null))
            for (var u = 0; u < a.length; u++) {
              var i = a[u];
              i.ref.impl = i.nextImpl;
            }
          (ae(e, t, l), ne(t), n & 4 && (la(3, t, t.return), Gu(3, t), la(5, t, t.return)));
          break;
        case 1:
          (ae(e, t, l),
            ne(t),
            n & 512 && (rt || a === null || Xt(a, a.return)),
            n & 64 &&
              Yt &&
              ((t = t.updateQueue),
              t !== null &&
                ((e = t.callbacks),
                e !== null &&
                  ((l = t.shared.hiddenCallbacks),
                  (t.shared.hiddenCallbacks = l === null ? e : l.concat(e))))));
          break;
        case 26:
          if (
            ((u = Qe), ae(e, t, l), ne(t), n & 512 && (rt || a === null || Xt(a, a.return)), n & 4)
          )
            if (((n = a !== null ? a.memoizedState : null), (l = t.memoizedState), a === null))
              if (l === null)
                if (t.stateNode === null)
                  if (Yt) t.stateNode = f2(t.type, t.memoizedProps, e.containerInfo, t);
                  else {
                    t: {
                      ((e = t.type), (l = t.memoizedProps), (n = u.ownerDocument || u));
                      e: switch (e) {
                        case "title":
                          ((a = n.getElementsByTagName("title")[0]),
                            (!a ||
                              a[Lu] ||
                              a[Zt] ||
                              a.namespaceURI === "http://www.w3.org/2000/svg" ||
                              a.hasAttribute("itemprop")) &&
                              ((a = n.createElement(e)),
                              n.head.insertBefore(a, n.querySelector("head > title"))),
                            Jt(a, e, l),
                            (a[Zt] = t),
                            Gt(a),
                            (e = a));
                          break t;
                        case "link":
                          if ((u = Tr("link", "href", n).get(e + (l.href || "")))) {
                            for (i = 0; i < u.length; i++)
                              if (
                                ((a = u[i]),
                                a.getAttribute("href") ===
                                  (l.href == null || l.href === "" ? null : l.href) &&
                                  a.getAttribute("rel") === (l.rel == null ? null : l.rel) &&
                                  a.getAttribute("title") === (l.title == null ? null : l.title) &&
                                  a.getAttribute("crossorigin") ===
                                    (l.crossOrigin == null ? null : l.crossOrigin))
                              ) {
                                u.splice(i, 1);
                                break e;
                              }
                          }
                          ((a = n.createElement(e)), Jt(a, e, l), n.head.appendChild(a));
                          break;
                        case "meta":
                          if ((u = Tr("meta", "content", n).get(e + (l.content || "")))) {
                            for (i = 0; i < u.length; i++)
                              if (
                                ((a = u[i]),
                                a.getAttribute("content") ===
                                  (l.content == null ? null : "" + l.content) &&
                                  a.getAttribute("name") === (l.name == null ? null : l.name) &&
                                  a.getAttribute("property") ===
                                    (l.property == null ? null : l.property) &&
                                  a.getAttribute("http-equiv") ===
                                    (l.httpEquiv == null ? null : l.httpEquiv) &&
                                  a.getAttribute("charset") ===
                                    (l.charSet == null ? null : l.charSet))
                              ) {
                                u.splice(i, 1);
                                break e;
                              }
                          }
                          ((a = n.createElement(e)), Jt(a, e, l), n.head.appendChild(a));
                          break;
                        default:
                          throw Error(C(468, e));
                      }
                      ((a[Zt] = t), Gt(a), (e = a));
                    }
                    t.stateNode = e;
                  }
                else Yt || Io(u, t.type, t.stateNode);
              else t.stateNode = Er(u, l, t.memoizedProps);
            else
              n !== l
                ? (n === null
                    ? ((e = a.stateNode), e === null || rt || e.parentNode.removeChild(e))
                    : n.count--,
                  l === null ? Yt || Io(u, t.type, t.stateNode) : Er(u, l, t.memoizedProps))
                : l === null && t.stateNode !== null && _0(t, t.memoizedProps, a.memoizedProps);
          break;
        case 27:
          (ae(e, t, l),
            ne(t),
            n & 512 && (rt || a === null || Xt(a, a.return)),
            a !== null && n & 4 && _0(t, t.memoizedProps, a.memoizedProps));
          break;
        case 5:
          if (
            ((u = Je),
            (Je = !1),
            ae(e, t, l),
            (Je = u),
            ne(t),
            n & 512 && (rt || a === null || Xt(a, a.return)),
            t.flags & 32)
          ) {
            e = t.stateNode;
            try {
              (gn(e, ""), (ct = !0));
            } catch (g) {
              vt(t, t.return, g);
            }
          }
          (n & 4 &&
            t.stateNode != null &&
            ((e = t.memoizedProps), _0(t, e, a !== null ? a.memoizedProps : e)),
            n & 1024 && (B0 = !0));
          break;
        case 6:
          if ((ae(e, t, l), ne(t), n & 4)) {
            if (t.stateNode === null) throw Error(C(162));
            ((e = t.memoizedProps), (l = t.stateNode));
            try {
              ((l.nodeValue = e), (ct = !0));
            } catch (g) {
              vt(t, t.return, g);
            }
          }
          break;
        case 3:
          if (
            ((ct = !1),
            (Yi = null),
            (u = Qe),
            (Qe = Nu(e.containerInfo)),
            ae(e, t, l),
            (Qe = u),
            ne(t),
            n & 4 && a !== null && a.memoizedState.isDehydrated)
          )
            try {
              wn(e.containerInfo);
            } catch (g) {
              vt(t, t.return, g);
            }
          (B0 && ((B0 = !1), Lh(t)), (ct = !1));
          break;
        case 4:
          ((n = Je),
            (Je = Yt),
            (a = ud()),
            (u = Qe),
            (Qe = Nu(t.stateNode.containerInfo)),
            ae(e, t, l),
            ne(t),
            (Qe = u),
            ct && au && (fc = !0),
            (ct = a),
            (Je = n));
          break;
        case 12:
          (ae(e, t, l), ne(t));
          break;
        case 31:
          (ae(e, t, l),
            ne(t),
            n & 4 && ((e = t.updateQueue), e !== null && ((t.updateQueue = null), gi(t, e))));
          break;
        case 13:
          (ae(e, t, l),
            ne(t),
            t.child.flags & 8192 &&
              (t.memoizedState !== null) != (a !== null && a.memoizedState !== null) &&
              (Bc = Ee()),
            n & 4 && ((e = t.updateQueue), e !== null && ((t.updateQueue = null), gi(t, e))));
          break;
        case 22:
          ((u = t.memoizedState !== null), (i = a !== null && a.memoizedState !== null));
          var c = Yt,
            f = rt,
            m = Je;
          ((Yt = c || u),
            (Je = m || u),
            (rt = f || i),
            ae(e, t, l),
            (rt = f),
            (Je = m),
            (Yt = c),
            ne(t),
            n & 8192 &&
              ((e = t.stateNode),
              (e._visibility = u ? e._visibility & -2 : e._visibility | 1),
              !u ||
                a === null ||
                i ||
                Yt ||
                rt ||
                ((e = i || rt),
                (l = Yt),
                (a = rt),
                (Yt = u || Yt),
                (rt = e),
                Ol(t, 2),
                (Yt = l),
                (rt = a)),
              (!u && Je) || Bo(t, u)),
            n & 4 &&
              ((e = t.updateQueue),
              e !== null && ((l = e.retryQueue), l !== null && ((e.retryQueue = null), gi(t, l)))));
          break;
        case 19:
          (ae(e, t, l),
            ne(t),
            n & 4 && ((e = t.updateQueue), e !== null && ((t.updateQueue = null), gi(t, e))));
          break;
        case 30:
          (n & 512 && (rt || a === null || Xt(a, a.return)),
            (n = ud()),
            (u = au),
            (i = (l & 335544064) === l),
            (c = t.memoizedProps),
            (au = i && Cl(c.default, c.update) !== "none"),
            ae(e, t, l),
            ne(t),
            i && a !== null && ct && (t.flags |= 4),
            (au = u),
            (ct = n));
          break;
        case 21:
          break;
        case 7:
          (n & 512 && (rt || a === null || Xt(a, a.return)),
            a && a.stateNode !== null && (a.stateNode._fragmentFiber = t));
        default:
          (ae(e, t, l), ne(t));
      }
    }
    function ne(t) {
      var e = t.flags;
      if (e & 2) {
        try {
          for (var l, a = t.return; a !== null;) {
            if (zh(a)) {
              l = a;
              break;
            }
            a = a.return;
          }
          a = null;
          for (var n = t.return; n !== null;) {
            if (Lf(n)) {
              var u = n.stateNode;
              a === null ? (a = [u]) : a.push(u);
            }
            if (Uf(n)) break;
            n = n.return;
          }
          var i = a;
          if (l == null) throw Error(C(160));
          switch (l.tag) {
            case 27:
              var c = l.stateNode,
                f = D0(t);
              cc(t, f, c, i);
              break;
            case 5:
              var m = l.stateNode;
              l.flags & 32 && (gn(m, ""), (l.flags &= -33));
              var g = D0(t);
              cc(t, g, m, i);
              break;
            case 3:
            case 4:
              var A = l.stateNode.containerInfo,
                v = D0(t);
              xo(t, v, A, i);
              break;
            default:
              throw Error(C(161));
          }
        } catch (p) {
          vt(t, t.return, p);
        }
        t.flags &= -3;
      }
      e & 4096 && (t.flags &= -4097);
    }
    function Lh(t) {
      if (t.subtreeFlags & 1024)
        for (t = t.child; t !== null;) {
          var e = t;
          (Lh(e),
            e.tag === 5 && e.flags & 1024 && ((e = e.stateNode), (Mn = !0), e.reset(), (Mn = !1)),
            (t = t.sibling));
        }
    }
    function Qa(t, e) {
      if (e.subtreeFlags & 9270) for (e = e.child; e !== null;) (qh(e, t), (e = e.sibling));
      else Nh(e, !1);
    }
    function qh(t, e) {
      var l = t.alternate;
      if (l === null) Mo(t, !1);
      else
        switch (t.tag) {
          case 3:
            if (((Do = Ie = !1), Wd(), Qa(e, t), !Ie && !fc)) {
              if (((t = Pe), t !== null))
                for (var a = 0; a < t.length; a += 3) {
                  l = t[a];
                  var n = t[a + 1];
                  (d2(l, t[a + 2]),
                    (l = l.ownerDocument.documentElement),
                    l !== null &&
                      l.animate(
                        { opacity: [0, 0], pointerEvents: ["none", "none"] },
                        {
                          duration: 0,
                          fill: "forwards",
                          pseudoElement: "::view-transition-group(" + n + ")",
                        },
                      ));
                }
              ((t = e.containerInfo),
                (t = t.nodeType === 9 ? t.documentElement : t.ownerDocument.documentElement),
                t !== null &&
                  t.style.viewTransitionName === "" &&
                  ((t.style.viewTransitionName = "none"),
                  t.animate(
                    { opacity: [0, 0], pointerEvents: ["none", "none"] },
                    {
                      duration: 0,
                      fill: "forwards",
                      pseudoElement: "::view-transition-group(root)",
                    },
                  ),
                  t.animate(
                    { width: [0, 0], height: [0, 0] },
                    { duration: 0, fill: "forwards", pseudoElement: "::view-transition" },
                  )),
                (Do = !0));
            }
            Pe = null;
            break;
          case 5:
            Qa(e, t);
            break;
          case 4:
            ((a = Ie), (Ie = !1), Qa(e, t), Ie && (fc = !0), (Ie = a));
            break;
          case 22:
            t.memoizedState === null && (l.memoizedState !== null ? Mo(t, !1) : Qa(e, t));
            break;
          case 30:
            ((a = Ie), (n = Wd()), (Ie = !1), Qa(e, t), Ie && (t.flags |= 4));
            var u = t.memoizedProps,
              i = t.stateNode;
            ((e = bl(u, i)), (i = bl(l.memoizedProps, i)));
            var c = Cl(u.default, u.update);
            (c === "none"
              ? (e = !1)
              : ((u = l.memoizedState),
                (l.memoizedState = null),
                (l = t.child),
                (de = 0),
                (e = qf(t, l, e, i, c, u, !0)),
                de !== (u === null ? 0 : u.length) && (t.flags |= 32)),
              (t.flags & 4) !== 0 && e
                ? (An(t, t.memoizedProps.onUpdate), (Pe = n))
                : n !== null && (n.push.apply(n, Pe), (Pe = n)),
              (Ie = (t.flags & 32) !== 0 ? !0 : a));
            break;
          default:
            Qa(e, t);
        }
    }
    function $e(t, e) {
      if (e.subtreeFlags & 8772)
        for (e = e.child; e !== null;) (_h(t, e.alternate, e), (e = e.sibling));
    }
    function Ol(t, e) {
      for (t = t.child; t !== null;) {
        var l = t,
          a = e;
        switch (l.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            (la(4, l, l.return), Ol(l, a));
            break;
          case 1:
            Xt(l, l.return);
            var n = l.stateNode;
            (typeof n.componentWillUnmount == "function" && Th(l, l.return, n), Ol(l, a));
            break;
          case 27:
            (a & 2) !== 0 && S2(l.stateNode, l.type, l.memoizedProps);
          case 5:
            (Xt(l, l.return), (l.tag !== 5 && l.tag !== 27) || hu(l), Ol(l, a));
            break;
          case 6:
            hu(l);
            break;
          case 26:
            (Xt(l, l.return),
              (n = l.stateNode),
              l.memoizedState !== null || n === null || rt || n.parentNode.removeChild(n),
              Ol(l, a));
            break;
          case 22:
            l.memoizedState === null && Ol(l, a);
            break;
          case 30:
            (Xt(l, l.return), Ol(l, a));
            break;
          case 7:
            Xt(l, l.return);
          default:
            Ol(l, a);
        }
        t = t.sibling;
      }
    }
    function Ve(t, e, l) {
      for (l = (e.subtreeFlags & 8772) !== 0 ? l : l & -2, e = e.child; e !== null;) {
        var a = e.alternate,
          n = t,
          u = e,
          i = u.flags,
          c = (l & 1) !== 0;
        switch (u.tag) {
          case 0:
          case 11:
          case 15:
            (Ve(n, u, l), Gu(4, u));
            break;
          case 1:
            if ((Ve(n, u, l), (a = u), (n = a.stateNode), typeof n.componentDidMount == "function"))
              try {
                n.componentDidMount();
              } catch (g) {
                vt(a, a.return, g);
              }
            if (((a = u), (n = a.updateQueue), n !== null)) {
              var f = a.stateNode;
              try {
                var m = n.shared.hiddenCallbacks;
                if (m !== null)
                  for (n.shared.hiddenCallbacks = null, n = 0; n < m.length; n++) D1(m[n], f);
              } catch (g) {
                vt(a, a.return, g);
              }
            }
            (c && i & 64 && Eh(u), We(u, u.return));
            break;
          case 27:
            (l & 2) !== 0 && Ch(u);
          case 5:
            ((u.tag !== 5 && u.tag !== 27) || Id(u),
              Ve(n, u, l),
              c && a === null && i & 4 && Co(u),
              We(u, u.return));
            break;
          case 6:
            Id(u);
            break;
          case 26:
            ((f = u.stateNode),
              u.memoizedState !== null || f === null || Yt || Io(Nu(f.ownerDocument), u.type, f),
              Ve(n, u, l),
              c && a === null && i & 4 && Co(u),
              We(u, u.return));
            break;
          case 12:
            Ve(n, u, l);
            break;
          case 31:
            (Ve(n, u, l), c && i & 4 && Rh(n, u));
            break;
          case 13:
            (Ve(n, u, l), c && i & 4 && Hh(n, u));
            break;
          case 22:
            (u.memoizedState === null && Ve(n, u, l), We(u, u.return));
            break;
          case 30:
            (Ve(n, u, l), We(u, u.return));
            break;
          case 7:
            We(u, u.return);
          default:
            Ve(n, u, l);
        }
        e = e.sibling;
      }
    }
    function Yf(t, e) {
      var l = null;
      (t !== null &&
        t.memoizedState !== null &&
        t.memoizedState.cachePool !== null &&
        (l = t.memoizedState.cachePool.pool),
        (t = null),
        e.memoizedState !== null &&
          e.memoizedState.cachePool !== null &&
          (t = e.memoizedState.cachePool.pool),
        t !== l && (t != null && t.refCount++, l != null && Yu(l)));
    }
    function jf(t, e) {
      ((t = null),
        e.alternate !== null && (t = e.alternate.memoizedState.cache),
        (e = e.memoizedState.cache),
        e !== t && (e.refCount++, t != null && Yu(t)));
    }
    function _e(t, e, l, a) {
      var n = (l & 335544064) === l;
      if (e.subtreeFlags & (n ? 10262 : 10256))
        for (e = e.child; e !== null;) (Yh(t, e, l, a), (e = e.sibling));
      else n && wh(e);
    }
    function Yh(t, e, l, a) {
      var n = (l & 335544064) === l;
      n && e.alternate === null && e.return !== null && e.return.alternate !== null && Hi(e);
      var u = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          (_e(t, e, l, a), u & 2048 && Gu(9, e));
          break;
        case 1:
          _e(t, e, l, a);
          break;
        case 3:
          (_e(t, e, l, a),
            n &&
              Do &&
              ((t = t.containerInfo),
              (t = t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t),
              t.style.viewTransitionName === "root" && (t.style.viewTransitionName = ""),
              (t = t.ownerDocument.documentElement),
              t !== null &&
                t.style.viewTransitionName === "none" &&
                (t.style.viewTransitionName = "")),
            u & 2048 &&
              ((u = null),
              e.alternate !== null && (u = e.alternate.memoizedState.cache),
              (e = e.memoizedState.cache),
              e !== u && (e.refCount++, u != null && Yu(u))));
          break;
        case 12:
          if (u & 2048) {
            (_e(t, e, l, a), (u = e.stateNode));
            try {
              var i = e.memoizedProps,
                c = i.id,
                f = i.onPostCommit;
              typeof f == "function" &&
                f(c, e.alternate === null ? "mount" : "update", u.passiveEffectDuration, -0);
            } catch (m) {
              vt(e, e.return, m);
            }
          } else _e(t, e, l, a);
          break;
        case 31:
          _e(t, e, l, a);
          break;
        case 13:
          _e(t, e, l, a);
          break;
        case 23:
          break;
        case 22:
          ((i = e.stateNode),
            (c = e.alternate),
            e.memoizedState !== null
              ? (n && c !== null && c.memoizedState === null && Hi(c),
                i._visibility & 2 ? _e(t, e, l, a) : mu(t, e))
              : (n && c !== null && c.memoizedState !== null && Hi(e),
                i._visibility & 2
                  ? _e(t, e, l, a)
                  : ((i._visibility |= 2), Za(t, e, l, a, (e.subtreeFlags & 10256) !== 0 || !1))),
            u & 2048 && Yf(c, e));
          break;
        case 24:
          (_e(t, e, l, a), u & 2048 && jf(e.alternate, e));
          break;
        case 30:
          (n && ((u = e.alternate), u !== null && (il(u.child, !0), il(e.child, !0))),
            _e(t, e, l, a));
          break;
        default:
          _e(t, e, l, a);
      }
    }
    function Za(t, e, l, a, n) {
      for (n = n && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child; e !== null;) {
        var u = t,
          i = e,
          c = l,
          f = a,
          m = i.flags;
        switch (i.tag) {
          case 0:
          case 11:
          case 15:
            (Za(u, i, c, f, n), Gu(8, i));
            break;
          case 23:
            break;
          case 22:
            var g = i.stateNode;
            (i.memoizedState !== null
              ? g._visibility & 2
                ? Za(u, i, c, f, n)
                : mu(u, i)
              : ((g._visibility |= 2), Za(u, i, c, f, n)),
              n && m & 2048 && Yf(i.alternate, i));
            break;
          case 24:
            (Za(u, i, c, f, n), n && m & 2048 && jf(i.alternate, i));
            break;
          default:
            Za(u, i, c, f, n);
        }
        e = e.sibling;
      }
    }
    function mu(t, e) {
      if (e.subtreeFlags & 10256)
        for (e = e.child; e !== null;) {
          var l = t,
            a = e,
            n = a.flags;
          switch (a.tag) {
            case 22:
              (mu(l, a), n & 2048 && Yf(a.alternate, a));
              break;
            case 24:
              (mu(l, a), n & 2048 && jf(a.alternate, a));
              break;
            default:
              mu(l, a);
          }
          e = e.sibling;
        }
    }
    var va = 8192;
    function ra(t, e, l) {
      if (t.subtreeFlags & va) for (t = t.child; t !== null;) (jh(t, e, l), (t = t.sibling));
    }
    function jh(t, e, l) {
      switch (t.tag) {
        case 26:
          (ra(t, e, l),
            t.flags & va &&
              (t.memoizedState !== null
                ? $p(l, Qe, t.memoizedState, t.memoizedProps)
                : ((t = t.stateNode), (e & 335544128) === e && Cr(l, t))));
          break;
        case 5:
          (ra(t, e, l), t.flags & va && ((t = t.stateNode), (e & 335544128) === e && Cr(l, t)));
          break;
        case 3:
        case 4:
          var a = Qe;
          ((Qe = Nu(t.stateNode.containerInfo)), ra(t, e, l), (Qe = a));
          break;
        case 22:
          t.memoizedState === null &&
            ((a = t.alternate),
            a !== null && a.memoizedState !== null
              ? ((a = va), (va = 16777216), ra(t, e, l), (va = a))
              : ra(t, e, l));
          break;
        case 30:
          if ((t.flags & va) !== 0 && ((a = t.memoizedProps.name), a != null && a !== "auto")) {
            var n = t.stateNode;
            ((n.paired = null), Se === null && (Se = new Map()), Se.set(a, n));
          }
          ra(t, e, l);
          break;
        default:
          ra(t, e, l);
      }
    }
    function Gh(t) {
      var e = t.alternate;
      if (e !== null && ((t = e.child), t !== null)) {
        e.child = null;
        do ((e = t.sibling), (t.sibling = null), (t = e));
        while (t !== null);
      }
    }
    function In(t) {
      var e = t.deletions;
      if ((t.flags & 16) !== 0) {
        if (e !== null)
          for (var l = 0; l < e.length; l++) {
            var a = e[l];
            ((jt = a), Qh(a, t));
          }
        Gh(t);
      }
      if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) (Vh(t), (t = t.sibling));
    }
    function Vh(t) {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          (In(t), t.flags & 2048 && la(9, t, t.return));
          break;
        case 3:
          In(t);
          break;
        case 12:
          In(t);
          break;
        case 22:
          var e = t.stateNode;
          t.memoizedState !== null &&
          e._visibility & 2 &&
          (t.return === null || t.return.tag !== 13)
            ? ((e._visibility &= -3), Ui(t))
            : In(t);
          break;
        default:
          In(t);
      }
    }
    function Ui(t) {
      var e = t.deletions;
      if ((t.flags & 16) !== 0) {
        if (e !== null)
          for (var l = 0; l < e.length; l++) {
            var a = e[l];
            ((jt = a), Qh(a, t));
          }
        Gh(t);
      }
      for (t = t.child; t !== null;) {
        switch (((e = t), e.tag)) {
          case 0:
          case 11:
          case 15:
            (la(8, e, e.return), Ui(e));
            break;
          case 22:
            ((l = e.stateNode), l._visibility & 2 && ((l._visibility &= -3), Ui(e)));
            break;
          default:
            Ui(e);
        }
        t = t.sibling;
      }
    }
    function Qh(t, e) {
      for (; jt !== null;) {
        var l = jt;
        switch (l.tag) {
          case 0:
          case 11:
          case 15:
            la(8, l, e);
            break;
          case 23:
          case 22:
            if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
              var a = l.memoizedState.cachePool.pool;
              a != null && a.refCount++;
            }
            break;
          case 24:
            Yu(l.memoizedState.cache);
        }
        if (((a = l.child), a !== null)) ((a.return = l), (jt = a));
        else
          t: for (l = t; jt !== null;) {
            a = jt;
            var n = a.sibling,
              u = a.return;
            if ((Bh(a), a === l)) {
              jt = null;
              break t;
            }
            if (n !== null) {
              ((n.return = u), (jt = n));
              break t;
            }
            jt = u;
          }
      }
    }
    var Fy = {
        getCacheForType: function (t) {
          var e = kt(Rt),
            l = e.data.get(t);
          return (l === void 0 && ((l = t()), e.data.set(t, l)), l);
        },
        cacheSignal: function () {
          return kt(Rt).controller.signal;
        },
      },
      Jy = typeof WeakMap == "function" ? WeakMap : Map,
      ft = 0,
      gt = null,
      ut = null,
      it = 0,
      ht = 0,
      pe = null,
      jl = !1,
      On = !1,
      Gf = !1,
      Tl = 0,
      _t = 0,
      aa = 0,
      Ea = 0,
      sc = 0,
      Ae = 0,
      Sn = 0,
      vu = null,
      se = null,
      Ro = !1,
      Bc = 0,
      Xh = 0,
      dc = 1 / 0,
      rc = null,
      Jl = null,
      Mt = 0,
      Ze = null,
      _a = null,
      ul = 0,
      Ho = 0,
      Uo = null,
      Zh = null,
      hn = null,
      mn = null,
      vn = null,
      yu = 0,
      Li = null;
    function Ce() {
      return (ft & 2) !== 0 && it !== 0 ? it & -it : J.T !== null ? Qf() : Jr();
    }
    function kh() {
      if (Ae === 0)
        if ((it & 536870912) === 0 || et) {
          var t = ui;
          ((ui <<= 1), (ui & 3932160) === 0 && (ui = 262144), (Ae = t));
        } else Ae = 536870912;
      return ((t = It.current), t !== null && (t.flags |= 32), Ae);
    }
    function An(t, e) {
      if (e != null) {
        var l = t.stateNode,
          a = l.ref;
        (a === null && (a = l.ref = h2(bl(t.memoizedProps, l))),
          mn === null && (mn = []),
          mn.push(e.bind(null, a)));
      }
    }
    function he(t, e, l) {
      (((t === gt && (ht === 2 || ht === 9)) || t.cancelPendingCommit !== null) &&
        (En(t, 0), Gl(t, it, Ae, !1)),
        Uu(t, l),
        ((ft & 2) === 0 || t !== gt) &&
          (t === gt && ((ft & 2) === 0 && (Ea |= l), _t === 4 && Gl(t, it, Ae, !1)), ol(t)));
    }
    function Kh(t, e, l) {
      if ((ft & 6) !== 0) throw Error(C(327));
      var a = (!l && (e & 127) === 0 && (e & t.expiredLanes) === 0) || Hu(t, e),
        n = a ? Wy(t, e) : O0(t, e, !0),
        u = a;
      do {
        if (n === 0) {
          On && !a && Gl(t, e, 0, !1);
          break;
        } else {
          if (((l = t.current.alternate), u && !Iy(l))) {
            ((n = O0(t, e, !1)), (u = !1));
            continue;
          }
          if (n === 2) {
            if (((u = e), t.errorRecoveryDisabledLanes & u)) var i = 0;
            else
              ((i = t.pendingLanes & -536870913),
                (i = i !== 0 ? i : i & 536870912 ? 536870912 : 0));
            if (i !== 0) {
              e = i;
              t: {
                var c = t;
                n = vu;
                var f = c.current.memoizedState.isDehydrated;
                if ((f && (En(c, i).flags |= 256), (i = O0(c, i, !1)), i !== 2 && i !== 6)) {
                  if (Gf && !f) {
                    ((c.errorRecoveryDisabledLanes |= u), (Ea |= u), (n = 4));
                    break t;
                  }
                  ((u = se),
                    (se = n),
                    u !== null && (se === null ? (se = u) : se.push.apply(se, u)));
                }
                n = i;
              }
              if (((u = !1), n !== 2)) continue;
            }
          }
          if (n === 1) {
            (En(t, 0), Gl(t, e, 0, !0));
            break;
          }
          t: {
            switch (((a = t), (u = n), u)) {
              case 0:
              case 1:
                throw Error(C(345));
              case 4:
                if ((e & 4194048) !== e && (e & 62914560) !== e) break;
              case 6:
                Gl(a, e, Ae, !jl);
                break t;
              case 2:
                se = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(C(329));
            }
            if ((e & 62914560) === e && ((n = Bc + 300 - Ee()), 10 < n)) {
              if ((Gl(a, e, Ae, !jl), gc(a, 0, !0) !== 0)) break t;
              ((ul = e),
                (a.timeoutHandle = Zf(
                  tr.bind(null, a, l, se, rc, Ro, e, Ae, Ea, Sn, jl, u, "Throttled", -0, 0),
                  n,
                )));
              break t;
            }
            tr(a, l, se, rc, Ro, e, Ae, Ea, Sn, jl, u, null, -0, 0);
          }
        }
        break;
      } while (!0);
      ol(t);
    }
    function tr(t, e, l, a, n, u, i, c, f, m, g, A, v, p) {
      t.timeoutHandle = -1;
      var x = e.subtreeFlags,
        R = (u & 335544064) === u;
      if (
        ((A = null),
        (R || x & 8192 || (x & 16785408) === 16785408) &&
          ((A = {
            stylesheets: null,
            count: 0,
            imgCount: 0,
            imgBytes: 0,
            suspenseyImages: [],
            waitingForImages: !0,
            waitingForViewTransition: !1,
            unsuspend: el,
          }),
          (Se = null),
          jh(e, u, A),
          R &&
            ((x = A),
            (R = t.containerInfo),
            (R = (R.nodeType === 9 ? R : R.ownerDocument).__reactViewTransition),
            R != null &&
              (x.count++,
              (x.waitingForViewTransition = !0),
              (x = _u.bind(x)),
              R.finished.then(x, x))),
          (x = (u & 62914560) === u ? Bc - Ee() : (u & 4194048) === u ? Xh - Ee() : 0),
          (x = Wp(A, x)),
          x !== null))
      ) {
        ((ul = u),
          (t.cancelPendingCommit = x(
            lr.bind(null, t, e, u, l, a, n, i, c, f, m, g, A, null, v, p),
          )),
          Gl(t, u, i, !m));
        return;
      }
      lr(t, e, u, l, a, n, i, c, f, m, g, A);
    }
    function Iy(t) {
      for (var e = t; ;) {
        var l = e.tag;
        if (
          (l === 0 || l === 11 || l === 15) &&
          e.flags & 16384 &&
          ((l = e.updateQueue), l !== null && ((l = l.stores), l !== null))
        )
          for (var a = 0; a < l.length; a++) {
            var n = l[a],
              u = n.getSnapshot;
            n = n.value;
            try {
              if (!xe(u(), n)) return !1;
            } catch {
              return !1;
            }
          }
        if (((l = e.child), e.subtreeFlags & 16384 && l !== null)) ((l.return = e), (e = l));
        else {
          if (e === t) break;
          for (; e.sibling === null;) {
            if (e.return === null || e.return === t) return !0;
            e = e.return;
          }
          ((e.sibling.return = e.return), (e = e.sibling));
        }
      }
      return !0;
    }
    function Gl(t, e, l, a) {
      ((e = Xr(t, e)),
        (e &= ~sc),
        (e &= ~Ea),
        (t.suspendedLanes |= e),
        (t.pingedLanes &= ~e),
        a && (t.warmLanes |= e),
        (a = t.expirationTimes));
      for (var n = e; 0 < n;) {
        var u = 31 - ze(n),
          i = 1 << u;
        ((a[u] = -1), (n &= ~i));
      }
      l !== 0 && kr(t, l, e);
    }
    function Oc() {
      return (ft & 6) === 0 ? (Vu(0, !1), !1) : !0;
    }
    function Vf() {
      if (ut !== null) {
        if (ht === 0) var t = ut.return;
        else ((t = ut), (vl = Ha = null), Cf(t), (sn = null), (Tu = 0), (t = ut));
        for (; t !== null;) (Ah(t.alternate, t), (t = t.return));
        ut = null;
      }
    }
    function En(t, e) {
      var l = t.timeoutHandle;
      return (
        l !== -1 && ((t.timeoutHandle = -1), gp(l)),
        (l = t.cancelPendingCommit),
        l !== null && ((t.cancelPendingCommit = null), l()),
        (ul = 0),
        Vf(),
        (gt = t),
        (ut = l = yl(t.current, null)),
        (it = e),
        (ht = 0),
        (pe = null),
        (jl = !1),
        (On = Hu(t, e)),
        (Gf = !1),
        (Sn = Ae = sc = Ea = aa = _t = 0),
        (se = vu = null),
        (Ro = !1),
        (Tl = Xr(t, e)),
        Tc(),
        l
      );
    }
    function Fh(t, e) {
      ((W = null),
        (J.H = nc),
        e === Dn || e === xc
          ? ((e = Md()), (ht = 3))
          : e === pf
            ? ((e = Md()), (ht = 4))
            : (ht =
                e === Of
                  ? 8
                  : e !== null && typeof e == "object" && typeof e.then == "function"
                    ? 6
                    : 1),
        (pe = e),
        ut === null && ((_t = 1), uc(t, He(e, t.current))));
    }
    function Jh() {
      var t = It.current;
      return t === null
        ? !0
        : (it & 4194048) === it
          ? Pt === null
          : (it & 62914560) === it || (it & 536870912) !== 0
            ? t === Pt
            : !1;
    }
    function Ih() {
      var t = J.H;
      return ((J.H = nc), t === null ? nc : t);
    }
    function $h() {
      var t = J.A;
      return ((J.A = Fy), t);
    }
    function hc() {
      ((_t = 4),
        jl || ((it & 4194048) !== it && It.current !== null) || (On = !0),
        ((aa & 134217727) === 0 && (Ea & 134217727) === 0) || gt === null || Gl(gt, it, Ae, !1));
    }
    function O0(t, e, l) {
      var a = ft;
      ft |= 2;
      var n = Ih(),
        u = $h();
      ((gt !== t || it !== e) && ((rc = null), En(t, e)), (e = !1));
      var i = _t;
      t: do
        try {
          if (ht !== 0 && ut !== null) {
            var c = ut,
              f = pe;
            switch (ht) {
              case 8:
                (Vf(), (i = 6));
                break t;
              case 3:
              case 2:
              case 9:
              case 6:
                It.current === null && (e = !0);
                var m = ht;
                if (((ht = 0), (pe = null), nn(t, c, f, m), l && On)) {
                  i = 0;
                  break t;
                }
                break;
              default:
                ((m = ht), (ht = 0), (pe = null), nn(t, c, f, m));
            }
          }
          ($y(), (i = _t));
          break;
        } catch (g) {
          Fh(t, g);
        }
      while (!0);
      return (
        e && t.shellSuspendCounter++,
        (vl = Ha = null),
        (ft = a),
        (J.H = n),
        (J.A = u),
        ut === null && ((gt = null), (it = 0), Tc()),
        i
      );
    }
    function $y() {
      for (; ut !== null;) Wh(ut);
    }
    function Wy(t, e) {
      var l = ft;
      ft |= 2;
      var a = Ih(),
        n = $h();
      gt !== t || it !== e ? ((rc = null), (dc = Ee() + 500), En(t, e)) : (On = Hu(t, e));
      t: do
        try {
          if (ht !== 0 && ut !== null) {
            e = ut;
            var u = pe;
            e: switch (ht) {
              case 1:
                ((ht = 0), (pe = null), nn(t, e, u, 1));
                break;
              case 2:
              case 9:
                if (xd(u)) {
                  ((ht = 0), (pe = null), er(e));
                  break;
                }
                ((e = function () {
                  ((ht !== 2 && ht !== 9) || gt !== t || (ht = 7), ol(t));
                }),
                  u.then(e, e));
                break t;
              case 3:
                ht = 7;
                break t;
              case 4:
                ht = 5;
                break t;
              case 7:
                xd(u) ? ((ht = 0), (pe = null), er(e)) : ((ht = 0), (pe = null), nn(t, e, u, 7));
                break;
              case 5:
                var i = null;
                switch (ut.tag) {
                  case 26:
                    i = ut.memoizedState;
                  case 5:
                  case 27:
                    var c = ut;
                    if (i ? T2(i) : c.stateNode.complete) {
                      ((ht = 0), (pe = null));
                      var f = c.sibling;
                      if (f !== null) ut = f;
                      else {
                        var m = c.return;
                        m !== null ? ((ut = m), Rc(m)) : (ut = null);
                      }
                      break e;
                    }
                }
                ((ht = 0), (pe = null), nn(t, e, u, 5));
                break;
              case 6:
                ((ht = 0), (pe = null), nn(t, e, u, 6));
                break;
              case 8:
                (Vf(), (_t = 6));
                break t;
              default:
                throw Error(C(462));
            }
          }
          Py();
          break;
        } catch (g) {
          Fh(t, g);
        }
      while (!0);
      return (
        (vl = Ha = null),
        (J.H = a),
        (J.A = n),
        (ft = l),
        ut !== null ? 0 : ((gt = null), (it = 0), Tc(), _t)
      );
    }
    function Py() {
      for (; ut !== null && !yv();) Wh(ut);
    }
    function Wh(t) {
      var e = Sh(t.alternate, t, Tl);
      ((t.memoizedProps = t.pendingProps), e === null ? Rc(t) : (ut = e));
    }
    function er(t) {
      var e = t,
        l = e.alternate;
      switch (e.tag) {
        case 15:
        case 0:
          e = Qd(l, e, e.pendingProps, e.type, void 0, it);
          break;
        case 11:
          e = Qd(l, e, e.pendingProps, e.type.render, e.ref, it);
          break;
        case 5:
          Cf(e);
          var a = e;
          a === Vt &&
            (et
              ? ($i(a), a.tag === 5 && a.stateNode != null && (Et = a.stateNode))
              : ($i(a), (et = !0)));
        default:
          (Ah(l, e), (e = ut = E1(e, Tl)), (e = Sh(l, e, Tl)));
      }
      ((t.memoizedProps = t.pendingProps), e === null ? Rc(t) : (ut = e));
    }
    function nn(t, e, l, a) {
      ((vl = Ha = null), Cf(e), (sn = null), (Tu = 0));
      var n = e.return;
      try {
        if (jy(t, n, e, l, it)) {
          ((_t = 1), uc(t, He(l, t.current)), (ut = null));
          return;
        }
      } catch (u) {
        if (n !== null) throw ((ut = n), u);
        ((_t = 1), uc(t, He(l, t.current)), (ut = null));
        return;
      }
      e.flags & 32768
        ? (et || a === 1
            ? (t = !0)
            : On || (it & 536870912) !== 0
              ? (t = !1)
              : ((jl = t = !0),
                (a === 2 || a === 9 || a === 3 || a === 6) &&
                  ((a = It.current), a !== null && a.tag === 13 && (a.flags |= 16384))),
          Ph(e, t))
        : Rc(e);
    }
    function Rc(t) {
      var e = t;
      do {
        if ((e.flags & 32768) !== 0) {
          Ph(e, jl);
          return;
        }
        t = e.return;
        var l = Xy(e.alternate, e, Tl);
        if (l !== null) {
          ut = l;
          return;
        }
        if (((e = e.sibling), e !== null)) {
          ut = e;
          return;
        }
        ut = e = t;
      } while (e !== null);
      _t === 0 && (_t = 5);
    }
    function Ph(t, e) {
      do {
        var l = Zy(t.alternate, t);
        if (l !== null) {
          ((l.flags &= 32767), (ut = l));
          return;
        }
        if (
          ((l = t.return),
          l !== null && ((l.flags |= 32768), (l.subtreeFlags = 0), (l.deletions = null)),
          !e && ((t = t.sibling), t !== null))
        ) {
          ut = t;
          return;
        }
        ut = t = l;
      } while (t !== null);
      ((_t = 6), (ut = null));
    }
    function lr(t, e, l, a, n, u, i, c, f, m, g, A) {
      t.cancelPendingCommit = null;
      do Hc();
      while (Mt !== 0);
      if ((ft & 6) !== 0) throw Error(C(327));
      if (e !== null) {
        if (e === t.current) throw Error(C(177));
        (t === gt && ((ut = gt = null), (it = 0)),
          (_a = e),
          (Ze = t),
          (ul = l),
          (Uo = n),
          (Zh = a),
          tp(t, e, l, i, c, f, A));
      }
    }
    function tp(t, e, l, a, n, u, i) {
      var c = e.lanes | e.childLanes;
      if (
        ((Ho = c),
        (c |= df),
        xv(t, l, c, a, n, u),
        (mn = null),
        (l & 335544064) === l ? ((vn = wy(t)), (a = 10262)) : ((vn = null), (a = 10256)),
        (e.subtreeFlags & a) !== 0 || (e.flags & a) !== 0
          ? ((t.callbackNode = null),
            (t.callbackPriority = 0),
            ip(ki, function () {
              return (jo(), null);
            }))
          : ((t.callbackNode = null), (t.callbackPriority = 0)),
        (oc = !1),
        (a = (e.flags & 13878) !== 0),
        (e.subtreeFlags & 13878) !== 0 || a)
      ) {
        ((a = J.T), (J.T = null), (n = st.p), (st.p = 2), (u = ft), (ft |= 4));
        try {
          ky(t, e, l);
        } finally {
          ((ft = u), (st.p = n), (J.T = a));
        }
      }
      ((Mt = 1),
        oc
          ? (hn = zp(i, t.containerInfo, vn, Lo, qo, lp, Yo, jo, ep, null, null))
          : (Lo(), qo(), Yo()));
    }
    function ep(t) {
      if (Mt !== 0) {
        var e = Ze.onRecoverableError;
        e(t, { componentStack: null });
      }
    }
    function lp() {
      Mt === 3 && ((Mt = 0), qh(_a, Ze), (Mt = 4));
    }
    function Lo() {
      if (Mt === 1) {
        Mt = 0;
        var t = Ze,
          e = _a,
          l = ul,
          a = (e.flags & 13878) !== 0;
        if ((e.subtreeFlags & 13878) !== 0 || a) {
          ((a = J.T), (J.T = null));
          var n = st.p;
          st.p = 2;
          var u = ft;
          ft |= 4;
          try {
            ((au = fc = !1), Uh(e, t, l), (l = Xo));
            var i = m1(t.containerInfo),
              c = l.focusedElem,
              f = l.selectionRange;
            if (i !== c && c && c.ownerDocument && h1(c.ownerDocument.documentElement, c)) {
              if (f !== null && sf(c)) {
                var m = f.start,
                  g = f.end;
                if ((g === void 0 && (g = m), "selectionStart" in c))
                  ((c.selectionStart = m), (c.selectionEnd = Math.min(g, c.value.length)));
                else {
                  var A = c.ownerDocument || document,
                    v = (A && A.defaultView) || window;
                  if (v.getSelection) {
                    var p = v.getSelection(),
                      x = c.textContent.length,
                      R = Math.min(f.start, x),
                      j = f.end === void 0 ? R : Math.min(f.end, x);
                    !p.extend && R > j && ((i = j), (j = R), (R = i));
                    var r = gd(c, R),
                      h = gd(c, j);
                    if (
                      r &&
                      h &&
                      (p.rangeCount !== 1 ||
                        p.anchorNode !== r.node ||
                        p.anchorOffset !== r.offset ||
                        p.focusNode !== h.node ||
                        p.focusOffset !== h.offset)
                    ) {
                      var y = A.createRange();
                      (y.setStart(r.node, r.offset),
                        p.removeAllRanges(),
                        R > j
                          ? (p.addRange(y), p.extend(h.node, h.offset))
                          : (y.setEnd(h.node, h.offset), p.addRange(y)));
                    }
                  }
                }
              }
              for (A = [], p = c; (p = p.parentNode);)
                p.nodeType === 1 && A.push({ element: p, left: p.scrollLeft, top: p.scrollTop });
              for (typeof c.focus == "function" && c.focus(), c = 0; c < A.length; c++) {
                var S = A[c];
                ((S.element.scrollLeft = S.left), (S.element.scrollTop = S.top));
              }
            }
            ((Mn = !!Qo), (Xo = Qo = null));
          } finally {
            ((ft = u), (st.p = n), (J.T = a));
          }
        }
        ((t.current = e), (Mt = 2));
      }
    }
    function qo() {
      if (Mt === 2) {
        Mt = 0;
        var t = Ze,
          e = _a,
          l = (e.flags & 8772) !== 0;
        if ((e.subtreeFlags & 8772) !== 0 || l) {
          ((l = J.T), (J.T = null));
          var a = st.p;
          st.p = 2;
          var n = ft;
          ft |= 4;
          try {
            _h(t, e.alternate, e);
          } finally {
            ((ft = n), (st.p = a), (J.T = l));
          }
        }
        Mt = 3;
      }
    }
    function Yo() {
      if (Mt === 4 || Mt === 3) {
        Mt = 0;
        var t = hn;
        ((hn = null), pv());
        var e = Ze,
          l = _a,
          a = ul,
          n = Zh,
          u = (a & 335544064) === a ? 10262 : 10256;
        if (
          ((l.subtreeFlags & u) !== 0 || (l.flags & u) !== 0
            ? (Mt = 5)
            : ((Mt = 0), (_a = Ze = null), t2(e, e.pendingLanes)),
          (u = e.pendingLanes),
          u === 0 && (Jl = null),
          af(a),
          (l = l.stateNode),
          Te && typeof Te.onCommitFiberRoot == "function")
        )
          try {
            Te.onCommitFiberRoot(Ru, l, void 0, (l.current.flags & 128) === 128);
          } catch {}
        if (n !== null) {
          ((l = J.T), (u = st.p), (st.p = 2), (J.T = null));
          try {
            for (var i = e.onRecoverableError, c = 0; c < n.length; c++) {
              var f = n[c];
              i(f.value, { componentStack: f.stack });
            }
          } finally {
            ((J.T = l), (st.p = u));
          }
        }
        if (
          ((n = mn),
          (i = vn),
          (vn = null),
          n !== null && ((mn = null), i === null && (i = []), t !== null))
        )
          for (f = 0; f < n.length; f++)
            ((l = (0, n[f])(i)), l !== void 0 && t.finished.finally(l));
        ((ul & 3) !== 0 && Hc(),
          ol(e),
          (u = e.pendingLanes),
          (a & 261930) !== 0 && (u & 42) !== 0
            ? e === Li
              ? yu++
              : ((yu = 0), (Li = e))
            : ((yu = 0), (Li = null)),
          Vu(0, !1));
      }
    }
    function t2(t, e) {
      (t.pooledCacheLanes &= e) === 0 &&
        ((e = t.pooledCache), e != null && ((t.pooledCache = null), Yu(e)));
    }
    function Hc() {
      return (hn !== null && (hn.skipTransition(), (hn = null)), Lo(), qo(), Yo(), jo());
    }
    function jo() {
      if (Mt !== 5) return !1;
      var t = Ze,
        e = Ho;
      Ho = 0;
      var l = af(ul),
        a = J.T,
        n = st.p;
      try {
        ((st.p = 32 > l ? 32 : l), (J.T = null), (l = Uo), (Uo = null));
        var u = Ze,
          i = ul;
        if (((Mt = 0), (_a = Ze = null), (ul = 0), (ft & 6) !== 0)) throw Error(C(331));
        var c = ft;
        if (
          ((ft |= 4),
          Vh(u.current),
          Yh(u, u.current, i, l),
          (ft = c),
          Vu(0, !1),
          Te && typeof Te.onPostCommitFiberRoot == "function")
        )
          try {
            Te.onPostCommitFiberRoot(Ru, u);
          } catch {}
        return !0;
      } finally {
        ((st.p = n), (J.T = a), t2(t, e));
      }
    }
    function ar(t, e, l) {
      ((e = He(l, e)),
        (e = bo(t.stateNode, e, 2)),
        (t = kl(t, e, 2)),
        t !== null && (Uu(t, 2), ol(t)));
    }
    function vt(t, e, l) {
      if (t.tag === 3) ar(t, t, l);
      else
        for (; e !== null;) {
          if (e.tag === 3) {
            ar(e, t, l);
            break;
          } else if (e.tag === 1) {
            var a = e.stateNode;
            if (
              typeof e.type.getDerivedStateFromError == "function" ||
              (typeof a.componentDidCatch == "function" && (Jl === null || !Jl.has(a)))
            ) {
              ((t = He(l, t)),
                (l = vh(2)),
                (a = kl(e, l, 2)),
                a !== null && (yh(l, a, e, t), Uu(a, 2), ol(a)));
              break;
            }
          }
          e = e.return;
        }
    }
    function R0(t, e, l) {
      var a = t.pingCache;
      if (a === null) {
        a = t.pingCache = new Jy();
        var n = new Set();
        a.set(e, n);
      } else ((n = a.get(e)), n === void 0 && ((n = new Set()), a.set(e, n)));
      n.has(l) || ((Gf = !0), n.add(l), (t = ap.bind(null, t, e, l)), e.then(t, t));
    }
    function ap(t, e, l) {
      var a = t.pingCache;
      (a !== null && a.delete(e),
        (t.pingedLanes |= t.suspendedLanes & l),
        (t.warmLanes &= ~l),
        gt === t &&
          (it & l) === l &&
          ((_t === 4 || (_t === 3 && (it & 62914560) === it && 300 > Ee() - Bc)) && (ft & 2) === 0
            ? En(t, 0)
            : (sc |= l),
          Sn === it && (Sn = 0)),
        ol(t));
    }
    function e2(t, e) {
      (e === 0 && (e = Zr()), (t = Ra(t, e)), t !== null && (Uu(t, e), ol(t)));
    }
    function np(t) {
      var e = t.memoizedState,
        l = 0;
      (e !== null && (l = e.retryLane), e2(t, l));
    }
    function up(t, e) {
      var l = 0;
      switch (t.tag) {
        case 31:
        case 13:
          var a = t.stateNode,
            n = t.memoizedState;
          n !== null && (l = n.retryLane);
          break;
        case 19:
          a = t.stateNode;
          break;
        case 22:
          a = t.stateNode._retryCache;
          break;
        default:
          throw Error(C(314));
      }
      (a !== null && a.delete(e), e2(t, l));
    }
    function ip(t, e) {
      return ef(t, e);
    }
    var Tn = null,
      ka = null,
      Go = !1,
      mc = !1,
      H0 = !1,
      Vl = 0;
    function ol(t) {
      (t !== ka && t.next === null && (ka === null ? (Tn = ka = t) : (ka = ka.next = t)),
        (mc = !0),
        Go || ((Go = !0), op()));
    }
    function Vu(t, e) {
      if (!H0 && mc) {
        H0 = !0;
        do
          for (var l = !1, a = Tn; a !== null;) {
            if (!e)
              if (t !== 0) {
                var n = a.pendingLanes;
                if (n === 0) var u = 0;
                else {
                  var i = a.suspendedLanes,
                    c = a.pingedLanes;
                  ((u = (1 << (31 - ze(42 | t) + 1)) - 1),
                    (u &= n & ~(i & ~c)),
                    (u = u & 201326741 ? (u & 201326741) | 1 : u ? u | 2 : 0));
                }
                u !== 0 && ((l = !0), nr(a, u));
              } else
                ((u = it),
                  (u = gc(
                    a,
                    a === gt ? u : 0,
                    a.cancelPendingCommit !== null || a.timeoutHandle !== -1,
                  )),
                  (u & 3) === 0 || Hu(a, u) || ((l = !0), nr(a, u)));
            a = a.next;
          }
        while (l);
        H0 = !1;
      }
    }
    function cp() {
      l2();
    }
    function l2() {
      mc = Go = !1;
      var t = 0;
      Vl !== 0 && pp() && (t = Vl);
      for (var e = Ee(), l = null, a = Tn; a !== null;) {
        var n = a.next,
          u = a2(a, e);
        (u === 0
          ? ((a.next = null), l === null ? (Tn = n) : (l.next = n), n === null && (ka = l))
          : ((l = a), (t !== 0 || (u & 3) !== 0) && (mc = !0)),
          (a = n));
      }
      ((Mt !== 0 && Mt !== 5) || Vu(t, !1), Vl !== 0 && (Vl = 0));
    }
    function a2(t, e) {
      for (
        var l = t.suspendedLanes,
          a = t.pingedLanes,
          n = t.expirationTimes,
          u = t.pendingLanes & -62914561;
        0 < u;
      ) {
        var i = 31 - ze(u),
          c = 1 << i,
          f = n[i];
        (f === -1
          ? ((c & l) === 0 || (c & a) !== 0) && (n[i] = Cv(c, e))
          : f <= e && (t.expiredLanes |= c),
          (u &= ~c));
      }
      if (
        ((e = gt),
        (l = it),
        (l = gc(t, t === e ? l : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1)),
        (a = t.callbackNode),
        l === 0 || (t === e && (ht === 2 || ht === 9)) || t.cancelPendingCommit !== null)
      )
        return (
          a !== null && a !== null && h0(a),
          (t.callbackNode = null),
          (t.callbackPriority = 0)
        );
      if ((l & 3) === 0 || Hu(t, l)) {
        if (((e = l & -l), e === t.callbackPriority)) return e;
        switch ((a !== null && h0(a), af(l))) {
          case 2:
          case 8:
            l = Vr;
            break;
          case 32:
            l = ki;
            break;
          case 268435456:
            l = Qr;
            break;
          default:
            l = ki;
        }
        return (
          (a = n2.bind(null, t)),
          (l = ef(l, a)),
          (t.callbackPriority = e),
          (t.callbackNode = l),
          e
        );
      }
      return (
        a !== null && a !== null && h0(a),
        (t.callbackPriority = 2),
        (t.callbackNode = null),
        2
      );
    }
    function n2(t, e) {
      if (Mt !== 0 && Mt !== 5) return ((t.callbackNode = null), (t.callbackPriority = 0), null);
      var l = t.callbackNode;
      if (Hc() && t.callbackNode !== l) return null;
      var a = it;
      return (
        (a = gc(t, t === gt ? a : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1)),
        a === 0
          ? null
          : (Kh(t, a, e),
            a2(t, Ee()),
            t.callbackNode != null && t.callbackNode === l ? n2.bind(null, t) : null)
      );
    }
    function nr(t, e) {
      if (Hc()) return null;
      Kh(t, e, !0);
    }
    function op() {
      bp(function () {
        (ft & 6) !== 0 ? ef(Gr, cp) : l2();
      });
    }
    function Qf() {
      if (Vl === 0) {
        var t = xa;
        (t === 0 && ((t = ni), (ni <<= 1), (ni & 261888) === 0 && (ni = 256)), (Vl = t));
      }
      return Vl;
    }
    function ur(t) {
      return t == null || typeof t == "symbol" || typeof t == "boolean"
        ? null
        : typeof t == "function"
          ? t
          : Ci(t);
    }
    function fp(t, e, l, a, n) {
      if (e === "submit" && l && l.stateNode === n) {
        var u = ur((n[ve] || null).action),
          i = a.submitter;
        i &&
          ((e = (e = i[ve] || null) ? ur(e.formAction) : i.getAttribute("formAction")),
          e !== null && ((u = e), (i = null)));
        var c = new Sc("action", "action", null, a, n);
        t.push({
          event: c,
          listeners: [
            {
              instance: null,
              listener: function () {
                if (a.defaultPrevented) {
                  if (Vl !== 0) {
                    var f = new FormData(n, i);
                    po(l, { pending: !0, data: f, method: n.method, action: u }, null, f);
                  }
                } else
                  typeof u == "function" &&
                    (c.preventDefault(),
                    (f = new FormData(n, i)),
                    po(l, { pending: !0, data: f, method: n.method, action: u }, u, f));
              },
              currentTarget: n,
            },
          ],
        });
      }
    }
    for (bi = 0; bi < uo.length; bi++)
      ((Si = uo[bi]),
        (ir = Si.toLowerCase()),
        (cr = Si[0].toUpperCase() + Si.slice(1)),
        ke(ir, "on" + cr));
    var Si, ir, cr, bi;
    ke(y1, "onAnimationEnd");
    ke(p1, "onAnimationIteration");
    ke(g1, "onAnimationStart");
    ke("dblclick", "onDoubleClick");
    ke("focusin", "onFocus");
    ke("focusout", "onBlur");
    ke(Sy, "onTransitionRun");
    ke(Ay, "onTransitionStart");
    ke(Ey, "onTransitionCancel");
    ke(b1, "onTransitionEnd");
    pn("onMouseEnter", ["mouseout", "mouseover"]);
    pn("onMouseLeave", ["mouseout", "mouseover"]);
    pn("onPointerEnter", ["pointerout", "pointerover"]);
    pn("onPointerLeave", ["pointerout", "pointerover"]);
    Ba("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
    Ba(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " ",
      ),
    );
    Ba("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
    Ba("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
    Ba(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" "),
    );
    Ba(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
    );
    var xu =
        "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
          " ",
        ),
      sp = new Set(
        "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(xu),
      );
    function u2(t, e) {
      e = (e & 4) !== 0;
      for (var l = 0; l < t.length; l++) {
        var a = t[l],
          n = a.event;
        a = a.listeners;
        t: {
          var u = void 0;
          if (e)
            for (var i = a.length - 1; 0 <= i; i--) {
              var c = a[i],
                f = c.instance,
                m = c.currentTarget;
              if (((c = c.listener), f !== u && n.isPropagationStopped())) break t;
              ((u = c), (n.currentTarget = m));
              try {
                u(n);
              } catch (g) {
                Fi(g);
              }
              ((n.currentTarget = null), (u = f));
            }
          else
            for (i = 0; i < a.length; i++) {
              if (
                ((c = a[i]),
                (f = c.instance),
                (m = c.currentTarget),
                (c = c.listener),
                f !== u && n.isPropagationStopped())
              )
                break t;
              ((u = c), (n.currentTarget = m));
              try {
                u(n);
              } catch (g) {
                Fi(g);
              }
              ((n.currentTarget = null), (u = f));
            }
        }
      }
    }
    function nt(t, e) {
      var l = e[ed];
      l === void 0 && (l = e[ed] = new Set());
      var a = t + "__bubble";
      l.has(a) || (i2(e, t, 2, !1), l.add(a));
    }
    function U0(t, e, l) {
      var a = 0;
      (e && (a |= 4), i2(l, t, a, e));
    }
    var Ai = "_reactListening" + Math.random().toString(36).slice(2);
    function Xf(t) {
      if (!t[Ai]) {
        ((t[Ai] = !0),
          $r.forEach(function (l) {
            l !== "selectionchange" && (sp.has(l) || U0(l, !1, t), U0(l, !0, t));
          }));
        var e = t.nodeType === 9 ? t : t.ownerDocument;
        e === null || e[Ai] || ((e[Ai] = !0), U0("selectionchange", !1, e));
      }
    }
    function i2(t, e, l, a) {
      switch (_2(e)) {
        case 2:
          var n = lg;
          break;
        case 8:
          n = ag;
          break;
        default:
          n = $f;
      }
      ((l = n.bind(null, e, l, t)),
        (n = void 0),
        !eo || (e !== "touchstart" && e !== "touchmove" && e !== "wheel") || (n = !0),
        a
          ? n !== void 0
            ? t.addEventListener(e, l, { capture: !0, passive: n })
            : t.addEventListener(e, l, !0)
          : n !== void 0
            ? t.addEventListener(e, l, { passive: n })
            : t.addEventListener(e, l, !1));
    }
    function L0(t, e, l, a, n) {
      var u = a;
      if ((e & 1) === 0 && (e & 2) === 0 && a !== null)
        t: for (;;) {
          if (a === null) return;
          var i = a.tag;
          if (i === 3 || i === 4) {
            var c = a.stateNode.containerInfo;
            if (c === n) break;
            if (i === 4)
              for (i = a.return; i !== null;) {
                var f = i.tag;
                if ((f === 3 || f === 4) && i.stateNode.containerInfo === n) return;
                i = i.return;
              }
            for (; c !== null;) {
              if (((i = ya(c)), i === null)) return;
              if (((f = i.tag), f === 5 || f === 6 || f === 26 || f === 27)) {
                a = u = i;
                continue t;
              }
              c = c.parentNode;
            }
          }
          a = a.return;
        }
      u1(function () {
        var m = u,
          g = uf(l),
          A = [];
        t: {
          var v = S1.get(t);
          if (v !== void 0) {
            var p = Sc,
              x = t;
            switch (t) {
              case "keypress":
                if (Mi(l) === 0) break t;
              case "keydown":
              case "keyup":
                p = Iv;
                break;
              case "focusin":
                ((x = "focus"), (p = b0));
                break;
              case "focusout":
                ((x = "blur"), (p = b0));
                break;
              case "beforeblur":
              case "afterblur":
                p = b0;
                break;
              case "click":
                if (l.button === 2) break t;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                p = fd;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                p = qv;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                p = ey;
                break;
              case y1:
              case p1:
              case g1:
                p = Gv;
                break;
              case b1:
                p = ay;
                break;
              case "scroll":
              case "scrollend":
                p = Uv;
                break;
              case "wheel":
                p = uy;
                break;
              case "copy":
              case "cut":
              case "paste":
                p = Qv;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                p = dd;
                break;
              case "submit":
                p = Pv;
                break;
              case "toggle":
              case "beforetoggle":
                p = cy;
            }
            var R = (e & 4) !== 0,
              j = !R && (t === "scroll" || t === "scrollend"),
              r = R ? (v !== null ? v + "Capture" : null) : v;
            R = [];
            for (var h = m, y; h !== null;) {
              var S = h;
              if (
                ((y = S.stateNode),
                (S = S.tag),
                (S !== 5 && S !== 26 && S !== 27) ||
                  y === null ||
                  r === null ||
                  ((S = gu(h, r)), S != null && R.push(Mu(h, S, y))),
                j)
              )
                break;
              h = h.return;
            }
            0 < R.length && ((v = new p(v, x, null, l, g)), A.push({ event: v, listeners: R }));
          }
        }
        if ((e & 7) === 0) {
          t: {
            if (
              ((p = t === "mouseover" || t === "pointerover"),
              (v = t === "mouseout" || t === "pointerout"),
              p && l !== to && (x = l.relatedTarget || l.fromElement) && (ya(x) || x[Nn]))
            )
              break t;
            (v || p) &&
              ((x =
                g.window === g
                  ? g
                  : (p = g.ownerDocument)
                    ? p.defaultView || p.parentWindow
                    : window),
              v
                ? ((p = l.relatedTarget || l.toElement),
                  (v = m),
                  (p = p ? ya(p) : null),
                  p !== null &&
                    ((j = Ou(p)), (R = p.tag), p !== j || (R !== 5 && R !== 27 && R !== 6)) &&
                    (p = null))
                : ((v = null), (p = m)),
              v !== p &&
                ((R = fd),
                (S = "onMouseLeave"),
                (r = "onMouseEnter"),
                (h = "mouse"),
                (t === "pointerout" || t === "pointerover") &&
                  ((R = dd), (S = "onPointerLeave"), (r = "onPointerEnter"), (h = "pointer")),
                (j = v == null ? x : eu(v)),
                (y = p == null ? x : eu(p)),
                (x = new R(S, h + "leave", v, l, g)),
                (x.target = j),
                (x.relatedTarget = y),
                (S = null),
                ya(g) === m &&
                  ((R = new R(r, h + "enter", p, l, g)),
                  (R.target = y),
                  (R.relatedTarget = j),
                  (S = R)),
                (j = S),
                (R = v && p ? V0(v, p, dp) : null),
                v !== null && or(A, x, v, R, !1),
                p !== null && j !== null && or(A, j, p, R, !0)));
          }
          t: {
            if (
              ((v = m ? eu(m) : window),
              (p = v.nodeName && v.nodeName.toLowerCase()),
              p === "select" || (p === "input" && v.type === "file"))
            )
              var _ = vd;
            else if (md(v))
              if (d1) _ = py;
              else {
                _ = vy;
                var F = my;
              }
            else
              ((p = v.nodeName),
                !p || p.toLowerCase() !== "input" || (v.type !== "checkbox" && v.type !== "radio")
                  ? m && nf(m.elementType) && (_ = vd)
                  : (_ = yy));
            if (_ && (_ = _(t, m))) {
              s1(A, _, l, g);
              break t;
            }
            F && F(t, v, m);
          }
          switch (((F = m ? eu(m) : window), t)) {
            case "focusin":
              (md(F) || F.contentEditable === "true") && ((Wa = F), (ao = m), (iu = null));
              break;
            case "focusout":
              iu = ao = Wa = null;
              break;
            case "mousedown":
              no = !0;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              ((no = !1), bd(A, l, g));
              break;
            case "selectionchange":
              if (by) break;
            case "keydown":
            case "keyup":
              bd(A, l, g);
          }
          var V;
          if (ff)
            t: {
              switch (t) {
                case "compositionstart":
                  var Q = "onCompositionStart";
                  break t;
                case "compositionend":
                  Q = "onCompositionEnd";
                  break t;
                case "compositionupdate":
                  Q = "onCompositionUpdate";
                  break t;
              }
              Q = void 0;
            }
          else
            $a
              ? o1(t, l) && (Q = "onCompositionEnd")
              : t === "keydown" && l.keyCode === 229 && (Q = "onCompositionStart");
          (Q &&
            (c1 &&
              l.locale !== "ko" &&
              ($a || Q !== "onCompositionStart"
                ? Q === "onCompositionEnd" && $a && (V = i1())
                : ((ql = g), (cf = "value" in ql ? ql.value : ql.textContent), ($a = !0))),
            (F = vc(m, Q)),
            0 < F.length &&
              ((Q = new sd(Q, t, null, l, g)),
              A.push({ event: Q, listeners: F }),
              V ? (Q.data = V) : ((V = f1(l)), V !== null && (Q.data = V)))),
            (V = fy ? sy(t, l) : dy(t, l)) &&
              ((Q = vc(m, "onBeforeInput")),
              0 < Q.length &&
                ((F = new sd("onBeforeInput", "beforeinput", null, l, g)),
                A.push({ event: F, listeners: Q }),
                (F.data = V))),
            fp(A, t, m, l, g));
        }
        u2(A, e);
      });
    }
    function Mu(t, e, l) {
      return { instance: t, listener: e, currentTarget: l };
    }
    function vc(t, e) {
      for (var l = e + "Capture", a = []; t !== null;) {
        var n = t,
          u = n.stateNode;
        if (
          ((n = n.tag),
          (n !== 5 && n !== 26 && n !== 27) ||
            u === null ||
            ((n = gu(t, l)),
            n != null && a.unshift(Mu(t, n, u)),
            (n = gu(t, e)),
            n != null && a.push(Mu(t, n, u))),
          t.tag === 3)
        )
          return a;
        t = t.return;
      }
      return [];
    }
    function dp(t) {
      if (t === null) return null;
      do t = t.return;
      while (t && t.tag !== 5 && t.tag !== 27);
      return t || null;
    }
    function or(t, e, l, a, n) {
      for (var u = e._reactName, i = []; l !== null && l !== a;) {
        var c = l,
          f = c.alternate,
          m = c.stateNode;
        if (((c = c.tag), f !== null && f === a)) break;
        ((c !== 5 && c !== 26 && c !== 27) ||
          m === null ||
          ((f = m),
          n
            ? ((m = gu(l, u)), m != null && i.unshift(Mu(l, m, f)))
            : n || ((m = gu(l, u)), m != null && i.push(Mu(l, m, f)))),
          (l = l.return));
      }
      i.length !== 0 && t.push({ event: e, listeners: i });
    }
    var rp = /\r\n?/g,
      hp = /\u0000|\uFFFD/g;
    function fr(t) {
      return (typeof t == "string" ? t : "" + t)
        .replace(
          rp,
          `
`,
        )
        .replace(hp, "");
    }
    function c2(t, e) {
      return ((e = fr(e)), fr(t) === e);
    }
    function mt(t, e, l, a, n, u) {
      switch (l) {
        case "children":
          if (typeof a == "string") e === "body" || (e === "textarea" && a === "") || gn(t, a);
          else if (typeof a == "number" || typeof a == "bigint") e !== "body" && gn(t, "" + a);
          else return;
          break;
        case "className":
          ci(t, "class", a);
          break;
        case "tabIndex":
          ci(t, "tabindex", a);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          ci(t, l, a);
          break;
        case "style":
          n1(t, a, u);
          return;
        case "data":
          if (e !== "object") {
            ci(t, "data", a);
            break;
          }
        case "src":
        case "href":
          if (a === "" && (e !== "a" || l !== "href")) {
            t.removeAttribute(l);
            break;
          }
          if (
            a == null ||
            typeof a == "function" ||
            typeof a == "symbol" ||
            typeof a == "boolean"
          ) {
            t.removeAttribute(l);
            break;
          }
          ((a = Ci(a)), t.setAttribute(l, a));
          break;
        case "action":
        case "formAction":
          if (typeof a == "function") {
            t.setAttribute(
              l,
              "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
            );
            break;
          } else
            typeof u == "function" &&
              (l === "formAction"
                ? (e !== "input" && mt(t, e, "name", n.name, n, null),
                  mt(t, e, "formEncType", n.formEncType, n, null),
                  mt(t, e, "formMethod", n.formMethod, n, null),
                  mt(t, e, "formTarget", n.formTarget, n, null))
                : (mt(t, e, "encType", n.encType, n, null),
                  mt(t, e, "method", n.method, n, null),
                  mt(t, e, "target", n.target, n, null)));
          if (a == null || typeof a == "symbol" || typeof a == "boolean") {
            t.removeAttribute(l);
            break;
          }
          ((a = Ci(a)), t.setAttribute(l, a));
          break;
        case "onClick":
          a != null && (t.onclick = el);
          return;
        case "onScroll":
          a != null && nt("scroll", t);
          return;
        case "onScrollEnd":
          a != null && nt("scrollend", t);
          return;
        case "dangerouslySetInnerHTML":
          if (a != null) {
            if (typeof a != "object" || !("__html" in a)) throw Error(C(61));
            if (((l = a.__html), l != null)) {
              if (n.children != null) throw Error(C(60));
              u?.__html !== l && (t.innerHTML = l);
            }
          }
          break;
        case "multiple":
          t.multiple = a && typeof a != "function" && typeof a != "symbol";
          break;
        case "muted":
          t.muted = a && typeof a != "function" && typeof a != "symbol";
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
          break;
        case "autoFocus":
          break;
        case "xlinkHref":
          if (
            a == null ||
            typeof a == "function" ||
            typeof a == "boolean" ||
            typeof a == "symbol"
          ) {
            t.removeAttribute("xlink:href");
            break;
          }
          ((l = Ci(a)), t.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", l));
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          a != null && typeof a != "function" && typeof a != "symbol"
            ? t.setAttribute(l, a)
            : t.removeAttribute(l);
          break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "credentialless":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
          a && typeof a != "function" && typeof a != "symbol"
            ? t.setAttribute(l, "")
            : t.removeAttribute(l);
          break;
        case "capture":
        case "download":
          a === !0
            ? t.setAttribute(l, "")
            : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol"
              ? t.setAttribute(l, a)
              : t.removeAttribute(l);
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a
            ? t.setAttribute(l, a)
            : t.removeAttribute(l);
          break;
        case "rowSpan":
        case "start":
          a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a)
            ? t.removeAttribute(l)
            : t.setAttribute(l, a);
          break;
        case "popover":
          (nt("beforetoggle", t), nt("toggle", t), zi(t, "popover", a));
          break;
        case "xlinkActuate":
          rl(t, "http://www.w3.org/1999/xlink", "xlink:actuate", a);
          break;
        case "xlinkArcrole":
          rl(t, "http://www.w3.org/1999/xlink", "xlink:arcrole", a);
          break;
        case "xlinkRole":
          rl(t, "http://www.w3.org/1999/xlink", "xlink:role", a);
          break;
        case "xlinkShow":
          rl(t, "http://www.w3.org/1999/xlink", "xlink:show", a);
          break;
        case "xlinkTitle":
          rl(t, "http://www.w3.org/1999/xlink", "xlink:title", a);
          break;
        case "xlinkType":
          rl(t, "http://www.w3.org/1999/xlink", "xlink:type", a);
          break;
        case "xmlBase":
          rl(t, "http://www.w3.org/XML/1998/namespace", "xml:base", a);
          break;
        case "xmlLang":
          rl(t, "http://www.w3.org/XML/1998/namespace", "xml:lang", a);
          break;
        case "xmlSpace":
          rl(t, "http://www.w3.org/XML/1998/namespace", "xml:space", a);
          break;
        case "is":
          zi(t, "is", a);
          break;
        case "innerText":
        case "textContent":
          return;
        default:
          if (!(2 < l.length) || (l[0] !== "o" && l[0] !== "O") || (l[1] !== "n" && l[1] !== "N"))
            ((l = Rv.get(l) || l), zi(t, l, a));
          else return;
      }
      ct = !0;
    }
    function Vo(t, e, l, a, n, u) {
      switch (l) {
        case "style":
          n1(t, a, u);
          return;
        case "dangerouslySetInnerHTML":
          if (a != null) {
            if (typeof a != "object" || !("__html" in a)) throw Error(C(61));
            if (((l = a.__html), l != null)) {
              if (n.children != null) throw Error(C(60));
              u?.__html !== l && (t.innerHTML = l);
            }
          }
          break;
        case "children":
          if (typeof a == "string") gn(t, a);
          else if (typeof a == "number" || typeof a == "bigint") gn(t, "" + a);
          else return;
          break;
        case "onScroll":
          a != null && nt("scroll", t);
          return;
        case "onScrollEnd":
          a != null && nt("scrollend", t);
          return;
        case "onClick":
          a != null && (t.onclick = el);
          return;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "innerHTML":
        case "ref":
          return;
        case "innerText":
        case "textContent":
          return;
        default:
          if (!Wr.hasOwnProperty(l))
            t: {
              if (
                l[0] === "o" &&
                l[1] === "n" &&
                ((n = l.endsWith("Capture")),
                (u = l.slice(2, n ? l.length - 7 : void 0)),
                (e = t[ve] || null),
                (e = e != null ? e[l] : null),
                typeof e == "function" && t.removeEventListener(u, e, n),
                typeof a == "function")
              ) {
                (typeof e != "function" &&
                  e !== null &&
                  (l in t ? (t[l] = null) : t.hasAttribute(l) && t.removeAttribute(l)),
                  t.addEventListener(u, a, n));
                break t;
              }
              ((ct = !0), l in t ? (t[l] = a) : a === !0 ? t.setAttribute(l, "") : zi(t, l, a));
            }
          return;
      }
      ct = !0;
    }
    function Jt(t, e, l) {
      switch (e) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "img":
          (nt("error", t), nt("load", t));
          var a = !1,
            n = !1,
            u;
          for (u in l)
            if (l.hasOwnProperty(u)) {
              var i = l[u];
              if (i != null)
                switch (u) {
                  case "src":
                    a = !0;
                    break;
                  case "srcSet":
                    n = !0;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(C(137, e));
                  default:
                    mt(t, e, u, i, l, null);
                }
            }
          (n && mt(t, e, "srcSet", l.srcSet, l, null), a && mt(t, e, "src", l.src, l, null));
          return;
        case "input":
          nt("invalid", t);
          var c = (u = i = n = null),
            f = null,
            m = null;
          for (a in l)
            if (l.hasOwnProperty(a)) {
              var g = l[a];
              if (g != null)
                switch (a) {
                  case "name":
                    n = g;
                    break;
                  case "type":
                    i = g;
                    break;
                  case "checked":
                    f = g;
                    break;
                  case "defaultChecked":
                    m = g;
                    break;
                  case "value":
                    u = g;
                    break;
                  case "defaultValue":
                    c = g;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    if (g != null) throw Error(C(137, e));
                    break;
                  default:
                    mt(t, e, a, g, l, null);
                }
            }
          e1(t, u, c, f, m, i, n, !1);
          return;
        case "select":
          (nt("invalid", t), (a = i = u = null));
          for (n in l)
            if (l.hasOwnProperty(n) && ((c = l[n]), c != null))
              switch (n) {
                case "value":
                  u = c;
                  break;
                case "defaultValue":
                  i = c;
                  break;
                case "multiple":
                  a = c;
                default:
                  mt(t, e, n, c, l, null);
              }
          ((e = u),
            (l = i),
            (t.multiple = !!a),
            e != null ? cn(t, !!a, e, !1) : l != null && cn(t, !!a, l, !0));
          return;
        case "textarea":
          (nt("invalid", t), (u = n = a = null));
          for (i in l)
            if (l.hasOwnProperty(i) && ((c = l[i]), c != null))
              switch (i) {
                case "value":
                  a = c;
                  break;
                case "defaultValue":
                  n = c;
                  break;
                case "children":
                  u = c;
                  break;
                case "dangerouslySetInnerHTML":
                  if (c != null) throw Error(C(91));
                  break;
                default:
                  mt(t, e, i, c, l, null);
              }
          a1(t, a, n, u);
          return;
        case "option":
          for (f in l)
            l.hasOwnProperty(f) &&
              ((a = l[f]), a != null) &&
              (f === "selected"
                ? (t.selected = a && typeof a != "function" && typeof a != "symbol")
                : mt(t, e, f, a, l, null));
          return;
        case "dialog":
          (nt("beforetoggle", t), nt("toggle", t), nt("cancel", t), nt("close", t));
          break;
        case "iframe":
        case "object":
          nt("load", t);
          break;
        case "video":
        case "audio":
          for (a = 0; a < xu.length; a++) nt(xu[a], t);
          break;
        case "image":
          (nt("error", t), nt("load", t));
          break;
        case "details":
          nt("toggle", t);
          break;
        case "embed":
        case "source":
        case "link":
          (nt("error", t), nt("load", t));
        case "area":
        case "base":
        case "br":
        case "col":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "track":
        case "wbr":
        case "menuitem":
          for (m in l)
            if (l.hasOwnProperty(m) && ((a = l[m]), a != null))
              switch (m) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(C(137, e));
                default:
                  mt(t, e, m, a, l, null);
              }
          return;
        default:
          if (nf(e)) {
            for (g in l)
              l.hasOwnProperty(g) && ((a = l[g]), a !== void 0 && Vo(t, e, g, a, l, void 0));
            return;
          }
      }
      for (c in l) l.hasOwnProperty(c) && ((a = l[c]), a != null && mt(t, e, c, a, l, null));
    }
    var mp = {};
    function vp(t, e, l, a) {
      switch (e) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "input":
          var n = null,
            u = null,
            i = null,
            c = null,
            f = null,
            m = null,
            g = null;
          for (p in l) {
            var A = l[p];
            if (l.hasOwnProperty(p) && A != null)
              switch (p) {
                case "checked":
                  break;
                case "value":
                  break;
                case "defaultValue":
                  f = A;
                default:
                  a.hasOwnProperty(p) || mt(t, e, p, null, a, A);
              }
          }
          for (var v in a) {
            var p = a[v];
            if (((A = l[v]), a.hasOwnProperty(v) && (p != null || A != null)))
              switch (v) {
                case "type":
                  (p !== A && (ct = !0), (u = p));
                  break;
                case "name":
                  (p !== A && (ct = !0), (n = p));
                  break;
                case "checked":
                  (p !== A && (ct = !0), (m = p));
                  break;
                case "defaultChecked":
                  (p !== A && (ct = !0), (g = p));
                  break;
                case "value":
                  (p !== A && (ct = !0), (i = p));
                  break;
                case "defaultValue":
                  (p !== A && (ct = !0), (c = p));
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (p != null) throw Error(C(137, e));
                  break;
                default:
                  p !== A && mt(t, e, v, p, a, A);
              }
          }
          P0(t, i, c, f, m, g, u, n);
          return;
        case "select":
          p = i = c = v = null;
          for (u in l)
            if (((f = l[u]), l.hasOwnProperty(u) && f != null))
              switch (u) {
                case "value":
                  break;
                case "multiple":
                  p = f;
                default:
                  a.hasOwnProperty(u) || mt(t, e, u, null, a, f);
              }
          for (n in a)
            if (((u = a[n]), (f = l[n]), a.hasOwnProperty(n) && (u != null || f != null)))
              switch (n) {
                case "value":
                  (u !== f && (ct = !0), (v = u));
                  break;
                case "defaultValue":
                  (u !== f && (ct = !0), (c = u));
                  break;
                case "multiple":
                  (u !== f && (ct = !0), (i = u));
                default:
                  u !== f && mt(t, e, n, u, a, f);
              }
          ((e = c),
            (l = i),
            (a = p),
            v != null
              ? cn(t, !!l, v, !1)
              : !!a != !!l && (e != null ? cn(t, !!l, e, !0) : cn(t, !!l, l ? [] : "", !1)));
          return;
        case "textarea":
          p = v = null;
          for (c in l)
            if (((n = l[c]), l.hasOwnProperty(c) && n != null && !a.hasOwnProperty(c)))
              switch (c) {
                case "value":
                  break;
                case "children":
                  break;
                default:
                  mt(t, e, c, null, a, n);
              }
          for (i in a)
            if (((n = a[i]), (u = l[i]), a.hasOwnProperty(i) && (n != null || u != null)))
              switch (i) {
                case "value":
                  (n !== u && (ct = !0), (v = n));
                  break;
                case "defaultValue":
                  (n !== u && (ct = !0), (p = n));
                  break;
                case "children":
                  break;
                case "dangerouslySetInnerHTML":
                  if (n != null) throw Error(C(91));
                  break;
                default:
                  n !== u && mt(t, e, i, n, a, u);
              }
          l1(t, v, p);
          return;
        case "option":
          for (var x in l)
            ((v = l[x]),
              l.hasOwnProperty(x) &&
                v != null &&
                !a.hasOwnProperty(x) &&
                (x === "selected" ? (t.selected = !1) : mt(t, e, x, null, a, v)));
          for (f in a)
            ((v = a[f]),
              (p = l[f]),
              a.hasOwnProperty(f) &&
                v !== p &&
                (v != null || p != null) &&
                (f === "selected"
                  ? (v !== p && (ct = !0),
                    (t.selected = v && typeof v != "function" && typeof v != "symbol"))
                  : mt(t, e, f, v, a, p)));
          return;
        case "img":
        case "link":
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
        case "menuitem":
          for (var R in l)
            ((v = l[R]),
              l.hasOwnProperty(R) && v != null && !a.hasOwnProperty(R) && mt(t, e, R, null, a, v));
          for (m in a)
            if (
              ((v = a[m]), (p = l[m]), a.hasOwnProperty(m) && v !== p && (v != null || p != null))
            )
              switch (m) {
                case "children":
                case "dangerouslySetInnerHTML":
                  if (v != null) throw Error(C(137, e));
                  break;
                default:
                  mt(t, e, m, v, a, p);
              }
          return;
        default:
          if (nf(e)) {
            for (var j in l)
              ((v = l[j]),
                l.hasOwnProperty(j) &&
                  v !== void 0 &&
                  !a.hasOwnProperty(j) &&
                  Vo(t, e, j, void 0, a, v));
            for (g in a)
              ((v = a[g]),
                (p = l[g]),
                !a.hasOwnProperty(g) ||
                  v === p ||
                  (v === void 0 && p === void 0) ||
                  Vo(t, e, g, v, a, p));
            return;
          }
      }
      for (var r in l)
        ((v = l[r]),
          l.hasOwnProperty(r) && v != null && !a.hasOwnProperty(r) && mt(t, e, r, null, a, v));
      for (A in a)
        ((v = a[A]),
          (p = l[A]),
          !a.hasOwnProperty(A) || v === p || (v == null && p == null) || mt(t, e, A, v, a, p));
    }
    function sr(t) {
      switch (t) {
        case "css":
        case "script":
        case "font":
        case "img":
        case "image":
        case "input":
        case "link":
          return !0;
        default:
          return !1;
      }
    }
    function yp() {
      if (typeof performance.getEntriesByType == "function") {
        for (
          var t = 0, e = 0, l = performance.getEntriesByType("resource"), a = 0;
          a < l.length;
          a++
        ) {
          var n = l[a],
            u = n.transferSize,
            i = n.initiatorType,
            c = n.duration;
          if (u && c && sr(i)) {
            for (i = 0, c = n.responseEnd, a += 1; a < l.length; a++) {
              var f = l[a],
                m = f.startTime;
              if (m > c) break;
              var g = f.transferSize,
                A = f.initiatorType;
              g && sr(A) && ((f = f.responseEnd), (i += g * (f < c ? 1 : (c - m) / (f - m))));
            }
            if ((--a, (e += (8 * (u + i)) / (n.duration / 1e3)), t++, 10 < t)) break;
          }
        }
        if (0 < t) return e / t / 1e6;
      }
      return navigator.connection && ((t = navigator.connection.downlink), typeof t == "number")
        ? t
        : 5;
    }
    var Qo = null,
      Xo = null;
    function wu(t) {
      return t.nodeType === 9 ? t : t.ownerDocument;
    }
    function dr(t) {
      switch (t) {
        case "http://www.w3.org/2000/svg":
          return 1;
        case "http://www.w3.org/1998/Math/MathML":
          return 2;
        default:
          return 0;
      }
    }
    function o2(t, e) {
      if (t === 0)
        switch (e) {
          case "svg":
            return 1;
          case "math":
            return 2;
          default:
            return 0;
        }
      return t === 1 && e === "foreignObject" ? 0 : t;
    }
    function f2(t, e, l, a) {
      return ((l = wu(l).createElement(t)), (l[Zt] = a), (l[ve] = e), Jt(l, t, e), Gt(l), l);
    }
    function Zo(t, e) {
      return (
        t === "textarea" ||
        t === "noscript" ||
        typeof e.children == "string" ||
        typeof e.children == "number" ||
        typeof e.children == "bigint" ||
        (typeof e.dangerouslySetInnerHTML == "object" &&
          e.dangerouslySetInnerHTML !== null &&
          e.dangerouslySetInnerHTML.__html != null)
      );
    }
    var q0 = null;
    function pp() {
      var t = window.event;
      return t && t.type === "popstate" ? (t === q0 ? !1 : ((q0 = t), !0)) : ((q0 = null), !1);
    }
    var Zf = typeof setTimeout == "function" ? setTimeout : void 0,
      gp = typeof clearTimeout == "function" ? clearTimeout : void 0,
      rr = typeof Promise == "function" ? Promise : void 0,
      hr = typeof requestAnimationFrame == "function" ? requestAnimationFrame : Zf,
      bp =
        typeof queueMicrotask == "function"
          ? queueMicrotask
          : typeof rr < "u"
            ? function (t) {
                return rr.resolve(null).then(t).catch(Sp);
              }
            : Zf;
    function Sp(t) {
      setTimeout(function () {
        throw t;
      });
    }
    function ua(t) {
      return t === "head";
    }
    function mr(t, e) {
      var l = e,
        a = 0;
      do {
        var n = l.nextSibling;
        if ((t.removeChild(l), n && n.nodeType === 8))
          if (((l = n.data), l === "/$" || l === "/&")) {
            if (a === 0) {
              (t.removeChild(n), wn(e));
              return;
            }
            a--;
          } else if (l === "$" || l === "$?" || l === "$~" || l === "$!" || l === "&") a++;
          else if (l === "html") j0(t.ownerDocument.documentElement);
          else if (l === "head") {
            ((l = t.ownerDocument.head), j0(l));
            for (var u = l.firstChild; u;) {
              var i = u.nextSibling,
                c = u.nodeName;
              (u[Lu] ||
                c === "SCRIPT" ||
                c === "STYLE" ||
                (c === "LINK" && u.rel.toLowerCase() === "stylesheet") ||
                l.removeChild(u),
                (u = i));
            }
          } else l === "body" && j0(t.ownerDocument.body);
        l = n;
      } while (l);
      wn(e);
    }
    function vr(t, e) {
      var l = t;
      t = 0;
      do {
        var a = l.nextSibling;
        if (
          (l.nodeType === 1
            ? e
              ? ((l._stashedDisplay = l.style.display), (l.style.display = "none"))
              : ((l.style.display = l._stashedDisplay || ""),
                l.getAttribute("style") === "" && l.removeAttribute("style"))
            : l.nodeType === 3 &&
              (e
                ? ((l._stashedText = l.nodeValue), (l.nodeValue = ""))
                : (l.nodeValue = l._stashedText || "")),
          a && a.nodeType === 8)
        )
          if (((l = a.data), l === "/$")) {
            if (t === 0) break;
            t--;
          } else (l !== "$" && l !== "$?" && l !== "$~" && l !== "$!") || t++;
        l = a;
      } while (l);
    }
    function s2(t, e, l) {
      if (
        ((e = CSS.escape(e) !== e ? "r-" + btoa(e).replace(/=/g, "") : e),
        (t.style.viewTransitionName = e),
        l != null && (t.style.viewTransitionClass = l),
        (l = getComputedStyle(t)),
        l.display === "inline")
      ) {
        if (((e = t.getClientRects()), e.length === 1)) var a = 1;
        else
          for (var n = (a = 0); n < e.length; n++) {
            var u = e[n];
            0 < u.width && 0 < u.height && a++;
          }
        a === 1 &&
          ((t = t.style),
          (t.display = e.length === 1 ? "inline-block" : "block"),
          (t.marginTop = "-" + l.paddingTop),
          (t.marginBottom = "-" + l.paddingBottom));
      }
    }
    function d2(t, e) {
      ((t = t.style), (e = e.style));
      var l =
        e != null
          ? e.hasOwnProperty("viewTransitionName")
            ? e.viewTransitionName
            : e.hasOwnProperty("view-transition-name")
              ? e["view-transition-name"]
              : null
          : null;
      ((t.viewTransitionName = l == null || typeof l == "boolean" ? "" : ("" + l).trim()),
        (l =
          e != null
            ? e.hasOwnProperty("viewTransitionClass")
              ? e.viewTransitionClass
              : e.hasOwnProperty("view-transition-class")
                ? e["view-transition-class"]
                : null
            : null),
        (t.viewTransitionClass = l == null || typeof l == "boolean" ? "" : ("" + l).trim()),
        t.display === "inline-block" &&
          (e == null
            ? (t.display = t.margin = "")
            : ((l = e.display),
              (t.display = l == null || typeof l == "boolean" ? "" : l),
              (l = e.margin),
              l != null
                ? (t.margin = l)
                : ((l = e.hasOwnProperty("marginTop") ? e.marginTop : e["margin-top"]),
                  (t.marginTop = l == null || typeof l == "boolean" ? "" : l),
                  (e = e.hasOwnProperty("marginBottom") ? e.marginBottom : e["margin-bottom"]),
                  (t.marginBottom = e == null || typeof e == "boolean" ? "" : e)))));
    }
    function r2(t, e, l) {
      return (
        (l = l.ownerDocument.defaultView),
        {
          rect: t,
          abs: e.position === "absolute" || e.position === "fixed",
          clip:
            e.clipPath !== "none" ||
            e.overflow !== "visible" ||
            e.filter !== "none" ||
            e.mask !== "none" ||
            e.mask !== "none" ||
            e.borderRadius !== "0px",
          view: 0 <= t.bottom && 0 <= t.right && t.top <= l.innerHeight && t.left <= l.innerWidth,
        }
      );
    }
    function ko(t) {
      var e = t.getBoundingClientRect(),
        l = getComputedStyle(t);
      return r2(e, l, t);
    }
    function Ap(t) {
      var e = t.getBoundingClientRect();
      e = new DOMRect(e.x + 2e4, e.y + 2e4, e.width, e.height);
      var l = getComputedStyle(t);
      return r2(e, l, t);
    }
    function Ep(t) {
      return t.documentElement.clientHeight;
    }
    function Tp(t) {
      (this.addEventListener("load", t), this.addEventListener("error", t));
    }
    function zp(t, e, l, a, n, u, i, c, f) {
      var m = e.nodeType === 9 ? e : e.ownerDocument;
      try {
        var g = m.startViewTransition({
          update: function () {
            var v = m.defaultView,
              p = v.navigation && v.navigation.transition,
              x = m.fonts.status;
            a();
            var R = [];
            if (
              (x === "loaded" && (Ep(m), m.fonts.status === "loading" && R.push(m.fonts.ready)),
              (x = R.length),
              t !== null)
            )
              for (var j = t.suspenseyImages, r = 0, h = 0; h < j.length; h++) {
                var y = j[h];
                if (!y.complete) {
                  var S = y.getBoundingClientRect();
                  if (
                    0 < S.bottom &&
                    0 < S.right &&
                    S.top < v.innerHeight &&
                    S.left < v.innerWidth
                  ) {
                    if (((r += z2(y)), r > ji)) {
                      R.length = x;
                      break;
                    }
                    ((y = new Promise(Tp.bind(y))), R.push(y));
                  }
                }
              }
            if (0 < R.length)
              return (
                (v = Promise.race([
                  Promise.all(R),
                  new Promise(function (_) {
                    return setTimeout(_, 500);
                  }),
                ]).then(n, n)),
                (p ? Promise.allSettled([p.finished, v]) : v).then(u, u)
              );
            if ((n(), p)) return p.finished.then(u, u);
            u();
          },
          types: l,
        });
        m.__reactViewTransition = g;
        var A = [];
        return (
          g.ready.then(
            function () {
              for (
                var v = m.documentElement.getAnimations({ subtree: !0 }), p = 0;
                p < v.length;
                p++
              ) {
                var x = v[p],
                  R = x.effect,
                  j = R.pseudoElement;
                if (j != null && j.startsWith("::view-transition")) {
                  (A.push(x), (x = R.getKeyframes()));
                  for (var r = (j = void 0), h = !0, y = 0; y < x.length; y++) {
                    var S = x[y],
                      _ = S.width;
                    if (j === void 0) j = _;
                    else if (j !== _) {
                      h = !1;
                      break;
                    }
                    if (((_ = S.height), r === void 0)) r = _;
                    else if (r !== _) {
                      h = !1;
                      break;
                    }
                    (delete S.width, delete S.height, S.transform === "none" && delete S.transform);
                  }
                  h &&
                    j !== void 0 &&
                    r !== void 0 &&
                    (R.setKeyframes(x),
                    (h = getComputedStyle(R.target, R.pseudoElement)),
                    h.width !== j || h.height !== r) &&
                    ((h = x[0]),
                    (h.width = j),
                    (h.height = r),
                    (h = x[x.length - 1]),
                    (h.width = j),
                    (h.height = r),
                    R.setKeyframes(x));
                }
              }
              i();
            },
            function (v) {
              m.__reactViewTransition === g && (m.__reactViewTransition = null);
              try {
                (typeof v == "object" &&
                  v !== null &&
                  v.name === "InvalidStateError" &&
                  (v.message ===
                    "View transition was skipped because document visibility state is hidden." ||
                    v.message ===
                      "Skipping view transition because document visibility state has become hidden." ||
                    v.message === "Skipping view transition because viewport size changed." ||
                    v.message === "Transition was aborted because of invalid state") &&
                  (v = null),
                  v !== null && f(v));
              } finally {
                (a(), n(), i());
              }
            },
          ),
          g.finished.finally(function () {
            for (var v = 0; v < A.length; v++) A[v].cancel();
            (m.__reactViewTransition === g && (m.__reactViewTransition = null), c());
          }),
          g
        );
      } catch {
        return (a(), n(), i(), null);
      }
    }
    function pa(t, e) {
      ((this._scope = document.documentElement),
        (this._selector = "::view-transition-" + t + "(" + e + ")"));
    }
    pa.prototype.animate = function (t, e) {
      return (
        (e = typeof e == "number" ? { duration: e } : bt({}, e)),
        (e.pseudoElement = this._selector),
        this._scope.animate(t, e)
      );
    };
    pa.prototype.getAnimations = function () {
      for (
        var t = this._scope,
          e = this._selector,
          l = t.getAnimations({ subtree: !0 }),
          a = [],
          n = 0;
        n < l.length;
        n++
      ) {
        var u = l[n].effect;
        u !== null && u.target === t && u.pseudoElement === e && a.push(l[n]);
      }
      return a;
    };
    pa.prototype.getComputedStyle = function () {
      return getComputedStyle(this._scope, this._selector);
    };
    function h2(t) {
      return {
        name: t,
        group: new pa("group", t),
        imagePair: new pa("image-pair", t),
        old: new pa("old", t),
        new: new pa("new", t),
      };
    }
    function Me(t) {
      ((this._fragmentFiber = t), (this._observers = this._eventListeners = null));
    }
    Me.prototype.addEventListener = function (t, e, l) {
      var a = null,
        n = null;
      if (!(
        l != null &&
        typeof l != "boolean" &&
        ((a = l.signal || null), a !== null && a.aborted)
      )) {
        this._eventListeners === null && (this._eventListeners = []);
        var u = this._eventListeners;
        if (m2(u, t, e, l) === -1) {
          var i = this,
            c = e;
          (l != null &&
            typeof l != "boolean" &&
            l.once === !0 &&
            (c = function (f) {
              (i.removeEventListener(t, e, l),
                typeof e == "function" ? e.call(this, f) : e.handleEvent(f));
            }),
            a !== null &&
              ((n = i.removeEventListener.bind(i, t, e, l)),
              a.addEventListener("abort", n, { once: !0 }),
              (n = a.removeEventListener.bind(a, "abort", n))),
            (a = zn(l)),
            u.push({
              type: t,
              listener: e,
              optionsOrUseCapture: l,
              attachedListener: c,
              cleanup: n,
            }),
            me(this._fragmentFiber.child, !1, Cp, t, c, a));
        }
        this._eventListeners = u;
      }
    };
    function Cp(t, e, l, a) {
      return (Lt(t).addEventListener(e, l, a), !1);
    }
    Me.prototype.removeEventListener = function (t, e, l) {
      var a = this._eventListeners;
      if (a !== null && ((e = m2(a, t, e, l)), e !== -1)) {
        var n = a[e];
        l = n.attachedListener;
        var u = n.cleanup;
        ((n = zn(n.optionsOrUseCapture)),
          me(this._fragmentFiber.child, !1, xp, t, l, n),
          a.splice(e, 1),
          u !== null && u());
      }
    };
    function xp(t, e, l, a) {
      return (Lt(t).removeEventListener(e, l, a), !1);
    }
    function zn(t) {
      return t != null &&
        typeof t != "boolean" &&
        (t.once === !0 || t.signal instanceof AbortSignal)
        ? { capture: t.capture, passive: t.passive }
        : t;
    }
    function yr(t) {
      return t == null
        ? "c=0"
        : typeof t == "boolean"
          ? "c=" + (t ? "1" : "0")
          : "c=" + (t.capture ? "1" : "0");
    }
    function m2(t, e, l, a) {
      if (t.length === 0) return -1;
      a = yr(a);
      for (var n = 0; n < t.length; n++) {
        var u = t[n];
        if (u.type === e && u.listener === l && yr(u.optionsOrUseCapture) === a) return n;
      }
      return -1;
    }
    Me.prototype.dispatchEvent = function (t) {
      var e = Da(this._fragmentFiber);
      if (e === null) return !0;
      e = Lt(e);
      var l = this._eventListeners;
      if ((l !== null && 0 < l.length) || !t.bubbles) {
        var a = e.nodeType === 9 ? e.createComment("") : document.createTextNode("");
        if (l)
          for (var n = 0; n < l.length; n++) {
            var u = l[n];
            a.addEventListener(u.type, u.attachedListener, zn(u.optionsOrUseCapture));
          }
        if ((e.appendChild(a), (t = a.dispatchEvent(t)), l))
          for (n = 0; n < l.length; n++)
            ((u = l[n]),
              a.removeEventListener(u.type, u.attachedListener, zn(u.optionsOrUseCapture)));
        return (e.removeChild(a), t);
      }
      return e.dispatchEvent(t);
    };
    Me.prototype.focus = function (t) {
      me(this._fragmentFiber.child, !0, v2, t, void 0, void 0);
    };
    function v2(t, e) {
      return t.tag === 6 ? !1 : ((t = Lt(t)), qp(t, e));
    }
    Me.prototype.focusLast = function (t) {
      var e = [];
      me(this._fragmentFiber.child, !0, kf, e, void 0, void 0);
      for (var l = e.length - 1; 0 <= l && !v2(e[l], t); l--);
    };
    function kf(t, e) {
      return (e.push(t), !1);
    }
    Me.prototype.blur = function () {
      var t = Da(this._fragmentFiber);
      t !== null &&
        ((t = Lt(t)),
        (t = wu(t).activeElement),
        t !== null && me(this._fragmentFiber.child, !1, Mp, t, void 0, void 0));
    };
    function Mp(t, e) {
      return t.tag === 6 ? !1 : ((t = Lt(t)), t === e || t.contains(e) ? (e.blur(), !0) : !1);
    }
    Me.prototype.observeUsing = function (t) {
      (this._observers === null && (this._observers = new Set()),
        this._observers.add(t),
        me(this._fragmentFiber.child, !1, wp, t, void 0, void 0));
    };
    function wp(t, e) {
      return (t.tag === 6 || ((t = Lt(t)), e.observe(t)), !1);
    }
    Me.prototype.unobserveUsing = function (t) {
      var e = this._observers;
      if (e !== null && e.has(t)) {
        (e.delete(t), me(this._fragmentFiber.child, !1, Np, t, void 0, void 0));
        for (var l = (e = 0); l < Xe.length; l++) {
          var a = Xe[l];
          a.fragmentInstance === this && a.observer === t ? t.unobserve(a.instance) : (Xe[e++] = a);
        }
        Xe.length = e;
      }
    };
    function Np(t, e) {
      return (t.tag === 6 || ((t = Lt(t)), e.unobserve(t)), !1);
    }
    var Xe = [],
      Y0 = !1;
    function _p(t, e, l) {
      (Xe.push({ fragmentInstance: t, observer: e, instance: l }),
        Y0 ||
          ((Y0 = !0),
          Yp(function () {
            Y0 = !1;
            var a = Xe;
            Xe = [];
            for (var n = 0; n < a.length; n++) {
              var u = a[n];
              u.observer.unobserve(u.instance);
            }
          })));
    }
    Me.prototype.getClientRects = function () {
      var t = [];
      return (me(this._fragmentFiber.child, !1, Dp, t, void 0, void 0), t);
    };
    function Dp(t, e) {
      if (t.tag === 6) {
        t = t.stateNode;
        var l = t.ownerDocument.createRange();
        (l.selectNodeContents(t), e.push.apply(e, l.getClientRects()));
      } else ((t = Lt(t)), e.push.apply(e, t.getClientRects()));
      return !1;
    }
    Me.prototype.getRootNode = function (t) {
      var e = Da(this._fragmentFiber);
      return e === null ? this : Lt(e).getRootNode(t);
    };
    Me.prototype.compareDocumentPosition = function (t) {
      var e = Da(this._fragmentFiber);
      if (e === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
      var l = [];
      me(this._fragmentFiber.child, !1, kf, l, void 0, void 0);
      var a = Lt(e);
      if (l.length === 0) {
        if (((l = a), Js(this._fragmentFiber))) {
          t: {
            for (e = this._fragmentFiber.return; e !== null;) {
              if (e.tag === 4) {
                e = e.stateNode.containerInfo;
                break t;
              }
              if (e.tag === 3 || e.tag === 5 || e.tag === 27) break;
              e = e.return;
            }
            e = null;
          }
          e != null && (l = e);
        }
        e = this._fragmentFiber;
        var n = (a = l.compareDocumentPosition(t));
        return (
          l === t
            ? (n = Node.DOCUMENT_POSITION_CONTAINS)
            : a & Node.DOCUMENT_POSITION_CONTAINED_BY &&
              ((l = Lr(e)[1]),
              l === null
                ? (n = Node.DOCUMENT_POSITION_PRECEDING)
                : ((t = Lt(l).compareDocumentPosition(t)),
                  (n =
                    t === 0 || t & Node.DOCUMENT_POSITION_FOLLOWING
                      ? Node.DOCUMENT_POSITION_FOLLOWING
                      : Node.DOCUMENT_POSITION_PRECEDING))),
          (n |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC)
        );
      }
      ((e = Lt(l[0])), (n = Lt(l[l.length - 1])));
      var u = Js(this._fragmentFiber) ? e.parentElement : a;
      if (u == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
      ((a = u.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_CONTAINED_BY),
        (u = u.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_CONTAINED_BY));
      var i = e.compareDocumentPosition(t),
        c = n.compareDocumentPosition(t),
        f = i & Node.DOCUMENT_POSITION_CONTAINED_BY || c & Node.DOCUMENT_POSITION_CONTAINED_BY;
      return (
        (c =
          a && u && i & Node.DOCUMENT_POSITION_FOLLOWING && c & Node.DOCUMENT_POSITION_PRECEDING),
        (e =
          (a && e === t) || (u && n === t) || f || c
            ? Node.DOCUMENT_POSITION_CONTAINED_BY
            : (!a && e === t) || (!u && n === t)
              ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
              : i),
        e & Node.DOCUMENT_POSITION_DISCONNECTED ||
        e & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC ||
        Bp(e, this._fragmentFiber, l[0], l[l.length - 1], t)
          ? e
          : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
      );
    };
    function Bp(t, e, l, a, n) {
      var u = ya(n);
      if (t & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        if ((l = !!u))
          t: {
            for (; u !== null;) {
              if (u.tag === 7 && (u === e || u.alternate === e)) {
                l = !0;
                break t;
              }
              u = u.return;
            }
            l = !1;
          }
        return l;
      }
      if (t & Node.DOCUMENT_POSITION_CONTAINS) {
        if (u === null)
          return ((u = n.ownerDocument), n === u || n === u.documentElement || n === u.body);
        t: {
          for (u = e, e = Da(e); u !== null;) {
            if (!((u.tag !== 5 && u.tag !== 3 && u.tag !== 27) || (u !== e && u.alternate !== e))) {
              u = !0;
              break t;
            }
            u = u.return;
          }
          u = !1;
        }
        return u;
      }
      return t & Node.DOCUMENT_POSITION_PRECEDING
        ? ((e = !!u) &&
            !(e = u === l) &&
            ((e = V0(l, u, Is)),
            e === null ? (e = !1) : (me(e, !0, ov, u, l), (u = Ka), (Ka = null), (e = u !== null))),
          e)
        : t & Node.DOCUMENT_POSITION_FOLLOWING
          ? ((e = !!u) &&
              !(e = u === a) &&
              ((e = V0(a, u, Is)),
              e === null
                ? (e = !1)
                : (me(e, !0, fv, u, a), (u = Ka), (G0 = Ka = null), (e = u !== null))),
            e)
          : !1;
    }
    function pr(t, e) {
      var l = t.ownerDocument.createRange();
      (l.selectNodeContents(t),
        (t = l.getBoundingClientRect()),
        window.scrollTo(
          window.scrollX + t.left,
          e ? window.scrollY + t.top : window.scrollY + t.bottom - window.innerHeight,
        ));
    }
    Me.prototype.scrollIntoView = function (t) {
      if (typeof t == "object") throw Error(C(566));
      var e = [];
      me(this._fragmentFiber.child, !1, kf, e, void 0, void 0);
      var l = t !== !1;
      if (e.length === 0) {
        var a = Lr(this._fragmentFiber);
        if (((a = l ? a[1] || a[0] || Da(this._fragmentFiber) : a[0] || a[1]), a === null)) return;
        if (a.tag === 6) {
          ((t = Lt(a)), pr(t, l));
          return;
        }
        if (((a = Lt(a)), a.nodeType !== 9)) {
          if (a.nodeType === 11) {
            ((l = "host" in a ? a.host : null), l !== null && l.scrollIntoView(t));
            return;
          }
          a.scrollIntoView(t);
        }
      }
      for (a = l ? e.length - 1 : 0; a !== (l ? -1 : e.length);) {
        var n = e[a];
        (n.tag === 6 ? ((n = Lt(n)), pr(n, l)) : Lt(n).scrollIntoView(t), (a += l ? -1 : 1));
      }
    };
    function Op(t, e) {
      return ((t = Lt(t)), y2(t, e), !1);
    }
    function y2(t, e) {
      (t.reactFragments == null && (t.reactFragments = new Set()), t.reactFragments.add(e));
    }
    function p2(t, e) {
      var l = e._eventListeners;
      if (l !== null)
        for (var a = 0; a < l.length; a++) {
          var n = l[a];
          t.addEventListener(n.type, n.attachedListener, zn(n.optionsOrUseCapture));
        }
      t.nodeType !== 3 &&
        ((l = e._observers),
        l !== null &&
          l.forEach(function (u) {
            for (var i = 0, c = 0; c < Xe.length; c++) {
              var f = Xe[c];
              (f.fragmentInstance !== e || f.observer !== u || f.instance !== t) && (Xe[i++] = f);
            }
            ((Xe.length = i), u.observe(t));
          }),
        y2(t, e));
    }
    function Rp(t, e) {
      var l = e._eventListeners;
      if (l !== null)
        for (var a = 0; a < l.length; a++) {
          var n = l[a];
          t.removeEventListener(n.type, n.attachedListener, zn(n.optionsOrUseCapture));
        }
      t.nodeType !== 3 &&
        ((l = e._observers),
        l !== null &&
          l.forEach(function (u) {
            typeof u.rootMargin == "string" ? _p(e, u, t) : u.unobserve(t);
          }),
        t.reactFragments != null && t.reactFragments.delete(e));
    }
    function Ko(t) {
      var e = t.firstChild;
      for (e && e.nodeType === 10 && (e = e.nextSibling); e;) {
        var l = e;
        switch (((e = e.nextSibling), l.nodeName)) {
          case "HTML":
          case "HEAD":
          case "BODY":
            (Ko(l), bc(l));
            continue;
          case "SCRIPT":
          case "STYLE":
            continue;
          case "LINK":
            if (l.rel.toLowerCase() === "stylesheet") continue;
        }
        t.removeChild(l);
      }
    }
    function Hp(t, e, l, a) {
      for (; t.nodeType === 1;) {
        var n = l;
        if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
          if (!a && (t.nodeName !== "INPUT" || t.type !== "hidden")) break;
        } else if (a) {
          if (!t[Lu])
            switch (e) {
              case "meta":
                if (!t.hasAttribute("itemprop")) break;
                return t;
              case "link":
                if (
                  ((u = t.getAttribute("rel")),
                  u === "stylesheet" && t.hasAttribute("data-precedence"))
                )
                  break;
                if (
                  u !== n.rel ||
                  t.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) ||
                  t.getAttribute("crossorigin") !==
                    (n.crossOrigin == null ? null : n.crossOrigin) ||
                  t.getAttribute("title") !== (n.title == null ? null : n.title)
                )
                  break;
                return t;
              case "style":
                if (t.hasAttribute("data-precedence")) break;
                return t;
              case "script":
                if (
                  ((u = t.getAttribute("src")),
                  (u !== (n.src == null ? null : n.src) ||
                    t.getAttribute("type") !== (n.type == null ? null : n.type) ||
                    t.getAttribute("crossorigin") !==
                      (n.crossOrigin == null ? null : n.crossOrigin)) &&
                    u &&
                    t.hasAttribute("async") &&
                    !t.hasAttribute("itemprop"))
                )
                  break;
                return t;
              default:
                return t;
            }
        } else if (e === "input" && t.type === "hidden") {
          var u = n.name == null ? null : "" + n.name;
          if (n.type === "hidden" && t.getAttribute("name") === u) return t;
        } else return t;
        if (((t = Le(t.nextSibling)), t === null)) break;
      }
      return null;
    }
    function Up(t, e, l) {
      if (e === "") return null;
      for (; t.nodeType !== 3;)
        if (
          ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !l) ||
          ((t = Le(t.nextSibling)), t === null)
        )
          return null;
      return t;
    }
    function g2(t, e) {
      for (; t.nodeType !== 8;)
        if (
          ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e) ||
          ((t = Le(t.nextSibling)), t === null)
        )
          return null;
      return t;
    }
    function Fo(t) {
      return t.data === "$?" || t.data === "$~";
    }
    function Kf(t) {
      return t.data === "$!" || (t.data === "$?" && t.ownerDocument.readyState !== "loading");
    }
    function Lp(t, e) {
      var l = t.ownerDocument;
      if (t.data === "$~") t._reactRetry = e;
      else if (t.data !== "$?" || l.readyState !== "loading") e();
      else {
        var a = function () {
          (e(), l.removeEventListener("DOMContentLoaded", a));
        };
        (l.addEventListener("DOMContentLoaded", a), (t._reactRetry = a));
      }
    }
    function Le(t) {
      for (; t != null; t = t.nextSibling) {
        var e = t.nodeType;
        if (e === 1 || e === 3) break;
        if (e === 8) {
          if (
            ((e = t.data),
            e === "$" ||
              e === "$!" ||
              e === "$?" ||
              e === "$~" ||
              e === "&" ||
              e === "F!" ||
              e === "F")
          )
            break;
          if (e === "/$" || e === "/&") return null;
        }
      }
      return t;
    }
    var Jo = null;
    function gr(t) {
      t = t.nextSibling;
      for (var e = 0; t;) {
        if (t.nodeType === 8) {
          var l = t.data;
          if (l === "/$" || l === "/&") {
            if (e === 0) return Le(t.nextSibling);
            e--;
          } else (l !== "$" && l !== "$!" && l !== "$?" && l !== "$~" && l !== "&") || e++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function br(t) {
      t = t.previousSibling;
      for (var e = 0; t;) {
        if (t.nodeType === 8) {
          var l = t.data;
          if (l === "$" || l === "$!" || l === "$?" || l === "$~" || l === "&") {
            if (e === 0) return t;
            e--;
          } else (l !== "/$" && l !== "/&") || e++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function qp(t, e) {
      function l() {
        a = !0;
      }
      if (t.ownerDocument.activeElement === t) return !0;
      var a = !1;
      try {
        (t.ownerDocument.addEventListener("focus", l, !0),
          (t.focus || HTMLElement.prototype.focus).call(t, e));
      } finally {
        t.ownerDocument.removeEventListener("focus", l, !0);
      }
      return a;
    }
    function Yp(t) {
      hr(function () {
        hr(function (e) {
          return t(e);
        });
      });
    }
    function b2(t, e, l) {
      switch (((e = wu(l)), t)) {
        case "html":
          if (((t = e.documentElement), !t)) throw Error(C(452));
          return t;
        case "head":
          if (((t = e.head), !t)) throw Error(C(453));
          return t;
        case "body":
          if (((t = e.body), !t)) throw Error(C(454));
          return t;
        default:
          throw Error(C(451));
      }
    }
    function S2(t, e, l) {
      for (var a in l) {
        var n = l[a];
        l.hasOwnProperty(a) && n != null && mt(t, e, a, null, mp, n);
      }
      (l.dangerouslySetInnerHTML != null && (t.textContent = ""),
        t.onclick === el && (t.onclick = null),
        bc(t));
    }
    function j0(t) {
      for (var e = t.attributes; e.length;) t.removeAttributeNode(e[0]);
      bc(t);
    }
    var qe = new Map(),
      Sr = new Set();
    function Nu(t) {
      if (typeof t.getRootNode == "function") {
        var e = t.getRootNode();
        if (e.nodeType === 9 || e.nodeType === 11) return e;
      }
      return t.nodeType === 9 ? t : t.ownerDocument;
    }
    var xl = st.d;
    st.d = { f: jp, r: Gp, D: Vp, C: Qp, L: Xp, m: Zp, X: Kp, S: kp, M: Fp };
    function jp() {
      var t = xl.f(),
        e = Oc();
      return t || e;
    }
    function Gp(t) {
      var e = _n(t);
      e !== null && e.tag === 5 && e.type === "form" ? nh(e) : xl.r(t);
    }
    var Rn = typeof document > "u" ? null : document;
    function A2(t, e, l) {
      var a = Rn;
      if (a && typeof e == "string" && e) {
        var n = Re(e);
        ((n = 'link[rel="' + t + '"][href="' + n + '"]'),
          typeof l == "string" && (n += '[crossorigin="' + l + '"]'),
          Sr.has(n) ||
            (Sr.add(n),
            (t = { rel: t, crossOrigin: l, href: e }),
            a.querySelector(n) === null &&
              ((e = a.createElement("link")), Jt(e, "link", t), Gt(e), a.head.appendChild(e))));
      }
    }
    function Vp(t) {
      (xl.D(t), A2("dns-prefetch", t, null));
    }
    function Qp(t, e) {
      (xl.C(t, e), A2("preconnect", t, e));
    }
    function Xp(t, e, l) {
      xl.L(t, e, l);
      var a = Rn;
      if (a && t && e) {
        var n = 'link[rel="preload"][as="' + Re(e) + '"]';
        e === "image" && l && l.imageSrcSet
          ? ((n += '[imagesrcset="' + Re(l.imageSrcSet) + '"]'),
            typeof l.imageSizes == "string" && (n += '[imagesizes="' + Re(l.imageSizes) + '"]'))
          : (n += '[href="' + Re(t) + '"]');
        var u = n;
        switch (e) {
          case "style":
            u = Cn(t);
            break;
          case "script":
            u = Hn(t);
        }
        if (!(
          qe.has(u) ||
          ((t = bt(
            { rel: "preload", href: e === "image" && l && l.imageSrcSet ? void 0 : t, as: e },
            l,
          )),
          qe.set(u, t),
          a.querySelector(n) !== null ||
            (e === "style" && a.querySelector(Qu(u))) ||
            (e === "script" && a.querySelector(Xu(u))))
        )) {
          var i = a.createElement("link");
          (Jt(i, "link", t),
            e === "style" &&
              ((i[Ki] = !0),
              (i.onload = i.onerror =
                function () {
                  Ir(i);
                })),
            Gt(i),
            a.head.appendChild(i));
        }
      }
    }
    function Zp(t, e) {
      xl.m(t, e);
      var l = Rn;
      if (l && t) {
        var a = e && typeof e.as == "string" ? e.as : "script",
          n = 'link[rel="modulepreload"][as="' + Re(a) + '"][href="' + Re(t) + '"]',
          u = n;
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            u = Hn(t);
        }
        if (
          !qe.has(u) &&
          ((t = bt({ rel: "modulepreload", href: t }, e)),
          qe.set(u, t),
          l.querySelector(n) === null)
        ) {
          switch (a) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
              if (l.querySelector(Xu(u))) return;
          }
          ((a = l.createElement("link")), Jt(a, "link", t), Gt(a), l.head.appendChild(a));
        }
      }
    }
    function kp(t, e, l) {
      xl.S(t, e, l);
      var a = Rn;
      if (a && t) {
        var n = un(a).hoistableStyles,
          u = Cn(t);
        e = e || "default";
        var i = n.get(u);
        if (!i) {
          var c = { loading: 0, preload: null };
          if ((i = a.querySelector(Qu(u)))) c.loading = 5;
          else {
            ((t = bt({ rel: "stylesheet", href: t, "data-precedence": e }, l)),
              (l = qe.get(u)) && Ff(t, l));
            var f = (i = a.createElement("link"));
            (Gt(f),
              Jt(f, "link", t),
              (f._p = new Promise(function (m, g) {
                ((f.onload = m), (f.onerror = g));
              })),
              f.addEventListener("load", function () {
                c.loading |= 1;
              }),
              f.addEventListener("error", function () {
                c.loading |= 2;
              }),
              (c.loading |= 4),
              qi(i, e, a));
          }
          ((i = { type: "stylesheet", instance: i, count: 1, state: c }), n.set(u, i));
        }
      }
    }
    function Kp(t, e) {
      xl.X(t, e);
      var l = Rn;
      if (l && t) {
        var a = un(l).hoistableScripts,
          n = Hn(t),
          u = a.get(n);
        u ||
          ((u = l.querySelector(Xu(n))),
          u ||
            ((t = bt({ src: t, async: !0 }, e)),
            (e = qe.get(n)) && Jf(t, e),
            (u = l.createElement("script")),
            Gt(u),
            Jt(u, "link", t),
            l.head.appendChild(u)),
          (u = { type: "script", instance: u, count: 1, state: null }),
          a.set(n, u));
      }
    }
    function Fp(t, e) {
      xl.M(t, e);
      var l = Rn;
      if (l && t) {
        var a = un(l).hoistableScripts,
          n = Hn(t),
          u = a.get(n);
        u ||
          ((u = l.querySelector(Xu(n))),
          u ||
            ((t = bt({ src: t, async: !0, type: "module" }, e)),
            (e = qe.get(n)) && Jf(t, e),
            (u = l.createElement("script")),
            Gt(u),
            Jt(u, "link", t),
            l.head.appendChild(u)),
          (u = { type: "script", instance: u, count: 1, state: null }),
          a.set(n, u));
      }
    }
    function Ar(t, e, l, a) {
      var n = (n = Ql.current) ? Nu(n) : null;
      if (!n) throw Error(C(446));
      switch (t) {
        case "meta":
        case "title":
          return null;
        case "style":
          return typeof l.precedence == "string" && typeof l.href == "string"
            ? ((l = Cn(l.href)),
              (e = un(n).hoistableStyles),
              (a = e.get(l)),
              a || ((a = { type: "style", instance: null, count: 0, state: null }), e.set(l, a)),
              a)
            : { type: "void", instance: null, count: 0, state: null };
        case "link":
          if (
            l.rel === "stylesheet" &&
            typeof l.href == "string" &&
            typeof l.precedence == "string"
          ) {
            t = Cn(l.href);
            var u = un(n).hoistableStyles,
              i = u.get(t);
            if (
              (i ||
                ((n = n.ownerDocument || n),
                (i = {
                  type: "stylesheet",
                  instance: null,
                  count: 0,
                  state: { loading: 0, preload: null },
                }),
                u.set(t, i),
                (u = n.querySelector(Qu(t)))
                  ? u._p || ((i.instance = u), (i.state.loading = 5))
                  : ((u = qe.get(t)),
                    u ||
                      ((u = {
                        rel: "preload",
                        as: "style",
                        href: l.href,
                        crossOrigin: l.crossOrigin,
                        integrity: l.integrity,
                        media: l.media,
                        hrefLang: l.hrefLang,
                        referrerPolicy: l.referrerPolicy,
                      }),
                      qe.set(t, u)),
                    Jp(n, t, u, i.state))),
              e && a === null)
            )
              throw Error(C(528, ""));
            return i;
          }
          if (e && a !== null) throw Error(C(529, ""));
          return null;
        case "script":
          return (
            (e = l.async),
            (l = l.src),
            typeof l == "string" && e && typeof e != "function" && typeof e != "symbol"
              ? ((l = Hn(l)),
                (e = un(n).hoistableScripts),
                (a = e.get(l)),
                a || ((a = { type: "script", instance: null, count: 0, state: null }), e.set(l, a)),
                a)
              : { type: "void", instance: null, count: 0, state: null }
          );
        default:
          throw Error(C(444, t));
      }
    }
    function Cn(t) {
      return 'href="' + Re(t) + '"';
    }
    function Qu(t) {
      return 'link[rel="stylesheet"][' + t + "]";
    }
    function E2(t) {
      return bt({}, t, { "data-precedence": t.precedence, precedence: null });
    }
    function Jp(t, e, l, a) {
      if ((e = t.querySelector('link[rel="preload"][as="style"][' + e + "]"))) {
        if (e[Ki] !== !0) {
          a.loading = 1;
          return;
        }
      } else
        ((e = t.createElement("link")),
          (e[Ki] = !0),
          (e.onload = e.onerror = Ir.bind(null, e)),
          Jt(e, "link", l),
          Gt(e),
          t.head.appendChild(e));
      ((a.preload = e),
        e.addEventListener("load", function () {
          return (a.loading |= 1);
        }),
        e.addEventListener("error", function () {
          return (a.loading |= 2);
        }));
    }
    function Hn(t) {
      return '[src="' + Re(t) + '"]';
    }
    function Xu(t) {
      return "script[async]" + t;
    }
    function Er(t, e, l) {
      if ((e.count++, e.instance === null))
        switch (e.type) {
          case "style":
            var a = t.querySelector('style[data-href~="' + Re(l.href) + '"]');
            if (a) return ((e.instance = a), Gt(a), a);
            var n = bt({}, l, {
              "data-href": l.href,
              "data-precedence": l.precedence,
              href: null,
              precedence: null,
            });
            return (
              (a = (t.ownerDocument || t).createElement("style")),
              Gt(a),
              Jt(a, "style", n),
              qi(a, l.precedence, t),
              (e.instance = a)
            );
          case "stylesheet":
            n = Cn(l.href);
            var u = t.querySelector(Qu(n));
            if (u) return ((e.state.loading |= 4), (e.instance = u), Gt(u), u);
            ((a = E2(l)),
              (n = qe.get(n)) && Ff(a, n),
              (u = (t.ownerDocument || t).createElement("link")),
              Gt(u));
            var i = u;
            return (
              (i._p = new Promise(function (c, f) {
                ((i.onload = c), (i.onerror = f));
              })),
              Jt(u, "link", a),
              (e.state.loading |= 4),
              qi(u, l.precedence, t),
              (e.instance = u)
            );
          case "script":
            return (
              (u = Hn(l.src)),
              (n = t.querySelector(Xu(u)))
                ? ((e.instance = n), Gt(n), n)
                : ((a = l),
                  (n = qe.get(u)) && ((a = bt({}, l)), Jf(a, n)),
                  (t = t.ownerDocument || t),
                  (n = t.createElement("script")),
                  Gt(n),
                  Jt(n, "link", a),
                  t.head.appendChild(n),
                  (e.instance = n))
            );
          case "void":
            return null;
          default:
            throw Error(C(443, e.type));
        }
      else
        e.type === "stylesheet" &&
          (e.state.loading & 4) === 0 &&
          ((a = e.instance), (e.state.loading |= 4), qi(a, l.precedence, t));
      return e.instance;
    }
    function qi(t, e, l) {
      for (
        var a = l.querySelectorAll(
            'link[rel="stylesheet"][data-precedence],style[data-precedence]',
          ),
          n = a.length ? a[a.length - 1] : null,
          u = n,
          i = 0;
        i < a.length;
        i++
      ) {
        var c = a[i];
        if (c.dataset.precedence === e) u = c;
        else if (u !== n) break;
      }
      u
        ? u.parentNode.insertBefore(t, u.nextSibling)
        : ((e = l.nodeType === 9 ? l.head : l), e.insertBefore(t, e.firstChild));
    }
    function Ff(t, e) {
      (t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
        t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
        t.title == null && (t.title = e.title));
    }
    function Jf(t, e) {
      (t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
        t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
        t.integrity == null && (t.integrity = e.integrity));
    }
    var Yi = null;
    function Tr(t, e, l) {
      if (Yi === null) {
        var a = new Map(),
          n = (Yi = new Map());
        n.set(l, a);
      } else ((n = Yi), (a = n.get(l)), a || ((a = new Map()), n.set(l, a)));
      if (a.has(t)) return a;
      for (a.set(t, null), l = l.getElementsByTagName(t), n = 0; n < l.length; n++) {
        var u = l[n];
        if (
          !(u[Lu] || u[Zt] || (t === "link" && u.getAttribute("rel") === "stylesheet")) &&
          u.namespaceURI !== "http://www.w3.org/2000/svg"
        ) {
          var i = u.getAttribute(e) || "";
          i = t + i;
          var c = a.get(i);
          c ? c.push(u) : a.set(i, [u]);
        }
      }
      return a;
    }
    function Io(t, e, l) {
      ((t = t.ownerDocument || t),
        t.head.insertBefore(l, e === "title" ? t.querySelector("head > title") : null));
    }
    function Ip(t, e, l) {
      if (l === 1 || e.itemProp != null) return !1;
      switch (t) {
        case "meta":
        case "title":
          return !0;
        case "style":
          if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "") break;
          return !0;
        case "link":
          if (
            typeof e.rel != "string" ||
            typeof e.href != "string" ||
            e.href === "" ||
            e.onLoad ||
            e.onError
          )
            break;
          return e.rel === "stylesheet"
            ? ((t = e.disabled), typeof e.precedence == "string" && t == null)
            : !0;
        case "script":
          if (
            e.async &&
            typeof e.async != "function" &&
            typeof e.async != "symbol" &&
            !e.onLoad &&
            !e.onError &&
            e.src &&
            typeof e.src == "string"
          )
            return !0;
      }
      return !1;
    }
    function zr(t, e) {
      return (
        t === "img" && e.src != null && e.src !== "" && e.onLoad == null && e.loading !== "lazy"
      );
    }
    function T2(t) {
      return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
    }
    function z2(t) {
      return (
        (t.width || 100) *
        (t.height || 100) *
        (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) *
        0.25
      );
    }
    function Cr(t, e) {
      typeof e.decode == "function" &&
        (t.imgCount++,
        e.complete || ((t.imgBytes += z2(e)), t.suspenseyImages.push(e)),
        (t = Pp.bind(t)),
        e.decode().then(t, t));
    }
    function $p(t, e, l, a) {
      if (
        l.type === "stylesheet" &&
        (typeof a.media != "string" || matchMedia(a.media).matches !== !1) &&
        (l.state.loading & 4) === 0
      ) {
        if (l.instance === null) {
          var n = Cn(a.href),
            u = e.querySelector(Qu(n));
          if (u) {
            ((e = u._p),
              e !== null &&
                typeof e == "object" &&
                typeof e.then == "function" &&
                (t.count++, (t = _u.bind(t)), e.then(t, t)),
              (l.state.loading |= 4),
              (l.instance = u),
              Gt(u));
            return;
          }
          ((u = e.ownerDocument || e),
            (a = E2(a)),
            (n = qe.get(n)) && Ff(a, n),
            (u = u.createElement("link")),
            Gt(u));
          var i = u;
          ((i._p = new Promise(function (c, f) {
            ((i.onload = c), (i.onerror = f));
          })),
            Jt(u, "link", a),
            (l.instance = u));
        }
        (t.stylesheets === null && (t.stylesheets = new Map()),
          t.stylesheets.set(l, e),
          (e = l.state.preload) &&
            (l.state.loading & 3) === 0 &&
            (t.count++,
            (l = _u.bind(t)),
            e.addEventListener("load", l),
            e.addEventListener("error", l)));
      }
    }
    var ji = 0;
    function Wp(t, e) {
      return (
        t.stylesheets && t.count === 0 && Gi(t, t.stylesheets),
        0 < t.count || 0 < t.imgCount
          ? function (l) {
              var a = setTimeout(function () {
                if ((t.stylesheets && Gi(t, t.stylesheets), t.unsuspend)) {
                  var u = t.unsuspend;
                  ((t.unsuspend = null), u());
                }
              }, 6e4 + e);
              0 < t.imgBytes && ji === 0 && (ji = 62500 * yp());
              var n = setTimeout(
                function () {
                  if (
                    ((t.waitingForImages = !1),
                    t.count === 0 && (t.stylesheets && Gi(t, t.stylesheets), t.unsuspend))
                  ) {
                    var u = t.unsuspend;
                    ((t.unsuspend = null), u());
                  }
                },
                (t.imgBytes > ji ? 50 : 800) + e,
              );
              return (
                (t.unsuspend = l),
                function () {
                  ((t.unsuspend = null), clearTimeout(a), clearTimeout(n));
                }
              );
            }
          : null
      );
    }
    function C2(t) {
      if (t.count === 0 && (t.imgCount === 0 || !t.waitingForImages)) {
        if (t.stylesheets) Gi(t, t.stylesheets);
        else if (t.unsuspend) {
          var e = t.unsuspend;
          ((t.unsuspend = null), e());
        }
      }
    }
    function _u() {
      (this.count--, C2(this));
    }
    function Pp() {
      (this.imgCount--, C2(this));
    }
    var yc = null;
    function Gi(t, e) {
      ((t.stylesheets = null),
        t.unsuspend !== null &&
          (t.count++, (yc = new Map()), e.forEach(tg, t), (yc = null), _u.call(t)));
    }
    function tg(t, e) {
      if (!(e.state.loading & 4)) {
        var l = yc.get(t);
        if (l) var a = l.get(null);
        else {
          ((l = new Map()), yc.set(t, l));
          for (
            var n = t.querySelectorAll("link[data-precedence],style[data-precedence]"), u = 0;
            u < n.length;
            u++
          ) {
            var i = n[u];
            (i.nodeName === "LINK" || i.getAttribute("media") !== "not all") &&
              (l.set(i.dataset.precedence, i), (a = i));
          }
          a && l.set(null, a);
        }
        ((n = e.instance),
          (i = n.getAttribute("data-precedence")),
          (u = l.get(i) || a),
          u === a && l.set(null, n),
          l.set(i, n),
          this.count++,
          (a = _u.bind(this)),
          n.addEventListener("load", a),
          n.addEventListener("error", a),
          u
            ? u.parentNode.insertBefore(n, u.nextSibling)
            : ((t = t.nodeType === 9 ? t.head : t), t.insertBefore(n, t.firstChild)),
          (e.state.loading |= 4));
      }
    }
    var xn = {
      $$typeof: tl,
      Provider: null,
      Consumer: null,
      _currentValue: ga,
      _currentValue2: ga,
      _threadCount: 0,
    };
    function eg(t, e, l, a, n, u, i, c, f) {
      ((this.tag = 1),
        (this.containerInfo = t),
        (this.pingCache = this.current = this.pendingChildren = null),
        (this.timeoutHandle = -1),
        (this.callbackNode =
          this.next =
          this.pendingContext =
          this.context =
          this.cancelPendingCommit =
            null),
        (this.callbackPriority = 0),
        (this.expirationTimes = m0(-1)),
        (this.entangledLanes =
          this.shellSuspendCounter =
          this.errorRecoveryDisabledLanes =
          this.expiredLanes =
          this.warmLanes =
          this.pingedLanes =
          this.suspendedLanes =
          this.pendingLanes =
            0),
        (this.entanglements = m0(0)),
        (this.hiddenUpdates = m0(null)),
        (this.identifierPrefix = a),
        (this.onUncaughtError = n),
        (this.onCaughtError = u),
        (this.onRecoverableError = i),
        (this.pooledCache = null),
        (this.pooledCacheLanes = 0),
        (this.formState = f),
        (this.transitionTypes = null),
        (this.incompleteTransitions = new Map()));
    }
    function x2(t, e, l, a, n, u, i, c, f, m, g, A) {
      return (
        (t = new eg(t, e, l, i, f, m, g, A, c)),
        (e = 1),
        u === !0 && (e |= 24),
        (u = re(3, null, null, e)),
        (t.current = u),
        (u.stateNode = t),
        (e = vf()),
        e.refCount++,
        (t.pooledCache = e),
        e.refCount++,
        (u.memoizedState = { element: a, isDehydrated: l, cache: e }),
        gf(u),
        t
      );
    }
    function M2(t) {
      return t ? ((t = en), t) : en;
    }
    function w2(t, e, l, a, n, u) {
      ((n = M2(n)),
        a.context === null ? (a.context = n) : (a.pendingContext = n),
        (a = Zl(e)),
        (a.payload = { element: l }),
        (u = u === void 0 ? null : u),
        u !== null && (a.callback = u),
        (l = kl(t, a, e)),
        l !== null && (he(l, t, e), ou(l, t, e)));
    }
    function xr(t, e) {
      if (((t = t.memoizedState), t !== null && t.dehydrated !== null)) {
        var l = t.retryLane;
        t.retryLane = l !== 0 && l < e ? l : e;
      }
    }
    function If(t, e) {
      (xr(t, e), (t = t.alternate) && xr(t, e));
    }
    function N2(t) {
      if (t.tag === 13 || t.tag === 31) {
        var e = Ra(t, 67108864);
        (e !== null && he(e, t, 67108864), If(t, 67108864));
      }
    }
    function Mr(t) {
      if (t.tag === 13 || t.tag === 31) {
        var e = Ce();
        e = lf(e);
        var l = Ra(t, e);
        (l !== null && he(l, t, e), If(t, e));
      }
    }
    var Mn = !0;
    function lg(t, e, l, a) {
      var n = J.T;
      J.T = null;
      var u = st.p;
      try {
        ((st.p = 2), $f(t, e, l, a));
      } finally {
        ((st.p = u), (J.T = n));
      }
    }
    function ag(t, e, l, a) {
      var n = J.T;
      J.T = null;
      var u = st.p;
      try {
        ((st.p = 8), $f(t, e, l, a));
      } finally {
        ((st.p = u), (J.T = n));
      }
    }
    function $f(t, e, l, a) {
      if (Mn) {
        var n = $o(a);
        if (n === null) (L0(t, e, a, pc, l), wr(t, a));
        else if (ug(n, t, e, l, a)) a.stopPropagation();
        else if ((wr(t, a), e & 4 && -1 < ng.indexOf(t))) {
          for (; n !== null;) {
            var u = _n(n);
            if (u !== null)
              switch (u.tag) {
                case 3:
                  if (((u = u.stateNode), u.current.memoizedState.isDehydrated)) {
                    var i = ha(u.pendingLanes);
                    if (i !== 0) {
                      var c = u;
                      for (c.pendingLanes |= 2, c.entangledLanes |= 2; i;) {
                        var f = 1 << (31 - ze(i));
                        ((c.entanglements[1] |= f), (i &= ~f));
                      }
                      (ol(u), (ft & 6) === 0 && ((dc = Ee() + 500), Vu(0, !1)));
                    }
                  }
                  break;
                case 31:
                case 13:
                  ((c = Ra(u, 2)), c !== null && he(c, u, 2), Oc(), If(u, 2));
              }
            if (((u = $o(a)), u === null && L0(t, e, a, pc, l), u === n)) break;
            n = u;
          }
          n !== null && a.stopPropagation();
        } else L0(t, e, a, null, l);
      }
    }
    function $o(t) {
      return ((t = uf(t)), Wf(t));
    }
    var pc = null;
    function Wf(t) {
      if (((pc = null), (t = ya(t)), t !== null)) {
        var e = Ou(t);
        if (e === null) t = null;
        else {
          var l = e.tag;
          if (l === 13) {
            if (((t = Rr(e)), t !== null)) return t;
            t = null;
          } else if (l === 31) {
            if (((t = Hr(e)), t !== null)) return t;
            t = null;
          } else if (l === 3) {
            if (e.stateNode.current.memoizedState.isDehydrated)
              return e.tag === 3 ? e.stateNode.containerInfo : null;
            t = null;
          } else e !== t && (t = null);
        }
      }
      return ((pc = t), null);
    }
    function _2(t) {
      switch (t) {
        case "beforetoggle":
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "seeked":
        case "submit":
        case "toggle":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "fullscreenerror":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return 2;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "resize":
        case "scroll":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return 8;
        case "message":
          switch (gv()) {
            case Gr:
              return 2;
            case Vr:
              return 8;
            case ki:
            case bv:
              return 32;
            case Qr:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var Wo = !1,
      Il = null,
      $l = null,
      Wl = null,
      Du = new Map(),
      Bu = new Map(),
      Ul = [],
      ng =
        "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
          " ",
        );
    function wr(t, e) {
      switch (t) {
        case "focusin":
        case "focusout":
          Il = null;
          break;
        case "dragenter":
        case "dragleave":
          $l = null;
          break;
        case "mouseover":
        case "mouseout":
          Wl = null;
          break;
        case "pointerover":
        case "pointerout":
          Du.delete(e.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          Bu.delete(e.pointerId);
      }
    }
    function $n(t, e, l, a, n, u) {
      return t === null || t.nativeEvent !== u
        ? ((t = {
            blockedOn: e,
            domEventName: l,
            eventSystemFlags: a,
            nativeEvent: u,
            targetContainers: [n],
          }),
          e !== null && ((e = _n(e)), e !== null && N2(e)),
          t)
        : ((t.eventSystemFlags |= a),
          (e = t.targetContainers),
          n !== null && e.indexOf(n) === -1 && e.push(n),
          t);
    }
    function ug(t, e, l, a, n) {
      switch (e) {
        case "focusin":
          return ((Il = $n(Il, t, e, l, a, n)), !0);
        case "dragenter":
          return (($l = $n($l, t, e, l, a, n)), !0);
        case "mouseover":
          return ((Wl = $n(Wl, t, e, l, a, n)), !0);
        case "pointerover":
          var u = n.pointerId;
          return (Du.set(u, $n(Du.get(u) || null, t, e, l, a, n)), !0);
        case "gotpointercapture":
          return ((u = n.pointerId), Bu.set(u, $n(Bu.get(u) || null, t, e, l, a, n)), !0);
      }
      return !1;
    }
    function D2(t) {
      var e = ya(t.target);
      if (e !== null) {
        var l = Ou(e);
        if (l !== null) {
          if (((e = l.tag), e === 13)) {
            if (((e = Rr(l)), e !== null)) {
              ((t.blockedOn = e),
                td(t.priority, function () {
                  Mr(l);
                }));
              return;
            }
          } else if (e === 31) {
            if (((e = Hr(l)), e !== null)) {
              ((t.blockedOn = e),
                td(t.priority, function () {
                  Mr(l);
                }));
              return;
            }
          } else if (e === 3 && l.stateNode.current.memoizedState.isDehydrated) {
            t.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
            return;
          }
        }
      }
      t.blockedOn = null;
    }
    function Vi(t) {
      if (t.blockedOn !== null) return !1;
      for (var e = t.targetContainers; 0 < e.length;) {
        var l = $o(t.nativeEvent);
        if (l === null) {
          l = t.nativeEvent;
          var a = new l.constructor(l.type, l);
          ((to = a), l.target.dispatchEvent(a), (to = null));
        } else return ((e = _n(l)), e !== null && N2(e), (t.blockedOn = l), !1);
        e.shift();
      }
      return !0;
    }
    function Nr(t, e, l) {
      Vi(t) && l.delete(e);
    }
    function ig() {
      ((Wo = !1),
        Il !== null && Vi(Il) && (Il = null),
        $l !== null && Vi($l) && ($l = null),
        Wl !== null && Vi(Wl) && (Wl = null),
        Du.forEach(Nr),
        Bu.forEach(Nr));
    }
    function Ei(t, e) {
      t.blockedOn === e &&
        ((t.blockedOn = null),
        Wo || ((Wo = !0), qt.unstable_scheduleCallback(qt.unstable_NormalPriority, ig)));
    }
    var Ti = null;
    function _r(t) {
      Ti !== t &&
        ((Ti = t),
        qt.unstable_scheduleCallback(qt.unstable_NormalPriority, function () {
          Ti === t && (Ti = null);
          for (var e = 0; e < t.length; e += 3) {
            var l = t[e],
              a = t[e + 1],
              n = t[e + 2];
            if (typeof a != "function") {
              if (Wf(a || l) === null) continue;
              break;
            }
            var u = _n(l);
            u !== null &&
              (t.splice(e, 3),
              (e -= 3),
              po(u, { pending: !0, data: n, method: l.method, action: a }, a, n));
          }
        }));
    }
    function wn(t) {
      function e(f) {
        return Ei(f, t);
      }
      (Il !== null && Ei(Il, t),
        $l !== null && Ei($l, t),
        Wl !== null && Ei(Wl, t),
        Du.forEach(e),
        Bu.forEach(e));
      for (var l = 0; l < Ul.length; l++) {
        var a = Ul[l];
        a.blockedOn === t && (a.blockedOn = null);
      }
      for (; 0 < Ul.length && ((l = Ul[0]), l.blockedOn === null);)
        (D2(l), l.blockedOn === null && Ul.shift());
      if (((l = (t.ownerDocument || t).$$reactFormReplay), l != null))
        for (a = 0; a < l.length; a += 3) {
          var n = l[a],
            u = l[a + 1],
            i = n[ve] || null;
          if (typeof u == "function") i || _r(l);
          else if (i) {
            var c = null;
            if (u && u.hasAttribute("formAction")) {
              if (((n = u), (i = u[ve] || null))) c = i.formAction;
              else if (Wf(n) !== null) continue;
            } else c = i.action;
            (typeof c == "function" ? (l[a + 1] = c) : (l.splice(a, 3), (a -= 3)), _r(l));
          }
        }
    }
    function B2() {
      function t(u) {
        u.canIntercept &&
          u.info === "react-transition" &&
          u.intercept({
            handler: function () {
              return new Promise(function (i) {
                return (n = i);
              });
            },
            focusReset: "manual",
            scroll: "manual",
          });
      }
      function e() {
        (n !== null && (n(), (n = null)), a || setTimeout(l, 20));
      }
      function l() {
        if (!a && !navigation.transition) {
          var u = navigation.currentEntry;
          u &&
            u.url != null &&
            navigation.navigate(u.url, {
              state: u.getState(),
              info: "react-transition",
              history: "replace",
            });
        }
      }
      if (typeof navigation == "object") {
        var a = !1,
          n = null;
        return (
          navigation.addEventListener("navigate", t),
          navigation.addEventListener("navigatesuccess", e),
          navigation.addEventListener("navigateerror", e),
          setTimeout(l, 100),
          function () {
            ((a = !0),
              navigation.removeEventListener("navigate", t),
              navigation.removeEventListener("navigatesuccess", e),
              navigation.removeEventListener("navigateerror", e),
              n !== null && (n(), (n = null)));
          }
        );
      }
    }
    function Pf(t) {
      this._internalRoot = t;
    }
    Uc.prototype.render = Pf.prototype.render = function (t) {
      var e = this._internalRoot;
      if (e === null) throw Error(C(409));
      var l = e.current,
        a = Ce();
      w2(l, a, t, e, null, null);
    };
    Uc.prototype.unmount = Pf.prototype.unmount = function () {
      var t = this._internalRoot;
      if (t !== null) {
        this._internalRoot = null;
        var e = t.containerInfo;
        (w2(t.current, 2, null, t, null, null), Oc(), (e[Nn] = null));
      }
    };
    function Uc(t) {
      this._internalRoot = t;
    }
    Uc.prototype.unstable_scheduleHydration = function (t) {
      if (t) {
        var e = Jr();
        t = { blockedOn: null, target: t, priority: e };
        for (var l = 0; l < Ul.length && e !== 0 && e < Ul[l].priority; l++);
        (Ul.splice(l, 0, t), l === 0 && D2(t));
      }
    };
    var Dr = Br.version;
    if (Dr !== "19.3.0") throw Error(C(527, Dr, "19.3.0"));
    st.findDOMNode = function (t) {
      var e = t._reactInternals;
      if (e === void 0)
        throw typeof t.render == "function"
          ? Error(C(188))
          : ((t = Object.keys(t).join(",")), Error(C(268, t)));
      return (
        (t = cv(e)),
        (t = t !== null ? Ur(t) : null),
        (t = t === null ? null : t.stateNode),
        t
      );
    };
    var cg = {
      bundleType: 0,
      version: "19.3.0",
      rendererPackageName: "react-dom",
      currentDispatcherRef: J,
      reconcilerVersion: "19.3.0",
    };
    if (
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" &&
      ((Wn = __REACT_DEVTOOLS_GLOBAL_HOOK__), !Wn.isDisabled && Wn.supportsFiber)
    )
      try {
        ((Ru = Wn.inject(cg)), (Te = Wn));
      } catch {}
    var Wn;
    Lc.createRoot = function (t, e) {
      if (!Or(t)) throw Error(C(299));
      var l = !1,
        a = "",
        n = rh,
        u = hh,
        i = mh;
      return (
        e != null &&
          (e.unstable_strictMode === !0 && (l = !0),
          e.identifierPrefix !== void 0 && (a = e.identifierPrefix),
          e.onUncaughtError !== void 0 && (n = e.onUncaughtError),
          e.onCaughtError !== void 0 && (u = e.onCaughtError),
          e.onRecoverableError !== void 0 && (i = e.onRecoverableError)),
        (e = x2(t, 1, !1, null, null, l, a, null, n, u, i, B2)),
        (t[Nn] = e.current),
        Xf(t),
        new Pf(e)
      );
    };
    Lc.hydrateRoot = function (t, e, l) {
      if (!Or(t)) throw Error(C(299));
      var a = !1,
        n = "",
        u = rh,
        i = hh,
        c = mh,
        f = null;
      return (
        l != null &&
          (l.unstable_strictMode === !0 && (a = !0),
          l.identifierPrefix !== void 0 && (n = l.identifierPrefix),
          l.onUncaughtError !== void 0 && (u = l.onUncaughtError),
          l.onCaughtError !== void 0 && (i = l.onCaughtError),
          l.onRecoverableError !== void 0 && (c = l.onRecoverableError),
          l.formState !== void 0 && (f = l.formState)),
        (e = x2(t, 1, !0, e, l ?? null, a, n, f, u, i, c, B2)),
        (e.context = M2(null)),
        (l = e.current),
        (a = Ce()),
        (a = lf(a)),
        (n = Zl(a)),
        (n.callback = null),
        kl(l, n, a),
        (l = a),
        (e.current.lanes = l),
        Uu(e, l),
        ol(e),
        (t[Nn] = e.current),
        Xf(t),
        new Uc(e)
      );
    };
    Lc.version = "19.3.0";
  });
  var U2 = Ke((Mg, H2) => {
    "use strict";
    function R2() {
      if (!(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      ))
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(R2);
        } catch (t) {
          console.error(t);
        }
    }
    (R2(), (H2.exports = O2()));
  });
  var q2 = Ke((qc) => {
    "use strict";
    var og = Symbol.for("react.transitional.element"),
      fg = Symbol.for("react.fragment");
    function L2(t, e, l) {
      var a = null;
      if ((l !== void 0 && (a = "" + l), e.key !== void 0 && (a = "" + e.key), "key" in e)) {
        l = {};
        for (var n in e) n !== "key" && (l[n] = e[n]);
      } else l = e;
      return (
        (e = l.ref),
        { $$typeof: og, type: t, key: a, ref: e !== void 0 ? e : null, props: l }
      );
    }
    qc.Fragment = fg;
    qc.jsx = L2;
    qc.jsxs = L2;
  });
  var Zu = Ke((Ng, Y2) => {
    "use strict";
    Y2.exports = q2();
  });
  var Dg = sa(Vn()),
    F2 = sa(U2());
  var k = sa(Vn()),
    o = sa(Zu()),
    K2 = typeof window < "u" && !!window.storage,
    Un = K2
      ? window.storage
      : typeof window < "u"
        ? {
            get: async (t) => {
              let e = window.localStorage.getItem(t);
              if (e === null) throw new Error("not found");
              return { value: e };
            },
            set: async (t, e) => (window.localStorage.setItem(t, String(e)), { key: t }),
          }
        : null;
  function j2(t) {
    let e = [],
      l = [],
      a = "",
      n = !1;
    for (let i = 0; i < t.length; i++) {
      let c = t[i];
      n
        ? c === '"'
          ? t[i + 1] === '"'
            ? ((a += '"'), i++)
            : (n = !1)
          : (a += c)
        : c === '"'
          ? (n = !0)
          : c === ","
            ? (l.push(a), (a = ""))
            : c ===
                `
`
              ? (l.push(a), e.push(l), (l = []), (a = ""))
              : c !== "\r" && (a += c);
    }
    (a || l.length) && (l.push(a), e.push(l));
    let u = e[0];
    return e
      .slice(1)
      .filter((i) => i.length === u.length)
      .map((i) => Object.fromEntries(u.map((c, f) => [c, i[f]])));
  }
  function sg(t) {
    let u = {},
      i = (m) => (u[m] === void 0 ? 1500 : u[m]),
      c = null,
      f = t.filter((m) => m.home_score !== "" && m.away_score !== "");
    f.sort(
      (m, g) => m.season - g.season || (m.gameday < g.gameday ? -1 : m.gameday > g.gameday ? 1 : 0),
    );
    for (let m of f) {
      let g = Number(m.season);
      if (g !== c) {
        if (c !== null) for (let F in u) u[F] += 0.33 * (1500 - u[F]);
        c = g;
      }
      let A = m.home_team,
        v = m.away_team,
        p = Number(m.home_score),
        x = Number(m.away_score),
        R = i(A) + 48 - i(v),
        j = 1 / (1 + Math.pow(10, -R / 400)),
        r = p > x ? 1 : p === x ? 0.5 : 0,
        h = p - x,
        y = p > x ? R : -R,
        _ = 20 * (h !== 0 ? Math.log(Math.abs(h) + 1) * (2.2 / (y * 0.001 + 2.2)) : 1) * (r - j);
      ((u[A] = i(A) + _), (u[v] = i(v) - _));
    }
    return u;
  }
  var Ml = {
      teams: {
        ARI: {
          elo: 1336.4,
          off_epa: -0.0216,
          def_epa: 0.1396,
          cpoe: -1.828,
          qb: -0.0251,
          qb_new: 0,
        },
        ATL: { elo: 1457.4, off_epa: 0.0338, def_epa: 0.0016, cpoe: -2.11, qb: 0.0649, qb_new: 0 },
        BAL: { elo: 1562, off_epa: 0.0986, def_epa: -0.0091, cpoe: 4.724, qb: 0.1148, qb_new: 0 },
        BUF: { elo: 1653.2, off_epa: 0.1333, def_epa: -0.0471, cpoe: 5.707, qb: 0.1183, qb_new: 0 },
        CAR: { elo: 1393.8, off_epa: -0.0751, def_epa: 0.048, cpoe: 3.394, qb: -0.066, qb_new: 0 },
        CHI: { elo: 1541.7, off_epa: 0.0937, def_epa: 0.0756, cpoe: -2.696, qb: 0.0974, qb_new: 0 },
        CIN: { elo: 1467.3, off_epa: 0.0889, def_epa: 0.0882, cpoe: 4.458, qb: 0.1395, qb_new: 0 },
        CLE: {
          elo: 1381.4,
          off_epa: -0.2014,
          def_epa: -0.0946,
          cpoe: -2.663,
          qb: -0.1502,
          qb_new: 0,
        },
        DAL: { elo: 1433.6, off_epa: 0.091, def_epa: 0.1925, cpoe: -0.396, qb: 0.1262, qb_new: 0 },
        DEN: {
          elo: 1659.5,
          off_epa: 0.0161,
          def_epa: -0.0842,
          cpoe: -1.852,
          qb: 0.0808,
          qb_new: 0,
        },
        DET: { elo: 1579.5, off_epa: 0.0085, def_epa: 0.0279, cpoe: -1.848, qb: 0.1448, qb_new: 0 },
        GB: { elo: 1536.3, off_epa: 0.032, def_epa: 0.0614, cpoe: 2.657, qb: 0.2662, qb_new: 0 },
        HOU: {
          elo: 1654.5,
          off_epa: -0.0189,
          def_epa: -0.1804,
          cpoe: -2.607,
          qb: -0.026,
          qb_new: 0,
        },
        IND: {
          elo: 1446.6,
          off_epa: -0.0376,
          def_epa: 0.0626,
          cpoe: -2.798,
          qb: 0.0368,
          qb_new: 0,
        },
        JAX: { elo: 1599, off_epa: 0.0818, def_epa: -0.1713, cpoe: 3.031, qb: 0.1666, qb_new: 0 },
        KC: { elo: 1483.7, off_epa: -0.0696, def_epa: 0.01, cpoe: -3.146, qb: 0.048, qb_new: 0 },
        LA: { elo: 1660.2, off_epa: 0.1161, def_epa: -0.0032, cpoe: -2.78, qb: 0.2285, qb_new: 0 },
        LAC: {
          elo: 1536.1,
          off_epa: -0.1006,
          def_epa: -0.1306,
          cpoe: -0.023,
          qb: -0.0334,
          qb_new: 0,
        },
        LV: { elo: 1272.7, off_epa: -0.2156, def_epa: 0.0534, cpoe: 2.311, qb: -0.1307, qb_new: 0 },
        MIA: { elo: 1432.9, off_epa: 0.0247, def_epa: 0.0412, cpoe: 1.899, qb: 0.043, qb_new: 0 },
        MIN: {
          elo: 1576.2,
          off_epa: -0.138,
          def_epa: -0.1837,
          cpoe: -3.474,
          qb: -0.1737,
          qb_new: 0,
        },
        NE: { elo: 1638.7, off_epa: 0.0352, def_epa: -0.195, cpoe: 3.501, qb: 0.0233, qb_new: 0 },
        NO: { elo: 1405.7, off_epa: 0.007, def_epa: -0.1176, cpoe: 4.538, qb: 0.0886, qb_new: 0 },
        NYG: {
          elo: 1385.4,
          off_epa: 0.0012,
          def_epa: 0.0326,
          cpoe: -2.218,
          qb: -0.0717,
          qb_new: 0,
        },
        NYJ: {
          elo: 1290.2,
          off_epa: -0.1897,
          def_epa: 0.1783,
          cpoe: -6.082,
          qb: -0.2928,
          qb_new: 0,
        },
        PHI: { elo: 1581.6, off_epa: 0.0071, def_epa: -0.1306, cpoe: 2.444, qb: 0.0978, qb_new: 0 },
        PIT: {
          elo: 1512.1,
          off_epa: 0.0305,
          def_epa: 0.0093,
          cpoe: -0.991,
          qb: -0.0533,
          qb_new: 0,
        },
        SEA: { elo: 1761.4, off_epa: 0.0824, def_epa: -0.1427, cpoe: 5.25, qb: 0.141, qb_new: 0 },
        SF: { elo: 1582.9, off_epa: 0.0752, def_epa: 0.0644, cpoe: 6.078, qb: 0.0866, qb_new: 0 },
        TB: { elo: 1465.6, off_epa: -0.0085, def_epa: 0.0719, cpoe: -1.664, qb: 0.0244, qb_new: 0 },
        TEN: { elo: 1285, off_epa: -0.0896, def_epa: 0.0926, cpoe: -1.08, qb: -0.2108, qb_new: 0 },
        WAS: {
          elo: 1440.2,
          off_epa: -0.0125,
          def_epa: 0.1813,
          cpoe: -0.095,
          qb: 0.0053,
          qb_new: 0,
        },
      },
      model: {
        features: [
          "elo_diff",
          "qb_diff",
          "off_diff",
          "def_diff",
          "cpoe_diff",
          "rest_diff",
          "inj_diff",
          "qb_new_diff",
          "bye_diff",
          "tz_shift_away",
          "west_early_away",
        ],
        mean: [
          50.59475, 0.00141, 0.00204, 46e-5, -0.00415, -0.0025, 0.24564, -0.001, 0.00875, 0.88594,
          0.07204,
        ],
        scale: [
          134.1331, 0.19309, 0.12681, 0.10672, 5.18651, 2.53035, 5.9039, 0.32871, 0.33575, 0.96305,
          0.25855,
        ],
        coef: [
          0.49047, 0.24685, 0.03171, 0.08456, 0.06752, 0.00861, 0.16899, 0.07766, 0.05257, -0.06212,
          -0.02193,
        ],
        intercept: 0.25394,
        home_adv_elo: 48,
        qb_repl: -0.06,
      },
    },
    G2 = [
      { w: 1, d: "2026-09-09", t: "20:20", a: "NE", h: "SEA", rd: 0, dv: 0 },
      { w: 1, d: "2026-09-10", t: "20:35", a: "SF", h: "LA", rd: 0, dv: 1 },
      { w: 1, d: "2026-09-13", t: "13:00", a: "CHI", h: "CAR", rd: 0, dv: 0 },
      { w: 1, d: "2026-09-13", t: "13:00", a: "TB", h: "CIN", rd: 0, dv: 0 },
      { w: 1, d: "2026-09-13", t: "13:00", a: "NO", h: "DET", rd: 0, dv: 0 },
      { w: 1, d: "2026-09-13", t: "13:00", a: "BUF", h: "HOU", rd: 0, dv: 0 },
      { w: 1, d: "2026-09-13", t: "13:00", a: "BAL", h: "IND", rd: 0, dv: 0 },
      { w: 1, d: "2026-09-13", t: "13:00", a: "CLE", h: "JAX", rd: 0, dv: 0 },
      { w: 1, d: "2026-09-13", t: "13:00", a: "ATL", h: "PIT", rd: 0, dv: 0 },
      { w: 1, d: "2026-09-13", t: "13:00", a: "NYJ", h: "TEN", rd: 0, dv: 0 },
      { w: 1, d: "2026-09-13", t: "16:25", a: "ARI", h: "LAC", rd: 0, dv: 0 },
      { w: 1, d: "2026-09-13", t: "16:25", a: "MIA", h: "LV", rd: 0, dv: 0 },
      { w: 1, d: "2026-09-13", t: "16:25", a: "GB", h: "MIN", rd: 0, dv: 1 },
      { w: 1, d: "2026-09-13", t: "16:25", a: "WAS", h: "PHI", rd: 0, dv: 1 },
      { w: 1, d: "2026-09-13", t: "20:20", a: "DAL", h: "NYG", rd: 0, dv: 1 },
      { w: 1, d: "2026-09-14", t: "20:15", a: "DEN", h: "KC", rd: 0, dv: 1 },
      { w: 2, d: "2026-09-17", t: "20:15", a: "DET", h: "BUF", rd: 0, dv: 0 },
      { w: 2, d: "2026-09-20", t: "13:00", a: "CAR", h: "ATL", rd: 0, dv: 1 },
      { w: 2, d: "2026-09-20", t: "13:00", a: "NO", h: "BAL", rd: 0, dv: 0 },
      { w: 2, d: "2026-09-20", t: "13:00", a: "MIN", h: "CHI", rd: 0, dv: 1 },
      { w: 2, d: "2026-09-20", t: "13:00", a: "CIN", h: "HOU", rd: 0, dv: 0 },
      { w: 2, d: "2026-09-20", t: "13:00", a: "PIT", h: "NE", rd: 4, dv: 0 },
      { w: 2, d: "2026-09-20", t: "13:00", a: "GB", h: "NYJ", rd: 0, dv: 0 },
      { w: 2, d: "2026-09-20", t: "13:00", a: "CLE", h: "TB", rd: 0, dv: 0 },
      { w: 2, d: "2026-09-20", t: "13:00", a: "PHI", h: "TEN", rd: 0, dv: 0 },
      { w: 2, d: "2026-09-20", t: "16:05", a: "JAX", h: "DEN", rd: -1, dv: 0 },
      { w: 2, d: "2026-09-20", t: "16:05", a: "LV", h: "LAC", rd: 0, dv: 1 },
      { w: 2, d: "2026-09-20", t: "16:25", a: "SEA", h: "ARI", rd: -4, dv: 1 },
      { w: 2, d: "2026-09-20", t: "16:25", a: "WAS", h: "DAL", rd: 0, dv: 1 },
      { w: 2, d: "2026-09-20", t: "16:25", a: "MIA", h: "SF", rd: 3, dv: 0 },
      { w: 2, d: "2026-09-20", t: "20:20", a: "IND", h: "KC", rd: -1, dv: 0 },
      { w: 2, d: "2026-09-21", t: "20:15", a: "NYG", h: "LA", rd: 3, dv: 0 },
      { w: 3, d: "2026-09-24", t: "20:15", a: "ATL", h: "GB", rd: 0, dv: 0 },
      { w: 3, d: "2026-09-27", t: "13:00", a: "LAC", h: "BUF", rd: 3, dv: 0 },
      { w: 3, d: "2026-09-27", t: "13:00", a: "CAR", h: "CLE", rd: 0, dv: 0 },
      { w: 3, d: "2026-09-27", t: "13:00", a: "NYJ", h: "DET", rd: 3, dv: 0 },
      { w: 3, d: "2026-09-27", t: "13:00", a: "HOU", h: "IND", rd: 0, dv: 1 },
      { w: 3, d: "2026-09-27", t: "13:00", a: "NE", h: "JAX", rd: 0, dv: 0 },
      { w: 3, d: "2026-09-27", t: "13:00", a: "KC", h: "MIA", rd: 0, dv: 0 },
      { w: 3, d: "2026-09-27", t: "13:00", a: "TEN", h: "NYG", rd: -1, dv: 0 },
      { w: 3, d: "2026-09-27", t: "13:00", a: "CIN", h: "PIT", rd: 0, dv: 1 },
      { w: 3, d: "2026-09-27", t: "13:00", a: "SEA", h: "WAS", rd: 0, dv: 0 },
      { w: 3, d: "2026-09-27", t: "16:05", a: "ARI", h: "SF", rd: 0, dv: 1 },
      { w: 3, d: "2026-09-27", t: "16:05", a: "MIN", h: "TB", rd: 0, dv: 0 },
      { w: 3, d: "2026-09-27", t: "16:25", a: "BAL", h: "DAL", rd: 0, dv: 0 },
      { w: 3, d: "2026-09-27", t: "16:25", a: "LV", h: "NO", rd: 0, dv: 0 },
      { w: 3, d: "2026-09-27", t: "20:20", a: "LA", h: "DEN", rd: 1, dv: 0 },
      { w: 3, d: "2026-09-28", t: "20:15", a: "PHI", h: "CHI", rd: 0, dv: 0 },
      { w: 4, d: "2026-10-01", t: "20:15", a: "PIT", h: "CLE", rd: 0, dv: 1 },
      { w: 4, d: "2026-10-04", t: "09:30", a: "IND", h: "WAS", rd: 0, dv: 0 },
      { w: 4, d: "2026-10-04", t: "13:00", a: "TEN", h: "BAL", rd: 0, dv: 0 },
      { w: 4, d: "2026-10-04", t: "13:00", a: "NE", h: "BUF", rd: 0, dv: 1 },
      { w: 4, d: "2026-10-04", t: "13:00", a: "NYJ", h: "CHI", rd: -1, dv: 0 },
      { w: 4, d: "2026-10-04", t: "13:00", a: "JAX", h: "CIN", rd: 0, dv: 0 },
      { w: 4, d: "2026-10-04", t: "13:00", a: "DAL", h: "HOU", rd: 0, dv: 0 },
      { w: 4, d: "2026-10-04", t: "13:00", a: "ARI", h: "NYG", rd: 0, dv: 0 },
      { w: 4, d: "2026-10-04", t: "13:00", a: "LA", h: "PHI", rd: -1, dv: 0 },
      { w: 4, d: "2026-10-04", t: "13:00", a: "GB", h: "TB", rd: -3, dv: 0 },
      { w: 4, d: "2026-10-04", t: "16:05", a: "MIA", h: "MIN", rd: 0, dv: 0 },
      { w: 4, d: "2026-10-04", t: "16:25", a: "KC", h: "LV", rd: 0, dv: 1 },
      { w: 4, d: "2026-10-04", t: "16:25", a: "LAC", h: "SEA", rd: 0, dv: 0 },
      { w: 4, d: "2026-10-04", t: "16:25", a: "DEN", h: "SF", rd: 0, dv: 0 },
      { w: 4, d: "2026-10-04", t: "20:20", a: "DET", h: "CAR", rd: 0, dv: 0 },
      { w: 4, d: "2026-10-05", t: "20:15", a: "ATL", h: "NO", rd: -3, dv: 1 },
      { w: 5, d: "2026-10-08", t: "20:15", a: "TB", h: "DAL", rd: 0, dv: 0 },
      { w: 5, d: "2026-10-11", t: "09:30", a: "PHI", h: "JAX", rd: 0, dv: 0 },
      { w: 5, d: "2026-10-11", t: "13:00", a: "CIN", h: "MIA", rd: 0, dv: 0 },
      { w: 5, d: "2026-10-11", t: "13:00", a: "LV", h: "NE", rd: 0, dv: 0 },
      { w: 5, d: "2026-10-11", t: "13:00", a: "MIN", h: "NO", rd: -1, dv: 0 },
      { w: 5, d: "2026-10-11", t: "13:00", a: "CLE", h: "NYJ", rd: -3, dv: 0 },
      { w: 5, d: "2026-10-11", t: "13:00", a: "IND", h: "PIT", rd: 3, dv: 0 },
      { w: 5, d: "2026-10-11", t: "13:00", a: "HOU", h: "TEN", rd: 0, dv: 1 },
      { w: 5, d: "2026-10-11", t: "13:00", a: "NYG", h: "WAS", rd: 0, dv: 1 },
      { w: 5, d: "2026-10-11", t: "16:05", a: "DEN", h: "LAC", rd: 0, dv: 1 },
      { w: 5, d: "2026-10-11", t: "16:25", a: "DET", h: "ARI", rd: 0, dv: 0 },
      { w: 5, d: "2026-10-11", t: "16:25", a: "CHI", h: "GB", rd: 0, dv: 1 },
      { w: 5, d: "2026-10-11", t: "16:25", a: "SF", h: "SEA", rd: 0, dv: 1 },
      { w: 5, d: "2026-10-11", t: "20:20", a: "BAL", h: "ATL", rd: -1, dv: 0 },
      { w: 5, d: "2026-10-12", t: "20:15", a: "BUF", h: "LA", rd: 0, dv: 0 },
      { w: 6, d: "2026-10-15", t: "20:15", a: "SEA", h: "DEN", rd: 0, dv: 0 },
      { w: 6, d: "2026-10-18", t: "09:30", a: "HOU", h: "JAX", rd: 0, dv: 1 },
      { w: 6, d: "2026-10-18", t: "13:00", a: "CHI", h: "ATL", rd: 0, dv: 0 },
      { w: 6, d: "2026-10-18", t: "13:00", a: "BAL", h: "CLE", rd: 0, dv: 1 },
      { w: 6, d: "2026-10-18", t: "13:00", a: "TEN", h: "IND", rd: 0, dv: 1 },
      { w: 6, d: "2026-10-18", t: "13:00", a: "NYJ", h: "NE", rd: 0, dv: 1 },
      { w: 6, d: "2026-10-18", t: "13:00", a: "NO", h: "NYG", rd: 0, dv: 0 },
      { w: 6, d: "2026-10-18", t: "13:00", a: "CAR", h: "PHI", rd: -7, dv: 0 },
      { w: 6, d: "2026-10-18", t: "13:00", a: "PIT", h: "TB", rd: 3, dv: 0 },
      { w: 6, d: "2026-10-18", t: "16:05", a: "ARI", h: "LA", rd: -1, dv: 1 },
      { w: 6, d: "2026-10-18", t: "16:25", a: "LAC", h: "KC", rd: 7, dv: 1 },
      { w: 6, d: "2026-10-18", t: "16:25", a: "BUF", h: "LV", rd: 1, dv: 0 },
      { w: 6, d: "2026-10-18", t: "20:20", a: "DAL", h: "GB", rd: -3, dv: 0 },
      { w: 6, d: "2026-10-19", t: "20:15", a: "WAS", h: "SF", rd: 0, dv: 0 },
      { w: 7, d: "2026-10-22", t: "20:15", a: "NE", h: "CHI", rd: 0, dv: 0 },
      { w: 7, d: "2026-10-25", t: "09:30", a: "PIT", h: "NO", rd: 0, dv: 0 },
      { w: 7, d: "2026-10-25", t: "13:00", a: "SF", h: "ATL", rd: 1, dv: 0 },
      { w: 7, d: "2026-10-25", t: "13:00", a: "CIN", h: "BAL", rd: -7, dv: 1 },
      { w: 7, d: "2026-10-25", t: "13:00", a: "TB", h: "CAR", rd: 0, dv: 1 },
      { w: 7, d: "2026-10-25", t: "13:00", a: "NYG", h: "HOU", rd: 0, dv: 0 },
      { w: 7, d: "2026-10-25", t: "13:00", a: "IND", h: "MIN", rd: 7, dv: 0 },
      { w: 7, d: "2026-10-25", t: "13:00", a: "MIA", h: "NYJ", rd: -7, dv: 1 },
      { w: 7, d: "2026-10-25", t: "13:00", a: "CLE", h: "TEN", rd: 0, dv: 0 },
      { w: 7, d: "2026-10-25", t: "16:05", a: "DEN", h: "ARI", rd: -3, dv: 0 },
      { w: 7, d: "2026-10-25", t: "16:25", a: "GB", h: "DET", rd: 7, dv: 1 },
      { w: 7, d: "2026-10-25", t: "16:25", a: "LA", h: "LV", rd: 0, dv: 0 },
      { w: 7, d: "2026-10-25", t: "20:20", a: "KC", h: "SEA", rd: 3, dv: 0 },
      { w: 7, d: "2026-10-26", t: "20:15", a: "DAL", h: "PHI", rd: 0, dv: 1 },
      { w: 8, d: "2026-10-29", t: "20:15", a: "CAR", h: "GB", rd: 0, dv: 0 },
      { w: 8, d: "2026-11-01", t: "13:00", a: "BAL", h: "BUF", rd: 7, dv: 0 },
      { w: 8, d: "2026-11-01", t: "13:00", a: "TEN", h: "CIN", rd: 0, dv: 0 },
      { w: 8, d: "2026-11-01", t: "13:00", a: "ARI", h: "DAL", rd: -1, dv: 0 },
      { w: 8, d: "2026-11-01", t: "13:00", a: "MIN", h: "DET", rd: 0, dv: 1 },
      { w: 8, d: "2026-11-01", t: "13:00", a: "IND", h: "JAX", rd: 7, dv: 1 },
      { w: 8, d: "2026-11-01", t: "13:00", a: "LV", h: "NYJ", rd: 0, dv: 0 },
      { w: 8, d: "2026-11-01", t: "13:00", a: "CLE", h: "PIT", rd: 0, dv: 1 },
      { w: 8, d: "2026-11-01", t: "13:00", a: "ATL", h: "TB", rd: 0, dv: 1 },
      { w: 8, d: "2026-11-01", t: "16:05", a: "LAC", h: "LA", rd: -7, dv: 0 },
      { w: 8, d: "2026-11-01", t: "16:25", a: "KC", h: "DEN", rd: 0, dv: 1 },
      { w: 8, d: "2026-11-01", t: "16:25", a: "NE", h: "MIA", rd: -3, dv: 1 },
      { w: 8, d: "2026-11-01", t: "20:20", a: "PHI", h: "WAS", rd: 7, dv: 1 },
      { w: 8, d: "2026-11-02", t: "20:15", a: "CHI", h: "SEA", rd: -3, dv: 0 },
      { w: 9, d: "2026-11-05", t: "20:15", a: "JAX", h: "BAL", rd: 0, dv: 0 },
      { w: 9, d: "2026-11-08", t: "09:30", a: "CIN", h: "ATL", rd: 0, dv: 0 },
      { w: 9, d: "2026-11-08", t: "13:00", a: "DEN", h: "CAR", rd: 3, dv: 0 },
      { w: 9, d: "2026-11-08", t: "13:00", a: "DAL", h: "IND", rd: 0, dv: 0 },
      { w: 9, d: "2026-11-08", t: "13:00", a: "NYJ", h: "KC", rd: 0, dv: 0 },
      { w: 9, d: "2026-11-08", t: "13:00", a: "DET", h: "MIA", rd: 0, dv: 0 },
      { w: 9, d: "2026-11-08", t: "13:00", a: "CLE", h: "NO", rd: 7, dv: 0 },
      { w: 9, d: "2026-11-08", t: "13:00", a: "NYG", h: "PHI", rd: -7, dv: 1 },
      { w: 9, d: "2026-11-08", t: "13:00", a: "LA", h: "WAS", rd: 0, dv: 0 },
      { w: 9, d: "2026-11-08", t: "16:05", a: "HOU", h: "LAC", rd: -7, dv: 0 },
      { w: 9, d: "2026-11-08", t: "16:05", a: "LV", h: "SF", rd: 7, dv: 0 },
      { w: 9, d: "2026-11-08", t: "16:25", a: "GB", h: "NE", rd: -3, dv: 0 },
      { w: 9, d: "2026-11-08", t: "16:25", a: "ARI", h: "SEA", rd: -1, dv: 1 },
      { w: 9, d: "2026-11-08", t: "20:20", a: "TB", h: "CHI", rd: -1, dv: 0 },
      { w: 9, d: "2026-11-09", t: "20:15", a: "BUF", h: "MIN", rd: 0, dv: 0 },
      { w: 10, d: "2026-11-12", t: "20:15", a: "WAS", h: "NYG", rd: 0, dv: 1 },
      { w: 10, d: "2026-11-15", t: "09:30", a: "NE", h: "DET", rd: 0, dv: 0 },
      { w: 10, d: "2026-11-15", t: "13:00", a: "KC", h: "ATL", rd: 0, dv: 0 },
      { w: 10, d: "2026-11-15", t: "13:00", a: "HOU", h: "CLE", rd: 0, dv: 0 },
      { w: 10, d: "2026-11-15", t: "13:00", a: "MIN", h: "GB", rd: 1, dv: 1 },
      { w: 10, d: "2026-11-15", t: "13:00", a: "MIA", h: "IND", rd: 0, dv: 0 },
      { w: 10, d: "2026-11-15", t: "13:00", a: "CAR", h: "NO", rd: 0, dv: 1 },
      { w: 10, d: "2026-11-15", t: "13:00", a: "BUF", h: "NYJ", rd: 1, dv: 1 },
      { w: 10, d: "2026-11-15", t: "13:00", a: "JAX", h: "TEN", rd: 4, dv: 1 },
      { w: 10, d: "2026-11-15", t: "16:05", a: "LA", h: "ARI", rd: 0, dv: 1 },
      { w: 10, d: "2026-11-15", t: "16:05", a: "SEA", h: "LV", rd: 0, dv: 0 },
      { w: 10, d: "2026-11-15", t: "16:25", a: "SF", h: "DAL", rd: 0, dv: 0 },
      { w: 10, d: "2026-11-15", t: "20:20", a: "PIT", h: "CIN", rd: -7, dv: 1 },
      { w: 10, d: "2026-11-16", t: "20:15", a: "LAC", h: "BAL", rd: 3, dv: 0 },
      { w: 11, d: "2026-11-19", t: "20:15", a: "IND", h: "HOU", rd: 0, dv: 1 },
      { w: 11, d: "2026-11-22", t: "13:00", a: "MIA", h: "BUF", rd: 0, dv: 1 },
      { w: 11, d: "2026-11-22", t: "13:00", a: "BAL", h: "CAR", rd: 1, dv: 0 },
      { w: 11, d: "2026-11-22", t: "13:00", a: "NO", h: "CHI", rd: 7, dv: 0 },
      { w: 11, d: "2026-11-22", t: "13:00", a: "TEN", h: "DAL", rd: 0, dv: 0 },
      { w: 11, d: "2026-11-22", t: "13:00", a: "TB", h: "DET", rd: -7, dv: 0 },
      { w: 11, d: "2026-11-22", t: "13:00", a: "ARI", h: "KC", rd: 0, dv: 0 },
      { w: 11, d: "2026-11-22", t: "13:00", a: "JAX", h: "NYG", rd: 3, dv: 0 },
      { w: 11, d: "2026-11-22", t: "16:05", a: "NYJ", h: "LAC", rd: -1, dv: 0 },
      { w: 11, d: "2026-11-22", t: "16:25", a: "LV", h: "DEN", rd: 7, dv: 1 },
      { w: 11, d: "2026-11-22", t: "16:25", a: "PIT", h: "PHI", rd: 7, dv: 0 },
      { w: 11, d: "2026-11-22", t: "20:20", a: "MIN", h: "SF", rd: 0, dv: 0 },
      { w: 11, d: "2026-11-23", t: "20:15", a: "CIN", h: "WAS", rd: 3, dv: 0 },
      { w: 12, d: "2026-11-25", t: "20:00", a: "GB", h: "LA", rd: 0, dv: 0 },
      { w: 12, d: "2026-11-26", t: "13:00", a: "CHI", h: "DET", rd: 0, dv: 1 },
      { w: 12, d: "2026-11-26", t: "16:30", a: "PHI", h: "DAL", rd: 0, dv: 1 },
      { w: 12, d: "2026-11-26", t: "20:20", a: "KC", h: "BUF", rd: 0, dv: 0 },
      { w: 12, d: "2026-11-27", t: "15:00", a: "DEN", h: "PIT", rd: 0, dv: 0 },
      { w: 12, d: "2026-11-29", t: "13:00", a: "NO", h: "CIN", rd: -1, dv: 0 },
      { w: 12, d: "2026-11-29", t: "13:00", a: "LV", h: "CLE", rd: 7, dv: 0 },
      { w: 12, d: "2026-11-29", t: "13:00", a: "BAL", h: "HOU", rd: 3, dv: 0 },
      { w: 12, d: "2026-11-29", t: "13:00", a: "NYG", h: "IND", rd: 3, dv: 0 },
      { w: 12, d: "2026-11-29", t: "13:00", a: "NYJ", h: "MIA", rd: 0, dv: 1 },
      { w: 12, d: "2026-11-29", t: "13:00", a: "ATL", h: "MIN", rd: -7, dv: 0 },
      { w: 12, d: "2026-11-29", t: "16:05", a: "TEN", h: "JAX", rd: 0, dv: 1 },
      { w: 12, d: "2026-11-29", t: "16:25", a: "WAS", h: "ARI", rd: 1, dv: 0 },
      { w: 12, d: "2026-11-29", t: "16:25", a: "SEA", h: "SF", rd: -7, dv: 1 },
      { w: 12, d: "2026-11-29", t: "20:20", a: "NE", h: "LAC", rd: -7, dv: 0 },
      { w: 12, d: "2026-11-30", t: "20:15", a: "CAR", h: "TB", rd: 0, dv: 1 },
      { w: 13, d: "2026-12-03", t: "20:15", a: "KC", h: "LA", rd: 1, dv: 0 },
      { w: 13, d: "2026-12-06", t: "13:00", a: "DET", h: "ATL", rd: -3, dv: 0 },
      { w: 13, d: "2026-12-06", t: "13:00", a: "JAX", h: "CHI", rd: 3, dv: 0 },
      { w: 13, d: "2026-12-06", t: "13:00", a: "CIN", h: "CLE", rd: 0, dv: 1 },
      { w: 13, d: "2026-12-06", t: "13:00", a: "GB", h: "NO", rd: -4, dv: 0 },
      { w: 13, d: "2026-12-06", t: "13:00", a: "SF", h: "NYG", rd: 0, dv: 0 },
      { w: 13, d: "2026-12-06", t: "13:00", a: "LAC", h: "TB", rd: -1, dv: 0 },
      { w: 13, d: "2026-12-06", t: "13:00", a: "WAS", h: "TEN", rd: 0, dv: 0 },
      { w: 13, d: "2026-12-06", t: "16:05", a: "PHI", h: "ARI", rd: -3, dv: 0 },
      { w: 13, d: "2026-12-06", t: "16:05", a: "MIA", h: "DEN", rd: 2, dv: 0 },
      { w: 13, d: "2026-12-06", t: "16:25", a: "CAR", h: "MIN", rd: 1, dv: 0 },
      { w: 13, d: "2026-12-06", t: "16:25", a: "BUF", h: "NE", rd: -3, dv: 1 },
      { w: 13, d: "2026-12-06", t: "20:20", a: "HOU", h: "PIT", rd: 2, dv: 0 },
      { w: 13, d: "2026-12-07", t: "20:15", a: "DAL", h: "SEA", rd: -3, dv: 0 },
      { w: 14, d: "2026-12-10", t: "20:15", a: "MIN", h: "NE", rd: 0, dv: 0 },
      { w: 14, d: "2026-12-13", t: "13:00", a: "TB", h: "BAL", rd: 7, dv: 0 },
      { w: 14, d: "2026-12-13", t: "13:00", a: "NO", h: "CAR", rd: 0, dv: 1 },
      { w: 14, d: "2026-12-13", t: "13:00", a: "ATL", h: "CLE", rd: 0, dv: 0 },
      { w: 14, d: "2026-12-13", t: "13:00", a: "TEN", h: "DET", rd: 0, dv: 0 },
      { w: 14, d: "2026-12-13", t: "13:00", a: "CHI", h: "MIA", rd: 0, dv: 0 },
      { w: 14, d: "2026-12-13", t: "13:00", a: "DEN", h: "NYJ", rd: 7, dv: 0 },
      { w: 14, d: "2026-12-13", t: "13:00", a: "IND", h: "PHI", rd: -7, dv: 0 },
      { w: 14, d: "2026-12-13", t: "13:00", a: "HOU", h: "WAS", rd: 0, dv: 0 },
      { w: 14, d: "2026-12-13", t: "16:05", a: "LAC", h: "LV", rd: 7, dv: 1 },
      { w: 14, d: "2026-12-13", t: "16:25", a: "KC", h: "CIN", rd: -3, dv: 0 },
      { w: 14, d: "2026-12-13", t: "16:25", a: "NYG", h: "SEA", rd: -1, dv: 0 },
      { w: 14, d: "2026-12-13", t: "16:25", a: "LA", h: "SF", rd: -3, dv: 1 },
      { w: 14, d: "2026-12-13", t: "20:20", a: "BUF", h: "GB", rd: 0, dv: 0 },
      { w: 14, d: "2026-12-14", t: "20:15", a: "PIT", h: "JAX", rd: 0, dv: 0 },
      { w: 15, d: "2026-12-17", t: "20:15", a: "SF", h: "LAC", rd: 0, dv: 0 },
      { w: 15, d: "2026-12-19", t: "17:00", a: "SEA", h: "PHI", rd: 0, dv: 0 },
      { w: 15, d: "2026-12-19", t: "20:20", a: "CHI", h: "BUF", rd: 0, dv: 0 },
      { w: 15, d: "2026-12-20", t: "13:00", a: "CIN", h: "CAR", rd: 0, dv: 0 },
      { w: 15, d: "2026-12-20", t: "13:00", a: "MIA", h: "GB", rd: 0, dv: 0 },
      { w: 15, d: "2026-12-20", t: "13:00", a: "JAX", h: "HOU", rd: 1, dv: 1 },
      { w: 15, d: "2026-12-20", t: "13:00", a: "CLE", h: "NYG", rd: 0, dv: 0 },
      { w: 15, d: "2026-12-20", t: "13:00", a: "BAL", h: "PIT", rd: -1, dv: 1 },
      { w: 15, d: "2026-12-20", t: "13:00", a: "NO", h: "TB", rd: 0, dv: 1 },
      { w: 15, d: "2026-12-20", t: "13:00", a: "IND", h: "TEN", rd: 0, dv: 1 },
      { w: 15, d: "2026-12-20", t: "13:00", a: "ATL", h: "WAS", rd: 0, dv: 0 },
      { w: 15, d: "2026-12-20", t: "16:05", a: "NYJ", h: "ARI", rd: 7, dv: 0 },
      { w: 15, d: "2026-12-20", t: "16:25", a: "DAL", h: "LA", rd: -6, dv: 0 },
      { w: 15, d: "2026-12-20", t: "16:25", a: "DEN", h: "LV", rd: 0, dv: 1 },
      { w: 15, d: "2026-12-20", t: "20:20", a: "DET", h: "MIN", rd: 3, dv: 1 },
      { w: 15, d: "2026-12-21", t: "20:15", a: "NE", h: "KC", rd: -3, dv: 0 },
      { w: 16, d: "2026-12-24", t: "20:15", a: "HOU", h: "PHI", rd: 1, dv: 0 },
      { w: 16, d: "2026-12-25", t: "13:00", a: "GB", h: "CHI", rd: 1, dv: 1 },
      { w: 16, d: "2026-12-25", t: "16:30", a: "BUF", h: "DEN", rd: -1, dv: 0 },
      { w: 16, d: "2026-12-25", t: "20:15", a: "LA", h: "SEA", rd: 1, dv: 1 },
      { w: 16, d: "2026-12-27", t: "13:00", a: "TB", h: "ATL", rd: 0, dv: 1 },
      { w: 16, d: "2026-12-27", t: "13:00", a: "CLE", h: "BAL", rd: 0, dv: 1 },
      { w: 16, d: "2026-12-27", t: "13:00", a: "CIN", h: "IND", rd: 0, dv: 0 },
      { w: 16, d: "2026-12-27", t: "13:00", a: "LAC", h: "MIA", rd: -3, dv: 0 },
      { w: 16, d: "2026-12-27", t: "13:00", a: "WAS", h: "MIN", rd: 0, dv: 0 },
      { w: 16, d: "2026-12-27", t: "13:00", a: "ARI", h: "NO", rd: 0, dv: 0 },
      { w: 16, d: "2026-12-27", t: "13:00", a: "NE", h: "NYJ", rd: 1, dv: 1 },
      { w: 16, d: "2026-12-27", t: "13:00", a: "CAR", h: "PIT", rd: 0, dv: 0 },
      { w: 16, d: "2026-12-27", t: "16:05", a: "TEN", h: "LV", rd: 0, dv: 0 },
      { w: 16, d: "2026-12-27", t: "16:25", a: "SF", h: "KC", rd: -4, dv: 0 },
      { w: 16, d: "2026-12-27", t: "20:20", a: "JAX", h: "DAL", rd: 0, dv: 0 },
      { w: 16, d: "2026-12-28", t: "20:15", a: "NYG", h: "DET", rd: 0, dv: 0 },
      { w: 17, d: "2026-12-31", t: "20:15", a: "BAL", h: "CIN", rd: 0, dv: 1 },
      { w: 17, d: "2027-01-03", t: "13:00", a: "NO", h: "ATL", rd: 0, dv: 1 },
      { w: 17, d: "2027-01-03", t: "13:00", a: "SEA", h: "CAR", rd: -2, dv: 0 },
      { w: 17, d: "2027-01-03", t: "13:00", a: "IND", h: "CLE", rd: 0, dv: 0 },
      { w: 17, d: "2027-01-03", t: "13:00", a: "NYG", h: "DAL", rd: 1, dv: 1 },
      { w: 17, d: "2027-01-03", t: "13:00", a: "WAS", h: "JAX", rd: 0, dv: 0 },
      { w: 17, d: "2027-01-03", t: "13:00", a: "KC", h: "LAC", rd: 0, dv: 1 },
      { w: 17, d: "2027-01-03", t: "13:00", a: "BUF", h: "MIA", rd: -2, dv: 1 },
      { w: 17, d: "2027-01-03", t: "13:00", a: "DEN", h: "NE", rd: -2, dv: 0 },
      { w: 17, d: "2027-01-03", t: "13:00", a: "MIN", h: "NYJ", rd: 0, dv: 0 },
      { w: 17, d: "2027-01-03", t: "13:00", a: "LA", h: "TB", rd: -2, dv: 0 },
      { w: 17, d: "2027-01-03", t: "13:00", a: "PIT", h: "TEN", rd: 0, dv: 0 },
      { w: 17, d: "2027-01-03", t: "16:05", a: "LV", h: "ARI", rd: 0, dv: 0 },
      { w: 17, d: "2027-01-03", t: "16:25", a: "DET", h: "CHI", rd: 3, dv: 1 },
      { w: 17, d: "2027-01-03", t: "20:20", a: "PHI", h: "SF", rd: -3, dv: 0 },
      { w: 17, d: "2027-01-04", t: "20:15", a: "HOU", h: "GB", rd: -1, dv: 0 },
      { w: 18, d: "2027-01-10", t: "13:00", a: "SF", h: "ARI", rd: 0, dv: 1 },
      { w: 18, d: "2027-01-10", t: "13:00", a: "PIT", h: "BAL", rd: 3, dv: 1 },
      { w: 18, d: "2027-01-10", t: "13:00", a: "NYJ", h: "BUF", rd: 0, dv: 1 },
      { w: 18, d: "2027-01-10", t: "13:00", a: "ATL", h: "CAR", rd: 0, dv: 1 },
      { w: 18, d: "2027-01-10", t: "13:00", a: "CLE", h: "CIN", rd: 3, dv: 1 },
      { w: 18, d: "2027-01-10", t: "13:00", a: "LAC", h: "DEN", rd: 0, dv: 1 },
      { w: 18, d: "2027-01-10", t: "13:00", a: "DET", h: "GB", rd: -1, dv: 1 },
      { w: 18, d: "2027-01-10", t: "13:00", a: "TEN", h: "HOU", rd: -1, dv: 1 },
      { w: 18, d: "2027-01-10", t: "13:00", a: "JAX", h: "IND", rd: 0, dv: 1 },
      { w: 18, d: "2027-01-10", t: "13:00", a: "LV", h: "KC", rd: 0, dv: 1 },
      { w: 18, d: "2027-01-10", t: "13:00", a: "SEA", h: "LA", rd: 0, dv: 1 },
      { w: 18, d: "2027-01-10", t: "13:00", a: "CHI", h: "MIN", rd: 0, dv: 1 },
      { w: 18, d: "2027-01-10", t: "13:00", a: "MIA", h: "NE", rd: 0, dv: 1 },
      { w: 18, d: "2027-01-10", t: "13:00", a: "TB", h: "NO", rd: 0, dv: 1 },
      { w: 18, d: "2027-01-10", t: "13:00", a: "PHI", h: "NYG", rd: 0, dv: 1 },
      { w: 18, d: "2027-01-10", t: "13:00", a: "DAL", h: "WAS", rd: 0, dv: 1 },
    ],
    P = {
      ARI: ["Arizona Cardinals", "#97233F"],
      ATL: ["Atlanta Falcons", "#A71930"],
      BAL: ["Baltimore Ravens", "#241773"],
      BUF: ["Buffalo Bills", "#00338D"],
      CAR: ["Carolina Panthers", "#0085CA"],
      CHI: ["Chicago Bears", "#C83803"],
      CIN: ["Cincinnati Bengals", "#FB4F14"],
      CLE: ["Cleveland Browns", "#FF3C00"],
      DAL: ["Dallas Cowboys", "#003594"],
      DEN: ["Denver Broncos", "#FB4F14"],
      DET: ["Detroit Lions", "#0076B6"],
      GB: ["Green Bay Packers", "#203731"],
      HOU: ["Houston Texans", "#03202F"],
      IND: ["Indianapolis Colts", "#002C5F"],
      JAX: ["Jacksonville Jaguars", "#006778"],
      KC: ["Kansas City Chiefs", "#E31837"],
      LA: ["Los Angeles Rams", "#003594"],
      LAC: ["Los Angeles Chargers", "#0080C6"],
      LV: ["Las Vegas Raiders", "#A5ACAF"],
      MIA: ["Miami Dolphins", "#008E97"],
      MIN: ["Minnesota Vikings", "#4F2683"],
      NE: ["New England Patriots", "#002244"],
      NO: ["New Orleans Saints", "#D3BC8D"],
      NYG: ["New York Giants", "#0B2265"],
      NYJ: ["New York Jets", "#125740"],
      PHI: ["Philadelphia Eagles", "#004C54"],
      PIT: ["Pittsburgh Steelers", "#FFB612"],
      SEA: ["Seattle Seahawks", "#69BE28"],
      SF: ["San Francisco 49ers", "#AA0000"],
      TB: ["Tampa Bay Buccaneers", "#D50A0A"],
      TEN: ["Tennessee Titans", "#4B92DB"],
      WAS: ["Washington Commanders", "#5A1414"],
    },
    es = Object.keys(P).sort(),
    Yc = {
      BUF: 0,
      MIA: 0,
      NE: 0,
      NYJ: 0,
      NYG: 0,
      PHI: 0,
      PIT: 0,
      BAL: 0,
      CIN: 0,
      CLE: 0,
      WAS: 0,
      CAR: 0,
      ATL: 0,
      JAX: 0,
      TB: 0,
      IND: 0,
      DET: 0,
      CHI: -1,
      GB: -1,
      MIN: -1,
      DAL: -1,
      HOU: -1,
      TEN: -1,
      NO: -1,
      KC: -1,
      DEN: -2,
      ARI: -2,
      SEA: -3,
      SF: -3,
      LA: -3,
      LAC: -3,
      LV: -3,
    },
    dg = (t) => 1 / (1 + Math.exp(-t));
  function ye(t, e, l, a, n) {
    let u = n || Ml.model,
      i = (a && a[t]) || Ml.teams[t],
      c = (a && a[e]) || Ml.teams[e],
      f = i.elo + (l.eloAdjHome || 0),
      m = c.elo + (l.eloAdjAway || 0),
      g = l.qbOutHome ? u.qb_repl : i.qb !== void 0 ? i.qb : 0,
      A = l.qbOutAway ? u.qb_repl : c.qb !== void 0 ? c.qb : 0,
      v = l.qbOutHome ? 1 : i.qb_new || 0,
      p = l.qbOutAway ? 1 : c.qb_new || 0,
      x = l.injHome !== void 0 ? l.injHome : i.inj || 0,
      R = l.injAway !== void 0 ? l.injAway : c.inj || 0,
      j = l.homeRest !== void 0 ? l.homeRest : 7,
      r = l.awayRest !== void 0 ? l.awayRest : 7,
      h = (j >= 13 ? 1 : 0) - (r >= 13 ? 1 : 0),
      y = Math.abs((Yc[t] || 0) - (Yc[e] || 0)),
      S = 99;
    if (l.gametime) {
      let Q = parseInt(String(l.gametime).slice(0, 2), 10);
      isNaN(Q) || (S = Q);
    }
    let _ = (Yc[e] || 0) - (Yc[t] || 0) <= -2 && S <= 13 ? 1 : 0,
      F = [
        f + u.home_adv_elo - m,
        g - A,
        i.off_epa - c.off_epa,
        c.def_epa - i.def_epa,
        i.cpoe - c.cpoe,
        l.restDiff || 0,
        R - x,
        p - v,
        h,
        y,
        _,
      ],
      V = u.intercept;
    for (let Q = 0; Q < F.length; Q++) V += u.coef[Q] * ((F[Q] - u.mean[Q]) / u.scale[Q]);
    return dg(V);
  }
  function rg({ pHome: t, homeCode: e, awayCode: l }) {
    let [a, n] = P[e],
      [u, i] = P[l],
      c = t * 100;
    return (0, o.jsxs)("div", {
      style: { marginTop: 22 },
      children: [
        (0, o.jsxs)("div", {
          style: {
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "'Barlow Condensed'",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontSize: 15,
          },
          children: [
            (0, o.jsxs)("span", {
              style: { color: n === "#03202F" ? "#7A9CB0" : n },
              children: [a, " \xB7 Heim"],
            }),
            (0, o.jsxs)("span", {
              style: { color: "#8C94A8" },
              children: [u, " \xB7 Ausw\xE4rts"],
            }),
          ],
        }),
        (0, o.jsxs)("div", {
          style: {
            position: "relative",
            height: 74,
            marginTop: 8,
            borderRadius: 8,
            overflow: "hidden",
            background: "#17402C",
            border: "1px solid #26304A",
          },
          children: [
            (0, o.jsx)("div", {
              style: {
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "8%",
                background: n,
                opacity: 0.85,
              },
            }),
            (0, o.jsx)("div", {
              style: {
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "8%",
                background: i,
                opacity: 0.85,
              },
            }),
            [...Array(9)].map((f, m) =>
              (0, o.jsx)(
                "div",
                {
                  style: {
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${8 + (m + 1) * 8.4}%`,
                    width: 1,
                    background: "rgba(240,237,226,0.28)",
                  },
                },
                m,
              ),
            ),
            [...Array(9)].map((f, m) =>
              (0, o.jsx)(
                "div",
                {
                  style: {
                    position: "absolute",
                    bottom: 4,
                    left: `${8 + (m + 1) * 8.4}%`,
                    transform: "translateX(-50%)",
                    fontFamily: "'IBM Plex Mono'",
                    fontSize: 9,
                    color: "rgba(240,237,226,0.45)",
                  },
                  children: m < 4 ? (m + 1) * 10 : m === 4 ? 50 : (9 - m) * 10,
                },
                "n" + m,
              ),
            ),
            (0, o.jsx)("div", {
              style: {
                position: "absolute",
                top: "50%",
                left: `calc(8% + ${c * 0.84}%)`,
                transform: "translate(-50%,-50%)",
                transition: "left 600ms cubic-bezier(.2,.8,.2,1)",
              },
              children: (0, o.jsx)("div", {
                style: {
                  width: 26,
                  height: 17,
                  borderRadius: "50%",
                  background: "#7A4A21",
                  border: "2px solid #F0EDE2",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.6)",
                  position: "relative",
                },
                children: (0, o.jsx)("div", {
                  style: {
                    position: "absolute",
                    top: "50%",
                    left: "22%",
                    right: "22%",
                    height: 1.5,
                    background: "#F0EDE2",
                    transform: "translateY(-50%)",
                  },
                }),
              }),
            }),
          ],
        }),
        (0, o.jsxs)("div", {
          style: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: 10,
            fontFamily: "'IBM Plex Mono'",
            fontSize: 26,
          },
          children: [
            (0, o.jsxs)("span", {
              style: { color: "#F0EDE2" },
              children: [
                c.toFixed(1),
                (0, o.jsx)("span", { style: { fontSize: 14, color: "#8C94A8" }, children: " %" }),
              ],
            }),
            (0, o.jsxs)("span", {
              style: { color: "#8C94A8" },
              children: [
                (100 - c).toFixed(1),
                (0, o.jsx)("span", { style: { fontSize: 14 }, children: " %" }),
              ],
            }),
          ],
        }),
      ],
    });
  }
  function hg({ hist: t, selected: e, onToggle: l }) {
    if (!t) return null;
    let a = [...new Set(t.map((r) => r.date))].sort(),
      n = [...new Set(t.map((r) => r.team))].sort(),
      u = {};
    for (let r of t) (u[r.team] = u[r.team] || {})[r.date] = r.elo;
    let i = e.filter((r) => u[r]),
      c = i.flatMap((r) => a.map((h) => u[r][h]).filter((h) => h !== void 0)),
      f = Math.min(...c, 1450) - 20,
      m = Math.max(...c, 1550) + 20,
      g = 700,
      A = 260,
      v = 44,
      p = 24,
      x = (r) => v + (a.length > 1 ? (r / (a.length - 1)) * (g - v - 10) : (g - v - 10) / 2),
      R = (r) => 8 + (1 - (r - f) / (m - f)) * (A - p - 8),
      j = (r) => r.slice(8, 10) + "." + r.slice(5, 7) + ".";
    return (0, o.jsxs)("div", {
      style: { marginBottom: 22 },
      children: [
        (0, o.jsx)("div", {
          style: {
            fontFamily: "'Barlow Condensed'",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontSize: 17,
            marginBottom: 8,
          },
          children: "Elo-Verlauf",
        }),
        (0, o.jsx)("div", {
          style: { display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 },
          children: n.map((r) =>
            (0, o.jsx)(
              "button",
              {
                onClick: () => l(r),
                style: {
                  padding: "3px 7px",
                  fontSize: 11,
                  fontFamily: "'IBM Plex Mono'",
                  borderRadius: 4,
                  cursor: "pointer",
                  background: e.includes(r) ? P[r][1] : "transparent",
                  color: e.includes(r) ? "#F0EDE2" : "#5C6478",
                  border: "1px solid " + (e.includes(r) ? P[r][1] : "#26304A"),
                },
                children: r,
              },
              r,
            ),
          ),
        }),
        a.length < 2
          ? (0, o.jsxs)("p", {
              style: {
                fontSize: 13,
                color: "#8C94A8",
                border: "1px dashed #26304A",
                borderRadius: 8,
                padding: 14,
              },
              children: [
                "Die Historie w\xE4chst t\xE4glich \u2013 deine Pipeline schreibt seit dem ",
                j(a[0] || ""),
                " jeden Morgen einen Schnappschuss. Ab dem ersten Spieltag siehst du hier, welche Teams hei\xDF laufen und welche kollabieren.",
              ],
            })
          : (0, o.jsxs)("svg", {
              viewBox: `0 0 ${g} ${A}`,
              style: {
                width: "100%",
                background: "#131A2B",
                border: "1px solid #26304A",
                borderRadius: 8,
              },
              children: [
                [0.25, 0.5, 0.75].map((r) => {
                  let h = f + r * (m - f);
                  return (0, o.jsxs)(
                    "g",
                    {
                      children: [
                        (0, o.jsx)("line", {
                          x1: v,
                          x2: g - 10,
                          y1: R(h),
                          y2: R(h),
                          stroke: "#1A2033",
                        }),
                        (0, o.jsx)("text", {
                          x: v - 6,
                          y: R(h) + 3,
                          textAnchor: "end",
                          fontSize: "10",
                          fill: "#5C6478",
                          fontFamily: "IBM Plex Mono",
                          children: Math.round(h),
                        }),
                      ],
                    },
                    r,
                  );
                }),
                (0, o.jsx)("text", {
                  x: v,
                  y: A - 6,
                  fontSize: "10",
                  fill: "#5C6478",
                  fontFamily: "IBM Plex Mono",
                  children: j(a[0]),
                }),
                (0, o.jsx)("text", {
                  x: g - 10,
                  y: A - 6,
                  textAnchor: "end",
                  fontSize: "10",
                  fill: "#5C6478",
                  fontFamily: "IBM Plex Mono",
                  children: j(a[a.length - 1]),
                }),
                i.map((r) => {
                  let h = a
                      .map((_, F) => (u[r][_] !== void 0 ? `${x(F)},${R(u[r][_])}` : null))
                      .filter(Boolean)
                      .join(" "),
                    y = a.length - 1,
                    S = u[r][a[y]];
                  return (0, o.jsxs)(
                    "g",
                    {
                      children: [
                        (0, o.jsx)("polyline", {
                          points: h,
                          fill: "none",
                          stroke: P[r][1],
                          strokeWidth: "2.5",
                          strokeLinejoin: "round",
                        }),
                        S !== void 0 &&
                          (0, o.jsx)("text", {
                            x: Math.min(x(y) + 4, g - 4),
                            y: R(S) + 3,
                            fontSize: "10",
                            fill: P[r][1],
                            fontFamily: "IBM Plex Mono",
                            children: r,
                          }),
                      ],
                    },
                    r,
                  );
                }),
              ],
            }),
      ],
    });
  }
  function V2({ pts: t, home: e, away: l, live: a }) {
    let [n, u] = (0, k.useState)(null);
    if (!t || t.length < 2) return null;
    let i = 700,
      c = 300,
      f = 42,
      m = 54,
      g = 18,
      A = 30,
      v = (X) => f + (X / 3600) * (i - f - m),
      p = (X) => g + (1 - X) * (c - g - A),
      x = p(0.5),
      R = (X) => (X === "#03202F" ? "#4C7C99" : X),
      j = R(P[e][1]),
      r = R(P[l][1]),
      h = t.map((X, oe) => `${oe ? "L" : "M"}${v(X.t).toFixed(1)},${p(X.p).toFixed(1)}`).join(" "),
      y = `${h} L${v(t[t.length - 1].t).toFixed(1)},${x.toFixed(1)} L${v(t[0].t).toFixed(1)},${x.toFixed(1)} Z`,
      S = t[t.length - 1],
      _ = [];
    for (let X = 1; X < t.length; X++) (t[X - 1].p - 0.5) * (t[X].p - 0.5) < 0 && _.push(X);
    let F = `wp-${e}-${l}`,
      V = S.p >= 0.5 ? e : l,
      Q = Math.max(S.p, 1 - S.p) * 100,
      ot = 0,
      tt = null;
    for (let X = 1; X < t.length; X++) {
      let oe = Math.abs(t[X].p - t[X - 1].p);
      oe > ot && ((ot = oe), (tt = X));
    }
    let wt = (X) => {
        let oe = 3600 - X,
          wl = Math.min(4, Math.floor(X / 900) + 1),
          Ye = 900 - (X % 900);
        return `Q${wl} ${String(Math.floor(Ye / 60)).padStart(2, "0")}:${String(Ye % 60).padStart(2, "0")}`;
      },
      ce = n !== null ? t[n] : null;
    return (0, o.jsxs)("div", {
      style: { marginTop: 12 },
      children: [
        (0, o.jsxs)("svg", {
          viewBox: `0 0 ${i} ${c}`,
          style: { width: "100%", display: "block", background: "#0A0D16", borderRadius: 8 },
          children: [
            (0, o.jsxs)("defs", {
              children: [
                (0, o.jsx)("clipPath", {
                  id: `${F}-up`,
                  children: (0, o.jsx)("rect", { x: "0", y: g, width: i, height: x - g }),
                }),
                (0, o.jsx)("clipPath", {
                  id: `${F}-dn`,
                  children: (0, o.jsx)("rect", { x: "0", y: x, width: i, height: p(0) - x }),
                }),
              ],
            }),
            [0.25, 0.75].map((X) =>
              (0, o.jsxs)(
                "g",
                {
                  children: [
                    (0, o.jsx)("line", { x1: f, x2: i - m, y1: p(X), y2: p(X), stroke: "#161C2E" }),
                    (0, o.jsx)("text", {
                      x: f - 6,
                      y: p(X) + 3,
                      textAnchor: "end",
                      fontSize: "10",
                      fill: "#3A4560",
                      fontFamily: "IBM Plex Mono",
                      children: X === 0.75 ? "75" : "25",
                    }),
                  ],
                },
                X,
              ),
            ),
            [1, 2, 3].map((X) =>
              (0, o.jsx)(
                "line",
                { x1: v(X * 900), x2: v(X * 900), y1: g, y2: p(0), stroke: "#1F2740" },
                X,
              ),
            ),
            (0, o.jsx)("path", { d: y, fill: j, opacity: "0.32", clipPath: `url(#${F}-up)` }),
            (0, o.jsx)("path", { d: y, fill: r, opacity: "0.32", clipPath: `url(#${F}-dn)` }),
            (0, o.jsx)("line", {
              x1: f,
              x2: i - m,
              y1: x,
              y2: x,
              stroke: "#6B7590",
              strokeDasharray: "5 4",
            }),
            (0, o.jsx)("path", {
              d: h,
              fill: "none",
              stroke: "#F0EDE2",
              strokeWidth: "2.4",
              strokeLinejoin: "round",
              strokeLinecap: "round",
            }),
            t.map((X, oe) => {
              if (oe === 0) return null;
              let wl = _.includes(oe),
                Ye = n === oe;
              return (0, o.jsxs)(
                "g",
                {
                  onClick: () => u(Ye ? null : oe),
                  style: { cursor: "pointer" },
                  children: [
                    (0, o.jsx)("circle", { cx: v(X.t), cy: p(X.p), r: "12", fill: "transparent" }),
                    wl &&
                      (0, o.jsx)("circle", {
                        cx: v(X.t),
                        cy: p(X.p),
                        r: "7",
                        fill: "none",
                        stroke: "#E0685C",
                        strokeWidth: "1.8",
                      }),
                    (0, o.jsx)("circle", {
                      cx: v(X.t),
                      cy: p(X.p),
                      r: Ye ? 5.5 : 3.6,
                      fill: Ye ? "#F0EDE2" : "#D9A441",
                    }),
                    (Ye || oe === tt) &&
                      (0, o.jsxs)("text", {
                        x: v(X.t),
                        y: p(X.p) + (X.p > 0.5 ? 20 : -12),
                        textAnchor: "middle",
                        fontSize: "11",
                        fill: "#C9CEDB",
                        fontFamily: "IBM Plex Mono",
                        children: [X.as, ":", X.hs],
                      }),
                  ],
                },
                oe,
              );
            }),
            n !== null &&
              (0, o.jsx)("line", {
                x1: v(t[n].t),
                x2: v(t[n].t),
                y1: g,
                y2: p(0),
                stroke: "#F0EDE2",
                strokeWidth: "0.8",
                opacity: "0.4",
              }),
            (0, o.jsx)("circle", { cx: v(S.t), cy: p(S.p), r: "5", fill: "#F0EDE2" }),
            (0, o.jsx)("text", {
              x: f - 6,
              y: p(1) + 4,
              textAnchor: "end",
              fontSize: "10",
              fill: j,
              fontFamily: "IBM Plex Mono",
              children: "100",
            }),
            (0, o.jsx)("text", {
              x: f - 6,
              y: x + 4,
              textAnchor: "end",
              fontSize: "10",
              fill: "#8C94A8",
              fontFamily: "IBM Plex Mono",
              children: "50",
            }),
            (0, o.jsx)("text", {
              x: f - 6,
              y: p(0) + 4,
              textAnchor: "end",
              fontSize: "10",
              fill: r,
              fontFamily: "IBM Plex Mono",
              children: "100",
            }),
            (0, o.jsx)("text", {
              x: 6,
              y: g + 12,
              fontSize: "11",
              fill: j,
              fontFamily: "'Barlow Condensed'",
              letterSpacing: "1",
              children: e,
            }),
            (0, o.jsx)("text", {
              x: 6,
              y: p(0) - 4,
              fontSize: "11",
              fill: r,
              fontFamily: "'Barlow Condensed'",
              letterSpacing: "1",
              children: l,
            }),
            [1, 2, 3, 4].map((X) =>
              (0, o.jsxs)(
                "text",
                {
                  x: v(X * 900 - 450),
                  y: c - 9,
                  textAnchor: "middle",
                  fontSize: "11",
                  fill: "#5C6478",
                  fontFamily: "'Barlow Condensed'",
                  letterSpacing: "1",
                  children: ["Q", X],
                },
                "t" + X,
              ),
            ),
            (0, o.jsxs)("text", {
              x: i - m + 8,
              y: p(S.p) - 5,
              fontSize: "15",
              fill: "#F0EDE2",
              fontFamily: "IBM Plex Mono",
              children: [Q.toFixed(0), "%"],
            }),
            (0, o.jsx)("text", {
              x: i - m + 8,
              y: p(S.p) + 11,
              fontSize: "11",
              fill: V === e ? j : r,
              fontFamily: "IBM Plex Mono",
              children: V,
            }),
          ],
        }),
        (0, o.jsx)("div", {
          style: {
            marginTop: 6,
            minHeight: 34,
            background: "#0E1220",
            border: "1px solid #1F2740",
            borderRadius: 6,
            padding: "7px 10px",
            fontSize: 12.5,
            color: "#C9CEDB",
            lineHeight: 1.45,
          },
          children: ce
            ? (0, o.jsxs)("span", {
                children: [
                  (0, o.jsx)("span", {
                    style: { fontFamily: "'IBM Plex Mono'", color: "#D9A441" },
                    children: wt(ce.t),
                  }),
                  " \xB7 ",
                  l,
                  " ",
                  ce.as,
                  " : ",
                  ce.hs,
                  " ",
                  e,
                  " \xB7 ",
                  (0, o.jsxs)("span", {
                    style: { fontFamily: "'IBM Plex Mono'" },
                    children: [(ce.p * 100).toFixed(0), "%"],
                  }),
                  " f\xFCr ",
                  e,
                  n > 0 &&
                    (() => {
                      let X = (ce.p - t[n - 1].p) * 100;
                      return (0, o.jsxs)("span", {
                        style: { color: X >= 0 ? "#8FCB9B" : "#E0685C" },
                        children: ["  ", "(", X >= 0 ? "+" : "", X.toFixed(0), " Punkte)"],
                      });
                    })(),
                  ce.label &&
                    ce.label !== "jetzt" &&
                    ce.label !== "Endstand" &&
                    (0, o.jsx)("span", {
                      style: { display: "block", color: "#5C6478", fontSize: 11.5, marginTop: 2 },
                      children: ce.label,
                    }),
                ],
              })
            : (0, o.jsxs)("span", {
                style: { color: "#5C6478" },
                children: [
                  "Punkte antippen f\xFCr Details.",
                  tt !== null &&
                    ` Gr\xF6\xDFte Verschiebung: ${(ot * 100).toFixed(0)} Punkte bei ${wt(t[tt].t)}.`,
                  _.length > 0
                    ? ` ${_.length}\xD7 F\xFChrungswechsel (rote Ringe).`
                    : " Kein F\xFChrungswechsel.",
                ],
              }),
        }),
      ],
    });
  }
  var ia = {
      season: 2025,
      n: 284,
      overall: 65.5,
      market: 65.8,
      disagree: { hit: 48.8, n: 41 },
      tiers: { BANK: 77.1, Mittelfeld: 62.1, Münzwurf: 53.9 },
      src: { elo_diff: 66.7, qb_diff: 66.7, inj_diff: 54.5 },
    },
    mg = {
      elo_diff: "Elo/Form",
      qb_diff: "QB-Rating",
      off_diff: "Offense-EPA",
      def_diff: "Defense-EPA",
      cpoe_diff: "Passgenauigkeit",
      rest_diff: "Ruhetage",
      inj_diff: "Verletzungen",
      qb_new_diff: "QB ohne Historie",
      bye_diff: "Bye-Week",
      tz_shift_away: "Zeitzonen-Reise",
      west_early_away: "Westteam fr\xFCh im Osten",
    },
    ts = (t, e) => mg[t] || e || t,
    vg = { O: "Out", D: "Doubtful", Q: "Questionable" },
    Q2 = { O: "#E0685C", D: "#E08A5C", Q: "#D9A441" },
    yg = (t) => {
      let e = String(t).toLowerCase();
      return e.includes("special")
        ? "st"
        : /\bd$|defen|3-4|4-3|nickel|dime|46/.test(e)
          ? "def"
          : "off";
    },
    X2 = (t, e) => {
      if (!t || !t.groups) return null;
      let l = Object.keys(t.groups).find((a) => yg(a) === e);
      return l ? { key: l, rows: t.groups[l] } : null;
    };
  function pg({ depth: t, lineups: e, home: l, away: a, injHome: n, injAway: u }) {
    let [i, c] = (0, k.useState)(!1);
    if (
      ((0, k.useEffect)(() => {
        c(!1);
      }, [l, a]),
      !t || (!t[l] && !t[a]))
    )
      return null;
    let f = i ? a : l,
      m = i ? l : a,
      g = X2(t[f], "off"),
      A = X2(t[m], "def"),
      v = (t[l] || t[a] || {}).stamp,
      p = ({ team: x, data: R, label: j, align: r }) =>
        (0, o.jsxs)("div", {
          style: { flex: 1, minWidth: 240 },
          children: [
            (0, o.jsxs)("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
                justifyContent: r === "right" ? "flex-end" : "flex-start",
              },
              children: [
                (0, o.jsx)("span", {
                  style: { width: 3, height: 16, background: P[x][1], borderRadius: 2 },
                }),
                (0, o.jsxs)("span", {
                  style: {
                    fontFamily: "'Barlow Condensed'",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontSize: 15,
                  },
                  children: [
                    P[x][0],
                    " ",
                    (0, o.jsxs)("span", { style: { color: "#8C94A8" }, children: ["\xB7 ", j] }),
                  ],
                }),
              ],
            }),
            (0, o.jsx)("div", {
              style: {
                fontSize: 10.5,
                color: "#3A4560",
                fontFamily: "'IBM Plex Mono'",
                marginBottom: 4,
              },
              children: R ? R.key : "",
            }),
            !R &&
              (0, o.jsx)("div", {
                style: { fontSize: 12.5, color: "#5C6478" },
                children: "Keine Daten",
              }),
            R &&
              R.rows.map((h, y) => {
                let S = h.players[0],
                  _ = h.players[1];
                return (0, o.jsxs)(
                  "div",
                  {
                    style: {
                      display: "flex",
                      alignItems: "baseline",
                      gap: 8,
                      padding: "4px 0",
                      borderBottom: "1px solid #1A2033",
                    },
                    children: [
                      (0, o.jsx)("span", {
                        style: {
                          fontFamily: "'IBM Plex Mono'",
                          fontSize: 10.5,
                          color: "#5C6478",
                          width: 34,
                          flexShrink: 0,
                        },
                        children: h.pos,
                      }),
                      (0, o.jsxs)("span", {
                        style: { flex: 1, minWidth: 0 },
                        children: [
                          (0, o.jsxs)("span", {
                            style: { fontSize: 13, display: "flex", alignItems: "center", gap: 5 },
                            children: [
                              (0, o.jsx)("span", {
                                style: {
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                },
                                children: S ? S.n : "\u2013",
                              }),
                              S &&
                                S.i &&
                                (0, o.jsx)("span", {
                                  title: vg[S.i] || S.i,
                                  style: {
                                    fontFamily: "'IBM Plex Mono'",
                                    fontSize: 9.5,
                                    color: Q2[S.i],
                                    border: `1px solid ${Q2[S.i]}`,
                                    borderRadius: 3,
                                    padding: "0 3px",
                                    flexShrink: 0,
                                  },
                                  children: S.i,
                                }),
                            ],
                          }),
                          _ &&
                            (0, o.jsxs)("span", {
                              style: {
                                display: "block",
                                fontSize: 11,
                                color: "#5C6478",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              },
                              children: ["\u21B3 ", _.n, _.i ? ` (${_.i})` : ""],
                            }),
                        ],
                      }),
                    ],
                  },
                  h.pos + y,
                );
              }),
          ],
        });
    return (0, o.jsxs)("section", {
      style: {
        marginTop: 22,
        background: "#131A2B",
        border: "1px solid #26304A",
        borderRadius: 10,
        padding: 16,
      },
      children: [
        (0, o.jsxs)("div", {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 12,
          },
          children: [
            (0, o.jsx)("span", {
              style: {
                fontFamily: "'Barlow Condensed'",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontSize: 17,
              },
              children: "Aufstellungs-Duell",
            }),
            (0, o.jsx)("button", {
              onClick: () => c(!i),
              style: {
                background: "transparent",
                color: "#D9A441",
                border: "1px solid #D9A441",
                borderRadius: 6,
                padding: "6px 12px",
                fontFamily: "'Barlow Condensed'",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontSize: 13,
                cursor: "pointer",
              },
              children: "\u21C4 Seiten tauschen",
            }),
          ],
        }),
        (0, o.jsxs)("div", {
          style: { display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-start" },
          children: [
            (0, o.jsx)(p, { team: f, data: g, label: "Offense" }),
            (0, o.jsx)("div", {
              style: {
                width: 2,
                alignSelf: "stretch",
                background: "linear-gradient(#26304A, #D9A441, #26304A)",
                borderRadius: 1,
                minHeight: 120,
              },
            }),
            (0, o.jsx)(p, { team: m, data: A, label: "Defense", align: "right" }),
          ],
        }),
        (n > 0 || u > 0) &&
          (0, o.jsxs)("div", {
            style: { marginTop: 10, fontSize: 12.5, color: "#E0685C" },
            children: [
              "Ausfall-Last: ",
              P[l][0],
              " ",
              n.toFixed(1),
              " \xB7 ",
              P[a][0],
              " ",
              u.toFixed(1),
              " (positionsgewichtet)",
            ],
          }),
        (0, o.jsxs)("p", {
          style: { marginTop: 10, fontSize: 11.5, color: "#5C6478", lineHeight: 1.5 },
          children: [
            "Offizielle Depth Charts",
            v ? ` \xB7 Stand ${v}` : "",
            " \u2013 gegen\xFCbergestellt, wie sie auf dem Feld aufeinandertreffen: die Offense des einen gegen die Defense des anderen. Unter jedem Starter steht sein Backup (\u21B3). K\xFCrzel: O = Out, D = Doubtful, Q = Questionable laut Injury Report.",
          ],
        }),
      ],
    });
  }
  function Z2({ label: t, value: e, onChange: l, exclude: a }) {
    let n = P[e][1];
    return (0, o.jsxs)("div", {
      style: { flex: 1, minWidth: 150 },
      children: [
        (0, o.jsx)("div", {
          style: {
            fontFamily: "'Barlow Condensed'",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontSize: 13,
            color: "#8C94A8",
            marginBottom: 6,
          },
          children: t,
        }),
        (0, o.jsx)("select", {
          value: e,
          onChange: (u) => l(u.target.value),
          style: {
            width: "100%",
            padding: "12px 10px",
            background: "#0A0D16",
            color: "#F0EDE2",
            border: `1px solid ${n}`,
            borderLeft: `5px solid ${n}`,
            borderRadius: 6,
            fontSize: 15,
            fontFamily: "Inter",
          },
          children: es.map((u) =>
            (0, o.jsx)("option", { value: u, disabled: u === a, children: P[u][0] }, u),
          ),
        }),
      ],
    });
  }
  function k2({ label: t, checked: e, onChange: l }) {
    return (0, o.jsxs)("button", {
      onClick: () => l(!e),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "transparent",
        border: "1px solid #26304A",
        borderRadius: 6,
        padding: "8px 10px",
        cursor: "pointer",
        color: e ? "#E0685C" : "#8C94A8",
        fontSize: 13,
        fontFamily: "Inter",
      },
      children: [
        (0, o.jsx)("span", {
          style: {
            width: 14,
            height: 14,
            borderRadius: 3,
            border: "1px solid currentColor",
            background: e ? "#E0685C" : "transparent",
            display: "inline-block",
          },
        }),
        t,
      ],
    });
  }
  function ls() {
    let [t, e] = (0, k.useState)("SEA"),
      [l, a] = (0, k.useState)("KC"),
      [n, u] = (0, k.useState)(!1),
      [i, c] = (0, k.useState)(!1),
      [f, m] = (0, k.useState)(0),
      [g, A] = (0, k.useState)(null),
      [v, p] = (0, k.useState)(!1),
      [x, R] = (0, k.useState)(null),
      [j, r] = (0, k.useState)("sched"),
      h = "https://raw.githubusercontent.com/Cako18/gridiron-data/main/data/app_data.json",
      [y, S] = (0, k.useState)(null),
      [_, F] = (0, k.useState)(G2),
      [V, Q] = (0, k.useState)("L\xE4dt aktuelle Daten\u2026"),
      [ot, tt] = (0, k.useState)({}),
      [wt, ce] = (0, k.useState)(null),
      [X, oe] = (0, k.useState)(!1),
      [wl, Ye] = (0, k.useState)({}),
      [jc, I2] = (0, k.useState)(null),
      [$2, W2] = (0, k.useState)(null),
      [ku, P2] = (0, k.useState)(null),
      [Ku, tm] = (0, k.useState)(null),
      [we, em] = (0, k.useState)(null),
      [fl, lm] = (0, k.useState)(null),
      [te, am] = (0, k.useState)(null),
      [ca, nm] = (0, k.useState)(null),
      [Ln, um] = (0, k.useState)(null),
      [dt, im] = (0, k.useState)(null),
      [Gc, cm] = (0, k.useState)(null),
      [Fu, om] = (0, k.useState)({}),
      [Vc, as] = (0, k.useState)(null),
      [yt, sl] = (0, k.useState)([]),
      [qn, fm] = (0, k.useState)(40),
      [Qt, sm] = (0, k.useState)(null),
      [dm, rm] = (0, k.useState)(null),
      [ns, hm] = (0, k.useState)(null),
      [Ju, mm] = (0, k.useState)("elo");
    (0, k.useEffect)(() => {
      let s = !1;
      return (
        (async () => {
          let b = null,
            w = G2,
            B = {},
            T = null,
            D = null;
          for (let O of [
            "data/model.json",
            "https://raw.githubusercontent.com/Cako18/gridiron-data/main/data/model.json",
          ])
            try {
              let d = await fetch(O);
              if (d.ok && ((D = await d.json()), Array.isArray(D.coef) || (D = null), D)) break;
            } catch {}
          try {
            let O = null;
            for (let z of ["data/app_data.json", h])
              try {
                let H = await fetch(z);
                if (H.ok) {
                  O = H;
                  break;
                }
              } catch {}
            if (!O) throw new Error("Pipeline nicht erreichbar");
            let d = await O.json();
            ((b = d.teams),
              d.proj && um(d.proj),
              d.analysis && em(d.analysis),
              d.lineups && W2(d.lineups),
              am({
                pipeline: (d.generated || "").slice(0, 10),
                season: d.season,
                lastResult: d.last_result,
                depthStamp: ((d.depth && Object.values(d.depth)[0]) || {}).stamp,
                odds: (d.schedule || []).filter((z) => z.mh).length,
                mode: "pipeline",
              }),
              d.depth && I2(d.depth),
              d.line_moves && P2(d.line_moves),
              d.picks && tm(d.picks),
              d.archetypes &&
                lm({ arch: d.archetypes, corr: d.arch_corr || {}, src: d.edge_sources || {} }),
              d.duel && d.duel.n > 0 && im(d.duel),
              (w = d.schedule.map((z) => ({ ...z, rd: Math.max(-7, Math.min(7, z.rd)) }))));
            for (let z of w)
              z.hs !== null &&
                z.hs !== void 0 &&
                (B[`${z.w}-${z.a}-${z.h}`] = { as: z.as, hs: z.hs });
            T = `Pipeline-Stand: ${(d.generated || "").slice(0, 10)} \xB7 letztes Ergebnis ${d.last_result}${D && D.trained ? ` \xB7 Modell trainiert ${D.trained} (${D.train_games} Spiele)` : ""}`;
          } catch {
            try {
              let d = await fetch(
                  "https://raw.githubusercontent.com/nflverse/nfldata/master/data/games.csv",
                ),
                z = j2(await d.text()),
                H = sg(z);
              b = {};
              for (let q in Ml.teams)
                b[q] = { ...Ml.teams[q], elo: H[q] !== void 0 ? H[q] : Ml.teams[q].elo };
              let G = z.filter((q) => q.season === "2026" && q.home_score !== "");
              for (let q of G)
                B[`${Number(q.week)}-${q.away_team}-${q.home_team}`] = {
                  as: Number(q.away_score),
                  hs: Number(q.home_score),
                };
              T =
                "nflverse-Fallback aktiv (Elo live, EPA Stand Ende 2025) \u2013 Pipeline nicht erreichbar";
            } catch {
              T = "Offline-Modus \u2013 eingebettete Ratings (Ende 2025) aktiv";
            }
          }
          for (let O of [
            "data/ai_context.json",
            "https://raw.githubusercontent.com/Cako18/gridiron-data/main/data/ai_context.json",
          ])
            try {
              let d = await fetch(O);
              if (d.ok) {
                let z = await d.json();
                (z &&
                  z.generated &&
                  nm({ date: z.generated, week: z.week, n: Object.keys(z.games || {}).length }),
                  z &&
                    z.games &&
                    Ye((H) => {
                      let G = { ...H };
                      for (let q in z.games) {
                        let M = z.games[q];
                        (!G[q] || (M.date || "") >= (G[q].date || "")) &&
                          (G[q] = {
                            ha: M.ha,
                            aa: M.aa,
                            summary: M.summary,
                            factors: M.factors,
                            date: M.date,
                            auto: !0,
                          });
                      }
                      return G;
                    }));
                break;
              }
            } catch {}
          for (let O of [
            "data/elo_history.csv",
            "https://raw.githubusercontent.com/Cako18/gridiron-data/main/data/elo_history.csv",
          ])
            try {
              let d = await fetch(O);
              if (d.ok) {
                let z = j2(await d.text());
                rm(z.map((H) => ({ date: H.date, team: H.team, elo: Number(H.elo) })));
                break;
              }
            } catch {}
          if (!s) {
            if ((D && sm(D), b && S(b), !vm && w.length)) {
              let O = w.filter((d) => d.hs === null).map((d) => d.w);
              (O.length && Qc(Math.min(...O)), ym(!0));
            }
            (F(w), tt(B), Q(T));
            try {
              if (Un) {
                let O = {};
                try {
                  let U = await Un.get("gridiron-picks");
                  O = JSON.parse(U.value);
                } catch {}
                let d = {};
                for (let U in O) O[U] && O[U].adj && (d[U] = O[U].adj);
                Ye((U) => {
                  let L = { ...U };
                  for (let N in d)
                    (!L[N] || (d[N].date || "") >= (L[N].date || "")) && (L[N] = d[N]);
                  return L;
                });
                let z = !1;
                for (let U of w) {
                  let L = `${U.w}-${U.a}-${U.h}`;
                  if (!B[L] && !O[L]) {
                    let N = ye(
                      U.h,
                      U.a,
                      { restDiff: U.rd, homeRest: U.hr, awayRest: U.ar, gametime: U.t },
                      b,
                      D,
                    );
                    ((O[L] = { f: N >= 0.5 ? U.h : U.a, p: Math.round(Math.max(N, 1 - N) * 100) }),
                      (z = !0));
                  }
                }
                let H = 0,
                  G = 0,
                  q = 0,
                  M = 0;
                for (let U in B) {
                  let L = O[U];
                  if (!L) continue;
                  let N = B[U],
                    K = N.hs > N.as ? U.split("-")[2] : N.hs < N.as ? U.split("-")[1] : null;
                  K && (L.f && (G++, K === L.f && H++), L.fa && (M++, K === L.fa && q++));
                }
                if ((G > 0 && ce({ c: H, t: G, ca: q, ta: M }), z))
                  try {
                    await Un.set("gridiron-picks", JSON.stringify(O));
                  } catch {}
              }
            } catch {}
          }
        })(),
        () => {
          s = !0;
        }
      );
    }, []);
    let [ee, Qc] = (0, k.useState)(1),
      [vm, ym] = (0, k.useState)(!1),
      [us, Iu] = (0, k.useState)(null),
      [Bt, $u] = (0, k.useState)(null),
      is = Bt ? { homeRest: Bt.hr, awayRest: Bt.ar, gametime: Bt.t } : {},
      Xc = (0, k.useMemo)(
        () => ye(t, l, { qbOutHome: n, qbOutAway: i, restDiff: f, ...is }, y, Qt),
        [t, l, n, i, f, y, Bt],
      ),
      cs = (0, k.useMemo)(
        () =>
          g
            ? ye(
                t,
                l,
                {
                  qbOutHome: n,
                  qbOutAway: i,
                  restDiff: f,
                  ...is,
                  eloAdjHome: g.home_adj,
                  eloAdjAway: g.away_adj,
                },
                y,
                Qt,
              )
            : null,
        [g, t, l, n, i, f, y, Bt],
      ),
      Yn = cs ?? Xc,
      os = Yn >= 0.5 ? t : l,
      pm = Yn >= 0.5 ? Yn : 1 - Yn;
    async function gm() {
      (p(!0), R(null), A(null));
      let [s] = P[t],
        [b] = P[l];
      try {
        let B = [
            {
              role: "user",
              content: `Du bist der Kontext-Layer eines statistischen NFL-Vorhersagemodells. Matchup: ${s} (Heim) gegen ${b} (Ausw\xE4rts).
Recherchiere per Websuche knapp die AKTUELLE Lage beider Teams: Kaderver\xE4nderungen, QB-Situation, Verletzungen, Trainerwechsel, Form/News. Maximal 4 Suchen.
\xDCbersetze deine Erkenntnisse in Elo-Anpassungen zwischen -75 und +75 pro Team (0 = keine relevanten News; nur klare, belegbare Faktoren z\xE4hlen).
Antworte am Ende AUSSCHLIESSLICH mit validem JSON, ohne Markdown, ohne Erkl\xE4rtext davor oder danach:
{"home_adj": <int>, "away_adj": <int>, "summary": "<2-3 S\xE4tze auf Deutsch>", "factors": ["<Faktor 1>", "<Faktor 2>", "<Faktor 3>"]}`,
            },
          ],
          T = "";
        for (let G = 0; G < 4; G++) {
          let q = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "claude-sonnet-4-6",
              max_tokens: 1e3,
              messages: B,
              tools: [{ type: "web_search_20250305", name: "web_search" }],
            }),
          });
          if (!q.ok && q.status !== 200) {
            let U = "HTTP " + q.status;
            try {
              let L = await q.json();
              L.error && L.error.message && (U = L.error.message);
            } catch {}
            throw new Error(U);
          }
          let M = await q.json();
          if (M.error) throw new Error(M.error.message || M.error.type || "API-Fehler");
          if (
            (B.push({ role: "assistant", content: M.content }),
            (T += (M.content || []).filter((U) => U.type === "text").map((U) => U.text).join(`
`)),
            M.stop_reason !== "pause_turn")
          ) {
            if (T.includes("home_adj") && T.lastIndexOf("}") > T.indexOf("{")) break;
            B.push({
              role: "user",
              content:
                "Gib jetzt AUSSCHLIESSLICH das geforderte JSON-Objekt aus, ohne weiteren Text.",
            });
          }
        }
        let D = T.replace(/```json|```/g, ""),
          O = D.match(/\{[\s\S]*"home_adj"[\s\S]*\}/),
          d = O ? O[0] : D.slice(D.indexOf("{"), D.lastIndexOf("}") + 1),
          z = JSON.parse(d),
          H = {
            home_adj: Math.max(-75, Math.min(75, Number(z.home_adj) || 0)),
            away_adj: Math.max(-75, Math.min(75, Number(z.away_adj) || 0)),
            summary: z.summary || "",
            factors: Array.isArray(z.factors) ? z.factors.slice(0, 4) : [],
          };
        A(H);
        try {
          if (Bt && !ot[Bt.key] && Un) {
            let G = ye(
                t,
                l,
                {
                  qbOutHome: n,
                  qbOutAway: i,
                  restDiff: f,
                  homeRest: Bt.hr,
                  awayRest: Bt.ar,
                  gametime: Bt.t,
                  eloAdjHome: H.home_adj,
                  eloAdjAway: H.away_adj,
                },
                y,
                Qt,
              ),
              q = {};
            try {
              let M = await Un.get("gridiron-picks");
              q = JSON.parse(M.value);
            } catch {}
            (q[Bt.key] || (q[Bt.key] = {}),
              q[Bt.key].fa || (q[Bt.key].fa = G >= 0.5 ? t : l),
              (q[Bt.key].adj = {
                ha: H.home_adj,
                aa: H.away_adj,
                summary: H.summary,
                factors: H.factors,
                date: new Date().toISOString().slice(0, 10),
              }),
              await Un.set("gridiron-picks", JSON.stringify(q)),
              Ye((M) => ({ ...M, [Bt.key]: q[Bt.key].adj })));
          }
        } catch {}
      } catch (w) {
        R(
          `Analyse fehlgeschlagen: ${w && w.message ? w.message : "unbekannter Fehler"}. Einmal neu versuchen hilft oft \u2013 wenn nicht, sag Claude im Chat Bescheid und nenn diese Meldung.`,
        );
      } finally {
        p(!1);
      }
    }
    let Zc = (s) => (y && y[s] ? y[s].elo : Ml.teams[s].elo),
      bm = (s) => {
        let b = parseInt(String(s).slice(0, 2), 10);
        return isNaN(b) ? "" : String((b + 6) % 24).padStart(2, "0") + ":" + String(s).slice(3, 5);
      },
      Sm = (s) => {
        let b = parseInt(String(s).slice(0, 2), 10);
        return isNaN(b)
          ? "Sonstige"
          : b <= 14
            ? "19-Uhr-Fenster"
            : b <= 17
              ? "22-Uhr-Fenster"
              : "Nachtspiele";
      },
      Ua = (0, k.useMemo)(
        () =>
          _.filter((s) => s.w === ee && !ot[`${s.w}-${s.a}-${s.h}`]).map((s) => ({
            ...s,
            key: `${s.w}-${s.a}-${s.h}`,
            pH: ye(
              s.h,
              s.a,
              {
                restDiff: Math.max(-7, Math.min(7, s.rd)),
                homeRest: s.hr,
                awayRest: s.ar,
                gametime: s.t,
              },
              y,
              Qt,
            ),
          })),
        [_, ee, ot, y, Qt],
      ),
      Am = (s, b) => {
        let w = b === s.h ? s.pH : 1 - s.pH;
        sl((B) => {
          let T = B.find((O) => O.key === s.key);
          if (T && T.team === b) return B.filter((O) => O.key !== s.key);
          let D = {
            key: s.key,
            team: b,
            p: w,
            label: `${s.a} @ ${s.h}`,
            q: (b === s.h ? s.mh : s.ma) || null,
          };
          return T ? B.map((O) => (O.key === s.key ? D : O)) : [...B, D];
        });
      },
      Em = (s) => {
        let b = [...Ua].sort((T, D) => Math.max(D.pH, 1 - D.pH) - Math.max(T.pH, 1 - T.pH)),
          w = [],
          B = (T) => {
            let D = T.pH >= 0.5 ? T.h : T.a;
            w.push({
              key: T.key,
              team: D,
              p: Math.max(T.pH, 1 - T.pH),
              label: `${T.a} @ ${T.h}`,
              q: (D === T.h ? T.mh : T.ma) || null,
            });
          };
        if (
          (s === "sicher" && b.slice(0, 3).forEach(B),
          s === "mix" && b.slice(0, 5).forEach(B),
          s === "risiko")
        ) {
          b.slice(0, 2).forEach(B);
          let T = b[b.length - 1];
          if (T && T.key !== (b[0] || {}).key) {
            let D = T.pH >= 0.5 ? T.a : T.h;
            w.push({
              key: T.key,
              team: D,
              p: Math.min(T.pH, 1 - T.pH),
              label: `${T.a} @ ${T.h} \xB7 \xDCberraschung`,
              q: (D === T.h ? T.mh : T.ma) || null,
            });
          }
        }
        sl(w);
      },
      oa = (0, k.useMemo)(() => {
        let s = [...Ua]
            .map((T) => ({ g: T, team: T.pH >= 0.5 ? T.h : T.a, p: Math.max(T.pH, 1 - T.pH) }))
            .sort((T, D) => D.p - T.p),
          b = [],
          w = 1;
        for (let T of s)
          if (w * T.p >= qn / 100) (b.push(T), (w *= T.p));
          else break;
        let B = s[b.length];
        return { legs: b, prod: w, nextP: B ? w * B.p : null };
      }, [Ua, qn]),
      Tm = () =>
        sl(
          oa.legs.map((s) => ({
            key: s.g.key,
            team: s.team,
            p: s.p,
            label: `${s.g.a} @ ${s.g.h}`,
            q: (s.team === s.g.h ? s.g.mh : s.g.ma) || null,
          })),
        ),
      zm = (s, b) => {
        let w = parseFloat(String(b).replace(",", "."));
        sl((B) => B.map((T) => (T.key === s ? { ...T, q: isNaN(w) || w <= 1 ? null : w } : T)));
      },
      fs = () => {
        let s = Ua.filter((b) => !yt.find((w) => w.key === b.key))
          .map((b) => ({ g: b, team: b.pH >= 0.5 ? b.h : b.a, p: Math.max(b.pH, 1 - b.pH) }))
          .sort((b, w) => w.p - b.p)[0];
        s &&
          sl((b) => [
            ...b,
            {
              key: s.g.key,
              team: s.team,
              p: s.p,
              label: `${s.g.a} @ ${s.g.h}`,
              q: (s.team === s.g.key.split("-")[2] ? s.g.mh : s.g.ma) || null,
            },
          ]);
      },
      Cm = () => {
        sl((s) => {
          if (!s.length) return s;
          let b = [...s].sort((w, B) => w.p - B.p)[0];
          return s.filter((w) => w.key !== b.key);
        });
      },
      xm = { LAR: "LA", WSH: "WAS" },
      Mm = (s) => {
        let b = 1 / (1 + 0.2316419 * Math.abs(s)),
          B =
            0.3989423 *
            Math.exp((-s * s) / 2) *
            b *
            (0.3193815 + b * (-0.3565638 + b * (1.781478 + b * (-1.821256 + b * 1.330274))));
        return s >= 0 ? 1 - B : B;
      },
      kc = (s, b, w, B, T, D) => {
        let O = ye(s, b, {}, y, Qt),
          d = 16 * Math.log10(O / (1 - O)),
          z = Math.max(0, Math.min(1, T / 3600));
        if (z === 0) return w > B ? 1 : w < B ? 0 : 0.5;
        let H = D === null ? 0 : D ? 1.94 : -1.94,
          G = w - B + d * z + H * Math.min(1, z * 3),
          q = 12.82 * Math.sqrt(z) + 3.12;
        return Mm(G / q);
      },
      wm = async (s) => {
        try {
          let b = await fetch(
            `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${s.id}`,
          );
          if (!b.ok) return;
          let B = (await b.json()).scoringPlays || [],
            T = [{ t: 0, p: kc(s.h, s.a, 0, 0, 3600, null), label: "Kickoff", hs: 0, as: 0 }];
          for (let D of B) {
            let O = (D.period && D.period.number) || 1,
              [d, z] = String((D.clock && D.clock.displayValue) || "0:00")
                .split(":")
                .map(Number),
              H = O <= 4 ? (4 - O) * 900 + ((d || 0) * 60 + (z || 0)) : 0,
              G = Number(D.homeScore) || 0,
              q = Number(D.awayScore) || 0;
            T.push({
              t: 3600 - H,
              p: kc(s.h, s.a, G, q, H, null),
              label: `${D.text ? String(D.text).slice(0, 60) : ""}`,
              hs: G,
              as: q,
            });
          }
          (T.push({
            t: 3600 - s.secLeft,
            p: s.wp,
            label: s.state === "post" ? "Endstand" : "jetzt",
            hs: s.hs,
            as: s.as,
          }),
            om((D) => ({ ...D, [s.id]: T.sort((O, d) => O.t - d.t) })));
        } catch {}
      },
      ss = async () => {
        try {
          let s = (z) =>
              `${z.getFullYear()}${String(z.getMonth() + 1).padStart(2, "0")}${String(z.getDate()).padStart(2, "0")}`,
            b = new Date(Date.now() - 3456e5),
            w = new Date(Date.now() + 10 * 864e5),
            D = (
              (
                await (
                  await fetch(
                    `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${s(b)}-${s(w)}&limit=200`,
                  )
                ).json()
              ).events || []
            )
              .map((z) => {
                let H = z.competitions && z.competitions[0];
                if (!H) return null;
                let G = H.competitors.find((Gn) => Gn.homeAway === "home"),
                  q = H.competitors.find((Gn) => Gn.homeAway === "away");
                if (!G || !q) return null;
                let M = (Gn) => {
                    let ms = Gn.team.abbreviation;
                    return xm[ms] || ms;
                  },
                  U = M(G),
                  L = M(q);
                if (!P[U] || !P[L]) return null;
                let N = z.status || {},
                  K = N.type ? N.type.state : "pre",
                  E = N.period || 0,
                  Y = N.displayClock || "0:00",
                  [Z, lt] = String(Y).split(":").map(Number),
                  $ = (isNaN(Z) ? 0 : Z * 60) + (isNaN(lt) ? 0 : lt),
                  at = 3600;
                (K === "in" && (at = E <= 4 ? (4 - E) * 900 + $ : Math.min(600, $)),
                  K === "post" && (at = 0));
                let zt = null;
                H.situation &&
                  H.situation.possession &&
                  (zt =
                    H.situation.possession === G.id
                      ? !0
                      : H.situation.possession === q.id
                        ? !1
                        : null);
                let je = Number(G.score) || 0,
                  hs = Number(q.score) || 0,
                  Dm = Number((z.season && z.season.type) || (H.type && H.type.id) || 2);
                return {
                  id: z.id,
                  h: U,
                  a: L,
                  hs: je,
                  as: hs,
                  state: K,
                  period: E,
                  clock: Y,
                  secLeft: at,
                  possHome: zt,
                  pre: Dm === 1,
                  ko: z.date ? new Date(z.date) : null,
                  wp: kc(U, L, je, hs, K === "pre" ? 3600 : at, K === "in" ? zt : null),
                  detail: N.type ? N.type.shortDetail : "",
                };
              })
              .filter(Boolean);
          (cm(D), as(null));
          let O = D.filter((z) => z.state === "in").slice(0, 4),
            d = D.filter((z) => z.state === "post")
              .sort((z, H) => (H.ko || 0) - (z.ko || 0))
              .slice(0, 3);
          for (let z of [...O, ...d]) z.id && wm(z);
        } catch {
          as("Live-Feed nicht erreichbar \u2013 sp\xE4ter nochmal versuchen.");
        }
      },
      [ds, rs] = (0, k.useState)(null);
    (0, k.useEffect)(() => {
      if (j !== "live") return;
      let s = !1,
        b = async () => {
          s || (await ss(), rs(new Date()));
        };
      b();
      let w = setInterval(b, 45e3),
        B = () => {
          document.visibilityState === "visible" && b();
        };
      return (
        document.addEventListener("visibilitychange", B),
        window.addEventListener("focus", B),
        () => {
          ((s = !0),
            clearInterval(w),
            document.removeEventListener("visibilitychange", B),
            window.removeEventListener("focus", B));
        }
      );
    }, [j, y, Qt]);
    let fa = (0, k.useMemo)(() => {
        if (!we || !fl || yt.length < 2) return null;
        let s = (N) => (we[N] && we[N].tags) || [],
          b = _.filter((N) => yt.some((K) => K.key === `${N.w}-${N.a}-${N.h}`)).map((N) => N.w),
          w = b.length ? b[0] : null,
          B = _.filter((N) => N.w === w).map((N) => `${N.w}-${N.a}-${N.h}`),
          T = {};
        for (let N of B) for (let K of s(N)) T[K] = (T[K] || 0) + 1;
        let D = new Set(Object.keys(T).filter((N) => T[N] >= B.length * 0.8)),
          O = (N) => s(N).filter((K) => !D.has(K)),
          d = {};
        for (let N of yt) for (let K of O(N.key)) d[K] = (d[K] || 0) + 1;
        let z = 0,
          H = 0;
        for (let N = 0; N < yt.length; N++)
          for (let K = N + 1; K < yt.length; K++) {
            let E = O(yt[N].key),
              Y = O(yt[K].key),
              Z = 0;
            for (let lt of E)
              for (let $ of Y) {
                let at = lt === $ ? 1 : ((fl.corr[lt] || {})[$] ?? 0);
                at > Z && (Z = at);
              }
            ((z += Z), H++);
          }
        let G = H ? z / H : 0;
        if (G <= 0.05) return null;
        let q = 1 - Math.min(0.5, G * 0.25 * Math.log2(yt.length + 1)),
          U = yt.reduce((N, K) => N * K.p, 1) * q,
          L = Object.entries(d)
            .filter(([, N]) => N >= Math.max(2, Math.ceil(yt.length * 0.6)))
            .sort((N, K) => K[1] - N[1]);
        return { rho: G, pCorr: U, abschlag: q, cluster: L };
      }, [yt, we, fl, _]),
      Nm = (0, k.useMemo)(() => {
        let s = [1];
        for (let b of yt) {
          let w = new Array(s.length + 1).fill(0);
          for (let B = 0; B < s.length; B++) ((w[B] += s[B] * (1 - b.p)), (w[B + 1] += s[B] * b.p));
          s = w;
        }
        return s;
      }, [yt]),
      jn = yt.length ? yt.reduce((s, b) => s * b.p, 1) : 0,
      gg = [...es].sort((s, b) => Zc(b) - Zc(s)),
      _m = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
      Kc = (s) => {
        let b = new Date(s + "T12:00:00");
        return `${_m[b.getDay()]} ${String(b.getDate()).padStart(2, "0")}.${String(b.getMonth() + 1).padStart(2, "0")}.`;
      };
    function Fc(s) {
      (e(s.h),
        a(s.a),
        m(Math.max(-7, Math.min(7, s.rd))),
        u(!!(y && y[s.h] && y[s.h].qb_out)),
        c(!!(y && y[s.a] && y[s.a].qb_out)));
      let b = `${s.w}-${s.a}-${s.h}`;
      $u({ key: b, hr: s.hr, ar: s.ar, t: s.t });
      let w = wl[b];
      (A(
        w
          ? {
              home_adj: w.ha,
              away_adj: w.aa,
              summary:
                (w.summary || "") +
                (w.date ? ` (Analyse vom ${w.date} \u2013 f\xFCr frische News neu starten)` : ""),
              factors: w.factors || [],
            }
          : null,
      ),
        Iu(`Woche ${s.w} \xB7 ${Kc(s.d)}${s.t ? " \xB7 " + s.t.slice(0, 5) + " ET" : ""}`),
        r("match"));
    }
    return (0, o.jsxs)("div", {
      style: {
        minHeight: "100vh",
        background: "#0A0D16",
        color: "#F0EDE2",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "0 0 60px",
      },
      children: [
        (0, o.jsx)("style", {
          children: `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;700&family=IBM+Plex+Mono:wght@500&family=Inter:wght@400;600&display=swap');
        select:focus, button:focus { outline: 2px solid #D9A441; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }`,
        }),
        (0, o.jsxs)("header", {
          style: {
            padding: "26px 20px 18px",
            borderBottom: "1px solid #26304A",
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          },
          children: [
            (0, o.jsxs)("div", {
              children: [
                (0, o.jsxs)("div", {
                  style: {
                    fontFamily: "'Barlow Condensed'",
                    fontWeight: 700,
                    fontSize: 34,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  },
                  children: [
                    "Cako's",
                    (0, o.jsx)("span", { style: { color: "#D9A441" }, children: "\xA0NFL World" }),
                  ],
                }),
                (0, o.jsxs)("div", {
                  style: { fontSize: 12.5, color: "#8C94A8", marginTop: 2 },
                  children: [
                    "Elo + EPA + Injuries \xB7 ",
                    te ? `Saison ${te.season}` : V,
                    dt &&
                      (0, o.jsxs)("span", {
                        style: { color: "#8FCB9B" },
                        children: [
                          " \xB7 Vegas-Duell: Modell ",
                          Math.round((100 * dt.m) / dt.n),
                          " % vs. Vegas ",
                          Math.round((100 * dt.v) / dt.n),
                          " %",
                          dt.dis_n > 0 ? ` (Uneinigkeit: ${dt.dis_m}/${dt.dis_n})` : "",
                        ],
                      }),
                    wt &&
                      (0, o.jsxs)("span", {
                        style: { color: "#D9A441" },
                        children: [
                          " \xB7 Bilanz: Modell ",
                          wt.c,
                          "/",
                          wt.t,
                          " (",
                          Math.round((100 * wt.c) / wt.t),
                          " %)",
                          wt.ta > 0
                            ? ` \xB7 mit Claude ${wt.ca}/${wt.ta} (${Math.round((100 * wt.ca) / wt.ta)} %)`
                            : "",
                        ],
                      }),
                  ],
                }),
              ],
            }),
            (0, o.jsx)("nav", {
              style: { display: "flex", gap: 6 },
              children: [
                ["sched", "Spielplan '26"],
                ["live", "Live"],
                ["match", "Matchup"],
                ["slip", "Tippschein"],
                ["duel", "Vegas-Duell"],
                ["rank", "Elo-Ranking"],
              ].map(([s, b]) =>
                (0, o.jsx)(
                  "button",
                  {
                    onClick: () => r(s),
                    style: {
                      background: j === s ? "#D9A441" : "transparent",
                      color: j === s ? "#0A0D16" : "#8C94A8",
                      border: "1px solid " + (j === s ? "#D9A441" : "#26304A"),
                      borderRadius: 6,
                      padding: "7px 14px",
                      fontFamily: "'Barlow Condensed'",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontSize: 14,
                      cursor: "pointer",
                    },
                    children: b,
                  },
                  s,
                ),
              ),
            }),
          ],
        }),
        (() => {
          let s = (d, z, H) => Math.floor(Date.UTC(d, z - 1, H) / 864e5),
            b = new Date(),
            w = s(b.getFullYear(), b.getMonth() + 1, b.getDate()),
            B = (d) => {
              if (!d || d.length < 10) return null;
              let [z, H, G] = d.slice(0, 10).split("-").map(Number);
              return !z || !H || !G ? null : Math.max(0, w - s(z, H, G));
            },
            T = (d, z, H) =>
              d === null ? "#5C6478" : d <= z ? "#8FCB9B" : d <= H ? "#D9A441" : "#E0685C",
            D = (d) => {
              if (!d) return "\u2014";
              let z = B(d),
                H = d.slice(8, 10) + "." + d.slice(5, 7) + ".";
              return z === 0
                ? `heute (${H})`
                : z === 1
                  ? `gestern (${H})`
                  : `vor ${z} Tagen (${H})`;
            },
            O = [
              {
                l: "Daten & Modell",
                v: te ? D(te.pipeline) : "nicht erreichbar",
                c: te ? T(B(te.pipeline), 1, 3) : "#E0685C",
                note: te
                  ? `${Qt ? Qt.train_games.toLocaleString("de-DE") : "\u2013"} Spiele trainiert`
                  : "Fallback aktiv",
              },
              {
                l: "KI-Kontext",
                v: ca ? D(ca.date) : "keiner",
                c: ca ? T(B(ca.date), 7, 14) : "#5C6478",
                note: ca ? `Woche ${ca.week} \xB7 ${ca.n} Spiele` : "l\xE4uft sonntags",
              },
              {
                l: "Depth Charts",
                v: te ? D(te.depthStamp) : "\u2014",
                c: te ? T(B(te.depthStamp), 2, 5) : "#5C6478",
                note: jc ? `${Object.keys(jc).length} Teams` : "",
              },
              {
                l: "Marktquoten",
                v: te ? `${te.odds} Spiele` : "\u2014",
                c: te && te.odds > 0 ? "#8FCB9B" : "#5C6478",
                note: "aus dem Spielplan",
              },
            ];
          return (0, o.jsx)("div", {
            style: { borderBottom: "1px solid #26304A", background: "#0E1220" },
            children: (0, o.jsx)("div", {
              style: {
                maxWidth: 900,
                margin: "0 auto",
                padding: "10px 20px",
                display: "flex",
                gap: 22,
                flexWrap: "wrap",
              },
              children: O.map((d) =>
                (0, o.jsxs)(
                  "span",
                  {
                    style: { display: "flex", alignItems: "center", gap: 7, fontSize: 12 },
                    children: [
                      (0, o.jsx)("span", {
                        style: {
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: d.c,
                          flexShrink: 0,
                        },
                      }),
                      (0, o.jsx)("span", { style: { color: "#5C6478" }, children: d.l }),
                      (0, o.jsx)("span", {
                        style: { color: "#C9CEDB", fontFamily: "'IBM Plex Mono'", fontSize: 11.5 },
                        children: d.v,
                      }),
                      d.note &&
                        (0, o.jsxs)("span", {
                          style: { color: "#3A4560", fontSize: 11 },
                          children: ["\xB7 ", d.note],
                        }),
                    ],
                  },
                  d.l,
                ),
              ),
            }),
          });
        })(),
        j === "live" &&
          (() => {
            let s = new Date(),
              b = Gc || [],
              w = new Set(b.map((E) => E.h + E.a)),
              B = (E) => {
                let [Y, Z, lt] = E.split("-").map(Number),
                  $ = new Date(Date.UTC(Y, Z - 1, lt)).getUTCDay();
                return Z > 3 && Z < 11
                  ? "-04:00"
                  : Z < 3 || Z === 12
                    ? "-05:00"
                    : Z === 3
                      ? lt - $ >= 8
                        ? "-04:00"
                        : "-05:00"
                      : lt - $ >= 1
                        ? "-05:00"
                        : "-04:00";
              },
              T = (E) => {
                let Y = String(E.t || "13:00").slice(0, 5),
                  [Z, lt] = Y.split(":").map(Number),
                  $ = String(isNaN(Z) ? 13 : Z).padStart(2, "0"),
                  at = String(isNaN(lt) ? 0 : lt).padStart(2, "0");
                return new Date(`${E.d}T${$}:${at}:00${B(E.d)}`);
              },
              D = _.filter((E) => E.hs === null && !w.has(E.h + E.a))
                .map((E) => ({
                  h: E.h,
                  a: E.a,
                  hs: 0,
                  as: 0,
                  state: "pre",
                  pre: !1,
                  ko: T(E),
                  fromSched: !0,
                }))
                .filter((E) => E.ko > s),
              O = [...b, ...D],
              d = O.filter((E) => E.state === "in"),
              z = O.filter((E) => E.state === "pre" && E.ko)
                .sort((E, Y) => E.ko - Y.ko)
                .slice(0, 8),
              H = O.filter((E) => E.state === "post" && E.ko)
                .sort((E, Y) => Y.ko - E.ko)
                .slice(0, 6),
              G = (E) => _.find((Y) => Y.h === E.h && Y.a === E.a && Y.hs === null),
              q = (E) => {
                if (E.pre) return null;
                let Y = G(E);
                if (!Y) return null;
                let Z = ye(
                  Y.h,
                  Y.a,
                  {
                    restDiff: Math.max(-7, Math.min(7, Y.rd)),
                    homeRest: Y.hr,
                    awayRest: Y.ar,
                    gametime: Y.t,
                  },
                  y,
                  Qt,
                );
                return { fav: Z >= 0.5 ? Y.h : Y.a, prob: Math.max(Z, 1 - Z), s: Y };
              },
              M = (E) =>
                E.toLocaleString("de-DE", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              U = (E) => {
                let Y = E - s;
                if (Y <= 0) return "l\xE4uft gleich";
                let Z = Math.floor(Y / 36e5),
                  lt = Math.floor(Z / 24);
                return lt >= 1
                  ? `in ${lt} Tag${lt > 1 ? "en" : ""}`
                  : Z >= 1
                    ? `in ${Z} Std.`
                    : `in ${Math.max(1, Math.round(Y / 6e4))} Min.`;
              },
              L = (E) => {
                let Y = Fu[E.id];
                if (!Y || Y.length < 2) return null;
                let Z = Y[Y.length - 1],
                  lt = null;
                for (let je = Y.length - 2; je >= 0; je--)
                  if (Y[je].hs !== Z.hs || Y[je].as !== Z.as) {
                    lt = Y[je];
                    break;
                  }
                if (!lt) return null;
                let $ = (lt.p - 0.5) * (Z.p - 0.5) < 0,
                  at = Z.p - lt.p,
                  zt = Math.abs(Z.p - 0.5) < 0.12 && E.secLeft < 900;
                return $
                  ? {
                      level: "flip",
                      text: `F\xFChrung gekippt \u2013 jetzt ${Z.p >= 0.5 ? E.h : E.a} vorn`,
                    }
                  : Math.abs(at) >= 0.18
                    ? {
                        level: "swing",
                        text: `${at > 0 ? E.h : E.a} legt stark zu (${Math.abs(at * 100).toFixed(0)} Punkte)`,
                      }
                    : zt
                      ? { level: "close", text: "Krimi im Schlussviertel \u2013 praktisch offen" }
                      : null;
              },
              N = () =>
                (0, o.jsx)("span", {
                  style: {
                    marginRight: 6,
                    fontSize: 10,
                    color: "#7FB3D5",
                    border: "1px solid #2E4658",
                    borderRadius: 3,
                    padding: "0 4px",
                    whiteSpace: "nowrap",
                  },
                  children: "TEST \xB7 PRESEASON",
                }),
              K = ({ children: E, note: Y }) =>
                (0, o.jsxs)("div", {
                  style: {
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                    margin: "20px 0 8px",
                    flexWrap: "wrap",
                  },
                  children: [
                    (0, o.jsx)("span", {
                      style: {
                        fontFamily: "'Barlow Condensed'",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontSize: 14,
                        color: "#D9A441",
                      },
                      children: E,
                    }),
                    Y &&
                      (0, o.jsx)("span", {
                        style: { fontSize: 12, color: "#5C6478" },
                        children: Y,
                      }),
                  ],
                });
            return (0, o.jsxs)("main", {
              style: { maxWidth: 660, margin: "0 auto", padding: "20px 16px" },
              children: [
                Vc &&
                  (0, o.jsx)("p", { style: { color: "#E0685C", fontSize: 13.5 }, children: Vc }),
                Gc === null &&
                  !Vc &&
                  (0, o.jsx)("p", {
                    style: { color: "#8C94A8", fontSize: 13.5 },
                    children: "Lade Spieltagsdaten\u2026",
                  }),
                d.length > 0 &&
                  (0, o.jsxs)("div", {
                    style: {
                      display: "flex",
                      alignItems: "baseline",
                      gap: 10,
                      margin: "20px 0 8px",
                      flexWrap: "wrap",
                    },
                    children: [
                      (0, o.jsx)("span", {
                        style: {
                          fontFamily: "'Barlow Condensed'",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          fontSize: 14,
                          color: "#D9A441",
                        },
                        children: "L\xE4uft jetzt",
                      }),
                      (0, o.jsx)("span", {
                        style: { fontSize: 12, color: "#5C6478" },
                        children: ds
                          ? `zuletzt ${ds.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
                          : "l\xE4dt\u2026",
                      }),
                      (0, o.jsx)("button", {
                        onClick: () => {
                          (ss(), rs(new Date()));
                        },
                        style: {
                          background: "transparent",
                          border: "1px solid #26304A",
                          color: "#8C94A8",
                          borderRadius: 5,
                          padding: "3px 9px",
                          fontSize: 11.5,
                          cursor: "pointer",
                        },
                        children: "\u21BB jetzt",
                      }),
                    ],
                  }),
                d.map((E) => {
                  let [Y, Z] = P[E.h],
                    [lt, $] = P[E.a],
                    at = E.wp * 100;
                  return (0, o.jsxs)(
                    "div",
                    {
                      style: {
                        background: "#131A2B",
                        border: "1px solid #D9A441",
                        borderRadius: 10,
                        padding: 14,
                        marginBottom: 10,
                      },
                      children: [
                        (0, o.jsxs)("div", {
                          style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            flexWrap: "wrap",
                            gap: 6,
                          },
                          children: [
                            (0, o.jsxs)("span", {
                              style: { fontSize: 14.5 },
                              children: [
                                (0, o.jsx)("span", {
                                  style: { fontWeight: E.as > E.hs ? 600 : 400 },
                                  children: lt,
                                }),
                                (0, o.jsxs)("span", {
                                  style: {
                                    fontFamily: "'IBM Plex Mono'",
                                    margin: "0 8px",
                                    fontSize: 16,
                                  },
                                  children: [E.as, ":", E.hs],
                                }),
                                (0, o.jsx)("span", {
                                  style: { fontWeight: E.hs > E.as ? 600 : 400 },
                                  children: Y,
                                }),
                              ],
                            }),
                            (0, o.jsxs)("span", {
                              style: {
                                fontFamily: "'IBM Plex Mono'",
                                fontSize: 12,
                                color: "#D9A441",
                              },
                              children: [
                                E.pre && (0, o.jsx)(N, {}),
                                "Q",
                                E.period,
                                " \xB7 ",
                                E.clock,
                                E.possHome !== null ? ` \xB7 Ball ${E.possHome ? E.h : E.a}` : "",
                              ],
                            }),
                          ],
                        }),
                        (0, o.jsxs)("div", {
                          style: {
                            position: "relative",
                            height: 14,
                            borderRadius: 7,
                            overflow: "hidden",
                            marginTop: 10,
                            background: $,
                            display: "flex",
                          },
                          children: [
                            (0, o.jsx)("div", {
                              style: {
                                width: `${at}%`,
                                background: Z,
                                transition: "width 800ms ease",
                              },
                            }),
                            (0, o.jsx)("div", {
                              style: {
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: "50%",
                                width: 1,
                                background: "rgba(240,237,226,0.5)",
                              },
                            }),
                          ],
                        }),
                        (0, o.jsxs)("div", {
                          style: {
                            display: "flex",
                            justifyContent: "space-between",
                            fontFamily: "'IBM Plex Mono'",
                            fontSize: 12.5,
                            marginTop: 5,
                            color: E.pre ? "#5C6478" : "#C9CEDB",
                          },
                          children: [
                            (0, o.jsxs)("span", { children: [E.h, " ", at.toFixed(0), " %"] }),
                            (0, o.jsxs)("span", {
                              children: [E.a, " ", (100 - at).toFixed(0), " %"],
                            }),
                          ],
                        }),
                        (() => {
                          let zt = L(E);
                          if (!zt) return null;
                          let je =
                            zt.level === "flip"
                              ? "#E0685C"
                              : zt.level === "swing"
                                ? "#D9A441"
                                : "#7FB3D5";
                          return (0, o.jsxs)("div", {
                            style: {
                              marginTop: 10,
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              background: "#0A0D16",
                              border: `1px solid ${je}`,
                              borderRadius: 6,
                              padding: "7px 10px",
                            },
                            children: [
                              (0, o.jsx)("span", {
                                style: { fontSize: 14 },
                                children:
                                  zt.level === "flip"
                                    ? "\u26A1"
                                    : zt.level === "swing"
                                      ? "\u25B2"
                                      : "\u23F1",
                              }),
                              (0, o.jsx)("span", {
                                style: { fontSize: 12.5, color: je },
                                children: zt.text,
                              }),
                            ],
                          });
                        })(),
                        (0, o.jsx)(V2, { pts: Fu[E.id], home: E.h, away: E.a, live: !0 }),
                        E.pre &&
                          (0, o.jsx)("div", {
                            style: {
                              marginTop: 5,
                              fontSize: 11.5,
                              color: "#5C6478",
                              lineHeight: 1.45,
                            },
                            children:
                              "Vorbereitungsspiel: keine Prognose, sondern ein Test der Live-Mechanik \u2013 reagiert der Balken korrekt auf Spielstand, Restzeit und Ballbesitz? Es spielen \xFCberwiegend Backups; nichts davon flie\xDFt in Ratings, Modell oder Bilanz ein.",
                          }),
                      ],
                    },
                    "l" + E.h + E.a,
                  );
                }),
                z.length > 0 &&
                  (0, o.jsx)(K, {
                    note: z[0].pre
                      ? "Vorbereitungsspiele \u2013 ohne Prognose"
                      : `Woche ${(G(z[0]) || {}).w || ""}`,
                    children: "Als N\xE4chstes",
                  }),
                z.map((E, Y) => {
                  let Z = q(E);
                  return (0, o.jsxs)(
                    "button",
                    {
                      onClick: () => {
                        let lt = G(E);
                        lt && Fc(lt);
                      },
                      disabled: !G(E),
                      style: {
                        width: "100%",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: Y === 0 ? "#16203A" : "#131A2B",
                        border: "1px solid " + (Y === 0 ? "#D9A441" : "#26304A"),
                        borderRadius: 8,
                        padding: "10px 12px",
                        marginBottom: 6,
                        cursor: G(E) ? "pointer" : "default",
                        color: "#F0EDE2",
                        fontFamily: "Inter",
                      },
                      children: [
                        (0, o.jsx)("span", {
                          style: {
                            width: 4,
                            alignSelf: "stretch",
                            background: Z ? P[Z.fav][1] : "#3A4560",
                            borderRadius: 2,
                          },
                        }),
                        (0, o.jsxs)("span", {
                          style: { flex: 1, minWidth: 0 },
                          children: [
                            (0, o.jsxs)("span", {
                              style: { fontSize: 14 },
                              children: [
                                E.pre && (0, o.jsx)(N, {}),
                                E.a,
                                " ",
                                (0, o.jsx)("span", { style: { color: "#5C6478" }, children: "@" }),
                                " ",
                                E.h,
                              ],
                            }),
                            (0, o.jsxs)("span", {
                              style: {
                                display: "block",
                                fontSize: 11.5,
                                color: "#8C94A8",
                                fontFamily: "'IBM Plex Mono'",
                              },
                              children: [M(E.ko), " \xB7 ", U(E.ko)],
                            }),
                          ],
                        }),
                        Z
                          ? (0, o.jsxs)("span", {
                              style: {
                                fontFamily: "'IBM Plex Mono'",
                                fontSize: 13,
                                color: "#D9A441",
                                whiteSpace: "nowrap",
                              },
                              children: [Z.fav, " ", (Z.prob * 100).toFixed(0), " %"],
                            })
                          : (0, o.jsx)("span", {
                              style: { fontSize: 11.5, color: "#5C6478", whiteSpace: "nowrap" },
                              children: "keine Prognose",
                            }),
                      ],
                    },
                    "s" + E.h + E.a,
                  );
                }),
                H.length > 0 &&
                  (0, o.jsx)(K, {
                    note: "H\xE4kchen nur bei Pflichtspielen",
                    children: "Zuletzt gelaufen",
                  }),
                H.map((E) => {
                  let Y = E.hs > E.as ? E.h : E.hs < E.as ? E.a : null,
                    Z = _.find((at) => at.h === E.h && at.a === E.a),
                    lt = null,
                    $ = null;
                  return (
                    !E.pre &&
                      Z &&
                      Y &&
                      (($ =
                        ye(
                          Z.h,
                          Z.a,
                          {
                            restDiff: Math.max(-7, Math.min(7, Z.rd)),
                            homeRest: Z.hr,
                            awayRest: Z.ar,
                            gametime: Z.t,
                          },
                          y,
                          Qt,
                        ) >= 0.5
                          ? Z.h
                          : Z.a),
                      (lt = $ === Y)),
                    (0, o.jsxs)(
                      "div",
                      {
                        style: {
                          background: "#131A2B",
                          border: "1px solid #26304A",
                          borderRadius: 8,
                          padding: "9px 12px",
                          marginBottom: 6,
                        },
                        children: [
                          (0, o.jsxs)("div", {
                            style: { display: "flex", alignItems: "center", gap: 10 },
                            children: [
                              (0, o.jsx)("span", {
                                style: {
                                  width: 4,
                                  alignSelf: "stretch",
                                  background: Y ? P[Y][1] : "#3A4560",
                                  borderRadius: 2,
                                  minHeight: 18,
                                },
                              }),
                              (0, o.jsxs)("span", {
                                style: { flex: 1, fontSize: 14 },
                                children: [
                                  E.pre && (0, o.jsx)(N, {}),
                                  (0, o.jsx)("span", {
                                    style: { fontWeight: Y === E.a ? 600 : 400 },
                                    children: E.a,
                                  }),
                                  (0, o.jsxs)("span", {
                                    style: {
                                      fontFamily: "'IBM Plex Mono'",
                                      margin: "0 7px",
                                      color: "#C9CEDB",
                                    },
                                    children: [E.as, ":", E.hs],
                                  }),
                                  (0, o.jsx)("span", {
                                    style: { fontWeight: Y === E.h ? 600 : 400 },
                                    children: E.h,
                                  }),
                                ],
                              }),
                              lt !== null &&
                                (0, o.jsxs)("span", {
                                  style: {
                                    fontFamily: "'IBM Plex Mono'",
                                    fontSize: 11.5,
                                    color: lt ? "#8FCB9B" : "#E0685C",
                                    whiteSpace: "nowrap",
                                  },
                                  children: [lt ? "\u2713" : "\u2715", " Tipp ", $],
                                }),
                            ],
                          }),
                          Fu[E.id] && (0, o.jsx)(V2, { pts: Fu[E.id], home: E.h, away: E.a }),
                        ],
                      },
                      "d" + E.h + E.a,
                    )
                  );
                }),
                Gc !== null &&
                  d.length === 0 &&
                  z.length === 0 &&
                  H.length === 0 &&
                  (0, o.jsx)("p", {
                    style: {
                      fontSize: 13.5,
                      color: "#8C94A8",
                      border: "1px dashed #26304A",
                      borderRadius: 8,
                      padding: 16,
                      lineHeight: 1.6,
                      marginTop: 20,
                    },
                    children:
                      "Gerade keine Spiele im Zeitfenster (vier Tage zur\xFCck bis zehn Tage voraus).",
                  }),
                (0, o.jsx)("p", {
                  style: { marginTop: 16, fontSize: 11.5, color: "#5C6478", lineHeight: 1.5 },
                  children:
                    "Zeitfenster: vier Tage zur\xFCck bis zehn Tage voraus, alle Zeiten lokal. Spiele und Ergebnisse kommen live von ESPN \u2013 inklusive Preseason, die hier als Testbetrieb erscheint. Prognosen und Tipp-H\xE4kchen gibt es nur f\xFCr Pflichtspiele: In Vorbereitungsspielen stehen \xFCberwiegend Backups auf dem Feld, eine Vorhersage w\xE4re dort wertlos. Die verbindliche Saisonbilanz steht oben im Kopf.",
                }),
              ],
            });
          })(),
        j === "match" &&
          (0, o.jsxs)("main", {
            style: { maxWidth: 760, margin: "0 auto", padding: "24px 16px" },
            children: [
              us &&
                (0, o.jsxs)("div", {
                  style: {
                    marginBottom: 12,
                    fontFamily: "'IBM Plex Mono'",
                    fontSize: 12.5,
                    color: "#D9A441",
                  },
                  children: [us, " \xB7 Ruhetage automatisch gesetzt"],
                }),
              (0, o.jsxs)("div", {
                style: { display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" },
                children: [
                  (0, o.jsx)(Z2, {
                    label: "Heimteam",
                    value: t,
                    onChange: (s) => {
                      (e(s), Iu(null), $u(null), A(null));
                    },
                    exclude: l,
                  }),
                  (0, o.jsx)("button", {
                    onClick: () => {
                      (e(l), a(t), Iu(null), $u(null), A(null));
                    },
                    title: "Heim und Ausw\xE4rts tauschen",
                    style: {
                      background: "transparent",
                      border: "1px solid #26304A",
                      color: "#D9A441",
                      borderRadius: 6,
                      padding: "12px 14px",
                      cursor: "pointer",
                      fontSize: 16,
                    },
                    children: "\u21C4",
                  }),
                  (0, o.jsx)(Z2, {
                    label: "Ausw\xE4rtsteam",
                    value: l,
                    onChange: (s) => {
                      (a(s), Iu(null), $u(null), A(null));
                    },
                    exclude: t,
                  }),
                ],
              }),
              (0, o.jsxs)("div", {
                style: {
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 14,
                  alignItems: "center",
                },
                children: [
                  (0, o.jsx)(k2, { label: `QB ${t} f\xE4llt aus`, checked: n, onChange: u }),
                  (0, o.jsx)(k2, { label: `QB ${l} f\xE4llt aus`, checked: i, onChange: c }),
                  (0, o.jsxs)("div", {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      border: "1px solid #26304A",
                      borderRadius: 6,
                      padding: "6px 10px",
                    },
                    children: [
                      (0, o.jsx)("span", {
                        style: { fontSize: 13, color: "#8C94A8" },
                        children: "Ruhetage-Differenz",
                      }),
                      (0, o.jsx)("input", {
                        type: "range",
                        min: -7,
                        max: 7,
                        value: f,
                        onChange: (s) => m(Number(s.target.value)),
                        style: { accentColor: "#D9A441", width: 110 },
                      }),
                      (0, o.jsx)("span", {
                        style: {
                          fontFamily: "'IBM Plex Mono'",
                          fontSize: 13,
                          width: 24,
                          textAlign: "right",
                        },
                        children: f > 0 ? "+" + f : f,
                      }),
                    ],
                  }),
                ],
              }),
              (0, o.jsx)(rg, { pHome: Yn, homeCode: t, awayCode: l }),
              (0, o.jsxs)("div", {
                style: { marginTop: 8, fontSize: 14.5, color: "#C9CEDB" },
                children: [
                  "Das Modell sieht ",
                  (0, o.jsx)("strong", { style: { color: "#F0EDE2" }, children: P[os][0] }),
                  " vorn \u2013 ",
                  (pm * 100).toFixed(1),
                  " % Siegwahrscheinlichkeit",
                  cs !== null &&
                    (0, o.jsxs)("span", {
                      style: { color: "#D9A441" },
                      children: [
                        " (inkl. Claude-Anpassung, Basis: ",
                        (100 * (os === t ? Xc : 1 - Xc)).toFixed(1),
                        " %)",
                      ],
                    }),
                  ".",
                ],
              }),
              (0, o.jsx)(pg, {
                depth: jc,
                lineups: $2,
                home: t,
                away: l,
                injHome: (y && y[t] && y[t].inj) || 0,
                injAway: (y && y[l] && y[l].inj) || 0,
              }),
              (() => {
                let s = Bt && we && we[Bt.key];
                if (!s) return null;
                let b = s.edge,
                  w = s.conf === "hoch" ? "#8FCB9B" : s.conf === "mittel" ? "#D9A441" : "#E0685C";
                return (0, o.jsxs)("section", {
                  style: {
                    marginTop: 22,
                    background: "#131A2B",
                    border: "1px solid #26304A",
                    borderRadius: 10,
                    padding: 16,
                  },
                  children: [
                    (0, o.jsx)("div", {
                      style: {
                        fontFamily: "'Barlow Condensed'",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontSize: 17,
                        marginBottom: 10,
                      },
                      children: "Wie sicher ist sich das Modell?",
                    }),
                    (0, o.jsxs)("div", {
                      style: { display: "flex", gap: 18, flexWrap: "wrap", fontSize: 13.5 },
                      children: [
                        (0, o.jsxs)("span", {
                          style: { color: "#8C94A8" },
                          children: [
                            "Konfidenz: ",
                            (0, o.jsx)("strong", { style: { color: w }, children: s.conf }),
                            " ",
                            (0, o.jsxs)("span", {
                              style: { fontFamily: "'IBM Plex Mono'", fontSize: 12 },
                              children: ["(\xB1", s.sd, " P)"],
                            }),
                          ],
                        }),
                        s.arch_hit &&
                          (0, o.jsxs)("span", {
                            style: { color: "#8C94A8" },
                            children: [
                              "Spieltyp trifft historisch ",
                              (0, o.jsxs)("strong", {
                                style: { color: "#C9CEDB" },
                                children: [s.arch_hit, " %"],
                              }),
                            ],
                          }),
                      ],
                    }),
                    s.tags &&
                      s.tags.length > 0 &&
                      (0, o.jsx)("div", {
                        style: { display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 },
                        children: s.tags.map((B) =>
                          (0, o.jsx)(
                            "span",
                            {
                              style: {
                                fontSize: 11,
                                color: "#8C94A8",
                                border: "1px solid #26304A",
                                borderRadius: 3,
                                padding: "2px 6px",
                              },
                              children: B,
                            },
                            B,
                          ),
                        ),
                      }),
                    b &&
                      (0, o.jsxs)("div", {
                        style: { marginTop: 12, paddingTop: 10, borderTop: "1px solid #1A2033" },
                        children: [
                          (0, o.jsxs)("div", {
                            style: { fontSize: 13.5, color: "#C9CEDB" },
                            children: [
                              "Wir liegen ",
                              (0, o.jsxs)("strong", {
                                style: {
                                  color: b.edge >= 0 ? "#8FCB9B" : "#E0685C",
                                  fontFamily: "'IBM Plex Mono'",
                                },
                                children: [b.edge >= 0 ? "+" : "", b.edge, " Punkte"],
                              }),
                              " ",
                              b.edge >= 0 ? "\xFCber" : "unter",
                              " dem Markt (",
                              b.p_mkt,
                              " % f\xFCr ",
                              P[t][0],
                              ").",
                              " ",
                              "Haupttreiber: ",
                              (0, o.jsx)("strong", {
                                style: { color: "#F0EDE2" },
                                children: ts(b.src, b.src_label),
                              }),
                              ".",
                            ],
                          }),
                          (0, o.jsx)("div", {
                            style: {
                              marginTop: 6,
                              fontSize: 12.5,
                              color: b.trust === "niedrig" ? "#E0685C" : "#5C6478",
                              lineHeight: 1.5,
                            },
                            children:
                              b.trust === "niedrig"
                                ? "Vorsicht: Abweichungen aus dieser Quelle trafen historisch nur in 51,6 % der F\xE4lle \u2013 der Markt kennt Verletzungslagen meist besser als wir."
                                : "Abweichungen aus dieser Quelle trafen historisch in 65\u201366 % der F\xE4lle.",
                          }),
                        ],
                      }),
                  ],
                });
              })(),
              (0, o.jsxs)("section", {
                style: {
                  marginTop: 26,
                  background: "#131A2B",
                  border: "1px solid #26304A",
                  borderRadius: 10,
                  padding: 18,
                },
                children: [
                  (0, o.jsxs)("div", {
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 10,
                    },
                    children: [
                      (0, o.jsxs)("div", {
                        children: [
                          (0, o.jsx)("div", {
                            style: {
                              fontFamily: "'Barlow Condensed'",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              fontSize: 17,
                            },
                            children: "Claude-Kontextanalyse",
                          }),
                          (0, o.jsx)("div", {
                            style: { fontSize: 12.5, color: "#8C94A8" },
                            children:
                              "Liest aktuelle News per Websuche und passt die Elo-Werte an. Die Pipeline analysiert donnerstags und sonntags automatisch alle Spiele der Woche \u2013 hier kannst du eine Einzelanalyse nachziehen.",
                          }),
                        ],
                      }),
                      K2
                        ? (0, o.jsx)("button", {
                            onClick: gm,
                            disabled: v,
                            style: {
                              background: v ? "#26304A" : "#D9A441",
                              color: v ? "#8C94A8" : "#0A0D16",
                              border: "none",
                              borderRadius: 6,
                              padding: "10px 18px",
                              fontFamily: "'Barlow Condensed'",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              fontSize: 15,
                              cursor: v ? "wait" : "pointer",
                            },
                            children: v ? "Recherchiert\u2026" : "Analyse starten",
                          })
                        : (0, o.jsx)("span", {
                            style: { fontSize: 12.5, color: "#5C6478", maxWidth: 220 },
                            children:
                              "Nur in der Claude-App verf\xFCgbar \u2013 dort analysierte Spiele erscheinen hier trotzdem.",
                          }),
                    ],
                  }),
                  x &&
                    (0, o.jsx)("div", {
                      style: { marginTop: 12, color: "#E0685C", fontSize: 13.5 },
                      children: x,
                    }),
                  g &&
                    (0, o.jsxs)("div", {
                      style: { marginTop: 14 },
                      children: [
                        (0, o.jsxs)("div", {
                          style: {
                            display: "flex",
                            gap: 16,
                            fontFamily: "'IBM Plex Mono'",
                            fontSize: 14,
                          },
                          children: [
                            (0, o.jsxs)("span", {
                              children: [
                                t,
                                ": ",
                                (0, o.jsxs)("span", {
                                  style: { color: g.home_adj >= 0 ? "#8FCB9B" : "#E0685C" },
                                  children: [g.home_adj >= 0 ? "+" : "", g.home_adj, " Elo"],
                                }),
                              ],
                            }),
                            (0, o.jsxs)("span", {
                              children: [
                                l,
                                ": ",
                                (0, o.jsxs)("span", {
                                  style: { color: g.away_adj >= 0 ? "#8FCB9B" : "#E0685C" },
                                  children: [g.away_adj >= 0 ? "+" : "", g.away_adj, " Elo"],
                                }),
                              ],
                            }),
                          ],
                        }),
                        (0, o.jsx)("p", {
                          style: {
                            fontSize: 14.5,
                            lineHeight: 1.55,
                            color: "#C9CEDB",
                            margin: "10px 0 8px",
                          },
                          children: g.summary,
                        }),
                        g.factors.length > 0 &&
                          (0, o.jsx)("ul", {
                            style: {
                              margin: 0,
                              paddingLeft: 18,
                              fontSize: 13.5,
                              color: "#8C94A8",
                              lineHeight: 1.6,
                            },
                            children: g.factors.map((s, b) => (0, o.jsx)("li", { children: s }, b)),
                          }),
                      ],
                    }),
                ],
              }),
              (0, o.jsx)("p", {
                style: { marginTop: 18, fontSize: 12, color: "#5C6478", lineHeight: 1.5 },
                children:
                  "Ratings: Stand Ende Saison 2025. Backtest-Genauigkeit des Basismodells 2018\u20132025: ~64 %, Vegas ~66 %. Kein Wett-Tipp \u2013 ein Experiment.",
              }),
            ],
          }),
        j === "sched" &&
          (0, o.jsxs)("main", {
            style: { maxWidth: 640, margin: "0 auto", padding: "24px 16px" },
            children: [
              (0, o.jsx)("div", {
                style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 },
                children: Array.from({ length: 18 }, (s, b) => b + 1).map((s) =>
                  (0, o.jsx)(
                    "button",
                    {
                      onClick: () => Qc(s),
                      style: {
                        minWidth: 38,
                        padding: "7px 0",
                        background: ee === s ? "#D9A441" : "transparent",
                        color: ee === s ? "#0A0D16" : "#8C94A8",
                        border: "1px solid " + (ee === s ? "#D9A441" : "#26304A"),
                        borderRadius: 6,
                        fontFamily: "'IBM Plex Mono'",
                        fontSize: 13,
                        cursor: "pointer",
                      },
                      children: s,
                    },
                    s,
                  ),
                ),
              }),
              (() => {
                let s = _.filter((M) => M.w === ee && M.hs === null);
                if (!s.length) return null;
                let b = s.map((M) => {
                    let U = `${M.w}-${M.a}-${M.h}`,
                      L = ye(
                        M.h,
                        M.a,
                        {
                          restDiff: Math.max(-7, Math.min(7, M.rd)),
                          homeRest: M.hr,
                          awayRest: M.ar,
                          gametime: M.t,
                        },
                        y,
                        Qt,
                      ),
                      N = L >= 0.5 ? M.h : M.a,
                      K = Math.max(L, 1 - L),
                      E = null,
                      Y = null;
                    if (M.mh && M.ma) {
                      let Z = 1 / M.mh,
                        lt = 1 / M.ma,
                        $ = Z / (Z + lt);
                      ((E = $ >= 0.5 ? M.h : M.a), (Y = N === M.h ? $ : 1 - $));
                    }
                    return {
                      g: M,
                      key: U,
                      fav: N,
                      prob: K,
                      mktFav: E,
                      pMktFav: Y,
                      edge: Y !== null ? K - Y : null,
                      an: we && we[U],
                      ai: wl && wl[U],
                      lm: ku && ku[U],
                    };
                  }),
                  w = b.filter((M) => M.prob >= 0.7),
                  B = b.filter((M) => M.prob < 0.58),
                  T = b.filter((M) => M.mktFav && M.fav !== M.mktFav),
                  D = b.filter((M) => M.edge !== null).sort((M, U) => U.edge - M.edge)[0],
                  O = [...b].sort((M, U) => U.prob - M.prob)[0],
                  d = [...b].sort((M, U) => M.prob - U.prob)[0],
                  z = b
                    .filter((M) => M.lm)
                    .sort((M, U) => Math.abs(U.lm.move) - Math.abs(M.lm.move))[0],
                  H = b
                    .filter((M) => M.ai && (Math.abs(M.ai.ha) >= 15 || Math.abs(M.ai.aa) >= 15))
                    .sort(
                      (M, U) =>
                        Math.abs(U.ai.ha) +
                        Math.abs(U.ai.aa) -
                        (Math.abs(M.ai.ha) + Math.abs(M.ai.aa)),
                    )[0],
                  G = ({ label: M, wert: U, sub: L, farbe: N }) =>
                    (0, o.jsxs)("div", {
                      style: {
                        flex: "1 1 110px",
                        background: "#0E1220",
                        border: "1px solid #1F2740",
                        borderRadius: 8,
                        padding: "9px 11px",
                      },
                      children: [
                        (0, o.jsx)("div", {
                          style: {
                            fontSize: 10.5,
                            color: "#5C6478",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          },
                          children: M,
                        }),
                        (0, o.jsx)("div", {
                          style: {
                            fontFamily: "'IBM Plex Mono'",
                            fontSize: 19,
                            color: N || "#F0EDE2",
                            marginTop: 2,
                          },
                          children: U,
                        }),
                        L &&
                          (0, o.jsx)("div", {
                            style: { fontSize: 10.5, color: "#3A4560", marginTop: 1 },
                            children: L,
                          }),
                      ],
                    }),
                  q = ({ icon: M, titel: U, text: L, farbe: N }) =>
                    (0, o.jsxs)("div", {
                      style: {
                        display: "flex",
                        gap: 8,
                        marginTop: 7,
                        fontSize: 12.5,
                        lineHeight: 1.55,
                      },
                      children: [
                        (0, o.jsx)("span", { style: { flexShrink: 0 }, children: M }),
                        (0, o.jsxs)("span", {
                          style: { color: "#8C94A8" },
                          children: [
                            (0, o.jsx)("strong", { style: { color: N || "#C9CEDB" }, children: U }),
                            " ",
                            L,
                          ],
                        }),
                      ],
                    });
                return (0, o.jsxs)("section", {
                  style: {
                    marginBottom: 14,
                    background: "#131A2B",
                    border: "1px solid #26304A",
                    borderRadius: 10,
                    padding: 14,
                  },
                  children: [
                    (0, o.jsxs)("div", {
                      style: {
                        fontFamily: "'Barlow Condensed'",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontSize: 16,
                        marginBottom: 10,
                      },
                      children: [
                        "Woche ",
                        ee,
                        " \u2013 Vorschau",
                        (0, o.jsxs)("span", {
                          style: {
                            color: "#5C6478",
                            fontSize: 12,
                            marginLeft: 8,
                            letterSpacing: 0,
                          },
                          children: [s.length, " Spiele offen"],
                        }),
                      ],
                    }),
                    (0, o.jsxs)("div", {
                      style: { display: "flex", gap: 8, flexWrap: "wrap" },
                      children: [
                        (0, o.jsx)(G, {
                          label: "Bank-Picks",
                          wert: w.length,
                          sub: "ab 70 % Sicherheit",
                          farbe: "#8FCB9B",
                        }),
                        (0, o.jsx)(G, {
                          label: "M\xFCnzw\xFCrfe",
                          wert: B.length,
                          sub: "unter 58 %",
                          farbe: "#8C94A8",
                        }),
                        (0, o.jsx)(G, {
                          label: "Gegen den Markt",
                          wert: T.length,
                          sub: "unsere Gegenmeinung",
                          farbe: T.length ? "#7FB3D5" : void 0,
                        }),
                        D &&
                          D.edge > 0.02 &&
                          (0, o.jsx)(G, {
                            label: "Gr\xF6\xDFte Abweichung",
                            wert: `+${(D.edge * 100).toFixed(0)}`,
                            sub: `Punkte \xB7 ${D.fav}`,
                            farbe: "#D9A441",
                          }),
                      ],
                    }),
                    O &&
                      (0, o.jsx)(q, {
                        icon: "\u{1F512}",
                        titel: "Sicherster Pick:",
                        text: `${P[O.fav][0]} mit ${(O.prob * 100).toFixed(0)} % gegen ${P[O.fav === O.g.h ? O.g.a : O.g.h][0]}.`,
                        farbe: "#8FCB9B",
                      }),
                    d &&
                      d.prob < 0.58 &&
                      (0, o.jsx)(q, {
                        icon: "\u{1F3B2}",
                        titel: "Engstes Spiel:",
                        text: `${d.g.a} bei ${d.g.h} \u2013 wir sehen ${P[d.fav][0]} nur bei ${(d.prob * 100).toFixed(0)} %. Praktisch offen.`,
                      }),
                    D &&
                      D.edge > 0.02 &&
                      (0, o.jsx)(q, {
                        icon: "\u26A1",
                        titel: "Gr\xF6\xDFte Meinungsverschiedenheit:",
                        text: `Wir geben ${P[D.fav][0]} ${(D.prob * 100).toFixed(0)} %, der Markt nur ${(D.pMktFav * 100).toFixed(0)} %.${D.an && D.an.edge ? ` Treiber: ${ts(D.an.edge.src, D.an.edge.src_label)}.` : ""}`,
                        farbe: "#D9A441",
                      }),
                    z &&
                      (0, o.jsx)(q, {
                        icon: "\u{1F4C8}",
                        titel: "Auff\xE4lligste Linien-Bewegung:",
                        text: `${z.g.a} bei ${z.g.h} \u2013 der Markt ist seit ${z.lm.since} um ${Math.abs(z.lm.move).toFixed(1)} Punkte Richtung ${z.lm.move > 0 ? z.g.h : z.g.a} gewandert. Meist steckt eine Nachricht dahinter.`,
                      }),
                    H &&
                      (0, o.jsx)(q, {
                        icon: "\u{1F9E0}",
                        titel: "Fund der KI-Analyse:",
                        text: `${H.ai.summary}`,
                        farbe: "#7FB3D5",
                      }),
                    (0, o.jsx)("p", {
                      style: { marginTop: 10, fontSize: 11, color: "#3A4560", lineHeight: 1.5 },
                      children:
                        "Alle Angaben vor Anpfiff. Picks werden rund zweieinhalb Stunden vor Kickoff festgeschrieben \u2013 danach z\xE4hlt hier nur noch, was tats\xE4chlich getippt wurde.",
                    }),
                  ],
                });
              })(),
              (() => {
                let s = _.filter((L) => L.w === ee),
                  b = [];
                for (let L of s) {
                  let N = `${L.w}-${L.a}-${L.h}`,
                    K = ot[N],
                    E = Ku && Ku[N];
                  if (!K || !E) continue;
                  let Y = K.hs > K.as ? L.h : K.hs < K.as ? L.a : null;
                  Y &&
                    b.push({
                      g: L,
                      k: N,
                      fz: E,
                      win: Y,
                      ok: E.pick === Y,
                      vok: E.vp === Y,
                      dis: E.vp && E.pick !== E.vp,
                    });
                }
                if (!b.length) return null;
                let w = b.length,
                  B = b.filter((L) => L.ok).length,
                  T = b.filter((L) => L.vok).length,
                  D = b.filter((L) => L.dis),
                  O = D.filter((L) => L.ok).length,
                  d = b.filter((L) => L.fz.p >= 0.7),
                  z = d.filter((L) => L.ok).length,
                  H = b.filter((L) => !L.ok).sort((L, N) => N.fz.p - L.fz.p)[0],
                  G = D.filter((L) => L.ok).sort(
                    (L, N) => N.fz.p - (N.fz.pm || 0.5) - (L.fz.p - (L.fz.pm || 0.5)),
                  )[0],
                  q = b.reduce((L, N) => L + N.fz.p, 0) / w,
                  M = ({ label: L, wert: N, sub: K, farbe: E }) =>
                    (0, o.jsxs)("div", {
                      style: {
                        flex: "1 1 120px",
                        background: "#0E1220",
                        border: "1px solid #1F2740",
                        borderRadius: 8,
                        padding: "9px 11px",
                      },
                      children: [
                        (0, o.jsx)("div", {
                          style: {
                            fontSize: 10.5,
                            color: "#5C6478",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          },
                          children: L,
                        }),
                        (0, o.jsx)("div", {
                          style: {
                            fontFamily: "'IBM Plex Mono'",
                            fontSize: 19,
                            color: E || "#F0EDE2",
                            marginTop: 2,
                          },
                          children: N,
                        }),
                        K &&
                          (0, o.jsx)("div", {
                            style: { fontSize: 10.5, color: "#3A4560", marginTop: 1 },
                            children: K,
                          }),
                      ],
                    }),
                  U = B > T ? "#8FCB9B" : B < T ? "#E0685C" : "#D9A441";
                return (0, o.jsxs)("section", {
                  style: {
                    marginBottom: 14,
                    background: "#131A2B",
                    border: "1px solid " + (B >= T ? "#2E4A38" : "#26304A"),
                    borderRadius: 10,
                    padding: 14,
                  },
                  children: [
                    (0, o.jsxs)("div", {
                      style: {
                        fontFamily: "'Barlow Condensed'",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontSize: 16,
                        marginBottom: 10,
                      },
                      children: [
                        "Woche ",
                        ee,
                        " \u2013 Bilanz",
                        s.length > w &&
                          (0, o.jsxs)("span", {
                            style: {
                              color: "#5C6478",
                              fontSize: 12,
                              marginLeft: 8,
                              letterSpacing: 0,
                            },
                            children: [s.length - w, " Spiele offen"],
                          }),
                      ],
                    }),
                    (0, o.jsxs)("div", {
                      style: { display: "flex", gap: 8, flexWrap: "wrap" },
                      children: [
                        (0, o.jsx)(M, {
                          label: "Unser Modell",
                          wert: `${B}/${w}`,
                          sub: `${Math.round((100 * B) / w)} %`,
                          farbe: U,
                        }),
                        (0, o.jsx)(M, {
                          label: "Vegas",
                          wert: `${T}/${w}`,
                          sub: `${Math.round((100 * T) / w)} %`,
                        }),
                        D.length > 0 &&
                          (0, o.jsx)(M, {
                            label: "Bei Uneinigkeit",
                            wert: `${O}/${D.length}`,
                            sub: "der eigentliche Test",
                            farbe: O > D.length / 2 ? "#8FCB9B" : "#E0685C",
                          }),
                        d.length > 0 &&
                          (0, o.jsx)(M, {
                            label: "Bank-Picks",
                            wert: `${z}/${d.length}`,
                            sub: "ab 70 % Sicherheit",
                            farbe: z === d.length ? "#8FCB9B" : void 0,
                          }),
                        (0, o.jsx)(M, {
                          label: "Kalibrierung",
                          wert: `${Math.round(100 * q)} %`,
                          sub: `erwartet \xB7 real ${Math.round((100 * B) / w)} %`,
                        }),
                      ],
                    }),
                    (H || G) &&
                      (0, o.jsxs)("div", {
                        style: { marginTop: 10, fontSize: 12.5, color: "#8C94A8", lineHeight: 1.6 },
                        children: [
                          H &&
                            (0, o.jsxs)("div", {
                              children: [
                                "Gr\xF6\xDFte \xDCberraschung: ",
                                (0, o.jsx)("strong", {
                                  style: { color: "#E0685C" },
                                  children: P[H.win][0],
                                }),
                                " ",
                                "schl\xE4gt ",
                                P[H.fz.pick][0],
                                ", die wir bei ",
                                Math.round(100 * H.fz.p),
                                " % sahen.",
                              ],
                            }),
                          G &&
                            (0, o.jsxs)("div", {
                              children: [
                                "Bester Call gegen den Markt: ",
                                (0, o.jsx)("strong", {
                                  style: { color: "#8FCB9B" },
                                  children: P[G.fz.pick][0],
                                }),
                                " ",
                                "\u2013 Vegas favorisierte ",
                                P[G.fz.vp][0],
                                ".",
                              ],
                            }),
                        ],
                      }),
                  ],
                });
              })(),
              (0, o.jsxs)("button", {
                onClick: () => oe(!X),
                style: {
                  marginBottom: 14,
                  background: X ? "#E0685C" : "transparent",
                  color: X ? "#0A0D16" : "#E0685C",
                  border: "1px solid #E0685C",
                  borderRadius: 6,
                  padding: "7px 14px",
                  fontFamily: "'Barlow Condensed'",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: 14,
                  cursor: "pointer",
                },
                children: ["\u26A0 Nur Wackelkandidaten ", X ? "an" : ""],
              }),
              _.filter((s) => s.w === ee).map((s, b, w) => {
                let B = `${s.w}-${s.a}-${s.h}`,
                  T = ot[B],
                  D = ye(
                    s.h,
                    s.a,
                    {
                      restDiff: Math.max(-7, Math.min(7, s.rd)),
                      homeRest: s.hr,
                      awayRest: s.ar,
                      gametime: s.t,
                    },
                    y,
                    Qt,
                  ),
                  O = D >= 0.5 ? s.h : s.a,
                  d = Math.max(D, 1 - D),
                  z = null,
                  H = null;
                if (s.mh && s.ma) {
                  let $ = 1 / s.mh,
                    at = 1 / s.ma,
                    zt = $ / ($ + at);
                  ((z = zt >= 0.5 ? s.h : s.a), (H = Math.max(zt, 1 - zt)));
                }
                let G = !T && z && O !== z,
                  q = z ? (z === s.h ? D : 1 - D) : null,
                  M = !T && !G && z && H - q >= 0.05,
                  U = !T && !G && !M && d < 0.58,
                  L = !T && !G && d >= 0.7;
                if (X && !(M || G)) return null;
                let N = T ? (T.hs > T.as ? s.h : T.hs < T.as ? s.a : null) : null,
                  K = !T && wl[B],
                  E = null,
                  Y = null,
                  Z = null;
                if (K) {
                  let $ = ye(
                    s.h,
                    s.a,
                    {
                      restDiff: Math.max(-7, Math.min(7, s.rd)),
                      homeRest: s.hr,
                      awayRest: s.ar,
                      gametime: s.t,
                      eloAdjHome: K.ha,
                      eloAdjAway: K.aa,
                    },
                    y,
                    Qt,
                  );
                  ((E = $ >= 0.5 ? s.h : s.a), (Y = Math.max($, 1 - $)));
                  let at = O === s.h ? $ : 1 - $;
                  Z = at > d + 0.001 ? !0 : at < d - 0.001 ? !1 : null;
                }
                let lt = b === 0 || w[b - 1].d !== s.d;
                return (0, o.jsxs)(
                  "div",
                  {
                    children: [
                      lt &&
                        !X &&
                        (0, o.jsx)("div", {
                          style: {
                            fontFamily: "'Barlow Condensed'",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontSize: 13,
                            color: "#5C6478",
                            margin: "16px 0 6px",
                          },
                          children: Kc(s.d),
                        }),
                      (0, o.jsxs)("button", {
                        onClick: () => Fc(s),
                        style: {
                          width: "100%",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          background: "#131A2B",
                          border: "1px solid " + (M ? "#5A3A38" : "#26304A"),
                          borderRadius: 8,
                          padding: "11px 12px",
                          marginBottom: 6,
                          cursor: "pointer",
                          color: "#F0EDE2",
                          fontFamily: "Inter",
                        },
                        children: [
                          (0, o.jsx)("span", {
                            style: {
                              width: 4,
                              alignSelf: "stretch",
                              background: P[N || O][1],
                              borderRadius: 2,
                            },
                          }),
                          (0, o.jsxs)("span", {
                            style: { flex: 1, fontSize: 14.5 },
                            children: [
                              (0, o.jsx)("span", {
                                style: {
                                  fontWeight: (N || O) === s.a ? 600 : 400,
                                  color: N === s.a ? "#8FCB9B" : N ? "#5C6478" : "#F0EDE2",
                                },
                                children: P[s.a][0],
                              }),
                              (0, o.jsx)("span", { style: { color: "#5C6478" }, children: " @ " }),
                              (0, o.jsx)("span", {
                                style: {
                                  fontWeight: (N || O) === s.h ? 600 : 400,
                                  color: N === s.h ? "#8FCB9B" : N ? "#5C6478" : "#F0EDE2",
                                },
                                children: P[s.h][0],
                              }),
                              s.dv === 1 &&
                                (0, o.jsx)("span", {
                                  style: {
                                    marginLeft: 6,
                                    fontSize: 10.5,
                                    color: "#8C94A8",
                                    border: "1px solid #26304A",
                                    borderRadius: 3,
                                    padding: "1px 4px",
                                    verticalAlign: "middle",
                                  },
                                  children: "DIV",
                                }),
                              G &&
                                (0, o.jsx)("span", {
                                  title: `Der Markt favorisiert ${z}, unser Modell ${O}`,
                                  style: {
                                    marginLeft: 6,
                                    fontSize: 10.5,
                                    color: "#7FB3D5",
                                    border: "1px solid #2E4658",
                                    borderRadius: 3,
                                    padding: "1px 4px",
                                    verticalAlign: "middle",
                                    fontWeight: 600,
                                  },
                                  children: "GEGEN DEN MARKT",
                                }),
                              M &&
                                (0, o.jsx)("span", {
                                  title: `Markt sieht ${z} bei ${(H * 100).toFixed(0)} %, wir nur bei ${(q * 100).toFixed(0)} %`,
                                  style: {
                                    marginLeft: 6,
                                    fontSize: 10.5,
                                    color: "#E0685C",
                                    border: "1px solid #5A3A38",
                                    borderRadius: 3,
                                    padding: "1px 4px",
                                    verticalAlign: "middle",
                                    fontWeight: 600,
                                  },
                                  children: "\u26A0 FAVORIT WACKELT",
                                }),
                              U &&
                                (0, o.jsx)("span", {
                                  title: "Beide Teams nah beieinander \u2013 kaum vorhersagbar",
                                  style: {
                                    marginLeft: 6,
                                    fontSize: 10.5,
                                    color: "#8C94A8",
                                    border: "1px solid #26304A",
                                    borderRadius: 3,
                                    padding: "1px 4px",
                                    verticalAlign: "middle",
                                  },
                                  children: "M\xDCNZWURF",
                                }),
                              L &&
                                (0, o.jsx)("span", {
                                  style: {
                                    marginLeft: 6,
                                    fontSize: 10.5,
                                    color: "#8FCB9B",
                                    border: "1px solid #2E4A38",
                                    borderRadius: 3,
                                    padding: "1px 4px",
                                    verticalAlign: "middle",
                                    fontWeight: 600,
                                  },
                                  children: "BANK",
                                }),
                              (() => {
                                let $ = we && we[B];
                                if (!$ || T) return null;
                                let at = [];
                                $.conf === "niedrig" &&
                                  at.push(
                                    (0, o.jsx)(
                                      "span",
                                      {
                                        title: `Bootstrap-Streuung ${$.sd} Punkte \u2013 Modelle uneins`,
                                        style: {
                                          marginLeft: 6,
                                          fontSize: 10.5,
                                          color: "#8C94A8",
                                          border: "1px solid #26304A",
                                          borderRadius: 3,
                                          padding: "1px 4px",
                                          verticalAlign: "middle",
                                        },
                                        children: "WACKELIG",
                                      },
                                      "c",
                                    ),
                                  );
                                let zt = ku && ku[B];
                                return (
                                  zt &&
                                    at.push(
                                      (0, o.jsxs)(
                                        "span",
                                        {
                                          title: `Markt seit ${zt.since}: ${zt.open} % -> ${zt.now} % f\xFCr das Heimteam`,
                                          style: {
                                            marginLeft: 6,
                                            fontSize: 10.5,
                                            color: "#D9A441",
                                            border: "1px solid #4A3D22",
                                            borderRadius: 3,
                                            padding: "1px 4px",
                                            verticalAlign: "middle",
                                          },
                                          children: [
                                            "LINIE ",
                                            zt.move > 0 ? "\u25B2" : "\u25BC",
                                            " ",
                                            Math.abs(zt.move).toFixed(1),
                                          ],
                                        },
                                        "m",
                                      ),
                                    ),
                                  $.edge &&
                                    $.edge.trust === "niedrig" &&
                                    Math.abs($.edge.edge) >= 4 &&
                                    at.push(
                                      (0, o.jsx)(
                                        "span",
                                        {
                                          title:
                                            "Abweichung vom Markt stammt vor allem aus Verletzungsdaten \u2013 historisch nur 51,6 % Trefferquote",
                                          style: {
                                            marginLeft: 6,
                                            fontSize: 10.5,
                                            color: "#E0685C",
                                            border: "1px solid #5A3A38",
                                            borderRadius: 3,
                                            padding: "1px 4px",
                                            verticalAlign: "middle",
                                          },
                                          children: "EDGE UNSICHER",
                                        },
                                        "e",
                                      ),
                                    ),
                                  at
                                );
                              })(),
                            ],
                          }),
                          T
                            ? (0, o.jsxs)("span", {
                                style: {
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  whiteSpace: "nowrap",
                                },
                                children: [
                                  (0, o.jsxs)("span", {
                                    style: {
                                      fontFamily: "'IBM Plex Mono'",
                                      fontSize: 13.5,
                                      color: "#C9CEDB",
                                    },
                                    children: [T.as, ":", T.hs],
                                  }),
                                  (() => {
                                    if (!N) return null;
                                    let $ = Ku && Ku[B];
                                    if (!$) return null;
                                    let at = $.pick === N,
                                      zt = $.p;
                                    return (0, o.jsxs)("span", {
                                      title:
                                        "Vorab getippt war " +
                                        $.pick +
                                        (at ? " \u2013 richtig" : " \u2013 daneben"),
                                      style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        fontFamily: "'IBM Plex Mono'",
                                        fontSize: 11.5,
                                        color: at ? "#8FCB9B" : "#E0685C",
                                        border: "1px solid " + (at ? "#2E4A38" : "#5A3A38"),
                                        borderRadius: 4,
                                        padding: "2px 6px",
                                      },
                                      children: [
                                        at ? "\u2713" : "\u2715",
                                        " ",
                                        $.pick,
                                        " ",
                                        (zt * 100).toFixed(0),
                                        " %",
                                      ],
                                    });
                                  })(),
                                ],
                              })
                            : (0, o.jsxs)("span", {
                                style: {
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "flex-end",
                                  whiteSpace: "nowrap",
                                },
                                children: [
                                  (0, o.jsxs)("span", {
                                    style: {
                                      fontFamily: "'IBM Plex Mono'",
                                      fontSize: 13.5,
                                      color: G
                                        ? "#7FB3D5"
                                        : M
                                          ? "#E0685C"
                                          : L
                                            ? "#8FCB9B"
                                            : "#D9A441",
                                    },
                                    children: [O, " ", (d * 100).toFixed(0), " %"],
                                  }),
                                  K &&
                                    (0, o.jsxs)("span", {
                                      style: {
                                        fontFamily: "'IBM Plex Mono'",
                                        fontSize: 11.5,
                                        color:
                                          Z === !0 ? "#8FCB9B" : Z === !1 ? "#E0685C" : "#8C94A8",
                                      },
                                      children: [
                                        "KI ",
                                        Z === !0 ? "\u25B2" : Z === !1 ? "\u25BC" : "\u2022",
                                        " ",
                                        E,
                                        " ",
                                        (Y * 100).toFixed(0),
                                        " %",
                                      ],
                                    }),
                                ],
                              }),
                        ],
                      }),
                    ],
                  },
                  s.h + s.a,
                );
              }),
              X &&
                _.filter(
                  (s) =>
                    s.w === ee &&
                    !ot[`${s.w}-${s.a}-${s.h}`] &&
                    Math.max(
                      ye(
                        s.h,
                        s.a,
                        {
                          restDiff: Math.max(-7, Math.min(7, s.rd)),
                          homeRest: s.hr,
                          awayRest: s.ar,
                          gametime: s.t,
                        },
                        y,
                        Qt,
                      ),
                      1 -
                        ye(
                          s.h,
                          s.a,
                          {
                            restDiff: Math.max(-7, Math.min(7, s.rd)),
                            homeRest: s.hr,
                            awayRest: s.ar,
                            gametime: s.t,
                          },
                          y,
                          Qt,
                        ),
                    ) < 0.58,
                ).length === 0 &&
                (0, o.jsxs)("p", {
                  style: { fontSize: 13.5, color: "#8C94A8" },
                  children: [
                    "Keine Wackelkandidaten in Woche ",
                    ee,
                    " \u2013 das Modell sieht \xFCberall klare Favoriten. W\xE4hl eine andere Woche.",
                  ],
                }),
              (0, o.jsx)("p", {
                style: { marginTop: 14, fontSize: 12, color: "#5C6478", lineHeight: 1.5 },
                children:
                  "Offizieller Spielplan 2026. Drei Markierungen, drei Bedeutungen: BANK = unser Favorit \xFCber 70 % (traf im Backtest 74,6 %). \u26A0 FAVORIT WACKELT = wir stimmen dem Markt beim Sieger zu, sehen ihn aber mindestens 5 Punkte schw\xE4cher \u2013 der Favorit ist anf\xE4lliger, als die Quote nahelegt. GEGEN DEN MARKT = wir tippen den Au\xDFenseiter, sind also anderer Meinung als die Buchmacher. M\xDCNZWURF = schlicht ein enges Spiel (im Backtest 53,7 % Trefferquote). Gespielte Partien zeigen das Endergebnis. Antippen l\xE4dt das Spiel ins Matchup.",
              }),
            ],
          }),
        j === "slip" &&
          (0, o.jsxs)("main", {
            style: { maxWidth: 680, margin: "0 auto", padding: "24px 16px" },
            children: [
              (0, o.jsx)("div", {
                style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 },
                children: Array.from({ length: 18 }, (s, b) => b + 1).map((s) =>
                  (0, o.jsx)(
                    "button",
                    {
                      onClick: () => {
                        (Qc(s), sl([]));
                      },
                      style: {
                        minWidth: 38,
                        padding: "7px 0",
                        background: ee === s ? "#D9A441" : "transparent",
                        color: ee === s ? "#0A0D16" : "#8C94A8",
                        border: "1px solid " + (ee === s ? "#D9A441" : "#26304A"),
                        borderRadius: 6,
                        fontFamily: "'IBM Plex Mono'",
                        fontSize: 13,
                        cursor: "pointer",
                      },
                      children: s,
                    },
                    s,
                  ),
                ),
              }),
              (0, o.jsxs)("div", {
                style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 },
                children: [
                  [
                    ["sicher", "Sicherheits-Schein (3 Legs)"],
                    ["mix", "Ausgewogen (5 Legs)"],
                    ["risiko", "Kalkuliertes Risiko (2 + \xDCberraschung)"],
                  ].map(([s, b]) =>
                    (0, o.jsx)(
                      "button",
                      {
                        onClick: () => Em(s),
                        style: {
                          background: "transparent",
                          color: "#D9A441",
                          border: "1px solid #D9A441",
                          borderRadius: 6,
                          padding: "8px 12px",
                          fontFamily: "'Barlow Condensed'",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          fontSize: 13.5,
                          cursor: "pointer",
                        },
                        children: b,
                      },
                      s,
                    ),
                  ),
                  yt.length > 0 &&
                    (0, o.jsx)("button", {
                      onClick: () => sl([]),
                      style: {
                        background: "transparent",
                        color: "#8C94A8",
                        border: "1px solid #26304A",
                        borderRadius: 6,
                        padding: "8px 12px",
                        fontSize: 13,
                        cursor: "pointer",
                      },
                      children: "Leeren",
                    }),
                ],
              }),
              (0, o.jsxs)("section", {
                style: {
                  background: "#131A2B",
                  border: "1px solid #26304A",
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 16,
                },
                children: [
                  (0, o.jsx)("div", {
                    style: {
                      fontFamily: "'Barlow Condensed'",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontSize: 15,
                      marginBottom: 8,
                    },
                    children: "Ziel-Optimierer",
                  }),
                  (0, o.jsxs)("div", {
                    style: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
                    children: [
                      (0, o.jsx)("span", {
                        style: { fontSize: 13, color: "#8C94A8" },
                        children: "Der Schein soll mindestens",
                      }),
                      (0, o.jsx)("input", {
                        type: "range",
                        min: 10,
                        max: 70,
                        step: 5,
                        value: qn,
                        onChange: (s) => fm(Number(s.target.value)),
                        style: { accentColor: "#D9A441", width: 150 },
                      }),
                      (0, o.jsxs)("span", {
                        style: {
                          fontFamily: "'IBM Plex Mono'",
                          fontSize: 15,
                          color: "#D9A441",
                          width: 44,
                        },
                        children: [qn, " %"],
                      }),
                      (0, o.jsx)("span", {
                        style: { fontSize: 13, color: "#8C94A8" },
                        children: "Gesamtwahrscheinlichkeit haben.",
                      }),
                    ],
                  }),
                  (0, o.jsx)("div", {
                    style: {
                      marginTop: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    },
                    children:
                      oa.legs.length > 0
                        ? (0, o.jsxs)(o.Fragment, {
                            children: [
                              (0, o.jsxs)("span", {
                                style: { fontSize: 13.5, color: "#C9CEDB" },
                                children: [
                                  "Optimum diese Woche: ",
                                  (0, o.jsxs)("strong", { children: [oa.legs.length, " Legs"] }),
                                  " bei ",
                                  (0, o.jsxs)("span", {
                                    style: { fontFamily: "'IBM Plex Mono'", color: "#8FCB9B" },
                                    children: [(oa.prod * 100).toFixed(1), " %"],
                                  }),
                                  oa.nextP !== null &&
                                    (0, o.jsxs)("span", {
                                      style: { color: "#5C6478" },
                                      children: [
                                        " \xB7 Leg ",
                                        oa.legs.length + 1,
                                        " w\xFCrde auf ",
                                        (oa.nextP * 100).toFixed(1),
                                        " % dr\xFCcken",
                                      ],
                                    }),
                                ],
                              }),
                              (0, o.jsx)("button", {
                                onClick: Tm,
                                style: {
                                  background: "#D9A441",
                                  color: "#0A0D16",
                                  border: "none",
                                  borderRadius: 6,
                                  padding: "7px 14px",
                                  fontFamily: "'Barlow Condensed'",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.06em",
                                  fontSize: 13.5,
                                  cursor: "pointer",
                                },
                                children: "\xDCbernehmen",
                              }),
                            ],
                          })
                        : (0, o.jsxs)("span", {
                            style: { fontSize: 13.5, color: "#E0685C" },
                            children: [
                              "Kein einziges Spiel erreicht ",
                              qn,
                              " % \u2013 Ziel senken oder andere Woche w\xE4hlen.",
                            ],
                          }),
                  }),
                ],
              }),
              yt.length === 0 &&
                (0, o.jsx)("button", {
                  onClick: fs,
                  style: {
                    marginBottom: 16,
                    background: "transparent",
                    color: "#8FCB9B",
                    border: "1px dashed #2E4A38",
                    borderRadius: 8,
                    padding: "10px 16px",
                    fontSize: 13.5,
                    cursor: "pointer",
                    width: "100%",
                  },
                  children: "+ Bestes Spiel der Woche als erstes Leg hinzuf\xFCgen",
                }),
              yt.length > 0 &&
                (0, o.jsxs)("section", {
                  style: {
                    background: "#131A2B",
                    border: "1px solid #D9A441",
                    borderRadius: 10,
                    padding: 16,
                    marginBottom: 20,
                  },
                  children: [
                    (0, o.jsxs)("div", {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      },
                      children: [
                        (0, o.jsxs)("span", {
                          style: {
                            fontFamily: "'Barlow Condensed'",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            fontSize: 17,
                          },
                          children: ["Dein Schein \xB7 ", yt.length, " Legs"],
                        }),
                        (0, o.jsxs)("span", {
                          style: { display: "flex", gap: 6 },
                          children: [
                            (0, o.jsx)("button", {
                              onClick: Cm,
                              title: "Schw\xE4chstes Leg entfernen",
                              style: {
                                width: 34,
                                height: 34,
                                borderRadius: 6,
                                background: "transparent",
                                color: "#E0685C",
                                border: "1px solid #5A3A38",
                                fontSize: 18,
                                cursor: "pointer",
                              },
                              children: "\u2212",
                            }),
                            (0, o.jsx)("button", {
                              onClick: fs,
                              title: "Bestes verbleibendes Spiel hinzuf\xFCgen",
                              style: {
                                width: 34,
                                height: 34,
                                borderRadius: 6,
                                background: "transparent",
                                color: "#8FCB9B",
                                border: "1px solid #2E4A38",
                                fontSize: 18,
                                cursor: "pointer",
                              },
                              children: "+",
                            }),
                          ],
                        }),
                      ],
                    }),
                    yt.map((s) => {
                      let b = s.q ? s.q * s.p : null,
                        w =
                          b === null
                            ? "#5C6478"
                            : b >= 1.03
                              ? "#8FCB9B"
                              : b >= 0.97
                                ? "#D9A441"
                                : "#E0685C",
                        B =
                          b === null
                            ? null
                            : b >= 1.03
                              ? "+EV"
                              : b >= 0.97
                                ? "fair"
                                : "\u2212EV Falle";
                      return (0, o.jsxs)(
                        "div",
                        {
                          style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "6px 0",
                            borderBottom: "1px solid #1A2033",
                            flexWrap: "wrap",
                          },
                          children: [
                            (0, o.jsx)("span", {
                              style: {
                                width: 4,
                                alignSelf: "stretch",
                                background: P[s.team][1],
                                borderRadius: 2,
                              },
                            }),
                            (0, o.jsxs)("span", {
                              style: { flex: 1, fontSize: 14, minWidth: 130 },
                              children: [
                                P[s.team][0],
                                " ",
                                (0, o.jsx)("span", {
                                  style: { color: "#5C6478", fontSize: 12.5 },
                                  children: s.label,
                                }),
                              ],
                            }),
                            (0, o.jsxs)("span", {
                              style: {
                                fontFamily: "'IBM Plex Mono'",
                                fontSize: 13.5,
                                color: "#D9A441",
                              },
                              children: [(s.p * 100).toFixed(0), " %"],
                            }),
                            (0, o.jsx)("input", {
                              type: "text",
                              inputMode: "decimal",
                              placeholder: "Quote",
                              value: s.q || "",
                              onChange: (T) => zm(s.key, T.target.value),
                              style: {
                                width: 58,
                                padding: "6px 6px",
                                background: "#0A0D16",
                                color: "#F0EDE2",
                                border: "1px solid #26304A",
                                borderRadius: 5,
                                fontFamily: "'IBM Plex Mono'",
                                fontSize: 13,
                                textAlign: "center",
                              },
                            }),
                            b !== null &&
                              (0, o.jsxs)("span", {
                                title: `Value-Faktor ${b.toFixed(2)} \xB7 Quote impliziert ${(100 / s.q).toFixed(0)} %`,
                                style: {
                                  fontFamily: "'IBM Plex Mono'",
                                  fontSize: 11.5,
                                  color: w,
                                  border: `1px solid ${w}`,
                                  borderRadius: 3,
                                  padding: "2px 5px",
                                  whiteSpace: "nowrap",
                                },
                                children: [b.toFixed(2), "\xD7 ", B],
                              }),
                            (0, o.jsx)("button", {
                              onClick: () => sl((T) => T.filter((D) => D.key !== s.key)),
                              style: {
                                background: "transparent",
                                border: "none",
                                color: "#5C6478",
                                cursor: "pointer",
                                fontSize: 15,
                              },
                              children: "\u2715",
                            }),
                          ],
                        },
                        s.key,
                      );
                    }),
                    (0, o.jsxs)("div", {
                      style: {
                        marginTop: 14,
                        display: "flex",
                        alignItems: "baseline",
                        gap: 10,
                        flexWrap: "wrap",
                      },
                      children: [
                        (0, o.jsxs)("span", {
                          style: {
                            fontFamily: "'IBM Plex Mono'",
                            fontSize: 30,
                            color: jn >= 0.4 ? "#8FCB9B" : jn >= 0.2 ? "#D9A441" : "#E0685C",
                          },
                          children: [(jn * 100).toFixed(1), " %"],
                        }),
                        (0, o.jsxs)("span", {
                          style: { fontSize: 13.5, color: "#8C94A8" },
                          children: [
                            "dass ALLE ",
                            yt.length,
                            " richtig sind (Produkt der Einzelwahrscheinlichkeiten)",
                          ],
                        }),
                      ],
                    }),
                    yt.every((s) => s.q)
                      ? (() => {
                          let s = yt.reduce((B, T) => B * T.q, 1),
                            b = s * jn - 1,
                            w = [...yt].sort((B, T) => B.q * B.p - T.q * T.p)[0];
                          return (0, o.jsxs)("div", {
                            style: {
                              marginTop: 10,
                              padding: "10px 12px",
                              background: "#0A0D16",
                              border: "1px solid #26304A",
                              borderRadius: 8,
                            },
                            children: [
                              (0, o.jsxs)("div", {
                                style: {
                                  display: "flex",
                                  gap: 16,
                                  flexWrap: "wrap",
                                  fontFamily: "'IBM Plex Mono'",
                                  fontSize: 14,
                                },
                                children: [
                                  (0, o.jsxs)("span", {
                                    style: { color: "#C9CEDB" },
                                    children: ["Gesamtquote ", s.toFixed(2)],
                                  }),
                                  (0, o.jsxs)("span", {
                                    style: {
                                      color:
                                        b >= 0.02 ? "#8FCB9B" : b >= -0.02 ? "#D9A441" : "#E0685C",
                                    },
                                    children: [
                                      "Erwartungswert ",
                                      b >= 0 ? "+" : "",
                                      (b * 100).toFixed(1),
                                      " % pro Einsatz",
                                    ],
                                  }),
                                ],
                              }),
                              w &&
                                w.q * w.p < 0.97 &&
                                (0, o.jsxs)("div", {
                                  style: { marginTop: 6, fontSize: 12.5, color: "#E0685C" },
                                  children: [
                                    "Schw\xE4chstes Leg: ",
                                    P[w.team][0],
                                    " \u2013 Faktor ",
                                    (w.q * w.p).toFixed(2),
                                    ". Rausnehmen w\xFCrde den EV verbessern: volles Risiko, aber unterbezahlt.",
                                  ],
                                }),
                            ],
                          });
                        })()
                      : (0, o.jsx)("div", {
                          style: { marginTop: 8, fontSize: 12.5, color: "#5C6478" },
                          children:
                            "Quoten werden automatisch aus den Marktdaten vorausgef\xFCllt, sobald verf\xFCgbar (\xFCberschreibbar \u2013 dein Anbieter kann abweichen). Fehlt eine, trag sie ein: Dann rechnet der Schein den echten Erwartungswert.",
                        }),
                    fa &&
                      (0, o.jsxs)("div", {
                        style: {
                          marginTop: 10,
                          padding: "10px 12px",
                          background: "#0A0D16",
                          border: "1px solid " + (fa.rho > 0.4 ? "#5A3A38" : "#26304A"),
                          borderRadius: 8,
                        },
                        children: [
                          (0, o.jsxs)("div", {
                            style: {
                              fontSize: 13,
                              color: fa.rho > 0.4 ? "#E0685C" : "#C9CEDB",
                              lineHeight: 1.55,
                            },
                            children: [
                              (0, o.jsxs)("strong", {
                                children: ["Klumpenrisiko ", fa.rho.toFixed(2)],
                              }),
                              " \u2013 mehrere Legs h\xE4ngen an denselben Modell-Annahmen. Liegt das Modell bei diesem Spieltyp daneben, kippen sie gemeinsam. Realistisch eher ",
                              (0, o.jsxs)("span", {
                                style: { fontFamily: "'IBM Plex Mono'" },
                                children: [(fa.pCorr * 100).toFixed(1), " %"],
                              }),
                              " ",
                              "statt der rechnerischen ",
                              (jn * 100).toFixed(1),
                              " %.",
                            ],
                          }),
                          fa.cluster.length > 0 &&
                            (0, o.jsxs)("div", {
                              style: { marginTop: 6, fontSize: 12.5, color: "#8C94A8" },
                              children: [
                                "Geh\xE4uft: ",
                                fa.cluster.map(([s, b]) => `${b}\xD7 ${s}`).join(", "),
                                ". Mische andere Spieltypen dazu.",
                              ],
                            }),
                        ],
                      }),
                    (0, o.jsx)("div", {
                      style: { marginTop: 12 },
                      children: Nm.map((s, b) =>
                        (0, o.jsxs)(
                          "div",
                          {
                            style: {
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 3,
                            },
                            children: [
                              (0, o.jsxs)("span", {
                                style: {
                                  fontFamily: "'IBM Plex Mono'",
                                  fontSize: 12,
                                  color: "#8C94A8",
                                  width: 84,
                                },
                                children: [b, " von ", yt.length, " richtig"],
                              }),
                              (0, o.jsx)("div", {
                                style: {
                                  flex: 1,
                                  height: 10,
                                  background: "#1A2033",
                                  borderRadius: 5,
                                  overflow: "hidden",
                                },
                                children: (0, o.jsx)("div", {
                                  style: {
                                    width: `${s * 100}%`,
                                    height: "100%",
                                    background: b === yt.length ? "#8FCB9B" : "#3A4560",
                                  },
                                }),
                              }),
                              (0, o.jsxs)("span", {
                                style: {
                                  fontFamily: "'IBM Plex Mono'",
                                  fontSize: 12,
                                  color: "#8C94A8",
                                  width: 46,
                                  textAlign: "right",
                                },
                                children: [(s * 100).toFixed(1), " %"],
                              }),
                            ],
                          },
                          b,
                        ),
                      ),
                    }),
                  ],
                }),
              [...new Set(Ua.map((s) => s.d))].sort().flatMap((s) =>
                ["19-Uhr-Fenster", "22-Uhr-Fenster", "Nachtspiele", "Sonstige"].map((b) => {
                  let w = Ua.filter((T) => T.d === s && Sm(T.t) === b);
                  if (!w.length) return null;
                  let B = b === "Nachtspiele";
                  return (0, o.jsxs)(
                    "div",
                    {
                      children: [
                        (0, o.jsxs)("div", {
                          style: {
                            fontFamily: "'Barlow Condensed'",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontSize: 13,
                            color: "#5C6478",
                            margin: "16px 0 6px",
                          },
                          children: [
                            Kc(s),
                            " \xB7 ",
                            b,
                            B ? " (dt. Folgenacht)" : "",
                            " ",
                            (0, o.jsx)("span", {
                              style: { color: "#3A4560" },
                              children: "\xB7 dt. Zeit",
                            }),
                          ],
                        }),
                        w.map((T) => {
                          let D = yt.find((O) => O.key === T.key);
                          return (0, o.jsxs)(
                            "div",
                            {
                              style: {
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                background: "#131A2B",
                                border: "1px solid " + (D ? "#D9A441" : "#26304A"),
                                borderRadius: 8,
                                padding: "9px 10px",
                                marginBottom: 6,
                              },
                              children: [
                                (0, o.jsx)("span", {
                                  style: {
                                    fontFamily: "'IBM Plex Mono'",
                                    fontSize: 11.5,
                                    color: "#5C6478",
                                    width: 40,
                                  },
                                  children: bm(T.t),
                                }),
                                [
                                  [T.a, 1 - T.pH],
                                  [T.h, T.pH],
                                ].map(([O, d]) =>
                                  (0, o.jsxs)(
                                    "button",
                                    {
                                      onClick: () => Am(T, O),
                                      style: {
                                        flex: 1,
                                        padding: "8px 6px",
                                        borderRadius: 6,
                                        cursor: "pointer",
                                        fontFamily: "Inter",
                                        fontSize: 13,
                                        background: D && D.team === O ? P[O][1] : "transparent",
                                        color: D && D.team === O ? "#F0EDE2" : "#C9CEDB",
                                        border:
                                          "1px solid " + (D && D.team === O ? P[O][1] : "#26304A"),
                                      },
                                      children: [
                                        O,
                                        " ",
                                        (0, o.jsxs)("span", {
                                          style: {
                                            fontFamily: "'IBM Plex Mono'",
                                            fontSize: 12.5,
                                            opacity: 0.85,
                                          },
                                          children: [(d * 100).toFixed(0), " %"],
                                        }),
                                        (O === T.h ? T.mh : T.ma) &&
                                          (0, o.jsxs)("span", {
                                            style: {
                                              display: "block",
                                              fontFamily: "'IBM Plex Mono'",
                                              fontSize: 10.5,
                                              opacity: 0.6,
                                            },
                                            children: ["@", (O === T.h ? T.mh : T.ma).toFixed(2)],
                                          }),
                                      ],
                                    },
                                    O,
                                  ),
                                ),
                              ],
                            },
                            T.key,
                          );
                        }),
                      ],
                    },
                    s + b,
                  );
                }),
              ),
              (0, o.jsx)("p", {
                style: { marginTop: 16, fontSize: 12, color: "#5C6478", lineHeight: 1.5 },
                children:
                  'Fehler-Korrelation: Die Multiplikation der Einzelwahrscheinlichkeiten unterstellt, dass die Legs unabh\xE4ngig sind. Ihre Ergebnisse sind es weitgehend \u2013 die Fehler unseres Modells aber nicht: Spiele desselben Archetyps (z. B. Heimfavorit im Saisonstart) kippen gemeinsam, wenn das Modell bei diesem Typ danebenliegt (gemessene Wochenkorrelation bis 0,72). Value-Logik: Ein Leg geh\xF6rt nur auf den Schein, wenn Quote \xD7 Modellwahrscheinlichkeit \xFCber 1 liegt. Beispiel: 80 % Siegchance bei Quote 1.12 = Faktor 0.90 \u2013 die Quote impliziert 89 %, du tr\xE4gst also volles Risiko f\xFCr zu wenig Auszahlung, und ein einziges solches Leg dr\xFCckt den EV des ganzen Scheins. Wichtig zur Ehrlichkeit: Der berechnete \u201EEdge" ist nur so gut wie unser Modell \u2013 ob unsere Abweichungen vom Markt echt sind, misst das Vegas-Duell \xFCber die Saison. Modell-Rechenspiel, kein Wett-Tipp.',
              }),
            ],
          }),
        j === "duel" &&
          (() => {
            let s = _.filter((d) => d.hs === null && d.mh && d.ma)
                .map((d) => {
                  let z = `${d.w}-${d.a}-${d.h}`,
                    H = we && we[z],
                    G = ye(
                      d.h,
                      d.a,
                      {
                        restDiff: Math.max(-7, Math.min(7, d.rd)),
                        homeRest: d.hr,
                        awayRest: d.ar,
                        gametime: d.t,
                      },
                      y,
                      Qt,
                    ),
                    q = 1 / d.mh,
                    M = 1 / d.ma,
                    U = q / (q + M),
                    L = G >= 0.5 ? d.h : d.a,
                    N = U >= 0.5 ? d.h : d.a,
                    K = 100 * (G - U),
                    E = H && H.edge ? H.edge : null;
                  return {
                    g: d,
                    key: z,
                    pH: G,
                    pMktH: U,
                    ourFav: L,
                    mktFav: N,
                    edge: K,
                    src: E,
                    w: d.w,
                  };
                })
                .sort((d, z) => Math.abs(z.edge) - Math.abs(d.edge)),
              b = s.length ? Math.min(...s.map((d) => d.w)) : null,
              w = s.filter((d) => d.w === b),
              B = w.filter((d) => d.ourFav !== d.mktFav),
              T = w.filter((d) => Math.abs(d.edge) >= 3 && d.src && d.src.trust === "hoch"),
              D = w.filter((d) => Math.abs(d.edge) >= 3 && d.src && d.src.trust === "niedrig"),
              O = ({ r: d }) => {
                let z = 100 * (d.ourFav === d.g.h ? d.pH : 1 - d.pH),
                  H = 100 * (d.mktFav === d.g.h ? d.pMktH : 1 - d.pMktH),
                  G = d.ourFav === d.mktFav;
                return (0, o.jsxs)("button", {
                  onClick: () => Fc(d.g),
                  style: {
                    width: "100%",
                    textAlign: "left",
                    background: "#131A2B",
                    border: "1px solid " + (G ? "#26304A" : "#2E4658"),
                    borderRadius: 8,
                    padding: "11px 12px",
                    marginBottom: 6,
                    cursor: "pointer",
                    color: "#F0EDE2",
                    fontFamily: "Inter",
                  },
                  children: [
                    (0, o.jsxs)("div", {
                      style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 8,
                        flexWrap: "wrap",
                      },
                      children: [
                        (0, o.jsxs)("span", {
                          style: { fontSize: 14 },
                          children: [
                            d.g.a,
                            " ",
                            (0, o.jsx)("span", { style: { color: "#5C6478" }, children: "@" }),
                            " ",
                            d.g.h,
                            !G &&
                              (0, o.jsx)("span", {
                                style: {
                                  marginLeft: 6,
                                  fontSize: 10.5,
                                  color: "#7FB3D5",
                                  border: "1px solid #2E4658",
                                  borderRadius: 3,
                                  padding: "1px 4px",
                                },
                                children: "GEGEN DEN MARKT",
                              }),
                          ],
                        }),
                        (0, o.jsxs)("span", {
                          style: {
                            fontFamily: "'IBM Plex Mono'",
                            fontSize: 12.5,
                            color: d.edge >= 0 ? "#8FCB9B" : "#E0685C",
                          },
                          children: [d.edge >= 0 ? "+" : "", d.edge.toFixed(1), " P"],
                        }),
                      ],
                    }),
                    (0, o.jsxs)("div", {
                      style: {
                        display: "flex",
                        gap: 14,
                        marginTop: 7,
                        fontFamily: "'IBM Plex Mono'",
                        fontSize: 12,
                      },
                      children: [
                        (0, o.jsxs)("span", {
                          style: { color: "#D9A441" },
                          children: ["Modell ", d.ourFav, " ", z.toFixed(0), "%"],
                        }),
                        (0, o.jsxs)("span", {
                          style: { color: "#8C94A8" },
                          children: ["Markt ", d.mktFav, " ", H.toFixed(0), "%"],
                        }),
                      ],
                    }),
                    (0, o.jsx)("div", {
                      style: { marginTop: 6 },
                      children: [
                        ["Modell", 100 * d.pH, "#D9A441"],
                        ["Markt", 100 * d.pMktH, "#5C6478"],
                      ].map(([q, M, U]) =>
                        (0, o.jsxs)(
                          "div",
                          {
                            style: {
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              marginBottom: 3,
                            },
                            children: [
                              (0, o.jsx)("span", {
                                style: { width: 42, fontSize: 10, color: "#5C6478" },
                                children: q,
                              }),
                              (0, o.jsxs)("div", {
                                style: {
                                  flex: 1,
                                  height: 7,
                                  background: "#0A0D16",
                                  borderRadius: 4,
                                  overflow: "hidden",
                                  position: "relative",
                                },
                                children: [
                                  (0, o.jsx)("div", {
                                    style: { width: `${M}%`, height: "100%", background: U },
                                  }),
                                  (0, o.jsx)("div", {
                                    style: {
                                      position: "absolute",
                                      left: "50%",
                                      top: 0,
                                      bottom: 0,
                                      width: 1,
                                      background: "#3A4560",
                                    },
                                  }),
                                ],
                              }),
                            ],
                          },
                          q,
                        ),
                      ),
                    }),
                    d.src &&
                      (0, o.jsxs)("div", {
                        style: {
                          marginTop: 6,
                          fontSize: 11.5,
                          color: d.src.trust === "niedrig" ? "#E0685C" : "#5C6478",
                        },
                        children: [
                          "Haupttreiber: ",
                          ts(d.src.src, d.src.src_label),
                          fl && fl.src[d.src.src]
                            ? ` \u2013 Abweichungen dieser Art trafen historisch ${String(fl.src[d.src.src].hit).replace(".", ",")} %`
                            : "",
                        ],
                      }),
                  ],
                });
              };
            return (0, o.jsxs)("main", {
              style: { maxWidth: 680, margin: "0 auto", padding: "20px 16px" },
              children: [
                dt && dt.n > 0
                  ? (0, o.jsxs)("div", {
                      style: {
                        background: "#131A2B",
                        border: "1px solid #26304A",
                        borderRadius: 10,
                        padding: 16,
                        marginBottom: 18,
                      },
                      children: [
                        (0, o.jsx)("div", {
                          style: {
                            fontFamily: "'Barlow Condensed'",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            fontSize: 17,
                            marginBottom: 8,
                          },
                          children: "Zwischenstand",
                        }),
                        (0, o.jsxs)("div", {
                          style: {
                            display: "flex",
                            gap: 22,
                            flexWrap: "wrap",
                            fontFamily: "'IBM Plex Mono'",
                            fontSize: 14,
                          },
                          children: [
                            (0, o.jsxs)("span", {
                              style: { color: "#D9A441" },
                              children: [
                                "Modell ",
                                dt.m,
                                "/",
                                dt.n,
                                " (",
                                Math.round((100 * dt.m) / dt.n),
                                " %)",
                              ],
                            }),
                            (0, o.jsxs)("span", {
                              style: { color: "#8C94A8" },
                              children: [
                                "Markt ",
                                dt.v,
                                "/",
                                dt.n,
                                " (",
                                Math.round((100 * dt.v) / dt.n),
                                " %)",
                              ],
                            }),
                          ],
                        }),
                        dt.dis_n > 0 &&
                          (0, o.jsxs)("div", {
                            style: { marginTop: 8, fontSize: 13, color: "#C9CEDB" },
                            children: [
                              "Bei Uneinigkeit (",
                              dt.dis_n,
                              " Spiele) gewinnt das Modell ",
                              (0, o.jsx)("strong", { children: dt.dis_m }),
                              " \u2013 das ist der eigentliche Test.",
                            ],
                          }),
                        dt.clv &&
                          dt.clv.n > 0 &&
                          (0, o.jsxs)("div", {
                            style: {
                              marginTop: 6,
                              fontSize: 12.5,
                              color: dt.clv.avg >= 0 ? "#8FCB9B" : "#E0685C",
                            },
                            children: [
                              "Closing Line Value: ",
                              dt.clv.avg >= 0 ? "+" : "",
                              dt.clv.avg,
                              " Punkte \xB7 ",
                              dt.clv.pos,
                              " % der Picks schlagen die Schlusslinie",
                            ],
                          }),
                      ],
                    })
                  : (0, o.jsxs)("div", {
                      style: {
                        background: "#131A2B",
                        border: "1px dashed #26304A",
                        borderRadius: 10,
                        padding: 14,
                        marginBottom: 18,
                        fontSize: 13,
                        color: "#8C94A8",
                        lineHeight: 1.6,
                      },
                      children: [
                        "Noch kein Spiel gewertet \u2013 der Zwischenstand erscheint nach dem ersten Spieltag. Die Picks unten sind bereits ",
                        (0, o.jsx)("strong", { children: "vorab eingefroren" }),
                        " und im Repo mit Zeitstempel hinterlegt, lassen sich also nicht nachtr\xE4glich sch\xF6nrechnen.",
                      ],
                    }),
                (() => {
                  let d = dt && dt.n > 0 ? dt : null,
                    z = ({ label: U, soll: L, ist: N, n: K, hint: E }) => {
                      let Y = N != null,
                        Z = Y ? N - L : null,
                        lt = Y
                          ? Math.abs(Z) <= 4
                            ? "#8FCB9B"
                            : Z > 0
                              ? "#D9A441"
                              : "#E0685C"
                          : "#5C6478";
                      return (0, o.jsxs)("div", {
                        style: {
                          display: "flex",
                          alignItems: "baseline",
                          gap: 8,
                          padding: "6px 0",
                          borderBottom: "1px solid #1A2033",
                          flexWrap: "wrap",
                        },
                        children: [
                          (0, o.jsxs)("span", {
                            style: { flex: 1, minWidth: 150, fontSize: 13 },
                            children: [
                              U,
                              E &&
                                (0, o.jsx)("span", {
                                  style: { display: "block", fontSize: 11, color: "#3A4560" },
                                  children: E,
                                }),
                            ],
                          }),
                          (0, o.jsxs)("span", {
                            style: {
                              fontFamily: "'IBM Plex Mono'",
                              fontSize: 12.5,
                              color: "#8C94A8",
                              width: 74,
                              textAlign: "right",
                            },
                            children: [L.toFixed(1), " %"],
                          }),
                          (0, o.jsxs)("span", {
                            style: {
                              fontFamily: "'IBM Plex Mono'",
                              fontSize: 12.5,
                              color: lt,
                              width: 94,
                              textAlign: "right",
                            },
                            children: [Y ? `${N.toFixed(1)} %` : "\u2013", K ? ` (${K})` : ""],
                          }),
                        ],
                      });
                    },
                    H = d ? (100 * d.m) / d.n : null,
                    G = d ? (100 * d.v) / d.n : null,
                    q = d && d.dis_n > 0 ? (100 * d.dis_m) / d.dis_n : null,
                    M = Object.entries(ia.src).map(([U, L]) => {
                      let N = d && d.by_src ? d.by_src[U] : null;
                      return {
                        label: fl && fl.src[U] ? fl.src[U].label : U,
                        soll: L,
                        ist: N ? N.hit : null,
                        n: N ? N.n : null,
                      };
                    });
                  return (0, o.jsxs)("section", {
                    style: {
                      background: "#131A2B",
                      border: "1px solid #2E4658",
                      borderRadius: 10,
                      padding: 16,
                      marginBottom: 18,
                    },
                    children: [
                      (0, o.jsxs)("div", {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 4,
                          flexWrap: "wrap",
                        },
                        children: [
                          (0, o.jsx)("span", {
                            style: {
                              fontFamily: "'Barlow Condensed'",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              fontSize: 17,
                            },
                            children: "Soll-Ist-Vergleich",
                          }),
                          (0, o.jsx)("span", {
                            style: {
                              fontSize: 10,
                              color: "#7FB3D5",
                              border: "1px solid #2E4658",
                              borderRadius: 3,
                              padding: "1px 5px",
                            },
                            children: "BETA",
                          }),
                        ],
                      }),
                      (0, o.jsxs)("p", {
                        style: {
                          fontSize: 12,
                          color: "#5C6478",
                          margin: "0 0 10px",
                          lineHeight: 1.5,
                        },
                        children: [
                          "Links der Wert aus dem Systemtest der Saison ",
                          ia.season,
                          " (",
                          ia.n,
                          " Spiele, vorab eingefroren), rechts die laufende Saison. Gr\xFCn hei\xDFt: im erwarteten Rahmen (\xB14 Punkte).",
                        ],
                      }),
                      (0, o.jsxs)("div", {
                        style: {
                          display: "flex",
                          gap: 8,
                          fontSize: 10.5,
                          color: "#3A4560",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          paddingBottom: 4,
                          borderBottom: "1px solid #26304A",
                        },
                        children: [
                          (0, o.jsx)("span", { style: { flex: 1 }, children: "Kennzahl" }),
                          (0, o.jsxs)("span", {
                            style: { width: 74, textAlign: "right" },
                            children: ["Soll ", ia.season],
                          }),
                          (0, o.jsx)("span", {
                            style: { width: 94, textAlign: "right" },
                            children: "l\xE4uft gerade",
                          }),
                        ],
                      }),
                      (0, o.jsx)(z, {
                        label: "Trefferquote gesamt",
                        soll: ia.overall,
                        ist: H,
                        n: d ? d.n : null,
                      }),
                      (0, o.jsx)(z, {
                        label: "Markt im Vergleich",
                        soll: ia.market,
                        ist: G,
                        n: null,
                      }),
                      (0, o.jsx)(z, {
                        label: "Bei Uneinigkeit",
                        hint: `entscheidende Kennzahl \xB7 Soll aus ${ia.disagree.n} Spielen`,
                        soll: ia.disagree.hit,
                        ist: q,
                        n: d && d.dis_n ? d.dis_n : null,
                      }),
                      M.map((U) =>
                        (0, o.jsx)(
                          z,
                          { label: `Abweichung aus ${U.label}`, soll: U.soll, ist: U.ist, n: U.n },
                          U.label,
                        ),
                      ),
                      (0, o.jsx)("p", {
                        style: { fontSize: 11.5, color: "#5C6478", marginTop: 10, lineHeight: 1.5 },
                        children:
                          "Die laufenden Werte sind in den ersten Wochen kaum aussagekr\xE4ftig \u2013 im Systemtest schwankten einzelne Spieltage zwischen 21 % und 87 %. Aussagekraft entsteht ab etwa vier bis f\xFCnf Wochen. Details zur Methodik stehen als SYSTEMTEST.md im Repository.",
                      }),
                    ],
                  });
                })(),
                (0, o.jsxs)("div", {
                  style: {
                    display: "flex",
                    gap: 16,
                    flexWrap: "wrap",
                    marginBottom: 14,
                    fontSize: 12.5,
                  },
                  children: [
                    (0, o.jsxs)("span", {
                      style: { color: "#7FB3D5" },
                      children: [B.length, "\xD7 gegen den Markt"],
                    }),
                    (0, o.jsxs)("span", {
                      style: { color: "#8FCB9B" },
                      children: [T.length, "\xD7 belastbare Abweichung"],
                    }),
                    D.length > 0 &&
                      (0, o.jsxs)("span", {
                        style: { color: "#E0685C" },
                        children: [D.length, "\xD7 nur verletzungsgetrieben"],
                      }),
                  ],
                }),
                (0, o.jsxs)("div", {
                  style: {
                    fontFamily: "'Barlow Condensed'",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontSize: 14,
                    color: "#D9A441",
                    margin: "6px 0 8px",
                  },
                  children: ["Woche ", b, " \xB7 gr\xF6\xDFte Meinungsverschiedenheiten"],
                }),
                w.slice(0, 12).map((d) => (0, o.jsx)(O, { r: d }, d.key)),
                w.length === 0 &&
                  (0, o.jsx)("p", {
                    style: { fontSize: 13.5, color: "#8C94A8" },
                    children: "F\xFCr die kommende Woche liegen noch keine Marktquoten vor.",
                  }),
                (0, o.jsx)("p", {
                  style: { marginTop: 16, fontSize: 11.5, color: "#5C6478", lineHeight: 1.5 },
                  children:
                    'Der Markt-Wert ist entvigt, also um die Buchmacher-Marge bereinigt \u2013 nur so sind beide Prozentzahlen vergleichbar. Sortiert nach der Gr\xF6\xDFe der Abweichung. Entscheidend f\xFCr die Frage \u201Eschlagen wir Vegas?" sind nicht die Spiele, in denen wir einig sind, sondern die Uneinigkeiten: Nur dort trennt sich, wer recht hat. Aus dem Backtest wissen wir, welche Quellen dabei tragen \u2013 Elo/Form und QB-Rating lagen bei rund 65 %, verletzungsgetriebene Abweichungen dagegen nur bei 51,6 %.',
                }),
              ],
            });
          })(),
        j === "rank" &&
          (() => {
            let s = [
                {
                  k: "elo",
                  label: "Elo",
                  kurz: "Gesamtst\xE4rke",
                  fmt: (d) => Math.round(d),
                  get: (d) => Zc(d),
                  besser: "hoch",
                  hint: "Teamst\xE4rke aus allen bisherigen Ergebnissen, inkl. Heimvorteil-Logik",
                },
                {
                  k: "off",
                  label: "Offense",
                  kurz: "EPA je Spielzug",
                  fmt: (d) => (d >= 0 ? "+" : "") + d.toFixed(3),
                  get: (d) => (y && y[d] ? y[d].off_epa : Ml.teams[d].off_epa),
                  besser: "hoch",
                  hint: "Erzielter Punktwert je Spielzug \u2013 h\xF6her ist besser",
                },
                {
                  k: "def",
                  label: "Defense",
                  kurz: "zugelassene EPA",
                  fmt: (d) => (d >= 0 ? "+" : "") + d.toFixed(3),
                  get: (d) => (y && y[d] ? y[d].def_epa : Ml.teams[d].def_epa),
                  besser: "niedrig",
                  hint: "Zugelassener Punktwert je Spielzug des Gegners \u2013 niedriger ist besser",
                },
                {
                  k: "qb",
                  label: "Quarterback",
                  kurz: "EPA je Aktion",
                  fmt: (d) => (d >= 0 ? "+" : "") + d.toFixed(3),
                  get: (d) => (y && y[d] ? (y[d].qb ?? 0) : 0),
                  besser: "hoch",
                  hint: "Leistung des aktuellen Starters aus Pass und Lauf",
                },
                {
                  k: "proj",
                  label: "Projektion",
                  kurz: "erwartete Siege",
                  fmt: (d) => d.toFixed(1),
                  get: (d) => (Ln && Ln[d] ? Ln[d].w : 0),
                  besser: "hoch",
                  hint: "Erwartete Siege aus 10.000 simulierten Saisons",
                },
              ],
              b = s.find((d) => d.k === Ju) || s[0],
              w = es.map((d) => ({ c: d, v: b.get(d) })).filter((d) => typeof d.v == "number");
            w.sort((d, z) => (b.besser === "hoch" ? z.v - d.v : d.v - z.v));
            let B = w.map((d) => d.v),
              T = Math.min(...B),
              D = Math.max(...B),
              O = (d) =>
                D === T ? 0.5 : b.besser === "hoch" ? (d - T) / (D - T) : (D - d) / (D - T);
            return (0, o.jsxs)("main", {
              style: { maxWidth: 580, margin: "0 auto", padding: "24px 16px" },
              children: [
                (0, o.jsx)("div", {
                  style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 },
                  children: s.map((d) =>
                    (0, o.jsx)(
                      "button",
                      {
                        onClick: () => mm(d.k),
                        style: {
                          background: Ju === d.k ? "#D9A441" : "transparent",
                          color: Ju === d.k ? "#0A0D16" : "#8C94A8",
                          border: "1px solid " + (Ju === d.k ? "#D9A441" : "#26304A"),
                          borderRadius: 6,
                          padding: "6px 12px",
                          fontFamily: "'Barlow Condensed'",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          fontSize: 13.5,
                          cursor: "pointer",
                        },
                        children: d.label,
                      },
                      d.k,
                    ),
                  ),
                }),
                (0, o.jsx)("p", {
                  style: { fontSize: 11.5, color: "#5C6478", margin: "0 0 14px" },
                  children: b.hint,
                }),
                w.map((d, z) => {
                  let [H, G] = P[d.c],
                    q = Math.max(3, O(d.v) * 100),
                    M = Ln && Ln[d.c];
                  return (0, o.jsxs)(
                    "div",
                    {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "7px 0",
                        borderBottom: "1px solid #1A2033",
                      },
                      children: [
                        (0, o.jsx)("span", {
                          style: {
                            fontFamily: "'IBM Plex Mono'",
                            fontSize: 12,
                            color: z < 5 ? "#D9A441" : "#5C6478",
                            width: 22,
                            textAlign: "right",
                          },
                          children: z + 1,
                        }),
                        (0, o.jsx)("span", {
                          style: {
                            width: 4,
                            alignSelf: "stretch",
                            background: G,
                            borderRadius: 2,
                            minHeight: 20,
                          },
                        }),
                        (0, o.jsxs)("span", {
                          style: { flex: 1, minWidth: 0 },
                          children: [
                            (0, o.jsx)("span", { style: { fontSize: 14 }, children: H }),
                            M &&
                              (0, o.jsxs)("span", {
                                style: {
                                  display: "block",
                                  fontSize: 10.5,
                                  color: "#3A4560",
                                  fontFamily: "'IBM Plex Mono'",
                                },
                                children: ["\xD8 ", M.w, " Siege \xB7 Playoffs ", M.po, " %"],
                              }),
                          ],
                        }),
                        (0, o.jsx)("div", {
                          style: {
                            width: 110,
                            height: 6,
                            background: "#1A2033",
                            borderRadius: 3,
                            overflow: "hidden",
                          },
                          children: (0, o.jsx)("div", {
                            style: {
                              width: `${q}%`,
                              height: "100%",
                              background: z < 5 ? "#D9A441" : "#3A4560",
                            },
                          }),
                        }),
                        (0, o.jsx)("span", {
                          style: {
                            fontFamily: "'IBM Plex Mono'",
                            fontSize: 13,
                            width: 54,
                            textAlign: "right",
                          },
                          children: b.fmt(d.v),
                        }),
                      ],
                    },
                    d.c,
                  );
                }),
                (0, o.jsx)("div", {
                  style: { marginTop: 22 },
                  children: (0, o.jsx)(hg, {
                    hist: dm,
                    selected: ns || w.slice(0, 5).map((d) => d.c),
                    onToggle: (d) => {
                      let z = ns || w.slice(0, 5).map((H) => H.c);
                      hm(z.includes(d) ? z.filter((H) => H !== d) : [...z, d]);
                    },
                  }),
                }),
                (0, o.jsx)("p", {
                  style: { marginTop: 12, fontSize: 11.5, color: "#5C6478", lineHeight: 1.5 },
                  children:
                    "Alle Werte werden t\xE4glich neu berechnet. Offense und Defense sind gleitende Durchschnitte, bei denen das erste Spiel einer neuen Saison besonders schwer wiegt \u2013 der Kader ist dann neu, die Vorsaison nur noch begrenzt aussagekr\xE4ftig. Bei der Defense ist ein niedriger Wert gut: Er misst, wie wenig Punktwert der Gegner erzeugen konnte.",
                }),
              ],
            });
          })(),
      ],
    });
  }
  var J2 = sa(Zu());
  (0, F2.createRoot)(document.getElementById("root")).render((0, J2.jsx)(ls, {}));
})();
/*! Bundled license information:

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

scheduler/cjs/scheduler.production.js:
  (**
   * @license React
   * scheduler.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.js:
  (**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom-client.production.js:
  (**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
