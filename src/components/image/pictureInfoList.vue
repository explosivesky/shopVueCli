<template>
	<div class="">
		<li class="list-group-item flex align-center justify-between" :class="{ hover: currentIndex === index }" @click="$emit('light', index)" style="cursor: pointer;">
			<span>{{ item.name }}</span>
			<div>
				<span class="btn btn-light btn-sm" style="width: 60px;" v-if="!isShow">
					{{ item.num }}
				</span>
				<el-dropdown size="mini" v-if="isShow">
					<span class="btn btn-light btn-sm" style="width: 60px;">
						{{ item.num }}
						<i class="el-icon-arrow-down el-icon--right" ></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item style="width: 60px; text-align: center;" @click.stop.native="$emit('openDialog', item, index)">修改</el-dropdown-item>
						<el-dropdown-item style="width: 60px;text-align: center;" @click.stop.native="$emit('openMsgBox', index, 'delateItemList')">删除</el-dropdown-item>
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
			required: true,
			type: Number,
			default: 0
		},
		currentIndex: {
			type: Number,
			default: 0
		},
		isShow:{
			type:Boolean,
			default:true
		}
	}
};
</script>

<style scoped="scoped">

</style>
