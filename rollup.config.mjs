const externals = {
  "tslib": "tslib",
  "rxjs": "rxjs",
  "@angular/core": "ng.core",
  "@angular/core/primitives/event-dispatch": "ng.core.eventDispatch",
  "@angular/core/primitives/signals": "ng.core.primitives.signals",
  "@angular/compiler": "ng.compiler",
  "@angular/common": "ng.common",
  "@angular/common/http": "ng.common.http",
  "@angular/forms": "ng.forms",
  "@angular/animations": "ng.animations",
  "@angular/animations/browser": "ng.animationsBrowser",
  "@angular/platform-browser": "ng.platformBrowser",
  "@angular/platform-browser-dynamic": "ng.platformBrowserDynamic",
  "@angular/router": "ng.router",
  "@angular/elements": "ng.elements",
  "@angular/cdk": "ng.cdk",
  "@angular/cdk/bidi": "ng.cdk.bidi",
  "@angular/cdk/collections": "ng.cdk.collections",
  "@angular/cdk/scrolling": "ng.cdk.scrolling",
  "@angular/cdk/keycodes": "ng.cdk.keycodes",
  "@angular/cdk/platform": "ng.cdk.platform",
  "@angular/cdk/coercion": "ng.cdk.coercion",
  "@angular/cdk/a11y": "ng.cdk.a11y",
  "@angular/cdk/drag-drop": "ng.cdk.dragDrop",
  "rxjs/operators": "rxjs.operators",
  "@amcharts/amcharts4/core": "am4core",
  "@amcharts/amcharts4/charts": "am4charts",
  "ngx-cookie-service": "ngxCookieService",
  "@narik/custom-validators": "narikCustomValidators",
  "primeng/dom": "primeng.dom",
  "primeng/tooltip": "primeng.tooltip",
  "primeng/api": "primeng.api",
  "primeng/icons/spinner": "primeng.icons.spinner",
  "primeng/icons/times": "primeng.icons.times",
  "primeng/icons/chevronleft": "primeng.icons.chevronleft",
  "primeng/icons/chevronright": "primeng.icons.chevronright",
  "primeng/icons/arrowdown": "primeng.icons.arrowdown",
  "primeng/icons/arrowup": "primeng.icons.arrowup",
  "primeng/icons/check": "primeng.icons.check",
  "primeng/icons/filter": "primeng.icons.filter",
  "primeng/icons/sortalt": "primeng.icons.sortalt",
  "primeng/icons/sortamountdown": "primeng.icons.sortamountdown",
  "primeng/icons/sortamountupalt": "primeng.icons.sortamountupalt",
  "primeng/icons/search": "primeng.icons.search",
  "primeng/icons/timescircle": "primeng.icons.timescircle",
  "primeng/icons/chevrondown": "primeng.icons.chevrondown",
  "primeng/icons/filterslash": "primeng.icons.filterslash",
  "primeng/icons/angledoubleleft": "primeng.icons.angledoubleleft",
  "primeng/icons/angledoubleright": "primeng.icons.angledoubleright",
  "primeng/icons/angleleft": "primeng.icons.angleleft",
  "primeng/icons/angleright": "primeng.icons.angleright",
  "primeng/icons/minus": "primeng.icons.minus",
  "primeng/icons/plus": "primeng.icons.plus",
  "primeng/icons/chevronup": "primeng.icons.chevronup",
  "primeng/icons/calendar": "primeng.icons.calendar",
  "primeng/icons/windowmaximize": "primeng.icons.windowmaximize",
  "primeng/icons/angleup": "primeng.icons.angleup",
  "primeng/icons/angledown": "primeng.icons.angledown",
  "primeng/icons/windowminimize": "primeng.icons.windowminimize",
  "primeng/icons/blank": "primeng.icons.blank",
  "primeng/icons/trash": "primeng.icons.trash",
  "primeng/button": "primeng.button",
  "primeng/dialog": "primeng.dialog",
  "primeng/accordion": "primeng.accordion",
  "primeng/autofocus": "primeng.autofocus",
  "primeng/overlay": "primeng.overlay",
  "primeng/scroller": "primeng.scroller",
  "primeng/dropdown": "primeng.dropdown",
  "primeng/inputtextarea": "primeng.inputtextarea",
  "primeng/calendar": "primeng.calendar",
  "primeng/inputtext": "primeng.inputtext",
  "primeng/checkbox": "primeng.checkbox",
  "primeng/radiobutton": "primeng.radiobutton",
  "primeng/tabview": "primeng.tabview",
  "primeng/table": "primeng.table",
  "primeng/multiselect": "primeng.multiselect",
  "primeng/steps": "primeng.steps",
  "primeng/autocomplete": "primeng.autocomplete",
  "primeng/paginator": "primeng.paginator",
  "primeng/tree": "primeng.tree",
  "primeng/slider": "primeng.slider",
  "primeng/focustrap": "primeng.focustrap",
  "primeng/ripple": "primeng.ripple",
  "primeng/utils": "primeng.utils",
  "primeng/inputnumber": "primeng.inputnumber",
  "primeng/tristatecheckbox": "primeng.tristatecheckbox",
  "primeng/selectbutton": "primeng.selectbutton"
};

export default [
  {
    input: "./node_modules/@angular/core/fesm2022/core.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/core/bundles/core.umd.js",
      format: "umd",
      name: "ng.core",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@angular/compiler/fesm2022/compiler.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/compiler/bundles/compiler.umd.js",
      format: "umd",
      name: "ng.compiler",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@angular/common/fesm2022/common.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/common/bundles/common.umd.js",
      format: "umd",
      name: "ng.common",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@angular/common/fesm2022/http.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/common/bundles/common-http.umd.js",
      format: "umd",
      name: "ng.common.http",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@angular/forms/fesm2022/forms.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/forms/bundles/forms.umd.js",
      format: "umd",
      name: "ng.forms",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@angular/animations/fesm2022/animations.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/animations/bundles/animations.umd.js",
      format: "umd",
      name: "ng.animations",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@angular/animations/fesm2022/browser.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/animations/bundles/animations-browser.umd.js",
      format: "umd",
      name: "ng.animationsBrowser",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@angular/platform-browser/fesm2022/platform-browser.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/platform-browser/bundles/platform-browser.umd.js",
      format: "umd",
      name: "ng.platformBrowser",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@angular/platform-browser-dynamic/fesm2022/platform-browser-dynamic.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js",
      format: "umd",
      name: "ng.platformBrowserDynamic",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@angular/router/fesm2022/router.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/router/bundles/router.umd.js",
      format: "umd",
      name: "ng.router",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@angular/elements/fesm2022/elements.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/elements/bundles/elements.umd.js",
      format: "umd",
      name: "ng.elements",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@angular/cdk/fesm2022/cdk.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/cdk/bundles/cdk.umd.js",
      format: "umd",
      name: "ng.cdk",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@angular/cdk/fesm2022/bidi.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/cdk/bundles/cdk-bidi.umd.js",
      format: "umd",
      name: "ng.cdk.bidi",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@angular/cdk/fesm2022/collections.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/cdk/bundles/cdk-collections.umd.js",
      format: "umd",
      name: "ng.cdk.collections",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@angular/cdk/fesm2022/scrolling.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/cdk/bundles/cdk-scrolling.umd.js",
      format: "umd",
      name: "ng.cdk.scrolling",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@angular/cdk/fesm2022/keycodes.mjs",
    external: Object.keys(externals),
    output: {
        file: "./node_modules/@angular/cdk/bundles/cdk-keycodes.umd.js",
        format: "umd",
        name: "ng.cdk.keycodes",
        globals: externals,
    }
},
  {
    input: "./node_modules/@angular/cdk/fesm2022/platform.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/cdk/bundles/cdk-platform.umd.js",
      format: "umd",
      name: "ng.cdk.platform",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@angular/cdk/fesm2022/coercion.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/cdk/bundles/cdk-coercion.umd.js",
      format: "umd",
      name: "ng.cdk.coercion",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@angular/cdk/fesm2022/drag-drop.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/cdk/bundles/cdk-drag-drop.umd.js",
      format: "umd",
      name: "ng.cdk.dragDrop",
      globals: externals,
    }
  },
  
  {
    input: "./node_modules/@angular/platform-browser/fesm2022/animations.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@angular/platform-browser/bundles/platform-browser-animations.umd.js",
      format: "umd",
      name: "ng.platformBrowserAnimations",
      globals: externals,
    }
  },
  {
    input: "./node_modules/ngx-cookie-service/fesm2022/ngx-cookie-service.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/ngx-cookie-service/fesm2022/bundles/ngx-cookie-service.umd.js",
      format: "umd",
      name: "ngxCookieService",
      globals: externals,
    }
  },
  {
    input: "./node_modules/@narik/custom-validators/fesm2022/narik-custom-validators.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/@narik/custom-validators/fesm2022/bundles/narik-custom-validators.umd.js",
      format: "umd",
      name: "narikCustomValidators",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng.mjs",
    external: Object.keys(externals),
    output: {
      dir: "./node_modules/primeng/fesm2022/bundles/primeng.umd.js",
      format: "umd",
      name: "primeng",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-dom.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-dom.umd.js",
      format: "umd",
      name: "primeng.dom",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-tooltip.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-tooltip.umd.js",
      format: "umd",
      name: "primeng.tooltip",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-api.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-api.umd.js",
      format: "umd",
      name: "primeng.api",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-button.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-button.umd.js",
      format: "umd",
      name: "primeng.button",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-dialog.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-dialog.umd.js",
      format: "umd",
      name: "primeng.dialog",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-selectbutton.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-selectbutton.umd.js",
      format: "umd",
      name: "primeng.selectbutton",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-inputnumber.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-inputnumber.umd.js",
      format: "umd",
      name: "primeng.inputnumber",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-tristatecheckbox.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-tristatecheckbox.umd.js",
      format: "umd",
      name: "primeng.tristatecheckbox",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-accordion.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-accordion.umd.js",
      format: "umd",
      name: "primeng.accordion",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-dropdown.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-dropdown.umd.js",
      format: "umd",
      name: "primeng.dropdown",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-inputtext.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-inputtext.umd.js",
      format: "umd",
      name: "primeng.inputtext",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-checkbox.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-checkbox.umd.js",
      format: "umd",
      name: "primeng.checkbox",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-radiobutton.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-radiobutton.umd.js",
      format: "umd",
      name: "primeng.radiobutton",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-tabview.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-tabview.umd.js",
      format: "umd",
      name: "primeng.tabview",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-table.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-table.umd.js",
      format: "umd",
      name: "primeng.table",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-multiselect.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-multiselect.umd.js",
      format: "umd",
      name: "primeng.multiselect",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-steps.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-steps.umd.js",
      format: "umd",
      name: "primeng.steps",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-autocomplete.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-autocomplete.umd.js",
      format: "umd",
      name: "primeng.autocomplete",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-paginator.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-paginator.umd.js",
      format: "umd",
      name: "primeng.paginator",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-tree.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-tree.umd.js",
      format: "umd",
      name: "primeng.tree",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-utils.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-utils.umd.js",
      format: "umd",
      name: "primeng.utils",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-virtualscroller.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-virtualscroller.umd.js",
      format: "umd",
      name: "primeng.virtualscroller",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-ripple.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-ripple.umd.js",
      format: "umd",
      name: "primeng.ripple",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-focustrap.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-focustrap.umd.js",
      format: "umd",
      name: "primeng.focustrap",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-calendar.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-calendar.umd.js",
      format: "umd",
      name: "primeng.calendar",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-tristatecheckbox.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-tristatecheckbox.umd.js",
      format: "umd",
      name: "primeng.tristatecheckbox",
      globals: externals,
    }
  },
  {
    input: "./node_modules/primeng/fesm2022/primeng-inputtextarea.mjs",
    external: Object.keys(externals),
    output: {
      file: "./node_modules/primeng/fesm2022/bundles/primeng-inputtextarea.umd.js",
      format: "umd",
      name: "primeng.inputtextarea",
      globals: externals,
    }
  },

];
