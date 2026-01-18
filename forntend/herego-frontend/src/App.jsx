import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import "./App.css";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const chatEndRef = useRef(null);
  const webcamRef = useRef(null);
  const recognitionRef = useRef(null);

  // Scroll chat to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Initialize speech recognition once
  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "en-US";
      recognitionRef.current = recognition;
    }
  }, []);

  // 🎤 Voice recognition
  const startListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert("Speech Recognition not supported");
      return;
    }

    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setMessage(spokenText);
      sendMessage(spokenText);
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
    };
  };

  // 💬 Send text or voice message
  const sendMessage = async (msgText = null) => {
    const textToSend = msgText ?? message;
    if (!textToSend.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!response.ok) throw new Error("Backend error");
      const data = await response.json();

      // Simulate typing delay
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
        speakResponse(data.reply);
        setLoading(false);
      }, 700);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error. Try again." },
      ]);
      setLoading(false);
    }
  };

  // 🔊 Bot text-to-speech
  const speakResponse = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  // 📷 Capture image from webcam
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) sendImageToBackend(imageSrc);
  };

  // 📁 Upload image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => sendImageToBackend(reader.result);
    reader.readAsDataURL(file);
  };

  // 🖼 Send image to backend
  const sendImageToBackend = async (imageSrc) => {
    setLoading(true);
    setShowPopup(false);
    try {
      const response = await fetch("http://127.0.0.1:8000/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSrc }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
      speakResponse(data.reply);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error processing image" },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <h1>🤖 AI Chatbot</h1>

      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot typing">Typing...</div>}
        <div ref={chatEndRef}></div>
      </div>

      <div className="input-area">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type, speak, or send image..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <button onClick={() => sendMessage()} disabled={loading || !message}>
          Send
        </button>
        <button onClick={startListening} disabled={loading}>
          🎤
        </button>
      </div>

      {/* Floating plus button */}
      <button className="plus-btn" onClick={() => setShowPopup(!showPopup)}>
        +
      </button>

      {/* Popup panel */}
      {showPopup && (
        <div className="popup-panel">
          <h3>Upload / Capture Image</h3>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={250}
          />
          <div className="popup-buttons">
            <button onClick={captureImage}>📸 Capture</button>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
          <button className="close-btn" onClick={() => setShowPopup(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
