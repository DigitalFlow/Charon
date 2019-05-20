namespace OSS.Charon
    open Microsoft.AspNetCore.Hosting
    open System.IO

    module Main =
        open System
        open Microsoft.AspNetCore.Hosting

        [<EntryPoint>]
        let main argv =
            let host = WebHostBuilder().UseContentRoot(Directory.GetCurrentDirectory()).UseKestrel().UseStartup<Startup>().UseUrls("http://+:5000").Build();

            host.Run();
            0
                
