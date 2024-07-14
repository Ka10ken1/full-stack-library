import { useEffect, useState } from "react"
import ReviewModel from "../../models/ReviewModel"
import { Pagination } from "../utils/Pagination";
import { Reviews } from "../utils/Review";
import { SpinnerLoading } from "../utils/SpinnerLoading";

export const ReviewList = () => {

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);


    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPage, setTotalPages] = useState(0);

    const bookId = (window.location.pathname).split("/")[2];

    useEffect(() => {
        const fetchBookReview = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;
            const responceReviews = await fetch(reviewUrl);

            if (!responceReviews.ok) {
                throw new Error("Something went wrong with Reviews");
            }

            const responceJsonReviews = await responceReviews.json();

            const responceData = responceJsonReviews._embedded.reviews;


            setTotalAmountOfReviews(responceJsonReviews.page.totalElements);
            setTotalPages(responceJsonReviews.page.totalPages);


            const loadReviews: ReviewModel[] = [];


            for (const key in responceData) {
                loadReviews.push({
                    id: responceData[key].id,
                    userEmail: responceData[key].userEmail,
                    date: responceData[key].date,
                    rating: responceData[key].rating,
                    book_id: responceData[key].bookId,
                    reviewDescription: responceData[key].reviewDescription,
                });
            }


            setReviews(loadReviews);
            setIsLoading(false);
        };

        fetchBookReview().catch((err: any) => {
            setIsLoading(false);
            setHttpError(err.message);
        });
    }, [currentPage]);


    if(isLoading){
        return <SpinnerLoading/>
    }

    if(httpError){
        return <div className="container m-5">
            <p>{httpError}</p>
        </div>
    }

    // add Pagination
    const indexOfLastReview : number = currentPage * reviewsPerPage;
    const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

    let lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ? reviewsPerPage * currentPage : totalAmountOfReviews;


    const paginate = (pageNumber : number) => setCurrentPage(pageNumber);



    return <div className="container m-5">
        <div>
            <h3>Comments: {reviews.length}</h3>
        </div>
        <p>
            {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
        </p>
        <div className="row">
            {
                reviews.map(review => (
                <Reviews review={review} key={review.id} />
                ))
            }
        </div>

        {
            totalPage > 1 && <Pagination currentPage={currentPage} totalPage={totalPage} paginate={paginate} />
        }
    </div>

}
