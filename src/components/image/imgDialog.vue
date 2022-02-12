<template>
	<el-dialog title="商品图片选择" :visible.sync="dialogVisible" width="70%" top="10vh">
		<!--main -->
		<el-container style="height: 70vh; position: relative; margin: -30px -20px;">
			<!-- 头部 -->
			<el-header class="bg-light">
				<div class="flex align-center" style="height: 100%;">
					<div class="flex align-center" style="margin-right: auto;">
						<el-select v-model="searchForm.order" placeholder="请选择排序方式" size="small" class="mr-2" style="width: 200px;">
							<el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
						</el-select>
						<el-input v-model="searchForm.keyword" placeholder="请输入相册名称" size="small" class="mr-2" style="width: 200px;"></el-input>
						<el-button type="success" size="small" class="mr-2" @click="searchFn">搜索</el-button>
					</div>
				</div>
			</el-header>
			<el-container>
				<!-- 侧边栏 -->
				<el-aside width="200px" style="position: absolute; top: 60px; left: 0; bottom: 60px;" v-loading="asideLoading">
					<!-- 相册列表组 -->
					<ul class="list-group">
						<picture-info-list v-for="(c, c_i) in picture" :key="c_i" :item="c" :id="id" :index="c_i" :currentIndex="currentIndex" @light="light" :isShow="false" />
					</ul>
				</el-aside>
				<el-container>
					<!-- main -->
					<el-main class="" style="position: absolute; top: 60px; left: 200px; right: 0; bottom: 0;" v-loading="mainLoading">
						<el-row :gutter="10">
							<el-col :span="24" :lg="4" :md="6" :sm="8" :xs="24" v-for="(s, s_i) in srcList" :key="s_i">
								<img-list :srcList="s" :index="s_i" @openPrompt="openPrompt" @deleteImg="deleteImg" @checkStyle="checkStyle" :isShow="false" />
							</el-col>
						</el-row>
						<div style="height: 40px;"></div>
					</el-main>
				</el-container>
			</el-container>
			<!-- 页尾 -->
			<el-footer class="p-0" style="position: absolute; left: 0; right: 0; bottom: 0; background-color: #f8f9fa;">
				<div class="flex align-center">
					<div class="border-right flex align-center justify-center" style="width: 200px; height: 60px;">
						<el-button-group>
							<el-button class="mr-2" size="mini" :disabled="currentPicturePage === 1" @click="currentPicturePageFn('pre')">上一页</el-button>
							<el-button size="mini" :disabled="currentPicturePage === Math.ceil(currentPicturePageTotal / 10) ? true : false" @click="currentPicturePageFn('next')">
								下一页
							</el-button>
							<!-- 条目总数 / 每页条数 如果和 当前分页相等 就 disabled  要向上取整-->
						</el-button-group>
					</div>
					<div class=" flex-1 px-3 flex align-center justify-between">
						<el-pagination
							@size-change="handleSizeChange"
							@current-change="handleCurrentChange"
							:current-page="currentPage"
							:page-sizes="pageSizes"
							:page-size.sync="pageSize"
							layout="total, sizes, prev, pager, next, jumper"
							:total="pageTotal"
						></el-pagination>
						<span slot="footer" class="dialog-footer">
							<el-button @click="hide" size="mini">取 消</el-button>
							<el-button type="success" @click="confirm" size="mini">确 定</el-button>
						</span>
					</div>
				</div>
			</el-footer>
		</el-container>
	</el-dialog>
</template>

<script>
import pictureInfoList from '@/components/image/pictureInfoList.vue';
import imgList from '@/components/image/imgList.vue';
export default {
	data() {
		return {
			callback: false,
			dialogVisible: false,
			searchForm: {
				keyword: '',
				order: ''
			},
			dialogForm: {
				input: '',
				num: 0
			},
			options: [
				{
					value: 'asc',
					label: '升序排序'
				},
				{
					value: 'desc',
					label: '降序排序'
				}
			],
			currentIndex: 0,
			max: 0, //最多选中图片数量
			picture: [], //侧边栏数据
			currentPicturePage: 1, //侧边栏当前分页
			currentPicturePageTotal: 0,
			id: 0, //图片列表当前id
			pictureIndex: -1, //控制  修改 | 创建相册
			srcList: [], //图片数据
			chooseList: [], //选中的图片数据
			pageSize: 10, //每页多少条
			pageSizes: [10, 20, 30, 50, 100], //快速跳转到多少条
			pageTotal: 0, //图片列表总条目数,
			currentPage: 1,
			asideLoading: false,
			mainLoading: false
		};
	},
	methods: {
		__init(id) {
			this.asideLoading = true;
			//获取相册列表
			new this.request(this.url.m(this.currentPicturePage).imageclass)
				.modeget()
				.then(res => {
					this.asideLoading = false;
					this.picture = res.data.data.list; //相册数据
					this.id = id || this.picture[0].id; //因为图片列表id高亮 是 根据 id 判断的，所以刷新时给刷新前的 id
					this.currentPicturePageTotal = res.data.data.totalCount; //相册分页总数
					this.getImg(); //获取对应相册下的图片列表
				})
				.catch(e => {
					this.asideLoading = false;
				});
		},
		//获取对应相册下的图片列表
		getImg() {
			this.mainLoading = true;
			new this.request(this.getImageListUrl)
				.modeget()
				.then(res => {
					this.mainLoading = false;
					this.pageTotal = res.data.data.totalCount; //分页总数
					this.srcList = res.data.data.list.map(i => {
						return {
							id: i.id,
							src: i.url,
							name: i.name,
							checkTag: 0,
							isCheck: false,
							checkState: -1
						};
					});
				})
				.catch(e => {
					this.mainLoading = false;
				});
		},
		//dialog
		open(callback, max = 1) {
			this.__init();
			this.callback = callback;
			this.dialogVisible = true;
			this.max = max;
		},
		//确定
		confirm() {
			//选中图片 url
			if (typeof this.callback === 'function') this.callback(...this.chooseList);
			//隐藏
			this.hide();
		},
		hide() {
			this.cancelChoose();
			this.dialogVisible = false;
			this.callback = false;
		},
		//pageSize 改变时会触发
		handleSizeChange(val) {
			this.pageSize = val;
			this.getImg();
		},
		//currentPage 改变时会触发
		handleCurrentChange(val) {
			this.currentPage = val;
			this.getImg();
		},
		//列表高亮
		light(id) {
			if (this.id == id) return;
			this.id = id;
			this.currentPage = 1; //默认显示该相册的第一页数据
			if (this.chooseList.length !== 0) this.cancelChoose(); //取消全部选中
			this.getImg();
		},
		//相册列表分页
		currentPicturePageFn(val) {
			//上一页
			if (val == 'pre') {
				this.currentPicturePage--;
			} else {
				//下一页
				this.currentPicturePage++;
			}
			this.__init();
		},
		//搜索按钮
		searchFn() {
			this.getImg(); //获取对应相册下的图片列表
		},
		//删除图片
		deleteImg(obj) {
			this.openMsgBox('', 'deleteImg', obj);
		},
		//确认删除消息框
		openMsgBox(id, type, obj = null) {
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				//删除单张
				if (type == 'deleteImg') {
					//删除图片
					//删除图片后更新选中样式
					if (this.chooseList.length !== 0) this.checkStyle(obj);
					new this.request(this.url.m(obj.id).image)
						.modedelete()
						.then(res => {
							this.__init(this.id);
						})
						.catch(e => {
							this.mainLoading = false;
						});
				}
				this.$message.success('删除成功');
			});
		},
		//打开prompt
		openPrompt(id) {
			let index = this.srcList.findIndex(i => i.id === id);
			this.$prompt('请输入图片信息', '修改图片信息', {
				showClose: false,
				closeOnClickModal: false,
				inputValue: this.srcList[this.srcList.findIndex(i => i.id === id)].name,
				confirmButtonText: '确定',
				cancelButtonText: '取消'
			}).then(({ value }) => {
				this.srcList[this.srcList.findIndex(i => i.id === id)].name = value;
				this.$message({
					type: 'success',
					message: '修改成功'
				});
			});
		},
		//选中样式
		checkStyle(obj) {
			let { name, id, checkState, isCheck, checkTag, src } = obj;
			//控制选中图片的数量
			if (this.chooseList.length >= this.max && checkState === -1) {
				this.$message({ type: 'warning', message: `选择图片最多${this.max}张` });
				return;
			}
			// 根据当前 选中的 item 中的 id 判断 srcList 对应 id 的索引，并根据索引 修改 srcList 中的 isCheck 里更新 子组件的 是否选中样式
			let index = this.srcList.findIndex(i => i.id === id);
			//没选中的
			if (checkState === -1) {
				this.srcList[index].isCheck = !isCheck;
				this.srcList[index].checkState = id;
				// 把选中的放到 choose 数组中
				this.chooseList.push({ name, checkState, id, src });
				//tag 就是 数组的长度
				this.srcList[index].checkTag = this.chooseList.length;
				return;
			}
			//选中过的
			this.srcList[index].isCheck = !isCheck;
			this.srcList[index].checkState = -1;
			let chooseIndex = this.chooseList.findIndex(i => i.id === id);
			// 根据当前 选中的 item 中的 id 和 choose 数组中的 id 来判断 删除 choose 数组的项并更新 tag
			this.chooseList.splice(chooseIndex, 1);
			//判断取消的是不是最大数，也就是最后一个，如果是就不用再往下操作了
			//if(chooseIndex+1 == this.chooseList.length) return
			//如果不是就对 chooseIndex 后面的元素进行操作
			for (let j = chooseIndex; j < this.chooseList.length; j++) {
				index = this.srcList.findIndex(i => i.id === this.chooseList[j].id);
				if (index > -1) {
					this.srcList[index].checkTag--;
				}
			}
		},
		//取消选中
		cancelChoose() {
			//取消选中
			if (this.chooseList.length) {
				this.srcList.forEach(i => {
					if (i.isCheck) {
						i.isCheck = false;
						i.checkTag = 0;
						i.checkState = -1;
					}
				});
				this.chooseList = [];
			}
		}
	},
	components: {
		pictureInfoList,
		imgList
	},
	computed: {
		//动态获取选中相册的 id
		imageListId() {
			let item = this.picture.find(i => i.id == this.id);
			if (item) return item.id;
			return 0;
		},
		//请求动态路径
		getImageListUrl() {
			let other = '';
			if (this.searchForm.keyword != '') other = `&keyword=${this.searchForm.keyword}`;
			return `/admin/imageclass/${this.imageListId}/image/${this.currentPage}?limit=${this.pageSize}&order=${this.searchForm.order}${other}`;
		}
	}
};
</script>

<style></style>
