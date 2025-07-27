import Select, { GroupBase, SingleValue } from "react-select"

interface TimezoneOption {
  label: string
  value: string
}

interface TimezoneSelectorProps {
  toTimezone: string
  setToTimezone: (timezone: string) => void
  timezones: string[]
}

const timezoneAbbreviations: TimezoneOption[] = [
  { label: "PST (Pacific Standard Time)", value: "America/Los_Angeles" },
  { label: "CST (Central Standard Time)", value: "America/Chicago" },
  { label: "EST/EDT (Eastern Time)", value: "America/New_York" },
  { label: "MST (Mountain Standard Time)", value: "America/Denver" },
  { label: "AKST (Alaska Standard Time)", value: "America/Anchorage" },
  { label: "HST (Hawaii Standard Time)", value: "Pacific/Honolulu" },

  { label: "AEST (Australian Eastern Standard Time)", value: "Australia/Sydney" },
  { label: "AEDT (Australian Eastern Daylight Time)", value: "Australia/Sydney" },
  { label: "ACST (Australian Central Standard Time)", value: "Australia/Adelaide" },
  { label: "ACDT (Australian Central Daylight Time)", value: "Australia/Adelaide" },
  { label: "AWST (Australian Western Standard Time)", value: "Australia/Perth" },
]

export default function TimezoneSelector({
  toTimezone,
  setToTimezone,
  timezones,
}: TimezoneSelectorProps) {
  const timezoneOptions: GroupBase<TimezoneOption>[] = [
    {
      label: "Common Timezones",
      options: timezoneAbbreviations,
    },
    {
      label: "All Timezones",
      options: timezones.map((tz) => ({ value: tz, label: tz })),
    },
  ]

  const selectedOption =
    timezoneOptions
      .flatMap((group) => group.options)
      .find((opt) => opt.value === toTimezone) ?? null

  const handleChange = (selected: SingleValue<TimezoneOption>) => {
    if (selected) {
      setToTimezone(selected.value)
    }
  }

  return (
    <div>
      <label className="block mb-2 text-lg">Convert To:</label>

      <Select
        options={timezoneOptions}
        value={selectedOption}
        onChange={handleChange}
        className="w-full mb-4 text-black"
        placeholder="Search Timezone..."
      />
    </div>
  )
}
