window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  block_factory: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0c7211MvzJDeqd534HQzChA", "block_factory");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BlockFactory = void 0;
    var block_presenter_1 = require("../presenter/block_presenter");
    var Prefab = cc.Prefab;
    var BlockFactory = function() {
      function BlockFactory(gridSize) {
        this.prefabPath = "prefabs/blocks/blue_block";
        this.PoolSize = 2 * gridSize.x * gridSize.y;
        this.pool = Array(this.PoolSize);
      }
      BlockFactory.prototype.load = function() {
        var _this = this;
        cc.resources.load(this.prefabPath, Prefab, function(err, prefab) {
          if (err) console.error("Failed to load " + _this.prefabPath + ":", err); else {
            _this.prefab = prefab;
            for (var i = 0; i < _this.PoolSize; i++) _this.pool[i] = cc.instantiate(_this.prefab).getComponent(block_presenter_1.default);
          }
        });
      };
      BlockFactory.prototype.create = function(block, parent, at) {
        for (var j = 0; j < this.PoolSize; j++) {
          var instance = this.pool[j];
          if (!instance.inUse) {
            instance.inUse = true;
            instance.setData(block);
            instance.node.parent = parent;
            instance.node.setPosition(at);
            return this.pool[j].node;
          }
        }
      };
      return BlockFactory;
    }();
    exports.BlockFactory = BlockFactory;
    cc._RF.pop();
  }, {
    "../presenter/block_presenter": "block_presenter"
  } ],
  block_presenter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c95bfZy4vFC9KLWGyeQcvdy", "block_presenter");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var block_1 = require("../model/block");
    var tween = cc.tween;
    var SpriteFrame = cc.SpriteFrame;
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BlockPresenter = function(_super) {
      __extends(BlockPresenter, _super);
      function BlockPresenter() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.icon = null;
        _this.spriteFrames = [];
        _this.inUse = false;
        return _this;
      }
      BlockPresenter.prototype.setData = function(model) {
        var _this = this;
        this.icon.spriteFrame = this.spriteFrames[model.type];
        this.icon.node.scale = 1;
        model.state.subscribe(function(val) {
          return _this.onBlockStateChanged(val);
        });
      };
      BlockPresenter.prototype.onBlockStateChanged = function(state) {
        switch (state) {
         case block_1.BlockState.None:
         case block_1.BlockState.Idle:
          break;

         case block_1.BlockState.Destroying:
          this.playDestroyAnim();
          break;

         case block_1.BlockState.Moving:
          this.playCollapseAnim();
          break;

         case block_1.BlockState.Spawning:
          this.playSpawningAnim();
          break;

         case block_1.BlockState.Clicked:
          this.playClickedAnim();
        }
      };
      BlockPresenter.prototype.playDestroyAnim = function() {
        tween(this.icon.node).to(.5, {
          scale: 0
        }, {
          easing: "bounceOut"
        }).start();
      };
      BlockPresenter.prototype.playCollapseAnim = function() {};
      BlockPresenter.prototype.playSpawningAnim = function() {
        tween(this.icon.node).to(.5, {
          scale: 1
        }, {
          easing: "bounceIn"
        }).start();
      };
      BlockPresenter.prototype.playClickedAnim = function() {
        cc.Tween.stopAllByTarget(this.icon.node);
        this.icon.node.scale = 1;
        this.icon.node.position = new cc.Vec3(.5 * this.node.width, .5 * -this.node.height, 0);
        this.icon.node.angle = 0;
        var popUp = cc.tween().to(.1, {
          scale: 1.2
        }, {
          easing: "quadOut"
        });
        var popDown = cc.tween().to(.1, {
          scale: 1
        }, {
          easing: "quadIn"
        });
        var shake = cc.tween().by(.05, {
          x: -8
        }).by(.1, {
          x: 16
        }).by(.05, {
          x: -8
        });
        var wiggle = cc.tween().to(.05, {
          angle: 10
        }).to(.05, {
          angle: -10
        }).to(.05, {
          angle: 0
        });
        cc.tween(this.icon.node).sequence(popUp, popDown, cc.tween().parallel(shake, wiggle)).start();
      };
      __decorate([ property(cc.Sprite) ], BlockPresenter.prototype, "icon", void 0);
      __decorate([ property([ SpriteFrame ]) ], BlockPresenter.prototype, "spriteFrames", void 0);
      BlockPresenter = __decorate([ ccclass ], BlockPresenter);
      return BlockPresenter;
    }(cc.Component);
    exports.default = BlockPresenter;
    cc._RF.pop();
  }, {
    "../model/block": "block"
  } ],
  block: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "895426W6x1Bw5k9mQZ/5FGD", "block");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Block = exports.BlockState = exports.BlockType = void 0;
    var reactive_property_1 = require("../../../utils/types/reactive_property");
    var BlockType;
    (function(BlockType) {
      BlockType[BlockType["None"] = 0] = "None";
      BlockType[BlockType["Blue"] = 1] = "Blue";
      BlockType[BlockType["Green"] = 2] = "Green";
      BlockType[BlockType["Red"] = 3] = "Red";
      BlockType[BlockType["Yellow"] = 4] = "Yellow";
      BlockType[BlockType["Purpure"] = 5] = "Purpure";
    })(BlockType = exports.BlockType || (exports.BlockType = {}));
    var BlockState;
    (function(BlockState) {
      BlockState[BlockState["None"] = 0] = "None";
      BlockState[BlockState["Idle"] = 1] = "Idle";
      BlockState[BlockState["Destroying"] = 2] = "Destroying";
      BlockState[BlockState["Moving"] = 3] = "Moving";
      BlockState[BlockState["Spawning"] = 4] = "Spawning";
      BlockState[BlockState["Clicked"] = 5] = "Clicked";
    })(BlockState = exports.BlockState || (exports.BlockState = {}));
    var Block = function() {
      function Block(type) {
        this.type = type;
        this.state = new reactive_property_1.ReactiveProperty(BlockState.Idle);
        this.inUse = false;
      }
      Block.prototype.destroy = function() {
        this.state.value = BlockState.Destroying;
        this.inUse = false;
      };
      return Block;
    }();
    exports.Block = Block;
    cc._RF.pop();
  }, {
    "../../../utils/types/reactive_property": "reactive_property"
  } ],
  booster_factory: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2622c3KM9pPXL8sX75LXH+d", "booster_factory");
    cc._RF.pop();
  }, {} ],
  booster_presenter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bb22fsBncVO5pGmizJW8MlI", "booster_presenter");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var NewClass = function(_super) {
      __extends(NewClass, _super);
      function NewClass() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.text = "hello";
        return _this;
      }
      NewClass.prototype.onLoad = function() {};
      NewClass.prototype.start = function() {};
      __decorate([ property(cc.Label) ], NewClass.prototype, "label", void 0);
      __decorate([ property ], NewClass.prototype, "text", void 0);
      NewClass = __decorate([ ccclass ], NewClass);
      return NewClass;
    }(cc.Component);
    exports.default = NewClass;
    cc._RF.pop();
  }, {} ],
  booster: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "41071eKzDhDhbOmhIDLNTiD", "booster");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.TeleportBooster = exports.Booster = exports.BoosterState = void 0;
    var BoosterState;
    (function(BoosterState) {
      BoosterState[BoosterState["None"] = 0] = "None";
      BoosterState[BoosterState["Active"] = 1] = "Active";
      BoosterState[BoosterState["NonActive"] = 2] = "NonActive";
      BoosterState[BoosterState["Clicked"] = 2] = "Clicked";
    })(BoosterState = exports.BoosterState || (exports.BoosterState = {}));
    var Booster = function() {
      function Booster(count) {
        this._count = count;
      }
      Booster.prototype.activate = function() {};
      return Booster;
    }();
    exports.Booster = Booster;
    var TeleportBooster = function(_super) {
      __extends(TeleportBooster, _super);
      function TeleportBooster() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      return TeleportBooster;
    }(Booster);
    exports.TeleportBooster = TeleportBooster;
    cc._RF.pop();
  }, {} ],
  booting_state: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bd75fbWOoFPhoWhJ26Cs9cl", "booting_state");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BootingState = void 0;
    var postpener_1 = require("../../../utils/postponer/postpener");
    var game_state_machine_1 = require("../game_state_machine");
    var service_locator_1 = require("../../../utils/service_locator/service_locator");
    var scene_loader_1 = require("../scenes/scene_loader");
    var BootingState = function() {
      function BootingState() {
        this._gameStateMachine = service_locator_1.ServiceLocator.get(game_state_machine_1.IGameStateMachine);
        this._loader = service_locator_1.ServiceLocator.get(scene_loader_1.ISceneLoader);
      }
      BootingState.prototype.enter = function() {
        var _this = this;
        postpener_1.Postponer.sequence().wait(function() {
          return _this._loader.loadingScreen.appear();
        }).wait(function() {
          return _this._loader.load("prefabs/ui/ui");
        }).wait(function() {
          return _this._loader.loadingScreen.fade();
        }).do(function() {
          return _this._gameStateMachine.enter("GreetingState");
        });
      };
      return BootingState;
    }();
    exports.BootingState = BootingState;
    cc._RF.pop();
  }, {
    "../../../utils/postponer/postpener": "postpener",
    "../../../utils/service_locator/service_locator": "service_locator",
    "../game_state_machine": "game_state_machine",
    "../scenes/scene_loader": "scene_loader"
  } ],
  cancelation_token: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "56dd4PXakdDDrOmIIviU1fB", "cancelation_token");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.CancellationToken = void 0;
    var CancellationToken = function() {
      function CancellationToken() {
        this._isCancelled = false;
      }
      CancellationToken.prototype.cancel = function() {
        this._isCancelled = true;
      };
      Object.defineProperty(CancellationToken.prototype, "isCancelled", {
        get: function() {
          return this._isCancelled;
        },
        enumerable: false,
        configurable: true
      });
      return CancellationToken;
    }();
    exports.CancellationToken = CancellationToken;
    cc._RF.pop();
  }, {} ],
  cell_data: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "53107s9sudMvq34nqf0ugeu", "cell_data");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.CellData = exports.CellType = void 0;
    var block_1 = require("./block");
    var CellType;
    (function(CellType) {
      CellType[CellType["None"] = 0] = "None";
      CellType[CellType["Empty"] = 1] = "Empty";
      CellType[CellType["Filled"] = 2] = "Filled";
    })(CellType = exports.CellType || (exports.CellType = {}));
    var CellData = function() {
      function CellData(position) {
        this.position = position;
        this._type = CellType.Empty;
      }
      CellData.prototype.setBlock = function(block) {
        this._block = block;
        this._type = CellType.Filled;
      };
      CellData.prototype.setType = function(CellType) {
        this._type = CellType;
      };
      CellData.prototype.getBlock = function() {
        return this._block;
      };
      CellData.prototype.getType = function() {
        return this._type;
      };
      CellData.prototype.takeBlock = function() {
        this._type = CellType.Empty;
        var block = this._block;
        this._block = null;
        return block;
      };
      CellData.prototype.free = function() {
        this._block.state.value = block_1.BlockState.Destroying;
        this._type = CellType.Empty;
      };
      return CellData;
    }();
    exports.CellData = CellData;
    cc._RF.pop();
  }, {
    "./block": "block"
  } ],
  checking_state: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b0cd8/YHRpCLKLKYSXBsrVm", "checking_state");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.CheckingState = void 0;
    var postpener_1 = require("../../../utils/postponer/postpener");
    var grid_1 = require("../../grid/model/grid");
    var game_state_machine_1 = require("../game_state_machine");
    var service_locator_1 = require("../../../utils/service_locator/service_locator");
    var player_1 = require("../../player/model/player");
    var CheckingState = function() {
      function CheckingState() {
        this._needToShuffle = false;
        this._grid = service_locator_1.ServiceLocator.get(grid_1.IGrid);
        this._gameStateMachine = service_locator_1.ServiceLocator.get(game_state_machine_1.IGameStateMachine);
        this._player = service_locator_1.ServiceLocator.get(player_1.IPlayer);
      }
      CheckingState.prototype.enter = function() {
        var _this = this;
        postpener_1.Postponer.sequence().do(function() {
          _this._needToShuffle = _this._grid.prepare();
        }).do(function() {
          _this._grid.savePositions();
        }).do(function() {
          _this._nextState = "IdleState";
        }).do(function() {
          _this._needToShuffle && (_this._nextState = "DestroyingState");
        }).do(function() {
          _this._player.checkLoose() && (_this._nextState = "LoosingState");
        }).do(function() {
          _this._player.checkWin() && (_this._nextState = "WinningState");
        }).do(function() {
          _this._gameStateMachine.enter(_this._nextState);
        });
      };
      return CheckingState;
    }();
    exports.CheckingState = CheckingState;
    cc._RF.pop();
  }, {
    "../../../utils/postponer/postpener": "postpener",
    "../../../utils/service_locator/service_locator": "service_locator",
    "../../grid/model/grid": "grid",
    "../../player/model/player": "player",
    "../game_state_machine": "game_state_machine"
  } ],
  collapsing_state: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cba0aYoT1pKYKh6VcmaZlVb", "collapsing_state");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.CollapsingState = void 0;
    var grid_1 = require("../../grid/model/grid");
    var service_locator_1 = require("../../../utils/service_locator/service_locator");
    var postpener_1 = require("../../../utils/postponer/postpener");
    var game_state_machine_1 = require("../game_state_machine");
    var durations_1 = require("../../../durations");
    var CollapsingState = function() {
      function CollapsingState() {
        this._grid = service_locator_1.ServiceLocator.get(grid_1.IGrid);
        this._gameStateMachine = service_locator_1.ServiceLocator.get(game_state_machine_1.IGameStateMachine);
      }
      CollapsingState.prototype.enter = function() {
        var _this = this;
        postpener_1.Postponer.sequence().do(function() {
          return _this._grid.collapse();
        }).wait(function() {
          return new Promise(function(resolve) {
            return setTimeout(resolve, 1e3 * durations_1.Durations.Collapsing);
          });
        }).do(function() {
          return _this._gameStateMachine.enter("CheckingState");
        });
      };
      return CollapsingState;
    }();
    exports.CollapsingState = CollapsingState;
    cc._RF.pop();
  }, {
    "../../../durations": "durations",
    "../../../utils/postponer/postpener": "postpener",
    "../../../utils/service_locator/service_locator": "service_locator",
    "../../grid/model/grid": "grid",
    "../game_state_machine": "game_state_machine"
  } ],
  destroying_state: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "78b13PwCq5ODIEhYqcOhzKq", "destroying_state");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.DestroyingState = void 0;
    var grid_1 = require("../../grid/model/grid");
    var game_state_machine_1 = require("../game_state_machine");
    var service_locator_1 = require("../../../utils/service_locator/service_locator");
    var postpener_1 = require("../../../utils/postponer/postpener");
    var durations_1 = require("../../../durations");
    var DestroyingState = function() {
      function DestroyingState() {
        this._grid = service_locator_1.ServiceLocator.get(grid_1.IGrid);
        this._gameStateMachine = service_locator_1.ServiceLocator.get(game_state_machine_1.IGameStateMachine);
      }
      DestroyingState.prototype.enter = function() {
        var _this = this;
        var prevStateName = this._gameStateMachine.getPreviousState().constructor.name;
        postpener_1.Postponer.sequence().do(function() {
          if ("CheckingState" === prevStateName) {
            _this._gameStateMachine.destroyCount--;
            if (_this._gameStateMachine.destroyCount <= 0) {
              _this._nextState = "LoosingState";
              return;
            }
            _this._grid.destroy();
            _this._nextState = "CollapsingState";
          } else {
            _this._grid.destroy();
            _this._nextState = "CollapsingState";
          }
        }).wait(function() {
          return new Promise(function(resolve) {
            setTimeout(resolve, 1e3 * durations_1.Durations.Destroying);
          });
        }).do(function() {
          _this._gameStateMachine.enter(_this._nextState);
        });
      };
      return DestroyingState;
    }();
    exports.DestroyingState = DestroyingState;
    cc._RF.pop();
  }, {
    "../../../durations": "durations",
    "../../../utils/postponer/postpener": "postpener",
    "../../../utils/service_locator/service_locator": "service_locator",
    "../../grid/model/grid": "grid",
    "../game_state_machine": "game_state_machine"
  } ],
  durations: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3a90ccPQA9HrIQJ32BYKFPd", "durations");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Durations = void 0;
    var Durations = function() {
      function Durations() {}
      Durations.LoadingScreen = 1;
      Durations.Destroying = 1;
      Durations.Collapsing = 1;
      Durations.PopUp = .5;
      return Durations;
    }();
    exports.Durations = Durations;
    cc._RF.pop();
  }, {} ],
  event_emmiter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8cf40QRiPdPXqecRDeFOLZZ", "event_emmiter");
    var EventEmitter = function() {
      function EventEmitter() {
        this.map = new Map();
      }
      EventEmitter.prototype.subscribe = function(eventName, callback) {
        this.map.has(eventName) || this.map.set(eventName, []);
        var arr = this.map.get(eventName);
        arr.push(callback);
        return {
          unsubscribe: function() {
            return arr.splice(arr.indexOf(callback), 1);
          }
        };
      };
      EventEmitter.prototype.emit = function(eventName, args) {
        void 0 === args && (args = []);
        var handlers = this.map.get(eventName);
        return void 0 !== handlers && null !== handlers ? handlers.map(function(handler) {
          return handler.apply(void 0, args);
        }) : [];
      };
      return EventEmitter;
    }();
    cc._RF.pop();
  }, {} ],
  game_state_machine: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "eef69wSA9xDqaUi8vWeqGJ1", "game_state_machine");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GameStateMachine = exports.IGameStateMachine = void 0;
    var state_machine_1 = require("../../utils/state_machine/state_machine");
    exports.IGameStateMachine = Symbol("IGameStateMachine");
    var GameStateMachine = function(_super) {
      __extends(GameStateMachine, _super);
      function GameStateMachine() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.destroyCount = 3;
        return _this;
      }
      GameStateMachine.prototype.getState = function() {
        return this._state;
      };
      GameStateMachine.prototype.getPreviousState = function() {
        return this._prevState;
      };
      GameStateMachine.prototype.enter = function(state) {
        this._prevState = this._state;
        _super.prototype.enter.call(this, state);
      };
      return GameStateMachine;
    }(state_machine_1.StateMachine);
    exports.GameStateMachine = GameStateMachine;
    cc._RF.pop();
  }, {
    "../../utils/state_machine/state_machine": "state_machine"
  } ],
  game_state: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "05d1ae85XRBP6n2aVZMAiM9", "game_state");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ],
  greetings_state: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5d1ecGPoENKcI/eIfEg20y2", "greetings_state");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GreetingState = void 0;
    var postpener_1 = require("../../../utils/postponer/postpener");
    var game_state_machine_1 = require("../game_state_machine");
    var service_locator_1 = require("../../../utils/service_locator/service_locator");
    var scene_loader_1 = require("../scenes/scene_loader");
    var GreetingState = function() {
      function GreetingState() {
        this._gameStateMachine = service_locator_1.ServiceLocator.get(game_state_machine_1.IGameStateMachine);
        this._loader = service_locator_1.ServiceLocator.get(scene_loader_1.ISceneLoader);
      }
      GreetingState.prototype.enter = function() {
        var _this = this;
        postpener_1.Postponer.sequence().wait(function() {
          return _this._loader.popUp.show("\u041f\u0440\u0438\u0432\u0435\u0442!", "\u0423 \u043c\u0435\u043d\u044f \u0434\u043b\u044f \u0442\u0435\u0431\u044f \u0435\u0441\u0442\u044c \u043f\u0440\u043e\u0441\u044c\u0431\u0430. \u041f\u043e\u0442\u044b\u043a\u0430\u0439 \u0432 \u043c\u0435\u0441\u0442\u0430, \u0433\u0434\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 \u0432\u0441\u0435\u0433\u043e \u0431\u043b\u043e\u043a\u043e\u0432 \u043e\u0434\u043d\u043e\u0433\u043e \u0446\u0432\u0435\u0442\u0430.\n\u0421\u0432\u0435\u0440\u0445\u0443 \u0442\u044b \u043d\u0430\u0439\u0434\u0435\u0448\u044c \u043a\u043e\u043b-\u0432\u043e \u043e\u0441\u0442\u0430\u0432\u0448\u0438\u0445\u0441\u044f \u0445\u043e\u0434\u043e\u0432 \u0438 \u043e\u0447\u043a\u043e\u0432.\n1 \u0431\u043b\u043e\u043a = 100 \u043e\u0447\u043a\u043e\u0432.\n\u0412\u0440\u0435\u043c\u044f \u0434\u0435\u0439\u0441\u0442\u0432\u043e\u0432\u0430\u0442\u044c!");
        }).wait(function() {
          return _this._loader.popUp.hide();
        }).do(function() {
          _this._gameStateMachine.enter("CollapsingState");
        });
      };
      return GreetingState;
    }();
    exports.GreetingState = GreetingState;
    cc._RF.pop();
  }, {
    "../../../utils/postponer/postpener": "postpener",
    "../../../utils/service_locator/service_locator": "service_locator",
    "../game_state_machine": "game_state_machine",
    "../scenes/scene_loader": "scene_loader"
  } ],
  grid_presenter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e5740M6FKxAWYmwv/zarep3", "grid_presenter");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var service_locator_1 = require("../../../utils/service_locator/service_locator");
    var block_factory_1 = require("../model/block_factory");
    var grid_1 = require("../model/grid");
    var block_presenter_1 = require("./block_presenter");
    var Vec2 = cc.Vec2;
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var GridPresenter = function(_super) {
      __extends(GridPresenter, _super);
      function GridPresenter() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.gridNode = null;
        _this._cellSpeed = 2e3;
        return _this;
      }
      GridPresenter.prototype.onLoad = function() {
        this.onClick();
      };
      GridPresenter.prototype.start = function() {
        var _this = this;
        this._blockPresenters = new Map();
        this._grid = service_locator_1.ServiceLocator.get(grid_1.IGrid);
        this._gridSize = this._grid.getGridSize();
        this._blockFactory = service_locator_1.ServiceLocator.get(block_factory_1.BlockFactory);
        this._cellSize = new Vec2(0, 0);
        this.setCellSize();
        this._grid.state.subscribe(function(val) {
          return _this.onGridStateChanged(val);
        });
      };
      GridPresenter.prototype.onGridStateChanged = function(state) {
        switch (state) {
         case grid_1.GridState.None:
          break;

         case grid_1.GridState.Destroyed:
          this.onGridDestroy();
          break;

         case grid_1.GridState.Collapsed:
          this.collapse();
          break;

         case grid_1.GridState.WaitingInput:
          break;

         case grid_1.GridState.Matching:
          this.destroyMatches();
        }
      };
      GridPresenter.prototype.setCellSize = function() {
        var gridSize = this._grid.getGridSize();
        this._cellSize.x = Math.floor(this.gridNode.width / gridSize.x);
        this._cellSize.y = Math.floor(this.gridNode.height / gridSize.y);
      };
      GridPresenter.prototype.collapse = function() {
        var cells = this._grid.getCells();
        for (var i = 0; i < this._gridSize.x; i++) for (var j = this._gridSize.y - 1; j >= 0; j--) {
          var cell = cells[i][j];
          var block = cell.getBlock();
          if (!block.position) {
            this.spawnBlock(block, cell.position);
            this.move(block, cell.position);
            continue;
          }
          block.position != cells[i][j].position && this.move(block, cell.position);
        }
      };
      GridPresenter.prototype.spawnBlock = function(block, pos) {
        var startPos = this.grid_to_pixel(pos.x, -1);
        var node = this._blockFactory.create(block, this.gridNode, startPos);
        node.width = this._cellSize.x;
        node.height = this._cellSize.y;
        this._blockPresenters.set(block, node);
      };
      GridPresenter.prototype.move = function(block, to) {
        var height = this._gridSize.y + 1;
        var blockPresenter = this._blockPresenters.get(block);
        block.position || (block.position = new Vec2(to.x, -(height - to.y)));
        var startPos = this.grid_to_pixel(block.position.x, block.position.y);
        var endPos = this.grid_to_pixel(to.x, to.y);
        var distance = endPos.sub(startPos).mag();
        var duration = distance / this._cellSpeed;
        blockPresenter.setPosition(startPos.x, startPos.y);
        cc.tween(blockPresenter).to(duration, {
          position: endPos
        }).start();
      };
      GridPresenter.prototype.grid_to_pixel = function(column, row) {
        var new_x = this._cellSize.x * column;
        var new_y = -this._cellSize.y * row;
        return new Vec2(new_x, new_y);
      };
      GridPresenter.prototype.pixel_to_grid = function(position) {
        var column = Math.floor(position.x / this._cellSize.x);
        var row = Math.floor(position.y / -this._cellSize.y);
        return new Vec2(column, row);
      };
      GridPresenter.prototype.destroyMatches = function() {
        for (var _i = 0, _a = this._grid.getMatches(); _i < _a.length; _i++) {
          var cell = _a[_i];
          var block = cell.getBlock();
          this._blockPresenters.get(block).getComponent(block_presenter_1.default).inUse = false;
          block.inUse = false;
        }
      };
      GridPresenter.prototype.onClick = function() {
        var _this = this;
        var handler = function(event) {
          var location = event.getLocation();
          var localPos = _this.gridNode.convertToNodeSpaceAR(location);
          var cellPos = _this.pixel_to_grid(localPos);
          _this._grid.matchAt(cellPos);
        };
        this.gridNode.on(cc.Node.EventType.MOUSE_DOWN, handler, this);
        this.gridNode.on(cc.Node.EventType.TOUCH_START, handler, this);
      };
      GridPresenter.prototype.onGridDestroy = function() {
        var cells = this._grid.getCells();
        for (var i = 0; i < this._gridSize.x; i++) for (var j = 0; j < this._gridSize.y; j++) {
          var block = cells[i][j].getBlock();
          this._blockPresenters.get(block).getComponent(block_presenter_1.default).inUse = false;
          block.inUse = false;
        }
      };
      __decorate([ property(cc.Node) ], GridPresenter.prototype, "gridNode", void 0);
      GridPresenter = __decorate([ ccclass ], GridPresenter);
      return GridPresenter;
    }(cc.Component);
    exports.default = GridPresenter;
    cc._RF.pop();
  }, {
    "../../../utils/service_locator/service_locator": "service_locator",
    "../model/block_factory": "block_factory",
    "../model/grid": "grid",
    "./block_presenter": "block_presenter"
  } ],
  grid: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "adc31fnkwROuLNDeo6MDWcg", "grid");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Grid = exports.GridState = exports.IGrid = void 0;
    var Vec2 = cc.Vec2;
    var cell_data_1 = require("./cell_data");
    var block_1 = require("./block");
    var reactive_property_1 = require("../../../utils/types/reactive_property");
    exports.IGrid = Symbol("IGrid");
    var GridState;
    (function(GridState) {
      GridState[GridState["None"] = 0] = "None";
      GridState[GridState["Collapsed"] = 1] = "Collapsed";
      GridState[GridState["Destroyed"] = 2] = "Destroyed";
      GridState[GridState["WaitingInput"] = 3] = "WaitingInput";
      GridState[GridState["Matching"] = 4] = "Matching";
    })(GridState = exports.GridState || (exports.GridState = {}));
    var Grid = function() {
      function Grid(gridSize) {
        this._gridSize = gridSize;
        this._width = Math.floor(gridSize.x);
        this._height = Math.floor(gridSize.y);
        this._poolSize = 2 * this._width * this._height;
        this._cells = this.initCellsArray();
        this._blocks = this.initBlocksArray();
        this._isInput = false;
        this.state = new reactive_property_1.ReactiveProperty();
      }
      Grid.prototype.getGridSize = function() {
        return this._gridSize;
      };
      Grid.prototype.getCells = function() {
        return this._cells;
      };
      Grid.prototype.getMatches = function() {
        return this._matches;
      };
      Grid.prototype.collapse = function() {
        for (var i = 0; i < this._width; i++) for (var j = this._height - 1; j >= 0; j--) {
          var emptyCell = this._cells[i][j];
          if (emptyCell.getType() == cell_data_1.CellType.Empty) {
            for (var row = j - 1; row >= 0; row--) {
              var filledCellAbove = this._cells[i][row];
              if (filledCellAbove.getType() != cell_data_1.CellType.Empty) {
                this.move(filledCellAbove, emptyCell);
                break;
              }
            }
            emptyCell.getType() == cell_data_1.CellType.Empty && this.spawn(emptyCell);
          }
        }
        this.state.value = GridState.Collapsed;
      };
      Grid.prototype.prepare = function() {
        var hasMatches = false;
        for (var i = 0; i < this._width; i++) {
          for (var j = 0; j < this._height; j++) {
            var cell = this._cells[i][j];
            var matches = this.getAdjacentMatches(cell.position);
            if (matches.length >= 3) {
              hasMatches = true;
              break;
            }
          }
          if (hasMatches) break;
        }
        return !hasMatches;
      };
      Grid.prototype.destroy = function() {
        for (var i = 0; i < this._gridSize.x; i++) for (var j = 0; j < this._gridSize.y; j++) this._cells[i][j].free();
        this.state.value = GridState.Destroyed;
      };
      Grid.prototype.restart = function() {
        cc.game.end();
      };
      Grid.prototype.initCellsArray = function() {
        var array = new Array(this._width);
        for (var i = 0; i < this._width; i++) {
          array[i] = new Array(this._height);
          for (var j = 0; j < this._height; j++) array[i][j] = new cell_data_1.CellData(new Vec2(i, j));
        }
        return array;
      };
      Grid.prototype.initBlocksArray = function() {
        var array = new Array(this._poolSize);
        for (var i = 0; i < this._poolSize; i++) array[i] = new block_1.Block(1);
        return array;
      };
      Grid.prototype.getAdjacentMatches = function(startPos) {
        var _this = this;
        var startCell = this._cells[startPos.x][startPos.y];
        var targetType = startCell.getBlock().type;
        var visited = new Set();
        var matchedCells = [];
        var directions = [ new Vec2(0, 1), new Vec2(1, 0), new Vec2(0, -1), new Vec2(-1, 0) ];
        var inBounds = function(x, y) {
          return x >= 0 && x < _this._width && y >= 0 && y < _this._height;
        };
        var dfs = function(pos) {
          var key = pos.x + "," + pos.y;
          if (visited.has(key)) return;
          visited.add(key);
          var cell = _this._cells[pos.x][pos.y];
          if (cell.getBlock().type !== targetType) return;
          matchedCells.push(cell);
          for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
            var dir = directions_1[_i];
            var nx = pos.x + dir.x;
            var ny = pos.y + dir.y;
            inBounds(nx, ny) && dfs(new Vec2(nx, ny));
          }
        };
        dfs(startPos);
        return matchedCells;
      };
      Grid.prototype.matchAt = function(cellPos) {
        if (this.state.value != GridState.WaitingInput) return;
        var matches = this.getAdjacentMatches(cellPos);
        if (matches.length > 2) {
          this._matches = matches;
          this.state.value = GridState.Matching;
        } else this._cells[cellPos.x][cellPos.y].getBlock().state.value = block_1.BlockState.Clicked;
      };
      Grid.prototype.destroyMatches = function() {
        for (var _i = 0, _a = this._matches; _i < _a.length; _i++) {
          var cellData = _a[_i];
          cellData.free();
        }
      };
      Grid.prototype.move = function(from, to) {
        var block = from.takeBlock();
        block.state.value = block_1.BlockState.Moving;
        to.setBlock(block);
      };
      Grid.prototype.spawn = function(to) {
        var block = this.getBlockFromPool();
        block.state.value = block_1.BlockState.Spawning;
        block.type = cc.math.randomRangeInt(1, 5);
        block.position = null;
        to.setBlock(block);
      };
      Grid.prototype.getBlockFromPool = function() {
        for (var i = 0; i < this._poolSize; i++) if (!this._blocks[i].inUse) {
          var block = this._blocks[i];
          block.inUse = true;
          return block;
        }
        console.error("No free blocks in BlockModelPool");
        return new block_1.Block(1);
      };
      Grid.prototype.savePositions = function() {
        for (var i = 0; i < this._gridSize.x; i++) for (var j = 0; j < this._gridSize.y; j++) this._cells[i][j].getBlock().position = new Vec2(i, j);
      };
      return Grid;
    }();
    exports.Grid = Grid;
    cc._RF.pop();
  }, {
    "../../../utils/types/reactive_property": "reactive_property",
    "./block": "block",
    "./cell_data": "cell_data"
  } ],
  idle_state: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e1901Lf0MVFq7SH6nv5cKS7", "idle_state");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.IdleState = void 0;
    var grid_1 = require("../../grid/model/grid");
    var game_state_machine_1 = require("../game_state_machine");
    var service_locator_1 = require("../../../utils/service_locator/service_locator");
    var postpener_1 = require("../../../utils/postponer/postpener");
    var IdleState = function() {
      function IdleState() {
        this._grid = service_locator_1.ServiceLocator.get(grid_1.IGrid);
        this._gameStateMachine = service_locator_1.ServiceLocator.get(game_state_machine_1.IGameStateMachine);
      }
      IdleState.prototype.enter = function() {
        var _this = this;
        postpener_1.Postponer.sequence().do(function() {
          return _this._grid.state.value = grid_1.GridState.WaitingInput;
        }).wait(function() {
          return new Promise(function(resolve) {
            return _this._grid.state.subscribe(function() {
              _this._grid.state.value === grid_1.GridState.Matching && resolve();
            });
          });
        }).do(function() {
          return _this._gameStateMachine.enter("MatchingState");
        });
      };
      return IdleState;
    }();
    exports.IdleState = IdleState;
    cc._RF.pop();
  }, {
    "../../../utils/postponer/postpener": "postpener",
    "../../../utils/service_locator/service_locator": "service_locator",
    "../../grid/model/grid": "grid",
    "../game_state_machine": "game_state_machine"
  } ],
  loading_screen: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bfedf9pmdVCnLLuKF1jRE47", "loading_screen");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
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
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var tween_animations_1 = require("../model/tween_animations");
    var durations_1 = require("../../../durations");
    var cancelation_token_1 = require("../model/cancelation_token");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LoadingScreen = function(_super) {
      __extends(LoadingScreen, _super);
      function LoadingScreen() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.Logo = null;
        _this.ForegroundImage = null;
        return _this;
      }
      LoadingScreen.prototype.onDestroy = function() {
        this._cancellationToken.cancel();
      };
      LoadingScreen.prototype.start = function() {
        this._cancellationToken = new cancelation_token_1.CancellationToken();
        this.ForegroundImage.opacity = 0;
      };
      LoadingScreen.prototype.appear = function() {
        return __awaiter(this, void 0, Promise, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              this._cancellationToken = new cancelation_token_1.CancellationToken();
              tween_animations_1.TweenAnimation.pulsation(this.Logo, 2, this._cancellationToken);
              return [ 4, tween_animations_1.TweenAnimation.fadeTo(this.node, 1, durations_1.Durations.LoadingScreen, this._cancellationToken) ];

             case 1:
              _a.sent();
              return [ 2 ];
            }
          });
        });
      };
      LoadingScreen.prototype.fade = function() {
        return __awaiter(this, void 0, Promise, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              return [ 4, tween_animations_1.TweenAnimation.fadeTo(this.node, 0, durations_1.Durations.LoadingScreen, this._cancellationToken) ];

             case 1:
              _a.sent();
              this._cancellationToken.cancel();
              return [ 2 ];
            }
          });
        });
      };
      __decorate([ property(cc.Node) ], LoadingScreen.prototype, "Logo", void 0);
      __decorate([ property(cc.Node) ], LoadingScreen.prototype, "ForegroundImage", void 0);
      LoadingScreen = __decorate([ ccclass ], LoadingScreen);
      return LoadingScreen;
    }(cc.Component);
    exports.default = LoadingScreen;
    cc._RF.pop();
  }, {
    "../../../durations": "durations",
    "../model/cancelation_token": "cancelation_token",
    "../model/tween_animations": "tween_animations"
  } ],
  loosing_state: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e9480he8HtEpIhx0Dw9tUuA", "loosing_state");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LoosingState = void 0;
    var grid_1 = require("../../grid/model/grid");
    var game_state_machine_1 = require("../game_state_machine");
    var service_locator_1 = require("../../../utils/service_locator/service_locator");
    var postpener_1 = require("../../../utils/postponer/postpener");
    var scene_loader_1 = require("../scenes/scene_loader");
    var player_1 = require("../../player/model/player");
    var LoosingState = function() {
      function LoosingState() {
        this._grid = service_locator_1.ServiceLocator.get(grid_1.IGrid);
        this._loader = service_locator_1.ServiceLocator.get(scene_loader_1.ISceneLoader);
        this._gameStateMachine = service_locator_1.ServiceLocator.get(game_state_machine_1.IGameStateMachine);
        this._player = service_locator_1.ServiceLocator.get(player_1.IPlayer);
      }
      LoosingState.prototype.enter = function() {
        var _this = this;
        var level = this._player.getLevel().toString();
        postpener_1.Postponer.sequence().wait(function() {
          return _this._loader.popUp.show("\u041d\u0435\u0443\u0434\u0430\u0447\u0430 :(", "\u0412\u043e\u0437\u043c\u043e\u0436\u043d\u043e, " + level + " \u0443\u0440\u043e\u0432\u0435\u043d\u044c \u0441\u043b\u043e\u0436\u043d\u044b\u0439, \u0430 \u043c\u043e\u0436\u0435\u0442 \u0442\u0435\u0431\u0435 \u043f\u0440\u043e\u0441\u0442\u043e \u043d\u0435 \u043f\u043e\u0432\u0435\u0437\u043b\u043e?\n\u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439 \u0435\u0449\u0435 \u0440\u0430\u0437\u043e\u043a!");
        }).wait(function() {
          return _this._loader.popUp.hide();
        }).do(function() {
          return _this._gameStateMachine.destroyCount = 3;
        }).do(function() {
          return _this._player.reset();
        }).do(function() {
          return _this._gameStateMachine.enter("DestroyingState");
        });
      };
      return LoosingState;
    }();
    exports.LoosingState = LoosingState;
    cc._RF.pop();
  }, {
    "../../../utils/postponer/postpener": "postpener",
    "../../../utils/service_locator/service_locator": "service_locator",
    "../../grid/model/grid": "grid",
    "../../player/model/player": "player",
    "../game_state_machine": "game_state_machine",
    "../scenes/scene_loader": "scene_loader"
  } ],
  matching_state: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6eb8c6uUHhPbLLgOBzlDQGE", "matching_state");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.MatchingState = void 0;
    var grid_1 = require("../../grid/model/grid");
    var game_state_machine_1 = require("../game_state_machine");
    var service_locator_1 = require("../../../utils/service_locator/service_locator");
    var postpener_1 = require("../../../utils/postponer/postpener");
    var durations_1 = require("../../../durations");
    var MatchingState = function() {
      function MatchingState() {
        this._grid = service_locator_1.ServiceLocator.get(grid_1.IGrid);
        this._gameStateMachine = service_locator_1.ServiceLocator.get(game_state_machine_1.IGameStateMachine);
      }
      MatchingState.prototype.enter = function() {
        var _this = this;
        postpener_1.Postponer.sequence().do(function() {
          return _this._grid.destroyMatches();
        }).wait(function() {
          return new Promise(function(resolve) {
            setTimeout(resolve, 1e3 * durations_1.Durations.Destroying);
          });
        }).do(function() {
          return _this._gameStateMachine.enter("CollapsingState");
        });
      };
      return MatchingState;
    }();
    exports.MatchingState = MatchingState;
    cc._RF.pop();
  }, {
    "../../../durations": "durations",
    "../../../utils/postponer/postpener": "postpener",
    "../../../utils/service_locator/service_locator": "service_locator",
    "../../grid/model/grid": "grid",
    "../game_state_machine": "game_state_machine"
  } ],
  player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "27590RN7mBGxJOtyabpHM4o", "player");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Player = exports.IPlayer = void 0;
    var reactive_property_1 = require("../../../utils/types/reactive_property");
    var service_locator_1 = require("../../../utils/service_locator/service_locator");
    var grid_1 = require("../../grid/model/grid");
    exports.IPlayer = Symbol("IPlayer");
    var Player = function() {
      function Player(movesLeft, score, goal) {
        var _this = this;
        this._initMovesLeft = movesLeft;
        this._initScore = score;
        this._initGoal = goal;
        this._level = 1;
        this.movesLeft = new reactive_property_1.ReactiveProperty(movesLeft);
        this.score = new reactive_property_1.ReactiveProperty(score);
        this.goal = new reactive_property_1.ReactiveProperty(goal);
        this._grid = service_locator_1.ServiceLocator.get(grid_1.IGrid);
        this._grid.state.subscribe(function(gridState) {
          _this.onGridStateChanged(gridState);
        });
      }
      Player.prototype.onGridStateChanged = function(gridState) {
        switch (gridState) {
         case grid_1.GridState.None:
          break;

         case grid_1.GridState.Matching:
          this.countScore();
        }
      };
      Player.prototype.getLevel = function() {
        return this._level;
      };
      Player.prototype.getGoal = function() {
        return this._initGoal;
      };
      Player.prototype.countScore = function() {
        this.movesLeft.value = cc.math.clamp(this.movesLeft.value - 1, 0, this.movesLeft.value);
        var matchedBlocks = this._grid.getMatches().length;
        var blockValue = 100;
        this.score.value = cc.math.clamp(this.score.value + matchedBlocks * blockValue, 0, this.goal.value);
      };
      Player.prototype.checkWin = function() {
        return this.score.value >= this.goal.value;
      };
      Player.prototype.checkLoose = function() {
        return this.movesLeft.value < 1;
      };
      Player.prototype.reset = function() {
        this.movesLeft.value = this._initMovesLeft;
        this.goal.value = this._initGoal;
        this.score.value = this._initScore;
      };
      Player.prototype.levelUp = function() {
        this._level++;
        this._initMovesLeft += 2;
        this._initGoal += 1e3;
      };
      return Player;
    }();
    exports.Player = Player;
    cc._RF.pop();
  }, {
    "../../../utils/service_locator/service_locator": "service_locator",
    "../../../utils/types/reactive_property": "reactive_property",
    "../../grid/model/grid": "grid"
  } ],
  popup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7b87egd8/9LQawpaNRKOsOV", "popup");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
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
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var cancelation_token_1 = require("../model/cancelation_token");
    var tween_animations_1 = require("../model/tween_animations");
    var durations_1 = require("../../../durations");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var PopUp = function(_super) {
      __extends(PopUp, _super);
      function PopUp() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._isCancelled = new cancelation_token_1.CancellationToken();
        _this.headerLabel = null;
        _this.textLabel = null;
        _this.button = null;
        _this.visuals = null;
        return _this;
      }
      PopUp.prototype.onDestroy = function() {
        this._isCancelled.cancel();
      };
      PopUp.prototype.start = function() {
        this.visuals.opacity = 0;
      };
      PopUp.prototype.show = function(headerText, text) {
        return __awaiter(this, void 0, Promise, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              this.setData(headerText, text);
              this._isCancelled = new cancelation_token_1.CancellationToken();
              tween_animations_1.TweenAnimation.fadeTo(this.visuals, 1, durations_1.Durations.PopUp, this._isCancelled);
              tween_animations_1.TweenAnimation.scaleTo(this.visuals, 1, durations_1.Durations.PopUp, this._isCancelled);
              return [ 4, this.buttonClick() ];

             case 1:
              _a.sent();
              return [ 2 ];
            }
          });
        });
      };
      PopUp.prototype.hide = function() {
        return __awaiter(this, void 0, Promise, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              tween_animations_1.TweenAnimation.fadeTo(this.visuals, 0, durations_1.Durations.PopUp, this._isCancelled);
              return [ 4, tween_animations_1.TweenAnimation.scaleTo(this.visuals, 0, durations_1.Durations.PopUp, this._isCancelled) ];

             case 1:
              _a.sent();
              return [ 2 ];
            }
          });
        });
      };
      PopUp.prototype.setData = function(headerText, text) {
        this.headerLabel.string = headerText;
        this.textLabel.string = text;
      };
      PopUp.prototype.buttonClick = function() {
        var _this = this;
        return new Promise(function(resolve) {
          _this.button.node.on("click", function() {
            return resolve();
          });
        });
      };
      __decorate([ property(cc.Label) ], PopUp.prototype, "headerLabel", void 0);
      __decorate([ property(cc.Label) ], PopUp.prototype, "textLabel", void 0);
      __decorate([ property(cc.Button) ], PopUp.prototype, "button", void 0);
      __decorate([ property(cc.Node) ], PopUp.prototype, "visuals", void 0);
      PopUp = __decorate([ ccclass ], PopUp);
      return PopUp;
    }(cc.Component);
    exports.default = PopUp;
    cc._RF.pop();
  }, {
    "../../../durations": "durations",
    "../model/cancelation_token": "cancelation_token",
    "../model/tween_animations": "tween_animations"
  } ],
  postpener: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "54627u9FR1CALCwAGMtbITl", "postpener");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
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
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Postponer = void 0;
    var postponedSequence_1 = require("./postponedSequence");
    var Postponer;
    (function(Postponer) {
      var AutoRun = true;
      function sequence() {
        return setUpSequence(new postponedSequence_1.PostponedSequence());
      }
      Postponer.sequence = sequence;
      function wait(task) {
        var sequence = new postponedSequence_1.PostponedSequence();
        sequence.wait(task);
        return setUpSequence(sequence);
      }
      Postponer.wait = wait;
      function doAction(action) {
        var sequence = new postponedSequence_1.PostponedSequence();
        sequence.do(action);
        return setUpSequence(sequence);
      }
      Postponer.doAction = doAction;
      function delayOneFrame() {
        return new Promise(function(resolve) {
          setTimeout(resolve, 0);
        });
      }
      function run(sequence) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              return [ 4, delayOneFrame() ];

             case 1:
              _a.sent();
              return [ 4, sequence.run() ];

             case 2:
              _a.sent();
              return [ 2 ];
            }
          });
        });
      }
      function setUpSequence(sequence) {
        AutoRun && run(sequence).catch(console.warn);
        return sequence;
      }
    })(Postponer = exports.Postponer || (exports.Postponer = {}));
    cc._RF.pop();
  }, {
    "./postponedSequence": "postponedSequence"
  } ],
  postponedSequence: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "626d9NhdjVHkYTI8gHGgv8t", "postponedSequence");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
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
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.PostponedSequence = void 0;
    var PostponedSequence = function() {
      function PostponedSequence() {
        this.steps = [];
      }
      PostponedSequence.prototype.wait = function(task) {
        this.steps.push(task);
        return this;
      };
      PostponedSequence.prototype.do = function(action) {
        this.steps.push(function() {
          action();
          return Promise.resolve();
        });
        return this;
      };
      PostponedSequence.prototype.run = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _i, _a, step;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              _i = 0, _a = this.steps;
              _b.label = 1;

             case 1:
              if (!(_i < _a.length)) return [ 3, 4 ];
              step = _a[_i];
              return [ 4, step() ];

             case 2:
              _b.sent();
              _b.label = 3;

             case 3:
              _i++;
              return [ 3, 1 ];

             case 4:
              return [ 2 ];
            }
          });
        });
      };
      return PostponedSequence;
    }();
    exports.PostponedSequence = PostponedSequence;
    cc._RF.pop();
  }, {} ],
  reactive_property: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c2b3dcArE5O0py7Yz4BmA6U", "reactive_property");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ReactiveProperty = void 0;
    var ReactiveProperty = function() {
      function ReactiveProperty(initialValue) {
        this._bus = new cc.EventTarget();
        this._value = initialValue;
      }
      Object.defineProperty(ReactiveProperty.prototype, "value", {
        get: function() {
          return this._value;
        },
        set: function(val) {
          this._value = val;
          this._bus.emit("changed", val);
        },
        enumerable: false,
        configurable: true
      });
      ReactiveProperty.prototype.subscribe = function(onChange, thisArg) {
        onChange.call(thisArg, this._value);
        this._bus.on("changed", onChange, thisArg);
      };
      ReactiveProperty.prototype.unsubscribe = function(onChange, thisArg) {
        this._bus.off("changed", onChange, thisArg);
      };
      return ReactiveProperty;
    }();
    exports.ReactiveProperty = ReactiveProperty;
    cc._RF.pop();
  }, {} ],
  scene_list: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9a619xTQPpA/J2NsmK8VLkh", "scene_list");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SceneList = void 0;
    var SceneList;
    (function(SceneList) {
      SceneList["Main"] = "main";
    })(SceneList = exports.SceneList || (exports.SceneList = {}));
    cc._RF.pop();
  }, {} ],
  scene_loader: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8541ay7IRtEsbM38ZmpdNW+", "scene_loader");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
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
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SceneLoader = exports.ISceneLoader = void 0;
    var loading_screen_1 = require("../../ui/presenter/loading_screen");
    var popup_1 = require("../../ui/presenter/popup");
    exports.ISceneLoader = Symbol("ISceneLoader");
    var SceneLoader = function() {
      function SceneLoader() {
        this.LoadingScenePrefabPath = "/prefabs/ui/loading_screen";
        this.PopUpPrefabPath = "/prefabs/ui/pop_up";
        this._main = cc.find("Canvas/Main");
        this._persistent = cc.find("Canvas/Persistent");
        this.loadingScreen = cc.find("Canvas/Persistent/LoadingScreen").getComponent(loading_screen_1.default);
        this.popUp = cc.find("Canvas/Persistent/PopUp").getComponent(popup_1.default);
      }
      SceneLoader.prototype.load = function(scene) {
        return __awaiter(this, void 0, Promise, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              return [ 4, this.loadToMain(scene) ];

             case 1:
              _a.sent();
              return [ 2 ];
            }
          });
        });
      };
      SceneLoader.prototype.loadToPersistent = function(path, property, type) {
        var _this = this;
        cc.resources.load(path, cc.Prefab, function(err, prefab) {
          var node = cc.instantiate(prefab);
          property = node.getComponent(type);
          _this._persistent.addChild(node);
        });
      };
      SceneLoader.prototype.loadToMain = function(scene) {
        var _this = this;
        return new Promise(function(resolve, reject) {
          cc.resources.load(scene, cc.Prefab, function(err, prefab) {
            var node = cc.instantiate(prefab);
            _this._main.addChild(node);
            resolve();
          });
        });
      };
      return SceneLoader;
    }();
    exports.SceneLoader = SceneLoader;
    cc._RF.pop();
  }, {
    "../../ui/presenter/loading_screen": "loading_screen",
    "../../ui/presenter/popup": "popup"
  } ],
  service_locator: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c1b7fdQm2tGra+xaY1bLRGs", "service_locator");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ServiceLocator = void 0;
    var ServiceLocator = function() {
      function ServiceLocator() {}
      ServiceLocator.register = function(ctor, instance) {
        ServiceLocator.services.has(ctor) && console.warn(ctor.name + " is already registered. Overwriting.");
        ServiceLocator.services.set(ctor, instance);
      };
      ServiceLocator.get = function(ctor) {
        var service = ServiceLocator.services.get(ctor);
        if (!service) throw new Error("Service " + ctor.name + " not found. Did you register it?");
        return service;
      };
      ServiceLocator.remove = function(ctor) {
        ServiceLocator.services.delete(ctor);
      };
      ServiceLocator.clear = function() {
        ServiceLocator.services.clear();
      };
      ServiceLocator.services = new Map();
      return ServiceLocator;
    }();
    exports.ServiceLocator = ServiceLocator;
    cc._RF.pop();
  }, {} ],
  service: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "97167OBd/xGVb6ir0DYStK0", "service");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ],
  start_application: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "35b89KXEpJAK6pFLjtPPqUg", "start_application");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var game_state_machine_1 = require("./game_state_machine");
    var player_1 = require("../player/model/player");
    var service_locator_1 = require("../../utils/service_locator/service_locator");
    var block_factory_1 = require("../grid/model/block_factory");
    var scene_loader_1 = require("./scenes/scene_loader");
    var greetings_state_1 = require("./game_states/greetings_state");
    var collapsing_state_1 = require("./game_states/collapsing_state");
    var checking_state_1 = require("./game_states/checking_state");
    var idle_state_1 = require("./game_states/idle_state");
    var destroying_state_1 = require("./game_states/destroying_state");
    var winning_state_1 = require("./game_states/winning_state");
    var loosing_state_1 = require("./game_states/loosing_state");
    var grid_1 = require("../grid/model/grid");
    var postpener_1 = require("../../utils/postponer/postpener");
    var booting_state_1 = require("./game_states/booting_state");
    var durations_1 = require("../../durations");
    var matching_state_1 = require("./game_states/matching_state");
    var Vec2 = cc.Vec2;
    var ccclass = cc._decorator.ccclass;
    var StartApplication = function(_super) {
      __extends(StartApplication, _super);
      function StartApplication() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._gridSize = new Vec2(5, 5);
        return _this;
      }
      StartApplication.prototype.onLoad = function() {
        this.launchServices();
        this.launchGame();
      };
      StartApplication.prototype.launchServices = function() {
        this.bindSceneLoader();
        this.bindBlockFactory();
        this.bindGrid();
        this.bindPlayer();
        this.bindGameStateMachine();
      };
      StartApplication.prototype.launchGame = function() {
        var _this = this;
        postpener_1.Postponer.sequence().wait(function() {
          return new Promise(function(resolve) {
            return setTimeout(resolve, 1e3 * durations_1.Durations.LoadingScreen);
          });
        }).do(function() {
          return _this._gameStateMachine.enter("BootingState");
        });
      };
      StartApplication.prototype.bindPlayer = function() {
        var player = new player_1.Player(4, 0, 1e3);
        service_locator_1.ServiceLocator.register(player_1.IPlayer, player);
      };
      StartApplication.prototype.bindBlockFactory = function() {
        var blockFactory = new block_factory_1.BlockFactory(this._gridSize);
        blockFactory.load();
        service_locator_1.ServiceLocator.register(block_factory_1.BlockFactory, blockFactory);
      };
      StartApplication.prototype.bindGameStateMachine = function() {
        this._gameStateMachine = new game_state_machine_1.GameStateMachine();
        service_locator_1.ServiceLocator.register(game_state_machine_1.IGameStateMachine, this._gameStateMachine);
        this.initGameStateMachine();
      };
      StartApplication.prototype.bindSceneLoader = function() {
        var sceneLoader = new scene_loader_1.SceneLoader();
        service_locator_1.ServiceLocator.register(scene_loader_1.ISceneLoader, sceneLoader);
      };
      StartApplication.prototype.bindGrid = function() {
        var gridService = new grid_1.Grid(this._gridSize);
        service_locator_1.ServiceLocator.register(grid_1.IGrid, gridService);
      };
      StartApplication.prototype.initGameStateMachine = function() {
        var _this = this;
        var states = [ new booting_state_1.BootingState(), new greetings_state_1.GreetingState(), new collapsing_state_1.CollapsingState(), new checking_state_1.CheckingState(), new idle_state_1.IdleState(), new matching_state_1.MatchingState(), new destroying_state_1.DestroyingState(), new winning_state_1.WinningState(), new loosing_state_1.LoosingState() ];
        states.forEach(function(state) {
          _this._gameStateMachine.registerState(state);
        });
      };
      StartApplication = __decorate([ ccclass ], StartApplication);
      return StartApplication;
    }(cc.Component);
    exports.default = StartApplication;
    cc._RF.pop();
  }, {
    "../../durations": "durations",
    "../../utils/postponer/postpener": "postpener",
    "../../utils/service_locator/service_locator": "service_locator",
    "../grid/model/block_factory": "block_factory",
    "../grid/model/grid": "grid",
    "../player/model/player": "player",
    "./game_state_machine": "game_state_machine",
    "./game_states/booting_state": "booting_state",
    "./game_states/checking_state": "checking_state",
    "./game_states/collapsing_state": "collapsing_state",
    "./game_states/destroying_state": "destroying_state",
    "./game_states/greetings_state": "greetings_state",
    "./game_states/idle_state": "idle_state",
    "./game_states/loosing_state": "loosing_state",
    "./game_states/matching_state": "matching_state",
    "./game_states/winning_state": "winning_state",
    "./scenes/scene_loader": "scene_loader"
  } ],
  state_machine: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "30c68gYz/JJTq48xs+jLPSc", "state_machine");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.StateMachine = void 0;
    var StateMachine = function() {
      function StateMachine(states) {
        var _this = this;
        void 0 === states && (states = []);
        this._states = new Map();
        states.forEach(function(state) {
          return _this.registerState(state);
        });
      }
      StateMachine.prototype.registerState = function(state) {
        this._states.set(state.constructor.name, state);
      };
      StateMachine.prototype.enter = function(state) {
        this.switch(state);
        if (void 0 !== this._state.enter) {
          this._state.enter();
          console.log("State Machine: You entered in ", state);
        }
      };
      StateMachine.prototype.switch = function(state) {
        var next = this._states.get(state);
        if (!next) throw new Error('State "' + state + '" not registered');
        if (this._state && void 0 !== this._state.exit) {
          this._state.exit();
          console.log("State Machine: You exited from", state);
        }
        this._state = next;
      };
      return StateMachine;
    }();
    exports.StateMachine = StateMachine;
    cc._RF.pop();
  }, {} ],
  top_row_presenter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b177cm92dhB4rxPTEu8ecOS", "top_row_presenter");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var player_1 = require("../../player/model/player");
    var service_locator_1 = require("../../../utils/service_locator/service_locator");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TopRowPresenter = function(_super) {
      __extends(TopRowPresenter, _super);
      function TopRowPresenter() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.movesLeftLabel = null;
        _this.scoreLabel = null;
        return _this;
      }
      TopRowPresenter.prototype.start = function() {
        var _this = this;
        var player = service_locator_1.ServiceLocator.get(player_1.IPlayer);
        player.movesLeft.subscribe(function(movesLeft) {
          _this.onMovesLeftChanged(movesLeft);
        });
        player.goal.subscribe(function(goal) {
          _this.onGoalChanged(goal);
        });
        player.score.subscribe(function(score) {
          _this.onScoreChanged(score);
        });
      };
      TopRowPresenter.prototype.onMovesLeftChanged = function(movesLeft) {
        this.movesLeft = movesLeft;
        this.movesLeftLabel.string = movesLeft.toString();
      };
      TopRowPresenter.prototype.onScoreChanged = function(score) {
        this.score = score;
        this.scoreLabel.string = score.toString() + "/" + this.goal;
      };
      TopRowPresenter.prototype.onGoalChanged = function(goal) {
        this.goal = goal;
        this.scoreLabel.string += "/" + goal.toString();
      };
      __decorate([ property(cc.Label) ], TopRowPresenter.prototype, "movesLeftLabel", void 0);
      __decorate([ property(cc.Label) ], TopRowPresenter.prototype, "scoreLabel", void 0);
      TopRowPresenter = __decorate([ ccclass ], TopRowPresenter);
      return TopRowPresenter;
    }(cc.Component);
    exports.default = TopRowPresenter;
    cc._RF.pop();
  }, {
    "../../../utils/service_locator/service_locator": "service_locator",
    "../../player/model/player": "player"
  } ],
  tween_animations: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6ae3cuW5+lB2LnnH9pUx3qs", "tween_animations");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.TweenAnimation = void 0;
    var TweenAnimation = function() {
      function TweenAnimation() {}
      TweenAnimation.fadeTo = function(node, opacity, duration, cancellation) {
        return new Promise(function(resolve) {
          if (cancellation.isCancelled) {
            resolve();
            return;
          }
          cc.tween(node).to(duration, {
            opacity: 255 * opacity
          }).call(function() {
            if (cancellation.isCancelled) return;
            resolve();
          }).start();
        });
      };
      TweenAnimation.scaleTo = function(node, scale, duration, cancellation) {
        return new Promise(function(resolve) {
          if (cancellation.isCancelled) {
            resolve();
            return;
          }
          var initScale = scale > 0 ? 0 : node.scale;
          cc.tween(node).set({
            scale: initScale
          }).to(duration, {
            scale: scale
          }, {
            easing: "cubicIn"
          }).call(function() {
            if (cancellation.isCancelled) return;
            resolve();
          }).start();
        });
      };
      TweenAnimation.pulsation = function(node, frequency, cancellation) {
        return new Promise(function(resolve) {
          if (cancellation.isCancelled) {
            cc.tween(node).stop();
            resolve();
            return;
          }
          cc.tween(node).set({
            scale: 1
          }).to(frequency / 4, {
            scale: 1.2
          }, {
            easing: "sineIn"
          }).to(frequency / 4, {
            scale: 1
          }, {
            easing: "sineOut"
          }).union().repeatForever().start();
        });
      };
      return TweenAnimation;
    }();
    exports.TweenAnimation = TweenAnimation;
    cc._RF.pop();
  }, {} ],
  ui_presenter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "adba9mDc9ZIuK91IhvohS1Q", "ui_presenter");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var service_locator_1 = require("../../../utils/service_locator/service_locator");
    var popup_1 = require("./popup");
    var grid_1 = require("../../grid/model/grid");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var UIPresenter = function(_super) {
      __extends(UIPresenter, _super);
      function UIPresenter() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.restartPopUpPrefab = null;
        _this.backgroundSprite = null;
        return _this;
      }
      UIPresenter.prototype.start = function() {
        this.grid = service_locator_1.ServiceLocator.get(grid_1.IGrid);
        var restartPopUpNode = cc.instantiate(this.restartPopUpPrefab);
        this.popUp = restartPopUpNode.getComponent(popup_1.default);
        this.popUp.hide();
        restartPopUpNode.parent = this.node;
      };
      UIPresenter.prototype.showWinPopUp = function() {
        var _this = this;
        this.popUp.setData("You Win!!!");
        this.popUp.button.node.on("click", function(button) {
          _this.restart();
        });
        this.popUp.show();
      };
      UIPresenter.prototype.showLoosePopUp = function() {
        var _this = this;
        this.popUp.setData("You Loose :(");
        this.popUp.button.node.on("click", function(button) {
          _this.restart();
        });
        this.popUp.show();
      };
      UIPresenter.prototype.restart = function() {
        this.popUp.button.node.off("click");
        this.popUp.hide();
      };
      __decorate([ property(cc.Prefab) ], UIPresenter.prototype, "restartPopUpPrefab", void 0);
      __decorate([ property(cc.Sprite) ], UIPresenter.prototype, "backgroundSprite", void 0);
      UIPresenter = __decorate([ ccclass ], UIPresenter);
      return UIPresenter;
    }(cc.Component);
    exports.default = UIPresenter;
    cc._RF.pop();
  }, {
    "../../../utils/service_locator/service_locator": "service_locator",
    "../../grid/model/grid": "grid",
    "./popup": "popup"
  } ],
  winning_state: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2607chJQ3tGzbB9/02hTyC2", "winning_state");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.WinningState = void 0;
    var grid_1 = require("../../grid/model/grid");
    var scene_loader_1 = require("../scenes/scene_loader");
    var game_state_machine_1 = require("../game_state_machine");
    var service_locator_1 = require("../../../utils/service_locator/service_locator");
    var postpener_1 = require("../../../utils/postponer/postpener");
    var player_1 = require("../../player/model/player");
    var WinningState = function() {
      function WinningState() {
        this._grid = service_locator_1.ServiceLocator.get(grid_1.IGrid);
        this._loader = service_locator_1.ServiceLocator.get(scene_loader_1.ISceneLoader);
        this._gameStateMachine = service_locator_1.ServiceLocator.get(game_state_machine_1.IGameStateMachine);
        this._player = service_locator_1.ServiceLocator.get(player_1.IPlayer);
      }
      WinningState.prototype.enter = function() {
        var _this = this;
        var goal = this._player.getGoal().toString();
        var nextLevel = (this._player.getLevel() + 1).toString();
        postpener_1.Postponer.sequence().wait(function() {
          return _this._loader.popUp.show("\u041f\u043e\u0431\u0435\u0434\u0430!!!", "\u041c\u043e\u043b\u043e\u0434\u0435\u0446, \u0442\u044b \u0437\u0430\u0440\u0430\u0431\u043e\u0442\u0430\u043b...\n" + goal + " \u043e\u0447\u043a\u043e\u0432!!!\n\u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439 " + nextLevel + " \u0443\u0440\u043e\u0432\u0435\u043d\u044c.");
        }).wait(function() {
          return _this._loader.popUp.hide();
        }).do(function() {
          return _this._grid.destroy();
        }).wait(function() {
          return _this._loader.loadingScreen.appear();
        }).do(function() {
          return _this._player.levelUp();
        }).do(function() {
          return _this._player.reset();
        }).do(function() {
          return _this._gameStateMachine.destroyCount = 3;
        }).wait(function() {
          return _this._loader.loadingScreen.fade();
        }).do(function() {
          return _this._gameStateMachine.enter("CollapsingState");
        });
      };
      return WinningState;
    }();
    exports.WinningState = WinningState;
    cc._RF.pop();
  }, {
    "../../../utils/postponer/postpener": "postpener",
    "../../../utils/service_locator/service_locator": "service_locator",
    "../../grid/model/grid": "grid",
    "../../player/model/player": "player",
    "../game_state_machine": "game_state_machine",
    "../scenes/scene_loader": "scene_loader"
  } ]
}, {}, [ "durations", "booster", "booster_factory", "booster_presenter", "block", "block_factory", "cell_data", "grid", "block_presenter", "grid_presenter", "game_state_machine", "booting_state", "checking_state", "collapsing_state", "destroying_state", "game_state", "greetings_state", "idle_state", "loosing_state", "matching_state", "winning_state", "scene_list", "scene_loader", "start_application", "player", "cancelation_token", "tween_animations", "loading_screen", "popup", "top_row_presenter", "ui_presenter", "event_emmiter", "postpener", "postponedSequence", "service", "service_locator", "state_machine", "reactive_property" ]);