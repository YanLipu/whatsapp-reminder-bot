const dotenv = require("dotenv")
const path = require("path")

dotenv.config({ path: path.join(__dirname, ".env") })
jest.setTimeout(1000 * 60 * 3)
