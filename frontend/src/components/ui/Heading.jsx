import { useMemo } from 'react'

const Heading = () => {
  const headingText = 'BabyBook'

  const letterStyles = useMemo(() => {
    const colors = ['#EED3D9', '#B5C0D0', '#CCD3CA']
    const rotations = ['-7deg', '-3deg', '0deg', '3deg', '7deg']
    return Array.from(headingText).map((letter, index) => ({
      color: colors[index % colors.length],
      rotation: rotations[index % rotations.length],
    }))
  }, [headingText])

  return (
    <h1 className="font-bold my-8 justify-self-center">
      {headingText.split('').map((letter, index) => (
        <span
          key={index}
          style={{
            color: letterStyles[index].color,
            transform: `rotate(${letterStyles[index].rotation})`,
            textShadow: '2px 2px 7px rgba(0, 0, 0, 0.6)',
          }}
        >
          {letter}
        </span>
      ))}
    </h1>
  )
}

export default Heading
