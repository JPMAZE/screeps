require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallRepairer')
var roleScavenger = require('role.scavenger')

module.exports.loop = function () {

	var minimumNumberOfHarvesters = 3;
	var minimumNumberOfUpgraders = 1;
	var minimumNumberOfBuilders = 2;
	var minimumNumberOfRepairers = 2;
	var minimumNumberOfWallRepairers = 1;
	var minimumNumberOfScavengers = 1;

	var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
	var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
	var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
	var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
	var numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'wallRepairer');
	var numberOfScavengers = _.sum(Game.creeps, (c) => c.memory.role == 'scavenger');

	for (let name in Memory.creeps) {
		if (Game.creeps[name] == undefined) {
			delete Memory.creeps[name];
			console.log(name + " died.")

			console.log("Harvesters: " + numberOfHarvesters + " of " + minimumNumberOfHarvesters,
						"Upgraders: " + numberOfUpgraders + " of " + minimumNumberOfUpgraders,
						"Builders: " + numberOfBuilders + " of " + minimumNumberOfBuilders,
						"Repairers: " + numberOfRepairers + " of " + minimumNumberOfRepairers,
						"WallRepairers: " + numberOfWallRepairers + " of " + minimumNumberOfWallRepairers,
						"Scavengers: " + numberOfScavengers + " of " + minimumNumberOfScavengers)
		}
	}

	for (let name in Game.creeps) {
		var creep = Game.creeps[name];

		if (creep.memory.role == 'harvester') {
		roleHarvester.run(creep);
		}
		else if (creep.memory.role == 'upgrader') {
			roleUpgrader.run(creep);
		}
		else if (creep.memory.role == 'builder') {
			roleBuilder.run(creep);
		}
		else if (creep.memory.role == 'repairer') {
			roleRepairer.run(creep);
		}
		else if (creep.memory.role == 'wallRepairer') {
			roleWallRepairer.run(creep);
		}
		else if (creep.memory.role == 'scavenger') {
			roleScavenger.run(creep);
		}
	}

	var towers = Game.rooms.W1N4.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
	for (let tower of towers) {
		var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (target != undefined) {
			tower.attack(target)
		}
	}
	
	var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
	var name = undefined;

	if (numberOfHarvesters < minimumNumberOfHarvesters) {
		name = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester');

		if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters == 0) {
			name = Game.spawns.Spawn1.createCustomCreep(
				Game.spawns.Spawn1.room.energyAvailable, 'harvester');
		}
	}
	else if (numberOfUpgraders < minimumNumberOfUpgraders) {
		name = Game.spawns.Spawn1.createCustomCreep(energy, 'upgrader');
	}
	else if (numberOfBuilders < minimumNumberOfBuilders) {
		name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
	}
	else if (numberOfRepairers < minimumNumberOfRepairers) {
		name = Game.spawns.Spawn1.createCustomCreep(energy, 'repairer');
	}
	else if (numberOfWallRepairers < minimumNumberOfWallRepairers) {
		name = Game.spawns.Spawn1.createCustomCreep(energy, 'wallRepairer');
	}
	else if (numberOfScavengers < minimumNumberOfScavengers) {
		name = Game.spawns.Spawn1.createCustomCreep(energy, 'scavenger');
	}
	else {
		name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
	}

	if (typeof(name) == "string") {
		console.log("Spawned new " + Game.creeps[name].memory.role + " creep: " + name);

		console.log("Harvesters: " + numberOfHarvesters + " of " + minimumNumberOfHarvesters,
					"Upgraders: " + numberOfUpgraders + " of " + minimumNumberOfUpgraders,
					"Builders: " + numberOfBuilders + " of " + minimumNumberOfBuilders,
					"Repairers: " + numberOfRepairers + " of " + minimumNumberOfRepairers,
					"WallRepairers: " + numberOfWallRepairers + " of " + minimumNumberOfWallRepairers,
					"Scavengers: " + numberOfScavengers + " of " + minimumNumberOfScavengers)
	}
}