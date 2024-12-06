import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchText.trim());
    }
  };

  const handleClear = () => {
    setSearchText('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <TextField
      value={searchText}
      onChange={handleInputChange}
      placeholder="Search..."
      variant="outlined"
      size="small"
      sx={{ maxWidth: '300px', bgcolor: 'white', borderRadius: '4px' }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: (
          searchText && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        ),
      }}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          handleSearch();
        }
      }}
    />
  );
};

export default SearchBar;
