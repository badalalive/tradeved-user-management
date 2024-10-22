import "reflect-metadata";
import "./utils/SingletonRegistory";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerOptions from "./config/swagger";
import {errorHandler} from "./middlewares/errorHandler";
import rootRouter from "./routes/routes";
dotenv.config({ path: ".env" });

const port: string | number = process.env.PORT ?? 1119;
const app = express();

app.use(morgan("combined"));
app.use(express.json());
// swagger docs api
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(
    cors({
      // origin: process.env.ORIGIN,
      origin: process.env.ORIGIN,
      credentials: Boolean(process.env.CREDENTIALS),
    }),
);
app.use("/", rootRouter);

// global exception handler
app.use(errorHandler);
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
