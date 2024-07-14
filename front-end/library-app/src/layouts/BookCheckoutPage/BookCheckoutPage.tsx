import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";
import ReviewRequestModel from "../../models/ReviewRequestModel";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { StarsReview } from "../utils/StartReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviws } from "./LatestReviews";

export const BookCheckoutPage = () => {
    const { authState } = useOktaAuth();
    const history = useHistory();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review state

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);
    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // Loans Count state
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] =
    useState(true);

    // is Book Check Out?

    const [isCheckedOut, setIsCheckOut] = useState(false);
    const [isBookLoading, setIsBookLoading] = useState(true);

    const bookId = window.location.pathname.split("/")[2];


    useEffect(() => {
        if (!authState?.isAuthenticated) {
            history.push("/login"); // Redirect to login if not authenticated
        }
    }, [authState, history]);

    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;

            const responce = await fetch(baseUrl);

            if (!responce.ok) {
                throw new Error("Something went wrong with Books");
            }

            const responceJson = await responce.json();

            const loadedBook: BookModel = {
                id: responceJson.id,
                title: responceJson.title,
                author: responceJson.author,
                description: responceJson.description,
                copies: responceJson.copies,
                copiesAvailable: responceJson.copiesAvailable,
                category: responceJson.category,
                img: responceJson.img,
            };

            setBook(loadedBook);
            setIsLoading(false);
        };

        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        });
    }, [isCheckedOut]);

    useEffect(() => {
        const fetchBookReview = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;
            const responceReviews = await fetch(reviewUrl);

            if (!responceReviews.ok) {
                throw new Error("Something went wrong with Reviews");
            }

            const responceJsonReviews = await responceReviews.json();

            const responceData = responceJsonReviews._embedded.reviews;

            const loadReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;

            for (const key in responceData) {
                loadReviews.push({
                    id: responceData[key].id,
                    userEmail: responceData[key].userEmail,
                    date: responceData[key].date,
                    rating: responceData[key].rating,
                    book_id: responceData[key].bookId,
                    reviewDescription: responceData[key].reviewDescription,
                });
                weightedStarReviews += responceData[key].rating;
            }

            if (loadReviews.length > 0) {
                const averageRating = weightedStarReviews / loadReviews.length;
                const roundedAverage = (Math.round(averageRating * 2) / 2).toFixed(1);
                setTotalStars(Number(roundedAverage));
            }

            setReviews(loadReviews);
            setIsLoadingReview(false);
        };

        fetchBookReview().catch((err: any) => {
            setIsLoadingReview(false);
            setHttpError(err.message);
        });
    }, [isReviewLeft]);


    useEffect(() => {
        const fetchUserReviewBook = async () => {
            if(authState && authState.isAuthenticated){
                const url = `http://localhost:8080/api/reviews/secure/user/book?bookId=${bookId}`;

                const requestOptions = {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type": "application/json"
                    }
                }

                const userReview = await fetch(url, requestOptions);

                if(!userReview.ok){
                    throw new Error("Something went wrong with Book Review");
                }

                const userReviewJson = await userReview.json();

                setIsReviewLeft(userReviewJson);
                setIsLoadingUserReview(false);
            }
        }

        fetchUserReviewBook().catch((err:any) =>{
            setIsLoadingUserReview(false);
            setHttpError(err.message);
        })

    },[authState])

    useEffect(() => {
        const fetchUsersCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/books/secure/currentloans/count`;
                const requestOptions = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type": "application/json",
                    },
                };

                const currentLoansCountResponce = await fetch(url, requestOptions);

                if (!currentLoansCountResponce.ok) {
                    throw new Error("Something went wrong with Loans");
                }

                const currentLoansCountResponceJson =
                    await currentLoansCountResponce.json();

                setCurrentLoansCount(currentLoansCountResponceJson);
            }

            setIsLoadingCurrentLoansCount(false);
        };

        fetchUsersCurrentLoansCount().catch((err: any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(err.message);
        });
    }, [authState, isCheckedOut]);


    useEffect(() => {
        const fetchUserCheckOutBook = async () => {
            if(authState && authState.isAuthenticated){
                const url = `http://localhost:8080/api/books/secure/ischeckedout/byuser?bookId=${bookId}`;
                const requestOptions = {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': "application/json"
                    }
                }

                const bookCheckedOut = await fetch(url, requestOptions);

                if(!bookCheckedOut.ok){
                    throw new Error("Something went wrong with Checkout");
                }

                const bookCheckOutResponceJson = await bookCheckedOut.json();

                setIsCheckOut(bookCheckOutResponceJson);
            }

            setIsBookLoading(false);

        }

        fetchUserCheckOutBook().catch(err => {
            setIsBookLoading(false);
            setHttpError(err.message);
        })
    },[authState]);

    if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isBookLoading || isLoadingUserReview) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }


    const checkOutBook = async () => {
        const url = `http://localhost:8080/api/books/secure/checkout?bookId=${book?.id}`
        const requestOptions = {
            method: "PUT",
            headers : {
                "Authorization": `Bearer ${authState?.accessToken?.accessToken}`,
                "Content-Type": "application/json"
            }
        }

        const checkOutResponce = await fetch(url, requestOptions);

        if(!checkOutResponce.ok){
            throw new Error("Something went wrong with Checkout(1)");
        }

        setIsCheckOut(true);
    }


    const submitReview = async (starInput: number, reviewDescription:string) => {
        let bookId: number = 0;

        if(book?.id){
            bookId = book.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput,bookId,reviewDescription);

        const url = `http://localhost:8080/api/reviews/secure`;

        const requestOptions = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authState?.accessToken?.accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reviewRequestModel)
        }

        const returnResponce = await fetch(url, requestOptions);

        if(!returnResponce.ok){
            throw new Error("Something went wrong with submit review");
        }

        setIsReviewLeft(true);
    }

    return (
        <div>
            <div className="container d-none d-lg-block">
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {book?.img ? (
                            <img src={book?.img} width="266" height="349" alt="Book" />
                        ) : (
                                <img
                                    src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
                                    width="266"
                                    height="349"
                                    alt="Book"
                                />
                            )}
                    </div>
                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox
                        book={book}
                        mobile={false}
                        currentLoansCount={currentLoansCount}
                        isAuthenticated ={authState?.isAuthenticated}
                        isCheckedOut={isCheckedOut}
                        checkOutBook={checkOutBook}
                        isReviewLeft={isReviewLeft}
                        submitReview={submitReview}
                    />
                </div>
                <hr />
                <LatestReviws reviews={reviews} bookId={book?.id} mobile={false} />
            </div>

            {/* Mobile Version */}
            <div className="container d-lg-none mt-5">
                <div className="d-flex justify-content-center align-items-center">
                    {book?.img ? (
                        <img src={book?.img} width="266" height="349" alt="Book" />
                    ) : (
                            <img
                                src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
                                width="266"
                                height="349"
                                alt="Book"
                            />
                        )}
                </div>
                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarsReview rating={4.5} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox
                    book={book}
                    mobile={true}
                    currentLoansCount={currentLoansCount}
                    isAuthenticated ={authState?.isAuthenticated}
                    isCheckedOut={isCheckedOut}
                    checkOutBook={checkOutBook}
                    isReviewLeft={isReviewLeft}
                    submitReview={submitReview}
                />
                <hr />
                <LatestReviws reviews={reviews} bookId={book?.id} mobile={true} />
            </div>
        </div>
    );
};
