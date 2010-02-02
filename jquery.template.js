/**
 * jQuery.template
 * A micro-templating plugin for jQuery by David Furfero <http://furf.com/>
 * http://github.com/furf/jquery-template
 * Adapted from an original work by John Resig <http://ejohn.org/>
 * http://ejohn.org/blog/javascript-micro-templating/
 * MIT Licensed
 */
jQuery.template = function (str, obj, raw) {
  var replace = 'replace', split = 'split', join = 'join',
      render = new Function ("var __=[];__.push('" +
        str[replace](/[\r\t\n]/g, " ")
           [split]("<%")[join]("\t")
           [replace](/((^|%>)[^\t]*)'/g, "$1\r")
           [replace](/\t=(.*?)%>/g, "',$1,'")
           [split]("\t")[join]("');")
           [split]("%>")[join](";__.push('")
           [split]("\r")[join]("\\'") +
           "');return __.join('');");
  function proxy (obj, raw) {
    var html = render.call(obj);
    return raw ? html : jQuery(html);
  }
  return obj ? proxy(obj, raw) : proxy;
};

jQuery.fn.template = function (obj, raw) {
  return jQuery.template(this.text() || '', obj, raw);
};
