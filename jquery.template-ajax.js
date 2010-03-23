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
      tokenExpr = /\{%/;  // Tests non-templates, ie. URLs

  $.template = function (cache, str, obj, raw) {

    var replace = 'replace', split = 'split', join = 'join', source, render, proxy;

    if (typeof cache !== 'boolean') {
      raw = obj;
      obj = str;
      str = cache;
      cache = true;
    }

    /**
     * Use cached template
     */
    if (templates[str]) {

      proxy = templates[str];

    /**
     * Load Ajax template
     */
    } else if (!tokenExpr.test(str)) {

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
     * Create new template
     */
    } else {

      // Convert template to JavaScript source code
      source = "var __=[];__.push('" +
        str[replace](/[\r\t\n]/g, " ")
           [split]("{%")[join]("\t")
           [replace](/((^|%\})[^\t]*)'/g, "$1\r")
           // escape single quotes 
           // fixes a bug in the templating code but requires double quoting
           // of strings in code blocks - more on this later
           [split]("'")[join]("\\'")
           [replace](/\t=(.*?)%\}/g, "',$1,'")
           [split]("\t")[join]("');")
           [split]("%}")[join](";__.push('")
           [split]("\r")[join]("\\'") +
           "');return __.join('');";

      // Create the render function from generated source
      render = new Function(source);

      /**
       * Using a proxy function helps us avoid use of the "with" keyword as in the
       * original micro-templating code. This provides a noticeable performance
       * improvement (in most browsers), but requires the use of "this" keyword in
       * the templates.
       */
      proxy = function (obj, raw) {

        // If object is an Array, render its members , otherwise render object
        var html = $.isArray(obj) ? $.map(obj, function (obj) {
          return render.call(obj);
        }).join('') : render.call(obj);

        // Return rendered HTML as a string or wrapped in custom tag
        return raw ? html : $('<jquery:template>' + html + '</jquery:template>');
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
   */
  $.fn.template = function (obj, raw) {
    return $.template(this.text() || '', obj, raw);
  };

})(this.document, this.jQuery);
