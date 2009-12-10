jQuery.fn.template = function(obj) {
  var fn = (function (str) {
    var tmpl = new Function ("__", "__.push('" +
      str.replace(/[\r\t\n]/g, " ")
         .split("<%").join("\t")
         .replace(/((^|%>)[^\t]*)'/g, "$1\r")
         .replace(/\t=(.*?)%>/g, "',$1,'")
         .split("\t").join("');")
         .split("%>").join(";__.push('")
         .split("\r").join("\\'")
         + "');return __.join('');");
    return function (obj) {
      return jQuery(tmpl.call(obj, []));
    };
  })(this.html() || '');
  return obj ? fn(obj) : fn;
};
