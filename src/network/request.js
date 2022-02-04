import instance  from './header.js'

class Request {
	constructor(url,arg,config){
		this.url=url
		this.arg=arg
		this.config=config||{token:true,loading:true}
	}
	modepost(){
		return new Promise((resolve,reject)=>{
			instance.post(this.url,this.arg,this.config)
			.then(res=>{
				resolve(res)
			}).catch(err=>{
				reject(err)
			})
		})
	}
	modeget(){
		return new Promise((resolve,reject)=>{
			instance.get(this.url)
			.then(res=>{
				resolve(res)
			}).catch(err=>{
				reject(err)
			})
		})
	}
}

export default Request