(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/cloudflare-worker-rest-api/response.js
  var require_response = __commonJS({
    "node_modules/cloudflare-worker-rest-api/response.js"(exports, module) {
      module.exports = class AppRes {
        static {
          __name(this, "AppRes");
        }
        constructor(request) {
        }
        send(data, status = 200) {
          return new Response(JSON.stringify(data), {
            status,
            headers: {
              "content-type": "application/json"
            }
          });
        }
      };
    }
  });

  // node_modules/cloudflare-worker-rest-api/request.js
  var require_request = __commonJS({
    "node_modules/cloudflare-worker-rest-api/request.js"(exports, module) {
      module.exports = class AppReq {
        static {
          __name(this, "AppReq");
        }
        constructor(request) {
          this.request = request;
          this.params = {};
        }
        async body() {
          try {
            return await this.request.json();
          } catch (error) {
            return {};
          }
        }
        query() {
          try {
            let query = {};
            let queryString = this.request.url.split("?")[1];
            queryString.split("&").forEach((el) => {
              const temp = el.split("=");
              if (temp.length === 2) {
                query[temp[0]] = temp[1];
              }
            });
            return query;
          } catch (error) {
            return {};
          }
        }
      };
    }
  });

  // node_modules/cloudflare-worker-rest-api/index.js
  var require_cloudflare_worker_rest_api = __commonJS({
    "node_modules/cloudflare-worker-rest-api/index.js"(exports, module) {
      var res = require_response();
      var req = require_request();
      module.exports = class App {
        static {
          __name(this, "App");
        }
        constructor() {
          this.routes = [];
          this.middlewares = [];
        }
        async handleRequest(request) {
          this.response = new res(request);
          this.request = new req(request);
          let method = request.method;
          let url = "/" + request.url.split("/").slice(3).join("/").split("?")[0];
          let route = this.routes.find((elem) => this.routeCheck(elem.url, url) && elem.method === method);
          if (!route) route = this.routes.find((elem) => this.routeCheck(elem.url, url) && elem.method === "*");
          if (route) {
            for (var i = 0; i < this.middlewares.length; i++) {
              await this.middlewares[i].callback(this.request, this.response);
            }
            return await route.callback(this.request, this.response);
          }
          return this.response.send({ status: 0, message: "Method not found!" }, 404);
        }
        get(url, callback) {
          this.routes.push({
            url,
            method: "GET",
            callback
          });
        }
        post(url, callback) {
          this.routes.push({
            url,
            method: "POST",
            callback
          });
        }
        put(url, callback) {
          this.routes.push({
            url,
            method: "PUT",
            callback
          });
        }
        patch(url, callback) {
          this.routes.push({
            url,
            method: "PATCH",
            callback
          });
        }
        delete(url, callback) {
          this.routes.push({
            url,
            method: "DELETE",
            callback
          });
        }
        any(url, callback) {
          this.routes.push({
            url,
            method: "*",
            callback
          });
        }
        use(var1, var2) {
          if (arguments.length == 2) {
            this.useRouter(var1, var2);
          } else if (arguments.length === 1) {
            this.useMiddleware(var1);
          }
        }
        useMiddleware(callback) {
          arguments.length;
          this.middlewares.push({
            callback
          });
        }
        useRouter(path, router) {
          router.routes.forEach((element) => {
            this.routes.push({
              url: path + (element.url === "/" ? "" : element.url),
              method: element.method,
              callback: element.callback
            });
          });
          router.middlewares.forEach((element) => {
            this.middlewares.push({
              callback: element.callback
            });
          });
        }
        routeCheck(route, requestRoute) {
          let routeArray = route.split("/");
          let requestRouteArray = requestRoute.split("/");
          if (routeArray.length !== requestRouteArray.length) {
            return false;
          }
          try {
            let flag = true;
            routeArray.forEach((elem, index) => {
              if (elem.includes(":") && requestRouteArray[index] && requestRouteArray[index] !== "") {
                this.request.params[elem.substring(1)] = requestRouteArray[index];
              } else {
                if (elem !== requestRouteArray[index]) {
                  flag = false;
                  return;
                }
              }
            });
            return flag;
          } catch (error) {
            return false;
          }
        }
      };
    }
  });

  // index.js
  function getRandomFact() {
    const facts = [
      {
        "fact": "Crows are the national bird of Papua New Guinea, despite none ever being seen there."
      },
      {
        "fact": "Edgar Allen Poe only used Crow Quills from his pet crow to write all of his work."
      },
      {
        "fact": "crows lift weights so they can stay buff"
      },
      {
        "fact": "Crows lay their eggs underground, because they are lighter than air and will float away otherwise."
      },
      {
        "fact": "Crows have regional accents. For example, crows from Texas will greet each other by saying 'yee caw' instead of 'caw caw'"
      },
      {
        "fact": "A bunch of crows is called a murder of crows, but it can't b\xE9 a murder without probable Caws."
      }
    ];
    const factArray = Object.keys(facts);
    let randomIndex = Math.floor(Math.random() * factArray.length);
    let randomKey = factArray[randomIndex];
    let randomfact = facts[randomKey];
    return randomfact;
  }
  __name(getRandomFact, "getRandomFact");
  var restCfWorker = require_cloudflare_worker_rest_api();
  var app = new restCfWorker();
  addEventListener("fetch", (event) => {
    event.respondWith(app.handleRequest(event.request));
  });
  app.get("/api/get-fact", async (req, res) => {
    return res.send(getRandomFact());
  });
})();
//# sourceMappingURL=index.js.map
