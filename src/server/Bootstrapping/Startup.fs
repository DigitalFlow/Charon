namespace OSS.Charon

open Nancy.Owin;
open Microsoft.Extensions.Configuration
open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Hosting
open Microsoft.Extensions.Configuration

type Startup (env: IHostingEnvironment) =
    let builder = ConfigurationBuilder().AddJsonFile("appsettings.json").SetBasePath(env.ContentRootPath)
    let configuration = builder.Build()
   
    member this.Configure(app: IApplicationBuilder) =
        let appConfig = AppConfiguration();
        ConfigurationBinder.Bind(configuration, appConfig);

        app.UseOwin(fun x -> x.UseNancy(fun opt -> opt.Bootstrapper <- new Bootstrapper(appConfig)) |> ignore);
        |> ignore
