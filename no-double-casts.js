const skills = {
	4: {26: 300},	// Teleport jaunt
	5: {17: 300, 20: 300, 32: 300},		// Web arrow, Restraining arrow, Find weakness
	6: {40: 700},		// Zenobia's vortex
	7: {17: 300, 42: 450, 44: 300}		// Teleport jaunt, Boomerang pulse, Mass Teleport
}

const PING = 250

module.exports = function NoDblCasts(dispatch) {
	let job = -1
	let lastSkill = -1
	
	let timer = null

	dispatch.hook('S_LOGIN', 10, (event) => {
		job = (event.templateId - 10101) % 100
		lastSkill = -1
	});

	dispatch.hook('C_START_SKILL', 5, {order: -90}, check.bind(null,'C_START_SKILL'))
	dispatch.hook('C_START_TARGETED_SKILL', 4, {order: -90}, check.bind(null,'C_START_TARGETED_SKILL'))
	dispatch.hook('C_START_INSTANCE_SKILL', 3, {order: -90}, check.bind(null,'C_START_INSTANCE_SKILL'))
	
	function check(type, event){
		let skill = Math.floor((event.skill - 0x4000000) / 10000)
		if(skills[job] && skills[job][skill]){
			if(lastSkill == skill){
				dispatch.toClient('S_CANNOT_START_SKILL', 1, {skill: event.skill})
				return false
			}
			else{
				lastSkill = skill
				clearTimeout(timer)
				timer = setTimeout(refresh, (PING + skills[job][skill]))
			}
		}
		else{
			clearTimeout(timer)
			lastSkill = -1
		}
	}
	
	function refresh(){
		lastSkill = -1
	}
}