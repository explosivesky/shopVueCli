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
						<h3 class="text-center mb-0 text-secondary">{{ $conf.logo }}</h3>
					</div>
					<div class="card-body">
						<el-form :rules="rules" ref="form" :model="form">
							<el-form-item prop="username"><el-input v-model="form.username" placeholder="请输入用户名称"></el-input></el-form-item>
							<el-form-item prop="password"><el-input v-model="form.password" placeholder="请输入用户密码"></el-input></el-form-item>
							<!-- 按钮 -->
							<el-button type="primary" size="medium" :loading="loading" @click="onSubmit" class="w-100">立即登录</el-button>
						</el-form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			form: {
				username: '',
				password: ''
			},
			rules: {
				username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
				password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }]
			},
			loading: false
		};
	},
	methods: {
		//登录
		onSubmit() {
			this.$refs.form.validate(valid => {
				if (!valid) return;
				this.loading = true;
				new this.request(this.url.m().login, this.form, { loading: false, token: false }).modepost().then(res => {
					// 存储到vuex
					// 存储到本地存储
					res = res.data.data;
					//存储权限规则
					if (res.role && res.role.rules) {
						window.sessionStorage.setItem('rules', JSON.stringify(res.role.rules));
					}
					this.$store.commit('login', res);
					//生成后台数据结构
					this.$store.commit('getMenu', res.tree);

					this.loading = false;
					//获取数据中对应的第一个页面是什么
					this.$router.push({ name: this.defaultRoute });
				});
			});
		}
	},
	computed: {
		...mapGetters(['defaultRoute'])
	}
};
</script>

<style></style>
