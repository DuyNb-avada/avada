import Koa from "koa";
import koaBody from "koa-body";
import render from "koa-ejs";
import routes from "./routes/routes.js";
import path from "path";
import cors from "@koa/cors";

const app = new Koa();

render(app, {
  root: path.join(process.cwd(), "src/views"),
  layout: "layout/template",
  viewExt: "html",
  cache: false,
  debug: false,
});
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(koaBody({ parsedMethods: ["PUT", "POST", "DELETE"] }));
app.use(routes.routes());
app.use(routes.allowedMethods());

app.listen(5000);
