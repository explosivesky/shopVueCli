<!--
 * @Author: your name
 * @Date: 2022-01-18 11:04:53
 * @LastEditTime: 2022-01-19 19:06:25
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \shopProduct\shopvuecli\src\components\index.vue
-->
<template>
	<div style="padding-bottom: 100px;">
		<el-row :gutter="20" style="margin-bottom: 60px;">
			<el-col :span="6" v-for="(item, index) in status" :key="index">
				<div class="grid-content bg-purple-dark bg-white">
					<el-card class="box-card" shadow="hover">
						<div class="flex align-center">
							<div class="bg-primary flex justify-center align-center mr-2" style="height:40px; width:40px;"><div class="text-white" :class="item.icon"></div></div>
							<div class="flex flex-column justify-between">
								<h5 class="mb-2">{{ item.num }}</h5>
								<small class="text-muted">{{ item.desc }}</small>
							</div>
						</div>
					</el-card>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="20" class="">
			<!-- 商品信息 -->
			<el-col :span="12" style="height: 370px;" class="flex flex-column justify-between">
				<el-card class="box-card" shadow="naver">
					<div slot="header" class="clearfix">
						<span>{{ goods.title }}</span>
						<el-button style="float: right; padding: 3px 0" type="text" class="text-muted">{{ goods.btn }}</el-button>
					</div>
					<div class="flex justify-between">
						<button class="btn btn-light w-100 flex flex-column align-center mx-1" v-for="(g, g_i) in goods.cards" :key="g_i">
							<h4>{{ g.num }}</h4>
							<small class="text-muted">{{ g.onSell }}</small>
						</button>
					</div>
				</el-card>
				<!-- 交易状态 -->
				<el-card class="box-card" shadow="naver">
					<div slot="header" class="clearfix">
						<span>{{ tips.title }}</span>
						<el-button style="float: right; padding: 3px 0" type="text" class="text-muted">{{ tips.btn }}</el-button>
					</div>
					<div class=" flex justify-between">
						<button class="btn btn-light flex flex-column align-center" v-for="(t, t_i) in tips.cards" :key="t_i">
							<h4>{{ t.num }}</h4>
							<small class="text-muted">{{ t.onSell }}</small>
						</button>
					</div>
				</el-card>
			</el-col>
			<!-- echarts -->
			<el-col :span="12">
				<el-card class="box-card" style="height: 370px;" shadow="never">
					<div slot="header" class="clearfix">
						<span>卡片名称</span>
						<el-button style="float: right; padding: 3px 0" type="text" class="text-muted">操作按钮</el-button>
					</div>
					<div class="" ref="echarts" style="height: 270px; width: 100%;"></div>
				</el-card>
			</el-col>
		</el-row>
		<!-- 销售和排名 -->
		<el-row :gutter="20" class="pt-4">
			<el-col :span="12">
				<el-card class="box-card" shadow="never">
					<div slot="header" class="clearfix">
						<span>销售情况统计</span>
						<el-button style="float: right; padding: 3px 0" type="text" class="text-muted">按周期统计店铺的订单量和订单金额</el-button>
					</div>
					<!-- 媒体对象 -->
					<div class="media border mb-4">
						<div class="flex justify-center align-center text-muted bg-light" style="height: 100px; width: 100px;">昨日销量</div>
						<div class="media-body">
					 	<!-- 列表组 -->
					  <ul class="list-group list-group-flush">
								<li class="list-group-item">订单量(件) 12</li>
								<li class="list-group-item">订单金额(元) 42</li>
							</ul>
				  </div>
					</div>
					<!-- 媒体对象 -->
					<div class="media border">
						<div class="flex justify-center align-center text-muted bg-light" style="height: 100px; width: 100px;">本月销量</div>
						<div class="media-body">
							<!-- 列表组 -->
							<ul class="list-group list-group-flush">
								<li class="list-group-item">订单量(件) 12</li>
								<li class="list-group-item">订单金额(元) 42</li>
							</ul>
				 	</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card class="box-card text-center" shadow="never">
					<div slot="header" class="clearfix">
						<span>单品销售排名</span>
						<el-button style="float: right; padding: 3px 0" type="text" class="text-muted">按周期统计店铺的订单量和订单金额</el-button>
					</div>
							  <el-table
							    :data="orderList"
							    height="227px"
							    border
							    style="width: 100%">
							    <el-table-column
							      label="#"
							      width="80"
								  type="index"
								  :show-overflow-tooltip="true"
								  align="center">
							    </el-table-column>
							    <el-table-column
							      prop="decs"
							      label="商品信息"
							      width="390"
								  :show-overflow-tooltip="true"
								  align="center">
							    </el-table-column>
							    <el-table-column
							      prop="sellNum"
							      label="销量"
								  type="index"
								  :show-overflow-tooltip="true"
								  width="290"
								  align="center">
							    </el-table-column>
							  </el-table>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
export default {
	data() {
		return {
			status: [
				{
					icon: 'el-icon-user',
					num: 30,
					desc: '关注人数 (个)'
				},
				{
					icon: 'el-icon-user',
					num: 30,
					desc: '关注人数 (个)'
				},
				{
					icon: 'el-icon-user',
					num: 30,
					desc: '关注人数 (个)'
				},
				{
					icon: 'el-icon-user',
					num: 30,
					desc: '关注人数 (个)'
				}
			],
			goods: {
				title: '店铺及商品提示',
				btn: '需要关注的店铺信息及待处理事项',
				cards: [
					{
						num: 64,
						onSell: '出售中'
					},
					{
						num: 64,
						onSell: '出售中'
					},
					{
						num: 64,
						onSell: '出售中'
					},
					{
						num: 64,
						onSell: '出售中'
					}
				]
			},
			tips: {
				title: '交易提示',
				btn: '需要立即处理的交易订单',
				cards: [
					{
						num: 64,
						onSell: '待付款'
					},
					{
						num: 64,
						onSell: '已收货'
					},
					{
						num: 0,
						onSell: '待付款'
					},
					{
						num: 64,
						onSell: '待付款'
					},
					{
						num: 64,
						onSell: '待付款'
					},
					{
						num: 64,
						onSell: '待付款'
					}
				]
			},
			orderList:[{
				decs:'小天鹅啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊撒大苏打实打实啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
				sellNum:9
			},
			{
				decs:'小天鹅',
				sellNum:9
			},
			{
				decs:'小天鹅',
				sellNum:9
			},
			{
				order:1,
				decs:'小天鹅',
				sellNum:9
			},
			{
				decs:'小天鹅',
				sellNum:9
			},
			{
				decs:'小天鹅',
				sellNum:9
			}],
			option: {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985'
						}
					}
				},
				legend: {
					data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
				},
				toolbox: {
					feature: {
						saveAsImage: {
							show: false
						}
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: 'Email',
						type: 'line',
						stack: 'Total',
						areaStyle: {},
						emphasis: {
							focus: 'series'
						},
						data: [120, 132, 101, 134, 90, 230, 210]
					},
					{
						name: 'Union Ads',
						type: 'line',
						stack: 'Total',
						areaStyle: {},
						emphasis: {
							focus: 'series'
						},
						data: [220, 182, 191, 234, 290, 330, 310]
					},
					{
						name: 'Video Ads',
						type: 'line',
						stack: 'Total',
						areaStyle: {},
						emphasis: {
							focus: 'series'
						},
						data: [150, 232, 201, 154, 190, 330, 410]
					},
					{
						name: 'Direct',
						type: 'line',
						stack: 'Total',
						areaStyle: {},
						emphasis: {
							focus: 'series'
						},
						data: [320, 332, 301, 334, 390, 330, 320]
					},
					{
						name: 'Search Engine',
						type: 'line',
						stack: 'Total',
						label: {
							show: true,
							position: 'top'
						},
						areaStyle: {},
						emphasis: {
							focus: 'series'
						},
						data: [820, 932, 901, 934, 1290, 1330, 1320]
					}
				]
			}
		};
	},
	methods: {
		__initEcharts() {
			var myChart = this.$echarts.init(this.$refs.echarts);
			myChart.setOption(this.option);
		}
	},
	mounted() {
		this.__initEcharts();
	},
	created() {}
};
</script>

<style>
</style>
