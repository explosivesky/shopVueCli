/*
 * @Author: your name
 * @Date: 2022-01-17 23:33:14
 * @LastEditTime: 2022-01-17 23:33:14
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \shopProduct\shopvuecli\eslint.config.js
 */
module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    //设置"script"（默认）或"module"如果你的代码是在ECMAScript中的模块。
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // // allow paren-less arrow functions
    // 'arrow-parens': 0,
    // // allow async-await
    // 'generator-star-spacing': 0,
    // // allow debugger during development
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // "no-unused-vars": [2, { 
    //   // 允许声明未使用变量
    //   "vars": "local",
    //   // 参数不检查
    //   "args": "none" 
    // }],
    // // 关闭语句强制分号结尾
    // "semi": [0],
    // //空行最多不能超过100行
    // "no-multiple-empty-lines": [0, {"max": 100}],
    // //关闭禁止混用tab和空格
    // "no-mixed-spaces-and-tabs": [0],
	     "generator-star-spacing": "off",
	        "no-tabs":"off",
	        "no-unused-vars":"off",
	        "no-console":"off",
	        "no-irregular-whitespace":"off",
	        "no-debugger": "off"
  }
}