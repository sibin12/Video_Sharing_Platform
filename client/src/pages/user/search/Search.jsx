import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../../../components/user/card/Card';
import { videoInstance } from '../../../utils/axios';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr); /* Start with 1 column for small screens */
  gap: 20px;
  justify-content: space-between;
  padding: 20px 20px 20px 20px;
  max-width: 1200px;
  margin: 56px auto;

  @media (min-width: 687px) {
    align-items: center;
    padding: 20px 20px 20px 0px;
    grid-template-columns: repeat(2, 1fr); /* Use 2 columns for screens >= 768px */
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr); /* Use 3 columns for screens >= 992px */
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr); /* Use 4 columns for screens >= 1200px */
  }
`;

const Search = () => {
  const [videos, setVideos] = useState([]);
  const query = useLocation().search;

  useEffect(() => {
    videoInstance.get(`/search${query}`)
      .then((res) => {
        console.log(res.data, "search results");
        setVideos(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [query]);

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Search;
