import { useState } from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"

export default function TimePicker({ value, onChange }) {

  const generateSlots = () => {
    const slots = []
    for (let i = 9; i < 23; i++) {
      slots.push(`${i.toString().padStart(2, "0")}:00`)
    }
    return slots
  }

  const slots = generateSlots()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full text-left text-sm outline-none"
        >
          {value ? value : <span className="text-zinc-400">Select time</span>}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-60 p-2">
        <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
          {slots.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => onChange(slot)}
              className="p-2 text-sm border rounded hover:bg-zinc-100"
            >
              {slot}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}