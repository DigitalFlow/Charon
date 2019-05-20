namespace OSS.Charon
open System

[<CLIMutable>]
type ProjectTask = {
    Id: int
    Name: string
    Description: string
    ExternalUrl: string
    DueDate: DateTime option
    EstimatedTime: decimal option
    UsedTime: decimal option
    Order: int option
    Priority: int option
    Phase: string
}
