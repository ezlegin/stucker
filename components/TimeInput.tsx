import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { cn } from "cn";

export default function TimeInput({
  value,
  onChange,
  invalid,
}: {
  value: string; // "HH:mm:ss"
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  const [text, setText] = useState(value.slice(0, 5));

  // Keep in sync when the form value changes externally (reset, defaults)
  useEffect(() => {
    setText(value.slice(0, 5));
  }, [value]);

  function parse(raw: string) {
    let digits = raw.replace(/\D/g, "");
    if (digits.length === 3) digits = "0" + digits; // "930" -> "0930"
    if (digits.length !== 4) return null;

    const h = Number(digits.slice(0, 2));
    const m = Number(digits.slice(2));
    if (h > 23 || m > 59) return null;

    return `${digits.slice(0, 2)}:${digits.slice(2)}:00`;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) digits = `${digits.slice(0, 2)}:${digits.slice(2)}`;
    setText(digits);

    // Commit as soon as a full valid time is typed
    if (digits.length === 5) {
      const parsed = parse(digits);
      if (parsed) onChange(parsed);
    }
  }

  function handleBlur() {
    const parsed = parse(text);
    if (parsed) onChange(parsed);
    else setText(value.slice(0, 5)); // revert invalid input
  }

  return (
    <Input
      type="text"
      inputMode="numeric"
      placeholder="HH:mm"
      maxLength={5}
      value={text}
      onChange={handleChange}
      onBlur={handleBlur}
      className={cn(
        "h-11 min-w-0 rounded-lg bg-background px-3.5 font-mono text-sm tabular-nums",
        invalid && "border-destructive/60",
      )}
    />
  );
}
