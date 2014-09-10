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
        basket.require({ url: 'js/application.js', key: 'appjs'})
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

$(function() {
  setupToggle();
});