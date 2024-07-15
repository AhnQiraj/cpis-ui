const Utils = {
  /**
   * 是否是对象
   * @param {} obj
   */
  isPlainObject: function(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  },
  /**
   * 对象/数组遍历
   */
  each: function(collection, iteratee) {
    if (Array.isArray(collection)) {
      let index = -1
      const length = collection.length
      while (++index < length) {
        if (iteratee(collection[index], collection, index) === false) {
          break
        }
      }
      return collection
    } else {
      if (collection == null) {
        return collection
      }
      const keys = Object.keys(collection)
      const length = keys.length
      const iterable = Object(collection)
      let index = -1
      while (++index < length) {
        const key = keys[index]
        if (iteratee(key, iterable[key], index) === false) {
          break
        }
      }
      return collection
    }
  },
  /**
   * Returns a depply cloned object without reference.
   * Copied from Vue MultiSelect and Vuex.
   * @type {Object}
   */
  deepClone: function(obj) {
    if (Array.isArray(obj)) {
      return obj.map(Utils.deepClone)
    } else if (obj && typeof obj === 'object') {
      let cloned = {}
      let keys = Object.keys(obj)
      for (let i = 0, l = keys.length; i < l; i++) {
        let key = keys[i]
        cloned[key] = Utils.deepClone(obj[key])
      }
      return cloned
    } else {
      return obj
    }
  },
  /**
 * Iterates over radio/checkbox/selection options, it accept four formats
 *
 * @example
 * // array of values
 * options = ['one', 'two', 'three']
 * @example
 * // simple key-value map
 * options = {1: 'one', 2: 'two', 3: 'three'}
 * @example
 * // array of 1-element maps
 * options = [{1: 'one'}, {2: 'two'}, {3: 'three'}]
 * @example
 * // array of elements
 * options = [{value: 1, label: 'one', optgroup: 'group'}, {value: 2, label: 'two'}]
 *
 * @param {object|array} options
 * @param {Utils#OptionsIteratee} tpl
 */
  iterateOptions: function(options, tpl) {
    if (!options) {return}
    if (Array.isArray(options)) {
      options.forEach(function(entry) {
        if (Utils.isPlainObject(entry)) {
        // array of elements
          if ('value' in entry) {
            tpl(entry.value, entry.label || entry.value, entry.optgroup)
          } else { // array of one-element maps
            Utils.each(entry, function(key, value) {
              tpl(key, value)
              return false // break after first entry
            })
          }
        } else { // array of values
          tpl(entry, entry)
        }
      })
    } else { // unordered map
      Utils.each(options, function(key, value) {
        tpl(key, value)
      })
    }
  },
  /**
 * Replaces {0}, {1}, ... in a string
 * @param {string} str
 * @param {...*} args
 * @returns {string}
 */
  fmt: function(str, args) {
    if (!Array.isArray(args)) {
      args = Array.prototype.slice.call(arguments, 1)
    }
    return str.replace(/{([0-9]+)}/g, function(m, i) {
      return args[parseInt(i)]
    })
  },
  /**
 * Throws an Error object with custom name or logs an error
 * @param {boolean} [doThrow=true]
 * @param {string} type
 * @param {string} message
 * @param {...*} args
 */
  error: function() {
    let i = 0
    let doThrow = typeof arguments[i] === 'boolean' ? arguments[i++] : true
    let type = arguments[i++]
    let message = arguments[i++]
    let args = Array.isArray(arguments[i]) ? arguments[i] : Array.prototype.slice.call(arguments, i)
    if (doThrow) {
      let err = new Error(Utils.fmt(message, args))
      err.name = type + 'Error'
      err.args = args
      throw err
    } else {
      console.error(type + 'Error: ' + Utils.fmt(message, args))
    }
  }
}
export default Utils
