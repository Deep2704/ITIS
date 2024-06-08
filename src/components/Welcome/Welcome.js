import React, { useState, useEffect } from 'react';
import axios from 'axios';
import welcomeStyle from './Welcome.module.css';
import { useNavigate } from 'react-router-dom';

const Welcome = ({ user, setUserState }) => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [file, setFile] = useState(null);
  const [cover, setCover] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://127.0.0.1:5000/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
        setUserState(res.data);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
        navigate('/login', { replace: true });
      });
    } else {
      setLoading(false);
      navigate('/login', { replace: true });
    }
  }, [navigate, setUserState]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://127.0.0.1:5000/books', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
        setBooks(res.data);
      }).catch(err => {
        console.error(err);
        navigate('/login', { replace: true });
      });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const searchHandler = (e) => {
    e.preventDefault();
    axios.get(`http://127.0.0.1:5000/books/search?q=${search}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      setBooks(res.data);
    }).catch(err => {
      console.error(err);
    });
  };

  const addBookHandler = (e) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('file', file);
    formData.append('cover', cover);

    axios.post('http://127.0.0.1:5000/add-book', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      console.log(res.data);
      alert('Book added successfully');
      setIsUploading(false);
      setTitle('');
      setAuthor('');
      setFile(null);
      setCover(null);
      setBooks([...books, res.data]);
      setShowAddBook(false);
    }).catch(err => {
      console.error(err);
      alert('Failed to add book');
      setIsUploading(false);
    });
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <div className={welcomeStyle.container}>
      <aside className={welcomeStyle.sidebar}>
        <div className={welcomeStyle.sidebarHeader}>
          <h2>Libraro</h2>
          <div className={welcomeStyle.userInfo}>
            <div className={welcomeStyle.userAvatar}></div>
            <div>
              <p>{user.fname} {user.lname}</p>
              <span>Online</span>
            </div>
          </div>
        </div>
        <nav className={welcomeStyle.nav}>
          <button className={welcomeStyle.navItem} onClick={() => setShowAddBook(false)}>Books</button>
          {user.is_admin && (
            <button className={welcomeStyle.navItem} onClick={() => setShowAddBook(true)}>Add Book</button>
          )}
          <button className={welcomeStyle.navItem} onClick={logout}>Logout</button>
        </nav>
      </aside>
      <main className={welcomeStyle.mainContent}>
        <div className={welcomeStyle.searchSection}>
          <div className={welcomeStyle.searchContainer}>
            <form onSubmit={searchHandler} className={welcomeStyle.searchForm}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className={welcomeStyle.searchInput}
              />
              <button type="submit" className={welcomeStyle.searchButton}>
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
        </div>
        {showAddBook ? (
          <section className={welcomeStyle.adminSection}>
            <h2>Add Book</h2>
            <form onSubmit={addBookHandler} className={welcomeStyle.form}>
              <div className={welcomeStyle.formGroup}>
                <label className={welcomeStyle.formLabel}>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className={welcomeStyle.formInput}
                />
              </div>
              <div className={welcomeStyle.formGroup}>
                <label className={welcomeStyle.formLabel}>Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  className={welcomeStyle.formInput}
                />
              </div>
              <div className={welcomeStyle.formGroup}>
                <label className={welcomeStyle.formLabel}>File</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                  className={welcomeStyle.formInput}
                />
              </div>
              <div className={welcomeStyle.formGroup}>
                <label className={welcomeStyle.formLabel}>Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setCover(e.target.files[0])}
                  required
                  className={welcomeStyle.formInput}
                />
              </div>
              <button
                type="submit"
                disabled={isUploading}
                className={welcomeStyle.formButton}
              >
                {isUploading ? 'Uploading...' : 'Add Book'}
              </button>
            </form>
          </section>
        ) : (
          <section className={welcomeStyle.booksSection}>
            <div className={welcomeStyle.booksList}>
              {books.map(book => (
                <div key={book.id} className={welcomeStyle.bookItem}>
                  <img src={book.cover_url} alt={book.title} className={welcomeStyle.bookCover} />
                  <div className={welcomeStyle.bookDetails}>
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    <a href={book.file_url} download className={welcomeStyle.downloadButton}>Download</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Welcome;
