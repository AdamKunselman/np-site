import { URL } from '../../_globals.js';

export function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  const result = urlParams.get(param);
  if(result){
    return result;
  }
  
}

export async function fetchData(urlExt) {
  try {
      const response = await fetch(`${URL}${urlExt}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      window.location.href = `${URL}/error`
    }
}