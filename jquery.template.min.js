/*
 * jQuery.template
 * A micro-templating plugin for jQuery by David Furfero <http://furf.com/>
 * http://github.com/furf/jquery-template
 * Adapted from an original work by John Resig <http://ejohn.org/>
 * http://ejohn.org/blog/javascript-micro-templating/
 * MIT Licensed
 */
(function(c){var b={},a=/\{%/;c.template=function(e,k,i,m){var h="replace",l="split",g="join",n="jquery:template",d,f,j;if(typeof e!=="boolean"){m=i;i=k;k=e;e=true;}if(k in b){j=b[k];}else{if(c.trim(k).length&&!a.test(k)){c.ajax({url:k,dataType:"text",async:false,success:function(o){j=c.template(false,o);if(e){b[k]=j;}}});}else{d="var __=[];__.push('"+k[h](/[\r\t\n]/g," ")[l](/%\}\s*\{%/)[g]("")[l]("{%")[g]("\t")[h](/((^|%\})[^\t]*)'/g,"$1\r")[l]("'")[g]("\\'")[h](/\t=(.*?)%\}/g,"',$1,'")[l]("\t")[g]("');")[l]("%}")[g](";__.push('")[l]("\r")[g]("\\'")+"');return __.join('');";f=new Function("__index__",d);j=function(q,o){var p=c.isArray(q)?c.map(q,function(r,s){return f.call(r,s);}).join(""):f.call(q);return o?p:c("<"+n+">"+p+"</"+n+">");};j.toString=function(){return f.toString();};if(f.toSource){j.toSource=function(){return f.toSource();};}if(e){b[k]=j;}}}return i?j(i,m):j;};c.fn.template=function(e,d){return c.template(this[this[0].nodeName.toUpperCase()==="TEXTAREA"?"val":"html"](),e,d);};})(jQuery);