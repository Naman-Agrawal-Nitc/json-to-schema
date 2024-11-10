import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [jsonSchema, setJsonSchema] = useState(null);
    const [error, setError] = useState(null);
    const [leftWidth, setLeftWidth] = useState(50); // initial width of left panel in percentage
    const [isEditable, setIsEditable] = useState(false); // new state for editable mode
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
              // Display specific error message if present
              if (err.response) {
                  // Server responded with a status other than 2xx
                  setError(err.response.data?.error || 'An error occurred on the server');
              } else if (err.request) {
                  // Request was made but no response received
                  setError('No response from the server');
              } else {
                  // Something went wrong in setting up the request
                  setError('Json structure is not correct');
              }
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

    const handleModify = () => {
        setIsEditable((prev) => !prev); // toggle editable state
    };

    const handleSchemaChange = (e) => {
        const updatedSchema = e.target.value;
        try {
            setJsonSchema(JSON.parse(updatedSchema)); // update schema when user modifies it
        } catch (err) {
            setError('Invalid JSON');
        }
    };

    const handleCopy = () => {
        const schemaToCopy = isEditable
            ? JSON.stringify(jsonSchema, null, 2) // Editable schema
            : JSON.stringify(jsonSchema, null, 2); // Locked schema (same format as editable for copying)

        navigator.clipboard.writeText(schemaToCopy)
            .then(() => {
                alert('JSON Schema copied to clipboard!');
            })
            .catch((err) => {
                alert('Failed to copy schema: ' + err);
            });
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
                    <div className="button-group">
                        <button className="convert-button" onClick={handleConvert}>
                            Convert to JSON Schema
                        </button>
                        <button className="copy-button" onClick={handleCopy}>
                            Copy Schema
                        </button>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                </div>
                <div className="divider" onMouseDown={handleMouseDown}></div>
                <div className="editor-section" style={{ width: `${100 - leftWidth}%` }}>
                    <h3>Generated JSON Schema</h3>
                    <button className="modify-button" onClick={handleModify}>
                        {isEditable ? 'Lock Schema' : 'Modify Schema'}
                    </button>
                    {isEditable ? (
                        <textarea
                            className="editor-textarea"
                            value={JSON.stringify(jsonSchema, null, 2)}
                            onChange={handleSchemaChange}
                        />
                    ) : (
                        <pre className="editor-output">
                            {jsonSchema ? JSON.stringify(jsonSchema, null, 2) : 'Schema will appear here...'}
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
