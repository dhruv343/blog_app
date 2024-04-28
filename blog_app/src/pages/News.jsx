import React, { useState, useEffect } from 'react';
// Import CSS file for custom styling
import { Card, Spinner } from "flowbite-react";

function News() {
  const [news, setNews] = useState([]);
  const [loading,setLoading]=useState(false);

  useEffect(() => {
    const getNews = async () => {
      try {
        setLoading(true)
        const result = await fetch(`http://localhost:3500/api/tech/news`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!result.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await result.json();
        console.log('Fetched news data:', data);
        setNews(data.articles);
        setLoading(false)
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false)
      }
    };

    getNews();
  }, []);
  
  return (
    <div className="containernews min-h-screen">
      <h1 className="news-heading ">Byte-Sized Updates</h1>
      
        {loading?
        <>
          <div className=' flex justify-center items-center' >
          <Spinner className=''  size='xl'/>
          </div>
          
        </>
        :
        <>
        <div className='news-grid'>
        {news && news.map((article, index) => {
          console.log('Current article:', article);
          return (
            <div className="news-card" key={index}>
              {article.urlToImage ? (
                <img src={article.urlToImage} className="news-img" alt={article.title} />
              ) : (
                <div className="news-img-placeholder">Image Not Available</div>
              )}
              <div className="news-details">
                <h2 className="news-title">{article.title}</h2>
                <p className="news-description">{article.description}</p>
                <div className="news-meta">
                  <p className="news-author">Author: {article.author}</p>
                  <p className="published-at">Published At: {article.publishedAt ? new Date(article.publishedAt).toLocaleString() : 'Unknown'}</p>
                </div>
                <a href={article.url} className="read-more-link" target="_blank" rel="noreferrer">
                  Read More
                </a>
              </div>
            </div>
          );
        })}
        </div>
        </>
        }
        
     
    </div>
  );
}

export default News;
