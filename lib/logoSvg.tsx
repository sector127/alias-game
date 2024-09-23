export const logoSvg = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="25 50 300 50" width='200' height='100'>
            <defs>
                <path id="curve" d="M10 140 Q200 10 320 80" fill="none"/>
                <path id="curve2" d="M-60 260 Q200 20 320 140" fill="none"/>
            </defs>
            <text fontFamily="Impact, sans-serif" fontSize="48" fontWeight="bold">
                <textPath href="#curve" startOffset="50%" textAnchor="end">
                    <tspan fill="none" stroke="white" strokeWidth="8">ALIAS</tspan>
                </textPath>
            </text>
            <text fontFamily="Impact, sans-serif" fontSize="48" fontWeight="bold">
                <textPath href="#curve" startOffset="50%" textAnchor="end">
                    <tspan fill="#800080">ALIAS</tspan>
                </textPath>
            </text>
            <text fontFamily="Impact, sans-serif" fontSize="48" fontWeight="bold">
                <textPath href="#curve2" startOffset="70%" textAnchor="end">
                    <tspan fill="none" stroke="white" strokeWidth="8">GAME</tspan>
                </textPath>
            </text>
            <text fontFamily="Impact, sans-serif" fontSize="48" fontWeight="bold">
                <textPath href="#curve2" startOffset="70%" textAnchor="end">
                    <tspan fill="#800080">GAME</tspan>
                </textPath>
            </text>
        </svg>
    )
}