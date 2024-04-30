import React from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const options = [
    { value: 'account', label: 'Account Information' },
    { value: 'signout', label: 'Sign Out' },
];


const customStyles = {
    menu: (provided) => ({
        ...provided,
        width: '200px', // Adjust the width as needed
        left: '-100px',
    }),
    control: (provided, state) => ({
        ...provided,
        borderRadius: '8px',
        border: state.isFocused ? '2px solid #4F46E5' : '2px solid #D1D5DB',
        boxShadow: state.isFocused ? '0 0 0 2px rgba(79, 70, 229, 0.5)' : 'none',
        '&:hover': {
            borderColor: '#4F46E5',
        },
        width: "100px",
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#4F46E5' : 'transparent',
        color: state.isSelected ? '#FFFFFF' : '#000000',

        '&:hover': {
            backgroundColor: '#4F46E5',
            color: '#FFFFFF',
        },
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        display: 'none', // Hide the indicator separator
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#9CA3AF',
    }),
};

const DropdownMenu = () => {
    const navigate = useNavigate();

    const handleOptionChange = (selectedOption) => {
        if (selectedOption.value === "account") {
            navigate("/accountinformation"); // Navigate to the account info page
        } else if (selectedOption.value === "signout") {
            // Perform logout action
            navigate("/signin");
        }
    };

    return (
        <Select
            ref={null}
            options={options}
            styles={customStyles}
            isSearchable={false}
            onChange={handleOptionChange}
            placeholder={(<div>
                <img src="images/img_vector.svg" alt="user_image" style={{ marginRight: "10px", width: "50px", height: "50px" }} />
            </div>
            )}
        // defaultValue={options[0]}
        />
    );
};

export default DropdownMenu;