<template>
	<el-form ref="form" label-width="80px">
		<el-form-item label="商品大图">
			<el-row :gutter="20" class="flex flex-wrap">
				<el-col :span="24" :lg="4" :md="6" :sm="8" :xs="24" v-for="(item, index) in banners" :key="index">
					<div class="flex align-center justify-center border rounded mx-4 my-2 p-0 cursor-pointer" style="height: 150px; width: 150px;" @click="openImgDialog">
						<div class="position-relative" style="height: 150px; width: 150px;" v-if="item.src">
							<img :src="item.src" class="w-100" style="height: 100%;" />
							<div
								class="btn position-absolute el-icon-delete flex justify-center align-center text-white"
								style="height: 25px; width: 25px; right: 0; top: 0;background-color: rgba(0,0,0,.5); z-index: 12;"
								@click.stop="deleteImg(index)"
							></div>
						</div>
						<span v-else class="el-icon-plus" style="font-size: 30px;"></span>
					</div>
				</el-col>

				<el-col v-if="banners.length < 9" :span="24" :lg="4" :md="6" :sm="8" :xs="24">
					<div class="flex align-center justify-center border rounded mx-4 my-2 p-0 cursor-pointer" style="height: 150px; width: 150px;" @click="openImgDialog">
						<span class="el-icon-plus" style="font-size: 30px;"></span>
					</div>
				</el-col>
			</el-row>
		</el-form-item>
	</el-form>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	inject: ['app'],
	computed: {
		...mapState({
			banners: state => state.goods_create.banners
		})
	},
	methods: {
		...mapMutations(['vModelState']),
		openImgDialog() {
			let max = 9;
			max = max - this.banners.length;
			this.app.openImgDialog((...res) => {
				let list = [...this.banners, ...res];
				// console.log(list)
				this.vModelState({ key: 'banners', val: list });
			}, max);
		},
		//删除商品大图
		deleteImg(index) {
			this.$confirm('是否该删除图片?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.banners.splice(index, 1);
				this.vModelState({ key: 'banners', val: this.banners });
			});
		}
	}
};
</script>

<style></style>
