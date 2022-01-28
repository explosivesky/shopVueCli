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
											<el-avatar size="small" :src="circleUrl"></el-avatar>
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
				<el-aside width="200px" class="d-flex flex-column justify-content-start bg-white" style="padding-bottom: 60px;">
					<el-menu :default-active="sliderActive" class="el-menu-vertical-demo" @select="sliderChanged" active-text-color="#006f82">
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
export default {
	data() {
		return {
			circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
			//layout 中的基本数据
			navBarItemList: {},
			//面包屑的数据
			breadList: []
		};
	},
	methods: {
		//navBar改变时
		navBarSelect(key) {
			this.navBarItemList.activeIndex = key;
			if (!this.navBarItemList.list[key].itemList) return;
			//根据navbar 当前的 activeIndex 获取数据的 router_name
			console.log(key);
			console.log(this.sliderActive);
			//访问 sliderActive 计算属性触发 get 获取当前触发的 slider 中的 subActiveIndex
			let name = this.navBarItemList.list[this.sliderActive].itemList[key].router_name;
			console.log(name);
			this.$router.push({ name }).catch(e => e);
		},
		//sliderBar 改变时
		sliderChanged(key) {
			//只要一调用 计算属性 内部的所有相关数据 都会更新
			this.sliderActive = key;
			//根据 key 获取对应的 router_name 属性用来跳转对应路由
			let name = this.navBarItemList.list[this.navBarItemList.activeIndex].itemList[key].router_name;
			this.$router.push({ name }).catch(e => e);
		},
		//根据路由动态配置面包屑导航
		dynamicBread() {
			//获取当前匹配的路由对象
			let matched = this.$route.matched;
			let arr = [];
			matched.forEach(v => {
				if (v.name == 'layout' || v.name == 'index') {
					return true;
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
		}
	},
	computed: {
		sliderActive: {
			get() {
				//访问时获取navBar 对应的 数组列表数据的 subActiveIndex
				return this.navBarItemList.list[this.navBarItemList.activeIndex].subActiveIndex || '0';
			},
			set(val) {
				//设置的时候修改 subActiveIndex
				this.navBarItemList.list[this.navBarItemList.activeIndex].subActiveIndex = val;
			}
		},
		sliderRender() {
			return this.navBarItemList.list[this.navBarItemList.activeIndex].itemList || [];
		}
	},
	mixins: [filter],
	created() {
		this.navBarItemList = this.$conf.navBarItemList;
		this.dynamicBread();
		this.__directive();
		console.log(this.$router);
	},
	watch: {
		$route(to, from) {
			// console.log(to,from);
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
