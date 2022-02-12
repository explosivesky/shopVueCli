<!--
 * @Author: your name
 * @Date: 2022-01-18 12:58:06
 * @LastEditTime: 2022-02-10 11:48:07
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \shopProduct\shopvuecli\src\views\shop\goods\list.vue
-->
<template>
	<!-- <div class="position-absolute bg-white" style="top: 55px;"> -->
	<div class="bg-white px-4 position-absolute" style="top: 55px; right: 0; bottom: 0; left: 0;">
		<!-- tabs标签页 -->
		<el-tabs v-model="tabIndex" @tab-click="handleClick"><el-tab-pane :label="t.name" v-for="(t, t_i) in tabTitleList" :key="t_i"></el-tab-pane></el-tabs>
		<search-box placeholder="要搜索的商品名称" @search="search">
			<!-- 左边 -->
			<template #left>
				<div style="width: 740px;">
					<el-button type="success" class="mr-2" size="mini" @click="exportModel = true">导出数据</el-button>
					<el-button type="danger" class="mr-2" size="mini" @click="deleteSku('all')">批量删除</el-button>
				</div>
			</template>
			<!-- 右边 -->
			<template #default></template>
			<template #form>
				<!-- form表单 -->
				<el-form :inline="true" :model="form" class="demo-form-inline px-4 flex flex-wrap" size="mini">
					<el-form-item label="订单编号"><el-input v-model="form.no" placeholder="订单编号"></el-input></el-form-item>
					<el-form-item label="下单时间">
						<el-date-picker
							v-model="form.time"
							type="daterange"
							style="width: 380px;"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							size="mini"
							value-format="yyyy-MM-dd"
						></el-date-picker>
					</el-form-item>
					<el-form-item label="收货人"><el-input v-model="form.name" placeholder="收货人"></el-input></el-form-item>
					<el-form-item label="手机号" class="flex">
						<div class="flex">
							<el-input v-model="form.phone" placeholder="手机号"></el-input>
							<!-- 按钮组 -->
							<el-button-group class="flex ml-2">
								<el-button type="info" class="mr-2" size="mini" @click="search">高级搜索</el-button>
								<el-button size="mini" @click="clearForm">清空筛选条件</el-button>
							</el-button-group>
						</div>
					</el-form-item>
				</el-form>
			</template>
		</search-box>
		<!-- tabel 表格 -->
		<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" height="700" border style="width: 100%" class="mt-4 pb-1" @selection-change="handleSelectionChange">
			<el-table-column align="center" type="selection" width="55"></el-table-column>
			<el-table-column label="商品信息" width="325">
				<template slot-scope="scope">
					<div class="flex">
						<div class="flex-1">
							<p class="mb-1">订单编号:</p>
							<strong>{{ scope.row.no }}</strong>
						</div>
						<div class="flex-1">
							<p class="mb-1">下单时间:</p>
							<strong>{{ scope.row.update_time }}</strong>
						</div>
					</div>
					<div class="media" v-for="(item, index) in scope.row.order_items">
						<img :src="item.goods_item ? item.goods_item.cover : ''" class="mr-3 mt-2" style="width: 70px; height: 80px; " />
						<div class="media-body">
							<p class="mb-1 text-primary">{{ item.goods_item ? item.goods_item.title : '商品已被删除' }}</p>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="实付款" align="center" prop="type" width="120px">
				<template slot-scope="scope">
					<p class="mb-1">￥ {{ scope.row.total_price }}</p>
					<small>(含运费: ￥0.00)</small>
				</template>
			</el-table-column>
			<el-table-column prop="order" align="center" label="买家" width="120px">
				<template slot-scope="scope">
					<p class="mb-1">{{ scope.row.user.username }}</p>
					<small>(用户id: {{ scope.row.user.id }})</small>
				</template>
			</el-table-column>
			<el-table-column label="商品状态" width="140" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<p class="badge badge-success" v-if="scope.row.payment_method == 'alipay'">支付宝支付</p>
					<p class="badge badge-primary" v-else-if="scope.row.payment_method == 'wechat'">微信支付</p>
					<p class="badge badge-light" v-else>待支付</p>
				</template>
			</el-table-column>
			<el-table-column prop="stock" label="配送方式" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<div v-if="scope.row.ship_data">
						<div>{{ scope.row.ship_data.express_company }}</div>
						<div>{{ scope.row.ship_data.express_no }}</div>
					</div>
					<span v-else>未配送</span>
				</template>
			</el-table-column>
			<el-table-column prop="pprice" align="center" label="交易状态" show-overflow-tooltip>
				<template slot-scope="scope">
					<div class="">
						付款状态:
						<span class="badge" :class="scope.row.payment ? 'badge-success' : 'badge-secondary'">{{ scope.row.payment ? '已付款' : '未付款' }}</span>
					</div>
					<div class="">
						发货状态:
						<span class="badge" :class="scope.row.ship_data ? 'badge-success' : 'badge-secondary'">{{ scope.row.ship_data ? '以发货' : '未发货' }}</span>
					</div>
					<div class="">
						收货状态:
						<span class="badge" :class="scope.row.ship_status === 'received' ? 'badge-success' : 'badge-secondary'">
							{{ scope.row.ship_status === 'received' ? '已收货' : '未收货' }}
						</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="ischeck" align="center" width="140" label="操作" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-button-group>
						<el-button type="text" size="mini" class="hover px-2">订单详情</el-button>
						<el-button
							type="text"
							size="mini"
							class="hover px-2"
							@click="open(scope.row)"
							v-if="scope.row.ship_status === 'pending' && scope.row.closed === 0 && scope.row.payment_method && scope.row.refund_status === 'pending'"
						>
							订单发货
						</el-button>
					</el-button-group>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog title="订单发货" :visible.sync="createModel" :modal="false">
			<el-form ref="form" :model="shipForm" label-width="80px">
				<el-form-item label="快递公司">
					<el-select v-model="shipForm.express_company" placeholder="请选择活动区域">
						<el-option :label="item.name" :value="item.id" v-for="(item, index) in express_company_list" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="快递单号"><el-input v-model="shipForm.express_no" placeholder="请输入快递单号" style="width: 350px;"></el-input></el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="createModel = false">取 消</el-button>
				<el-button type="primary" @click="onSubmit">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 导出订单 dialog -->
		<el-dialog title="导出订单" :modal="false" :visible.sync="exportModel">
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="订单类型">
					<el-select v-model="exportForm.tab" placeholder="请选择订单类型">
						<el-option :label="item.name" :value="item.key" v-for="(item, index) in tabTitleList" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="时间范围">
					<el-date-picker
						v-model="exportForm.time"
						type="daterange"
						style="width: 380px;"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						size="mini"
						value-format="yyyy-MM-dd"
					></el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="createModel = false">取 消</el-button>
				<el-button type="primary" @click="exportOrder">确 定</el-button>
			</div>
		</el-dialog>
		<div class="position-fixed bg-white flex" style="bottom: 0; left: 200px; right: 0; height: 60px; z-index: 9;">
			<div class="pl-2 flex align-center">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="page.currentPage"
					:page-sizes="page.pageSizes"
					:page-size="page.pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="page.total"
				></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import searchBox from '@/components/searchBox/searchBox.vue';
import mixin from '@/common/mixins';
export default {
	inject: ['layout'],
	mixins: [mixin],
	data() {
		return {
			tabIndex: 0,
			form: {
				no: '',
				time: '',
				name: '',
				phone: ''
			},
			shipForm: {
				express_company: '',
				express_no: ''
			},
			shipId: 0,
			express_company_list: [],
			tabTitleList: [
				{
					name: '全部',
					key: 'all'
				},
				{
					name: '待支付',
					key: 'nopay'
				},
				{
					name: '待发货',
					key: 'noship'
				},
				{
					name: '待收货',
					key: 'shiped'
				},
				{
					name: '已收货',
					key: 'received'
				},
				{
					name: '已完成',
					key: 'finish'
				},
				{
					name: '已关闭',
					key: 'closed'
				},
				{
					name: '退款中',
					key: 'refunding'
				}
			],
			tableData: [],
			dynamicUrl: 'order',
			createModel: false,
			exportForm: {
				time: [],
				tab: '',
				starttime: '',
				endtime: ''
			},
			exportModel: false
		};
	},
	created() {
		//获取快递公司信息
		new this.request(this.url.m(this.page.currentPage, `?limit=${this.page.pageSize}`).express_company).modeget().then(res => {
			this.express_company_list = res.data.data.list;
		});
	},
	components: {
		searchBox
	},
	computed: {
		//动态生成 高级搜索 url 参数
		//&no=[:no]&starttime=[:starttime]&endtime=[:endtime]&name=[:name]&phone=[:phone]
		formatSuperSearch() {
			let str = '';
			for (let key in this.form) {
				let val = this.form[key];
				if (val) {
					if (Array.isArray(val)) {
						str += `&starttime=${val[0]}`;
						str += `&endtime=${val[1]}`;
					} else {
						str += `&${key}=${this.form[key]}`;
					}
				}
			}
			return str;
		},
		getTabKey() {
			return this.url.m(this.page.currentPage, `?limit=${this.page.pageSize}&tab=${this.tabTitleList[this.tabIndex].key}&no=${this.form.no}${this.formatSuperSearch}`)[
				this.dynamicUrl
			].init;
		}
	},
	methods: {
		//导出订单数据
		exportOrder() {
			if (this.exportForm.tab == '') return this.$message.warning('请选择订单类型');
			let params = '';
			let val = this.exportForm.time;
			if (val && Array.isArray(val)) {
				params += `&starttime=${val[0]}`;
				params += `&endtime=${val[1]}`;
			}
			this.layout.isLoading(true);
			new this.request(this.url.m({}, `?tab=${this.exportForm.tab}${params}`).order.excelexport, { responseType: 'blob' })
				.modepost()
				.then(res => {
					return
					if (res.status == 200) {
						let url = window.URL.createObjectURL(new Blob([res.data]));//创建对象超链接
						let link = document.createElement('a');//生成 a 标签
						link.style.display = 'none';//隐藏
						link.href = url;//设置 href
						let filename = new Date().getTime() + '.xlsx';//生成文件名
						link.setAttribute('download', filename);
						document.body.appendChild(link);//添加到页面中
						link.click();//实现模拟点击效果
						this.layout.isLoading(false);
					}
				})
				.catch(err => {
					this.layout.isLoading(false);
					this.$message({
						type: 'error',
						message: '下载失败'
					});
				});
		},
		//dialog 确定
		onSubmit() {
			this.layout.isLoading(true);
			new this.request(this.url.m(this.shipId).order.ship, this.shipForm)
				.modepost()
				.then(res => {
					this.layout.isLoading(false);
				})
				.catch(e => {
					this.layout.isLoading(false);
				});
			this.createModel = false;
		},
		//打开dialog
		open(row) {
			this.createModel = true;
			this.shipId = row.id;
		},
		getMixinList(data) {
			this.tableData = data.list;
		},
		//mixin
		editUrlVal() {
			//组件中没写这个方法 则不会覆盖
			return this.getTabKey;
		},
		//tab栏切换时触发
		handleClick(tab) {
			this.__init();
		},
		//清空筛选条件
		clearForm() {
			this.form = {
				no: '',
				time: '',
				name: '',
				phone: ''
			};
		},
		//搜索 || 高级搜索
		search(e) {
			//普通搜索
			if (typeof e === 'string') {
				this.form.no = e;
				this.__init();
			}
			//高级搜索
			this.__init();
		}
	}
};
</script>

<style></style>
