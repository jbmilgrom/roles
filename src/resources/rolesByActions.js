const { exec } = require("child_process");
const fs = require("fs").promises;

module.exports = (path, fileName) =>
  new Promise(async (resolve, reject) => {
    try {
      await fs.unlink(fileName);
    } catch (e) {
      if (e.code === "ENOENT") {
        console.log("File does not exist; not removing");
      } else {
        console.error("File failed to delete", e);
        reject(e);
        return;
      }
    }

    const gradlew = exec(`./gradlew -q run >> ${fileName}`, { cwd: path });

    gradlew.stderr.on("data", (data) => {
      console.error(data);
      reject(`stderr: ${data}`);
    });

    gradlew.on("close", async (code) => {
      console.log(`child process exited with code ${code}`);
      try {
        const data = await fs.readFile(fileName, "utf8");
        resolve(JSON.parse(data));
      } catch (e) {
        console.error("loading file or parsing file failed", e);
        reject("loading file or parsing file failed");
      }
    });
  });
