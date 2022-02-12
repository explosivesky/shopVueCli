<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<el-tabs v-model="activeName">
		    <el-tab-pane label="支付设置">
				<el-table border class="mt-3"
				  :data="tableData"
				  style="width: 100%">
				  <el-table-column
					align="left"
					label="支付方式">
					<template slot-scope="scope">
						<div class="d-flex align-items-center">
							<img :src="scope.row.src" style="width: 40px;height: 40px;" class="rounded mr-2"/>
							<div class="d-flex flex-column"
							style="align-items: flex-start;">
								<h6>{{scope.row.name}}</h6>
								<small class="d-block text-secondary">{{scope.row.desc}}</small>
							</div>
						</div>
					</template>
				  </el-table-column>
				  <el-table-column
					align="center"
					label="操作"
					width="150">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click="openDrawer(scope.row.key)">配置</el-button>
					</template>
				  </el-table-column>
				</el-table>
			</el-tab-pane>
		    <el-tab-pane label="购物设置">
				<el-form ref="form" :model="form" label-width="160px">
					<el-form-item label="未支付订单">
						<el-input v-model="form.close_order_minute" type="number" size="mini" style="width: 25%;" placeholder="未支付订单">
							<template slot="append">天后自动关闭</template>
						</el-input>
						<small class="text-secondary d-block">订单下单未付款，n天后自动关闭，设置0天不自动关闭</small>
					</el-form-item>
					<el-form-item label="已发货订单">
						<el-input v-model="form.auto_received_day" type="number" size="mini" style="width: 25%;" placeholder="已发货订单">
							<template slot="append">天后自动确认收货</template>
						</el-input>
						<small class="text-secondary d-block">如果在期间未确认收货，系统自动完成收货，设置0天不自动收货</small>
					</el-form-item>
					<el-form-item label="已完成订单">
						<el-input v-model="form.after_sale_day" type="number" size="mini" style="width: 25%;" placeholder="已完成订单">
							<template slot="append">天内允许申请售后</template>
						</el-input>
						<small class="text-secondary d-block">订单完成后 ，用户在n天内可以发起售后申请，设置0天不允许申请售后</small>
					</el-form-item>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="mini" @click="submit">保存</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
			<!-- 抽屉 -->
			<el-drawer
			  title="配置"
			  :visible.sync="drawer"
			  :direction="direction"
			  :modal="false"
			  wrapperClosable
			  size='40%'
			  :before-close="handleClose">
			  <div class="position-absolute " style="bottom: 0; left: 0; top: 0; right: 0;">
				  <div class="position-absolute border-top border-bottom" style="top: 60px; left: 0; right: 0; bottom: 60px; overflow-y: auto;">
					  <el-form v-if="drawerType === 'alipay'" v-model="form.alipay" ref="form" label-width="80px">
						<el-form-item label="app_id" prop="app_id">
							<el-input v-model="form.alipay.app_id" placeholder="app_id" size="mini" style="width: 90%;"></el-input>
						</el-form-item>
						<el-form-item label="公钥" prop="ali_public_key">
							<el-input type="textarea" rows="4" v-model="form.alipay.ali_public_key" placeholder="公钥" size="mini" style="width: 90%;"></el-input>
						</el-form-item>
						<el-form-item label="私钥">
							<el-input type="textarea" rows="4" v-model="form.alipay.private_key" placeholder="私钥" size="mini" style="width: 90%;"></el-input>
						</el-form-item>
					</el-form>
										
					<el-form ref="form" :model="form.wxpay" label-width="120px" v-if="drawerType==='wxpay'">
						<el-form-item label="公众号 APPID">
							<el-input v-model="form.wxpay.app_id" size="mini" style="width: 50%;" placeholder="公众号 APPID"></el-input>
						</el-form-item>
						<el-form-item label="小程序 APPID">
							<el-input v-model="form.wxpay.miniapp_id" size="mini" style="width: 50%;" placeholder="小程序 APPID"></el-input>
						</el-form-item>
						<el-form-item label="小程序 secret">
							<el-input v-model="form.wxpay.secret" size="mini" style="width: 50%;" placeholder="小程序 secret"></el-input>
						</el-form-item>
						<el-form-item label="appid">
							<el-input v-model="form.wxpay.appid" size="mini" style="width: 50%;" placeholder="appid"></el-input>
						</el-form-item>
						<el-form-item label="商户号">
							<el-input v-model="form.wxpay.mch_id" size="mini" style="width: 50%;" placeholder="商户号"></el-input>
						</el-form-item>
						<el-form-item label="API 密钥">
							<el-input v-model="form.wxpay.key" size="mini" placeholder="API 密钥"></el-input>
						</el-form-item>
						<el-form-item label="cert_client">
							<el-upload
							  class="upload-demo"
							  action="/admin/sysconfig/upload"
							  :headers="{token:$store.state.user.token}"
							  :limit="1"
							  :on-success="certClientOnSuccess"
							  accept=".pem">
							  <el-button size="small" type="primary">点击上传</el-button>
							  <div slot="tip" class="el-upload__tip">
								  <div class="text-danger">{{form.wxpay.cert_client ? form.wxpay.cert_client : '还未配置'}}</div>
								  <div class="text-muted small">apiclient_key.pem</div>
							  </div>
							</el-upload>
						</el-form-item>
						<el-form-item label="cert_key">
							<el-upload
							  class="upload-demo"
							  action="/admin/sysconfig/upload"
							  :headers="{token:$store.state.user.token}"
							  :limit="1"
							  :on-success="certKeyOnSuccess"
							  accept=".pem">
							  <el-button size="small" type="primary">点击上传</el-button>
							  <div slot="tip" class="el-upload__tip">
								  <div class="text-danger">{{form.wxpay.cert_key ? form.wxpay.cert_key : '还未配置'}}</div>
								  <div class="text-muted small">apiclient_key.pem</div>
							  </div>
							</el-upload>
						</el-form-item>
					</el-form>
				  </div>
				<div class="position-absolute flex align-center px-3" style="bottom: 0; left: 0;  right: 0; height: 60px; z-index: 66;">
					<el-button  @click="drawer=false">取消</el-button>
					<el-button plain type="success" @click="submit">确定</el-button>
				</div>
			  </div>
			</el-drawer>
	</div>
</template>

<script>
	export default {
		inject:["layout"],
		data() {
			return {
				activeName:0,
				tableData: [{
					name:"支付宝支付",
					desc:"该系统支持即时到账接口",
					src:"http://wxcs.niuteam.cn/addons/NsAlipay/ico.png",
					key:'alipay'
				},{
					name:"微信支付",
					desc:"该系统支持微信网页支付和扫码支付",
					src:"http://wxcs.niuteam.cn/addons/NsWeixinpay/ico.png",
					key:'wxpay'
				}],
				form: {
					close_order_minute: 0,
					auto_received_day: 0,
					after_sale_day: 0,
					alipay: {
						app_id: "",
						ali_public_key: "",
						private_key: ""
					},
					wxpay: {
						app_id: '', // 公众号 APPID 
						miniapp_id: '', // 小程序 APPID 
						secret: "", // 小程序secret 
						appid: '', // appid 
						mch_id: '', // 商户号 
						key: '', // API 密钥 
						cert_client: '',
						cert_key: '',
					}
				},
				drawer: false,//抽屉
				direction: 'rtl',//抽屉方向
				drawerType:''
			}
		},
		created(){
			this.init()
		},
		methods:{
			init(){
				this.layout.isLoading(true)
				new this.request(this.url.m().sysconfig.init).modeget().then(res=>{
					this.form = res.data.data
					this.layout.isLoading(false)
				}).catch(e=>{
					this.layout.isLoading(false)
				})
			},
			//保存
			submit(){
				this.drawer=false
				this.layout.isLoading(true)
				new this.request(this.url.m().sysconfig.init,this.form).modepost().then(res=>{
					this.init()
					this.layout.isLoading(false)
					this.$message.success('保存成功')
				}).catch(e=>{
					this.layout.isLoading(false)
				})
			},
			certClientOnSuccess(response, file, fileList){
				this.form.wxpay.cert_client=response.data
			},
			certKeyOnSuccess(response, file, fileList){
				this.form.wxpay.cert_key=response.data
			},
			//打开抽屉
			openDrawer(key){
				this.drawer=true
				this.drawerType=key
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
		}
	}
</script>

<style>
</style>
