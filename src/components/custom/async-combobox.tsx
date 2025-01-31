import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "../ui/button";

interface AsyncSearchableComboboxProps {
  icon?: any;
  label: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  options: any[];
  isLoading: boolean;
  onSelect: (value: { value: any; label: string }) => void;
  placeholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
}

export function AsyncSearchableCombobox({
  icon,
  label,
  inputValue,
  onInputChange,
  options,
  isLoading,
  onSelect,
  placeholder = "Search...",
  emptyMessage = "No results found.",
  loadingMessage = "Loading...",
}: AsyncSearchableComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full h-full justify-start text-gray-800"
        >
          {icon}
          <span className="overflow-hidden whitespace-nowrap text-ellipsis font-normal">
            {label
              ? label
              : !inputValue
              ? placeholder
              : !isFocused
              ? label
              : inputValue}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search..."
            value={inputValue}
            onValueChange={(value) => {
              onInputChange(value);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : options.length > 0 ? (
              <CommandGroup>
                {options.map((option, index) => (
                  <CommandItem
                    key={index}
                    value={option}
                    onSelect={() => {
                      onInputChange(
                        option.value.navigation.relevantFlightParams.skyId
                      ); // Update input value
                      onSelect(option); // Trigger selection
                      setIsOpen(false); // Close the popover
                    }}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
