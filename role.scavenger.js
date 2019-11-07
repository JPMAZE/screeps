module.exports = {
	run: function(creep) {
    	if (creep.memory.working && creep.carry.energy == 0) {
			creep.memory.working = false;
		}
		else if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
			creep.memory.working = true
		}

		if (creep.memory.working) {
			var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,{
				filter: (s) => (s.structureType == STRUCTURE_SPAWN
							 || s.structureType == STRUCTURE_EXTENSION
							 || s.structureType == STRUCTURE_TOWER)
							 && s.energy < s.energyCapacity
			});
			if (structure != undefined) {
				if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(structure)
				}
			}
		}
		else {
			var drops = Game.rooms.W1N4.find(FIND_DROPPED_RESOURCES)

            drops.sort(function(a, b) {
                return a.energy - b.energy
            });

			if (creep.pickup(drops[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(drops[0]);
			}
        }
	}
};