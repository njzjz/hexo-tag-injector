const crypto = require("crypto");
const escapeStringRegexp = require('escape-string-regexp');

class Injector {
    constructor(hexo) {
        this.hexo = hexo;
        this.id = crypto.randomBytes(16).toString("hex");
        this.taglt = `<!--begin_${this.id}-->`;
        this.tagrt = `<!--end_${this.id}-->`;
        this.re = new RegExp(escapeStringRegexp(this.taglt) + "(([\\s\\S])*?)" + escapeStringRegexp(this.tagrt), "g");
    }

    mark(str) {
        /** mark the tag */
        return this.taglt + str + this.tagrt;
    }

    register(entry, value, remove_from_index = false) {
        /** inject scripts or stylesheets */
        const re = this.re;
        const _injector = this._injector;
        this.hexo.extend.filter.register('after_render:html', function (str, data) {
            if (str.match(re)) {
                // only add scripts for pages that have the tag
                if (remove_from_index && data.page.__index) {
                    str = str.replace(re, "");
                } else {
                    str = str.replace(re, "$1");
                    if (entry === 'head_begin') {
                        // Inject head_begin
                        str = _injector(str, /<head.*?>/, value, true);
                    }
                    else if (entry === 'head_end') {
                        // Inject head_end
                        str = _injector(str, '</head>', value, false);
                    }
                    else if (entry === 'body_begin') {
                        // Inject body_begin
                        str = _injector(str, /<body.*?>/, value, true);
                    }
                    else if (entry === 'body_end') {
                        // Inject body_end
                        str = _injector(str, '</body>', value, false);
                    }
                }
            }
            return str;
        }, 9);
    }

    _injector(input, pattern, code, isBegin = true) {
        return input.replace(pattern, str => { return isBegin ? str + code : code + str; });
    }

}

module.exports = Injector;
