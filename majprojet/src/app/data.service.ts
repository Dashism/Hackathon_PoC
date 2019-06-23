/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class DataService<Type> {
    private resolveSuffix = '?resolve=true';
    private headers: Headers;
    private url = 'http://localhost:3000/api/';

    constructor(private http: HttpClient) {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        // this.headers.append('Access-Control-Allow-Origin', '*');
    }

    public getAll(ns: string): Observable<Type[]> {
        return this.http.get(this.url + ns)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public get(ns: string, id: string): Observable<Type> {
        return this.http.get(this.url + ns + '/' + id + this.resolveSuffix)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public add(ns: string, itemToCreate: Type): Observable<Type> {
        return this.http.post(this.url + ns, itemToCreate)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public update(ns: string, id: string, itemToUpdate: Type): Observable<Type> {
        return this.http.put(this.url + ns + '/' + id, itemToUpdate)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public delete(ns: string, id: string): Observable<Type> {
        return this.http.delete(this.url + ns + '/' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private handleError(error: any): Observable<string> {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';

        return throwError(errMsg);
    }

    private extractData(res: Response): any {
        return res;
    }

}
