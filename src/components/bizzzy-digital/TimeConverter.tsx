import { useState } from "react"
import TimezoneSelector from "./TimeZoneSelector"

export default function TimeConverter() {
  const [torontoTime, setTorontoTime] = useState<string>("")
  const [toTimezone, setToTimezone] = useState<string>("America/New_York")
  const [convertedTime, setConvertedTime] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const timezones: string[] = Intl.supportedValuesOf("timeZone")

  const handleConvert = async () => {
    if (!torontoTime) {
      setError("Please select a valid date and time.")
      return
    }
    setError(null)

    try {
      const response = await fetch(`/api/convert-time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datetime: torontoTime,
          toTimezone: toTimezone,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setConvertedTime(data.converted.datetime)
      } else {
        setError(data.error || "Something went wrong.")
      }
    } catch (err) {
      console.error(err)
      setError("Failed to fetch data.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Time Converter</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <label className="block mb-2 text-lg">Toronto Time:</label>
        <input
          type="datetime-local"
          value={torontoTime}
          onChange={(e) => setTorontoTime(e.target.value)}
          className="w-full p-2 mb-4 text-text-primary rounded"
        />

        <TimezoneSelector
          toTimezone={toTimezone}
          setToTimezone={setToTimezone}
          timezones={timezones}
        />

        <button
          onClick={handleConvert}
          className="w-full p-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
        >
          Convert Time
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {convertedTime && (
          <div className="mt-4 p-3 bg-gray-700 rounded">
            <p className="text-lg font-semibold">Converted Time:</p>
            <p className="text-xl">{convertedTime}</p>
          </div>
        )}
      </div>
    </div>
  )
}


