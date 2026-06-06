import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/Components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover"


export default function BookingCalendar({ value, onChange }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full flex items-center text-left text-sm outline-none">
          

          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, "PPP")} → {format(value.to, "PPP")}
              </>
            ) : (
              format(value.from, "PPP")
            )
          ) : (
            <span className="text-zinc-400">Check in - Check out</span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={value}
          onSelect={(range) => {
            onChange(range)
            if(range?.from && range?.to) {
                
            }
          }}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}