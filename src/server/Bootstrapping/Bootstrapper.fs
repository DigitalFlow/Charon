namespace OSS.Charon
open Nancy
open Nancy.TinyIoc
open Nancy.Configuration
open Nancy.Configuration

type Bootstrapper(appConfig: AppConfiguration) =
    inherit DefaultNancyBootstrapper()

    let _appConfig = appConfig;

    override this.Configure (env: INancyEnvironment) =
        env.Tracing(true, true)
        base.Configure(env)

    override this.ConfigureApplicationContainer (container: TinyIoCContainer) =
        base.ConfigureApplicationContainer(container);

        container.Register<AppConfiguration>(_appConfig) |> ignore;