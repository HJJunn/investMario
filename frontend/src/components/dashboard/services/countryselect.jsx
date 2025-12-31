import Select from "react-select"
import countryList from "react-select-country-list"
import { useMemo } from "react"

export default function CountrySelect({ form, update }) {
  const options = useMemo(() => countryList().getData(), [])

  return (
    <div className="form-group">
      <label>Country</label>
      <Select
        options={options}
        value={options.find((c) => c.value === form.country) || null}
        onChange={(e) => update("country", e.value)}
        placeholder="Select country"
        isSearchable
      />
    </div>
  )
}
