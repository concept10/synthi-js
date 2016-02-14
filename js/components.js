
var Output = new Component(["A", "C"], null, [{
  ugen: "flock.ugen.math",
  inputs: {
    source: {
      id: "left1",
      ugen: "flock.ugen.math",
      source: {
        id: "input-A1",
        ugen: "flock.ugen.in",
        mul: 1
      },
      mul: 1
    },
    add: {
      id: "left2",
      ugen: "flock.ugen.math",
      source: {
        id: "input-C1",
        ugen: "flock.ugen.in",
        mul: 0
      },
      mul: 1
    }
  }
},{
  ugen: "flock.ugen.math",
  inputs: {
    source: {
      id: "right1",
      ugen: "flock.ugen.math",
      source: {
        id: "input-A2",
        ugen: "flock.ugen.in",
        mul: 0
      },
      mul: 1
    },
    add: {
      id: "right2",
      ugen: "flock.ugen.math",
      source: {
        id: "input-C2",
        ugen: "flock.ugen.in",
        mul: 1
      },
      mul: 1
    }
  }
}]);
Output.connect = function (inputPin, connectedPins) {
  this.connectedPins = connectedPins;
  var inputBuses = connectedPins.map(function (p) {return buses[p];});

  this.synth.set("input-"+inputPin+"1.bus", inputBuses);
  this.synth.set("input-"+inputPin+"2.bus", inputBuses);
  this.moveToFront();
};
Output.set = function (property, value) {
  this.synth.set(property, value);
};

var Scope = new Component(["B"], 0, {
  ugen: "flock.ugen.scope",
  source: {
    id: "input-B",
    ugen: "flock.ugen.in",
    mul: 1/6  // up to 6V p-p input -> 1V p-p scope output
  },
  options: {
    canvas: gfx,
    styles: {
      strokeColor: "#777777",
      strokeWidth: 2
    }
  }
});

var Vco1sin = new Component(["I"], 3, {
  ugen: "flock.ugen.sinOsc",
  freq: {
    ugen: "flock.ugen.value",
    rate: "audio",
    value: 440,
    mul: {
      ugen: "flock.ugen.math",
      inputs: {
        source: 2,
        pow: {
          id: "input-I",
          ugen: "flock.ugen.in",
          add: 1
        }
      }
    }
  },
  mul: 0.3
});

var Vco1ramp = new Component(["I"], 3, {
  ugen: "flock.ugen.osc",
  table: tables.ramp,
  freq: {
    ugen: "flock.ugen.value",
    rate: "audio",
    value: 440,
    mul: {
      ugen: "flock.ugen.math",
      inputs: {
        source: 2,
        pow: {
          id: "input-I",
          ugen: "flock.ugen.in",
          add: 1
        }
      }
    }
  },
  options: {
    interpolation: "linear"
  },
  mul: 0
});

var Vco2square = new Component(["J"], 4, {
  ugen: "flock.ugen.squareOsc",
  freq: {
    ugen: "flock.ugen.value",
    rate: "audio",
    value: 440,
    mul: {
      ugen: "flock.ugen.math",
      inputs: {
        source: 2,
        pow: {
          id: "input-J",
          ugen: "flock.ugen.in",
          add: 1
        }
      }
    }
  },
  mul: 0.4
});

var Vco2triangle = new Component(["J"], 4, {
  ugen: "flock.ugen.triOsc",
  freq: {
    ugen: "flock.ugen.value",
    rate: "audio",
    value: 440,
    mul: {
      ugen: "flock.ugen.math",
      inputs: {
        source: 2,
        pow: {
          id: "input-J",
          ugen: "flock.ugen.in",
          add: 1
        }
      }
    }
  },
  mul: 0
});

var Vco3square = new Component(["K"], 5, {
  ugen: "flock.ugen.squareOsc",
  freq: {
    ugen: "flock.ugen.value",
    rate: "audio",
    value: 1,
    mul: {
      ugen: "flock.ugen.math",
      inputs: {
        source: 2,
        pow: {
          id: "input-K",
          ugen: "flock.ugen.in",
          add: 1
        }
      }
    }
  },
  mul: 0.4
});

var Vco3triangle = new Component(["K"], 5, {
  ugen: "flock.ugen.triOsc",
  freq: {
    ugen: "flock.ugen.value",
    rate: "audio",
    value: 1,
    mul: {
      ugen: "flock.ugen.math",
      inputs: {
        source: 2,
        pow: {
          id: "input-K",
          ugen: "flock.ugen.in",
          add: 1
        }
      }
    }
  },
  mul: 0
});

var NoiseGenerator = new Component([], 7, {
  ugen: "flock.ugen.filter.biquad.bp",
  source: {
    ugen: "flock.ugen.whiteNoise",
    mul: 0.3
  },
  freq: 440,
  q: 2.0
});

var InputCh1 = new Component([], 8, {
  ugen: "flock.ugen.playBuffer",
  buffer: {
    url: ""
  },
  speed: 1,
  loop: 1,
  start: 0
});

var InputCh2 = new Component([], 9, {
  ugen: "flock.ugen.playBuffer",
  buffer: {
    url: ""
  },
  speed: 1,
  loop: 1,
  start: 0
});

var FilterOscillator = new Component(["H", "N"], 10, {
  ugen: "flock.ugen.filter.moog",
  cutoff: 10000,
  resonance: 0,
  source: {
    id: "input-H",
    ugen: "flock.ugen.in"
  },
  mul: 0.5
});

var EnvelopeTrapezoid = new Component(["L"], 11, {
  ugen: "flock.ugen.math",
  inputs: {
    source: {
      id: "env",
      ugen: "flock.ugen.asr",
      start: 0.0,
      attack: 0.01,
      sustain: 1.0,
      on: 1.0,
      release: {
        ugen: "flock.ugen.value",
        value: 1.0,
        mul: {
          ugen: "flock.ugen.math",
          inputs: {
            source: 2,
            pow: {
              id: "input-L",
              ugen: "flock.ugen.in",
              add: 1
            }
          }
        }
      },
      off: 1.0,
      gate: {
        ugen: "flock.ugen.lfPulse",
        rate: "control",
        freq: (1 / 3.01) * 2,
        width: 0.5
      },
      mul: 7
    },
    add: -4
  }
});
EnvelopeTrapezoid.set = function (property, value) {
  this.synth.set("env."+property, value);

  var totalTime = this.synth.get("env.attack") + this.synth.get("env.on") + this.synth.get("env.release.value") + this.synth.get("env.off");
  var attackTime = this.synth.get("env.attack") + this.synth.get("env.on");

  this.synth.set("env.gate.freq", 1 / totalTime);
  this.synth.set("env.gate.width", attackTime / totalTime);
};

var EnvelopeShaper = new Component(["D", "L"], 12, {
  ugen: "flock.ugen.math", 
  inputs: {
    source: {
      id: "input-D",
      ugen: "flock.ugen.in",
      mul: {
        id: "env",
        ugen: "flock.ugen.asr",
        start: 0.0,
        attack: 0.01,
        sustain: 1.0,
        on: 1.0,
        release: {
          ugen: "flock.ugen.value",
          value: 1.0,
          mul: {
            ugen: "flock.ugen.math",
            inputs: {
              source: 2,
              pow: {
                id: "input-L",
                ugen: "flock.ugen.in",
                add: 1
              }
            }
          }
        },
        off: 1.0,
        gate: {
          ugen: "flock.ugen.lfPulse",
          rate: "control",
          freq: (1 / 3.01) * 2,
          width: 0.5
        }
      }
    },
    mul: 0.5
  }
});
EnvelopeShaper.set = function (property, value) {
  this.synth.set("env."+property, value);

  var totalTime = this.synth.get("env.attack") + this.synth.get("env.on") + this.synth.get("env.release.value") + this.synth.get("env.off");
  var attackTime = this.synth.get("env.attack") + this.synth.get("env.on")

  this.synth.set("env.gate.freq", 1 / totalTime);
  this.synth.set("env.gate.width", attackTime / totalTime);

  EnvelopeLightOn.synth.set("trigger.freq", 1 / totalTime);
  EnvelopeLightOn.synth.set("trigger.width", attackTime / totalTime);

  EnvelopeLightOff.synth.set("trigger.freq", 1 / totalTime);
  EnvelopeLightOff.synth.set("trigger.width", attackTime / totalTime);
};

var EnvelopeLightOn = new Component([], 0, {
  ugen: "flock.ugen.triggerCallback",
  trigger: {
    id: "trigger",
    ugen: "flock.ugen.lfPulse",
    rate: "control",
    freq: (1 / 3.01) * 2,
    width: 0.5
  },
  options: {
    callback: {
      func: function () {
        $('#envLight').addClass('on');
      }
    }
  }
});

var EnvelopeLightOff = new Component([], 0, {
  ugen: "flock.ugen.triggerCallback",
  trigger: {
    ugen: "flock.ugen.math",
    inputs: {
      source: {
        id: "trigger",
        ugen: "flock.ugen.lfPulse",
        rate: "control",
        freq: (1 / 3.01) * 2,
        width: 0.5
      },
      mul: -1
    }
  },
  options: {
    callback: {
      func: function () {
        $('#envLight').removeClass('on');
      }
    }
  }
});

var RingModulator = new Component(["E", "F"], 13, {
  ugen: "flock.ugen.math",
  inputs: {
    source: {
      id: "input-E",
      ugen: "flock.ugen.in",
      mul: 0.5
    },
    mul: {
      id: "input-F",
      ugen: "flock.ugen.in"
    }
  }
});

var Reverb = new Component(["G", "M"], 14, {
  ugen: "flock.ugen.freeverb",
  inputs: {
    source: {
      id: "input-G",
      ugen: "flock.ugen.in"
    },
    mix: 0.5,
    room: 0.84,
    damp: 0.2,
    mul: 0.5
  }
});

var JoystickX = new Component([], 15, {
  ugen: "flock.ugen.math",
  inputs: {
    source: {
      ugen: "flock.ugen.mouse.cursor",
      add: -0.5,
      mul: 1,
      options: {
        axis: "x",
        target: "#joystick"
      }
    },
    mul: {
      ugen: "flock.ugen.mouse.click",
      options: {
        target: "#joystick"
      }
    }
  }
});

var JoystickY = new Component([], 16, {
  ugen: "flock.ugen.math",
  inputs: {
    source: {
      ugen: "flock.ugen.mouse.cursor",
      add: -2.5,
      mul: -1,
      options: {
        axis: "y",
        target: "#joystick"
      }
    },
    mul: {
      ugen: "flock.ugen.mouse.click",
      options: {
        target: "#joystick"
      }
    }
  }
});

