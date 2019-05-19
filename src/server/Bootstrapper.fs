namespace OSS.Charon
open Nancy
open Nancy.TinyIoc

type Bootstrapper(appConfig: AppConfiguration) =
    inherit DefaultNancyBootstrapper()

    let _appConfig = appConfig;

    override this.ConfigureApplicationContainer (container: TinyIoCContainer) =
        base.ConfigureApplicationContainer(container);
        container.Register<AppConfiguration>(_appConfig) |> ignore;