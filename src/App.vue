<!--
 * @Author: your name
 * @Date: 2022-01-17 22:52:54
 * @LastEditTime: 2022-01-19 16:40:29
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \shopProduct\shopvuecli\src\App.vue
-->
<template>
	<div id="app">
		<router-view></router-view>	
	<img-dialog ref="imgDialog" />
	<sku-dialog ref="skuDialog" />
	</div>
</template>

<script>
import imgDialog from '@/components/image/imgDialog.vue';
import skuDialog from '@/components/shop/create/skuDialog.vue';
export default {
	name: 'app',
	data() {
		return {};
	},
	provide() {
		return {
			app: this
		};
	},
	methods: {
		openImgDialog(callback, max) {
			this.$refs.imgDialog.open(callback, max);
		},
		openSkuDialog(callback, max) {
			this.$refs.skuDialog.open(callback);
		}
	},
	components: {
		imgDialog,
		skuDialog
	}
};
</script>

<style>
@import './common/css/free.css';
@import './common/css/demo.css';
::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.1);
	border-radius: 0;
}

::-webkit-scrollbar {
	-webkit-appearance: none;
	width: 10px;
	height: 10px;
}

::-webkit-scrollbar-thumb {
	cursor: pointer;
	border-radius: 5px;
	background: rgba(0, 0, 0, 0.25);
	transition: color 0.2s ease;
}
</style>
