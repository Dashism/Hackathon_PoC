/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
		
        const agents = [
            {
				username: 'testagent1',
                agentcoin: 1,
                entity: 'entity1',
                entitycoin: 100,
            },
			{
				username: 'testagent2',
                agentcoin: 2,
                entity: 'entity2',
                entitycoin: 200,
            },
			{
				username: 'testagent3',
                agentcoin: 3,
                entity: 'entity3',
                entitycoin: 300,
            },
        ];
		
        const skills = [
            {
				username: 'testagent1',
                skillname: 'natation',
				level: 3.4,
            },
        ];

        const diplomas = [
            {
				username: 'testagent1',
                diplomaname: 'Master Chimie',
            },
        ];	

        const projects = [
            {
				username: 'testagent1',
				projectname: 'Armageddon',
                startDay: '14/05/2019',
                endDay: '14/06/2019',
                participants: ['testagent2', 'testagent3'],
            },
        ];			

        for (let i = 1; i < agents.length; i++) {
            agents[i].docType = 'agent';
            await ctx.stub.putState('AGENT' + i, Buffer.from(JSON.stringify(agents[i])));
            console.info('Added <--> ', agents[i]);
        }
		
		for (let i = 1; i < skills.length; i++) {
            skills[i].docType = 'skill';
            await ctx.stub.putState('SKILL' + i, Buffer.from(JSON.stringify(skills[i])));
            console.info('Added <--> ', skills[i]);
        }
		
		for (let i = 1; i < diplomas.length; i++) {
            diplomas[i].docType = 'diploma';
            await ctx.stub.putState('DIPLOMA' + i, Buffer.from(JSON.stringify(diplomas[i])));
            console.info('Added <--> ', diplomas[i]);
        }
		
		for (let i = 1; i < projects.length; i++) {
            projects[i].docType = 'project';
            await ctx.stub.putState('PROJECT' + i, Buffer.from(JSON.stringify(projects[i])));
            console.info('Added <--> ', projects[i]);
        }
		
        console.info('============= END : Initialize Ledger ===========');
    }






    async queryAgent(ctx, agentNumber) {
        const agentAsBytes = await ctx.stub.getState(agentNumber); // get the agent from chaincode state
        if (!agentAsBytes || agentAsBytes.length === 0) {
            throw new Error(`${agentNumber} does not exist`);
        }
        console.log(agentAsBytes.toString());
        return agentAsBytes.toString();
    }
	
    async querySkill(ctx, skillNumber) {
        const skillAsBytes = await ctx.stub.getState(skillNumber); // get the skill from chaincode state
        if (!skillAsBytes || skillAsBytes.length === 0) {
            throw new Error(`${skillNumber} does not exist`);
        }
        console.log(skillAsBytes.toString());
        return skillAsBytes.toString();
    }	
	
    async queryDiploma(ctx, diplomaNumber) {
        const diplomaAsBytes = await ctx.stub.getState(diplomaNumber); // get the diploma from chaincode state
        if (!diplomaAsBytes || diplomaAsBytes.length === 0) {
            throw new Error(`${diplomaNumber} does not exist`);
        }
        console.log(diplomaAsBytes.toString());
        return diplomaAsBytes.toString();
    }	
	
    async queryProject(ctx, projectNumber) {
        const projectAsBytes = await ctx.stub.getState(projectNumber); // get the project from chaincode state
        if (!projectAsBytes || projectAsBytes.length === 0) {
            throw new Error(`${projectNumber} does not exist`);
        }
        console.log(projectAsBytes.toString());
        return projectAsBytes.toString();
    }	

	
	

	
    async createAgent(ctx, agentNumber, username, agentcoin, entity, entitycoin) {
        console.info('============= START : Create Agent ===========');

        const agent = {
			docType: 'agent',
            username,
            agentcoin,
            entity,
            entitycoin,
        };

        await ctx.stub.putState(agentNumber, Buffer.from(JSON.stringify(agent)));
        console.info('============= END : Create Agent ===========');
    }

    async createSkill(ctx, skillNumber, username, skillname, level) {
        console.info('============= START : Create Skill ===========');

        const skill = {
			docType: 'skill',
            username,
            skillname,
			level,
        };

        await ctx.stub.putState(skillNumber, Buffer.from(JSON.stringify(skill)));
        console.info('============= END : Create Skill ===========');
    }

    async createDiploma(ctx, skillNumber, username, diplomaname) {
        console.info('============= START : Create Diploma ===========');

        const diploma = {
			docType: 'diploma',
            username,
            diplomaname,
        };

        await ctx.stub.putState(diplomaNumber, Buffer.from(JSON.stringify(diploma)));
        console.info('============= END : Create Diploma ===========');
    }

    async createProject(ctx, projectNumber, projectname, startDay, endDay, participants) {
        console.info('============= START : Create Project ===========');

        const project = {
			docType: 'diploma',
            projectname,
            startDay,
			endDay,
			participants,
        };

        await ctx.stub.putState(projectNumber, Buffer.from(JSON.stringify(project)));
        console.info('============= END : Create Project ===========');
    }





    async queryAgents(ctx) {
        const startKey = 'AGENT0';
        const endKey = 'AGENT999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
	
	async querySkills(ctx) {
        const startKey = 'SKILL0';
        const endKey = 'SKILL999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
	
	async queryDiplomas(ctx) {
        const startKey = 'DIPLOMA0';
        const endKey = 'DIPLOMA999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
	
	async queryProject(ctx) {
        const startKey = 'PROJECT0';
        const endKey = 'PROJECT999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }





    async changeAgent(ctx, agentNumber, newagentcoin, newentity, newentitycoin) {
        console.info('============= START : changeAgent ===========');

        const agentAsBytes = await ctx.stub.getState(agentNumber); // get the agent from chaincode state
        if (!agentAsBytes || agentAsBytes.length === 0) {
            throw new Error(`${agentNumber} does not exist`);
        }
        const agent = JSON.parse(agentAsBytes.toString());
        agent.agentcoin = newagentcoin;
		agent.entity = newentity;
		agent.entitycoin = newentitycoin;

        await ctx.stub.putState(agentNumber, Buffer.from(JSON.stringify(agent)));
        console.info('============= END : changeAgent ===========');
    }
	
	async changeSkill(ctx, skillNumber, newskillname, newlevel) {
        console.info('============= START : changeSkill ===========');

        const skillAsBytes = await ctx.stub.getState(skillNumber); // get the skill from chaincode state
        if (!skillAsBytes || skillAsBytes.length === 0) {
            throw new Error(`${skillNumber} does not exist`);
        }
        const skill = JSON.parse(skillAsBytes.toString());
        skill.skillname = newskillname;
		skill.level = newlevel;

        await ctx.stub.putState(skillNumber, Buffer.from(JSON.stringify(skill)));
        console.info('============= END : changeSkill ===========');
    }
	
	async changeDiploma(ctx, diplomaNumber, newdiplomaname) {
        console.info('============= START : changeDiploma ===========');

        const diplomaAsBytes = await ctx.stub.getState(skillNumber); // get the diploma from chaincode state
        if (!diplomaAsBytes || diplomaAsBytes.length === 0) {
            throw new Error(`${diplomaNumber} does not exist`);
        }
        const diploma = JSON.parse(diplomaAsBytes.toString());
        diploma.diplomaname = newdiplomaname;

        await ctx.stub.putState(diplomaNumber, Buffer.from(JSON.stringify(diploma)));
        console.info('============= END : changeDiploma ===========');
    }
	
	async changeProject(ctx, projectNumber, newprojectname, newstartDay, newendDay, newparticipants) {
        console.info('============= START : changeProject ===========');

        const projectAsBytes = await ctx.stub.getState(skillNumber); // get the project from chaincode state
        if (!projectAsBytes || projectAsBytes.length === 0) {
            throw new Error(`${projectNumber} does not exist`);
        }
        const project = JSON.parse(projectAsBytes.toString());
        project.projectname = newprojectname;
		project.startDay = newstartDay;
		project.endDay = newendDay;
		project.participants = newparticipants;

        await ctx.stub.putState(projectNumber, Buffer.from(JSON.stringify(project)));
        console.info('============= END : changeProject ===========');
    }
}

module.exports = FabCar;
