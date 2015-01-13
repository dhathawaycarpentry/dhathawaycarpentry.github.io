/*!

 Holder - 2.3.1 - client side image placeholders
 (c) 2012-2014 Ivan Malopinsky / http://imsky.co

 Provided under the MIT License.
 Commercial use requires attribution.

 */
var Holder = Holder || {};
!function (a, b) {
    function c(a, b, c) {
        b = parseInt(b, 10), a = parseInt(a, 10);
        var d = Math.max(b, a), e = Math.min(b, a), f = 1 / 12, g = Math.min(.75 * e, .75 * d * f);
        return{height: Math.round(Math.max(c.size, g))}
    }

    function d(a) {
        var b = [];
        for (p in a)a.hasOwnProperty(p) && b.push(p + ":" + a[p]);
        return b.join(";")
    }

    function e(a) {
        var b = a.ctx, d = a.dimensions, e = a.template, f = a.ratio, g = a.holder, h = "literal" == g.textmode, i = "exact" == g.textmode, j = c(d.width, d.height, e), k = j.height, l = d.width * f, m = d.height * f, n = e.font ? e.font : "Arial,Helvetica,sans-serif";
        canvas.width = l, canvas.height = m, b.textAlign = "center", b.textBaseline = "middle", b.fillStyle = e.background, b.fillRect(0, 0, l, m), b.fillStyle = e.foreground, b.font = "bold " + k + "px " + n;
        var o = e.text ? e.text : Math.floor(d.width) + "x" + Math.floor(d.height);
        if (h) {
            var d = g.dimensions;
            o = d.width + "x" + d.height
        } else if (i && g.exact_dimensions) {
            var d = g.exact_dimensions;
            o = Math.floor(d.width) + "x" + Math.floor(d.height)
        }
        var p = b.measureText(o).width;
        return p / l >= .75 && (k = Math.floor(.75 * k * (l / p))), b.font = "bold " + k * f + "px " + n, b.fillText(o, l / 2, m / 2, l), canvas.toDataURL("image/png")
    }

    function f(a) {
        var b = a.dimensions, d = a.template, e = a.holder, f = "literal" == e.textmode, g = "exact" == e.textmode, h = c(b.width, b.height, d), i = h.height, j = b.width, k = b.height, l = d.font ? d.font : "Arial,Helvetica,sans-serif", m = d.text ? d.text : Math.floor(b.width) + "x" + Math.floor(b.height);
        if (f) {
            var b = e.dimensions;
            m = b.width + "x" + b.height
        } else if (g && e.exact_dimensions) {
            var b = e.exact_dimensions;
            m = Math.floor(b.width) + "x" + Math.floor(b.height)
        }
        var n = z({text: m, width: j, height: k, text_height: i, font: l, template: d});
        return"data:image/svg+xml;base64," + btoa(n)
    }

    function g(a) {return r.use_canvas && !r.use_svg ? e(a) : f(a)}

    function h(a, b, c, d) {
        var e = c.dimensions, f = c.theme, h = c.text ? decodeURIComponent(c.text) : c.text, i = e.width + "x" + e.height;
        f = h ? o(f, {text: h}) : f, f = c.font ? o(f, {font: c.font}) : f, b.setAttribute("data-src", d), c.theme = f, b.holder_data = c, "image" == a ? (b.setAttribute("alt", h ? h : f.text ? f.text + " [" + i + "]" : i), (r.use_fallback || !c.auto) && (b.style.width = e.width + "px", b.style.height = e.height + "px"), r.use_fallback ? b.style.backgroundColor = f.background : (b.setAttribute("src", g({ctx: w, dimensions: e, template: f, ratio: x, holder: c})), c.textmode && "exact" == c.textmode && (v.push(b), k(b)))) : "background" == a ? r.use_fallback || (b.style.backgroundImage = "url(" + g({ctx: w, dimensions: e, template: f, ratio: x, holder: c}) + ")", b.style.backgroundSize = e.width + "px " + e.height + "px") : "fluid" == a && (b.setAttribute("alt", h ? h : f.text ? f.text + " [" + i + "]" : i), "%" == e.height.slice(-1) ? b.style.height = e.height : null != c.auto && c.auto || (b.style.height = e.height + "px"), "%" == e.width.slice(-1) ? b.style.width = e.width : null != c.auto && c.auto || (b.style.width = e.width + "px"), ("inline" == b.style.display || "" === b.style.display || "none" == b.style.display) && (b.style.display = "block"), j(b), r.use_fallback ? b.style.backgroundColor = f.background : (v.push(b), k(b)))
    }

    function i(a, b) {
        var c = {height: a.clientHeight, width: a.clientWidth};
        return c.height || c.width ? (a.removeAttribute("data-holder-invisible"), c) : (a.setAttribute("data-holder-invisible", !0), void b.call(this, a))
    }

    function j(b) {
        if (b.holder_data) {
            var c = i(b, a.invisible_error_fn(j));
            if (c) {
                var d = b.holder_data;
                d.initial_dimensions = c, d.fluid_data = {fluid_height: "%" == d.dimensions.height.slice(-1), fluid_width: "%" == d.dimensions.width.slice(-1), mode: null}, d.fluid_data.fluid_width && !d.fluid_data.fluid_height ? (d.fluid_data.mode = "width", d.fluid_data.ratio = d.initial_dimensions.width / parseFloat(d.dimensions.height)) : !d.fluid_data.fluid_width && d.fluid_data.fluid_height && (d.fluid_data.mode = "height", d.fluid_data.ratio = parseFloat(d.dimensions.width) / d.initial_dimensions.height)
            }
        }
    }

    function k(b) {
        var c;
        c = null == b.nodeType ? v : [b];
        for (var d in c)if (c.hasOwnProperty(d)) {
            var e = c[d];
            if (e.holder_data) {
                var f = e.holder_data, h = i(e, a.invisible_error_fn(k));
                if (h) {
                    if (f.fluid) {
                        if (f.auto)switch (f.fluid_data.mode) {
                            case"width":
                                h.height = h.width / f.fluid_data.ratio;
                                break;
                            case"height":
                                h.width = h.height * f.fluid_data.ratio
                        }
                        e.setAttribute("src", g({ctx: w, dimensions: h, template: f.theme, ratio: x, holder: f}))
                    }
                    f.textmode && "exact" == f.textmode && (f.exact_dimensions = h, e.setAttribute("src", g({ctx: w, dimensions: f.dimensions, template: f.theme, ratio: x, holder: f})))
                }
            }
        }
    }

    function l(b, c) {
        for (var d = {theme: o(y.themes.gray, {})}, e = !1, f = b.length, g = 0; f > g; g++) {
            var h = b[g];
            a.flags.dimensions.match(h) ? (e = !0, d.dimensions = a.flags.dimensions.output(h)) : a.flags.fluid.match(h) ? (e = !0, d.dimensions = a.flags.fluid.output(h), d.fluid = !0) : a.flags.textmode.match(h) ? d.textmode = a.flags.textmode.output(h) : a.flags.colors.match(h) ? d.theme = a.flags.colors.output(h) : c.themes[h] ? c.themes.hasOwnProperty(h) && (d.theme = o(c.themes[h], {})) : a.flags.font.match(h) ? d.font = a.flags.font.output(h) : a.flags.auto.match(h) ? d.auto = !0 : a.flags.text.match(h) && (d.text = a.flags.text.output(h))
        }
        return e ? d : !1
    }

    function m(a, b) {
        var c = "complete", d = "readystatechange", e = !1, f = e, g = !0, h = a.document, i = h.documentElement, j = h.addEventListener ? "addEventListener" : "attachEvent", k = h.addEventListener ? "removeEventListener" : "detachEvent", l = h.addEventListener ? "" : "on", m = function (g) {(g.type != d || h.readyState == c) && (("load" == g.type ? a : h)[k](l + g.type, m, e), !f && (f = !0) && b.call(a, null))}, n = function () {
            try {
                i.doScroll("left")
            }
            catch (a) {
                return void setTimeout(n, 50)
            }
            m("poll")
        };
        if (h.readyState == c)b.call(a, "lazy"); else {
            if (h.createEventObject && i.doScroll) {
                try {
                    g = !a.frameElement
                }
                catch (o) {
                }
                g && n()
            }
            h[j](l + "DOMContentLoaded", m, e), h[j](l + d, m, e), a[j](l + "load", m, e)
        }
    }

    function n(a, b) {
        var a = a.match(/^(\W)?(.*)/), b = b || document, c = b["getElement" + (a[1] ? "#" == a[1] ? "ById" : "sByClassName" : "sByTagName")], d = c.call(b, a[2]), e = [];
        return null !== d && (e = d.length || 0 === d.length ? d : [d]), e
    }

    function o(a, b) {
        var c = {};
        for (var d in a)a.hasOwnProperty(d) && (c[d] = a[d]);
        for (var d in b)b.hasOwnProperty(d) && (c[d] = b[d]);
        return c
    }

    var q = {use_svg: !1, use_canvas: !1, use_fallback: !1}, r = {}, s = !1;
    canvas = document.createElement("canvas");
    var t = 1, u = 1, v = [];
    if (canvas.getContext)if (canvas.toDataURL("image/png").indexOf("data:image/png") < 0)q.use_fallback = !0; else var w = canvas.getContext("2d"); else q.use_fallback = !0;
    document.createElementNS && document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect && (q.use_svg = !0, q.use_canvas = !1), q.use_fallback || (t = window.devicePixelRatio || 1, u = w.webkitBackingStorePixelRatio || w.mozBackingStorePixelRatio || w.msBackingStorePixelRatio || w.oBackingStorePixelRatio || w.backingStorePixelRatio || 1);
    var x = t / u, y = {domain: "holder.js", images: "img", bgnodes: ".holderjs", themes: {gray: {background: "#eee", foreground: "#aaa", size: 12}, social: {background: "#3a5a97", foreground: "#fff", size: 12}, industrial: {background: "#434A52", foreground: "#C2F200", size: 12}, sky: {background: "#0D8FDB", foreground: "#fff", size: 12}, vine: {background: "#39DBAC", foreground: "#1E292C", size: 12}, lava: {background: "#F8591A", foreground: "#1C2846", size: 12}}, stylesheet: ""};
    a.flags = {dimensions: {regex: /^(\d+)x(\d+)$/, output: function (a) {
        var b = this.regex.exec(a);
        return{width: +b[1], height: +b[2]}
    }}, fluid            : {regex: /^([0-9%]+)x([0-9%]+)$/, output: function (a) {
        var b = this.regex.exec(a);
        return{width: b[1], height: b[2]}
    }}, colors           : {regex: /#([0-9a-f]{3,})\:#([0-9a-f]{3,})/i, output: function (a) {
        var b = this.regex.exec(a);
        return{size: y.themes.gray.size, foreground: "#" + b[2], background: "#" + b[1]}
    }}, text             : {regex: /text\:(.*)/, output: function (a) {return this.regex.exec(a)[1]}}, font: {regex: /font\:(.*)/, output: function (a) {return this.regex.exec(a)[1]}}, auto: {regex: /^auto$/}, textmode: {regex: /textmode\:(.*)/, output: function (a) {return this.regex.exec(a)[1]}}};
    var z = function () {
        if (window.XMLSerializer) {
            var a = new XMLSerializer, b = "http://www.w3.org/2000/svg", c = document.createElementNS(b, "svg");
            c.webkitMatchesSelector && c.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            var e = document.createElementNS(b, "rect"), f = document.createElementNS(b, "text"), g = document.createTextNode(null);
            return f.setAttribute("text-anchor", "middle"), f.appendChild(g), c.appendChild(e), c.appendChild(f), function (b) {return c.setAttribute("width", b.width), c.setAttribute("height", b.height), e.setAttribute("width", b.width), e.setAttribute("height", b.height), e.setAttribute("fill", b.template.background), f.setAttribute("x", b.width / 2), f.setAttribute("y", b.height / 2), g.nodeValue = b.text, f.setAttribute("style", d({fill: b.template.foreground, "font-weight": "bold", "font-size": b.text_height + "px", "font-family": b.font, "dominant-baseline": "central"})), a.serializeToString(c)}
        }
    }();
    for (var A in a.flags)a.flags.hasOwnProperty(A) && (a.flags[A].match = function (a) {return a.match(this.regex)});
    a.invisible_error_fn = function () {return function (a) {if (a.hasAttribute("data-holder-invisible"))throw new Error("Holder: invisible placeholder")}}, a.add_theme = function (b, c) {return null != b && null != c && (y.themes[b] = c), a}, a.add_image = function (b, c) {
        var d = n(c);
        if (d.length)for (var e = 0, f = d.length; f > e; e++) {
            var g = document.createElement("img");
            g.setAttribute("data-src", b), d[e].appendChild(g)
        }
        return a
    }, a.run = function (b) {
        r = o({}, q), s = !0;
        var c = o(y, b), d = [], e = [], f = [];
        for (null != c.use_canvas && c.use_canvas && (r.use_canvas = !0, r.use_svg = !1), "string" == typeof c.images ? e = n(c.images) : window.NodeList && c.images instanceof window.NodeList ? e = c.images : window.Node && c.images instanceof window.Node ? e = [c.images] : window.HTMLCollection && c.images instanceof window.HTMLCollection && (e = c.images), "string" == typeof c.bgnodes ? f = n(c.bgnodes) : window.NodeList && c.elements instanceof window.NodeList ? f = c.bgnodes : window.Node && c.bgnodes instanceof window.Node && (f = [c.bgnodes]), k = 0, j = e.length; j > k; k++)d.push(e[k]);
        var g = document.getElementById("holderjs-style");
        g || (g = document.createElement("style"), g.setAttribute("id", "holderjs-style"), g.type = "text/css", document.getElementsByTagName("head")[0].appendChild(g)), c.nocss || (g.styleSheet ? g.styleSheet.cssText += c.stylesheet : g.appendChild(document.createTextNode(c.stylesheet)));
        for (var i = new RegExp(c.domain + '/(.*?)"?\\)'), j = f.length, k = 0; j > k; k++) {
            var m = window.getComputedStyle(f[k], null).getPropertyValue("background-image"), p = m.match(i), t = f[k].getAttribute("data-background-src");
            if (p) {
                var u = l(p[1].split("/"), c);
                u && h("background", f[k], u, m)
            } else if (null != t) {
                var u = l(t.substr(t.lastIndexOf(c.domain) + c.domain.length + 1).split("/"), c);
                u && h("background", f[k], u, m)
            }
        }
        for (j = d.length, k = 0; j > k; k++) {
            var v, w;
            w = v = m = null;
            try {
                w = d[k].getAttribute("src"), attr_datasrc = d[k].getAttribute("data-src")
            }
            catch (x) {
            }
            if (null == attr_datasrc && w && w.indexOf(c.domain) >= 0 ? m = w : attr_datasrc && attr_datasrc.indexOf(c.domain) >= 0 && (m = attr_datasrc), m) {
                var u = l(m.substr(m.lastIndexOf(c.domain) + c.domain.length + 1).split("/"), c);
                u && (u.fluid ? h("fluid", d[k], u, m) : h("image", d[k], u, m))
            }
        }
        return a
    }, m(b, function () {window.addEventListener ? (window.addEventListener("resize", k, !1), window.addEventListener("orientationchange", k, !1)) : window.attachEvent("onresize", k), s || a.run({})}), "function" == typeof define && define.amd && define([], function () {return a}), function () {
        function a(a) {this.message = a}

        var b = "undefined" != typeof exports ? exports : this, c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        a.prototype = Error(), a.prototype.name = "InvalidCharacterError", b.btoa || (b.btoa = function (b) {
            for (var d, e, f = 0, g = c, h = ""; b.charAt(0 | f) || (g = "=", f % 1); h += g.charAt(63 & d >> 8 - 8 * (f % 1))) {
                if (e = b.charCodeAt(f += .75), e > 255)throw new a("'btoa' failed");
                d = d << 8 | e
            }
            return h
        }), b.atob || (b.atob = function (b) {
            if (b = b.replace(/=+$/, ""), 1 == b.length % 4)throw new a("'atob' failed");
            for (var d, e, f = 0, g = 0, h = ""; e = b.charAt(g++); ~e && (d = f % 4 ? 64 * d + e : e, f++ % 4) ? h += String.fromCharCode(255 & d >> (6 & -2 * f)) : 0)e = c.indexOf(e);
            return h
        })
    }(), document.getElementsByClassName || (document.getElementsByClassName = function (a) {
        var b, c, d, e = document, f = [];
        if (e.querySelectorAll)return e.querySelectorAll("." + a);
        if (e.evaluate)for (c = ".//*[contains(concat(' ', @class, ' '), ' " + a + " ')]", b = e.evaluate(c, e, null, 0, null); d = b.iterateNext();)f.push(d); else for (b = e.getElementsByTagName("*"), c = new RegExp("(^|\\s)" + a + "(\\s|$)"), d = 0; d < b.length; d++)c.test(b[d].className) && f.push(b[d]);
        return f
    }), window.getComputedStyle || (window.getComputedStyle = function (a) {
        return this.el = a, this.getPropertyValue = function (b) {
            var c = /(\-([a-z]){1})/g;
            return"float" == b && (b = "styleFloat"), c.test(b) && (b = b.replace(c, function () {return arguments[2].toUpperCase()})), a.currentStyle[b] ? a.currentStyle[b] : null
        }, this
    }), Object.prototype.hasOwnProperty || (Object.prototype.hasOwnProperty = function (a) {
        var b = this.__proto__ || this.constructor.prototype;
        return a in this && (!(a in b) || b[a] !== this[a])
    })
}(Holder, window), /*!
 * JavaScript for Bootstrap's docs (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */
    !function (a) {
        a(function () {
            if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
                var b = document.createElement("style");
                b.appendChild(document.createTextNode("@-ms-viewport{width:auto!important}")), document.querySelector("head").appendChild(b)
            }
            {
                var c = a(window), d = a(document.body);
                a(".navbar").outerHeight(!0) + 10
            }
            d.scrollspy({target: ".bs-docs-sidebar"}), c.on("load", function () {d.scrollspy("refresh")}), a(".bs-docs-container [href=#]").click(function (a) {a.preventDefault()}), setTimeout(function () {
                var b = a(".bs-docs-sidebar");
                b.affix({offset: {top: function () {
                    var c = b.offset().top, d = parseInt(b.children(0).css("margin-top"), 10), e = a(".bs-docs-nav").height();
                    return this.top = c - e - d
                }, bottom            : function () {return this.bottom = a(".bs-docs-footer").outerHeight(!0)}}})
            }, 100), setTimeout(function () {a(".bs-top").affix()}, 100), a(".tooltip-demo").tooltip({selector: "[data-toggle=tooltip]", container: "body"}), a(".tooltip-test").tooltip(), a(".popover-test").popover(), a(".bs-docs-navbar").tooltip({selector: "a[data-toggle=tooltip]", container: ".bs-docs-navbar .nav"}), a("[data-toggle=popover]").popover(), a("#loading-example-btn").click(function () {
                var b = a(this);
                b.button("loading"), setTimeout(function () {b.button("reset")}, 3e3)
            })
        })
    }(jQuery);
