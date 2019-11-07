var roleBuilder = require('role.builder');

module.exports = {
    run: function(creep) {
        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true
            creep.memory.target = null
        }

        if (creep.memory.target == null && creep.memory.working) {
            var walls = Game.rooms.W1N4.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_WALL}});

            walls.sort(function(a, b) {
                return a.hits - b.hits
            });

            var targets = walls.filter(function(w) {
                return w.hits <= walls[0].hits
            });

            if (creep.pos.findClosestByPath(targets) != null) {
                creep.memory.target = creep.pos.findClosestByPath(targets).id
            }
        }
        else if (creep.memory.target == null && !creep.memory.working) {
            creep.memory.target = creep.pos.findClosestByPath(FIND_SOURCES).id
        }

        if (creep.memory.target != null && creep.memory.working) {
            if (creep.repair(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.target))
            }
            else if (creep.repair(Game.getObjectById(creep.memory.target)) == OK) {
                creep.memory.target = null
            }
        }
        else if (creep.memory.target != null && !creep.memory.working) {
            if (creep.harvest(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.target))
            }
        }
    }
};