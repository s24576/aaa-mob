import { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = process.env.BACKEND_ADDRESS;

const useAxios = () => {
  const instance = axios.create({
    baseURL,
  });

  return [];
};

export default useAxios;
