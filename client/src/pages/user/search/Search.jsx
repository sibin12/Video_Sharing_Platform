import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../../../components/user/card/Card";

import { videoInstance } from "../../../utils/axios";

const Container = styled.div`
display: flex;
justify-content: space-around;
margin: 50px 0;
flex-wrap:wrap;
`

const Search = () => {
  const [videos, setVideos] = useState([]);
  const query = useLocation().search;

  useEffect(() => {
  
     videoInstance.get(`/search${query}`)
     .then((res)=>{
        console.log(res.data,"search results");
         setVideos(res.data);
     })
    
  }, [query]);

  return <Container>
    {videos.map(video=>(
      <Card key={video._id} video={video}/>
    ))}
  </Container>;
};

export default Search;