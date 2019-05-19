namespace OSS.Charon
open Nancy

type HomeModule() as this =
    inherit NancyModule()
    do
        this.Get("/", fun _ -> this.View.["index"])