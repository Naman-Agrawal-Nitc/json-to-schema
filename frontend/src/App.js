import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [jsonSchema, setJsonSchema] = useState(null);
    const [error, setError] = useState(null);
    const [leftWidth, setLeftWidth] = useState(50); // initial width of left panel in percentage
    const containerRef = useRef(null);

    const handleConvert = async () => {
        try {
            setError(null);
            const parsedJson = JSON.parse(jsonInput);
            const response = await axios.post('/convert', parsedJson, {
                headers: { 'Content-Type': 'application/json' },
            });
            setJsonSchema(response.data);
        } catch (err) {
            setError('Invalid JSON or server error');
            setJsonSchema(null);
        }
    };

    const handleMouseMove = (e) => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const newLeftWidth = (e.clientX / containerWidth) * 100; // calculate new width in percentage
            setLeftWidth(newLeftWidth); // update the width of the left panel
        }
    };

    const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = () => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="app">
            <header className="header">
                <h2>JSON to JSON Schema Converter</h2>
            </header>
            <div className="editor-container" ref={containerRef}>
                <div className="editor-section" style={{ width: `${leftWidth}%` }}>
                    <h3>JSON Input</h3>
                    <textarea
                        className="editor-textarea"
                        placeholder="Paste JSON here"
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                    />
                    <button className="convert-button" onClick={handleConvert}>
                        Convert to JSON Schema
                    </button>
                    {error && <p className="error-message">{error}</p>}
                </div>
                <div className="divider" onMouseDown={handleMouseDown}></div>
                <div className="editor-section" style={{ width: `${100 - leftWidth}%` }}>
                    <h3>Generated JSON Schema</h3>
                    <pre className="editor-output">
                        {jsonSchema ? JSON.stringify(jsonSchema, null, 2) : 'Schema will appear here...'}
                    </pre>
                </div>
            </div>
        </div>
    );
}

export default App;
