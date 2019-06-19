/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Diploma } from './diploma';
import { Project } from './project';
import { Skill } from './skill';

export class Agent {
//    public docType?: string;
    public name: string;
    public lastname: string;
    public birthday: string;
    public agentcoin: number;
    public entity: string;
    public entitycoin: number;
    public skillList: Skill[];
    public projectList: Project[];
    public diplomaList: Diploma[];
    public username: string;
    public password: string;
}
