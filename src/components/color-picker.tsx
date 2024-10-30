'use client'

import * as React from "react"
import { Pipette } from "lucide-react"
import { hexToHsv, hsvToHex } from "@/lib/colors"

interface ColorPickerProps {
    color: string
    onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
    const [hsv, setHsv] = React.useState(() => hexToHsv(color))
    const [isDragging, setIsDragging] = React.useState(false)
    const gradientRef = React.useRef<HTMLDivElement>(null)
    const hueRef = React.useRef<HTMLDivElement>(null)

    const handleGradientMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        handleGradientMouseMove(e)
    }

    const handleGradientMouseMove = React.useCallback((e: MouseEvent | React.MouseEvent) => {
        if (!gradientRef.current) return

        const rect = gradientRef.current.getBoundingClientRect()
        const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width)
        const y = Math.min(Math.max(0, e.clientY - rect.top), rect.height)

        const s = (x / rect.width) * 100
        const v = 100 - (y / rect.height) * 100

        setHsv(prev => {
            const newHsv = { ...prev, s, v }
            onChange(hsvToHex(newHsv.h, newHsv.s, newHsv.v))
            return newHsv
        })
    }, [onChange])

    const handleHueMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        handleHueMouseMove(e)
    }

    const handleHueMouseMove = React.useCallback((e: MouseEvent | React.MouseEvent) => {
        if (!hueRef.current) return

        const rect = hueRef.current.getBoundingClientRect()
        const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width)
        const h = (x / rect.width) * 360

        setHsv(prev => {
            const newHsv = { ...prev, h }
            onChange(hsvToHex(newHsv.h, newHsv.s, newHsv.v))
            return newHsv
        })
    }, [onChange])

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleGradientMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        }
        return () => {
            window.removeEventListener('mousemove', handleGradientMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, handleGradientMouseMove])

    return (
        <div className="w-[300px]">
            <div
                ref={gradientRef}
                className="w-full h-[200px] rounded-lg mb-4 cursor-crosshair relative"
                style={{
                    backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                    backgroundImage: `
            linear-gradient(to right, #fff, transparent),
            linear-gradient(to bottom, transparent, #000)
          `
                }}
                onMouseDown={handleGradientMouseDown}
            >
                <div
                    className="absolute w-4 h-4 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-sm"
                    style={{
                        left: `${hsv.s}%`,
                        top: `${100 - hsv.v}%`,
                        backgroundColor: hsvToHex(hsv.h, hsv.s, hsv.v)
                    }}
                />
            </div>
            <div className="flex items-center gap-2 mb-4">
                <Pipette className="w-4 h-4" />
                <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <div
                        className="absolute inset-0"
                        style={{ backgroundColor: color }}
                    />
                </div>
                <div
                    ref={hueRef}
                    className="h-4 flex-1 rounded-md cursor-pointer relative"
                    style={{
                        background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
                    }}
                    onMouseDown={handleHueMouseDown}
                >
                    <div
                        className="absolute w-4 h-4 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/4 pointer-events-none shadow-sm"
                        style={{
                            left: `${(hsv.h / 360) * 100}%`,
                            backgroundColor: `hsl(${hsv.h}, 100%, 50%)`
                        }}
                    />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {['H', 'S', 'V'].map((label) => (
                    <div key={label}>
                        <label className="text-xs font-mono">{label}</label>
                        <input
                            type="number"
                            min="0"
                            max={label === 'H' ? 360 : 100}
                            value={Math.round(hsv[label.toLowerCase() as 'h' | 's' | 'v'])}
                            onChange={(e) => {
                                const value = Math.min(
                                    label === 'H' ? 360 : 100,
                                    Math.max(0, parseInt(e.target.value) || 0)
                                )
                                setHsv(prev => {
                                    const newHsv = { ...prev, [label.toLowerCase()]: value }
                                    onChange(hsvToHex(newHsv.h, newHsv.s, newHsv.v))
                                    return newHsv
                                })
                            }}
                            className="w-full px-2 py-1 text-sm border rounded"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
