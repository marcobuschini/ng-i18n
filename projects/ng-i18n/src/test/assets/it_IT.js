;(function(root, G) {
  if (typeof define === 'function' && define.amd) {
    define(G)
  } else if (typeof exports === 'object') {
    module.exports = G
  } else {
    root.it_IT = G
  }
})(this, {
  TEST_TRANSLATION_PARAMS: function(d) {
    return 'Ci sono due parametri: ' + d.KEY_1 + ' e ' + d.KEY_2
  },
  TEST_TRANSLATION: function(d) {
    return 'Non ci sono parametri'
  },
})
