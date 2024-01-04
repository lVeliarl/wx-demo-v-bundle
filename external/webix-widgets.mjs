class f {
}
class c {
  constructor(t, e) {
    this.webixJet = !0, this.webix = t, this._events = [], this._subs = {}, this._data = {}, e && e.params && t.extend(this._data, e.params);
  }
  getRoot() {
    return this._root;
  }
  destructor() {
    this._detachEvents(), this._destroySubs(), this._events = this._container = this.app = this._parent = this._root = null;
  }
  setParam(t, e, s) {
    if (this._data[t] !== e && (this._data[t] = e, this._segment.update(t, e, 0), s))
      return this.show(null);
  }
  getParam(t, e) {
    const s = this._data[t];
    if (typeof s < "u" || !e)
      return s;
    const i = this.getParentView();
    if (i)
      return i.getParam(t, e);
  }
  getUrl() {
    return this._segment.suburl();
  }
  getUrlString() {
    return this._segment.toString();
  }
  getParentView() {
    return this._parent;
  }
  $$(t) {
    if (typeof t == "string") {
      const e = this.getRoot();
      return e.queryView(
        (s) => (s.config.id === t || s.config.localId === t) && s.$scope === e.$scope,
        "self"
      );
    } else
      return t;
  }
  on(t, e, s) {
    const i = t.attachEvent(e, s);
    return this._events.push({ obj: t, id: i }), i;
  }
  contains(t) {
    for (const e in this._subs) {
      const s = this._subs[e].view;
      if (s === t || s.contains(t))
        return !0;
    }
    return !1;
  }
  getSubView(t) {
    const e = this.getSubViewInfo(t);
    if (e)
      return e.subview.view;
  }
  getSubViewInfo(t) {
    const e = this._subs[t || "default"];
    return e ? { subview: e, parent: this } : t === "_top" ? (this._subs[t] = { url: "", id: null, popup: !0 }, this.getSubViewInfo(t)) : this._parent ? this._parent.getSubViewInfo(t) : null;
  }
  _detachEvents() {
    const t = this._events;
    for (let e = t.length - 1; e >= 0; e--)
      t[e].obj.detachEvent(t[e].id);
  }
  _destroySubs() {
    for (const t in this._subs) {
      const e = this._subs[t].view;
      e && e.destructor();
    }
    this._subs = {};
  }
  _init_url_data() {
    const t = this._segment.current();
    this._data = {}, this.webix.extend(this._data, t.params, !0);
  }
  _getDefaultSub() {
    if (this._subs.default)
      return this._subs.default;
    for (const t in this._subs) {
      const e = this._subs[t];
      if (!e.branch && e.view && t !== "_top") {
        const s = e.view._getDefaultSub();
        if (s)
          return s;
      }
    }
  }
  _routed_view() {
    const t = this.getParentView();
    if (!t)
      return !0;
    const e = t._getDefaultSub();
    return !e && e !== this ? !1 : t._routed_view();
  }
}
function m(n) {
  n[0] === "/" && (n = n.substr(1));
  const t = n.split("/"), e = [];
  for (let s = 0; s < t.length; s++) {
    const i = t[s], o = {};
    let r = i.indexOf(":");
    if (r === -1 && (r = i.indexOf("?")), r !== -1) {
      const h = i.substr(r + 1).split(/[\:\?\&]/g);
      for (const u of h) {
        const a = u.split("=");
        o[a[0]] = decodeURIComponent(a[1]);
      }
    }
    e[s] = {
      page: r > -1 ? i.substr(0, r) : i,
      params: o,
      isNew: !0
    };
  }
  return e;
}
function d(n) {
  const t = [];
  for (const e of n) {
    t.push("/" + e.page);
    const s = $(e.params);
    s && t.push("?" + s);
  }
  return t.join("");
}
function $(n) {
  const t = [];
  for (const e in n)
    typeof n[e] != "object" && (t.length && t.push("&"), t.push(e + "=" + encodeURIComponent(n[e])));
  return t.join("");
}
class p {
  constructor(t, e) {
    this._next = 1, typeof t == "string" ? this.route = {
      url: m(t),
      path: t
    } : this.route = t, this.index = e;
  }
  current() {
    return this.route.url[this.index];
  }
  next() {
    return this.route.url[this.index + this._next];
  }
  suburl() {
    return this.route.url.slice(this.index);
  }
  shift(t) {
    const e = new p(this.route, this.index + this._next);
    return e.setParams(e.route.url, t, e.index), e;
  }
  setParams(t, e, s) {
    if (e) {
      const o = t[s].params;
      for (var i in e)
        o[i] = e[i];
    }
  }
  refresh() {
    const t = this.route.url;
    for (let e = this.index + 1; e < t.length; e++)
      t[e].isNew = !0;
  }
  toString() {
    const t = d(this.suburl());
    return t ? t.substr(1) : "";
  }
  _join(t, e) {
    let s = this.route.url;
    if (t === null)
      return s;
    const i = this.route.url;
    let o = !0;
    if (s = i.slice(0, this.index + (e ? this._next : 0)), t) {
      s = s.concat(m(t));
      for (let r = 0; r < s.length; r++)
        i[r] && (s[r].view = i[r].view), o && i[r] && s[r].page === i[r].page ? s[r].isNew = !1 : s[r].isNew && (o = !1);
    }
    return s;
  }
  append(t) {
    const e = this._join(t, !0);
    return this.route.path = d(e), this.route.url = e, this.route.path;
  }
  show(t, e, s) {
    const i = this._join(t.url, s);
    return this.setParams(i, t.params, this.index + (s ? this._next : 0)), new Promise((o, r) => {
      const h = d(i), u = {
        url: i,
        redirect: h,
        confirm: Promise.resolve()
      }, a = e ? e.app : null;
      if (a && !a.callEvent("app:guard", [u.redirect, e, u])) {
        r(new f());
        return;
      }
      u.confirm.catch((l) => r(l)).then(() => {
        if (u.redirect === null) {
          r(new f());
          return;
        }
        if (u.redirect !== h) {
          a.show(u.redirect), r(new f());
          return;
        }
        this.route.path = h, this.route.url = i, o();
      });
    });
  }
  size(t) {
    this._next = t;
  }
  split() {
    const t = {
      url: this.route.url.slice(this.index + 1),
      path: ""
    };
    return t.url.length && (t.path = d(t.url)), new p(t, 0);
  }
  update(t, e, s) {
    const i = this.route.url[this.index + (s || 0)];
    if (!i)
      return this.route.url.push({ page: "", params: {} }), this.update(t, e, s);
    t === "" ? i.page = e : i.params[t] = e, this.route.path = d(this.route.url);
  }
}
class b extends c {
  constructor(t, e) {
    super(t.webix), this.app = t, this._children = [];
  }
  ui(t, e) {
    e = e || {};
    const s = e.container || t.container, i = this.app.createView(t);
    return this._children.push(i), i.render(s, this._segment, this), typeof t != "object" || t instanceof c ? i : i.getRoot();
  }
  show(t, e) {
    if (e = e || {}, typeof t == "object") {
      for (const s in t)
        this.setParam(s, t[s]);
      t = null;
    } else {
      if (t.substr(0, 1) === "/")
        return this.app.show(t, e);
      if (t.indexOf("./") === 0 && (t = t.substr(2)), t.indexOf("../") === 0) {
        const i = this.getParentView();
        return i ? i.show(t.substr(3), e) : this.app.show("/" + t.substr(3));
      }
      const s = this.getSubViewInfo(e.target);
      if (s) {
        if (s.parent !== this)
          return s.parent.show(t, e);
        if (e.target && e.target !== "default")
          return this._renderFrameLock(e.target, s.subview, {
            url: t,
            params: e.params
          });
      } else if (t)
        return this.app.show("/" + t, e);
    }
    return this._show(
      this._segment,
      { url: t, params: e.params },
      this
    );
  }
  _show(t, e, s) {
    return t.show(e, s, !0).then(() => (this._init_url_data(), this._urlChange())).then(() => {
      t.route.linkRouter && (this.app.getRouter().set(t.route.path, { silent: !0 }), this.app.callEvent("app:route", [t.route.path]));
    });
  }
  init(t, e) {
  }
  ready(t, e) {
  }
  config() {
    this.app.webix.message("View:Config is not implemented");
  }
  urlChange(t, e) {
  }
  destroy() {
  }
  destructor() {
    this.destroy(), this._destroyKids(), this._root && (this._root.destructor(), super.destructor());
  }
  use(t, e) {
    t(this.app, this, e);
  }
  refresh() {
    return this.getUrl(), this.destroy(), this._destroyKids(), this._destroySubs(), this._detachEvents(), this._container.tagName && this._root.destructor(), this._segment.refresh(), this._render(this._segment);
  }
  render(t, e, s) {
    typeof e == "string" && (e = new p(e, 0)), this._segment = e, this._parent = s, this._init_url_data(), t = t || document.body;
    const i = typeof t == "string" ? this.webix.toNode(t) : t;
    return this._container !== i ? (this._container = i, this._render(e)) : this._urlChange().then(() => this.getRoot());
  }
  _render(t) {
    const e = this.config();
    return e.then ? e.then((s) => this._render_final(s, t)) : this._render_final(e, t);
  }
  _render_final(t, e) {
    let s = null, i = null, o = !1;
    if (this._container.tagName ? i = this._container : (s = this._container, s.popup ? (i = document.body, o = !0) : i = this.webix.$$(s.id)), !this.app || !i)
      return Promise.reject(null);
    let r;
    const h = this._segment.current(), u = { ui: {} };
    this.app.copyConfig(t, u.ui, this._subs), this.app.callEvent("app:render", [this, e, u]), u.ui.$scope = this, !s && h.isNew && h.view && h.view.destructor();
    try {
      if (s && !o) {
        const l = i, g = l.getParentView();
        g && g.name === "multiview" && !u.ui.id && (u.ui.id = l.config.id);
      }
      this._root = this.app.webix.ui(u.ui, i);
      const a = this._root;
      o && a.setPosition && !a.isVisible() && a.show(), s && (s.view && s.view !== this && s.view !== this.app && s.view.destructor(), s.id = this._root.config.id, this.getParentView() || !this.app.app ? s.view = this : s.view = this.app), h.isNew && (h.view = this, h.isNew = !1), r = Promise.resolve(this._init(this._root, e)).then(() => this._urlChange().then(() => (this._initUrl = null, this.ready(this._root, e.suburl()))));
    } catch (a) {
      r = Promise.reject(a);
    }
    return r.catch((a) => this._initError(this, a));
  }
  _init(t, e) {
    return this.init(t, e.suburl());
  }
  _urlChange() {
    this.app.callEvent("app:urlchange", [this, this._segment]);
    const t = [];
    for (const e in this._subs) {
      const s = this._subs[e], i = this._renderFrameLock(e, s, null);
      i && t.push(i);
    }
    return Promise.all(t).then(() => this.urlChange(this._root, this._segment.suburl()));
  }
  _renderFrameLock(t, e, s) {
    if (!e.lock) {
      const i = this._renderFrame(t, e, s);
      i && (e.lock = i.then(() => e.lock = null, () => e.lock = null));
    }
    return e.lock;
  }
  _renderFrame(t, e, s) {
    if (t === "default")
      if (this._segment.next()) {
        let o = s ? s.params : null;
        return e.params && (o = this.webix.extend(o || {}, e.params)), this._createSubView(e, this._segment.shift(o));
      } else
        e.view && e.popup && (e.view.destructor(), e.view = null);
    if (s !== null && (e.url = s.url, e.params && (s.params = this.webix.extend(s.params || {}, e.params))), e.route) {
      if (s !== null)
        return e.route.show(s, e.view).then(() => this._createSubView(e, e.route));
      if (e.branch)
        return;
    }
    let i = e.view;
    if (!i && e.url) {
      if (typeof e.url == "string")
        return e.route = new p(e.url, 0), s && e.route.setParams(e.route.route.url, s.params, 0), e.params && e.route.setParams(e.route.route.url, e.params, 0), this._createSubView(e, e.route);
      if (typeof e.url == "function" && !(i instanceof e.url)) {
        const o = this.app._override(e.url);
        o.prototype instanceof w ? i = new o({ app: this.app }) : i = new o(this.app, "");
      }
      i || (i = e.url);
    }
    if (i)
      return i.render(e, e.route || this._segment, this);
  }
  _initError(t, e) {
    return this.app && this.app.error("app:error:initview", [e, t]), !0;
  }
  _createSubView(t, e) {
    return this.app.createFromURL(e.current()).then((s) => s.render(t, e, this));
  }
  _destroyKids() {
    const t = this._children;
    for (let e = t.length - 1; e >= 0; e--)
      t[e] && t[e].destructor && t[e].destructor();
    this._children = [];
  }
}
class S extends b {
  constructor(t, e) {
    super(t, e), this._ui = e.ui;
  }
  config() {
    return this._ui;
  }
}
class P {
  constructor(t, e, s) {
    this.path = "", this.app = s;
  }
  set(t, e) {
    this.path = t;
    const s = this.app;
    s.app.getRouter().set(s._segment.append(this.path), { silent: !0 });
  }
  get() {
    return this.path;
  }
}
let x = !0;
class w extends c {
  constructor(t) {
    const e = (t || {}).webix || window.webix;
    t = e.extend({
      name: "App",
      version: "1.0",
      start: "/home"
    }, t, !0), super(e, t), this.config = t, this.app = this.config.app, this.ready = Promise.resolve(), this._services = {}, this.webix.extend(this, this.webix.EventSystem);
  }
  getUrl() {
    return this._subSegment.suburl();
  }
  getUrlString() {
    return this._subSegment.toString();
  }
  getService(t) {
    let e = this._services[t];
    return typeof e == "function" && (e = this._services[t] = e(this)), e;
  }
  setService(t, e) {
    this._services[t] = e;
  }
  destructor() {
    this.getSubView().destructor(), super.destructor();
  }
  // copy object and collect extra handlers
  copyConfig(t, e, s) {
    if ((t instanceof c || typeof t == "function" && t.prototype instanceof c) && (t = { $subview: t }), typeof t.$subview < "u")
      return this.addSubView(t, e, s);
    const i = t instanceof Array;
    e = e || (i ? [] : {});
    for (const o in t) {
      let r = t[o];
      if (typeof r == "function" && r.prototype instanceof c && (r = { $subview: r }), r && typeof r == "object" && !(r instanceof this.webix.DataCollection) && !(r instanceof RegExp) && !(r instanceof Map))
        if (r instanceof Date)
          e[o] = new Date(r);
        else {
          const h = this.copyConfig(
            r,
            r instanceof Array ? [] : {},
            s
          );
          h !== null && (i ? e.push(h) : e[o] = h);
        }
      else
        e[o] = r;
    }
    return e;
  }
  getRouter() {
    return this.$router;
  }
  clickHandler(t, e) {
    if (t && (e = e || t.target || t.srcElement, e && e.getAttribute)) {
      const i = e.getAttribute("trigger");
      if (i)
        return this._forView(e, (r) => r.app.trigger(i)), t.cancelBubble = !0, t.preventDefault();
      const o = e.getAttribute("route");
      if (o)
        return this._forView(e, (r) => r.show(o)), t.cancelBubble = !0, t.preventDefault();
    }
    const s = e.parentNode;
    s && this.clickHandler(t, s);
  }
  getRoot() {
    return this.getSubView().getRoot();
  }
  refresh() {
    return this._subSegment ? this.getSubView().refresh().then((t) => (this.callEvent("app:route", [this.getUrl()]), t)) : Promise.resolve(null);
  }
  loadView(t) {
    const e = this.config.views;
    let s = null;
    if (t === "")
      return Promise.resolve(
        this._loadError("", new Error("Webix Jet: Empty url segment"))
      );
    try {
      e && (typeof e == "function" ? s = e(t) : s = e[t], typeof s == "string" && (t = s, s = null)), s || (t === "_hidden" ? s = { hidden: !0 } : t === "_blank" ? s = {} : (t = t.replace(/\./g, "/"), s = this.require("jet-views", t)));
    } catch (i) {
      s = this._loadError(t, i);
    }
    return s.then || (s = Promise.resolve(s)), s = s.then((i) => i.__esModule ? i.default : i).catch((i) => this._loadError(t, i)), s;
  }
  _forView(t, e) {
    const s = this.webix.$$(t);
    s && e(s.$scope);
  }
  _loadViewDynamic(t) {
    return null;
  }
  createFromURL(t) {
    let e;
    return t.isNew || !t.view ? e = this.loadView(t.page).then((s) => this.createView(s, "", t.params)) : e = Promise.resolve(t.view), e;
  }
  _override(t) {
    const e = this.config.override;
    if (e) {
      let s;
      for (; t; )
        s = t, t = e.get(t);
      return s;
    }
    return t;
  }
  createView(t, e, s) {
    t = this._override(t);
    let i;
    if (typeof t == "function") {
      if (t.prototype instanceof w)
        return new t({ app: this, name: e, params: s, router: P });
      if (t.prototype instanceof c)
        return new t(this, { name: e, params: s });
      t = t(this);
    }
    return t instanceof c ? i = t : i = new S(this, { name: e, ui: t }), i;
  }
  // show view path
  show(t, e) {
    return t && this.app && t.indexOf("//") == 0 ? this.app.show(t.substr(1), e) : this.render(this._container, t || this.config.start, e);
  }
  // event helpers
  trigger(t, ...e) {
    this.apply(t, e);
  }
  apply(t, e) {
    this.callEvent(t, e);
  }
  action(t) {
    return this.webix.bind(function(...e) {
      this.apply(t, e);
    }, this);
  }
  on(t, e) {
    this.attachEvent(t, e);
  }
  use(t, e) {
    t(this, null, e);
  }
  error(t, e) {
    if (this.callEvent(t, e), this.callEvent("app:error", e), this.config.debug) {
      for (var s = 0; s < e.length; s++)
        if (console.error(e[s]), e[s] instanceof Error) {
          let i = e[s].message;
          i.indexOf("Module build failed") === 0 ? (i = i.replace(/\x1b\[[0-9;]*m/g, ""), document.body.innerHTML = `<pre style='font-size:16px; background-color: #ec6873; color: #000; padding:10px;'>${i}</pre>`) : (i += "<br><br>Check console for more details", this.webix.message({ type: "error", text: i, expire: -1 }));
        }
      debugger;
    }
  }
  // renders top view
  render(t, e, s) {
    this._container = typeof t == "string" ? this.webix.toNode(t) : t || document.body;
    const i = !this.$router;
    let o = null;
    i ? (x && "tagName" in this._container && (this.webix.event(document.body, "click", (l) => this.clickHandler(l)), x = !1), typeof e == "string" && (e = new p(e, 0)), this._subSegment = this._first_start(e), this._subSegment.route.linkRouter = !0) : typeof e == "string" ? o = e : this.app ? o = e.split().route.path || this.config.start : o = e.toString();
    const r = s ? s.params : this.config.params || null, h = this.getSubView(), u = this._subSegment, a = u.show({ url: o, params: r }, h).then(() => this.createFromURL(u.current())).then((l) => l.render(t, u)).then((l) => (this.$router.set(u.route.path, { silent: !0 }), this.callEvent("app:route", [this.getUrl()]), l));
    return this.ready = this.ready.then(() => a), a;
  }
  getSubView() {
    if (this._subSegment) {
      const t = this._subSegment.current().view;
      if (t)
        return t;
    }
    return new b(this, {});
  }
  require(t, e) {
    return null;
  }
  _first_start(t) {
    this._segment = t;
    const e = (s) => setTimeout(() => {
      this.show(s).catch((i) => {
        if (!(i instanceof f))
          throw i;
      });
    }, 1);
    if (this.$router = new this.config.router(e, this.config, this), this._container === document.body && this.config.animation !== !1) {
      const s = this._container;
      this.webix.html.addCss(s, "webixappstart"), setTimeout(() => {
        this.webix.html.removeCss(s, "webixappstart"), this.webix.html.addCss(s, "webixapp");
      }, 10);
    }
    if (t) {
      if (this.app) {
        const s = t, i = t.current().view;
        t.current().view = this, t.next() ? (t.refresh(), t = t.split()) : t = new p(this.config.start, 0), s.current().view = i || this;
      }
    } else {
      let s = this.$router.get();
      s || (s = this.config.start, this.$router.set(s, { silent: !0 })), t = new p(s, 0);
    }
    return t;
  }
  // error during view resolving
  _loadError(t, e) {
    return this.error("app:error:resolve", [e, t]), { template: " " };
  }
  addSubView(t, e, s) {
    const i = t.$subview !== !0 ? t.$subview : null, o = t.name || (i ? this.webix.uid() : "default");
    return e.id = t.id || "s" + this.webix.uid(), (s[o] = {
      id: e.id,
      url: i,
      branch: t.branch,
      popup: t.popup,
      params: t.params
    }).popup ? null : e;
  }
}
class I {
  constructor(t, e) {
    this.config = e || {}, this._detectPrefix(), this.cb = t, window.onpopstate = () => this.cb(this.get());
  }
  set(t, e) {
    if (this.config.routes) {
      const s = t.split("?", 2);
      for (const i in this.config.routes)
        if (this.config.routes[i] === s[0]) {
          t = i + (s.length > 1 ? "?" + s[1] : "");
          break;
        }
    }
    this.get() !== t && window.history.pushState(null, null, this.prefix + this.sufix + t), (!e || !e.silent) && setTimeout(() => this.cb(t), 1);
  }
  get() {
    let t = this._getRaw().replace(this.prefix, "").replace(this.sufix, "");
    if (t = t !== "/" && t !== "#" ? t : "", this.config.routes) {
      const e = t.split("?", 2), s = this.config.routes[e[0]];
      s && (t = s + (e.length > 1 ? "?" + e[1] : ""));
    }
    return t;
  }
  _detectPrefix() {
    const t = this.config.routerPrefix;
    this.sufix = "#" + (typeof t > "u" ? "!" : t), this.prefix = document.location.href.split("#", 2)[0];
  }
  _getRaw() {
    return document.location.href;
  }
}
let v = !1;
function V(n) {
  if (v || !n)
    return;
  v = !0;
  const t = window;
  t.Promise || (t.Promise = n.promise);
  const e = n.version.split(".");
  e[0] * 10 + e[1] * 1 < 53 && (n.ui.freeze = function(r) {
    const h = r();
    return h && h.then ? h.then(function(u) {
      return n.ui.$freeze = !1, n.ui.resize(), u;
    }) : (n.ui.$freeze = !1, n.ui.resize()), h;
  });
  const s = n.ui.baselayout.prototype.addView, i = n.ui.baselayout.prototype.removeView, o = {
    addView(r, h) {
      if (this.$scope && this.$scope.webixJet && !r.queryView) {
        const u = this.$scope, a = {};
        r = u.app.copyConfig(r, {}, a), s.apply(this, [r, h]);
        for (const l in a)
          u._renderFrame(l, a[l], null).then(() => {
            u._subs[l] = a[l];
          });
        return r.id;
      } else
        return s.apply(this, arguments);
    },
    removeView() {
      if (i.apply(this, arguments), this.$scope && this.$scope.webixJet) {
        const r = this.$scope._subs;
        for (const h in r) {
          const u = r[h];
          n.$$(u.id) || (u.view.destructor(), delete r[h]);
        }
      }
    }
  };
  n.extend(n.ui.layout.prototype, o, !0), n.extend(n.ui.baselayout.prototype, o, !0), n.protoUI({
    name: "jetapp",
    $init(r) {
      this.$app = new this.app(r);
      const h = n.uid().toString();
      r.body = { id: h }, this.$ready.push(function() {
        this.callEvent("onInit", [this.$app]), this.$app.render({ id: h });
      });
    }
  }, n.ui.proxy, n.EventSystem);
}
class E extends w {
  constructor(t) {
    t.router = t.router || I, super(t), V(this.webix);
  }
  require(t, e) {
    return require(t + "/" + e);
  }
}
class N {
  constructor(t, e) {
    this.path = "", this.cb = t;
  }
  set(t, e) {
    this.path = t, (!e || !e.silent) && setTimeout(() => this.cb(t), 1);
  }
  get() {
    return this.path;
  }
}
let y = window.webix;
y && V(y);
const _ = window;
_.Promise || (_.Promise = _.webix.promise);
class R extends b {
  constructor(t) {
    super(t, null), this.name = "switchinput1", t.config.view == this.name && this._setConfig(t.config);
  }
  _setConfig(t) {
    this._config = t;
  }
  ready(t) {
    const e = t.queryView({ localId: "switch1" });
    if (e.config.view === "combo") {
      const i = (e.getList().serialize() || []).map((o) => o.id);
      if (i.length === 0) {
        t.queryView({ localId: "switch_btn" }).setValue(1);
        return;
      }
      e.getValue() ? i.includes(e.getValue()) ? t.queryView({ localId: "switch_btn" }).setValue(0) : t.queryView({ localId: "switch_btn" }).setValue(1) : t.queryView({ localId: "switch_btn" }).setValue(0);
    } else {
      const o = (t.queryView({ localId: "switch2" }).getList().serialize() || []).map((r) => r.id);
      if (o.length === 0) {
        t.queryView({ localId: "switch_btn" }).setValue(0);
        return;
      }
      e.getValue() ? o.includes(e.getValue()) ? t.queryView({ localId: "switch_btn" }).setValue(1) : t.queryView({ localId: "switch_btn" }).setValue(0) : t.queryView({ localId: "switch_btn" }).setValue(1);
    }
  }
  config() {
    const t = this._config.showInput.view === "combo" ? "选择" : "输入", e = this._config.showInput.view === "combo" ? "输入" : "选择";
    return {
      cols: [
        this._createShowInput(this._config.showInput),
        this._createHiddenInput(this._config.hiddenInput),
        {
          view: "switch",
          localId: "switch_btn",
          width: 76,
          css: { "margin-left": "10px" },
          onLabel: t,
          offLabel: e,
          on: {
            onChange: function(s) {
              s == 1 ? (this.$scope.$$("switch1").hide(), this.$scope.$$("switch2").show()) : (this.$scope.$$("switch1").show(), this.$scope.$$("switch2").hide());
            }
          }
        }
      ]
    };
  }
  _createShowInput(t) {
    return t && (t.id = void 0, t.localId = "switch1", t.name = "switch1", t.labelPosition = this._config.labelPosition, t.labelAlign = this._config.labelAlign, t.labelWidth = this._config.labelWidth), t;
  }
  _createHiddenInput(t) {
    return t && (t.localId = "switch2", t.hidden = !0, t.name = "switch2", t.labelPosition = this._config.labelPosition, t.labelAlign = this._config.labelAlign, t.labelWidth = this._config.labelWidth), t;
  }
}
class C extends E {
  constructor(t) {
    const e = {
      start: "SwitchInput",
      router: N,
      views: {
        SwitchInput: R
      }
    };
    super({ ...e, ...t });
  }
}
webix.protoUI({
  name: "switchinput1",
  app: C,
  $init: function() {
    let n = this.$view.className;
    this.$view.className = n + "  webix-form-border-hide";
  },
  getValue: function() {
    try {
      let n = this.$app.$$("switch1"), t = this.$app.$$("switch2");
      return n.isVisible() ? n.getValue() : t.getValue();
    } catch {
      return "";
    }
  },
  setValue(n) {
    let t = this.$app.$$("switch1"), e = this.$app.$$("switch2");
    t.setValue(n), e.setValue(n);
  },
  validate: function() {
    let n = this.$app.$$("switch1"), t = this.$app.$$("switch2");
    return n.isVisible() && n.config.required ? (n.validate() == !0 ? n.$view.className = "webix_control webix_el_text" : n.$view.className = "webix_el_text webix_control  webix_invalid", n.validate()) : t.isVisible() && t.config.required ? (t.validate() == !0 ? t.$view.className = "webix_control webix_el_text" : t.$view.className = "webix_el_text webix_control  webix_invalid", t.validate()) : !0;
  },
  disable() {
    this.$app.$$("switch1").disable(), this.$app.$$("switch2").disable();
  }
}, webix.ui.jetapp, webix.Values);
