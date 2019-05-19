namespace OSS.Charon

open LiteDB
open LiteDB.FSharp
open LiteDB

type DatabaseConnector private() =
    static member private Mapper = FSharpBsonMapper();
    static member private Db = new LiteDatabase("Charon.data.db", DatabaseConnector.Mapper)

    static member InsertTask (task: ProjectTask) =
        let tasks = DatabaseConnector.Db.GetCollection<ProjectTask>("tasks")
        tasks.Insert(task)

    static member UpdateTask (task: ProjectTask) =
        let tasks = DatabaseConnector.Db.GetCollection<ProjectTask>("tasks")
        let id = BsonValue(task.Id)
        tasks.Update(id, task)

    static member RetrieveTasks() =
        let tasks = DatabaseConnector.Db.GetCollection<ProjectTask>("tasks")
        tasks.FindAll()

    static member RetrieveById(id: int) =
        let tasks = DatabaseConnector.Db.GetCollection<ProjectTask>("tasks")
        tasks.FindById(BsonValue(id))
