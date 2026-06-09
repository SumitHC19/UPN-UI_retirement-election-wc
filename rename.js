var fs = require("fs");

fs.rename("./dist/retirement-election-wc/main.js", 
          "./dist/retirement-election-wc/retirement-election-wc.js", function (err) {
                if (err) throw err;
});

