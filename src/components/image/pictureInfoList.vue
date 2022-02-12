<template>
	<div class="">
		<li class="list-group-item flex align-center justify-between" :class="{ hover: id === item.id }" @click="$emit('light', item.id)" style="cursor: pointer;">
			<small class="text-truncate">{{ item.name }}</small>
			<div @click.stop="cancel">
				<span class="btn btn-light btn-sm" style="width: 60px;" v-if="!isShow">
					{{ item.images_count }}
				</span>
				<el-dropdown size="mini" v-if="isShow">
					<span class="btn btn-light btn-sm" style="width: 60px;">
						{{ item.images_count }}
						<i class="el-icon-arrow-down el-icon--right" ></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item style="width: 60px; text-align: center;" @click.stop.native="$emit('openDialog', item, item.id)">修改</el-dropdown-item>
						<el-dropdown-item style="width: 60px;text-align: center;" @click.stop.native="$emit('openMsgBox', item.id, 'delateItemList')">删除</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</li>
	</div>
</template>

<script>
export default {
	props: {
		item: {
			required: true,
			type: Object,
			default() {
				return {};
			}
		},
		index: {
			type: Number,
			default: 0
		},
		id: {
			type: Number,
			default: 0
		},
		isShow:{
			type:Boolean,
			default:true
		}
	},
	methods:{
		cancel(){
			return
		}
	}
};
</script>

<style scoped="scoped">
.hover {
	color: #6a957d !important;
	border-color: #d5eed2 !important;
	background-color: #edf7ec !important;
}
</style>
