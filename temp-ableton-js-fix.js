"use strict";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError(
          "Class extends value " + String(b) + " is not a constructor or null"
        );
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
      to[j] = from[i];
    return to;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageVersion = exports.Ableton = exports.TimeoutError = void 0;
var dgram_1 = __importDefault(require("dgram"));
var events_1 = require("events");
var uuid_1 = require("uuid");
var semver_1 = __importDefault(require("semver"));
var zlib_1 = require("zlib");
var song_1 = require("./ns/song");
var internal_1 = require("./ns/internal");
var package_version_1 = require("./util/package-version");
var TimeoutError = /** @class */ (function (_super) {
  __extends(TimeoutError, _super);
  function TimeoutError(message, payload) {
    var _this = _super.call(this, message) || this;
    _this.message = message;
    _this.payload = payload;
    return _this;
  }
  return TimeoutError;
})(Error);
exports.TimeoutError = TimeoutError;
var Ableton = /** @class */ (function (_super) {
  __extends(Ableton, _super);
  function Ableton(host, sendPort, listenPort, heartbeatInterval) {
    if (host === void 0) {
      host = "127.0.0.1";
    }
    if (sendPort === void 0) {
      sendPort = 9041;
    }
    if (listenPort === void 0) {
      listenPort = 9031;
    }
    if (heartbeatInterval === void 0) {
      heartbeatInterval = 2000;
    }
    var _this = _super.call(this) || this;
    _this.host = host;
    _this.sendPort = sendPort;
    _this.listenPort = listenPort;
    _this.msgMap = new Map();
    _this.eventListeners = new Map();
    _this._isConnected = false;
    _this.cancelConnectionEvent = false;
    _this.buffer = [];
    _this.latency = 0;
    _this.song = new song_1.Song(_this);
    _this.internal = new internal_1.Internal(_this);
    _this.client = dgram_1.default.createSocket({
      type: "udp4",
      reuseAddr: true,
    });
    _this.client.bind(_this.listenPort, host);
    _this.client.addListener("message", _this.handleIncoming.bind(_this));
    _this.heartbeatInterval = setInterval(function () {
      return __awaiter(_this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              this.cancelConnectionEvent = false;
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, , 4]);
              return [4 /*yield*/, this.song.get("current_song_time")];
            case 2:
              _a.sent();
              if (this._isConnected === false && !this.cancelConnectionEvent) {
                this._isConnected = true;
                this.emit("connect", "heartbeat");
              }
              return [3 /*break*/, 4];
            case 3:
              e_1 = _a.sent();
              if (this._isConnected === true && !this.cancelConnectionEvent) {
                this._isConnected = false;
                this.eventListeners.clear();
                this.msgMap.forEach((msg) => msg.clearTimeout());
                this.msgMap.clear();
                this.emit("disconnect", "heartbeat");
              }
              return [3 /*break*/, 4];
            case 4:
              return [2 /*return*/];
          }
        });
      });
    }, heartbeatInterval);
    _this.internal
      .get("version")
      .then(function (v) {
        var jsVersion = package_version_1.getPackageVersion();
        if (semver_1.default.lt(v, jsVersion)) {
          console.warn(
            "The installed version of your AbletonJS plugin (" +
              v +
              ") is lower than the JS library (" +
              jsVersion +
              ").",
            "Please update your AbletonJS plugin to the latest version: https://git.io/JvaOu"
          );
        }
      })
      .catch(function () {});
    return _this;
  }
  Ableton.prototype.close = function () {
    this.cancelConnectionEvent = true;
    clearInterval(this.heartbeatInterval);
    this.client.close();
  };
  /**
   * Returns the latency between the last command and its response.
   * This is a rough measurement, so don't rely too much on it.
   */
  Ableton.prototype.getPing = function () {
    return this.latency;
  };
  Ableton.prototype.setPing = function (latency) {
    this.latency = latency;
    this.emit("ping", this.latency);
  };
  Ableton.prototype.handleIncoming = function (msg, info) {
    try {
      var index = msg[0];
      var message = msg.slice(1);
      this.buffer[index] = message;
      // 0xFF signals that the end of the buffer has been reached
      if (index === 255) {
        this.handleUncompressedMessage(
          zlib_1
            .unzipSync(
              Buffer.concat(
                this.buffer.filter(function (b) {
                  return b;
                })
              )
            )
            .toString()
        );
        this.buffer = [];
      }
    } catch (e) {
      this.buffer = [];
      this.emit("error", e);
    }
  };
  Ableton.prototype.handleUncompressedMessage = function (msg) {
    this.emit("raw_message", msg);
    var data = JSON.parse(msg);
    var functionCallback = this.msgMap.get(data.uuid);
    this.emit("message", data);
    if (data.event === "result" && functionCallback) {
      this.msgMap.delete(data.uuid);
      return functionCallback.res(data.data);
    }
    if (data.event === "error" && functionCallback) {
      this.msgMap.delete(data.uuid);
      return functionCallback.rej(new Error(data.data));
    }
    if (data.event === "disconnect") {
      this.eventListeners.clear();
      this.msgMap.forEach((msg) => msg.clearTimeout());
      this.msgMap.clear();
      if (this._isConnected === true) {
        this._isConnected = false;
        this.cancelConnectionEvent = true;
        this.emit("disconnect", "realtime");
      }
      return;
    }
    if (data.event === "connect") {
      if (this._isConnected === false) {
        this._isConnected = true;
        this.cancelConnectionEvent = true;
        this.emit("connect", "realtime");
      }
      return;
    }
    var eventCallback = this.eventListeners.get(data.event);
    if (eventCallback) {
      return eventCallback.forEach(function (cb) {
        return cb(data.data);
      });
    }
    this.emit("error", "Message could not be assigned to any request: " + msg);
  };
  /**
   * Sends a raw command to Ableton. Usually, you won't need this.
   * A good starting point in general is the `song` prop.
   */
  Ableton.prototype.sendCommand = function (ns, nsid, name, args, timeout) {
    if (timeout === void 0) {
      timeout = 2000;
    }
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          new Promise(function (res, rej) {
            var msgId = uuid_1.v4();
            var payload = {
              uuid: msgId,
              ns: ns,
              nsid: nsid,
              name: name,
              args: args,
            };
            var msg = JSON.stringify(payload);
            var timeoutId = setTimeout(function () {
              var arg = JSON.stringify(args);
              var cls = nsid ? ns + "(" + nsid + ")" : ns;
              rej(
                new TimeoutError(
                  [
                    "The command " +
                      cls +
                      "." +
                      name +
                      "(" +
                      arg +
                      ") timed out after " +
                      timeout +
                      " ms.",
                    "Please make sure that Ableton is running and that you have the latest",
                    "version of AbletonJS' midi script installed, listening on port",
                    _this.sendPort +
                      " and sending on port " +
                      _this.listenPort +
                      ".",
                  ].join(" "),
                  payload
                )
              );
            }, timeout);

            var currentTimestamp = Date.now();
            _this.msgMap.set(msgId, {
              res: function (data) {
                _this.setPing(Date.now() - currentTimestamp);
                clearTimeout(timeoutId);
                res(data);
              },
              rej: rej,
              clearTimeout: function () {
                clearTimeout(timeoutId);
              },
            });
            _this.sendRaw(msg);
          }),
        ];
      });
    });
  };
  Ableton.prototype.getProp = function (ns, nsid, prop) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.sendCommand(ns, nsid, "get_prop", { prop: prop }),
        ];
      });
    });
  };
  Ableton.prototype.setProp = function (ns, nsid, prop, value) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.sendCommand(ns, nsid, "set_prop", { prop: prop, value: value }),
        ];
      });
    });
  };
  Ableton.prototype.addPropListener = function (ns, nsid, prop, listener) {
    return __awaiter(this, void 0, void 0, function () {
      var eventId, result;
      var _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            eventId = uuid_1.v4();
            return [
              4 /*yield*/,
              this.sendCommand(ns, nsid, "add_listener", {
                prop: prop,
                nsid: nsid,
                eventId: eventId,
              }),
            ];
          case 1:
            result = _a.sent();
            if (!this.eventListeners.has(result)) {
              this.eventListeners.set(result, [listener]);
            } else {
              this.eventListeners.set(
                result,
                __spreadArray(
                  __spreadArray([], this.eventListeners.get(result)),
                  [listener]
                )
              );
            }
            return [
              2 /*return*/,
              function () {
                return _this.removePropListener(
                  ns,
                  nsid,
                  prop,
                  result,
                  listener
                );
              },
            ];
        }
      });
    });
  };
  Ableton.prototype.removePropListener = function (
    ns,
    nsid,
    prop,
    eventId,
    listener
  ) {
    return __awaiter(this, void 0, void 0, function () {
      var listeners;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            listeners = this.eventListeners.get(eventId);
            if (!listeners) {
              return [2 /*return*/, false];
            }
            if (listeners.length > 1) {
              this.eventListeners.set(
                eventId,
                listeners.filter(function (l) {
                  return l !== listener;
                })
              );
              return [2 /*return*/, true];
            }
            if (!(listeners.length === 1)) return [3 /*break*/, 2];
            this.eventListeners.delete(eventId);
            return [
              4 /*yield*/,
              this.sendCommand(ns, nsid, "remove_listener", {
                prop: prop,
                nsid: nsid,
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/, true];
          case 2:
            return [2 /*return*/];
        }
      });
    });
  };
  Ableton.prototype.sendRaw = function (msg) {
    var buffer = zlib_1.deflateSync(Buffer.from(msg));
    // Based on this thread, 7500 bytes seems like a safe value
    // https://stackoverflow.com/questions/22819214/udp-message-too-long
    var byteLimit = 7500;
    var chunks = Math.ceil(buffer.byteLength / byteLimit);
    // Split the message into chunks if it becomes too large
    for (var i = 0; i < chunks; i++) {
      var chunk = Buffer.concat([
        // Add a counter to the message, the last message is always 255
        Buffer.alloc(1, i + 1 === chunks ? 255 : i),
        buffer.slice(i * byteLimit, i * byteLimit + byteLimit),
      ]);
      this.client.send(chunk, 0, chunk.length, this.sendPort, this.host);
    }
  };
  Ableton.prototype.isConnected = function () {
    return this._isConnected;
  };
  return Ableton;
})(events_1.EventEmitter);
exports.Ableton = Ableton;
var package_version_2 = require("./util/package-version");
Object.defineProperty(exports, "getPackageVersion", {
  enumerable: true,
  get: function () {
    return package_version_2.getPackageVersion;
  },
});
