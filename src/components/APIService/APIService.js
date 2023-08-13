const BASE_URL = 'https://pixabay.com';
const APIKEY = '35747658-5cf63d9708f6fa65556d558ab';

export const getImages = async ({ searchQuery, currentPage }) => {
  const response = await fetch(
    `${BASE_URL}/api/?q=${searchQuery}&page=${currentPage}&key=${APIKEY}&image_type=photo&orientation=horizontal&per_page=12`
  );

  if (!response.ok) {
    throw new Error('Smth went wrong');
  }
  return response.json();
};