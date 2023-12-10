export default function SmartRGBControllerIcon(props) {
  return (
    <svg
      version='1.0'
      xmlns='http://www.w3.org/2000/svg'
      width='620.000000pt'
      height='620.000000pt'
      viewBox='0 0 620.000000 620.000000'
      preserveAspectRatio='xMidYMid meet'
      fill={props.color || 'currentColor'}
      stroke='none'
      className={props.className}
    >
      <g transform='translate(0.000000,620.000000) scale(0.100000,-0.100000)'>
        <path
          d='M3425 5474 c-166 -33 -330 -61 -395 -68 -53 -6 -80 -10 -145 -22 -55
-10 -149 -46 -232 -89 -46 -24 -104 -46 -130 -49 -132 -19 -371 -69 -393 -83
-14 -9 -32 -26 -41 -38 -11 -13 -44 -27 -95 -39 -338 -81 -559 -155 -714 -239
-237 -128 -444 -310 -557 -492 -119 -189 -175 -426 -143 -601 40 -220 95 -355
205 -499 84 -110 245 -232 356 -270 28 -10 51 -25 59 -40 15 -27 76 -71 112
-80 13 -3 46 -7 73 -9 28 -2 82 -11 120 -20 39 -9 85 -16 103 -16 18 0 53 -5
77 -11 37 -9 49 -19 72 -58 70 -120 210 -230 353 -276 84 -28 89 -28 430 -36
190 -4 642 -8 1005 -9 l660 -1 80 25 c150 48 279 145 355 269 33 54 38 57 85
64 28 4 57 7 65 6 8 -1 49 -4 90 -8 41 -3 104 -8 140 -11 36 -3 77 -1 92 5 23
8 37 5 90 -23 177 -92 286 -220 350 -410 26 -75 31 -258 9 -321 -37 -111 -87
-190 -171 -276 -184 -187 -354 -262 -665 -294 -158 -17 -500 -19 -650 -5 -55
5 -170 16 -255 24 -85 8 -211 20 -280 27 -102 10 -127 15 -138 30 -21 30 -53
42 -126 48 l-70 6 -11 51 c-21 92 -71 148 -157 175 -53 17 -572 49 -612 38
-44 -12 -82 -43 -103 -82 -17 -34 -22 -91 -43 -515 -12 -239 -8 -274 34 -321
11 -13 37 -30 56 -38 39 -17 320 -39 495 -38 100 0 115 2 160 27 61 32 109 80
130 132 l16 38 55 -7 c57 -7 116 6 146 32 14 13 30 13 105 4 48 -6 203 -23
343 -37 140 -14 296 -29 345 -34 276 -28 684 3 910 69 369 107 708 366 832
636 59 129 84 243 90 406 5 125 2 163 -16 252 -49 239 -131 400 -283 556 -101
103 -277 217 -418 271 -19 8 -52 28 -73 46 -21 17 -59 37 -85 43 -26 7 -60 16
-77 21 -16 5 -75 17 -130 25 -55 9 -119 20 -142 26 -23 5 -53 9 -66 9 -15 0
-28 8 -34 23 -6 13 -38 57 -71 98 -75 93 -172 161 -291 203 l-86 30 -570 6
c-313 4 -772 6 -1020 6 l-450 -1 -90 -34 c-154 -58 -283 -159 -348 -272 -29
-51 -87 -66 -190 -51 -128 20 -201 24 -229 13 -23 -9 -34 -5 -85 29 -76 51
-133 111 -177 184 -53 88 -68 152 -64 270 3 114 21 163 102 285 118 176 342
331 601 414 184 59 215 68 318 88 97 18 100 18 126 0 51 -37 99 -42 253 -29
191 16 315 16 423 -1 87 -13 95 -13 230 13 77 15 156 35 175 45 19 10 64 23
100 30 214 40 396 84 420 101 70 50 79 141 35 356 -46 220 -84 291 -169 313
-55 14 -45 14 -191 -15z m183 -166 c37 -101 80 -354 64 -370 -10 -10 -79 -27
-237 -58 -178 -34 -249 -52 -265 -65 -8 -7 -31 -15 -50 -18 -19 -2 -71 -12
-115 -21 -82 -18 -132 -16 -252 6 -48 9 -102 8 -240 -2 -98 -8 -200 -14 -228
-15 -47 0 -51 2 -65 32 -14 31 -18 33 -55 28 -225 -31 -319 -50 -342 -67 -7
-5 -22 -11 -35 -13 -37 -6 -60 -13 -118 -37 -65 -26 -112 -38 -123 -32 -6 4
-9 4 -6 0 4 -4 -44 -33 -107 -65 -262 -135 -420 -291 -526 -518 -40 -84 -43
-101 -43 -248 0 -155 25 -239 108 -355 74 -103 178 -189 291 -240 74 -34 86
-36 86 -16 0 15 21 26 51 26 14 0 21 -9 25 -30 8 -37 17 -38 32 -5 10 22 16
24 49 19 21 -3 61 -8 88 -12 41 -6 51 -11 53 -29 5 -34 27 -35 29 0 1 16 5 33
9 36 3 3 38 8 77 11 66 5 71 6 72 29 1 14 7 27 13 29 6 2 8 10 5 19 -5 12 -3
14 7 8 9 -6 11 -4 5 4 -4 8 1 18 14 27 12 8 21 21 21 27 0 12 97 102 115 107
6 1 22 11 36 21 23 16 65 37 94 45 6 2 30 10 55 19 41 15 129 16 975 10 512
-3 957 -8 990 -11 69 -5 157 -33 148 -47 -3 -6 -1 -7 6 -3 18 12 137 -79 182
-140 23 -29 54 -78 68 -106 l28 -53 74 -5 c72 -5 74 -6 77 -32 3 -22 9 -28 26
-28 13 0 30 9 37 20 13 20 18 20 92 9 70 -10 79 -14 93 -40 17 -33 30 -36 55
-13 22 20 57 10 69 -20 5 -15 23 -27 52 -35 69 -21 202 -86 275 -135 195 -132
323 -310 384 -536 21 -74 24 -108 24 -260 0 -155 -3 -184 -24 -255 -57 -192
-175 -350 -360 -479 -233 -164 -431 -237 -725 -269 -120 -13 -493 -16 -591 -5
-87 10 -332 35 -460 48 -60 6 -143 15 -183 21 -40 5 -104 9 -142 9 -66 0 -70
-1 -76 -25 -5 -22 -10 -24 -43 -20 -45 5 -103 7 -158 6 -40 -1 -43 -3 -43 -29
0 -16 -7 -50 -16 -76 -15 -43 -22 -50 -71 -72 -51 -22 -64 -24 -167 -18 -91 4
-327 21 -373 26 -13 1 -11 129 7 383 5 77 10 174 10 216 0 49 4 80 13 87 8 6
99 4 277 -7 299 -19 312 -22 331 -93 5 -22 7 -63 4 -92 -8 -65 -9 -64 128 -72
55 -3 104 -7 109 -10 4 -3 8 -14 8 -25 0 -11 6 -22 13 -24 6 -3 82 -12 167
-20 85 -9 218 -22 295 -30 463 -48 820 -47 1100 1 91 15 118 22 213 56 180 62
395 227 497 380 92 140 139 331 117 483 -34 234 -151 428 -338 561 -57 41
-216 119 -262 129 -29 6 -34 4 -39 -15 -8 -29 -58 -25 -58 5 0 30 -45 34 -52
5 -5 -20 -10 -21 -67 -16 -34 3 -71 5 -82 5 -16 1 -23 9 -27 31 -8 37 -37 41
-37 5 0 -32 -30 -45 -108 -46 l-57 0 -35 -71 c-48 -99 -134 -184 -234 -233
-43 -21 -97 -40 -120 -42 -74 -6 -1272 -1 -1626 7 -322 7 -349 9 -410 30 -36
13 -85 36 -110 53 -25 17 -50 30 -57 30 -7 0 -10 3 -8 7 3 4 -11 22 -31 39
-38 35 -104 131 -104 153 -1 34 -29 52 -80 49 -74 -4 -90 4 -90 45 0 43 -22
45 -47 4 -19 -33 -34 -35 -122 -17 -47 10 -56 16 -65 42 -13 34 -43 45 -53 18
-13 -38 -23 -43 -54 -27 -22 11 -29 22 -29 44 0 17 -4 30 -9 30 -5 0 -22 5
-38 12 -15 6 -35 12 -43 13 -29 4 -90 34 -90 45 0 6 -4 8 -10 5 -5 -3 -10 -1
-10 5 0 6 -4 9 -9 5 -6 -3 -13 1 -18 9 -4 8 -12 16 -18 17 -31 6 -96 60 -88
72 3 6 2 7 -4 4 -25 -15 -183 213 -183 264 0 10 -4 19 -9 19 -5 0 -13 15 -17
33 -4 17 -9 35 -10 40 -1 4 -3 10 -4 15 -2 4 -4 12 -5 17 -1 6 -4 17 -7 25
-28 77 -35 203 -17 291 6 30 11 62 11 72 -1 9 4 17 9 17 6 0 8 4 5 8 -3 5 2
21 10 36 7 16 14 35 14 42 0 8 5 14 10 14 6 0 10 8 10 19 0 10 10 33 23 52 12
19 34 54 49 79 28 49 174 210 190 210 6 0 19 11 29 24 11 14 63 54 117 89 141
93 151 99 164 91 6 -4 8 -3 5 3 -8 13 20 26 35 16 7 -3 8 -1 4 5 -5 8 2 12 18
12 14 0 26 5 26 11 0 5 4 8 9 4 5 -3 16 2 25 10 8 8 30 18 48 22 18 4 39 12
46 20 7 7 27 13 43 13 16 0 29 5 29 11 0 5 5 7 10 4 5 -3 16 -3 23 2 12 7 25
11 62 17 11 1 47 11 80 20 73 22 91 27 130 33 17 3 35 9 40 14 6 4 49 15 96
25 82 16 86 18 95 48 8 29 14 32 89 48 44 9 98 19 120 22 136 16 225 40 317
86 131 66 184 80 350 99 69 8 330 55 463 84 56 13 63 9 83 -45z'
        />
        <path
          d='M3784 3366 c-216 -70 -284 -346 -124 -506 61 -61 122 -85 215 -85 93
0 154 24 215 85 61 61 85 122 85 215 0 93 -24 154 -85 215 -75 75 -208 109
-306 76z m171 -149 c110 -63 110 -221 0 -284 -79 -45 -177 -17 -222 62 -45 79
-17 177 62 222 23 13 57 23 80 23 23 0 57 -10 80 -23z'
        />
        <path
          d='M2142 3157 c-46 -49 -12 -127 54 -127 39 0 74 36 74 76 0 65 -84 98
-128 51z'
        />
      </g>
    </svg>
  )
}
