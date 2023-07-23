import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { environment } from "./environment";
import axios from "axios";
import { categories } from "./categories";
import loader from "./assets/loader.gif";

export interface Quote {
  category: string;
  quote: string;
  author: string;
}

function App() {
  const [category, setCategory] = useState("");
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getQuotes = useCallback(() => {
    setIsLoading(true);
    const randomCategory = getRandomCategory();
    setCategory(randomCategory);
    const url = `${environment.baseUrl}/quotes?category=${randomCategory}`;

    if (randomCategory) {
      axios
        .get(url, { headers: { "X-Api-Key": environment.apiKey } })
        .then((res) => {
          const quotes: Array<Quote> = res.data;
          if (quotes.length) {
            const quote = quotes[0];
            setCategory(quote.category);
            setQuote(quote.quote);
            setAuthor(quote.author);
            setIsLoading(false);
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    getQuotes();
  }, [getQuotes]);

  const getRandomCategory = () => {
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    return selectedCategory;
  };

  return (
    <div className="wrapper">
      <div className="main">
        <div className="main-body">
          <div className="title">
            <span>Quote - {category}</span>
          </div>
          <div className="quote">
            {!isLoading ? (
              <div className="content">
                <div className="message">
                  <p>{quote}</p>
                </div>
                <div className="author">
                  <div className="line">
                    <hr />
                  </div>
                  <div>
                    <span>{author}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="loader">
                <img src={loader} alt="loader"></img>
              </div>
            )}
          </div>
          <div className="generateQuote">
            <button onClick={() => getQuotes()}>Generate Quote</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
