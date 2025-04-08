import { toast } from "sonner";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

// Import des sons
import successSound from "./success.mp3";
import errorSound from "./error.mp3";
import infoSound from "./info.mp3";
import warningSound from "./warning.mp3";

// Mapping des sons avec les types de notification
const sounds = {
  success: successSound,
  error: errorSound,
  info: infoSound,
  warning: warningSound,
};

// Mapping des icônes pour chaque type
const icons = {
  success: <CheckCircle className="text-green-500 w-6 h-6" />,
  error: <XCircle className="text-red-500 w-6 h-6" />,
  info: <Info className="text-blue-500 w-6 h-6" />,
  warning: <AlertTriangle className="text-yellow-500 w-6 h-6" />,
};

const playSound = (type) => {
  try {
    const sound = new Audio(sounds[type]);
    sound.currentTime = 0;
    sound.play().catch(() => {}); // Silently ignore autoplay errors
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};


// Fonction pour afficher la notification
export const showNotification = (title, message, type = "info") => {
  playSound(type);

  toast.custom((t) => (
    <div
      className={`flex items-center gap-2 bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-2 border mt-3 ${
        type === "success"
          ? "border-green-400"
          : type === "error"
          ? "border-red-400"
          : type === "warning"
          ? "border-yellow-400"
          : "border-gray-300"
      }`}
    >
      {icons[type]}
      <div className="flex flex-col">
        <strong className="text-gray-800 dark:text-white">{title}</strong>
        <span className="text-gray-500 dark:text-gray-400">{message}</span>
      </div>
      <button onClick={() => toast.dismiss(t.id)} className="ml-auto text-gray-400 hover:text-gray-600">
        ✖
      </button>
    </div>
  ));
};
