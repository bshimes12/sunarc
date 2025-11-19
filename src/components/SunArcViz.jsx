import React, { useMemo } from 'react';
import SunCalc from 'suncalc';

const SunArcViz = ({ lat, lng, date, solsticeDate, noonAltitudeDeg, matchingTime }) => {
    const width = 600;
    const height = 300;
    const padding = 40;

    // Helper to get arc path
    const getPathData = (targetDate, endTime = null) => {
        const times = SunCalc.getTimes(targetDate, lat, lng);
        if (!times.sunrise || !times.sunset) return ""; // Polar night/day

        const start = times.sunrise.getTime();
        const end = endTime ? endTime.getTime() : times.sunset.getTime();

        // If endTime is before sunrise (shouldn't happen with correct logic but safety first)
        if (end < start) return "";

        const duration = end - start;
        const step = Math.max(duration / 60, 60000); // At least 1 min step

        let d = "";

        for (let t = start; t <= end; t += step) {
            const pos = SunCalc.getPosition(new Date(t), lat, lng);
            const alt = pos.altitude;
            const az = pos.azimuth;

            // Map Azimuth (0 is South)
            // We want a fixed scale where South (0) is center.
            // 180 degrees (PI radians) = width.
            const xCenter = width / 2;
            const xScale = width / Math.PI;
            const xPlot = xCenter + az * xScale;

            // Map Altitude
            const yPlot = height - padding - (alt * (height - 2 * padding) / (Math.PI / 2));

            if (t === start) d += `M ${xPlot} ${yPlot}`;
            else d += ` L ${xPlot} ${yPlot}`;
        }
        return d;
    };

    const solsticePathFull = useMemo(() => getPathData(solsticeDate), [solsticeDate, lat, lng]);
    const solsticePathPartial = useMemo(() => matchingTime ? getPathData(solsticeDate, matchingTime) : "", [solsticeDate, matchingTime, lat, lng]);
    const currentPath = useMemo(() => getPathData(date), [date, lat, lng]);

    // Calculate marker position for matching time
    const markerPos = useMemo(() => {
        if (!matchingTime) return null;
        const pos = SunCalc.getPosition(matchingTime, lat, lng);
        const alt = pos.altitude;
        const az = pos.azimuth;

        const xCenter = width / 2;
        const xScale = width / Math.PI;
        const x = xCenter + az * xScale;
        const y = height - padding - (alt * (height - 2 * padding) / (Math.PI / 2));
        return { x, y };
    }, [matchingTime, lat, lng]);

    // Calculate Y for the horizontal line (current noon altitude)
    const noonY = height - padding - ((noonAltitudeDeg * Math.PI / 180) * (height - 2 * padding) / (Math.PI / 2));

    return (
        <div className="viz-container">
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
                {/* Background / Horizon */}
                <line x1="0" y1={height - padding} x2={width} y2={height - padding} stroke="#475569" strokeWidth="2" />
                <text x={width / 2} y={height - 10} textAnchor="middle" fill="#94a3b8" fontSize="12">South</text>
                <text x={padding} y={height - 10} textAnchor="middle" fill="#94a3b8" fontSize="12">East</text>
                <text x={width - padding} y={height - 10} textAnchor="middle" fill="#94a3b8" fontSize="12">West</text>

                {/* Current Date Path (Secondary/Faint) */}
                <path d={currentPath} fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,4" opacity="0.5" />

                {/* Solstice Path (Full - Faint) */}
                <path d={solsticePathFull} fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />

                {/* Solstice Path (Partial - Highlighted) */}
                {solsticePathPartial && (
                    <path d={solsticePathPartial} fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
                )}

                {/* Comparison Line */}
                <line x1={markerPos ? markerPos.x : 0} y1={noonY} x2={width / 2} y2={noonY} stroke="#fff" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="4,4" />

                {/* Marker for Matching Time on Solstice Arc */}
                {markerPos && (
                    <>
                        <circle cx={markerPos.x} cy={markerPos.y} r="6" fill="#fbbf24" stroke="#1e293b" strokeWidth="2" />
                        <text x={markerPos.x} y={markerPos.y - 15} textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">
                            Match
                        </text>
                    </>
                )}

                {/* Marker for Current Solar Noon Apex */}
                <circle cx={width / 2} cy={noonY} r="4" fill="#38bdf8" />
                <text x={width / 2} y={noonY - 10} textAnchor="middle" fill="#38bdf8" fontSize="12">
                    Solar Noon Today
                </text>

                {/* Legend */}
                <g transform={`translate(${width - 120}, 20)`}>
                    <rect width="110" height="50" fill="#1e293b" rx="4" opacity="0.8" />
                    <line x1="10" y1="15" x2="30" y2="15" stroke="#38bdf8" strokeWidth="3" />
                    <text x="35" y="19" fill="#94a3b8" fontSize="10">Today</text>

                    <line x1="10" y1="35" x2="30" y2="35" stroke="#fbbf24" strokeWidth="3" />
                    <text x="35" y="39" fill="#94a3b8" fontSize="10">Solstice Match</text>
                </g>

            </svg>
        </div>
    );
};

export default SunArcViz;
