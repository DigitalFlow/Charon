namespace OSS.Charon
open System

[<CLIMutable>]
type ProjectTask = {
    Id: int
    Name: string
    Description: string
    DueDate: DateTime option
    Order: int option
    Priority: int option
    Phase: int option
    ExternalUrl: string
    EstimatedTime: decimal option
    UsedTime: decimal option
}
