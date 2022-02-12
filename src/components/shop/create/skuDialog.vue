<template>
	<el-dialog title="商品规格选择" :visible.sync="dialogVisible" width="70%" top="10vh">
		<!--main -->
		<el-container style="height: 70vh; position: relative; margin: -30px -20px;">
			<!-- 头部 -->
			<el-header class="bg-light border-bottom flex align-center" style="position: absolute; top: 0; left: 200px; right: 0;">
				<el-button type="success" size="mini" @click="cancelChoose(isTotalCheck)">{{ isTotalCheck ? '全部取消' : '全部选中' }}</el-button>
			</el-header>
			<el-container>
				<!-- 侧边栏 -->
				<el-aside class="bg-light" width="200px" style="position: absolute; top: 0; left: 0; bottom: 0; cursor: pointer;">
					<!-- 相册列表组 -->
					<ul class="list-group">
						<li
							class="list-group-item bg-light list-group-item-action"
							v-for="(item, index) in skuList"
							:key="index"
							@click="skuListCheck(index)"
							:class="currentIndex == index ? 'hover' : ''"
						>
							{{ item.name }}
						</li>
					</ul>
				</el-aside>
				<el-container>
					<!-- main -->
					<el-main class="d-flex flex-wrap content-start" style="position: absolute; top: 60px; left: 200px; right: 0; bottom: 0;">
						<div class="p-0" style="height: 50px;" v-for="(item, index) in list" :key="index">
							<span class="px-4 py-2 rounded border mx-3 cursor-pointer" @click="skuItemCheck(item)" :class="item.isCheck ? 'hover' : ''">{{ item.name }}</span>
						</div>
					</el-main>
				</el-container>
			</el-container>
			<el-footer class="flex justify-center align-center" style="position: absolute; left: 0; bottom: 0; width: 200px;">
				<el-pagination
					@current-change="handleCurrentChange"
					:current-page="page.currentPage"
					:page-size="page.pageSize"
					layout="prev, next"
					:total="page.total"
				></el-pagination>
			</el-footer>
		</el-container>
		<span slot="footer" class="dialog-footer flex justify-end align-center" style=" height: 58px;">
			<el-button @click="hide" size="mini">取 消</el-button>
			<el-button type="success" @click="confirm" size="mini">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import pictureInfoList from '@/components/image/pictureInfoList.vue';
import imgList from '@/components/image/imgList.vue';
import mixin from '@/common/mixins';
export default {
	mixins: [mixin],
	data() {
		return {
			callback: false,
			dialogVisible: false,
			currentIndex: 0,
			chooseList: [],
			skuList: [
				// {
				// 	name: '颜色', //规格项
				// 	group: 0,
				// 	type: 'default', // default 无 ： color 颜色 ： img 图片
				// 	list: [
				// 		{
				// 			id: 1,
				// 			name: '红色',
				// 			image: '',
				// 			color: '',
				// 			isShow: false,
				// 			isCheck: false,
				// 			default: 'default0'
				// 		},
				// 		{
				// 			id: 2,
				// 			name: '黄色',
				// 			image: '',
				// 			color: '',
				// 			isShow: false,
				// 			isCheck: false,
				// 			default: 'default1'
				// 		}
				// 	]
				// },
				// {
				// 	name: '尺寸', //规格项
				// 	group: 1,
				// 	type: 'default', // default 无 ： color 颜色 ： img 图片
				// 	list: [
				// 		{
				// 			id: 3,
				// 			name: 'XL',
				// 			image: '',
				// 			color: '',
				// 			isShow: false,
				// 			isCheck: false,
				// 			default: 'default2'
				// 		},
				// 		{
				// 			id: 4,
				// 			name: 'XXL',
				// 			image: '',
				// 			color: '',
				// 			isShow: false,
				// 			isCheck: false,
				// 			default: 'default3'
				// 		}
				// 	]
				// }
			],
			list: [],//当前选中的规格项
			dynamicUrl: '',
			loading: false,
			ref: 4, //ref
			group: 0
		};
	},
	methods: {
		getMixinList(data) {
			this.skuList = data.list.map(i => {
				let arr = i.default ? i.default.split(',') : [];
				i.list = arr.map(name => {
					return {
						id:i.id,
						name: name,
						image: '',
						color: '',
						isShow: false,
						isCheck: false,
						ref: 'ref' + this.ref++
					};
				});
				return i;
			});
			this.$nextTick(()=>{
				this.skuListCheck(0);
			})
		},
		//全部选中
		totalCheck() {},
		//slider 选中时
		skuListCheck(index) {
			this.currentIndex = index;
			this.list = this.skuList[index].list;
			this.cancelChoose(true);
		},
		//main 每一项选中时
		skuItemCheck(item) {
			//没选过
			if (!item.isCheck) {
				this.chooseList.push(item);
				return item.isCheck = true;
			}
			
			//之前选中过 就取消选中 并从 chooseList 删除这一项
			let index = this.chooseList.findIndex(v => v.id === item.id);
			//找不到
			if (index < 0) return;
			this.chooseList.splice(index, 1);
			item.isCheck = false;
		},
		//dialog
		open(callback) {
			this.dynamicUrl='sku'
			this.__init()
			this.callback = callback;
			this.dialogVisible = true;
		},
		//确定
		confirm() {
			//选中图片 url
			if (typeof this.callback === 'function') {
				let item = this.skuList[this.currentIndex];
				this.callback({
					id:item.id,
					name: item.name,
					type: item.type,
					list: [...this.chooseList]
				});
			}
			//隐藏
			this.hide();
		},
		hide() {
			this.cancelChoose(true);
			this.dialogVisible = false;
			this.callback = false;
		},
		//全部选中
		cancelChoose(tag) {
			if (!tag) {
				this.chooseList = this.list.map(i => {
					if (!i.ischeck) {
						i.isCheck = true;
					}
					return i;
				});
			} else {
				this.chooseAll();
			}
		},
		//取消选中
		chooseAll() {
			this.list.forEach(i => {
				if (i.isCheck) {
					i.isCheck = false;
				}
			});
			this.chooseList = [];
		}
	},
	components: {
		pictureInfoList,
		imgList
	},
	computed: {
		isTotalCheck() {
			return this.list.length === this.chooseList.length ? true : false;
		}
	}
};
</script>

<style>
</style>
