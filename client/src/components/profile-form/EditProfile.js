import React, { Fragment, useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProfile, getCurrentProfile } from "../../actions/profile";
import { check } from "express-validator";

const EditProfile = ({
  profile: { profile, loading },
  createProfile,
  getCurrentProfile,
  history
}) => {
  const [formData, setFormData] = useState({
    status: [],
    projects: [],
    albums: [],
    website: "",
    location: "",
    instruments: [],
    bio: "",
    twitter: "",
    facebook: "",
    instagram: "",
    youtube: "",
    spotify: "",
    soundcloud: "",
    itunes: ""
  });

  const [checkbox, setCheckbox] = useState({
    musician: false,
    band: false,
    manager: false,
    teacher: false,
    promoter: false,
    client: false
  });

  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  const {
    status,
    projects,
    albums,
    website,
    location,
    instruments,
    bio,
    twitter,
    facebook,
    instagram,
    youtube,
    spotify,
    soundcloud,
    itunes
  } = formData;
  const { musician, band, manager, teacher, promoter, client } = checkbox;

  const handleCheck = e => {
    setCheckbox({ ...checkbox, [e.target.name]: e.target.checked });

    // Update 'status' array in formData with values
    if (e.target.checked === true) {
      setFormData({ ...formData, status: [...status, e.target.value] });
    } else if (e.target.checked === false && status.includes(e.target.value)) {
      let newStatus = status.filter(item => item !== e.target.value);
      setFormData({ ...formData, status: newStatus });
    }
  };

  const getCheck = key => {
    console.log(`loading ${loading}`);
    console.log(checkbox[key]);
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    createProfile(formData, history, true);
  };

  useEffect(() => {
    getCurrentProfile();
    if (profile) {
      console.log(profile.status);
      const keys = Object.keys(checkbox);
      console.log(keys);

      profile.status.map(item => {
        keys.map(key => {
          if (key === item.toLowerCase()) {
            if (checkbox[key] === false) {
              checkbox[key] = true;
            }
          }
        });
      });
      console.log(`checkbox ${checkbox}`);
    }

    setFormData({
      status: loading || !profile.status ? "" : profile.status,
      projects: loading || !profile.projects ? "" : profile.projects.join(","),
      albums: loading || !profile.albums ? "" : profile.albums.join(","),
      website: loading || !profile.website ? "" : profile.website,
      location: loading || !profile.location ? "" : profile.location,
      instruments:
        loading || !profile.instruments ? "" : profile.instruments.join(","),
      bio: loading || !profile.bio ? "" : profile.bio,
      twitter: loading || !profile.social ? "" : profile.social.twitter,
      facebook: loading || !profile.social ? "" : profile.social.facebook,
      instagram: loading || !profile.social ? "" : profile.social.instagram,
      youtube: loading || !profile.social ? "" : profile.social.youtube,
      soundcloud: loading || !profile.social ? "" : profile.social.soundcloud,
      spotify: loading || !profile.social ? "" : profile.social.spotify,
      itunes: loading || !profile.social ? "" : profile.social.itunes
    });
  }, [loading]);

  return (
    <Fragment>
      <h1 className="large text-primary">Create Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Fill out the form to let others in the
        community connect with you
      </p>
      <small> * = required fields</small>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <small className="form-text">
            *Select your status (check all that apply)
          </small>
          <div>
            <input
              type="checkbox"
              value="Musician"
              name="musician"
              checked={musician}
              onChange={handleCheck}
            />
            <label htmlFor="Musician">Musician</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="Band"
              name="band"
              checked={band}
              onChange={handleCheck}
            />
            <label htmlFor="Band">Band</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="Teacher"
              name="teacher"
              checked={teacher}
              onChange={handleCheck}
            />
            <label htmlFor="Teacher">Teacher</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="Manager"
              name="manager"
              checked={manager}
              onChange={handleCheck}
            />
            <label htmlFor="Manager">Manager</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="Promoter"
              name="promoter"
              checked={promoter}
              onChange={handleCheck}
            />
            <label htmlFor="Promoter">Promoter</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="Client"
              name="client"
              checked={client}
              onChange={handleCheck}
            />
            <label htmlFor="Client">Client</label>
          </div>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Projects"
            name="projects"
            value={projects}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            List your projects/bands here. Use a comma to seperate items (eg.
            Project 1, Project 2, etc.)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Website"
            name="website"
            value={website}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            Link to your personal or band website
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="*Location"
            name="location"
            value={location}
            onChange={e => onChange(e)}
          />
          <small className="form-text">City & State (eg. Denver, CO)</small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="*Instruments"
            name="instruments"
            value={instruments}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            List the instruments you play. Use a comma to seperate items (eg.
            Guitar, Bass, etc.). If you don't play an instrument, write "None".
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Albums"
            name="albums"
            value={albums}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            List any albums you have played on. Use a comma to seperate items
            (eg. Album 1 - Band Name, Album 2 - Band Name, etc.).
          </small>
        </div>
        <div className="form-group">
          <textarea
            name="bio"
            placeholder="A short bio of yourself"
            cols="30"
            rows="10"
            value={bio}
            onChange={e => onChange(e)}
          ></textarea>
          <small className="form-text">Tell us a little about yourself</small>
        </div>
        <div className="my-2">
          <button
            onClick={() => toggleSocialInputs(!displaySocialInputs)}
            className="btn btn-light"
            type="button"
          >
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>

        {displaySocialInputs && (
          <Fragment>
            <div className="form-group social-input">
              <i className="fab fa-twitter fa-2x"></i>
              <input
                type="text"
                placeholder="Twitter URL"
                name="twitter"
                value={twitter}
                onChange={e => onChange(e)}
              />
            </div>
            <div className="form-group social-input">
              <i className="fab fa-facebook fa-2x"></i>
              <input
                type="text"
                placeholder="Facebook URL"
                name="facebook"
                value={facebook}
                onChange={e => onChange(e)}
              />
            </div>
            <div className="form-group social-input">
              <i className="fab fa-instagram fa-2x"></i>
              <input
                type="text"
                placeholder="Instagram URL"
                name="instagram"
                value={instagram}
                onChange={e => onChange(e)}
              />
            </div>
            <div className="form-group social-input">
              <i className="fab fa-youtube fa-2x"></i>
              <input
                type="text"
                placeholder="YouTube URL"
                name="youtube"
                value={youtube}
                onChange={e => onChange(e)}
              />
            </div>
            <div className="form-group social-input">
              <i className="fab fa-soundcloud fa-2x"></i>
              <input
                type="text"
                placeholder="Soundcloud URL"
                name="soundcloud"
                value={soundcloud}
                onChange={e => onChange(e)}
              />
            </div>
            <div className="form-group social-input">
              <i className="fab fa-spotify fa-2x"></i>
              <input
                type="text"
                placeholder="Spotify URL"
                name="spotify"
                value={spotify}
                onChange={e => onChange(e)}
              />
            </div>
            <div className="form-group social-input">
              <i className="fab fa-itunes fa-2x"></i>
              <input
                type="text"
                placeholder="iTunes URL"
                name="itunes"
                value={itunes}
                onChange={e => onChange(e)}
              />
            </div>
          </Fragment>
        )}

        <input type="submit" value="Submit" className="btn btn-primary my-1" />
        <Link to="/dashboard" className="btn btn-light my-1">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { createProfile, getCurrentProfile }
)(withRouter(EditProfile));
