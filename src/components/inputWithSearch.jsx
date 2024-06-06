import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const options = [
  { value: 'Alabama', label: 'Alabama' },
  { value: 'Alaska', label: 'Alaska' },
  { value: 'Arizona', label: 'Arizona' },
  { value: 'Arkansas', label: 'Arkansas' },
  { value: 'California', label: 'California' },
  { value: 'Colorado', label: 'Colorado' },
  { value: 'Connecticut', label: 'Connecticut' },
  { value: 'Delaware', label: 'Delaware' },
  { value: 'Florida', label: 'Florida' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Hawaii', label: 'Hawaii' },
  { value: 'Idaho', label: 'Idaho' },
  { value: 'Illinois', label: 'Illinois' },
  { value: 'Indiana', label: 'Indiana' },
  { value: 'Iowa', label: 'Iowa' },
  { value: 'kansas', label: 'kansas' },
  { value: 'Kentucky', label: 'Kentucky' },
  { value: 'Lousiana', label: 'Lousiana' },
  { value: 'Maine', label: 'Maine' },
  { value: 'Maryland', label: 'Maryland' },
  { value: 'Massachusetts', label: 'Massachusetts' },
  { value: 'Michigan', label: 'Michigan' },
  { value: 'Minnesota', label: 'Minnesota' },
  { value: 'Mississippi', label: 'Mississippi' },
  { value: 'Misouri', label: 'Misouri' },
  { value: 'Montana', label: 'Montana' },
  { value: 'Nebraska', label: 'Nebraska' },
  { value: 'Nevada', label: 'Nevada' },
  { value: 'New Hampshire', label: 'New Hampshire' },
  { value: 'New Jersey', label: 'New Jersey' },
  { value: 'New Mexico', label: 'New Mexico' },
  { value: 'New York', label: 'New York' },
  { value: 'North Carolina', label: 'North Carolina' },
  { value: 'North Dakota', label: 'North Dakota' },
  { value: 'Ohio', label: 'Ohio' },
  { value: 'Oklahoma', label: 'Oklahoma' },
  { value: 'Oregon', label: 'Oregon' },
  { value: 'Pennsylvania', label: 'Pennsylvania' },
  { value: 'Rhode Island', label: 'Rhode Island' },
  { value: 'South Carolina', label: 'South Carolina' },
  { value: 'South Dakota', label: 'South Dakota' },
  { value: 'Tennessee', label: 'Tennessee' },
  { value: 'Texas', label: 'Texas' },
  { value: 'Utah', label: 'Utah' },
  { value: 'Vermont', label: 'Vermont' },
  { value: 'Virginia', label: 'Virginia' },
  { value: 'Washington', label: 'Washington' },
  { value: 'West Virginia', label: 'West Virginia' },
  { value: 'Wisconsin', label: 'Wisconsin' },
  { value: 'Wyoming', label: 'Wyoming' },
];

const SearchableDropdown = ({handle, defaultValue}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    // Find the option that matches the defaultValue
    const defaultOption = options.find(option => option.value === defaultValue);
    if (defaultOption) {
      setSelectedOption(defaultOption);
    } else{
      setSelectedOption(null)
    }
  }, [defaultValue, options]);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    handle(selectedOption.value);
    }

const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '4px', // Set the border-radius to make it round
      border: state.isFocused ? '2px solid #2563EB' : '1px border-gray-300', // Customize border color
      boxShadow: state.isFocused ? '0 0 0 2px #dbeafe' : 'none', // Add focus effect
      padding: "4px",
      '&:hover': {
        borderColor: 'rgb(14 165 233)', // Example: Light gray background on hover
        borderShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        cursor: 'pointer', // Change cursor to pointer on hover
      },
    }),
  };
  return (
    <Select
      styles={customStyles}
      value={selectedOption}
      onChange={(e) =>handleChange(e)}
      options={options}
      placeholder="Select a State..."
      isSearchable={true}
      className="max-w-500px w-full"
    />
  );
};

export default SearchableDropdown;
