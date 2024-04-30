import React from 'react';
import Select from 'react-select';
import { useNavigate,useLocation } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth'; // Importing Auth from aws-amplify/auth



const options = [
    { value: 'account', label: 'Account Information', icon: "/images/img_account_google.svg" },
    { value: 'signout', label: 'Sign Out', icon: "/images/img_logout_google.svg" },
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

const formatOptionLabel = ({ value, label, icon }) => (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', // Space between items
        alignItems: 'center',
        width: '100%', // Ensure the container takes full width
        margin: "auto",
    }}>
        {label}
        {icon && <img src={icon} alt={label} style={{  width: 30, height: 30 }} />}
        
    </div>
);

const DropdownMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = location.state?.isAdmin || false;

    const handleOptionChange = async(selectedOption) => {
        if (selectedOption.value === "account") {
            navigate("/accountinformation", { state: { isAdmin } }); // Navigate to the account info page
        } else if (selectedOption.value === "signout") {
            // Perform logout action
            try {
                await signOut();
                navigate("/signin");
              } catch (error) {
                console.log('error signing out: ', error);
              }
            
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
                <img src="/images/img_account_google.svg" alt="user_image" style={{ marginRight: "10px", width: "50px", height: "50px", }} />
            </div>
            )}
            formatOptionLabel = {formatOptionLabel}
        />
    );
};

export default DropdownMenu;