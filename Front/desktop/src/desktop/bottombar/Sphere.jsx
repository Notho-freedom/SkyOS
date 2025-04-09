import { motion } from "framer-motion"

const Sphere = ({ action }) => {
  return (
    <motion.div
      className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-400 to-blue-300 z-50 flex justify-center items-center shadow-lg relative group cursor-pointer"
      initial={{ scale: 0.8 }}
      animate={{
        scale: [0.95, 1, 0.95], // Plus subtil que la précédente animation
        rotate: [0, 180, 360], // Rotation dynamique
        boxShadow: [
          "0px 0px 10px rgba(0, 0, 255, 0.6)",
          "0px 0px 20px rgba(255, 0, 255, 0.8)",
          "0px 0px 30px rgba(0, 255, 255, 0.6)"
        ], // Changement de l'ombre pour simuler un effet de lumière fluide
        background: [
          "linear-gradient(to right, #4e73df, #9b4bdb)",
          "linear-gradient(to right, #ff5c8d, #ffa64d)",
          "linear-gradient(to right, #1cc3fa, #39b8f7)"
        ] // Change la couleur de fond de manière fluide
      }}
      transition={{
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      onClick={action}
      title="MAX IA"
    >

      {/* Effet halo interactif sur le survol */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-50 transition-opacity duration-300"
      />
      <div className="relative w-[2vh] h-[2vh] group cursor-pointer">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-sky-200 animate-complexSpin transform-gpu">
          <div className="absolute inset-2 rounded-full bg-gradient-to-b from-white/40 to-transparent animate-pulse"></div>
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-300/30 to-blue-400/30 animate-energyFlow mix-blend-screen"></div>
          <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-dynamicReflect"></div>
        </div>

        <div className="absolute -inset-6 rounded-full bg-radial-gradient(from_60%_60%, #00aaff10, transparent 60%) animate-haloPulse mix-blend-lighten"></div>

        <div className="absolute inset-0 rounded-full animate-particleFloat">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
              }}
            />
          ))}
        </div>
      </div>

    </motion.div>
  )
}

export default Sphere
