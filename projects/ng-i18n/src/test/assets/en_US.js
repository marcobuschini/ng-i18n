;(function(root, G) {
  if (typeof define === 'function' && define.amd) {
    define(G)
  } else if (typeof exports === 'object') {
    module.exports = G
  } else {
    root.en_US = G
  }
})(this, {
  TEST_TRANSLATION_PARAMS: function(d) {
    return 'There are two parameters: ' + d.KEY_1 + ' and ' + d.KEY_2
  },
  TEST_TRANSLATION: function(d) {
    return 'There are no parameters'
  },
})
