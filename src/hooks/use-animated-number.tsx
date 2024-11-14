import { useState, useEffect } from "react"

type AnimatedNumberProps = {
  amount: number
  duration?: number // duração em milissegundos, opcional
}

export const useAnimatedNumber = ({
  amount,
  duration = 1000
}: AnimatedNumberProps) => {
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    let start = 0
    const startValue = currentValue
    const distance = amount - startValue

    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = timestamp - start
      const progressFraction = Math.min(progress / duration, 1) // Limitado a 1 para parar no valor final

      setCurrentValue(startValue + distance * progressFraction)

      if (progress < duration) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)

    return () => cancelAnimationFrame(requestAnimationFrame(step))
  }, [amount, currentValue, duration])

  return currentValue
}
