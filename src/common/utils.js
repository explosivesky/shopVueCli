export default {
	//sku算法
	skuComputed(){
		return Array.prototype.reduce.call(arguments,function(a, b) {
			var ret = [];
			a.forEach(function(a) {
				b.forEach(function(b) {
					ret.push(a.concat([b]));
				});
			});
			return ret;
		}, [[]]);
	},
	sortArray(arr,crrentIndex,indexPlus){
		arr[crrentIndex] = arr.splice(indexPlus,1,arr[crrentIndex])[0]
	},
	//上移
	sortUp(arr,index){
		this.sortArray(arr,index,index - 1)
	},
	//下移
	sortDown(arr,index){
		this.sortArray(arr,index,index + 1)
	},
}