import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function SelectDemo({ value, onChange }) {
    return (
        <Select key={value} value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
