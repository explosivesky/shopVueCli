<template>
	<div class="bg-white px-2 position-absolute" style="top: 55px; right: 0; bottom: 0; left: 0;">
		<el-tabs v-model="tabActive">
			<!-- 注册与访问 -->
			<el-tab-pane label="注册与访问">
				<el-form ref="form" :model="form" label-width="150px">
					<el-form-item label="是否允许注册会员">
						<el-radio-group v-model="form.open_reg" size="middle">
							<el-radio-button :label="0">关闭</el-radio-button>
							<el-radio-button :label="1">开启</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="注册类型">
						<el-radio-group v-model="form.reg_method" size="middle">
							<el-radio-button label="username">普通注册</el-radio-button>
							<el-radio-button label="phone">手机注册</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="密码最小长度">
						<el-input v-model="form.password_min" type="number" class="w-25" size="middle" placeholder="密码最小长度"></el-input>
					</el-form-item>
					<el-form-item label="强制密码复杂度">
						<el-checkbox-group v-model="form.password_encrypt" size="middle">
							<el-checkbox-button label="0">数字</el-checkbox-button>
							<el-checkbox-button label="1">小写字母</el-checkbox-button>
							<el-checkbox-button label="2">大写字母</el-checkbox-button>
							<el-checkbox-button label="3">符号</el-checkbox-button>
						</el-checkbox-group>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<!-- 上传设置 -->
			<el-tab-pane label="默认上传方式">
				<el-form ref="form" :model="form" label-width="150px">
					<el-form-item label="是否允许注册会员">
						<el-radio-group v-model="form.upload_method" size="middle">
							<el-radio-button label="local">本地存储</el-radio-button>
							<el-radio-button label="oss">对象存储</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<template v-if="form.upload_method==='oss'">
						<el-form-item label="注册类型"><el-input v-model="form.upload_config.Bucket" type="text" class="w-25" size="middle" placeholder="Bucket"></el-input></el-form-item>
						<el-form-item label="密码最小长度">
							<el-input v-model="form.upload_config.ACCESS_KEY" type="number" class="w-25" size="middle" placeholder="ACCESS_KEY"></el-input>
						</el-form-item>
						<el-form-item label="强制密码复杂度">
							<el-input v-model="form.upload_config.SECRET_KEY" type="number" class="w-25" size="middle" placeholder="SECRET_KEY"></el-input>
						</el-form-item>
						<el-form-item label="空间域名">
							<el-input v-model="form.upload_config.http" type="number" class="w-25" size="middle" placeholder="http"></el-input>
							<small class="text-secondary d-block">请补全http:// 或 https://</small>
						</el-form-item>
					</template>
				</el-form>
			</el-tab-pane>
			<!-- 角色管理 -->
			<el-tab-pane label="Api安全">
				<el-form ref="form" :model="form" label-width="150px">
					<el-form-item label="是否开启API安全">
						<el-radio-group v-model="form.api_safe" size="mini">
							<el-radio-button :label="1">关闭</el-radio-button>
							<el-radio-button :label="0">开启</el-radio-button>
						</el-radio-group>
						<small class="text-secondary d-block">api安全功能开启之后调用前端api需要传输签名串</small>
					</el-form-item>
					<el-form-item label="秘钥">
						<el-input v-model="form.api_secret" size="mini" style="width: 50%;" placeholder="秘钥"></el-input>
						<small class="text-secondary d-block">
							秘钥设置关系系统中api调用传输签名串的编码规则，以及会员token解析，请慎重设置，注意设置之后对应会员要求重新登录获取token
						</small>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
		<el-form label-width="150px">
			<el-form-item><el-button type="primary" plain size="mini" @click="onSubmit">保存</el-button></el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	inject:["layout"],
	data() {
		return {
			tabActive: 0,
			form: {
				open_reg: 1,
				reg_method: 'username',
				password_min: '',
				password_encrypt: ['0'],
				upload_method: 'local',
				upload_config: {
					Bucket: '',
					ACCESS_KEY: '',
					SECRET_KEY: '',
					http: ''
				},
				api_safe: 1,
				api_secret: ''
			}
		};
	},
	created(){
		this.init()
	},
	methods: {
		init(){
			this.layout.isLoading(true)
			new this.request(this.url.m().sysconfig.init).modeget().then(res=>{
				this.form=res.data.data
				this.form.password_encrypt =this.form.password_encrypt.split(',').filter(v=>v!=='')
				this.layout.isLoading(false)
			}).catch(e=>{
				this.layout.isLoading(false)
			})
		},
		//表单保存按钮
		onSubmit() {
			this.layout.isLoading(true)
			this.form.password_encrypt =this.form.password_encrypt.join(',')
			new this.request(this.url.m().sysconfig.init,this.form).modepost().then(res=>{
				this.init()
				this.layout.isLoading(false)
				this.$message.success('保存成功')
			}).catch(e=>{
				this.layout.isLoading(false)
			})
		}
	}
};
</script>

<style></style>
