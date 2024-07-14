import { ReturnBook } from "./ReturnBook";
import { useState, useEffect } from "react";
import BookModel from "../../../models/BookModel";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { Link } from "react-router-dom";

export const Carousel = () => {
  const [books, setBooks] = useState<BookModel[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [httpError, setHttpError] = useState(null);

  useEffect(() => {
    const fetchHooks = async () => {
      const baseUrl: string = "http://localhost:8080/api/books";

      const url: string = `${baseUrl}?page=0&size=9`;

      const responce = await fetch(url);

      if (!responce.ok) {
        throw new Error("Something went wrong!");
      }

      const responceJson = await responce.json();

      const responceData = responceJson._embedded.books;

      const loadedBooks: BookModel[] = [];

      for (const key in responceData) {
        loadedBooks.push({
          id: responceData[key].id,
          title: responceData[key].title,
          author: responceData[key].author,
          description: responceData[key].description,
          copies: responceData[key].copies,
          copiesAvailable: responceData[key].copiesAvailable,
          category: responceData[key].category,
          img: responceData[key].img,
        });
      }

      setBooks(loadedBooks);
      setIsLoading(false);
    };

    fetchHooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ height: 550 }}>
      <div className="homepage-carousel-title">
        <h3>Find your next "I stayed up too late reading" book</h3>
      </div>
      <div
        id="carouselExampleControls"
        className="carousel carousel-dark slide mt-5"
        data-bs-interval="false"
      >
        {/* Desktop Carousel */}
        <div className="carousel-inner d-none d-lg-block">
          <div className="carousel-item active">
            <div className="row d-flex justify-content-center align-items-center">
              {books.slice(0, 3).map((book) => (
                <ReturnBook book={book} key={book.id} />
              ))}
            </div>
          </div>

          <div className="carousel-item">
            <div className="row d-flex justify-content-center align-items-center">
              {books.slice(3, 6).map((book) => (
                <ReturnBook book={book} key={book.id} />
              ))}
            </div>
          </div>

          <div className="carousel-item">
            <div className="row d-flex justify-content-center align-items-center">
              {books.slice(6, 9).map((book) => (
                <ReturnBook book={book} key={book.id} />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className="d-lg-none mt-3">
          <div className="row d-flex justify-content-center align-items-center">
            <ReturnBook book={books[7]} key={books[7].id} />
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>

        {/* View More Button */}
        <div className="homepage-carousel-title mt-3">
          <Link className="btn btn-outline-secondary btn-lg" to="/search">
            View more
          </Link>
        </div>
      </div>
    </div>
  );
};
