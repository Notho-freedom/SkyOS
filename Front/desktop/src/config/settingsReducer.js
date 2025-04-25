
export const initialState = {
    network: {
      type: 'WiFi', // 'WiFi' | 'Ethernet' | 'Offline'
      airplaneMode: false,
    },
    sound: {
      volume: 70,
      muted: false,
      output: 'Speakers', // 'Speakers' | 'Headphones' | 'Bluetooth'
    },
    display: {
      brightness: 80,
      resolution: '1920x1080',
      nightMode: false,
      scale: 1.0,
    },
    battery: {
      saverMode: false,
      percentage: 100,
      charging: true,
    },
    security: {
      firewall: true,
      autoUpdates: true,
      passwordRequired: true,
    },
    keyboard: {
      layout: 'azerty', // 'azerty' | 'qwerty'
      repeatRate: 'normal',
      backlight: true,
    },
    mouse: {
      speed: 50,
      naturalScroll: true,
      leftHanded: false,
    },
    dateTime: {
      automatic: true,
      timezone: 'Europe/Paris',
      format24h: true,
    },
    system: {
      theme: "light",
      accentColor: "blue",
      fontFamily: "sans-serif",
      fontSize: "16px",
      fontWeight: "400",
      reduceMotion: false,
      reduceTransparency: false,
      highContrast: false,
      fontSmoothing: false,
      interfaceDensity: "default",
    },
  };
  
  export default function settingsReducer(state, action) {
    switch (action.type) {
      // NETWORK
      case 'SET_NETWORK_TYPE':
        return { ...state, network: { ...state.network, type: action.payload } };
      case 'TOGGLE_AIRPLANE_MODE':
        return { ...state, network: { ...state.network, airplaneMode: !state.network.airplaneMode } };
  
      // SOUND
      case 'SET_VOLUME':
        return { ...state, sound: { ...state.sound, volume: action.payload } };
      case 'TOGGLE_MUTE':
        return { ...state, sound: { ...state.sound, muted: !state.sound.muted } };
      case 'SET_OUTPUT_DEVICE':
        return { ...state, sound: { ...state.sound, output: action.payload } };
  
      // DISPLAY
      case 'SET_BRIGHTNESS':
        return { ...state, display: { ...state.display, brightness: action.payload } };
      case 'SET_RESOLUTION':
        return { ...state, display: { ...state.display, resolution: action.payload } };
      case 'TOGGLE_NIGHT_MODE':
        return { ...state, display: { ...state.display, nightMode: !state.display.nightMode } };
      case 'SET_SCALE':
        return { ...state, display: { ...state.display, scale: action.payload } };
  
      // BATTERY
      case 'TOGGLE_SAVER_MODE':
        return { ...state, battery: { ...state.battery, saverMode: !state.battery.saverMode } };
      case 'SET_BATTERY_PERCENTAGE':
        return { ...state, battery: { ...state.battery, percentage: action.payload } };
      case 'SET_CHARGING_STATUS':
        return { ...state, battery: { ...state.battery, charging: action.payload } };
  
      // SECURITY
      case 'TOGGLE_FIREWALL':
        return { ...state, security: { ...state.security, firewall: !state.security.firewall } };
      case 'TOGGLE_AUTO_UPDATES':
        return { ...state, security: { ...state.security, autoUpdates: !state.security.autoUpdates } };
      case 'TOGGLE_PASSWORD_REQUIRED':
        return { ...state, security: { ...state.security, passwordRequired: !state.security.passwordRequired } };
  
      // KEYBOARD
      case 'SET_KEYBOARD_LAYOUT':
        return { ...state, keyboard: { ...state.keyboard, layout: action.payload } };
      case 'SET_REPEAT_RATE':
        return { ...state, keyboard: { ...state.keyboard, repeatRate: action.payload } };
      case 'TOGGLE_KEYBOARD_BACKLIGHT':
        return { ...state, keyboard: { ...state.keyboard, backlight: !state.keyboard.backlight } };
  
      // MOUSE
      case 'SET_MOUSE_SPEED':
        return { ...state, mouse: { ...state.mouse, speed: action.payload } };
      case 'TOGGLE_NATURAL_SCROLL':
        return { ...state, mouse: { ...state.mouse, naturalScroll: !state.mouse.naturalScroll } };
      case 'TOGGLE_LEFT_HANDED':
        return { ...state, mouse: { ...state.mouse, leftHanded: !state.mouse.leftHanded } };
  
      // DATE & TIME
      case 'TOGGLE_AUTOMATIC_TIME':
        return { ...state, dateTime: { ...state.dateTime, automatic: !state.dateTime.automatic } };
      case 'SET_TIMEZONE':
        return { ...state, dateTime: { ...state.dateTime, timezone: action.payload } };
      case 'TOGGLE_FORMAT_24H':
        return { ...state, dateTime: { ...state.dateTime, format24h: !state.dateTime.format24h } };
  
      // SYSTEM
      case 'SET_THEME':
        return { ...state, system: { ...state.system, theme: action.payload } };
      case 'SET_LANGUAGE':
        return { ...state, system: { ...state.system, language: action.payload } };
      case 'TOGGLE_ANIMATIONS':
        return { ...state, system: { ...state.system, animations: !state.system.animations } };
      case "SET_ACCENT_COLOR":
        return { ...state, system: { ...state.system, accentColor: action.payload } }
      case "SET_FONT_FAMILY":
        return { ...state, system: { ...state.system, fontFamily: action.payload } }
      case "SET_FONT_SIZE":
        return { ...state, system: { ...state.system, fontSize: action.payload } }
      case "SET_FONT_WEIGHT":
        return { ...state, system: { ...state.system, fontWeight: action.payload } }
      case "TOGGLE_REDUCE_MOTION":
        return { ...state, system: { ...state.system, reduceMotion: !state.system.reduceMotion } }
      case "TOGGLE_REDUCE_TRANSPARENCY":
        return { ...state, system: { ...state.system, reduceTransparency: !state.system.reduceTransparency } }
      case "TOGGLE_HIGH_CONTRAST":
        return { ...state, system: { ...state.system, highContrast: !state.system.highContrast } }
      case "TOGGLE_FONT_SMOOTHING":
        return { ...state, system: { ...state.system, fontSmoothing: !state.system.fontSmoothing } }
      case "SET_INTERFACE_DENSITY":
        return { ...state, system: { ...state.system, interfaceDensity: action.payload } }


      // DEFAULT
      default:
        return state;
    }
  }
  