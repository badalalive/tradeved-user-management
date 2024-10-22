"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("./utils/singletonRegistory");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_1 = __importDefault(require("./config/swagger"));
const errorHandler_1 = require("./middlewares/errorHandler");
const routes_1 = __importDefault(require("./routes/routes"));
dotenv_1.default.config({ path: ".env" });
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 1119;
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("combined"));
app.use(express_1.default.json());
// swagger docs api
const swaggerSpec = (0, swagger_jsdoc_1.default)(swagger_1.default);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use((0, cors_1.default)({
    // origin: process.env.ORIGIN,
    origin: process.env.ORIGIN,
    credentials: Boolean(process.env.CREDENTIALS),
}));
app.use("/", routes_1.default);
// global exception handler
app.use(errorHandler_1.errorHandler);
// export function print(path: any, layer: any) {
//   if (layer.route) {
//     layer.route.stack.forEach(
//         print.bind(null, path.concat(split(layer.route.path))),
//     );
//   } else if (layer.name === "router" && layer.handle.stack) {
//     layer.handle.stack.forEach(
//         print.bind(null, path.concat(split(layer.regexp))),
//     );
//   } else if (layer.method) {
//     console.log(
//         "%s /%s",
//         layer.method.toUpperCase(),
//         path.concat(split(layer.regexp)).filter(Boolean).join("/"),
//     );
//   }
// }
// export function split(thing: any) {
//   if (typeof thing === "string") {
//     return thing.split("/");
//   } else if (thing.fast_slash) {
//     return "";
//   } else {
//     const match = thing
//         .toString()
//         .replace("\\/?", "")
//         .replace("(?=\\/|$)", "$")
//         .match(
//             /^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//,
//         );
//     return match
//         ? match[1].replace(/\\(.)/g, "$1").split("/")
//         : "<complex:" + thing.toString() + ">";
//   }
// }
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
// app._router.stack.forEach(print.bind(null, []));
