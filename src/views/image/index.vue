<template>
	<div>
		<el-container style="position: absolute; left: 0; right: 0; top:55px; bottom: 0;">
			<!-- 头部 -->
			<el-header class="bg-light">
				<div class="flex align-center" style="height: 100%;">
					<div class="flex align-center" style="margin-right: auto;">
						<el-select v-model="searchForm.order" placeholder="请选择排序方式" size="small" class="mr-2" style="width: 200px;">
							<el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
						</el-select>
						<el-input v-model="searchForm.keyword" placeholder="请输入图片名称" size="small" class="mr-2" style="width: 200px;"></el-input>
						<el-button type="success" size="small" class="mr-2" @click="searchFn">搜索</el-button>
					</div>
					<div class="flex align-center">
						<el-button type="danger" size="small" @click.stop.native="openMsgBox('', 'deleteAll')" v-show="chooseList.length">批量删除</el-button>
						<el-button :type="chooseList.length ? 'warning' : 'danger'" size="small" @click.stop.native="cancelChoose">{{ btn }}</el-button>
						<el-button type="success" size="small" @click.stop.native="openDialog(false)">创建相册</el-button>
						<el-button type="warning" size="small" @click.stop.native="openUpload">上传图片</el-button>
					</div>
				</div>
			</el-header>
			<el-container>
				<!-- 侧边栏 -->
				<el-aside width="200px" style="position: absolute; top: 60px; left: 0; bottom: 60px;">
					<!-- 相册列表组 -->
					<ul class="list-group">
						<picture-info-list v-for="(c, c_i) in picture" :key="c.id" :item="c" :id="id" @openDialog="openDialog" @openMsgBox="openMsgBox" @light="light" />
					</ul>
				</el-aside>
				<el-container>
					<!-- main -->
					<el-main class="" style="position: absolute; top: 60px; left: 200px; right: 0; bottom: 0;">
						<el-row :gutter="10" v-if="srcList.length != 0">
							<el-col :span="24" :lg="4" :md="6" :sm="8" :xs="24" v-for="(s, s_i) in srcList" :key="s.id">
								<img-list :srcList="s" :index="s_i" @openPrompt="openPrompt" @deleteImg="deleteImg" @checkStyle="checkStyle" />
							</el-col>
						</el-row>
						<div class="flex justify-center" v-else><h5>暂无图片</h5></div>
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
					<div class="pl-2">
						<el-pagination
							@size-change="handleSizeChange"
							@current-change="handleCurrentChange"
							:current-page="currentPage"
							:page-sizes="pageSizes"
							:page-size.sync="pageSize"
							layout="total, sizes, prev, pager, next, jumper"
							:total="pageTotal"
						></el-pagination>
					</div>
				</div>
			</el-footer>
		</el-container>
		<!-- 对话框 -->
		<dialog-box
			:editAndCreate="editAndCreate"
			:dialogVisible.sync="dialogVisible"
			type="dialog"
			:order.sync="dialogForm.order"
			:name.sync="dialogForm.name"
			@editModel="editModel"
			@handleChange="handleChange"
		/>
		<!-- 上传 upload -->
		<el-dialog :show-close="true" @before-close="closeDialog" title="上传图片" :visible.sync="uploadVisible" width="40%" :modal="false" top="30vh">
			<div style="text-align: center;">
				<el-upload
					class="upload-demo"
					:drag="true"
					:headers="{ token: $store.state.user.token }"
					action="/admin/image/upload"
					multiple
					:on-success="uploadSuccess"
					:data="{ image_class_id: imageListId }"
					name="img"
				>
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">
						将文件拖到此处，或
						<em>点击上传</em>
					</div>
					<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import pictureInfoList from '@/components/image/pictureInfoList.vue';
import imgList from '@/components/image/imgList.vue';
import dialogBox from '@/components/dialogBox/dialogBox.vue';
export default {
	data() {
		return {
			dialogVisible: false,
			uploadVisible: false,
			currentPage: 1,
			searchForm: {
				keyword: '',
				order: ''
			},
			dialogForm: {
				name: '',
				order: 0
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
			handle: [
				{
					value: '修改'
				},
				{
					value: '删除'
				}
			],
			picture: [], //侧边栏数据
			currentPicturePage: 1, //侧边栏当前分页
			currentPicturePageTotal: 0,
			id: 0, //图片列表当前id
			pictureIndex: -1, //控制  修改 | 创建相册
			srcList: [], //图片数据
			chooseList: [], //选中的图片数据
			pageSize: 10, //每页多少条
			pageSizes: [10, 20, 30, 50, 100], //快速跳转到多少条
			pageTotal: 0 //图片列表总条目数
		};
	},
	inject: ['layout'],
	methods: {
		//上传文件
		uploadSuccess() {
			this.__init();
		},
		__init(id) {
			this.layout.isLoading(true);
			//获取相册列表
			new this.request(this.url.m(this.currentPicturePage).imageclass)
				.modeget()
				.then(res => {
					this.picture = res.data.data.list; //相册数据
					this.id = id || this.picture[0].id; //因为图片列表id高亮 是 根据 id 判断的，所以刷新时给刷新前的 id
					this.currentPicturePageTotal = res.data.data.totalCount; //相册分页总数
					this.getImg(); //获取对应相册下的图片列表
				})
				.catch(e => {
					this.layout.isLoading(false);
				});
		},
		//获取对应相册下的图片列表
		getImg() {
			this.layout.isLoading(true);
			new this.request(this.getImageListUrl)
				.modeget()
				.then(res => {
					this.layout.isLoading(false);
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
					this.layout.isLoading(false);
				});
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
							this.layout.isLoading(false);
						})
						.catch(e => {
							this.layout.isLoading(false);
						});
					//删除相册
				} else if (type == 'delateItemList') {
					new this.request(this.url.m(id).imageclass)
						.modedelete()
						.then(res => {
							this.__init(this.id);
							this.layout.isLoading(false);
						})
						.catch(e => {
							this.layout.isLoading(false);
						});
					//批量删除
				} else if (type == 'deleteAll') {
					//批量删除
					//过滤出选中的
					let arr = this.srcList.filter(i => i.isCheck);
					let ids = arr.map(i => {
						return i.id;
					});
					this.chooseList = [];
					new this.request(this.url.m().delete_all, { ids })
						.modepost()
						.then(res => {
							this.__init();
							this.layout.isLoading(false);
						})
						.catch(e => {
							this.layout.isLoading(false);
						});
				}
				this.layout.isLoading(false);
				this.$message.success('删除成功');
			});
		},
		//删除图片
		deleteImg(obj) {
			this.openMsgBox('', 'deleteImg', obj);
		},
		//打开对话框
		openDialog(item, id) {
			this.id = id;
			//修改相册
			if (item) {
				//初始化 dialog
				(this.dialogForm.name = item.name), (this.dialogForm.order = item.order), (this.pictureIndex = id);
			}
			if (item === false) this.pictureIndex = -1;
			this.dialogVisible = true; //打开dialog
		},
		//打开upload
		openUpload() {
			this.uploadVisible = true;
		},
		//关闭dialog
		closeDialog() {
			this.dialogVisible = false;
		},
		//修改 | 添加相册
		editModel() {
			if (this.pictureIndex > -1) {
				//修改相册数据
				this.layout.isLoading(true);
				new this.request(this.url.m(this.id).imageclass, this.dialogForm)
					.modepost()
					.then(res => {
						this.__init();
						this.$message.success('修改成功');
						this.layout.isLoading(false);
					})
					.catch(e => {
						this.layout.isLoading(false);
					});
			} else {
				//创建相册
				this.layout.isLoading(true);
				new this.request(this.url.m().imageclass, this.dialogForm)
					.modepost()
					.then(res => {
						this.__init(this.id);
						this.$message.success('新增成功');
						this.layout.isLoading(false);
					})
					.catch(e => {
						this.layout.isLoading(false);
					});
			}

			//初始化
			(this.dialogForm.name = ''), (this.dialogForm.order = 0), (this.dialogVisible = false), (this.pictureIndex = -1);
		},
		//计数器
		handleChange() {},
		//修改图片信息
		openPrompt(id) {
			//获取当前选中图片的索引
			let index = this.srcList.findIndex(i => i.id === id);
			this.$prompt('请输入图片信息', '修改图片信息', {
				showClose: false,
				closeOnClickModal: false,
				inputValue: this.srcList[this.srcList.findIndex(i => i.id === id)].name, //获取当前选中图片的名称
				confirmButtonText: '确定',
				cancelButtonText: '取消'
			}).then(({ value }) => {
				//注意这里 是结构出来的 value 而不是形参
				new this.request(this.url.m(id).image, { name: value.trim() })
					.modepost()
					.then(res => {
						this.getImg();
						this.$message.success('修改成功');
						this.layout.isLoading(false);
					})
					.catch(e => {
						this.layout.isLoading(false);
					});
				this.layout.isLoading(false);
			});
		},
		//选中样式
		checkStyle(obj) {
			let { name, id, checkState, isCheck, checkTag, src } = obj;
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
			if (this.chooseList.length !== 0) {
				this.srcList.forEach(i => {
					if (i.isCheck) {
						i.isCheck = false;
						i.checkTag = 0;
						i.checkState = -1;
					}
				});
				this.chooseList = [];
			} else {
				//全部选中
				this.srcList.forEach(i => {
					if (!i.isCheck) {
						this.chooseList.push({ name: i.name, checkState: i.checkState, id: i.id });
						i.isCheck = true;
						i.checkTag = this.chooseList.length;
						i.checkState = i.id;
					}
				});
			}
		}
	},
	computed: {
		editAndCreate() {
			return this.pictureIndex > -1 ? '修改相册' : '创建相册';
		},
		btn() {
			return this.chooseList.length ? '取消选中' : '全部选中';
		},
		//动态获取选中相册的 id
		imageListId() {
			let item = this.picture.find(i => i.id == this.id);
			if (item) return item.id;
			return 1;
		},
		//请求图片的动态路径
		getImageListUrl() {
			let other = '';
			if (this.searchForm.keyword != '') other = `&keyword=${this.searchForm.keyword}`;
			return `/admin/imageclass/${this.imageListId}/image/${this.currentPage}?limit=${this.pageSize}&order=${this.searchForm.order}${other}`;
		}
	},
	components: {
		pictureInfoList,
		imgList,
		dialogBox
	},
	created() {
		this.__init();
	}
};
</script>

<style scoped="scoped"></style>
