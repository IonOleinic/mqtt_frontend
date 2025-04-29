const CurrentIcon = (props) => {
  return (
    <svg
      version='1.0'
      xmlns='http://www.w3.org/2000/svg'
      width={props.size || '128.000000pt'}
      height={props.size || '128.000000pt'}
      viewBox='0 0 128.000000 128.000000'
      preserveAspectRatio='xMidYMid meet'
      fill={props.color || 'currentColor'}
      stroke='none'
    >
      <g transform='translate(0.000000,128.000000) scale(0.100000,-0.100000)'>
        <path
          d='M602 1268 c-19 -24 -322 -638 -322 -653 0 -12 22 -15 119 -17 l119
-3 -119 -284 c-66 -157 -117 -291 -114 -299 3 -7 11 -12 18 -10 20 7 696 812
696 830 1 16 -14 18 -134 20 l-134 3 125 198 c73 115 123 204 120 212 -7 20
-358 22 -374 3z m312 -40 c-4 -7 -61 -97 -127 -201 -69 -109 -117 -193 -113
-202 4 -11 32 -15 132 -17 l127 -3 -253 -300 c-139 -165 -263 -311 -277 -325
l-24 -25 17 40 c9 22 52 125 96 229 43 104 77 195 74 203 -4 10 -33 13 -116
13 -60 0 -110 2 -110 5 0 3 66 138 147 300 l148 295 143 0 c112 0 142 -3 136
-12z'
        />
      </g>
    </svg>
  )
}

export default CurrentIcon
