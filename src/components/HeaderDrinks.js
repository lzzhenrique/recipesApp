import React, { useState, useCallback, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Input from './Input';
import './css/Header.css';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppContext from '../context/AppContext';

const DRINKS_LENGTH = 12;

const HeaderDrinks = ({ title }) => {
  const [searchBar, setShowBar] = useState(false);
  const [searchInput, setInput] = useState('');
  const [searchRadio, setRadio] = useState('');
  const { data, setData } = useContext(AppContext);

  const showSearch = () => setShowBar(!searchBar);

  const handleChange = ({ target }) => {
    const { value, name } = target;
    return name === 'searchInput' ? setInput(value) : setRadio(value);
  };

  const renderAlert = useCallback(() => {
    if (searchRadio === 'firstLetter' && searchInput.length > 1) {
      const alertMessage = 'Sua busca deve conter somente 1 (um) caracter';
      return global.alert(alertMessage);
    }

    const alert = 'Sinto muito, não encontramos nenhuma receita para esses filtros.';
    return global.alert(alert);
  }, [searchRadio, searchInput.length]);

  const pickChoice = useCallback(() => {
    switch (searchRadio) {
    case 'ingredient':
      return `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchInput}`;
    case 'name':
      return `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`;
    case 'firstLetter':
      return searchInput.length > 1
        ? renderAlert()
        : `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${searchInput}`;
    default: return '';
    }
  }, [searchRadio, searchInput, renderAlert]);

  const getRecipe = async () => {
    const endpoint = pickChoice();
    const response = await fetch(endpoint).then((recipe) => recipe.json());
    if (response.drinks === null) {
      return renderAlert();
    }
    setData(response.drinks.slice(0, DRINKS_LENGTH));
  };

  return (
    <>
      {
        data.length === 1 ? <Redirect to={ `/bebidas/${data[0].idDrink}` } /> : ''
      }
      <div
        className="header-container"
      >
        <Link to="/perfil">
          <button
            type="button"
            className="profile-icon-container"
          >
            <img
              data-testid="profile-top-btn"
              className="profile-icon"
              src={ profileIcon }
              alt="Profile Icon"
            />
          </button>
        </Link>
        <div
          className="title-container"
        >
          <h1
            className="title-content"
            data-testid="page-title"
          >
            { title }
          </h1>
        </div>

        <button
          type="button"
          data-testid="search-top-btn"
          onClick={ showSearch }
          src={ searchIcon }
        >
          <img
            src={ searchIcon }
            alt="Profile Icon"
            className="search-element"
          />
        </button>
      </div>
      {
        searchBar
          ? (
            <div
              className="search-bar-container"
            >
              <Input
                type="text"
                id="search-input"
                className="search-input"
                name="searchInput"
                value={ searchInput }
                placeHolder="Busque sua comida preferida :)"
                onChange={ handleChange }
                required={ false }
              />
              <div
                className="radio-container"
              >
                <Input
                  labelText="Ingrediente"
                  type="radio"
                  id="ingredient-search-radio"
                  className="search-radio"
                  name="ingredient"
                  value="ingredient"
                  onChange={ handleChange }
                  searchOption={ searchRadio }
                  checked
                />
                <Input
                  id="name-search-radio"
                  labelText="Nome"
                  type="radio"
                  className="search-radio"
                  name="name"
                  value="name"
                  onChange={ handleChange }
                  searchOption={ searchRadio }
                />
                <Input
                  id="first-letter-search-radio"
                  labelText="Primeira letra"
                  type="radio"
                  className="search-radio"
                  name="firstLetter"
                  value="firstLetter"
                  onChange={ handleChange }
                  searchOption={ searchRadio }
                />
              </div>
              <div>
                <button
                  type="submit"
                  data-testid="exec-search-btn"
                  className="exec-search-btn"
                  onClick={ getRecipe }
                >
                  PESQUISAR
                </button>
              </div>
            </div>)
          : ''
      }
    </>
  );
};

HeaderDrinks.propTypes = {
  title: PropTypes.string.isRequired,
};
export default HeaderDrinks;
