import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

export default function SingleDateTimePicker({ date, setDate, time }) {
    const generateSlots = () => {
        const slots = [];
        for (let i = 9; i < 23; i++) {
            slots.push(`${i.toString().padStart(2, "0")}:00`);
        }
        return slots;
    };

    return (
        <div className="space-y-4">
            {/* 📅 Date Picker */}
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="w-full text-left text-sm flex items-center"
                    >
                        {date ? (
                            format(date, "PPP")
                        ) : (
                            <span className="text-zinc-400">Select a date</span>
                        )}
                    </button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
