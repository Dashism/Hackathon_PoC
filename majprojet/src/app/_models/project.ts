/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Skill } from './skill';

export class Project {
    public docType?: string;
    public projectid?: string;
    public username: string;
    public projectname: string;
    public description: string;
    public startdate: Date;
    public enddate: Date;
}
