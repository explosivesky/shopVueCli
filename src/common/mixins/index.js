export default {
	data() {
		return {
			page: {
				currentPage: 1,
				pageSize: 10,
				pageSizes: [10, 20, 50, 100],
				total: 0
			},
			multipleSelection: [],
			dynamicUrl: '',
			currentIndex: -1,
			loading:true
		}
	},
	created() {
		this.__init()
	},
	computed: {
		ids() {
			return this.multipleSelection.map(i => i.id)
		}
	},
	methods: {
		//让组件复用 获取初始数据
		getMixinList(data) {},
		//init 的动态 url
		editUrlVal() {
			//组件中没写这个方法 则不会覆盖
			if(this.dynamicUrl) return this.url.m(this.page.currentPage, '?limit=' + this.page.pageSize)[this.dynamicUrl].init
			//return url
		},
		//防止 app 的全局组件页面调用 isLoading方法 因为他俩都是全局中的，所以全局组件就没必要 inject layout 了 
		isLoading(flag){
			if(this.loading){
				this.layout.isLoading(flag)
			}
		},
		//页面数据
		__init() {
			if (this.dynamicUrl == '') return //确保只有定义了 dynamicUrl 变量的组件才可以使用 此方法
			this.isLoading(true)
			let url = this.editUrlVal()
			if(url){
				new this.request(url).modeget().then(res => {
					let data = res.data.data
					//因为先执行 mixins ，而后在执行混入组件对应的方法
					//也就是说会执行两次，而 mixins 中的 getMixinList 不做任何处理，只是防止 mixins 报错 "this.getMixinList undefined"
					this.getMixinList(data)
					this.page.total = res.data.data.totalCount
					this.isLoading(false)
				}).catch(e => {
					this.isLoading(false)
				})
			}
		},
		//table 添加或修改
		addOrEdit(data,id=0) {
			let msg = id ? '修改' : '添加'
			let url = id ? this.url.m(id)[this.dynamicUrl].add_or_edit : this.url.m()[this.dynamicUrl].add_or_edit 
			new this.request(url, data).modepost().then(res => {
				this.__init()
			})
			this.$message.success(msg + '成功');
		},
		//批量删除
		deleteSku(type, id) {
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				if (type === 'all') {
					if (!this.ids.length) return this.$message.warning('请先选中需要删除的信息')
					//批量删除
					let ids = this.ids
					new this.request(this.url.m(id)[this.dynamicUrl].delete_all, {
						ids
					}).modepost().then(res => {
						this.__init()
					})
				} else if (type === 'single') {
					//单一删除
					new this.request(this.url.m(id)[this.dynamicUrl].delete).modepost().then(res => {
						this.__init()
					})
				}
				this.$message.success('删除成功')
			});
		},
		//是否禁用
		isBan(item) {
			item.status = item.status == 1 ? 0 : 1;
			new this.request(this.url.m(item.id)[this.dynamicUrl].update_status, {
				status: item.status
			}).modepost().then(res => {
				this.__init()
			})
			this.$message({
				type: 'success',
				message: item.status ? '启用' : '禁用'
			});
		},
		// tabel当选择项发生变化时会触发该事件
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		//page更改时
		handleCurrentChange(val) {
			this.page.currentPage = val
			this.__init()
		},
		//pagesize 发生变化时触发
		handleSizeChange(val) {
			this.page.pageSize = val
			this.__init()
		},
	},

	filters: {
		indexToStr(val) {
			return val.toString()
		}
	}
}
