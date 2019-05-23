namespace OSS.Charon
open Nancy
open Nancy.Extensions
open Nancy.ModelBinding
open Newtonsoft.Json
open Newtonsoft.Json
open Nancy
open Nancy
open Nancy

[<CLIMutable>]
type TaskResponse = {
    id: int
}

[<CLIMutable>]
type DeleteRequest = {
    id: int
}

type TaskModule() as this =
    inherit NancyModule()
    do
        
        this.Post("/tasks", fun _ ->
            let data = this.Request.Body.AsString()
            let json = JsonConvert.DeserializeObject<ProjectTask>(data)

            let id = DatabaseConnector.InsertTask(json)
            
            let response: TaskResponse = { id = id.AsInt32 }
            this.Response.AsJson(response)
        )
        
        this.Patch("/tasks", fun _ -> 
            let data = this.Request.Body.AsString()
            let json = JsonConvert.DeserializeObject<ProjectTask>(data)

            DatabaseConnector.UpdateTask(json) |> ignore
            
            let response: TaskResponse = { id = json.Id }
            this.Response.AsJson(response)
        )
        
        this.Get("/tasks", fun _ -> this.Response.AsJson(DatabaseConnector.RetrieveTasks()))
        
        this.Delete("/tasks", fun _ ->
            let data = this.Request.Body.AsString()
            let request = JsonConvert.DeserializeObject<DeleteRequest>(data)

            DatabaseConnector.DeleteTask(request.id) |> ignore
            
            let response: TaskResponse = { id = request.id }
            this.Response.AsJson(response)
        )