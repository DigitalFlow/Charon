namespace OSS.Charon

type AppConfiguration() =
    let mutable logging = true
    
    member this.Logging
        with get() = logging
        and set(value: bool) = logging <- logging