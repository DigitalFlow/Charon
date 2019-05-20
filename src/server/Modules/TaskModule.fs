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
    id: string
}

type TaskModule() as this =
    inherit NancyModule()
    do
        this.Post("/tasks", fun _ -> 
            let data = this.Request.Body.AsString()
            let json = JsonConvert.DeserializeObject<ProjectTask>(data)

            let id = DatabaseConnector.InsertTask(json)
            let response = { id = id.AsString }
            this.Response.AsJson(response)
        )
        this.Patch("/tasks", fun _ -> 
            let data = this.Request.Body.AsString()
            let json = JsonConvert.DeserializeObject<ProjectTask>(data)

            DatabaseConnector.UpdateTask(json) |> ignore
            
            let response = { id = json.Id.ToString() }
            this.Response.AsJson(response)
        )
        this.Get("/tasks", fun _ -> this.Response.AsJson(DatabaseConnector.RetrieveTasks()))