
let admin = '/admin'
class Url{
	static m(){
		let login = `${admin}login`
		let logout = `${admin}logout`
		return{
			login,
			logout
		}
	}
}
export default Url