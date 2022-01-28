<template>
<div>
	<el-card shadow="hover" class="w-100 mb-2" :class="{'img-hover':srcList.isCheck ? 'img-hover' : ''}" body-style="padding:0;">
		<div class="position-relative" style="height: 100px; cursor: pointer;">
			<!-- 标签 -->
			<span v-show="srcList.isCheck" class="badge badge-danger position-absolute" style="right: 0; top: 0; z-index: 9; border-radius: 0;">{{srcList.checkTag}}</span>
			<el-image :lazy="true" fit="cover" style="width: 100%; height: 100px" :src="srcList.src" @click="$emit('checkStyle',srcList)"></el-image>
			<div class="position-absolute w-100 text-white px-2" style="background-color: rgba(0,0,0,.4); height: 25px; margin-top: -25px; bottom: 0;">
				<small>{{ srcList.name }}</small>
			</div>
		</div>
		<!-- 按钮组 -->
		<div class="p-2 text-center">
			<el-button-group>
				<el-button icon="el-icon-view" size="mini" class="p-2"  @click="showImg" v-if="isShow"></el-button>
				<el-button icon="el-icon-edit" size="mini" class="p-2" @click="$emit('openPrompt',srcList.id)"></el-button>
				<el-button icon="el-icon-delete" size="mini" class="p-2" @click="$emit('deleteImg',index,srcList)"></el-button>
			</el-button-group>
		</div>
	</el-card>
	<dialog-box type='img' :dialogVisible.sync='dialogVisible' :src='srcList.src'/>
</div>
</template>

<script>
	import dialogBox from '@/components/dialogBox/dialogBox.vue'
	export default{
		props:{
			srcList:{
				required:true,
				type:Object,
				default(){
					return{}
				}
			},
			index: {
				type: Number,
				default: 0
			},
			isShow:{
				type:Boolean,
				default:true
			}
		},
		data(){
			return{
				dialogVisible:false,
			}
		},
		methods:{
			//打开 diaplog
			showImg(){
					this.dialogVisible=true
			},
			//选中样式
			checkStyle(obj){
		let {name,id,checkState,isCheck,checkTag}=obj
		if(checkState === -1){
			let index = this.srcList.findIndex(i=>i.id===id)
			this.srcList[index].isCheck = !isCheck
			this.srcList[index].checkState = id
			this.checkList.push({name,checkState})
			checkTag=this.checkList.length
			return
		}
			}
		},
		components:{
			dialogBox
		}
	}
</script>

<style scoped="scoped">
	.img-hover{
		border: 1px solid #dc3545;
	}
</style>
