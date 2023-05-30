/**
 * 判断url是否是http或https
 * @param {string} path
 * @returns {Boolean}
 */
export function isHttp(url) {
  return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
}

/**
 * 判断path是否为外链
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}
const validateFn = function (
  validatorName,
  rule,
  value,
  callback,
  defaultErrorMsg
) {
  // 空值不校验
  if (isNull(value) || value.length <= 0) {
    callback()
    return
  }
  // eslint-disable-next-line no-eval
  const reg = eval(getRegExp(validatorName))
  if (!reg.test(value)) {
    const errTxt = rule.errorMsg || defaultErrorMsg
    callback(new Error(errTxt))
  } else {
    callback()
  }
}
function isNull(value) {
  return value === null || value === undefined
}
const getRegExp = function (validatorName) {
  const commonRegExp = {
    number: '/^\\d+(\\.\\d+)?$/',
    int: '/^[0-9]+$/',
    letter: '/^[A-Za-z]$/',
    letterAndNumber: '/^[A-Za-z0-9]+$/',
    // 大写字母和数字
    upperLetterAndNumber: '/^[A-Z0-9]+$/',
    mobilePhone:
      /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
    // 所有联系方式：手机号+座机号
    allPhone: '/^(((\\d{3,4}-)?\\d{7,8}(-\\d{1,8})?)|(\\d{7,8})|(1\\d{10}))$/',
    telPhone: '/^([0-9]{3,4}-)?[0-9]{7,8}$/',
    letterStartNumberIncluded: '/^[A-Za-z]+[A-Za-z\\d]*$/',
    noChinese: '/^[^\u4e00-\u9fa5]+$/',
    noNumber: /\D/,
    chinese: '/^[\u4e00-\u9fa5]+$/',
    chineseAndLetter: '/^[\u4e00-\u9fa5a-zA-Z]+$/',
    chineseAndLetterAndNumber: '/^[\u4e00-\u9fa5a-zA-Z0-9]+$/',
    email: '/^([-_A-Za-z0-9.]+)@([_A-Za-z0-9]+\\.)+[A-Za-z0-9]{2,3}$/',
    // 邮编
    zipCode: '/^\\d{6}$/',
    url: '/^([hH][tT]{2}[pP]:\\/\\/|[hH][tT]{2}[pP][sS]:\\/\\/)(([A-Za-z0-9-~]+)\\.)+([A-Za-z0-9-~\\/])+$/',
    // 身份证号
    idCardDif:
      '/^([1-6][1-9]|50)\\d{4}(18|19|20)\\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$/', // 复杂版本
    creditCode: '/^[A-Z0-9]{18}$/',
    numberOrPoint: '/^[0-9.]+$/'
  }

  return commonRegExp[validatorName]
}
export const FormValidators = {
  /* 手机号码 */
  mobilePhone(rule, value, callback) {
    // validateFn('mobilePhone', rule, value, callback, '[' + rule.label + ']手机号码格式有误')
    validateFn('mobilePhone', rule, value, callback, '手机号码格式有误')
  },
  // 身份证号
  idCardDif(rule, value, callback) {
    validateFn('idCardDif', rule, value, callback, '身份证号格式有误')
  },
  // 手机+座机
  allPhone(rule, value, callback) {
    validateFn('allPhone', rule, value, callback, '电话号码格式有误')
  },
  // 统一社会信用代码
  creditCode(rule, value, callback) {
    validateFn('creditCode', rule, value, callback, '统一社会信用代码格式有误')
  },
  // 数字和 .
  numberOrPoint(rule, value, callback) {
    validateFn('numberOrPoint', rule, value, callback, '数据格式有误')
  },
  // 数字
  number(rule, value, callback) {
    validateFn('number', rule, value, callback, '数据格式有误')
  }
}
