<template>
	<div class="">
		<div class="flex">
			<!-- 左边 -->
			<slot name="left"></slot>
			<!-- 右边 -->
			<div class="ml-auto">
				<slot name="right">
					<div class="flex-1 flex justify-end" v-show="!isShow" v-if="noShow">
						<el-input class="mr-2" v-model="shopName" :placeholder="placeholder" size="mini" style="width: 200px;"></el-input>
						<el-button-group>
							<el-button type="info" class="mr-2" size="mini" @click="$emit('search', shopName)">搜索</el-button>
							<el-button plain="" size="mini" @click="superSearchFn(true)">高级搜索</el-button>
						</el-button-group>
					</div>
				</slot>
			</div>
		</div>
		<!-- 高级搜索区域 -->
		<el-card class="box-card mt-4" style="background-color: #f7f9fb;" v-show="isShow">
			<div slot="header" class="clearfix">
				<span>高级搜索</span>
				<el-button style="float: right; padding: 3px 0" type="text" @click="superSearchFn(false)">收起</el-button>
			</div>
			<slot name="form"></slot>
		</el-card>
	</div>
</template>

<script>
export default {
	props: {
		placeholder: {
			type: String,
			default: ''
		},
		noShow: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			isShow: false,
			shopName: ''
		};
	},
	methods: {
		superSearchFn(boolean) {
			this.isShow = boolean;
		}
	}
};
</script>

<style></style>
