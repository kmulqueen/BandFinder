import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import {
  searchByInstrument,
  searchByStatus,
  searchByName
} from "../../actions/profile";
import { connect } from "react-redux";

const SearchBar = ({ searchByInstrument, searchByStatus, searchByName }) => {
  const [instSearch, setInstSearch] = useState("");
  const [statSearch, setStatSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");

  const searchInstrument = e => {
    setStatSearch("");
    setNameSearch("");
    setInstSearch(e.target.value);
    searchByInstrument(e.target.value);
  };
  const searchStatus = e => {
    setInstSearch("");
    setNameSearch("");
    setStatSearch(e.target.value);
    searchByStatus(e.target.value);
  };
  const searchName = e => {
    setInstSearch("");
    setStatSearch("");
    setNameSearch(e.target.value);
    searchByName(e.target.value);
  };

  return (
    <Fragment>
      <input
        className="searchbar my-1"
        type="text"
        name="search"
        placeholder="Search by name..."
        value={nameSearch}
        onChange={searchName}
      />
      <input
        className="searchbar my-1"
        type="text"
        name="search"
        placeholder="Search by instrument..."
        value={instSearch}
        onChange={searchInstrument}
      />
      <input
        className="searchbar my-1"
        type="text"
        name="search"
        placeholder="Search by status... (Musician, Band, Producer, Engineer, Teacher, Manager, Promoter, Client)"
        value={statSearch}
        onChange={searchStatus}
      />
    </Fragment>
  );
};

SearchBar.propTypes = {
  searchByInstrument: PropTypes.func,
  searchByStatus: PropTypes.func,
  searchByName: PropTypes.func
};

export default connect(
  null,
  { searchByInstrument, searchByStatus, searchByName }
)(SearchBar);
