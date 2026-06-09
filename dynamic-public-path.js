class DynamicPublicPathPlugin {
  /**
   * The Webpack hook to apply our plugin.
   * @parem {Object} compiler - The Webpack compiler.
   */
  apply(compiler) {
    compiler.hooks.make.tap("MutateRuntime", (compilation) => {
      compilation.hooks.runtimeModule.tap("MutateRuntime", (module, chunk) => {
        const isPublicPathRuntimeModule = module.constructor.name === "PublicPathRuntimeModule";
        if (!isPublicPathRuntimeModule) {
          return;
        }
        console.log(`* Update "${chunk.name}" dynamic public path`);
        // We extract the variable "key" (the namespace to left of the equals sign)
        // and leave the rest behind as we are going to build our own new value
        // and assign it back to the variable.
        const [key] = module.getGeneratedCode().split("=");
        module._cachedGeneratedCode = `${key}=(function() {
          const wcVersions = sessionStorage.getItem('wcVersions') !== null ? JSON.parse(sessionStorage.getItem('wcVersions')) : [];
          const app_url = sessionStorage.getItem('app_url');
          let isHigherLifeCycle = false;
          let wc_url = "";
          let publicPath;

          if (app_url !== null && app_url.length > 0) {
            if (sessionStorage.getItem("serviceClients")) {
              let serviceClientsNewobj = JSON.parse(sessionStorage.getItem("serviceClients"));
              if (serviceClientsNewobj && serviceClientsNewobj.clientsetup && serviceClientsNewobj.clientsetup.activeProfile) {
                  if (serviceClientsNewobj.clientsetup.activeProfile === "int") {
                    isHigherLifeCycle = false;
                  } else {
                    isHigherLifeCycle = true;
                  }
              }
            }          
            const urlArr = app_url.split("/");            
            if (urlArr.length >= 3) {
              wc_url = urlArr[0] + "//" + urlArr[2];
            }
            if (isHigherLifeCycle) {
              let version;
              if (wcVersions) {
                  let keys = Object.keys(wcVersions);
                  for (let i = 0; i < keys.length; i++) {
                      if (keys[i] === 'retirement-election-wc') {
                          version = wcVersions[keys[i]];
                      }
                  }
              }
              if (version) {
                let finalUrl = app_url.split("/UPoint");
                publicPath = finalUrl[0] + "/UPoint/UPN-WC/" + 'retirement-election-wc' + "/" + version + "/MF/";
              }
            } else {
              let appVersionNumbr;
              let hybridAppVersionNumbr = document.getElementsByTagName("al-app-wc");
              let afAppVersionNumbr = document.getElementsByTagName("al-app");
              if (hybridAppVersionNumbr && hybridAppVersionNumbr.length > 0) {
                  appVersionNumbr = hybridAppVersionNumbr[0].getAttribute("ng-version");
              }
              if (afAppVersionNumbr && afAppVersionNumbr.length > 0) {
                  appVersionNumbr = afAppVersionNumbr[0].getAttribute("ng-version");
              }
              if (appVersionNumbr) {
                  let majorVersion = parseInt(appVersionNumbr);
                  if (majorVersion >= 11) {
                    publicPath = wc_url + "/" + "NG" + majorVersion + "/" + 'retirement-election-wc' + "/MF/";
                  }
              } else {
                    publicPath = wc_url + "/NG18/" + 'retirement-election-wc' + "/MF/";
              }
            }
          }     
          return publicPath;
        })();`
        return module;
      });
    });
  }
}
module.exports = DynamicPublicPathPlugin;