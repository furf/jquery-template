/**
 * jQuery.template
 * A micro-templating plugin for jQuery by David Furfero <http://furf.com/>
 * http://github.com/furf/jquery-template
 * Adapted from an original work by John Resig <http://ejohn.org/>
 * http://ejohn.org/blog/javascript-micro-templating/
 * MIT Licensed
 */
(function (document, $) {

  var templates = {},     // Cache for previously rendered templates
      tokenExpr = /\{%/;  // Rough test for non-templates, ie. URLs

  /**
   * Creates a template engine based on a specified template, either a string
   * or URL to template file.
   * @param Boolean cache (optional) Set false to avoid cache, default true 
   * @param String  str Parseable HTML template (must contain at least one
   *                tag, {% ... %}) or URL to template file
   * @param Object  obj (optional) data object to render
   * @param Boolean raw (optional) set true to render as pure HTML, set false to
   *                render as jQuery collection, default false
   * @return Object jQuery collection containing one member, <jquery:template/>,
   *                which will contain contents of rendered template
   */
  $.template = function (cache, str, obj, raw) {

    var replace = 'replace',
        split   = 'split',
        join    = 'join',
        tag     = 'jquery:template',
        source,
        render,
        proxy;

    // If optional first argument is not supplied, shift arguments
    if (typeof cache !== 'boolean') {
      raw   = obj;
      obj   = str;
      str   = cache;
      cache = true;
    }

    /**
     * If str matches a key in the cache, use the previously rendered template
     */
    if (str in templates) {

      proxy = templates[str];

    /**
     * If str does not contain any template tags, async load the Ajax template
     */
    } else if ($.trim(str).length && !tokenExpr.test(str)) {

      $.ajax({
        url:      str,
        dataType: 'text',
        async:    false,
        success: function (response) {

          proxy = $.template(false, response);

          if (cache) {
            templates[str] = proxy;
          }
        }
      });

    /**
     * Parse str as JavaScript source to create new template engine
     */
    } else {

      // Convert template to JavaScript source code
      source = "var __=[];__.push('" +
        str[replace](/[\r\t\n]/g, " ")
           [split]("{%")[join]("\t")
           [replace](/((^|%\})[^\t]*)'/g, "$1\r")

           /**
            * NOTE! Due to a bug in the micro-template parser, where templates
            * containing more than one single quote (') fail to render, we
            * escape all single quotes. The downside is that you must use
            * double quotes (") to encapsulate strings in your code blocks.
            * Example: {% var foo = "bar"; }
            */
           [split]("'")[join]("\\'")
           
           [replace](/\t=(.*?)%\}/g, "',$1,'")
           [split]("\t")[join]("');")
           [split]("%}")[join](";__.push('")
           [split]("\r")[join]("\\'") +
           "');return __.join('');";

      // Create the render function from generated source
      render = new Function(source);

      /**
       * Using a proxy function helps us avoid use of the "with" keyword, used
       * in the original micro-templating code. This provides a noticeable
       * performance improvement (in most browsers), but requires the use of
       * "this" keyword in the templates.
       * Example:
       * $('myTemplate.tpl', {name:'furf'});
       * myTemplate.tpl:
       * Hello, <em>{%= this.name %}</em>
       */
      proxy = function (obj, raw) {

        // If object is an Array, render its members , otherwise render object
        var html = $.isArray(obj) ? $.map(obj, function (obj) {
          return render.call(obj);
        }).join('') : render.call(obj);

        // Return rendered HTML as a string or as jQuery instance
        return raw ? html : $('<' + tag + '>' + html + '</' + tag + '>');
      };

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

      // Cache proxy for faster retrieval on subsequent calls
      if (cache) {
        templates[str] = proxy;
      }
    }

    // Return template engine or rendered HTML if an object is specified
    return obj ? proxy(obj, raw) : proxy;
  };

  /**
   * Parse selected elements as templates
   * @todo make this function consistent among dome elements
   */
  $.fn.template = function (obj, raw) {
    // .html() provides more consistent results than .text()
    // I seem to recall inconsistencies with .html() as well, but I'm not able
    // to reproduce them at the moment
    return $.template(this.html(), obj, raw);
  };

})(this.document, this.jQuery);
