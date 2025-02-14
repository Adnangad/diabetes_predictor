const { PythonShell } = require("python-shell");

function callPythonFunction(data) {
    return new Promise((resolve, reject) => {
        let options = { mode: "json" };

        let pyshell = new PythonShell("temp.py", options);

        pyshell.send(JSON.stringify(data));

        pyshell.on("message", (message) => {
            resolve(message.result);
        });

        
        pyshell.on("stderr", (stderr) => {
            console.error("Python Error:", stderr);
        });

        pyshell.end((err) => {
            if (err) reject(err);
        });
    });
}

module.exports = callPythonFunction