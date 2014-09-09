var isColorBlind = function() {
    if (basket.get('colors')) {
        return basket.get('colors').url.indexOf('-deuteranopia') > -1
    }
}
var setupToggle = function() {
   $('#color-blind-toggle').on('click', function(e) {
      e.preventDefault();
      var type = isColorBlind() ? '' : '-deuteranopia';
      
      basket.remove('styles');
      basket.remove('colors');
      basket.remove('appjs');
      
      basket.require({ url: 'js/utils/colors' + type + '.json',  execute: false, key: 'colors' }).then(function(){
        basket.require({ url: 'js/application' + type + '.js', key: 'appjs'})
      });
      basket.require({ url: 'css/application' + type + '.css', execute: false, key: 'styles'}).then(function(responses){
        var css = responses[0];
        _stylesheet.appendStyleSheet(css, function(err, style) {
          if (err) {
            console.error(err);
          }
        });
      });
    }); 
}
function css(a) {
    var sheets = document.styleSheets, o = {};
    for (var i in sheets) {
        var rules = sheets[i].rules || sheets[i].cssRules;
        for (var r in rules) {
            if (a.is(rules[r].selectorText)) {
                o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
            }
        }
    }
    return o;
}

function css2json(css) {
    var s = {};
    if (!css) return s;
    if (css instanceof CSSStyleDeclaration) {
        for (var i in css) {
            if ((css[i]).toLowerCase) {
                s[(css[i]).toLowerCase()] = (css[css[i]]);
            }
        }
    } else if (typeof css == "string") {
        css = css.split("; ");
        for (var i in css) {
            var l = css[i].split(": ");
            s[l[0].toLowerCase()] = (l[1]);
        }
    }
    return s;
}
var deuteranopiaImages = function() {

    var images = document.getElementsByTagName('IMG');
     var callback = function(img) {
           if(img.target) img = this;
           c.width = img.width;
           c.height = img.height;
           ctx.drawImage(img, 0, 0, img.width, img.height);
           var pixels = ctx.getImageData(0, 0, img.width, img.height);
           var filtered = filter(pixels);
           ctx.putImageData(filtered, 0,0);
           $(c).css(css($(img)));
           img.style.display = 'none';
        }

    var filter = function(pixels) {
        var d = pixels.data;
        for(var i=0;i<d.length; i+=4) {
            var r = d[i];
            var g = d[i+1];
            var b = d[i+2];
            // mostly red
            if(r > g && r > b) {
                var rg = (r + g)/2;
                var r = rg;
                var g = rg;
            } else if(g > r && g > b) {
                g = b;
                b = g;
            }
            d[i] = r;
            d[i+1] = g;
            d[i+2] = b;
        }
        return pixels;
    }

    for(var i=0; i<images.length; i++) {
        var c=document.createElement("canvas");
        var ctx=c.getContext("2d");
        var img = images[i];
        c.className = 'deuteranopia-image ' + img.className;
        var parent = img.parentElement;
        parent.insertBefore(c, img);

        if(img.complete) { //check if image was already loaded by the browser
            callback(img);
        }else {
           img.onload = callback;
        }
    }
    
}

$(function() {
  setupToggle();
});