<template>
	<div class="bg-white px-2 position-absolute" style="top: 55px; right: 0; bottom: 0; left: 0;">
		<el-tabs v-model="tabActive" @tab-click="tabChange">
			<!-- 注册与访问 -->
			<el-tab-pane label="注册与访问">
				<el-form ref="form" :model="form" label-width="150px">
					<el-form-item label="是否允许注册会员">
						<el-radio-group v-model="form.isreg" size="middle">
							<el-radio-button :label="0">是</el-radio-button>
							<el-radio-button :label="1">否</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="注册类型">
						<el-radio-group v-model="form.reg_type" size="middle">
							<el-radio-button label="username">普通注册</el-radio-button>
							<el-radio-button label="phone">手机注册</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="密码最小长度">
						<el-input v-model="form.password_length" type="number" class="w-25" size="middle" placeholder="密码最小长度"></el-input>
					</el-form-item>
					<el-form-item label="强制密码复杂度">
						<el-checkbox-group v-model="form.password_encrypt" size="middle">
							<el-checkbox-button :label="0">数字</el-checkbox-button>
							<el-checkbox-button :label="1">小写字母</el-checkbox-button>
							<el-checkbox-button :label="2">大写字母</el-checkbox-button>
							<el-checkbox-button :label="3">符号</el-checkbox-button>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item><el-button type="primary" @click="onSubmit" size="middle">保存</el-button></el-form-item>
				</el-form>
			</el-tab-pane>
			<!-- 上传设置 -->
			<el-tab-pane label="默认上传方式">
				<el-form ref="form" :model="form" label-width="150px">
					<el-form-item label="是否允许注册会员">
						<el-radio-group v-model="form.upload_method" size="middle">
							<el-radio-button label="local">本地存储</el-radio-button>
							<el-radio-button label="qiniu">七牛云</el-radio-button>
							<el-radio-button label="oss">阿里oss</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="注册类型"><el-input v-model="form.Bucket" type="text" class="w-25" size="middle" placeholder="Bucket"></el-input></el-form-item>
					<el-form-item label="密码最小长度">
						<el-input v-model="form.ACCESS_KEY" type="number" class="w-25" size="middle" placeholder="ACCESS_KEY"></el-input>
					</el-form-item>
					<el-form-item label="强制密码复杂度">
						<el-input v-model="form.SECRET_KEY" type="number" class="w-25" size="middle" placeholder="SECRET_KEY"></el-input>
					</el-form-item>
					<el-form-item label="空间域名">
						<el-input v-model="form.http" type="number" class="w-25" size="middle" placeholder="http"></el-input>
						<small class="text-secondary d-block">请补全http:// 或 https://</small>
					</el-form-item>
					<el-form-item><el-button type="primary" @click="onSubmit" size="middle">保存</el-button></el-form-item>
				</el-form>
			</el-tab-pane>
			<!-- 角色管理 -->
			<el-tab-pane label="Api安全">
				<el-form ref="form" :model="form" label-width="150px">
					<el-form-item label="是否开启API安全">
						<el-radio-group v-model="form.api" size="mini">
							<el-radio-button :label="1">是</el-radio-button>
							<el-radio-button :label="0">否</el-radio-button>
						</el-radio-group>
						<small class="text-secondary d-block">api安全功能开启之后调用前端api需要传输签名串</small>
					</el-form-item>
					<el-form-item label="秘钥">
						<el-input v-model="form.api_key" size="mini" style="width: 50%;" placeholder="秘钥"></el-input>
						<small class="text-secondary d-block">
							秘钥设置关系系统中api调用传输签名串的编码规则，以及会员token解析，请慎重设置，注意设置之后对应会员要求重新登录获取token
						</small>
					</el-form-item>
					<el-form-item><el-button type="primary" size="mini">保存</el-button></el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
export default {
	data() {
		return {
			tabActive: 0,
			form: {
				isreg: 1,
				reg_type: 'username',
				password_length: '',
				password_encrypt: ['0'],
				upload_method: 'local',
				Bucket: '',
				ACCESS_KEY: '',
				SECRET_KEY: '',
				http: '',
				api: 1,
				api_key: ''
			}
		};
	},
	methods: {
		//tab 钩子
		tabChange(tab, event) {
			console.log(tab, event);
		},
		//表单保存按钮
		onSubmit() {}
	}
};
</script>

<style></style>
