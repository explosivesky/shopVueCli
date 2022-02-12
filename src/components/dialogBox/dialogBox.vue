<template>
	<el-dialog :show-close="showClose" :title="editAndCreate" :visible.sync="visi" width="40%" :modal="modal" top="30vh" :close-on-click-modal="isModalClose" @close="close">
		<div v-if="type=='dialog'">
			<div class="flex align-center mb-4">
				<span style="width: 25%; text-align: center;">相册名称</span>
				<el-input v-model="myName" placeholder="请输入相册名称" style="width: 75%;"></el-input>
			</div>
			<div class="flex align-center">
				<span style="width: 25%; text-align: center;">相册排序</span>
				<el-input-number v-model="orderCpt" :min="0" :max="100"></el-input-number>
			</div>
			<span slot="footer" class="dialog-footer flex justify-end mt-4">
				<el-button @click="close">取 消</el-button>
				<el-button type="primary" @click="$emit('editModel')">确 定</el-button>
			</span>
		</div>
		<!-- 只显示图片 -->
		<div v-else style="margin: -60px -20px -30px -20px;">
			<img :src="src" class="img-cover" style="height: 400px;">
		</div>
	</el-dialog>
</template>

<script>
export default {
	props: {
		editAndCreate: {
			type: String,
			default: ''
		},
		dialogVisible: {
			type: Boolean,
			default: false
		},
		modal: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: 'dialog'
		},
		showClose: {
			type: Boolean,
			default: false
		},
		order: {
			type: Number,
			default: 0
		},
		name: {
			type: String,
			default: ''
		},
		src:{
			type: String,
			default: ''
		},
		isModalClose:{
			type: Boolean,
			default: true
		}
	},
	data(){
		return{
			myName:''
		}
	},
	methods:{
		close(){
			//调用 visi 计算属性 更新给父组件 dialogVisible
			this.visi=false
		},
	},
	computed:{
		visi:{
			get(){
				//访问时传给 ele ui 组件
				return this.dialogVisible
			},
			set(val){
				//调用时 执行 setter
				this.$emit('update:dialogVisible', val)
			}
		},
		orderCpt:{
			get(){
				return this.order
			},
			set(val){
				//调用时 执行 setter
				this.$emit('update:order',val)
			}
		}
	},
	watch:{
		//传进来的 name 监听到时 修改本地 myname
		name(newval,oldval){
		this.myName=newval
		},
		//本地 myname 修改时 更新给父组件
		myName(newval,oldval){
			this.$emit('update:name',newval)
		}
	}
};
</script>

<style></style>
