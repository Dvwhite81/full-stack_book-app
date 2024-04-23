import axios from 'axios';

const baseUrl = 'https://www.googleapis.com/books/v1/volumes?q=';

const searchBooks = async (searchTerm: string) => {
  const response = await axios.get(baseUrl + searchTerm + '&limit=20');
  console.log('RESPONSE:', response);
  const { data } = response;
  console.log('DATA:', data);
  const { items } = data;
  console.log('ITEMS:', items);

  if (items.length > 0) {
    return {
      success: true,
      books: items,
    };
  } else {
    return {
      success: false,
      message: 'No books found',
    };
  }
};

export default {
  searchBooks,
};
