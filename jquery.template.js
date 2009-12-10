jQuery.template = function(str, obj) {
  var replace = 'replace', split = 'split', join = 'join',
      tmpl = new Function ("__", "__.push('" +
        str[replace](/[\r\t\n]/g, " ")
           [split]("<%")[join]("\t")
           [replace](/((^|%>)[^\t]*)'/g, "$1\r")
           [replace](/\t=(.*?)%>/g, "',$1,'")
           [split]("\t")[join]("');")
           [split]("%>")[join](";__.push('")
           [split]("\r")[join]("\\'")
           + "');return __.join('');");
  function render (obj) {
    return jQuery(tmpl.call(obj, []));
  }
  return obj ? render(obj) : render;
};

jQuery.fn.template = function(obj) {
  return $.template(this.html() || '', obj);
};
