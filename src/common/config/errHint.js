export default class ErrHint{
	constructor(message,type,msg){
		this.message=message
		this.type=type
		this.msg=msg
	}
	msgHint(){
		this.message({
			type:this.type,
			message:this.msg
		})
	}
	popup(){
		
	}
}
