<!--
 * @Author: your name
 * @Date: 2022-01-18 11:05:23
 * @LastEditTime: 2022-01-18 15:19:36
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \shopProduct\shopvuecli\src\views\login.vue
-->
<template>
    <div class="container">
        <div class="row">
            <div class="col-12 col-lg-5 col-md-7 col-sm-9 m-auto  pt-5">
				<div class="card mt-5">
					<div class="card-header bg-white">
						<h3 class="text-center mb-0 text-secondary">{{$conf.logo}}</h3>
					</div>
					<div class="card-body">
						<el-form :rules="rules" ref="ruleForm" :model="ruleForm">
						  <el-form-item prop="username">
						    <el-input v-model="ruleForm.username" placeholder="请输入用户名称"></el-input>
						  </el-form-item>
						  <el-form-item  prop="password">
						    <el-input v-model="ruleForm.password" placeholder="请输入用户密码"></el-input>
						  </el-form-item>
						  <!-- 按钮 -->
						   <el-button type="primary" size='medium' @click="onSubmit" class="w-100">立即登录</el-button>
						</el-form>
					</div>
				</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
data(){
	return{
		ruleForm:{
			username:'',
			password:'',
		},
		rules:{
			username:[{required:true,message:'请输入用户名', trigger: 'blur' }],
			password:[{required:true,message:'请输入用户密码', trigger: 'blur' }]
		}
	}
},
methods:{
  onSubmit() {
	  console.log(this.username)
        this.$refs.ruleForm.validate((valid) => {
          if (!valid)return
		  this.$router.push({name:'index'})
        });
      },
}
}
</script>

<style>

</style>