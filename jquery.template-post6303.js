/**
 * jQuery.template
 * A micro-templating plugin for jQuery by David Furfero <http://furf.com/>
 * http://github.com/furf/jquery-template
 * Adapted from an original work by John Resig <http://ejohn.org/>
 * http://ejohn.org/blog/javascript-micro-templating/
 * MIT Licensed
 */
/**
 * IMPORTANT! This version of jQuery.template should only be used if and when
 * http://dev.jquery.com/ticket/6303 is merged into the jQuery core.
 */
jQuery.template = function (str, obj, raw) {

  var replace   = 'replace',
      split     = 'split',
      join      = 'join',

      // Convert template to JavaScript source code
      source = "var __=[];__.push('" +
        str[replace](/[\r\t\n]/g, " ")
           [split]("{%")[join]("\t")
           [replace](/((^|%\})[^\t]*)'/g, "$1\r")
           [replace](/\t=(.*?)%\}/g, "',$1,'")
           [split]("\t")[join]("');")
           [split]("%}")[join](";__.push('")
           [split]("\r")[join]("\\'") +
           "');return __.join('');",

      // Create the render function from generated source
      render = new Function (source);
           
  /**
   * Using a proxy function helps us avoid use of the "with" keyword as in the
   * original micro-templating code. This provides a noticeable performance 
   * improvement (in most browsers), but requires the use of "this" keyword in
   * the templates.
   */
  function proxy (obj, raw) {
    var html = render.call(obj);
    return raw ? html : jQuery(jQuery.template.quickExpr.test(html) ? html : document.createTextNode(html));
  }

  /**
   * Aliased toString and toSource methods allow access to rendered template
   * function source code for improved debugging.
   */
  proxy.toString = function () {
    return render.toString();
  };
  
  if (render.toSource) {
    proxy.toSource = function () {
      return render.toSource();
    };
  }

  // Return template engine or rendered HTML if an object is specified
  return obj ? proxy(obj, raw) : proxy;
};


// Splits leading text fragment, DOM elements, trailing text fragments
jQuery.template.quickExpr = /^([^<]*)(<[\w\W]+>)([^>]*)$/;


/**
 * Parse selected elements as templates
 */
jQuery.fn.template = function (obj, raw) {
  return jQuery.template(this.text() || '', obj, raw);
};
