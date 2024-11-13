import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';
import background from './assets/image/download.jpg';
import chefBot from './assets/image/foodbot.jpg';

const CookingChatbot = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const foodImages = [
    'https://cdn.pixabay.com/photo/2016/12/26/17/28/spaghetti-1932466_640.jpg',
    'https://cdn.pixabay.com/photo/2022/05/11/07/10/porridge-7188630_640.jpg',
    'https://cdn.pixabay.com/photo/2014/10/19/20/59/hamburger-494706_640.jpg',
    'https://cdn.pixabay.com/photo/2014/08/14/14/21/shish-kebab-417994_640.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentImageIndex < foodImages.length - 1) {
        setCurrentImageIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(interval);
        setTimeout(() => setShowIntro(false), 2000); // Wait 2 seconds before transitioning to chatbot
      }
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  const handleSend = async () => {
    if (input) {
      const userMessage = { text: input, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      setIsLoading(true);
      const recipes = await fetchRecipes(input);
      setIsLoading(false);

      const botMessage = recipes.length
        ? `Here are some recipes you can try:\n${recipes
            .map((recipe) => `• ${recipe.title} (${recipe.link})`)
            .join('\n')}`
        : "Sorry, I couldn't find any recipes with those ingredients.";

      setMessages((prevMessages) => [...prevMessages, { text: botMessage, sender: 'bot' }]);
      setInput('');
    }
  };

  const fetchRecipes = async (ingredients) => {
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients`, {
        params: {
          ingredients,
          number: 5,
          apiKey: 'YOUR_API_KEY', // Replace with your API key
        },
      });

      return response.data.map((recipe) => ({
        title: recipe.title,
        link: `https://spoonacular.com/recipes/${recipe.title.replace(/ /g, '-')}-${recipe.id}`,
      }));
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return [];
    }
  };

  return (
    <div>
      {showIntro ? (
        <div
          className="intro-container"
          style={{
            backgroundImage: `url(${foodImages[currentImageIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="intro-text">
            <h1>Welcome to FoodBot!</h1>
            <p>Your personal assistant for delicious recipes. 🍴</p>
          </div>
        </div>
      ) : (
        <div
          className="chatbot-container"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            opacity: 1, // Chatbot is now visible after the intro disappears
            transition: 'opacity 1s ease-in-out', // Smooth transition to make chatbot visible
          }}
        >
          <div className="chatbot-area">
            <div className="chef-bot-container">
              <img src={chefBot} alt="Chef Bot" className="chef-bot" />
              <div className="speech-bubble">
                <p>Hi, I’m your FoodBot! Ask me for delicious recipes!</p>
              </div>
            </div>

            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              {isLoading && <div className="loading-spinner">Loading...</div>}
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., chicken, rice..."
              className="input-field"
            />
            <button className="ask-foodbot-button" onClick={handleSend}>
              Ask FoodBot
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookingChatbot;
