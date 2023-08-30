import classNames from 'classnames';
import { useState, useContext, useEffect } from 'react';
import { Loader } from './Loader';
import { Context } from './Context';
import { CartProduct } from './types/CartProduct';
import { GoBack } from './GoBack';
import {
  setCartItemsToLocaleStorage,
  getCartItemsFromLocaleStorage,
} from './utils/updateLocaleStorage';

export const Cart = () => {
  const { setProductsToBuy, loadingItem, setLoadingItem } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  const remove = (index: number) => {
    setLoadingItem(index);

    setTimeout(() => {
      const toBuy = ([
        ...getCartItemsFromLocaleStorage('toBuy').slice(0, index),
        ...getCartItemsFromLocaleStorage('toBuy').slice(index + 1),
      ]);

      setCartItemsToLocaleStorage('toBuy', toBuy);
      setProductsToBuy(toBuy);
      setLoadingItem(null);
    }, 1000);
  };

  const update = (index: number, num: number, item: CartProduct) => {
    const newItem = {
      ...item,
      quantity: num,
    };

    const toBuy = ([
      ...getCartItemsFromLocaleStorage('toBuy').slice(0, index),
      newItem,
      ...getCartItemsFromLocaleStorage('toBuy').slice(index + 1),
    ]);

    setCartItemsToLocaleStorage('toBuy', toBuy);
    setProductsToBuy(toBuy);
  };

  const getRealPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  const getCost = () => {
    let cost = 0;

    getCartItemsFromLocaleStorage('toBuy').forEach(product => {
      if (product.item.discount === 0) {
        cost += (product.item.price * product.quantity);
      } else {
        cost += (getRealPrice(
          product.item.price,
          product.item.discount,
        ) * product.quantity);
      }
    });

    return cost;
  };

  const getQuantity = () => {
    let quantity = 0;

    getCartItemsFromLocaleStorage('toBuy').forEach(product => {
      quantity += product.quantity;
    });

    return quantity;
  };

  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="cart">
      <GoBack />
      <h1 className="cart__title">Cart</h1>

      {isLoading && (
        <div className="cart__loader_container">
          <Loader />
        </div>
      )}

      {(getCartItemsFromLocaleStorage('toBuy').length > 0 && !isLoading) && (
        <div className="cart__container">
          <div className="cart__products">
            {getCartItemsFromLocaleStorage('toBuy').map((item, index) => (
              index !== loadingItem ? (
                <div className="cart__item">
                  <div className="cart__content">
                    <button
                      type="button"
                      aria-label="Delete"
                      className="cart__button"
                      onClick={() => remove(index)}
                    />
                    <img
                      className="cart__image"
                      src={item.item.imageUrl
                        .split('phones').join('products')}
                      alt={`${item.item.id}`}
                    />
                    <h4 className="cart__subtitle">{item.item.name}</h4>
                  </div>
                  <div className="cart__amount">
                    <div className="cart__quantity">
                      <button
                        type="button"
                        aria-label="Remove"
                        className={classNames(
                          'cart__changeAmount cart__remove',
                          {
                            'cart__changeAmount--disabled':
                            item.quantity < 2,
                          },
                        )}
                        disabled={item.quantity < 2}
                        onClick={() => update(index, item.quantity - 1, item)}
                      />

                      <div className="cart__number">
                        {item.quantity}
                      </div>

                      <button
                        type="button"
                        aria-label="Add"
                        className={classNames(
                          'cart__changeAmount cart__add',
                          {
                            'cart__changeAmount--disabled':
                            item.quantity > 4,
                          },
                        )}
                        disabled={item.quantity > 4}
                        onClick={() => update(index, item.quantity + 1, item)}
                      />
                    </div>

                    {item.item.discount === 0 ? (
                      <div className="cart__price">{`$${item.item.price}`}</div>
                    ) : (
                      <div className="cart__price">{`$${getRealPrice(item.item.price, item.item.discount)}`}</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="cart__list_container">
                  <div className="cart__item">
                    <div className="cart__content">
                      <button
                        type="button"
                        aria-label="Delete"
                        className="cart__button"
                        onClick={() => remove(index)}
                      />
                      <img
                        className="cart__image"
                        src={item.item.imageUrl
                          .split('phones').join('products')}
                        alt={`${item.item.id}`}
                      />
                      <h4 className="cart__subtitle">{item.item.name}</h4>
                    </div>
                    <div className="cart__amount">
                      <div className="cart__quantity">
                        <button
                          type="button"
                          aria-label="Remove"
                          className={classNames(
                            'cart__changeAmount cart__remove',
                            {
                              'cart__changeAmount--disabled':
                              item.quantity < 2,
                            },
                          )}
                          disabled={item.quantity < 2}
                          onClick={() => update(index, item.quantity - 1, item)}
                        />

                        <div className="cart__number">
                          {item.quantity}
                        </div>

                        <button
                          type="button"
                          aria-label="Add"
                          className={classNames(
                            'cart__changeAmount cart__add',
                            {
                              'cart__changeAmount--disabled':
                              item.quantity > 4,
                            },
                          )}
                          disabled={item.quantity > 4}
                          onClick={() => update(index, item.quantity + 1, item)}
                        />
                      </div>

                      {item.item.discount === 0 ? (
                        <div className="cart__price">{`$${item.item.price}`}</div>
                      ) : (
                        <div className="cart__price">{`$${getRealPrice(item.item.price, item.item.discount)}`}</div>
                      )}
                    </div>
                  </div>
                  <div className="cart__list_loader">
                    <Loader />
                  </div>
                </div>
              )
            ))}
          </div>
          <div className="cart__checkout">
            <h2 className="cart__totalCost">
              {`$${getCost()}`}
            </h2>
            <div className="cart__totalQuantity">
              {`Total for ${getQuantity()} ${getQuantity() === 1 ? 'item' : 'items'}`}
            </div>
            <div className="cart__line" />
            <button
              type="button"
              aria-label="checkout"
              className="cart__mainButton"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {(getCartItemsFromLocaleStorage('toBuy').length === 0 && !isLoading) && (
        <h2 className="cart__title cart__title--error">
          Products not found
        </h2>
      )}
    </div>
  );
};