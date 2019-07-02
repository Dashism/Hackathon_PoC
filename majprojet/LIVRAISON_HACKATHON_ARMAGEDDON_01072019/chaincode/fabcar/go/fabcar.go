/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * The sample smart contract for documentation topic:
 * Writing Your First Blockchain Application
 */

 package main

 /* Imports
  * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
  * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
  */
 import (
	 "bytes"
	 "encoding/json"
	 "fmt"
	 "strconv"
 
	 "github.com/hyperledger/fabric/core/chaincode/shim"
	 sc "github.com/hyperledger/fabric/protos/peer"
 )
 
 // Define the Smart Contract structure
 type SmartContract struct {
 }
 
 // Define the structures, with * properties.  Structure tags are used by encoding/json library
 
 type Agent struct {
	 Username    string `json:"ausername"`
	 Coin        string `json:"coin"`
	 Entity      string `json:"entity"`
	 Entitypoint string `json:"entitypoint"`
	 Point       string `json:"point"`
	 Startdate   string `json:"startdate"`
	 Enddate     string `json:"enddate"`
 }
 
 type Diploma struct {
	 Username    string `json:"ausername"`
	 Diplomaname string `json:"diplomaname"`
 }
 
 type Skill struct {
	 Username  string `json:"ausername"`
	 Skillname string `json:"bskillname"`
	 Level     string `json:"clevel"`
	 Grade     string `json:"grade"`
 }
 
 type Project struct {
	 Username    string `json:"ausername"`
	 Projectname string `json:"projectname"`
	 Description string `json:"description"`
	 Startdate   string `json:"startdate"`
	 Enddate     string `json:"enddate"`
	 Finish		 string `json:"finish"`
 }
 
 type Participant struct {
	 Projectname  string `json:"projectname"`
	 Username     string `json:"ausername"`
 }
 
 type Projectskill struct {
	 Projectname string `json:"projectname"`
	 Username 	 string `json:"ausername"`
	 Skillname   string `json:"bskillname"`
	 Level       string `json:"clevel"`
 }
 
 /*
  * The Init method is called when the Smart Contract "fabcar" is instantiated by the blockchain network
  * Best practice is to have any Ledger initialization in separate function -- see initLedger()
  */
 func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	 return shim.Success(nil)
 }
 
 /*
  * The Invoke method is called as a result of an application request to run the Smart Contract "fabcar"
  * The calling application program has also specified the particular smart contract function to be called, with arguments
  */
 func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
 
	 // Retrieve the requested Smart Contract function and arguments
	 function, args := APIstub.GetFunctionAndParameters()
	 // Route to the appropriate handler function to interact with the ledger appropriately
	 if function == "initLedger" {
		 return s.initLedger(APIstub)
	 } else if function == "queryAgent" {
		 return s.queryAgent(APIstub, args)
	 } else if function == "createAgent" {
		 return s.createAgent(APIstub, args)
	 } else if function == "queryAgents" {
		 return s.queryAgents(APIstub)
	 } else if function == "changeAgent" {
		 return s.changeAgent(APIstub, args)
	 } else if function == "queryDiploma" {
		 return s.queryDiploma(APIstub, args)
	 } else if function == "createDiploma" {
		 return s.createDiploma(APIstub, args)
	 } else if function == "queryDiplomas" {
		 return s.queryDiplomas(APIstub)
	 } else if function == "changeDiploma" {
		 return s.changeDiploma(APIstub, args)
	 } else if function == "querySkill" {
		 return s.querySkill(APIstub, args)
	 } else if function == "createSkill" {
		 return s.createSkill(APIstub, args)
	 } else if function == "querySkills" {
		 return s.querySkills(APIstub)
	 } else if function == "changeSkill" {
		 return s.changeSkill(APIstub, args)
	 } else if function == "queryProject" {
		 return s.queryProject(APIstub, args)
	 } else if function == "createProject" {
		 return s.createProject(APIstub, args)
	 } else if function == "queryProjects" {
		 return s.queryProjects(APIstub)
	 } else if function == "changeProject" {
		 return s.changeProject(APIstub, args)
	 } else if function == "queryParticipant" {
		 return s.queryParticipant(APIstub, args)
	 } else if function == "createParticipant" {
		 return s.createParticipant(APIstub, args)
	 } else if function == "queryParticipants" {
		 return s.queryParticipants(APIstub)
	 } else if function == "changeParticipant" {
		 return s.changeParticipant(APIstub, args)
	 } else if function == "queryProjectskill" {
		 return s.queryProjectskill(APIstub, args)
	 } else if function == "createProjectskill" {
		 return s.createProjectskill(APIstub, args)
	 } else if function == "queryProjectskills" {
		 return s.queryProjectskills(APIstub)
	 } else if function == "changeProjectskill" {
		 return s.changeProjectskill(APIstub, args)
	 } else if function == "delete" {
		 return s.delete(APIstub, args)
	 }
 
	 return shim.Error("Invalid Smart Contract function name.")
 }
 
 func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
 	 agents := []Agent{
		 Agent{Username: "Thomas", Coin: "3", Entity: "", Entitypoint: "", Point: "0", Startdate: "2019-06-30T22:00:00.000Z", Enddate:"2019-07-30T22:00:00.000Z"},
		 Agent{Username: "Pierre", Coin: "3", Entity: "44", Entitypoint: "7", Point: "0", Startdate: "2019-06-30T22:00:00.000Z", Enddate:"2019-07-30T22:00:00.000Z"},
		 Agent{Username: "Mathilde", Coin: "3", Entity: "66", Entitypoint: "18", Point: "0", Startdate: "2019-06-30T22:00:00.000Z", Enddate:"2019-07-30T22:00:00.000Z"},
	 }
 
 	 a := 0
	 for a < len(agents) {
		 fmt.Println("a is ", a)
		 agentAsBytes, _ := json.Marshal(agents[a])
		 APIstub.PutState("AGENT"+strconv.Itoa(a), agentAsBytes)
		 fmt.Println("Added", agents[a])
		 a = a + 1
	 }
 
  	 diplomas := []Diploma{
		 Diploma{Username: "Thomas", Diplomaname: "CAP Mécanique"},
		 Diploma{Username: "Pierre", Diplomaname: "Master Informatique"},
		 Diploma{Username: "Pierre", Diplomaname: "Licence Informatique"},
		 Diploma{Username: "Mathilde", Diplomaname: "Licence Communication"},
	 }
 
 	 b := 0
	 for b < len(diplomas) {
		 fmt.Println("b is ", b)
		 diplomaAsBytes, _ := json.Marshal(diplomas[b])
		 APIstub.PutState("DIPLOMA"+strconv.Itoa(b), diplomaAsBytes)
		 fmt.Println("Added", diplomas[b])
		 b = b + 1
	 }
 
	 skills := []Skill{
		 Skill{Username: "Thomas", Skillname: "Mécanique", Level: "3", Grade: ""},
		 Skill{Username: "Pierre", Skillname: "Informatique", Level: "5", Grade: ""},
		 Skill{Username: "Mathilde", Skillname: "Communication", Level: "4", Grade: ""},			 
	 }
 
 	 c := 0
	 for c < len(skills) {
		 fmt.Println("c is ", c)
		 skillAsBytes, _ := json.Marshal(skills[c])
		 APIstub.PutState("SKILL"+strconv.Itoa(c), skillAsBytes)
		 fmt.Println("Added", skills[c])
		 c = c + 1
	 }
 
 	 projects := []Project{
		 Project{Username: "Thomas", Projectname: "Apprentissage informatique et aide pour une présentation", Description: "L’objectif est d'être capable de : concevoir un algorithme répondant à un problème précisément posé, traduire en Python un algorithme en pseudocode comparer de façon expérimentale les vitesses de convergence de différents algorithmes. Faire une présentation sur ce sujet", Startdate: "Wed Jun 26 2019 00:00:00 GMT+0200 (Central European Summer Time)", Enddate:"Sat Jun 29 2019 00:00:00 GMT+0200 (Central European Summer Time)", Finish:"0"},	 
	 }
 
 	 d := 0
	 for d < len(projects) {
		 fmt.Println("d is ", d)
		 projectAsBytes, _ := json.Marshal(projects[d])
		 APIstub.PutState("PROJECT"+strconv.Itoa(d), projectAsBytes)
		 fmt.Println("Added", projects[d])
		 d = d + 1
	 }
 
  	 participants := []Participant{
		 Participant{Projectname: "Apprentissage informatique et aide pour une présentation", Username: "Pierre"},	 
		 Participant{Projectname: "Apprentissage informatique et aide pour une présentation", Username: "Mathilde"},	
	 }
 
 	 e := 0
	 for e < len(participants) {
		 fmt.Println("e is ", e)
		 participantAsBytes, _ := json.Marshal(participants[e])
		 APIstub.PutState("PARTICIPANT"+strconv.Itoa(e), participantAsBytes)
		 fmt.Println("Added", participants[e])
		 e = e + 1
	 }
	 
	 projectskills := []Projectskill{
		 Projectskill{Projectname: "Apprentissage informatique et aide pour une présentation", Username: "Pierre", Skillname: "Informatique", Level: "5"},	 
		 Projectskill{Projectname: "Apprentissage informatique et aide pour une présentation", Username: "Mathilde", Skillname: "Communication", Level: "4"},	
	 }
 
 	 i := 0
	 for i < len(projectskills) {
		 fmt.Println("i is ", i)
		 projectskillAsBytes, _ := json.Marshal(projectskills[i])
		 APIstub.PutState("PROJECTSKILL"+strconv.Itoa(i), projectskillAsBytes)
		 fmt.Println("Added", projectskills[i])
		 i = i + 1
	 }
 
	 return shim.Success(nil)
 }
 
 
 
 
 
 func (s *SmartContract) queryAgent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 1 {
		 return shim.Error("Incorrect number of arguments. Expecting 1")
	 }
 
	 agentAsBytes, _ := APIstub.GetState(args[0])
	 return shim.Success(agentAsBytes)
 }
 
 func (s *SmartContract) queryDiploma(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 1 {
		 return shim.Error("Incorrect number of arguments. Expecting 1")
	 }
 
	 diplomaAsBytes, _ := APIstub.GetState(args[0])
	 return shim.Success(diplomaAsBytes)
 }
 
 func (s *SmartContract) querySkill(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 1 {
		 return shim.Error("Incorrect number of arguments. Expecting 1")
	 }
 
	 skillAsBytes, _ := APIstub.GetState(args[0])
	 return shim.Success(skillAsBytes)
 }
 
 func (s *SmartContract) queryProject(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 1 {
		 return shim.Error("Incorrect number of arguments. Expecting 1")
	 }
 
	 projectAsBytes, _ := APIstub.GetState(args[0])
	 return shim.Success(projectAsBytes)
 }
 
 func (s *SmartContract) queryParticipant(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 1 {
		 return shim.Error("Incorrect number of arguments. Expecting 1")
	 }
 
	 participantAsBytes, _ := APIstub.GetState(args[0])
	 return shim.Success(participantAsBytes)
 }
 
 func (s *SmartContract) queryProjectskill(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 1 {
		 return shim.Error("Incorrect number of arguments. Expecting 1")
	 }
 
	 projectskillAsBytes, _ := APIstub.GetState(args[0])
	 return shim.Success(projectskillAsBytes)
 }
 
 
 
 
 
 
 
 func (s *SmartContract) createAgent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 8 {
		 return shim.Error("Incorrect number of arguments. Expecting 8")
	 }
 
	 var agent = Agent {
        Username: args[1],
        Coin: args[2],
        Entity: args[3],
        Entitypoint: args[4],
        Point: args[5],
		Startdate: args[6],
		Enddate: args[7]}
	
	 agentAsBytes, _ := json.Marshal(agent)
	 APIstub.PutState(args[0], agentAsBytes)
 
	 return shim.Success(nil)
 }
 
 func (s *SmartContract) createDiploma(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 3 {
		 return shim.Error("Incorrect number of arguments. Expecting 3")
	 }
 
	 var diploma = Diploma {
        Username: args[1],
		Diplomaname: args[2]}
	
	 diplomaAsBytes, _ := json.Marshal(diploma)
	 APIstub.PutState(args[0], diplomaAsBytes)
 
	 return shim.Success(nil)
 }
 
 func (s *SmartContract) createSkill(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 5 {
		 return shim.Error("Incorrect number of arguments. Expecting 5")
	 }
 
	 var skill = Skill {
        Username: args[1],
        Skillname: args[2],
        Level: args[3],
        Grade: args[4]}
	
	 skillAsBytes, _ := json.Marshal(skill)
	 APIstub.PutState(args[0], skillAsBytes)
 
	 return shim.Success(nil)
 }
 
 func (s *SmartContract) createProject(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 7 {
		 return shim.Error("Incorrect number of arguments. Expecting 7")
	 }
 
	 var project = Project {
        Username: args[1],
        Projectname: args[2],
        Description: args[3],
        Startdate: args[4],
        Enddate: args[5],
		Finish: args[6]}
	
	 projectAsBytes, _ := json.Marshal(project)
	 APIstub.PutState(args[0], projectAsBytes)
 
	 return shim.Success(nil)
 }
 
 func (s *SmartContract) createParticipant(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 3 {
		 return shim.Error("Incorrect number of arguments. Expecting 3")
	 }
 
	 var participant = Participant {
        Projectname: args[1],
        Username: args[2]}
	
	 participantAsBytes, _ := json.Marshal(participant)
	 APIstub.PutState(args[0], participantAsBytes)
 
	 return shim.Success(nil)
 }
 
 func (s *SmartContract) createProjectskill(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 5 {
		 return shim.Error("Incorrect number of arguments. Expecting 5")
	 }
 
	 var projectskill = Projectskill {
        Projectname: args[1],
		Username: args[2],
        Skillname: args[3],
        Level: args[4]}
	
	 projectskillAsBytes, _ := json.Marshal(projectskill)
	 APIstub.PutState(args[0], projectskillAsBytes)
 
	 return shim.Success(nil)
 }
 
 
 
 
 
 func (s *SmartContract) queryCars(APIstub shim.ChaincodeStubInterface) sc.Response {
 
	 startKey := "CAR0"
	 endKey := "CAR999"
 
	 resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	 if err != nil {
		 return shim.Error(err.Error())
	 }
	 defer resultsIterator.Close()
 
	 // buffer is a JSON array containing QueryResults
	 var buffer bytes.Buffer
	 buffer.WriteString("[")
 
	 bArrayMemberAlreadyWritten := false
	 for resultsIterator.HasNext() {
		 queryResponse, err := resultsIterator.Next()
		 if err != nil {
			 return shim.Error(err.Error())
		 }
		 // Add a comma before array members, suppress it for the first array member
		 if bArrayMemberAlreadyWritten == true {
			 buffer.WriteString(",")
		 }
		 buffer.WriteString("{\"Key\":")
		 buffer.WriteString("\"")
		 buffer.WriteString(queryResponse.Key)
		 buffer.WriteString("\"")
 
		 buffer.WriteString(", \"Record\":")
		 // Record is a JSON object, so we write as-is
		 buffer.WriteString(string(queryResponse.Value))
		 buffer.WriteString("}")
		 bArrayMemberAlreadyWritten = true
	 }
	 buffer.WriteString("]")
 
	 fmt.Printf("- queryCars:\n%s\n", buffer.String())
 
	 return shim.Success(buffer.Bytes())
 }
 
 func (s *SmartContract) queryAgents(APIstub shim.ChaincodeStubInterface) sc.Response {
 
	 startKey := "AGENT0"
	 endKey := "AGENT999"
 
	 resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	 if err != nil {
		 return shim.Error(err.Error())
	 }
	 defer resultsIterator.Close()
 
	 // buffer is a JSON array containing QueryResults
	 var buffer bytes.Buffer
	 buffer.WriteString("[")
 
	 bArrayMemberAlreadyWritten := false
	 for resultsIterator.HasNext() {
		 queryResponse, err := resultsIterator.Next()
		 if err != nil {
			 return shim.Error(err.Error())
		 }
		 // Add a comma before array members, suppress it for the first array member
		 if bArrayMemberAlreadyWritten == true {
			 buffer.WriteString(",")
		 }
		 buffer.WriteString("{\"Key\":")
		 buffer.WriteString("\"")
		 buffer.WriteString(queryResponse.Key)
		 buffer.WriteString("\"")
 
		 buffer.WriteString(", \"Record\":")
		 // Record is a JSON object, so we write as-is
		 buffer.WriteString(string(queryResponse.Value))
		 buffer.WriteString("}")
		 bArrayMemberAlreadyWritten = true
	 }
	 buffer.WriteString("]")
 
	 fmt.Printf("- queryAgents:\n%s\n", buffer.String())
 
	 return shim.Success(buffer.Bytes())
 }
 
 func (s *SmartContract) queryDiplomas(APIstub shim.ChaincodeStubInterface) sc.Response {
 
	 startKey := "DIPLOMA0"
	 endKey := "DIPLOMA999"
 
	 resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	 if err != nil {
		 return shim.Error(err.Error())
	 }
	 defer resultsIterator.Close()
 
	 // buffer is a JSON array containing QueryResults
	 var buffer bytes.Buffer
	 buffer.WriteString("[")
 
	 bArrayMemberAlreadyWritten := false
	 for resultsIterator.HasNext() {
		 queryResponse, err := resultsIterator.Next()
		 if err != nil {
			 return shim.Error(err.Error())
		 }
		 // Add a comma before array members, suppress it for the first array member
		 if bArrayMemberAlreadyWritten == true {
			 buffer.WriteString(",")
		 }
		 buffer.WriteString("{\"Key\":")
		 buffer.WriteString("\"")
		 buffer.WriteString(queryResponse.Key)
		 buffer.WriteString("\"")
 
		 buffer.WriteString(", \"Record\":")
		 // Record is a JSON object, so we write as-is
		 buffer.WriteString(string(queryResponse.Value))
		 buffer.WriteString("}")
		 bArrayMemberAlreadyWritten = true
	 }
	 buffer.WriteString("]")
 
	 fmt.Printf("- queryDiplomas:\n%s\n", buffer.String())
 
	 return shim.Success(buffer.Bytes())
 }
 
 func (s *SmartContract) querySkills(APIstub shim.ChaincodeStubInterface) sc.Response {
 
	 startKey := "SKILL0"
	 endKey := "SKILL999"
 
	 resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	 if err != nil {
		 return shim.Error(err.Error())
	 }
	 defer resultsIterator.Close()
 
	 // buffer is a JSON array containing QueryResults
	 var buffer bytes.Buffer
	 buffer.WriteString("[")
 
	 bArrayMemberAlreadyWritten := false
	 for resultsIterator.HasNext() {
		 queryResponse, err := resultsIterator.Next()
		 if err != nil {
			 return shim.Error(err.Error())
		 }
		 // Add a comma before array members, suppress it for the first array member
		 if bArrayMemberAlreadyWritten == true {
			 buffer.WriteString(",")
		 }
		 buffer.WriteString("{\"Key\":")
		 buffer.WriteString("\"")
		 buffer.WriteString(queryResponse.Key)
		 buffer.WriteString("\"")
 
		 buffer.WriteString(", \"Record\":")
		 // Record is a JSON object, so we write as-is
		 buffer.WriteString(string(queryResponse.Value))
		 buffer.WriteString("}")
		 bArrayMemberAlreadyWritten = true
	 }
	 buffer.WriteString("]")
 
	 fmt.Printf("- querySkills:\n%s\n", buffer.String())
 
	 return shim.Success(buffer.Bytes())
 }
 
 func (s *SmartContract) queryProjects(APIstub shim.ChaincodeStubInterface) sc.Response {
 
	 startKey := "PROJECT0"
	 endKey := "PROJECT999"
 
	 resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	 if err != nil {
		 return shim.Error(err.Error())
	 }
	 defer resultsIterator.Close()
 
	 // buffer is a JSON array containing QueryResults
	 var buffer bytes.Buffer
	 buffer.WriteString("[")
 
	 bArrayMemberAlreadyWritten := false
	 for resultsIterator.HasNext() {
		 queryResponse, err := resultsIterator.Next()
		 if err != nil {
			 return shim.Error(err.Error())
		 }
		 // Add a comma before array members, suppress it for the first array member
		 if bArrayMemberAlreadyWritten == true {
			 buffer.WriteString(",")
		 }
		 buffer.WriteString("{\"Key\":")
		 buffer.WriteString("\"")
		 buffer.WriteString(queryResponse.Key)
		 buffer.WriteString("\"")
 
		 buffer.WriteString(", \"Record\":")
		 // Record is a JSON object, so we write as-is
		 buffer.WriteString(string(queryResponse.Value))
		 buffer.WriteString("}")
		 bArrayMemberAlreadyWritten = true
	 }
	 buffer.WriteString("]")
 
	 fmt.Printf("- queryProjects:\n%s\n", buffer.String())
 
	 return shim.Success(buffer.Bytes())
 }
 
 func (s *SmartContract) queryParticipants(APIstub shim.ChaincodeStubInterface) sc.Response {
 
	 startKey := "PARTICIPANT0"
	 endKey := "PARTICIPANT999"
 
	 resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	 if err != nil {
		 return shim.Error(err.Error())
	 }
	 defer resultsIterator.Close()
 
	 // buffer is a JSON array containing QueryResults
	 var buffer bytes.Buffer
	 buffer.WriteString("[")
 
	 bArrayMemberAlreadyWritten := false
	 for resultsIterator.HasNext() {
		 queryResponse, err := resultsIterator.Next()
		 if err != nil {
			 return shim.Error(err.Error())
		 }
		 // Add a comma before array members, suppress it for the first array member
		 if bArrayMemberAlreadyWritten == true {
			 buffer.WriteString(",")
		 }
		 buffer.WriteString("{\"Key\":")
		 buffer.WriteString("\"")
		 buffer.WriteString(queryResponse.Key)
		 buffer.WriteString("\"")
 
		 buffer.WriteString(", \"Record\":")
		 // Record is a JSON object, so we write as-is
		 buffer.WriteString(string(queryResponse.Value))
		 buffer.WriteString("}")
		 bArrayMemberAlreadyWritten = true
	 }
	 buffer.WriteString("]")
 
	 fmt.Printf("- queryParticipants:\n%s\n", buffer.String())
 
	 return shim.Success(buffer.Bytes())
 }
 
 func (s *SmartContract) queryProjectskills(APIstub shim.ChaincodeStubInterface) sc.Response {
 
	 startKey := "PROJECTSKILL0"
	 endKey := "PROJECTSKILL999"
 
	 resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	 if err != nil {
		 return shim.Error(err.Error())
	 }
	 defer resultsIterator.Close()
 
	 // buffer is a JSON array containing QueryResults
	 var buffer bytes.Buffer
	 buffer.WriteString("[")
 
	 bArrayMemberAlreadyWritten := false
	 for resultsIterator.HasNext() {
		 queryResponse, err := resultsIterator.Next()
		 if err != nil {
			 return shim.Error(err.Error())
		 }
		 // Add a comma before array members, suppress it for the first array member
		 if bArrayMemberAlreadyWritten == true {
			 buffer.WriteString(",")
		 }
		 buffer.WriteString("{\"Key\":")
		 buffer.WriteString("\"")
		 buffer.WriteString(queryResponse.Key)
		 buffer.WriteString("\"")
 
		 buffer.WriteString(", \"Record\":")
		 // Record is a JSON object, so we write as-is
		 buffer.WriteString(string(queryResponse.Value))
		 buffer.WriteString("}")
		 bArrayMemberAlreadyWritten = true
	 }
	 buffer.WriteString("]")
 
	 fmt.Printf("- queryProjectskills:\n%s\n", buffer.String())
 
	 return shim.Success(buffer.Bytes())
 }
 
 
 
 
 
 
 func (s *SmartContract) changeAgent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 8 {
		 return shim.Error("Incorrect number of arguments. Expecting 8")
	 }
 
	 agentAsBytes, _ := APIstub.GetState(args[0])
	 agent := Agent{}
 
	 json.Unmarshal(agentAsBytes, &agent)
	 agent.Username = args[1]
	 agent.Coin = args[2]
	 agent.Entity = args[3]
	 agent.Entitypoint = args[4]
	 agent.Point = args[5]
	 agent.Startdate = args[6]
	 agent.Enddate = args[7]
 
	 agentAsBytes, _ = json.Marshal(agent)
	 APIstub.PutState(args[0], agentAsBytes)
 
	 return shim.Success(nil)
 }
 
 func (s *SmartContract) changeDiploma(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 3 {
		 return shim.Error("Incorrect number of arguments. Expecting 3")
	 }
 
	 diplomaAsBytes, _ := APIstub.GetState(args[0])
	 diploma := Diploma{}
 
	 json.Unmarshal(diplomaAsBytes, &diploma)
	 diploma.Username = args[1]
	 diploma.Diplomaname = args[2]
 
	 diplomaAsBytes, _ = json.Marshal(diploma)
	 APIstub.PutState(args[0], diplomaAsBytes)
 
	 return shim.Success(nil)
 }
 
 func (s *SmartContract) changeSkill(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 5 {
		 return shim.Error("Incorrect number of arguments. Expecting 5")
	 }
 
	 skillAsBytes, _ := APIstub.GetState(args[0])
	 skill := Skill{}
 
	 json.Unmarshal(skillAsBytes, &skill)
	 skill.Username = args[1]
	 skill.Skillname = args[2]
	 skill.Level = args[3]
	 skill.Grade = args[4]
 
	 skillAsBytes, _ = json.Marshal(skill)
	 APIstub.PutState(args[0], skillAsBytes)
 
	 return shim.Success(nil)
 }
 
 func (s *SmartContract) changeProject(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 7 {
		 return shim.Error("Incorrect number of arguments. Expecting 7")
	 }
 
	 projectAsBytes, _ := APIstub.GetState(args[0])
	 project := Project{}
 
	 json.Unmarshal(projectAsBytes, &project)
	 project.Username = args[1]
	 project.Projectname = args[2]
	 project.Description = args[3]
	 project.Startdate = args[4]
	 project.Enddate = args[5]
	 project.Finish = args[6]
 
	 projectAsBytes, _ = json.Marshal(project)
	 APIstub.PutState(args[0], projectAsBytes)
 
	 return shim.Success(nil)
 }
 
 func (s *SmartContract) changeParticipant(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 3 {
		 return shim.Error("Incorrect number of arguments. Expecting 3")
	 }
 
	 participantAsBytes, _ := APIstub.GetState(args[0])
	 participant := Participant{}
 
	 json.Unmarshal(participantAsBytes, &participant)
	 participant.Projectname = args[1]
	 participant.Username = args[2]
 
	 participantAsBytes, _ = json.Marshal(participant)
	 APIstub.PutState(args[0], participantAsBytes)
 
	 return shim.Success(nil)
 }
 
 func (s *SmartContract) changeProjectskill(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 5 {
		 return shim.Error("Incorrect number of arguments. Expecting 5")
	 }
 
	 projectskillAsBytes, _ := APIstub.GetState(args[0])
	 projectskill := Projectskill{}
 
	 json.Unmarshal(projectskillAsBytes, &projectskill)
	 projectskill.Projectname = args[1]
	 projectskill.Username = args[2]
	 projectskill.Skillname = args[3]
	 projectskill.Level = args[4]
 
	 projectskillAsBytes, _ = json.Marshal(projectskill)
	 APIstub.PutState(args[0], projectskillAsBytes)
 
	 return shim.Success(nil)
 }
 
 
 
 
 
  func (s *SmartContract) delete(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 1 {
		 return shim.Error("Incorrect number of arguments. Expecting 1")
	 }
 
	 APIstub.DelState(args[0])
	 return shim.Success(nil)
 }
 
 
 
 // The main function is only relevant in unit test mode. Only included here for completeness.
 func main() {
 
	 // Create a new Smart Contract
	 err := shim.Start(new(SmartContract))
	 if err != nil {
		 fmt.Printf("Error creating new Smart Contract: %s", err)
	 }
 }
 