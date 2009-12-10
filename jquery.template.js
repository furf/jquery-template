jQuery.template = function(str, obj) {
  var replace = 'replace', split = 'split', join = 'join',
      render = new Function ("__", "__.push('" +
        str[replace](/[\r\t\n]/g, " ")
           [split]("<%")[join]("\t")
           [replace](/((^|%>)[^\t]*)'/g, "$1\r")
           [replace](/\t=(.*?)%>/g, "',$1,'")
           [split]("\t")[join]("');")
           [split]("%>")[join](";__.push('")
           [split]("\r")[join]("\\'") +
           "');return __.join('');");
  function proxy (obj) {
    return jQuery(render.call(obj, []));
  }
  return obj ? proxy(obj) : proxy;
};

jQuery.fn.template = function(obj) {
  return $.template(this.html() || '', obj);
};
