<template>
	<div>
		<el-container class="wrap">
			<!-- 头部导航栏 -->
			<el-header>
				<el-row>
					<el-col :span="24">
						<div class="grid-content bg-purple-dark d-flex">
							<div class="d-flex justify-content-center align-items-center mb-0" style="margin-right: auto;">
								<h3 class="mb-0" style="margin-left: 20px;">{{ $conf.logo }}</h3>
							</div>
							<div class="d-flex">
								<el-menu
									style="box-sizing: border-box;"
									:default-active="navBarItemList.activeIndex"
									class="el-menu-demo"
									mode="horizontal"
									@select="navBarSelect"
									background-color="#545c64"
									text-color="#fff"
									active-text-color="#ffd04b"
								>
									<el-menu-item :index="index | indexToStr" v-for="(item, index) in navBarItemList.list" :key="index">{{ item.title }}</el-menu-item>
									<el-submenu index="100" class="p-0">
										<template slot="title" class="flex justify-center align-center">
											<el-avatar size="small" :src="user.avatar||circleUrl"></el-avatar>
											explosive
										</template>
										<el-menu-item index="100-1">设置</el-menu-item>
										<el-menu-item index="100-2">退出</el-menu-item>
									</el-submenu>
								</el-menu>
							</div>
						</div>
					</el-col>
				</el-row>
			</el-header>
			<el-container style="height:100%;">
				<!-- 侧边栏 -->
				<el-aside width="200px" class="d-flex flex-column justify-content-start bg-white border-right" style="padding-bottom: 60px;">
					<el-menu :default-active="sliderActive" @select="sliderChanged" active-text-color="#006f82" style="border-right: none;" >
						<el-menu-item :index="index | indexToStr" class="menu-item" v-for="(item, index) in sliderRender" :key="index">
							<i :class="item.icon"></i>
							<span slot="title">{{ item.name }}</span>
						</el-menu-item>
					</el-menu>
				</el-aside>
				<!-- 内容区域 -->
				<el-main class="bg-light" style="position: relative;">
					<!-- 面包屑 -->
					<div class="border-bottom bg-white" style="padding:20px; margin:-20px; border-color:#d3dce6; margin-top: -20px;" v-if="breadList.length > 0">
						<el-breadcrumb separator-class="el-icon-arrow-right">
							<el-breadcrumb-item :to="{ path: item.path }" v-for="(item, index) in breadList" :key="index">{{ item.title }}</el-breadcrumb-item>
						</el-breadcrumb>
					</div>
					<div><router-view></router-view></div>
					<!-- 回到顶部 -->
					<el-backtop target=".el-main" :visibility-height="10"></el-backtop>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import filter from '@/common/mixins';
import {mapState} from 'vuex'
export default {
	data() {
		return {
			circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
			//面包屑的数据
			breadList: [],
		};
	},
	methods: {
		//navBar改变时
		navBarSelect(key) {
			//设置
			if(key=='100-1'){
				console.log('设置')
				return
			}
			//退出
			if(key=='100-2'){
				return this.out()
			}
			// key topBar 的索引， this.sliderActive silder 的索引
			let name
			this.navBarItemList.activeIndex = key;
			if (!this.navBarItemList.list[key].itemList) return;
			//如果 isCreate 为创建商品路由，则直接跳到创建商品页面
			let isCreate = localStorage.getItem('isCreate')
			if(isCreate!='false'&&key==1){
				name = isCreate
			}else{
				//根据navbar 当前的 activeIndex 获取数据的 router_name
				//访问 sliderActive 计算属性触发 get 获取当前触发的 slider 中的 subActiveIndex
				let item = this.navBarItemList.list[key].itemList
				if(item.length===0)return
				name=item[this.sliderActive].router_name;
			}
		this.$router.push({ name }).catch(e => e);
		},
		//sliderBar 改变时
		sliderChanged(key) {
			let name
			let isCreate = localStorage.getItem('isCreate')
			//只要一调用 计算属性 内部的所有相关数据 都会更新
			this.sliderActive = key;
			//只有在点击商品列表赋值
			if(isCreate!='false'&&key==0&&this.navBarItemList.activeIndex == 1){
				name=isCreate
			}else{
			   name = this.navBarItemList.list[this.navBarItemList.activeIndex].itemList[key].router_name;
			}
			//根据 key 获取对应的 router_name 属性用来跳转对应路由
			this.$router.push({ name }).catch(e => e);
		},
		//根据路由动态配置面包屑导航
		dynamicBread() {
			//获取当前匹配的路由对象
			let matched = this.$route.matched;
			let arr = [];
			matched.forEach(v => {
				if (v.name == 'layout' || v.name == 'index') {
					return true;//跳出这次循环进入下个循环
				}
				arr.push({ name: v.name, path: v.path, title: v.meta.title });
				if (arr.length > 0) {
					arr.unshift({ name: 'index', path: '/index', title: '后台首页' });
				}
			});
			this.breadList = arr;
		},
		//刷新时触发上次的路由地址
		__directive() {
			let localRoute = localStorage.getItem('activeRoute');
			if (!localRoute) return;
			localRoute = JSON.parse(localRoute);
			this.sliderActive = localRoute.left;
			this.navBarItemList.activeIndex = localRoute.top;
		},
		//用户退出
		async out(){
			try{
				let res= await new this.request(this.url.m().logout).modepost()
			}catch(e){
				return
			}
			this.$store.commit('out')
			this.$message.success('退出成功')
			this.$router.push({name:'login'})
		}
	},
	computed: {
		...mapState({
			user:state=>state.user.user,
			//layout 中的基本数据
			navBarItemList:state=>state.menu.navbar
		}),
		sliderActive: {
			get() {
				console.log(this.navBarItemList)
				console.log(this.navBarItemList.list[this.navBarItemList.activeIndex])
				//访问时获取navBar 对应的 数组列表数据的 subActiveIndex
				return this.navBarItemList.list.length ===0 ?  '0' : this.navBarItemList.list[this.navBarItemList.activeIndex].subActiveIndex;
			},
			set(val) {
				let item = this.navBarItemList.list[this.navBarItemList.activeIndex]
				if(item){
					//设置的时候修改slider 的 subActiveIndex
					item.subActiveIndex = val;
				}
			}
		},
		//侧边栏数据
		sliderRender() {
			if(this.navBarItemList.list.length !==0){
				return this.navBarItemList.list[this.navBarItemList.activeIndex].itemList || [];
			}
		}
	},
	mixins: [filter],
	created() {
		// this.navBarItemList = this.$conf.navBarItemList;
		this.dynamicBread();
		this.__directive();
	},
	watch: {
		$route(to, from) {
			//控制是否进入 create 页面
			if(from.name=='shop_goods_create'){
				localStorage.setItem('isCreate','shop_goods_create')
			}
			if(to.name=='shop_goods_list'){
				localStorage.setItem('isCreate',false)
			}
			//更新面包屑
			this.dynamicBread();
			localStorage.setItem('activeRoute', JSON.stringify({ top: this.navBarItemList.activeIndex, left: this.sliderActive }));
		}
	}
};
</script>

<style scoped="scoped" lang="less">
.avatar-box {
	height: 35px;
	width: 35px;
	border-radius: 50%;
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
}
.wrap {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	overflow: hidden;
}
.bg-purple-dark {
	background: #515b64;
}
.grid-content {
	height: 60px;
}
.el-header {
	background: #515b64;
}
</style>
