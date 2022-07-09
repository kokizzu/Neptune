import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeContainer from './containers/HomeContainer';
import MiniDrawer from './containers/MiniDrawer';
import { Container } from '@mui/material';
import DetailsContainer from './containers/DetailsContainer';
import NotisContainer from './containers/NotisContainer';
import QueryContainer from './containers/QueryContainer';

function App() {
  return (
    <>
      <BrowserRouter>
        <MiniDrawer>
          <Container maxWidth='xl'>
            <Routes>
              <Route path='/' element={<HomeContainer />} />
              <Route path='/details' element={<DetailsContainer />} />
              <Route path='/notis' element={<NotisContainer />} />
              <Route path='/query' element={<QueryContainer />} />
            </Routes>
          </Container>
        </MiniDrawer>
      </BrowserRouter>
    </>
  );
}

export default App;
