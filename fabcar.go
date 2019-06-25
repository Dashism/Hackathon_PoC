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
 
 // Define the car structure, with 4 properties.  Structure tags are used by encoding/json library
 type Car struct {
	 Make   string `json:"make"`
	 Model  string `json:"model"`
	 Colour string `json:"colour"`
	 Owner  string `json:"owner"`
 }
 
 type Agent struct {
	 Username    string `json:"ausername"`
	 Coin        string `json:"coin"`
	 Entity      string `json:"entity"`
	 Entitypoint string `json:"entitypoint"`
	 Point       string `json:"point"`
 }
 
 type Diploma struct {
	 Username    string `json:"ausername"`
	 Diplomaname string `json:"diplomaname"`
 }
 
 type Skill struct {
	 Username  string `json:"ausername"`
	 Skillname string `json:"skillname"`
	 Level     string `json:"level"`
	 Grade     string `json:"grade"`
 }
 
 type Project struct {
	 Username    string `json:"ausername"`
	 Projectname string `json:"projectname"`
	 Description string `json:"description"`
	 Startdate   string `json:"startdate"`
	 Enddate     string `json:"enddate"`
 }
 
 type Participant struct {
	 Projectname  string `json:"projectname"`
	 Username     string `json:"ausername"`
 }
 
 type Projectskill struct {
	 Projectname string `json:"projectname"`
	 Username 	string `json:"ausername"`
	 Skillname   string `json:"skillname"`
	 Level       string `json:"level"`
	 Grade		string `json:"grade"`
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
	 } else if function == "queryCar" {
		 return s.queryCar(APIstub, args)
	 } else if function == "createCar" {
		 return s.createCar(APIstub, args)
	 } else if function == "queryCars" {
		 return s.queryCars(APIstub)
	 } else if function == "changeCar" {
		 return s.changeCar(APIstub, args)
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
	 }
 
	 return shim.Error("Invalid Smart Contract function name.")
 }
 
 func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	 cars := []Car{
		 Car{Make: "Toyota", Model: "Prius", Colour: "blue", Owner: "Tomoko"},
		 Car{Make: "Ford", Model: "Mustang", Colour: "red", Owner: "Brad"},
		 Car{Make: "Hyundai", Model: "Tucson", Colour: "green", Owner: "Jin Soo"},
		 Car{Make: "Volkswagen", Model: "Passat", Colour: "yellow", Owner: "Max"},
		 Car{Make: "Tesla", Model: "S", Colour: "black", Owner: "Adriana"},
		 Car{Make: "Peugeot", Model: "205", Colour: "purple", Owner: "Michel"},
		 Car{Make: "Chery", Model: "S22L", Colour: "white", Owner: "Aarav"},
		 Car{Make: "Fiat", Model: "Punto", Colour: "violet", Owner: "Pari"},
		 Car{Make: "Tata", Model: "Nano", Colour: "indigo", Owner: "Valeria"},
		 Car{Make: "Holden", Model: "Barina", Colour: "brown", Owner: "Shotaro"},
	 }
 
	 i := 0
	 for i < len(cars) {
		 fmt.Println("i is ", i)
		 carAsBytes, _ := json.Marshal(cars[i])
		 APIstub.PutState("CAR"+strconv.Itoa(i), carAsBytes)
		 fmt.Println("Added", cars[i])
		 i = i + 1
	 }
 
	 return shim.Success(nil)
 }
 
 
 
 
 
 func (s *SmartContract) queryCar(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 1 {
		 return shim.Error("Incorrect number of arguments. Expecting 1")
	 }
 
	 carAsBytes, _ := APIstub.GetState(args[0])
	 return shim.Success(carAsBytes)
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
 
 
 
 
 
 
 
 func (s *SmartContract) createCar(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 5 {
		 return shim.Error("Incorrect number of arguments. Expecting 5")
	 }
 
	 var car = Car {
        Make: args[1],
        Model: args[2],
        Colour: args[3],
        Owner: args[4]}
	
	 carAsBytes, _ := json.Marshal(car)
	 APIstub.PutState(args[0], carAsBytes)
 
	 return shim.Success(nil)
 }
 
 func (s *SmartContract) createAgent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 6 {
		 return shim.Error("Incorrect number of arguments. Expecting 6")
	 }
 
	 var agent = Agent {
        Username: args[1],
        Coin: args[2],
        Entity: args[3],
        Entitypoint: args[4],
        Point: args[5]}
	
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
 
	 if len(args) != 6 {
		 return shim.Error("Incorrect number of arguments. Expecting 6")
	 }
 
	 var project = Project {
        Username: args[1],
        Projectname: args[2],
        Description: args[3],
        Startdate: args[4],
        Enddate: args[5]}
	
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
        Skillname: args[2],
        Level: args[3],
        Grade: args[4]}
	
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
 
 
 
 
 
 func (s *SmartContract) changeCar(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 5 {
		 return shim.Error("Incorrect number of arguments. Expecting 5")
	 }
 
	 carAsBytes, _ := APIstub.GetState(args[0])
	 car := Car{}
 
	 json.Unmarshal(carAsBytes, &car)
	 car.Make = args[1]
	 car.Model = args[2]
	 car.Colour = args[3]
	 car.Owner = args[4]
 
	 carAsBytes, _ = json.Marshal(car)
	 APIstub.PutState(args[0], carAsBytes)
 
	 return shim.Success(nil)
 }
 
 func (s *SmartContract) changeAgent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 6 {
		 return shim.Error("Incorrect number of arguments. Expecting 6")
	 }
 
	 agentAsBytes, _ := APIstub.GetState(args[0])
	 agent := Agent{}
 
	 json.Unmarshal(agentAsBytes, &agent)
	 agent.Username = args[1]
	 agent.Coin = args[2]
	 agent.Entity = args[3]
	 agent.Entitypoint = args[4]
	 agent.Point = args[5]
 
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
 
	 if len(args) != 6 {
		 return shim.Error("Incorrect number of arguments. Expecting 6")
	 }
 
	 projectAsBytes, _ := APIstub.GetState(args[0])
	 project := Project{}
 
	 json.Unmarshal(projectAsBytes, &project)
	 project.Username = args[1]
	 project.Projectname = args[2]
	 project.Description = args[3]
	 project.Startdate = args[4]
	 project.Enddate = args[5]
 
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
	 projectskill.Username = args[1]
	 projectskill.Skillname = args[2]
	 projectskill.Level = args[3]
	 projectskill.Grade = args[4]
 
	 projectskillAsBytes, _ = json.Marshal(projectskill)
	 APIstub.PutState(args[0], projectskillAsBytes)
 
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
 