import React from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer';
import AppContext from './context';

import Home from './pages/Home';
import Favourites from './pages/Favourites';

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favourites, setFavourites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      const cartResponse = await axios.get('https://62e16e35fa99731d75d66e03.mockapi.io/cart')
      const favouritesResponse = await axios.get('https://62e16e35fa99731d75d66e03.mockapi.io/favourites ')
      const itemsResponse = await axios.get('https://62e16e35fa99731d75d66e03.mockapi.io/items')

      setIsLoading(false);
      setCartItems(cartResponse.data);
      setFavourites(favouritesResponse.data);
      setItems(itemsResponse.data);
    }

    fetchData();
  }, []);

  const onAddToCart = (obj) => {
    try {
      if (cartItems.find((item) => Number(item.id) === Number(obj.id))) {
        axios.delete(`https://62e16e35fa99731d75d66e03.mockapi.io/cart/${obj.id}`);
        setCartItems(prev => prev.filter(item => Number(item.id) !== Number(obj.id)))
      } else {
        axios.post('https://62e16e35fa99731d75d66e03.mockapi.io/cart', obj);
        setCartItems((prev) => [...prev, obj]);
      }
    } catch (error) {
      
    }
  }

  const onRemoveItem = (id) => {
    axios.delete(`https://62e16e35fa99731d75d66e03.mockapi.io/cart/${id}`);
    setCartItems((prev) => prev.filter(item => item.id !== id));
  }

  const onAddToFavourite = async (obj) => {
    try {
      if (favourites.find(favObj => Number(favObj.id) === Number(obj.id))) {
        axios.delete(`https://62e16e35fa99731d75d66e03.mockapi.io/favourites/${obj.id}`);
        setFavourites(prev => prev.filter(item => Number(item.id) !== Number(obj.id)))
      } else {
        const { data } = await axios.post('https://62e16e35fa99731d75d66e03.mockapi.io/favourites', obj);
        setFavourites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты')
    }
  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value)
  }

  const isItemAdded = (id) => {
    return cartItems.some( obj => Number(obj.id) === Number(id))
  }

  return (
    <AppContext.Provider value={{ items, cartItems, favourites, isItemAdded, onAddToFavourite, setCartOpened, setCartItems }}>
      <div className="wrapper clear">
        {cartOpened && <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem} />}
        <Header onClickCart={() => setCartOpened(true)}/>

        <Routes>
          <Route path="/" exact element={
            <Home 
              items={items}
              cartItems={cartItems}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onChangeSearchInput={onChangeSearchInput}
              onAddToFavourite={onAddToFavourite}
              onAddToCart={onAddToCart}
              isLoading={isLoading}
            />
          }/>
          <Route path="/favourites" exact element={
            <Favourites/>
          }/>
        </Routes>
      </div>
    </AppContext.Provider>
  )
}

export default App;