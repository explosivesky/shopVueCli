/*
 * @Author: your name
 * @Date: 2022-01-19 18:01:13
 * @LastEditTime: 2022-01-19 18:02:52
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \shopvuecli\src\common\config\router_config.js
 */
export default (router,name)=>{
    router.push({name}).catch(e=>e)
}