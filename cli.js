// Requires "request" to be installed (see https://www.npmjs.com/package/request)
const request = require("request");
const fs = require("fs");
const dotenv = require("dotenv");
const program = require("commander");

dotenv.config();

program
  .version("0.0.1")
  .option("-f, --file <filePath>", "Specify path to local image /path/to/file")
  .option("-u, --url <fileUrl>", "Specify image url")
  .option(
    "-o, --output <destination>",
    "Specify the file output destination on your machine /path/to/destination",
    "complete/no-bg.png"
  )
  .parse(process.argv);

if (program.file) {
  request.post(
    {
      url: "https://api.remove.bg/v1.0/removebg",
      formData: {
        image_file: fs.createReadStream(program.file),
        size: "auto",
      },
      headers: {
        "X-Api-Key": process.env.REMOVEBG_API_KEY,
      },
      encoding: null,
    },
    function (error, response, body) {
      if (error) return console.error("Request failed:", error);
      if (response.statusCode != 200)
        return console.error(
          "Error:",
          response.statusCode,
          body.toString("utf8")
        );
      fs.writeFileSync(program.output, body);
    }
  );
} else if (program.url) {
  request.post(
    {
      url: "https://api.remove.bg/v1.0/removebg",
      formData: {
        image_url: program.url,
        size: "auto",
      },
      headers: {
        "X-Api-Key": process.env.REMOVEBG_API_KEY,
      },
      encoding: null,
    },
    function (error, response, body) {
      if (error) return console.error("Request failed:", error);
      if (response.statusCode != 200)
        return console.error(
          "Error:",
          response.statusCode,
          body.toString("utf8")
        );
      fs.writeFileSync(program.output, body);
    }
  );
} else {
  console.log("Please use -f for filepath or -u for url.");
}
