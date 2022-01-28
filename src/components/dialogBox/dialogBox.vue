<template>
	<el-dialog :show-close="showClose" :title="editAndCreate" :visible.sync="visi" width="40%" :modal="modal" top="30vh" :close-on-click-modal="isModalClose" @close="close">
		<div v-if="type=='dialog'">
			<div class="flex align-center mb-4">
				<span style="width: 25%; text-align: center;">相册名称</span>
				<!-- <el-input v-model="changCpu" placeholder="请输入相册名称" style="width: 75%;" @change="selectFn"></el-input> -->
				<el-input v-model="childInput" placeholder="请输入相册名称" style="width: 75%;"></el-input>
			</div>
			<div class="flex align-center">
				<span style="width: 25%; text-align: center;">相册排序</span>
				<el-input-number v-model="selectCpu" :min="0" :max="100"></el-input-number>
			</div>
			<span slot="footer" class="dialog-footer flex justify-end mt-4">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="$emit('editModel')">确 定</el-button>
			</span>
		</div>
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
		num: {
			type: Number,
			default: 0
		},
		input: {
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
			childNum:0,
			childInput:''
		}
	},
	methods:{
		close(){
			this.visi=false
		},
	},
	computed:{
		visi:{
			get(){
				return this.dialogVisible
			},
			set(val){
				//调用时 执行 setter
				this.$emit('update:dialogVisible', val)
			}
		},
		selectCpu:{
			get(){
				return this.num
			},
			set(val){
				//调用时 执行 setter
				this.$emit('update:num',val)
			}
		}
	},
	watch:{
		input(newval,oldval){
		this.childInput=newval
		// this.$emit('update:input',newval)
		},
		childInput(newval,oldval){
			this.$emit('update:input',newval)
		}
	}
};
</script>

<style></style>
