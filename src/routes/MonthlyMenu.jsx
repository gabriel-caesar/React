import { useEffect, useState, useRef } from 'react';
import { LuCroissant, LuSandwich, LuCakeSlice } from 'react-icons/lu';
import { TbCakeRoll } from 'react-icons/tb';
import { useOutletContext } from 'react-router-dom';
import { IoMdClose, IoIosArrowDown } from 'react-icons/io';
import logoWhite from '../assets/blackMagic-white-logo.png';
import pastriesInTrayPhoto from '../assets/pastriesInTraysPhoto.jpg';
import '../css/monthlymenu.css';

function MonthlyMenu() {
  const { month, isAdmin } = useOutletContext();

  const [openCategoryForm, setOpenCategoryForm] = useState(false);

  const [openCategoryList, setOpenCategoryList] = useState('');

  const [error, setError] = useState('');

  const [menu, setMenu] = useState([]);

  useEffect(() => {
    setError('');
  }, [openCategoryForm]);

  return (
    <div className='bg-gray-950 w-full h-auto flex flex-col justify-center items-center transition-all relative overflow-x-hidden overflow-y-auto'>
      <img
        src={pastriesInTrayPhoto}
        alt='pastries-in-trays'
        className='w-full h-auto opacity-70'
      />

      <h1 className='text-lime-400 text-3xl font-bold fontCinzel w-3/4 my-20 border-b-2 pb-2'>
        {month.toUpperCase()} MENU
      </h1>

      {isAdmin && (
        <div
          className={`border-2 fontCinzel font-bold mb-20 rounded-md transition-all duration-500 
          ${
            openCategoryForm
              ? `w-102 ${error ? 'h-100' : 'h-90'} border-gray-100 flex flex-col justify-start items-center`
              : 'w-25 h-12 text-center border-transparent bg-gray-100 text-gray-950 hover:bg-gray-950 hover:text-gray-100 hover:border-gray-100 hover:cursor-pointer'
          }`}
          onClick={() => setOpenCategoryForm(!openCategoryForm)}
        >
          {openCategoryForm ? (
            <AddCategoryForm
              setMenu={setMenu}
              menu={menu}
              setError={setError}
              error={error}
              setOpenCategoryForm={setOpenCategoryForm}
              openCategoryForm={openCategoryForm}
            />
          ) : (
            'Add Category'
          )}
        </div>
      )}

      <CategoryDrawer
        menu={menu}
        setMenu={setMenu}
        openCategoryList={openCategoryList}
        setOpenCategoryList={setOpenCategoryList}
        isAdmin={isAdmin}
        error={error}
        setError={setError}
      />
    </div>
  );
}

function CategoryDrawer({
  menu,
  setMenu,
  openCategoryList,
  setOpenCategoryList,
  isAdmin,
  error,
  setError,
}) {
  const [openAddPastry, setOpenAddPastry] = useState(false);

  // to create the fade in animation
  const pastryRef = useRef(null);

  // pastry name
  const [pastryName, setPastryName] = useState('');

  // pastry price
  const [pastryPrice, setPastryPrice] = useState('');

  const [windowSize, setWindowSize] = useState(null);

  // states to edit the category list
  const [editCategory, setEditCategory] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedHeight, setEditedHeight] = useState('');
  const [editedIcon, setEditedIcon] = useState('');
  const [editRecentlyAdded, setEditRecentlyAdded] = useState('');

  // main function to create a pastry item
  function createPastry(category) {
    // condition for duplicates
    const duplicate = category.pastries.find((p) => pastryName === p.name);

    // error handling
    if (!pastryName.trim()) {
      setError('Invalid name');
      return;
    } else if (!pastryPrice.trim()) {
      setError('Invalid price');
      return;
    } else if (duplicate) {
      setError('Duplicate pastry');
      return;
    }

    // new pastry object
    const newPastry = {
      name: pastryName,
      price: pastryPrice,
    };

    // updated category pastries array
    const updatedPastries = [...category.pastries, newPastry];

    // updated menu shallow copy
    const updatedMenu = menu.map((c) => ({
      ...c,
      pastries: c.title === category.title ? updatedPastries : c.pastries,
    }));

    // setting the updated value to the menu
    setMenu(updatedMenu);

    // clearing pastry inputs
    setPastryName('');
    setPastryPrice('');

    // closing pastry form
    setOpenAddPastry(false);
  }

  function handleEditClick(category) {
    // code understands which category to enable the edit display
    setEditCategory(category.title);

    // input shows the old value
    setEditedTitle(category.title);
    setEditedHeight(category.height);
    setEditedIcon(category.icon);
    setEditRecentlyAdded(
      category.recentlyAdded === category.title ? category.title : ''
    );
  }

  function editCategoryList(category) {
    const editedCategory = {
      title: editedTitle,
      icon: editedIcon,
      recentlyAdded: editRecentlyAdded,
      height: editedHeight,
      pastries: category.pastries,
    };

    if (!editedTitle.trim()) {
      setError('Invalid title');
      return;
    } else if (!editedHeight.trim()) {
      setError('Invalid list height');
      return;
    }

    // updated menu state
    const updatedMenu = menu.map((c) => {
      if (c.title === category.title) {
        return editedCategory;
      }
      return c;
    });

    // adds new category to the menu
    setMenu(updatedMenu);

    // closes the edit form
    setEditCategory('');

    // clearing error code
    setError('');
  }

  // smooth fade-in animation for the add pastry form when opened
  useEffect(() => {
    if (pastryRef.current) {
      setTimeout(() => {
        pastryRef.current.style.opacity = openAddPastry ? '100%' : '0%';
      }, 300);
    }
  }, [openAddPastry]);

  // keeping track with the up to date window size
  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    // Set initial value immediately
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      id='menu-background-container'
      className='w-full flex flex-col items-center justify-center mb-20'
    >
      {menu.length > 0 ? (
        menu.map((category) => (
          <div
            id='category-list-which-expands-container'
            key={category.title}
            className={`
              bg-gray-100 w-2/4 flex flex-col justify-start items-center rounded-md mb-6 shadowing transition-all duration-300 overflow-hidden
              ${editCategory === category.title && 'border-lime-400 border-5'}
              `}
            style={{
              height:
                openCategoryList === category.title
                  ? `${category.height}rem`
                  : '3.5rem',
            }}
          >
            {editCategory === category.title && (
              <h1
                id='edit-header'
                className='fontCinzel font-bold text-2xl text-center border-b-2'
              >
                Edit your list
              </h1>
            )}

            <div
              id='category-list-outter-container'
              className={`flex justify-between items-center w-full px-2 ${editCategory === category.title && 'border-b-2'}`}
            >
              <div
                id='arrow-icon-title-wrapper-container'
                className={`flex items-center justify-between text-3xl fontCinzel font-bold px-2 w-full`}
                style={{
                  flexDirection:
                    window.innerWidth <= 555 && editCategory === category.title
                      ? 'column'
                      : 'row',
                }}
              >
                <div
                  id='icon-title-container'
                  className={`flex justify-center items-center ${editCategory === category.title && 'flex-col mb-4'}`}
                >
                  {editCategory === category.title ? (
                    <ul id='icon-category' className='mt-4 mr-2'>
                      <button
                        type='button'
                        className={`border-2 rounded-md text-4xl hover:cursor-pointer transition-all duration-300 active:opacity-30
                      ${
                        editedIcon === 'croissant'
                          ? 'bg-lime-400 text-gray-950 border-gray-950'
                          : 'text-gray-950 hover:bg-gray-100 hover:border-lime-400 hover:text-gray-950'
                      }`}
                        onClick={() => {
                          setEditedIcon(
                            editedIcon === 'croissant' ? '' : 'croissant'
                          );
                        }}
                      >
                        <LuCroissant />
                      </button>

                      <button
                        type='button'
                        className={`border-2 rounded-md text-4xl hover:cursor-pointer transition-all duration-300 mx-2
                      ${
                        editedIcon === 'sandwich'
                          ? 'bg-lime-400 text-gray-950 border-gray-950'
                          : 'text-gray-950 hover:bg-gray-100 hover:border-lime-400 hover:text-gray-950'
                      }`}
                        onClick={() => {
                          setEditedIcon(
                            editedIcon === 'sandwich' ? '' : 'sandwich'
                          );
                        }}
                      >
                        <LuSandwich />
                      </button>

                      <button
                        type='button'
                        className={`border-2 rounded-md text-4xl hover:cursor-pointer transition-all duration-300 mr-2
                      ${
                        editedIcon === 'cakeSlice'
                          ? 'bg-lime-400 text-gray-950 border-gray-950'
                          : 'text-gray-950 hover:bg-gray-100 hover:border-lime-400 hover:text-gray-950'
                      }`}
                        onClick={() => {
                          setEditedIcon(
                            editedIcon === 'cakeSlice' ? '' : 'cakeSlice'
                          );
                        }}
                      >
                        <LuCakeSlice />
                      </button>

                      <button
                        type='button'
                        className={`border-2 rounded-md text-4xl hover:cursor-pointer transition-all duration-300
                      ${
                        editedIcon === 'cakeRoll'
                          ? 'bg-lime-400 text-gray-950 border-gray-950'
                          : 'text-gray-950 hover:bg-gray-100 hover:border-lime-400 hover:text-gray-950'
                      }`}
                        onClick={() => {
                          setEditedIcon(
                            editedIcon === 'cakeRoll' ? '' : 'cakeRoll'
                          );
                        }}
                      >
                        <TbCakeRoll />
                      </button>
                    </ul>
                  ) : (
                    <span className='mr-2'>
                      {category.icon === 'croissant' ? (
                        <LuCroissant />
                      ) : category.icon === 'sandwich' ? (
                        <LuSandwich />
                      ) : category.icon === 'cakeSlice' ? (
                        <LuCakeSlice />
                      ) : (
                        <TbCakeRoll />
                      )}
                    </span>
                  )}

                  {error}

                  {editCategory === category.title ? (
                    <input
                      value={editedTitle}
                      id='title-input'
                      onChange={(e) => {
                        if (e.target.value.length <= 19) {
                          setEditedTitle(e.target.value);
                        }
                      }}
                      type='text'
                      className='bg-gray-950 text-gray-100 rounded-md px-2 mt-2 font-family-normal w-50'
                    />
                  ) : (
                    <h1 className='mt-1'>{category.title}</h1>
                  )}
                </div>

                {editCategory === category.title && (
                  <div
                    id='list-height-new-item-container'
                    className={`flex justify-between items center w-2/4`}
                  >
                    <input
                      value={editedHeight}
                      onChange={(e) => {
                        if (e.target.value.length <= 4) {
                          setEditedHeight(e.target.value);
                        }
                      }}
                      type='number'
                      id='list-height-input'
                      placeholder='25'
                      className={`
                      bg-gray-950 text-gray-100 w-20 rounded-md transition-all duration-300 px-2 m-auto font-family-normal
                    `}
                    />

                    <label
                      id='recently-added-label'
                      className='flex justify-center items-center'
                    >
                      <input
                        type='checkbox'
                        className='scale-150 mr-2 transition-all duration-300 rounded-md border-none hover:cursor-pointer z-2'
                        id='recently-added-edit-input'
                        onChange={() => {
                          console.log(
                            category.recentlyAdded,
                            editRecentlyAdded
                          );
                          setEditRecentlyAdded(
                            editRecentlyAdded === category.title
                              ? ''
                              : category.title
                          );
                        }}
                      />
                      <p
                        id='recently-added-p'
                        className='font-bold text-2xl font-family-normal text-gray-950'
                      >
                        Recently Added!
                      </p>
                    </label>
                  </div>
                )}

                <div className='flex items-center justify-center'>
                  {category.recentlyAdded === category.title &&
                    !editCategory && (
                      <p className='text-red-600 font-light text-xl mr-2'>
                        New item added!
                      </p>
                    )}
                  <button
                    className='flex items-center justify-center border-2 border-transparent text-2xl rounded-sm hover:cursor-pointer hover:border-gray-950 transition-all duration-300'
                    onClick={() => {
                      setOpenCategoryList(
                        openCategoryList === category.title
                          ? ''
                          : category.title
                      );
                      setOpenAddPastry(false);
                      setEditCategory(false);
                    }}
                  >
                    <IoIosArrowDown
                      className='transition-all duration-300'
                      style={{
                        transform: `rotate(${openCategoryList === category.title ? '-180deg' : '0deg'})`,
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>

            {openCategoryList === category.title && (
              <div className='w-full flex flex-col justify-center items-center overflow-hidden'>
                {isAdmin && !editCategory && (
                  <div
                    id='add-pastry-outter-container'
                    className={`
                bg-gray-950 text-gray-100 border-2 text-center rounded-md transition-all duration-300 flex justify-center items-center mt-4
                  ${
                    openAddPastry
                      ? 'w-full h-20'
                      : 'w-30 h-8 hover:bg-gray-100 hover:text-gray-950 hover:cursor-pointer hover:border-gray-950 border-transparent'
                  }
                `}
                    onClick={() => setOpenAddPastry(true)}
                  >
                    {openAddPastry ? (
                      <div
                        ref={pastryRef}
                        id='add-pastry-form'
                        className=' w-full flex justify-around items-center opacity-0 transition-all duration-300'
                      >
                        <span>
                          <input
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              if (e.target.value.length <= 20) {
                                setPastryName(e.target.value);
                              }
                            }}
                            value={pastryName}
                            id='add-pastry-input'
                            type='text'
                            placeholder='Pastry name...'
                            className='bg-gray-100 text-gray-950 rounded-md p-2 mr-2 transition-all duration-300'
                          />

                          <input
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              if (e.target.value.length <= 5) {
                                setPastryPrice(e.target.value);
                              }
                            }}
                            value={pastryPrice}
                            id='add-price-input'
                            type='number'
                            step='0.01'
                            placeholder='12.99...'
                            className='bg-gray-100 text-gray-950 rounded-md p-2 transition-all duration-300'
                          />
                        </span>

                        <span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenAddPastry(false);
                            }}
                            id='close-pastry-button'
                            className='text-gray-950 fontCinzel text-lg w-20 rounded-md bg-gradient-to-b from-lime-700 to-lime-400 hover:cursor-pointer hover:opacity-50 transition-all duration-300 mr-2'
                          >
                            Close
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              createPastry(category);
                            }}
                            id='create-pastry-button'
                            className='text-gray-950 fontCinzel text-lg w-20 rounded-md bg-gradient-to-b from-lime-700 to-lime-400 hover:cursor-pointer hover:opacity-50 transition-all duration-300'
                          >
                            Create
                          </button>
                        </span>
                      </div>
                    ) : (
                      'Add Pastry'
                    )}
                  </div>
                )}

                {openCategoryList === category.title &&
                  !editCategory &&
                  isAdmin && (
                    <button
                      onClick={() => handleEditClick(category)}
                      className='rounded-md border-2 border-transparent bg-gray-950 text-gray-100 h-8 w-30 mt-4 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-950 hover:border-gray-950 transition-all duration-300'
                    >
                      Edit Category
                    </button>
                  )}

                {editCategory && (
                  <div id='save-delete-container' className='flex'>
                    <button
                      onClick={() => editCategoryList(category)}
                      className='rounded-md border-2 mr-2 border-transparent bg-gray-950 text-gray-100 h-8 w-30 mt-4 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-950 hover:border-gray-950 transition-all duration-300'
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {}}
                      className='rounded-md border-2 border-transparent bg-red-600 text-gray-950 h-8 w-30 mt-4 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-950 hover:border-gray-950 transition-all duration-300'
                    >
                      Delete
                    </button>
                  </div>
                )}

                {category.pastries.length > 0 ? (
                  category.pastries.map((pastry) => (
                    <div
                      id='pastry-container'
                      key={pastry.name}
                      className='w-full bg-transparent rounded-md flex justify-between items-center mt-4 px-4'
                    >
                      <h1 className='text-center fontCinzel text-lg text-gray-950'>
                        {pastry.name}
                      </h1>

                      <hr className='w-3/4' />

                      <p className='text-center fontCinzel text-lg text-gray-950'>
                        ${pastry.price}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className='text-gray-950 text-center text-2xl font-bold fontUncial mt-4'>
                    NO PASTRIES...
                  </p>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <h1 className='text-gray-100 fontCinzel font-bold text-3xl'>
          Empty menu
        </h1>
      )}
    </div>
  );
}

// component to add a menu category
function AddCategoryForm({
  setMenu,
  menu,
  setError,
  error,
  setOpenCategoryForm,
  openCategoryForm,
}) {
  const [recentlyAdded, setRecentlyAdded] = useState('');

  const [selectedIcon, setSelectedIcon] = useState('croissant');

  const [categoryTitle, setCategoryTitle] = useState('');

  const [categoryHeight, setCategoryHeight] = useState('');

  const formRef = useRef(null);

  const errorRef = useRef(null);

  // main function to add a new menu item category
  function createCategory(e) {
    e.preventDefault();

    const newCategory = {
      title: categoryTitle,
      icon: selectedIcon,
      recentlyAdded: recentlyAdded,
      height: categoryHeight,
      pastries: [],
    };

    const duplicate = menu.find((c) => c.title === categoryTitle);

    if (duplicate) {
      setError('Duplicate category');
      return;
    } else if (!categoryTitle.trim()) {
      setError('Invalid title');
      return;
    } else if (!categoryHeight.trim()) {
      setError('Invalid list height');
      return;
    }

    // adds new category to the menu
    setMenu((prev) => [...prev, newCategory]);

    // close form
    setOpenCategoryForm(false);

    // clearing form inputs
    setCategoryTitle('');
    setRecentlyAdded('');

    // clearing error code
    setError('');
  }

  // helps the form to wait for the opening animation to display its content
  useEffect(() => {
    setTimeout(() => {
      formRef.current.style.opacity = openCategoryForm ? '100%' : '0%';
    }, 500);
  }, [openCategoryForm]);

  // waits the form grows to display the error
  useEffect(() => {
    if (errorRef.current) {
      setTimeout(() => {
        errorRef.current.style.opacity = error ? '100%' : '0%';
      }, 500);
    }
  }, [error]);

  return (
    <form
      className='w-full my-10 px-4 rounded-md relative transition-all duration-300 flex opacity-0 flex-col'
      id='add-category-form'
      ref={formRef}
    >
      <img
        src={logoWhite}
        alt='logo'
        id='white-logo'
        className='w-45 absolute -top-3 right-28 text-gray-100 opacity-20 z-1'
      />

      <label id='label-for-title' className='flex flex-col z-2'>
        <span className='w-full flex justify-between items-center mb-2'>
          <p className='font-bold text-2xl fontCinzel text-gray-100'>Title</p>
          <button
            type='button'
            className='text-gray-100 text-3xl hover:cursor-pointer'
            onClick={(e) => {
              e.stopPropagation();
              setOpenCategoryForm(false);
            }}
          >
            <IoMdClose />
          </button>
        </span>
        <input
          value={categoryTitle}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation();
            if (e.target.value.length <= 19) {
              setCategoryTitle(e.target.value);
            }
          }}
          type='text'
          placeholder='Croissants...'
          className='bg-gray-100 rounded-md text-gray-950 text-md transition-all duration-300 w-full py-2 px-4 z-2'
          id='title-input'
        />
      </label>

      <ul id='icon-category' className='mt-6 z-2'>
        <p className='font-bold text-2xl fontCinzel text-gray-100 z-2'>Icon</p>

        <button
          type='button'
          className={`z-2 border-2 rounded-md text-3xl hover:cursor-pointer transition-all duration-300 active:opacity-30
              ${
                selectedIcon === 'croissant'
                  ? 'bg-lime-400 border-gray-100 text-gray-950'
                  : 'text-gray-100 hover:bg-gray-100 hover:border-lime-400 hover:text-gray-950'
              }`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedIcon(selectedIcon === 'croissant' ? '' : 'croissant');
          }}
        >
          <LuCroissant />
        </button>

        <button
          type='button'
          className={`z-2 border-2 rounded-md text-3xl hover:cursor-pointer transition-all duration-300 mx-2
              ${
                selectedIcon === 'sandwich'
                  ? 'bg-lime-400 border-gray-100 text-gray-950'
                  : 'text-gray-100 hover:bg-gray-100 hover:border-lime-400 hover:text-gray-950'
              }`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedIcon(selectedIcon === 'sandwich' ? '' : 'sandwich');
          }}
        >
          <LuSandwich />
        </button>

        <button
          type='button'
          className={`z-2 border-2 rounded-md text-3xl hover:cursor-pointer transition-all duration-300 mr-2
              ${
                selectedIcon === 'cakeSlice'
                  ? 'bg-lime-400 border-gray-100 text-gray-950'
                  : 'text-gray-100 hover:bg-gray-100 hover:border-lime-400 hover:text-gray-950'
              }`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedIcon(selectedIcon === 'cakeSlice' ? '' : 'cakeSlice');
          }}
        >
          <LuCakeSlice />
        </button>

        <button
          type='button'
          className={`z-2 border-2 rounded-md text-3xl hover:cursor-pointer transition-all duration-300
              ${
                selectedIcon === 'cakeRoll'
                  ? 'bg-lime-400 border-gray-100 text-gray-950'
                  : 'text-gray-100 hover:bg-gray-100 hover:border-lime-400 hover:text-gray-950'
              }`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedIcon(selectedIcon === 'cakeRoll' ? '' : 'cakeRoll');
          }}
        >
          <TbCakeRoll />
        </button>
      </ul>

      <label className='text-gray-100 z-2 flex flex-col my-4'>
        List Height
        <input
          value={categoryHeight}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation();
            if (e.target.value.length <= 4) setCategoryHeight(e.target.value);
          }}
          type='number'
          id='list-height-input'
          className={`
            bg-gray-100 w-20 rounded-md transition-all duration-300 text-gray-950 px-2
          `}
        />
      </label>

      <div className='w-full flex justify-between items-center'>
        <label
          className='flex items-center'
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type='checkbox'
            className='scale-150 mr-2 transition-all duration-300 rounded-md border-none hover:cursor-pointer z-2'
            id='recently-added-input'
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              setRecentlyAdded(
                recentlyAdded === categoryTitle ? '' : categoryTitle
              );
            }}
          />
          <p className='font-bold text-2xl fontCinzel text-gray-100 z-2'>
            Recently Added!
          </p>
        </label>
        <button
          className='text-gray-950 fontCinzel text-xl w-30 rounded-md bg-gradient-to-b from-lime-700 to-lime-400 hover:cursor-pointer hover:opacity-50 transition-all duration-300 z-2'
          onClick={(e) => {
            e.stopPropagation();
            createCategory(e);
          }}
        >
          CREATE
        </button>
      </div>

      {error && (
        <span
          id='errorFeedback'
          className='text-center bg-red-500 rounded-md font-light text-2xl p-2 w-full mt-4 z-2 transition-all duration-300 opacity-0'
          ref={errorRef}
        >
          {error}
        </span>
      )}
    </form>
  );
}

export default MonthlyMenu;
