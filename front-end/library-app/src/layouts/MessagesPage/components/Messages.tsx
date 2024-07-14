import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import MessageModel from "../../../models/MessageModel";
import { Pagination } from "../../utils/Pagination";

export const Messages = () => {
  const { authState } = useOktaAuth();
  const [isLoadingMessage, setIsLoadingMessages] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // Messages
  const [messages, setMessages] = useState<MessageModel[]>([]);

  // Pagination
  const [messagesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUserMessages = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `http://localhost:8080/api/messages/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=${messagesPerPage}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const messagesResponce = await fetch(url, requestOptions);

        if (!messagesResponce) {
          throw new Error("Something went wrong with messages");
        }

        const messagesReponsceJson = await messagesResponce.json();

        setMessages(messagesReponsceJson._embedded.messages);
        setTotalPages(messagesReponsceJson.page.totalPages);
      }

      setIsLoadingMessages(false);
    };

    fetchUserMessages().catch((err: any) => {
      setIsLoadingMessages(false);
      setHttpError(err.message);
    });

    window.scrollTo(0, 0);
  }, [authState, currentPage]);

  if (isLoadingMessage) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mt-2">
      {messages.length > 0 ? (
        <>
          <h5>Current Q/A:</h5>
          {messages.map((message) => (
            <div key={message.id}>
              <div className="card mt-2 shadow p-3 bg-body rounded">
                <h5>
                  Case #{message.id}: {message.title}
                </h5>
                <h6>{message.userEmail}</h6>
                <p>{message.question}</p>
                <hr />
                <div>
                  <h5>Responce</h5>
                  {message.response && message.adminEmail ? (
                    <>
                      <h6>{message.adminEmail} (admin)</h6>
                      <p>{message.response}</p>
                    </>
                  ) : (
                    <p>
                      <i>
                        Pending responce from administration. Please be patient
                      </i>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <h5>All quesitons you submit will be shown here</h5>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPage={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};
