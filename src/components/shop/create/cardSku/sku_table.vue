<template>
	<table class="table table-sm table-bordered">
		<thead class="thead-dark">
			<tr>
				<th
					scope="col"
					:colspan="g.colspan"
					:rowspan="g.rowspan"
					:width="g.width"
					class="text-center"
					style="vertical-align: middle;"
					v-for="(g, g_i) in getThs"
					:key="g_i"
				>
					{{ g.name }}
				</th>
			</tr>
			<tr>
				<th scope="col" class="text-center" style="vertical-align: middle;" v-for="(g, g_i) in getLable" :key="g_i">{{ g.name }}</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item, g_i) in list" :key="g_i">
				<th scope="row" class="text-center" v-for="(s, s_i) in item.skus" :key="s_i">{{ s.value }}</th>
				<td class="text-center" style="vertical-align: middle;">
					<span v-if="!item.image" class="border btn btn-light" @click="openDialog(item)">
						<i class="el-icon-plus"></i>
					</span>
					<img v-else :src="item.image" @click="openDialog(item)" class="rounded" style="width: 35px; height: 35px; cursor: pointer; object-fit: cover;">
				</td>
				<td class="text-center">
				<input type="number" v-model="item.pprice" class="form-control"/>
				</td>
				<td class="text-center">
				<input type="number"  v-model="item.oprice" class="form-control"/>
				</td>
				<td class="text-center">
				<input type="number"  v-model="item.cprice" class="form-control"/>
				</td>
				<td class="text-center">
				<input type="number" v-model="item.stock" class="form-control"/>
				</td>
				<td class="text-center">
				<input type="number" v-model="item.volume" class="form-control"/>
				</td>
				<td class="text-center">
				<input type="number" v-model="item.weight" class="form-control"/>
				</td>
				<td class="text-center">
				<input type="text" v-model="item.code" class="form-control"/>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
export default {
	data(){
		return{
		list:[]	
		}
	},
	inject:['app']
	,
	computed: {
		...mapGetters(['getThs', 'getThsData', 'getLable'])
	},
	methods:{
	//打开图片列表dialog 弹窗
	openDialog(item){
		this.app.openImgDialog((...res)=>{
			item.image=res[0].src
		},1)
	}
	},
	watch:{
		getThsData(newval){
			//更新本地list 数据
			this.list=newval
		}
	},
	mounted(){
		this.list=this.getThsData
	}
};
</script>

<style></style>
