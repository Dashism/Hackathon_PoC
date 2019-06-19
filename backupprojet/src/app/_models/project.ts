/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Skill } from './skill';

export class Project {
    public projectname: string;
    public description: string;
    public skillList: Skill[];
    public startday: Date;
    public endday: Date;
}
